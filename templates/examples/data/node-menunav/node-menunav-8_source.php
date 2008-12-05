<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>YUI Library Examples: MenuNav Node Plugin</title>

<?php
	if ($ydn) {
?>
		<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/combo?<?php echo $yuiCurrentVersion; ?>/build/cssreset/reset-min.css&<?php echo $yuiCurrentVersion; ?>/build/cssfonts/fonts-min.css&<?php echo $yuiCurrentVersion; ?>/build/cssgrids/grids-min.css&<?php echo $yuiCurrentVersion; ?>/build/cssbase/base-min.css">
<?php
	}
	else {
?>
		<link rel="stylesheet" type="text/css" href="<?php echo $buildDirectory; ?>cssreset/reset-min.css">
        <link rel="stylesheet" type="text/css" href="<?php echo $buildDirectory; ?>cssfonts/fonts-min.css">
		<link rel="stylesheet" type="text/css" href="<?php echo $buildDirectory; ?>cssgrids/grids-min.css">
		<link rel="stylesheet" type="text/css" href="<?php echo $buildDirectory; ?>cssbase/base-min.css">
<?php
	}
?>
		<link rel="stylesheet" type="text/css" href="<?php echo $assetsDirectory; ?>node-menunav-examples-base.css">

		<!-- include so that menu has basic styling if JS is no enabled -->
		<link rel="stylesheet" type="text/css" href="<?php echo $buildDirectory; ?>node-menunav/assets/skins/sam/node-menunav.css">

		<style type="text/css">

			.yui-menu-content p {
				margin: .25em .5em;
			}

		</style>

		<!-- YUI Seed -->
		<script type="text/javascript" src="<?php echo $buildDirectory; ?>yui/yui.js"></script>

		<script type="text/javascript">

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
		
		</script>

    </head>
    <body class="yui-skin-sam">

		<div class="yui-d0">					

			<h1>Header</h1>

			<div class="yui-t1">

				<div class="yui-main">
					<div class="yui-b">

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

						<p class="first-of-type">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

						<form>

							<div>
								<label for="field-1">Field One</label>
								<input type="text" id="field-1" name="field-1">
							</div>

							<div>
								<label for="field-2">Field Two</label>
								<input type="text" id="field-2" name="field-2">
							</div>							

							<div>
								<label for="field-3">Field Three</label>
								<select id="field-3" name="field-3">
									<option value="1">Field Three - Option One</option>
									<option value="2">Field Three - Option Two</option>
									<option value="3">Field Three - Option Two</option>								
								</select>
							</div>

						</form>

						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
						<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>

					</div>
				</div>
				<div class="yui-b">

					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
					<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>						

				</div>
			
			</div>
        
			<div id="footer">
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Maecenas sit amet metus. Nunc quam elit, posuere nec, auctor in, rhoncus quis, dui. Aliquam erat volutpat. Ut dignissim, massa sit amet dignissim cursus, quam lacus feugiat.</p>
			</div>

		</div>        
        
    </body>
</html>