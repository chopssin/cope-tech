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
  });

  // start secFooter
  secFooter = Purely.class('Box').build({
    sel: ROOT,
    method: 'append',
    data: {
      css: {
        'background' : '#aca',
        'width': '100%',
        'height': '100vh',
      }
    }
  });

  // Boxes inside secFooter
  let boxLeft, boxRight, boxBottom;
  boxRight = Purely.class('Box').build({
    sel: secFooter.sel(),
    method: 'append',
    data: { 
      css: {
        'display': 'block',
        'width': '100%',
        'height': '100%',
        'margin': '0',
        'background': 'red'
      }
    }
  });

  boxLeft = Purely.class('Box').build({
    sel: boxRight.sel(),
    method: 'append',
    data: {
      css: {
        'display': 'block',
        'width': '60%',
        'height': '100%',
        'margin': '0',
        'right': '0',
        'background': 'green'
      }
    }
  });

  boxBottom = Purely.class('Box').build({
    sel: secFooter.sel(),
    method: 'append',
    data: {
      css: {
        'position': 'absoulte',
        'display': 'block',
        'width': '100%',
        'height': '10%',
        'margin': '0',
        'bottom': '0',
        'left': '0',
        'background': 'black'
      }
    }
  });

  secCover = Purely.class('Box').build({
    sel: boxLeft.sel(),
    method: 'append',
    data: { 
      css: {
        'display': 'block',
        'width': '100%',
        'height': '30%',
        'margin': '0',
        'background': 'blue'
      }
    }
  });

  boxBottom.$el().append('阿卡國際 版權所有 © 2017 Aca Company!').css({
    'color': 'white',
    'text-align': 'center',
    'font-weight': 'bold',
    'font-size': '20px',
    'padding': '15'
  });

  secCover.$el().append('Cover').css({
    'color': 'white',
    'text-align': 'center',
    'font-weight': 'bold',
    'font-size': '40px',
    'padding': '60'
  });

  boxRight.$el().append('111111111111');

  // console.log('aaaaaaaaa',secFooter);
  // secFooter.$el().append(`<div>11111111</div>`).css({});
  // secFooter.$el().append('阿卡國際 版權所有 © 2017 Aca Company!').css({
  //   'color': '#333',
  //   'text-align': 'center',
  //   'font-weight': 'bold'
  // });

  // end secFooter

}); // end of "/"

})();
