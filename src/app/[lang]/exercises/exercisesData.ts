// export interface TestCase {
//     input: string;
//     expectedOutput: string;
//     hidden?: boolean;
//   }
  
//   export interface Exercise {
//     id: string;
//     title: string;
//     difficulty: "Asan" | "Orta" | "Çətin";
//     description: string;
//     acceptance: number; // percentage
//     constraints: string[];
//     examples: { input: string; output: string; explanation?: string }[];
//     tags: string[];
//     solution: string;
//     timeComplexity: string;
//     spaceComplexity: string;
//     hints?: string[];
//     testCases: TestCase[];
//     inputParser: (input: string) => [number[], number] | [number[], number[]] | number[] | [number[][], number];
//   }
  
//   export const exercises: Exercise[] = [
//     {
//       id: "1",
//       title: "Two Sum",
//       difficulty: "Asan",
//       description:
//         "Verilmiş array və target üçün iki indeksin cəmi target-ə bərabər olan index-lərini qaytaran funksiya yazın.",
//       acceptance: 88.2,
//       constraints: ["2 ≤ nums.length ≤ 10^4", "-10^9 ≤ nums[i], target ≤ 10^9"],
//       examples: [
//         { input: "2 7 11 15|9", output: "[0,1]" },
//         { input: "3 2 4|6", output: "[1,2]" },
//       ],
//       tags: ["Array", "HashMap"],
//       solution: `function solution(nums, target) {
//     const map = {};
//     for (let i = 0; i < nums.length; i++) {
//       const diff = target - nums[i];
//       if (diff in map) return [map[diff], i];
//       map[nums[i]] = i;
//     }
//   }`,
//       timeComplexity: "O(n)",
//       spaceComplexity: "O(n)",
//       testCases: [
//         { input: "2 7 11 15|9", expectedOutput: "[0,1]" },
//         { input: "3 2 4|6", expectedOutput: "[1,2]" },
//         { input: "3 3|6", expectedOutput: "[0,1]", hidden: true },
//         { input: "1 2 3 4 5|9", expectedOutput: "[3,4]", hidden: true },
//       ],
//       inputParser: (input: string) => {
//         const [numsStr, targetStr] = input.split("|");
//         const nums = numsStr.trim().split(" ").map(Number);
//         const target = Number(targetStr.trim());
//         return [nums, target];
//       },
//     },
//     {
//       id: "4",
//       title: "Median of Two Sorted Arrays",
//       difficulty: "Çətin",
//       description:
//         "Verilmiş iki sıralanmış array-in medianını qaytaran funksiya yazın.",
//       acceptance: 49.3,
//       constraints: ["0 ≤ nums1.length, nums2.length ≤ 1000"],
//       examples: [
//         { input: "1 3 | 2", output: "2.0" },
//         { input: "1 2 | 3 4", output: "2.5" },
//       ],
//       tags: ["Array", "Binary Search", "Divide and Conquer"],
//       solution: `function solution(nums1, nums2) {
//     const merged = [...nums1, ...nums2].sort((a, b) => a - b);
//     const mid = Math.floor(merged.length / 2);
//     if (merged.length % 2 === 0) {
//       return (merged[mid - 1] + merged[mid]) / 2;
//     } else {
//       return merged[mid];
//     }
//   }`,
//       timeComplexity: "O((m+n) log(m+n)",
//       spaceComplexity: "O(m+n)",
//       testCases: [
//         { input: "1 3|2", expectedOutput: "2.0" },
//         { input: "1 2|3 4", expectedOutput: "2.5" },
//         { input: "0 0|0 0", expectedOutput: "0.0", hidden: true },
//       ],
//       inputParser: (input: string) => {
//         const [part1, part2] = input.split("|");
//         return [
//           part1.trim() ? part1.trim().split(" ").map(Number) : [],
//           part2.trim() ? part2.trim().split(" ").map(Number) : [],
//         ];
//       },
//     },
//     {
//       id: "11",
//       title: "Container With Most Water",
//       difficulty: "Orta",
//       description:
//         "Verilmiş array-də maksimum su tutumu olan iki index arasındakı məsafəni hesablayın.",
//       acceptance: 67.9,
//       constraints: ["n ≥ 2", "0 ≤ height[i] ≤ 10^4"],
//       examples: [{ input: "1 8 6 2 5 4 8 3 7", output: "49" }],
//       tags: ["Two Pointers", "Greedy"],
//       solution: `function solution(height) {
//     let left = 0, right = height.length - 1, maxArea = 0;
//     while (left < right) {
//       const h = Math.min(height[left], height[right]);
//       const w = right - left;
//       maxArea = Math.max(maxArea, h * w);
//       if (height[left] < height[right]) left++;
//       else right--;
//     }
//     return maxArea;
//   }`,
//       timeComplexity: "O(n)",
//       spaceComplexity: "O(1)",
//       testCases: [
//         { input: "1 8 6 2 5 4 8 3 7", expectedOutput: "49" },
//         { input: "1 1", expectedOutput: "1", hidden: true },
//       ],
//       inputParser: (input: string) => input.trim().split(" ").map(Number),
//     },
//     {
//       id: "74",
//       title: "Search a 2D Matrix",
//       difficulty: "Orta",
//       description: "2D matrix daxilində hədəf ədədin olub olmadığını təyin edin.",
//       acceptance: 61.3,
//       constraints: ["matrix.length, matrix[0].length ≥ 1"],
//       examples: [{ input: "1 3 5 7|10 11 16 20|23 30 34 60|3", output: "true" }],
//       tags: ["Matrix", "Binary Search"],
//       solution: `function solution(matrix, target) {
//     if (!matrix.length || !matrix[0].length) return false;
//     let rows = matrix.length, cols = matrix[0].length;
//     let left = 0, right = rows * cols - 1;
//     while (left <= right) {
//       let mid = Math.floor((left + right) / 2);
//       let midVal = matrix[Math.floor(mid / cols)][mid % cols];
//       if (midVal === target) return true;
//       else if (midVal < target) left = mid + 1;
//       else right = mid - 1;
//     }
//     return false;
//   }`,
//       timeComplexity: "O(log(m*n))",
//       spaceComplexity: "O(1)",
//       testCases: [
//         { input: "1 3 5 7|10 11 16 20|23 30 34 60|3", expectedOutput: "true" },
//         { input: "1 3 5 7|10 11 16 20|23 30 34 60|13", expectedOutput: "false" },
//       ],
//       inputParser: (input: string) => {
//         const parts = input.split("|");
//         const target = Number(parts.pop());
//         const matrix = parts.map((row) => row.trim().split(" ").map(Number));
//         return [matrix, target];
//       },
//     },
//   ];