/* eslint-disable camelcase */
// 696. 计数二进制子串
export default (s) => {
  let result = []
  // 返回符合条件的数组
  let match = (str) => {
    let matchR = []
    for (let i = 1, len = str.length; i < len; i++) {
      let strr = str.slice(0, i + 1)
      let rr = match2(strr)
      if (rr) {
        matchR.push(strr)
      }
    }
    return matchR
  }

  function match2 (str) {
    let str_1 = str[0]
    let str_2 = ''
    for (let i = 1, len = str.length; i < len; i++) {
      if (str[i] !== str_1) {
        str_2 = str[i]
        break
      }
    }

    if (!str_2) {
      return false
    }
    let str1_len = str.match(new RegExp(str_1, 'g')).length
    let str2_len = str.match(new RegExp(str_2, 'g')).length
    if (str1_len !== str2_len) {
      return false
    }
    let junction1 = str_1 + str_2
    let junction2 = str_2 + str_1
    let junction1_len = str.match(new RegExp(junction1, 'g'))
    let junction2_len = str.match(new RegExp(junction2, 'g'))
    if ((junction1_len && !junction2_len) || (!junction1_len && junction2_len)) {
      return true
    }
    return false
  }
  for (let i = 0, len = s.length; i < len - 1; i++) {
    let r = match(s.slice(i))
    result = result.concat(r)
  }
  // result = Array.from(new Set(result))
  return result.length
}
/*
1.分析找出规律
  a.给出的例子的结果
  “0011”，“01”，“1100”，“10”，“0011” 和 “01”。

2.写流程的伪代码
  起始位置每次加一，在这里面，再去判断是否有符合的
  for(let i=0,len=s.length;i<len-1;i++){
   r = match(s.slice(i))
   if(r){
     result.push(r)
   }
  }
3.完善真实代码

splice是起始位置 和数量 原数组改变
slice是起始位置和结束位置，（包括 begin，不包括end）原始数组不会被改变。
*/
