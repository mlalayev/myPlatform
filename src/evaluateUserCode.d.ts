declare module 'evaluateUserCode' {
  export interface TestCase {
    input: unknown[];
    expectedOutput: string;
  }
  export interface EvaluationResult {
    input: unknown[];
    expected: string;
    output: unknown;
    passed: boolean;
    time: number;
    memory: number;
    error?: string;
  }
  function evaluateUserCode(
    userCode: string,
    testCases: TestCase[],
    timeout?: number
  ): Promise<EvaluationResult[]>;
  export = evaluateUserCode;
} 