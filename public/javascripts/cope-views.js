(function($, Cope) {

let debug = Cope.Util.setDebug('cope-views', false),
    PurelyViews = Cope.views('Purely'), // use Purely views
    
    Views = Cope.views('Cope'), // global views
    CopeAppClass = Views.class('Cope.App'),
    CopeAppOverviewClass = Views.class('Cope.App.Overview'),
    CopeAppEditorClass = Views.class('Cope.App.AppEditor'),
    // ------------------------------------------------------
    AppSettingsClass = Views.class('Cope.App.Settings'),
    AppDataClass = Views.class('Cope.App.Data'),
    AppDesignClass = Views.class('Cope.App.Design'),
    AppCommerceClass = Views.class('Cope.App.Commerce'),
    AppAnalyticsClass = Views.class('Cope.App.Analytics'),
    // ------------------------------------------------------
    ViewAppCard = Views.class('AppCard'),
    ListItemView = Views.class('ListItem'),

    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),
    ToggleView = Views.class('Toggle'),
    NavBoxView = Views.class('NavBox'),

    // Purely App
    SimSecClass = Views.class('SimSec'),

    PurelyAppView = Views.class('Purely.App'),
    PurelySecView = Views.class('Purely.Sec'),
    PurelySettingsView = Views.class('Purely.Settings'),  
    
    SectionSimulatorClass = Views.class('SectionSimulator'),
    SectionEditorClass = Views.class('SectionEditor'),
    SectionStylerClass = Views.class('SectionStyler'),

    PurelyEditNavView = Views.class('Purely.Edit.Nav.Settiings'),// to be depreacted
    PurelyEditSingleView = Views.class('Purely.Edit.Single'), // to be deprecated
    SectionEditView = Views.class('Purely.Edit.Section.Settings'), // to be deprecated
    PageEditView = Views.class('Purely.Edit.Page'), // to be deprecated
    LayoutChooserView = Views.class('Purely.LayoutChooser'), // to be deprecated
    
    priViews = Cope.useViews(), // private views
    ViewAddInput = priViews.class('AddInput');

let phr = function(str, lang) {

  lang = 'tw';

  let phrases = {};
  phrases.tw = {};
  phrases.en = {};

  // zh-TW
  phrases.tw['Done'] = '確定';
  phrases.tw['Basic'] = '基本';
  phrases.tw['Collection Type'] = '資料類別';
  phrases.tw['Contacts'] = '聯絡';
  phrases.tw['Section Type'] = '區塊類型';
  phrases.tw['Title'] = '標題';

  // EN
  phrases.en['Collection Type'] = 'Collection';

  if (!lang || lang == 'en') {
    return str;
  }
  return phrases[lang][str] || str;
};

// "AppCard"  
ViewAppCard.dom(function() {
  return '<div' + this.ID + ' class="cope-card wider touchable bg-w" style="margin-bottom:16px">'
    + '<h3 data-component="appName"></h3>'
    + '<p data-component="appId" style="color:#aaa"></p>'
    + '<p data-component="stat"></p>'
    + '</div>';
});

ViewAppCard.render(function() {
  var that = this,
      name = this.val('appName'),
      id = this.val('appId'),
      stat = this.val('stat');
  if (name) this.$el('@appName').html(name);
  if (id) this.$el('@appId').html(id);
  if (stat) this.$el('@stat').html(stat);

  that.$el().off('click').on('click', function() {
    that.res('touched', that.val());
  });
});  
// end of "AppCard"

// "AccountCard"
ViewAccountCard.dom(vu => [
  { 'div': [
    { 'h3@name': '' },
    { 'p@email': '' },
    { 'button@signOut.cope-card.as-btn.bg-blue.color-w': 'Sign out' }]
  }
]);

ViewAccountCard.render(vu => {
  var $signOut = vu.$el('@signOut'),
      email = vu.val('email'),
      name = vu.val('name');

  vu.$el('@name').text(name || 'Hello');
  if (email) vu.$el('@email').html(email);

  $signOut.off('click').on('click', function() {
    vu.res('sign out');
  });

  vu.$el('@name').off('dblclick').on('dblclick', function() {
    vu.res('change name', name || 'Cope User');
  });
});
// end of "AccountCard"

// NavBox
NavBoxView.dom(vu => [{ 'div(draggable = true)': '' }]);
NavBoxView.render(vu => {


  let height = vu.get('height') + 'px' || '50px';
      
  vu.$el().css({
    position: 'absolute',
    width: '100%',
    height: height,
    border: '1px solid #333',
    background: '#fff'
  });
  vu.use('idx, height').then(v => {
    let top = v.height * v.idx;
    //let dy = v.dy || 0;
    if (!v.isDragging) {
      vu.$el().css({
        'top': top + 'px'
        //'left': '0'
      });
    } else {
      vu.$el().css({
        'background': '#aca'
      });
    }
  });
});// end of NavBox

//PurelyEditNavView
PurelyEditNavView.dom( vu => [
  { 'div.view-purely-edit-nav': [
    { 'div@form.col-xs-12': [
      { 'h5': 'Site Title'},
      { 'input(type="text")@site-title': ''},
      { 'h5': 'Hosted By'},
      { 'input(type="text")@hosted-by': ''},
      { 'h5': 'Logo'},
      { 'div@image-uploader': ''},
      { 'div@save-btn(style="float: right; margin: 10px 0px; cursor: pointer;")': 'Save'}
    ]},
    { 'div@viewport.col-xs-12': ''}
  ]}
]);

PurelyEditNavView.render(vu => {
  
  // Image Uploader
  let imageuploaderview = PurelyViews.class('ImageUploader').build({
    sel: vu.sel('@image-uploader')
  });
  
  // @save-btn Click Event
  vu.$el('@save-btn').off('click').on('click',() => {
    let obj = {}
    obj.appName = vu.$el('@site-title').val().trim();
    obj.hostedBy = vu.$el('@hosted-by').val().trim();
    obj.images = imageuploaderview.val('files');
    console.log(obj);
    vu.res('save', obj);
  });
});

//PurelyEditSingle
PurelyEditSingleView.dom( vu => [
  { 'div.view-purely-edit-single': [
    { 'div@textarea.col-xs-12': [
      { 'h5': 'Title'},
      { 'div@title.title': ''},
      { 'h5': 'Content'},
      { 'div@content.content': ''},
      { 'div@image-uploader': ''},
      { 'div@save-btn(style="float: right; margin: 10px 0; cursor: pointer;")': 'Save'}
    ]}
  ]}
]);

PurelyEditSingleView.render( vu => {

  // Title textarea
  let title = PurelyViews.class('Textarea').build({
    sel: vu.sel('@title'),
    data: {
      value: 'Title'
    }
  });

  title.$el().css({
    'width': '100%',
    'border': '1px solid #aaa',
    'font-size': '14px'
  });

  // Content textarea
  let content = PurelyViews.class('Textarea').build({
    sel: vu.sel('@content'),
    data: {
      value: 'Content'
    }
  });
  content.$el().css({
    'margin-bottom': '16px',
    'border': '1px solid #aaa',
    'font-size': '14px'
  });

  // Image UpLoader
  let imageuploaderview = PurelyViews.class('ImageUploader').build({
    sel: vu.sel('@image-uploader')
  });

  //@save-btn Click Event
  vu.$el('@save-btn').off('click').on('click',() => {
    let obj = {}
    obj.title = title.val('value');
    obj.content = content.val('value');
    obj.images = imageuploaderview.val('files');
    console.log(obj);
    vu.res('save', obj);
  });
});

// SectionSimulator
SectionSimulatorClass.dom(vu => [{ '@viewport.view-sec-sim': '' }]);

SectionSimulatorClass.render(vu => {
  let view, onresize, sr = 1,
      vw, vh, sw = 1200, sh,
      minH = 1, cssObj;

  onresize = function() {

    vu().html([{ '@sec.sim-realsized': '' }]);

    view = PurelyViews.class('Purely.Section').build({
      sel: vu.sel('@sec'),
      data: vu.get()
    }); 

    let minSH = 1;
    vw = vu.$el().parent().width();
    sr = vw / sw;
    sh = view.$el().height(); 
    vh = sh * sr; 

    if (vu.get('vh') && vu.get('style')) {
      if (vu.get('style').indexOf('sec-full') > -1) {
        minH = vu.get('vh');
        minSH = minH / sr;
      } else if (vu.get('style').indexOf('sec-wrap') > -1) {
        //cssObj['min-height'] = 1 + 'px';
        minH = 1;
        minSH = 1;
      }
    } 
    
    // Set style of @sec
    vu.$el('@sec').css({
      'height': sh + 'px',
      'min-height': minSH + 'px',
      'transform': `scale(${sr})`
    });

    // Set style of @viewport
    vu.$el().css({
      height: vh + 'px',
      'min-height': minH + 'px'
    });
  } // end of onresize

  setTimeout(onresize);

  // Render again and scale the section on resize event
  $(window).off('resize.simsec-' + vu.id)
    .on('resize.simsec-' + vu.id, onresize);
});
// End of SectionSimulator

// SectionEditor
SectionEditorClass.dom(vu => [
  { 'div': [
    { '@type-chooser.hidden': [
      { 'h3': phr('Section Type') },
      { 'ul': [
        { 'li@type-basic': phr('Basic') },
        { 'li@type-collection': phr('Collection') },
        { 'li@type-contacts': phr('Contacts') }] 
      },
      { 'div': [
        { '@done': phr('Done') }]
      }]
    }, // end of @type-chooser
    { '@settings': '' }]
  }
]);

SectionEditorClass.render(vu => {
  let settings = {}, 
      styles,
      type,
      media,
      upper,
      types = ['basic', 'collection', 'contacts'];
  
  upper = function(str) {
    if (!str || str.length < 1) return '';
    return str.slice(0, 1).toUpperCase().concat(str.slice(1));
  };

  // Set fallbacks
  style = vu.map('style', s => s 
    || 'text-pos-left/comp-pos-right/mask-bright/mask-7');

  // Tidy up data
  settings.basic = [
    { key: 'title', type: 'text', label: phr('Title'), value: vu.get('title') },
    { key: 'content', type: 'textarea', label: phr('Content'), value: vu.get('content') },
    { key: 'media', type: 'media', label: 'Media', value: vu.get('media') }
  ];
  settings.collection = [
    { key: 'title', type: 'text', label: phr('Title'), value: vu.get('title') },
    { key: 'content', type: 'textarea', label: phr('Content'), value: vu.get('content') },
    { key: 'colName', type: 'text-select', label: phr('Collection Type'), value: vu.get('colName'), options: [] },
    { key: 'sort', type: 'text-select', label: phr('Sorted By'), value: vu.get('sort'), options: [] },
    { key: 'limit', type: 'text', label: phr('Max Number'), value: vu.get('limit') }
  ];
  settings.contacts = [
    { key: 'title', type: 'text', label: phr('Title'), value: vu.get('title') },
    { key: 'content', type: 'textarea', label: phr('Content'), value: vu.get('content') },
    { key: 'media', type: 'media', label: 'Media', value: vu.get('media') }
  ];
  
  // Render based on data
  vu('@settings').html('');
  switch (vu.get('type')) {
    case 'basic':
    case 'collection':
    case 'contacts':
      settings[vu.get('type')].map((x, i) => {
        vu('@settings').append([
          { 'h5[c:#bbb; mb:0; fz:14px;]': x.label },
          [ '@s-' + i + '[fz:20px;]', '' ]
        ]);
        PurelyViews.class('Input').build({
          sel: vu.sel('@s-' + i), 
          data: {
            type: x.type,
            value: x.value,
            editable: true
          }
        }).res('value', value => {

          let appId = vu.get('appId');
          console.log(appId, x.key, value);
          if (appId && x.key == 'media' && value.file) {
            let media = {},
                file = value.file && value.file.file;
            Cope.graph(appId).upload(file).then(obj => {
              media.url = obj.url;
              switch (obj.node.snap().type) {
                case 'image': media.imgsrc = obj.url; break;
                case 'video': media.vidsrc = obj.url; break;
                case 'audio': media.audsrc = obj.url; break;
                default:
              }
              console.log(media);
              vu.set(x.key, media);
              vu.res('data', vu.get());
            });
          } else if (x.key) {
            vu.set(x.key, value);
            vu.res('data', vu.get());
          }
        });
      });
      vu.$el('@type-chooser').addClass('hidden');
      vu.$el('@settings').removeClass('hidden');
      break;
    default:
      types.map(x => {
        vu.$el('@type-' + x).off('click').on('click', e => {
          type = x;
        });
      });
      vu.$el('@type-chooser').removeClass('hidden');
      vu.$el('@settings').addClass('hidden');
  }

  if (vu.get('type') === 'collection') {
    vu('@settings').append([{ '@add-data.cope-card.as-btn.bg-blue.color-w': phr('New Data') }]);

    // "New Data"
    vu.$el('@add-data').off('click').on('click', e => {
      Cope.modal(PurelyViews.class('DataUploader'))
        .res('data', data => {
          console.log(data);
        });
    });
  }
  vu.$el('@done').off('click').on('click', e => {
    vu.val('type', type);
    vu.res('data', vu.get());
  });
});
// End fo SectionEditor

// SectionStyler
// "style" <- string, current choice
SectionStylerClass.dom(vu => [
  { 'div[fz:20px]': [
    { 'div': [
      { 'h5[c:#bbb; mb:0; fz:14px]': phr('Theme') },
      { '@theme': '' }, // dark || bright
      { '@theme-strength': '0 - 10' }, // 0 ~ 10
      { '@theme-size': 'full || wrap'  }] // full || wrap
    },
    { 'div': [
      { 'h5[c:#bbb; mb:0; fz:14px]': phr('Text Style') },
      { '@text-style': '' }] 
    },
    { 'div': [
      { 'h5[c:#bbb; mb:0; fz:14px]': phr('Component Type') },
      { '@comp-type': '' }] 
    },
    { 'div': [
      { 'h5[c:#bbb; mb:0; fz:14px]': phr('Layout') },
      { '@text-position': '' },
      { '@comp-position': '' }] 
    }]
  }
]);

SectionStylerClass.render(vu => {
  
  let style = vu.get('style'),
      groupNames = {},
      group = {};

  group['sec-dark'] = 'theme';
  group['sec-bright'] = 'theme';
  group['sec-op-0'] = 'theme-strength';
  group['sec-op-2'] = 'theme-strength';
  group['sec-op-4'] = 'theme-strength';
  group['sec-op-6'] = 'theme-strength';
  group['sec-op-8'] = 'theme-strength';
  group['sec-op-10'] = 'theme-strength';
  group['text-normal'] = 'text-style';
  group['text-bold-title'] = 'text-style';
  group['sec-wrap'] = 'theme-size';
  group['sec-full'] = 'theme-size';
  group['text-left'] = 'text-position';
  group['text-right'] = 'text-position';
  group['text-center'] = 'text-position';
  group['comp-slide'] = 'comp-type';
  group['text-only'] = 'comp-position';
  group['comp-wrapped'] = 'comp-position';
  group['comp-full'] = 'comp-position';

  Object.keys(group).map(styleName => {
    groupNames[group[styleName]] = true;
    vu('@' + group[styleName]).html('');
  });

  // Read vu.get('style')
  if (style) {
    (style + '/').split('/').filter(styleName => !!styleName)
      .map(styleName => {
      vu.set(group[styleName], styleName);
    });
  }

  Object.keys(group).map(styleName => {
    let isSelected = (vu.get(group[styleName]) == styleName)
      ? '.color-orange' : '';

    vu('@' + group[styleName]).append([
      ['@' + styleName + isSelected, styleName]
    ]);
      
    vu.$el('@' + styleName).off('click').on('click', e => {
      vu.$el('@' + group[styleName]).children().removeClass('color-orange');
      vu.$el('@' + styleName).addClass('color-orange');

      vu.set(group[styleName], styleName);
      vu.map('style', x => {
        return Object.keys(groupNames)
          .map(x => vu.get(x) || '').join('/');
      });
      vu.res('style', vu.get('style'));
    });
  });

  // Theme
  // sec-dark / sec-bright

  // sec-op-0 ~ sec-op-10
  
  // Text Style
  // text-bold-title
  
  // Layout
  // text-left text-right text-center text-none text-only
  // comp-full comp-only
});
// End of SectionStyler


// Purely.Edit.Section.Settings
// @section-edit
// - vals: object
// - items: object, all items with names
// "box clicked" <- view object
SectionEditView.dom( vu => [
  { 'div@section-edit': ''}
]);

SectionEditView.render( vu => {
  let typeChooser,
      layoutChooser;

  // Init basic data
  vu.map('basic', basic => {
    if (!basic) { return {}; }
    return basic;
  });

  // Convert first character to uppercase
  let upper = function(str) {
    return str.slice(0, 1).toUpperCase().concat(str.slice(1));
  };
      
  vu.$el('@section-edit').html('');

  let items = {};
  let keys = [ 
    'title', 
    'content', 
    'textColor',
    'bgColor',
    'background',
    'layout'
  ]; 

  switch (vu.get('type')) {
    case 'collection':
    case 'contacts':
      keys = keys.concat([vu.get('type')]);
      break;
    default:
  }

  keys.map(key => { // keys become items with labels 

    let data = {};
    data.label = upper(key);

    if (key === 'title') { 
      data.editable = true;
      data.value = vu.get('basic').title || '';
      data.placeholder = 'Title the section';
    }
    
    if (key === 'content') {
      data.editable = true;
      data.value = vu.get('basic').content || '';
      data.textarea = true;
      data.placeholder = 'Compose more about this section';
    }

    if (key === 'textColor') {
      data.label = 'Text Color';
      data.editable = true;
      data.value = vu.get('basic').textColor || '';
      data.placeholder = '#333 or rgb(20, 20, 20)';
    }

    if (key === 'bgColor') {
      data.label = 'Background Color Mask';
      data.editable = true;
      data.value = vu.get('basic').bgColor || '';
      data.placeholder = '#333 or rgb(20, 20, 20)';
    }
    
    items[key] = PurelyViews.class('ListItem').build({
      sel: vu.sel('@section-edit'),
      method: 'append',
      data : data
    }).res('value', val => {
      //vals.basic[key] = val;
      //vu.set(vals);
      //vu.res('vals', vu.val());
      vu.map('basic', basic => {
        basic[key] = val;
        return basic;
      });

      vu.res('data', vu.get());
    });
  }); // end of the construction of items

  // Build layout chooser
  layoutChooser = LayoutChooserView.build({
    sel: items.layout.sel('@display'),
    data: {
      type: vu.get('type')
    }
  });
  layoutChooser.res('clicked', choice => {
    console.log(choice);
    vu.set('type', choice.type);
    vu.set('layout', choice.layout);
    vu.set('compLayout', choice.compLayout);
    vu.map(choice.type, typeData => {
      if (!typeData) { typeData = {}; }
      typeData.layout = choice.compLayout; // TBD: compLayout
      return typeData;
    });
    vu.map('basic', basic => {
      if (!basic) { basic = {}; }
      basic.layout = choice.layout;
      return basic;
    });
    vu.res('data', vu.get());
  });

  // Build the preview box of background
  let bgBox = PurelyViews.class('Box').build({
    sel: items.background.sel('@display')
  });
  
  bgBox.$el().off('click').on('click', e => {
    Cope.modal('file', {
      maxWidth: 500
    }).res('upload', arr => {
      vu.map('basic', basic => {
        if (arr && arr[0] && arr[0].image) {
          basic.imgsrc = arr[0].image;
        }
        return basic;
      }); 
      vu.res('data', vu.get());
    });
  });

  let bgBoxCSS = {
    'width': '100%',
    'height': '300px',
    'background-color': '#eee',
    'margin-top': '8px'
  };

  if (vu.get('basic').imgsrc) {
    bgBoxCSS['background-image'] = `url(${ vu.get('basic').imgsrc })`;
  }
  bgBox.$el().css(bgBoxCSS).addClass('bg-img');

  vu.set('items', items);
});

// PurelyEditNavView
// @nav-edit
PageEditView.dom( vu => [
  { 'div@nav-edit': 'page'}
]);

PageEditView.render( vu => {
  vu.$el().off('click').on('click', () => {
    console.log('ok');
  });
});

// Layout Chooser
// @layout-chooser
LayoutChooserView.dom( vu => [
  { 'div.view-layout-chooser': [
    { 'div.layout-chooser-sec': [
      { 'h4': 'Section Layout' },
      { 'div.subtitles': [
        { 'div@type-basic': 'Basic' },
        { 'div@type-collection': 'Collection' },
        { 'div@type-contacts': 'Contacts' }]
      },
      { 'div@type-layouts': '' }]
    },
    { 'div.layout-chooser-sec': [
      { 'h4@comp-custom-title': '' },
      { 'div@comp-custom-list': '' }]
    }] 
  }
]);

LayoutChooserView.render( vu => {
  let layouts = {},
      types = ['basic', 'collection', 'contacts'],
      textPos = ['left', 'right', 'center', 'none'],
      collectionTypes = ['slide', 'grid', 'waterfull'],
      contactsTypes = ['contacts'];

  // Init
  vu.set('type', vu.get('type') || 'basic');
  layouts.basic = textPos
    .filter(pos => pos != 'none')
    .map(pos => 'layout-' + pos);
  layouts.collection = [];
  layouts.contacts = [];

  // Build collection types
  collectionTypes.map(ct => {
    textPos.map(pos => {
      layouts.collection = layouts.collection.concat('layout-' + pos + '-' + ct);
    });
  });

  // Build contacts types
  contactsTypes.map(ct => {
    textPos.map(pos => {
      layouts.contacts = layouts.contacts.concat('layout-' + pos + '-' + ct);
    });
  });

  types.map(type => {
    vu.$el('@type-' + type).off('click').on('click', e => {
      vu('@type-layouts').html('');
      // Display type layouts
      layouts[type].map((layout, i) => {
        vu('@type-layouts').append([{ 'div.col-xs-6.col-xs-4': [
          [ 'div@block-' + i + '.bg-img.block', layout ]]
        }]);
        vu.$el(`@block-${i}`).off('click').on('click', e => {
          vu.set('preferences', {
            type: type,
            layout: layout
          })
          vu.res('clicked', vu.get('preferences'));
        });
      }); // end of layouts[type].map
    });
  }); // types.map

  // Build custom part for collection or contacts 
  customTitle = 'TBD'; // TBD !!!!!!!
  switch (vu.get('type')) {
    case 'collection': 
    vu.$el('@comp-custom-title').html();
    vu.$el('@comp-custom-list')
  }
}); // end of LayoutChooser

// Purely- Purely.SimSec
// "clicked" <- view
SimSecClass.dom(vu => [
  { 'div.sim-sec': [
    { 'div.inner-wrap': [
      { 'div@sec.inner-sec': '' }] 
    }] 
  }
]);

SimSecClass.render(vu => {
  let view, 
      vw, //vu.get('width'), // viewport width
      vh,
      sw = 2000,
      sh,
      sr = 1, // scale rate
      randomIdx, 
      cssObj, // for @sec
      onresize;

  // randomIdx for assigning onresize to window
  randomIdx = vu.map('randomIdx', r => {
    if (!r) { 
      return new Date().getTime() + '_' + Math.floor(Math.random()*1000); 
    }
    return r;
  });

  view = PurelyViews.class('Purely.Section').build({
    sel: vu.sel('@sec'),
    data: vu.get()
  });

  onresize = function() {
    let minH = 1;
    vw = vu.$el().parent().width();
    sr = vw / sw;
    sh = vu.$el('@sec').height();
    vh = sh * sr; 
    cssObj = {
      width: sw + 'px',
      height: 'auto', 
      'transform': `scale(${sr})`
    };

    if (vu.get('vh') && vu.get('style')) {
      if (vu.get('style').indexOf('sec-full') > -1) {
        minH = vu.get('vh');
        cssObj.height = sh + 'px';
        cssObj['min-height'] = minH / sr + 'px';
          
        
        console.log(minH/sr, sh, sr);



      } else if (vu.get('style').indexOf('sec-wrap') > -1) {
        cssObj.height = sh + 'px';
        cssObj['min-height'] = 1 + 'px';
      }
    } 

    vu.$el('@sec').css(cssObj);
    vu.$el().css({
      height: vu.$el('@sec').height() + 'px',
      'min-height': minH + 'px'
    });
  }; // end of onresize
  setTimeout(onresize, 1);
  // Scale the section on resize event
  $(window).off('resize.simsec-' + randomIdx).on('resize.simsec-' + randomIdx, onresize);
  //onresize();
  vu.$el().off('click').on('click', function() {
    vu.res('clicked', { view: view });
  })
});
// End of Purely.SimSec

// Purely - Purely.Sec
PurelySecView.dom(vu => [
  { 'section.purely-sec': [
    { 'div.plus.top.hidden': [
      { 'div@before-plus': '+'},
      { 'div@delete.delete': 'x'}]
    },
    { 'div@wrap.wrap':[
      //{ 'div@sec.cope-card.full.bg-w.touchable(style="padding:0")': '' },
      { 'div@sec(style="padding:0")': '' },
      { 'div@mask.mask': ''}]
    },
    { 'div.plus.bottom.hidden': [
      { 'div@after-plus': '+'}]
    }]
  }
]);

PurelySecView.render(vu => {

  let showPlus = vu.val('showPlus') || true,
      fadeIn = vu.val('fadeIn'),
      fadeOut = vu.val('fadeOut'),
      hasFadedIn = vu.val('hasFadedIn');

  vu.$el().css({
    top: '-1000px'
  });

  if (fadeIn && !hasFadedIn) {
    vu.set('hasFadedIn', true);
    vu.$el('.plus').fadeIn(300);
    vu.set('fadeIn', false);
    vu.set('fadeOut', false);
  }
  if (fadeOut && hasFadedIn) {
    vu.set('hasFadedIn', false);
    vu.$el('.plus').hide(); //fadeOut(300);
    vu.set('fadeIn', false);
    vu.set('fadeOut', false);
  }

  vu.use('height').then(v => {
    vu.$el('@wrap').css('height', v.height);
    vu.$el('@sec').css('height', v.height);
  });

  //@mask click showPlus
  vu.$el('@mask').off('click').on('click', () => {
    if(showPlus){
      //vu.val('fadeIn', true);
      vu.res('mask clicked');
    }
  });

  vu.$el()
    .off('mouseenter mouseleave')
    .on('mouseenter mouseleave', () => {
    if(showPlus){
      //vu.val('fadeIn', true);
      vu.$el('.plus').toggleClass('hidden')
    }
  }); 

  // Click events
  // before -> myIdx - 1
  // after -> myIdx
  // res('after', ... )
  vu.$el('@before-plus').off('click').on('click', () => {
    vu.res('after', vu.get('idx'));
  });

  vu.$el('@after-plus').off('click').on('click', () => {
    vu.res('after', vu.get('idx') + 1);
  });

  vu.$el('@delete').off('click').on('click', () => {
    vu.res('del clicked', vu.get('idx'));
  });

  vu.use('idx, height').then(v => {
    // TBD: animate css top
    let top = v.height * v.idx;
    vu.$el().css({
      top: top + 'px'
    });
  });
});

// Purely - Purely.App
// - sim-page-thumbs
// - sim-page-secs
PurelyAppView.dom(vu => [
  { 'div.purely-app': [
    { 'div.sim-wrap': [
      { 'div.cope-card.bg-w.full(style="display:flex; padding:0; margin-bottom:16px;")': [
        { 'div@nav.col-xs-12(style="padding:0")': 'Nav' }] 
      },
      { 'div@sim-wrap-card.cope-card.full(style="padding:0")': [
        { 'div.sim-sections': [
          { 'div@page': '' }]
        }]
      }, 
      { 'div.edit-bar': [
        { 'div.cope-card.as-btn.bg-w[m20px 8px 20px 0]': phr('<-') }, 
        { 'div.cope-card.as-btn.bg-blue.color-w': phr('New Data') }, 
        { 'div.cope-card.as-btn.bg-orange.color-w.right': phr('Remove Section') }]
      }]
    },
    { 'div@sim-panel.sim-panel.cope-card.wider.bg-w': [
      { 'div@back.hidden(style="cursor: pointer;")': '<-' }, // Go Back button
      { 'div@toggle.toggle.hidden(style="display: flex; justify-content: space-around; height: 30px;")': [  //
        { 'div@data-button.data-button(style="width: 100%; height: 100%; text-align: center; padding: 10px; cursor: pointer;")': [ 
          { 'p': 'Data'}]
        },
        { 'div@style-button.style-button(style="width: 100%; height: 100%; text-align: center; padding: 10px; cursor: pointer;")': [
          { 'p': 'Style'}]
        }]
      },
      { 'div@app-settings': 'app-settings' }, // app-settings
      { 'div@style-settings.hidden': 'layoutChooser' }, //style-settings
      { 'div@sec-settings.hidden': 'sec-settings' }, // sec-settings
      { 'div@page-settings.hidden': 'page-settings' }] // page-settings
    }, 
    { 'div@sim-page-card.sim-page.cope-card.bg-w': [
      { 'div@sim-page.inner': '' },
      { 'div@add-section.cope-card.as-btn.color-w.bg-blue.add-section': 'Add Section'}] 
    }]
  }
]);

PurelyAppView.render(vu => {

  // Reset
  vu.$el('@page').html('');

  let pages = vu.get('pages'),
      sections = vu.map('sections', x => (x && x.length) ? x : []);

  // Set the whole page css
  //vu.$el('.sim-sections').css({
  //  'background-color': '#000',
  //  'background-image': 'url("/images/sample4.jpg")'
  //});

  // Data preprocessor
  let preData = function(data, type) {
    let _data = Object.assign({}, data);
    switch (type) {
      case 'PS': 
        _data.vh = 100;
        _data.width = vu.$el('@sim-page').width();
        break; 
      case 'SS': 
        _data.vh = 400;
        _data.width = vu.$el('@page').width();
        break;
      case 'SE': 
        break;
      default:
    }
    return _data;
  };

  // pages data
  pages = [{
    title: 'Home'
  }, {
    title: 'Products'
  }, {
    title: 'Services'
  }, {
    title: 'Contacts'
  }];

  // PS: Page Selector
  let PS = PurelyViews.class('SortableList').build({
    sel: vu.sel('@sim-page'),//vu.sel('@sim-page'),
  });

  // SS: Section Simulator
  let SS = PurelyViews.class('SortableList').build({
    sel: vu.sel('@page'),
  });

  let sectionEditor = SectionEditorClass.build({
    sel: vu.sel('@sec-settings')
  });

  let sectionStyler = SectionStylerClass.build({
    sel: vu.sel('@style-settings')
  });

  let pagePS = vu.map('sim-page-thumbs', s => vu.$el('@sim-page-card')),
      pageSS = vu.map('sim-page-secs', s => vu.$el('@sim-wrap-card'));

  let itemOnclick = function(item) {
    sectionEditor.set(null);
    sectionEditor.val(item.view.val());
    sectionEditor.res('data', data => {
      PS.get('List').getByIdx(item.idx).view.val(preData(data, 'PS'));
      SS.get('List').getByIdx(item.idx).view.val(preData(data, 'SS'));
    });
    
    sectionStyler.set(null);
    sectionStyler.val('style', item.view.get('style'));
    sectionStyler.res('style', style => {
      sectionEditor.set('style', style);
      PS.get('List').getByIdx(item.idx).view.val('style', style);
      SS.get('List').getByIdx(item.idx).view.val('style', style);
    });

    // SectionEditor's toggle
    vu.$el('@back').removeClass('hidden');
    vu.$el('@toggle').removeClass('hidden');
    vu.$el('@app-settings').addClass('hidden');
    vu.$el('@sec-settings').removeClass('hidden');
    vu.$el('@style-settings').addClass('hidden');
    vu.$el('@page-settings').addClass('hidden');

  }; // end of itemOnclick

  PS.res('order', newOrder => { // <- eg. [1, 2, 0, 3]
    SS.val('order', newOrder); 
  });

  PS.res('item clicked', itemOnclick);
  SS.res('item clicked', itemOnclick);

  // Build the initial sections
  sections.map(params => {
    // TBD: 
    // preData(params, 'PS')
    // preData(params, 'SS')
    let ssData = {},
        psData = {};
    for (let k in params) {
      psData[k] = params[k];
      ssData[k] = params[k];
    }
    PS.val('new', {
      viewClass: SimSecClass,
      data: psData
    });
    SS.val('new', {
      viewClass: SimSecClass,
      data: ssData
    })
  }); // end of sections.map

  // Panel routing
  vu.$el('@back').off('click').on('click', e => {
    
    // Show settings of the app
    vu.$el('@app-settings').removeClass('hidden');

    // Hide others 
    vu.$el('@toggle').addClass('hidden');
    vu.$el('@back').addClass('hidden');
    vu.$el('@sec-settings').addClass('hidden');
    vu.$el('@style-settings').addClass('hidden');
  });

  // Toggle click
  vu.$el('@data-button').off('click').on('click',() => {  // data-button
    vu.$el('@sec-settings').removeClass('hidden');
    vu.$el('@style-settings').addClass('hidden');
  });
  vu.$el('@style-button').off('click').on('click',() => { // style-button
    vu.$el('@style-settings').removeClass('hidden');
    vu.$el('@sec-settings').addClass('hidden');
  });

  // App Settings
  let vals = vu.val();
  let settingItems = [];
  vu.$el('@app-settings').html('');

  if (vals) {
    settingItems = [{
      'label': 'App Name',
      'value': vals.appName || 'Untitled',
      'placeholder': 'Enter the app name or site title',
      'editable': true
    }, {
      'label': 'App ID',
      'value': vals.appId
    }, {
      'label': 'URL',
      'value': vals.url || (vals.appId + '.cope.tech')
    }, {
      'label': 'Status',
      'value': vals.stat || ''
    }, {
      'label': 'Background Color Mask',
      'value': 'TBD'
    }, {
      'label': 'Background',
      'value': 'TBD'
    }].map(x => {
      return PurelyViews.class('ListItem').build({
        sel: vu.sel('@app-settings'),
        method: 'append',
        data: x
      });
    });
  } // end of if
 
  // To edit app name!!!
  settingItems[0].res('done', val => {
    vu.res('rename app', val);
  });
  
  // Navigation
  PurelyViews.class('Nav').build({
    sel: vu.sel('@nav'),
    data: {
      logo: {
        text: 'Logo'
      }
    }
  })
  
  // Nav click event
  vu.$el('@nav').off('click').on('click', () => {
    let SL = PurelyViews.class('SortableList').build({
      sel: vu.sel('@page-settings'),
      data: { height: 30 }
    });

    pages.map(x => {
      SL.val('new', {
        viewClass: PurelyViews.class('ListItem'),
        data: { label: x.title }
      });
    });

    vu.$el('@back').removeClass('hidden');
    vu.$el('@toggle').addClass('hidden');
    vu.$el('@page-settings').removeClass('hidden');
    vu.$el('@app-settings').addClass('hidden');
    vu.$el('@sec-settings').addClass('hidden');
    vu.$el('@style-settings').addClass('hidden');
  }); // Nav click event

  // add section event
  vu.$el('@add-section').off('click').on('click', () => {
    let data = {
      title: 'Title',
      content: 'Content'
    };
    PS.val('new', {
      viewClass: SimSecClass,
      data: preData(data, 'PS')
    });
    SS.val('new', {
      viewClass: SimSecClass,
      data: preData(data, 'SS')
    })
  });// end of add section event
}); //end of PureAppView.render

// Cope.App.Settings
// - appId: str
// - collaborators: array, an array of object { name, email }
// "data" <- object, data sent to outside
// "invite" <- string, an email string
AppSettingsClass.dom(vu => [
  { 'div.view-app-settings': [
    { 'div': [
      { 'h2': 'Settings' },
      { '@subtitle.subtitle': '' }]
    },
    { 'div': [
      { 'h5': 'App Name' },
      { '@settings-appname.settings-appname': '' }]
    },
    { 'div': [
      { 'h5': 'Collaborators' },
      { '@list-co.list-co': '' },
      { 'div[flex; w:100%;]': [
        { 'input(type = "text" placeholder="Email")': '' },
        { 'button@btn-add-co.btn-add-co.cope-card.as-btn.bg-blue.color-w(disabled)[width:86px; fz:14px; ml:8px; p:6px]': 'Invite' }]
      }]
    },
    // { 'div': [
    //   { 'h5': 'Contacts' },
    //   { '@all-contacts.all-contacts': '' }]
    // },
    { '@btn-remove-app.cope-card.as-btn.bg-orange.color-w:': 'Remove App' }]
  }
]);

AppSettingsClass.render(vu => {
  let appId = vu.get('appId'),
      name = vu.get('username') || 'Me',
      collaborators = vu.get('collaborators') || [],
      appNameInput,
      collaboratorsInput,
      getData;

  sendData = function() {
    let data = {};
    data.appName = vu.get('appName');
    data.collaborators = vu.get('collaborators');
    data.contacts = vu.get('contacts');
    vu.res('data', data);
    console.log(data);
  };

  // @subtitle    
  vu.$el('@subtitle').html(appId + ' hosted by ' + name);

  // @settings-appname
  appNameInput = PurelyViews.class('Input').build({
    sel: vu.sel('@settings-appname'),
    data: {
      type: 'text',
      value: vu.get('appName'),
      editable: true
    }
  }).res('done', value => {
    vu.set('appName', value);
    sendData();
  });

  // @collaborators
  vu.$el('@collaborators').html('');
  collaborators.map(obj => {
    vu.$el('@list-co').append('<li>' + obj.name + '</li>');
  });
});












// Deprecated

// "AppPage"
// "rename app" <= string, the new name
ViewAppPage.dom(vu => [
  { 'div.row': [
    { 'div.col-xs-12(style="height:700px; overflow:hidden")': [
      { 'div.cope-card.bg-w.node-data.hidden': '' },
      { 'div@svg.svg-wrap(style="width:100%")': '' },
      { 'div@card.cope-card.touchable.wrap.bg-w(style="text-align:left")': [
        { 'ul': [
          { 'li@display-li(style="display:table;")': [
            { 'div.title': 'App Name' }, 
            { 'div@appName': '' },
            { 'div@appName-edit.hidden': [
              { 'input(type="text" placeholder="App Name" style="display:block; outline:none;")': '' },
              { 'div(style="display:block; float:right;")': [
                { 'span@renameCancel.cope-card.as-btn.bg-w.color-blue':'Cancel' },
                { 'span@renameDone.cope-card.as-btn.bg-blue.color-w':'Save' }] 
              }]
            }] 
          }, 
          { 'li': [
            { 'div.title': 'App ID' },
            { 'div@appId': '' }] 
          }, 
          { 'li': [
            { 'div.title': 'URL' },
            { 'div@url': '' }] 
          }, 
          { 'li': [
            { 'div.title': 'Owner' },
            { 'div@owner': '' }] 
          }, 
          { 'li': [ 
            { 'div.title': 'Partners' },
            { 'div@partners': '' },
            { 'a@add-partner.hidden': 'Add partner' }]
          },
          { 'li': [ 
            { 'div.title': 'Status' },
            { 'div@stat': '' }]
          }]
        }] 
      },
      { 'div.cope-card.touchable.wrap.bg-w(style="text-align:left")': [
        { 'ul': [
          { 'li': [
            { 'div': 'Purely' }] 
          }] 
        }] 
      }]
    }] 
  }
]);

ViewAppPage.render(vu => {
  let appName = vu.val('appName') || 'Untitled', // string
      appId = vu.val('appId'), // string
      url = vu.val('url'), // string
      isOwner = vu.val('isOwner'),
      owner = vu.val('owner'), // string
      partners = vu.val('partners'), // string array
      stat = vu.val('stat'); // status

  vu.$el('@appName').html(appName.trim() || 'Untitled');
  vu.$el('@appId').html(appId);

  if (isOwner || (owner == 'Me')) {
    vu.$el('@add-partner').removeClass('hidden');
  }

  if (owner) {
    vu.$el('@owner').html(owner);
  } 
  if (partners) {
    // TBD: partners
    vu.$el('@partners').html(partners);
  }

  if (url) {
    vu.$el('@url').html(url);
  } else {
    vu.$el('@url').html(appId + '.cope.tech');
  }

  if (stat) {
    vu.$el('@stat').html(stat);
  }

  // @appName click event
  vu.$el('@appName').off('dblclick').on('dblclick', () => {
    vu.$el('@appName-edit').find('input')
      .val(vu.val('appName') || 'Untitled');

    setTimeout(() => {
      vu.$el('@appName-edit').find('input').trigger('focus');
    }, 200);

    vu.$el('@appName').addClass('hidden');
    vu.$el('@appName-edit').removeClass('hidden');
  });

  // @appName-edit Rename button "Cancel" click event
  vu.$el('@renameCancel').off('click').on('click', function(e) {
    vu.$el('@appName-edit').addClass('hidden');
    vu.$el('@appName').removeClass('hidden');
  });

  // @appName-edit Rename button "Done" click event
  vu.$el('@renameDone')
    .off('click')
    .on('click', function(e) {

    vu.$el('@appName-edit').addClass('hidden');
    vu.$el('@appName').removeClass('hidden');

    let newName = vu.$el('@appName-edit').find('input').val().trim();
    if (newName != vu.get('appName')) {

      // Update app name
      vu.res('rename app', newName);
      vu.val('appName', newName);
    }
  });

  vu.$el('.as-btn').css({
    'display': 'inline-block',
    'padding': '6px',
    'font-size': '13px',
    'margin': '4px 0 4px 4px'
  });

  // val.owner
  // val.partners
  // val.expiredAt
}); // end of ViewAppPage.render

ViewAppPage.render(vu => { // draw the graph
  var graph = vu.val('graph'),
      $card = vu.$el('@card'),
      $li = vu.$el('@display-li'),
      $addPartner = vu.$el('@add-partner'),
      $svgWrap = vu.$el('@svg'),
      w = $svgWrap.width(),
      that = vu;

  if (!graph || !w || !$svgWrap) return;
  
  // Build the graph view  
  Views.class('DataGraph').build({
    sel: vu.sel('@svg'),
    data: {
      width: w,
      height: 600,
      graph: graph
    }
  }).res('node-data', function(_d) {
    debug(_d);  
    that.$el('.node-data').removeClass('hidden');
    that.$el('.node-data').html(`name:${_d.id}`);
  });

  $card.css('z-index', 1);
  $svgWrap.css('z-index', 0);

  // To switch between the graph view and app card
  $card.off('click').on('click', function() {
    $card.find('li').removeClass('hidden');
    $li.removeClass('hidden');
  });

  $svgWrap.off('click').on('click', function() {
    // Note: trigger click before the following
    vu.$el('@renameCancel').click();

    $card.find('li').addClass('hidden');
    $li.removeClass('hidden');
  });

  // Set "add partner" link
  $addPartner.off('click').on('click', function() {
    //Editor.openModal(function(_sel) { 
    //  ViewAddInput.build({
    //    sel: _sel,
    //    data: { placeholder: 'Email' }
    //  }).res('value', function(_val) {
        that.res('add-partner');  
    //  });
    //}); // end of Editor.openModal
  }); // end of $addPartner click
}); // end of ViewAppPage.render // draw the graph
// end of "AppPage"

// DataGraph
// properties:
// - width
// - height
// - appId
ViewDataGraph.dom(function() {
  var w = this.val('width'), 
      h = this.val('height');
  return '<svg' + this.ID + 'id="svg" width="'+ w +'" height="' + h + '"></svg>';
});

ViewDataGraph.render(function() {
  var graph = this.val('graph'),
      that = this;

  debug('ViewDataGraph - graph', graph);

  var svg = d3.select("svg#svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height");
  
  if (!graph || !width || !height) return;
  
  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function(d) { return d.id; }))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2));

  var link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(graph.links)
      .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("circle")
      .data(graph.nodes)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", function(d) { return color(d.group); })
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  node.append("title")
    .text(function(d) { return d.id; });

  simulation
    .nodes(graph.nodes)
    .on("tick", ticked);

  simulation.force("link")
    .links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    node
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  }

  function dragstarted(d) {
    that.res('node-data', d);

    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;

    console.log(d);
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}); // end of ViewDataGraph.render
// end of "DataGraph"

