var Queue = (function() {

  function Queue(bandwidth) {
    if (typeof bandwidth !== 'undefined' && !$.isNumeric(bandwidth)) throw "number expected";

    this._bandwidth = parseInt(bandwidth || 1, 10);
    if (this._bandwidth < 1) throw "Bandwidth can\'t be less then 1";
    this._requests = [];
  };

  $.extend(Queue.prototype, {
    ajax: function(url, settings) {
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
    },
    getJSON: function ( url, data, callback ) {
      return this.get( url, data, callback, "json" );
    }
  });

  $.each(['get', 'post'], function(i, method) {
    Queue.prototype[method] = function( url, data, callback, type ) {
      // shift arguments if data argument was omitted
      if ( $.isFunction( data ) ) {
        type = type || callback;
        callback = data;
        data = undefined;
      }

      return this.ajax({
        url: url,
        type: method,
        dataType: type,
        data: data,
        success: callback
      });
    }
  });

  return Queue;
})();