/**
 * @type {Function}
 */
var slice = Array.prototype.slice;

/**
 * @type {Function}
 */
var noop = function() {};

/**
 * Copy of jQuery function
 * @type {Function}
 */
var isNumeric = function(obj) {
  return !$.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
}

/**
 * @type {Function}
 */
var isObject = function(obj) {
  return "[object Object]" === Object.prototype.toString.call(obj);
}

