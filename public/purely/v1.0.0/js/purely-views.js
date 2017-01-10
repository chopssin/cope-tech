const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'), 
    BoxView = Views.class('Box'),
    TextAreaView = Views.class('TextArea'),
    ImageUpLoaderView = Views.class('ImageUpLoader'),
    PhotoView = Views.class('Photo'),
    GridView = Views.class('Grid'),
    SlideView = Views.class('Slide');

NavView.dom(vu => (`
  <header ${vu.ID} class="view-nav">
		<div data-component="logo" class="logo bg">Logo</div>
		<div class="float-right">
	    <nav>
				<ul data-component="signIn">
					<li><a href="#" class="user">Sign up</a></li>
					<li><a href="#" class="user">Sign in</a></li>
				</ul>
				<ul data-component="user">
				  <li><a href="" class="user">User Name</a></li>
				</ul>
				<ul data-component="menu">
				  <li class="menu glyphicon glyphicon-menu-hamburger"></li>
				</ul>
			</nav>
		</div>
		<div class="view-nav-items user bg-w" data-component="nav-items" >
			<div class="glyphicon glyphicon-remove float-right menu" data-component="remove"></div>
			<nav>
				<ul data-component="item">
				</ul>
			</nav>
		</div>
	</header>`)
);

NavView.render( vu => {

	vu.use('list, signedIn, css, @logo').then( v => {
		//list
		v.list.forEach( obj => {
			vu.$el('@item').append(`<li><a href=${obj.href}>${obj.title}</a></li>`);
		});
		//signedIn
		if(v.signedIn) {
			vu.$el('@signIn').hide();
			vu.$el('@user').show();
		} else {
			vu.$el('@signIn').show();
			vu.$el('@user').hide();
		}
		//css
		vu.$el().css(v.css);
		if(v.css.height) {
			vu.$el().css('line-height', v.css.height);
		}
		//@logo
		vu.$el('@logo').css(v['@logo'].css);
		vu.$el('@logo').html(v['@logo'].logoText);
		
	});

	//animate
	vu.$el('@menu').off('click').on('click', () => {
			vu.$el('@nav-items').fadeIn(500);
		});
		vu.$el('@remove').off('click').on('click', () => {
			vu.$el('@nav-items').fadeOut(500);
		});
});

// BoxView

BoxView.dom( vu => (`
	<div ${vu.ID} data-component="box" class="box">
	</div>
`));

BoxView.render( vu => {
	
	vu.use('css').then( v => {
		vu.$el('@box').css(v.css);
	});

});

//TextArea
TextAreaView.dom( vu => (`
	<textarea ${vu.ID} data-component="textArea"></textarea>
`));

TextAreaView.render( vu => {
	let $this = vu.$el();
  $this
    .prop('style', 'height:' + ($this.height()) + 'px;overflow-y:hidden;')
    .off('keyup')
    .on('keyup', () => {
      $this.css('height', 'auto');
      $this.css('height', `${$this[0].scrollHeight}px`);
      vu.res('value', $this.val().trim());
    });
});

//ImageUpLoader 
ImageUpLoaderView.dom( vu => (`
	<div ${vu.ID} data-component="imageUpLoaderView">
		<form>
			<input data-component="files" type="file" name="img[]" multiple="multiple">
			<input data-component="submit" type="submit">
		</form>	
	</div>
`));

ImageUpLoaderView.render( vu => {
	vu.$el('@files').off('change').on('change', e => {
		
		vu.res('value', vu.$el());
	});
});

//PhotoView
PhotoView.dom(vu =>
  `<div ${vu.ID}>
    <a href="#">
      <img data-component="img" class="img-responsive" src="">
    </a>
    <div data-component="caption">
      <a href="#" class="text">
      </a>
    </div>
  </div>`
);

PhotoView.render(vu => {

  vu.use('link').then(v => {
    vu.$el('a').prop('href', v.link);
  })

  vu.use('src').then(v => {
    vu.$el('@img').prop('src', v.src);
  })

  vu.use('caption').then(v => {
    vu.$el('@caption').html(v.caption);
  })

  let PhotoPostCSS = vu.val('css') || {
    width: '450px',
    'text-align': 'center',
    margin: '0 auto'
  };

  vu.$el().css(PhotoPostCSS);

  let imgCSS = (vu.val('@img') && vu.val('@img').css) || {
    margin: '0 auto'
  };

  vu.$el('@img').css(imgCSS);

  let captionCSS = (vu.val('@caption') && vu.val('@caption').css) || {
    width: '100%',
    height: 'auto',
    'background-color': '#DDD',
    'font-family': '微軟正黑體'
  };

  vu.$el('@caption').css(captionCSS);

});


//GridView
GridView.dom(vu =>
  `<div ${vu.ID}>
    <div class="row" data-component="grid">
    </div>
  </div>`
);

GridView.render(vu => {

  vu.use('data').then(v => {
    if (Array.isArray(v.data)) {
      v.data.forEach((item, index) => {
        vu.$el('@grid').append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding: 5px" data-component="img' + index + '"></div>');
        PhotoView.build({
          sel: vu.sel('@img' + index),
          method: 'append',
          data: item
        }).val({
          css: {
            'max-width': 'auto',
            width: 'auto'
          }
        })
      })
    }
  });

  vu.use('css').then(v => {
    vu.$el().css(v.css);
  })

});

