YUI().use("*", function (Y) {

	var menuButton = Y.one("#button-1"),
		menu;


	var initMenu = function () {

		menu = new Y.Overlay({
			contentBox: "#menu-1",
			visible: false,
			tabIndex: null
		});

		menu.render();


		Y.one("#menu-1").setStyle("display", "");

		var boundingBox = menu.get("boundingBox"),
			contentBox = menu.get("contentBox");

		boundingBox.addClass("yui3-buttonmenu");
		contentBox.addClass("yui3-buttonmenu-content");


		// Append a decorator element to the bounding box to render the shadow.

		boundingBox.append('<div class="yui3-menu-shadow"></div>');


		//	Apply the ARIA roles, states and properties to the menu.

		boundingBox.setAttrs({
			role: "menu",
			"aria-labelledby": menuLabelID
		});

		boundingBox.all("input").set("role", "menuitem");


		//	For NVDA: Add the role of "presentation" to each LI 
		//	element to prevent NVDA from announcing the 
		//	"listitem" role.

		boundingBox.all("div,ul,li").set("role", "presentation");


		//	Use the FocusManager Node Plugin to manage the focusability
		//	of each menuitem in the menu.

		contentBox.plug(Y.Plugin.NodeFocusManager, { 

				descendants: "input",
				keys: { next: "down:40", // Down arrow
						previous: "down:38" },	// Up arrow
				focusClass: {
					className: "yui3-menuitem-active",
					fn: function (node) {
						return node.get("parentNode");
					}
				},
				circular: true

			});


		//	Subscribe to the change event for the "focused" attribute
		//	to listen for when the menu initially gains focus, and 
		//	when the menu has lost focus completely.

		contentBox.focusManager.after("focusedChange", function (event) {

			if (!event.newVal) {	// The menu has lost focus

				//	Set the "activeDescendant" attribute to 0 when the 
				//	menu is hidden so that the user can tab from the 
				//	button to the first item in the menu the next time 
				//	the menu is made visible.

				this.set("activeDescendant", 0);

			}

		});


		//	Hide the button's menu if the user presses the escape key
		//	while focused either on the button or its menu.

		Y.on("key", function () {

			menu.hide();
			menuButton.focus();				

		}, [menuButton, boundingBox] ,"down:27");


		if (Y.UA.ie === 6) {

			//	Set the width and height of the menu's bounding box -  
			//	this is necessary for IE 6 so that the CSS for the 
			//	shadow element can simply set the shadow's width and 
			//	height to 100% to ensure that dimensions of the shadow 
			//	are always sync'd to the that of its parent menu.

			menu.on("visibleChange", function (event) {

				if (event.newVal) {

					boundingBox.setStyles({ height: "", width: "" });

					boundingBox.setStyles({ 
						height: (boundingBox.get("offsetHeight") + "px"), 
						width: (boundingBox.get("offsetWidth") + "px") });

				}

			});

		}


		menu.after("visibleChange", function (event) {

			var bVisible = event.newVal;

			//	Focus the first item when the menu is made visible
			//	to allow users to navigate the menu via the keyboard

			if (bVisible) {

				//	Need to set focus via a timer for Webkit and Opera
				Y.Lang.later(0, contentBox.focusManager, contentBox.focusManager.focus);

			}

			boundingBox.set("aria-hidden", (!bVisible));

		});				


		//	Hide the menu when one of menu items is clicked.

		boundingBox.delegate("click", function (event) {

			alert("You clicked " + this.one("input").get("value"));

			contentBox.focusManager.blur();
			menu.hide();

		}, "li");


		//	Focus each menuitem as the user moves the mouse over 
		//	the menu.

		boundingBox.delegate("mouseenter", function (event) {

			var focusManager = contentBox.focusManager;

			if (focusManager.get("focused")) {
				focusManager.focus(this.one("input"));
			}

		}, "li");


		//	Hide the menu if the user clicks outside of it or if the 
		//	user doesn't click on the button

		boundingBox.get("ownerDocument").on("mousedown", function (event) {

			var oTarget = event.target;

			if (!oTarget.compareTo(menuButton) && 
				!menuButton.contains(oTarget) && 
				!oTarget.compareTo(boundingBox) && 
				!boundingBox.contains(oTarget)) {

				menu.hide();

			}

		});

	};


	menuButton.addClass("yui3-menubutton");


	//	Hide the list until it is transformed into a menu

	Y.one("#menu-1").setStyle("display", "none");


	//	Remove the "yui3-menubutton-loading" class from the parent container
	//	now that the necessary YUI dependencies are loaded and the 
	//	menu button has been skinned.

	menuButton.ancestor(".yui3-menubutton-loading").removeClass("yui3-menubutton-loading");


	//	Apply the ARIA roles, states and properties to the anchor.

	menuButton.setAttrs({
		role: "button",
		"aria-haspopup": true
	});


	//	Remove the "href" attribute from the anchor element to  
	//	prevent JAWS and NVDA from reading the value of the "href"
	//	attribute when the anchor is focused.

	if ((Y.UA.gecko || Y.UA.ie) && navigator.userAgent.indexOf("Windows") > -1) {

		menuButton.removeAttribute("href");

		//	Since the anchor's "href" attribute has been removed, the 
		//	element will not fire the click event in Firefox when the 
		//	user presses the enter key.  To fix this, dispatch the 
		//	"click" event to the anchor when the user presses the 
		//	enter key.

		Y.on("key", function (event) {

			menuButton.simulate("click");

		}, menuButton, "down:13");

	}


	//	Set the "tabIndex" attribute of the anchor element to 0 to 
	//	place it in the browser's default tab flow.  This is 
	//	necessary since 1) anchor elements are not in the default 
	//	tab flow in Opera and 2) removing the "href" attribute  
	//	prevents the anchor from firing its "click" event 
	//	in Firefox.

	menuButton.set("tabIndex", 0);

    //  Since there is some intermediary markup (<span>s) between the anchor element with the role 
    //  of "button" applied and the text label for the anchor - we need to use the 
    //  "aria-labelledby" attribute to ensure that screen readers announce the text label for the 
    //  button.

    var menuLabel = menuButton.one("span span"),
        menuLabelID = Y.stamp(menuLabel);

    menuLabel.set("id", menuLabelID);
    menuButton.set("aria-labelledby", menuLabelID);

	var showMenu = function (event) {

		//	For performance: Defer the creation of the menu until 
		//	the first time the button is clicked.

		if (!menu) {
			initMenu();
		}


		if (!menu.get("visible")) {

	        menu.set("align", {
	            node: menuButton,
	            points: [Y.WidgetPositionAlign.TL, Y.WidgetPositionAlign.BL]
	        });

			menu.show();

		}

		//	Prevent the anchor element from being focused 
		//	when the users mouses down on it.
		event.preventDefault();

	}; 


	//	Bind both a "mousedown" and "click" event listener to 
	//	ensure the button's menu can be invoked using both the 
	//	mouse and the keyboard.

	menuButton.on("mousedown", showMenu);
	menuButton.on("click", showMenu);
	
});
