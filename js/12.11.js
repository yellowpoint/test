// let arr = [1, 2, 4, 2, 1, 3, 6, 12, 14, 12]
var arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a',
'a',{},{}];
function fn(arr) {
  let res = []
  let obj = {}
  arr.forEach(item => {
    if (!obj[item]) {
      obj[item] = 1
      res.push(item)
    }
  });
  return res
}
function unique(array) {
  var obj = {};
  return array.filter(function(item, index, array){
      console.log(typeof item + JSON.stringify(item))
      return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
  })
}
function unique2(a){
  return [...new Set(a)]
}

console.log(unique2(arr))