// "AddInput"
ViewAddInput.dom(function() {
  var ph = this.val('placeholder');
  return '<div' + this.ID + '>' 
    + '<input type = "text" placeholder="' + ph + '">'
    + '<button class="cope-card final">Add</button>'
    + '</div>';
}); 

ViewAddInput.render(function() {
  var that = this;
  this.$el('button').off('click').on('click', function() {
    that.res('value', that.$el('input').val().trim());
  });
});
// end of "AddInput"

// "Toggle"
// @sec-dashboard
// @account
// @my-apps
// @sec-app
// @app: show data graph
// @app-purely: Purely live editor
// -sec: string, 'home' || 'app'
ToggleView.dom(vu => `
  <div ${vu.ID} class="container view-toggle" style="margin-bottom:100px">
    <div data-component="sec-dashboard" class="row">
      <div class="col-xs-12 col-md-4 col-md-push-8">
        <h4>Account</h4>
        <div data-component="account" class="cope-card bg-w wider"></div>
      </div>
      <div class="col-xs-12 col-md-8 col-md-pull-4">
        <h4>Apps</h4>
          
        <div class="row">
          <div data-component="my-apps" class="col-xs-12"></div>
          <div class="col-xs-12">
            <button class="cope-card as-btn bg-blue color-w">Add new app</button>
          </div>
        </div>
        
      </div>
    </div>` // end of dashborad
    + `<div data-component="sec-app" class="hidden">
      <div data-component="app" class="col-xs-12 toggle-app"></div>
      <div data-component="app-purely" class="col-xs-12"></div>
    </div>
  </div> 
`);

