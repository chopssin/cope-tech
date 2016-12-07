(function($) {

var Cope = {};
Cope.signIn = function() {
  var _thenable = {}, done;
  _thenable.then = function(_cb) {
    done = _cb;
  };
  // TBD: get config and then sign in
  // done.call(Cope);
  return _thenable;
};

// Prompt sign-in panel
Cope.signIn().then(function() { 
  console.log(this); 
});

})(jQuery);
