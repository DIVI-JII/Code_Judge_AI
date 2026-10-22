import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { evaluateCode } from "./src/mockJudge";
import fs from "fs";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize GoogleGenAI client lazily on first use to ensure no crash on startup if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required but missing. Configure it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper to perform Gemini API generateContent calls with robust, transient-error retries and fallback models
async function generateContentWithRetry(client: GoogleGenAI, prompt: string, config: any) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  const maxRetriesPerModel = 3;
  let lastError: any = null;

  for (const model of modelsToTry) {
    let delay = 1000;
    for (let attempt = 1; attempt <= maxRetriesPerModel; attempt++) {
      try {
        console.log(`[Gemini API] Attempt ${attempt} calling model: ${model}`);
        const response = await client.models.generateContent({
          model: model,
          contents: prompt,
          config: config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        console.error(`[Gemini API Error] Attempt ${attempt} failed with model ${model}:`, err.message || err);
        
        // Detailed check for transient status codes or message content indicating rate-limit / capacity issues
        const statusCode = err.status || (err.error && err.error.code);
        const isTransient = 
          statusCode === 503 || 
          statusCode === 429 || 
          statusCode === 500 ||
          (err.message && (
            err.message.includes("503") || 
            err.message.includes("429") || 
            err.message.includes("UNAVAILABLE") ||
            err.message.includes("high demand") ||
            err.message.includes("Resource has been exhausted") ||
            err.message.includes("Overloaded")
          ));
        
        if (isTransient) {
          const is503 = statusCode === 503 || 
            (err.message && (
              err.message.includes("503") || 
              err.message.includes("UNAVAILABLE") || 
              err.message.includes("high demand") || 
              err.message.includes("Overloaded")
            ));
          
          if (is503) {
            console.log(`[Gemini API] Model ${model} is experiencing high demand or unavailable (503). Skipping further retries and transitioning immediately to the next fallback model...`);
            break; // break the attempt loop to try the next model
          }

          const isLastAttemptOfThisModel = (attempt === maxRetriesPerModel);
          if (!isLastAttemptOfThisModel) {
            console.log(`[Gemini API] Transient error detected (${statusCode || 'unknown'}). Retrying same model in ${delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2; // exponential backoff
            continue;
          } else {
            console.log(`[Gemini API] Exhausted ${maxRetriesPerModel} attempts for model ${model}. Transitioning immediately to the next fallback model.`);
            continue;
          }
        }
        
        // If not transient (e.g. fatal schema or logic error), throw the error immediately to fail fast
        throw err;
      }
    }
  }
  throw lastError || new Error("Unknown error calling Gemini API");
}



app.use(express.json({ limit: "15mb" }));

// REST API endpoint to evaluate code using server-side Gemini sandbox simulation
app.post("/api/evaluate", async (req, res) => {
  try {
    const { code, problem, isSubmit, langId } = req.body;
    
    if (!code || !problem) {
      return res.status(400).json({ error: "Missing required parameters: 'code' or 'problem'" });
    }

    const testCases = isSubmit 
      ? [...(problem.publicTestCases || []), ...(problem.hiddenTestCases || [])]
      : (problem.publicTestCases || []);

    if (testCases.length === 0) {
      return res.status(400).json({ error: "Problem does not contain any test cases to evaluate" });
    }

    const isReactOrComplex = problem.id?.startsWith('M') || problem.id?.startsWith('H');
    const isJSorTS = langId === 'javascript' || langId === 'typescript';
    const isLocalCapable = isJSorTS && !isReactOrComplex;

    // Retrieve full rich problem details if available in the database to extract Vitest test specs (it blocks)
    let databaseProblem: any = null;
    try {
      const dbPath = path.join(process.cwd(), "leetcode_challenges_database.json");
      if (fs.existsSync(dbPath)) {
        const dbContent = fs.readFileSync(dbPath, "utf8");
        const db = JSON.parse(dbContent);
        databaseProblem = db.problems?.find((p: any) => p.id === problem.id);
      }
    } catch (e) {
      console.error("Error reading rich database problem details:", e);
    }

    if (!isLocalCapable && process.env.GEMINI_API_KEY) {
      console.log(`[Backend Evaluation] Routing code submission directly to Gemini online simulation engine for problem ${problem.id}.`);
      return await evaluateWithGemini(code, problem, isSubmit, langId, testCases, res, databaseProblem);
    }

    // Try to run the code strictly and natively on our local sandboxed judge first.
    const localEvaluation = evaluateCode(code, problem, isSubmit, langId);
    
    if (localEvaluation.verdict === "Accepted" || localEvaluation.verdict === "Wrong Answer") {
      console.log(`[Backend Evaluation] Local execution succeeded with verdict: ${localEvaluation.verdict}. Returning high-fidelity judge results.`);
      return res.json(localEvaluation);
    }

    // If local execution fails with a preprocessor syntax / translation error (e.g., C++ template resolution),
    // we fall back gracefully to Gemini to dry-run and simulate execution, provided the API key is configured.
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not configured. Returning local execution block results directly.");
      return res.json(localEvaluation);
    }

    console.log(`[Backend Evaluation] Local execution routed via Gemini simulation (Local status: ${localEvaluation.verdict}).`);
    return await evaluateWithGemini(code, problem, isSubmit, langId, testCases, res, databaseProblem);

  } catch (error) {
    console.error("Gemini Evaluation Server Error:", error);
    return res.status(500).json({ 
      error: "Failed to evaluate code through Gemini online sandbox core.", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Helper to dry-run/simulate solution code via Google Gemini model
async function evaluateWithGemini(
  code: string,
  problem: any,
  isSubmit: boolean,
  langId: string,
  testCases: any[],
  res: any,
  databaseProblem?: any
) {
  const client = getGeminiClient();

  let unitTestsPrompt = "";
  if (databaseProblem && databaseProblem.unit_tests) {
    const sampleTests = databaseProblem.unit_tests.sample_tests_code || "";
    const hiddenTests = databaseProblem.unit_tests.hidden_tests_code || "";
    unitTestsPrompt = `
--- DETAILED TESTING SPECIFICATIONS (VITEST SUITE WITH "it" BLOCKS) ---
All test case validations must be mapped and matched strictly against the actual assertions, triggers, and state checks described in these "it" blocks!

Public test case suite:
${sampleTests}

${isSubmit ? `Hidden test case suite:
${hiddenTests}` : ""}
--- END DETAILED TESTING SPECIFICATIONS ---
`;
  }

  const prompt = `You are an ultra-precise, completely objective, and exceptionally strict code execution simulator and compiler/interpreter judge for the programming language: "${langId}".
Your primary duty is to strictly analyze the user's code, mentally dry-run its execution, and diagnose if it is 100% correct, logically sound, and conforming to every specification without skipping any check or being lenient.

--- USER CODE CODESPACE ---
${code}
--- END USER CODE CODESPACE ---

--- PROBLEM CONTEXT ---
Title: ${problem.title}
Difficulty: ${problem.difficulty}
Description: ${problem.description}
Input Format: ${problem.inputFormat}
Output Format: ${problem.outputFormat}
--- END PROBLEM CONTEXT ---
${unitTestsPrompt}
--- TEST CASES TO EXECUTE ---
${JSON.stringify(testCases, null, 2)}
--- END TEST CASES TO EXECUTE ---

CRITICAL DRILL-DOWN GUIDELINES FOR THE DRY-RUN ENGINE:
1. COMPILATION & SYNTAX CHECKS: Check if the user's code has any syntax errors, mismatched brackets, incorrect keywords, or standard compile issues in "${langId}".
   - If yes: Set 'verdict' = "Compilation Error", 'passedCount' = "0/${testCases.length}", populate 'error' with a detailed compiler log, and clear 'stdout'/'failedPublicTest'.
2. RUNTIME CHECKS: Check if running the code in any of the test scenarios would throw a Runtime Error (e.g., segmentation faults, stack overflow during recursion, divide-by-zero, indexing out of bounds, out-of-memory).
   - If yes: Set 'verdict' = "Runtime Error", 'passedCount' = "0/${testCases.length}", populate 'error' with the runtime traceback, and clear 'stdout'/'failedPublicTest'.
3. ACCURACY & LOGIC EXECUTION BLOCK (READ CAREFULLY):
   - You MUST trace the execution of the user's code step-by-step for EACH test case in the "TEST CASES TO EXECUTE" list.
   - Each test case has an "input" string.
     * Some inputs represent formal input arguments (e.g. "[1, [2], [3, 4]]", "3"). Parse them logically, feed them into the user's solver function, trace each statement/variable value, and obtain the return value.
     * Other inputs represent descriptions of "it" blocks from the --- DETAILED TESTING SPECIFICATIONS --- section (e.g. "does not use Array.prototype.flat (structural check)", "arr" representing deep nested array, etc.). You must match the testcase "input" description to its defined triggers, setup, assertions, or constraints inside the Vitest suite, map it to the equivalent execution logic of your current language, and verify if the user's code complies.
   - BE EXTREMELY STRICT AND RUTHLESS:
     * NEVER assume the user's code works. Do not skip or gloss over recursive loops, pointers, arrays, deep nestings, or base cases.
     * If the user's recursion logic has a bug, or is unable to process a 100-level deep array structure, or has incorrect base / boundary checks, or returns incorrect types, that test case MUST FAIL immediately.
     * If the user uses a native feature when forbidden (e.g. using pre-built flat methods when the structural test case verifies they do not), the test case MUST FAIL immediately.
     * If ANY testcase fails to match the expected value down to the exact data structure, type, or bounds, the overall 'verdict' MUST be "Wrong Answer".
   - JSON FIELD SPECIFICATIONS:
     * 'stdout': Clean, short, classical command-line execution logs listing each executed test case and its result (Passed or Failed/Wrong Answer) without any conversational detailing or paragraph analysis/explanations of code execution. For example: "Running test cases...\nTest 1: Passed\nTest 2: Passed\nAll tests passed successfully!"
     * 'verdict': ONE OF 'Accepted', 'Wrong Answer', 'Compilation Error', 'Runtime Error'.
     * 'passedCount': Count of passed test cases over total (e.g. '3/9' or '8/9'). This MUST match the trace results exactly!
     * 'failedPublicTest': Details of the first failed test case. Populate only if verdict is 'Wrong Answer'.`;

  const response = await generateContentWithRetry(client, prompt, {
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        stdout: {
          type: Type.STRING,
          description: "A clean, minimal standard output printout listing each test case result (e.g. Test 1: Passed). Absolutely no conversational explanation, code summary, or paragraph detailing of how it passes."
        },
        verdict: {
          type: Type.STRING,
          description: "Must strictly be one of: 'Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error'."
        },
        passedCount: {
          type: Type.STRING,
          description: "The count of passed test cases over the total number tested (e.g. '3/4' or '0/5'). Must match your trace results exactly."
        },
        error: {
          type: Type.STRING,
          description: "Stderr / compiler trace / interpreter traceback if failed. Empty string otherwise."
        },
        failedPublicTest: {
          type: Type.OBJECT,
          description: "Details of the first test case that failed (only if verdict is 'Wrong Answer').",
          properties: {
            input: { type: Type.STRING },
            expected: { type: Type.STRING },
            actual: { type: Type.STRING }
          },
          required: ["input", "expected", "actual"]
        }
      },
      required: ["stdout", "verdict", "passedCount"]
    },
    temperature: 0.1, // low temperature for highly deterministic code tracing
  });

  const resultText = response.text;
  if (!resultText) {
    throw new Error("No evaluation result returned from Gemini");
  }

  // Sanitize any potential markdown code fence wrappers
  let cleanedText = resultText.trim();
  if (cleanedText.startsWith("```json")) {
    cleanedText = cleanedText.slice(7);
  } else if (cleanedText.startsWith("```")) {
    cleanedText = cleanedText.slice(3);
  }
  if (cleanedText.endsWith("```")) {
    cleanedText = cleanedText.slice(0, -3);
  }
  cleanedText = cleanedText.trim();

  const evaluationResult = JSON.parse(cleanedText);

  // Safeguard against LLM auto-regressive contradictions:
  // If the passed count indicates all test cases passed (e.g. "9/9" or "4/4"), then the verdict MUST be "Accepted".
  if (evaluationResult.passedCount && typeof evaluationResult.passedCount === 'string') {
    const parts = evaluationResult.passedCount.trim().split('/');
    if (parts.length === 2 && parts[0] === parts[1] && parts[0] !== '0') {
      evaluationResult.verdict = 'Accepted';
    }
  }

  if (evaluationResult.verdict === "Accepted") {
    evaluationResult.passedCount = `${testCases.length}/${testCases.length}`;
    if (evaluationResult.failedPublicTest) {
      delete evaluationResult.failedPublicTest;
    }
  } else if (evaluationResult.failedPublicTest) {
    const { input, expected, actual } = evaluationResult.failedPublicTest;
    if (
      !input || !input.trim() || input === "N/A" ||
      !expected || !expected.trim() || expected === "N/A" ||
      !actual || !actual.trim() || actual === "N/A"
    ) {
      delete evaluationResult.failedPublicTest;
    }
  }

  return res.json(evaluationResult);
}

// Setup development server middlewares or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite bundler middleware for dynamic development...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express static site serving for production build...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeJudge AI Full-Stack Server running and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
