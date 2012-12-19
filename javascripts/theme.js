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

/**
 * Pixel Cookers script for Redmine
 * author: Ludovic Meyer, Pixel Cookers - http://www.pixel-cookers.com
 * v1.3
 */
(function($, document, undefined) {
	$(document).ready(function() {
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
	});

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