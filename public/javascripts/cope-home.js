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

    // Add partner apps
    _user.fetch('add_partner_app').then(function(_val) {
      if (!_val) return;

      Object.keys(_val).forEach(function(_key) {
        _user.val('partner_apps/' + _val[_key], true);
      });
    });
    
    // Got user
    renderDS.val({ user: _user });
    fetchDS.load();
  });
});

// Start from here
accountDS.load();

// Stage of fetching data
fetchDS.load(function() {
  G.listMyApps().then(function(_apps) {
    var count = 0, apps = [];
    _apps.forEach(function(_a) {
      G.getApp(_a.appId).then(function(_appG) {
        count++;
        apps.push({
          appName: _appG.appName(),
          appId: _appG.appId,
          isOwner: _a.isOwner || false
        });
        if (count == _apps.length) {
          debug('List my apps', apps);
          renderDS.val('myApps', apps);
          renderDS.load();
        }
      });
    }); // end of _apps.forEach
  }); // end of G.listMyApps
}); // end of fetchDS.load

// Stage of rendering views
renderDS.load(function() {
  var user = this.val('user'),
      myApps = this.val('myApps');
  $('#my-apps').html('');
  
  myApps.forEach(function(_a) {
    var appCard = ViewAppCard.build({
      sel: '#my-apps',
      method: 'append',
      data: {
        isOwner: _a.isOwner,
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
            appCard: appCard,
            graph: graph
          }
        }).res('select-node', function(node) {
          // TBD: Node being selected
          // Show node's value
          debug('select-node', node);
        }).res('add-partner', function(_email) {
          if (!user) return;
          debug('add-partner', _email);
          user.addPartner(_a.appId, _email, true);
        });
      }); // end of getting initial graph
    }); // end of AppCard
  }); // end of myOwnApps.forEach
}); // end of renderDS.load

})(jQuery, Cope, undefined);
