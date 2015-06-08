;(function(root) {
  'use strict';

  var $ = root.jQuery || root.Zepto || root.$;

  if (typeof $ === 'undefined') throw 'jquery.ajaxq requires jQuery or jQuery-compatible library (e.g. Zepto.js)';

  /**
   * @type {Function}
   */
  var slice = Array.prototype.slice;

  var Request = (function (argument) {
  
  
    /**
  
    var AjaxQueueItem = (function () {
  
      function AjaxQueueItem() {
        this._aborted = false;
        this._jqXHR = null;
        this._events = {};
        this._args = slice.call(arguments);
      }
  
      AjaxQueueItem.prototype.run = function () {
        if (this._jqXHR !== null) return this;
  
        this._jqXHR = $.ajax.apply($.ajax, this._args);
  
        for (var eventType in this._events) {
          for (var i in this._events[eventType]) {
            this._jqXHR[eventType].apply(this._jqXHR, this._events[eventType][i]);
          }
        }
  
        return this;
      };
  
      
       * Serve event in private _event object or transmit them internal jqXHR object.
       * @param {String} type event type e.g. done, fail or always
       * @param {{}} args arguments object
       * @private
       
      AjaxQueueItem.prototype._pushEvent = function(type, args) {
        if (this._jqXHR === null) {
          this._pushEvent(type, args);
        } else {
          this._jqXHR[type].apply(this._jqXHR, args);
        }
        return this;
      };
  
      $.each(
        ['abort', 'done', 'fail', 'then', ''],
        function(methodName, value) {
          AjaxQueueItem.prototype[methodName] = function() {
            return this._pushEvent(methodName, arguments);
          };
        }
      );
  
  
  
      return AjaxQueueItem;
    })();
  
    */
  
    function Request(url, settings) {
      this._aborted = false;
      this._jqXHR   = null;
      this._events  = {};
      this._args    = [url, settings];
    }
  
    var xhrMethods = [
      "readyState", 
      "getResponseHeader", 
      "getAllResponseHeaders", 
      "setRequestHeader", 
      "overrideMimeType", 
      "statusCode", 
      "abort", 
      "state", 
      "always", 
      "then", 
      "promise", 
      "pipe", 
      "done", 
      "fail", 
      "progress", 
      "complete", 
      "success", 
      "error"
    ];
  
    /*
      Object { name="readyState",  type="number"} // return 1
  
      Object { name="getResponseHeader",  type="function"} // returns null
      Object { name="getAllResponseHeaders",  type="function"} // returns null
      
      Object { name="abort",  type="function"} // (status) returns this; setStatus status=0,  statusText="abort" 
      Object { name="state",  type="function"} // return 'pending'; //state()
      Object { name="always",  type="function"} // return this
      Object { name="then",  type="function"} // takes several arguments and returns some dofficult structure
      Object { name="promise",  type="function"} // takes one argument and returns object like `then` method 
      Object { name="pipe",  type="function"} // like `then`
      
      Object { name="setRequestHeader",  type="function"} // return this
      Object { name="overrideMimeType",  type="function"} // return this
      Object { name="statusCode",  type="function"} // returns this
      Object { name="done",  type="function"} // returns this 
      Object { name="fail",  type="function"} // return this
      Object { name="progress",  type="function"} // return this
      Object { name="complete",  type="function"} // return this
      Object { name="success",  type="function"} // returns this
      Object { name="error",  type="function"} // returns this
    */
  
    $.extend(Request.prototype, {
      run: function() {
        throw "Chuj!";
      }
    });
  
    return Request;
  })()

  
})(this);