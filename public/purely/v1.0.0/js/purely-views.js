const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'),
  BoxView = Views.class('Box'),
  TilesView = Views.class('Tiles');
  TextareaView = Views.class('Textarea'),
  ImageUploaderView = Views.class('ImageUploader'),
  PhotoView = Views.class('Photo'),
  GridView = Views.class('Grid'),
  SlideView = Views.class('Slide'),
  SelectView = Views.class('Select'),
  UListView = Views.class('Ulist'),
  FormView = Views.class('Form'),
  MyPurelyView = Views.class('MyPurely');

// Nav
// "logo clicked" <- null, callback when @logo being clicked
NavView.dom(vu => `
 <header ${vu.ID} class="view-nav">
    <div data-component="logo" class="logo bg"></div>
    <div class="float-right">
      <nav>
        <ul data-component="main-items">
        </ul>
      </nav>
    </div>
    <div class="view-nav-items bg-w" data-component="menu" >
      <div class="glyphicon glyphicon-remove float-right remove-icon" data-component="close-button"></div>
      <nav style="text-align: center;">
        <ul data-component="nav-items" >
        </ul>
      </nav>
    </div>
    <div style="z-index: 2;" class="view-nav-items  bg-w" data-component="user-menu">
      <div class="glyphicon glyphicon-remove float-right remove-icon" data-component="close-button"></div>
      <nav style="text-align: center;">
        <ul data-component="user-items"></ul>
      </nav>
    </div>
  </header>
`);


let NavDom = [
  { 'header.view-nav': [
    { 'div@logo.logo.bg': '' },
    { 'div.float-right': [
      { 'nav': [
        { 'ul@main-items': '' }
      ]}
    ]},
    { 'div.view-nav-items.bg-w@menu': [
      { 'div.glyphicon.glyphicon-remove.float-right.remove-icon@close-button': '' },
      { 'nav (style = "text-align:center;")': [
        {'ul@nav-items': ''}
      ]}
    ]},
    { 'div(style = "z-index:2;").view-nav-items.bg-w@user-menu': [
      { 'div.glyphicon.glyphicon-remove.float-right.remove-icon@close-button': ''},
      { 'nav(style="text-align:center;")': [
        { 'ul@nav-items': ''}
      ]}
    ]}
  ]}
];

NavView.render(vu=> {

  // Reset items
  vu.$el('@main-items').html(`
    <li data-component="user" class="hidden user"><a>User Name</a></li>
    <li data-component="signIn" class="hidden user"><a>Sign in</a></li>
    <li data-component="menu-button" class="menu-icon glyphicon glyphicon-menu-hamburger hidden"></li>
  `);
  vu.$el('@nav-items').html('');
  vu.$el('@user-items').html('');

  // Default Css setting 
  let defaultCss = {
    'height': '100%',
    'line-height': '100%'
  };

  //  Css
  vu.$el().css(defaultCss);
  
  // @logo
  vu.use('logo').then(v => {
    if (v.logo.imgsrc) {
      vu.$el('@logo').css('background-image',v.logo.imgsrc);
    }else {
      vu.$el('@logo').html(`${v.logo.text}`);
    }
  });

  vu.$el('@logo').off('click').on('click', function() {
    vu.res('logo clicked');
  });
  
  // @items
  vu.use('items').then(v => {
    let  navItems = [];
    function pend(item){
      
      let method = 'append';

      switch (item.type) {
        case "main":
          item.el = 'main-items';
          method = 'prepend';
          //mainItems.push(item);
          break;
        case "user":
          item.el = 'user-items';
          //userItems.push(item);
          break;
        default:
          item.el = 'nav-items';
          navItems.push(item);
      }

      if (item.href) {
        vu.$el(`@${item.el}`)[method](`<li data-component="${item.comp}" class="user hidden-xs"><a href="${itemhref}">${item.text}</a></li>`);
      } else {
        vu.$el(`@${item.el}`)[method](`<li data-component="${item.comp}" class="user hidden-xs"><a>${item.text}</a></li>`);
      }
    }
    //navItems.forEach(pend);

    v.items.forEach(pend);

    //setting click event
    vu.use('items').then(v =>{
      v.items.forEach(item => { 
      if (item.comp) {
        console.log(item.comp);
        vu.$el(`@${item.comp}`).off('click').on('click',() => {
          vu.res('comp', item.comp);
        });
      }
      });
    });
    if (navItems.length > 0) {
      vu.$el('@menu-button').removeClass('hidden');
    }
  }); //end of items
  vu.use('usingMembers').then( v => {
    if (v.usingMembers) {
      vu.$el('@user').removeClass('hidden');
      vu.$el('@signIn').addClass('hidden');
    } else {
      vu.$el('@signIn').removeClass('hidden');
      vu.$el('@user').addClass('hidden');
    }
  });

  // animate
  vu.$el('@menu-button').off('click').on('click', () => {
    vu.$el('@menu').fadeIn(300);
    $(".logo float-right").hide();
  });

  vu.$el('@close-button').off('click').on('click', () => {
    vu.$el('@menu').fadeOut(300);
    vu.$el('@user-menu').fadeOut(300);
    $(".logo float-right").show();
  });

  vu.$el('@user').off('click').on('click', () => {
    vu.$el('@user-menu').fadeIn(300);
    $(".logo .float-right").hide();
  });

  // Set @signIn click event
  vu.$el('@signIn').off('click').on('click', () => {
    vu.res('signIn');
  });
  // Set @signOut click event
  vu.$el('@signOut').off('click').on('click', () => {
    vu.res('signOut');
    vu.$el('@user-menu').fadeOut(300);
    $(".logo .float-right").hide();
  });

});


