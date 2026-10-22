/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');

// Helper to parse assertions from a vitest code block
function parseTests(testCode) {
  const testCases = [];
  if (!testCode) return testCases;

  // Pattern A: expect(fn(input)).toEqual(expected) or .toBe(expected)
  // Let's use it(...) block details or match all expect statements
  // Regex to find "it('...', () => { expect(...)"
  // Or match expect(...) calls
  const itRegex = /it\s*\(\s*["']([^"']+)["']\s*,\s*\(\s*\)\s*=>\s*\{([\s\S]*?)\}\s*\)/g;
  let match;
  let counter = 1;

  while ((match = itRegex.exec(testCode)) !== null) {
    const testName = match[1];
    const testBody = match[2];

    // Try to extract expect(...) content
    // expect(func(...)).toEqual(...)
    const expectRegex = /expect\s*\(\s*([a-zA-Z0-9_]+)\s*\(([\s\S]*?)\)\s*\)\s*\.(?:toEqual|toBe|toStrictEqual)\s*\(\s*([\s\S]*?)\s*\)/;
    const expMatch = expectRegex.exec(testBody);

    let input = "";
    let expected = "";

    if (expMatch) {
      input = expMatch[2].trim();
      expected = expMatch[3].trim();
    } else {
      input = testName;
      expected = "true";
    }

    testCases.push({
      id: `tc-${counter++}`,
      is_hidden: false, // will be set properly later
      input: input,
      expected: expected
    });
  }

  // Fallback if no matching structure found
  if (testCases.length === 0) {
    testCases.push({
      id: 'tc-1',
      is_hidden: false,
      input: 'Default Case',
      expected: 'true'
    });
  }

  return testCases;
}

try {
  const dbPath = path.join(__dirname, 'leetcode_challenges_database.json');
  if (!fs.existsSync(dbPath)) {
    console.error("leetcode_challenges_database.json not found!");
    process.exit(1);
  }

  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  const convertedProblems = [];

  for (const prob of dbData.problems) {
    const starterTs = prob.starter_code && prob.starter_code.typescript ? prob.starter_code.typescript : "";
    const sampleTestsCode = prob.unit_tests && prob.unit_tests.sample_tests_code ? prob.unit_tests.sample_tests_code : "";
    const hiddenTestsCode = prob.unit_tests && prob.unit_tests.hidden_tests_code ? prob.unit_tests.hidden_tests_code : "";

    const publicTCs = parseTests(sampleTestsCode).map((tc, idx) => ({
      id: `${prob.id}-pub-${idx + 1}`,
      is_hidden: false,
      input: tc.input,
      expected: tc.expected
    }));

    const hiddenTCs = parseTests(hiddenTestsCode).map((tc, idx) => ({
      id: `${prob.id}-hid-${idx + 1}`,
      is_hidden: true,
      input: tc.input,
      expected: tc.expected
    }));

    convertedProblems.push({
      id: prob.id,
      title: prob.title,
      difficulty: prob.difficulty,
      description: prob.description,
      inputFormat: "Function parameters as defined in the signature.",
      outputFormat: "Expected output matching the signature guidelines.",
      constraints: prob.constraints || [],
      starterCode: starterTs,
      publicTestCases: publicTCs,
      hiddenTestCases: hiddenTCs
    });
  }

  // Let's write the converted problems to challenges.json
  const originalChallengesPath = path.join(__dirname, 'challenges.json');

  const mergedProblems = convertedProblems;

  fs.writeFileSync(
    originalChallengesPath,
    JSON.stringify(mergedProblems, null, 2),
    'utf8'
  );
  console.log(`Successfully wrote ${mergedProblems.length} problems from the document to challenges.json!`);

} catch (err) {
  console.error("Error during conversion:", err);
}
