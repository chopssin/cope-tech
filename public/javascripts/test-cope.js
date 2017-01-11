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
      test = {};

  let testBar = TestBar.build({
    sel: '#app-graph-status'
  });

  test.go = function(_fn) {
    if (typeof _fn == 'function') {
      let block = TestBlock.build({
        sel: '#app-graph',
        method: 'append'
      });

      let log = function(_str) {
        if (typeof _str == 'string') {
          block.$el('@log').append(_str + '<br>');
        }
        return block.sel('@log');
      };

      log.ok = function() {
        block.val({ light: 'green' });
        okCount++;
        testBar.val('passed', okCount);
      };

      log.sel = function() {
        return block.sel('@log');
      };

      log.title = function(_title) {
        block.val('title', _title);
      };
    
      testCount++;
      testBar.val({ total: testCount });

      // Run test function
      _fn(log);
    }
  }; // end of test.go

  return test;
}; // end of setTest

// Vbox 
const setVbox = function() {
  let vbox = {};

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
  <div ${vu.ID}>
    <div style="color:green;font-size:18px;font-weight:bold">
      <img src="img/green.jpg" width="25" height="25">
      <span data-component="passed"></span>
    </div>
    <br>
    <div style="color:green;font-size:18px;font-weight:bold">
      <img src="img/red.jpg" width="25" height="25">
      <span data-component="failed">${ vu.val('total') }</span>
    </div>
  </div>
`);

TestBar.render(vu => {
  vu.$el('@passed').html(vu.val('passed'));
  vu.$el('@failed').html(vu.val('total') - vu.val('passed'));
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
  switch (vu.val('light')) {
    case 'green':
      vu.$el('@light').prop('src', 'img/green.jpg');
      break;
    default:
      vu.$el('@light').prop('src', 'img/red.jpg');
      break;
  }

  vu.use('title').then(v => {
    vu.$el('@title').text(v.title);
  });
});

//show & hide
function Show(){  
  $('#toggle')
    .append(`<a id="toggle-purely">Purely</a>`)
    .append(`<a id="toggle-app-graph">Tests</a>`)
    .append(`<a id="toggle-views">Views</a>`)
    .css({
      'display': 'block',
      'positoin': 'relative',
      'margin': '50px auto',
      'text-align': 'center',
      'font-size': '24px',
      'font-weight': 'bold'
    });


  $('#toggle a')
    .css({
      padding: '16px'
    })
    .click(function() {
      $('#purely, #app-graph, #views').addClass('hidden');
      switch ($(this).prop('id')) {
        case 'toggle-purely':
          $('#purely').removeClass('hidden');
          break;
        case 'toggle-app-graph':
          $('#app-graph').removeClass('hidden');
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

  log('<br>');
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

// Test - @PJ
Test.go(log => {
  log.title('@PJ');
  Vbox.append('photo');
  Vbox.append('grid');

  // $('#views').append('<div id="photo"></div>');
  // $('#views').append('<div id="grid"></div>');

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

  log.ok();
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
    }
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
    }
  });

  // Randomly choose a settings
  let mySet = settings[Math.floor(Math.random() * settings.length)];
  // TBD: use Cope.App.usePage

  // Build Navbar
  NavView.build({
    sel: '#purely',
    data: {
      '@logo': {
        logoText: mySet.logo.text,
      }
    }
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

  log.ok();
});

// Test - appGraph: edges formed by node.link
Test.go(log => {
  let block = TestBlock.build({
    sel: '#app-graph',
    method: 'append'
  });
  let $log = block.$el('@log');

  //let log = setLog();

  log('[AppGraph Edges]');
  log('<br>');
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
      block.val({ light: 'green' }); 
      log.ok();
    });
  });
}); // end of test

// Test - AppGraph: edges
Test.go(log => {
  let block = TestBlock.build({
    sel: '#app-graph',
    method: 'append'
  });
  let $log = block.$el('@log'); 

  //let log = setLog();
  let G = Cope.appGraph('testApp2');
  
  // Create an edge
  let testA = G.node('TestNodes', 'testA');
  testA.val('name', 'testA');
  testA.link('BetweenTests', G.node('TestNodes', 'testB'));

  log('testA ---TestNodes---> testB');
  log('<br>');
  log(`G.edges('BetweenTests')
    .has(G.node('TestNodes', 'testA'))
    .then <= results`);

  G.edges('BetweenTests')
    .of(G.node('TestNodes', 'testA'))
    .then(results => {
    debug('TestNodes - res', results);
    log(JSON.stringify(results, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;'));
    log('<br>');
    block.val({ light: 'green' });
    log.ok();
  }); // end of G.edges

}); // end of test

// Test - AppGraph.populate
Test.go(log => {

  let block = TestBlock.build({
    sel: '#app-graph',
    method: 'append'
  });
  let $log = block.$el('@log');
  block.val({ light: 'green' });
  log.ok();
  log(`G.populate([testA, fake]).then <= nodes<br>
              <br>
              [testA]<br>
              {<br>
              &nbsp;&nbsp;"name": "testA"<br>
              }<br>
              <br>
              <br>
              [fake]<br>
              {}<br>
              <br>`);


  //let log = setLog();
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

      log('[',node.key,']');
      log(JSON.stringify(node.snap(), null, 4)
          .replace(/\n/g, '<br>')
          .replace(/\s/g, '&nbsp;'));
      log('<br>');
    });
  });
});

// Test - Cope.useViews
Test.go(log => {

  let block = TestBlock.build({
    sel: '#app-graph',
    method: 'append'
  });
  let $log = block.$el('@log');
  block.val({ light: 'green' });
  log.ok();
  log(`Test with a Post view with vu.use<br>
          Post<br>
          @tittle<br>
          @content<br>
          <br>
          vu.use("title, @post.content")<br>
          <br>
          <br>
          Post.render(vu => {<br>
          &nbsp;vu.use('title, @post.content').then(v => {<br>
          &nbsp;&nbsp;vu.$el('@title').html(v.title);<br>
          &nbsp;&nbsp;vu.$el('@content').html(v["@post"].content);<br>
          &nbsp;});<br>
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
    sel: block.sel('@log'),
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
});

// Test - use jQuery
Test.go(log => {
  log.title('use jQuery');

  if ($) {
    log.ok();
    log(`jQuery is defined`);

  } else {
    this.debug('undefined jQuery or $');
  }
});

// Test - @hydra
Test.go(log => {
  log.title('@hydra');
  Vbox.append('nav');
  Vbox.append('box');
  Vbox.append('textArea');
  Vbox.append('imageUpLoader');
  // $('#views').append('<div id="nav"></div>');
  // $('#views').append('<div style="margin: 40px 0; border-bottom: 2px solid #333; border-top: 2px solid #333; padding: 40px 0;"id="box"></div>');
  // $('#views').append('<div id="textArea"></div>');
  // $('#views').append('<div id="imageUpLoader"></div>');

  //Nav
  NavView.build({
    sel: '#nav',
    method: 'append'
  });

  NavView.build({
    sel: '#nav',
    method: 'append'
  }).val({
    signedIn: true,
    list: [{title:"HOME",href:"#"},{title:"About",href:"#"},{title:"FAQ",href:"#"}], // { title, href }
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

  //Box
  let BoxA = BoxView.build({
    sel: '#box',
    method: 'append'
  });

  BoxA.val({
    css:{
      "width": "100px",
      "height": "100px",
      "top": "20px",
      "left": "20px", 
      "border": "6px solid #333",
      "padding": "10px 6px",
    }
  });

  let BoxB = BoxView.build({
    sel: BoxA.sel(),
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

  //ImageUpLoader 

  let ImageUpLoader = ImageUpLoaderView.build({
    sel: '#imageUpLoader',
    method: 'append'
  }).res('value', val => {
    console.log(val);
  });

  log.ok();
});

// Test - @Assface
Test.go(log =>{
  log.title('@Assface');

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
  })
});

})(jQuery)
