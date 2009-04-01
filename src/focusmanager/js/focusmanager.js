var FocusManager = function () {

	FocusManager.superclass.constructor.apply(this, arguments);

};

FocusManager.ATTRS = {

	descendants: {

		getter: function (value) {

			var descendants,
				oNode = this._node;

			if (oNode) {
				descendants = oNode.queryAll(value);
			}
			
			return descendants;
			
		}

	},
	

	//	activeDescendant attribute
	//	-	has no default value
	//	-	can be set by specifying either an index (number) or Node
	//	-	if no default value is specified, a default is set using the 
	//		follow criteria
	//		1.	Using the "tabIndex" attribute of the descendants
	//		2.	If no default can be inferred then the value is set to either 0
	//			or the index of the first enabled descendant
	
	activeDescendant: {

		setter: function (value) {
			
			var descendantsMap = this._descendantsMap,
				nodeIndex,
				returnValue;
			
			if (Y.Lang.isNumber(value)) {
				returnValue = value;
			}
			else if ((value instanceof Y.Node) && descendantsMap) {

				nodeIndex = descendantsMap[value];

				if (Y.Lang.isNumber(nodeIndex)) {
					returnValue = nodeIndex;
				}

			}

			return returnValue;
			
		}		

	},
	
	orientation: {	// horizontal, vertical, both

		value: "horizontal",

		writeOne: true, 

		validator: function (value) {

			var values = {
				"horizontal": true,
				"vertical": true,
				"both": true
			};

			return values[value];
		}

	},
	
	focusClass: {
		
	},

	circular: {
		value: true
	}
};

