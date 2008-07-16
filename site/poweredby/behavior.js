/*behavior layer for /yui/examples/index.html */
(function() {
	var Event = YAHOO.util.Event;
	/**
	 * Custom button state handler for enabling/disabling button state. 
	 * Called when the carousel has determined that the previous button
	 * state should be changed.
	 * Specified to the carousel as the configuration
	 * parameter: prevButtonStateHandler
	 **/
	var handlePrevButtonState = function(type, args) {
	
		var enabling = args[0];
		var leftImage = args[1];
		if(enabling) {
			leftImage.src = "http://billwscott.com/carousel/images/up-enabled.gif";//"http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/carousel/left-enabled.gif";	
		} else {
			leftImage.src = "http://billwscott.com/carousel/images/up-disabled.gif";//"http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/carousel/left-disabled.gif";	
		}
		
	};
	
	/**
	 * Custom button state handler for enabling/disabling button state. 
	 * Called when the carousel has determined that the next button
	 * state should be changed.
	 * Specified to the carousel as the configuration
	 * parameter: nextButtonStateHandler
	 **/
	var handleNextButtonState = function(type, args) {
	
		var enabling = args[0];
		var rightImage = args[1];
		
		if(enabling) {
			rightImage.src = "http://billwscott.com/carousel/images/down-enabled.gif";//"http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/carousel/right-enabled.gif";
		} else {
			rightImage.src = "http://billwscott.com/carousel/images/down-disabled.gif";//"http://us.i1.yimg.com/us.yimg.com/i/ydn/yuiweb/img/carousel/right-disabled.gif";
		}
		
	};
	
	/**
	 * You must create the carousel after the page is loaded since it is
	 * dependent on an HTML element (in this case 'mycarousel'.) See the
	 * HTML code below.
	 **/
	var pageLoad = function() 
	{
		var carousel = new YAHOO.extension.Carousel("mycarousel", 
			{
				numVisible:        1,
				animationSpeed:   .27,
				scrollInc:         1,
				navMargin:         0,
				prevElement:     "prev-arrow",
				nextElement:     "next-arrow",
				size:              7,
				orientation:     "vertical",
				prevButtonStateHandler:   handlePrevButtonState,
				nextButtonStateHandler:   handleNextButtonState
			}
		);
	};
	
	Event.onContentReady('mycarousel', pageLoad);
	
})();