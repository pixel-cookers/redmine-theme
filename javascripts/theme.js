Event.observe(window, 'load', function() {
	var sidebar_btn = new Element('div', { 'id': 'sidebar_btn', onclick: 'toogle_sidebar();' }).update("&nbsp;");
	$('content').appendChild(sidebar_btn);
});


function toogle_sidebar(){
	//$('sidebar').toggle();
	$('main').toggleClassName('nosidebar');
}