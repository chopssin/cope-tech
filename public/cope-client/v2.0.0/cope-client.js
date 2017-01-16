(function($) {
  let Cope = {};
  Cope.Util = {};

  let Phrases = {};
  Phrases.PROCESSING = '處理中';
  Phrases.CHOOSE = '選取';
  Phrases.CHOOSE_IMG = '選取圖片';
  Phrases.CHOOSE_FROM_COL = '從圖庫選取';
  Phrases.SAVE = '存擋';
  Phrases.DONE = '確定';

  // -----------------------------
  // Cope.Util.setDebug
  // -----------------------------
  Cope.Util.setDebug = function(_name, _toggle, _tag) {
    if (typeof _name != 'string') {
      return console.error('setDebug = function(String _name'
        + '[, Boolean _toggle[, String _tag]])');
    }
    let tags = {}, debug; 
    if (_tag) tags[_tag] = true;

    debug = function() {
      let val,
          theTag = '';
      if (!_toggle) return;

      let args = arguments;
      switch (args.length) {
        case 0: // Show usage
          console.log('---------------------------');
          console.log('[' + _name + '] debug tags:');
          Object.keys(tags).forEach(function(tag) {
            console.log(tag);
          });
          console.log('You can specify the tag in setDebug(_name, _toggle, _tag)');
          console.log('---------------------------');
          return;
          break;
        case 1: // Just print
          val = args[0];
          break;
        case 2: // Filtered
          tags[args[0]] = true; // register as a tag
          if (_tag && args[0] != _tag) return;
          val = args[1];
          theTag = '[ ' + args[0] + ' ]';
          break;
      }
      // Print
      // console.log('---------------------------');
      if (typeof val != 'object') {
        console.log('[' + _name + ']' + theTag + ' ' + val);
      } else {
        console.log('[' + _name + ']' + theTag + ' ->');
        console.log(val);
        console.log('--------------------------------');
      }
      // console.log('---------------------------');
    };
    return debug;
  }; // end of setDebug

  let debug = Cope.Util.setDebug('cope-client', true);

  // -----------------------------
  // Cope.Util.setTest
  // -----------------------------
  Cope.Util.setTest = function(_tag, _print) {
    let tag = _tag || new Date().getTime().toString(36),
        tests = [], 
        allDone = function() {},
        debug = Cope.Util.setDebug('TEST "' + tag + '"', false);

    return function(_func) {
      let func = _func,
          idx = tests.length,
          toPrint = false,
          hasPassed = false,
          my = {};

      if (typeof func != 'function') return null;
      tests[idx] = false;

      my.debug = debug;
      my.pass = function(_msg) {
        if (_print) debug('=== PASSED (' + idx + ') ===', _msg || '');
        if (!hasPassed) {
          hasPassed = true;
        } else {
          if (_print) debug('Already passed (' + idx + ')',  _msg || '');
          return;
        }

        let count = 0;
        tests[idx] = true;
        if (!toPrint) return;

        // Print the current status
        for (let i = 0; i < tests.length; i++) {
          if (tests[i]) count++;
        }
        if (_print) debug('passed: ' + count + '/' + tests.length);
        if (_print && count == tests.length) {
          debug('===============');
          debug('All tests done.');
          debug('===============');
        }
        allDone();
      }; // end of my.pass
      my.print = function() {
        toPrint = true;
      };
      my.done = function(_cb) {
        if (typeof _cb == 'function') {
          allDone = _cb;
        }
      };

      // Run the test function
      func.call(my, my.pass);
      return my;
    }; // end of return
  }; // end of setTest

  // -----------------------------
  // Cope.Util
  // -----------------------------
  let cal = {}, // to memorize calculated dates
      daysInMonth = function(_month, _year) {
        return new Date(_year, _month, 0).getDate();
      };
      
  Cope.Util.getCal = function(_year) {
    if (!cal[_year + '']) {
      cal[_year + ''] = {};
      for (let month = 1; month < 13; month++) {
        let days = daysInMonth(month, _year);
        cal[_year + ''][month + ''] = {};
        for (let date = 1; date < (days+1); date++) {
          cal[_year + ''][month + ''][date + ''] 
            = new Date(_year, month, date).getDay();
        }
      }
    }
    return cal[year + ''];
  }; // end of util.getCal

  Cope.Util.daysAfterNow = function(days) {
    let now = new Date().getTime(),
        time;
    days = parseInt(days, 10);
    if (isNaN(days)) return;

    time = now + days * 86400000;
    now = new Date(time);
    return {
      timestamp: time, 
      year: now.getFullYear(),
      month: now.getMonth(),
      date: now.getDate(),
      hr: now.getHours(),
      min: now.getMinutes()
    };
  }; // end of util.daysAfterNow

  Cope.Util.timeOf = function(timestamp) {
    if (!timestamp) return {};

    if (typeof timestamp == 'string') {
      // e.g. 2012-3-22, 2012/3/22
      let str = timestamp.split(/\/|\-/).join('/');
      timestamp = new Date(str).getTime();
    }

    let t = parseInt(timestamp, 10),
        d = new Date(t),
        two = function(num) { // two-digit
          return ('00' + num).slice(-2);
        };
    if (!d) return {};
    let year = d.getFullYear(),
        month = d.getMonth() + 1,
        date = d.getDate(),
        hr = d.getHours(),
        min = d.getMinutes(),
        sec = d.getSeconds(),
        fullDate = year
          + '/' + month
          + '/' + date;
        fullTime = two(hr) 
          + ':' + two(min)
          + ':' + two(sec);
    return {
      timestamp: timestamp,
      fullDate: fullDate,
      fullTime: fullTime,
      year: year,
      month: month,
      date: date,
      hr: hr,
      min: min,
      sec: sec
    };
  }; // end of util.dateOf
  
  Cope.Util.setTimer = function() {
    let start = new Date().getTime();
    return {
      lap: function() {
        let duration = (new Date().getTime() - start) / 1000;
        console.log('[debug] start = ' + start + '; duration = ' + duration);
        return duration;
      }
    };
  };//util.setTimer

  // --- Cope.Util.thumbnailer ---
  Cope.Util.thumbnailer = function(img, sx, lobes) {
    let elem = document.createElement("canvas");
    if (!lobes) lobes = 1;
    
    return new Thumbnailer(elem, img, sx, lobes);
    //thumb.done(function() {
    //  console.log(thumb);
    //});
    //return thumb;
  }; // end of util.thumbnailer
  
  // returns a function that calculates lanczos weight
  function lanczosCreate(lobes) {
    return function(x) {
        if (x > lobes)
            return 0;
        x *= Math.PI;
        if (Math.abs(x) < 1e-16)
            return 1;
        let xx = x / lobes;
        return Math.sin(x) * Math.sin(xx) / x / xx;
    };
  }

  // elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
  function Thumbnailer(elem, img, sx, lobes) {
    this.canvas = elem;
    elem.width = img.width;
    elem.height = img.height;
    elem.style.display = "none";
    this.ctx = elem.getContext("2d");
    this.ctx.drawImage(img, 0, 0);
    this.img = img;
    this.src = this.ctx.getImageData(0, 0, img.width, img.height);
    this.dest = {
        width : sx,
        height : Math.round(img.height * sx / img.width),
    };
    this.dest.data = new Array(this.dest.width * this.dest.height * 3);
    this.lanczos = lanczosCreate(lobes);
    this.ratio = img.width / sx;
    this.rcp_ratio = 2 / this.ratio;
    this.range2 = Math.ceil(this.ratio * lobes / 2);
    this.cacheLanc = {};
    this.center = {};
    this.icenter = {};
    this.p_unit = Math.ceil(sx / 100);
    this._progress = 0;

    if ((img.width / sx) < 2) {
      setTimeout(this.process3, 0, this);
    } else {
      setTimeout(this.process1, 0, this, 0);
    }
  }
  Thumbnailer.prototype.onload = function() {
    if (this.onload) {
      this.onload.call();
    }
  };
  Thumbnailer.prototype.onprogress = function(_p) {
    if (this.onprogress) {
      this.onprogress.call(_p);
    }
  };
  Thumbnailer.prototype.process1 = function(self, u) {
    if (u % self.p_unit == 0) {
      self.onprogress(u / self.dest.width);
    } 
    self.center.x = (u + 0.5) * self.ratio;
    self.icenter.x = Math.floor(self.center.x);
    for (let v = 0; v < self.dest.height; v++) {
        self.center.y = (v + 0.5) * self.ratio;
        self.icenter.y = Math.floor(self.center.y);
        let a, r, g, b;
        a = r = g = b = 0;
        for (let i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
            if (i < 0 || i >= self.src.width)
                continue;
            let f_x = Math.floor(1000 * Math.abs(i - self.center.x));
            if (!self.cacheLanc[f_x])
                self.cacheLanc[f_x] = {};
            for (let j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
                if (j < 0 || j >= self.src.height)
                    continue;
                let f_y = Math.floor(1000 * Math.abs(j - self.center.y));
                if (self.cacheLanc[f_x][f_y] == undefined)
                    self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2)
                            + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
                weight = self.cacheLanc[f_x][f_y];
                if (weight > 0) {
                    let idx = (j * self.src.width + i) * 4;
                    a += weight;
                    r += weight * self.src.data[idx];
                    g += weight * self.src.data[idx + 1];
                    b += weight * self.src.data[idx + 2];
                }
            }
        }
        let idx = (v * self.dest.width + u) * 3;
        self.dest.data[idx] = r / a;
        self.dest.data[idx + 1] = g / a;
        self.dest.data[idx + 2] = b / a;
    }

    if (++u < self.dest.width)
        setTimeout(self.process1, 0, self, u);
    else
        setTimeout(self.process2, 0, self);
  };
  Thumbnailer.prototype.process2 = function(self) {
    console.log('process2');
    self.canvas.width = self.dest.width;
    self.canvas.height = self.dest.height;
    self.ctx.drawImage(self.img, 0, 0, self.dest.width, self.dest.height);
    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
    let idx, idx2;
    for (let i = 0; i < self.dest.width; i++) {
        for (let j = 0; j < self.dest.height; j++) {
            idx = (j * self.dest.width + i) * 3;
            idx2 = (j * self.dest.width + i) * 4;
            self.src.data[idx2] = self.dest.data[idx];
            self.src.data[idx2 + 1] = self.dest.data[idx + 1];
            self.src.data[idx2 + 2] = self.dest.data[idx + 2];
        }
    }
    self.ctx.putImageData(self.src, 0, 0);
    self.canvas.style.display = "block";
    self.onload();
  };
  Thumbnailer.prototype.process3 = function(self) {
    console.log('process3: actually just turn img into canvas');
    self.ctx.putImageData(self.src, 0, 0);
    self.canvas.style.display = "block";
    self.onload();
  }
  // end of Thumbnailer
  
  Cope.Util.dataURItoBlob = dataURItoBlob;
  function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
  }; //dataURItoBlob

  // -----------------------------
  // Cope.dataSnap
  // -----------------------------
  Cope.dataSnap = function(_name) {
    let my = {},
        data = {},
        registry = {},
        loaders = {}, // methods to load data
        debug, // to debug
        emit, // deliver updated data to registered Views 
        isValidKey, // to check the input key
        myName; // optional, name of this dataSnap
  
    myName = _name 
      || (new Date().getTime().toString(36))
          + '_' + Math.floor(Math.random() * 1000);
    
    debug = Cope.Util.setDebug('dataSnap ' + myName); // set the initial silent debugger

    emit = function() {
      Object.keys(registry).forEach(function(id) {
        registry[id].load(data);
      });
    };

    isValidKey = function(_key) {
      return (typeof _key == 'string')
        && (_key.indexOf('.') < 0)
        && (_key.indexOf(',') < 0)
        && (_key.indexOf('$') < 0)
        && (_key.indexOf('#') < 0);
    };

    my.enroll = function(_vu) {
      if (typeof _vu == 'object'
        && typeof _vu.id == 'string') {
        registry[_vu.id] = _vu;
        //_vu.ds((_snapName || name), my);
      } else {
        console.error('_vu is not an valid View object');
      }
    };

    my.set = function() {
      let args = arguments;
      switch (args.length) {
        case 1:
          switch (typeof args[0]) {
            case 'object': 
              Object.keys(args[0]).forEach(function(_key) {
                if (!isValidKey(_key)) return;
                data[_key] = args[0][_key];
              });
              break;
          }
          break;
        case 2:
          if (isValidKey(args[0])) {
            data[args[0]] = args[1];
          }
      } // end of switch
    }; // end of my.set

    my.get = function() {
      let args = arguments;
      switch (args.length) {
        case 0:
          return data;
          break;
        case 1:
          switch (typeof args[0]) {
            
            // Get specific value by args[0]
            case 'string': 
              if (!isValidKey(args[0])) return;
              return data[args[0]]; // return the value
              break;
          }
          break;
      } // end of outer switch
    }; // end of my.get

    my.val = function() {

      let args = arguments;
      switch (args.length) {
        
        // Get all values
        case 0:
          //return data;
          return my.get.apply(my, args);
          break;
        case 1:
          switch (typeof args[0]) {
            
            // Get specific value by args[0]
            case 'string': 
              //if (!isValidKey(args[0])) return;
              //return data[args[0]]; // return the value
              return my.get.apply(my, args);
              break;
            
            // Set value(s) and emit changes
            case 'object': 
              //Object.keys(args[0]).forEach(function(_key) {
              //  if (!isValidKey(_key)) return;
              //  data[_key] = args[0][_key];
              //});
              my.set.apply(my, args);
              emit();
              return; // return nothing
              break;
          }
          break;

        // Set a value and emit the change
        case 2:
          //if (isValidKey(args[0])) {
          //  data[args[0]] = args[1];
          //  emit();
          //}
          my.set.apply(my, args);
          emit();
          return; // return nothing
          break;
      } // end of switch

      debug('val', data);
      return;
    }; // end of my.val

    my.load = function(name, func) {
      debug('load', '.load(name, func)');
      switch (arguments.length) {
        case 0: // call all funcs in loaders
          for (let _name in loaders) {
            debug('load', 'call ' + _name);
            loaders[_name].call(my);
          }
          break;
        case 1: 
          // Call specific func in loaders
          if (typeof name == 'string') {
            if (loaders[name]) {
              debug('load', 'call ' + name);
              loaders[name].call(my);
            }
          // Or set anonymous function  
          } else if (typeof name == 'function') {
            let anonymous = (new Date().getTime()).toString(36);
            debug('load', 'set ' + anonymous);
            loaders[anonymous] = name;
          }
          break;
        case 2: // set specific func in loaders
          if (typeof func != 'function'
              || typeof name != 'string') { return; }
          debug('load', 'set ' + name);
          loaders[name] = func;
          break;
      }
      debug('load', data);
    }; // end of my.load

    return my;
  }; // end of Cope.dataSnap

  // -----------------------------
  // editor
  // -----------------------------
  const editor = function(_graphDB) {

    let debug = Cope.Util.setDebug('editor', false);

    let Views = Cope.useViews(),
        ModalView = Views.class('Modal'),
        vuModal,
        ViewClasses = {},
        CopeAccountView, // to sign-in, sign-out or sign-up
        WriterView, // click to edit and upsert data
        ImageViewerView, // click to view the image
        ImageChooserView, // choose images from the collection
        ImageUploaderView, // upload images from local
        lastOpenedVu, // record opened views in modal
        myGraphDB = _graphDB,
        my = {};
        //mainApp = this, // the copeApp
        //that = this; // the copeApp
    
    // Render initial lightbox and modal
    ModalView.dom(function() { 
      return '<div' + this.ID + 'id="Editor-zone" class="Editor-lightbox">' 
        + '<div data-component="modal" class="modal">'
        + '</div>'
      + '</div>';
    }); // end of ModalView.dom
    ModalView.render(function() { 
      let $this = this.$el();
      this.$el().off('click').on('click', function(e) {
        $this.hide();
        $('body').removeClass('frozen');
      });
      this.$el('@modal').unbind('click').click(function(e) {
        e.stopPropagation();
      });
    }); // end of ModalView.render

    // Initial modal built only once
    if (!this.vuModal) { 
      this.vuModal = ModalView.build({ selector: 'body', method: 'prepend' });
    }
    vuModal = this.vuModal;
    
    // Cope Account
    CopeAccountView = Views.class('CopeAccount');
    CopeAccountView.dom(function() {
      return '<div' + this.ID + 'class="cope-account">'
        + '<h3>Cope | Sign in</h3>'
        + '<input data-component="account" type="email" placeholder="Email">'
        + '<input data-component="pwd" type="password" placeholder="Password">'
        + '<span data-component="status" class="color-red"></span>'
        //+ '<button class="final">Go</button>'
        + '<button class="cope-card as-btn bg-blue color-w final">Go</button>'
        + '</div>';
    });
    CopeAccountView.render(function() {
      let account, pwd,
          error = this.val('error'),
          ok = this.val('ok'),
          that = this;

      if (ok) {
        my.dismiss();
        return;
      }

      this.$el('button').off('click').on('click', function() {
        account = that.$el('@account').val().trim();
        pwd = that.$el('@pwd').val();
        that.res('try', { account: account, pwd: pwd });
      });

      this.$el('@status').text('');
      if (error && !ok) {
        debug('CopeAccount - error', error);
        this.$el('@status').text('Wrong user/password');
      }
    });
    ViewClasses.CopeAccount = CopeAccountView;

    // Editor's View Classes
    // Blank
    WriterView = Views.class('Blank');
    WriterView.dom(function() {
      let label = this.val('label') || '';
      return '<div' + this.ID +'>' 
          + '<label data-component="label">' + label +'</label>'
          + '<textarea></textarea>'
          + '<button class="final cope-card as-btn">Save</button>';
        + '</div>';
    }); // end of Blank.dom
    WriterView.render(function() {
      let node = this.val('node'),
          field = this.val('field'),
          useDate = this.val('useDate'),
          map = this.val('map'), // raw -> val
          raw = this.val('raw'), // val -> raw
          val, //= this.val('val'), 
          newVal,
          valType, // string, number 
          that = this;

      if (!node || !field) return; 

      // Fetch the current value
      node.val(field).then(function(_val) {
        valType = typeof _val;
        val = _val;
        if (useDate) {
          val = util.timeOf(val).fullDate;
        } 
        if (typeof map == 'function') {
          val = map(val);
        }
        that.$el('textarea').val(val);
      });

      that.$el('button').off('click').on('click', function() {
        // Fetch the new value
        newVal = that.$el('textarea').val().trim();
        if (useDate) newVal = util.timeOf(newVal).timestamp;
        if (valType == 'number') newVal = Number(newVal);
        if (typeof raw == 'function') newVal = raw(newVal);
        
        console.log(newVal);
        if (!node || !newVal) return;
        try {
          // Update with the new value
          node.val(field, newVal).then(function() {
            that.res('newVal', newVal);
          });
        } catch (err) { console.error(err); }

        // Dismiss Editor
        my.dismiss();
        return;
      }); // end of ... button ... click
    }); // end of WriterView.render
    ViewClasses.Writer = WriterView;

    ImageViewerView = Views.class('ImageViewer');
    ImageViewerView.dom(function() {
      let src = this.val('src'),
          img = this.val('img');
      if (!src) return '<h3>Failed to open image</h3>';
      if (img) return '<div' + this.ID + ' style="width:100%;"></div>';
      return '<img width="100%" src="' + src + '">';
      //return 'img width="100%" src="' + src + '"';
    });
    ImageViewerView.render(function() {
      let img = this.val('img');
      if (!img) return;
      this.$el().append(img);
    });// end of ImageViewerView.render
    ViewClasses.ImageViewer = ImageViewerView;
    
    ImageChooserView = Views.class('ImageChooser');
    ImageChooserView.dom(function() {
      return '<div' + this.ID + '>' 
          + '<div class="image-chooser" data-component="list"></div>'
          + '<div style="width:100%">'
            + '<button data-component="doneBtn" class="final">'
              + Phrases.DONE 
            + '</button>'
          +'</div>'
        + '</div>';
    });
    ImageChooserView.render(function() {
      let $list = this.$el('@list'),
          multi = this.val('multi'),
          selected = [],
          that = this;

      that.$el('@doneBtn').off('click').on('click', function() {
        that.res('selected', selected);
        my.dismiss();
      });

      // Get images with format { timestamp, filename, thumb, url }
      my.getImages().then(function(res) {
        res.timestamps.forEach(function(t) { 
          let row = '<div class="row"' 
            + ' style="margin:0; margin-bottom: 16px;"' 
            + ' data-component="row-'
            + t + '"></div>';
          $list.append(row);
        }); 

        res.images.forEach(function(img, idx) {
          let imgId = 'img-' + idx,
              t = img.timestamp,
              $img,
              url = img.thumb || img.url,
              html = '<div data-component="' + imgId + '" style="margin:4px; padding:0;"'
                    + ' class="col-xs-4 col-sm-3 col-md-2 img-full squared">' 
                    + '<img src="' + url + '">' + '</div>';
            
          that.$el('@row-' + t).append(html);
          $img = that.$el('@' + imgId);
          $img.off('click').on('click', function() {

                if (multi) {
                  // Multiple selection
                  let found;
                  for (let i = 0; i < selected.length; i++) {
                    if (selected[i].imgId == imgId) {
                      found = i; // Already selected
                      break;
                    }
                  }
                  if (!isNaN(found)) {
                    // Remove from selected
                    selected.splice(found, 1); 
                    $img.removeClass('selected');
                  } else {
                    // Append to selected
                    selected.push({ 
                      img: img, imgId: imgId, 
                      $img: $img
                    });
                    $img.addClass('selected');
                  }
                } else {
                  // Single selection
                  selected = {
                    img: img, imgId: imgId, 
                    $img: $img
                  };
                  that.$el('.selected').removeClass('selected');
                  $img.toggleClass('selected');
                }
          }); // end of ... click
        }); // end of ... forEach
      }); // end of  ... then
    }); // end of ImageChooserView
    ViewClasses.ImageChooser = ImageChooserView;

    // ImageUploader
    // It will upload at least two versions of the image
    // 1. Original
    // 2. Small with width < 480px (240 * 2)
    ImageUploaderView = Views.class('ImageUploader');
    ImageUploaderView.dom(function() {
      let multi = this.val('multi') ? 'multiple' : '';
      return '<div'+ this.ID +'>'
        + '<h4>' + Phrases.CHOOSE_IMG + '</h4>'
        + '<div data-component="images" style="width:100%"></div>'
        + '<input type="file" data-component="file-input" accept="image/*"'
        + ' style="display:none" ' + multi + '>'
        + '<button class="btn btn-primary" data-component="choose" style="margin-right:16px">' 
          + Phrases.CHOOSE + '</button>'
        + '<button data-component="save" class="btn final hidden">' + Phrases.SAVE + '</button>'
        + '<div data-component="note" class="float-right hidden">' 
          + Phrases.PROCESSING 
          + '<span data-component="progress"></span></div>'
      + '</div>';
    }); // end of ImageUploader.dom
    ImageUploaderView.render(function() {
      let that = this,
          counter = 0, // count processed images
          //callback = this.val('callback') || function() {},
          $images = this.$el('@images'),
          $chooseBtn = this.$el('@choose'),
          $saveBtn = this.$el('@save'),
          $note = this.$el('@note'),
          $progress = this.$el('@progress'),
          $fileInput = this.$el('@file-input');
   
      $fileInput.change(function() {
        let files = $fileInput.get(0).files,
            thumbs = [],
            total = files.length,
            timestamp = new Date().getTime(),
            savedUrls = [],
            count = 0, // count thumbs
            p_counts = [], // count thumbnailizing process
            p_total = files.length;
        

        $images.html('');
        $note.removeClass('hidden');

        for (let i = 0; i < files.length; i++) {
          p_counts[i] = 0;
          let a = function(idx) { 

            // Process each image
            let file = files[idx],
                reader = new FileReader();
            reader.onload = function(e) {
              let preview, 
                  img = new Image();
              img.onload = function() {
                // Compress the image
                thumb = util.thumbnailer(img, 240);
                thumb.onload = function() {
                  counter++;
                  if (counter == files.length) {
                    $saveBtn.removeClass('hidden');
                    $note.addClass('hidden');
                  } 
                };
                thumb.onprogress = function(progress) {
                  p_counts[idx] = progress;
                  let p_sum = p_counts.reduce(function(s, p) {
                    return s + p;
                  }, 0);
                  $progress.html('(' 
                    + Math.floor(100 * (p_sum/p_total))
                    + '%)');
                };
                thumbs[idx] = thumb;

                // Preview image wrap
                that.$el('#preview-'+ idx).html(img);
              };
              img.src = e.target.result;
            }; // end of reader.onload
            reader.readAsDataURL(file);
            $images.append('<div id="preview-'+ idx +'"></div>');

          }(i); // end of function "a" 
        } // end of for
       
        // Set the Save button
        $saveBtn.off('click').on('click', function() {
          let count = 0, imgObjs = [];
          for (let i = 0; i < files.length; i++) { 
            let a = function(idx) {

              let file = files[idx];
              let thumb = dataURItoBlob(thumbs[idx].canvas.toDataURL("image/png"));
              let fileParams = {
                folder: 'images',
                timestamp: timestamp,
                filename: file.name,
                file: file
              };
              let thumbParams = {
                folder: 'images',
                timestamp: timestamp,
                filename: file.name + '_thumb_',
                file: thumb
              };

              myGraphDB.files().saveMany([thumbParams, fileParams]).then(function(_pairs) {
                count++;
                let imgObj = {};
                _pairs.forEach(function(x) {
                  imgObj.timestamp = parseInt(x.timestamp);
                  if (x.path.slice(-7) == '_thumb_') {
                    imgObj.thumb = x.url;
                  } else {
                    imgObj.url = x.url;
                    imgObj.path = x.path;
                  }
                });
                imgObjs.push(imgObj);

                debug('ImageUploader', 'count = ' + count);
                debug('ImageUploader', imgObj);
                debug('ImageUploader', 'Done.');

                if (count == files.length) {
                  that.res('done', imgObjs);
                }
              }); // end of saveMany

              // Dismiss the modal
              my.dismiss();
            }(i); // end of function "a"
          } // end of for
        }); // end of $saveBtn.click
      }); // end of $fileInput.change
      $chooseBtn.click(function() {
        console.log('Choose');
        $fileInput.click();
      });
    });
    ViewClasses.ImageUploader = ImageUploaderView;

    // Editor's methods
    my.open = function(obj) {
      let UsedView = typeof obj.use == 'string'
            ? ViewClasses[obj.use]
            : null;
      if (!UsedView) {
        return console.error('Failed to open "' + obj.use + '"');
      }

      $('body').addClass('frozen');
      vuModal.$el('@modal').html('');

      lastOpenedVu = UsedView.build({
        selector: vuModal.sel('@modal'),
        data: obj.data || {}
      });

      vuModal.$el().fadeIn(300);
      return lastOpenedVu;
    }; // end of my.open

    my.openModal = function(_fn) {
      if (typeof _fn == 'function') {
        
        // Clear the modal
        $('body').addClass('frozen');
        vuModal.$el('@modal').html('');

        // Send selector back
        _fn(vuModal.sel('@modal'));

        // Fade in the modal
        vuModal.$el().fadeIn(300);
      }
    }; // end of my.openWith

    my.openCopeAccount = function() {
      return my.open({ use: 'CopeAccount' });
    };
    // @node, @field, @label, @useDate, 
    // @map: raw -> val,  
    // @raw: val -> raw
    my.openWriter = function(_params) { 
      return my.open({ use: 'Writer', data: _params });
    }; // end of my.openWriter
      
    // @multi
    my.openImages = function(_params) { 
      if (!myGraphDB) return;
      return my.open({ use: 'ImageChooser', data: _params });
    }; // end of my.openImages
      
    // @multi
    my.openImageUploader = function(_params) { 
      if (!myGraphDB) return;
      return my.open({ use: 'ImageUploader', data: _params });
    }; // end of my.openImageUploader

    my.getImages = function() {
      let _thenable = {},
          _images = {}, // <t>.<f> -> { timestamp, filename, url, thumb }
          images = [], // flattened _images
          _timestamps = {},
          timestamps = [],
          path = 'images', 
          done;
      _thenable.then = function(_cb) {
        if (typeof _cb == 'function') { done = _cb; }
      }

      if (!myGraphDB) return;
      myGraphDB.files().open(path).then(function(res) {
        debug('getImages - res', res);

        Object.keys(res).forEach(function(_t) {
          _timestamps[_t] = true,
          Object.keys(res[_t]).forEach(function(_f) {
            let _filename = _f;
            if (_f.slice(-7) == '_thumb_') {
              _filename = _f.slice(0, -7);
            }

            if (!_images[_t]) _images[_t] = {};
            if (!_images[_t][_filename]) _images[_t][_filename] = {};

            if (_f.slice(-7) == '_thumb_') {
              _images[_t][_filename].thumb = res[_t][_f];
            } else {
              _images[_t][_filename].url = res[_t][_f];
              _images[_t][_filename].filename = _filename;
              _images[_t][_filename].timestamp = parseInt(_t);
            }
          });
        });
        
        Object.keys(_images).forEach(function(_t) {
          Object.keys(_images[_t]).forEach(function(_f) {
            images.push(_images[_t][_f]);
          });
        });
        debug('getImages - images', images);
        
        Object.keys(_timestamps).forEach(function(_t) {
          timestamps.push(parseInt(_t));
        });
        timestamps = timestamps.sort(function(a, b) { return a - b; });

        if (typeof done == 'function') { done({ timestamps: timestamps, images: images }); }
      });
      return _thenable;
    }; // end of my.getImages

    // @imgArr accepts three forms:
    // 1. <string> path
    // 2. <object> { timestamp, filename, thumb }
    // 3. <object> { path }
    my.delImages = function(imgArr) {
      debug('delImages', imgArr); // imgArr = [<x>]
      if (!Array.isArray(imgArr) || !myGraphDB) return;

      let paths = [], _thenable = {}, done, validate;
      validate = function(_p) {
        if (typeof _p == 'string') {
          let _idx = _p.indexOf('images/');
          if (_idx > -1) {
            _p = _p.slice(_idx);
            return _p;
          } 
        }
        return false;
      }; // end of validate
      _thenable.then = function(_cb) { done = _cb; };
      
      imgArr.forEach(function(x) {
        let _p;
        if (typeof x == 'string') { //x: path
          _p = validate(x);
          if (_p) paths.push(_p);

        } else if (x.timestamp && x.filename) { //x: { timestamp, filename, thumb, url }
          paths.push('images/' + x.timestamp + '/' + x.filename);
          if (x.thumb) {
            paths.push('images/' + x.timestamp + '/' + x.filename + '_thumb_');
          }

        } else if (typeof x.path == 'string') { //x: { path }
          _p = validate(x);
          if (_p) paths.push(_p);
        }
      });

      debug('delImages', paths);
      myGraphDB.files().delMany(paths).then(function() {
        console.log('Deleted.');
        if (typeof done == 'function') {
          done(paths);
        }
      });

      return _thenable;
    };  // end of my.delImages

    my.dismiss = function() {
      vuModal.$el().click(); 
    };
    return my;
  }; // end of editor

  // -----------------------------
  // Cope.views or Cope.useViews
  // -----------------------------
  let viewSets = {};
  Cope.views = Cope.useViews = function(_namespace) { 
    let debug = Cope.Util.setDebug('Cope.Views', false);
    if (typeof _namespace == 'string' 
        && viewSets[_namespace]) {
      return viewSets[_namespace];
    }

    let my = {},
        classes = {},
        count = 0,
        renderedVus = {},
        timestamp = new Date().getTime().toString(36),
        newView; // construct new vu
    timestamp = timestamp + Math.floor(Math.random() * 10000).toString(36);

    newView = function(_data, _load) {
      let vu = {},
          id,
          resFuncs = {},
          myLoadFunc,
          vuDataSnap = Cope.dataSnap(); // built-in dataSnap

      count = count + 1;
      id = timestamp + '_' + count;

      vu.id = id;
      vu.ID = ' data-vuid="' + id + '" ';

      vu.sel = function(_path) {
        let root = '[data-vuid="' + id + '"]';
        if (!_path) {
          return root;
        } else if (_path.charAt(0) === '@') { // eg. "@display"
          let cmp = '[data-component="' + _path.slice(1) + '"]';
          if (cmp.indexOf(' ') > -1) {
            console.error(`Invalid data-component "${cmp}"`);
          } else {
            return root + cmp + ', ' + root + ' ' + cmp; 
          }
        }
        return root + _path + ', ' + root + ' ' + _path;
      };

      vu.$el = function(_path) {
        return $(this.sel(_path));
      };

      vu.res = function(_name, _arg) {
        if (typeof _name != 'string') return;
        if (typeof _arg == 'function') {
          // to set res functions
          resFuncs[_name] = _arg;
        } else {
          // to run res functions,
          // which only allowed atmost one parameter
          if (typeof resFuncs[_name] == 'function') {
            resFuncs[_name].call(vu, _arg);
          }
        }
        return this;
      }; // end of vu.res

      vu.load = function() {
        _load(vu);
      }; 

      vu.val = function() {
        let ret = vuDataSnap.val.apply(null, arguments);
        switch (arguments.length) {
          // Getter
          case 0: 
            return ret;
            break;
          case 1: 
            if (typeof arguments[0] != 'string') {
              // Setter
              return vu; 
            } else {
              // Getter
              return ret;
            }
            break
          // Setter
          case 2: 
            return vu;
        }
      }; // end of vu.val

      vu.set = function() {
        vuDataSnap.set.apply(vu, arguments);
        return vu;
      }; // end of vu.set

      vu.get = function() {
        return vuDataSnap.get.apply(vu, arguments);
      }; // end of vu.set

      vu.use = function(_keys) {
        if (typeof _keys != 'string') return;

        let vals = vu.val(),
            keys = _keys.split(',').map(key => key.trim()); 
        
        debug('vu.use: keys', keys);
        debug('vu.use: vals', vals);

        return {
          then: function(_cb) {

            let passed = true,
                obj = {}; // stored values

            if (typeof _cb != 'function') return;
            if (Array.isArray(keys) && vals) {
              // Check each value of the key
              keys.forEach(key => { 
                let names = key.split('.'), 
                    cursor = {};
                cursor = JSON.parse(JSON.stringify(vals));

                for (let i = 0; i < names.length; i++) {
                  if (cursor.hasOwnProperty(names[i])) {
                    cursor = cursor[names[i]];
                  } else {
                    debug('vu.use: failed at [' + names[i]+ '] of cursor', cursor);
                    passed = false;
                    break;
                  }
                } 

                debug('vu.use: ' + key, cursor);
           
              }); // end of keys.forEach
                
              if (passed) {
                _cb(vals);
              }

            } // end of if
          } // end of then
        };
      };

      vu.ds = function() {
        return vuDataSnap;
      };
      
      // Set initial data if provided
      if (typeof _data == 'object') {
        vuDataSnap.val(_data); // Note. Since no vu
        // has enrolled in vuDataSnap (not even this vu),
        // the emit function of vuDataSnap will not make
        // any differences by setting the initial data.
      }

      // Enroll in built-in dataSnap
      vuDataSnap.enroll(vu);

      // vu.load would be set by "proto" in "my.class"
      return vu;
    }; // end of newView
    my.class = function(viewName) {
      if (!classes[viewName]) {
        let proto = {},
            dom = function() { return ''; },
            renderFuncs = [],
            render,
            renderAll;
        renderAll = function(_vu) {
          renderFuncs.forEach(function(_rend) {
            if (typeof _rend == 'function') { 
              _rend.call(_vu, _vu);
            }
          });
        }; // end of renderAll
        proto.dom = function(_func) {
          if (typeof _func == 'function') { 
            dom = _func;
          } 
        };
        // Append a render function to the array
        proto.render = function(func) {
          if (typeof func == 'function') { 
            renderFuncs.push(func);
          } 
        };
        proto.build = function(obj) {
          if (!obj) return console.error('lack of valid obj');
          let data = obj.data || {},
              vu = newView(data, renderAll),
              selector = obj.sel || obj.selector,
              method = obj.method || 'html';
          $(selector)[method](dom.call(vu, vu));
          vu.load();
          return vu;
        }; // end of proto.build
        classes[viewName] = proto;
      }
      return classes[viewName];
    }; // end of my.class
    
    if (typeof _namespace == 'string') {
      viewSets[_namespace] = my;
    }
    return my;
  }; // end of Cope.views or Cope.useViews
  
  // -----------------------------
  // Cope.pages
  // -----------------------------
  let pageSets = {};
  Cope.pages = function(_namespace) {
    let debug = Cope.Util.setDebug('Cope.pages', false);
    let pageFuncs = {},
        Pages = {};
    
    // Return existing page function
    if (typeof _namespace == 'string' 
        && pageSets[_namespace]) {
      debug(`Page set = "${ _namespace || '' }"`);
      return pageSets[_namespace];
    }

    // Or create and return a new page function
    Pages.use = function(_path, _arg) {
      if (typeof _path != 'string' 
          || _path.charAt('0') != '/') return;

      if (typeof _arg == 'function') {
        // Set the page function of _path
        pageFuncs[_path] = _arg;
      } else {
        // Run the page function
        try {
          debug(`${ _namespace || '' } > use path "${_path}"`);
          pageFuncs[_path].call(null, _arg);
        } catch (err) { console.error(err); }
      }
    };

    // Store the new page function,
    // otherwise it might not be accessiable
    if (typeof _namespace == 'string') {
      pageSets[_namespace] = Pages;
    }

    // return the newly created Pages object
    return Pages;
  }; // end of Cope.pages

  // -----------------------------
  // Cope.Graphs
  // -----------------------------
  // To get the current firebase instance
  let hasInitFB, // has init the default firebase
      myUser; // current user using this appGraph

  // To verify whether _name is valid input string
  let notValid = function(_name) {
    if (typeof _name == 'string'
      && _name.charAt(0) != '_') {
      return false;
    }
    debug(`[ERR] ${_name} is not valid.`);
    return true;
  }; // end of notValid

  // To check whether _cb is a function
  let isFunc = function(_cb) {
    return typeof _cb == 'function';
  };

  // To verify whether the input is a node object
  isNode = function(_node) {
    return typeof _node == 'object' 
      && _node 
      && typeof _node.col == 'string'
      && typeof _node.key == 'string';
  };

  // Get ot init firebase instance
  let getFB = function() {
    return {
      then: function(_cb) {
        if (!isFunc(_cb)) return;
        let initFB, findFB, count = 0;

        initFB = function() {
          if (hasInitFB) {
            return setTimeout(findFB, 100);
          } else {
            debug('Set hasInitFB as true');
            hasInitFB = true;
          }
          // The following should be called only once
          $.get({ url: '/cope-config' }).done(function(config) {
            try {
              firebase.initializeApp(config);
              //findFB();
              setTimeout(findFB, 100);
            } catch (err) { 
              console.error(err);
            }
          });
        };

        findFB = function() {
          if (!hasInitFB) {
            return setTimeout(initFB, Math.ceil(Math.random() * 1000));
          } 

          try {
            let fbApp = firebase.app();
            if (fbApp) {
              debug('Found firebase app');
              return _cb(fbApp);
            }
          } catch (err) {
            if (count < 10) {
              count++;
              setTimeout(findFB, 100);
            } else {
              return console.error('Failed to find firebase instance');
            }
          }
        };

        // Start with findDB
        findFB();
      } // end of then
    }; // end of return
  }; // end of getFB
  
  // User interface
  let makeUser = function(_user) {
    let user = {};
    if (!_user.uid) {
      return;
    }
    let findUser = function(_email, _cb) {
      getFB().then(function(_fb) {
        // Find Cope user by email
        _fb.database().ref('cope_users')
          .orderByChild('public/email')
          .equalTo(_email)
          .once('value')
          .then(function(_snap) {
            let foundUser = null;
            if (_snap.val()) foundUser = Object.keys(_snap.val())[0];
            if (!foundUser) {
              debug('dataSend', 'found no user by ' + _email);
            } else {
              if (typeof _cb == 'function') {
                _cb(foundUser);
              }
            }
          }).catch(function(err) {
            debug('dataSend', 'found no user by ' + _email);
            console.error(err);
          });
      });
    }; // end of findUser

    let dataUpdate = function() {
      let args = arguments,
          done = function() {},
          dir = this && this.dir;
      if (dir != 'public' && dir != 'credentials') return;

      getFB().then(function(_fb) {
        let ref = _fb.database().ref('cope_users')
                  .child(_user.uid)
                  .child(dir); 
                  // dir should be either public or credentials

        switch (args.length) {
          case 0: // Do nothing...
            break;
          case 1: 
            switch (typeof args[0]) {
              case 'string': // getter
                ref.child(args[0]).once('value').then(function(_snap) {
                  done(_snap.val());
                }).catch(function(err) {
                  console.error(err);
                });
                break;
              case 'object': // setter
                let count = 0,
                    keys = Object.keys(args[0]);
                keys.forEach(function(_key) {
                  ref.child(_key).set(args[0][_key])
                    .then(function() {
                      count++;
                      if (count == keys.length) {
                        done();
                      }
                    });
                });
                break;
            }
            break;
          case 2: // setter
            if (typeof args[0] == 'string') {
              let ups = {};
              ref.child(args[0]).set(args[1]).then(function() { done(); });
            }
            break;
        } // end of switch
      }); // end of getFB
      return {
        then: function(_cb) {
          if (typeof _cb == 'function') {
            done = _cb;
          }
        }
      }
    }; // end of function "dataUpdate"

    // To send data to other Cope users' "inbox"
    let sendInbox = function(_email, _key, _val) {
      let done = function() {};
      findUser(_email, function(foundUser) {
        getFB().then(function(_fb) {
          // Found the matched user
          // Send data to the user
          try {
            _fb.database().ref('cope_users')
              .child(foundUser)
              .child('inbox')
              .child(_key)
              .child(_user.uid)
              .set(_val)
              .then(function() {
                done();
              })
              .catch(function(err) {
                console.error(err);
              });
          } catch (err) { console.error(err); }
        }); // end of getFB
      }); // end of findUser
      return {
        then: function(_cb) {
          if (typeof _cb == 'function') {
            done = _cb;
          }
        }
      };
    }; // end of sendInbox

    // To read data from other users in "inbox"
    let readInbox = function(_key) {
      let done = function() {};
      getFB().then(function(_fb) {
        _fb.database().ref('cope_users')
          .child(_user.uid)
          .child('inbox')
          .child(_key)
          .on('value', function(_snap) {
            done(_snap.val());
          })
      }); // end of getFB
      return {
        then: function(_cb) {
          if (typeof _cb == 'function') {
            done = _cb;
          }
        }
      };
    }; // end of readInbox

    // To write or modify data in "inbox"
    let writeInbox = function(_key, _val) {
      let done = function() {};
      getFB().then(function(_fb) {
        _fb.database().ref('cope_users')
          .child(_user.uid)
          .child('inbox')
          .child(_key)
          .set(_val)
          .then(function() {
            done();
          });
      }); // end of getFB
      return {
        then: function(_cb) {
          if (typeof _cb == 'function') {
            done = _cb;
          }
        }
      };
    }; // end of writeInbox

    user.addPartner = function(_appId, _email, _toAdd) {
      let done = function() {};
      findUser(_email, function(_foundUser) {
        // TBD
        getFB().then(function(_fb) {
          _fb.database().ref('cope_user_apps')
          .child(_appId)
          .child('credentials/partners/' + _foundUser)
          .set(_toAdd) // _toAdd should be true or null
          .then(function() {
            user.send(_email, 'add_partner_app', _appId).then(function() {
              done();
            });
          });
        }); // end of getFB.then
      }); // end of findUser
      return {
        then: function(_cb) {
          if (typeof _cb == 'function') done = _cb;
        }
      };
    }; // end of user.addPartner
    
    user.val = dataUpdate.bind({ dir: 'public' });
    user.cred = dataUpdate.bind({ dir: 'credentials' });
    
    // Inbox APIs: send, read, write 
    user.send = sendInbox;
    user.read = readInbox;
    user.write = writeInbox;
    
    user.signOut = function() {
      // TBD: sing out
      getFB().then(fb => {
        debug('user sign out')
        fb.auth().signOut();
      });
    };

    // Set email
    user.email = _user.email;
    return user;
  };// end of makeUser

  // Global observer for user auth 
  let reqUserFuncs = [];
  getFB().then(_fb => {
    _fb.auth().onAuthStateChanged((_user) => {
      myUser = null;
      if (_user) {
        myUser = makeUser(_user); // make user obj
        debug('#user', myUser);

        reqUserFuncs = reqUserFuncs.reduce((arr, fn) => {
          fn(myUser);
          return arr;
        }, []);
      } else {
        debug('#user', 'Unverified user');
        editor().openCopeAccount().res('try', function(pairs) {
          // Fetch from Editor
          let email = pairs.account,
              password = pairs.pwd,
              that = this;
          debug('#user - signed in as', email);
          getFB().then(_fb => {
            _fb.auth().signInWithEmailAndPassword(email, password)
              .then(() => {
                that.val({ 'ok': true }); // talk to Editor
              })
              .catch((err) => {
                debug('#user', err);
                that.val({ 'error': err.code }); // talk to Editor
              }); // end of catch
          }); // end of getFB().then
        }); // end of Editor.openCopeAccount
      } // end of else
    }); // end of _fb.auth()
  }); // end of getFB()

  // To continue as a user which may
  // require user sign-in, or callback
  // with User interface once signed in
  // (This method could be used in both modes)
  let getUser = function() {
    let user = {};
    return {
      then: function(_cb) {
        if (!isFunc(_cb)) return;
        let done = _cb;
        if (myUser) {
          return done(myUser);
        } else {
          reqUserFuncs[reqUserFuncs.length] = done;
        }
      } // end of then
    }; // end of return
  }; // end of getUser

  Cope.Graphs = {};
  Cope.Graphs.user = getUser;
  Cope.Graphs.create = {};
  Cope.Graphs.list = function() {
    return {
      then: function(_cb) {
        if (!isFunc(_cb)) return;
        getUser().then(user => {
          user.val('own_apps').then(myGraphs => {
            _cb(myGraphs);
          });
        });
      }
    };
  };
  Cope.Graphs.remove = {};

  // -----------------------------
  // Cope.graph or Cope.appGraph
  // -----------------------------
  Cope.Graphs.get = Cope.graph = Cope.appGraph = function(_appId) {

    // To print debug messages
    let debug = Cope.Util.setDebug('appGraph', false);
        let asGlobal = (typeof _appId != 'string' || arguments.length == 0),
        //myUser, // current user using this appGraph
        //api = {}, // to store and bind APIs to myGraph
        myGraph = {}, // the object to be returned
        GRAPH_ROOT = '', STORE_ROOT = '';

    if (!asGlobal && !notValid(_appId)) {
      // Define roots of ref and storage based on _appId
      GRAPH_ROOT = 'cope_user_apps/' + _appId + '/graph',
      STORE_ROOT = 'user_apps/' + _appId;
    };

    let myGraphRef = function(_fb) {
      try {
        return _fb.database().ref(GRAPH_ROOT);
      } catch (err) { console.error(err); }
    }; // end of myGraphRef

    // To continue as a user which may
    // require user sign-in, or callback
    // with User interface once signed in
    myGraph.user = getUser;

    // # App graph mode
    // Node interface
    myGraph.node = function(_colName, _nodeKey) {
      let node = {}, // the object to be returned
          snapshot = {}; // data of the node

      if (notValid(_colName) || notValid(_nodeKey)) return;

      node.col = _colName;
      node.key = _nodeKey;

      // To access current snapshot
      node.snap = function(_f) {
        if (_f && typeof _f == 'string') {
          return snapshot[_f];
        }
        return snapshot;
      }; // end of node.snap

      // To access node data asynchrinously
      node.val = function() {
        let args = arguments,
            done = function() {};

        debug('val', args);

        switch (args.length) {
          case 0: // fetch all vals
            // Firstly, find fields
            getFB().then(_fb => {
              myGraphRef(_fb).child(_colName).child('__fields').once('value')
                .then(_snap => {
                  let vals = {}, // values to be called back
                      fields = [], // field keys 
                      count = 0; // async count

                  if (_snap.val()) { // if field(s) exists
                    fields = Object.keys(_snap.val());
                    fields.forEach(_f => {
                      myGraphRef(_fb).child(_colName).child(_f).child(_nodeKey)
                        .once('value')
                        .then(_val => {
                          count++;
                          if (_val.val()) {
                            vals[_f] = _val.val();

                            // Update snapshot
                            snapshot[_f] = _val.val();
                          }
                          if (count == fields.length) {
                            done.call(node, vals);
                          }
                        });
                      });
                  } else { // no fields
                    snapshot = {};
                    done.call(node, {});
                  } // end of else
                })// end of myGraphRef.then
                .catch(err => {
                  console.error(err);
                }); // end of myGraphRef.catch
            }); // end of getFB().then
            break;

          case 1: 
            // 1. fetch specific value: val(<string>field)
            if (typeof args[0] == 'string') {
              getFB().then(_fb => {
                myGraphRef(_fb)
                  .child(_colName)
                  .child(args[0]) // -> field
                  .child(_nodeKey)
                  .once('value')
                  .then(function(_snap) {

                  // Update snapshot
                  snapshot[args[0]] = _snap.val();

                  // Callback with the fetched value
                  done.call(node, _snap.val()); 
                }).catch(err => { console.error(err); });
              }); // end of getFB

            // 2. set multiple values: val(<object>values)
            } else if (typeof args[0] == 'object') { // args[0] -> obj
              let obj = args[0], 
                  count = 0, 
                  keys = Object.keys(obj);

              keys.forEach(function(_key) {
                node.val(_key, obj[_key]).then(function() {
                  count++;
                  if (count == keys.length) {
                    done.call(node);
                  }
                });
              });
            }
            break;

          case 2: // set specific value: val(field, value)
            if (typeof args[0] == 'string') {
              // Set the field
              getFB().then(_fb => {
                myGraphRef(_fb).child(_colName).child('__fields')
                  .child(args[0]).set(true);
              
                // Record the node in "_nodes"
                myGraphRef(_fb).child('_nodes').child(_colName)
                  .child(_nodeKey).set(true);

                // Set the value
                myGraphRef(_fb).child(_colName)
                  .child(args[0]) // field
                  .child(_nodeKey)
                  .set(args[1]) // value
                  .then(function() {

                  // Update snapshot
                  snapshot[args[0]] = args[1];
                  done.call(node);  
                }) // end of myGraphRef
                .catch(err => { console.error(err); });
              }); // end of getFB
            } // end of if
            break;
        } // end of switch
        
        return { 
          then: function(_cb) { 
            if (typeof _cb == 'function') { done = _cb; }
          } // end of then 
        };
      }; // end of myNode.val

      // To delete the node
      node.del = function(_isTrue) {

        let done;

        if (_isTrue === true) {
          // Remove values
          getFB().then(_fb => {
            myGraphRef(_fb).child(_colName).child('__fields').once('value').then(function(_snap) {
              
              let count = 0, 
                  fields = [];

              if (!_snap.val()) return;

              // Remove values of the node
              fields = Object.keys(_snap.val());
              fields.forEach(function(_f) {
                myGraphRef(_fb).child(_colName).child(_f)
                  .child(_nodeKey).set(null).then(function() {
                  count++;
                  if (count == fields.length) {
                    
                    // Remove the node from '_nodes'
                    myGraphRef(_fb).child('_nodes').child(_colName)
                      .child(_nodeKey).set(null)
                      .then(function() {
                      if (typeof done == 'function') {
                        done();
                      }
                    });
                  } // end of removal of the node
                }); // end of removal of each field
              }); // end of fields.forEach 
            }); // end of myGraphRef
          }); // end of getFB
          return { then: function(_cb) { done = _cb; } };
        } // end of if
      }; // end of node.del

      // To form a directed edge from this node to the target node
      let toLink = function(_label, _target, _toLink) {
        let done;
        if (notValid(_label) 
            || !_target
            || !_target.col
            || !_target.key) return;

        getFB().then(_fb => {
          if (_toLink) {
            myGraphRef(_fb)
              .child('_edges')
              .child('_labels')
              .child(_label).set(true);
          }
          myGraphRef(_fb)
            .child('_edges')
            .child(_label).child('from')
            .child(node.col).child(node.key)
            .child(_target.col).child(_target.key)
            .set(_toLink)
            .then(() => {
              myGraphRef(_fb)
                .child('_edges')
                .child(_label).child('to')
                .child(_target.col).child(_target.key)
                .child(node.col).child(node.key)
                .set(_toLink)
                .then(() => {
                  if (isFunc(done)) done();
                }).catch(err => console.error(err)); 
            }).catch(err => console.error(err));
        }); // end of getFB
        return {
          then: function(_cb) {
            if (isFunc(_cb)) done = _cb;
          }
        };
      }; // end of toLink

      node.link = function(_l, _t) {
        return toLink(_l, _t, true);
      };
      node.unlink = function(_l, _t) {
        return toLink(_l, _t, null);
      };

      return node;
    }; // end of myGraph.node

    // Collection interface
    myGraph.col = function(_colName) {
      if (notValid(_colName)) return;
      let col = {};

      // Node interface
      col.node = function(_nodeKey) {
        return myGraph.node(_colName, _nodeKey);
      };

      // TBD
      col.getNodes = function() {};

      return col;
    }; // end of myGraph.col

    // Edges interface
    myGraph.edges = function(_label) {
      if (notValid(_label)) return;

      let edges = {}, 
          node, // the related node
          label = !notValid(_label) ? _label : null;

      // Set the related node
      edges.of = function(_node) {
        if (isNode(_node)) {
          node = _node;
        }
        return edges;
      }; // end of edges.of

      // Serve for edges.find
      let findWithLabel = function(_label, _dir) {
        if (notValid(_label)) return;
        if (_dir != 'from' && _dir != 'to') {
          return;
        }
        
        let done, label = _label;

        getFB().then(_fb => {
          myGraphRef(_fb)
            .child('_edges').child(label).child(_dir)
            .child(node.col).child(node.key)
            .once('value')
            .then(_snap => {
              if (isFunc(done)) done(_snap.val());
            })
            .catch(err => console.error(err));
        }); // end of getFB.then
        return {
          then: function(_cb) { done = _cb; }
        };
      }; // end of findWithLabel

      // To get related nodes
      edges.then = function(_cb) {

        if (!isFunc(_cb)) return;

        let done = _cb, 
            results = {}, // callback results
            count = 0, // exec count of findWithLabel
            dirs = ['from', 'to'],
            types = {
              from: 'target',
              to: 'source'
            };

        // Find nodes linking with queried nodes
        if (label) {
          dirs.forEach(dir => {
            findWithLabel(label, dir).then(val => {
              
              let type = types[dir];

              count++;
              // Push nodes into results
              // val should be null or <col>/<key>:true
              if (!results[label]) {
                results[label]  = [];
              }
              if (val) {
                Object.keys(val).forEach(col => {
                  Object.keys(val[col]).forEach(key => {

                    let anEdge = {};
                    anEdge.label = label;
                    anEdge.type = type;
                    anEdge.node = myGraph.node(col, key);
                    results[label].push(anEdge);
                  });
                });
              }
              // Final stage
              if (count == dirs.length) { 
                if (isFunc(done)) {
                  done(results); // callback with results
                }
              }

            }); // end of findWithLabel
          }); // end of dirs.forEach 
        } else {
          // TBD: Find all edges???
        }
        return {
          then: function(_cb) { done = _cb; }
        };
      }; // end of edges.find

      // TBD: edges.ofMany ...

      return edges;
    }; // end of myGraph.edges

    // Quick accessing data
    myGraph.val = function() {
      // TBD
      //...
    };

    myGraph.populate = function(_nodes) {
      let nodes = _nodes,
          count = 0,
          done;

      if (!Array.isArray(_nodes)) {
        nodes = [_nodes];
      }

      nodes = nodes.reduce((arr, node) => {
        if (isNode(node)) {
          arr.push(node);
        }
        return arr;
      }, []);

      // Get values of nodes
      nodes.forEach(node => {
        node.val().then(val => {
          count++;

          // Final stage
          if (count == nodes.length) {
            if (isFunc(done)) {
              done(nodes);
            }
          }
        });
      }); // end of nodes.forEach

      return { then: function(_cb) { done = _cb; } };
    }; // end of myGraph.populate

    return myGraph;
  }; // end of Cope.appGraph

  window.Cope = Cope;

})(jQuery);
