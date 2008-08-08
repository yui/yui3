<h2 class="first">Source Code for This Example:</h2>

<h3>Markup:</h3>

<p>The markup used to create the DOM is very simple, consisting of a <code>&lt;div&gt;</code> that holds a <code>&lt;ul&gt;</code> with 100 child <code>&lt;li&gt;</code>s and a single ~3MB image. The <code>&lt;ul&gt;</code> will take a little time to load, and the image (loading over the internet) will take a few seconds to load even on a fast connection. That should allow us to see in the Logger console some time deltas between when the <code>&lt;div&gt;</code> whose ID is <code>contentContainer</code> becomes available, when its children (those 100 <code>&lt;li&gt;</code>s) are ready, when the DOM is ready (including all the navigation elements on the page), and lastly when the page loads (ie, when that ~3MB image is fully loaded). </p>
<textarea name="code" class="HTML" cols="60" rows="1"><div id="contentContainer">

	<!--a ul with an arbitrarily large number of children:-->
	<ul>
		<li>...</li>
		<!--...100 more of these-->
	</ul>

	<img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/large/uluru.jpg" width="500" alt="Uluru" id="image" />

</div></textarea>

<h3>CSS:</h3>

<p>The CSS colors the contentContainer element and hides the big list to keep the example more compact.</p>

<textarea name="code" class="JScript" cols="60" rows="1"><style type="text/css">
	#contentContainer {padding:1em; background:#999966;}
	#contentContainer ul {height:0px; overflow:hidden;}
</style></textarea>

<h3>JavaScript:</h3>
<p>In the script, we create an anonymous function that contains our YUI instance (<code>Y</code>).  We then subscribe to the four events in which we're interested and, in each case, log a message to the console or Logger to express the timing of the events as they fire.</p>

<textarea name="code" class="JScript" cols="60" rows="1">(function() {
YUI().use('*', function(Y) {

    var results = Y.get('#demo');

	//we'll use this handler for all of our callbacks; the
	//message being logged will always be the last argument.
	function fnHandler(e) {
		var message = arguments[arguments.length - 1];
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
	
});
})();</textarea>
