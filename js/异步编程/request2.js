const decryptId = require('./promise');
// 接口请求1
const request2 = async () => {
  let decryptedId = await decryptId();
  // ...
  console.log(22222)
};
module.exports = request2