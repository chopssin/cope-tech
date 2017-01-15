(function($, Cope) {
var debug = Cope.Util.setDebug('views.js', true),
    Editor = Cope.useEditor(),
    
    Views = Cope.useViews('Cope'), // global views
    ViewAppCard = Views.class('AppCard'),
    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    ViewAccountCard = Views.class('AccountCard'),

    priViews = Cope.useViews(), // private views
    ViewAddInput = priViews.class('AddInput');

// "AppCard"  
ViewAppCard.dom(function() {
  return '<div' + this.ID + ' class="cope-card wider touchable bg-w" style="margin-bottom:16px">'
    + '<h3 data-component="appName"></h3>'
    + '<p data-component="appId"></p>'
    + '<p data-component="role"></p>'
    + '<p data-component="stat"></p>'
    + '</div>';
});

ViewAppCard.render(function() {
  var that = this,
      name = this.val('appName'),
      id = this.val('appId'),
      isOwner = this.val('isOwner'),
      stat = this.val('stat') || 'Expired in 700 days (2018/12/12)';
  if (name) this.$el('@appName').html(name);
  if (id) this.$el('@appId').html(id);
  if (isOwner) {
    this.$el('@role').html('Owner');
  } else {
    this.$el('@role').html('Partner');
  }
  if (stat) this.$el('@stat').html(stat);

  that.$el().off('click').on('click', function() {
    that.res('touched', that.val());
  });
});  
// end of "AppCard"

// "AccountCard"
ViewAccountCard.dom(function() {
  return '<div' + this.ID + '>' 
    + '<h3 data-component="name">Cope User</h3>'
    + '<p data-component="mail"></p>'
    + '<button data-component="signout" class="cope-card as-btn bg-blue color-w">Sign out</button>'
    + '</div>';
});

ViewAccountCard.render(function() {
  var $signout = this.$el('@signout'),
      mail = this.val('mail'),
      that = this;

  if (mail) this.$el('@mail').html(mail);

  $signout.off('click').on('click', function() {
    debug('Sign out');
    that.res('signout');
  });
});
// end of "AccountCard"

// "AppPage"
ViewAppPage.dom(function() {
  return '<div' + this.ID + 'class="row">' 
    + '<div class="col-xs-12" style="height:700px; overflow:hidden">'
      + '<div class="svg-wrap" data-component="svg">0</div>'
      + '<div data-component="card" class="cope-card touchable wrap bg-w" style="text-align:left"><ul>'
        + '<li data-component="display-li">' 
          + '<div class="title">App Name</div>'
          + '<div data-component="appName"></div>'
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">App Id</div>'
          + '<div data-component="appId"></div>'
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">URL</div>'
          + '<div data-component="url"></div>'
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">Owner</div>'
          + '<div data-component="owner"></div>'
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">Partners</div>'
          + '<div data-component="partners"></div>'
          + '<a data-component="add-partner">Add partner</a>'
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">Expired at</div>'
          + '<div data-component="expired-at"></div>'
        + '</li>'
      + '</ul></div>'
      + '<div class="cope-card bg-w node-data" ></div>'
    + '</div>'
  + '</div>';
}); // end of ViewAppPage.dom

ViewAppPage.render(function() {
  let appName = this.val('appName'), // string
      appId = this.val('appId'), // string
      url = this.val('url'), // string
      owner = this.val('owner'), // string
      partners = this.val('partners'), // string array
      expiredAt = this.val('expiredAt'); // timestamp

  this.$el('@appName').html(appName);
  this.$el('@appId').html(appId);
  if (owner) {
    this.$el('@owner').html(owner);
  } 
  if (partners) {
    // TBD: partners
    //this.$el('@partners').html('Me');
  }

  if (url) {
    this.$el('@url').html(url);
  } else {
    this.$el('@url').html('cope.tech/' + appId);
  }

  // val.owner
  // val.partners
  // val.expiredAt
}); // end of ViewAppPage.render

ViewAppPage.render(function() { // draw the graph
  var graph = this.val('graph'),
      $card = this.$el('@card'),
      $li = this.$el('@display-li'),
      $addPartner = this.$el('@add-partner'),
      $svgWrap = this.$el('@svg'),
      w = $svgWrap.width(),
      that = this;

  if (!graph) return;
  
  // Build the graph view  
  Views.class('DataGraph').build({
    sel: this.sel('@svg'),
    data: {
      width: w,
      height: 600,
      graph: graph
    }
  }).res('node-data', function(_d) {
    debug(_d);  
    that.$el('.node-data').html(`name:${_d.id}`);
  });

  $card.css('z-index', 1);
  $svgWrap.css('z-index', 0);

  // To switch between the graph view and app card
  $card.off('click').on('click', function() {
    $card.find('li').removeClass('hidden');
    $li.removeClass('hidden');
    //$card
    //  .addClass('wider');
      //.toggleClass('wrap', false, 1000, "easeOutSine");
  });
  $svgWrap.off('click').on('click', function() {
    $card.find('li').addClass('hidden');
    $li.removeClass('hidden');
    //$card
    //  .removeClass('wider');
  });

  // Set "add partner" link
  $addPartner.off('click').on('click', function() {
    Editor.openModal(function(_sel) { 
      ViewAddInput.build({
        sel: _sel,
        data: { placeholder: 'Email' }
      }).res('value', function(_val) {
        that.res('add-partner', _val);  
      });
    }); // end of Editor.openModal
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

})(jQuery, Cope, undefined)
