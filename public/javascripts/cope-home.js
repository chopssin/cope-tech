(function($) {

var G = Cope.graphDB(),
    dataSnap = Cope.dataSnap,
    util = Cope.util,
    fetchDS = dataSnap(),
    nav,
    debug = util.setDebug('cope-home', true);

// Navigation
nav = function(_sec) {
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

fetchDS.load(function() {
  G.listMyApps().then(function(_list) {
    debug(_list);
  });
});
fetchDS.load();

})(jQuery);