ToggleView.render(vu => {
  switch (vu.get('sec')) {
    case 'app':
      vu.$el('@sec-dashboard').addClass('hidden');
      vu.$el('@sec-app').removeClass('hidden');
      vu.$el().removeClass('container');
      break;
    case 'home':
    default:
      vu.$el('@sec-app').addClass('hidden');
      vu.$el('@sec-dashboard').removeClass('hidden');
      vu.$el().addClass('container');
      break;
  } 
});

// Cope.App
// - overview: the Cope.App.Main view
// - toggle: string, 'overview' || 'app-editor'
// - currAppId: string, the selected appId
// "app selected" <- object, the selected appId and related data
CopeAppClass.dom(vu => [
  { 'div.view-cope-app': [
    { 'div@sec-overview': 'Cope app' }, 
    { 'div@sec-app-editor.hidden': '' }]
  }
]);

CopeAppClass.render(vu => {
  // Build Cope.App.Main only once
  vu.map('overview', x => {
    if (x) return x;
    let overview = Views.class('Cope.App.Overview').build({
      sel: vu.sel('@sec-overview')
    });

    // When an app is selected
    overview.res('app selected', appId => {
      vu.set('currAppId', appId);

      // Fetch data from outside
      vu.res('app selected', appId);
    }).res('save profile', profile => {
      vu.set(profile);

      vu.res('save profile', profile);
    });
    return overview;
  });

  // Toggle between 'main' and 'app-editor'
  vu.use('toggle').then(v => {
    vu.$el().children().addClass('hidden');
    vu.$el('@sec-' + v.toggle).removeClass('hidden');

    let currAppId = vu.get('currAppId');
    if (currAppId && v.toggle === 'app-editor') {

      // Build App Editor and updates data from this view
      let appEditor = Views.class('Cope.App.AppEditor').build({
        sel: vu.sel('@sec-app-editor'),
        data: vu.get().apps[currAppId]
      }).res('save page', () => {
        // Pass data to outside
        vu.res('save page', {
          currAppId: currAppId,
          currPage: appEditor.val('currPage'),
          appData: appEditor.val()
        }); 
      })
    }
  });

  // Update user's email
  vu.use('email, name').then(v => {
    vu.get('overview').val({
      email: v.email,
      name: v.name
    });
  });

  vu.use('apps, appIds').then(v => {
    vu.get('overview').val({
      appIds: v.appIds,
      apps: v.apps
    });
  });
});
// End of Cope.App

