(function($) {

var G = Cope.graphDB(),
    Views = Cope.views(),
    dataSnap = Cope.dataSnap,
    util = Cope.util,
    fetchDS = dataSnap(),
    renderDS = dataSnap(),
    ViewAppCard = Views.class('AppCard'),
    ViewAppPage = Views.class('AppPage'),
    nav,
    debug = util.setDebug('cope-home', true);

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

renderDS.load(function() {
  var myOwnApps = this.val().myOwnApps;
  $('#my-apps').html('');
  
  myOwnApps.forEach(function(_a) {
    ViewAppCard.build({
      sel: '#my-apps',
      method: 'append',
      data: {
        role: 'Owner',
        appId: _a.appId,
        appName: _a.appName
      }
    }).res('touched', function(_data) {
      nav('app');
      ViewAppPage.build({
        sel: '#app-page',
        data: { appCard: this }
      });
    }); // AppCard
  });
});

fetchDS.load();

// Views
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

ViewAppPage.dom(function() {
  return '<div' + this._ID + 'class="row">' 
    + '<div class="col-xs-12">' 
      + '<h3 data-component="appName"></h3>'
    + '</div>'
    + '<div class="col-xs-12"><div class="cope-card bg-w"><ul>'
      + '<li>' 
        + '<div class="title">App Id</div>'
        + '<div data-component="appId"></div>'
      + '</li>'
      + '<li>' 
        + '<div class="title">URL</div>'
        + '<div data-component="url"></div>'
      + '</li>'
      + '<li>' 
        + '<div class="title">Owner</div>'
        + '<div data-component="owner"></div>'
      + '</li>'
      + '<li>' 
        + '<div class="title">Partners</div>'
        + '<div data-component="partners"></div>'
      + '</li>'
      + '<li>' 
        + '<div class="title">Expired at</div>'
        + '<div data-component="expired-at"></div>'
      + '</li>'
    + '</ul></div></div>'
  + '</div>';
});
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
});

})(jQuery);
