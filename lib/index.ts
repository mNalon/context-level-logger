import debug, { Debugger } from 'debug';

export interface LoggerManager {
  createChildContext: Function
}

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

export function createParentContext(parentNamespace: string): LoggerManager {
  if (!parentNamespace) throw new Error('Should specify a valid and non empty parent context name');

  const parent = debug(parentNamespace);
  return {
    createChildContext: levelMethodsFactory(parent),
  };
}