// Cope.App.Overview
// "sava profile" <- object, user's profile data  
CopeAppOverviewClass.dom(vu => [
  { 'div.view-cope-overview': [
    { '@btn-close.btn-close.hidden': 'X' },
    { 'div@profile.profile': [
      { 'div': [
        { 'div@avatar.avatar': '' }]
      },
      { 'div': [
        { 'div@display-name.account-item': '' }] 
      }]
    },
    { '@profile-editor.profile-editor.hidden': [
      { 'div': [
        { 'div@avatar-edit.avatar': 'Media input' }]
      },
      { 'div[text-align: center]': [
        { 'div@name-edit.account-item': 'Text input' }]  
      },
       { 'div[text-align: center]': [
        { 'div@email-edit.account-item': 'Email input' }]  
      },
      { 'div[w:100%]': [
        { 'div.cope-card.bg-orange.color-w.as-btn[m:0 auto; fz:14px]': 'Sign out' }]
      },
      { 'div': '' }] // TBD: edit profile
    },
    { 'div@app-list.app-list': [
      { 'div[w:100%]': [
        { 'div.cope-card.bg-blue.color-w.as-btn[m:0 auto; fz:14px]': 'Create New App' }]
      },
      { 'h3@app-list-title': '' },
      { '@apps': '' }] 
    }] 
  }
]);

