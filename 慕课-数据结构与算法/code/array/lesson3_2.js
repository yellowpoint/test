// 605. 种花问题
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
export default (arr, n) => {
  let tem = []
  let maxFlower = 0
  let result = false
  tem = arr.join('').split('1')
  if (n === 0) {
    return true
  }
  console.log('tem', tem)
  for (let i = 0, len = tem.length, cLength = 0; i < len; i++) {
    cLength = 0
    if (len === 1) {
      cLength = tem[i].length
    } else {
      if (i === 0 || i === len - 1) {
        if (tem[i].length) {
          cLength = tem[i].slice(1).length
        }
      } else {
        if (tem[i].length > 2) {
          cLength = tem[i].slice(2).length
        }
      }
      console.log('cLength', i, cLength)
    }

    let cMax = Math.ceil(cLength / 2)
    maxFlower += cMax
    if (n <= maxFlower) {
      result = true
      break
    }
  }

  return result
}
