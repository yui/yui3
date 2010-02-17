//	TO DO:
//	-   Make the multiple state class name an optional configuration?
//	-   Consider making this work for any/all elements 
//	-   Change name?    stateStyle
//	-   Implement lazy binding of event handlers
//  -   Augment new/additional attributes onto the HTML button/node directly?
//  -   Rename rootClassName attribute -- className, baseClass?
//  -   Make prefix configurable
//  -   Use the base class name as the foundation (if defined), else create the 
//      base name using the type attribute

var UA = Y.UA,
	getClassName = Y.ClassNameManager.getClassName;


var Button = function () {
	Button.superclass.constructor.apply(this, arguments);
};


var containers = {};


var onContainerMouseDown = function (event) {

	var currentTarget = this,	// button or label
		button,
		mouseUpHandle,
		
		onDocumentMouseUp = function (event) {
			this.button._set("active", false);
			mouseUpHandle.detach();
		};


	if (currentTarget.get("nodeName").toLowerCase() == "label") {
		
 		button = currentTarget._button;	//	retrieve the reference to the button from the label as set in the initializer

		//	When the user clicks the label instead of the checkbox itself, 
		//	the checkbox will be blurred if it has focus.  Since the 
		//	"onCheckboxBlur" handler clears the active state it is 
		//	necessary to block the clearing of the active state when the 
		//	label is clicked instead of the checkbox itself.

		button.button._blockClearActive = true;

	}
	else {
		button = currentTarget;
	}

	//	Need to focus the button manually for two reasons:
	//	1) 	Mousing down on a label or button in Webkit doesn't 
	//		doesn't result in the button being focused.
	//	2)	By default buttons are focused when the user mouses 
	//		down on them.  However, since the actual button can be  
	//		obscurred by the HTML wrapper elements that are used to 
	//		style it, the button may not receive focus as it was 
	//		never the actual target of the mousedown event.
	
	button.button._button.focus();

	button.button._set("active", true);

	mouseUpHandle = button.get("ownerDocument").on("mouseup", onDocumentMouseUp, button);

	//	Need to call preventDefault because by default mousing down on
	//	an element will blur the element in the document that currently 
	//	has focus--in this case, the input element that was 
	//	just focused.

    //  TO DO:
	//	Calling Event.preventDefault won't block the blurring of the 
	//	currently focused element in IE
	event.preventDefault();
	
};

var syncHover = function (event) {
	this.button._set("hover", (event.type == "mouseover" ? true : false));
};


var onContainerFocus = function (event) {
	this.button._set("focused", true);
};


var onContainerBlur = function (event) {

	this.button._set("focused", false);
	
	if (!this.button._blockClearActive && this.button.get("active")) {
		this.button._set("active", false);
	}

	this.button._blockClearActive = false;

};


var onContainerClick = function (event) {

	var input = this.button._button,
	    radios;

	if (this.button._checkable && event.target.get("nodeName").toLowerCase() != "label") {

		if (event.target == input) {
			input.set("checked", input.get("checked"));
		}
		else {

			//	If the click event was fired via the mouse the checked
			//	state will have to be manually updated since the input 
			//	is hidden offscreen and therefore couldn't be the 
			//	target of the click.

			input.set("checked", (!input.get("checked")), { src: "proxy" });
			
		}
		
        if (this.button._type == "radio") {
            
            radios = this.button.get("container").all('[name=' + input.get("name") + ']');
            
            radios.each(function (v) {

                if (v != input) {
                    v.set("checked", false);
                }

            });
            
        }		
		
	}

};

var syncActive = function (event) {

	var button = this.button,
		keyCodes = [];

	keyCodes[32] = true;	// Space bar

	if (!button._checkable) {
		keyCodes[13] = true;	//	Enter key
	}

	if (keyCodes[event.keyCode]) {
		button._set("active", (event.type == "keydown" ? true : false));
	}

};

var onKeyDown = function (event) {

    var button = this.button,
        input = this.button._button,
        codes = {
            37: 1,
            38: 1,
            39: 1,
            40: 1
        };

    if (button._type == "radio" && codes[event.keyCode]) {
        input.set("checked", input.get("checked"));
    }  
  
    syncActive.call(this, event);  
    
};

Button.ATTRS = {

    //  active, hover and focused are readOnly since they are states triggered
    //  only through user interaction, or (in the case of focus), there is 
    //  an alternative/preferred code path (i.e. the focus() method)

	active: {
		value: false,
		readOnly: true
	},
	
	hover: {
		value: false,
		readOnly: true
	},
	
	focused: {
		value: false,
		readOnly: true
	},
	
	rootClassName: {
		setter: function (value) {
			return getClassName(value);
		},
		value: "button",
		writeOnce: true
	},
	
	container: {
		getter: function (value) {
			return Y.one(value) || this.get("host").get("parentNode");
		},
		writeOnce: true
	}

};

