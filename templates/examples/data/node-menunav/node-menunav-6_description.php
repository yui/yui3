<h3>Creating the Rounded Corner HTML</h3>
<p>
One way to add rounded corners to submenus is to append decorator elements to the node representing 
a submenu's bounding box.  As the name implies, decorator elements add no semantic value to the 
markup, but enable additional styles to be applied.  When adding any decorator elements to create 
effects like shadows or rounded corners, always add those elements via JavaScript, since it is only 
when JavaScript is enabled that a menu's markup is transformed in a drop-down menu system via the 
MenuNav Node Plugin.
</p>

<p>
Each rounded corner is created by applying a background image to a <code>&#60;div&#62;</code>.  
A class name identifying the corner will be added to each <code>&#60;div&#62;</code>.
The <code>&#60;div&#62;</code>s used to create the right corners will be nested inside the 
<code>&#60;div&#62;</code>s used to create the left corners, and each <code>&#60;div&#62;</code>
for the left corners will have an additional class name of <code>yui-menu-corner</code>.  The 
template for each set of rounded corners comes together as follows:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<!-- top-left and top-right corners -->
<div class="yui-menu-corner yui-menu-corner-tl"><div class="yui-menu-corner-tr"></div></div>

<!-- bottom-left and bottom-right corners -->
<div class="yui-menu-corner yui-menu-corner-bl"><div class="yui-menu-corner-br"></div></div>
</textarea>

<p>
The <code>&#60;div&#62;</code>s for each corner is created by passing a string 
of HTML to Node's <a href="../../api/Node.html#method_create"><code>create</code></a> method.  Use 
the <a href="../../api/Node.html#method_queryAll"><code>queryAll</code></a> method to 
retrieve Node instances for each submenu, and the 
<a href="../../api/Node.html#method_appendChild"><code>appendChild</code></a> and 
<a href="../../api/Node.html#method_insertBefore"><code>insertBefore</code></a>
methods to add the rounded corners <code>&#60;div&#62;</code>s to the bounding box of each submenu.
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
	
		this.plug(Y.plugin.NodeMenuNav);

		//	The scope of the callback will be a Node instance representing 
		//	the root menu (<div id="productsandservices">).  Therefore, since "this"
		//	represents a Node instance, use the "queryAll" method to retrieve the 
		//	Node instances representing each submenu.

		this.queryAll(".yui-menu").each(function (node) {

			//	Add decorator elements used to create the rounded corners to the 
			//	bounding box of each submenu.
		
			// Insert the first decorator before the submenu's content box
			node.insertBefore(Y.Node.create('<div class="yui-menu-corner yui-menu-corner-tl"><div class="yui-menu-corner-tr"></div></div>'), node.get("children").item(0));

			// Insert the second decorator after the submenu's content box
			node.appendChild(Y.Node.create('<div class="yui-menu-corner yui-menu-corner-bl"><div class="yui-menu-corner-br"></div></div>'));
		
		});

	}, "#productsandservices");

});
</textarea>

<h3>Create the Rounded Corner Background Image</h3>
<p>
For performance, each rounded corner <code>&#60;div&#62;</code> uses the same image as its 
background image, but only reveals the relevant section of the image via the 
<code>background-position</code> property.  The complete image is as follows:
</p>

<img src="<?php echo $assetsDirectory; ?>/round.png" width="200" height="6" alt="Image used as the background image for the DIV elements used to create rounded corners">

<h3>Styling the Rounded Corner HTML</h3>
<p>
With the rounded corner elements appended to each submenu, the next step is to define 
the styles that create the rounded corner effect.  Start by overriding the values for 
<code>border</code> and <code>padding</code> specified for the content box of each submenu in the 
Sam skin CSS.  The top and bottom borders are set to 0, since both borders will be drawn by the 
background image used to create the rounded corners.  The top and bottom padding will be created by 
setting the height of each <code>&#60;div&#62;</code> inside the 
<code>&#60;div class="yui-menu-corner"&#62;</code>.
</p>

<textarea name="code" class="CSS" cols="60" rows="1">
/*
	Overide the values for border and padding specified for the content box of each submenu in 
	the Sam skin CSS.  The top and bottom borders are set to 0, since both borders will be drawn 
	by the background image used to create the rounded corners.  The top and bottom padding 
	will be created by setting the height of each <div> inside the 
	<div class="yui-menu-corner">.
*/

#productsandservices .yui-menu .yui-menu-content {

	border-top: 0;
	border-bottom: 0;
	padding: 0;

}
</textarea>

<p>
Next, define the styles for each corner element.  The <code>&#60;div&#62;</code>s for the top-left 
and bottom-left corners define a right margin that will provide space for the their inner 
<code>&#60;div&#62;</code>s to fill using a negative right margin.  Each inner 
<code>&#60;div&#62;</code> will define a left margin to reveal the background image applied to 
its parent <code>&#60;div&#62;</code>.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
.yui-menu-corner {

	margin-right: 4px;	/*	Reserve space for the top-right and bottom-right corners. */

	/* The background image (sprite) for the top-left and bottom-left corners. */
	background: url(<?php echo $assetsDirectory; ?>round.png) no-repeat;

}

.yui-menu-corner div {

	height: 4px;

	margin: 0 -4px 0 4px;	/*	Use a negative right margin to move the <div> into 
								the right margin of the parent element 
								(<div class="yui-menu-corner">) to draw the top-right 
								and bottom-right corners.

								Apply a left margin to reveal the background image 
								applied to the parent element for the top-left and 
								bottom-left corners. */
	
	/* The background image (sprite) for the top-right and bottom-right corners. */
	background: url(<?php echo $assetsDirectory; ?>round.png) no-repeat;

	_position: relative;	/*	Necessary to get negative margins working in IE 6 
								(Standards Mode and Quirks Mode and IE 7 (Quirks 
								Mode only). */

	_font-size: 0;	/*	Necessary to collapse the height of the <div> in IE 6 
						(Standards Mode and Quirks Mode and IE 7 (Quirks Mode only) so 
						that it renders at 4px tall.  */

}
</textarea>


<p>
The last step is to simply set <code>background-position</code> property for the bottom-left, 
top-right, and bottom-right corner elements to reveal the corresponding section of the corner 
background image.
</p>
<textarea name="code" class="CSS" cols="60" rows="1">
/*
	Set the "background-position" property for the bottom-left, top-right, and 
	bottom-right corner elements to reveal the corresponding section of the corner 
	background image.
*/

.yui-menu-corner-bl {

	background-position: left bottom;
				
}

.yui-menu-corner .yui-menu-corner-tr {

	background-position: top right;

}

.yui-menu-corner .yui-menu-corner-br {

	background-position: right bottom;

}
</textarea>