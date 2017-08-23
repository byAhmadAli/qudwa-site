$(document).ready(function() {
	// menu hover
	$('.nav-toggle').click(function(){
		$('.main-menu').toggleClass('active');
		$('body').toggleClass('menu-active');

	});
	$('#open-serach').click(function(){
		$('.search-overlay').show();
	});
	$('.close-popup').click(function(){
		$('.search-overlay').hide();
	});
	// slider
	var slider = function(selector, show, scroll, arrows, repeat){
		var slider = $(selector);
	    var direction = {}
	    direction.data = slider.data('direction');
	    direction.flag = false;
	    if(direction.data == "rtl"){
	        direction.flag = true;
	    }
	    slider.slick({
	        dots: false,
	        infinite: repeat,
	        speed: 1000,
	        slidesToShow: show,
	        slidesToScroll: scroll,
	        rtl: direction.flag,
	        prevArrow: $(arrows[0]),
	      	nextArrow: $(arrows[1]),
	        autoplay:true,
			infinite: true,
	        autoplaySpeed:5000,
	        responsive: [
			    {
			      breakpoint: 768,
			      settings: {
			        slidesToShow: 2,
			        slidesToScroll: 2,
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			        slidesToShow: 1,
			        slidesToScroll: 1,
			      }
			    }

			]
	    });
	    slider.animate({
	        opacity: 1
	    });
	}
	
	// agenda slider
	var agenda = new slider('.agenda-items', 3, 1, ['.icon-arrow-left', '.icon-arrow-right'], false);

})

$(function(){
	window.count = $(".count-down").countdown("2017/10/25", function(event) {
		$('.month .number').text(
			event.strftime('%-m')
		);
		$('.days .number').text(
			event.strftime('%-D')
		);
		$('.hours .number').text(
			event.strftime('%-H')
		);
		$('.minutes .number').text(
			event.strftime('%-M')
		);
		$('.seconds .number').text(
			event.strftime('%-S')
		);
	});

	function start() {
	  
	  var interval = setInterval(function() {
	  	var start = new Date('Wed Jul 19 2017 15:36:10 GMT+0300 (EEST)').getTime(), // Jan 1, 2015
	        end = new Date('Wed Jul 19 2017 15:39:10 GMT+0300 (EEST)').getTime(), // June 24, 2015
	        today = new Date(), // April 23, 2015
	        val = Math.round(((today - start) / (end - start)) * 100) + '%';
	    val = val > 100 ? 100 : val;
	    $("#box").css("width", val);
	    $("#box").text(val);
	    if (today >= end) {
	      clearInterval(interval);
	    }
	  }, 100);
	}

	//start()
});