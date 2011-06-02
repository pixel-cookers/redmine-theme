/**
 * Pixel Cookers script for Redmine
 * author: Ludovic Meyer, Pixel Cookers - http://www.pixel-cookers.com
 * v1.3
 */

Event.observe(window, 'load', function() {
	var sidebar_btn = new Element('div', { 'id': 'sidebar_btn', onclick: 'toogle_sidebar();' }).update("&nbsp;");
	var elem = $$('#main:not(.nosidebar) #sidebar')[0];
	
	var cookie = new Cookies();
	
	if(elem != undefined){
		elem.insert({'before' : sidebar_btn});
		if (cookie.get('hide_sidebar')=='yes') {
			$('main').toggleClassName('nosidebar');
		}	
	}
});

function toogle_sidebar(){
	$('main').toggleClassName('nosidebar');
	
	var cookie = new Cookies();
	if($('main').hasClassName('nosidebar')){
		cookie.set('hide_sidebar', 'yes');
	}else{
		cookie.set('hide_sidebar', 'no');
	}
}

var Cookies = Class.create({
    initialize: function(path, domain) {
        this.path = path || '/';
        this.domain = domain || null;
    },
    // Sets a cookie
    set: function(key, value, days) {
        if (typeof key != 'string') {
            throw "Invalid key";
        }
        if (typeof value != 'string' && typeof value != 'number') {
            throw "Invalid value";
        }
        if (days && typeof days != 'number') {
            throw "Invalid expiration time";
        }
        var setValue = key+'='+escape(new String(value));
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            var setExpiration = "; expires="+date.toGMTString();
        } else var setExpiration = "";
        var setPath = '; path='+escape(this.path);
        var setDomain = (this.domain) ? '; domain='+escape(this.domain) : '';
        var cookieString = setValue+setExpiration+setPath+setDomain;
        document.cookie = cookieString;
    },
    // Returns a cookie value or false
    get: function(key) {
        var keyEquals = key+"=";
        var value = false;
        document.cookie.split(';').invoke('strip').each(function(s){
            if (s.startsWith(keyEquals)) {
                value = unescape(s.substring(keyEquals.length, s.length));
                throw $break;
            }
        });
        return value;
    },
    // Clears a cookie
    clear: function(key) {
        this.set(key,'',-1);
    },
    // Clears all cookies
    clearAll: function() {
        document.cookie.split(';').collect(function(s){
            return s.split('=').first().strip();
        }).each(function(key){
            this.clear(key);
        }.bind(this));
    }
});