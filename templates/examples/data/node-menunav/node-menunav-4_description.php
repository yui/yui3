<h3>Setting Up the HTML</h3>
<p>
Begin by including the <a href="../../cssgrids/#dependencies">CSS Grids dependencies</a> and placing 
the markup for the two-column Grid on the page (this example uses the 
<a href="../../cssgrids/#page_width">100% Centered Page Width</a> with the 
<a href="../cssgrids/#preset_templates">Preset Template 1</a> that provides a 160px left column).
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

<p>
To render each menu label in the horizontal menu as a split button, add the class 
<code>yui-splitbuttonnav</code> to the node representing the root menu's bounding box, as 
illustrated below:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="menu-1" class="yui-menu yui-menu-horizontal yui-splitbuttonnav"><!-- Bounding box -->
	<div class="yui-menu-content"><!-- Content box -->
		<ul>
			<!-- Menu items -->
		</ul>
	</div>
</div>
</textarea>

<p>
Next, define the markup for each menu label.  Start with a <code>&#60;span&#62;</code> with a class 
of <code>yui-menu-label</code> applied.  Inside the <code>&#60;span&#62;</code>, place two 
<code>&#60;a&#62;</code> elements &#151; one for each of the label's two clickable regions.  
Each <code>&#60;a&#62;</code> has separate, but related responsibilities:  The first 
<code>&#60;a&#62;</code> represents the label's default action.  The second <code>&#60;a&#62;</code>
toggles the display of a submenu whose content contains other options related to, or in the same 
category of the default action.  Therefore to configure the first <code>&#60;a&#62;</code>, 
simply set its <code>href</code> attribute to any URL.  For the second <code>&#60;a&#62;</code>,
apply a class name of <code>yui-menu-toggle</code>, and set the value of the <code>href</code> 
attribute to the id of the label's corresponding submenu.  Lastly, the text node of the second 
<code>&#60;a&#62;</code> should label the contents of its corresponding submenu. 
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="menu-1" class="yui-menu yui-menu-horizontal yui-splitbuttonnav"><!-- Bounding box -->
	<div class="yui-menu-content"><!-- Content box -->
		<ul>
			<li>

				<span class="yui-menu-label"><!-- menu label root node -->
					<a href="http://answers.yahoo.com">Answers</a><!-- menu label default action -->
					<a href="#answers-options" class="yui-menu-toggle">Answers Options</a><!-- menu label submenu toggle -->
				</span>											

				<div id="answers-options" class="yui-menu">
					<div class="yui-menu-content">
						<ul>
							<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/dir/">Answer</a></li>
							<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answersonthestreet.yahoo.com/">Answers on the Street</a></li>
							<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/question/;_ylt=Av3Nt22Mr7YNs651NWFv8YUPzKIX;_ylv=3?link=ask">Ask</a></li>
							<li class="yui-menuitem"><a class="yui-menuitem-content" href="http://answers.yahoo.com/dir/;_ylt=Aqp_jJlsYDP7urcq2WGC6HBJxQt.;_ylv=3?link=over&amp;amp;more=y">Discover</a></li>
						</ul>
					</div>
				</div>				
				
			</li>
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

<p>
Use the <code>autoSubmenuDisplay</code> and <code>mouseOutHideDelay</code> 
configuration properties to configure the menu labels to behave like split buttons.  Set the 
<code>autoSubmenuDisplay</code> to <code>false</code>, so that each menu label's submenu isn't 
made visible until the menu trigger is clicked.  Set the <code>mouseOutHideDelay</code> to 
<code>0</code> so that a label's submenu is only hidden when the user mouses down on an area 
outside of the submenu.
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

		this.plug(Y.plugin.NodeMenuNav, { autoSubmenuDisplay: false, mouseOutHideDelay: 0 });

	}, "#productsandservices");

});
</textarea>