<h2 class="first">Making Use of Event Utility's Basic Features</h2>

<p>The YUI Event Utility is a simple, powerful resource for creating event-driven applications in the browser.  In this very simple example, we'll look at how to use Event Utility to listen for a specific event on a specific element.  We'll also look at how Event Utility can be used within an event handler to provide additional control.</p>

<p>To illustrate event handling syntax, we'll create a <code>&lt;div&gt;</code> and pop up an alert message when that <code>&lt;div&gt;</code> is clicked on.  Begin with the style and markup necessary to make your element visible:</p>

<textarea name="code" class="HTML" cols="60" rows="1"><style type="text/css">
#container {background-color:#00CCFF; border:1px dotted black; padding:1em; cursor:pointer;}
</style>

<div id="container">
  <p>Click for Hello World alert.</p>
</div></textarea>

<p>Next, create a function that receives a single argument &mdash; the event object &mdash; and pops up an alert which says "Hello World!":</p>

<textarea name="code" class="JScript" cols="60" rows="1">//A function that pops up a "Hello World" alert:
var helloWorld = function(e) {
	alert("Hello World!");
}</textarea>

<p>With our markup on the page and a function that we want to execute when our element is clicked on, we now use Event Utility's <code>addListener</code> method to attach our <code>helloWorld</code> function as a handler for the click event on the element whose HTML ID is "container":</p>

<textarea name="code" class="JScript" cols="60" rows="1">YAHOO.util.Event.addListener("container", "click", helloWorld);
</textarea>

<p>Almost all event handling begins with a premise just this simple: We have an element ("container") to which something might happen (eg, it might be clicked) and, when that <em>does</em> happen, we want to do something (eg, <code>helloWorld</code>).</p>

<p>In some cases, you may want to use some of Event Utility's powerful browser abstraction methods to help you handle your interaction flow during an event.  For example, lets say you have two links on the page:</p>

<textarea name="code" class="JScript" cols="60" rows="1">	<p><a href="http://developer.yahoo.com/yui" id="firstA">The YUI Library. (Link navigates away from page.)</a></p>
<p><a href="http://developer.yahoo.com/yui" id="secondA">The YUI Library. (Link's default behavior is suppressed.)</a></p></textarea>

<p>Imagine that when the second link is clicked you want to pop up an alert window and then prevent the browser from navigating to the page designated in the href attribute.  The event object has a <code>preventDefault</code> mechanism, but that mechanism was not successfully implemented across all A-Grade browsers until quite recently.  So, instead of using the built-in version of <code>preventDefault</code>, we can use Event Utility's method which features normalized support for a greater number of browsers:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//A function that pops up an alert and
//prevents the default behavior of the event
//for which it is a handler:
var interceptLink = function(e) {
	YAHOO.util.Event.preventDefault(e);
	alert("You clicked on the second YUI link.");
}

//subscribe our interceptLink function
//as a click handler for the second anchor
//element:
YAHOO.util.Event.addListener("secondA", "click", interceptLink);</textarea>

<p>In line 5 above, we take the event object, passed into us by the Event Utility when the handler is called, and we apply the Event Utility's <code>preventDefault</code> method to it.  We can use a similar pattern for all of Event Utility's helper methods (<code>stopEvent</code>, <code>stopPropagation</code>, etc.).</p>
