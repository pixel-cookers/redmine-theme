/**
 * Pixel Cookers script for Redmine
 * author: Ludovic Meyer, Pixel Cookers - http://www.pixel-cookers.com
 * v3.0
 */
(function($, document, undefined) {
  $(document).ready(function() {
    var cfg = {
      "stopwatch.enabled": true,
      "stopwatch.precision": 2,
      "autofocus.time_entry": true
    };

    // Sidebar

    var sidebar_btn = $('<div id="sidebar_btn">&nbsp;</div>'),
        elem = $('#main:not(.nosidebar) #sidebar');

    sidebar_btn.on('click', toggle_sidebar);

    if (elem != undefined){
      elem.before(sidebar_btn);
      if ($.cookie('hide_sidebar') == 'yes'){
        $('#main').toggleClass('nosidebar');
      }
    }

    // Repositories

    $('.controller-repositories .entry a[href$=".SyncTrash"], .controller-repositories .entry a[href$=".SyncID"], .controller-repositories .entry a[href$=".SyncIgnore"], .controller-repositories .entry a[href$=".SyncArchive"]').parent().parent().remove();

    // Time entry

    if(cfg['autofocus.time_entry']) {
      if($('.controller-timelog.action-new').length > 0) {
        console.log('test');
        $('#time_entry_hours').focus();
      }
    }

    injectViewportMetaTag();
    injectAppleTouchIcons();

    // Shortcuts

    key.filter = function(event){
	  var tagName = (event.target || event.srcElement).tagName;
	  key.setScope(/^(INPUT|TEXTAREA|SELECT)$/.test(tagName) ? 'input' : 'other');
	  return true;
	}

    key('ctrl+enter', 'input', function(){
      console.log('submit');
      if($("#issue-form").length) {
        console.log('#issue-form submit');
        $("#issue-form").submit();
      }
      return false 
    });
    key('left', 'other', function(){ 
      if($('.next-prev-links.contextual a').length == 2) {
      	$('.next-prev-links.contextual a')[0].click();
      }
      if($('.next-prev-links.contextual a').length == 1 && $('.next-prev-links.contextual .position + a').length == 0) {
      	$('.next-prev-links.contextual a')[0].click();
      }
      return false 
    });
    key('right', 'other', function(){ 
      if($('.next-prev-links.contextual a').length == 2) {
      	$('.next-prev-links.contextual a')[1].click();
      }
      if($('.next-prev-links.contextual a').length == 1 && $('.next-prev-links.contextual .position + a').length == 1) {
      	$('.next-prev-links.contextual a')[0].click();
      }
      return false 
    });

    // Stopwatch

    if(cfg['stopwatch.enabled']) {
      var stopwatchContainer = $(document.createElement('div')).attr('class', 'stopwatch-container');
      var runBtn = $(document.createElement('button')).attr('type', 'button').attr('id', 'stopwatch-run').attr('class', 'btn greydient').attr('value', 'Play').html('Play');
      var stopwatch = $(document.createElement('span')).attr('id', 'stopwatch').attr('class', 'icon icon-time');
      $('#time_entry_hours').parent().append(stopwatchContainer);
      stopwatchContainer.append(stopwatch).append(runBtn);
      stopwatch.html('00:00:00');

      $('#stopwatch-run').on('click', function(){
        var num = checkDecimal($('#time_entry_hours').attr('value'))*3600000;
        stopwatch.stopwatch({startTime: num}).stopwatch('toggle');
        stopwatch.bind('tick.stopwatch', function(e, elapsed){
          var num = elapsed/3600000;
          $('#time_entry_hours').attr('value', num.toFixed(cfg['stopwatch.precision']));
        })

        if($(this).attr('value') == 'Play') {
          $(this).attr('value', 'Pause').html('Pause');
        } else {
          $(this).attr('value', 'Play').html('Play');
        }

        return false;
      });

      $('#time_entry_hours').on('keyup', function(){
        stopwatch.html(makeTime(this.value));
      })
    }
  });

  function toggle_sidebar(){
    $('#main').toggleClass('nosidebar');
    if($('#main').hasClass('nosidebar')){
      $.cookie('hide_sidebar', 'yes', {path: '/'});
    }else{
      $.cookie('hide_sidebar', 'no', {path: '/'});
    }
  }

  function injectViewportMetaTag(){
    var meta = $(document.createElement('meta'));
    meta.attr('name', 'viewport');
    meta.attr('content', 'width=device-width, initial-scale=1');
    $('head').append(meta);
  }

  var scripts = document.getElementsByTagName("script"),
      src = scripts[scripts.length-1].src;
  src = src.split('/');
  src = src[src.length-3];

  function injectAppleTouchIcons(){
    var link = $(document.createElement('link'));
    link.attr('rel', 'apple-touch-icon');
    link.attr('href', '/themes/'+src+'/images/touch/apple-touch-icon.png');
    $('head').append(link);

    link = $(document.createElement('link'));
    link.attr('rel', 'apple-touch-icon');
    link.attr('href', '/themes/'+src+'/images/touch/apple-touch-icon-72x72-precomposed.png');
    link.attr('sizes', '72x72');
    $('head').append(link);

    link = $(document.createElement('link'));
    link.attr('rel', 'apple-touch-icon');
    link.attr('href', '/themes/'+src+'/images/touch/apple-touch-icon-114x114-precomposed.png');
    link.attr('sizes', '114x114');
    $('head').append(link);
  }

  function leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
      output = '0' + output;
    }
    return output;
  }

  function checkDecimal(str) {
    if (!str) return 0;
    var ok = "";
    for (var i = 0; i < str.length; i++) {
      var ch = str.substring(i, i+1);
      if ((ch < "0" || "9" < ch) && ch != '.') {
        alert("Only numeric input is allowed!\n\n"
            + parseFloat(ok) + " will be used because '"
            + str + "' is invalid.\nYou may correct "
            + "this entry and try again.");
        return parseFloat(ok);
      }
      else ok += ch;
    }
    return parseFloat(str);
  }

  function makeTime(value) {
    var num = (checkDecimal(value)); // validates input
    if (num) {
      var hour = parseInt(num);
      num -= parseInt(num);
      num=num.toFixed(13)
      num *= 60;

      var min = parseInt(num);
      num -= parseInt(num);
      num=num.toFixed(13)
      num *= 60;
      var sec = parseInt(num);
      return leftPad(hour, 2) + ':' + leftPad(min, 2) + ':' + leftPad(sec, 2);
    } else {
      return '00:00:00';
    }
  }

})(jQuery, document);

