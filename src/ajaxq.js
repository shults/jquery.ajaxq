if (typeof $.ajaxq !== 'undefined') throw "Namespace $.ajaxq is Alread y busy.";

var _queue = new Queue();

$.ajaxq = function(url, settions) {
  return _queue.add.apply(_queue, arguments);
};

$.ajaxq.get = function() {
  throw "$.ajaxq.get is not implemented yet";
};

$.ajaxq.post = function() {
  throw "$.ajaxq.post is not implemented yet";
};

$.ajaxq.getJSON = function() {
  throw "$.ajaxq.getJSON is not implemented yet";
};

$.ajaxq.Queue = function(bandwidth) {
  return new Queue(bandwidth);
};

$.ajaxq.Request = function(url, settings) {
  return new Request(url, settings);
}