Y.extend(Button, Y.Plugin.Base, {

	_blockClearActive: false,
	
	_stateClasses: {},
	
	_checkable: false,

	_styleStates: function (event, currentState, stateClass) {

		var states = [this._type],
			host = this._host;

		var update = function (obj, state) {

			var value,
				sClass,
				classes,
				re;

			if (event.newVal) {	//	true -- the state is "on" -- need to add a class

				if (currentState == "checked" && state == "checked" && event.src == "proxy") {
					value = event.newVal;	// because the state hasn't actually changed because of the on listener
				}
				else {
					value = obj.get(state);
				}

				if (value) {

					states.push((state == "focused" ? "focus" : state));

					if (states.length >= 3) {

						sClass = getClassName.apply(Y.ClassNameManager, states);

						host.addClass(sClass);

						classes = this._stateClasses[currentState];

						if (!classes) {
							classes = [];
							this._stateClasses[currentState] = classes;
						}

						classes.push(sClass);

					}

				}
				
			}
			else {
				
				classes = this._stateClasses[currentState];
				
				if (classes) {
				
					Y.each(classes, function (v, k) {
						host.removeClass(v);
					});
				
					this._stateClasses[currentState] = null;
				
				}
				
				re = new RegExp(currentState, "gi");
			
				Y.each(this._stateClasses, function (classes) {
					
					if (classes) {
				
						Y.each(classes, function (v, k) {
				
							if (v.search(re) !== -1) {
								host.removeClass(v);
							}
				
						});
						
					}
					
				});
				
			}

		};


		if (this._button.get("disabled")) {
			states.push("disabled");
			update.call(this, this._button, "checked");
		}
		else {
			update.call(this, this._button, "checked");
			update.call(this, this, "active");
			update.call(this, this, "focused");
			update.call(this, this, "hover");			
		}
		
	},

	_uiUpdateState: function (event, state) {

		var sMethod = event.newVal ? "addClass" : "removeClass",
			sState = getClassName(this._type, (state == "focused" ? "focus" : state));

		this._host[sMethod](sState);
		this._styleStates(event, state, sState);

	},
	
	_uiUpdateDisabled: function (event) {

		if (event.newVal) {
			this._set("active", false);
			this._button.blur();
			this._set("focused", false);
			this._set("hover", false);
		}

		this._uiUpdateState(event, "disabled");
	    
	},

	_addListeners: function (buttonSelector) {
	
		var sType = this._type,
			button = this._button,
            container = this.get("container"),
			sID = container.get("id"),
	        sRootClassName = this.get("rootClassName"),
	        sKey = sID + sRootClassName;			

		if (this._checkable) {
			button.on("checkedChange", this._uiUpdateState, this, "checked");
		}

		button.after("disabledChange", this._uiUpdateDisabled, this);
		this.after("activeChange", this._uiUpdateState, this, "active");
		this.after("hoverChange", this._uiUpdateState, this, "hover");
		this.after("focusedChange", this._uiUpdateState, this, "focused");

 		if (!containers[sKey]) {

			containers[sKey] = container;

			container.delegate("mousedown", onContainerMouseDown, (buttonSelector + ",label"));
			container.delegate("mouseenter", syncHover, buttonSelector);
			container.delegate("mouseleave", syncHover, buttonSelector);
			container.delegate("focus", onContainerFocus, buttonSelector);
			container.delegate("blur", onContainerBlur, buttonSelector);
			container.delegate("click", onContainerClick, buttonSelector);
			container.delegate("keydown", onKeyDown, buttonSelector);
			container.delegate("keyup", syncActive, buttonSelector);

		}
		
	},

    initializer: function (config) {
		
		var host = this.get("host"),
			button = host.one("input,button"),
            label = this.get("container").one("label[for=" + button.get("id") + "]"),
            sType = button.get("type");

		Y.augment(button, Y.Attribute);

		this._host = host;
		this._button = button;

        if (label) {
		    label._button = host;
		}

		this._type = sType;
		this._checkable = (sType == "checkbox" || sType == "radio");

		this._addListeners(("." + this.get("rootClassName")));
		host.addClass(getClassName(sType));

		if (button.get("disabled")) {
			this._uiUpdateState({ newVal: true }, "disabled");
		}

		if (button.get("checked")) {
			this._uiUpdateState({ newVal: true }, "checked");
		}

    },

	destructor: function () {
    }
	
});


Button.NAME = "nodeButton";
Button.NS = "button";

Y.namespace("Plugin");
Y.Plugin.NodeButton = Button;