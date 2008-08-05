<p>This example uses the dynamic loading capability built into YUI to
pull in additional components as needed.  In addition, it demostrates
how to define external modules that can be loaded along side of YUI.
</p>
<p>This example will do the following</p>
<ol>
<li>Instantiate a <code>YUI</code> instance with a configuration object that specifies parameters we need to dynamically load new modules</li>
<li>Use <code>node</code> so that we can bind an event listener to a button.  YUI will dynamically fetch <code>node</code> and its
dependencies.  By default, these will be fetched from the Yahoo! CDN, and combined into a single file.</li>
<li>a click listener is added to a button.</li>
<li>When this button is clicked, YUI will dynamically fetch 3.x drag and drop and 2.x calendar files.</li>
<li>A calendar instance is created, and it is made draggable.</li>
</ol>
