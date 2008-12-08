<h3>Design Goal</h3>
<p>
This menu will be created using the 
<a href="http://en.wikipedia.org/wiki/Progressive_enhancement">Progressive Enhancement</a> design 
pattern, so that the accessibility of the menu can be tailored based on the capabilities of 
the user's browser.  The goal is to design a menu that satisfies each of the following use cases:
</p>

<table class="yui-table">
	<thead>
		<tr>
			<th><a href="http://developer.yahoo.com/yui/articles/gbs/">Browser Grade</a></th>
			<th>Technologies</th>
			<th>User Experience</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>C</td>
			<td>HTML</td>
			<td>The user is using a browser for which CSS and JavaScript are being withheld.</td>
		</tr>
		<tr>
			<td>A</td>
			<td>HTML + CSS</td>
			<td>The user is using an A-Grade browser, but has chosen to disable JavaScript.</td>
		</tr>
		<tr>
			<td>A</td>
			<td>HTML + CSS + JavaScript</td>
			<td>The user is using an A-Grade browser with CSS and JavaScript enabled.</td>
		</tr>
		<tr>
			<td>A</td>
			<td>HTML + CSS + JavaScript + ARIA</td>
			<td>
				The user is using an ARIA-capable, A-Grade browser with CSS and 
				JavaScript enabled.
			</td>
		</tr>
	</tbody>
</table>

<p>
The MenuNav Node Plugin helps support most of the these use cases out of the box.  By using an 
established, semantic, list-based pattern for markup, the core, C-grade experience is easily 
cemented using the MenuNav Node Plugin.  Using JavaScript, the MenuNav Node Plugin implements 
established mouse and keyboard interaction patterns to deliver a user experience that is both 
familiar and easy to use, as well as support for the
<a href="http://www.w3.org/TR/wai-aria/">WAI-ARIA Roles and States</a>, making it easy to satisfy
the last two use cases.  The second is the only use case that <em>is not</em> handled out of the box
when using the MenuNav Node Plugin.
</p>

<p>
One common solution to making a menuing system work when CSS is enabled, but JavaScript is 
disabled is to leverage the <code>:hover</code> and <code>:focus</code> pseudo classes to provide 
support for both the mouse and the keyboard.  However, there are a couple of problems with this
approach:
</p>

<dl>
	<dt>Inconsistent Browser Support</dt>
	<dd>
		IE 6 only supports the <code>:hover</code> and <code>:focus</code> pseudo classes on 
		<code>&#60;a&#62;</code> elements.  And while IE 7 supports <code>:hover</code> on all 
		elements, it only supports <code>:focus</code> pseudo class on <code>&#60;a&#62;</code> 
		elements.  This solution won't work if the goal is to provide a consistent user 
		experience across all of the 
		<a href="http://developer.yahoo.com/yui/articles/gbs/#a-grade">A-grade browsers</a> when 
		JavaScript is disabled.
	</dd>
	<dt>Poor User Experience</dt>
	<dd>
		Even if the <code>:hover</code> and <code>:focus</code> pseudo classes were supported 
		consistently across all
		<a href="http://developer.yahoo.com/yui/articles/gbs/#a-grade">A-grade browsers</a>, it 
		would be a solution that would work, <em>but wouldn't work well</em>.  Use of 
		the <code>:focus</code> pseudo class to enable keyboard support for a menu results in an 
		unfamiliar, potentially cumbersome experience for keyboard users.  Having a menu 
		appear in response to its label simply being focused isn't an established interaction 
		pattern for menus on the desktop, and implementing that pattern could result in menus that
		popup unexpectedly, and as a result, simply get in the user's way.  While use of the 
		<code>:hover</code> pseudo class can be used to show submenus in response to a 
		<code>mouseover</code> event, it doesn't allow the user to move diagonally from a label to 
		its corresponding submenu &#151; an established interaction pattern that greatly improves a 
		menu's usability.
	</dd>
	<dt>Bloats Code</dt>	
	<dd>
		Relying on <code>:hover</code> and <code>:focus</code> as an intermediate solution when 
		JavaScript is disabled adds bloat to a menu's CSS.  And relying on these pseudo classes 
		would also likely mean additional code on the server to detect IE, so that submenu HTML 
		that is inaccessible to IE users with JavaScript disabled is not delivered to the browser.
	</dd>	
</dl>

<p>
As the functionality for displaying submenus cannot be implemented in CSS to work 
consistently and well in all 
<a href="http://developer.yahoo.com/yui/articles/gbs/#a-grade">A-grade browsers</a>, then that
functionality is better implemented using JavaScript.  And if submenus are only accessible if 
JavaScript is enabled, then it is best to only add the HTML for submenus via JavaScript.  Adding 
submenus via JavaScript has the additional advantage of speeding up the initial load time of 
a page.
</p>

