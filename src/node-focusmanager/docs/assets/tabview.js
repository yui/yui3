YUI().use("*", function (Y) {

	var tabView = Y.one("#tabview-1"),
		tabList = tabView.one("ul"),
		tabHeading = Y.one("#tabview-heading"),
		sInstructionalText = tabHeading.get("innerHTML");
		selectedTabAnchor = tabView.one(".yui3-tab-selected>a"),
		bGeckoIEWin = ((Y.UA.gecko || Y.UA.ie) && navigator.userAgent.indexOf("Windows") > -1),
		panelMap = {};


	tabView.addClass("yui3-tabview");

	//	Remove the "yui3-loading" class now that the necessary YUI dependencies are loaded and the 
	//	tabview has been skinned.

	tabView.removeClass("yui3-tabview-loading");

	//	Apply the ARIA roles, states and properties.

	//	Add some instructional text to the heading that will be read by
	//	the screen reader when the first tab in the tabview is focused.

	tabHeading.set("innerHTML", (sInstructionalText + " <em>Press the enter key to load the content of each tab.</em>"));

	tabList.setAttrs({
		"aria-labelledby": "tabview-heading",
		role: "tablist"
	});

	tabView.one("div").set("role", "presentation");


	tabView.plug(Y.Plugin.NodeFocusManager, { 
			descendants: ".yui3-tab>a",
			keys: { next: "down:39", //	Right arrow
					previous: "down:37" },	// Left arrow
			focusClass: {
				className: "yui3-tab-focus",
				fn: function (node) {
					return node.get("parentNode");
				}
			},
			circular: true
		});


	//	If the list of tabs loses focus, set the activeDescendant 
	//	attribute to the currently selected tab.

	tabView.focusManager.after("focusedChange", function (event) {

		if (!event.newVal) {	//	The list of tabs has lost focus
			this.set("activeDescendant", selectedTabAnchor);
		}

	});


	tabView.all(".yui3-tab>a").each(function (anchor) {

		var sHref = anchor.getAttribute("href", 2),
			sPanelID = sHref.substring(1, sHref.length),
			panel;

		//	Apply the ARIA roles, states and properties to each tab

		anchor.set("role", "tab");
		anchor.get("parentNode").set("role", "presentation");


		//	Remove the "href" attribute from the anchor element to  
		//	prevent JAWS and NVDA from reading the value of the "href"
		//	attribute when the anchor is focused

		if (bGeckoIEWin) {
			anchor.removeAttribute("href");
		}

		//	Cache a reference to id of the tab's corresponding panel
		//	element so that it can be made visible when the tab
		//	is clicked.
		panelMap[anchor.get("id")] = sPanelID;


		//	Apply the ARIA roles, states and properties to each panel

		panel = Y.one(("#" + sPanelID));

		panel.setAttrs({
			role: "tabpanel",
			"aria-labelledby": anchor.get("id")
		});

	});


	//	Use the "delegate" custom event to listen for the "click" event
	//	of each tab's <A> element.

	tabView.delegate("click", function (event) {

		var selectedPanel,
			sID = this.get("id");

		//	Deselect the currently selected tab and hide its 
		//	corresponding panel.

		if (selectedTabAnchor) {
			selectedTabAnchor.get("parentNode").removeClass("yui3-tab-selected");
			Y.one(("#" + panelMap[selectedTabAnchor.get("id")])).removeClass("yui3-tabpanel-selected");
		}

		selectedTabAnchor = this;
		selectedTabAnchor.get("parentNode").addClass("yui3-tab-selected");

		selectedPanel = Y.one(("#" + panelMap[sID]));
		selectedPanel.addClass("yui3-tabpanel-selected");

		creatingPaging(selectedPanel);

		//	Prevent the browser from following the URL specified by the 
		//	anchor's "href" attribute when clicked.

		event.preventDefault();

	}, ".yui3-tab>a");


	//	Since the anchor's "href" attribute has been removed, the 
	//	element will not fire the click event in Firefox when the 
	//	user presses the enter key.  To fix this, dispatch the 
	//	"click" event to the anchor when the user presses the 
	//	enter key.

	if (bGeckoIEWin) {

		tabView.delegate("keydown", function (event) {

			if (event.charCode === 13) {
				this.simulate("click");
			}

		}, ">ul>li>a");

	}


	var creatingPaging = function (panel) {

		var listitem,
			sHTML = "";

		if (!panel.one(".paging")) {

			listitem = selectedTabAnchor.get("parentNode");

			if (listitem.previous()) {
				sHTML += '<button type="button" class="yui3-tabview-prevbtn">Previous Tab Panel</button>';
			}

			if (listitem.next()) {
				sHTML += '<button type="button" class="yui3-tabview-nextbtn">Next Tab Panel</button>';
			}

			panel.append('<div class="paging">' + sHTML + '</div>');

		}

	};

	creatingPaging(Y.one(".yui3-tabpanel-selected"));


	tabView.delegate("click", function (event) {

		var node = selectedTabAnchor.get("parentNode").previous().one("a");

		tabView.focusManager.focus(node);
		node.simulate("click");

	}, ".yui3-tabview-prevbtn");


	tabView.delegate("click", function (event) {

		var node = selectedTabAnchor.get("parentNode").next().one("a");

		tabView.focusManager.focus(node);
		node.simulate("click");

	}, ".yui3-tabview-nextbtn");
	
});
