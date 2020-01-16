

const pipeline = (targetFunction, shouldCacheResult = false) => {
  let promiseResult = null,
    startedPromise = null;

  return () => {
    if (shouldCacheResult && promiseResult) {
      return Promise.resolve(promiseResult);
    }

    if (!startedPromise) {
      startedPromise = new Promise((resolve, reject) => {
        targetFunction()
          .then(result => {
            shouldCacheResult && result && (promiseResult = result);
            resolve(result);
          })
          .catch(error => reject(error))
          .finally(() => {
            startedPromise = null;
          });
      });
    }

    return startedPromise;
  };
};

// 解密id
// let decryptIdPromise = null;
// const decryptId = () => {
//   if (!decryptIdPromise) {
//     decryptIdPromise = sleep(2000).then(response => {
//       decryptIdPromise = null;
//       return response
//     });
//   }
//   return decryptIdPromise;
// };

const decryptId = pipeline(
  () => sleep(2000).then(response => response),
  true
);

function sleep(second) {
  console.log('sleep')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(' enough sleep~');
    }, second);
  })
}





// export {
//   decryptId
// }

module.exports = decryptId