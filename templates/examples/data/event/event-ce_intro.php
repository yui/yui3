<p>The Custom Event framework is one of the principle communication mechanisms in YUI.  An object can be augmented with <code>Event.Target</code>, enabling it to be both a host and a target for Custom Events.  Custom Events fire from their host and optionally bubble up to one or more targets.  This allows you to make the interesting moments of your applications broadly available within a module, within a set of modules, or throughout a complex interface populated with rich elements.</p>

<p>In this example, a simple Custom Event is illustrated: <code>testEvent</code>.  This Custom Event is hosted on a Publisher object and bubbles up to a BubbleTarget object.</p>

<p><img src="<?php echo($assetsDirectory); ?>ce-example.gif" alt="An illustration of the relationship between the Custom Event, its host, and its Bubble Target."></p>

<p>Custom Events, like DOM events, can be stopped (<code>stopPropagation</code>) and their default behavior can be suppressed (<code>preventDefault</code>).</p>