CopeAppOverviewClass.render(vu => {
  let avatarEdit,
      accountEdit;

  vu('@display-name').html(vu.get('name') || vu.get('email') || 'Hello');

  vu.use('apps, appIds').then(v => {
    if (!v.appIds || !v.appIds.length) { return; }

    vu('@apps').html('');
    v.appIds.map(appId => {

      Views.class('AppCard').build({
        sel: vu.sel('@apps'),
        method: 'append',
        data: v.apps[appId]
      }).res('touched', function() {
        
        // Ask for data from outside
        vu.res('app selected', appId);
      });
    }); // end of map
  }); // end of use('apps, appIds')

  // Build Input in @avatar-edit && @name-edit && @email-edit
  avatarEdit = PurelyViews.class('Input').build({
    sel: vu.sel('@avatar-edit'),
    data: {
      type: 'media',
      editable: true
    }
  }).res('value', value => {
    vu.set('display', value.imgsrc);
    vu.$el('@avatar').css('background-image', 'url("' + value.imgsrc +'")');

    vu.res('save profile', {
      name: vu.get('name') || null,
      display: vu.get('display') || null
    });
  });// end of avatarEdit

  nameEdit = PurelyViews.class('Input').build({
    sel: vu.sel('@name-edit'),
    data: {
      type: 'text',
      value: vu.get('name') || 'Me',
      editable: true
    }
  }).res('value', value => {
    vu.set('name', value);
    vu.$el('@display-name').html(value);
    vu.res('save profile', {
      name: vu.get('name') || null,
      display: vu.get('display') || null
    });
  }); // nameEdit

  emailEdit = PurelyViews.class('Input').build({
    sel: vu.sel('@email-edit'),
    data: {
      type: 'text',
      value: vu.get('email')
    }
  }).res('value', value => {
    vu.set('email', value);
    vu.res('save profile', {
      name: vu.get('name') || null,
      display: vu.get('display') || null
    });
  }); // emailEdit

  avatarEdit.$el().addClass('circle');

  if(vu.get('display')){
    avatarEdit.$el().css('background-image', 'url("' + vu.get('display') +'")');
  }
  // Overview toggle
  vu.$el('@avatar').off('click').on('click', e => {
    vu.$el('@profile-editor').removeClass('hidden');
    vu.$el('@btn-close').removeClass('hidden');
    vu.$el('@app-list').addClass('hidden');
    vu.$el('@profile').addClass('hidden');
    vu.$el().addClass('cope-card');
    // if(vu.get('display')){
    //   avatarEdit.css('background-image', 'url("' + vu.get('display') +'")');
    // }
  });
  vu.$el('@btn-close').off('click').on('click', e => {
    vu.$el('@profile-editor').addClass('hidden');
    vu.$el('@btn-close').addClass('hidden');
    vu.$el('@app-list').removeClass('hidden');
    vu.$el('@profile').removeClass('hidden');
    vu.$el().removeClass('cope-card');
  });
});
// End of Cope.App.Overview

