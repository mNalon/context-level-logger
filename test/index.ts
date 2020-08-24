import debug from 'debug';

import * as libModule from '../lib';

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
const childContextNameFake = 'ch1ldf4k3n4m3';

describe('createParentContext', () => {
  let loggerContext:libModule.LoggerManager;

  describe('when it is called with a parent context name', () => {
    beforeAll(() => {
      (debug as unknown as jest.Mock<any>).mockReturnValue(debuggerMock);
      const levelMethodsFactoryMockRef = jest.spyOn(libModule, 'levelMethodsFactory');
      (levelMethodsFactoryMockRef as unknown as jest.Mock<any>).mockReturnValue(levelMethodsMock);
      loggerContext = libModule.createParentContext(parentContextNameFake);
    });

    it('it should instantiate a Debugger with this parent context', () => {
      expect(debug).toBeCalledTimes(1);
      expect(debug).toBeCalledWith(parentContextNameFake);
    });

    it('it should return an object with a method to create a childContext', () => {
      expect(libModule.levelMethodsFactory).toBeCalledTimes(1);
      expect(libModule.levelMethodsFactory).toBeCalledWith(debuggerMock);
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

describe('levelMethodsFactory', () => {
  describe('when the levelMethodsFactory is called receiving a Debugger instance', () => {
    describe('and its result is called with a context name', () => {
      let levelMethods:libModule.LoggerLevelMethods;

      beforeAll(() => {
        debuggerFake.extend.mockReturnValue(debuggerMock);
        debuggerMock.extend.mockReturnValue(debuggerMock);
        const createContextLevelMethods = libModule.levelMethodsFactory(debuggerFake);
        levelMethods = createContextLevelMethods(childContextNameFake);
      });

      it('the Debugger instance should be extended using the received child context name', () => {
        expect(debuggerFake.extend).toBeCalledTimes(1);
        expect(debuggerFake.extend).toBeCalledWith(childContextNameFake);
      });
      it('it should extend the Debugger instance again for each of the level logs', () => {
        expect(debuggerMock.extend).toBeCalledTimes(4);
        expect(debuggerMock.extend).toBeCalledWith('debug');
        expect(debuggerMock.extend).toBeCalledWith('info');
        expect(debuggerMock.extend).toBeCalledWith('warning');
        expect(debuggerMock.extend).toBeCalledWith('error');
      });
      it('it should return an object with all log level methods', () => {
        expect(levelMethods).toEqual({
          debug: debuggerMock,
          info: debuggerMock,
          warning: debuggerMock,
          error: debuggerMock,
        });
      });
      afterAll(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
      });
    });

    describe('when it is called with an empty child context name', () => {
      it('it should throw an error', () => {
        expect(() => libModule.levelMethodsFactory(debuggerFake)(''))
          .toThrowError('Should specify a valid and non empty context name');
      });
    });
  });
});
