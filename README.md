# jquery.ajaxq

jQuery plugin for AJAX queueing.
This extension can be used also with Zepto.js.

## Usage 

### $.ajaxq 

```javascript

  // siagnatures 
  // $.ajaxq(url, [settings])
  // $.ajaxq(settings)
  // $.ajaxq always returns $.ajaxq.Request
  
  var 
    req1 = $.ajaxq({
      url: '/url1',
      type: 'post'
    }),
    
    req2 = $.ajaxq({
      url: '/url2',
      type: 'get',
      dataType: 'json'
    }),

    req3 = $.ajaxq({
      url: '/url3'
    });

    req1.done(function() { /** do something on success */})
    req2.abort();
    req3.faild(function() { /** do something on fail */})

```
