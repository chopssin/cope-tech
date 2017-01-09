(function($) {

const G = Cope.appGraph('testApp2'),
      test = Cope.Util.setTest('test-cope'),
      debug = Cope.Util.setDebug('test-cope', true),
      Views = Cope.useViews('test-cope'),
      Log = Views.class('Log');

Log.dom(vu => `<h4 ${vu.ID}></h4>`);
Log.render(vu => {
  let msg = vu.val('msg');
  if (msg) {
    vu.$el().html(msg);
  }
});

let logCount = 0;
const setLog = function() {
  logCount++;
  $('#test').append(`<div id="log-${logCount}" style="margin:30px 0; border:2px solid #999; padding: 16px"></div>`);
  return function(logCount) {
    let log = function(_msg, _level) {
      if (!isNaN(_level)) {
        let indents = '';
        for (let i = 0; i < _level; i++) {
          indents = indents + '&nbsp;&nbsp;&nbsp;&nbsp;';
        }
        _msg = indents + _msg;
      }
      if (_msg) {
        Log.build({
          sel: '#log-' + logCount,
          method: 'append'
        }).val('msg', _msg);
      }
      return '#log-' + logCount;
    };
    return log;
  }(logCount);
};

// Test - appGraph: node
test(pass => {
  let log = setLog();
  log('[AppGraph Nodes]');
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
      log('Passed');
    });
  });
}); // end of test

// Test - appGraph: edges formed by node.link
test(pass => {
  let log = setLog();

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
      log('Passed');
    });
  });
}); // end of test

// Test - AppGraph: edges
test(pass => {
  let log = setLog();
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
    log('Passed');
  }); // end of G.edges

}); // end of test

// Test - AppGraph.populate
test(pass => {
  let log = setLog();
  let G = Cope.appGraph('testApp2');

  G.populate([
    G.node('TestNodes', 'testA'),
    G.node('FakeShits', 'fake')
  ]).then(nodes => {
    log(`G.populate([testA, fake]).then <= nodes`);
    log('<br>');
    
    nodes.forEach(node => {
      debug(node.key, node.snap());
      log('[' + node.key + ']');
      log(JSON.stringify(node.snap(), null, 4)
          .replace(/\n/g, '<br>')
          .replace(/\s/g, '&nbsp;'));
      log('<br>');
    });
      
    log('Passed');
  });
});

// Test - Cope.useViews
test(pass => {
  
  let log = setLog();
  let Post = Views.class('Post');

  log('Test with a Post view with vu.use');
  log('Post');
  log('@title', 1);
  log('@content', 1);
  log('<br>');
  log('vu.use("title, @post.content")');
  log('<br>');

  log(`
  Post.render(vu => {<br>
    &nbsp;&nbsp;vu.use('title, @post.content').then(v => {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;vu.$el('@title').html(v.title);<br>
      &nbsp;&nbsp;&nbsp;&nbsp;vu.$el('@content').html(v["@post"].content);<br>
    &nbsp;&nbsp;});<br>
  });<br>
  `);
  
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
    sel: log(),
    method: 'append'
  }).val({
    comment: [{ by: 'clinet A', msg: 'Good.' }, { by: 'BBB', msg: 'Cool.'}]
  }).val({
    '@post': {
      content: 'Rendered @content with v["@post"].content.'
    }
  }).val('title', 'Rendered @title with v.title');

  log('<br>');
  log('Passed');
});

// Test - use jQuery
test(function(pass) {
  if ($) {
    let log = setLog();
    log('jQuery is defined.');
    log('<br>');
    log('Passed');
    pass('$ is defined');
  } else {
    this.debug('undefined jQuery or $');
  }
});

test(pass => {
  $('#test').append('<div id="views"></div>');
  $('#views').append();

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
});

})(jQuery)
