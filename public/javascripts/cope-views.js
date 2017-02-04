(function($, Cope) {
var debug = Cope.Util.setDebug('cope-views', false),
    //Editor = Cope.useEditor(),
    PurelyViews = Cope.views('Purely'), // use Purely views
    
    Views = Cope.views('Cope'), // global views
    ViewAppCard = Views.class('AppCard'),
    PurelyAppView = Views.class('PurelyApp'),
    PurelySecView = Views.class('PurelySec'),
    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),
    ToggleView = Views.class('Toggle');

    priViews = Cope.useViews(), // private views
    ViewAddInput = priViews.class('AddInput');

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
  //return '<div' + this.ID + '>' 
  //  + '<h3 data-component="name">Cope User</h3>'
  //  + '<p data-component="email"></p>'
  //  + '<button data-component="signout" class="cope-card as-btn bg-blue color-w">Sign out</button>'
  //  + '</div>';
//});

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

// "Purely"
PurelySecView.dom(vu => [
  { 'div.cope-card.full.bg-w.touchable(style="margin-bottom:16px; padding:0;")': vu.val('sec') || 'Section' }
]);

PurelySecView.render(vu => {
  vu.use('height').then(v => {
    vu.$el().css('height', v.height);
  });
});

PurelyAppView.dom(vu => [
  { 'div.row': [
    { 'div.col-xs-12.col-sm-7(style="margin-bottom:40px")': [
      { 'div.row': [
        { 'div@nav.col-xs-12(style="padding:0")': 'Nav' }] 
      },
      { 'div.row': [
        { 'div@page.col-xs-12(style="padding:0")': '' }]
      }]
    },
    { 'div@panel.col-xs-12.col-sm-5': 'Panel' }] 
  }
]);

PurelyAppView.render(vu => {

  let SAMPLE_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec est sed turpis tincidunt mollis. Duis nec justo tortor. Aliquam dictum dignissim molestie. Fusce maximus sit amet felis auctor pellentesque. <br><br>Sed dapibus nibh id rutrum elementum. Aliquam semper, ipsum in ultricies finibus, diam libero hendrerit felis, nec pharetra mi tellus at leo. Duis ultricies ultricies risus, sed convallis ex molestie at. Nulla facilisi. Ut sodales venenatis massa, nec venenatis quam semper eget.';
 
  // Navigation
  let navSec = PurelySecView.build({
    sel: vu.$el('@nav')
  });

  PurelyViews.class('Nav').build({
    sel: navSec.sel(),
    data: {
      logo: {
        text: 'Logo'
      }
    }
  });

  // Sections
  let coverSec = PurelySecView.build({
    sel: vu.$el('@page'),
    method: 'append'
  }).val({ height: '400px' });

  let aboutSec = PurelySecView.build({
    sel: vu.$el('@page'),
    method: 'append'
  }).val({ height: '400px' });

  let aboutSec2 = PurelySecView.build({
    sel: vu.$el('@page'),
    method: 'append'
  }).val({ height: '400px' });

  let contactSec = PurelySecView.build({
    sel: vu.$el('@page'),
    method: 'append'
  }).val({ height: '400px' });
  contactSec.$el().css('background', '#111111');

  let footerSec = PurelySecView.build({
    sel: vu.$el('@page'),
    method: 'append'
  });
  footerSec.$el().css({
    'background': '#111111',
    'padding': '20px'
  }).html('<div style="color:#222; width:100%; text-align:right;">Powered by Cope</div>');
  
  // Cover
  let coverSlide = PurelyViews.class('Slide').build({
    sel: coverSec.sel(),
    data: {
      data: [{
        src: '/images/sample1.jpg',
        link: '#',
        caption: 'We share gifts'
      }, {
        src: '/images/sample2.jpg',
        link: '#',
        caption: 'And happiness'
      }],
      container: {
        width: '100%',
        height: '100%'
      },
      showArrow: false,
      captionFontCSS: {
        'color': '#fff',
        'text-align': 'left'
      },
      mode: 'center'
    }
  });

  // About
  let aboutTiles = PurelyViews.class('Tiles').build({
    sel: aboutSec.sel(),
    data: {
      w: '100%',
      h: '400px',
      cut: {
        r: 'x60'
      }
    }
  });
  
  aboutTiles.val('r').$el().addClass('bg')
    .css({ 'background-image': 'url("/images/sample3.jpg")' })
  aboutTiles.val('0').$el().css({ 'background': 'transparent' });
  aboutTiles.val('1').$el().css({ 
    'color': '#fff',
    'background': 'rgba(0, 0, 0, 0.8)',
    'padding': '12px'
  }).html('<h3>Our Brand Story</h3><p style="font-size:16px">' + SAMPLE_TEXT + '</p>');

  let aboutTiles2 = PurelyViews.class('Tiles').build({
    sel: aboutSec2.sel(),
    data: {
      w: '100%',
      h: '400px',
      cut: {
        r: 'x40'
      }
    }
  });
  
  aboutTiles2.val('r').$el().addClass('bg')
    .css({ 'background-image': 'url("/images/sample1.jpg")' })
  aboutTiles2.val('1').$el().css({ 'background': 'transparent' });
  aboutTiles2.val('0').$el().css({ 
    'color': '#fff',
    'background': 'rgba(0, 0, 0, 0.8)',
    'padding': '8px'
  }).html('<h3>Our Brand Story</h3><p style="font-size:16px">' + SAMPLE_TEXT + '</p>');

  // Contact
  let contactBox = PurelyViews.class('Box').build({
    sel: contactSec.sel()
  });

  contactBox.$el().css({
    'width': '80%',
    'max-width': '540px',
    'padding': '70px',
    'position': 'relative',
    'margin': '0 auto',
    'text-align': 'center',
    'font-size': '20px',
    'color': '#222',
    'background': '#000',
    'top': '30%'
  }).html('Contact us');

});

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
  <div ${vu.ID} class="container" style="margin-bottom:100px">
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
    + `<div data-component="sec-app" class="row hidden">
      <div data-component="app" class="col-xs-12"></div>
      <div data-component="app-purely" class="col-xs-12"></div>
    </div>
  </div> 
`);

ToggleView.render(vu => {
  switch (vu.get('sec')) {
    case 'app':
      vu.$el('@sec-dashboard').addClass('hidden');
      vu.$el('@sec-app').removeClass('hidden');
      break;
    case 'home':
    default:
      vu.$el('@sec-app').addClass('hidden');
      vu.$el('@sec-dashboard').removeClass('hidden');
      break;
  } 
});

})(jQuery, Cope, undefined)
