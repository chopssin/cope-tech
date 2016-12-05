(function($) {
var tests = {},
    autoTests = [], passed = 0;

// Set auto tests
autoTests.push(util.setTest('Create a test app', function() {

  return this.done();

  var capp = copeApp(),
      done = this.done,
      debug = this.debug;
  capp.create('testApp').then(function(_app) {
    debug(_app); 
    done();
  });
}));
autoTests.push(util.setTest('Check jQuery', function() {
  var done = this.done,
      debug = this.debug;
  if ($) {
    done();
  } else {
    debug('undefined jQuery or $');
  }
}));
autoTests.push(util.setTest('Build test - testApp', function() {
  var capp = copeApp('testApp'),
      GDB = capp.useGraphDB,
      done = this.done,
      debug = this.debug;

  // Set page "testPage"
  capp.setPage('testPage', function() {
    var G = GDB(), 
        fetchDS = dataSnap();
    fetchDS.load(function() {
      try {
        var testCol = G.col('testCol'), no_1;
        no_1 = testCol.add('no_1');
        no_1.val({
          publishedAt: new Date().getTime()
        });
        no_1.val('publishedAt').then(function(val) {
          var time = util.timeOf(val);
          if (!time) {
            debug('util.timeOf(publishedAt)', time);
          } 
          done();
        });
      } catch (err) { console.error(err); }
    });
    fetchDS.load();
  });

  // Build page "testPage"
  capp.build({ 
    //editable: true, 
    //path: '/test/path', 
    page: 'testPage' 
  });
})); // end of test

// Run auto tests
autoTests.forEach(function(test) {
  test.run(function() {
    var msg = this.msg || '';
    passed += 1;
    console.log('Passed: ' + passed + '/' + autoTests.length + ' ' + msg);
    if (passed == autoTests.length) {
      console.log('=================');
      console.log('All tests done.');
      console.log('=================');
    }
  });
});

})(jQuery)
