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
  inputParser: (input: string) => any;
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
    inputParser: (input: string) => input.split(' ').map(Number),
  },
  {
    id: '2',
    title: 'Tək və ya cüt',
    difficulty: 'Asan',
    description: 'Verilmiş ədədin tək və ya cüt olduğunu müəyyən edən funksiya yazın.',
    acceptance: 88.4,
    constraints: ['-10^9 ≤ n ≤ 10^9'],
    examples: [
      { input: 'n = 4', output: 'Cüt' },
      { input: 'n = 7', output: 'Tək' },
    ],
    tags: ['Math', 'Conditional'],
    solution: `function isEven(n) {
  return n % 2 === 0 ? 'Cüt' : 'Tək';
}`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['% operatoru ilə ədədin 2-yə bölünüb bölünmədiyini yoxlayın.'],
    testCases: [
      { input: '2', expectedOutput: 'Cüt', hidden: false },
      { input: '3', expectedOutput: 'Tək', hidden: false },
      { input: '0', expectedOutput: 'Cüt', hidden: true },
      { input: '-2', expectedOutput: 'Cüt', hidden: true },
      { input: '-3', expectedOutput: 'Tək', hidden: true },
      { input: '1000000000', expectedOutput: 'Cüt', hidden: true },
      { input: '999999999', expectedOutput: 'Tək', hidden: true },
    ],
    inputParser: (input: string) => [Number(input)],
  },
  {
    id: '3',
    title: 'Ən böyük ədəd',
    difficulty: 'Asan',
    description: 'Verilmiş iki ədədin ən böyüyünü qaytaran funksiya yazın.',
    acceptance: 85.7,
    constraints: ['-10^9 ≤ a, b ≤ 10^9'],
    examples: [
      { input: 'a = 5, b = 3', output: '5' },
      { input: 'a = -1, b = 1', output: '1' },
    ],
    tags: ['Math', 'Conditional'],
    solution: `function max(a, b) {
  return a > b ? a : b;
}`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['Sadə if və ya ternary operator istifadə edin.'],
    testCases: [
      { input: '5 3', expectedOutput: '5', hidden: false },
      { input: '-1 1', expectedOutput: '1', hidden: false },
      { input: '0 0', expectedOutput: '0', hidden: true },
      { input: '100 -100', expectedOutput: '100', hidden: true },
      { input: '-10 -20', expectedOutput: '-10', hidden: true },
      { input: '999999999 1', expectedOutput: '999999999', hidden: true },
    ],
    inputParser: (input: string) => input.split(' ').map(Number),
  },
  {
    id: '4',
    title: 'Array-in uzunluğu',
    difficulty: 'Asan',
    description: 'Verilmiş array-in uzunluğunu qaytaran funksiya yazın.',
    acceptance: 90.2,
    constraints: ['Array 1000 elementdən çox olmamalıdır.'],
    examples: [
      { input: '[1, 2, 3]', output: '3' },
      { input: '[]', output: '0' },
    ],
    tags: ['Array', 'Basic'],
    solution: `function length(arr) {
  return arr.length;
}`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['`.length` xüsusiyyətindən istifadə edin.'],
    testCases: [
      { input: '1 2 3', expectedOutput: '3', hidden: false },
      { input: '', expectedOutput: '0', hidden: false },
      { input: '5 10 15 20', expectedOutput: '4', hidden: true },
      { input: '-1 -2 -3 -4 -5', expectedOutput: '5', hidden: true },
    ],
    inputParser: (input: string) => [input ? input.split(' ').map(Number) : []],
  },
  {
    id: '5',
    title: 'Salam, ad!',
    difficulty: 'Asan',
    description: 'Verilmiş ad üçün "Salam, [ad]!" formatında string qaytaran funksiya yazın.',
    acceptance: 95.5,
    constraints: ['Ad 50 simvoldan uzun olmamalıdır.'],
    examples: [
      { input: 'name = Murad', output: 'Salam, Murad!' },
      { input: 'name = Aysel', output: 'Salam, Aysel!' },
    ],
    tags: ['String', 'Template'],
    solution: `function greet(name) {
  return "Salam, " + name + "!";
}`,
    timeComplexity: 'O(1)',
    spaceComplexity: 'O(1)',
    hints: ['String birləşdirmə və ya template literal istifadə edin.'],
    testCases: [
      { input: 'Murad', expectedOutput: 'Salam, Murad!', hidden: false },
      { input: 'Aysel', expectedOutput: 'Salam, Aysel!', hidden: false },
      { input: 'Eli', expectedOutput: 'Salam, Eli!', hidden: true },
      { input: 'Fatima', expectedOutput: 'Salam, Fatima!', hidden: true },
    ],
    inputParser: (input: string) => [input],
  },
];
