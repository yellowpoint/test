// 实现同时多次调用一个异步方法时只执行一次异步操作

const request1 = require('./request1');
const request2 = require('./request2');
(async () => {
  // 页面初始化后
  await request1();
  console.log('aaaaa')
})();
(async () => {
  // 页面初始化后
  await request2();
  console.log('bbbbbb')

  // setTimeout(() => {
  //   request2();
  // }, 1000)
})()