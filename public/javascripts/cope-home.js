(function($) {

// Navigation
var nav = function(_sec) {
  switch(_sec) {
    case 'home':
      $('#dashboard').removeClass('hidden');
      $('#dashboard-app').addClass('hidden');
      break;
    case 'app':
      $('#dashboard').addClass('hidden');
      $('#dashboard-app').removeClass('hidden');
      break;
  }
};

$('#logo').click(function() {
  nav('home');
});

$('#sample').click(function() {
  nav('app');
});

})(jQuery);
