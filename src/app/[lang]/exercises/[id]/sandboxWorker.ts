// This is a Web Worker for safely running user code
self.onmessage = function (e) {
    const { code, args } = e.data;
    let timer = setTimeout(() => self.close(), 2000); // auto-close after 2s
    try {
      let userFunc;
      // Save existing function names
      const selfAny = self as any;
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
        clearTimeout(timer);
        return;
      }
      if (userFunc.length < args.length) {
        self.postMessage({ error: 'Funksiya kifayət qədər parametr qəbul etmir! Gözlənilən: ' + args.length + ', tapıldı: ' + userFunc.length });
        clearTimeout(timer);
        return;
      }
      let result;
      try {
        result = userFunc(...args);
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