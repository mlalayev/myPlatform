const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);

  try {
    // 1. Funksiya adı "solution" olmasa belə çıxar
    const functionMatch = code.match(/function\\s+(\\w+)\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
    if (!functionMatch) {
      self.postMessage({ error: 'Funksiya tapılmadı! Zəhmət olmasa function solution(...) yazın.' });
      clearTimeout(timer);
      return;
    }

    const funcName = functionMatch[1];
    const argsList = functionMatch[2];
    const funcBody = functionMatch[3];

    // 2. Yeni Function obyekti yaradaraq exec et
    const userFunc = new Function(\`\${argsList}\`, \`\${funcBody}\`);

    // 3. İcra et
    let result = userFunc(...args);
    if (result instanceof Promise) {
      result = await result;
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
