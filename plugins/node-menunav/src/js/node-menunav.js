YUI.add('node-menunav', function(Y) {

// Util shortcuts

var UA = Y.UA,
	Lang = Y.Lang,
	Later = Lang.later,
	getClassName = Y.ClassNameManager.getClassName,


	// Native types

	TRUE = true,
	FALSE = false,
	NULL = null,


	IFrameTemplate = NULL,


	// Frequently used strings

	MENU = "menu",
	MENUITEM = "menuitem",
	HIDDEN = "hidden",
	TAB_INDEX = "tabIndex",		
	PARENT_NODE = "parentNode",
	CHILDREN = "children",
	OFFSET_HEIGHT = "offsetHeight",
	OFFSET_WIDTH = "offsetWidth",
	PX = "px",
	ID = "id",
	PERIOD = ".",
	HANDLED_MOUSEOUT = "handledMouseOut",
	HANDLED_MOUSEOVER = "handledMouseOver",
	ACTIVE = "active",
	LABEL = "label",
	LOWERCASE_A = "a",
	MOUSEDOWN = "mousedown",
	KEYDOWN = "keydown",
	CLICK = "click",
	EMPTY_STRING = "",


	// CSS class names

	CSS_MENU = getClassName(MENU),
	CSS_MENU_HIDDEN = getClassName(MENU, HIDDEN),
	CSS_MENU_HORIZONTAL = getClassName(MENU, "horizontal"),
	CSS_MENU_LABEL = getClassName(MENU, LABEL),
	CSS_MENU_LABEL_ACTIVE = getClassName(MENU, LABEL, ACTIVE),
	CSS_MENU_LABEL_MENUVISIBLE = getClassName(MENU, LABEL, (MENU + "visible")),
	CSS_MENUITEM = getClassName(MENUITEM),
	CSS_MENUITEM_ACTIVE = getClassName(MENUITEM, ACTIVE),
	CSS_SHIM = getClassName("shim"),


	// CSS selectors
	
	MENU_SELECTOR = PERIOD + CSS_MENU,
	FIRST_CHILD_SELECTOR = ":first-child";


// Utility functions


// TO DO: Can Node implement this circular functionality?
var getPreviousSibling = function (node) {

	var oPrevious = node.previous(),
		oChildren;
	

	if (!oPrevious) {
		oChildren = node.get(PARENT_NODE).get(CHILDREN);
		oPrevious = oChildren.item(oChildren.get("length") - 1);
	}
	
	return oPrevious;

};


// TO DO: Can Node implement this circular functionality?
var getNextSibling = function (node) {

	var oNext = node.next(),
		oChildren;
	

	if (!oNext) {
		oChildren = node.get(PARENT_NODE).get(CHILDREN);
		oNext = oChildren.item(0);		
	}
	
	return oNext;

};


var setARIARole = function (node, role) {

	node.setAttribute("role", role);

};


var setARIAProperty = function (node, property, value) {

	node.setAttribute(("aria-" + property), value);

};


var setARIAPresentation = function (node) {

	setARIARole(node, "presentation");

};


var removeFromTabIndex = function (node) {

	node.set(TAB_INDEX, -1);

};


var placeInDefaultTabIndex = function (node) {

	node.set(TAB_INDEX, 0);

};


var isAnchor = function (node) {
	
	var bReturnVal = FALSE;
	
	if (node) {
		bReturnVal = node.get("nodeName").toLowerCase() === LOWERCASE_A;
	}
	
	return bReturnVal;
	
};


var isMenuItem = function (node) {

	return node.hasClass(CSS_MENUITEM);

};


var isMenuLabel = function (node) {

	return node.hasClass(CSS_MENU_LABEL);

};


var isHorizontalMenu = function (menu) {

	return menu.hasClass(CSS_MENU_HORIZONTAL);

};


var hasVisibleSubmenu = function (menuLabel) {

	return menuLabel.hasClass(CSS_MENU_LABEL_MENUVISIBLE);

};


var getItemAnchor = function (node) {

	return isAnchor(node) ? node : node.query((LOWERCASE_A + FIRST_CHILD_SELECTOR));

};


var getNodeWithClass = function (node, className, searchAncestors) {

	var oItem;
	
	if (node) {
		
		if (node.hasClass(className)) {
			oItem = node;
		}
		else {
		
			if (searchAncestors) {
				oItem = node.ancestor((PERIOD + className));
			}
			else if (className === CSS_MENU_LABEL) {	// Avoid false positives 
				oItem = node.query((PERIOD + className + FIRST_CHILD_SELECTOR));
			}
		
		}
	
	}
	
	return oItem;

};


var getParentMenu = function (node) {

	return node.ancestor(MENU_SELECTOR);
	
};


var getMenu = function (node, searchAncestors) {

	return getNodeWithClass(node, CSS_MENU, searchAncestors);

};


var getMenuItem = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
		oItem = getNodeWithClass(node, CSS_MENUITEM, searchAncestors);
	}
	
	return oItem;

};


