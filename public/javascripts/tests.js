(function(){
//const UlistView = Views.class('Ulist'),
const G = Cope.appGraph('testApp2'),
      Views = Cope.views('Purely'),
      TestBlock = Views.class('TestBlock'),
      TestBar = Views.class('TestBar'),
      Viewport = Views.class('Viewport');

// Views
// TestBlock
TestBlock.dom(vu => `
  <div ${vu.ID} style="display:table; width:100%; margin:30px 0; border:2px solid #999; padding: 16px">
    <div data-component="status">
      <div data-component="light"></div>
      <h3 data-component="title"></h3>
    </div>
    <div data-component="log">
    </div>
  </div>
`);

TestBlock.render(vu => {

  if (vu.get('ok')) {
    vu.$el('@light').css({
    'display': 'inline-block',
    'width': '20px',
    'height': '20px',
    'border-radius': '99em',
    'background-color': 'green',
    'padding': '6px'
  });
  } else {
    vu.$el('@light').css({
    'display': 'inline-block',
    'width': '20px',
    'height': '20px',
    'border-radius': '99em',
    'background-color': 'red',
    'padding': '6px'
  });
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
 
// TestBar
TestBar.dom(vu => `
  <div ${vu.ID} class="row" style="text-align: left;">
    <div class="col-xs-4 inspector" data-component="tests">Tests</div>
    <div class="col-xs-4 inspector" data-component="green-light">
      <span class="green light"></span>
      <span data-component="passed"></span>
    </div>
    <div class="col-xs-4 inspector" data-component="red-light">
      <span class="red light"></span>
      <span data-component="failed">${ vu.val('total') }</span>
    </div>
  </div>
`);

TestBar.render(vu => {
  
  // Set CSS
  vu.$el('@tests').css({
    'font-size': '30px',
    //'padding': '15px'
  });

  $('.inspector').css({
    'text-align': 'center',
    'display': 'inline-block',
    //'margin': '0px 100px 0 280px',
    'cursor': 'pointer',
    'padding': '15px'
  })
  .off('mouseenter')
  .off('mouseleave')
  .on('mouseenter', function() {  
    $(this).css('background-color', '#DDDDDD');
  })
  .on('mouseleave', function() {
    $(this).css('background-color', 'transparent');
  });

  vu.$el('.red.light').css({
    'display': 'inline-block',
    'width': '30px',
    'height': '30px',
    'border-radius': '99em',
    'background-color': 'red'
  });

  vu.$el('.green.light').css({
    'display': 'inline-block', 
    'width': '30px',
    'height': '30px',
    'border-radius': '99em',
    'background-color': 'green'
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

  vu.$el('@passed').html(passedCount).css({'font-size': '30px'});
  vu.$el('@failed').html(testsCount - passedCount).css({'font-size': '30px'});

  vu.$el('@green-light').off('click').on('click', () => {
    vu.$el('@tests').click(); 
    vu.res('findPassed');
  });

  vu.$el('@red-light').off('click').on('click', () => {
    vu.$el('@tests').click(); 
    vu.res('findFailed');
  });

  //選擇在dom中data-component="tests"的tag，當按下的時候便射出一個名為test的參數出去
  vu.$el('@tests').off('click').on('click', () =>{
    vu.res('Tests');
  });
});

// Viewport
// @tests
// @purely
// @views
// -switch: string, desired section, could be 'tests' || 'purely' || 'views'
Viewport.dom(vu => `
  <div ${vu.ID}>
    <div class="sec" data-component="tests"></div>
    <div class="sec" data-component="purely" class="hidden"></div>
    <div class="sec" data-component="views" class="hidden"></div>
  </div>
`);

Viewport.render(vu => {
  vu.$el('.sec').css({
    'display': 'block',
    'positoin': 'relative',
    'margin': '50px auto',
    'font-size': '18px'
    //'font-weight': 'bold'
    });

  vu.$el('.sec')
    .css({
      padding: '16px'
    });

  vu.$el('@tests').off('click').on('click', () =>{
    vu.res('sec');
  });
  
  switch (vu.val('switch')) {
    case 'purely':
      vu.$el('@tests').addClass('hidden');
      vu.$el('@purely').addClass('hidden');
      vu.$el('@views').addClass('hidden');
      vu.$el('@purely').removeClass('hidden');
      break;
    case 'views':
      vu.$el('@tests').addClass('hidden');
      vu.$el('@purely').addClass('hidden');
      vu.$el('@views').addClass('hidden');
      vu.$el('@views').removeClass('hidden');
      break;
    case 'tests':
    default:
      vu.$el('@tests').addClass('hidden');
      vu.$el('@purely').addClass('hidden');
      vu.$el('@views').addClass('hidden');
      vu.$el('@tests').removeClass('hidden');
      break;
  }
});
// end of Views

// Build Viewport
let viewport = Viewport.build({
  sel: '#tests-container'
});

// Test APIs
const setVbox = function() {
  let $root = viewport.$el('@views'), 
      $selector;

  let vbox = function(_id) {
    $selector = $root.find('#' + _id);
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
      $root.append(`<div id="${_str}" style="
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

const setTest = function() {
  let okCount = 0,
      testCount = 0,
      blocks = [],
      test = {};

  // // // Build Viewport
  // let viewport = Viewport.build({
  //   sel: '#tests-container'
  // });

  let testBar = TestBar.build({
    sel: '#test-bar'
  }).res('findPassed', () => {
    test.toggle('passed');
  }).res('findFailed', () => {
    test.toggle('failed');
  }).res('Tests', () => {
    //$('#tests-container').removeClass('hidden');
    viewport.val('switch', 'tests');
  });

  let toggle = Views.class('UList').build({
    sel: '#tests-nav',
    data: {
      items: [{ 
        'title': 'Purely', 'comp': 'purely' 
      }, {
        'title': 'Views', 'comp': 'views'
      }]
    }
  }).res('comp', item => {
    viewport.val({ switch: item });
  });

  toggle.$el().css({
    'text-align': 'center',
    'cursor': 'pointer',
    'font-size': '30px'
  });
  toggle.$el('ul').css({
    'padding': '0'
  });

  toggle.$el('li').css({
    'display': 'inline-block',
    'margin': '15px 50px 0 0'
  });

  test.go = function(_fn) {
    if (typeof _fn == 'function') {

      let block = TestBlock.build({
        sel: viewport.sel('@tests'),
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

// Set Vbox
const Vbox = setVbox();

// Set Tests
const Test = setTest();


// Tests Page

// let toggle = UListView.build({
//   sel: '#tests-nav',
//   data: {
//     items: [{ 
//       'title': 'Purely', 'comp': 'purely' 
//     }, {
//       'title': 'Views', 'comp': 'views'
//     }]
//   }
// }).res('comp', item => {
//   console.log(item);
//   switch (item) {
//     case 'purely':
//     break;
//     case 'views':
//     break;

//   }
// });


// Tests

// Viewport
// @tests
// @purely
// @views
// -switch: string, desired section, could be 'tests' || 'purely' || 'views'

// Simplest test
Test.go(log => {
  log.title('Hello');
  log('Hello world');
  log.ok();
});

Test.go(log => {
  log.title('Paragraph');
  let purelyViews = Cope.views('Purely'),
      sel = log.sel(),
      paragraph;

  paragraph = purelyViews.class('Paragraph').build({
    sel: sel,
    data: {
      type: 'text',
      text: 'Hello World',
      media: ''
    }
  }).res('enter', () => {
    console.log('enter');
  }).res('down', () => {
    console.log('down');
  }).res('up', () => {
    console.log('up');
  });
})

Test.go(log => {
  log.title('RichTextarea');
  let purelyViews = Cope.views('Purely'),
      sel = log.sel(),
      richTextarea;

  richTextarea = purelyViews.class('RichTextarea').build({
    sel: sel
  });
});

Test.go(log => {
  log.title('Auto Tests of Purely Views');
  let purelyViews = Cope.views('Purely'),
      myViews = Cope.views(),
      sel = log.sel(),
      simulator;

  simulator = myViews.class('Simpulator');

  simulator.dom(vu => [
    { 'div@input.input': ''},
    { 'div@test-view.test-view(style="width:100%; justify-content:space-around;")': [
      { 'div@sim-view.sim-view.col-xs-8': ''},
      { '@textarea.textarea.col-xs-8(style="display:none; background:#eee;")': ''},
      { 'div@toggle-button.toggle-button.col-xs-4.hidden(style="cursor: pointer; color: #111")': 'toggle'}]
    }]
  );


  simulator.render(vu => {
    let viewClass;
    let input = purelyViews.class('Form').build({
      sel: vu.sel('@input'),
      data: {
        inputs: [{type: "text", label: "View", placeholder: "Input your view", comp: "input-view"}],
        values: []
      }
    }).res('values', vals => {
      viewClass = vals[0];
      if(purelyViews.getClass(viewClass) != null) {
        let view = purelyViews.class(viewClass).build({
          sel: vu.sel('@sim-view')
        });// end of view
        let textarea = purelyViews.class('Textarea').build({
          sel: vu.sel('@textarea'),
        }).res('value', data => {
          let jsonParse;
          textarea.$el().blur(() => {
            try {
              jsonParse = JSON.parse(textarea.val('value'));
              view.val(jsonParse);
            } catch(err) {
            }
          });
        });
        textarea.$el().css({
          'background': 'transparent'
        })
        vu.$el('@toggle-button').removeClass('hidden');
      }//end of if
    });
    vu.$el('@toggle-button').off('click').on('click',() => {
      vu.$el('@sim-view').toggle();
      vu.$el('@textarea').toggle();
    });
  });

  simulator.build({
    sel: sel
  });


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

// Test - vu#val(key, x => f(x))
Test.go(log => {
  log.title('vu#map(key, x => f(x), toRenderAgain)');
  
  let Test = Cope.views().class('Test');
  Test.dom(vu => [{ h3: '' }]);
  Test.render(vu => {
    //vu.$el().html(vu.get('value'));
    //vu('h3').html([{ 'div': vu.get('value') }]);
    vu('h3').html(vu.get('value'));
  });

  let test = Test.build({
    sel: log.sel(),
    data: { 'value': 0 }
  });

  let intervalId = setInterval(function() {
    test.map('value', value => value + 1, true);
    if (test.get('value') > 4) {
      log.ok();
      clearInterval(intervalId);
    }
  }, 1000);
});

// Test - Create an app and del it
Test.go(log => {
  log.title('Create an app and del it');

  log('Initiate app "some_doomed_app"');
  let newApp = Cope.app('some_doomed_app');
  newApp.init().then(() => {
    log('Initiated');
    log('Delete the app');
    newApp.del(true).then(() => {
      log('Deleted');
      log.ok();
    });
  });

  //let otherApp = Cope.app('has_not_been_init');
  //otherApp.set('try', 'access it');
});

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

  let app = Cope.app('testApp2');

  // Set viewport of Purely
  viewport.$el('@purely').css({
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
  // let nav = NavView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     signedIn: false,
  //     'user-items':[{title:"Account", href:"#"},{title:"Sign Out", comp:'signOut'}],
  //     '@logo': {
  //       logoText: mySet.logo.text,
  //     },
  //     navItems: mySet.navItems
  //   }
  // }).res('signIn', () => {
  //   nav.val({
  //     signedIn: true
  //   });
  // }).res('signOut', () => {
  //   nav.val({
  //     signedIn: false
  //   });
  // });

  // // Build some sections
  // let secCover = BoxView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       'background-color': mySet.colors.s1
  //     }  
  //   }
  // });

  // let secCol = BoxView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       'background-color': mySet.colors.s2
  //     }  
  //   }
  // });

  // let secAbout = BoxView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       'background-color': mySet.colors.h
  //     }  
  //   }
  // });

  // let secContact = BoxView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       'background-color': mySet.colors.p1
  //     }  
  //   }
  // });

  // let secFooter = BoxView.build({
  //   sel: viewport.sel('@purely'),
  //   method: 'append',
  //   data: {
  //     css: {
  //       width: '100%',
  //       height: '100%',
  //       'background-color': mySet.colors.p2
  //     }  
  //   }
  // });
// View

// >>>>>>>>>>>> build: sel: viewport.sel('@purely')
  //PurelyEditNavView.build({
  //  sel: viewport.sel('@purely')
  //}).res('save',values => {
  //  app.set('appName', values[0]).then(() => {
  //    console.log(':)');
  //  });
  //});
  
//   viewport.$el('@purely').prepend(`
//     <div class="row viewport">
//       <div class="hidden-xs" style="float:right; padding: 20px;">
//         <button class="btn btn-primary" data-component="mobileBtn">mobile</button>
//         <button class="btn btn-primary" data-component="windowBtn">window</button>
//       </div>
//       <div data-component="viewport" class="col-md-6 col-xs-12" style="clear:right;">
//       </div>
//       <div data-component="form" class="col-md-6 col-xs-12">
//         <div id="form-view"></div>
//         <div>Logo</div>
//         <div class="uploader">
//           <div class="glyphicon glyphicon-upload" style="font-size:2.5em;"></div>
//         </div>
//         <div id="imageuploader"></div>
//         <div>
//           <div class="glyphicon glyphicon-plus-sign" style="font-size:2em; margin:10px 17px;"></div>
//         </div>
//         <div id="form-list"></div>
//         <div id="save-btn" class="btn btn-primary">Save</div>
//       </div>
//     </div>`
//   );
// //toggle RWD
//   let mobileBtn = viewport.$el('@mobileBtn'),
//       windowBtn = viewport.$el('@windowBtn'),
//       form = viewport.$el('@form');
//       vp = viewport.$el('@viewport');
//   mobileBtn.off('click').on('click',() =>{
//     console.log('mobileBtn onclick!');
//     form.addClass('col-md-6');
//     vp.addClass('col-md-6');
//   });
//   windowBtn.off('click').on('click',() =>{
//     console.log('windowBtn onclick!');
//     form.removeClass('col-md-6');
//     vp.removeClass('col-md-6');
//   });
// //form
//   let inputs = [{type: "text", label: "App Name", value: 'uuu' },{type: "text", label: "Company Name",value: 'hello'}]; 
//   let formview = FormView.build({
//     sel: '#form-view',
//     method: 'append',
//     data:{
//       inputs: inputs
//     }
//   });

//   let formlist = UListView.build({
//     sel: '#form-list',
//     method: 'append',
//     data:{
//       items:[{title:'Product'},{title:'Blog'}]
//     }
//   });

//   console.log('app', app);

//   // app.get('appName').then(appName => {
//   //   console.log(appName);

//   //   //formview.val('@appName', appName);
//   //   inputs[0].value = appName;
//   //   formview.val('inputs', inputs);
//   // });

//   $('#save-btn').click(() => {
//     let values = formview.val('values');
//     console.log(values);

//     app.set('appName', values[0]).then(() => {
//       console.log(':)');
//     });
//   });
  

//plus

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
    log.ok();
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

// Test - Test with Cope dom language
Test.go(log => {
  log.title('Cope Dom Test');
  Vbox.append('dom-test');

  let testDom = [
    { 'div.color-blue(style="padding:20px;")': [
      { 'h3': 'Test Dom' },
      '<p>Wrapped in &lt;p&gt;</p>',
      [ 'p@text', '' ]] 
    },
    { 'ul': [
      { 'li': 'First li' },
      { 'li[c#aca;p0 40px;font-size:1.5em;]@text': '' },
      { 'li@blue': '' },
      { 'li': 'Last li' }] 
    },
    { 'div[fz 12px; p 20px;]': [
      { 'h4': 'The following shows the dom' },
      { 'pre': [
        { 'code@dom': '' }]
      }]
    }
  ];

  let TestView = Cope.views().class('Test');
  TestView.dom(vu => testDom);
  TestView.render(vu => {

    vu.$el('@text').html('This text will show up in all @text');
    vu.$el('@blue').css({ color: 'blue' }).append(' blued ');

    vu.$el('@dom').html(JSON.stringify(testDom, null, 2)
      .replace(/\n/g, '<br>')
      .replace(/\s/g, '&nbsp;'));

    log.ok();
  });
  TestView.build({ sel: '#dom-test' });
});

// Test - @assface: Tiles
Test.go(log => {
  log.title('@assface: Tiles')
  Vbox.append('tiles');
  
  let t1 = Views.class('Tiles').build({
    sel: '#tiles',
    data: {
      w: '200px',
      h: '200px',
      colored: true,
      cut: {
        'r': 'x70 x80 x83 y60',
        '0': 'x50 y50',
        '02': 'x40',
        '1': 'y40',
        '01': 'y40',
        '4': 'x24 x57 x76 y50',
        '3': 'y33'
      }
    }
  });

  let t2 = Views.class('Tiles').build({
    sel: '#tiles',
    method: 'append',
    data: {
      w: '300px',
      h: '200px',
      colored: true,
      cut: {
        'r': 'y70',
        '0': 'x33.3333 x66.6666'
      }
    }
  });

  t2.val('01').$el().css({
    'font-size': '20px',
    'color': '#fff'
  }).html('Box "01": Middle section with some texts');

  let t3 = Views.class('Tiles').build({
    sel: '#tiles',
    method: 'append',
    data: {
      w: '100%',
      h: '400px',
      colored: true,
      cut: {
        'r': 'x33.3333 x66.6666',
        '0': 'y50 y80',
        '1': 'y30 y70',
        '2': 'y40 y80'
      }
    }
  });

  // Put values inside all "xxx" tiles of t3
  ['00', '01', '02', '10', '11', '12', '20', '21', '22'].map(seq => {
    t3.val(seq).$el().html(`<span style="font-size:20px; color:#fff">${seq}</span>`);
  });

  // Style the above tiles
  let rcss = {
    'display': 'block',
    'position': 'relative',
    'margin': '20px auto'
  };
  t1.val('r').$el().css(rcss);
  t2.val('r').$el().css(rcss);
  t3.val('r').$el().css(rcss);

  log.ok();
});

Test.go(log => {
  log.title('@hydra: Views - Nav, Box, Textarea, ImageUploader');
  Vbox.append('nav');
  Vbox.append('box');
  Vbox.append('textarea');
  Vbox.append('imageUploader');
  Vbox.append('form');

  $('#textarea').css({ 'background': '#eee', padding: '8px' });

  //Nav
  let navA = Views.class('Nav').build({
    sel: '#nav',
    method: 'append',
    data: {
      logo: {
        "text":"Acahellodadadadas",
      },
      items: [{
        "type": "main",
        "text": "About",
      },{
        "text": "FAQ",
        "comp": "faq"
      },{
        "type": "main",
        "text": "OKOK",
        "comp": "okok"
      },{
        "type": "user",
        "text": "signOut",
        "comp": "signOut"
      },{
        "text": "hello",
        "comp": "hello"
      },{
        "type": "main",
        "text": "wello",
        "comp": "wello"
      },{
        "type": "user",
        "text": "aello",
        "comp": "aello"
      },{
        "type": "main",
        "text": "xello",
        "comp": "xello"
      },{
        "type": "user",
        "text": "user",
        "comp": "user"
      },{
        "type": "mooo",
        "text": "mooo",
        "comp": "mooo"
      }],
      "usingMembers": true
    }
  }).res('comp', comp => {
    console.log(comp);
  }).res('signIn', (B) => {
    navA.val({
      "usingMembers": true
    });
  }).res('signOut', () => {
    navA.val({
      "usingMembers": false
    });
  });
  

  //Box
  let boxA = Views.class('Box').build({
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

  let boxB = Views.class('Box').build({
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

  //Textarea
  let textarea = Views.class('Textarea').build({
    sel: '#textarea',
    method: 'append',
    data: {
      value: "Textarea\nwith\ndefault value"
    }
  }).res('value', value => {
    console.log(value);
  });

  let textarea2 = Views.class('Textarea').build({
    sel: '#textarea',
    method: 'append',
    data: {
      value: 'Textarea with custom css'
    }
  });

  textarea2.$el().css({
    'border': '1px solid #aaa',
    'font-size': '14px'
  });

  //ImageUploader 
  let ImageUploaderA = Views.class('ImageUploader').build({
    sel: '#imageUploader',
    method: 'append'
  }).res('value', val => {
    console.log(val);
  });

  //form
  let form = Views.class('Form').build({
    sel: '#form',
    method: 'append',
    data:{
      inputs:[{type: "text", label: "name", placeholder: "inputYourName", comp: "input-name"},
              {type: "text", label: "age", placeholder: "inputYourAge", comp: "input-age"},
              {type: "text", placeholder: "nothing", comp: "input-nothing"},
              {type: "text",}],
      values: []              
    }
  });

  let boxC = Views.class('Box').build({
    sel: '#form',
    method: 'append',
    data:{
      css: { 
        "width": "400px",
        "height": "200px",
        "display": "inline-flex",
        "border": "2px solid #aca"
      }
    }
  });
  boxC.$el().click(() => {
    let text = form.val('values').join('<br>');
    console.log('--text--',text);
    boxC.$el().html(text);
  });

  log.ok();
});

// Test - @Assface
Test.go(log =>{
  log.title('@Assface: Views - Select');
  log('Randomly select an option of Select to get the green light.');

  //$('#views').append(`<div id="view-select" style="margin-bottom: 200px"></div>`);

  Vbox.append('view-select');

  Views.class('Select').build({
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


  Views.class('Photo').build({
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

  Views.class('Grid').build({
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

  Views.class('Slide').build({
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
  
  Views.class('Slide').build({
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
});

// Test - Fake server
Test.go(log => {
  log.title('Fake server');

  let server = {};
  let data = {};
  data.greet = 'Hello world.'

  server.get = function(path) {
    if (typeof path == 'string') {
      return {
        then: function(cb) {
          if (typeof cb == 'function') {
            setTimeout(() => {
              cb(data[path]);
            }, 200);
          } else {
            console.warn('server.get: Lack of callback function');
          }
        }
      };
    } 
  };

  server.set = function(path, value) {
    let done;
    if (typeof path == 'string') {
      setTimeout(() => {
        data[path] = value;
        if (typeof done == 'function') {
          done();
        }
      }, 200);
    }
      
    return {
      then: function(cb) {
        done = cb;
      }
    };
  };

  let Panel = Cope.views().class('Panel');    
  Panel.dom(vu => [
    { 'div.col-xs-12.col-sm-6': [
      { 'div.col-xs-12': [
        [ 'h3', 'Test Panel for Fake Server' ]]
      },
      { 'div.col-xs-12': [
        [ 'input@key(type="text" placeholder=\'Enter any key, try "greet"\')', '' ]]
      },
      { 'div.col-xs-12': [
        { 'textarea@value': '' }]
      },
      { 'div.col-xs-12': [
        { 'button': 'Done' }]
      }]
    }
  ]);

  Panel.render(vu => {

    vu.use('key').then(v => {
      let key = vu.$el('@key').val().trim();
      server.get(key).then(val => {
        vu.$el('@value').val(val);
      });
    });

    vu.$el('button').off('click').on('click', () => {
      server.set(vu.$el('@key').val().trim(), vu.$el('@value').val().trim());
    });

    vu.$el('input').off('keyup').on('keyup', () => {
      vu.$el('@value').val('');
      server.get(vu.$el('@key').val().trim()).then(val => {
        vu.$el('@value').val(val);

        if (val) {
          log.ok();
        }
      })
    });
  });

  Panel.build({ 'sel': log.sel() });
});

// Test - Purely: App name, Logo and Nav
Test.go(log => {
  log.title('Purely.Edit.Nav');
  Vbox.append('PurelyEditNav');
  let MyPure = Views.class('Purely.Edit.Nav').build({
    sel: '#PurelyEditNav'
  }).res('save',obj => {
    console.log(obj);
  });
});

// Test - Purely: Single Block
Test.go(log => {
  log.title('Purely.Edit.Single');
  Vbox.append('SingleBlock');
  let SingleBlock = Views.class('Purely.Edit.Single').build({
    sel: '#SingleBlock'
  });
});

// Test - Cope.Modal
Test.go(log => {
  log.title('Cope.Modal');

  let btnClass = Cope.views().class('btn');
  btnClass.dom(vu => [{ 'button': vu.get('btnText') }]);
  btnClass.render(vu => {
    vu.$el('button').off('click').on('click', function() {
      Cope.modal(vu.get('viewName'), vu.val())
        .res('value', value => {
          log(value);
        })
        .res('upload', files => {
          console.log(files);
          files.map(x => {
            if (x.file.type.slice(0, 5) === 'image') {
              $(log.sel()).append('<img src=' + x.thumbImage + '>');
            }
          });
        })
    });
  });
  btnClass.build({ 
    sel: log.sel(), method:'append', 
    data: { 
      btnText: 'Text',
      viewName: 'text' 
    } 
  });
  btnClass.build({ 
    sel: log.sel(), method:'append', 
    data: { 
      btnText: 'Textarea',
      viewName: 'text', 
      type: 'textarea', 
      label: 'Textarea',
      placeholder: 'This is a resizable textarea.'
    } 
  });
  btnClass.build({ 
    sel: log.sel(), method:'append', 
    data: { 
      btnText: 'Uploader',
      viewName: 'file',
      maxWidth: 40
    } 
  });
  log.ok(); 
});

Test.go(log => {
  log.title('Purely - SortableList');
  Vbox.append('sortable-list');
  let sl = Views.class('SortableList').build({
    sel: '#sortable-list'
  });
  
  [50, 80, 100, 40, 20].map(h => {
    sl.val('new', {
      viewClass: Views.class('Box'),
      height: h,
      data: {
        css: {
          'height': '100%',
          'width': '100%',
          'background': `rgb(${h}, ${h}, ${h})`
        }
      }
    });
  });
});

// end Tests

})(jQuery, Cope);
