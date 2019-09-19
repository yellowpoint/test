(function (window) {
  var jQuery = function (seletor) {
    return new jQuery.fn.init(seletor)
  }

  jQuery.fn = {
    css: function (key, value) {
      return 'css'
    },
    html: function (key, value) {
      return 'html'
    }
  }

  var init =jQuery.fn.init = function (seletor) {
    var slice = Array.prototype.slice
    var dom = slice.call(document.querySelectorAll(seletor))
    var i, len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    this.seletor = seletor || ''
  }
  init.prototype = jQuery.fn
  console.log(jQuery.fn.init.prototype.css)
  window.$ = jQuery
 
})(window);


;
(function () {
  var f1 = f2 = function () {
    console.log(1111)
  }
  f1.prototype = {
    a: 1
  }
  
  console.log(f2.prototype)

})()