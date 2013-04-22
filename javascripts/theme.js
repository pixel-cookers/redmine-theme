/**
 * Pixel Cookers script for Redmine
 * author: Ludovic Meyer, Pixel Cookers - http://www.pixel-cookers.com
 * v1.4
 */
(function($, document, undefined) {
	$(document).ready(function() {
		var cfg = {
			"password.length": 7,
			"password.special": false,
			"stopwatch.enabled": true,
			"stopwatch.precision": 2
		};

		var sidebar_btn = $('<div id="sidebar_btn">&nbsp;</div>'),
			elem = $('#main:not(.nosidebar) #sidebar');

		sidebar_btn.on('click', toggle_sidebar);

		if (elem != undefined){
			elem.before(sidebar_btn);
			if ($.cookie('hide_sidebar') == 'yes'){
				$('#main').toggleClass('nosidebar');
			}
		}

		injectViewportMetaTag();
		injectAppleTouchIcons();

		// Password generation in user creation
		var genContainer = $(document.createElement('p'));
		var genLabel = $(document.createElement('label'));
		var genBtn = $(document.createElement('button')).attr('type', 'button').attr('id', 'generate-password').attr('class', "btn greydient").text('Generate password');
		var useBtn = $(document.createElement('button')).attr('type', 'button').attr('id', 'use-password').attr('class', "btn greydient").text('Use password');
		var passFields = $('.controller-users.action-new #password_fields, .controller-users.action-create #password_fields, .controller-users.action-edit #password_fields');

		passFields.append(genContainer);
		genContainer.append(genLabel).append(genBtn).append(useBtn);
		useBtn.hide();


		genBtn.on('click', function(){
			var password = $.password(cfg['password.length'],cfg['password.special']);
			var info = passFields.find('.info');
			useBtn.fadeIn().attr('attr-value', password);
			info.html('Password generated : '+password);
			$('#user_password, #user_password_confirmation').val('');
			return false;
		});

		useBtn.on('click', function(){
			$('#user_password, #user_password_confirmation').val($(this).attr('attr-value'));
			$(this).fadeOut();
			return false;
		});

		if(cfg['stopwatch.enabled']) {
			var stopwatchContainer = $(document.createElement('div')).attr('class', 'stopwatch-container');
			var runBtn = $(document.createElement('button')).attr('type', 'button').attr('id', 'stopwatch-run').attr('class', 'btn greydient').html('value', 'Play').html('Play');
			var stopwatch = $(document.createElement('span')).attr('id', 'stopwatch').attr('class', 'icon icon-time');
			$('#time_entry_hours').parent().append(stopwatchContainer);
			stopwatchContainer.append(stopwatch).append(runBtn);
			stopwatch.html('00:00:00');


			$('#stopwatch-run').on('click', function(){
				stopwatch.stopwatch().stopwatch('toggle');
				stopwatch.bind('tick.stopwatch', function(e, elapsed){
					var num = elapsed/3600000;
					$('#time_entry_hours').attr('value', num.toFixed(cfg['stopwatch.precision']));
				})

				if($(this).attr('value') == 'Play') {
					$(this).attr('value', 'Pause').html('Pause');
				} else {
					$(this).attr('value', 'Play').html('Play');
				}

			    window.onbeforeunload = function (e) {
				    var e = e || window.event;
				    if (e) {
				        e.returnValue = 'You are running a timer.';
				    }
				    return 'You are running a timer.';
				};

				return false;
			});

			$('.controller-issues.action-show #issue-form input[type="submit"]').on('click', function(){
				window.onbeforeunload = function (e) {
				    var e = e || window.event;
				    if (e) {
				        e.returnValue = null;
				    }
				    return null;
				};
			});
		}

	});

	function get_theme_config() {

	}

	function toggle_sidebar(){
		$('#main').toggleClass('nosidebar');
		if($('#main').hasClass('nosidebar')){
			$.cookie('hide_sidebar', 'yes');
		}else{
			$.cookie('hide_sidebar', 'no');
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
 * Password generator
 * http://www.designchemical.com/blog/index.php/jquery/random-password-generator-using-jquery/
 */
$.extend({
	password: function (length, special) {
		var iteration = 0;
		var password = "";
		var randomNumber;
		if(special == undefined){
			var special = false;
		}
		while(iteration < length){
			randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
			if(!special){
				if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
				if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
				if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
				if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
			}
			iteration++;
			password += String.fromCharCode(randomNumber);
		}
		return password;
	}
});

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