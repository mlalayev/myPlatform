export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  difficulty: 'Asan' | 'Orta' | 'Çətin';
  description: string;
  acceptance: number; // percentage
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  tags: string[];
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
  hints?: string[];
  testCases: TestCase[];
}

export const exercises: Exercise[] = [
  {
    id: '1',
    title: 'Ədədlərin cəmi',
    difficulty: 'Asan',
    description: 'Verilmiş iki ədədin cəmini qaytaran funksiya yazın.',
    acceptance: 92.1,
    constraints: ['-10^9 ≤ a, b ≤ 10^9'],
    examples: [
      { input: 'a = 2, b = 3', output: '5' },
      { input: 'a = -1, b = 1', output: '0' },
    ],
    tags: ['Array', 'Math'],
    solution: `function sum(a, b) {
  return a + b;
}`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Sadəcə toplama operatorundan istifadə edin.'],
    testCases: [
      { input: '2 3', expectedOutput: '5', hidden: false },
      { input: '-1 1', expectedOutput: '0', hidden: false },
      { input: '100 200', expectedOutput: '300', hidden: true },
      { input: '-1000000000 1000000000', expectedOutput: '0', hidden: true },
      { input: '0 0', expectedOutput: '0', hidden: true },
      { input: '123 456', expectedOutput: '579', hidden: true },
      { input: '-5 -5', expectedOutput: '-10', hidden: true },
      { input: '999999999 1', expectedOutput: '1000000000', hidden: true },
      { input: '1 -1', expectedOutput: '0', hidden: true },
      { input: '42 58', expectedOutput: '100', hidden: true },
    ],
  },
  {
    id: '2',
    title: 'Tək və ya cüt',
    difficulty: 'Asan',
    description: 'Verilmiş ədədin tək və ya cüt olduğunu müəyyən edən funksiya yazın.',
    acceptance: 88.4
  },
  {
    id: '3',
    title: 'Ən böyük ədəd',
    difficulty: 'Asan',
    description: 'Verilmiş iki ədədin ən böyüyünü qaytaran funksiya yazın.',
    acceptance: 85.7
  },
  {
    id: '4',
    title: 'Array-in uzunluğu',
    difficulty: 'Asan',
    description: 'Verilmiş array-in uzunluğunu qaytaran funksiya yazın.',
    acceptance: 90.2
  },
  {
    id: '5',
    title: 'Salam, ad!',
    difficulty: 'Asan',
    description: 'Verilmiş ad üçün "Salam, [ad]!" formatında string qaytaran funksiya yazın.',
    acceptance: 95.5
  },
]; 