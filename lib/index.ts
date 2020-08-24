import debug from 'debug';

import { levelMethodsFactory } from './level-methods-factory';

export interface LoggerManager {
  createChildContext: Function
}

export function createParentContext(parentNamespace: string): LoggerManager {
  if (!parentNamespace) throw new Error('Should specify a valid and non empty parent context name');

  const parent = debug(parentNamespace);
  return {
    createChildContext: levelMethodsFactory(parent),
  };
}
