Simple YUI

    The simpleyui.js file is a rollup of commonly used YUI modules delivered with a global Y instance 
	to which all included functionality is attached.
	
	The intended usage of this file is to provide the simplest possible starting point for using YUI 3.
	It supports the following usage pattern:
	
	<script src="http://yui.yahooapis.com/3.2.0/build/simpleyui/simpleyui.js"></script>
	<script>
		Y.one("#foo").on("click", function(e) {
			//handle click
		});
	</script>
	
    Simple YUI bundles the following modules:

		yui
		oop
		dom
		event-custom
		event-base
		pluginhost
		node
		event-delegate
		io-base
		json-parse
		transition
		selector-css3
		dom-style-ie

	You can add functionality to the global Y instance at any time, drawing from any module in the YUI 3, 
	YUI 3 Gallery, or YUI 2-in-3 project:
	
	<script>
		Y.use("slider", function(Y) {
			
			// Create a horizontal Slider 300px wide with values from -100 to 100
			var slider = new Y.Slider({
			    length : 300,
			    min    : -100,
			    max    : 100
			});

		})
	</script>
	

RELEASE NOTES
	
	3.3.0
	  * No changes

	3.2.0
	  * Initial release
