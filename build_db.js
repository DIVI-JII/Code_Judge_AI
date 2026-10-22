const fs = require('fs');

const db = {
  problems: [
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
        sample_tests_code: `import { describe, expect, it } from "vitest";
import { flattenArray } from "./solution";

describe("Q1 - Flatten Nested Array (sample)", () => {
  it("flattens a single level of nesting", () => {
    expect(flattenArray([1, [2], [3, 4]])).toEqual([1, 2, 3, 4]);
  });
  it("flattens deeply nested arrays", () => {
    expect(flattenArray([1, [2, [3, [4]]], 5])).toEqual([1, 2, 3, 4, 5]);
  });
  it("returns empty array for empty input", () => {
    expect(flattenArray([])).toEqual([]);
  });
  it("returns unchanged array when no nesting", () => {
    expect(flattenArray([1, 2, 3])).toEqual([1, 2, 3]);
  });
});`,
        hidden_tests_code: `import { describe, expect, it } from "vitest";
import { flattenArray } from "./solution";

describe("Q1 - Flatten Nested Array (hidden)", () => {
  it("handles array with only nested arrays", () => {
    expect(flattenArray([[1], [2], [3]])).toEqual([1, 2, 3]);
  });
  it("handles 5 levels deep nesting", () => {
    expect(flattenArray([[[[[42]]]]])).toEqual([42]);
  });
  it("handles mixed types at various depths", () => {
    expect(flattenArray([1, [2, [3]], "a", ["b", ["c"]]])).toEqual([1, 2, 3, "a", "b", "c"]);
  });
  it("does not use Array.prototype.flat (structural check)", () => {
    const originalFlat = Array.prototype.flat;
    let flatCalled = false;
    Array.prototype.flat = function(...args) { 
      flatCalled = true; 
      return originalFlat.apply(this, args); 
    };
    flattenArray([1, [2]]);
    Array.prototype.flat = originalFlat;
    expect(flatCalled).toBe(false);
  });
  it("handles large deeply nested input without stack overflow", () => {
    let arr: any = [1];
    for (let i = 0; i < 100; i++) arr = [arr];
    expect(flattenArray(arr)).toEqual([1]);
  });
});`
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
        sample_tests_code: `import { describe, expect, it } from "vitest";
import { groupBySize } from "./solution";

describe("Q2 - Group Array by Size (sample)", () => {
  it("groups evenly divisible array", () => {
    expect(groupBySize([1, 2, 3, 4, 5, 6], 2)).toEqual([[1, 2], [3, 4], [5, 6]]);
  });
  it("handles remainder in final group", () => {
    expect(groupBySize([1, 2, 3, 4, 5], 4)).toEqual([[1, 2, 3, 4], [5]]);
  });
  it("returns empty array for empty input", () => {
    expect(groupBySize([], 3)).toEqual([]);
  });
});`,
        hidden_tests_code: `import { describe, expect, it } from "vitest";
import { groupBySize } from "./solution";

describe("Q2 - Group Array by Size (hidden)", () => {
  it("size equals array length returns one group", () => {
    expect(groupBySize([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
  });
  it("size of 1 returns each element in own group", () => {
    expect(groupBySize([5, 10, 15], 1)).toEqual([[5], [10], [15]]);
  });
  it("size larger than array returns single group", () => {
    expect(groupBySize([1, 2], 10)).toEqual([[1, 2]]);
  });
  it("works with string array", () => {
    expect(groupBySize(["a","b","c","d"], 2)).toEqual([["a","b"], ["c","d"]]);
  });
  it("groups array of 7 with size 3 correctly", () => {
    expect(groupBySize([1,2,3,4,5,6,7], 3)).toEqual([[1,2,3],[4,5,6],[7]]);
  });
});`
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
        sample_tests_code: `import { describe, expect, it } from "vitest";
import { reverseInGroups } from "./solution";

describe("Q3 - Reverse Array in Groups (sample)", () => {
  it("reverses evenly divisible groups", () => {
    expect(reverseInGroups([1,2,3,4,5,6], 2)).toEqual([2,1,4,3,6,5]);
  });
  it("reverses with remainder final group", () => {
    expect(reverseInGroups([1,2,3,4,5], 3)).toEqual([3,2,1,5,4]);
  });
  it("reverses when size exceeds array length", () => {
    expect(reverseInGroups([8,9], 5)).toEqual([9,8]);
  });
});`,
        hidden_tests_code: `import { describe, expect, it } from "vitest";
import { reverseInGroups } from "./solution";

describe("Q3 - Reverse Array in Groups (hidden)", () => {
  it("size 1 returns original array", () => {
    expect(reverseInGroups([1, 2, 3], 1)).toEqual([1, 2, 3]);
  });
  it("size equals length reverses entire array", () => {
    expect(reverseInGroups([1, 2, 3, 4], 4)).toEqual([4, 3, 2, 1]);
  });
  it("empty array returns empty", () => {
    expect(reverseInGroups([], 3)).toEqual([]);
  });
  it("single element array returns unchanged", () => {
    expect(reverseInGroups([42], 3)).toEqual([42]);
  });
  it("handles group size 3 with 7 elements correctly", () => {
    expect(reverseInGroups([1,2,3,4,5,6,7], 3)).toEqual([3,2,1,6,5,4,7]);
  });
});`
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
        sample_tests_code: `import { describe, expect, it } from "vitest";
import { splitIntoChunks } from "./solution";

describe("Q4 - Split String into Chunks (sample)", () => {
  it("splits evenly into chunks", () => {
    expect(splitIntoChunks("abcdef", 2)).toEqual(["ab", "cd", "ef"]);
  });
  it("last chunk has fewer characters", () => {
    expect(splitIntoChunks("helloworld", 3)).toEqual(["hel", "low", "orl", "d"]);
  });
  it("returns empty array for empty string", () => {
    expect(splitIntoChunks("", 1)).toEqual([]);
  });
});`,
        hidden_tests_code: `import { describe, expect, it } from "vitest";
import { splitIntoChunks } from "./solution";

describe("Q4 - Split String into Chunks (hidden)", () => {
  it("size equals string length returns one chunk", () => {
    expect(splitIntoChunks("hello", 5)).toEqual(["hello"]);
  });
  it("size 1 splits every character", () => {
    expect(splitIntoChunks("abc", 1)).toEqual(["a", "b", "c"]);
  });
  it("size larger than string returns single chunk", () => {
    expect(splitIntoChunks("hi", 10)).toEqual(["hi"]);
  });
  it("handles unicode characters correctly", () => {
    expect(splitIntoChunks("aabbcc", 2)).toEqual(["aa", "bb", "cc"]);
  });
  it("handles size of exactly 4 on 9-char string", () => {
    expect(splitIntoChunks("123456789", 4)).toEqual(["1234", "5678", "9"]);
  });
});`
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
        sample_tests_code: `import { describe, expect, it } from "vitest";
import { mergeSubarrays } from "./solution";

describe("Q5 - Merge Consecutive Subarrays (sample)", () => {
  it("merges standard 2D array", () => {
    expect(mergeSubarrays([[1,2],[3,4],[5]])).toEqual([1,2,3,4,5]);
  });
  it("handles empty subarray", () => {
    expect(mergeSubarrays([[7],[8,9],[]])).toEqual([7,8,9]);
  });
  it("returns empty for empty outer array", () => {
    expect(mergeSubarrays([])).toEqual([]);
  });
});`,
        hidden_tests_code: `import { describe, expect, it } from "vitest";
import { mergeSubarrays } from "./solution";

describe("Q5 - Merge Consecutive Subarrays (hidden)", () => {
  it("all empty subarrays returns empty", () => {
    expect(mergeSubarrays([[], [], []])).toEqual([]);
  });
  it("single subarray returns its elements", () => {
    expect(mergeSubarrays([[1, 2, 3]])).toEqual([1, 2, 3]);
  });
  it("preserves order of elements across subarrays", () => {
    expect(mergeSubarrays([[3],[1],[2]])).toEqual([3,1,2]);
  });
  it("does not use Array.prototype.flat", () => {
    const orig = Array.prototype.flat;
    let called = false;
    Array.prototype.flat = function(...a) { 
      called = true; 
      return orig.apply(this, a); 
    };
    mergeSubarrays([[1],[2]]);
    Array.prototype.flat = orig;
    expect(called).toBe(false);
  });
});`
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
    }
  ]
};
