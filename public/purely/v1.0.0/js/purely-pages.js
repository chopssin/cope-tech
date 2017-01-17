(function() {

let debug = Cope.Util.setDebug('purely-pages', true);

let app = Cope.app('testApp2');

let Pages = Cope.pages('Purely'),
    Purely = Cope.views('Purely');

const ROOT = '#purely-container';

Pages.use('/', params => {
  
  // Built views
  let nav, 
      secCover, 
      secContact,
      secFooter;

  // Build navigation bar
  nav = Purely.class('Nav').build({
    sel: ROOT,
    data: {
      '@logo': { 
        'logoText': 'Purely<span style="font-size:14px;color:blue;">Beta</span>'
      },
      css: {
        'font-size': '30px',
        'border-bottom': '2px solid #333'
      }
    }
  });

  // Get app name from database
  app.get('appName').then(appName => {
    let logoObj = nav.get('@logo');
    logoObj.logoText = '<span style="font-size:20px">' + appName.replace(/\s/g, '') + '</span>';
    nav.val('@logo', logoObj);

    console.log(appName);
  });

}); // end of "/"

})();
