import evaluateUserCode from './evaluateUserCode';

(async () => {
  const userCode = `function sum(a, b) { return a + b; }`;
  const testCases = [
    { input: [2, 3], expectedOutput: '5' },
    { input: [1, 1], expectedOutput: '2' },
    { input: [10, -10], expectedOutput: '0' },
  ];
  const results = await evaluateUserCode(userCode, testCases);
  console.log(results);
})(); 