// Cope.App.AppEditor
// - currPage: string
// - sectionsOf: sections fo currPage
CopeAppEditorClass.dom(vu => [
  { 'div.view-app-editor': [
    { '.full-bg': '' },
    { '.left': [
      { 'div@logo-n-name.logo-n-name': [
        { 'div': [
          { 'div.no-logo': 'Logo'},
          { 'div.profile-logo@profile-logo': ''}]
        }]
      },
      { 'div@menu-wrap.menu-wrap': [
        { '@menu': '' },
        { '@root.hidden.btn-red': '<- Menu' },
        { '@pages.hidden': [
          { 'div@navigation': [
            { 'div[flex;]': [
              { 'h3[flex:1]': 'Navigation' },
              { '@add-page.btn-red.btn-add-page': '+' }]
            },
            { 'div@nav-items': '' }]
          },
          { 'div@page-settings.hidden': [
            { 'div@back.btn-red': '<- Pages'},
            { 'h3[mb:30px]': 'Page Settings'},
            { 'div@page-items': ''}]
          }]
        },
        { '@data.hidden': 'Data' },
        { '@design.hidden': 'Design' },
        { '@commerce.hidden': 'Commerce' },
        { '@analytics.hidden': 'Analytics' },
        { '@settings.hidden': 'Settings' }] 
      }]
    },
    { '@simulator.middle': [
      { '@sim-empty.hidden.sim-empty': [
        { 'div': 'Empty' }] 
      },
      { '@sim.sim': 'Simulator' },
      { '@sim-single.sim.sim-single.hidden': 'Simulator Single' },
      { '@control.control': 'Control' }] 
    },
    { '@panel-data.middle.hidden': 'Data' },
    { '@panel-design.middle.hidden': 'Design' },
    { '@panel-commerce.middle.hidden': 'Commerce' },
    { '@panel-analytics.middle.hidden': 'Analytics' },
    { '@panel-settings.middle.hidden': 'Settings' },
    { '@page-editor.right.hidden': '' },
    { '@section-editor.right.hidden': [
      { '.upper-toggle[flex; fz:16px;]': [
        { '@toggle-editor.bg-blue.color-w': 'Data' },
        { '@toggle-styler': 'Style' }] 
      },
      { '@editor.editor-form': 'Editor' },
      { '@styler.editor-form.hidden': 'Styler' }]
    }]
  }
]);