//UList
//-comp: str, set element data-component
//-items: array, input for list
UListView.dom(vu => (`
  <div ${vu.ID}>
    <ul></ul>
  </div>
`));
UListView.render(vu => {
  vu.use('items').then(v =>{
    v.items.forEach( obj =>{ 
      if(obj.comp && obj.href ){
        vu.$el('ul').append(`<li class="user" data-component=${obj.comp}><a href=${obj.href}>${obj.title}</a></li>`);
      } else if(obj.comp) {
        vu.$el('ul').append(`<li class="user" data-component=${obj.comp}><a>${obj.title}</a></li>`);
      } else if(obj.href) {
        vu.$el('ul').append(`<li class="user"><a href=${obj.href}>${obj.title}</a></li>`);
      } else {
        vu.$el('ul').append(`<li class="user"><a>${obj.title}</a></li>`);
      }

      if (obj.comp) {
        let $li = vu.$el(`@${obj.comp}`)
        $li.off('click').on('click', ()=> {
          vu.res('$comp', $li);
          vu.res('comp', obj.comp);
        });
      }  
    });  
  });
})

let UListDom = [
  { 'div': [
    { 'ul': ''}
  ]}
];
// BoxView
// @box
// -css: object, @box's style
BoxView.dom( vu => (`
	<div ${vu.ID} data-component="box" class="view-box">
	</div>
`));

BoxView.render(vu => {
  vu.use('css').then(v => {
    vu.$el('@box').css(v.css);
  });
  vu.use('text').then(v=> {
    vu.$el().html(v.text.join(' '));
  });
});

let BoxDom = [
  { 'div.view-box@box': ''}
];

// Tiles
// -cut: obj, cut sequence
// -box: string, seq number of a boxView
TilesView.dom(vu => {
  return `<div ${vu.ID}></div>`;
});

