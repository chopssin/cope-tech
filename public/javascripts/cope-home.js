(function($) {

var G = Cope.useGraphDB(),
    Views = Cope.useViews(),
    Util = Cope.Util,
    dataSnap = Cope.dataSnap,
    fetchDS = dataSnap(),
    renderDS = dataSnap(),
    ViewAppCard = Views.class('AppCard'),
    ViewAppPage = Views.class('AppPage'),
    ViewDataGraph = Views.class('DataGraph'),
    debug = Util.setDebug('cope-home', true),
    nav;

// Navigation
function nav(_sec) {
  switch(_sec) {
    case 'home':
      $('#dashboard').removeClass('hidden');
      $('#dashboard-app').addClass('hidden');
      break;
    case 'app':
      $('#dashboard').addClass('hidden');
      $('#dashboard-app').removeClass('hidden');
      break;
  }
};
$('#logo').click(function() {
  nav('home');
});

// Stage of fetching data
fetchDS.load(function() {
  G.listMyApps().then(function(_res) {
    var count = 0, myOwnApps = [];
    _res.own_apps.forEach(function(_appId) {
      G.getApp(_appId).then(function(_appG) {
        count++;
        // Push the fetched app info into the array
        myOwnApps.push({
          appName: _appG.appName(),
          appId: _appG.appId
        });
        if (count == _res.own_apps.length) {
          debug(myOwnApps);
          // Update renderDS's data with "myOwnApps"
          renderDS.update({ 'myOwnApps': myOwnApps });
          renderDS.load();
        }
      });
    });
  });
}); 

// Stage of rendering views
renderDS.load(function() {
  var myOwnApps = this.val().myOwnApps;
  $('#my-apps').html('');
  
  myOwnApps.forEach(function(_a) {
    var vuCard = ViewAppCard.build({
      sel: '#my-apps',
      method: 'append',
      data: {
        role: 'Owner',
        appId: _a.appId,
        appName: _a.appName
      }
    }).res('touched', function(_data) {
      // App being selected
      // Navigate to app section
      nav('app');

      // Get the initial graph
      d3.json('d3-sample.json', function(err, graph) {
        if (err) throw err;

        // Build app section
        ViewAppPage.build({
          sel: '#app-page',
          data: { 
            appCard: vuCard,
            graph: graph
          }
        }).res('selected', function(node) {
          // TBD: Node being selected
          // Show node's value
          debug('selected node', node);
        });
      }); // end of getting initial graph
    }); // end of AppCard
  }); // end of myOwnApps.forEach
}); // end of renderDS.load

// All start from here
fetchDS.load();

// Create Views

// "AppCard"  
ViewAppCard.dom(function() {
  return '<div' + this._ID + ' class="cope-card touchable bg-w" style="margin-bottom:16px">'
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
      role = this.val('role'),
      stat = this.val('stat') || 'Expired in 700 days (2018/12/12)';
  if (name) this.$el('@appName').html(name);
  if (id) this.$el('@appId').html(id);
  if (role) this.$el('@role').html(role);
  if (stat) this.$el('@stat').html(stat);

  that.$el().off('click').on('click', function() {
    that.res('touched', that.val());
  });
});  
// end of "AppCard"

// "AppPage"
ViewAppPage.dom(function() {
  return '<div' + this._ID + 'class="row">' 
    + '<div class="col-xs-12" style="height:700px; overflow:hidden">'
      + '<div class="svg-wrap" data-component="svg"></div>'
      + '<div data-component="card" class="cope-btn bg-w touchable" style="text-align:left"><ul>'
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
        + '</li>'
        + '<li class="hidden">' 
          + '<div class="title">Expired at</div>'
          + '<div data-component="expired-at"></div>'
        + '</li>'
      + '</ul></div>'
    + '</div>'
    //+ '<div class="col-xs-12"><svg width="960" height="600"></svg></div>'
  + '</div>';
}); // end of ViewAppPage.dom

ViewAppPage.render(function() {
  var appCard = this.val('appCard'),
      val = appCard.val(),
      appName, appId, url, role, expiredAt;
  if (!val) return;

  console.log(val);
  appName = val.appName || '';
  appId = val.appId || '';
  role = val.role;

  this.$el('@appName').html(appName);
  this.$el('@appId').html(appId);
  if (role == 'Owner') this.$el('@owner').html('Me');
  if (role == 'Partner') this.$el('@partners').html('Me');
  if (url) {
    this.$el('@url').html(val.url);
  } else {
    this.$el('@url').html('cope.tech/' + appId);
  }

  // val.owner
  // val.partners
  // val.expiredAt
}); // end of ViewAppPage.render

ViewAppPage.render(function() { // draw the graph
  var appCard = this.val('appCard'),
      graph = this.val('graph');
      $card = this.$el('@card'),
      $li = this.$el('@display-li'),
      $svgWrap = this.$el('@svg'),
      w = $svgWrap.width(),


  Views.class('DataGraph').build({
    sel: this.sel('@svg'),
    data: {
      width: w,
      height: 600,
      graph: graph
    }
  });

  $card.css('z-index', 1);
  $svgWrap.css('z-index', 0);

  $card.off('click').on('click', function() {
    $card.find('li').removeClass('hidden');
    $li.removeClass('hidden');
    $card
      .removeClass('cope-btn')
      .toggleClass('cope-card', true, 1000, "easeOutSine");
  });
  $svgWrap.off('click').on('click', function() {
    $card.find('li').addClass('hidden');
    $li.removeClass('hidden');
    $card
      .removeClass('cope-card')
      .toggleClass('cope-btn', true, 1000, "easeOutSine");
  });

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
  return '<svg' + this._ID + 'id="svg" width="'+ w +'" height="' + h + '"></svg>';
});

ViewDataGraph.render(function() {
  var graph = this.val('graph');

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

})(jQuery);
