var Request = (function (argument) {

  function Request(url, settings) {
    this._aborted   = false;
    this._jqXHR     = null;
    this._calls     = {};
    this._args      = [url, settings];
    this._deferred  = $.Deferred();
    this.readyState = 1;
  }

  var proto = Request.prototype;

  $.extend(proto, {

    // start jqXHR by calling $.ajax
    run: function() {
      var 
        deferred = this._deferred,
        methodName, argsStack, i;

      if (this._jqXHR !== null) {
        return this._jqXHR;
      }
      // clreate new jqXHR object
      this._jqXHR = $.ajax.apply($, this._args);

      this._jqXHR.done(function() {
        deferred.resolve.apply(deferred, arguments);
      });

      this._jqXHR.fail(function() {
        deferred.reject.apply(deferred, arguments);
      });

      if (this._aborted) {
        this._jqXHR.abort(this.statusText);
      }
      
      // apply buffered calls 
      for (methodName in this._calls) {
        argsStack = this._calls[methodName];
        for (var i in argsStack) {
          this._jqXHR[methodName].apply(this._jqXHR, argsStack[i]);
        }
      }

      return this._jqXHR;
    },

    // returns original jqXHR object if it exists 
    // or writes to callected method to _calls and returns itself
    _call: function(methodName, args) {
      if (this._jqXHR !== null) {
        return this._jqXHR[methodName].apply(this._jqXHR, args);
      }

      this._calls[methodName] = this._calls[methodName] || [];
      this._calls[methodName].push(args);

      return this;
    },

    // returns original jqXHR object if it exists 
    // or writes to callected method to _calls and returns itself
    abort: function(statusText) {
      if (this._jqXHR !== null) {
        var
          self = this, 
          _copyProperties = ['readyState', 'status', 'statusText'],
          _return = this._jqXHR.abort.apply(this._jqXHR, arguments);

        $.each(_copyProperties, function(i, prop) {
          self[prop] = _return[prop];
        });

        return _return;
      }

      this.statusText = statusText || 'abort';
      this.status     = 0;
      this.readyState = 0;
      this._aborted   = true;

      return this;
    },
    state: function() {
      if (this._jqXHR !== null) {
        return this._jqXHR.state.apply(this._jqXHR, arguments);
      }
      return 'pending';
    }
  });

  // each method returns self object
  var _chainMethods = ['setRequestHeader', 'overrideMimeType', 'statusCode',
    'done', 'fail', 'progress', 'complete', 'success', 'error', 'always' ];

  $.each(_chainMethods, function(i, methodName) {
    proto[methodName] = function() {
      return this._call(methodName, slice.call(arguments));
    }
  });

  var _nullMethods = ['getResponseHeader', 'getAllResponseHeaders'];

  $.each(_nullMethods, function(i, methodName) {
    proto[methodName] = function() {
      // apply original method if _jqXHR exists
      if (this._jqXHR !== null) {
        return this._jqXHR[methodName].apply(this, arguments);
      }

      // return null if origina method does not exists
      return null;
    };
  });

  var _promiseMethods = ['pipe', 'then', 'promise'];

  $.each(_promiseMethods, function(i, methodName) {
    proto[methodName] = function() {
      return this._deferred[methodName].apply(this._deferred, arguments);
    };
  });

  return Request;
})()