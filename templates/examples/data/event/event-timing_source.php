
<!-- include event dependencies -->
<!--
<script type="text/javascript" src="<?php echo $buildpath ?>oop/oop-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>event/event-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>dom/dom-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildpath ?>node/node-debug.js"></script>
-->

<script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/oop/oop-debug.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/event/event-debug.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/dom/dom-debug.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/3.0.0pr1/build/node/node-debug.js"></script>



<div id="contentContainer">
<div id="demo"></div>

	<!--a ul with an arbitrarily large number of children:-->
	<ul>
		<?php
			for ($i=0; $i<100; $i++) {
				echo "<li id='li-$i'>child node #$i</li>\n";
			}
		?>
	</ul>

	<img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/large/uluru.jpg" width="500" alt="Uluru" id="image" />

</div>


<script language="javascript">


YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
function(Y) {

    var results = Y.get('#demo');

	//we'll use this handler for all of our callbacks; the
	//message being logged will always be the last argument.
	function fnHandler(e) {
		var message = arguments[arguments.length - 1];
		// Y.log(message, "info", "example");
        results.set('innerHTML', results.get('innerHTML') + '<p>' + message + '</p>');
	}

	//assign page load handler:
	Y.on("load", fnHandler, window, Y, "The window.onload event fired.  The page and all of its image data, including the large image of Uluru, has completed loading.");

	//assign event:ready handler:
	Y.on("event:ready", fnHandler, Y, "The onDOMReady event fired.  The DOM is now safe to modify via script.");
	
	//assign onContentReady handler:
	Y.Event.onContentReady("#contentContainer", fnHandler, "The onContentReady event fired for the element 'contentContainer'.  That element and all of its children are present in the DOM.");

	//assign onAvailable handler:
	Y.Event.onAvailable("#contentContainer", fnHandler, "The onAvailable event fired on the element 'contentContainer'.  That element is present in the DOM.");
	
	fnHandler("", "As the page loads, you'll see the onAvailable, onContentReady, event:ready, and window's load event logged here as they fire in sequence.");
	
});

</script>
