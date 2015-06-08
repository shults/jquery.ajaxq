;(function(root) {
  'use strict';

  var $ = root.jQuery || root.Zepto || root.$;

  if (typeof $ === 'undefined') throw 'jquery.ajaxq requires jQuery or jQuery-compatible library (e.g. Zepto.js)';

  // @include ../functions.js
  // @include ../Request.js
  // @include ../Queue.js

})(this);