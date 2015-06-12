describe('Request', function () {

  var _chainMethods = {
        'setRequestHeader': ['dummy', 'dummy/html'],
        'overrideMimeType': [],
        'statusCode': [],
        'done': [],
        'fail': [],
        'progress': [],
        'complete': [],
        'success': [],
        'error': [],
        'always': []
      }, 
      _nullMethods = {
        'getResponseHeader': ['not existent'],
        'getAllResponseHeaders': []
      },
      _promiseMethods = {
        'pipe': [],
        'then': [],
        'promise': []
      },
      server,
      request;

  before(function () {
    server = sinon.fakeServer.create();

    server.respondWith("GET", "/", [200, { "Content-Type": "application/json" }, '{"error": false}']);
    server.respondWith("GET", "/done", [200, { "Content-Type": "application/json" }, '{"error": false, "done": true}']);
    server.respondWith("GET", "/fail", [404, { "Content-Type": "application/json" }, '{"error": true, "fail": true}']);
  });

  after(function () {
    server.restore();
  });

  beforeEach(function () {
    request = new Request('/', {type: 'get'});
  });

  describe('#constructor', function () {

    it('creates new object', function() {
      expect(request).to.be.an.instanceof(Request);
      expect(request.readyState).to.eql(1);
    });

    it('creates internal parameters', function () {
      expect(request._aborted).to.not.be.undefined;
      expect(request._jqXHR).to.be.null;
      expect(request._calls).to.be.object;
      expect(request._args).to.be.an("array");
      expect(request._deferred).to.not.be.undefined;
    });

    it('serves income parameters', function () {
      expect(request._args).to.eql(['/', {type: 'get'}]);
    });

  });

  describe('#run', function () {
    it('create _jqXHR', function () {
      expect(request._jqXHR).to.be.null;
      request.run();
      expect(request._jqXHR).not.to.be.null;      
    });
  });

  describe('#abort', function () {
    
    describe('if not started', function () {
      
      beforeEach(function () {
        request.abort();
      });

      it('returns self ', function () {
        request = new Request('/');
        expect(request.abort()).to.eql(request);
      });

      it('sets "readyState" propery to 0', function() {
        expect(request.readyState).to.eql(0);
      });

      it('sets "status" propery to 0', function() {
        expect(request.status).to.eql(0);
      });

      it('sets "statusText" propery to "abort" first param not given', function() {
        expect(request.statusText).to.eql('abort');
      });

      it('sets "statusText" propery to the first argument if param given', function() {
        request = new Request('/');
        request.abort('some text status');
        expect(request.statusText).to.eql('some text status');
      });

      it('sets "_aborted" propery to true', function() {
        expect(request._aborted).to.be.true;
      });

      it('calls #fail on aborts', function (done) {
        var 
          doneSpy = sinon.spy(),
          failSpy = sinon.spy();

        request
          .done(doneSpy)
          .fail(failSpy)
          .always(function() {
            expect(doneSpy.called).to.be.false;
            expect(failSpy.calledOnce).to.be.true;
            done();
          });
          
        request.run();
        
        server.respond();
      });
      
    });

    describe('if started', function () {
      
      beforeEach(function () {
        request.run();
      });

      it('returns not itself', function () {
        expect(request.abort()).to.not.eql(request);
      });

      it('returns real _jqXHR object', function () {
        expect(request.abort()).to.eql(request._jqXHR);
      });

      it('changes properties [readyState, status, statusText] of proxy object to _jqXHR', function(done) {
        var 
          _jqXHR = request.abort(),
          _props = ['readyState', 'status', 'statusText'];

        $.each(_props, function(i, prop) {
          expect(request[prop]).to.equal(_jqXHR[prop]);
        });

        _jqXHR.always(function() {
          $.each(_props, function(i, prop) {
            expect(request[prop]).to.equal(_jqXHR[prop]);
          });
          done();
        });

      });

      it('calls #fail on aborts', function (done) {
        var 
          doneSpy = sinon.spy(),
          failSpy = sinon.spy();

        request
          .done(doneSpy)
          .fail(failSpy)
          .always(function() {
            expect(doneSpy.called).to.be.false;
            expect(failSpy.calledOnce).to.be.true;
            done();
          });
        request.abort();
        
        server.respond();
      });
      
    });

  });

  describe('#state', function () {

    it('returns "pending" if not started', function () {
      expect(request.state()).to.eql('pending');
    });

    it('calls "state()" on real object and return original data if started', function () {
      request.run();

      var callback = sinon.spy(request._jqXHR, 'state');

      expect(request.state()).to.eql(callback.returnValues[0]);
      expect(callback.called).to.be.true;
      expect(callback.calledOn(request._jqXHR)).to.be.true;
    });
    
  });

  describe('#_chainMethods', function () {
    
    it('return itself if run was not called', function () {
      $.each(_chainMethods, function(methodName, args) {
        expect(request[methodName]()).to.equal(request);
      });
    });

    it('returns the different object if run called', function () {
      request.run();
      $.each(_chainMethods, function(methodName, args) {
        expect(request[methodName].apply(request, args)).not.to.equal(request);
      });
    });
  });

  describe('#_nullMethods', function () {
    
    it('#returns null if not started', function () {
      $.each(_nullMethods, function(methodName, args) {
        expect(request[methodName].apply(request, args)).to.be.null;
      });
    });

    it('#applies _jqXHR method if started', function () { 

      $.each(_nullMethods, function(methodName, args) {
        request = new Request('/');
        request.run();

        var callback = sinon.spy(request._jqXHR, methodName);
        request[methodName].apply(request, args);

        expect(callback.calledOnce).to.be.true;
      });
    });
  });

  describe('#_promiseMethods', function () {

    describe('promise', function () {

      it('applies the same method at deferred object', function () {
        $.each(_promiseMethods, function(methodName, args) {
          var callback = sinon.spy(request._deferred, methodName);

          request[methodName].apply(request, args);

          expect(callback.called).to.be.true;
          expect(callback.calledOn(request._deferred)).to.be.true;
        });
      });

    });

    describe('#pipe(then)', function () {
      
      it('applies #done', function(done) {
        request = new Request('/done')
        request.run();
        request.then(function(data) {
          expect(data).to.eql({
            error: false,
            done: true
          });
          done();
        });
        server.respond();
      });

      it('applies #fail', function(done) {
        request = new Request('/fail')
        request.run();
        request.then(null, function(jqXHR) {
          expect(jqXHR.responseJSON).to.eql({
            error: true,
            fail: true
          });
          done();
        });
        server.respond();
      });

      it('applies #always', function() {
        request = new Request('/fail')
        request.run();
        request.then(null, null, function(jqXHR) {
          expect(jqXHR.responseJSON).to.eql({
            error: true,
            fail: true
          });
          done();
        });
        server.respond();
      });

    });

    describe('#done, #fail, #always', function () {

      it('calls done what were called before run', function (done) {
        request = new Request('/done');
        request.done(function(data) {
          expect(data).to.eql({
            error: false,
            done: true
          });
          done();
        });
        request.run();
        server.respond();
      });

      it('calls fail', function (done) {
        request = new Request('/fail');
        request.fail(function(jqXHR) {
          expect(jqXHR.responseJSON).to.eql({
            error: true,
            fail: true
          });
          done();
        });
        request.run();
        server.respond();
      });

      it('calls always', function (done) {
        request = new Request('/fail');
        request.always(function(jqXHR) {
          expect(jqXHR.responseJSON).to.eql({
            error: true,
            fail: true
          });
          done();
        });
        request.run();
        server.respond();
      });

    });
  });
});