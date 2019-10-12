// 682. 棒球比赛
/**
 * @param {string[]} ops
 * @return {number}
 */
var calPoints = function (ops) {
  let scoreboard = []
  ops.forEach((item, index) => {
    if (item === 'C' && scoreboard.length) {
      scoreboard.pop()
    }
    if (item === 'D' && scoreboard.length) {
      console.log('item', item, scoreboard)
      scoreboard.push(scoreboard[scoreboard.length - 1] * 2)
    }
    if (item === '+') {
      scoreboard.push(scoreboard[scoreboard.length - 1] + scoreboard[scoreboard.length - 2])
    }
    if (/^-?\d+$/.test(Number(item))) {
      scoreboard.push(Number(item))
    }
  })
  console.log('scoreboard', scoreboard)
  return scoreboard.reduce((accumulator, currentValue) => accumulator + currentValue)
}
let result = calPoints(['5', '-2', '4', 'C', 'D', '9', '+', '+'])
console.log(result)

let a = [1, 2, 3]
a.forEach(item => {
  if (item === 2) {
    return
  }
  console.log('aaa', item)
})
