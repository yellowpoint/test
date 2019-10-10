// 914. 卡牌分组
export default (arr) => {
  if (arr.length < 2) {
    return false
  }
  arr.sort((a, b) => a - b)
  let min = Number.MAX_SAFE_INTEGER // 用系统最大值是为了在之后的比较中，第一个值肯定比它小
  let dst = []
  let result = false
  for (let i = 0, len = arr.length, tmp = []; i < len; i++) {
    tmp.push(arr[i])
    for (let j = i + 1; j < len; j++) {
      if (arr[i] === arr[j]) {
        tmp.push(arr[j])
      }
      if (arr[i] !== arr[j] || j === len - 1) {
        min = min > tmp.length ? tmp.length : min
        dst.push([].concat(tmp))
        tmp.length = 0
        i = j - 1
        break
      }
    }
  }
  console.log('dst', dst, min)
  if (min < 2) {
    return false
  }
  for (let i = 2; i <= min; i++) {
    result = dst.every(item => {
      return item.length % i === 0
    })
    if (result) {
      return result
    }
  }

  return result
}
