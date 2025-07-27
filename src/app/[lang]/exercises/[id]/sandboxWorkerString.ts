const workerCode = `
self.onmessage = async function (e) {
  const { code, args } = e.data;
  let timer = setTimeout(() => self.close(), 5000); // Increased timeout to 5 seconds

  try {
    // Security: Block dangerous global objects and functions
    const dangerousGlobals = [
      'setTimeout', 'setInterval', 'setImmediate',
      'fetch', 'XMLHttpRequest', 'WebSocket', 'Worker', 'SharedWorker',
      'localStorage', 'sessionStorage', 'indexedDB',
      'document', 'window', 'global', 'process', 'require', 'import',
      'console.log', 'console.error', 'console.warn', 'console.info'
    ];

    // Override dangerous functions to prevent execution
    dangerousGlobals.forEach(global => {
      if (global in self) {
        const original = self[global];
        self[global] = function() {
          throw new Error(\`Təhlükəli funksiya '\${global}' icra edilə bilməz!\`);
        };
      }
    });

    // Block access to global scope
    Object.defineProperty(self, 'global', {
      get: function() {
        throw new Error('Global scope-ə giriş məhdudlaşdırılıb!');
      }
    });

    // Block process object
    Object.defineProperty(self, 'process', {
      get: function() {
        throw new Error('Process obyektinə giriş məhdudlaşdırılıb!');
      }
    });

    // Block require and import
    Object.defineProperty(self, 'require', {
      get: function() {
        throw new Error('require() funksiyası məhdudlaşdırılıb!');
      }
    });

    Object.defineProperty(self, 'import', {
      get: function() {
        throw new Error('import() funksiyası məhdudlaşdırılıb!');
      }
    });

    // Safe function parsing with limited eval/Function usage
    console.log('[worker] Starting safe function parsing');
    
    // Try to find solution function using regex patterns
    const patterns = [
      // TypeScript function declarations
      /function\\s+solution\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\{([\\s\\S]*)\\}/,              // function solution(...): type {...}
      /function\\s+solution\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/,                       // function solution(...) {...}
      
      // Function expressions
      /const\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\{([\\s\\S]*)\\}/, // const solution = function(...): type {...}
      /const\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/,         // const solution = function(...) {...}
      /let\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\{([\\s\\S]*)\\}/,
      /let\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/,
      /var\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\{([\\s\\S]*)\\}/,
      /var\\s+solution\\s*=\\s*function\\s*\\(([^)]*)\\)\\s*\\{([\\s\\S]*)\\}/,
      
      // Arrow functions
      /const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\s*=>\\s*\\{([\\s\\S]*)\\}/,   // const solution = (...): type => {...}
      /const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/,               // const solution = (...) => {...}
      /let\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\s*=>\\s*\\{([\\s\\S]*)\\}/,
      /let\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/,
      /var\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^{]*\\s*=>\\s*\\{([\\s\\S]*)\\}/,
      /var\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*\\{([\\s\\S]*)\\}/,
      
      // Simple arrow functions
      /const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^;\\n]*\\s*=>\\s*([^;\\n]+)/,     // const solution = (...): type => expression
      /const\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^;\\n]+)/,                     // const solution = (...) => expression
      /let\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^;\\n]*\\s*=>\\s*([^;\\n]+)/,
      /let\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^;\\n]+)/,
      /var\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*:\\s*[^;\\n]*\\s*=>\\s*([^;\\n]+)/,
      /var\\s+solution\\s*=\\s*\\(([^)]*)\\)\\s*=>\\s*([^;\\n]+)/
    ];

    let solutionFunction = null;
    let params = '';
    let body = '';

    // Try to use the simple test results directly
    const simpleTest = code.match(/function\\s+solution/);
    const paramTest = code.match(/function\\s+solution\\s*\\(([^)]*)\\)/);
    const bodyTest = code.match(/function\\s+solution[^{]*\\{([\\s\\S]*)\\}/);

    if (simpleTest && paramTest && bodyTest) {
      console.log('[worker] Using simple test results directly');
      params = paramTest[1].trim();
      body = bodyTest[1].trim();
      
      // Remove TypeScript type annotations from parameters
      params = params
        .replace(/:\s*number\[\]\[\]/g, '')  // Remove number[][] type
        .replace(/:\s*number\[\]/g, '')      // Remove number[] type
        .replace(/:\s*string\[\]/g, '')      // Remove string[] type
        .replace(/:\s*number/g, '')          // Remove number type
        .replace(/:\s*string/g, '')          // Remove string type
        .replace(/:\s*boolean/g, '')         // Remove boolean type
        .replace(/:\s*any/g, '')             // Remove any type
        .replace(/:\s*Record<[^>]*>/g, '')   // Remove Record type
        .replace(/<number,\s*number>/g, '')  // Remove Map type
        .replace(/<number>/g, '')            // Remove generic types
        .replace(/\[\]/g, '')                // Remove [] from parameter names
        .trim();
      
      try {
        const functionCode = \`function solution(\${params}) {\${body}}\`;
        eval(functionCode);
        solutionFunction = solution;
        console.log('[worker] Simple test function loaded successfully');
      } catch (err) {
        console.log('[worker] Simple test function creation error:', err);
      }
    }

    // If simple test didn't work, try the patterns
    if (!solutionFunction) {
      console.log('[worker] Simple test failed, trying patterns...');
      
      for (let i = 0; i < patterns.length; i++) {
        const pattern = patterns[i];
        const match = code.match(pattern);
        if (match) {
          console.log('[worker] Regex matched pattern:', i + 1);
          
          // Extract parameters and body from the matched pattern
          params = match[1].trim();
          body = match[2].trim();
          
          // Remove TypeScript type annotations from parameters
          params = params
            .replace(/:\s*number\[\]\[\]/g, '')  // Remove number[][] type
            .replace(/:\s*number\[\]/g, '')      // Remove number[] type
            .replace(/:\s*string\[\]/g, '')      // Remove string[] type
            .replace(/:\s*number/g, '')          // Remove number type
            .replace(/:\s*string/g, '')          // Remove string type
            .replace(/:\s*boolean/g, '')         // Remove boolean type
            .replace(/:\s*any/g, '')             // Remove any type
            .replace(/:\s*Record<[^>]*>/g, '')   // Remove Record type
            .replace(/<number,\s*number>/g, '')  // Remove Map type
            .replace(/<number>/g, '')            // Remove generic types
            .replace(/\[\]/g, '')                // Remove [] from parameter names
            .trim();

          if (!params && args.length > 0) {
            console.log('[worker] No params but args needed');
            self.postMessage({ error: 'Funksiya parametr qəbul etmir! Ən azı 1 input parameter yazılmalıdır.' });
            clearTimeout(timer);
            return;
          }

          const finalBody = pattern.source.includes('=>') && !body.includes('return')
            ? \`return \${body};\`
            : body;

          // Create function safely using Function constructor (allowed in worker)
          try {
            // Create the function in global scope so it can call itself recursively
            const functionCode = \`function solution(\${params}) {\${finalBody}}\`;
            eval(functionCode);
            solutionFunction = solution;
            break;
          } catch (err) {
            console.log('[worker] Function creation error:', err);
            continue;
          }
        }
      }
    }

    // Check if function was found
    if (!solutionFunction || typeof solutionFunction !== 'function') {
      console.log('[worker] No function found');
      self.postMessage({ error: 'Funksiya tapılmadı! Kod daxilində heç bir function aşkarlanmadı.' });
      clearTimeout(timer);
      return;
    }

    // Parametr sayı yoxlaması
    const fnParamsCount = solutionFunction.length;
    console.log('[worker] solution param count:', fnParamsCount, 'args.length:', args.length, 'args:', args);
    
    if (fnParamsCount === 0 && args.length > 0) {
      console.log('[worker] No parameters but args needed');
      self.postMessage({ error: 'Funksiya parametr qəbul etmir! Ən azı 1 input parameter yazılmalıdır.' });
      clearTimeout(timer);
      return;
    }

    // Funksiya çağır
    let result;
    try {
      console.log('[worker] Calling solution with args:', args);
      result = solutionFunction(...args);
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
