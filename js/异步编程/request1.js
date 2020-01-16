const decryptId = require('./promise');
// 接口请求1
const request1 = async () => {
  let decryptedId = await decryptId();
  // ...
  console.log(1111)
};
module.exports = request1