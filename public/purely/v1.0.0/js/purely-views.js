const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'),
  BoxView = Views.class('Box'),
  TextAreaView = Views.class('TextArea'),
  ImageUpLoaderView = Views.class('ImageUpLoader'),
  PhotoView = Views.class('Photo'),
  GridView = Views.class('Grid'),
  SlideView = Views.class('Slide');

// NavView
// @logo
// @signIn
// @user
// @menu
// @nav-items
// @remove
// @item
// -signedIn: bool, check user signed
// -list: array, input for @item
// -css: object, NavView's style
// -@logo object,  @logo object
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
  </header>`));

NavView.render(vu => {

  vu.use('list, signedIn, css, @logo').then(v => {
    //list
    v.list.forEach(obj => {
      vu.$el('@item').append(`<li><a href=${obj.href}>${obj.title}</a></li>`);
    });
    //signedIn
    if (v.signedIn) {
      vu.$el('@signIn').hide();
      vu.$el('@user').show();
    } else {
      vu.$el('@signIn').show();
      vu.$el('@user').hide();
    }
    //css
    vu.$el().css(v.css);
    if (v.css.height) {
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
// @box
// -css: object, @box's style
BoxView.dom( vu => (`
	<div ${vu.ID} data-component="box" class="box">
	</div>
`));

BoxView.render(vu => {

  vu.use('css').then(v => {
    vu.$el('@box').css(v.css);
  });

});

// TextArea
// @textArea
TextAreaView.dom( vu => (`
	<textarea ${vu.ID} data-component="textArea"></textarea>
`));

TextAreaView.render(vu => {
  let $this = vu.$el();
  $this
    .css({
      height: $this.height() + 'px',
      'overflow-y': 'hidden'
    })
    .off('keyup')
    .on('keyup', () => {
      $this.css('height', 'auto');
      $this.css('height', `${$this[0].scrollHeight}px`);
      vu.res('value', $this.val().trim());
    });
});

// ImageUpLoader
// @preview
// @button 
// @files: a file input
// done <- files: array, an array of files 
ImageUpLoaderView.dom( vu => (`
	<div ${vu.ID} style="border: 1px solid #111; width: 540px; padding: 0 20px">
		<div data-component="preview"></div>
		<button data-component="button">上傳</button>
		<button data-component="done" style="float: right">完成</button>
		<input data-component="files" type="file" name="img[]" multiple class="hidden" >
	</div>
`));

ImageUpLoaderView.render( vu => {
	let $files = vu.$el('@files');
			$preview = vu.$el('@preview'),
			$button = vu.$el('@button'),
			$done = vu.$el('@done'),
			files = [];
	$button.off('click').on('click', () => {
    $files.click();
	});

	$done.off('click').on('click', e => {
		vu.res('done', files);	
	});
	$files.off('change').on('change', e => {
		if ($files[0].files && $files[0].files[0]){
			for (let i = 0; i<e.target.files.length; i++) {
				let reader = new FileReader();
				reader.readAsDataURL($files[0].files[i]);
				reader.onload = e => {
					console.log(files);
					files.push(e.target.result);
					//vu.$el(`@img-${i}`).append(`<img src="${e.target.result}" class="img-responsive">`);
					GridView.build({
						sel: vu.sel(`@preview`)   
					}).val({
						src: files//e.target.result
					});
				};
			
				//$preview.append(`<div data-component="img-${i}"></div>`)
			}
		} // end of if
	});// end of change-event
});

// PhotoView
// @img: for image src
// @caption: for image caption
// -link: an url for href
// -src: an image url
// -caption: a caption for the photo
// -css: an object for decoration the outer div
// -css['@img']: an object for decoration the img
// -css['@caption']: an object for decoration the caption
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


// GridView
// @grid: a div contain grid
// -data: an array of object with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -src: an array with url as value, loading this if no data import
// -css: an object
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

  if (!vu.val('data')) {
    vu.use('src').then(v => {
      for (let i = 0; i < v.src.length; i++) {
        vu.$el('@grid').append('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" style="padding: 5px" data-component="img' + i + '"></div>');
        PhotoView.build({
          sel: vu.sel('@img' + i),
          method: 'append'
        }).val({
          src: v.src[i],
          css: {
            'max-width': 'auto',
            width: 'auto',
          }
        })
      }
    })
  }
  vu.use('css').then(v => {
    vu.$el().css(v.css);
  })

});
