declare module 'js-interpreter' {
  export default class Interpreter {
    constructor(code: string, initFunc?: (interpreter: Interpreter, globalObject: GlobalObject) => void);
    step(): boolean;
  }
} 