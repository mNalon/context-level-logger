import { Debugger } from 'debug';

export interface LoggerLevelMethods {
  debug: Debugger,
  info: Debugger,
  warning: Debugger,
  error: Debugger,
}

export const levelMethodsFactory = (parent: Debugger) =>
  (contextNamespace: string): LoggerLevelMethods => {
    if (!contextNamespace) throw new Error('Should specify a valid and non empty context name');

    const context = parent.extend(contextNamespace);

    return {
      debug: context.extend('debug'),
      info: context.extend('info'),
      warning: context.extend('warning'),
      error: context.extend('error'),
    };
  };
