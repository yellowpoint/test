// 02 优化有序标记 isSorted ，如果第二层循环中没有做交换的话则此时数组已排好序，直接跳出大循环
// function sort(arr) {
//   const len = arr.length

//   for (let i = 0; i < len - 1; i++) {
//     //有序标记，每一轮的初始值都是true
//     let isSorted = true
//     for (let j = 0; j < len - 1 - i; j++) {
//       if (arr[j] > arr[j + 1]) {
//         let temp = arr[j + 1]
//         arr[j + 1] = arr[j]
//         arr[j] = temp
//         //因为有元素进行交换，所以不是有序的，标记变为false
//         isSorted = false
//       }
//     }
//     if (isSorted) {
//       break
//     }
//   }
//   return arr
// }

// 上面的办法缺陷在于，如213789，前面部分无序，循环时会触发交换使得isSorted为false，
// 但是其后面有部分是有序的，下面优化就是找到有序区的边界
// （那要是中间部分有序呢？如213789213）
// 03 优化交换位置 sortBorder
// function sort(arr) {
//   const len = arr.length
//   let lastExchangeIndex = 0
//   for (let i = 0; i < len - 1; i++) {
//     let sortBorder = len - 1
//     //有序标记，每一轮的初始值都是true
//     let isSorted = true
//     for (let j = 0; j < sortBorder; j++) {
//       if (arr[j] > arr[j + 1]) {
//         let temp = arr[j + 1]
//         arr[j + 1] = arr[j]
//         arr[j] = temp
//         //因为有元素进行交换，所以不是有序的，标记变为false
//         isSorted = false
//         lastExchangeIndex = j
//       }
//     }
//     sortBorder = lastExchangeIndex
//     if (isSorted) {
//       break
//     }
//   }
//   return arr
// }


// 04 鸡尾酒排序 处理如[2,3,4,5,6,7,8,1]

// function sort(arr) {
//   const len = arr.length
//   for (let i = 0; i < len / 2; i++) {
//     //有序标记，每一轮的初始值都是true
//     let isSorted = true
//     //奇数轮，从左向右比较和交换
//     for (let j = i; j < len - 1 - i; j++) {
//       if (arr[j] > arr[j + 1]) {
//         let temp = arr[j + 1]
//         arr[j + 1] = arr[j]
//         arr[j] = temp
//         //因为有元素进行交换，所以不是有序的，标记变为false
//         isSorted = false
//       }
//     }
//     if (isSorted) {
//       break
//     }
//     // 在偶数轮之前，将isSorted重新标记为true
//     isSorted = true
//     for (let j = len - 1 - i; j > i; j--) {
//       if (arr[j] < arr[j - 1]) {
//         let temp = arr[j - 1]
//         arr[j - 1] = arr[j]
//         arr[j] = temp
//         //因为有元素进行交换，所以不是有序的，标记变为false
//         isSorted = false
//       }
//     }
//     if (isSorted) {
//       break
//     }
//   }
//   return arr
// }


// 05 鸡尾酒加有序区优化
function sort(arr) {
  const len = arr.length
  let lastExchangeIndex_left = 0
  let lastExchangeIndex_right = len - 1
  for (let i = 0; i < len / 2; i++) {
    let sortBorder_left = 0
    let sortBorder_right = len - 1
    //有序标记，每一轮的初始值都是true
    let isSorted = true
    //奇数轮，从左向右比较和交换
    for (let j = i; j < sortBorder_right; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j + 1]
        arr[j + 1] = arr[j]
        arr[j] = temp
        //因为有元素进行交换，所以不是有序的，标记变为false
        isSorted = false
        lastExchangeIndex_left = j
      }
    }
    sortBorder_right = lastExchangeIndex_left
    if (isSorted) {
      break
    }
    // 在偶数轮之前，将isSorted重新标记为true
    isSorted = true
    for (let j = len - 1 - i; j > sortBorder_left; j--) {
      if (arr[j] < arr[j - 1]) {
        let temp = arr[j - 1]
        arr[j - 1] = arr[j]
        arr[j] = temp
        //因为有元素进行交换，所以不是有序的，标记变为false
        isSorted = false
        lastExchangeIndex_right = j
      }
    }
    sortBorder_left = lastExchangeIndex_right
    if (isSorted) {
      break
    }
  }
  return arr
}
const testArr = [55, 4, 6, 78, 8, 9, 1, 3]
console.log("TCL: sort(testArr)", sort(testArr))

// 冒泡排序
// 1.基础版
// 2.基础版+有序标记
// 3.基础版+有序标记+记录交换位置
// 4.鸡尾酒+有序标记
// 5.鸡尾酒+有序标记+记录交换位置