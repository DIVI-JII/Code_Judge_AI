const easyProblems = [
  {
    id: "Q1",
    title: "Flatten Nested Array",
    difficulty: "Easy",
    description: "Given a nested array `arr`, return a flattened array. A flattened array contains all the elements of the original array but with all nested arrays recursively expanded into a single-level array.\n\n### Constraints\n- Solve without using `Array.prototype.flat`.",
    constraints: ["Solve without using Array.prototype.flat."],
    starter_code: {
      typescript: "export function flattenArray(arr: any[]): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { flattenArray } from "./solution";\n\ndescribe("Q1 - Flatten Nested Array (sample)", () => {\n  it("flattens a single level of nesting", () => {\n    expect(flattenArray([1, [2], [3, 4]])).toEqual([1, 2, 3, 4]);\n  });\n  it("flattens deeply nested arrays", () => {\n    expect(flattenArray([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5]);\n  });\n  it("returns empty array for empty input", () => {\n    expect(flattenArray([])).toEqual([]);\n  });\n  it("returns unchanged array when no nesting", () => {\n    expect(flattenArray([1, 2, 3])).toEqual([1, 2, 3]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { flattenArray } from "./solution";\n\ndescribe("Q1 - Flatten Nested Array (hidden)", () => {\n  it("handles array with only nested arrays", () => {\n    expect(flattenArray([[1], [2], [3]])).toEqual([1, 2, 3]);\n  });\n  it("handles 5 levels deep nesting", () => {\n    expect(flattenArray([[[[[42]]]]])).toEqual([42]);\n  });\n  it("handles mixed types at various depths", () => {\n    expect(flattenArray([1, [2, [3]], "a", ["b", ["c"]]])).toEqual([1, 2, 3, "a", "b", "c"]);\n  });\n  it("does not use Array.prototype.flat (structural check)", () => {\n    const originalFlat = Array.prototype.flat;\n    let flatCalled = false;\n    Array.prototype.flat = function(...args) {\n      flatCalled = true;\n      return originalFlat.apply(this, args);\n    };\n    flattenArray([1, [2]]);\n    Array.prototype.flat = originalFlat;\n    expect(flatCalled).toBe(false);\n  });\n  it("handles large deeply nested input without stack overflow", () => {\n    let arr: any = [1];\n    for (let i = 0; i < 100; i++) arr = [arr];\n    expect(flattenArray(arr)).toEqual([1]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "flattens a single level of nesting", is_hidden: false },
      { test_name: "flattens deeply nested arrays", is_hidden: false },
      { test_name: "returns empty array for empty input", is_hidden: false },
      { test_name: "returns unchanged array when no nesting", is_hidden: false },
      { test_name: "handles array with only nested arrays", is_hidden: true },
      { test_name: "handles 5 levels deep nesting", is_hidden: true },
      { test_name: "handles mixed types at various depths", is_hidden: true },
      { test_name: "does not use Array.prototype.flat (structural check)", is_hidden: true },
      { test_name: "handles large deeply nested input without stack overflow", is_hidden: true }
    ]
  },
  {
    id: "Q2",
    title: "Group Array by Size",
    difficulty: "Easy",
    description: "Given an array `arr` and an integer `size`, return an array of groups. Each group should contain `size` consecutive elements from `arr`. The final group may contain fewer than `size` elements.\n\n### Constraints\n- Solve without using external utility libraries.",
    constraints: ["Solve without using external utility libraries."],
    starter_code: {
      typescript: "export function groupBySize(arr: any[], size: number): any[][] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { groupBySize } from "./solution";\n\ndescribe("Q2 - Group Array by Size (sample)", () => {\n  it("groups evenly divisible array", () => {\n    expect(groupBySize([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);\n  });\n  it("handles remainder in final group", () => {\n    expect(groupBySize([1, 2, 3, 4, 5], 4)).toEqual([[1, 2, 3, 4], [5]]);\n  });\n  it("returns empty array for empty input", () => {\n    expect(groupBySize([], 3)).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { groupBySize } from "./solution";\n\ndescribe("Q2 - Group Array by Size (hidden)", () => {\n  it("size equals array length returns one group", () => {\n    expect(groupBySize([1, 2, 3], 3)).toEqual([[1, 2, 3]]);\n  });\n  it("size of 1 returns each element in own group", () => {\n    expect(groupBySize([5, 10, 15], 1)).toEqual([[5], [10], [15]]);\n  });\n  it("size larger than array returns single group", () => {\n    expect(groupBySize([1, 2], 10)).toEqual([[1, 2]]);\n  });\n  it("works with string array", () => {\n    expect(groupBySize(["a","b","c","d"], 2)).toEqual([["a","b"], ["c","d"]]);\n  });\n  it("groups array of 7 with size 3 correctly", () => {\n    expect(groupBySize([1,2,3,4,5,6,7], 3)).toEqual([[1,2,3],[4,5,6],[7]]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "groups evenly divisible array", is_hidden: false },
      { test_name: "handles remainder in final group", is_hidden: false },
      { test_name: "returns empty array for empty input", is_hidden: false },
      { test_name: "size equals array length returns one group", is_hidden: true },
      { test_name: "size of 1 returns each element in own group", is_hidden: true },
      { test_name: "size larger than array returns single group", is_hidden: true },
      { test_name: "works with string array", is_hidden: true },
      { test_name: "groups array of 7 with size 3 correctly", is_hidden: true }
    ]
  },
  {
    id: "Q3",
    title: "Reverse Array in Groups",
    difficulty: "Easy",
    description: "Given an array `arr` and an integer `size`, reverse the elements of the array in groups of length `size`. The final group should also be reversed even if it contains fewer than `size` elements.",
    constraints: [],
    starter_code: {
      typescript: "export function reverseInGroups(arr: any[], size: number): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { reverseInGroups } from "./solution";\n\ndescribe("Q3 - Reverse Array in Groups (sample)", () => {\n  it("reverses evenly divisible groups", () => {\n    expect(reverseInGroups([1,2,3,4,5,6], 2)).toEqual([2,1,4,3,6,5]);\n  });\n  it("reverses with remainder final group", () => {\n    expect(reverseInGroups([1,2,3,4,5], 3)).toEqual([3,2,1,5,4]);\n  });\n  it("reverses when size exceeds array length", () => {\n    expect(reverseInGroups([8,9], 5)).toEqual([9,8]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { reverseInGroups } from "./solution";\n\ndescribe("Q3 - Reverse Array in Groups (hidden)", () => {\n  it("size 1 returns original array", () => {\n    expect(reverseInGroups([1, 2, 3], 1)).toEqual([1, 2, 3]);\n  });\n  it("size equals length reverses entire array", () => {\n    expect(reverseInGroups([1, 2, 3, 4], 4)).toEqual([4, 3, 2, 1]);\n  });\n  it("empty array returns empty", () => {\n    expect(reverseInGroups([], 3)).toEqual([]);\n  });\n  it("single element array returns unchanged", () => {\n    expect(reverseInGroups([42], 3)).toEqual([42]);\n  });\n  it("handles group size 3 with 7 elements correctly", () => {\n    expect(reverseInGroups([1,2,3,4,5,6,7], 3)).toEqual([3,2,1,6,5,4,7]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "reverses evenly divisible groups", is_hidden: false },
      { test_name: "reverses with remainder final group", is_hidden: false },
      { test_name: "reverses when size exceeds array length", is_hidden: false },
      { test_name: "size 1 returns original array", is_hidden: true },
      { test_name: "size equals length reverses entire array", is_hidden: true },
      { test_name: "empty array returns empty", is_hidden: true },
      { test_name: "single element array returns unchanged", is_hidden: true },
      { test_name: "handles group size 3 with 7 elements correctly", is_hidden: true }
    ]
  },
  {
    id: "Q4",
    title: "Split String into Chunks",
    difficulty: "Easy",
    description: "Given a string `s` and an integer `size`, split the string into chunks of length `size`. Return an array containing the chunks in order. The last chunk may contain fewer than `size` characters.",
    constraints: [],
    starter_code: {
      typescript: "export function splitIntoChunks(s: string, size: number): string[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { splitIntoChunks } from "./solution";\n\ndescribe("Q4 - Split String into Chunks (sample)", () => {\n  it("splits evenly into chunks", () => {\n    expect(splitIntoChunks("abcdef", 2)).toEqual(["ab", "cd", "ef"]);\n  });\n  it("last chunk has fewer characters", () => {\n    expect(splitIntoChunks("helloworld", 3)).toEqual(["hel", "low", "orl", "d"]);\n  });\n  it("returns empty array for empty string", () => {\n    expect(splitIntoChunks("", 1)).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { splitIntoChunks } from "./solution";\n\ndescribe("Q4 - Split String into Chunks (hidden)", () => {\n  it("size equals string length returns one chunk", () => {\n    expect(splitIntoChunks("hello", 5)).toEqual(["hello"]);\n  });\n  it("size 1 splits every character", () => {\n    expect(splitIntoChunks("abc", 1)).toEqual(["a", "b", "c"]);\n  });\n  it("size larger than string returns single chunk", () => {\n    expect(splitIntoChunks("hi", 10)).toEqual(["hi"]);\n  });\n  it("handles unicode characters correctly", () => {\n    expect(splitIntoChunks("aabbcc", 2)).toEqual(["aa", "bb", "cc"]);\n  });\n  it("handles size of exactly 4 on 9-char string", () => {\n    expect(splitIntoChunks("123456789", 4)).toEqual(["1234", "5678", "9"]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "splits evenly into chunks", is_hidden: false },
      { test_name: "last chunk has fewer characters", is_hidden: false },
      { test_name: "returns empty array for empty string", is_hidden: false },
      { test_name: "size equals string length returns one chunk", is_hidden: true },
      { test_name: "size 1 splits every character", is_hidden: true },
      { test_name: "size larger than string returns single chunk", is_hidden: true },
      { test_name: "handles unicode characters correctly", is_hidden: true },
      { test_name: "handles size of exactly 4 on 9-char string", is_hidden: true }
    ]
  },
  {
    id: "Q5",
    title: "Merge Consecutive Subarrays",
    difficulty: "Easy",
    description: "Given a 2D array `arr`, return a single merged array containing all elements in order.\n\n### Constraints\n- Solve without using `Array.prototype.flat`.",
    constraints: ["Solve without using Array.prototype.flat."],
    starter_code: {
      typescript: "export function mergeSubarrays(arr: any[][]): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { mergeSubarrays } from "./solution";\n\ndescribe("Q5 - Merge Consecutive Subarrays (sample)", () => {\n  it("merges standard 2D array", () => {\n    expect(mergeSubarrays([[1,2],[3,4],[5]])).toEqual([1,2,3,4,5]);\n  });\n  it("handles empty subarray", () => {\n    expect(mergeSubarrays([[7],[8,9],[]])).toEqual([7,8,9]);\n  });\n  it("returns empty for empty outer array", () => {\n    expect(mergeSubarrays([])).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { mergeSubarrays } from "./solution";\n\ndescribe("Q5 - Merge Consecutive Subarrays (hidden)", () => {\n  it("all empty subarrays returns empty", () => {\n    expect(mergeSubarrays([[], [], []])).toEqual([]);\n  });\n  it("single subarray returns its elements", () => {\n    expect(mergeSubarrays([[1, 2, 3]])).toEqual([1, 2, 3]);\n  });\n  it("preserves order of elements across subarrays", () => {\n    expect(mergeSubarrays([[3],[1],[2]])).toEqual([3,1,2]);\n  });\n  it("does not use Array.prototype.flat", () => {\n    const orig = Array.prototype.flat;\n    let called = false;\n    Array.prototype.flat = function(...a) {\n      called = true;\n      return orig.apply(this, a);\n    };\n    mergeSubarrays([[1],[2]]);\n    Array.prototype.flat = orig;\n    expect(called).toBe(false);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "merges standard 2D array", is_hidden: false },
      { test_name: "handles empty subarray", is_hidden: false },
      { test_name: "returns empty for empty outer array", is_hidden: false },
      { test_name: "all empty subarrays returns empty", is_hidden: true },
      { test_name: "single subarray returns its elements", is_hidden: true },
      { test_name: "preserves order of elements across subarrays", is_hidden: true },
      { test_name: "does not use Array.prototype.flat", is_hidden: true }
    ]
  },
  {
    id: "Q6",
    title: "Rotate Array by K Positions",
    difficulty: "Easy",
    description: "Given an array `arr` and an integer `k`, rotate the array to the right by `k` positions.",
    constraints: [],
    starter_code: {
      typescript: "export function rotateArray(arr: any[], k: number): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { rotateArray } from "./solution";\n\ndescribe("Q6 - Rotate Array by K Positions (sample)", () => {\n  it("rotates right by k=2", () => {\n    expect(rotateArray([1,2,3,4,5], 2)).toEqual([4,5,1,2,3]);\n  });\n  it("handles k larger than array length", () => {\n    expect(rotateArray([1,2], 3)).toEqual([2,1]);\n  });\n  it("returns empty array for empty input", () => {\n    expect(rotateArray([], 1)).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { rotateArray } from "./solution";\n\ndescribe("Q6 - Rotate Array by K Positions (hidden)", () => {\n  it("k=0 returns original array", () => {\n    expect(rotateArray([1,2,3], 0)).toEqual([1,2,3]);\n  });\n  it("k equals array length returns original", () => {\n    expect(rotateArray([1,2,3], 3)).toEqual([1,2,3]);\n  });\n  it("single element array always returns itself", () => {\n    expect(rotateArray([99], 100)).toEqual([99]);\n  });\n  it("handles k that is a multiple of array length", () => {\n    expect(rotateArray([1,2,3,4], 8)).toEqual([1,2,3,4]);\n  });\n  it("rotates by 1 correctly", () => {\n    expect(rotateArray([1,2,3,4,5], 1)).toEqual([5,1,2,3,4]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "rotates right by k=2", is_hidden: false },
      { test_name: "handles k larger than array length", is_hidden: false },
      { test_name: "returns empty array for empty input", is_hidden: false },
      { test_name: "k=0 returns original array", is_hidden: true },
      { test_name: "k equals array length returns original", is_hidden: true },
      { test_name: "single element array always returns itself", is_hidden: true },
      { test_name: "handles k that is a multiple of array length", is_hidden: true },
      { test_name: "rotates by 1 correctly", is_hidden: true }
    ]
  },
  {
    id: "Q7",
    title: "Partition Array into Equal Pairs",
    difficulty: "Easy",
    description: "Given an array `arr`, return an array containing pairs of consecutive elements. If the array has an odd number of elements, the final pair should contain only one element.",
    constraints: [],
    starter_code: {
      typescript: "export function partitionIntoPairs(arr: any[]): any[][] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { partitionIntoPairs } from "./solution";\n\ndescribe("Q7 - Partition Array into Equal Pairs (sample)", () => {\n  it("pairs even-length array", () => {\n    expect(partitionIntoPairs([1,2,3,4])).toEqual([[1,2],[3,4]]);\n  });\n  it("handles odd-length array with single-element tail", () => {\n    expect(partitionIntoPairs([5,6,7])).toEqual([[5,6],[7]]);\n  });\n  it("returns empty for empty input", () => {\n    expect(partitionIntoPairs([])).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { partitionIntoPairs } from "./solution";\n\ndescribe("Q7 - Partition Array into Equal Pairs (hidden)", () => {\n  it("single element yields one pair with one element", () => {\n    expect(partitionIntoPairs([42])).toEqual([[42]]);\n  });\n  it("two elements yields one pair", () => {\n    expect(partitionIntoPairs([1,2])).toEqual([[1,2]]);\n  });\n  it("six elements yields three pairs", () => {\n    expect(partitionIntoPairs([1,2,3,4,5,6])).toEqual([[1,2],[3,4],[5,6]]);\n  });\n  it("works with string elements", () => {\n    expect(partitionIntoPairs(["a","b","c"])).toEqual([["a","b"],["c"]]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "pairs even-length array", is_hidden: false },
      { test_name: "handles odd-length array with single-element tail", is_hidden: false },
      { test_name: "returns empty for empty input", is_hidden: false },
      { test_name: "single element yields one pair with one element", is_hidden: true },
      { test_name: "two elements yields one pair", is_hidden: true },
      { test_name: "six elements yields three pairs", is_hidden: true },
      { test_name: "works with string elements", is_hidden: true }
    ]
  },
  {
    id: "Q8",
    title: "Remove Every Nth Element",
    difficulty: "Easy",
    description: "Given an array `arr` and an integer `n`, remove every nth element from the array (1-based position). Return the remaining elements in order.",
    constraints: [],
    starter_code: {
      typescript: "export function removeEveryNth(arr: any[], n: number): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { removeEveryNth } from "./solution";\n\ndescribe("Q8 - Remove Every Nth Element (sample)", () => {\n  it("removes every 2nd element", () => {\n    expect(removeEveryNth([1,2,3,4,5,6], 2)).toEqual([1,3,5]);\n  });\n  it("removes every 3rd element", () => {\n    expect(removeEveryNth([10,20,30,40,50], 3)).toEqual([10,20,40,50]);\n  });\n  it("n=1 removes all elements", () => {\n    expect(removeEveryNth([7,8], 1)).toEqual([]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { removeEveryNth } from "./solution";\n\ndescribe("Q8 - Remove Every Nth Element (hidden)", () => {\n  it("n larger than array length removes nothing", () => {\n    expect(removeEveryNth([1,2,3], 10)).toEqual([1,2,3]);\n  });\n  it("empty array returns empty", () => {\n    expect(removeEveryNth([], 3)).toEqual([]);\n  });\n  it("n equals array length removes last element", () => {\n    expect(removeEveryNth([1,2,3,4], 4)).toEqual([1,2,3]);\n  });\n  it("removes correct positions in 7-element array with n=3", () => {\n    expect(removeEveryNth([1,2,3,4,5,6,7], 3)).toEqual([1,2,4,5,7]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "removes every 2nd element", is_hidden: false },
      { test_name: "removes every 3rd element", is_hidden: false },
      { test_name: "n=1 removes all elements", is_hidden: false },
      { test_name: "n larger than array length removes nothing", is_hidden: true },
      { test_name: "empty array returns empty", is_hidden: true },
      { test_name: "n equals array length removes last element", is_hidden: true },
      { test_name: "removes correct positions in 7-element array with n=3", is_hidden: true }
    ]
  },
  {
    id: "Q9",
    title: "Divide Array into Two Halves",
    difficulty: "Easy",
    description: "Given an array `arr`, divide it into two halves. If the array length is odd, the first half should contain one extra element. Return the two halves as a 2D array.",
    constraints: [],
    starter_code: {
      typescript: "export function divideIntoHalves(arr: any[]): [any[], any[]] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { divideIntoHalves } from "./solution";\n\ndescribe("Q9 - Divide Array into Two Halves (sample)", () => {\n  it("splits even-length array equally", () => {\n    expect(divideIntoHalves([1,2,3,4])).toEqual([[1,2],[3,4]]);\n  });\n  it("first half gets extra element on odd length", () => {\n    expect(divideIntoHalves([1,2,3,4,5])).toEqual([[1,2,3],[4,5]]);\n  });\n  it("empty array returns two empty halves", () => {\n    expect(divideIntoHalves([])).toEqual([[],[]]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { divideIntoHalves } from "./solution";\n\ndescribe("Q9 - Divide Array into Two Halves (hidden)", () => {\n  it("single element goes to first half", () => {\n    expect(divideIntoHalves([42])).toEqual([[42],[]]);\n  });\n  it("two elements split evenly", () => {\n    expect(divideIntoHalves([1,2])).toEqual([[1],[2]]);\n  });\n  it("seven elements split 4 and 3", () => {\n    expect(divideIntoHalves([1,2,3,4,5,6,7])).toEqual([[1,2,3,4],[5,6,7]]);\n  });\n  it("preserves original array (no mutation)", () => {\n    const arr = [1,2,3,4];\n    divideIntoHalves(arr);\n    expect(arr).toEqual([1,2,3,4]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "splits even-length array equally", is_hidden: false },
      { test_name: "first half gets extra element on odd length", is_hidden: false },
      { test_name: "empty array returns two empty halves", is_hidden: false },
      { test_name: "single element goes to first half", is_hidden: true },
      { test_name: "two elements split evenly", is_hidden: true },
      { test_name: "seven elements split 4 and 3", is_hidden: true },
      { test_name: "preserves original array (no mutation)", is_hidden: true }
    ]
  },
  {
    id: "Q10",
    title: "Interleave Two Arrays",
    difficulty: "Easy",
    description: "Given two arrays `arr1` and `arr2`, return a new array by alternating elements from each array. If one array is longer, append the remaining elements at the end.",
    constraints: [],
    starter_code: {
      typescript: "export function interleaveArrays(arr1: any[], arr2: any[]): any[] {\n  // Write your code here\n}"
    },
    unit_tests: {
      sample_tests_code: `import { describe, expect, it } from "vitest";\nimport { interleaveArrays } from "./solution";\n\ndescribe("Q10 - Interleave Two Arrays (sample)", () => {\n  it("interleaves equal-length arrays", () => {\n    expect(interleaveArrays([1,3,5],[2,4,6])).toEqual([1,2,3,4,5,6]);\n  });\n  it("appends remaining elements from longer array", () => {\n    expect(interleaveArrays([1,2],[3,4,5,6])).toEqual([1,3,2,4,5,6]);\n  });\n  it("first array empty returns second unchanged", () => {\n    expect(interleaveArrays([],[1,2])).toEqual([1,2]);\n  });\n});`,
      hidden_tests_code: `import { describe, expect, it } from "vitest";\nimport { interleaveArrays } from "./solution";\n\ndescribe("Q10 - Interleave Two Arrays (hidden)", () => {\n  it("both arrays empty returns empty", () => {\n    expect(interleaveArrays([],[])).toEqual([]);\n  });\n  it("second array empty returns first unchanged", () => {\n    expect(interleaveArrays([1,2,3],[])).toEqual([1,2,3]);\n  });\n  it("arr1 longer appends remaining arr1 elements", () => {\n    expect(interleaveArrays([1,2,3,4],[5])).toEqual([1,5,2,3,4]);\n  });\n  it("single element arrays interleave correctly", () => {\n    expect(interleaveArrays([1],[2])).toEqual([1,2]);\n  });\n});`
    },
    test_cases_metadata: [
      { test_name: "interleaves equal-length arrays", is_hidden: false },
      { test_name: "appends remaining elements from longer array", is_hidden: false },
      { test_name: "first array empty returns second unchanged", is_hidden: false },
      { test_name: "both arrays empty returns empty", is_hidden: true },
      { test_name: "second array empty returns first unchanged", is_hidden: true },
      { test_name: "arr1 longer appends remaining arr1 elements", is_hidden: true },
      { test_name: "single element arrays interleave correctly", is_hidden: true }
    ]
  }
];

module.exports = easyProblems;