<h3>Approach</h3>

<p>
The approach for this menu will be to create horizontal top navigation that, when JavaScript is 
enabled, is enhanced into split buttons.  The content of each submenu is functionality that is 
accessible via the page linked from the anchor of each submenu's label.  Each submenu is purely 
sugar &#151; a faster means of accessing functionality that is accessible via another path.
</p>

<h3>Setting Up the HTML</h3>

<p>
Start by providing the markup for the root horizontal menu, following the pattern outlined in the 
<a href="node-menunav-4.html">Split Button Top Nav</a> example, minus the application of the 
<code>yui-splitbuttonnav</code> class to the menu's bounding box, the markup for the submenus, 
and the <code>&#60;a href="&#8230;" class="yui-menu-toggle"&#62;</code> elements inside each label 
that toggle each submenu's display.  Include the MenuNav Node Plugin CSS in the 
<code>&#60;head&#62;</code> so that menu is styled even if JS is disabled.  The following 
illustrates what the initial menu markup:
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="productsandservices" class="yui-menu yui-menu-horizontal">
	<div class="yui-menu-content">
		<ul>
			<li>
				<span id="answers-label" class="yui-menu-label">
					<a href="http://answers.yahoo.com">Answers</a>
				</span>			
			</li>
			<li>
				<span id="flickr-label" class="yui-menu-label">
					<a href="http://www.flickr.com">Flickr</a>
				</span>									
			</li>
			<li>
				<span id="jumpcut-label" class="yui-menu-label">
					<a href="http://www.jumpcut.com/">Jumpcut</a>
				</span>									
			</li>
			<li>
				<span id="mobile-label" class="yui-menu-label">
					<a href="http://mobile.yahoo.com">Mobile</a>
				</span>									
			</li>
			<li>
				<span id="upcoming-label" class="yui-menu-label">
					<a href="http://upcoming.yahoo.com/">Upcoming</a>
				</span>									
			</li>
			<li>
				<span id="forgood-label" class="yui-menu-label">
					<a href="http://forgood.yahoo.com/index.html">Yahoo! for Good</a>
				</span>									
			</li>
		</ul>            
	</div>
</div>
</textarea>

