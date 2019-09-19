(function (window) {
  var zepto = {}

  function Z(dom, seletor) {
    var i, len = dom ? dom.length : 0;
    for (i = 0; i < len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    this.seletor = seletor || ''
  }
  zepto.Z = function (dom, seletor) {
    return new Z(dom, seletor)
  }
  zepto.init = function (seletor) {
    var slice = Array.prototype.slice
    var dom = slice.call(document.querySelectorAll(seletor))
    return zepto.Z(dom, seletor)
  }

  var $ = function (seletor) {
    return zepto.init(seletor)
  }

  window.$ = $

  $.fn = {
    css: function (key, value) {
      return 'css'
    },
    html: function (key, value) {
      return 'html'
    }
  }
  Z.prototype = $.fn
})(window)