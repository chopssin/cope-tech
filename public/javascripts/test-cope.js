(function($) {

var test = util.setTest('test-cope');

// Test - graphDB
test(function(pass) {
  
  var debug = this.debug,
      G = graphDB();
  
  // Test - create new app with appId = "testApp2"
  test(function(pass) {
    G.createApp('testApp2').then(function(_appG) {
      if (_appG) {
        pass('End of app creation test');
        return;
      } 
      pass('End of app creation test');

      // Test - get app by appId = "testApp2"
      test(function(pass) {
        G.getApp('testApp2').then(function(_appG2) {
          if (!_appG2) {
            debug('testApp2', 'Failed to getApp');
            return;
          } 
          pass('Get app "testApp2"');

          var dreams = _appG2.col('dreams'),
              dreamers = _appG2.col('dreamers'),
              dreamedBys = _appG2.edges('dreamedBys');
          var daydream = dreams.node('daydream');
          var jones = dreamers.node('jones');

          // Test - set values of nodes
          test(function(pass) {
            daydream.val({
              happiness: 98
            });
      
            jones.val({
              name: 'Jones'
            });

            pass("Set values of nodes");
          }); 

          // Test - set edges
          test(function(pass) {
            dreamedBys.add(daydream, jones);
        
            dreamedBys.from(daydream).then(function(_nodes) {
              pass('Set an edge, and queried via "#from"');
              
              if (!Array.isArray(_nodes)) debug('testApp2', '_nodes is not an array');

              _nodes.forEach(function(_n) {
                test(function(pass) {
                  dreamedBys.del(daydream, _n).then(function() {
                    pass('deleted the edge');
                  });
                }).print();
              });

              test(function(pass) { 
                _nodes[0].val().then(function(val) {
                  if (!val) {
                    debug('Failed to find _nodes[0]');
                    return;
                  }
                  pass('Found _nodes[0]');
                });
              }).print();
            }); // end of dreamedBys.from
          }); // end of test
        }); // end of G.getApp
      }); // end of test
    }); // end of G.createApp
  }); // end of test

  pass('Start test');
}); // end of test

// Test - use jQuery
test(function(pass) {
  if ($) {
    pass('$ is defined');
  } else {
    this.debug('undefined jQuery or $');
  }
});

})(jQuery)
