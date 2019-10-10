// 605. 种花问题
/**
 * @param {number[]} flowerbed
 * @param {number} n
 * @return {boolean}
 */
export default (arr, n) => {
  let num1 = 0
  let len = arr.length
  let maxFlower = len % 2 === 0 ? len / 2 : len / 2 + 1
  arr.forEach(item => {
    if (item === 1) {
      num1++
    }
  })
  if (num1 + n > maxFlower) {
    return false
  }
  return true
}
