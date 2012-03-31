$(document).ready(function(){
	$('.thumbnails a').colorbox({rel:'gal'});

	$(window).scroll(function() {
		if($(this).scrollTop() > 0){
			$('.navbar').fadeIn('slow');
		} else {
			$('.navbar').fadeOut('slow');
		}
	});
});