TilesView.render(vu => {
  let w = vu.get('w'),
      h = vu.get('h'),
      cutObj = vu.get('cut');

  vu.set('r', BoxView.build({
    sel: vu.sel(),
    data: {
      css: { 
        width: w,
        height: h,
        display: 'inline-block',
        padding: '0',
        margin: '0',
        border: '0',
        'background-color': '#' + Math.floor(Math.random() * 1000)
      }
    }
  }));
  
  let cmds = Object.keys(cutObj).sort((a, b) => {
    if (b == 'r' 
      || (a.length > b.length)) {
      return 1; 
    } 
    return -1;
  });
  console.log(cmds);

  cmds.map(pid => { // pid: cmd
    let cmd = cutObj[pid]; // 'x20 y30' 
    let cs = cmd.split(' '); // ['x20', 'y30']
    let xcuts = [];
    let ycuts = [];

    console.log('[PID] ' + pid);

    cs.forEach((_c,i) =>{
      // 'x20'
      //console.log('QQQQQ',_c);
      if (_c.charAt(0) == 'x') {
        xcuts.push(parseInt(_c.slice(1)));  
      }
      else{
        ycuts.push(parseInt(_c.slice(1)));
      }
    });

    function cutsArraySort(a,b){
      return a - b
    }

    xcuts = xcuts.sort(cutsArraySort);
    ycuts = ycuts.sort(cutsArraySort);

    xcuts = [0].concat(xcuts, [100]);
    ycuts = [0].concat(ycuts, [100]);
    // console.log('1111111',xcuts);
    // console.log('2222222',ycuts);

    //console.log('11111111',cs)
    let xs = cmd.match(/x/g) || [];
    let ys = cmd.match(/y/g) || [];
    let total = (xs.length + 1) * (ys.length + 1);
    let css = [];
    for (let i = 0; i < total; i++) {
      css.push({ 
        display: 'inline-block',
        position: 'relative',
        width: '100%', 
        height: '100%',
        padding: '0',
        margin: '0',
        border: '0',
        'background-color': '#' + Math.floor(Math.random() * 1000)
      }); 
    }

    //{ width: '100%', height: '100%' }

    css = css.map((s, i) => {
      //console.log('ycuts arr', ycuts);
      //console.log('ycuts i', Math.floor(i / (ycuts.length - 1)));
      // Modify s

      s.width = xcuts[i % (xcuts.length-1) + 1] - xcuts[i % (xcuts.length-1)];
      s.height = ycuts[Math.floor(i / (xcuts.length - 1)) + 1] - ycuts[(Math.floor(i / (xcuts.length - 1)))];

      s.width = s.width + '%';
      s.height = s.height + '%';

      let myId = i + '';
      if (pid != 'r') {
        myId = pid + myId;
      }

      console.log('Save ' + myId);
      vu.set(myId, BoxView.build({
        sel: vu.get(pid).sel(),
        method: 'append',
        data: {
          css: s
        }
      }));
      return s;
    }); // end of css.map

    console.log(css);

  }); // end of cmds.map

  return;

  css0[dir[x]] = L + '%'
  css1[dir[x]] = (100 - L) + '%' 


  vu.set(parentBoxId, BoxView.build({
    sel: vu.get(parentBoxId).sel(),
    method: 'append',
    data: {
      css: css0
    }
  }));


  vu.set(parentBoxId, BoxView.build({
    sel: vu.get(parentBoxId).sel(),
    method: 'append',
    data: {
      css: css1
    }
  }));
});


// Textarea
// @textarea
TextareaView.dom( vu => {
	return `<textarea rows="1" ${vu.ID} class="view-textarea">
    </textarea>`;
});

TextareaView.render(vu => {
  let height, 
      $this = vu.$el('textarea'),
      value = vu.get('value'),
      content;

  // Replace html entities:
  // "<" -> "&lt;"
  // ">" -> "&gt;"
  // " " -> "&nbsp;"
  // "\n" -> "<br>"

  let autosize = function(e) {

    console.log('resize', this.scrollHeight);

    // Update the value
    let updatedValue = this.value.trim();
      //.replace(/<div[^\>]*>|<br>/g, '\n')
      //.replace(/<[^<>]+>/g, '')
      //.replace(/\&nbsp\;/g, ' ')
      //.replace(/&gt;/g,'>')
      //.replace(/&lt;/g,'<')
      //.trim() || '';
    
    vu.set('value', updatedValue);
    vu.res('value', updatedValue);

    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  };
  
  // Insert the value
  $this.val(value);

  $this.each(function () {
    console.log('value', value);
    let lineH = 28,
        initH = lineH + 6;

    // Calculate initial scroll height via the value
    if (value && value.length) {
      initH += lineH * (value.match(/\n/g) || []).length;
    }
    this.style.height = 'auto';
    this.setAttribute('style', 'height:' + (this.scrollHeight || initH) + 'px;overflow:hidden;');
  })
  .off('keyup')
  .off('focus')
  .on('focus', autosize)
  .on('keyup', autosize);

  setTimeout(function() {
    $this.click();
  }, 1000);
});


