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
      '@logo': {
        logoText: 'Cope',
        css: {
          'font-size': '2em',
        }
      },
      css: {
        'height': '60px'
      }
    }
  }).res('logo clicked', () => {
    toggle.val('sec', 'home');
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
    
      // Set multiple dataSnaps for each app
      let appDS = Cope.dataSnap();
      AppsDS[app.appId] = appDS;

      // Build app cards
      let appCard = CopeViews.class('AppCard').build({
        sel: toggle.sel('@my-apps'),
        method: 'append',
        data: {
          appId: app.appId
        }
      });
      appCards[app.appId] = appCard;

      // Get app name
      app.get('appName').then(appName => {
        appDS.val('appName', appName);
      });

      // Find the owner
      app.cred.get('owner').then(owner => {
        Cope.user().then(user => {
          appDS.val('isOwner', owner && owner[user.uid]);
        });
      });
    }); // end of apps.forEach

    Object.keys(AppsDS).forEach(appId => {
      AppsDS[appId].load(data => {
        let appCard = appCards[appId];

        appCard.val('isOwner', data.isOwner || false);
        appCard.val('appName', data.appName || '');

        if (data.appName && data.hasOwnProperty('isOwner')) {
          appCard.res('touched', () => {
            // Switch to "app" section
            toggle.val('sec', 'app');

            // Build the app page
            let appPage = CopeViews.class('AppPage').build({
              sel: toggle.sel('@app'),
              data: {
                appId: appId,
                appName: data.appName,
                owner: data.isOwner ? 'Me' : 'Someone else'
              }
            }).res('select-node', node => {
              debug('TBD: select node'); 
            }).res('add-partner', email => {
              debug('TBD: add partner'); 
            }).res('rename app', newName => {
              Cope.app(appId).set('appName', newName).then(() => {
                console.log(':)');
                appDS.val('appName', newName);
              });
            });
            // end of building app page
          
            // Fake data
            d3.json('d3-sample.json', (err, graph) => {
              if (err) throw err;
              appPage.val('graph', graph);
            });
          
          }); // end of res "touched"
        } // end of if
      }); // end of each dataSnap.load
    }); // end of AppsDS forEach
  }); // end of Apps.list

}); // end of Page "/"

})();
