var Queue = (function() {

  function Queue(bandwidth) {
    if (typeof bandwidth !== 'undefined' && !$.isNumeric(bandwidth)) throw "number expected";

    this._bandwidth = parseInt(bandwidth || 1, 10);
    if (this._bandwidth < 1) throw "Bandwidth can\'t be less then 1";
    this._requests = [];
  };

  $.extend(Queue.prototype, {
    add: function(url, settings) {
      var request = new Request(url, settings);

      if (this._requests.length < this._bandwidth) {
        request.run();
      } else {

        $.each(this._requests, function(i, _request) {
          _request.always( request.run.bind(request) );
        });

        this._requests.shift();
      }

      this._requests.push(request);

      return request;
    }
  });

  return Queue;
})();