var getMenuLabel = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
		oItem = getNodeWithClass(node, CSS_MENU_LABEL, searchAncestors);
	}
	
	return oItem;

};


var getItem = function (node, searchAncestors) {

	var oItem;
	
	if (node) {
		oItem = getMenuItem(node, searchAncestors) || getMenuLabel(node, searchAncestors);
	}
	
	return oItem;	

};


var getNextItem = function (item, previous) {

	var oItemLI,
		oNextLI,
		oNextItem;
	

	if (item) {

		oItemLI = isMenuItem(item) ? item : item.get(PARENT_NODE);

		oNextLI = previous ? getPreviousSibling(oItemLI) : getNextSibling(oItemLI);

		oNextItem = getItem(oNextLI);
	
	}
	
	return oNextItem;
	
};


var getPreviousItem = function (item) {

	return getNextItem(item, true);

};


var getFirstItem = function (menu) {
	
	return getItem(menu.query(("li" + FIRST_CHILD_SELECTOR)));

};


var getActiveClass = function (node) {

	return isMenuItem(node) ? CSS_MENUITEM_ACTIVE : CSS_MENU_LABEL_ACTIVE;

};


var blurItem = function (item) {

	var oAnchor = getItemAnchor(item);

	// TO DO:  The try/catch should be implemented in Node
	try {
		oAnchor.blur();
	}
	catch (ex) { }

};
	

var focusItem = function (item) {

	var oAnchor = getItemAnchor(item);

	// TO DO:  The try/catch should be implemented in Node
	try {
		oAnchor.focus();
	}
	catch (ex) { }

};


var handleMouseOverForNode = function (node, target) {

	return node && !node[HANDLED_MOUSEOVER] && (node === target || node.contains(target));

};


var handleMouseOutForNode = function (node, relatedTarget) {

	return node && !node[HANDLED_MOUSEOUT] && 
			(node !== relatedTarget && !node.contains(relatedTarget));

};


