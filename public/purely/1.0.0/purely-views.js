(function($, Cope) {

const Views = Cope.useViews('Purely');

let NavView = Views.class('Nav'),
  BoxView = Views.class('Box'),
  TilesView = Views.class('Tiles'),
  TextareaView = Views.class('Textarea'),
  RichTextareaClass = Views.class('RichTextarea'),
  ParagraphClass = Views.class('Paragraph'),
  DataUpLoaderClass = Views.class('DataUpLoader'),
  ImageUploaderView = Views.class('ImageUploader'),
  PhotoView = Views.class('Photo'),
  GridView = Views.class('Grid'),
  SlideClass = Views.class('Slide'),
  SelectView = Views.class('Select'),
  UListView = Views.class('UList'),
  FormView = Views.class('Form'),
  ListItemView = Views.class('ListItem'),
  SortableListClass = Views.class('SortableList');
  
  ContactsView = Views.class('Contacts'), // to be deprecated

  PurelyPageClass = Views.class('Purely.Page'),
  PurelySectionClass = Views.class('Purely.Section'),
  PurelySectionBasicClass = Views.class('Purely.Section.Basic'),
  PurelySectionCollectionClass = Views.class('Purely.Section.Collection'),
  PurelySectionContactsClass = Views.class('Purely.Section.Contacts'),
  
  PurelyEditNavView = Views.class('Purely.Edit.Nav.Settiings'),// to be depreacted
  PurelyEditSingleView = Views.class('Purely.Edit.Single'), // to be deprecated
  SectionEditView = Views.class('Purely.Edit.Section.Settings'),
  PageEditView = Views.class('Purely.Edit.Page'),
  TypeChooserView = Views.class('Purely.TypeChooser'),
  LayoutChooserView = Views.class('Purely.LayoutChooser'),

  // Purely Layouts for basic sections
  PurelyLayoutSingleView = Views.class('Purely.Layout.Single'),

  // For collections
  PurelyLayoutSlideView = Views.class('Purely.Layout.Slide'),
  PurelyLayoutGridView = Views.class('Purely.Layout.Grid'),
  PurelyLayoutWaterfallView = Views.class('Purely.Layout.Waterfall');

// Nav
// "logo clicked" <- null, callback when @logo being clicked
NavView.dom( vu => [
  { 'header.view-nav': [
    { 'div@logo.logo.bg': '' },
    { 'div.float-right': [
      { 'nav': [
        { 'ul@main-items': '' }
      ]}
    ]},
    { 'div.view-nav-items.bg-w@menu': [
      { 'div.glyphicon.glyphicon-remove.float-right.remove-icon@close-button': '' },
      { 'nav(style = "text-align:center;")': [
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
]);

NavView.render(vu => {
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
  vu.use('items').then( v => {
    let  navItems = [];
    function pend(item){
      
      let method = 'append';
      let comp = item.comp || new Date().getTime() + '_' + Math.floor(Math.random()*1000);
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
        vu.$el(`@${item.el}`)[method](`<li data-component="${comp}" class="user hidden-xs"><a href="${item.href}">${item.text}</a></li>`);
      } else {
        //vu.$el(`@${item.el}`)[method](`<li data-component="${comp}" class="user hidden-xs"><a>${item.text}</a></li>`);
      }
      // setting click event  
      vu.$el('@'+ comp).off('click').on('click',() => {
        vu.res('comp', item.comp);
      });
    }
    //navItems.forEach(pend);
    v.items.forEach(pend);

    if (navItems.length > 0) {
      vu.$el('@menu-button').removeClass('hidden');
    }
  }); //end of items
  vu.use('usingMembers').then(v => {
    if (v.usingMembers) {
      vu.$el('@user').removeClass('hidden');
      vu.$el('@signIn').addClass('hidden');
    } else {
      vu.$el('@signIn').removeClass('hidden');
      vu.$el('@user').addClass('hidden');
    }
  });

  // animate
  vu.$el('@menu-button').off('click').on('click',() => {
    vu.$el('@menu').fadeIn(300);
    $(".logo float-right").hide();
  });

  vu.$el('@close-button').off('click').on('click',() => {
    vu.$el('@menu').fadeOut(300);
    vu.$el('@user-menu').fadeOut(300);
    $(".logo float-right").show();
  });

  vu.$el('@user').off('click').on('click',() => {
    vu.$el('@user-menu').fadeIn(300);
    $(".logo .float-right").hide();
  });

  // Set @signIn click event
  vu.$el('@signIn').off('click').on('click',() => {
    vu.res('signIn');
  });
  // Set @signOut click event
  vu.$el('@signOut').off('click').on('click',() => {
    vu.res('signOut');
    vu.$el('@user-menu').fadeOut(300);
    $(".logo .float-right").hide();
  });
});

//UList
//-comp: str, set element data-component
//-items: array, input for list
UListView.dom(vu => [
  { 'div': [
    { 'ul': ''}
  ]}
]);

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

// BoxView
// @box
// -css: object, @box's style
BoxView.dom(vu => [
  { 'div.view-box@box': ''}
]);

BoxView.render(vu => {
  vu.use('css').then(v => {
    vu.$el('@box').css(v.css);
  });
  vu.use('text').then(v=> {
    vu.$el().html(v.text.join(' '));
  });
});


// Tiles
// - w: string, total width
// - h: string, total height
// - cut: obj, cut sequences
// - colored: boolean, true to color automatically
TilesView.dom(vu => [
  { 'div': ''}
]);

TilesView.render(vu => {
  let w = vu.get('w'),
      h = vu.get('h'),
      colored = vu.get('colored') || false,
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
        'background-color': 'transparent'//'#' + Math.floor(Math.random() * 1000)
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

  cmds.map(pid => { // pid: cmd
    let cmd = cutObj[pid]; // 'x20 y30' 
    let cs = cmd.split(' '); // ['x20', 'y30']
    let xcuts = [];
    let ycuts = [];

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
      let eachCSS = {
        display: 'block',
        position: 'relative',
        float: 'left',
        width: '100%', 
        height: '100%',
        padding: '0',
        margin: '0',
        border: '0',
        overflow: 'scroll',
        'box-sizing': 'border-box'
      };
      if (colored) {
        eachCSS['background-color'] = '#' + Math.floor(Math.random() * 1000);
      }
      css.push(eachCSS);
    }

    css = css.map((s, i) => {

      // Modify s
      s.width = xcuts[i % (xcuts.length-1) + 1] - xcuts[i % (xcuts.length-1)];
      s.height = ycuts[Math.floor(i / (xcuts.length - 1)) + 1] - ycuts[(Math.floor(i / (xcuts.length - 1)))];

      s.width = s.width + '%';
      s.height = s.height + '%';

      let myId = i + '';
      if (pid != 'r') {
        myId = pid + myId;
      }
      
      vu.set(myId, BoxView.build({
        sel: vu.get(pid).sel(),
        method: 'append',
        data: {
          css: s
        }
      }));
      return s;
    }); // end of css.map
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
// - value: string, current value
TextareaView.dom(vu => [
  { 'textarea(rows=1).view-textarea': '' }
]);

TextareaView.render(vu => {
  let height, 
      avoidAuto,
      $this = vu.$el(),
      value = vu.get('value');

  let resize = function(e) {
    $this.css('height', 'auto');
    $this.css('height', $this[0].scrollHeight + 'px');
  };

  let delayResize = function() {
    setTimeout(resize, 0);
  };

  let update = function(e) {
    // Update the value
    let updatedValue = $this.val().trim();
    vu.set('value', updatedValue);
    vu.res('value', updatedValue);
  };
  
  // Insert the value
  $this.val(value);
  $this.off('keyup keydown focus')
  .on('change', resize)
  .on('paste', delayResize)
  .on('cut', delayResize)
  .on('drop', delayResize)
  .on('keydown', delayResize)
  .on('keyup', update);

  delayResize();
});

// RichTextarea
// - showDone: boolean
// "done" <- array: get each of Paragraph's Data
RichTextareaClass.dom(vu => [
  { 'div.view-richtextarea': [
    { 'div@content(contenteditable = true)': [
      { 'p': 'Title' }] 
    }, 
    { 'button@add': 'Add Image' },
    { 'button@done.hidden': 'Done' }]
  }
]);

RichTextareaClass.render(vu => {
  let vus = {};

  if (vu.get('showDone')) {
    vu.$el('@done').removeClass('hidden');
  }

  let getData = function() {
    let data = [];
    vu.$el('@content').children().each(function() {
      let p = $(this).html(),
          obj = {},
          $el;
      obj.type = 'text';
      obj.text = p;
         
      // Rewrite dom by its form
      if (p.indexOf('http') === 0) {
        // Build Paragraph at $(this)
        let a = ParagraphClass.build({
          sel: $(this),
          data: {
            type: 'link',
            text: p
            //link: p
          }
        })
        vus[a.id] = a;
      }
      
      // Get type and value 
      $el = $(this).children(0);
      if ($el && $el.data('vuid')) {
        // Get view by vuid
        let vuId = $el.data('vuid');
        let restoreData = vus[vuId].get();
        obj = restoreData;
      }
      if (p === '<br>' || !p) {
        // Do nothing...
      } else {
        data = data.concat(obj);
      }
    }); // end of each
    vu.set('data', data)
    vu.res('data', data)
    return data;
  }; // end of getData

  vu.$el('@content').off('blur').on('blur', e => {
    let data = getData();
    console.log(getData());
    if( data[data.length - 1].type === 'link'
      && vu.$el('@content').children().last().html() != '<br>') {
      vu.$el('@content').append('<p><br></p>');
    }
  });

  vu.$el('@content').off('keyup').on('keyup', e => {
    let html = vu.$el('@content').html();

    if (e.which == 13) {
      let data = getData();
    }
  });

  vu.$el('@content').off('keydown').on('keydown', e => {
    let html = vu.$el('@content').html();
    if (html === '<p><br></p>' && e.which === 8) {
      e.preventDefault();
      return;
    }
  });

  vu.$el('@add').off('click').on('click', function(e) {
    vu.$el('@content').append('<p><img src="http://fakeimg.pl/250x100/"></p>')
  })

  vu.$el('@done').off('click').on('click', function(e) {
    vu.res('done', getData());
  })

  getData();
});
// End of RichTextarea

// Paragraph
// - type: string, 'text' || 'link' || 'image' || 'video' || 'audio'
// - text
// - url
// - mode
ParagraphClass.dom(vu => [
  { 'div': [
    { 'div@textarea': '' },
    { 'div@preview-link.hidden(contenteditable=false)': '' },
    { 'div@preview-media.hidden': '' },
    { 'div@edit-link.hidden': '' }]
  }
]);

ParagraphClass.render(vu => {
  let textarea = Views.class('Textarea').build({
    sel: vu.sel('@textarea')
  });
  textarea.$el().off('click').on('click', e => {
    e.stopPropagation();
    textarea.$el().focus();
  });
  textarea.$el().off('keypress.' + vu.id).on('keypress.' + vu.id, e => {
    if (e.which == 13) { e.preventDefault(); }
  });

  function toggle (component) {
    vu.$el().children().addClass('hidden');
    vu.$el('@' + component).removeClass('hidden');
  } // end of toggle

  function checkType (text) {
    let type = 'text';
    if(text.indexOf('http') === 0){
      type = 'link'
    }
    return type;
  }

  vu.$el('@textarea').off('keyup').on('keyup', function (e) {
    vu.set('text', textarea.val().value);
    if (e.which === 13) {
      // Check text type
      vu.res('enter');
      vu.val('type', checkType(vu.get('text')));
    }// End of if (e.which === 13)
    if (e.which === 40) {
      vu.res('down');
    }
    if (e.which === 38) {
      vu.res('up');
    }
  });// end of @textarea keyup event

  vu.use('type').then(v => {
    if (v.type === 'link') {
      // let link = vu.get('link') || vu.get('text');
      let link = vu.map('link', link => link || vu.get('text') || '' );
   

      toggle('preview-link');
      vu('@preview-link').html([
        ['span@btn-edit(style="margin: 10px 10px 10px 0; cursor: pointer;").as-btn.color-w.bg-blue[w40px]', 'Edit'],
        [`a(href=${vu.get('link') || vu.get('text')})`, vu.get('text')]
      ]);
      vu.$el('@btn-edit').off('mousedown').on('mousedown', function (e) {
        e.stopPropagation();
      }).off('click').on('click', e => {
        // Use Cope.modal to open the link editor
        let form = Cope.modal(Views.class('Form'), {
          inputs: [
            { type: 'text', label: 'Title', value: vu.get('text') },
            { type: 'text', label: 'Url', value: vu.get('link') }
          ]
        }).res('values', vals => {
          vu.val({
            'text': vals[0],
            'link': vals[1]
          });
        }); // end of Cope.modal

      }); //  end of vu.$el('@btn-edit') click event
    } // end of if
  }); // end of use('type')
});
// End of Paragrpah

// DataUpLoader
// - category: array
DataUpLoaderClass.dom(vu => [
  { 'div': [
    { 'div@section': [
      { 'div@page-1(style="display: flex; width: 30%; justify-content:space-around;")': [
        { 'div@blog': 'Blog' },
        { 'div@item': 'Item' }]
      },
      { 'div@page-2.hidden': [
        { 'div@type': '' },
        { 'div@button.hidden(style="display: flex; width: 30%; justify-content:space-around;")': [
          { 'div@add-text': 'Add text'},
          { 'div@add-image': 'Add image'},
          { 'div@add-link': 'Add link'}]
        }]
      },
      { 'div@page-3.hidden': 'page3'}]
    },
    { 'div(style="display: flex; width: 50%; justify-content:space-around;")': [
      { 'div@back.hidden': 'Back' },
      { 'div@next': 'Next'}]
    }]
  } 
]);

DataUpLoaderClass.render(vu => {
  let richTextarea,
      listItem,
      LT,
      idx = 1;

  function toggle(select) {
    let sign = (select === 'next') ? 1 : -1;
    idx = idx + 1 * sign;
    vu.$el('@section').children().addClass('hidden');
    vu.$el('@page-' + idx).removeClass('hidden');
  }

  ['blog', 'item'].map(x => {
    vu.$el('@' + x).off('click').on('click', e => {
       vu.$el('@page-1').children()
      .removeClass('selected')
      .css('color', '#000');

      vu.$el('@' + x)
      .css('color', 'red')
      .addClass('selected');
      
      let type = vu.map('type',type => x , true);
    })
  }); // end of map

  // toggle event
  vu.$el('@back').off('click').on('click', e => {
    if( idx > 1) {
      toggle('back');
    }
    if ( idx === 1) {
      vu.$el('@back').addClass('hidden');
    }
  }); // end of @back click 

  vu.$el('@next').off('click').on('click', e => {
    if( idx < 3) {
      toggle('next');
      vu.$el('@back').removeClass('hidden');
    }
  }); // end of @next click

  // Build RichTextarea
  switch (vu.get('type')) {
    case 'blog':
      vu.$el('@button').addClass('hidden');

      richTextarea = RichTextareaClass.build({
        sel: vu.sel('@type')
      }).res('done', data => {
        console.log('clicked done', data);
      });
      break;
    case 'item':
        LT = SortableListClass.build({
        sel: vu.sel('@type')
      })
      vu.$el('@button').removeClass('hidden')
      break;
    default:
      break;
  } // end of switch

  // type click event
  ['text', 'image', 'link'].map(type => {
    vu.$el('@add-' + type).off('click').on('click', e => {
      LT.val('new',{
        viewClass: ListItemView,
        data: {
          type: type,
          label: 'label',
          editable: true
        }
      })

    });
  }) // end of type click event

});
// End of DataUpLoader

// ImageUploader
// @preview
// @button 
// @files: a file input
// - files: array, an array of image files
// - multi: boolean
ImageUploaderView.dom(vu => [
  { 'div.view-image-uploader.uploader': [
    { 'div@preview.preview': '' },
    { 'div.control': [
      { 'div.btn-upload@button': 'Upload'}]
    },
    //{ 'div.glyphicon.glyphicon-upload.upload-icon': '' },
    [ 'input@files.hidden(type="file" name="img[]" ' 
       + (vu.get('multi') ? 'multiple' : '')
       + ')', '']
  ]}
]);

ImageUploaderView.render(vu => {
	let $files = vu.$el('@files');
			$preview = vu.$el('@preview'),
			$button = vu.$el('@button'),
			$done = vu.$el('@done'),
			files = [],
      srcs = [];
	$button.off('click').on('click', () => {
    $files.click();
	});

	$files.off('change').on('change', e => {
		if ($files[0].files && $files[0].files[0]){
			for (let i = 0; i<e.target.files.length; i++) {
				let reader = new FileReader();
				reader.readAsDataURL($files[0].files[i]);
        files.push($files[0].files[i]);

        // Update files array
        vu.set('files', files);

				reader.onload = e => {
					srcs.push(e.target.result);
					//vu.$el(`@img-${i}`).append(`<img src="$e.target.result}" class="img-responsive">`);
					GridView.build({
						sel: vu.sel(`@preview`)   
					}).val({
						src: srcs//e.target.result
					});
          vu.set('files',files);
				};
				//$preview.append(`<div data-component="img-${i}"></div>`)
			}
		} // end of if
	});// end of change-event
});
// End of ImageUploader

// FormView
// FormView.dom(vu =>`
//   <div ${vu.ID}>
//     <div class="view-form">
//       <ul data-component="inputs"></ul>
//     </div>
//   </div>
// `);
FormView.dom(vu => [
  { 'div.view-form': [
    { 'ul@inputs': ''}
  ]}
]);

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
          vu.res('values', vals);
      });// end of keyup
    });// end of forEach
  });// end of vu.use
});


// PhotoView
// @img: for photo src
// @caption: for photo caption
// -link: string, the url for the photo
// -src: string, the photo url
// -caption: string, a caption for the photo
// -css: object, css for decoration the outer div
// -css['@img']: object, css for decoration the img
// -css['@caption']: object, css for decoration the caption
PhotoView.dom(vu => [
  { 'div': [
    { 'a(href="#")': [
      { 'img@img.img-responsive(src="")': ''}
    ]},
    { 'div@caption': [
      { 'a.text(href="")': ''}
    ]}
  ]}
]);

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
// GridView.dom(vu =>
//   `<div class='view-grid' ${vu.ID}>
//       <div class='row clear-margin' data-component="grid"></div>
//     </div>
//   </div>`
// );
GridView.dom(vu => [
  { 'div.view-grid': [
    { 'div.row.clear-margin@grid': ''}
  ]}
]);

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
SlideClass.dom(vu => [
  { 'div.view-slide': [
    { 'div.slide': [
      { 'i.slideButton.slideButtonLeft.glyphicon.glyphicon-chevron-left': ''},
      { 'i.slideButton.slideButtonRight.glyphicon.glyphicon-chevron-right': ''},
      { 'div.banner@slideItem': ''},
      { 'div.caption': [
        { 'ul@slideCaption': ''}]
      },
      { 'div.slideNav': [
        { 'ul@slideNav': ''}]
      }]
    }]
  }
]);

SlideClass.render(vu => {

  // Default CSS Setting
  let containerCSS = {
    width: '100%',//'680px',
    height: '100%'// '390px'
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
        let href = '';
        if (item.link) {
          href = 'href="' + item.link + '" target="_blank"';
        }
        //vu.$el('@slideItem').append('<a '+ alink +'><div class="slideItem item' + index +'"></div></a>');
        //vu.$el('@slideCaption').append('<li>'+ item.caption +'</li>');
        //vu.$el('@slideNav').append('<li data-navitem="'+index+'"><div class="slideNavItem"></div></li>');
        vu('@slideItem').append([
          ['a(' + href + ')', [
            [ 'div@item-' + index + '.slideItem' ]
          ]]
        ]);
        vu('@slideCaption').append([{ 'li': item.caption || '' }]);
        vu('@slideNav').append([
          [ 'li@navitem-' + index, [
            [ 'div.slideNavItem' ]] 
          ]
        ]);
      })
        
      vu.$el('@slideNav').find('li').first().addClass('active');

      let slideWidth = vu.$el('.banner').width();
      let slideHeight = vu.$el('.banner').height();

      //  setting CSS to adjust slide
      vu.$el('.slide').css({
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
        if (item.imgsrc) {
          vu.$el('@item-'+ index).css('background-image', 'url('+item.imgsrc+')');
        }
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
        vu.$el('@navitem-' + currentNumber).addClass('active');
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

// Slide
SlideClass.dom(vu => [
  { 'div.view-slide': [
    { 'ul@items.slide-items': '' }] 
  }
]);

SlideClass.render(vu => {
  let data = vu.map('data', x => Array.isArray(x) ? x : []),
      count = 0, 
      length = data.length,
      effect = vu.get('effect'); // dissolve, slide
  let slideDom = function(x) {
    return [
      { '.slide[w100%;h100%]': [
        { '.text-wrap': [
          { 'h1': x.title },
          { 'p': x.content }] 
        }] 
      }
    ];
  };
  let showSlide = function() {
    vu.$el('li').fadeOut(400);
    setTimeout(function() {
      vu.$el('@item-' + count).fadeIn(800);
    }, 300);
    count++;
    if (count === length) { count = 0; }
  };

  // Make slides
  data.map((x, i) => {
    vu('@items').append([['li@item-' + i, slideDom(x)]]);
    if (x && x.imgsrc) {
      vu.$el('@item-' + i).css({
        'background-image': 'url("' + x.imgsrc + '")'
      });
    }
  });
  
  // Show slides
  showSlide();
  if (length > 1) {
    setInterval(showSlide, 4200);
  }
});
// End of Slide

// Select
// @select
// @options-[i]
// -options: array, an array of option object
//   -value: number or string
//   -payload: string, the content of the option
// "value" <- string, number or boolean, the value of the selected option 
SelectView.dom(vu => [
  { 'div.view-select': [
    { 'select@select' : ''}
  ]}
]);

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

// Contact
// @title: h3
// @list: ul
// - title: string
// - items: array of strings
ContactsView.dom(vu => [
  { 'h3@title': '' },
  { 'ul@list': '' }
]);

ContactsView.render(vu => {
  vu.use('title').then(v => {
    vu.$el('@title').text(v.title);
  });

  vu.use('items').then(v => {
    if (!Array.isArray(v.items)) {
      return;
    }
    let items = v.items.map(item => {
      return '<li>' + item.value + '</li>';
    }).join('');
    vu.$el('@list').html(items);
  });
});

// Purely.Layout.Single
PurelyLayoutSingleView.dom(vu => [
  { 'div.view-purely-layout-single': [
    { 'h5@title.title': ''},
    { 'p@content.content': ''},
    { 'div@col.col': '' }
  ]}
]);  

PurelyLayoutSingleView.render(vu => {
  vu.$el().children().html('');

  let vals = vu.val();

  // vals.basic
  vu.use('basic').then(v => {
    Object.keys(v.basic).map(key =>{
      switch (key) {
        case 'title':
          vu.$el('@title').text(v.basic.title);
          break;
        case 'content':
          vu.$el('@content').html(v.basic.content.replace(/\n/g, '<br>'));
          break;
        case 'imgsrc':
          vu.$el().addClass('bg-img')
          .css({'background-image': `url(${v.basic.imgsrc})`});
          break;
        default: 
      }
    });
  });

  // vals.collection
  vu.use('collection').then(v => {
    if (v.type != 'collection') return;

    SlideView.build({
      sel:vu.sel('@col'),
      data: {
        data: v.collection.data,
        container: {
          width: '100%',
          height: '100%'
        }
      }
    });
  });

  // vals.contacts
  vu.use('contacts').then(v => {
    if (v.type != 'contacts') return;
    
    let title = v.basic.title || '';

    ContactsView.build({
      sel: vu.sel('@col'),
      data: {
        title: title,
        items: v.contacts
      }
    })
   });
});

// ListItem
// @value: text input or textarea
// - label: string
// - value: string
// - editable: boolean
// - textarea: boolean, true to use textarea instead
// "value" <- string: triggered on every keyup
// "done": <- string: only triggered on Enter or focusout event
ListItemView.dom(vu => [
  { 'div.view-list-item': [ 
    { 'div@label.item-label': '' },
    { 'div@display.item-display': '' },
    { 'div@editable.hidden.color-orange': '' }]
  }
]);

ListItemView.render(vu => {
  let type = vu.map('type', x => x || 'text'),
      displayValue = '',
      $textInput, 
      url,
      editable = vu.get('editable'),
      placeholder = vu.get('placeholder') 
        ? ' placeholder = "' + vu.get('placeholder') + '" '
        : '';

  vu.map('value', x => x || '');

  // Set editable input
  switch (type) {
    case 'text':
      vu('@editable').html([
        [ 'input(type="text"' 
          + placeholder
          + 'value = "' + vu.get('value') + '"'
          + ')' ]
      ]);
      displayValue = (vu.get('value') + '')
        .replace(/\n/g, '<br>');
      $textInput = vu.$el('@editable').find('input');
      $textInput.off('keyup').on('keyup', e => {
        vu.res('value', vu.map('value', x => {
          let newVal = $textInput.val().trim();
          if (!newVal) newVal = '';
          return newVal;
        }));
        if (e.which === 13) {
          vu.res('done', vu.get('value'));
          vu.val('edit', false);
        }
      })
      break;
    case 'textarea':
      let textarea = TextareaView.build({
        sel: vu.sel('@editable'),
        data: {
          value: vu.val('value')
        }
      });
      textarea.res('value', value => {
        vu.set('value', value);
        vu.res('value', value);
      });
      $textInput = textarea.$el();
      displayValue = (vu.get('value') + '')
        .replace(/\n/g, '<br>');
      break;
    case 'media':
      vu.$el('@display').css({
        'width': '100px',
        'height': '100px',
        'margin-top': '8px',
        'background-color': '#eee',
        'background-position': '50% 50%',
        'background-size': 'cover',
        'background-repeat': 'no-repeat',
        'cursor': 'pointer'
      });

      let value = vu.get('value') || {};
      if (value.vidsrc) {
        // Video
      } else if (value.imgsrc) {
        // Image
        url = value.imgsrc;
        vu.$el('@display').css({
          'background-image': 'url("' + url + '")'
        });
      }
      break;
    case 'select':
      // TBD
      break;
    default:
  }

  if (editable) {
    vu.$el().addClass('hover-effect')
      .off('click').on('click', e => {
        vu.val('edit', true);
      });
  }

  // Set label
  vu('@label').html(vu.map('label', x => x || ''));

  // Render with value
  if (displayValue) {
    vu('@display').html(displayValue);
  }

  // Edit mode
  if (vu.val('edit')) {
    if ($textInput) { // type == 'text' or 'textarea'
      $textInput.focus();
      $textInput.off('focusout').on('focusout', e => {
        vu.res('done', vu.get('value'));
        vu.val('edit', false);
      });
      vu.$el('@display').addClass('hidden');
      vu.$el('@editable').removeClass('hidden');
    }
    if (vu.get('type') == 'media') { // type == 'media'
      let modalView = Cope.modal('file', {
        maxWidth: 400,
        saveOriginal: true
      }).res('done', files => {
        if (files && files[0]) { 
          // TBD: imgsrc should be the true url
          vu.set('value', { 
            imgsrc: files[0].image,
            url: 'TBD',
            file: files[0]
          });
          vu.res('value', vu.get('value'));
          vu.val('edit', false);
        }
      });
    } // end of type 'media'
  } else {
    vu.$el('@display').removeClass('hidden');
    vu.$el('@editable').addClass('hidden');
  }
}); 
// End of ListItem

// SortableList
// - List: object, inner sortable list
// - height: number, each block's height
// "item clicked" <= obj, the selected item
SortableListClass.dom(vu => [
  { 'div.view-sortable-list': '' }
]);

SortableListClass.render(vu => {
  let List,
      newBlock, // { viewClass, data }
      height,
      renderBlock;

  height = vu.map('height', h => {
    if (!h) return 100;
    return h;
  });

  renderBlock = vu.map('renderBlock', rb => {
    if (!rb) {
      rb = function(item) {
        let cssObj = {}, 
            itemHeight = item.height || height;
        if (item.idx < 0) {
          vu.$el().fadeOut(300);
          cssObj.display = 'none';
          cssObj.position = 'absolute';
          cssObj.top = '-9999px';
        } else {
          cssObj.position = 'relative';
          cssObj.width = '100%';
          //cssObj['min-height'] = itemHeight + 'px';
        }
        if (!!cssObj) {
          vu.$el('@' + item.comp).css(cssObj);
        }
      }; // end of rb
    }
    return rb;
  });

  // List
  List = vu.map('List', List => {
    if(!List) {
      let makeList = function(o) {
        let items = [], // { rid, comp, idx, view }
            my = {};

        my.get = function(rid) {
          if (!rid) {
            return items;
          }
          return items.filter(item => (item.rid === rid))[0] || {};
        };

        my.getByIdx = function(idx) {
          if (isNaN(idx)) {
            return items;
          }
          return items.filter(item => (item.idx === idx))[0] || {};
        };

        my.getByOrder = function(i) {
          return items[i];
        };

        // s: params of the section
        my.insert = function(newBlock, i) {
          i = !isNaN(i) ? i : items.length;

          // Set random Id
          let rid = new Date().getTime() + '_' + Math.floor(Math.random()*1000),
              item = {};
          let target = my.getByIdx(i);
          // Update items array
          item = {
            idx: i,
            rid: rid,
            comp: 'item-' + rid,
            height: newBlock.height || height
          };

          if (i < items.length) {
            // Handle the old array
            items.map(item => {
              if (item.idx >= i) {
                item.idx = item.idx + 1;
              } 
            });
          }
          //let target = my.getByIdx(i);
          //Append new block in dom
          if (!target || !target.view) {
            vu.$el().append(`
              <div class="sortable-item" data-component="${item.comp}"></div>
            `);
          } else if (i < items.length) {
            vu.$el('@' + target.comp).before( `
              <div class="sortable-item" data-component="${item.comp}"></div>
            `);
          } else {
            vu.$el('@' + target.comp).after( `
              <div class="sortable-item" data-component="${item.comp}"></div>
            `);
          }

          if (!newBlock && !newBlock.viewClass) {
            throw 'newBlock.viewClass is invalid';
          }
          item.view = newBlock.viewClass.build({
            sel: vu.sel('@' + item.comp),
            data: newBlock && newBlock.data || {}
          });

          // Render the block
          renderBlock(item);

          Object.keys(o).map(key => {
            if (key.indexOf('on') != 0) { return; }
            let evt = key.slice(2);
            vu.$el('@' + item.comp).off(evt + '.' + rid).on(evt + '.' + rid, function(e) {
              o[key](item, e, vu.id);
            });
          }); // end of Object.keys ... map

          // Update items array
          items = items.concat(item);
          return item;
        }; // end of my.insert

        my.remove = function(i) {
          items = items.reduce((arr, item) => {
            if (item.idx === i) {
              item.idx = -1;
              renderBlock(item);
              return arr;
            } else if (item.idx > i) {
              item.idx = item.idx - 1;
              renderBlock(item);
            }
            arr = arr.concat(item);
            return arr;
          }, []);
        }; // end of my.remove

        my.swap = function(i, j) {
          let item_i, item_j;
          let arr = [];
          arr = items.map(item => item.idx);
          item_i = arr.indexOf(i);
          item_j = arr.indexOf(j);
          if (item_i != item_j) {
            items[item_i].idx = j;
            items[item_j].idx = i;
            renderBlock(items[item_i]);
            renderBlock(items[item_j]);
          }
        }; // end of my.swap

        my.order = function(order) {
          let tmp = order.concat([]);
          if (order.length != items.length || !Array.isArray(order)) { return; }
          if (tmp.sort((a, b) => a-b).filter((idx, i) => idx != i).length != 0) { return; }
          items.map((item, i)=> {
            item.idx = order[i]
          });
          for(let i = 0; i < order.length - 1; i++) {
            vu.$el('@' + my.getByIdx(i).comp).after(vu.$el('@' + my.getByIdx(i+1).comp));
          }
        }; // end of my.order
        return my;
      };// end of makeList 

      let draggedRid,
          startItem, 
          startPageX, 
          startPageY, 
          box, 
          elHeight;
      List = makeList({
        height: height,
        onclick: function(item, e) {
          vu.res('item clicked', item);
        },
        // ondragstart: function(item, e) {
        //   e.preventDefault;
        //   draggedRid = item.rid;
        //   List.get(item.rid).isDragging = true;
        // },
        onmousedown: function (item, e) {
          draggedRid = item.rid;
          startItem = item; //vu.$el('@' + item.comp); // .col-item wrap of the dragged item
          let itemRectAbs = item.view.$el().offset();
          let itemRect = item.view.$el().parent().position();
          let itemHeight = vu.$el('@' + startItem.comp).height();//startItem.height();
          vu.$el('@' + startItem.comp).css({
            'position': 'absolute',
            'z-index': '9999' 
          });

          startPageX = e.pageX - itemRect.left;
          startPageY = e.pageY - itemRect.top;
          mousePosX = startPageX - itemRectAbs.left;
          mousePosY = startPageY - itemRectAbs.top;
        
          // pageTop = e.pageY - itemHeight*item.idx;
          // pageLeft = e.pageX;
          vu.$el('@' + item.comp).after(`<div style="height:${itemHeight}px;" class="block"></div>`);
          vu.res('item clicked', item);
        },
        onmousemove: function (item, e) {
          e.stopPropagation();
          let targetRect = item.view.$el()[0].getBoundingClientRect();
          if(startItem) {
            vu.$el('@' + startItem.comp).css({
             'top': e.pageY - startPageY,
             'left': e.pageX - startPageX 
            });
          }

          if(startItem){
            List.get().filter(item => item.rid != startItem.rid).map(item => {
              let itemRect = item.view.$el().offset(),//[0].getBoundingClientRect(),
                  originVect = {},
                  mouseVect = {};

              itemRect.width = item.view.$el().width();
              itemRect.height = item.view.$el().height();

              originVect.x = itemRect.left + (itemRect.width / 2);
              originVect.y = itemRect.top + (itemRect.height / 2);
              mouseVect.x = e.pageX - originVect.x; // must less than w/2
              mouseVect.y = e.pageY - originVect.y; // must less than h/2
              
              //console.log(mouseVect,originVect, itemRect);
              if ((Math.abs(mouseVect.x) < (itemRect.width / 2))
                && (Math.abs(mouseVect.y) < (itemRect.height / 2))) { // isOver
                let d = startItem.idx - item.idx; // direction
                //console.log(d, mouseVect.y, item);
                if ((d * mouseVect.y) < 0) { // move!!!
                  let arr = List.get().map((x, i) => i), // 0, 1, ..., N
                      startIdx = startItem.idx,
                      insertIdx = item.idx,
                      tmp,
                      cutArr = [],
                      sortedRids = {};

                  if (startIdx > insertIdx) {
                    tmp = startIdx;
                    startIdx = insertIdx;
                    insertIdx = tmp;
                    vu.$el('@' + item.comp).before(vu.$el('.block'));
                  } else {
                    vu.$el('@' + item.comp).after(vu.$el('.block'));
                  }

                  cutArr = arr.slice(startIdx, insertIdx + 1);
                  //console.log(cutArr);
                  cutArr = cutArr.map((x, i, arr) => {
                    return arr[(i - 1 + arr.length) % arr.length];
                  });
                  arr = arr
                    .slice(0, startIdx)
                    .concat(cutArr)
                    .concat(arr.slice(insertIdx + 1));
                  
                  arr.map((idx, i) => {
                    sortedRids[i] = List.getByIdx(i).rid; // items[i] <- rid
                  });

                  arr.map((idx, i) => {
                    List.get(sortedRids[i]).idx = idx;
                  });
                } // end of "move"
              }
            });
          }
        },
        onmouseup: function (item, e) {
          if(startItem){
            vu.$el('@' + startItem.comp).css({
              'position': 'relative',
              'top': 'auto',
              'left': 'auto',
              'z-index': 1
            });
            //reset
            
            if(vu.$el('.block')) {
              vu.$el('.block').after(vu.$el('@' + startItem.comp));
              vu.$el('.block').remove();
              itemHeight = 0;
            }
            startItem = '';
            vu.res('order', List.get().map(item => item.idx));
          }
        },
        onmouseleave: function(item, e){
          if(startItem){
            vu.$el('@' + startItem.comp).css({
              'position': 'relative',
              'top': 'auto',
              'left': 'auto',
              'z-index': 1
            });
            //reset

            if(vu.$el('.block')) {
              vu.$el('.block').after(vu.$el('@' + startItem.comp));
              vu.$el('.block').remove();
              itemHeight = 0;
            }
            startItem = '';
          }
        }
      });
    }
    return List;
  }); // end of vu.map('List', ...)

  // To append new block
  vu.map('new', newBlock => {
    if (newBlock) {
      List.insert(newBlock);
    }
  });

  vu.map('order', newOrder => {
    if (newOrder) { // eg. <- [1, 2, 0, 3]
      List.order(newOrder);  
    }
  });
}); // end of SortableList
// Usage:
// let SL = SortableListClass.build({ 
//   sel:'...',
//   data: { height: 100 }
// });

// SL.res('item clicked', item => {
//   item.view
//   item.idx
//   item.rid
//   item.comp
// })

//sections.map(x => {
//  SL.val('new', {
//    viewClass: vc,
//    data: x
//  });
//});

// SL_List = SL.get('List');
// SL_List.get() => [{ idx, rid, comp, view }]


// Purely.Page
// - bgFixed: boolean, true to set @mask position 'fixed'
PurelyPageClass.dom(vu => [{ 'div.view-purely-page': [
  { 'div@page.purely-page': '' },
  { 'div@mask.page-color-mask': '' }] 
}]);

PurelyPageClass.render(vu => {
  let sectionsData = [], // to store sections data
      sampleSectionsData = [], // default sample sections
      sampleText = ''; // default sample text to fill up with

  // Set the position of background based on values
  vu.map('bgFixed', bgAbs => {
    let vuOffset = vu.$el().offset(),
        vuPos = vu.$el().position(),
        cssObj = {};
    if (bgFixed) {
      cssObj = {
        position: 'fixed',
        top: vuOffset.top - vuPos.top,
        left: vuOffset.left - vuPos.left
      }
    } else {
      cssObj = {
        position: 'absolute',
        top: 0 - vuPos.top,
        left: 0 - vuPos.left
      }; 
    }
    vu.$el('@mask').css(cssObj);
    return bgAbs;
  }); // end of map('bgAbs')
}); // end of Purely.Page

// Purely.Section
PurelySectionClass.dom(vu => [
  { 'div.view-purely-section': [
    { 'div.layer-comp': [
      { 'div.textbox': [
        { 'h2@title.textbox-title': '' },
        { 'section@content.textbox-content': '' }] 
      }, 
      { 'div@comp.compbox': '' }]
    }, 
    { 'div@mask.layer-mask': '' }, 
    { 'div@background.layer-bg': '' }] 
  }
]);

PurelySectionClass.render(vu => {
  let type = vu.get('type'),
      style = vu.get('style'),
      title = vu.map('title', x => x || ''),
      content = vu.map('content', x => x || ''),
      media = vu.get('media'),
      data = vu.get('data'),
      compSel = vu.sel('@comp'),
      compType;

  if (style) {
    style.split('/').map(clz => {
      if (!clz) return;
      if (clz == 'comp-full') { compSel = vu.sel('@mask'); }
      if (clz == 'comp-slide') { compType = 'slide'; }
      vu.$el().addClass(clz);
    }); 
  }

  if (title) { vu.$el('@title').text(title); }
  if (content) { vu.$el('@content').html(content.replace(/\n/g, '<br>')); }
  if (media) {
    if (media.imgsrc) {
      let url = media.imgsrc;
      vu.$el('@background').css('background-image', 'url(' + url + ')');
    }
  }

  switch (type) {
    case 'basic':
      break;
    case 'collection':
      if (compType == 'slide' && Array.isArray(data)) {
        Views.class('Slide').build({
          sel: compSel,
          data: {
            data: data
          }
        });
      }
      break;
    case 'contacts':
      break;
    default:
  }
}); 
// End of Purely.Section






// Purely.Section.Basic
// @title
// @content
// @comp
// @bg-mask
PurelySectionBasicClass.dom(vu => [
  { 'section.view-purely-section-basic': [
    { 'div.text-wrap': [
      { 'h2@title': '' },
      { 'p@content': '' }]
    }, 
    { 'div@comp.comp-wrap': '' },
    { 'div@bg-mask.color-mask': '' }] 
  }
]);

PurelySectionBasicClass.render(vu => {
  let title = vu.get('title') || '',
      content = vu.get('content') || '',
      layout = vu.get('layout') || 'bold-left',
      compLayout = vu.get('compLayout') || false,
      imgsrc = vu.get('imgsrc'),
      vidsrc = vu.get('vidsrc'),
      textColor = vu.get('textColor'),
      bgColor = vu.get('bgColor'),
      bgColorStrength = vu.get('bgColorStrength');

  title = title.replace(/\n/g, ' ');
  content = content.replace(/\n/g, '<br>');
  if (vidsrc) {
    // TBD
  } 
  if (imgsrc) {
    vu.$el().css({
      'background-image': 'url(' + imgsrc + ')' 
    });
  } 
  if (bgColor) {
    vu.$el('@bg-mask').css({
      'background-color': bgColor  
    });
  } 
  if (!isNaN(bgColorStrength)) {
    vu.$el('@bg-mask').css({
      'opacity': bgColorStrength  
    });
  }
  if (textColor) {
    vu.$el().css({
      'color': textColor
    })
  }

  vu('@title').html(title);
  vu('@content').html(content);
  vu.$el().addClass(layout);
  if (compLayout) {
    vu.$el().addClass(compLayout);
  }
}); // end of Purely.Section.Basic

// Purely.Section.Collection
PurelySectionCollectionClass.dom(vu => [
  { 'div.view-purely-section-collection': [
    { 'div@collection': '' }] 
  }
]);

PurelySectionCollectionClass.render(vu => {
  let layout = vu.get('layout') || 'comp-bold-left',
      colType = vu.get('collectionType') || 'slide',
      data = vu.get('data'),
      itemViews = [];

  if (!Array.isArray(data)) { data = []; }
  itemViews = data.map((x, i) => {
    vu('@collection').append([[ 'div.col-item@item-' + i, '' ]]);
    
    let itemView = PurelySectionBasicClass.build({
      sel: vu.sel('@item-' + i),
      data: x
    });

    if (i > 0) { itemView.$el().hide(); }
    return itemView;
  });

  vu.set('itemViews', itemViews);

  // Slide, Grid and Waterfall animation based on layout
  if (colType == 'slide' && itemViews.length > 1) {
    vu.set('turn', 0);
    setInterval(function() {
      let turn = vu.map('turn', turn => (turn + 1) % itemViews.length);
      itemViews.map(x => {
        x.$el().fadeOut(900);
      });
      itemViews[turn].$el().fadeIn(900);
    }, 2600);
  } else if (layout.slice(-4) == 'grid') {
    // TBD
  } else if (layout.slice(-9) == 'waterfall') {
    // TBD  
  }
  
  // Add comp class
  vu.$el().addClass(layout);
});
// end of Purely.Section.Collection

// Purely.Section.Contacts
PurelySectionContactsClass.dom(vu => [
  { 'div.view-purely-section-contacts': [
    { 'div@contacts': '' }] 
  }
]);

PurelySectionContactsClass.render(vu => {
  let layout = vu.get('layout') || 'comp-simple-list',
      data = vu.get('data');

  if (!Array.isArray(data)) { data = []; }
  data.map((x, i) => {
    let value = x && x.value || '',
        label = x && x.label || '',
        type = x && x.type || '';

    if (value) {
      vu('@contacts').append([[ 'div.contacts-item@item-' + i, [
        { 'div.item-icon': '' }, // based on type
        { 'div.item-label': label },
        { 'div.item-value': value }]
      ]]);
    }
  });

  // Add comp class
  vu.$el().addClass(layout);
});
// end of Purely.Section.Contacts

//-------------------------------------
})(jQuery, Cope);
