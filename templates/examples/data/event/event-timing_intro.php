<p>As web pages get richer, they tend to get slower.  One way to make your
pages as responsive as possible is to carefully storyboard the page-load and
page-paint processes so that the interactions most central to the page's
purpose are enabled as early as possible.  The window object's
<code>load</code> event won't happen until the full DOM and all image data have
loaded.  Putting off script execution until after the page loads can be optimal
for some scripts, but sometimes you won't want to wait that long to begin
    interacting with the page via script.</p>

<p>The Event Utility gives you three additional interesting moments that occur
during a page's load process: </p>

<ol>

  <li><code><strong>available:</strong></code> <code>available</code>
  targets a single element and fires when that element is available (when it
  responds to <code>document.getElementById()</code>) &mdash; but you can't
  count on the element's children having been loaded at this point.</li>

  <li><code><strong>contentready:</strong></code> When you care about not
  just your target element but its children as well, use
  <code>contentready</code>. This event will tell you that your target
  element and all of its children are present in the DOM.</li>
  
  <li><code><strong>domready:</strong></code> Some DOM scripting operations
  cannot be performed safely until the page's entire DOM has loaded. The
  <code>domready</code> event will let you know that the DOM is fully loaded
  and ready for you to modify  via script. This custom event takes the place of
  the <code>onDOMReady</code> event from previous versions of YUI.</li>

</ol>

<p>In the example box below, <code>available</code>,
<code>contentready</code> and <code>domready</code> are all in use.  A
<code>&lt;div&gt;</code> (with a green background) loads; it has 100 chidren;
one of those children is an arbitrarily large image that will take awhile to
load. Keep an eye on the console, if you have one available in your browser.
You'll see that the <code>&lt;div&gt;</code> (1) becomes available, (2) its
content becomes ready (after all of its 100 children have loaded), (3) the DOM
becomes ready, and finally (4) the page loads.</p>

<p><strong>Internet Explorer note:</strong> It isn't always safe to modify
content during the available/contentready until after the <code>domready</code>
moment.  In this browser, <code>domready</code> will execute before the
available/contentready listeners.

<p><strong>3.x note:</strong> This example has all of the YUI requirements included
on the page.  This differs from the default YUI configuration, which will dynamically load required
YUI modules.  Dynamic loading works asynchronously, so the domready moment
likely will have passed when it comes time to bind the listeners, and possibly
the window load event as well.  All of the event listeners will actually fire in this
case, but the order of the events will not be the same.  <code>domready</code> will
execute before the available/contentready listeners, and the window
load event may as well.</p>
