// This is a Web Worker for safely running user code
self.onmessage = function (e) {
    const { code, args } = e.data;
    try {
      let userFunc;
      // Save existing function names
      const selfAny = self as unknown as Record<string, unknown>;
      const before = Object.keys(selfAny).filter(k => typeof selfAny[k] === 'function');
      eval(code);
      // Find new function
      const after = Object.keys(selfAny).filter(k => typeof selfAny[k] === 'function');
      const newFuncName = after.find(k => !before.includes(k));
      if (newFuncName) {
        userFunc = selfAny[newFuncName];
      }
      if (!userFunc) {
        self.postMessage({ error: 'Funksiya tapılmadı!' });
        return;
      }
      if (typeof userFunc === 'function' && userFunc.length < args.length) {
        self.postMessage({ error: 'Funksiya kifayət qədər parametr qəbul etmir! Gözlənilən: ' + args.length + ', tapıldı: ' + userFunc.length });
        return;
      }
      let result;
      if (typeof userFunc === 'function') {
        try {
          result = userFunc(...args);
        } catch (err) {
          self.postMessage({ error: 'Funksiya icra olunarkən xəta baş verdi.' });
          return;
        }
        self.postMessage({ result });
      } else {
        self.postMessage({ error: 'Funksiya tapılmadı və ya düzgün deyil!' });
        return;
      }
    } catch (err) {
      self.postMessage({ error: 'Kodda xəta var!' });
    }
    self.close();
  }; 