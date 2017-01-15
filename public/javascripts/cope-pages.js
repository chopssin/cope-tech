(function() {

let Pages = Cope.pages('Cope'),
    Purely = Cope.views('Purely');

// Paeg "/"
Pages.use('/', params => {

  // Build navigation bar
  let nav = Purely.class('Nav').build({
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
  });

  // Set nav@logo hover event
  nav.$el('@logo')
    .off('mouseenter')
    .off('mouseleave')
    .on('mouseenter', () => {
      nav.$el('@logo').css('color', '#333');
    })
    .on('mouseleave', () => {
      nav.$el('@logo').css('color', '#555');
    });

}); // end of Page "/"

})();
