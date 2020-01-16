// 实现同时多次调用一个异步方法时只执行一次异步操作 https://juejin.im/post/5dbd2c426fb9a020594d12ee
let decryptIdPromise = null;

// 解密id
const decryptId = () => {
  if (!decryptIdPromise) {
    decryptIdPromise = sleep(2000);
  }
  return decryptIdPromise;
};

// 接口请求1
const request1 = async () => {
  let decryptedId = await decryptId();
  // ...
  console.log(111111)
};

// 接口请求2
const request2 = async () => {
  let decryptedId = await decryptId();
  // ...
  console.log(222222)
};

function sleep(second) {
  console.log('sleep')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(' enough sleep~');
    }, second);
  })
}
// 页面初始化后
request1();
setTimeout(() => {
  request2();
}, 1000)