const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);

  try {
    // Eval + fallback
    try {
      const wrappedCode = \`\${code}\nself.solution = solution;\`;
      eval(wrappedCode);
    } catch (_) {}

    // Əgər hələ də function tapılmayıbsa, regex ilə axtar
    if (typeof self.solution !== 'function') {
      const patterns = [
        /function\s+solution\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,                       // function solution(...) {...}
        /const\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,         // const solution = function(...) {...}
        /let\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,
        /var\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,
        /const\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,               // const solution = (...) => {...}
        /let\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,
        /var\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,
        /(?:const|let|var)\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*([^\{;\n]+)/        // const solution = (...) => expr
      ];

      for (const pattern of patterns) {
        const match = code.match(pattern);
        if (match) {
          const params = match[1].trim();
          const body = match[2].trim();

          if (!params && args.length > 0) {
            self.postMessage({ error: 'Funksiya parametr qəbul etmir! Ən azı 1 input parameter yazılmalıdır.' });
            clearTimeout(timer);
            return;
          }

          const finalBody = pattern.source.includes('=>') && !body.includes('return')
            ? \`return \${body};\`
            : body;

          self.solution = new Function(params, finalBody);
          break;
        }
      }
    }

    // Hələ də tapılmayıbsa
    if (typeof self.solution !== 'function') {
      self.postMessage({ error: 'Funksiya tapılmadı! function solution(...) və ya const/let/var solution = ... yazın.' });
      clearTimeout(timer);
      return;
    }

    // Əgər input göndərilir amma funksiya parametrləri yoxdursa
    const fnParamsCount = self.solution.length;
    if (fnParamsCount === 0 && args.length > 0) {
      self.postMessage({ error: 'Funksiya parametr qəbul etmir! Ən azı 1 input parameter yazılmalıdır.' });
      clearTimeout(timer);
      return;
    }

    // Funksiya çağır
    let result = self.solution(...args);
    if (result instanceof Promise) {
      result = await result;
    }

    self.postMessage({ result });
  } catch (err) {
    self.postMessage({ error: 'Kodda xəta var! ' + err.message });
  }

  clearTimeout(timer);
  self.close();
};
`;

export default workerCode;
