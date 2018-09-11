const assert = require('assert');
const asyncLimit = require('..');

const $timeout = (n) => new Promise(res => setTimeout(res, n));

describe('asyncLimit', () => {
  it('should call only 5 async calls at a time', async () => {
    let called = 0;
    const finishTriggers = [];

    const f = asyncLimit(() => new Promise(res => {
      called++;
      finishTriggers.push(res)
    }), 5);

    [1,2,3,4,5,6,7,8,9,10,11].forEach(f);
    assert.equal(called, 5);
    finishTriggers.pop()();
    finishTriggers.pop()();
    finishTriggers.pop()();
    finishTriggers.pop()();
    finishTriggers.pop()();

    await $timeout(0);
    assert.equal(called, 10);
  });
});
