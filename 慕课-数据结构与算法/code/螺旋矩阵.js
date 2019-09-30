export default (arr) => {
  let map = (arr, r = []) => {
    console.log('00', JSON.stringify(arr))
    // 需要清理空数组，pop产生的
    for (let i = 0, len = arr.length; i < len; i++) {
      if (!arr[i].length) {
        arr.splice(i, 1)
        i--
        len = arr.length
      }
    }
    for (let i = 0, len = arr.length; i < len; i++) {
      if (i === 0) {
        r = r.concat(arr[i])
      } else if (i === len - 1) {
        r = r.concat(arr[i].reverse())
      } else {
        r.push(arr[i].pop()) // 会产生空数组
      }
    }
    console.log('00r', JSON.stringify(r))
    arr.shift()
    arr.pop()
    // 需要清理空数组，pop产生的
    for (let i = 0, len = arr.length; i < len; i++) {
      if (!arr[i].length) {
        arr.splice(i, 1)
        i--
        len = arr.length
      }
    }

    console.log('11', JSON.stringify(arr))
    if (arr.length) {
      for (let i = arr.length - 1; i >= 0; i--) {
        r.push(arr[i].shift())
      }
    }

    if (arr.length) {
      return map(arr, r)
    } else {
      return r
    }
  }
  return map(arr, [])
}
