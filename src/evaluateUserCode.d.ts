declare module 'evaluateUserCode' {
  export interface TestCase {
    input: any[];
    expectedOutput: string;
  }
  export interface EvaluationResult {
    input: any[];
    expected: string;
    output: any;
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