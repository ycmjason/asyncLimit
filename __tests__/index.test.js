const asyncLimit = require('../index');

const timeout = (n) => new Promise((res) => setTimeout(res, n));

describe('asyncLimit', () => {
  it('should show error if first argument is not function', () => {
    expect(() => asyncLimit(123, 0)).toThrow(TypeError);
  });

  it('should show error if second argument is not number', () => {
    expect(() => asyncLimit(() => {}, 'hi')).toThrow(TypeError);
  });

  it('should call only 5 async calls at a time', async () => {
    const resolves = [];
    const calledPayloads = [];

    const f = asyncLimit(
      (n) =>
        new Promise((res) => {
          calledPayloads.push(n);
          resolves.push(res);
        }),
      5,
    );

    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(f);

    await timeout(0);
    expect(calledPayloads).toEqual([0, 1, 2, 3, 4]);

    resolves.pop()();
    resolves.pop()();
    resolves.pop()();
    resolves.pop()();
    resolves.pop()();

    await timeout(0);
    expect(calledPayloads).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
