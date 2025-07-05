declare module 'js-interpreter' {
  export default class Interpreter {
    constructor(code: string, initFunc?: (interpreter: any, globalObject: any) => void);
    step(): boolean;
  }
} 