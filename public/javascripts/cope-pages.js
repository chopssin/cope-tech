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
    console.log(apps);
    
    toggle.$el('@my-apps').html('');

    apps.forEach(a => {

      // Build app cards
      CopeViews.class('AppCard').build({
        sel: toggle.sel('@my-apps'),
        method: 'append',
        data: {
          appId: a.appId,
          appName: a.appName,
          isOwner: a.isOwner
        }
      }).res('touched', () => {
        toggle.val('sec', 'app');

        d3.json('d3-sample.json', (err, graph) => {
          if (err) throw err;

          console.log(graph);
          CopeViews.class('AppPage').build({
            sel: toggle.sel('@app'),
            data: {
              appId: a.appId,
              appName: a.appName,
              owner: a.isOwner ? 'Me' : 'Someone else',
              graph: graph
            }
          }).res('select-node', node => {
            debug('TBD: select node'); 
          }).res('add-partner', email => {
            debug('TBD: add partner'); 
          });

        }); // end of d3

      });
    });
  });

}); // end of Page "/"

})();