/*!
 * jQuery Cookie Plugin v1.3
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function ($, document, undefined) {

  var pluses = /\+/g;

  function raw(s) {
    return s;
  }

  function decoded(s) {
    return decodeURIComponent(s.replace(pluses, ' '));
  }

  var config = $.cookie = function (key, value, options) {

    // write
    if (value !== undefined) {
      options = $.extend({}, config.defaults, options);

      if (value === null) {
        options.expires = -1;
      }

      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }

      value = config.json ? JSON.stringify(value) : String(value);

      return (document.cookie = [
        encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
        options.path    ? '; path=' + options.path : '',
        options.domain  ? '; domain=' + options.domain : '',
        options.secure  ? '; secure' : ''
      ].join(''));
    }

    // read
    var decode = config.raw ? raw : decoded;
    var cookies = document.cookie.split('; ');
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      if (decode(parts.shift()) === key) {
        var cookie = decode(parts.join('='));
        return config.json ? JSON.parse(cookie) : cookie;
      }
    }

    return null;
  };

  config.defaults = {};

  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== null) {
      $.cookie(key, null, options);
      return true;
    }
    return false;
  };

})(jQuery, document);

/*
 * jQuery stopwatch
 * https://github.com/robcowie/jquery-stopwatch/blob/master/jquery.stopwatch.js
 */
