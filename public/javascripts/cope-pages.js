(function() {

let debug = Cope.Util.setDebug('cope-pages', true);

let Apps = Cope.Apps;

let Pages = Cope.pages('Cope'),
    PurelyViews = Cope.views('Purely'),
    Purely = Cope.views('Purely'), // to be deprecated
    CopeViews = Cope.views('Cope');

let sampleText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

let sampleSections = [{
  type: 'collection',
  title: 'Shape the world',
  content: 'Together we change the industry landscape',
  style: 'sec-full/sec-dark/sec-op-6/text-bold-title/comp-full/comp-slide',
  colName: 'Shirts',
  tags: ['men', 'kid'],
  sort: 'featured',
  max: 6,
  data: [
    { 'title': 'Simply', 'imgsrc': '/images/sample1.jpg' },
    { 'title': 'Purely', 'imgsrc': '/images/sample2.jpg' }
  ]
}, {
  type: 'basic',
  title: 'Title',
  content: sampleText,
  media: {
    imgsrc: '/images/sample4.jpeg'
  },
  style: 'sec-dark/sec-op-2/text-right'
}, {
  type: 'contacts',
  title: 'Opening',
  content: 'Weekdays | 09:00 - 17:00',
  style: 'sec-dark/sec-op-6/comp-full'
}];


Pages.use('/', params => {

  let user = {},
      ds = Cope.dataSnap(), // core dataSnap
      copeApp,
      copeNav;
      
  // Build Cope App
  copeApp = CopeViews.class('Cope.App').build({
    sel: '#page'
  });
  
  // Build Cope Navigation
  copeNav = PurelyViews.class('Nav').build({
    sel: '#nav',
    data: {
      logo: { text: 'Cope' }
    }
  });

  // Enroll copeApp, copeNav in ds
  ds.enroll(copeApp);
  ds.enroll(copeNav);
  
  // Set res of copeApp
  copeApp.res('app selected', appId => {
    let G = Cope.graph(appId),
        c = Cope.chain(),
        currPage = 'page-', // "/"
        appsData = copeApp.get('apps'),
        appData;

    // Get the app data
    appData = appsData && appsData[appId];
    if (!appData) {
      console.error('Failed to find appData')
      //c.add(); 
    }

    console.log(appData);

    // Try to access page "/" of the app
    if (!appData.sectionsOf || !appData.sectionsOf[currPage]) {

      // Get sections of page "/"
      c.add(() => {
        let homePage = G.node(currPage);
        homePage.val('sections').then(sections => {
          if (!sections) {
            
            // Init sections of page "/" with sampleSections
            homePage.val('sections', sampleSections)
              .then(data => {
              
              // Pass on sections of page "/"
              c.next(sampleSections);
            });
          } else {

            // Pass on sections of page "/"
            c.next(sections);
          }
        });
      })

      // Update the core dataSnap
      c.add(sections => {
        ds.map('apps', x => {
          x[appId].sectionsOf[currPage] = sections;
          return x;
        });
        c.next(); // keep going
      });
    } // end of if

    // Toggle to app editor
    c.add(() => {
      copeApp.val('toggle', 'app-editor');
    });
  }) // end of "app selected" of copeApp
  .res('save page', obj => {
    let currAppId = obj.currAppId,
        currPage = obj.currPage, // page-<path>
        appData = obj.appData;

    console.log('save page', obj);

    // Find the node by currAppId and update app data
    let G = Cope.graph(currAppId);
    G.node(currPage).val('sections', appData.sectionsOf[currPage]);
  }); // end of "save" of copeApp

  // Set res of copeNav
  copeNav.res('logo clicked', () => {
    copeApp.val('toggle', 'overview');
  });

  // Get user interface
  Cope.user().then(user => {

    // Update ds with name and email
    user.val('name').then(name => {
      ds.val({
        'email': user.email,
        'name': name
      });
    });

    // Get users' app interfaces 
    user.cred('apps').then(appIds => {

      // If no apps
      if (!appIds) return;

      // Update ds with appIds and initial apps data
      let apps = Object.keys(appIds).map(id => Cope.app(id)),
          data = {};
      data.appIds = Object.keys(appIds);
      data.apps = {};

      // Set all apps data
      apps.map(app => {

        // Init each app's data
        data.apps[app.appId] = {
          appId: app.appId,
          sectionsOf: {}
        };

        // Update more details about those apps
        app.get('appName').then(appName => {
          ds.map('apps', apps => { 
            // Note that the following apps is actually data.apps
            apps[app.appId].appName = appName;
            apps[app.appId].stat = 'Free Trial';
            return apps;
          }, true);
        });

        return app.appId;
      });
      ds.val(data); 

    }); // end of user.cred('apps')
  }); // end of Cope.user()
}); // end of page "/"



//----------------------------------------------------------


// Paeg "/"
Pages.use('_/', params => {
  // views
  let nav,  
      toggle, // toggle views of dashboard and app-page
      accCard; // account card

  let AppsDS = {},
      appCards = {};

  // Build navigation bar
  nav = Purely.class('Nav').build({
    sel: '#nav',
    data: {
      logo: {
        text: 'Cope'
      }
    }
  }).res('logo clicked', () => {
    toggle.val('sec', 'home');
  });

  nav.$el().css({ 
    'font-size': '25px'
  });

  // Build Toggle
  toggle = CopeViews.class('Toggle').build({
    sel: '#page'
  });

  // Build Account Card
  accCard = CopeViews.class('AccountCard').build({
    sel: toggle.sel('@account')
  }).res('sign out', () => {
    Cope.user().then(user => {
      user.signOut();
    });
  }).res('change name', name => { 
    // TBD
    Cope.modal('text', {
      //type: 'textarea',
      label: 'Name',
      value: name,
    }).res('value', function(val) {
      if (name != val) {
        // Update my name
        Cope.user().then(user => {
          user.val('name', val).then(() => {
            accCard.val('name', val);
          });
        });
      }
    });
  });

  // Get the current user
  Cope.user().then(user => {

    // Update accCard with email
    accCard.val('email', user.email);

    // Update accCard with name
    user.val('name').then(name => {
      accCard.val('name', name);
    });

    // Get users' apps
    user.cred('apps').then(appIds => {

      // If no apps
      if (!appIds) return;

      let apps = Object.keys(appIds).map(id => Cope.app(id));
      console.log(apps);

      // Clean up the wrap
      toggle.$el('@my-apps').html('');

      apps.forEach(app => {
        // Build app cards
        let appCard = CopeViews.class('AppCard').build({
          sel: toggle.sel('@my-apps'),
          method: 'append',
          data: {
            appId: app.appId
          }
        }).res('touched', () => {

          toggle.val('sec', 'app');

          // Get the Graph interface
          let G = Cope.graph(app.appId);

          // Build the app page
          let purelyApp = CopeViews.class('Purely.App').build({
            sel: toggle.sel('@app'),
            data: appCard.val()
          }).res('select-node', node => {
            debug('TBD: select node'); 
          }).res('add-partner', email => {
            debug('TBD: add partner'); 
          }).res('rename app', newName => {
            app.set('appName', newName).then(() => {
              appCard.val('appName', newName);
            });
          }).res('get page', pageId => {
            G.col('pages').node(pageId).val().then(page => {
              purelyApp.val('sections', page && page.sections);
            });
          })

          let sampleText = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;

          let sections = [{
            type: 'collection',
            title: 'Shape the world',
            content: 'Together we change the industry landscape',
            style: 'sec-full/sec-dark/sec-op-6/text-bold-title/comp-full/comp-slide',
            colName: 'Shirts',
            tags: ['men', 'kid'],
            sort: 'featured',
            max: 6,
            data: [
              { 'title': 'Simply', 'imgsrc': '/images/sample1.jpg' },
              { 'title': 'Purely', 'imgsrc': '/images/sample2.jpg' }
            ]
          }, {
            type: 'basic',
            title: 'Title',
            content: sampleText,
            media: {
              imgsrc: '/images/sample4.jpeg'
            },
            style: 'sec-dark/sec-op-2/text-right'
          }, {
            type: 'contacts',
            title: 'Opening',
            content: 'Weekdays | 09:00 - 17:00',
            style: 'sec-dark/sec-op-6/comp-full'
          }];
          
          appCard.ds().enroll(purelyApp);

          // TBD: Fetch app home page settings
          //G.col('pages').node('page_').val().then(page => {
          //  purelyApp.val('sections', page && page.sections);
          //});
          purelyApp.val({
            page: '/',
            sections: sections
          });

          return;
          // Build the app page
          let appPage = CopeViews.class('AppPage').build({
            sel: toggle.sel('@app'),
            data: appCard.val()
          }).res('select-node', node => {
            debug('TBD: select node'); 
          }).res('add-partner', email => {
            debug('TBD: add partner'); 
          }).res('rename app', newName => {
            console.log('rename!');
            app.set('appName', newName).then(() => {
              appCard.val('appName', newName);
            });
          });

          // Fake data
          d3.json('d3-sample.json', (err, graph) => {
            if (err) throw err;
            appPage.val('graph', graph);
          });

          // Enroll appPage in appCard
          appCard.ds().enroll(appPage);
        }); // end of appCard.res("touched")

        // Get app name
        app.get('appName').then(appName => {
          appCard.val('appName', appName);
        });

        // Find out the owner and partners
        app.cred.get('owner').then(owner => {
          app.cred.get('partners').then(partners => {
            Cope.user().then(user => {
              appCard.val('owner', owner && owner[user.uid] ? 'Me' : 'Someone else');

              appCard.val('partners', 'No other users.');
              if (partners) {
                partners = Object.keys(partners).length - 1;
                if (partners) {
                  appCard.val('partners', 'Hosting with ' + partners + ' other user(s).');
                }
              } 
            });
          });
        });

        appCard.val('stat', 'Free Trial');

      }); // end of apps.forEach
    }); // get users' apps
  }); // get the current user
}); // end of Page "/"

})();
