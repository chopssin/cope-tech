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

  // Global debug
  let debug = Cope.Util.setDebug('cope-client', false);

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
    } else {
          console.log('setTimeout 300 onload');
      setTimeout(function() {
        if (this.onload) {
          this.onload.call();
        } 
      }, 300);
    }
  };
  Thumbnailer.prototype.onprogress = function(_p) {
    if (this.onprogress) {
      this.onprogress.call(_p);
    } else {
      setTimeout(function() {
        if (this.onprogress) {
          this.onprogress.call();
        } 
      }, 300);
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
        isEqual, // to check equity between two inputs
        myName; // optional, name of this dataSnap
  
    myName = _name 
      || (new Date().getTime().toString(36))
          + '_' + Math.floor(Math.random() * 1000);
    
    debug = Cope.Util.setDebug('dataSnap ' + myName); // set the initial silent debugger

    emit = function() {
      Object.keys(registry).forEach(function(id) {
        //registry[id].load(data);
        registry[id].set(data); // upsert data
        registry[id].load();
      });

      // Also, run all the assigned load functions
      my.load();
    };

    isValidKey = function(_key) {
      return (typeof _key == 'string')
        && (_key.indexOf('.') < 0)
        && (_key.indexOf(',') < 0)
        && (_key.indexOf('$') < 0)
        && (_key.indexOf('#') < 0);
    };

    isEqual = function(a, b) {
      if (typeof a == typeof b) {
        if (typeof a == 'string' 
            || typeof a == 'number'
            || typeof a == 'boolean') {
          if (a === b) return true;
        }
      }
      return false;
    };

    my.enroll = function(_vu) {
      if (typeof _vu == 'function' //'object'
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
            case 'object': // upsert data 
              let updated = false;
              Object.keys(args[0]).forEach(function(_key) {
                if (!isValidKey(_key)) {
                  return console.error('set: invalid key', _key);
                }
                if (!isEqual(data[_key], args[0][_key])) {
                  updated = true;
                  data[_key] = args[0][_key];
                }
              });
              return updated;
              break;
          }
          break;
        case 2:
          let key = args[0],
              oldVal = data[key],
              newVal = args[1];

          if (isValidKey(key) && !isEqual(oldVal, newVal)) {
            data[key] = newVal;
            return true;
          }
      } // end of switch
      return false;
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

    my.map = function(key, mapFunc, toEmit) {
      if (typeof key == 'string' && typeof mapFunc == 'function') {
        let value = mapFunc(my.get(key));
        if (toEmit === true) {
          my.val(key, value);
        } else {
          my.set(key, value);
        }
        return value;
      }
      return;
    }; // end of my.map

    my.val = function() {

      let args = arguments;
      switch (args.length) {
        
        // Get all values
        case 0:
          return my.get.apply(my, args);
          break;
        case 1:
          switch (typeof args[0]) {
            
            // Get specific value by args[0]
            case 'string': 
              return my.get.apply(my, args);
              break;
            
            // Set value(s) and emit changes
            case 'object': 
              if (my.set.apply(my, args)) {
                // emit iff value changed
                emit();
              }
              return; // return nothing
              break;
          }
          break;

        // Set a value and emit the change
        case 2:
          if (my.set.apply(my, args)) {
            // emit iff value changed
            emit();
          }
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
            loaders[_name].call(my, data);
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
      let vu,
          id,
          resFuncs = {},
          myLoadFunc,
          vuDataSnap = Cope.dataSnap(); // built-in dataSnap

      count = count + 1;
      id = timestamp + '_' + count;

      vu = function(sel) {
        let api = {},
            $el = vu.$el();

        if (typeof sel == 'string') {
          $el = vu.$el(sel);
        }
        
        ['html', 'append', 'prepend'].map(method => {
          api[method] = function(arg) {
            let html = (typeof arg == 'string' || !isNaN(arg))
              ? arg + ''
              : domToHtml(arg, id);
            try { 
              $el[method](html);
            } catch (err) { console.error(err); }
          };
        });
        return api;
      };

      vu.id = id;
      vu.ID = ' data-vuid="' + id + '" ';

      vu.sel = function(_path) {
        let root = '[data-vuid="' + id + '"]';
        if (!_path) {
          return root;
        } else if (_path.charAt(0) === '@') { // eg. "@display"
          let cmp = '[data-component="' + _path.slice(1) + '"]',
              newCmp = '[data-component="' + id + '-' + _path.slice(1) + '"]';
          if (cmp.indexOf(' ') > -1) {
            console.error(`Invalid data-component "${cmp}"`);
          } else {
            return root + cmp + ', ' + root + ' ' + cmp + ', ' + newCmp;
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

      vu.map = function(key, mapFunc, toEmit) {
        return vuDataSnap.map.apply(vu, arguments);
      }; // end of vu.map

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
      }; // end of vu,use

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

          let html = dom.call(vu, vu);
          if (Array.isArray(html)) {
            let domArr = [];

            // Add vu.id to the first children
            domArr = html.map(o => {
              let newO = {}; 
              k = Object.keys(o)[0];
              newO[k + '*' + vu.id] = o[k];
              return newO;
            });
            html = domToHtml(domArr, vu.id);
          }

          // Render with initial dom
          $(selector)[method](html);
          vu.load(); // run renderAll
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

  function _readTag(tag, value) {
    var parse = /^([^@#<>\.\*\(\)]+)([@#<>\.\*][^@#<>\.\*]+|\(.+\))*$/g;
    var result = parse.exec(tag);
    if (result) {
      var tagname = result[1].trim();
      var id = '';
      var vuId = '';
      var classes = [];
      var props = [];
      var path = '';
      var comp = '';
      var html = '';

      parse = /[@|#|\.|\*][^@#<>\.\*\(\)]+|[<>][^@#<>\.\*\(\)]+([\*][^@#<>\.\*\(\)]+)?|\(.+\)/g;
      result = tag.match(parse);
      if (result && result.length) {
        result = result.map(function(x) {
          switch (x.charAt(0)) {
            case '@':
              comp = x;
              return { comp: x }; break;

            case '#': 
              id = x;
              return { id: x }; break;
            
            case '.': 
              classes.push(x);
              return { 'class': x }; break;
            
            case '(': 
              var len = x.length - 1;
              props = x.slice(1, len);
              return { props: x }; break;

            case '*':
              vuId = x.slice(1);
              return { vuId: x }; break;
    
            default:
          }
        });
      } // End if

      // Get html and path
      html = '<' + tagname;
      path = tagname;
      if (vuId) {
        html += ` data-vuid = "${vuId}"`;
      }
      if (id) {
        html += ' id = "' + id.replace('#', '') + '"';
        path += id;
      }
      if (comp) {
        html += ` data-component = "${ comp.slice(1) }"`;
        path += comp;
      }
      if (classes.length > 0) {
        html += ' class = "' + classes.reduce(function(x, y) {
          return x + y.replace('.', ' ');
        },'').trim() + '"';
        path += classes.reduce(function(x, y) {
          // Only accept "._actionName_randStr"
          if (/\._\w+_\w+/.test(y)) {
            return x + y;
          }
          return x;
        }, '').trim();
      }
      if (props.length) {
        html += ' ' + props;
      }
      html += '>'; 
      if (tagname != 'input' 
          && tagname != 'area'
          && tagname != 'base'
          && tagname != 'br'
          && tagname != 'col'
          && tagname != 'command'
          && tagname != 'embed'
          && tagname != 'hr'
          && tagname != 'keygen'
          && tagname != 'link'
          && tagname != 'meta'
          && tagname != 'param'
          && tagname != 'source'
          && tagname != 'img') html += (value || '') + '</' + tagname + '>';

      let ret = {
        tagname: tagname,
        id: id || '',
        vuId: vuId || '',
        comp: comp.slice(1) || '',
        classes: classes,
        props: props,
        html: html,
        path: path
      };
      return ret;
    }
  }; // end of readTag

  function readTag(tag, val, vuId) {
    let ret = {},
        i, j, parse, tmp, tmp2,
        err;

    err = function() {
      throw 'readTag: Syntax error';
    };
    ret.originalTag = tag;
    ret.tagname = 'div';
    ret.id = '';
    ret.vuId = '';
    ret.comps = [];
    ret.classes = [];
    ret.props = '';
    ret.psuedoStyle = '';
    ret.html = '';

    // Extract [ ... ] to get ret.psuedoStyle
    i = tag.indexOf('[');
    j = tag.lastIndexOf(']');
    if (i > -1 && i < j) {
      ret.psuedoStyle = tag.slice(i + 1, j);
      tag = tag.slice(0, i).concat(tag.slice(j + 1));
    }
     
    // Extract ( ... ) to get ret.props
    i = tag.indexOf('(');
    j = tag.lastIndexOf(')');
    if (i > -1 && i < j) {
      ret.props = tag.slice(i + 1, j);
      tag = tag.slice(0, i).concat(tag.slice(j + 1));
    }
    
    // Check validity and find the tagname
    parse = /^([\w]+)?([@#\[\.\*][^@#\[\.\*]+|\(.+\))*$/g;
    tmp = parse.exec(tag);
    if (!tmp) { return err(); }
    ret.tagname = tmp[1] || 'div';
    
    // Check for id, classes, vu-id, vu-comp
    parse = /[@#\.\*][\w\d\-]+/g;
    tmp = tag.match(parse);
    if (tmp && tmp.length) {
      tmp.map(x => {
        switch (x.charAt(0)) {
          case '*':
            ret.vuId = x.slice(1);
            break;
          case '@':
            ret.comps = ret.comps.concat(x.slice(1));
            break;
          case '#':
            ret.id = x.slice(1);
            break;
          case '.':
            ret.classes = ret.classes.concat(x.slice(1));
            break;
          default:
        }
      }); 
    }
    
    // Update all comps with vu-id
    if (ret.comps.length) {
      ret.comps = ret.comps.map(x => {
        let prefix = (vuId || ret.vuId || ''); 
        if (prefix) {
          x = prefix + '-' + x;
        }
        return x;
      });
    }
    
    // Handle props
    ret.props = ret.props.trim(); 
    //tmp = {};
    //tmp2 = ret.props.match(/([\w\-]*\s*=(\"[^\"]+\"|\'[^\']+\'))/g);

    //console.log(tmp2);
    //if (tmp2 && tmp2.length) {
    //  tmp2.map(x => {
    //    i = x.indexOf('=');
    //    tmp[x.slice(0, i)] = x.slice(i + 1);
    //    ret.props = ret.props.replace(x, '');
    //  });
    //}
    //ret.props.trim()
    //  .replace(/\s+/g, ' ')
    //  .split(' ')
    //  .map(x => {
    //    if (!x) { return; }
    //    tmp['__' + x] = true;
    //});

    //ret.props.trim()
    //  .replace(/(\s)+/g, ' ') // __ -> _
    //  .replace(/\s+=/g, '=') // _= -> =
    //  .replace(/=\s/g, '=') // =_ -> =
    //  .split(' ').map(x => {
    //  if (!x) { return; }
    //  i = x.indexOf('=');
    //  if (i < 0) {
    //    tmp['__' + x] = true;
    //  } else {
    //    tmp[x.slice(0, i)] = x.slice(i + 1);
    //  }
    //});
    //ret.props;
    
    // Set the style
    tmp = ret.psuedoStyle.split(';').map(x => {
      let style = '',
          s = '',
          shortcuts;
      shortcuts = {
        w: 'width',
        h: 'height',
        m: 'margin',
        p: 'padding',
        c: 'color',
        z: 'z-index',
        fz: 'font-size'
      };
      if (!x) { return ''; }
      x = x.trim();
      
      ['block', 'inline-block', 'inline', 'flex'].map(s => {
        if (x == s) {
          style = 'display:' + x;
        }
      });
      
      ['absolute', 'relatvie', 'fixed'].map(s => {
        if (x == s) {
          style = 'position:' + x;
        }
      })
      
      Object.keys(shortcuts).map(s => {
        if (x.indexOf(s) == 0) {
          style = shortcuts[s] + ':' + x.slice(s.length); 
        }
      });
      
      if (!style) {
        style = x;
      }
      
      return style;
    }).join(';') || '';
    
    if (tmp) {
      //if (!ret.props.style) { ret.props.style = ''; }
      ret.props = ret.props + ' ' + tmp;
    }
    
    // Generate html
    tmp = ret.tagname + ' ' +
      (ret.id ? (' id="' + ret.id + '" ') : '') +
      (ret.classes.length ? (' class="' + ret.classes.join(' ') + '" ') : '') +
      (ret.vuId ? (' data-vuid="' + ret.vuId + '" ') : '') +
      (ret.comps.length ? (' ' + ret.comps.map(x => {
        return 'data-component="' + x + '"'; 
      }).join(' ') + ' ') : '') + 
      ret.props;

    tmp = '<' + tmp.trim() + '>';
    if (ret.tagname != 'input' 
          && ret.tagname != 'area'
          && ret.tagname != 'base'
          && ret.tagname != 'br'
          && ret.tagname != 'col'
          && ret.tagname != 'command'
          && ret.tagname != 'embed'
          && ret.tagname != 'hr'
          && ret.tagname != 'keygen'
          && ret.tagname != 'link'
          && ret.tagname != 'meta'
          && ret.tagname != 'param'
          && ret.tagname != 'source'
          && ret.tagname != 'img') {
      tmp = tmp + (val || '') + '</' + ret.tagname + '>';
    }
    ret.html = tmp;

    return ret;
  }; // end of readTag

  // domToHtml
  function domToHtml(val, vuId) {
    let readNode, // node => { tag: val } || [tag, val] || str 
        readDom, // dom => [node]
        readVal; // val => str || dom
    
    readNode = function(node) {
      let tag, val, ret;
      if (typeof node == 'string') {
        return node;
      } else if (Array.isArray(node)) {
        tag = node[0];
        val = node[1] || '';
      } else if (typeof node == 'object') {
        tag = Object.keys(node)[0];
        val = node[tag];
      }
      return readTag(tag, readVal(val), vuId).html;
    };
    
    readDom = function(nodes) {
      if (Array.isArray(nodes)) {
        return nodes.map(node => readNode(node)).join('');
      } 
      return '';
    }

    readVal = function(val) {
      return (typeof val == 'string') ? val : readDom(val);
    };
    
    return readVal(val);
  }; // end of domToHtml

  function _domToHtml(dom) {
    // value => str || dom
    // dom => [node]
    // node => { tag: value }, [ tag, value ], str
    let html = '[dom]';





    let walk = function(node, path) {
      
      // value - Object type
      if (!Array.isArray(node) && typeof node === 'object') {
        // Create an element: for object type, eg. { key: value }
        var keys = Object.keys(node);
        var key = keys[0];
        // Turn number type value into string type
        if (!isNaN(node[key])) {
          node[key] = node[key] + '';
        }

        if (key === 'submodule') {
          // { submodule: {} }
          return console.error('submodule is deprecated'); 
        } else if (typeof node[key] === 'string') {
          // { key: String }
          return readTag(key, node[key]);
        } else if (Array.isArray(node[key])) {
          // { key: [] }
          var fulltag = readTag(key).tagname;
          return readTag(key, walk(node[key], path + ' ' + fulltag).html);
        }
      } 

      // value - Array of children nodes
      if (Array.isArray(node)) {
        // Init each node
        var w = {};
        w.html = '';
        w.path = '';

        if (node.length === 2 && typeof node[0] === 'string') {
          
          // Turn number type value into string type
          if (!isNaN(node[1])) node[1] = node[1] + '';

          // Create an element: for array type [ String, value ]
          if (typeof node[1] === 'string') {

            // [ String, String ]
            return readTag(node[0], node[1]);
          } else if (typeof node[1] === 'object' && !Array.isArray(node[1])) { 

            // [ String, {} ]
            var rid = '_mod_' + rands();
            var mroot = 'div#' + rid;
            var newDiv = '<div id = "' + rid + '"></div>';
            submodules.push([mroot, node[1].$moduleName, node[1].$gen]);
            return readTag(node[0], newDiv); 
          } else if (Array.isArray(node[1])) {

            // [ String, [] ]
            var fulltag = readTag(node[0]).path;
            return readTag(node[0], walk(node[1], path + ' ' + fulltag).html);
          }
        } else {

          // Array of nodes: [ value, ... ]
          node.forEach(function(x) {
            var ret = {};

            if (typeof x === 'string') {
              
              // value is string
              ret.html = x;
              //return false;
            }
            if (typeof x === 'object' && !Array.isArray(x)) {
              if (x.$moduleName) {
                
                // value is a submodule
                var rid = '_mod_' + rands();
                var mroot = 'div#' + rid;
                w.html += '<div id = "' + rid + '"></div>';
                submodules.push([mroot, x.$moduleName, x.$gen]);
              } else {

                // value is an object
                ret = walk(x, path);
              }
            } else if (Array.isArray(x)) {

              // value is an array
              ret = walk(x, path);
            } 

            // x is an array or object
            if (ret) {
              w.html += ret.html;
              w.path += (path + ' ' + ret.path).trim(); 
            }
          }); // End of forEach
        };
      } // End of isArray check
      return w;
    }; // End of walk

    var result = walk(dom, '');
    return result.html;
    //return '[ dom ]';
    // return {
    //   html: result.html,
    //   dom: dom, 
    //   path: result.path.trim(),
    //   actions: actions,
    //   submodules: submodules
    // };
  }; // end of domToHtml

  // -----------------------------
  // Cope.modal
  // -----------------------------
  Cope.modal = function() {

    // Cope styles
    let css = {};
    css.btn = {
      'display': 'block',
      'position': 'relative',
      'min-width': '86px',
      'text-align': 'center',
      'font-size': '14px',
      'font-weight': '400',
      'padding': '8px',
      'border': 'none',
      'background-color': '#236eb6',
      'color': '#fff',
      'float': 'right',
      'margin-top': '8px',
      'cursor': 'pointer',
      //'-webkit-box-shadow': '0px 4px 6px 0 rgba(0, 0, 0, .4)',
      //'-moz-box-shadow': '0px 4px 6px 0 rgba(0, 0, 0, .4)',
      'box-shadow': '0px 4px 6px 0 rgba(0, 0, 0, .4)'
    };

    // Build the initial modal
    // @lightbox
    // @modal
    // @main
    // @btns
    // @btn-left
    // @btn-right
    // - useBtn: string, could be 'left' || 'right' || 'both'
    let myModal = Cope.views().class('myModal');
    myModal.dom(vu => [
      { 'div@lightbox': [
        { 'div@modal': [
          { 'div@main': '' },
          { 'div@btns(style = "display:none")': [
            { 'div@btn-left(style = "display:none")': '' },
            { 'div@btn-right(style = "display:none")': '' }] 
          }] 
        }]
      }
    ]);
    myModal.render(vu => {

      let btn = {};
      btn.left = vu.$el('@btn-left');
      btn.right = vu.$el('@btn-right');

      vu.$el('@lightbox').css({
        display: 'none',
        position: 'fixed',
        width: '100%',
        height: '100vh',
        margin: '0',
        padding: '0',
        overflow: 'auto',
        'background-color': 'rgba(0,0,0, 0.88)',
        'z-index': '10000'
      }).off('click').on('click', e => {

        // Fade out the modal, and unfreeze <body>
        vu.$el('@lightbox').fadeOut(200);
        $('body').css('overflow', 'auto');
      });

      // Modal CSS and click event
      vu.$el('@modal').css({
        display: 'table',
        position: 'relative',
        width: '100%',
        'max-width': '540px',
        'min-height': '1px',
        margin: '100px auto',
        padding: '16px',
        'background-color': '#fff'
      }).off('click').on('click', e => {
        e.stopPropagation();
      });
      
      // Main CSS
      vu.$el('@main').css({
        display: 'block',
        width: '100%',
        'max-height': '348px',
        overflow: 'auto'
      });

      // Buttons CSS
      ['left', 'right'].map(key => {
        btn[key].css(css.btn)
          .css('float', key)
          .css('display', 'none')
          .off('mouseenter').on('mouseenter', e => {
            btn[key].css({
              'box-shadow': '0px 6px 9px 0 rgba(0, 0, 0, .4)'
            });
          })
          .off('mouseleave').on('mouseleave', e => {
            btn[key].css({
              'box-shadow': '0px 4px 6px 0 rgba(0, 0, 0, .4)'
            });
          })
      });

      switch (vu.get('useBtn')) {
        case 'right':
        case 'left':
          vu.$el('@btns').show();
          vu.$el('@btn-' + vu.get('useBtn')).show();
          break;
        case 'both':
          vu.$el('@btns').show();
          vu.$el('@btn-left').show();
          vu.$el('@btn-right').show();
          break;
        default:
          vu.$el('@btns').hide();
          vu.$el('@btn-left').hide();
          vu.$el('@btn-right').hide();
      }

    }); // end of myModal.render
    
    myModal = myModal.build({
      sel: 'body',
      method: 'prepend'
    });

    let openModal = function() {
      // Show the modal, and freeze <body>
      myModal.$el().fadeIn(200);
      $('body').css('overflow', 'hidden');
    };

    let closeModal = function() {
      myModal.$el('@lightbox').click();
    };

    // Built-in Views
    let modalViews = Cope.views(),
        textInputView = modalViews.class('text'),
        fileInputView = modalViews.class('file');

    // View - text
    // @value
    // - type: string, "input" or "textarea"
    // - label: string
    // - placeholder: string
    // - value: string
    // - btn: string, button text
    // "value" <- string, value of the input
    textInputView.dom(vu => [
      { 'div(style="font-size:16px;")': [
        { 'label': '' },
        ((vu.val('type') === 'textarea') 
        ? { 'textarea@value(rows="1" style="line-height:16px")': '' }
        : { 'input@value(type="text" style="line-height:16px"))': '' })] 
      }
    ]);
    textInputView.render(vu => {

      let $ta = vu.$el('@value'),
          $btn = myModal.$el('@btn-right');

      // Use the right button
      myModal.val('useBtn', 'right');
      
      vu.use('label').then(v => {
        vu.$el('label').text(v.label);
      });
      vu.use('value').then(v => {
        $ta.val(v.value);
      });
      vu.use('placeholder').then(v => {
        $ta.prop('placeholder', v.placeholder);
      });

      $ta.off('keyup').on('keyup', () => {
        let n = $ta.val().match(/\n/g);
        n = n ? n.length : 0;
        $ta[0].style.height = (32 + 16 * n) + 'px';

        vu.set('value', $ta.val().trim());
      });

      // Trigger a keyup event
      $ta.keyup();

      // Set the button
      $btn.html(vu.val('btn') || 'Done')
        .off('click').on('click', e => {
          debug('Cope.modal', vu.get('value'));
          vu.res('value', vu.get('value'));
          closeModal();
        });
    }); // end of "text"

    // View - file
    // @dropzone: div, where we drop and preview files
    // @btn-choose: div, choose button
    // @btn-upload: div, upload button
    // - type: string, 'image' || 'video' || 'audio'
    // - maxWidth: number, for image compression
    // - saveOriginal: boolean, decide whether to save the original
    // - files: array of object, { 
    //   file: originalFile,
    //   thumb: compressed file
    // }
    // "upload" <- array: array of { file, thumb }
    fileInputView.dom(vu => [
      { 'div@dropzone(style="margin-right:-14px;")': '' },
      { 'input(type="file" multiple style="display:none; position:fixed; top:-10000px")': '' }
    ]);
    fileInputView.render(vu => {
      myModal.val('useBtn', 'both');

      let $left = myModal.$el('@btn-left'),
          $right = myModal.$el('@btn-right'),
          maxWidth = vu.get('maxWidth'),
          files = [], // [fileObj]
          grids = []; // Grid views

      if (isNaN(maxWidth)) {
        maxWidth = 200; // default max width
      }

      // Private views
      let Grid = Cope.views().class('PreviewGrid');
      Grid.dom(vu => [{ div: '' }]);
      Grid.render(vu => {
        vu.$el().css({
          'display': 'block',
          'position': 'relative',
          'width': '160px',
          'height': '160px',
          'margin-right': '14px',
          'margin-bottom': '14px',
          'overflow': 'hidden',
          'float': 'left',
          'background-color': '#eee',
          'background-repeat': 'no-repeat',
          'background-position': '50% 50%',
          'background-size': 'cover'
        });

        // TBD: Show the progress
        let progress = vu.get('progress');
      });

      // To compress and preview image
      let previewImage = function(file, grid, callback) {
        let reader = new FileReader();
        reader.onload = function(e) {

          let img = new Image();
          img.onload = function() {

            // Compress the image
            let thumb = Cope.Util.thumbnailer(img, maxWidth);
            thumb.onload = function() {
              let thumbDataURL = thumb.canvas.toDataURL(file.type);
              let thumbFile = dataURItoBlob(thumbDataURL);
            
              // Preview image wrap
              grid.$el().css('background-image', 'url(' + thumbDataURL + ')');
              
              grid.set('file', {
                file: file,
                thumbFile: thumbFile,
                image: e.target.result,
                thumbImage: thumbDataURL
              });

              // Callback with grid
              callback(grid);
            }; // end of thumb.onload
            thumb.onprogress = function(progress) {
              grid.val('progress', progress);
            }; // end of thumb.onprogress
          }; // end of img.onload
          
          // Load the image after onload function is assigned
          img.src = e.target.result;

        }; // end of reader.onload

        reader.readAsDataURL(file);
      }; // end of previewImage

      let addFile = function(grids, file, callback) {
        let fileObj = {},
            fileType;

        fileObj.file = file;

        if (file.type.slice(0, 5) === 'image') {
          fileType = 'image'
        } else {

          // Not valid
          return grids;
        } 

        // Append to @dropzone
        let grid = Grid.build({
          sel: vu.$el('@dropzone'),
          method: 'append',
          data: { idx: grids.length }
        });

        // Preview the file
        switch (fileType) {
          case 'image':
            previewImage(file, grid, callback);
            break;
        }

        // Append to grid views array
        grids = grids.concat(grid);
        return grids;
      }; // end of addFile

      // File input onchange
      vu.$el('input').off('change').on('change', e => {
        let tmpFiles = vu.$el('input').get(0).files;

        // Add to files
        for (let i = 0; i < tmpFiles.length; i++) {
          grids = addFile(grids, tmpFiles[i], grid => {
            
            // Update files
            let fileObj = grid.get('file'); // { file, thumb, ... }
            let idx = grid.get('idx');
            files = files.slice(0, idx)
              .concat(fileObj)
              .concat(files.slice(idx));
            vu.set('files', files);
          });
        } // end of for
      }); // end of on change

      // Buttons click events
      $left.html('Choose')
        .off('click').on('click', e => {
          // Trigger the file input
          vu.$el('input').click();
        }); // end of $left.onclick

      $right.html('Upload')
        .off('click').on('click', e => {
          closeModal();
          vu.res('upload', vu.get('files'));
        });
    }); // end of fileInputView.render

    // name: string, the desired View name
    // params: object, the params to pass in
    let modal = function(name, params) {
      if (typeof name != 'string' || (params && typeof params != 'object')) {
        return;
      }

      let Class = modalViews.class(name);
      if (Class) {
        myModal.val('useBtn', 'none');
        let vu = Class.build({
          sel: myModal.sel('@main'),
          data: params || {}
        });
        openModal();
        return vu;
      }
    };

    return modal;
  }(); // end of Cope.modal

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
  // functions used by Cope.user, 
  // Cope.Apps and Cope.graph
  // 
  // Cope.user
  // Cope.Apps
  // Cope.app(<id>) = Cope.Apps.get(<id>)
  // Cope.graph(<id>) = Cope.app(<id>).graph()
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

  // Get or init firebase instance
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
              console.error(err);
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

    // TBD
    user.addPartner = function(_appId, _email, _toAdd) {
      let done = function() {};
      findUser(_email, function(_foundUser) {
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
      getFB().then(fb => {
        debug('user sign out')
        fb.auth().signOut();
      });
    };

    // Set email, uid
    user.email = _user.email;
    user.uid = _user.uid;
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
  
  // -----------------------------
  // Cope.user
  // -----------------------------
  Cope.user = getUser;

  // -----------------------------
  // Cope.Apps
  // -----------------------------
  Cope.Apps = {};

  // Cope.app: App Interface
  Cope.Apps.get = Cope.app = function(_id) {
    if (typeof _id != 'string') return;

    let appRef = function(_fb) {
      return _fb.database().ref('cope_user_apps').child(_id);
    };

    let app = {};
    app.appId = _id;
    app.isOwner = false;

    // TBD: Test with app.init
    app.init = function() {
      return new Promise(function(res, rej) {
        Cope.user().then(user => {
          user.cred('apps').then(v => {
            let o = {};
            o[user.uid] = true; 

            // Assign the user as the owner
            Cope.app(app.appId).cred.set('owner', o).then(() => {
              
              // Also assign the user as one of the partners
              Cope.app(app.appId).cred.set('partners', o).then(() => {
                let u = v || {};
                u[app.appId] = true;
                user.cred('apps', u).then(() => {
                  res();
                });  
              }); // add user to partners
            }); // assign user as owner
          }); // end of user.cred('apps')
        }); // end of Cope.user().then  
      }); // end of new Promise
    }; // end of app.init

    app.del = function(_confirm) {
      return new Promise(function(res, rej) {
        if (_confirm === true) {
          Cope.user().then(user => {
            user.cred('apps').then(v => {
              // Remove the app from user's apps
              let u = v || {};
              u[app.appId] = null;
              user.cred('apps', u).then(() => {

                // TBD: Remove everything...
                // Currently we just remove owner
                Cope.app(app.appId).cred.set('owner', null).then(() => {
                  res();
                });
              }); // end of using user.cred to set the app
            }); // end of using user.cred to get apps
          }); // end of Cope.user().then
        } else {
          console.warn('Lack of confirmation: failed to delete app ' + app.appId);
          rej();
        } 
      }); // end of new Promise
    }; // end of app.del

    // app.graph
    app.graph = function () {
      return Cope.graph(app.appId);
    };
    
    // app.set
    app.set = function(_key, _val) {
      let done;
      getFB().then(fb => {
        appRef(fb).child('public').child(_key).set(_val).then(() => {
          if (isFunc(done)) done();
        });
      });
      return {
        then: function(_cb) { done = _cb; }
      };
    }; // end of app.set

    // app.get
    app.get = function(_key) {
      let done;
      getFB().then(fb => {
        appRef(fb).child('public').child(_key).once('value').then(snap => {
          if (isFunc(done)) done(snap.val());
        });
      });
      return {
        then: function(_cb) { done = _cb; }
      };
    }; // end of app.get
    
    // app.cred
    app.cred = {};
    
    // app.cred.set
    app.cred.set = function(_key, _val) {
      let done;
      getFB().then(fb => {
        appRef(fb).child('credentials').child(_key).set(_val).then(() => {
          if (isFunc(done)) done();
        });
      });
      return {
        then: function(_cb) { done = _cb; }
      };
    }; // end of app.cred.set

    // app.cred.get
    app.cred.get = function(_key) {
      let done;
      getFB().then(fb => {
        appRef(fb).child('credentials').child(_key).once('value').then(snap => {
          if (isFunc(done)) done(snap.val());
        });
      });
      return {
        then: function(_cb) { done = _cb; }
      };
    }; // end of app.cred.get

    return app;
  }; // end of Cope.app

  // To list my apps
  //Cope.Apps.list = function() { 
  //  return {
  //    then: function(_cb) {
  //      if (!isFunc(_cb)) return;

  //      getUser().then(user => {
  //        user.val('own_apps').then(myApps => {
  //          if (!myApps) {
  //            return _cb([]);
  //          } 
  //          return _cb(Object.keys(myApps).map(appId => Cope.app(appId)));
  //        }); // end of user.val('own_apps')
  //      }); // end of getUser
  //    }
  //  };
  //}; // end of Cope.Apps.list

  //Cope.Apps.remove = {};

  // -----------------------------
  // Cope.graph or Cope.appGraph
  // -----------------------------
  Cope.graph = Cope.appGraph = function(_appId) {

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
      // TBD: Perhaps use App.val instead
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
  }; // end of Cope.graph

  window.Cope = Cope;

})(jQuery);
