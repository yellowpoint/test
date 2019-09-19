const EventEmitter = require('events').EventEmitter

const emitter1 = new EventEmitter()
// 监听 some 事件
emitter1.on('some', info => {
  console.log('fn1', info)
})
// 监听 some 事件
emitter1.on('some', info => {
  console.log('fn2', info)
})
// 触发 some 事件
emitter1.emit('some', '唉呀妈呀')


// 继承
class Dog extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
  }
}
let simon = new Dog('simon')
// 这里不能用箭头函数;function可不能随便用箭头函数简写，特别是里面有用到this的时候
simon.on('bark', function () {
  console.log(this.name, 'bark1')
})
simon.on('bark', function () {
  console.log(this.name, 'bark2')
})
simon.emit('bark')
console.log('this', this)


// stream 流  
const fs = require('fs')
const readStream = fs.createReadStream('./data/file1.txt')

let length = 0
readStream.on('data', chunk => {
  let len = chunk.toString().length
  console.log('读取中，该段长度是', len)
  length += len
})
readStream.on('end', () => {
  console.log('读取完成长度是', length)
})

// 获取文件多少行
// const fs = require('fs')
const readline = require('readline')

let rl = readline.createInterface({
  input: fs.createReadStream('./data/file1.txt')
})
let lineNum = 0
// 每一行都会执行
rl.on('line', line => {
  lineNum++
})
rl.on('close', line => {
  console.log('读取完毕，行数是', lineNum)
})