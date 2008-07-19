<h2 class="first">Making Use of the Event Utility's Basic Features</h2>

<p>The YUI Event Utility is a simple, powerful resource for creating event-driven applications in the browser.  In this introductory example, we'll look at how to use Event Utility to listen for a specific user event on a specific element in the DOM.  We'll also look at how Event Utility can be used within an event handler to provide additional control.</p>

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

<p>With our markup on the page and a function that we want to execute when our element is clicked on, we now use Event Utility's <code>on</code> method to attach our <code>helloWorld</code> function as a handler for the click event on the element whose HTML ID is <code>container</code>.  <code>on</code> is available for convenience at the top-level of a YUI instance; as a result, it can be referenced as <code>Y.on</code> where Y is a YUI instance:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//subscribe the helloWorld function as an event
//handler for the click event on the container
//div:
Y.on("click", helloWorld, "#container");
</textarea>

<p>Almost all event handling begins with a premise just this simple: We have an element ("container") to which something might happen (eg, it might be clicked) and, when that <em>does</em> happen, we want to do something (eg, <code>helloWorld</code>).</p>

<p>In some cases, you may want to use some of Event Utility's powerful browser abstraction methods to help you handle your interaction flow during an event.  For example, let's say you have two links on the page:</p>

<textarea name="code" class="JScript" cols="60" rows="1">	<p><a href="http://developer.yahoo.com/yui" id="firstA">The YUI Library. (Link navigates away from page.)</a></p>
<p><a href="http://developer.yahoo.com/yui" id="secondA">The YUI Library. (Link's default behavior is suppressed.)</a></p></textarea>

<p>Let's say that when the second link is clicked you want to pop up an alert window and then prevent the browser from navigating to the page designated in the <code>href</code> attribute.  The native browser event object has a <code>preventDefault</code> mechanism, but that mechanism was not successfully implemented across all A-Grade browsers until recently.  But the event object passed to your event handler is a facade &mdash; not the actual browser event object.  On this facade, <code>preventDefault</code> is implemented consistently across browsers.  As a result, we can call <code>preventDefault</code> from the event facade just as we would from a native event object and expect it to work consistently across browsers:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//A function that pops up an alert and
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
Y.on("click", interceptLink, "#secondA");</textarea>

<p>The key lesson here is that you should treat the event facade (the first argument passed to your event handler) just as you would a native event object.</p>
