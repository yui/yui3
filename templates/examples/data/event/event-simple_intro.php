<p>Clicking in the blue box will pop up a "Hello World!" alert window.  Clicking on the first link will take you to the YUI website; clicking on the second link, which has the same <code>href</code> attribute, will pop up an alert instead and not navigate to a new page.</p>

<p>Event Utility is used here to do two things:</p>

<ol>
	<li>Attach the <code>click</code> event handler to the blue box;</li>
	<li>Attach an event handler to the second <code>&lt;a&gt;</code> element that uses <code>preventDefault()</code> to prevent the link, when clicked, from navigating to a new page. </li>

</ol>