var MenuNav = function (config) {

	var menuNav = this,
		oRootMenu = config.owner,
		oDocument,
		oLIs,
		oSubmenu,
		oFirstAnchor,
		sID,
		bUseARIA,
		bAutoSubmenuDisplay,
		nMouseOutHideDelay,
		oMenuLabel,
		oMenuToggle;
		

	if (oRootMenu) {

		bUseARIA = config.useARIA;
		bAutoSubmenuDisplay = config.autoSubmenuDisplay;
		nMouseOutHideDelay = config.mouseOutHideDelay;
		

		// Enable ARIA for Firefox 3 and IE 8 by default since those are the two browsers 
		// that current support ARIA

		menuNav._useARIA = Lang.isBoolean(bUseARIA) ? 
						bUseARIA : ((UA.gecko && UA.gecko >= 1.9) || (UA.ie && UA.ie >= 8));


		menuNav._autoSubmenuDisplay = Lang.isBoolean(bAutoSubmenuDisplay) ? bAutoSubmenuDisplay : TRUE;

		menuNav._submenuShowDelay = config.submenuShowDelay || 250;
		menuNav._submenuHideDelay = config.submenuHideDelay || 250;

		menuNav._mouseOutHideDelay = Lang.isNumber(nMouseOutHideDelay) ? nMouseOutHideDelay : 750;


		// Hide all visible submenus

		oRootMenu.queryAll(MENU_SELECTOR).addClass(CSS_MENU_HIDDEN);


		// Wire up all event handlers

		oRootMenu.on("mouseover", Y.bind(menuNav._onMouseOver, menuNav));
		oRootMenu.on("mouseout", Y.bind(menuNav._onMouseOut, menuNav));
		oRootMenu.on("mousemove", Y.bind(menuNav._onMouseMove, menuNav));
		oRootMenu.on(MOUSEDOWN, Y.bind(menuNav._toggleSubmenuDisplay, menuNav));
		oRootMenu.on(KEYDOWN, Y.bind(menuNav._toggleSubmenuDisplay, menuNav));
		oRootMenu.on(CLICK, Y.bind(menuNav._toggleSubmenuDisplay, menuNav));
		oRootMenu.on("keypress", Y.bind(menuNav._onKeyPress, menuNav));
		oRootMenu.on(KEYDOWN, Y.bind(menuNav._onKeyDown, menuNav));

		oDocument = oRootMenu.get("ownerDocument");

		oDocument.on(MOUSEDOWN, Y.bind(menuNav._onDocMouseDown, menuNav));

		Y.on("focus", Y.bind(menuNav._onDocFocus, menuNav), oDocument);

		menuNav._rootMenu = oRootMenu;


		if (menuNav._useARIA) {

			setARIARole(oRootMenu, "menubar");


			oLIs = oRootMenu.queryAll("li,ul").each(function (node) {
			
				setARIAPresentation(node);
			
			});
			

			oRootMenu.queryAll((PERIOD + getClassName(MENUITEM, "content"))).each(function (node) {

				removeFromTabIndex(node);
				setARIARole(node, MENUITEM);

			});


			oRootMenu.queryAll((PERIOD + CSS_MENU_LABEL)).each(function (node) {

				oMenuLabel = node;
				oMenuToggle = node.query((PERIOD + getClassName(MENU, "toggle")));
				
				if (oMenuToggle) {

					setARIAPresentation(oMenuToggle);
					removeFromTabIndex(oMenuToggle);
					
					oMenuLabel = oMenuToggle.previous();
				
				}

				setARIARole(oMenuLabel, MENUITEM);
				setARIAProperty(oMenuLabel, "haspopup", TRUE);
				removeFromTabIndex(oMenuLabel);
				

				// TO DO: Should be able to remove since the new Node will take care of this 
				sID = oMenuLabel.get(ID);
				
				if (!sID) {
					sID = oMenuLabel.get("_yuid");
					oMenuLabel.set(ID, sID);
				}
				
				oSubmenu = node.next();

				setARIARole(oSubmenu, MENU);
				setARIAProperty(oSubmenu, "labelledby", sID);
				setARIAProperty(oSubmenu, HIDDEN, TRUE);
				
			});


			if (oLIs) {

				oFirstAnchor = oLIs.item(0).query(LOWERCASE_A);

				placeInDefaultTabIndex(oFirstAnchor);

				menuNav._firstItem = getItem(oFirstAnchor, TRUE);

			}

		}

	}

};


MenuNav.NAME = "nodeMenuNav";
MenuNav.NS = "nodeMenuNav";


//	Need to set the "frameBorder" property to 0 to supress the default <iframe>
//	border in IE.  Setting the CSS "border" property alone doesn't supress it.

MenuNav.SHIM_TEMPLATE = '<iframe role="presentation" class="' + CSS_SHIM + '" title="Menu Stacking Shim" src="javascript:false;"></iframe>';