(function( $ ){

  function incrementer(ct, increment) {
    return function() { ct+=increment; return ct; };
  }

  function pad2(number) {
    return (number < 10 ? '0' : '') + number;
  }

  function defaultFormatMilliseconds(millis) {
    var x, seconds, minutes, hours;
    x = millis / 1000;
    seconds = Math.floor(x % 60);
    x /= 60;
    minutes = Math.floor(x % 60);
    x /= 60;
    hours = Math.floor(x % 24);
    // x /= 24;
    // days = Math.floor(x);
    return [pad2(hours), pad2(minutes), pad2(seconds)].join(':');
  }

  //NOTE: This is a the 'lazy func def' pattern described at http://michaux.ca/articles/lazy-function-definition-pattern
  function formatMilliseconds(millis, data) {
    // Use jintervals if available, else default formatter
    var formatter;
    if (typeof jintervals == 'function') {
      formatter = function(millis, data){return jintervals(millis/1000, data.format);};
    } else {
      formatter = defaultFormatMilliseconds;
    }
    formatMilliseconds = function(millis, data) {
      return formatter(millis, data);
    };
    return formatMilliseconds(millis, data);
  }

  var methods = {

    init: function(options) {
      var defaults = {
        updateInterval: 1000,
        startTime: 0,
        format: '{HH}:{MM}:{SS}',
        formatter: formatMilliseconds
      };

      // if (options) { $.extend(settings, options); }

      return this.each(function() {
        var $this = $(this),
            data = $this.data('stopwatch');

        // If the plugin hasn't been initialized yet
        if (!data) {
          // Setup the stopwatch data
          var settings = $.extend({}, defaults, options);
          data = settings;
          data.active = false;
          data.target = $this;
          data.elapsed = settings.startTime;
          // create counter
          data.incrementer = incrementer(data.startTime, data.updateInterval);
          data.tick_function = function() {
            var millis = data.incrementer();
            data.elapsed = millis;
            data.target.trigger('tick.stopwatch', [millis]);
            data.target.stopwatch('render');
          };
          $this.data('stopwatch', data);
        }

      });
    },

    start: function() {
      return this.each(function() {
        var $this = $(this),
            data = $this.data('stopwatch');
        // Mark as active
        data.active = true;
        data.timerID = setInterval(data.tick_function, data.updateInterval);
        $this.data('stopwatch', data);
      });
    },

    stop: function() {
      return this.each(function() {
        var $this = $(this),
            data = $this.data('stopwatch');
        clearInterval(data.timerID);
        data.active = false;
        $this.data('stopwatch', data);
      });
    },

    destroy: function() {
      return this.each(function(){
        var $this = $(this),
            data = $this.data('stopwatch');
        $this.stopwatch('stop').unbind('.stopwatch').removeData('stopwatch');
      });
    },

    render: function() {
      var $this = $(this),
          data = $this.data('stopwatch');
      $this.html(data.formatter(data.elapsed, data));
    },

    getTime: function() {
      var $this = $(this),
          data = $this.data('stopwatch');
      return data.elapsed;
    },

    toggle: function() {
      return this.each(function() {
        var $this = $(this);
        var data = $this.data('stopwatch');
        if (data.active) {
          $this.stopwatch('stop');
        } else {
          $this.stopwatch('start');
        }
      });
    },

    reset: function() {
      return this.each(function() {
        var $this = $(this);
        data = $this.data('stopwatch');
        data.incrementer = incrementer(data.startTime, data.updateInterval);
        data.elapsed = data.startTime;
        $this.data('stopwatch', data);
      });
    }
  };


  // Define the function
  $.fn.stopwatch = function( method ) {
    if (methods[method]) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.stopwatch' );
    }
  };

})( jQuery );


//     keymaster.js
//     (c) 2011-2013 Thomas Fuchs
//     keymaster.js may be freely distributed under the MIT license.