CopeAppEditorClass.render(vu => {

  let pageList, // sortable list of page items
      SS, // sortable list of section simulator
      sectionEditor,
      sectionStyler,
      pageSettings,
      pageItemClass,
      buildPageItems, // function to render page items
      simSections, // function(sections): to render sections in simulator
      savePage,
      open,
      addNewData,
      appNameInput,
      thatVu = vu,
      appId = vu.get('appId');

  // Init currPage and pageSettings
  vu.map('currPage', x => x || 'page-');
  pageSettings = vu.map('pageSettings', x => { 
    if (!x) { 
      x = [{ 
        title: 'Home',
        slug: '',
        pageId: 'page-'
      }]
    }
    return x;
  });

  // Init Page List
  pageList = PurelyViews.class('SortableList').build({
    sel: vu.sel('@nav-items')
  }).res('item clicked', function(item) {
    open('pages/page', { item: item });
  });

  // Init Section Simulator
  SS = PurelyViews.class('SortableList').build({
    sel: vu.sel('@sim')
  }).res('item clicked', function(item) {
    open('pages/page/sec', { item: item });
  }).res('order', order => {
    savePage();
  });

  // Init Section Editor
  sectionEditor = SectionEditorClass.build({
    sel: vu.sel('@editor')
  });

  // Init Section Styler
  sectionStyler = SectionStylerClass.build({
    sel: vu.sel('@styler')
  });

  // To render with page items
  buildPageItems = function(pages) {
    pageList.val('clear', true);
    pages.map(data => {
      pageList.val('new', {
        viewClass: PageItemClass,
        data: data
      });
    });
  };

  // To render with sections data
  simSections = function(sections) {
      
    // Hide simulator's fallback
    vu.$el('@sim-empty').addClass('hidden');

    // Reset the sortable list
    SS.val('clear', true);

    sections.map(data => {
      data.vh = 400;
      SS.val('new', {
        viewClass: SectionSimulatorClass,
        data: data
      }) 
    }); // end of sections.map

    if (!sections || sections.length < 1) {
      vu.$el('@sim-empty').removeClass('hidden');
    }
  }; // end of simSections

  // Define navigation function
  open = function(path, params) {
    let item;
    switch (path) {
      case 'pages':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@simulator').removeClass('hidden');
        break;
      case 'pages/page':
        item = params && params.item;
        let currPage = vu.map('currPage', x => {
          let currPage = item && item.view && item.view.get('pageId');
          if (x != currPage) {
            let sections = vu.get('pages')[currPage].sections || [];
            simSections(sections);
            x = currPage;
          }
          return x;
        });

        vu('@page-editor').html('');
        [{ key: 'title', title: 'Page Title' }, 
         { key: 'slug', title: 'URL Slug' }].map((obj, i) => {
          let x = obj.key,
              value = item.view.get()[x];
          if (x === 'slug') { value = '/' + value }

          vu('@page-editor').append([
            { 'h5[mt:8px; mb:4px; fz:12px; c:#888]': obj.title },
            ['@item-' + i + '[fz:16px;]']
          ]);

          let input = PurelyViews.class('Input').build({
            sel: vu.sel('@item-' + i),
            data: {
              type: 'text',
              value: value,
              editable: x == 'title' || item.view.get('pageId') != 'page-'
            }
          }).res('done', value => {
            item.view.val(x, value);
            //console.log('After', vu.get('pageSettings'));
            console.log('TBD', value);
            if (x === 'slug') {
              input.val('value', '/' + item.view.val(x));
            }
          });
        }); //end of map
        
        vu.$el('.right').addClass('hidden');
        vu.$el('@page-editor').removeClass('hidden');
        break;
      case 'pages/page/sec':
        item = params && params.item;

        let tmpData = item.view.val(),
            view = item.view;

        tmpData.vh = 400;

        if (!item || !view) { return; }
        
        // Tmp Single Section in Edit Mode
        let tmpSection = SectionSimulatorClass.build({ 
          sel: vu.sel('@sim-single'),
          data: tmpData
        });

        sectionEditor.set(null);
        sectionEditor.set('appId', appId);
        sectionEditor.val(view.val());
        sectionEditor.res('data', data => {
          tmpSection.val(data);
        });
        
        sectionStyler.set(null);
        sectionStyler.val('style', view.get('style'));
        sectionStyler.res('style', style => {
          sectionEditor.set('style', style);
          tmpSection.val('style', style);
        });

        // Switch to Edit Mode: Darken Purely App Background
        vu.$el('@section-editor').removeClass('hidden');
        vu.$el('.full-bg').addClass('darken');
        vu.$el('@menu-wrap').addClass('hidden');
        vu.$el('@sim-single').removeClass('hidden');
        vu.$el('@sim').addClass('hidden');

        // Build action buttons for the selected section
        vu('@control').html([
          { 'div@control-back.cope-card.as-btn.bg-w': '<-' }, 
          { 'div@control-remove.cope-card.as-btn.bg-orange.color-w.right': 'Remove Section' }
        ]);

        // Set action buttons
        // "Back"
        vu.$el('@control-back').off('click').on('click', e => {
          // Update the selected section
          item.view.val(tmpSection.val());
          savePage();
          //toggleBack();
          open('back');
        });

        // "Remove Section": To remove the selected section
        vu.$el('@control-remove').off('click').on('click', e => {
          // Update the selected section
          //toggleBack();
          open('back');
          item.view.$el().fadeOut(800);
          setTimeout(function() {
            SS.val('remove', item.idx);
            if (SS.get('List').get().length < 1) {
              vu.$el('@sim-empty').removeClass('hidden');
            }
            savePage();
          }, 1200);
        });
        
        // Show the right part
        vu.$el('@section-editor').removeClass('hidden');
        break;
      case 'data':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@panel-data').removeClass('hidden');
        break;
      case 'data/node':
        break;
      case 'design':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@panel-design').removeClass('hidden');
        break;
      case 'commerce':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@panel-commerce').removeClass('hidden');
        break;
      case 'analytics':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@panel-analytics').removeClass('hidden');
        break;
      case 'settings':
        vu.$el('.middle').addClass('hidden');
        vu.$el('@panel-settings').removeClass('hidden');
  
        let appSettings = AppSettingsClass.build({
          sel: vu.sel('@panel-settings'),
          data: {
            appId: vu.get('appId'),
            name: vu.get('name')
          }
        });

        break;
      case 'back':
      case 'root':
      default: // root
        let removePageBtn = (vu.get('currPage') != 'page-') 
          ? { 'div@control-remove.cope-card.as-btn.bg-orange.color-w.right': 'Remove Page' }
          : '';

        vu('@control').html([
          { 'div@control-add-sec.cope-card.as-btn.bg-w': 'Add Section' }, 
          { 'div@control-arrange.cope-card.as-btn.bg-blue.color-w': 'Edit' },
          removePageBtn
        ]);
        vu.$el('@section-editor').addClass('hidden');
        vu.$el('.full-bg').removeClass('darken');
        vu.$el('@menu-wrap').removeClass('hidden');
        vu.$el('@sim-single').addClass('hidden');
        vu.$el('@sim').removeClass('hidden');

        // To add a new section
        vu.$el('@control-add-sec').off('click').on('click', e => {
          vu.$el('@sim-empty').addClass('hidden');
          SS.val('new', {
            viewClass: SectionSimulatorClass,
            data: {
              title: 'Title',
              content: 'Content',
              style: 'sec-bright/sec-op-8/sec-wrap/text-bold-title'
            }
          });
          vu.$el('@sim').animate({ scrollTop: vu.$el('@sim')[0].scrollHeight }, 400);
          setTimeout(function() {
            SS.get('List').getByIdx(-1).view.$el().click();

            // Update page data
            savePage();
          }, 400);
        });

        // To remove the page
        vu.$el('@control-remove').off('click').on('click', e => {
          console.log('Remove page', vu.get('currPage'));
        });

        // To rearrange sections
        vu.$el('@control-arrange').off('click').on('click', e => {
          console.log('TBD'); 
        });
      // end of "default"/"root"
    } // end of switch
  }; // end of open

  savePage = function() {
    vu.map('pages', pages => {
      let currPage = vu.get('currPage');
      let sections = [];
      SS.get('List').get().map(item => {
        sections[item.idx] = item.view.get();
      });
      pages[currPage].sections = sections;
      return pages;
    });

    vu.res('save page');
  }; // end of savePage





  // @hydra's code
  
  // Build profile input
  let profileLogo = PurelyViews.class('Input').build({
    sel: vu.sel('@profile-logo'),
    data: {
      type: 'media',
      value: 'Logo',
      editable: true,
    }
  });

  let profileAppName = PurelyViews.class('Input').build({
    sel: vu.sel('@profile-appname'),
    data: {
      type: 'text',
      value: 'App Name',
      editable: true
    }
  });

  // Set profileLogo's css
  profileLogo.$el().css({
    'background-color': '',
    'width': '100px',
    'height': '100px'
  });

  let nav = function(page) {
    vu.$el('@menu-wrap').children().addClass('hidden');
    vu.$el('@' + page).removeClass('hidden');
    vu.$el('@root').removeClass('hidden');
    if (page == 'root') {
      vu.$el('@menu').removeClass('hidden');
      vu.$el('@root').addClass('hidden');
    }
  }; // end of nav

  vu('@menu').html('');
  [{ 
    label: 'Pages',
    name: 'pages'
  }, {
    label: 'Data',
    name: 'data'
  }, {
    label: 'Design',
    name: 'design'
  }, {
    label: 'Commerce',
    name: 'commerce'
  }, {
    label: 'Analytics',
    name: 'analytics'
  }, {
    label: 'Settings',
    name: 'settings'
  }].map((x, idx) => {
    vu('@menu').append([
      { 'div': [
        [ 'div@menu-btn-' + idx + '.menu-btn', x.label]]
      }
    ]);
    // @menu-btn event
    vu.$el('@menu-btn-' + idx).off('click').on('click', e => {
      open(x.name);
      if (x.name == 'pages') { nav(x.name); }
    });
    // set @menu-btn Css
    //vu.$el('@menu-btn-' + idx).css(buttonCss);
  }); // end of map
  
  // @root click event
  vu.$el('@root').off('click').on('click', e => {
    nav('root');
  }); //end of @root click

  // Build PageItemClass
  PageItemClass = Cope.class(); // Cope.class()
  PageItemClass.dom(vu => [{ 'div.btn-red': '' }]);
  PageItemClass.render(vu => {
    let title, slug, extUrl, pageId, 
        currPageId = vu.get('pageId');

    title = vu.map('title', title => title || 'New Page');
    pageId = vu.map('pageId', pageId => {
      if (!pageId) {
        return 'page-' + Math.random().toString(36).slice(2, 7);
      }
      return pageId;
    });
    slug = vu.map('slug', slug => {
      if (vu.get('pageId') != 'page-') {
        let newSlug, dict = [],
            pageSettings = thatVu.get('pageSettings');

        console.log(pageSettings);

        newSlug = slug || title.replace(/[\s]/g, '-').toLowerCase();
      
        newSlug = newSlug.replace(/[\/]{2,}/g, '/');
        if (newSlug.charAt(0) == '/') { newSlug = newSlug.slice(1); }

        if (!newSlug.match(/^[\w\d\-\/]+$/)) {
          newSlug = pageId.slice(5);
          //console.log(newSlug);
        }
        
        for (let i = 0; i < pageSettings.length; i++) {
           dict[i] = newSlug + '-' + (i + 1);
        }
        dict = [newSlug].concat(dict);

        pageSettings = pageSettings.filter(x => (currPageId != x.pageId));
                
        
        // Duplicates found, assign new slug
        if (pageSettings.length) {
          for (let i = 0; i < dict.length; i++) {
            let matched = false;
            for (let j = 0; j < pageSettings.length; j++) {
              if (dict[i] == pageSettings[j].slug) {
                matched = true;
                break;
              }
            }
            if (!matched) {
              newSlug = dict[i];
              break;
            }
          }
        }
        return newSlug;
      }
      return slug;
    });

    vu().html(title);

    // Update app editor's pageSettings
    thatVu.map('pageSettings', v => {
      return v.map(x => {
        if (x.pageId == pageId) {
          return vu.get();
        }
        return x;
      });
    })
  }); // end of PageItemClass

  // @add-page click event 
  vu.$el('@add-page').off('click').on('click', e => {
    pageList.val('new', {
      viewClass: PageItemClass
    })

    let newPageItemData = pageList.get('List').getByIdx(-1).view.get();
    if (newPageItemData) {
      vu.map('pageSettings', x => {
        x = x.concat(newPageItemData);
        return x;
      });
    }
  });

  // page-settings event
  vu.$el('@back').off('click').on('click', e => {
    vu.$el('@page-settings').addClass('hidden');
    vu.$el('@navigation').removeClass('hidden');
    vu.$el('@root').removeClass('hidden');
  });

  // End of @hydra






  // TBD: wrap it in sectionEditor! Set the toggle between editor and styler
  ['editor', 'styler'].map(x => {
    let $that = vu.$el('@toggle-' + x);
    $that.off('click').on('click', e => {
      vu.$el('.upper-toggle')
        .children()
        .removeClass('bg-blue')
        .removeClass('color-w');
      $that
        .addClass('bg-blue')
        .addClass('color-w');
      vu.$el('.editor-form').addClass('hidden');
      vu.$el('@' + x).removeClass('hidden');
    });
  });

  // Start with "root"
  open('root');

  // Render page items
  buildPageItems(vu.get('navigation'));

  // Render home page
  console.log(vu.get());
  simSections(vu.get('pages')['page-'].sections || []);
});
// End of Cope.App.AppEditor

})(jQuery, Cope, undefined)