<h3>Setting Up the script</h3>
<p>
With the core markup for the menu in place, JavaScript will be responsible for transforming the 
simple horizontal menu into top navigation rendered like split buttons.  The script will 
appended a submenu toggle to each menu label as well as add the <code>yui-splitbuttonnav</code> 
class to the menu's bounding box.  Each submenu's label will be responsible for creating its 
corresponding submenu the first time its display is requested by the user.  The content of each 
submenu is fetched asynchronously using <code>Y.io</code>.
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
		
		//	Enable ARIA for Firefox 3 and IE 8 by default since those are the two 
		//	browsers that current support ARIA

		var bUseARIA = (Y.UA.gecko && Y.UA.gecko >= 1.9) || (Y.UA.ie && Y.UA.ie >= 8);


		//	Utility function for applying the ARIA Roles and States to dynamically 
		//	added submenus

		var applyARIA = function (menu) {
	
			var oMenuLabel,
				oMenuToggle,
				oListNodes,
				oMenuItemContentNodes,
				oMenuLabelNodes,
				oSubmenu,
				sID;
	
			menu.setAttribute("role", "menu");
	

			oMenuLabel = menu.previous();
			oMenuToggle = oMenuLabel.query(".yui-menu-toggle");
			
			if (oMenuToggle) {
				oMenuLabel = oMenuToggle;
			}
			
			sID = oMenuLabel.get("id");
			
			if (!sID) {
				sID = Y.guid();
				oMenuLabel.set("id", sID);
			}

			menu.setAttribute("aria-labelledby", sID);
	
	
			oListNodes = menu.queryAll("ul,li");
			
			if (oListNodes) {
	
				oListNodes.each(function (node) {
				
					node.setAttribute("role", "presentation");
				
				});
	
			}
			
	
			oMenuItemContentNodes = menu.queryAll(".yui-menuitem-content");
	
			if (oMenuItemContentNodes) {
	
				oMenuItemContentNodes.each(function (node) {

					node.setAttribute("role", "menuitem");				
					node.setAttribute("tabindex", -1);
	
				});
	
			}
		
		};
		

		var onIOComplete = function (transactionID, response, submenuNode) {

			var sHTML = response.responseText;

			submenuNode.query(".yui-menu-content").set("innerHTML", sHTML);
			submenuNode.query("ul").addClass("first-of-type");
	
			if (bUseARIA) {
				applyARIA(submenuNode);
			}

			//	Need to set the width of the submenu to "" to clear it, then to nothing 
			//	(or the offsetWidth for IE < 8) so that the width of the submenu is
			//	rendered correctly, otherwise the width will be rendered at the width 
			//	before the new content for the submenu was loaded.

			submenuNode.setStyle("width", "");
			
			if (Y.UA.ie && Y.UA.ie < 8) {
				submenuNode.setStyle("width", (submenuNode.get("offsetWidth") + "px"));
			}
			

			var oAnchor = submenuNode.query("a");
			
			if (oAnchor) {

				try {
					oAnchor.focus();
				}
				catch (ex) {}

			}

		};


		var addSubmenu = function (event, submenuIdBase) {
		
			var oSubmenuNode,
				sSubmenuId = submenuIdBase + "-options",
				bIsKeyDown = (event.type === "keydown"),
				nKeyCode = event.keyCode,
				sURI;


			if ((bIsKeyDown && nKeyCode === 40) || 
				(event.target.hasClass("yui-menu-toggle") && 
				(event.type === "mousedown" || (bIsKeyDown && nKeyCode === 13)))) {

				//	Build the bounding box and content box for the submenu and fill
				//	the content box with a "Loading..." message so that the user 
				//	knows the submenu's content is in the process of loading.

				oSubmenuNode = Y.Node.create('<div id="' + sSubmenuId + '" class="yui-menu yui-menu-hidden"><div class="yui-menu-content"><p>Loading&#8230;</p></div></div>');
				
				this.get("parentNode").appendChild(oSubmenuNode);


				//	Use Y.io to fetch the content of the submenu

				sURI = "<?php echo $assetsDirectory; ?>submenus.php?menu=" + sSubmenuId;

				Y.io(sURI, { on: { complete: onIOComplete }, arguments: oSubmenuNode });


				//	Detach event listeners so that this code runs only once 
	
				this.detach("mousedown", addSubmenu);
				this.detach("keydown", addSubmenu);

			}
		
		};


		this.addClass("yui-splitbuttonnav");


		var oSubmenuToggles = {
				answers: { label: "Answers Options", url: "#answers-options" },
				flickr: { label: "Flickr Options", url: "#flickr-options" },
				jumpcut: { label: "Jumpcut Options", url: "#jumpcut-options" },
				mobile: { label: "Mobile Options", url: "#mobile-options" },						
				upcoming: { label: "Upcoming Options", url: "#upcoming-options" },
				forgood: { label: "Yahoo! for Good Options", url: "#forgood-options" }
			},
		
			sKey,
			oToggleData,
			oSubmenuToggle;


		//	Add the menu toggle to each menu label

		this.queryAll(".yui-menu-label").each(function(node) {

			sKey = node.get("id").split("-")[0];

			oToggleData = oSubmenuToggles[sKey];

			oSubmenuToggle = Y.Node.create('<a class="yui-menu-toggle">' + oToggleData.label + '</a>');

			//	Need to set the "href" attribute via the "set" method as opposed to 
			//	including it in the string passed to "Y.Node.create" to work around a 
			//	bug in IE.  The MenuNav Node Plugin code examines the "href" attribute 
			//	of all <A>s in a menu.  To do this, the MenuNav Node Plugin retrieves 
			//	the value of the "href" attribute by passing "2" as a second argument 
			//	to the "getAttribute" method.  This is necessary for IE in order to get 
			//	the value of the "href" attribute exactly as it was set in script or in 
			//	the source document, as opposed to a fully qualified path.  (See 
			//	http://msdn.microsoft.com/en-gb/library/ms536429(VS.85).aspx for 
			//	more info.)  However, when the "href" attribute is set inline via the 
			//	string passed to "Y.Node.create", calls to "getAttribute('href', 2)" 
			//	will STILL return a fully qualified URL rather than the value of the 
			//	"href" attribute exactly as it was set in script.

			oSubmenuToggle.set("href", oToggleData.url);


			//	Add a "mousedown" and "keydown" listener to each menu label that 
			//	will build the submenu the first time the users requests it.

			node.on("mousedown", addSubmenu, node, sKey);
			node.on("keydown", addSubmenu, node, sKey);

			node.appendChild(oSubmenuToggle);
		
		});


		//	The scope of the callback will be a Node instance representing 
		//	the root menu (<div id="productsandservices">).  Therefore, since "this"
		//	represents a Node instance, it is possible to just call "this.plug"
		//	passing in a reference to the MenuNav Node Plugin.

		this.plug(Y.plugin.NodeMenuNav, { autoSubmenuDisplay: false, mouseOutHideDelay: 0 });

	}, "#productsandservices");

});
</textarea>