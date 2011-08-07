YUI().use("*", function(Y) {

	var UA = Y.UA,
		getClassName = Y.ClassNameManager.getClassName,
		sCheckboxFocusClass = getClassName("checkbox", "focus"),	// Create yui3-checkbox-focus
		sCheckboxCheckedClass = getClassName("checkbox", "checked"),	// Create yui3-checkbox-checked
		sCheckboxActiveClass = getClassName("checkbox", "active"),	// Create yui3-checkbox-active
		bKeyListenersInitialized = false,
		bMouseListenersInitialized = false,
		forAttr = (UA.ie && UA.ie < 8) ? "htmlFor" : "for",
		bBlockDocumentMouseUp = false,
		bBlockClearActive = false,
		bBlockBlur = false,		
		oActiveCheckbox;			


	var initKeyListeners = function () {

		this.delegate("keydown", onCheckboxKeyDown, ".yui3-checkbox");
		this.delegate("click", onCheckboxClick, ".yui3-checkbox");
		this.delegate("blur", onCheckboxBlur, "input[type=checkbox]");

		bKeyListenersInitialized = true;

	};


	var initMouseListeners = function () {

		this.delegate("mouseover", onCheckboxMouseOver, ".yui3-checkbox");
		this.delegate("mouseout", onCheckboxMouseOut, ".yui3-checkbox-active");
		this.get("ownerDocument").on("mouseup", onDocumentMouseUp);

		bMouseListenersInitialized = true;

	};


	var getCheckbox = function (node) {

		return (node.hasClass("yui3-checkbox") ? node : node.ancestor(".yui3-checkbox"));

	};


	var getCheckboxForLabel = function (label) {

		var sID = label.getAttribute(forAttr),
			oInput,
			oCheckbox;

		if (sID) {

			oInput = Y.one("#" + sID);

			if (oInput) {
				oCheckbox = getCheckbox(oInput);
			}

		}

		return oCheckbox;

	};


	var updateCheckedState = function (input) {

		var oCheckbox = getCheckbox(input);

		if (input.get("checked")) {
			oCheckbox.addClass(sCheckboxCheckedClass);
		}
		else {
			oCheckbox.removeClass(sCheckboxCheckedClass);
		}

	};


	var setActiveCheckbox = function (checkbox) {

		checkbox.addClass(sCheckboxActiveClass);
		oActiveCheckbox = checkbox;

	};


	var clearActiveCheckbox = function () {

		if (oActiveCheckbox) {
			oActiveCheckbox.removeClass(sCheckboxActiveClass);
			oActiveCheckbox = null;
		}

	};


	var onCheckboxMouseOver = function (event, matchedEl) {

		if (oActiveCheckbox && oActiveCheckbox.compareTo(this)) {
			oActiveCheckbox.addClass(sCheckboxActiveClass);
		}

	};


	var onCheckboxMouseOut = function (event) {

		this.removeClass(sCheckboxActiveClass);

	};				


	var onDocumentMouseUp = function (event) {

		var oCheckbox;

		if (!bBlockDocumentMouseUp) {

			oCheckbox = getCheckbox(event.target);

			if ((oCheckbox && !oCheckbox.compareTo(oActiveCheckbox)) || !oCheckbox) {
				clearActiveCheckbox();
			}

		}

		bBlockDocumentMouseUp = false;

	};


	var onCheckboxFocus = function (event) {

		//	Remove the focus style from any checkbox that might still have it

		var oCheckbox = Y.one("#checkboxes").one(".yui3-checkbox-focus");

		if (oCheckbox) {
			oCheckbox.removeClass(sCheckboxFocusClass);
		}

		//	Defer adding key-related and click event listeners until 
		//	one of the checkboxes is initially focused.

		if (!bKeyListenersInitialized) {
			initKeyListeners.call(event.container);
		}

		oCheckbox = getCheckbox(this);

		oCheckbox.addClass(sCheckboxFocusClass);

	};


	var onCheckboxBlur = function (event) {

		if (bBlockBlur) {
			bBlockBlur = false;
			return;
		}

		var oCheckbox = getCheckbox(this);

		oCheckbox.removeClass(sCheckboxFocusClass);

		if (!bBlockClearActive && oCheckbox.compareTo(oActiveCheckbox)) {
			clearActiveCheckbox();
		}

		bBlockClearActive = false;

	};


	var onCheckboxMouseDown = function (event) {

		//	Defer adding mouse-related and click event listeners until 
		//	the user mouses down on one of the checkboxes.

		if (!bMouseListenersInitialized) {
			initMouseListeners.call(event.container);
		}

		var oCheckbox,
			oInput;


		if (this.get("nodeName").toLowerCase() === "label") {

			//	If the target of the event was the checkbox's label element, the
			//	label will dispatch a click event to the checkbox, meaning the 
			//	"onCheckboxClick" handler will be called twice.  For that reason
			//	it is necessary to block the "onDocumentMouseUp" handler from
			//	clearing the active state, so that a reference to the active  
			//	checkbox still exists the second time the "onCheckboxClick"
			//	handler is called.

			bBlockDocumentMouseUp = true;

			//	When the user clicks the label instead of the checkbox itself, 
			//	the checkbox will be blurred if it has focus.  Since the 
			//	"onCheckboxBlur" handler clears the active state it is 
			//	necessary to block the clearing of the active state when the 
			//	label is clicked instead of the checkbox itself.

			bBlockClearActive = true;

			oCheckbox = getCheckboxForLabel(this);

		}
		else {

			oCheckbox = this;

		}

		//	Need to focus the input manually for two reasons:
		//	1) 	Mousing down on a label in Webkit doesn't focus its  
		//		associated checkbox
		//	2)	By default checkboxes are focused when the user mouses 
		//		down on them.  However, since the actually checkbox is 
		//		obscurred by the two span elements that are used to 
		//		style it, the checkbox wont' receive focus as it was 
		//		never the actual target of the mousedown event.

		oInput = oCheckbox.one("input");


		//	Calling Event.preventDefault won't block the blurring of the 
		//	currently focused element in IE, so we'll use the "bBlockBlur"
		//	variable to stop the code in the blur event handler  
		//	from executing.

		bBlockBlur = (UA.ie && oInput.get("checked"));


		oInput.focus();

		setActiveCheckbox(oCheckbox);

		//	Need to call preventDefault because by default mousing down on
		//	an element will blur the element in the document that currently 
		//	has focus--in this case, the input element that was 
		//	just focused.

		event.preventDefault();

	};


	var onCheckboxClick = function (event) {

		var oInput;

		if (this.compareTo(oActiveCheckbox)) {

			oInput = this.one("input");

			if (!event.target.compareTo(oInput)) {

				//	If the click event was fired via the mouse the checked
				//	state will have to be manually updated since the input 
				//	is hidden offscreen and therefore couldn't be the 
				//	target of the click.

				oInput.set("checked", (!oInput.get("checked")));

			}

			updateCheckedState(oInput);
			clearActiveCheckbox();

		}

	};


	var onCheckboxKeyDown = function (event) {

		//	Style the checkbox as being active when the user presses the 
		//	space bar

		if (event.keyCode === 32) {
			setActiveCheckbox(this);
		}

	};

	Y.all("#checkboxes>div>span").addClass("yui3-checkbox");

	//	Remove the "yui3-checkboxes-loading" class used to hide the 
	//	checkboxes now that the checkboxes have been skinned.

	Y.one("#checkboxes").removeClass("yui3-checkboxes-loading");

	//	Add the minimum number of event listeners needed to start, bind the 
	//	rest when needed

	Y.delegate("mousedown", onCheckboxMouseDown, "#checkboxes", ".yui3-checkbox,label");
	Y.delegate("focus", onCheckboxFocus, "#checkboxes", "input[type=checkbox]");
		
});
