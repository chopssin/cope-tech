(function($) {

//show & hide
function Show(){  
  $('#toggle')
    .append(`<a id="toggle-purely">Purely</a>`)
    .append(`<a id="toggle-test">Test</a>`)
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
      $('#purely, #test, #views').addClass('hidden');
      switch ($(this).prop('id')) {
        case 'toggle-purely':
          $('#purely').removeClass('hidden');
          break;
        case 'toggle-test':
          $('#test').removeClass('hidden');
          break;
        case 'toggle-views':
          $('#views').removeClass('hidden');
          break;

      }
      
    });
}

Show();


//------------------

const G = Cope.appGraph('testApp2'),
      test = Cope.Util.setTest('test-cope'),
      debug = Cope.Util.setDebug('test-cope', true),
      Views = Cope.useViews('test-cope'),
      TestBlock = Views.class('TestBlock');

TestBlock.dom(vu => `
    <div ${vu.ID} style="margin:30px 0; border:2px solid #999; padding: 16px">
      <div data-component="status">
        <img data-component="light" src="img/red.jpg" width="20" height="20">
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

  vu.use('logs').then(v => {
      vu.$el('@logs').html(v.logs);
  });
});

// Test - appGraph: node
test(pass => {
  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });
  let $log = block.$el('@log');

  //let log = setLog();

  $log.append('[AppGraph Nodes]');
  $log.append('<br>');
  $log.append(`G = Cope.appGraph('testApp2')`);
  $log.append('<br>');
  $log.append(`dreamer = G.node('Dreamers', 'Jeff')`);
  let dreamer = G.node('Dreamers', 'Jeff');
  if (!dreamer || !dreamer.col || !dreamer.key) {
    debug('dreamer does not have properties "col" or "key"', dreamer);
  }

  $log.append(`dreamer.val('age', 20)`);
  $log.append(`dreamer.val({ 'name': 'Jeff' })`);
  dreamer.val('age', 20);
  dreamer.val({ 'name': 'Jeff' });

  $log.append('Test dreamer.val() <= data');
  dreamer.val().then(data => {
    $log.append('<br>');
    $log.append(`data.name = ${data.name}`, 1);
    $log.append(`dreamer.snap('age') = ${dreamer.snap('age')}`, 1);
    $log.append('<br>');
    $log.append('Deleting dreamer by calling dreamer.del(true)', 1);
    dreamer.del(true).then(() => {
      $log.append('<br>');
      $log.append('dreamer was deleted', 2);
      $log.append('<br>');
      block.val({ light: 'green' });
    });
  });
}); // end of test

// Test - appGraph: edges formed by node.link
test(pass => {
  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });
  let $log = block.$el('@log');

  //let log = setLog();

  $log.append('[AppGraph Edges]');
  $log.append('<br>');
  $log.append(`G = Cope.appGraph('testApp2')`);
  $log.append('<br>');
  $log.append(`let dreamer = G.node('Dreamers', 'Chops')<br><br>
  let Dreams = G.col('Dreams')<br>
  let daydream = Dreams.node('daydream')<br>
  let nightmare = Dreams.node('nightmare')<br><br>`);

  let Chops = G.node('Dreamers', 'Chops');
  let Dreams = G.col('Dreams');
  let daydream = Dreams.node('daydream');
  let nightmare = Dreams.node('nightmare');

  $log.append(`Chops.link('hasA', daydream)<br>
  Chops.link('hasA', nightmare)`);

  Chops.link('hasA', daydream);
  Chops.link('hasA', nightmare).then(() => {
    $log.append('Created two dreams', 1);
    $log.append(`Chops.unlink('hasA', daydream)<br>
    Chops.unlink('hasA', nightmare)`);

    Chops.unlink('hasA', daydream);
    Chops.unlink('hasA', nightmare).then(() => {
      $log.append('Deleted all dreams', 1);
      $log.append('<br>');
      block.val({ light: 'green' }); 
    });
  });
}); // end of test

// Test - AppGraph: edges
test(pass => {
  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });
  let $log = block.$el('@log'); 

  //let log = setLog();
  let G = Cope.appGraph('testApp2');
  
  // Create an edge
  let testA = G.node('TestNodes', 'testA');
  testA.val('name', 'testA');
  testA.link('BetweenTests', G.node('TestNodes', 'testB'));

  $log.append('testA ---TestNodes---> testB');
  $log.append('<br>');
  $log.append(`G.edges('BetweenTests')
    .has(G.node('TestNodes', 'testA'))
    .then <= results`);

  G.edges('BetweenTests')
    .of(G.node('TestNodes', 'testA'))
    .then(results => {
    debug('TestNodes - res', results);
    $log.append(JSON.stringify(results, null, 4).replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;'));
    $log.append('<br>');
    block.val({ light: 'green' });
  }); // end of G.edges

}); // end of test

// Test - AppGraph.populate
test(pass => {

  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });
  let $log = block.$el('@log');
  block.val({ light: 'green' });
  $log.append(`G.populate([testA, fake]).then <= nodes<br>
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
    
    $log.append(`G.populate([testA, fake]).then <= nodes`);
    $log.append(`<br>`);

    nodes.forEach(node => {
      debug(node.key, node.snap());
      //log('[' + node.key + ']');
      // log(JSON.stringify(node.snap(), null, 4)
      //     .replace(/\n/g, '<br>')
      //     .replace(/\s/g, '&nbsp;'));
      // log('<br>');

      $log.append('[',node.key,']');
      $log.append(JSON.stringify(node.snap(), null, 4)
          .replace(/\n/g, '<br>')
          .replace(/\s/g, '&nbsp;'));
      $log.append('<br>');
    });
  });
});

// Test - Cope.useViews
test(pass => {

  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });
  let $log = block.$el('@log');
  block.val({ light: 'green' });
  $log.append(`Test with a Post view with vu.use<br>
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
test(function(pass) {
  let block = TestBlock.build({
    sel: '#test',
    method: 'append'
  });

  let $log = block.$el('@log');
  block.val({ light: 'green' });

  if ($) {
    $log.append(`jQuery is defined<br>
            $ is defined.`);

  } else {
    this.debug('undefined jQuery or $');
  }
});

// Test - @hydra
test(pass => {
  //$('#views').append('');

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

// Test - @PJ
test(pass => {
  $('#views').append('<div id="photo"></div>');
  $('#views').append('<div id="gallery"></div>');

  let PhotoPost = PhotoView.build({
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

  let GalleryPost = GalleryView.build({
    sel: '#gallery',
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
  })
});

// Test - Purely
test(pass => {

});

})(jQuery)
