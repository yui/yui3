
    
<script language="javascript">

YUI().use('node', function(Y) {
        
    //A function that pops up a "Hello World" alert:
    var helloWorld = function(e) {
        Y.log("helloWorld function firing.", "info", "example");
        alert("Hello World!");
    }

    //subscribe the helloWorld function as an event
    //handler for the click event on the container
    //div:
    Y.on("click", helloWorld, "#container");

    //A function that pops up an alert and
    //prevents the default behavior of the event
    //for which it is a handler:
    var interceptLink = function(e) {
        e.preventDefault();
        Y.log("You clicked on the second YUI link.", "info", "example");
        alert("You clicked on the second YUI link.  Because *preventDefault* was called, this link will not navigate away from the page.");
    }

    //subscribe our interceptLink function
    //as a click handler for the second anchor
    //element:
    Y.on("click", interceptLink, "#secondA");

    //log message to indicate that the example is ready:
    Y.log("When you begin interacting with the example at left, you'll see log messages appear here.", "info", "example");
});

</script>

<div id="container">
<p>Click for Hello World alert.</p>
</div>
	<p><a href="http://developer.yahoo.com/yui" id="firstA">The YUI Library. (Link navigates away from page.)</a></p>

	<p><a href="http://developer.yahoo.com/yui" id="secondA">The YUI Library. (Link's default behavior is suppressed.)</a></p>
