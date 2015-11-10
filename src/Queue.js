var Queue = (function() {

  var _params = {}, _queueCounter = 0;

  function _runNext(queue, request) {
    var
      removeIndex = _getStarted(queue).indexOf(request),
      nextRequest = _getPending(queue).shift();

    if (removeIndex !== -1) {
      _getStarted(queue).splice(removeIndex, 1);
    }

    if (typeof nextRequest !== 'undefined') {
      nextRequest
        .always($.proxy(_runNext, null, queue, nextRequest))
        .run();
    }
  }

  function _ajax(queue, request) {
    if (_getStarted(queue).length < _getBandwidth(queue)) {
      _getStarted(queue).push(request);
      request.always($.proxy(_runNext, null, queue, request));
      request.run();
    } else {
      _getPending(queue).push(request)
    }
  }

  function _getParams(queue) {
    return _params[queue.id] || (_params[queue.id] = {});
  }

  function _getParam(queue, name) {
    return _getParams(queue)[name];
  }

  function _getStarted(queue) {
    return _getParams(queue).started || (_getParams(queue).started = []);
  }

  function _getPending(queue) {
    return _getParams(queue).pending || (_getParams(queue).pending = []);
  }

  function _setBandwidth(queue, bandwidth) {
    if ((bandwidth = parseInt(bandwidth || 1, 10)) < 1) throw "Bandwidth can\'t be less then 1";
    _getParams(queue).bandwidth = bandwidth;
  }

  function _getBandwidth(queue, bandwidth) {
    return _getParams(queue).bandwidth;
  }

  function Queue(bandwidth) {
    if (typeof bandwidth !== 'undefined' && !isNumeric(bandwidth)) throw "number expected";
    this.id = ++_queueCounter;
    _setBandwidth(this, bandwidth);
  };

  $.extend(Queue.prototype, {
    ajax: function(url, settings) {
      var request = new Request(url, settings);
      _ajax(this, request);
      return request;
    },
    getJSON: function ( url, data, callback ) {
      return this.get( url, data, callback, "json" );
    },
    getBandwidth: function() {
      return _getBandwidth(this);
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
