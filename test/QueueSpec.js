describe('Queue', function () {

  var queue, server;

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
    queue = new Queue();    
  });

  describe('#constructor', function () {
    
    it('creates new object', function() {
      expect(queue).to.be.an('Object')
      expect(queue).to.be.instanceof(Queue);
    });

    it('throws error if negative number is given', function() {
      $.each([-1, -10, -2.5, "-5"], function(i, value) {
        expect(function() {
          new Queue(value);
        }).to.throw();
      });
    });

    it('throws error if invalid type is given', function () {
      $.each([Infinity], function(i, value) {
        expect(function() {
          queue = new Queue(value);
          console.log(queue);
        }).to.throw();
      });
    });
    
    it('creates queue instance with bandwidth eql 1 if not given', function() {
      expect(queue._bandwidth).to.eql(1);
    });

    describe('takes a bandwidth parameter and saves it', function() {
      
      it('if int is given', function() {
        queue = new Queue(2);
        expect(queue._bandwidth).to.eql(2);
        queue = new Queue(10);
        expect(queue._bandwidth).to.eql(10);
      });

      it('if string/float is given', function() {
        queue = new Queue("2");
        expect(queue._bandwidth).to.eql(2);
        queue = new Queue(10.1);
        expect(queue._bandwidth).to.eql(10);
      });

    });

  });

  describe('#ajax', function() {
    it('returns Request instance object', function() {
      expect(queue.ajax('/')).to.be.an.instanceof(Request);
      server.respond();
    });
  });

  describe('#get', function() {
    it('calls main method #ajax', function () {
      var ajaxSpy = sinon.spy(queue, 'ajax');

      queue.get('/');

      expect(ajaxSpy.calledWith({
        url: '/',
        type: 'get',
        dataType: undefined,
        data: undefined,
        success: undefined
      })).to.be.true
    });
  });

  describe('#post', function() {
    it('calls main mathod #ajax', function () {
      var ajaxSpy = sinon.spy(queue, 'ajax');

      queue.post('/');

      expect(ajaxSpy.calledWith({
        url: '/',
        type: 'post',
        dataType: undefined,
        data: undefined,
        success: undefined
      })).to.be.true
    });
  });

  describe('#getJSON', function() {
    it('calls #get', function () {
      var 
        getSpy = sinon.spy(queue, 'get'),
        cb = function() {}; 

      queue.getJSON('/', {a: 1}, cb);

      expect(getSpy.calledWith('/', {a: 1}, cb, 'json')).to.be.true;
    });
  });

  describe('behavior sequence tests (for bandwidth=1)', function() {

    var
      queue,  
      r1Done, r1Fail, r1Always,
      r2Done, r2Fail, r2Always,
      r3Done, r3Fail, r3Always,
      r4Done, r4Fail, r4Always,
      r5Done, r5Fail, r5Always,
      req1, req2, req3, req4, req5;

    beforeEach(function (done) {
      queue = new Queue(1), 
      
      r1Done    = sinon.spy(),
      r1Fail    = sinon.spy(),
      r1Always  = sinon.spy(),

      r2Done    = sinon.spy(),
      r2Fail    = sinon.spy(),
      r2Always  = sinon.spy(),

      r3Done    = sinon.spy(),
      r3Fail    = sinon.spy(),
      r3Always  = sinon.spy(),

      r4Done    = sinon.spy(),
      r4Fail    = sinon.spy(),
      r4Always  = sinon.spy(),

      r5Done    = sinon.spy(),
      r5Fail    = sinon.spy(),
      r5Always  = sinon.spy(function() {
        done();
      }),

      req1 = queue.ajax('/')
                    .done(r1Done)
                    .fail(r1Fail)
                    .always(r1Always),

      req2 = queue.ajax('/done')
                    .done(r2Done)
                    .fail(r2Fail)
                    .always(r2Always),

      req3 = queue.ajax('/')
                    .done(r3Done)
                    .fail(r3Fail)
                    .always(r3Always),

      req4 = queue.ajax('/fail')
                    .fail(r4Fail)
                    .done(r4Done)
                    .always(r4Always),

      req5 = queue.ajax('/done')
                    .done(r5Done)
                    .fail(r5Fail)
                    .always(r5Always);

      req3.abort();

      for (var i = 0, n = 5; i < 5; i++) {
        server.respond();
      }

    });
    
    describe('first request to /', function() {
      
      it('#done called once', function () {
        expect(r1Done.calledOnce).to.be.true;
      });

      it('#fail was not called', function () {
        expect(r1Fail.called).to.be.false;  
      });

      it('#always was called once', function () {
        expect(r1Always.calledOnce).to.be.true  
      });

    });

    describe('second request to /done', function () {
      
      it('#done called once', function () {
        expect(r2Done.calledOnce).to.be.true;
      });

      it('#fail was not called', function () {
        expect(r2Fail.called).to.be.false;
      });

      it('#always called once', function () {
        expect(r2Always.calledOnce).to.be.true;  
      });

    });

    describe('third (aborted) request to /', function () {
      
      it('#done was not called', function () {
        expect(r3Done.called).to.be.false;
      });

      it('#fail called once', function () {
        expect(r3Fail.calledOnce).to.be.true;
      });

      it('#always called once', function () {
        expect(r3Always.calledAfter(r2Always)).to.be.true;
      });

    });

    describe('fourth request to /fail', function() {
      
      it('#done was not called', function () {
        expect(r4Done.called).to.be.false;
      });

      it('#fail called once', function () {
        expect(r4Fail.calledOnce).to.be.true;
      });

      it('#always called once', function () {
        expect(r4Always.calledOnce).to.be.true;  
      });

    });

    describe('fifth request to /done', function() {

      it('#done called once', function () {
        expect(r5Done.calledOnce).to.be.true;
      });

      it('#fail was not called', function () {
        expect(r5Fail.called).to.be.false;
      });

      it('#always called once', function () {
        expect(r5Always.calledOnce).to.be.true;
      });

    });

    describe('#always sequesnce', function () {

      it('#always 2 called after #always 1', function () {
        expect(r2Always.calledAfter(r1Always)).to.be.true;  
      });

      it('#always 3 called after #always 2', function () {
        expect(r3Always.calledAfter(r2Always)).to.be.true;
      });

      it('#always 4 called after #always 3', function () {
        expect(r4Always.calledAfter(r3Always)).to.be.true;
      });

      it('#always 5 called after #always 4', function () {
        expect(r5Always.calledAfter(r4Always)).to.be.true;
      });

    });

  });

  describe('behavior sequence tests (for bandwidth = 2)', function() {
    var queue, runSpy;

    beforeEach(function () {
      queue = new Queue(2);
      runSpy = sinon.spy(Request.prototype, 'run');
    });

    afterEach(function () {
      runSpy.restore()
    });

    it('applies run only two times', function() {

        expect(runSpy.called).to.be.false;
        queue.ajax('/');

        expect(runSpy.calledOnce).to.be.true;
        queue.ajax('/');

        expect(runSpy.calledTwice).to.be.true;
        queue.ajax('/');

        expect(runSpy.calledTwice).to.be.true;
        expect(runSpy.calledThrice).to.be.false;
    });

    it('applies run three times if got response on first or second', function(done) {
      var req1, req2, req3;

      req1 = queue.ajax('/');
      expect(runSpy.calledOnce).to.be.true;

      req2 = queue.ajax('/');
      expect(runSpy.calledTwice).to.be.true;
      
      req3 = queue.ajax('/');
      expect(runSpy.calledTwice).to.be.true;

      req1.always(function() {
        expect(runSpy.callCount).to.eql(3);
      });

      req2.always(function() {
        expect(runSpy.callCount).to.eql(4);
        done();
      });

      server.respond();
      server.respond();
      
    });

  });

});