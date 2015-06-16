if (typeof $.ajaxq !== 'undefined') throw "Namespace $.ajaxq is Alread y busy.";

var _queue = new Queue();

$.ajaxq = function(url, settions) {
  return _queue.ajax.apply(_queue, arguments);
};

$.each(['get', 'post', 'getJSON'], function(i, methodName) {
  $.ajaxq[methodName] = function() {
    return _queue[methodName].apply(_queue, arguments);
  }
});

$.ajaxq.Queue = function(bandwidth) {
  return new Queue(bandwidth);
};

$.ajaxq.Request = function(url, settings) {
  return new Request(url, settings);
}