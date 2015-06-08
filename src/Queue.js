var Queue = (function() {

  function Queue(bandwidth) {
    this._bandwidth = parseInt(bandwidth || 1, 10);
    if (this._bandwidth < 1) throw "Bandwidth can\'t be less then 1";
  };

  $.extend(Queue.prototype, {
    add: function() {
      
    }
  });

  return Queue;
})();