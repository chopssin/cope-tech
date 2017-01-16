(function($) {
const G = Cope.appGraph('testApp2'),
      test = Cope.Util.setTest('test-cope'),
      debug = Cope.Util.setDebug('test-cope', true),
      Views = Cope.useViews('test-cope'),
      TestBlock = Views.class('TestBlock'),
      TestBar = Views.class('TestBar');

const setTest = function() {
  let okCount = 0,
      testCount = 0,
      blocks = [],
      test = {};

  let testBar = TestBar.build({
    sel: '#test-bar'
  }).res('findPassed', () => {
    test.toggle('passed');
  }).res('findFailed', () => {
    test.toggle('failed');
  })

  test.go = function(_fn) {
    if (typeof _fn == 'function') {

      let block = TestBlock.build({
        sel: '#tests',
        method: 'append'
      });

      // Store blocks
      blocks.push(block);

      let log = function(_str) {
        if (typeof _str == 'string') {
          block.$el('@log').append(_str + '<br>');
        }
        return block.sel('@log');
      };

      log.id = testCount;
      testCount++;

      log.ok = function() {
        block.val({ ok: true });
        testBar.val({ ok: log.id });
      };

      log.sel = function() {
        return block.sel('@log');
      };

      log.title = function(_title) {
        block.val('title', _title);
      };

      testBar.val({ addTest: log.id });

      // Run test function
      _fn(log);
    }
  }; // end of test.go

  // To toggle on/off passed or failed or all tests
  test.toggle = function(_filter) {
    if (_filter == 'passed' || _filter == 'failed') {
      // Show only passed or failed
      blocks.forEach(block => {
        block.val({ 
          hide: !block.get('ok') == (_filter == 'passed')
        });
      });
    
    } else {
      // Show all
      blocks.forEach(block => {
        block.val({ hide: false });
      });
    }
  };

  return test;
}; // end of setTest

// Vbox 
const setVbox = function() {
  let $selector;

  let vbox = function(_id) {
    $selector = $('#' + _id);
    return vbox;
  };

  vbox.log = function(_msg) {
    $selector.append(`<div style="
      font-size: 1.5em;
      padding: 16px;
      color: #987;
    ">${_msg}</div>`);  
  };

  vbox.append = function(_str) {
    if (typeof _str == 'string') {
      $('#views').append(`<div id="${_str}" style="
        display: block;
        width:　100%;
        margin-top: 50px;
        margin-bottom: 50px;
        padding: 0;
        min-height: 200px;
        border: 2px solid #aaa;
      "></div>`);
    }
  };  
  return vbox;
}; //end of setVbox

const Vbox = setVbox();

// TestBar
TestBar.dom(vu => `
  <div ${vu.ID} style="text-align: center">
    <div class="green light">
      <img src="img/green.jpg" width="25" height="25">
      <span data-component="passed"></span>
    </div>
    <div class="red light">
      <img src="img/red.jpg" width="25" height="25">
      <span data-component="failed">${ vu.val('total') }</span>
    </div>
  </div>
`);

TestBar.render(vu => {
  
  // Set CSS
  vu.$el('.light').css({
    'display': 'inline-block',
    'width': '100px',
    'font-size': '18px',
    'font-weight': 'bold',
    'padding': '6px'
  });

  if (!vu.get('tests')) {
    vu.set('tests', {});
  }

  if (!vu.get('passed')) {
    vu.set('passed', {});
  }
  
  let tests = vu.get('tests'),
      passed = vu.get('passed');

  vu.use('addTest').then(v => {
    tests[v.addTest] = true;
  });

  vu.use('ok').then(v => {
    passed[v.ok] = true;
  });
    
  let testsCount = Object.keys(tests).length,
      passedCount = Object.keys(passed).length;

  vu.$el('@passed').html(passedCount);
  vu.$el('@failed').html(testsCount - passedCount);

  vu.$el('@passed').off('click').on('click', () => {
    vu.res('findPassed');
  });

  vu.$el('@failed').off('click').on('click', () => {
    vu.res('findFailed');
  });
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

//show & hide
function Show(){  
  $('#toggle, #tests-status')
    //.append(`<a id="toggle-purely">Purely</a>`)
    //.append(`<a id="toggle-app-graph">Tests</a>`)
    //.append(`<a id="toggle-views">Views</a>`)
    .css({
      'display': 'block',
      'positoin': 'relative',
      'margin': '50px auto',
      'text-align': 'center',
      'font-size': '24px',
      'font-weight': 'bold'
    });


  $('#toggle a, #toggle-tests')
    .css({
      padding: '16px'
    });

  $('#toggle-purely, #toggle-views, #toggle-tests')
    .click(function() {
      $('#purely, #tests, #views').addClass('hidden');
      switch ($(this).prop('id')) {
        case 'toggle-purely':
          $('#purely').removeClass('hidden');
          break;
        case 'toggle-tests':
          $('#tests').removeClass('hidden');
          break;
        case 'toggle-views':
          $('#views').removeClass('hidden');
          break;
      }
    });
}

Show(); // TBD: Show is redundancy, extract the program plz

// Set Tests
const Test = setTest();

// Simplest test
Test.go(log => {
  log.title('Hello');
  log('Hello world');
  log.ok();
});
  
// Tests with setTimeout
setTimeout(function() {
  Test.go(log => {
    log.title('Run test#1 after 1s');
    setTimeout(function() {
      log('OK after 4s');
      log.ok();

      Test.go(log => {
        log.title('Run test#2 after test#1 completed');
        setTimeout(function() {
          log('Completed');
          log.ok();
        }, 2000);
      });
    }, 4000);
  });
}, 1000);

// Test - appGraph: node
Test.go(log => {
  log.title('AppGraph Nodes');

  log(`G = Cope.appGraph('testApp2')`);
  log('<br>');
  log(`dreamer = G.node('Dreamers', 'Jeff')`);
  
  let dreamer = G.node('Dreamers', 'Jeff');
  if (!dreamer || !dreamer.col || !dreamer.key) {
    debug('dreamer does not have properties "col" or "key"', dreamer);
  }

  log(`dreamer.val('age', 20)`);
  log(`dreamer.val({ 'name': 'Jeff' })`);

  dreamer.val('age', 20);
  dreamer.val({ 'name': 'Jeff' });

  log('Test dreamer.val() <= data');
  dreamer.val().then(data => {
    log('<br>');
    log(`data.name = ${data.name}`, 1);
    log(`dreamer.snap('age') = ${dreamer.snap('age')}`, 1);
    log('<br>');
    log('Deleting dreamer by calling dreamer.del(true)', 1);
    dreamer.del(true).then(() => {
      log('<br>');
      log('dreamer was deleted', 2);
      log('<br>');

      log.ok();
    });
  });
}); // end of test

// Test - Purely
Test.go(log => {
  log.title('Purely');

  // Set viewport of Purely
  $('#purely').css({
    'border': '3px solid #333',
    'height': '80vh',
    'margin-bottom': '100px',
    'padding': '0',
    'overflow': 'scroll'
  });

  // Sample Settings
  let settings = [];
  settings.push({
    logo: {
      text: 'Lily'
    },
    colors: {
      p1: '#9FC3A1',
      p2: '#B3CDA8',
      h: '#AEB69E',
      s1: '#CDCDA8',
      s2: '#C3BF9F'
    },
    navItems: [
      {
        title: 'Home',
        href: '#'
      },
      {
        title: 'Google',
        href: 'http://www.google.com'
      }
    ]
  });

  settings.push({
    logo: {
      text: 'Billy'
    },
    colors: {
      p1: '#2D3436',
      p2: '#283236',
      h: '#AEBDC2',
      s1: '#97ADB6',
      s2: '#6D7D83'
    },
    navItems: [
      {
        title: 'Home',
        href: '#'
      },
      {
        title: 'Aca',
        href: 'http://acatw.com'
      }
    ]
  });

  // Randomly choose a settings
  let mySet = settings[Math.floor(Math.random() * settings.length)];
  // TBD: use Cope.App.usePage

  // Build Navbar
  let nav = NavView.build({
    sel: '#purely',
    data: {
      signedIn: false,
      'user-items':[{title:"Account", href:"#"},{title:"Sign Out", comp:'signOut'}],
      '@logo': {
        logoText: mySet.logo.text,
      },
      navItems: mySet.navItems
    }
  }).res('signIn', () => {
    nav.val({
      signedIn: true
    });
  }).res('signOut', () => {
    nav.val({
      signedIn: false
    });
  });

  // Build some sections
  let secCover = BoxView.build({
    sel: '#purely',
    method: 'append',
    data: {
      css: {
        width: '100%',
        height: '100%',
        'background-color': mySet.colors.s1
      }  
    }
  });

  let secCol = BoxView.build({
    sel: '#purely',
    method: 'append',
    data: {
      css: {
        width: '100%',
        height: '100%',
        'background-color': mySet.colors.s2
      }  
    }
  });

  let secAbout = BoxView.build({
    sel: '#purely',
    method: 'append',
    data: {
      css: {
        width: '100%',
        height: '100%',
        'background-color': mySet.colors.h
      }  
    }
  });

  let secContact = BoxView.build({
    sel: '#purely',
    method: 'append',
    data: {
      css: {
        width: '100%',
        height: '100%',
        'background-color': mySet.colors.p1
      }  
    }
  });

  let secFooter = BoxView.build({
    sel: '#purely',
    method: 'append',
    data: {
      css: {
        width: '100%',
        height: '100%',
        'background-color': mySet.colors.p2
      }  
    }
  });

  log.ok();
});

// Test - appGraph: edges formed by node.link
Test.go(log => {
  //let log = setLog();

  log.title('AppGraph Edges: using node.link');
  log(`G = Cope.appGraph('testApp2')`);
  log('<br>');
  log(`let dreamer = G.node('Dreamers', 'Chops')<br><br>
  let Dreams = G.col('Dreams')<br>
  let daydream = Dreams.node('daydream')<br>
  let nightmare = Dreams.node('nightmare')<br><br>`);

  let Chops = G.node('Dreamers', 'Chops');
  let Dreams = G.col('Dreams');
  let daydream = Dreams.node('daydream');
  let nightmare = Dreams.node('nightmare');

  log(`Chops.link('hasA', daydream)<br>
  Chops.link('hasA', nightmare)`);

  Chops.link('hasA', daydream);
  Chops.link('hasA', nightmare).then(() => {
    log('Created two dreams', 1);
    log(`Chops.unlink('hasA', daydream)<br>
    Chops.unlink('hasA', nightmare)`);

    Chops.unlink('hasA', daydream);
    Chops.unlink('hasA', nightmare).then(() => {
      log('Deleted all dreams', 1);
      log('<br>');
      log.ok();
    });
  });
}); // end of test

// Test - AppGraph edges
Test.go(log => {
  log.title('AppGraph edges');

  //let log = setLog();
  let G = Cope.appGraph('testApp2');
  
  // Create an edge
  let testA = G.node('TestNodes', 'testA');
  testA.val('name', 'testA');
  testA.link('BetweenTests', G.node('TestNodes', 'testB'));

  log('testA ---TestNodes---> testB');
  log('<br>');
  log(`G.edges('BetweenTests')
    .of(G.node('TestNodes', 'testA'))
    .then <= results`);

  G.edges('BetweenTests')
    .of(G.node('TestNodes', 'testA'))
    .then(results => {
    log(JSON.stringify(results, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;'));
    log('<br>');
    log.ok();
  }); // end of G.edges

}); // end of test

// Test - AppGraph.populate
Test.go(log => {
  log.title('AppGraph.populate');

  let G = Cope.appGraph('testApp2');

  G.populate([
    G.node('TestNodes', 'testA'),
    G.node('FakeShits', 'fake')
  ]).then(nodes => {
    //log(`G.populate([testA, fake]).then <= nodes`);
    //log('<br>');
    
    log(`G.populate([testA, fake]).then <= nodes`);
    log(`<br>`);

    nodes.forEach(node => {
      debug(node.key, node.snap());
      //log('[' + node.key + ']');
      // log(JSON.stringify(node.snap(), null, 4)
      //     .replace(/\n/g, '<br>')
      //     .replace(/\s/g, '&nbsp;'));
      // log('<br>');

      log('[' + node.key + ']');
      log(JSON.stringify(node.snap(), null, 4)
        .replace(/\n/g, '<br>')
        .replace(/\s/g, '&nbsp;'));
      log('<br>');

      log.ok();
    });
  });
});

// Test - Cope.useViews
Test.go(log => {
  log.title('Cope.useViews');
  log(`Test with a Post view with vu.use<br>
    <h4>Post</h4><br>
    @title<br>
    @content<br>
    <br>
    vu.use("title, @post.content")<br>
    <br>
    Post.render(vu => {<br>
    &nbsp;&nbsp;vu.use('title, @post.content').then(v => {<br>
    &nbsp;&nbsp;&nbsp;&nbsp;vu.$el('@title').html(v.title);<br>
    &nbsp;&nbsp;&nbsp;&nbsp;vu.$el('@content').html(v["@post"].content);<br>
    &nbsp;&nbsp;});<br>
    });<br>
    <br>`);
  
  let Post = Views.class('Post');

  Post.dom(vu => `<div ${vu.ID}>
    <h3 data-component="title"></h3>
    <p data-component="content"></p>
  </div>`);
  
  Post.render(vu => {

    vu.$el().css({
      'max-width': '540px',
      padding: '16px',
      border: '2px solid #333'
    });

    vu.use('title, @post.content').then(v => {
      vu.$el('@title').html(v.title);
      vu.$el('@content').html(v["@post"].content);
    });
  });

  Post.build({
    sel: log.sel(),
    method: 'append'
  }).val({
    comment: [{ by: 'clinet A', msg: 'Good.' }, { by: 'BBB', msg: 'Cool.'}]
  }).val({
    '@post': {
      content: 'Rendered @content with v["@post"].content.'
    }
  }).val('title', 'Rendered @title with v.title');

  //let logQQ = block.$el('@logs')

  //log('<br>');
  //log('Passed');
  log.ok();
});

// Test - use jQuery
Test.go(log => {
  log.title('use jQuery');
  if ($) {
    log.ok();
    log(`jQuery is defined`);

  } else {
    log('undefined jQuery or $');
  }
});

// Test - Purely iframe 
Test.go(log => {
  log.title('Purely iframe');
  $(log.sel()).append(`<iframe src="/purely" width="80%"></iframe>`);
  log.ok();
});

// Test - @hydra
Test.go(log => {
  log.title('@hydra: Views - Nav, Box, TextArea, ImageUploader');
  Vbox.append('nav');
  Vbox.append('box');
  Vbox.append('textArea');
  Vbox.append('imageUploader');

  Vbox('nav').log('no data');

  let navA = NavView.build({
    sel: '#nav',
    method: 'append'
  });

  Vbox('nav').log('signIn, navItems, css, @logo');
  
  let navB = NavView.build({
    sel: '#nav',
    method: 'append'
  }).val({
    signedIn: true,
    navItems: [{title:"HOME",href:"#"},{title:"About",href:"#"},{title:"FAQ",href:"#"}], // { title, href }
    css: {
      "height": "100px",
      "background-color": "#aca",
    },
    "@logo": {
      logoText: 'Aca',
      css: {
        "background-image":'url("http://blog.asiayo.com/wp-content/uploads/2016/11/%E5%8F%B0%E5%8D%97-1.jpg")'
      }
    }
  });

  Vbox('nav').log('signIn, member, user-items')

  let navC = NavView.build({
    sel: '#nav',
    method: 'append',
    data: {
      member: true,
      signedIn: false,
      "user-items": [{title:"Account", href:"#"},{title:"Sign Out", comp:'signOut'}]
    }
  }).res('signIn', () => {
    navC.val({
      signedIn: true
    });
  }).res('signOut', () => {
    navC.val({
      signedIn: false
    });
  });;

  Vbox('nav').log('mainItem');

  let navD = NavView.build({
    sel: '#nav',
    method: 'append',
    data: {
      mainItems:[{title:"About",comp:"About",href:"#"},{title:"FAQ",comp:"FAQ"}]
    }
  });


  //Box
  let boxA = BoxView.build({
    sel: '#box',
    method: 'append'
  });

  boxA.val({
    css:{
      "width": "100px",
      "height": "100px",
      "top": "20px",
      "left": "20px", 
      "border": "6px solid #333",
      "padding": "10px 6px",
    }
  });

  let boxB = BoxView.build({
    sel: boxA.sel(),
    method: 'append'
  }).val({
    css:{
      "width": "30px",
      "height": "30px",
      "top": "10px",
      "left": "10px", 
      "border": "2px solid #aca"
    }
  });

  //console.log(BoxB);
  //BoxB.val('test', 0).val('test', 2)

  //TextArea
  let TextArea = TextAreaView.build({
    sel: '#textArea',
    method: 'append'
  }).res('value', val => {
    console.log(val);
  });

  //ImageUploader 

  let ImageUploader = ImageUploaderView.build({
    sel: '#imageUploader',
    method: 'append'
  }).res('value', val => {
    console.log(val);
  });
  log.ok();
});

// Test - @Assface
Test.go(log =>{
  log.title('@Assface: Views - Select');
  log('Randomly select an option of Select to get the green light.');

  //$('#views').append(`<div id="view-select" style="margin-bottom: 200px"></div>`);

  Vbox.append('view-select');

  SelectView.build({
    sel: '#view-select',
    method: 'append',
    data: {
      options: [{ 
        value: 0, 
        payload: 'Sunday' 
      }, { 
        value: 1, 
        payload: 'Monday' 
      },{ 
        value: 2, 
        payload: 'Tuesday' 
      },{ 
        value: 3, 
        payload: 'Wednesday' 
      },{ 
        value: 4, 
        payload: 'Thursday' 
      },{ 
        value: 5, 
        payload: 'Friday' 
      },{ 
        value: 6, 
        payload: 'Saturday' 
      }]
    }
  }).res('value', o=> {
    console.log(o);
    log(JSON.stringify(o, null, 2));

    log.ok();
  })
});

// Test - @PJ
Test.go(log => {
  log.title('@PJ: Views - Photo, Grid, Slide');

  Vbox.append('photo');
  Vbox.append('grid');
  Vbox.append('slide');


  PhotoView.build({
    sel: '#photo',
    method: 'append'
  }).val({
    src: 'https://api.fnkr.net/testimg/450x300/00CED1/FFF/?text=img+placeholder',
    caption: 'This is a placeholder',
    css: {},
    '@img': {
      css: {},
    },
    '@caption': {
      css: {}
    }
  })

  GridView.build({
    sel: '#grid',
    method: 'append'
  }).val({
    src: ['https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/',
      'https://fakeimg.pl/440x320/282828/eae0d0/'
    ],
    css: {
      width: '100%',
      margin: '0 auto'
    }
  }); 

SlideView.build({
    sel: '#slide',
    method: 'append'
  }).val({
    data: [{
      src: 'http://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg',
      link: 'https://www.google.com.tw/?q=1',
      caption: 'This is placeholder 1'
    }, {
      src: 'http://www.planwallpaper.com/static/images/6790904-free-background-wallpaper.jpg',
      link: 'https://www.google.com.tw/?q=2',
      caption: 'This is placeholder 2'
    }, {
      src: 'http://www.psdgraphics.com/file/fresh-background.jpg',
      link: 'https://www.google.com.tw/?q=3',
      caption: 'This is placeholder 3'
    }],
    container: {
      width: '680px',
      height: '400px'
    },
    captionFontCSS: {
      "font-size": "42px",
      "color": "#FFF",
      "width": "300px"
    },
    autoSlide: true,
    changeTime: 3000,
    showArrow: false,
    mode: 'center'
  })
  
  
  SlideView.build({
    sel: '#slide',
    method: 'append'
  }).val({
    data: [{
      src: 'https://fakeimg.pl/980x390/282828/eae0d0/?text=Slide1',
      link: 'https://www.google.com.tw/?q=1',
      caption: 'This is placeholder 1'
    }, {
      src: 'https://fakeimg.pl/980x390/282828/eae0d0/?text=Slide2',
      link: 'https://www.google.com.tw/?q=2',
      caption: 'This is placeholder 2'
    }, {
      src: 'https://fakeimg.pl/980x390/282828/eae0d0/?text=Slide3',
      link: 'https://www.google.com.tw/?q=3',
      caption: 'This is placeholder 3'
    }, {
      src: 'https://fakeimg.pl/980x390/282828/eae0d0/?text=Slide4',
      link: 'https://www.google.com.tw/?q=4',
      caption: 'This is placeholder 4'
    }],
    container: {
      width: '680px',
      height: '400px'
    },
    captionFontCSS: {
      "font-size": "25px"
    },
    autoSlide: true,
    changeTime: 3000,
    showArrow: true,
    mode: 'slide'
  })
  
  

  log.ok();
}); // end of test

})(jQuery)
