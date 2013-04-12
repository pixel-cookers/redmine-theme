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

/**
 * Pixel Cookers script for Redmine
 * author: Ludovic Meyer, Pixel Cookers - http://www.pixel-cookers.com
 * v1.3
 */
(function($, document, undefined) {
	$(document).ready(function() {
		var cfg = {
			"password.length": 7,
			"password.special": false
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
		var genBtn = $(document.createElement('input')).attr('id', 'generate-password').attr('type', "submit").attr('value', 'Generate password');
		var useBtn = $(document.createElement('input')).attr('id', 'use-password').attr('type', "submit").attr('value', 'Use password');
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