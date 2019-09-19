// 车
class Car {
  constructor(num) {
    this.num = num
  }
}

// 摄像头
class Camera {
  shot(car) {
    return {
      num: car.num,
      inTime: Date.now()
    }
  }
}

// 出口显示屏
class Screen {
  show(car, inTime) {
    return Date.now() - inTime
  }
}

// 停车场
class Park {
  constructor(floors) {
    this.floors = floors || []
    this.camera = new Camera
    this.screen = new Screen
    this.carList = {} //存储摄像头拍摄返回的车辆信息
  } 
  in (car) {
    // 通过摄像头获取信息
    const info = this.camera.shot(car)
    // 停到某个车位
    const i = parseInt(Math.random() * 100 % 100)
    const place = this.floors[0].place[i]
    place.in()
    //此处可以判断每层的数量，给一个数量最少的，
    // 不对啊，应该是 车停了之后才知道车位的啊
    info.floor = 0
    info.place = place
    // 记录信息
    this.carList[car.num] = info
  }
  out(car) {
    // 获取信息
    const info = this.carList[car.num]
    // 将停车位清空
    const place = info.place
    place.out()
    // 显示时间
    this.screen.show(car, info.inTime)
    // 清空记录
    delete this.carList[car.num]
  }
  emptyNum() {
    return this.floors.map(f => {
      return `第${f.index}层还有${f.emptyPlaceNum()}个剩余车位`
    }).join('\n')
  }
}

// 层
class Floor {
  constructor(index, places) {
    this.index = index
    this.places = places || []
  }
  emptyPlaceNum() {
    let num = 0;
    this.places.forEach(p => {
      if (p.empty) {
        num++
      }
    });
    return num
  }
}

// 车位
class Place {
  constructor() {
    this.empty = true
  } 
  in () {
    this.empty = false
  }
  out() {
    this.empty = true
  }
}



const floors = []
for(let i = 0; i < 3; i++){
  const place = []
  for(let j = 0; j < 100; j++){
    place[j] = new Place()
  }
  floors[i] = new Floor(i++, place)
}
const park = new Park(floors)

const car1 = new Car(100)
const car2 = new Car(200)
const car3 = new Car(300)

console.log('第一辆车进入')
console.log(park.emptyNum())
park.in(car1)
console.log('第二辆车进入')
console.log(park.emptyNum())
park.in(car2)
console.log('第一辆车离开')
park.out(car1)
console.log('第二辆车离开')
park.out(car2)

console.log('第三辆车进入')
console.log(park.emptyNum())
park.in(car3)
console.log('第三辆车离开')
park.out(car3)