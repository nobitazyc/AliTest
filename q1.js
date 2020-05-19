let promise1 = new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 100);
  });
  let promise2 = new Promise(resolve => {
    setTimeout(() => {
      resolve(2);
    }, 100);
  });
  Promise.race = promises => {
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject);
      });
    });
  };
  Promise.race([promise1, promise2]).then(data => console.log(data));
  