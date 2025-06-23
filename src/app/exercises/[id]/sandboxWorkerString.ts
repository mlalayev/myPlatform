const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);
  try {
    let userFunc;
    eval(code);
    userFunc = self['solution'];
    if (!userFunc) {
      try {
        const funcMatch = code.match(/function\\s+solution\\s*\\([\\s\\S]*?\\)\\s*\\{[\\s\\S]*?\\}/);
        if (funcMatch) {
          userFunc = eval('(' + funcMatch[0] + ')');
        }
      } catch {}
    }
    if (!userFunc) {
      self.postMessage({ error: 'Funksiya tapılmadı! Zəhmət olmasa function solution(...) yazın.' });
      clearTimeout(timer);
      return;
    }
    let result;
    try {
      result = userFunc(...args);
      if (result instanceof Promise) {
        result = await result;
      }
    } catch (err) {
      self.postMessage({ error: 'Funksiya icra olunarkən xəta baş verdi.' });
      clearTimeout(timer);
      return;
    }
    self.postMessage({ result });
  } catch (err) {
    self.postMessage({ error: 'Kodda xəta var!' });
  }
  clearTimeout(timer);
  self.close();
};
`;
export default workerCode;