let TextareaDom = [
  { 'textarea(row="1").view-textarea': ''}
];

// ImageUploader
// @preview
// @button 
// @files: a file input
// done <- files: array, an array of files 
ImageUploaderView.dom( vu => (`
	<div ${vu.ID} class="view-image-uploader">
		<div data-component="preview"></div>
		<button data-component="button">上傳</button>
		<button data-component="done" style="float: right">完成</button>
		<input data-component="files" type="file" name="img[]" multiple class="hidden" >
	</div>
`));

ImageUploaderView.render( vu => {
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
					files.push(e.target.result);
					//vu.$el(`@img-${i}`).append(`<img src="$e.target.result}" class="img-responsive">`);
					GridView.build({
						sel: vu.sel(`@preview`)   
					}).val({
						src: files//e.target.result
					});
          vu.set('files',files);
				};
				//$preview.append(`<div data-component="img-${i}"></div>`)
			}
		} // end of if
	});// end of change-event
});

let ImageUploaderDom = [
  { 'div.view-image-uploader': [
    { 'div@preview': ''},
    { 'button@button': '上傳'},
    { 'button@done(style = "float:right;")': '完成'},
    { 'input@files.hidden(type="file" name="img[]" multiple)': ''}
  ]}
];
// FormView
FormView.dom(vu =>`
  <div ${vu.ID}>
    <div class="view-form">
      <ul data-component="inputs"></ul>
    </div>
  </div>
`);

FormView.render(vu => {
  if (!vu.get('values')) {
    vu.set('values', []);
  }

  vu.use('inputs').then(v => {
    let vals = [];

    // Clean up @inputs
    vu.$el('@inputs').html('');

    v.inputs.forEach((obj, index) =>{
      let type = obj.type || 'text', 
          label = obj.label|| '', 
          placeholder = obj.placeholder || '',
          comp = obj.comp || `li-${index}`; 
          val = obj.value || '';
      vu.$el('@inputs').append(`
        <li>
          <div>${label}</div>
          <input type=${type} placeholder="${placeholder}" data-component="${comp}">
        </li>`
      );// end of append
      vu.$el(`@${comp}`)[0].value = val;
      vals[index] = val;
      vu.set('values', vals);
      vu.$el(`@${comp}`).off('keyup').on('keyup',e =>{
          let value = vu.$el('@' + comp)[0].value;
          vals[index] = value;
          vu.set('values', vals);
      });// end of keyup
    });// end of forEach
  });// end of vu.use
});

let FromDom = [
  { 'div': [
    { 'div': [
      { 'ul@inputs': ''}
    ]}
  ]}
];


// PhotoView
// @img: for photo src
// @caption: for photo caption
// -link: string, the url for the photo
// -src: string, the photo url
// -caption: string, a caption for the photo
// -css: object, css for decoration the outer div
// -css['@img']: object, css for decoration the img
// -css['@caption']: object, css for decoration the caption
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

let PhotoDom = [
  { 'div': [
    { 'a(href="#")': [
      { 'img@img.img-responsive(src="")': ''}
    ]},
    { 'div@caption': [
      { 'a.text(href="")': ''}
    ]}
  ]}
];

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
// -data: array of object, an array of object with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -src: array, contain url as value, loading [src] if no [data] import
// -css: object, decoration for the grid
GridView.dom(vu =>
  `<div class='view-grid' ${vu.ID}>
      <div class='row clear-margin' data-component="grid"></div>
    </div>
  </div>`
);

let GridDom = [
  { 'div.view-grid': [
    { 'div.row.clear-margin@grid': ''}
  ]}
];

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

