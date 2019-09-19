// [1, 2, 3].map(item => item + 1)


// import a from './util1.js'
// import {
//   f1,
//   f2
// } from './util2.js'

// console.log('a', a)
// f1()
// f2()


class MathHandle {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
  add() {
    return this.x + this.y
  }
}
const m = new MathHandle(1, 33)
// console.log(m.add())

console.log(typeof MathHandle)
console.log(MathHandle.prototype.constructor === MathHandle)
console.log(m.__proto__ === MathHandle.prototype)

// function
// true
// true



class Anmial {
  constructor(name) {
    this.name = name
  }
  eat() {
    console.log(this.name + 'eat')
  }
}
class Dog extends Anmial {
  constructor(name) {
    super(name) //将name传上去
    this.name = name
  }
  say() {
    console.log(this.name + 'say')
  }
}
const dog = new Dog('哈士奇')
dog.eat()
dog.say()


let loadImg = (src) => {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img')
    img.onload = () => {
      resolve(img)
    }
    img.onerror = () => {
      reject()
    }
    img.src = src
  })

}
let src = "http://img.mukewang.com/5cfd310f098d320701020102-160-160.jpg"
let result = loadImg(src)
result.then(res => {
  console.log('width', res.width)
}).catch(err => {
  console.log('出错了')
})
result.then(res => {
  console.log('height', res.height)
}).catch(err => {
  console.log('出错了2')
})