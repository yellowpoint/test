// export default (s) => {
//   return s.split(' ').map(item => {
//     return item.split('').reverse().join('')
//   }).join(' ')
// }

export default (s) => {
  return s.split(/\s/g).map(item => {
    return item.split('').reverse().join('')
  }).join(' ')
}

// export default (s) => {
//   return s.match(/[\w']+/g).map(item => {
//     return item.split('').reverse().join('')
//   }).join(' ')
// }
