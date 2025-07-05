const workerCode = `
self.onmessage = function(e) {
  try {
    const result = eval(e.data);
    self.postMessage({ type: 'result', data: result });
  } catch (error) {
    self.postMessage({ type: 'error', data: error.message });
  }
};
`;

export default workerCode;  