Y.extend(FocusManager, Y.Base, {

	_descendants: null,
	
	_descendantsMap: null,

	_focusedNode: null,
	
	_lastNodeIndex: 0,

	_eventHandlers: null,


	_initDescendants: function () {

		var descendants = this.get("descendants"),
			descendantsMap = {},
			nFirstEnabled = -1,
			nDescendants,
			nActiveDescendant = this.get("activeDescendant") || -1,
			oNode,
			i = 0;


		if (descendants) {

			nDescendants = descendants.size();
			

			if (nDescendants > 1) {

				for (i = 0; i < nDescendants; i++) {

					oNode = descendants.item(i);

					if (nFirstEnabled === -1 && !oNode.get("disabled")) {
						nFirstEnabled = i;
					}


					//	If the user didn't specify a value for the 
					//	"activeDescendant" attribute try to infer it from 
					//	the markup

					if (nActiveDescendant < 0 && 
							oNode.getAttribute("tabIndex") === "0") {

						nActiveDescendant = i;

					}

					oNode.set("tabIndex", -1);
					
					descendantsMap[oNode] = i;
					
				}
				

				//	If the user didn't specify a value for the  
				//	"activeDescendant" attribute and no default value could be 
				//	determined from the markup, then default to 0
				
				if (nActiveDescendant < 0) {
					nActiveDescendant = 0;
				}
				

				oNode = descendants.item(nActiveDescendant);

				//	Check to make sure the active descendant isn't disabled, 
				//	and fall back to the first enabled descendant if it is

				if (!oNode || oNode.get("disabled")) {
					oNode = descendants.item(nFirstEnabled);
					nActiveDescendant = nFirstEnabled;
				}

				this.set("activeDescendant", nActiveDescendant);
				oNode.set("tabIndex", 0);

				this._lastNodeIndex = nDescendants - 1;
				this._descendants = descendants;
				this._descendantsMap = descendantsMap;			
				
			}
			
		}

	},


	_isDescendant: function (node) {

		var descendants = this._descendants,
			i = descendants.size() - 1,
			bDescendant = false;

		do {

			bDescendant = (descendants.item(i) === node);
			
			if (bDescendant) {
				break;
			}

		}
		while (i--);
		
		return bDescendant;
		
	},
	

	_restoreInitialFocus: function () {

		this._clearFocus();
		this.set("activeDescendant", 0);
		this._initDescendants();
		
	},


	_onDocumentFocus: function (event) {

		var oTarget = event.target,
			oFocusedNode = this._focusedNode,
			bInCollection;


		if (this._node.contains(oTarget)) {	

			// The target is a descendant of the root node

			bInCollection = this._isDescendant(oTarget);

			if (!oFocusedNode && bInCollection) {
				
				//	The user has tabbed to the first focusable descendant, 
				//	so focus it

				this.focus();

			}
			else if (oFocusedNode && !bInCollection) {  

				//	The user has tabbed to a child of the root node that is 
				//	not one of the descendants managed by this FocusManager
				//	so clear the currently focused descendant

				this._restoreInitialFocus();

			}
			
		}
		else { 

			// The target is some other node in the document

			if (oFocusedNode) {
				this._restoreInitialFocus();
			}
			
		}
	
	},

	_onKeyDown: function (event) {

		if (this._isDescendant(event.target)) {

			switch (event.keyCode) {

				case 37:	//	left arrow
				case 38:	//	up arrow

					this._focusPrevious();

				break;

				case 39: 	//	right arrow
				case 40:	//	down arrow

					this._focusNext();
			
				break;

			}
		
		}
		
	},


	_clearFocus: function () {

		var oFocusedNode = this._focusedNode,
			sClassName;


		if (oFocusedNode) {

			sClassName = this.get("focusClass");

			if (sClassName) {
				oFocusedNode.removeClass(sClassName);
			}

			this._focusedNode = null;
			
		}
		
	},
	

	_setFocus: function () {

		this._clearFocus();

		var sClassName,
			oNode;
	
		try {
			
			oNode = this._descendants.item(this.get("activeDescendant"));

			if (oNode) {

				oNode.focus();

				sClassName = this.get("focusClass");

				if (sClassName) {
					oNode.addClass(sClassName);
				}

				this._focusedNode = oNode;

			}

		}
		catch (e) {
			// TO DO: Can we us the try/catch to handle disabled items?
		}		
		
	},


	_focusNext: function () {
	
		var oNode;
	
		if (this.get("activeDescendant") <= this._lastNodeIndex) {

			this.set("activeDescendant", (this.get("activeDescendant") + 1));

			if (this.get("activeDescendant") === (this._lastNodeIndex + 1) && 
				this.get("circular")) {

				this.set("activeDescendant", 0);

			}

			oNode = this._descendants.item(this.get("activeDescendant"));
			
			if (oNode) {

				if (oNode.get("disabled")) {
					this._focusNext();
				}
				else {
					this.focus();
				}
				
			}

		}

	},


	_focusPrevious: function () {
	
		var oNode;
	
		if (this.get("activeDescendant") >= 0) {

			this.set("activeDescendant", (this.get("activeDescendant") - 1));

			if (this.get("activeDescendant") === -1 && this.get("circular")) {
				this.set("activeDescendant", this._lastNodeIndex);
			}

			oNode = this._descendants.item(this.get("activeDescendant"));

			if (oNode) {

				if (oNode.get("disabled")) {
					this._focusPrevious();
				}
				else {
					this.focus();
				}
				
			}

		}
	
	},

	_onActiveDescendantChange: function () {

		// TO DO: Use e.prevValue?

		var oNode = this._descendants.item(this.get("activeDescendant"));
		
		if (oNode) {
			oNode.set("tabIndex", -1);
		}
		
	},
	
	_afterActiveDescendantChange: function () {

		// TO DO: Use e.newValue?

		var oNode = this._descendants.item(this.get("activeDescendant"));

		if (oNode) {
			oNode.set("tabIndex", 0);
		}
		
	},

	_detachEventHandlers: function () {

		var aHandlers = this._eventHandlers;

		if (aHandlers) {

			//	To do:  make sure that these handlers are actually getting
			//	cleaned up

			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});

			this._eventHandlers = null;

		}
		
	},

	_bindEventHandlers: function () {

		var descendants = this._descendants,
			sKeys = "down:",
			aHandlers = this._eventHandlers,
			oNode,
			oDocument;

		if (descendants && descendants.size() > 1 && !aHandlers) {
			
			switch (this.get("orientation")) {

				case "horizontal":
					sKeys += "37,39";
				break;
				
				case "vertical":
					sKeys += "38,40";
				break;

				case "both":
					sKeys += "37,39,38,40";
				break;				

			}
			

			oNode = this._node;

			aHandlers = [];

			// To do: talk to Adam about why I have to use Y.bind for scope correction here
		    aHandlers[0] = Y.on("key", Y.bind(this._onKeyDown, this), oNode, sKeys);

			oDocument = oNode.get("ownerDocument");

			// To do: talk to Adam about why I have to use Y.bind for scope correction here
		    aHandlers[1] =	
				Y.on("focus", Y.bind(this._onDocumentFocus, this), oDocument);

			aHandlers[2] = 
				this.after("descendantsChange", this._initDescendants);

			aHandlers[3] = 
				this.on("activeDescendantChange", this._onActiveDescendantChange);
			
			aHandlers[4] = 
				this.after("activeDescendantChange", this._afterActiveDescendantChange);
				
			this._eventHandlers = aHandlers;
			
		}
		
	},


	//	Public methods

    initializer: function (config) {

		this._node = config.owner;

    },

	destructor: function () {
		
		this.stop();
		
    },

	focus: function (index) {

		if (index && index !== this.get("activeDescendant")) {
			this.set("activeDescendant", index);
		}

		Y.later(0, this, this._setFocus);

	},

	start: function () {

		this._initDescendants();
		this._bindEventHandlers();
		
	},
	
	stop: function () {

		this._detachEventHandlers();

		this._descendants = null;
		this._focusedNode = null;
		this._lastNodeIndex = 0;

	},

	refresh: function () {

		this._initDescendants();
		
	}
	
});


FocusManager.NAME = "focusManager";
FocusManager.NS = "focusManager";

Y.namespace("plugin");
Y.plugin.FocusManager = FocusManager;