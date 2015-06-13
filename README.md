# jquery.ajaxq

jQuery plugin for AJAX queueing.
This extension can be used also with Zepto.js.

## Usage 

### $.ajaxq 

Behaves like $.ajax, but all the queries will be executed in strict sequence.
The second request will be started only after finishing first one.

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

### $.ajaxq.getJSON
Throws exception. Is not implemented yet.

```javascript
  // Throws exception. Is not implemented yet.
```

### $.ajaxq.Request

Method signature (like jQuery.ajax):

  - $.ajaxq.Request(url, [settings]);
  - $.ajaxq.Request(settings);

Creates new $.ajaxq.Request instance.
Which has all the methods that jqXHR (promised object) has.
In addition new created object has method `run()` which starts execution of query.

```javascript

  var req = $.ajaxq.Request({
    url: '/',
    success: function() { /** do something */}
  });

  console.log(req.status);

  req.run(); // only after that $.ajax will be executed

```

### $.ajaxq.Queue

Method signature $.ajaxq.Queue(bandwidth)
`bandwidth` - number of concurrent runable requests.
Creates new $.ajaxq.Queue instance.

```javascript
  
  // queues are independent one from another
  var 
    imagesQueue = $.ajaxq.Queue(1),
    postsQueue  = $.ajaxq.Queue(2);

  var 
    // firs img request will be started at once
    img1 = imagesQueue.add({
      url: '/img1.png'
    }),
    // second will be started after finishing first
    img2 = imagesQueue.add({
      url: '/img2.png'
    }),

    // the first and the second post queries will be started simultaneously
    post1 = postsQueue.add({
      url: '/post/1.json'
    }),
    post2 = postsQueue.add({
      url: '/post/2.json'
    }),

    // the third request fil be started after finishing one of (the first or the second)
    post3 = postsQueue.add({
      url: '/post/3.json'
    });

```