// Slide
// @slideItem: div to show slide image
// @slideCaption: li to show slide caption
// @slideNav: li to show slide nav
// -data: array of object, with attribute 'src', 'caption','link' such as {
//   src: 'https://fakeimg.pl/440x320/282828/eae0d0/?text=World1',
//   caption: 'This is a placeholder',
//   link: 'https://www.google.com.tw/?q=1'
// }
// -container: object, set attribute for width and heigh with default value: 980*390
// -autoSlide: boolean, set auto change slide with default value: true
// -changeTime: numnber, set the time for slide auto-changing
// -showArrow: boolean, set whether showing arrow or not with default value: true
// -mode: string, set slide mode 'slide' or 'center' with default value: slide
SlideView.dom(vu =>
  `<div class="view-slide" ${vu.ID}>
    <div class="slide">
      <i class="slideButton slideButtonLeft glyphicon glyphicon-chevron-left"></i>
      <i class="slideButton slideButtonRight glyphicon glyphicon-chevron-right"></i>
      <div class="banner" data-component="slideItem">
      </div>
      <div class="caption">
        <ul data-component="slideCaption">
        </ul>
      </div>
      <div class="slideNav">
        <ul data-component="slideNav">          
        </ul>
      </div>
    </div>
  </div>`
);

let SlideDom = [
  { 'div.view-slide': [
    { 'div.slide': [
      { 'i.slideButtonLeft.glyphicon.glyphicon-chevron-left': ''},
      { 'i.slideButtonRight.glyphicon.glyphicon-chevron-right': ''},
      { 'div.banner@slideItem': ''},
      { 'div.caption': [
        { 'ul@slideCaption': ''}
      ]},
      { 'div.slideNav': [
        { 'ul@slideNav': ''}
      ]}
    ]}
  ]}
];


SlideView.render(vu => {

  // Default CSS Setting
  let containerCSS = {
    width: '680px',
    height: '390px'
  };

  vu.use('container').then(v => {
    containerCSS.width = v.container.width;
    containerCSS.height = v.container.height;
  })
  
  vu.$el('.view-slide').css(containerCSS);

  //  Loading Data
  vu.use('data').then(v => {

    if(Array.isArray(v.data)){
      let currentNumber = 0;
      let totalSlideNumber = v.data.length - 1;
      //  如果圖片只有一張，隱藏左右箭頭
      if(totalSlideNumber == 0){
        vu.$el('.slideButton').remove();
      }


      //  Default DOM setting
      v.data.forEach((item, index) => {
        vu.$el('@slideItem').append('<a href='+ item.link +' target="_blank"><div class="slideItem item' + index +'"></div></a>');
        vu.$el('@slideCaption').append('<li>'+ item.caption +'</li>');
        vu.$el('@slideNav').append('<li data-navitem="'+index+'"><div class="slideNavItem"></div></li>');
      })
        vu.$el('@slideNav').find('li').first().addClass('active');

      let slideWidth = vu.$el(".view-slide").width();
      let slideHeight = vu.$el(".view-slide").height();

      //  setting CSS to adjust slide
      vu.$el('.banner').css({
        'width': slideWidth*(totalSlideNumber+1),
        'height': slideHeight
      });
      vu.$el('.slideItem').css({
        'width': slideWidth,
        'height': slideHeight
      });
      vu.$el('.caption').css('width', slideWidth);
      vu.$el('.caption').find('ul').css('width', slideWidth*(totalSlideNumber+1));
      vu.$el('.caption').find('li').css('width', slideWidth);

      v.data.forEach((item, index) => {
        vu.$el('.item'+ index).css('background-image', 'url('+item.src+')');
      })

      //  SlideFunction
      let checkSlideNumber = (slideNumber, totalSlide) => {
        if (slideNumber < 0) {
            return totalSlide;
        } else if (slideNumber > totalSlide) {
            return 0;
        } else {
            return slideNumber;
        }
      };

      let changeSlide = () => {
        currentNumber = checkSlideNumber(currentNumber, totalSlideNumber);
        vu.$el('.banner').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        vu.$el('.caption ul').animate({
            'left': -slideWidth * currentNumber
        }, 400);
        vu.$el('.slideNav li').removeClass('active');
        vu.$el('.slideNav li:eq(' + currentNumber + ')').addClass('active');
      }

      //  slideArrowButton
      vu.$el('.slideButtonRight').on('click', () => {
        currentNumber++;
        changeSlide();
      });
      vu.$el('.slideButtonLeft').on('click', () => {
        currentNumber--;
        changeSlide();
       });

      //  slideNavButton
      vu.$el('.slideNav').find('li').on('click', function(){
        currentNumber = $(this).data('navitem');
        changeSlide();
      });

      //  SetInterval
      let changeTime = vu.val('changeTime') || 3000;
      if(!(vu.val('autoSlide') === false)){
        let auto = () => {
          currentNumber++;
          changeSlide();
        }
        let clock = setInterval(auto, changeTime);

        //  Stop while hovering
        vu.$el('.banner, .slideButton').hover(() => clearInterval(clock), () => clock = setInterval(auto, changeTime));
      }

      //  Set Slide Show Mode
      let slideShowMode = vu.val('mode');
      let modeSlide = () => {vu.$el('.caption').addClass('mode-slide')};
      let modeCenter = () => {vu.$el('.caption').addClass('mode-center')};
      switch (slideShowMode){
        case 'slide':
          modeSlide();
          break;

        case 'center':
          modeCenter();
          break;

        default:
          modeSlide();
      }
    }
  })

  vu.use('showArrow').then(v => {
    if(v.showArrow === false) vu.$el('.slideButton').remove();
  })

  //  setting customer caption font
  vu.use('captionFontCSS').then(v => {
    delete v.captionFontCSS.width;
    vu.$el('.caption').find('li').css(v.captionFontCSS);
  })

})


