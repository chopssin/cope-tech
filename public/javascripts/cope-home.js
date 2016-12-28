(function($, Cope) {

var G = Cope.useGraphDB(),
    Views = Cope.useViews('views'),
    Util = Cope.Util,
    dataSnap = Cope.dataSnap,
    fetchDS = dataSnap(),
    renderDS = dataSnap(),
    accountDS = dataSnap(),
    ViewAppCard = Views.class('AppCard'),
    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),
    debug = Util.setDebug('cope-home', true),
    nav;

// Navigation
function nav(_sec) {
  $('html, body').scrollTop(0);
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

// Get my account
accountDS.load(function() {
  var card = ViewAccountCard.build({
    sel: '#account'
  }).res('signout', function() {
    G.user().signOut();
  });

  G.user().then(function(_user) {
    debug(_user);
    card.val({ mail: _user.email });

    // Set email
    _user.val('email', _user.email);
  });
});
accountDS.load();

// Stage of fetching data
fetchDS.load(function() {
  G.listMyApps().then(function(_res) {
    var count = 0, myOwnApps = [];
    _res.own_apps.forEach(function(_appId) {
      G.getApp(_appId).then(function(_appG) {
        count++;
        // Push the fetched app info into the array
        myOwnApps.push({
          appName: _appG.appName(),
          appId: _appG.appId
        });
        if (count == _res.own_apps.length) {
          debug(myOwnApps);
          // Update renderDS's data with "myOwnApps"
          renderDS.val('myOwnApps', myOwnApps);
          renderDS.load();
        }
      });
    });
  });
}); 

// Stage of rendering views
renderDS.load(function() {
  var myOwnApps = this.val('myOwnApps');
  $('#my-apps').html('');
  
  myOwnApps.forEach(function(_a) {
    var vuCard = ViewAppCard.build({
      sel: '#my-apps',
      method: 'append',
      data: {
        role: 'Owner',
        appId: _a.appId,
        appName: _a.appName
      }
    }).res('touched', function(_data) {
      // App being selected
      // Navigate to app section
      nav('app');

      // Get the initial graph
      d3.json('d3-sample.json', function(err, graph) {
        if (err) throw err;

        // Build app section
        ViewAppPage.build({
          sel: '#app-page',
          data: { 
            appCard: vuCard,
            graph: graph
          }
        }).res('select-node', function(node) {
          // TBD: Node being selected
          // Show node's value
          debug('select-node', node);
        }).res('add-partner', function(_val) {
          debug('add-partner', _val);
        });
      }); // end of getting initial graph
    }); // end of AppCard
  }); // end of myOwnApps.forEach
}); // end of renderDS.load

// All start from here
fetchDS.load();

})(jQuery, Cope, undefined);
