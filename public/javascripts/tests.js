(function(){
const UlistViews = Views.class('Ulist'),
			TestBlock = Views.class('TestBlock'),
			TestBar = Views.class('TestBar');

// Views
UlistViews.dom( vu => `
	<div ${vu.ID}>
		<div data-component="QQ"></div>
	</div>
`);

UlistViews.render( vu => {
  //vu.$el('h1').text(vu.val('items')[0].title);

  vu.use('items').then(v => {
  	if (Array.isArray(v.items)) {
  		vu.$el('@QQ').text(v.items[0].title);
  	}
  })
});

// TestBlock
TestBlock.dom(vu => `
  <div ${vu.ID} style="margin:30px 0; border:2px solid #999; padding: 16px">
    <div data-component="status">
      <img data-component="light" src="img/red.jpg" width="20" height="20">
      <h3 data-component="title"></h3>
    </div>
    <div data-component="log">
    </div>
  </div>
`);

TestBlock.render(vu => {

  if (vu.get('ok')) {
    vu.$el('@light').prop('src', 'img/green.jpg');
  } else {
    vu.$el('@light').prop('src', 'img/red.jpg');
  }

  if (!vu.get('hide')) {
    vu.$el().show();
  } else {
    vu.$el().hide();
  }

  vu.use('title').then(v => {
    vu.$el('@title').text(v.title);
  });
});

// end Views


// Tests Page

let toggle = UlistViews.build({
	sel: '#tests-container',
	data: {
		items: [{ 
			'title': 'Purely', 'comp': 'purely' 
		}, {
			'title': 'Views', 'comp': 'views'
		}]
	}
}).res('item', item => {
	console.log(item);
	switch (item) {
		case 'Purely':
		break;
		case 'Views':
		break;

	}
});

// Tests


// end Tests


})(jQuery, Cope);