// Select
// @select
// @options-[i]
// -options: array, an array of option object
//   -value: number or string
//   -payload: string, the content of the option
// "value" <- string, number or boolean, the value of the selected option 
SelectView.dom(vu => 
  `<div ${vu.ID} class="view-select">
    <select data-component="select">
    </select>
  </div>`
);

let SelectDom = [
  { 'div.view-select': [
    { 'select@select' : ''}
  ]}
];

SelectView.render(vu => {
  vu.use('options').then(v => {
    if(Array.isArray(v.options)){
      v.options.forEach((o, i) =>{
        vu.$el('@select').append(`<option data-component="option-${i}" value="${o.value}">${o.payload}</option>`);
      })

              // Add click listener
      vu.$el(`@select`).off('change').on('change', function() {
        let o = {};
        o.value = vu.$el(`@select`).val();
        o.payload = vu.$el(`@select`).find(`option:selected`).text();        

        vu.res('value', o);
      })
    } 
  })  
});

MyPurelyView.dom(vu => `
 <div ${vu.ID} class="row viewport">
      <div class="hidden-xs" style="float:right; padding: 20px;">
        <button class="btn btn-primary" data-component="mobileBtn">mobile</button>
        <button class="btn btn-primary" data-component="windowBtn">window</button>
      </div>
      <div data-component="form" class="col-md-6 col-xs-12" style="clear:right;">
        <div id="form-view"></div>
        <div>Logo</div>
        <div class="uploader">
          <div class="glyphicon glyphicon-upload" style="font-size:2.5em;"></div>
        </div>
        <div id="imageuploader"></div>
        <div>
          <div class="glyphicon glyphicon-plus-sign" style="font-size:2em; margin:10px 17px;"></div>
        </div>
        <div id="form-list"></div>
        <div id="save-btn" class="btn btn-primary">Save</div>
      </div>
      <div data-component="viewport" class="col-md-6 col-xs-12">
      </div>
    </div>` 
);

MyPurelyView.render(vu => {
  
//form
  let inputs = [{type: "text", label: "App Name", value: 'uuu' },{type: "text", label: "Company Name",value: 'hello'}]; 
  let formview = FormView.build({
    sel: '#form-view',
    method: 'append',
    data:{
      inputs: inputs
    }
  });

  let formlist = UListView.build({
    sel: '#form-list',
    method: 'append',
    data:{
      items:[{title:'Product'},{title:'Blog'}]
    }
  });

  $('#save-btn').click(() => {
    let values = formview.val('values');
    console.log(values);

    vu.res('save', values);

  });
  //toggle RWD
  
  let mobileBtn = vu.$el('@mobileBtn'),
      windowBtn = vu.$el('@windowBtn'),
      form = vu.$el('@form'),
      vp = vu.$el('@viewport');
  mobileBtn.off('click').on('click',() =>{
    console.log('mobileBtn onclick!');
    form.addClass('col-md-6');
    vp.addClass('col-md-6');
  });
  windowBtn.off('click').on('click',() =>{
    console.log('windowBtn onclick!');
    form.removeClass('col-md-6');
    vp.removeClass('col-md-6');
  });
});




