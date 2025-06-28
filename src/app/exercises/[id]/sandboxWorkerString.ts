const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 2000);

  try {
    // Əvvəlcə eval + self.solution metodu
    try {
      const wrappedCode = \`\${code}\nself.solution = solution;\`;
      eval(wrappedCode);
      console.log('[worker] eval wrappedCode success');
    } catch (err) {
      console.log('[worker] eval wrappedCode error:', err);
    }

    // Əgər hələ də function tapılmayıbsa, regex ilə axtar
    if (typeof self.solution !== 'function') {
      try {
        console.log('[worker] Trying regex patterns');
        const patterns = [
          /function\s+solution\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,                       // function solution(...) {...}
          /const\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,         // const solution = function(...) {...}
          /let\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,
          /var\s+solution\s*=\s*function\s*\(([^)]*)\)\s*\{([\s\S]*)\}/,
          /const\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,               // const solution = (...) => {...}
          /let\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,
          /var\s+solution\s*=\s*\(([^)]*)\)\s*=>\s*\{([\s\S]*)\}/,
          /(?:const|let|var)\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^\\{;\\n]+)/
        ];

        for (const pattern of patterns) {
          const match = code.match(pattern);
          if (match) {
            console.log('[worker] Regex matched:', pattern);
            const params = match[1].trim();
            const body = match[2].trim();

            if (!params && args.length > 0) {
              console.log('[worker] No params but args needed');
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
      } catch (err) {
        console.log('[worker] Regex or parsing error:', err);
        self.postMessage({ error: 'Regex və ya kod parsing xətası: ' + err.message });
        clearTimeout(timer);
        return;
      }
    }

    // Hələ də tapılmayıbsa
    if (typeof self.solution !== 'function') {
      console.log('[worker] No solution function found');
      self.postMessage({ error: 'Funksiya tapılmadı! function solution(...) və ya const/let/var solution = ... yazın.' });
      clearTimeout(timer);
      return;
    }

    // Əgər input göndərilir amma funksiya parametrləri yoxdursa və ya azdır
    const fnParamsCount = self.solution.length;
    console.log('[worker] solution param count:', fnParamsCount, 'args.length:', args.length);
    if (fnParamsCount < args.length) {
      console.log('[worker] Not enough parameters');
      self.postMessage({ error: 'Funksiya kifayət qədər parametr qəbul etmir! Gözlənilən: ' + args.length + ', tapıldı: ' + fnParamsCount });
      clearTimeout(timer);
      return;
    }

    // Funksiya çağır
    let result;
    try {
      console.log('[worker] Calling solution with args:', args);
      result = self.solution(...args);
      if (result instanceof Promise) {
        result = await result;
      }
      console.log('[worker] Function call result:', result);
    } catch (err) {
      console.log('[worker] Function call error:', err);
      self.postMessage({ error: 'Funksiya icra olunarkən xəta baş verdi: ' + err.message });
      clearTimeout(timer);
      return;
    }

    self.postMessage({ result });
  } catch (err) {
    console.log('[worker] General error:', err);
    self.postMessage({ error: 'Kodda xəta var! ' + err.message });
  }

  clearTimeout(timer);
  self.close();
};
`;

export default workerCode;
