import { VM } from 'vm2';

/**
 * Evaluates user-submitted JavaScript code securely using vm2.
 * @param {string} userCode - The user's function code as a string.
 * @param {Array<{input: any[], expectedOutput: string}>} testCases - Array of test cases.
 * @param {number} [timeout=1000] - Timeout in ms for each test case.
 * @returns {Promise<Array<{input: any[], expected: string, output: any, passed: boolean, time: number, memory: number, error?: string}>>}
 */
async function evaluateUserCode(userCode, testCases, timeout = 1000) {
  // Ensure the code is a module export
  let wrappedCode = userCode;
  if (!/module\.exports\s*=/.test(userCode)) {
    // Try to extract the first function name
    const match = userCode.match(/function\s+([a-zA-Z0-9_]+)/);
    if (match) {
      wrappedCode += `\nmodule.exports = ${match[1]};`;
    } else {
      throw new Error('No function found in user code.');
    }
  }

  const results = [];

  for (const testCase of testCases) {
    let output, error = null;
    let startMem, endMem, startTime, endTime;
    let passed = false;
    try {
      const vm = new VM({
        console: 'off',
        sandbox: {},
        timeout,
        eval: false,
        wasm: false,
        require: false,
      });
      startMem = process.memoryUsage().heapUsed;
      startTime = process.hrtime.bigint();
      const userFunc = vm.run(wrappedCode, 'user-code.js');
      output = await Promise.race([
        Promise.resolve(userFunc(...testCase.input)),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
      ]);
      endTime = process.hrtime.bigint();
      endMem = process.memoryUsage().heapUsed;
      passed = String(output) === String(testCase.expectedOutput);
    } catch (err) {
      output = undefined;
      error = err.message;
      endTime = process.hrtime.bigint();
      endMem = process.memoryUsage().heapUsed;
    }
    const time = Number(endTime - startTime) / 1e6; // ms
    const memory = (endMem - startMem) / 1024; // KB
    results.push({
      input: testCase.input,
      expected: testCase.expectedOutput,
      output,
      passed,
      time: Math.round(time * 100) / 100,
      memory: Math.round(memory * 100) / 100,
      ...(error ? { error } : {}),
    });
  }
  return results;
}

module.exports = evaluateUserCode; 