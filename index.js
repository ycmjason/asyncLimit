module.exports = (fn, max) => {
  if (typeof fn !== 'function') {
    throw new TypeError('asyncLimit: expects 1st argument to be a function');
  }

  if (typeof max !== 'number') {
    throw new TypeError('asyncLimit: expects 2nd argument to be a number');
  }

  const semaphore = Semaphore(max);

  return async function () {
    await semaphore.acquire();
    const result = await fn.apply(this, arguments);
    semaphore.release();
    return result;
  };
};

const Semaphore = (max) => {
  const pendings = [];
  return {
    acquire: async () => {
      while (pendings.length >= max) {
        await Promise.race(pendings.map(({ promise }) => promise));
      }
      pendings.push(InsideOutPromise());
    },
    release: () => pendings.shift()?.resolve(),
  };
};

const InsideOutPromise = () => {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
};
