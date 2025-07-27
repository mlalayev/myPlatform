const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedExercises() {
  try {
    console.log("🌱 Seeding exercises...");

    // Check if exercises already exist
    const existingExercises = await prisma.exercise.findMany();

    if (existingExercises.length > 0) {
      console.log(
        `Found ${existingExercises.length} existing exercises. Deleting and recreating...`
      );

      // Delete existing exercises to recreate with updated content
      await prisma.exercise.deleteMany({});

      console.log("✅ Existing exercises deleted!");
    }

    // Create exercises matching the format from exercisesData.ts
    const exercises = [
      {
        title: "Two Sum",
        description:
          "Verilmiş array və target üçün iki indeksin cəmi target-ə bərabər olan index-lərini qaytaran funksiya yazın.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 88.2,
          constraints: [
            "2 ≤ nums.length ≤ 10^4",
            "-10^9 ≤ nums[i], target ≤ 10^9",
          ],
          examples: [
            { input: "2 7 11 15|9", output: "[0,1]" },
            { input: "3 2 4|6", output: "[1,2]" },
          ],
          tags: ["Array", "HashMap"],
          solution: `function solution(nums, target) {
    const map = {};
    for (let i = 0; i < nums.length; i++) {
      const diff = target - nums[i];
      if (diff in map) return [map[diff], i];
      map[nums[i]] = i;
    }
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          hints: [
            "Hash map istifadə edin",
            "Hər element üçün target - element hesablayın",
          ],
          testCases: [
            { input: "2 7 11 15|9", expectedOutput: [0,1] },
            { input: "3 2 4|6", expectedOutput: [1,2] },
            { input: "3 3|6", expectedOutput: [0,1], hidden: true },
            { input: "1 2 3 4 5|9", expectedOutput: [3,4], hidden: true },
          ],
          inputParser: `(input) => {
            const parts = input.split('|');
            const nums = parts[0].split(' ').map(Number);
            const target = Number(parts[1]);
            return [nums, target];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    
}`,
            python: `class Solution(object):
    def solution(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: List[int]
        """
        `,
            cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        
    }
};`,
            c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* solution(int* nums, int numsSize, int target, int* returnSize) {
    
}`,
            java: `class Solution {
    public int[] solution(int[] nums, int target) {
        
    }
}`,
            csharp: `public class Solution {
    public int[] Solution(int[] nums, int target) {
        
    }
}`,
          },
        },
      },
      {
        title: "Median of Two Sorted Arrays",
        description:
          "Verilmiş iki sıralanmış array-in medianını qaytaran funksiya yazın.",
        difficulty: "HARD",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 49.3,
          constraints: ["0 ≤ nums1.length, nums2.length ≤ 1000"],
          examples: [
            { input: "1 3 | 2", output: "2.0" },
            { input: "1 2 | 3 4", output: "2.5" },
          ],
          tags: ["Array", "Binary Search", "Divide and Conquer"],
          solution: `function solution(nums1, nums2) {
    const merged = [...nums1, ...nums2].sort((a, b) => a - b);
    const mid = Math.floor(merged.length / 2);
    if (merged.length % 2 === 0) {
      return (merged[mid - 1] + merged[mid]) / 2;
    } else {
      return merged[mid];
    }
  }`,
          timeComplexity: "O((m+n) log(m+n))",
          spaceComplexity: "O(m+n)",
          hints: [
            "Array-ləri birləşdirin və sıralayın",
            "Median hesablamaq üçün ortadakı elementləri tapın",
          ],
          testCases: [
            { input: "1 3|2", expectedOutput: "2.0" },
            { input: "1 2|3 4", expectedOutput: "2.5" },
            { input: "0 0|0 0", expectedOutput: "0.0", hidden: true }
          ],
          inputParser: `(input) => {
            const parts = input.split('|');
            const nums1 = parts[0].split(' ').map(Number);
            const nums2 = parts[1].split(' ').map(Number);
            return [nums1, nums2];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function solution(nums1, nums2) {
    
}`,
            python: `class Solution(object):
    def solution(self, nums1, nums2):
        """
        :type nums1: List[int]
        :type nums2: List[int]
        :rtype: float
        """
        `,
            cpp: `class Solution {
public:
    double solution(vector<int>& nums1, vector<int>& nums2) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be a double.
 */
double solution(int* nums1, int nums1Size, int* nums2, int nums2Size) {
    
}`,
            java: `class Solution {
    public double solution(int[] nums1, int[] nums2) {
        
    }
}`,
            csharp: `public class Solution {
    public double Solution(int[] nums1, int[] nums2) {
        
    }
}`,
          },
        },
      },
      {
        title: "Container With Most Water",
        description:
          "Verilmiş array-də maksimum su tutumu olan iki index arasındakı məsafəni hesablayın.",
        difficulty: "MEDIUM",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 67.9,
          constraints: ["n ≥ 2", "0 ≤ height[i] ≤ 10^4"],
          examples: [{ input: "1 8 6 2 5 4 8 3 7", output: "49" }],
          tags: ["Two Pointers", "Greedy"],
          solution: `function solution(height) {
    let left = 0, right = height.length - 1, maxArea = 0;
    while (left < right) {
      const h = Math.min(height[left], height[right]);
      const w = right - left;
      maxArea = Math.max(maxArea, h * w);
      if (height[left] < height[right]) left++;
      else right--;
    }
    return maxArea;
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          hints: [
            "İki pointer istifadə edin",
            "Hündürlük və eni vuraraq sahəni hesablayın",
          ],
          testCases: [
            { input: "1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
            { input: "1 1", expectedOutput: "1", hidden: true }
          ],
          inputParser: `(input) => {
            return [input.split(' ').map(Number)];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
function solution(height) {
    
}`,
            python: `class Solution(object):
    def solution(self, height):
        """
        :type height: List[int]
        :rtype: int
        """
        `,
            cpp: `class Solution {
public:
    int solution(vector<int>& height) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be an integer.
 */
int solution(int* height, int heightSize) {
    
}`,
            java: `class Solution {
    public int solution(int[] height) {
        
    }
}`,
            csharp: `public class Solution {
    public int Solution(int[] height) {
        
    }
}`,
          },
        },
      },
      {
        title: "Search a 2D Matrix",
        description:
          "2D matrix daxilində hədəf ədədin olub olmadığını təyin edin.",
        difficulty: "MEDIUM",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 61.3,
          constraints: ["matrix.length, matrix[0].length ≥ 1"],
          examples: [
            { input: "1 3 5 7|10 11 16 20|23 30 34 60|3", output: "true" },
          ],
          tags: ["Matrix", "Binary Search"],
          solution: `function solution(matrix, target) {
    if (!matrix.length || !matrix[0].length) return false;
    let rows = matrix.length, cols = matrix[0].length;
    let left = 0, right = rows * cols - 1;
    while (left <= right) {
      let mid = Math.floor((left + right) / 2);
      let midVal = matrix[Math.floor(mid / cols)][mid % cols];
      if (midVal === target) return true;
      else if (midVal < target) left = mid + 1;
      else right = mid - 1;
    }
    return false;
  }`,
          timeComplexity: "O(log(m*n))",
          spaceComplexity: "O(1)",
          hints: [
            "Matrix-i 1D array kimi təsəvvür edin",
            "Binary search istifadə edin",
          ],
          testCases: [
            {
              input: "1 3 5 7|10 11 16 20|23 30 34 60|3",
              expectedOutput: "true",
            },
            {
              input: "1 3 5 7|10 11 16 20|23 30 34 60|13",
              expectedOutput: "false",
            },
          ],
          inputParser: `(input) => {
            const parts = input.split('|');
            const target = Number(parts[parts.length - 1]);
            const matrix = parts.slice(0, -1).map(row => row.split(' ').map(Number));
            return [matrix, target];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
function solution(matrix, target) {
    
}`,
            python: `class Solution(object):
    def solution(self, matrix, target):
        """
        :type matrix: List[List[int]]
        :type target: int
        :rtype: bool
        """
        `,
            cpp: `class Solution {
public:
    bool solution(vector<vector<int>>& matrix, int target) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be a boolean.
 */
bool solution(int** matrix, int matrixSize, int* matrixColSize, int target) {
    
}`,
            java: `class Solution {
    public boolean solution(int[][] matrix, int target) {
        
    }
}`,
            csharp: `public class Solution {
    public bool Solution(int[][] matrix, int target) {
        
    }
}`,
          },
        },
      },
      {
        title: "Valid Parentheses",
        description:
          "Verilmiş string-də mötərizələrin düzgün olub olmadığını yoxlayın.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 75.2,
          constraints: [
            "1 ≤ s.length ≤ 10^4",
            "s consists of parentheses only '()[]{}'",
          ],
          examples: [
            { input: "()", output: "true" },
            { input: "()[]{}", output: "true" },
            { input: "(]", output: "false" },
          ],
          tags: ["Stack", "String"],
          solution: `function solution(s) {
    const stack = [];
    const pairs = {
      ')': '(',
      ']': '[',
      '}': '{'
    };
    
    for (let char of s) {
      if (char === '(' || char === '[' || char === '{') {
        stack.push(char);
      } else {
        if (stack.pop() !== pairs[char]) {
          return false;
        }
      }
    }
    
    return stack.length === 0;
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          hints: [
            "Stack istifadə edin",
            "Açılan mötərizələri stack-ə əlavə edin",
          ],
          testCases: [
            { input: "()", expectedOutput: "true" },
            { input: "()[]{}", expectedOutput: "true" },
            { input: "(]", expectedOutput: "false" },
            { input: "([)]", expectedOutput: "false" },
          ],
          inputParser: `(input) => {
            return [input];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function solution(s) {
    
}`,
            python: `class Solution(object):
    def solution(self, s):
        """
        :type s: str
        :rtype: bool
        """
        `,
            cpp: `class Solution {
public:
    bool solution(string s) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be a boolean.
 */
bool solution(char* s) {
    
}`,
            java: `class Solution {
    public boolean solution(String s) {
        
    }
}`,
            csharp: `public class Solution {
    public bool Solution(string s) {
        
    }
}`,
          },
        },
      },
      {
        title: "Reverse String",
        description: "Verilmiş string-i tərs çevirin.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 92.1,
          constraints: ["1 ≤ s.length ≤ 10^5"],
          examples: [
            { input: "hello", output: "olleh" },
            { input: "world", output: "dlrow" },
          ],
          tags: ["String", "Two Pointers"],
          solution: `function solution(s) {
    const chars = s.split('');
    let left = 0, right = chars.length - 1;
    
    while (left < right) {
      [chars[left], chars[right]] = [chars[right], chars[left]];
      left++;
      right--;
    }
    
    return chars.join('');
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          hints: ["İki pointer istifadə edin", "Simvolları dəyişdirin"],
          testCases: [
            { input: "hello", expectedOutput: "olleh" },
            { input: "world", expectedOutput: "dlrow" },
            { input: "", expectedOutput: "" },
          ],
          inputParser: `(input) => {
            return [input];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {string} s
 * @return {string}
 */
function solution(s) {
    
}`,
            python: `class Solution(object):
    def solution(self, s):
        """
        :type s: str
        :rtype: str
        """
        `,
            cpp: `class Solution {
public:
    string solution(string s) {
        
    }
};`,
            c: `/**
 * Note: The returned string should be modified in place.
 */
void solution(char* s) {
    
}`,
            java: `class Solution {
    public String solution(String s) {
        
    }
}`,
            csharp: `public class Solution {
    public string Solution(string s) {
        
    }
}`,
          },
        },
      },
      {
        title: "Maximum Subarray",
        description:
          "Verilmiş array-də maksimum cəmi olan ardıcıl alt array-i tapın.",
        difficulty: "MEDIUM",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 58.7,
          constraints: ["1 ≤ nums.length ≤ 10^5", "-10^4 ≤ nums[i] ≤ 10^4"],
          examples: [
            { input: "-2 1 -3 4 -1 2 1 -5 4", output: "6" },
            { input: "1", output: "1" },
          ],
          tags: ["Array", "Dynamic Programming", "Kadane's Algorithm"],
          solution: `function solution(nums) {
    let maxSoFar = nums[0];
    let maxEndingHere = nums[0];
    
    for (let i = 1; i < nums.length; i++) {
      maxEndingHere = Math.max(nums[i], maxEndingHere + nums[i]);
      maxSoFar = Math.max(maxSoFar, maxEndingHere);
    }
    
    return maxSoFar;
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          hints: [
            "Kadane's algorithm istifadə edin",
            "Hər addımda maksimum cəmi yeniləyin",
          ],
          testCases: [
            { input: "-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
            { input: "1", expectedOutput: "1" },
            { input: "5 4 -1 7 8", expectedOutput: "23" },
          ],
          inputParser: `(input) => {
            return [input.split(' ').map(Number)];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function solution(nums) {
    
}`,
            python: `class Solution(object):
    def solution(self, nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        `,
            cpp: `class Solution {
public:
    int solution(vector<int>& nums) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be an integer.
 */
int solution(int* nums, int numsSize) {
    
}`,
            java: `class Solution {
    public int solution(int[] nums) {
        
    }
}`,
            csharp: `public class Solution {
    public int Solution(int[] nums) {
        
    }
}`,
          },
        },
      },
      {
        title: "Binary Tree Inorder Traversal",
        description: "Binary ağacın inorder traversal-ini həyata keçirin.",
        difficulty: "MEDIUM",
        category: "DATA_STRUCTURES",
        published: true,
        content: {
          acceptance: 72.4,
          constraints: [
            "The number of nodes in the tree is in the range [0, 100]",
          ],
          examples: [
            { input: "[1,null,2,3]", output: "[1,3,2]" },
            { input: "[]", output: "[]" },
          ],
          tags: ["Tree", "Depth-First Search", "Recursion"],
          solution: `function solution(root) {
    const result = [];
    
    function inorder(node) {
      if (!node) return;
      inorder(node.left);
      result.push(node.val);
      inorder(node.right);
    }
    
    inorder(root);
    return result;
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          hints: [
            "Recursion istifadə edin",
            "Sol alt ağac, kök, sağ alt ağac sırası",
          ],
          testCases: [
            { input: "[1,null,2,3]", expectedOutput: "[1,3,2]" },
            { input: "[]", expectedOutput: "[]" },
            { input: "[1]", expectedOutput: "[1]" },
          ],
          inputParser: `(input) => {
            // Parse binary tree from string representation
            return [input];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {TreeNode} root
 * @return {number[]}
 */
function solution(root) {
    
}`,
            python: `class Solution(object):
    def solution(self, root):
        """
        :type root: TreeNode
        :rtype: List[int]
        """
        `,
            cpp: `class Solution {
public:
    vector<int> solution(TreeNode* root) {
        
    }
};`,
            c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* solution(struct TreeNode* root, int* returnSize) {
    
}`,
            java: `class Solution {
    public List<Integer> solution(TreeNode root) {
        
    }
}`,
            csharp: `public class Solution {
    public IList<int> Solution(TreeNode root) {
        
    }
}`,
          },
        },
      },
      {
        title: "Implement Stack",
        description: "İki queue istifadə edərək stack həyata keçirin.",
        difficulty: "EASY",
        category: "DATA_STRUCTURES",
        published: true,
        content: {
          acceptance: 85.3,
          constraints: [
            "1 ≤ x ≤ 9",
            "At most 100 calls will be made to push, pop, top, and empty",
          ],
          examples: [
            {
              input:
                '["MyStack","push","push","top","pop","empty"]\n[[],[1],[2],[],[],[]]',
              output: "[null,null,null,2,2,false]",
            },
          ],
          tags: ["Stack", "Queue", "Design"],
          solution: `class MyStack {
    constructor() {
      this.queue1 = [];
      this.queue2 = [];
    }
    
    push(x) {
      this.queue2.push(x);
      while (this.queue1.length > 0) {
        this.queue2.push(this.queue1.shift());
      }
      [this.queue1, this.queue2] = [this.queue2, this.queue1];
    }
    
    pop() {
      return this.queue1.shift();
    }
    
    top() {
      return this.queue1[0];
    }
    
    empty() {
      return this.queue1.length === 0;
    }
  }`,
          timeComplexity: "O(n) for push, O(1) for others",
          spaceComplexity: "O(n)",
          hints: [
            "İki queue istifadə edin",
            "Push zamanı elementləri yenidən düzəldin",
          ],
          testCases: [
            {
              input:
                '["MyStack","push","push","top","pop","empty"]\n[[],[1],[2],[],[],[]]',
              expectedOutput: "[null,null,null,2,2,false]",
            },
          ],
          inputParser: `(input) => {
            // Parse stack operations from string
            return [input];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {string[]} operations
 * @param {any[]} values
 * @return {any[]}
 */
function solution(operations, values) {
    
}`,
            python: `class Solution(object):
    def solution(self, operations, values):
        """
        :type operations: List[str]
        :type values: List[List[int]]
        :rtype: List[any]
        """
        `,
            cpp: `class Solution {
public:
    vector<string> solution(vector<string>& operations, vector<vector<int>>& values) {
        
    }
};`,
            c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
char** solution(char** operations, int operationsSize, int** values, int valuesSize, int* returnSize) {
    
}`,
            java: `class Solution {
    public List<String> solution(String[] operations, int[][] values) {
        
    }
}`,
            csharp: `public class Solution {
    public IList<string> Solution(string[] operations, int[][] values) {
        
    }
}`,
          },
        },
      },
      {
        title: "Valid Palindrome",
        description: "Verilmiş string-in palindrome olub olmadığını yoxlayın.",
        difficulty: "EASY",
        category: "ALGORITHMS",
        published: true,
        content: {
          acceptance: 78.9,
          constraints: ["1 ≤ s.length ≤ 2 * 10^5"],
          examples: [
            { input: "A man, a plan, a canal: Panama", output: "true" },
            { input: "race a car", output: "false" },
          ],
          tags: ["String", "Two Pointers"],
          solution: `function solution(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = clean.length - 1;
    
    while (left < right) {
      if (clean[left] !== clean[right]) {
        return false;
      }
      left++;
      right--;
    }
    
    return true;
  }`,
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          hints: ["String-i təmizləyin", "İki pointer ilə müqayisə edin"],
          testCases: [
            { input: "A man, a plan, a canal: Panama", expectedOutput: "true" },
            { input: "race a car", expectedOutput: "false" },
            { input: "", expectedOutput: "true" },
          ],
          inputParser: `(input) => {
            return [input];
          }`,
          functionTemplates: {
            javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
function solution(s) {
    
}`,
            python: `class Solution(object):
    def solution(self, s):
        """
        :type s: str
        :rtype: bool
        """
        `,
            cpp: `class Solution {
public:
    bool solution(string s) {
        
    }
};`,
            c: `/**
 * Note: The returned value should be a boolean.
 */
bool solution(char* s) {
    
}`,
            java: `class Solution {
    public boolean solution(String s) {
        
    }
}`,
            csharp: `public class Solution {
    public bool Solution(string s) {
        
    }
}`,
          },
        },
      },
    ];

    for (const exercise of exercises) {
      await prisma.exercise.create({
        data: exercise,
      });
    }

    console.log(`✅ Created ${exercises.length} published exercises!`);
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedExercises();
