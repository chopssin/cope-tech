(function() {

let debug = Cope.Util.setDebug('cope-pages', true);

let Apps = Cope.Apps;

let Pages = Cope.pages('Cope'),
    Purely = Cope.views('Purely'),
    CopeViews = Cope.views('Cope');

// Paeg "/"
Pages.use('/', params => {
  // views
  let nav,  
      toggle, // toggle views of dashboard and app-page
      accCard; // account card

  let AppsDS = {},
      appCards = {};

  // Build navigation bar
  nav = Purely.class('Nav').build({
    sel: '#nav',
    data: {
      logo: {
        text: 'Cope'
      }
    }
  }).res('logo clicked', () => {
    toggle.val('sec', 'home');
  });

  nav.$el().css({ 
    'font-size': '25px'
  });

  // Build Toggle
  toggle = CopeViews.class('Toggle').build({
    sel: '#page'
  });

  // Build Account Card
  accCard = CopeViews.class('AccountCard').build({
    sel: toggle.sel('@account')
  }).res('sign out', () => {
    Graphs.user().then(user => {
      user.signOut();
    });
  });

  // Get the current user
  Cope.user().then(user => {
    accCard.val('email', user.email);
  });

  // Get my apps
  Apps.list().then(apps => {

    // Clean up the wrap
    toggle.$el('@my-apps').html('');

    apps.forEach(app => {
    
      // Build app cards
      let appCard = CopeViews.class('AppCard').build({
        sel: toggle.sel('@my-apps'),
        method: 'append',
        data: {
          appId: app.appId
        }
      }).res('touched', () => {

        toggle.val('sec', 'app');

        // Build the app page
        let appPage = CopeViews.class('AppPage').build({
          sel: toggle.sel('@app'),
          data: appCard.val()
        }).res('select-node', node => {
          debug('TBD: select node'); 
        }).res('add-partner', email => {
          debug('TBD: add partner'); 
        }).res('rename app', newName => {
          console.log('rename!');
          app.set('appName', newName).then(() => {
            appCard.val('appName', newName);
          });
        });

        // Fake data
        d3.json('d3-sample.json', (err, graph) => {
          if (err) throw err;
          appPage.val('graph', graph);
        });

        // Enroll appPage in appCard
        appCard.ds().enroll(appPage);
      }); // end of appCard.res("touched")

      // Get app name
      app.get('appName').then(appName => {
        appCard.val('appName', appName);
      });

      // Find the owner
      app.cred.get('owner').then(owner => {
        Cope.user().then(user => {
          appCard.val('owner', owner && owner[user.uid] ? 'Me' : 'Someone else');
        });
      });

      appCard.val('stat', 'Free Trial');

    }); // end of apps.forEach
  }); // end of Apps.list
}); // end of Page "/"

})();
