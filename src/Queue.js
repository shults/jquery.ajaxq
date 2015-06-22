var Queue = (function() {

  function Queue(bandwidth) {
    if (typeof bandwidth !== 'undefined' && !$.isNumeric(bandwidth)) throw "number expected";

    this._bandwidth = parseInt(bandwidth || 1, 10);
    if (this._bandwidth < 1) throw "Bandwidth can\'t be less then 1";
    
    this._started = [];
    this._queue = [];
  };

  function _runNext(request) {
    var 
      removeIndex = this._started.indexOf(request),
      nextRequest = this._queue.shift();
    
    if (removeIndex !== -1) {
      this._started.splice(removeIndex, 1);  
    }

    if (typeof nextRequest !== 'undefined') {
      nextRequest.always(_runNext.bind(this, nextRequest));
      nextRequest.run();
    }
  }

  $.extend(Queue.prototype, {
    ajax: function(url, settings) {
      var request = new Request(url, settings);

      if (this._started.length < this._bandwidth) {
        this._started.push(request);
        request.always(_runNext.bind(this, request));
        request.run();
      } else {
        this._queue.push(request);
      }

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