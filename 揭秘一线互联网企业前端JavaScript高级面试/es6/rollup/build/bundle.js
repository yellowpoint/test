(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

// [1, 2, 3].map(item => item + 1)


// import a from './util1.js'
// import {
//   f1,
//   f2
// } from './util2.js'

// console.log('a', a)
// f1()
// f2()


var MathHandle = function () {
  function MathHandle(x, y) {
    classCallCheck(this, MathHandle);

    this.x = x;
    this.y = y;
  }

  createClass(MathHandle, [{
    key: 'add',
    value: function add() {
      return this.x + this.y;
    }
  }]);
  return MathHandle;
}();

var m = new MathHandle(1, 33);
// console.log(m.add())

console.log(typeof MathHandle === 'undefined' ? 'undefined' : _typeof(MathHandle));
console.log(MathHandle.prototype.constructor === MathHandle);
console.log(m.__proto__ === MathHandle.prototype);

// function
// true
// true


var Anmial = function () {
  function Anmial(name) {
    classCallCheck(this, Anmial);

    this.name = name;
  }

  createClass(Anmial, [{
    key: 'eat',
    value: function eat() {
      console.log(this.name + 'eat');
    }
  }]);
  return Anmial;
}();

var Dog = function (_Anmial) {
  inherits(Dog, _Anmial);

  function Dog(name) {
    classCallCheck(this, Dog);

    //将name传上去
    var _this = possibleConstructorReturn(this, (Dog.__proto__ || Object.getPrototypeOf(Dog)).call(this, name));

    _this.name = name;
    return _this;
  }

  createClass(Dog, [{
    key: 'say',
    value: function say() {
      console.log(this.name + 'say');
    }
  }]);
  return Dog;
}(Anmial);

var dog = new Dog('哈士奇');
dog.eat();
dog.say();

var loadImg = function loadImg(src) {
  return new Promise(function (resolve, reject) {
    var img = document.createElement('img');
    img.onload = function () {
      resolve(img);
    };
    img.onerror = function () {
      reject();
    };
    img.src = src;
  });
};
var src = "http://img.mukewang.com/5cfd310f098d320701020102-160-160.jpg";
var result = loadImg(src);
result.then(function (res) {
  console.log(res.width);
}).catch(function (err) {
  console.log('出错了');
});
result.then(function (res) {
  console.log(res.height);
}).catch(function (err) {
  console.log('出错了2');
});

})));
