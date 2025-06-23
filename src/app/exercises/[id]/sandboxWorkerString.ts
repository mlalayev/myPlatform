const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);

  try {
    // Əvvəlcə eval + self.solution metodu
    try {
      const wrappedCode = \`\${code}\\nself.solution = solution;\`;
      eval(wrappedCode);
    } catch (_) {}

    // Əgər hələ də function tapılmayıbsa, regex ilə yoxla
    if (typeof self.solution !== 'function') {
      const decl = code.match(/function\\s+solution\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const exprConst = code.match(/const\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const exprLet = code.match(/let\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const exprVar = code.match(/var\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/);
      const arrowConst = code.match(/const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/);
      const arrowLet = code.match(/let\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/);
      const arrowVar = code.match(/var\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/);
      const conciseArrow = code.match(/(?:const|let|var)\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^\\{;\\n]+)/);

      if (decl) self.solution = new Function(decl[1], decl[2]);
      else if (exprConst) self.solution = new Function(exprConst[1], exprConst[2]);
      else if (exprLet) self.solution = new Function(exprLet[1], exprLet[2]);
      else if (exprVar) self.solution = new Function(exprVar[1], exprVar[2]);
      else if (arrowConst) self.solution = new Function(arrowConst[1], arrowConst[2]);
      else if (arrowLet) self.solution = new Function(arrowLet[1], arrowLet[2]);
      else if (arrowVar) self.solution = new Function(arrowVar[1], arrowVar[2]);
      else if (conciseArrow) self.solution = new Function(conciseArrow[1], \`return \${conciseArrow[2].trim()};\`);
    }

    // Funksiya tapılmayıbsa error at
    if (typeof self.solution !== 'function') {
      self.postMessage({ error: 'Funksiya tapılmadı! function solution(...) və ya const/let/var solution = ... yazın.' });
      clearTimeout(timer);
      return;
    }

    // Funksiyanı çağır
    let result = self.solution(...args);
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
