const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);

  try {
    let solution;

    try {
      // Əlavə olaraq kodun sonuna self.solution = solution əlavə et
      const wrappedCode = \`\${code}\\nself.solution = solution;\`;
      eval(wrappedCode);
      solution = self.solution;
    } catch (_) {}

    // Əgər hələ də function tapılmayıbsa, müxtəlif regex-lərlə axtar
    if (typeof solution !== 'function') {
      const decl = code.match(/function\\s+solution\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const expr = code.match(/const\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const arrow = code.match(/const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/);
      const conciseArrow = code.match(/const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^\\{][^;]*)/);

      if (decl) solution = new Function(decl[1], decl[2]);
      else if (expr) solution = new Function(expr[1], expr[2]);
      else if (arrow) solution = new Function(arrow[1], arrow[2]);
      else if (conciseArrow) solution = new Function(conciseArrow[1], \`return \${conciseArrow[2].trim()}\`);
    }

    if (typeof solution !== 'function') {
      self.postMessage({ error: 'Funksiya tapılmadı! function solution(...) və ya const solution = ... yazın.' });
      clearTimeout(timer);
      return;
    }

    let result = solution(...args);
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
