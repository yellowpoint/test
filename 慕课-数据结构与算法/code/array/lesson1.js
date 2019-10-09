// 17. 电话号码的字母组合
export default (str) => {
  let map = ['', 1, 'abc', 'def', 'ghi', 'jkl', 'mno', 'pqrs', 'tuv', 'wxyz']
  let num = str.split('')
  let code = []
  num.forEach(item => {
    if (map[item]) {
      code.push(map[item])
    }
  })
  if (!code.length) {
    return []
  }
  if (code.length === 1) {
    return code[0].split('')
  }
  let comb = (arr) => {
    let tmp = []
    if (typeof arr[0] === 'string') {
      arr[0] = arr[0].split('')
    }
    if (typeof arr[1] === 'string') {
      arr[1] = arr[1].split('')
    }
    arr[0].forEach(i => {
      arr[1].forEach(j => {
        tmp.push(`${i}${j}`)
      })
    })
    arr.splice(0, 2, tmp)
    if (arr.length > 1) {
      return comb(arr)
    } else {
      return tmp
    }
  }

  return comb(code)
}
