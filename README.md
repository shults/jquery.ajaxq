# jquery.ajaxq

jQuery plugin for AJAX queueing.
This extension can be used also with Zepto.js.

## Usage documentation

### $.ajaxq(url, [settings])
  url - request url


### $.ajaxq([settings])

Method **$.ajaxq** always return $.ajaxq.Request instance.

Behaves like $.ajax, but all the queries will be executed in strict sequence.
The second request will be started only after finishing first one.

```javascript
  
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

    req1.done(function() { /** do something on success */ })
    req2.abort();
    req3.fail(function() { /** do something on fail */ })

```

### $.ajaxq.get
Throws exception. Is not implemented yet.

```javascript
  // Throws exception. Is not implemented yet.
```

### $.ajaxq.post
Throws exception. Is not implemented yet.

```javascript
  // Throws exception. Is not implemented yet.
```

### $.ajaxq.getJSON( url [[,data], callback] )


Like jQuery.getJSON 

```javascript
  // Throws exception. Is not implemented yet.
```

### $.ajaxq.Request(url, [settings])
### $.ajaxq.Request(settings)

Method signature looks like jQuery.ajax:

Creates new $.ajaxq.Request instance.
Which has all the methods that jqXHR (promised object) has.
In addition new created object has method `run()` which starts execution of query.

```javascript

  var req = $.ajaxq.Request({
    url: '/',
    success: function() { /** do something */ }
  });

  console.log(req.status);

  req.run(); // only after that $.ajax will be executed

```

### $.ajaxq.Queue

Method signature $.ajaxq.Queue([bandwidth])

**bandwidth** - number of concurrent runable requests.
Creates new $.ajaxq.Queue instance.

```javascript
  
  // queues are independent one from another
  var 
    imagesQueue = $.ajaxq.Queue(1),
    postsQueue  = $.ajaxq.Queue(2);

  var 
    // firs img request will be started at once
    img1 = imagesQueue.ajax({
      url: '/img1.png'
    }),
    // second will be started after finishing first
    img2 = imagesQueue.ajax({
      url: '/img2.png'
    }),

    // the first and the second post queries will be started simultaneously
    post1 = postsQueue.ajax({
      url: '/post/1.json'
    }),
    post2 = postsQueue.ajax({
      url: '/post/2.json'
    }),

    // the third request fil be started after finishing one of (the first or the second)
    post3 = postsQueue.ajax({
      url: '/post/3.json'
    });

```
