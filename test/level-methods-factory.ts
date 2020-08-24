import { levelMethodsFactory, LoggerLevelMethods } from '../lib/level-methods-factory';

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
const childContextNameFake = 'ch1ldf4k3n4m3';

describe('levelMethodsFactory', () => {
  describe('when the levelMethodsFactory is called receiving a Debugger instance', () => {
    describe('and its result is called with a context name', () => {
      let levelMethods:LoggerLevelMethods;

      beforeAll(() => {
        debuggerFake.extend.mockReturnValue(debuggerMock);
        debuggerMock.extend.mockReturnValue(debuggerMock);
        const createContextLevelMethods = levelMethodsFactory(debuggerFake);
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

    describe('and it is called with an empty child context name', () => {
      it('it should throw an error', () => {
        expect(() => levelMethodsFactory(debuggerFake)(''))
          .toThrowError('Should specify a valid and non empty context name');
      });
    });
  });
});
