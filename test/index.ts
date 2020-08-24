import debug from 'debug';

import * as libModule from '../lib';

import * as levelMethodsFactoryModule from '../lib/level-methods-factory';

jest.mock('debug');

const debuggerMock = {
  extend: jest.fn(),
};

const debuggerFake = () => (undefined);
debuggerFake.extend = jest.fn();
debuggerFake.color = 'c0l0r';
debuggerFake.destroy = jest.fn();
debuggerFake.log = jest.fn();
debuggerFake.namespace = 'n4m3sp4c3';
debuggerFake.enabled = true;

const levelMethodsMock = jest.fn();

const parentContextNameFake = 'p4r3nf4k3n4m3';

describe('createParentContext', () => {
  let loggerContext:libModule.LoggerManager;

  describe('when it is called with a parent context name', () => {
    beforeAll(() => {
      (debug as unknown as jest.Mock<any>).mockReturnValue(debuggerMock);
      const levelMethodsFactoryMockRef = jest.spyOn(levelMethodsFactoryModule, 'levelMethodsFactory');
      (levelMethodsFactoryMockRef as unknown as jest.Mock<any>).mockReturnValue(levelMethodsMock);
      loggerContext = libModule.createParentContext(parentContextNameFake);
    });

    it('it should instantiate a Debugger with this parent context', () => {
      expect(debug).toBeCalledTimes(1);
      expect(debug).toBeCalledWith(parentContextNameFake);
    });

    it('it should return an object with a method to create a childContext', () => {
      expect(levelMethodsFactoryModule.levelMethodsFactory).toBeCalledTimes(1);
      expect(levelMethodsFactoryModule.levelMethodsFactory).toBeCalledWith(debuggerMock);
      expect(loggerContext).toEqual({ createChildContext: levelMethodsMock });
    });

    afterAll(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });
  });

  describe('when it is called with an empty parent context name', () => {
    it('it should throw an error', () => {
      expect(() => libModule.createParentContext(''))
        .toThrowError('Should specify a valid and non empty parent context name');
    });
  });
});
