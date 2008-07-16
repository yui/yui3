<h2 class="first">Using Custom Events</h2>

<p><a href="/yui/event/#customevent">Custom Events</a>, part of the <a href="http://developer.yahoo.com/yui/event/">YUI Event Utility</a>, are special developer-created events that express the occurance of and information about interesting moments taking place on a page.  Custom Events can be subscribed to by any script on the page; the publisher of the Custom Event knows nothing about the subscribers, and individual subscribers don't need to know anything about each other.</p>

<p>To illustrate the use of Custom Event, we'll create a single <code>&lt;div&gt;</code> called <code>resizer</code> that resizes itself when its container is clicked. When we resize this <code>&lt;div&gt;</code> we'll publish a Custom Event, <code>onSizeChange</code>, that reports the new height and width of our resizer. We will have two modules that subscribe to this information; the first will respond by changing its height to remain the same as the resizer's height and the second will change its width. </p>
<p>Start with some simple CSS rules and markup for the appearing elements:</p>
<textarea name="code" class="HTML" cols="60" rows="1"><style type="text/css">
#container {width:400px; height:100px; padding:10px; border:1px dotted black;background-color:#CCCCCC; cursor:pointer;}
#resizer {width:200px; height:75px; background-color:#00CCFF;}
#subscriberWidth {width:200px; height:75px; margin-top:10px;background-color:#CC9966;}
#subscriberHeight {width:200px; height:75px;  margin-top:10px;background-color:#FF3333;}
</style>

<div id="container">
  <div id="resizer">
  	Click anywhere within the grey box 
	to resize me.
  </div>
</div>
<div id="subscriberWidth">
  <strong>Width will resize to match blue 
  box.</strong>
</div>
<div id="subscriberHeight">
  <strong>Height will resize to match blue
  box.</strong>
</div></textarea>

<p>Next, we'll compose our script. We begin by creating our Custom Event instance. We'll <code>fire()</code> this Custom Event &mdash; that is, call its <code>fire</code> method &mdash; when our click handler executes and changes <code>resizer</code>'s width.</p>

<textarea name="code" class="JScript" cols="60" rows="1">//create a new custom event, to be fired
//when the resizer div's size is changed
var onSizeChange = new YAHOO.util.CustomEvent("onSizeChange");</textarea>


<p>Our click handler, to be fired when the grey container <code>&lt;div&gt;</code> is clicked, performs a number of housekeeping tasks like figuring out the new size of the <code>resizer</code> element, making sure that a minimum size is maintained, etc. Note that it only fires the Custom Event if the click will result in a sane value for <code>resizer</code>'s height or width.  Line 35 below is where we ultimately fire the Custom Event. We pass in the new height and width of <code>resizer</code> as an argument when we fire the Custom Event because we want our subscribers to have access to that information.</p>
<textarea name="code" class="JScript" cols="60" rows="1">	//when the container is clicked on, change the 
//dimensions of the resizer -- as long as it appears
//to be a valid new size (>0 width, >12 height).
function fnClick(e){
	//0,0 point is the top left corner of the container,
	//minus its padding:
	var containerX = YAHOO.util.Dom.getX("container");
	var containerY = YAHOO.util.Dom.getY("container");
	var clickX = YAHOO.util.Event.getPageX(e);
	var clickY = YAHOO.util.Event.getPageY(e);
	//get container padding using Dom's getStyle():
	var containerPaddingX = parseInt(YAHOO.util.Dom.getStyle("container","padding-left"), 10);
	var containerPaddingY = parseInt(YAHOO.util.Dom.getStyle("container","padding-top"), 10);
	var newWidth = clickX - containerX - containerPaddingX;
	var newHeight = clickY - containerY - containerPaddingY;
	
	//if there is a valid new dimension, we'll change
	//resizer and fire our custom event
	if ((newWidth > 0)||(newHeight > 12)) {
		//correct new height/width to guarantee
		//minimum of 0x12	
		if (newWidth < 0) {newWidth = 1;}
		if (newHeight < 12) {newHeight = 12;}
		//show new dimensions in resizer:
		YAHOO.util.Dom.get("resizer").innerHTML = "New size: " + newWidth + "x" + newHeight;
		//change the dimensions of resizer, using
		//Dom's setStyle:
		YAHOO.util.Dom.setStyle("resizer", "width", newWidth + "px");
		YAHOO.util.Dom.setStyle("resizer", "height", newHeight + "px");

		 //fire the custom event, passing
		 //the new dimensions in as an argument;
		 //our subscribers will be able to use this
		 //information:
		onSizeChange.fire({width: newWidth, height: newHeight});
	};
}</textarea>

<p>We now have a Custom Event and we're firing it at the right time, passing in the relevant data payload.  The next step is to create functions that respond and react to this change.  We've specified that we'll have one function that will pay attention to our <code>onSizeChange</code> Custom Event, get the new width of <code>resizer</code>, and change the width of the brown box to match; another function will do the same for the red box's height.  Note that the argument we passed in when we fired the Custom Event (an object literal: <code>{width: x, height: y}</code>) is available to us in the second argument received by our handlers.  That second argument is an array, and our object is the first item in the array.</p>
<textarea name="code" class="JScript" cols="60" rows="1">	//a handler to respond to the custom event that
//we're firing when the resizer changes size; we'll
//resize its width to match the resizer.
fnSubscriberWidth = function(type, args) {
	var elWidth = YAHOO.util.Dom.get("subscriberWidth");
	var newWidth = args[0].width;
	YAHOO.util.Dom.setStyle(elWidth, "width", (newWidth + "px"));
	elWidth.innerHTML = ("My new width: " + newWidth + "px");
}

//another handler to respond to the custom event that
//we're firing when the resizer changes size; this
//one cares about the height of the resizer.
fnSubscriberHeight = function(type, args) {
	var elHeight = YAHOO.util.Dom.get("subscriberHeight");
	var newHeight = args[0].height;
	YAHOO.util.Dom.setStyle(elHeight, "height", (newHeight + "px"));
	elHeight.innerHTML = ("My new height: " + newHeight + "px");
}</textarea>

<p>The final step in this example is to <code>subscribe</code> our Custom Event handlers to the <code>onSizeChange</code> Custom Event we created in the first script step.  We do this by calling <code>onSizeChange</code>'s subscribe method and passing in the functions we want to subscribe:</p>

<textarea name="code" class="JScript" cols="60" rows="1">
onSizeChange.subscribe(fnSubscriberWidth);
onSizeChange.subscribe(fnSubscriberHeight);
</textarea>

<p>This is a simple example of how to use Custom Events.  One of the powerful things about this concept is how far it can extend &mdash; we only have two subscribers in this example, but we could have from zero to <em>n</em> subscribers.  Custom Events give you granular control over scope and firing order and are an excellent way to provide inter-module messaging within your application.</p>

