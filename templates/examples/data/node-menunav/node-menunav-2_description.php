<h3>Setting Up the HTML</h3>
<p>
Begin by including the <a href="../../cssgrids/#dependencies">CSS Grids dependencies</a> and placing 
the markup for the two-column Grid on the page (this example uses the 
<a href="../../cssgrids/#page_width">100% Centered Page Width</a> with the 
<a href=".../cssgrids/#preset_templates">Preset Template 1</a> that provides a 160px left column).
Add the markup for the menu to the right column of the grid, and the class <code>yui-skin-sam</code>
to the <code>&#60;body&#62;</code>.
</p>

<p>
The root menu of menus built using the MenuNav Node Plugin can have a verical or horizontal 
orientation.  The default orientation for menus is vertical, but can be easily switched to 
horizontal by applying a class of <code>yui-menu-horizontal</code> to the node representing the 
root menu's bounding box, as illustrated below:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="productsandservices" class="yui-menu yui-menu-horizontal"><!-- Bounding box -->
	<div class="yui-menu-content"><!-- Content box -->
		<ul>
			<!-- Menu items -->
		</ul>
	</div>
</div>
</textarea>


<h3>Initializing the Menu</h3>
<p>
With the menu markup in place, use the <a href="../../event/#onavailable"><code>contentready</code></a> 
event to initialize the menu when the subtree of element representing the root menu 
(<code>&#60;div id="productsandservices"&#62;</code>) is ready to be scripted.
</p>

<p>
The scope of the <code>contentready</code> event callback will be a Node instance representing 
the root menu (<code>&#60;div id="productsandservices"&#62;</code>).  Therefore, with  
<code>this</code> representing a Node instance, call the 
<a href="../../api/Node.html#method_plug"><code>plug</code></a> passing in a reference to the MenuNav 
Node Plugin.
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
//	Call the "use" method, passing in "node-menunav".  This will load the 
//	script and CSS for the MenuNav Node Plugin and all of the required 
//	dependencies.

YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules; ?>, function(Y) {

	//	Use the "contentready" event to initialize the menu when the subtree of 
	//	element representing the root menu (<div id="productsandservices">) is ready to 
	//	be scripted.

	Y.on("contentready", function () {

		//	The scope of the callback will be a Node instance representing 
		//	the root menu (<div id="productsandservices">).  Therefore, since "this"
		//	represents a Node instance, it is possible to just call "this.plug"
		//	passing in a reference to the MenuNav Node Plugin.

		this.plug(Y.plugin.NodeMenuNav);

	}, "#productsandservices");

});
</textarea>