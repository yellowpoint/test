/* global $ */
$(document).ready(function () {
  'use strict';

  $('.exposed').each(function (i, el) {
    var $el = $(el);
    var $pre = $('<pre>').insertAfter($el).append($('<code>').text($el.text()));
  });

  $('pre code').each(function(i, $block) {
    hljs.highlightBlock($block);
  });

});
