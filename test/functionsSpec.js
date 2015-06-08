describe('functions', function () {

  describe('slice', function () {

      it('expectation', function () {
        (function() {

          expect(slice.call(arguments)).to.eql([1, 2, 3]);
          expect(arguments).to.have.length(3);
          expect(slice.call(arguments)).to.have.length(3);
        
        })(1, 2, 3)
      });
  });
  
});