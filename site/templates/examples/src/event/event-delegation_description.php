<h2 class="first">Event Delegation and the YUI Event Utility</h2>

<p>Event delegation refers to the use of a single event listener on a parent object to listen for events happening on its children (or deeper descendants).  Event delegation allows developers to be sparse in their application of event listeners while still reacting to events as they happen on highly specific targets.  This proves to be a key strategy for maintaining high performance in event-rich web projects, where the creation of hundreds of event listeners can quickly degrade performance.</p>

<p>This example illustrates the use of event delegation on both <code>click</code> and <code>mouseover</code> events.  The problem we will solve here involves reacting to <code>click</code> and <code>mouseover</code> events on list items.  We will assume that there can be many list items and that we want to be frugal in applying event listeners. At the same time, we want to know exactly which <code>&lt;li&gt;</code> was involved in a <code>click</code> or <code>mouseover</code> event.</p>
<p>To do this, we'll rely on DOM event bubbling &mdash; the process by which an event progresses from its direct target up through the target's node ancestry until it reaches the <code>window</code> object.  The graphic below may help to illustrate the flow: In this case, we'll count on the fact that a click or a mouseover on (A) the text node <em>within</em> an <code>&lt;li&gt; </code> progresses to the <code>&lt;li&gt;</code> element itself (B), then to the <code>&lt;ul&gt;</code> element (C), and then to the list's parent <code>&lt;div&gt;</code> (D) and so on up the document:</p>
<p><img src="assets/eventdelegation.gif"></p>
<p>Because events flow this way, we can count on events happening to our <code>&lt;li&gt;s</code> bubbling up to our &lt;div&gt; whose ID attribute is &quot;container.&quot;</p>
<p>We'll start with some structural markup &mdash; a <code>&lt;div&gt;</code> containing a <code>&lt;ul&gt;</code> with 6 <code>&lt;li&gt;</code> children. Note that our list items have ID attributes &mdash; this gives us a way to uniquely identify them when we process <code>click</code>s and <code>mouseover</code>s at the container level. </p>
				<textarea name="code" class="HTML" cols="60" rows="1"><div id="container">
	<ul id="list">
		<li id="li-1">List Item 1</li>
		<li id="li-2">List Item 2</li>
		<li id="li-3">List Item 3</li>
		<li id="li-4">List Item 4</li>
		<li id="li-5">List Item 5</li>
		<li id="li-6">List Item 6</li>
	</ul>
</div></textarea>

<p>We'll use the <a href="http://developer.yahoo.com/yui/logger/">YUI Logger Control</a> as the reporting mechanism for our event handlers, so this example begins its script by creating a LogReader instance and rendering it into the document body when the <code>window</code>'s <code>load</code> event fires:</p>

<textarea name="code" class="JScript" cols="60" rows="1">//create log reader instance on pageload
function loggerInit() {
	var myLogReader = new YAHOO.widget.LogReader();
}
//on is an alias for addListener
YAHOO.util.Event.on(window, "load", loggerInit);</textarea>

<p>Now we'll add an event handler to the container <code>&lt;div&gt;</code>, listening for any clicks within its bounds.  We're only really interested in clicks on <code>&lt;li&gt;</code>s, though; when we get one of those, we'll write out a message to the Logger.</p>

<textarea name="code" class="JScript" cols="60" rows="1">function clickHandler(e) {
	//get the resolved (non-text node) target:
	var elTarget = YAHOO.util.Event.getTarget(e);	
	//walk up the DOM tree looking for an <li>
	//in the target's ancestry; desist when you
	//reach the container div
	while (elTarget.id != "container") {
		//are you an li?
		if(elTarget.nodeName.toUpperCase() == "LI") {
			//yes, an li: so write out a message to the log
			YAHOO.log("The clicked li had an id of " + elTarget.id, "info", "clickExample");
			//and then stop looking:
			break;
		} else {
			//wasn't the container, but wasn't an li; so
			//let's step up the DOM and keep looking:
			elTarget = elTarget.parentNode;
		}
	}
}
//attach clickHandler as a listener for any click on
//the container div:
YAHOO.util.Event.on("container", "click", clickHandler);</textarea>

<p>The same technique works for the <code>mousemove</code> event as well.  We'll substitute <code>mousemove</code> for <code>click</code>, but make no other substantive changes:</p>

<textarea name="code" class="JScript" cols="60" rows="1">function mouseHandler(e) {	
	var elTarget = YAHOO.util.Event.getTarget(e);	
	while (elTarget.id != "container") {
		if(elTarget.nodeName.toUpperCase() == "LI") {
			YAHOO.log("The li that was mousedover had an id of " + elTarget.id, "info", "mouseExample");
			break;
		} else {
			elTarget = elTarget.parentNode;
		}
	}
}
YAHOO.util.Event.on("container", "mouseover", mouseHandler);</textarea>

<p>In this example, we've used two event listeners with their associated memory and performance load to serve as delegates for the same two events on six list items.  Instead of 12 event listeners, we now have two.  And the code works regardless of the number of <code>li</code>'s used &mdash; if the list was 100 items long, we'd be saving ourselves 198 event listeners, which is enough to make a noticable difference in how your page responds.  In a complicated page context, it's easy to see how this technique can dramatically reduce the number of event listeners required and thereby improve the performance of your application.</p>
