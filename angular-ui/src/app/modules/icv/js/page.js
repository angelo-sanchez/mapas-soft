(function($) {
  "use strict"; // Start of use strict
  
  

  
  
  $(document).ready(function() {
	  
	$('#myModal').on('shown.bs.modal', function () {
		$('.slider').slick("refresh");
	});
	  
    $('.slider').slick({
	  fade: true,
		 arrow: true,
		 dots: true,
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: false,
		  responsive: [
		    {
		      breakpoint: 1366,
		      settings: {
		        arrows: true,
		        slidesToShow: 1
		      }
		    },
		    {
		    	breakpoint: 767,
		    	settings: {
		    		arrows: false,
		    		slidesToShow: 1
		    	}
		    },
		    {
		      breakpoint: 320,
		      settings: {
		        arrows: false,
		        slidesToShow: 1
		      }
		    }
		  ]
	});

});
  
  
 
  
})(jQuery); // End of use strict