MenuNav.prototype = {

	// Private properties

	_rootMenu: NULL,	// The root Menu in the Menu hierarchy

	//	The item in a Menu the user is currently interacting with.  Could be a MenuItem
	//	(marked with the "yui-menuitem") class or Menu label (marked with the 
	//	"yui-menu-label") class.

	_activeItem: NULL, 

	_activeMenu: NULL,	// The parent Menu of the currently active item

	_hasFocus: FALSE,


	//	In gecko-based browsers a mouseover and mouseout event will fire even 
	//	if a DOM element moves out from under the mouse without the user actually
	//	moving the mouse.  This bug affects Menu beause the user can hit the 
	//	Esc key to hide a Menu, and if the mouse is over the Menu when the 
	//	user presses Esc, the onMenuMouseOut handler will be called.  To fix this 
	//	bug the following flag (this._blockMouseEvent) is used to block the code in the 
	//	onMenuMouseOut handler from executing.

	_blockMouseEvent: FALSE,

	_currentMouseX: 0,

	_movingToSubmenu: FALSE,

	_showSubmenuTimer: NULL,

	_hideSubmenuTimer: NULL,

	_hideAllSubmenusTimer: NULL,

	_firstItem: NULL,	// The first item in the root Menu

	_autoSubmenuDisplay: TRUE,



	// Private methods

	_isRoot: function (menu) {

		return this._rootMenu.compareTo(menu);

	},


	_getTopmostSubmenu: function (menu) {
	
		var menuNav = this,
			oMenu = getParentMenu(menu),
			returnVal;


		if (!oMenu) {
			returnVal = menu;
		}
		else if (menuNav._isRoot(oMenu)) {
			returnVal = menu;
		}
		else {
			returnVal = menuNav._getTopmostSubmenu(oMenu);
		}
	
		return returnVal;
	
	},


	_clearActiveItem: function () {

		var menuNav = this,
			oActiveItem = menuNav._activeItem;
		
		if (oActiveItem) {

			oActiveItem.removeClass(getActiveClass(oActiveItem));

			if (menuNav._useARIA) {
				removeFromTabIndex(getItemAnchor(oActiveItem));
			}

		}

		menuNav._activeItem = NULL;
	
	},


	_setActiveItem: function (node) {
	
		var menuNav = this;
		
		menuNav._clearActiveItem();
		
		var oActiveItem = getItem(node);

		oActiveItem.addClass(getActiveClass(oActiveItem));

		if (menuNav._useARIA) {
			placeInDefaultTabIndex(getItemAnchor(oActiveItem));
		}
		
		menuNav._activeItem = oActiveItem;
	
	},


	_focusItem: function (item) {
	
		if (this._hasFocus) {
			focusItem(item);
		}
	
	},


	_showMenu: function (menu) {

		var menuNav = this,
			oParentMenu = getParentMenu(menu),
			oLI = menu.get(PARENT_NODE),
			aXY = oLI.getXY(),
			oIFrame,
			oItem;


		if (isHorizontalMenu(oParentMenu)) {
			aXY[1] = aXY[1] + oLI.get(OFFSET_HEIGHT);
		}
		else {
			aXY[0] = aXY[0] + oLI.get(OFFSET_WIDTH);
		}
		
		menu.setXY(aXY);

		if (UA.ie === 6) {

			if (!IFrameTemplate) {
				IFrameTemplate = Y.Node.create(MenuNav.SHIM_TEMPLATE);
			}

			oIFrame = menu.query(PERIOD + CSS_SHIM);

			if (!oIFrame) {
				oIFrame = IFrameTemplate.cloneNode();
				menu.appendChild(oIFrame);
			}

			menu.setStyles({ 
				height: (menu.get(OFFSET_HEIGHT) + PX), 
				width: (menu.get(OFFSET_WIDTH) + PX) });

		}

		menu.previous().addClass(CSS_MENU_LABEL_MENUVISIBLE);
		menu.removeClass(CSS_MENU_HIDDEN);
		
		if (menuNav._useARIA) {
			setARIAProperty(menu, HIDDEN, FALSE);
		}

		oItem = getFirstItem(menu);

		menuNav._focusItem(oItem);

	},
	

	_hideMenu: function (menu, activateAndFocusLabel) {

		var menuNav = this,
			oLabel = menu.previous();

		oLabel.removeClass(CSS_MENU_LABEL_MENUVISIBLE);


		if (activateAndFocusLabel) {
			menuNav._setActiveItem(oLabel);
			menuNav._focusItem(oLabel);
		}


		menu.queryAll((PERIOD + CSS_MENUITEM_ACTIVE)).removeClass(CSS_MENUITEM_ACTIVE);

		// Clear the values for top and left that were set by the call to "setXY"
		// so that any hidden position values are applied from class names
		menu.setStyles({ left: EMPTY_STRING, top: EMPTY_STRING });
		
		menu.addClass(CSS_MENU_HIDDEN);
		setARIAProperty(menu, HIDDEN, TRUE);
		
	},


	_hideAllSubmenus: function (menu) {

		var menuNav = this,
			oSubmenus = menu.queryAll(MENU_SELECTOR);

		oSubmenus.each(Y.bind(function (submenuNode) {
		
			menuNav._hideMenu(submenuNode);
		
		}, menuNav));
	
	},


	_cancelShowSubmenuTimer: function () {

		var menuNav = this,
			oShowSubmenuTimer = menuNav._showSubmenuTimer;

		if (oShowSubmenuTimer) {
			oShowSubmenuTimer.cancel();
			menuNav._showSubmenuTimer = NULL;
		}
	
	},


	_cancelHideSubmenuTimer: function () {

		var menuNav = this,
			oHideSubmenuTimer = menuNav._hideSubmenuTimer;


		if (oHideSubmenuTimer) {
			oHideSubmenuTimer.cancel();
			menuNav._hideSubmenuTimer = NULL;
		}
	
	},



	// Event handlers for discrete pieces of pieces of the Menu


	_onMenuMouseOver: function (menu, event) {

		var menuNav = this;

		menuNav._cancelHideSubmenuTimer();

		menuNav._activeMenu = menu;

	},


	_onMenuMouseOut: function (menu, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRelatedTarget = event.relatedTarget,
			oActiveItem = menuNav._activeItem,
			oParentMenu,
			oMenu;


		if (oActiveMenu && !oActiveMenu.contains(oRelatedTarget)) {
		
			oParentMenu = getParentMenu(oActiveMenu);
			

			if (oParentMenu && !oParentMenu.contains(oRelatedTarget)) {

				if (menuNav._mouseOutHideDelay > 0) {

					menuNav._cancelShowSubmenuTimer();

					menuNav._hideAllSubmenusTimer = 

							Later(menuNav._mouseOutHideDelay, menuNav, function () {

								var	oSubmenu;

								oActiveMenu = menuNav._activeMenu;
							
								menuNav._hideAllSubmenus(menuNav._rootMenu);
						
								if (oActiveMenu) {
						
									// Focus the label element for the topmost submenu
									oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
									menuNav._focusItem(oSubmenu.previous());
						
								}
							
							});
						
				}
			
			}
			else {
			
				if (oActiveItem) {
				
					oMenu = getParentMenu(oActiveItem);

					if (!menuNav._isRoot(oMenu)) { 
						menuNav._focusItem(oMenu.previous());
					}
				
				}
			
			}

		}

	},


	_onMenuLabelMouseOver: function (menuLabel, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = (menuNav._autoSubmenuDisplay && bIsRoot || !bIsRoot),
			oHideAllSubmenusTimer = menuNav._hideAllSubmenusTimer,
			oSubmenu;


		menuNav._setActiveItem(menuLabel);
		menuNav._focusItem(menuLabel);
		

		if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {


			if (oHideAllSubmenusTimer) {
				oHideAllSubmenusTimer.cancel();
				menuNav._hideAllSubmenusTimer = NULL;
			}
	
			menuNav._cancelHideSubmenuTimer();
			menuNav._cancelShowSubmenuTimer();


			if (!hasVisibleSubmenu(menuLabel)) {

				oSubmenu = menuLabel.next();
	

				if (oSubmenu) {
					
					menuNav._hideAllSubmenus(oActiveMenu);

					menuNav._showSubmenuTimer = 
									Later(menuNav._submenuShowDelay, menuNav, 
											menuNav._showMenu, oSubmenu);
				
				}
			
			}
		
		}

	},


	_onMenuLabelMouseOut: function (menuLabel, event) {

		var menuNav = this,
			bIsRoot = menuNav._isRoot(menuNav._activeMenu),
			bUseAutoSubmenuDisplay = (menuNav._autoSubmenuDisplay && bIsRoot || !bIsRoot),
			oRelatedTarget = event.relatedTarget,
			oSubmenu = menuLabel.next();

		menuNav._clearActiveItem();

		if (bUseAutoSubmenuDisplay) {

			if (menuNav._movingToSubmenu && !menuNav._showSubmenuTimer && oSubmenu) {

				// If the mouse is moving diagonally toward the submenu and another submenu 
				// isn't in the process of being displayed (via a timer), then hide the submenu 
				// via a timer to give the user some time to reach the submenu.
			
				menuNav._hideSubmenuTimer = Later(menuNav._submenuHideDelay, menuNav, 
															menuNav._hideMenu, oSubmenu);
			
			}
			else if (!menuNav._movingToSubmenu && oSubmenu && 
				!oSubmenu.contains(oRelatedTarget) && oRelatedTarget !== oSubmenu) {

				// If the mouse is not moving toward the submenu, cancel any submenus that 
				// might be in the process of being displayed (via a timer) and hide this 
				// submenu immediately.

				menuNav._cancelShowSubmenuTimer();

				menuNav._hideMenu(oSubmenu);

			}

		}

	},
	

	_onMenuItemMouseOver: function (menuItem, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay = (menuNav._autoSubmenuDisplay && bIsRoot || !bIsRoot);


		menuNav._setActiveItem(menuItem);
		menuNav._focusItem(menuItem);


		if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {

			menuNav._hideAllSubmenus(oActiveMenu);

		}

	},
	

	_onMenuItemMouseOut: function (menuItem, event) {

		this._clearActiveItem();

	},


	_onVerticalMenuKeyDown: function (event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRootMenu = menuNav._rootMenu,
			oTarget = event.target,
			oFocusedItem = getItem(oTarget, TRUE),
			bPreventDefault = FALSE,
			nKeyCode = event.keyCode,
			oSubmenu,
			oParentMenu,
			oLI,
			oNextItem,
			oItem;


		switch (nKeyCode) {

			case 37:	// left arrow

				oParentMenu = getParentMenu(oActiveMenu);

				if (oParentMenu && isHorizontalMenu(oParentMenu)) {
				
					menuNav._hideMenu(oActiveMenu);
					oLI = getPreviousSibling(oActiveMenu.get(PARENT_NODE));
					oItem = getItem(oLI);
					
					if (oItem) {

						if (isMenuLabel(oItem)) {	// Menu label
						
							oSubmenu = oItem.next();
						

							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
						
						}
						else {	// MenuItem

							menuNav._setActiveItem(oItem);
							focusItem(oItem);

						}
					
					}

				}
				else if (!menuNav._isRoot(oActiveMenu)) {
					menuNav._hideMenu(oActiveMenu, TRUE);
				}


				bPreventDefault = TRUE;

			break;

			case 39:	// right arrow

				if (isMenuLabel(oTarget)) {
					
					oSubmenu = oTarget.next();

					if (oSubmenu) {
						menuNav._showMenu(oSubmenu);
						menuNav._setActiveItem(getFirstItem(oSubmenu));
					}
				
				}
				else if (isHorizontalMenu(oRootMenu)) {

					oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
					oLI = getNextSibling(oSubmenu.get(PARENT_NODE));
					oItem = getItem(oLI);

					menuNav._hideAllSubmenus(oRootMenu);

					if (oItem) {

						if (isMenuLabel(oItem)) {	// Menu label

							oSubmenu = oItem.next();

							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
						
						}
						else {	// MenuItem

							menuNav._setActiveItem(oItem);
							focusItem(oItem);

						}							

					}
				
				}

				bPreventDefault = TRUE;

			break;

			case 38:	// up arrow
			case 40:	// down arrow

				menuNav._hideAllSubmenus(oActiveMenu);

				oNextItem = nKeyCode === 38 ? getPreviousItem(oFocusedItem) : getNextItem(oFocusedItem);

				menuNav._setActiveItem(oNextItem);
				focusItem(oNextItem);

				bPreventDefault = TRUE;

			break;

		}	


		if (bPreventDefault) {

			// Prevent the browser from scrolling the window

			event.preventDefault();			

		}
	
	},
	

	_onHorizontalMenuKeyDown: function (event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oTarget = event.target,
			oFocusedItem = getItem(oTarget, TRUE),
			bPreventDefault = FALSE,
			nKeyCode = event.keyCode,
			oNextItem,
			oSubmenu;

		switch (nKeyCode) {

			case 37:	// left arrow
			case 39:	// right arrow

				menuNav._hideAllSubmenus(oActiveMenu);

				oNextItem = nKeyCode === 37 ? getPreviousItem(oFocusedItem) : getNextItem(oFocusedItem);

				menuNav._setActiveItem(oNextItem);
				focusItem(oNextItem);

				bPreventDefault = TRUE;

			break;

			case 40:	// down arrow

				menuNav._hideAllSubmenus(oActiveMenu);

				if (isMenuLabel(oFocusedItem)) {
				
					oSubmenu = oFocusedItem.next();

					if (oSubmenu) {
						menuNav._showMenu(oSubmenu);
						menuNav._setActiveItem(getFirstItem(oSubmenu));
					}

					bPreventDefault = TRUE;
				
				}

			break;

		}		


		if (bPreventDefault) {

			// Prevent the browser from scrolling the window

			event.preventDefault();			

		}
	
	},


	// Generic DOM Event handlers

	_onMouseMove: function (event) {

		this._currentMouseX = event.pageX;
	
	},


	_onMouseOver: function (event) {

		var menuNav = this,
			oTarget,
			oMenu,
			oMenuLabel,
			oParentMenu,
			oMenuItem;


		if (menuNav._blockMouseEvent) {
			menuNav._blockMouseEvent = FALSE;
		}
		else {

			oTarget = event.target;
			oMenu = getMenu(oTarget, TRUE);
			oMenuLabel = getMenuLabel(oTarget, TRUE);
			oMenuItem = getMenuItem(oTarget, TRUE);


			if (handleMouseOverForNode(oMenu, oTarget)) {

				menuNav._onMenuMouseOver(oMenu, event);

				oMenu[HANDLED_MOUSEOVER] = TRUE;
				oMenu[HANDLED_MOUSEOUT] = FALSE;

				oParentMenu = getParentMenu(oMenu);

				if (oParentMenu) {
	
					oParentMenu[HANDLED_MOUSEOUT] = TRUE;
					oParentMenu[HANDLED_MOUSEOVER] = FALSE;
		
				}
			
			}

			if (handleMouseOverForNode(oMenuLabel, oTarget)) {

				menuNav._onMenuLabelMouseOver(oMenuLabel, event);

				oMenuLabel[HANDLED_MOUSEOVER] = TRUE;
				oMenuLabel[HANDLED_MOUSEOUT] = FALSE;
	
			}

			if (handleMouseOverForNode(oMenuItem, oTarget)) {
	
				menuNav._onMenuItemMouseOver(oMenuItem, event);

				oMenuItem[HANDLED_MOUSEOVER] = TRUE;
				oMenuItem[HANDLED_MOUSEOUT] = FALSE;
				
			}

		}

	},


	_onMouseOut: function (event) {
			
		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bMovingToSubmenu = FALSE,
			oTarget,
			oRelatedTarget,
			oMenu,
			oMenuLabel,
			oSubmenu,
			oMenuItem;


		menuNav._movingToSubmenu = (oActiveMenu && !isHorizontalMenu(oActiveMenu) && 
											((event.pageX - 5) > menuNav._currentMouseX));

		
		oTarget = event.target;
		oRelatedTarget = event.relatedTarget;
		oMenu = getMenu(oTarget, TRUE);
		oMenuLabel = getMenuLabel(oTarget, TRUE);
		oMenuItem = getMenuItem(oTarget, TRUE);


		if (handleMouseOutForNode(oMenuLabel, oRelatedTarget)) {

			menuNav._onMenuLabelMouseOut(oMenuLabel, event);

			oMenuLabel[HANDLED_MOUSEOUT] = TRUE;
			oMenuLabel[HANDLED_MOUSEOVER] = FALSE;

		}

		if (handleMouseOutForNode(oMenuItem, oRelatedTarget)) {

			menuNav._onMenuItemMouseOut(oMenuItem, event);

			oMenuItem[HANDLED_MOUSEOUT] = TRUE;
			oMenuItem[HANDLED_MOUSEOVER] = FALSE;
			
		}


		if (oMenuLabel) {

			oSubmenu = oMenuLabel.next();

			if (oSubmenu && 
					(oRelatedTarget === oSubmenu || oSubmenu.contains(oRelatedTarget))) {

				bMovingToSubmenu = TRUE;

			}
		
		}
		

		if (handleMouseOutForNode(oMenu, oRelatedTarget) || bMovingToSubmenu) {

			menuNav._onMenuMouseOut(oMenu, event);				

			oMenu[HANDLED_MOUSEOUT] = TRUE;
			oMenu[HANDLED_MOUSEOVER] = FALSE;
		
		}
	
	},

	_toggleSubmenuDisplay: function (event) {

		var menuNav = this,
			oTarget = event.target,
			oMenuLabel = getMenuLabel(oTarget, TRUE),
			sType = event.type,
			oAnchor,
			oSubmenu,
			sHref,
			nHashPos,
			nLen,
			sId;


		if (oMenuLabel) {

			oAnchor = isAnchor(oTarget) ? oTarget : oTarget.ancestor(isAnchor);
			

			if (oAnchor) {

				//	Need to pass "2" as a second argument to "getAttribute" for IE otherwise IE 
				//	will return a fully qualified URL for the value of the "href" attribute.
				//	http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx

				sHref = oAnchor.getAttribute("href", 2);
				nHashPos = sHref.indexOf("#");
				nLen = sHref.length;

				if (nHashPos === 0 && nLen > 1) {

					sId = sHref.substr(1, nLen);
					oSubmenu = oMenuLabel.next();

					if (oSubmenu && (oSubmenu.get(ID) === sId)) {


						if (sType === MOUSEDOWN || (sType === KEYDOWN && event.keyCode === 13)) {

							//	The call to "preventDefault" below results in the element 
							//	serving as the Menu's label to not receive focus in Webkit, therefore
							//	the "_hasFocus" flag never gets set to true, meaning the first
							//	item in the submenu isn't focused when the submenu is displayed.
							//	To fix this issue, it is necessary to set the "_hasFocus"
							//	flag to true.
	
							if (UA.webkit && !menuNav._hasFocus) {
								menuNav._hasFocus = TRUE;
							}


							if (hasVisibleSubmenu(oMenuLabel)) {
								menuNav._hideMenu(oSubmenu);
								focusItem(oMenuLabel);
							}
							else {
								menuNav._hideAllSubmenus(menuNav._rootMenu);
								menuNav._showMenu(oSubmenu);
							}
						
						}


						if (sType === CLICK) {

							// Prevent the browser from following the URL of the anchor element
							
							event.preventDefault();
						
						}
					
					}
				
				}				


			}
		
		}
	
	},
	

	_onKeyPress: function (event) {
	
		switch (event.keyCode) {

			case 37:	// left arrow
			case 38:	// up arrow
			case 39:	// right arrow
			case 40:	// down arrow

				event.preventDefault();

			break;

		}						

	},	


	_onKeyDown: function (event) {

		var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oActiveMenu = getParentMenu(oTarget);

		if (oActiveMenu) {

			menuNav._activeMenu = oActiveMenu;

			if (isHorizontalMenu(oActiveMenu)) {
				menuNav._onHorizontalMenuKeyDown(event);
			}
			else {
				menuNav._onVerticalMenuKeyDown(event);
			}


			if (event.keyCode === 27) {

				if (!menuNav._isRoot(oActiveMenu)) {

					menuNav._hideMenu(oActiveMenu, TRUE);
					event.stopPropagation();
					menuNav._blockMouseEvent = UA.gecko ? TRUE : FALSE;

				}
				else if (oActiveItem) {

					blurItem(oTarget);
					menuNav._clearActiveItem();

				}
			
			}
		
		}
	
	},


	_onDocMouseDown: function (event) {
	
		var menuNav = this,
			oRoot = menuNav._rootMenu,
			oTarget = event.target;


		if (!oRoot.compareTo(oTarget) && !oRoot.contains(oTarget)) {
		
			menuNav._hideAllSubmenus(oRoot);


			//	Document doesn't receive focus in Webkit when the user mouses down on it, 
			//	so the "menuNav._hasFocus" flag won't get set to the correct value.  The 
			//	following line corrects menuNav problem.

			if (UA.webkit) {
				menuNav._hasFocus = FALSE;
				menuNav._clearActiveItem();
			}
		
		}
	
	},

	_onDocFocus: function (event) {
	
		var menuNav = this,
			bUseARIA = menuNav._useARIA,
			oFirstItem = menuNav._firstItem,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target;

		
		if (menuNav._rootMenu.contains(oTarget)) {	// The Menu has focus

			if (!menuNav._hasFocus) {	// Inital focus

				//	First time the Menu has been focused, need to setup focused state and  
				//	established active active descendant
	
				menuNav._hasFocus = TRUE;
	
				oActiveItem = getItem(oTarget, TRUE);
	
				if (oActiveItem) {	
					menuNav._setActiveItem(oActiveItem);
				}
			
			}
		
		}
		else {	//	The Menu has lost focus

			menuNav._clearActiveItem();
			
			menuNav._hasFocus = FALSE;


			if (oFirstItem && bUseARIA) {
			
				placeInDefaultTabIndex(getItemAnchor(oFirstItem));

			}

		}
	
	}

};


Y.namespace('Plugin');

Y.Plugin.NodeMenuNav = MenuNav;

}, '@VERSION@' ,{requires:['node', 'classnamemanager']});