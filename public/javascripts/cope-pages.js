(function() {

let debug = Cope.Util.setDebug('cope-pages', true);

let Graphs = Cope.Graphs;

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
  Graphs.user().then(user => {
    accCard.val('email', user.email);
  });

  // Get my apps
  Graphs.list().then(graphs => {
    console.log(graphs);
  });

}); // end of Page "/"

})();
