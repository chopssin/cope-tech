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
      Log.build({
        sel: '#log-' + logCount,
        method: 'append'
      }).val('msg', _msg);
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
  G.node('TestNodes', 'testA')
    .link('BetweenTests', G.node('TestNodes', 'testB'));

  log('testA ---TestNodes---> testB');
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

})(jQuery)
