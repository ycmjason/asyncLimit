module.exports = (fn, n) => {
  let pendings = [];
  return async function() {
    while (pendings.length >= n) {
      await Promise.race(pendings).catch(() => {});
    }

    const p = fn.apply(this, arguments);
    pendings.push(p);
    await p.catch(() => {});
    pendings = pendings.filter(pending => pending !== p);
    return p;
  };
};