;
(function(global) {
    var k,
    _handlers = {},
    _mods = {
        16: false,
        18: false,
        17: false,
        91: false
    },
    _scope = 'all',
        // modifier keys
        _MODIFIERS = {
            '⇧': 16,
            shift: 16,
            '⌥': 18,
            alt: 18,
            option: 18,
            '⌃': 17,
            ctrl: 17,
            control: 17,
            '⌘': 91,
            command: 91
        },
        // special keys
        _MAP = {
            backspace: 8,
            tab: 9,
            clear: 12,
            enter: 13,
            'return': 13,
            esc: 27,
            escape: 27,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            del: 46,
            'delete': 46,
            home: 36,
            end: 35,
            pageup: 33,
            pagedown: 34,
            ',': 188,
            '.': 190,
            '/': 191,
            '`': 192,
            '-': 189,
            '=': 187,
            ';': 186,
            '\'': 222,
            '[': 219,
            ']': 221,
            '\\': 220
        },
        code = function(x) {
            return _MAP[x] || x.toUpperCase().charCodeAt(0);
        },
        _downKeys = [];

    for (k = 1; k < 20; k++) _MAP['f' + k] = 111 + k;

    // IE doesn't support Array#indexOf, so have a simple replacement
    function index(array, item) {
        var i = array.length;
        while (i--) if (array[i] === item) return i;
        return -1;
    }

    // for comparing mods before unassignment
    function compareArray(a1, a2) {
        if (a1.length != a2.length) return false;
        for (var i = 0; i < a1.length; i++) {
            if (a1[i] !== a2[i]) return false;
        }
        return true;
    }

    var modifierMap = {
        16: 'shiftKey',
        18: 'altKey',
        17: 'ctrlKey',
        91: 'metaKey'
    };

    function updateModifierKey(event) {
        for (k in _mods) _mods[k] = event[modifierMap[k]];
    };

    // handle keydown event
    function dispatch(event) {
        var key, handler, k, i, modifiersMatch, scope;
        key = event.keyCode;

        if (index(_downKeys, key) == -1) {
            _downKeys.push(key);
        }

        // if a modifier key, set the key.<modifierkeyname> property to true and return
        if (key == 93 || key == 224) key = 91; // right command on webkit, command on Gecko
        if (key in _mods) {
            _mods[key] = true;
            // 'assignKey' from inside this closure is exported to window.key
            for (k in _MODIFIERS) if (_MODIFIERS[k] == key) assignKey[k] = true;
            return;
        }
        updateModifierKey(event);

        // see if we need to ignore the keypress (filter() can can be overridden)
        // by default ignore key presses if a select, textarea, or input is focused
        if (!assignKey.filter.call(this, event)) return;

        // abort if no potentially matching shortcuts found
        if (!(key in _handlers)) return;

        scope = getScope();

        // for each potential shortcut
        for (i = 0; i < _handlers[key].length; i++) {
            handler = _handlers[key][i];

            // see if it's in the current scope
            if (handler.scope == scope || handler.scope == 'all') {
                // check if modifiers match if any
                modifiersMatch = handler.mods.length > 0;
                for (k in _mods)
                if ((!_mods[k] && index(handler.mods, + k) > -1) || (_mods[k] && index(handler.mods, + k) == -1)) modifiersMatch = false;
                // call the handler and stop the event if neccessary
                if ((handler.mods.length == 0 && !_mods[16] && !_mods[18] && !_mods[17] && !_mods[91]) || modifiersMatch) {
                    if (handler.method(event, handler) === false) {
                        if (event.preventDefault) event.preventDefault();
                        else event.returnValue = false;
                        if (event.stopPropagation) event.stopPropagation();
                        if (event.cancelBubble) event.cancelBubble = true;
                    }
                }
            }
        }
    };

    // unset modifier keys on keyup
    function clearModifier(event) {
        var key = event.keyCode,
            k,
            i = index(_downKeys, key);

        // remove key from _downKeys
        if (i >= 0) {
            _downKeys.splice(i, 1);
        }

        if (key == 93 || key == 224) key = 91;
        if (key in _mods) {
            _mods[key] = false;
            for (k in _MODIFIERS) if (_MODIFIERS[k] == key) assignKey[k] = false;
        }
    };

    function resetModifiers() {
        for (k in _mods) _mods[k] = false;
        for (k in _MODIFIERS) assignKey[k] = false;
    };

    // parse and assign shortcut
    function assignKey(key, scope, method) {
        var keys, mods;
        keys = getKeys(key);
        if (method === undefined) {
            method = scope;
            scope = 'all';
        }

        // for each shortcut
        for (var i = 0; i < keys.length; i++) {
            // set modifier keys if any
            mods = [];
            key = keys[i].split('+');
            if (key.length > 1) {
                mods = getMods(key);
                key = [key[key.length - 1]];
            }
            // convert to keycode and...
            key = key[0]
            key = code(key);
            // ...store handler
            if (!(key in _handlers)) _handlers[key] = [];
            _handlers[key].push({
                shortcut: keys[i],
                scope: scope,
                method: method,
                key: keys[i],
                mods: mods
            });
        }
    };

    // unbind all handlers for given key in current scope
    function unbindKey(key, scope) {
        var multipleKeys, keys,
        mods = [],
            i, j, obj;

        multipleKeys = getKeys(key);

        for (j = 0; j < multipleKeys.length; j++) {
            keys = multipleKeys[j].split('+');

            if (keys.length > 1) {
                mods = getMods(keys);
            }

            key = keys[keys.length - 1];
            key = code(key);

            if (scope === undefined) {
                scope = getScope();
            }
            if (!_handlers[key]) {
                return;
            }
            for (i = 0; i < _handlers[key].length; i++) {
                obj = _handlers[key][i];
                // only clear handlers if correct scope and mods match
                if (obj.scope === scope && compareArray(obj.mods, mods)) {
                    _handlers[key][i] = {};
                }
            }
        }
    };

    // Returns true if the key with code 'keyCode' is currently down
    // Converts strings into key codes.
    function isPressed(keyCode) {
        if (typeof(keyCode) == 'string') {
            keyCode = code(keyCode);
        }
        return index(_downKeys, keyCode) != -1;
    }

    function getPressedKeyCodes() {
        return _downKeys.slice(0);
    }

    function filter(event) {
        var tagName = (event.target || event.srcElement).tagName;
        // ignore keypressed in any elements that support keyboard data input
        return !(tagName == 'INPUT' || tagName == 'SELECT' || tagName == 'TEXTAREA');
    }

    // initialize key.<modifier> to false
    for (k in _MODIFIERS) assignKey[k] = false;

    // set current scope (default 'all')
    function setScope(scope) {
        _scope = scope || 'all'
    };

    function getScope() {
        return _scope || 'all'
    };

    // delete all handlers for a given scope
    function deleteScope(scope) {
        var key, handlers, i;

        for (key in _handlers) {
            handlers = _handlers[key];
            for (i = 0; i < handlers.length;) {
                if (handlers[i].scope === scope) handlers.splice(i, 1);
                else i++;
            }
        }
    };

    // abstract key logic for assign and unassign
    function getKeys(key) {
        var keys;
        key = key.replace(/\s/g, '');
        keys = key.split(',');
        if ((keys[keys.length - 1]) == '') {
            keys[keys.length - 2] += ',';
        }
        return keys;
    }

    // abstract mods logic for assign and unassign
    function getMods(key) {
        var mods = key.slice(0, key.length - 1);
        for (var mi = 0; mi < mods.length; mi++)
        mods[mi] = _MODIFIERS[mods[mi]];
        return mods;
    }

    // cross-browser events
    function addEvent(object, event, method) {
        if (object.addEventListener) object.addEventListener(event, method, false);
        else if (object.attachEvent) object.attachEvent('on' + event, function() {
            method(window.event)
        });
    };

    // set the handlers globally on document
    addEvent(document, 'keydown', function(event) {
        dispatch(event)
    }); // Passing _scope to a callback to ensure it remains the same by execution. Fixes #48
    addEvent(document, 'keyup', clearModifier);

    // reset modifiers to false whenever the window is (re)focused.
    addEvent(window, 'focus', resetModifiers);

    // store previously defined key
    var previousKey = global.key;

    // restore previously defined key and return reference to our key object
    function noConflict() {
        var k = global.key;
        global.key = previousKey;
        return k;
    }

    // set window.key and window.key.set/get/deleteScope, and the default filter
    global.key = assignKey;
    global.key.setScope = setScope;
    global.key.getScope = getScope;
    global.key.deleteScope = deleteScope;
    global.key.filter = filter;
    global.key.isPressed = isPressed;
    global.key.getPressedKeyCodes = getPressedKeyCodes;
    global.key.noConflict = noConflict;
    global.key.unbind = unbindKey;

    if (typeof module !== 'undefined') module.exports = assignKey;

})(this);