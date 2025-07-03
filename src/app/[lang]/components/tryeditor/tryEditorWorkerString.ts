const tryEditorWorkerCode = `
self.onmessage = function (e) {
  const { code } = e.data;
  let timer = setTimeout(() => self.close(), 2000);
  let logs = [];
  const originalLog = self.console.log;
  self.console.log = (...args) => {
    logs.push(args.map(String).join(" "));
    if (originalLog) originalLog(...args);
  };
  try {
    let result = eval(code);
    let output = logs.length > 0 ? logs.join("\n") : String(result);
    self.postMessage({ result: output });
  } catch (err) {
    let msg = (err && err.message) ? err.message : String(err);
    self.postMessage({ error: msg });
  }
  self.console.log = originalLog;
  clearTimeout(timer);
  self.close();
};
`;

export default tryEditorWorkerCode; 