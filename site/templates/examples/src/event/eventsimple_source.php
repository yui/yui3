<script>

(function() {
	
//A function that pops up a "Hello World" alert:
var helloWorld = function(e) {
	YAHOO.log("helloWorld function firing.", "info", "example");
	alert("Hello World!");
}

//subscribe the helloWorld function as an event
//handler for the click event on the container
//div:
YAHOO.util.Event.addListener("container", "click", helloWorld);

//A function that pops up an alert and
//prevents the default behavior of the event
//for which it is a handler:
var interceptLink = function(e) {
	YAHOO.util.Event.preventDefault(e);
	YAHOO.log("You clicked on the second YUI link.", "info", "example");
	alert("You clicked on the second YUI link.");
}

//subscribe our interceptLink function
//as a click handler for the second anchor
//element:
YAHOO.util.Event.addListener("secondA", "click", interceptLink);

//log message to indicate that the example is ready:
YAHOO.log("When you begin interacting with the example at left, you'll see log messages appear here.", "info", "example");

})();
</script>

<style>
#container {background-color:#00CCFF; border:1px dotted black; padding:1em; cursor:pointer;}
</style>
<div id="container">
<p>Click for Hello World alert.</p>
</div>
	<p><a href="http://developer.yahoo.com/yui" id="firstA">The YUI Library. (Link navigates away from page.)</a></p>
	<p><a href="http://developer.yahoo.com/yui" id="secondA">The YUI Library. (Link's default behavior is suppressed.)</a></p>