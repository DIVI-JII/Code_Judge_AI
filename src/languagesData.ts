/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Language {
  id: string; // 'python' | 'java' | 'c' | 'cpp'
  name: string;
  monacoLang: string;
  ext: string;
  engine: string;
}

export const LANGUAGES: Language[] = [
  { id: 'typescript', name: 'TypeScript', monacoLang: 'typescript', ext: 'ts', engine: 'TypeScript 5.3 Compiler Node Module' },
  { id: 'javascript', name: 'JavaScript', monacoLang: 'javascript', ext: 'js', engine: 'V8 Engine NodeJS Execution Runtime' },
  { id: 'python', name: 'Python 3', monacoLang: 'python', ext: 'py', engine: 'Python 3.10 Syntactic Engine' },
  { id: 'java', name: 'Java', monacoLang: 'java', ext: 'java', engine: 'OpenJDK 17 JIT Compiler' },
  { id: 'cpp', name: 'C++', monacoLang: 'cpp', ext: 'cpp', engine: 'GCC G++ 11 Standard C++ Engine' },
  { id: 'c', name: 'C', monacoLang: 'c', ext: 'c', engine: 'GCC 11 Standard C Engine' }
];

export const STARTER_CODES: Record<string, Record<string, string>> = {
  'two-sum': {
    python: `class Solution:
    def twoSum(self, nums, target):
        # Your Py code here
        pass
`,
    java: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your Java code here
        return new int[0];
    }
}
`,
    cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your C++ code here
        return {};
    }
};
`,
    c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your C code here
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    return result;
}
`
  },
  'palindrome-number': {
    python: `class Solution:
    def isPalindrome(self, x):
        # Your Py code here
        pass
`,
    java: `class Solution {
    public boolean isPalindrome(int x) {
        // Your Java code here
        return false;
    }
}
`,
    cpp: `class Solution {
public:
    bool isPalindrome(int x) {
        // Your C++ code here
        return false;
    }
};
`,
    c: `#include <stdbool.h>

bool isPalindrome(int x) {
    // Your C code here
    return false;
}
`
  },
  'reverse-string': {
    python: `class Solution:
    def reverseString(self, s):
        # Your Py code here
        pass
`,
    java: `class Solution {
    public void reverseString(char[] s) {
        // Your Java code here
    }
}
`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Your C++ code here
    }
};
`,
    c: `void reverseString(char* s, int sSize) {
    // Your C code here
}
`
  },
  'maximum-number': {
    python: `class Solution:
    def findMax(self, nums):
        # Your Py code here
        pass
`,
    java: `class Solution {
    public int findMax(int[] nums) {
        // Your Java code here
        return 0;
    }
}
`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int findMax(vector<int>& nums) {
        // Your C++ code here
        return 0;
    }
};
`,
    c: `int findMax(int* nums, int numsSize) {
    // Your C code here
    return 0;
}
`
  },
  'count-vowels': {
    python: `class Solution:
    def countVowels(self, s):
        # Your Py code here
        pass
`,
    java: `class Solution {
    public int countVowels(String s) {
        // Your Java code here
        return 0;
    }
}
`,
    cpp: `#include <string>
using namespace std;

class Solution {
public:
    int countVowels(string s) {
        // Your C++ code here
        return 0;
    }
};
`,
    c: `#include <string.h>

int countVowels(char* s) {
    // Your C code here
    return 0;
}
`
  }
};
