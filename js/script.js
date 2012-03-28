$(document).ready(function(){
	$('.media-grid a').colorbox({rel:'gal'});

	$(window).scroll(function() {
		if($(this).scrollTop() > 0){
			$('.topbar').fadeIn('slow');
		} else {
			$('.topbar').fadeOut('slow');
		}
	});


});
