<h3>Challenges</h3>
<p>
There are a few challenges when trying to skin an HTML checkbox using CSS.  To start, most of the 
<a href="http://developer.yahoo.com/yui/articles/gbs/#a-grade">A-grade browsers</a> don't provide
support for CSS properties like <code>border</code> and <code>background</code> on the 
<code>&#60;input type="checkbox"&#62;</code> element.  Additionally, IE 6 and IE 7 (Quirks Mode) 
lack support for attribute selectors &#151; necessary to style the <code>checked</code> and 
<code>disabled</code> states.  Additionally, IE 6 and 7 only support the <code>:focus</code> and 
<code>:active</code> pseudo classes on <code>&#60;a&#62;</code> elements, both of which are needed 
to style a checkbox when it is focused or depressed.
</p>

<h3>Approach</h3>
<p>
Despite the shortcomings in CSS support, with a little extra markup and through the use of 
JavaScript it is possible to skin an <code>&#60;input type="checkbox"&#62;</code> element 
consistently well in all of the
<a href="http://developer.yahoo.com/yui/articles/gbs/#a-grade">A-grade browsers</a>.
</p>


<h4>Markup</h4>
<p>
Since CSS support for the <code>&#60;input type="checkbox"&#62;</code> element is lacking, wrap 
<code>&#60;input type="checkbox"&#62;</code> elements in one or more inline elements to provide the 
necessary hooks for styling.  In this example, each <code>&#60;input type="checkbox"&#62;</code> 
element is wrapped by two <code>&#60;span&#62;</code>s.
</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<span class="yui-checkbox">
	<span>
		<input type="checkbox">
	</span>
</span>
</textarea>

<h4>CSS</h4>
<p>
To style each checkbox, a class name of <code>yui-checkbox</code> will be applied to the 
outtermost <code>&#60;span&#62;</code> wrapping each <code>&#60;input type="checkbox"&#62;</code> 
element.  An additional class will be used to represent the various states of each checkbox.  The 
class name for each state will follow a consistent pattern: <code>yui-checkbox-[state]</code>.  
For this example, the following state-based class names will be used:
</p>
<dl>
	<dt><code>yui-checkbox-focus</code></dt>
	<dd>The checkbox has focus</dd>
	<dt><code>yui-checkbox-active</code></dt>
	<dd>The checkbox is active (pressed)</dd>
	<dt><code>yui-checkbox-checked</code></dt>
	<dd>The checkbox is checked</dd>	
</dl>
<p>
All of the classes used for skinning the checkbox will be created using the 
<a href="../../api/module_classnamemanager.html">ClassNameManager Utility</a>, since it makes for 
easy generation and management of prefixed class names.  The styles for each checkbox comes together
as follows:
</p>

<textarea name="code" class="CSS" cols="60" rows="1">
.yui-checkbox {

	display: -moz-inline-stack;	/* Gecko < 1.9, since it doesn't support "inline-block" */
	display: inline-block; /* IE, Opera and Webkit, and Gecko 1.9 */
	width: 10px;
	height: 10px;
	border: inset 2px #999;

	/*
		Necessary for IE 6 (Quirks and Standards Mode) and IE 7 (Quirks Mode), since 
		they don't support use of negative margins without relative positioning.  
	*/

	_position: relative;
}

.yui-checkbox span {

	display: block;
	height: 14px;
	width: 12px;
	overflow: hidden;

	/* Position the checkmark for Gecko, Opera and Webkit and IE 7 (Strict Mode). */
	margin: -5px 0 0 1px;
	

	/* Position the checkmark for IE 6 (Strict and Quirks Mode) and IE 7 (Quirks Mode).*/
	_margin: 0;
	_position: absolute;
	_top: -5px;
	_left: 1px;
	
}

/* For Gecko < 1.9: Positions the checkbox on the same line as its corresponding label. */
.yui-checkbox span:after {

	content: ".";
	visibility: hidden;
	line-height: 2;

}

/*
	Hide the actual checkbox offscreen so that it is out of view, but still accessible via 
	the keyboard. 
*/
.yui-checkbox input {

	position: absolute;
	left: -10000px;

}

.yui-checkbox-focus {

	border-color: #39f;
	background-color: #9cf;

}

.yui-checkbox-active {

	background-color: #ccc;

}

.yui-checkbox-checked span {

	/* Draw a custom checkmark for the checked state using a background image. */
	background: url(checkmark.png) no-repeat;

}
</textarea>

<h4>JavaScript</h4>

<p>
Application and removal of the state-based class names will be facilitated by JavaScript event 
handlers.  Each event handler will track the state of the 
<code>&#60;input type="checkbox"&#62;</code> element, and apply and remove corresponding 
state-based class names from its outtermost <code>&#60;span&#62;</code> &#151; 
making it easy to style each state.  And since each JavaScript is required for state management, 
the stylesheet for the skinned checkboxes will only be added to the page when JavaScript is
enabled.  This will ensure that each checkbox works correctly with and without JavaScript enabled.
</p>

<p>
Since there could easily be many instances of a skinned checkbox on the page, all event 
listeners will be attached to the containing element for all checkboxes.  Each listener will 
listen for events as they bubble up from each checkbox.  Relying on event bubbling will improve the 
overall performance of the page by reducing the number of event handlers.
</p>

<p>
Since the DOM <code>focus</code> and <code>blur</code> events do not bubble, use the Event Utility's 
<a href="../../api/YUI.html#event_focus"><code>focus</code></a> and 
<a href="../../api/YUI.html#event_focus"><code>blur</code></a> custom events, as an alternative to 
attaching discrete focus and blur event handlers to the <code>&#60;input type="checkbox"&#62;</code>
element of each skinned checkbox.  The 
<a href="../../api/YUI.html#event_focus"><code>focus</code></a> and 
<a href="../../api/YUI.html#event_focus"><code>blur</code></a> custom events leverage 
capture-phase DOM event listeners, making it possible to attach a single focus and blur event 
listener on the containing element of each checkbox &#151; thereby increasing the performance 
of the page.  The complete script for the example comes together as follows:
</p>

<textarea name="code" class="JScript" cols="60" rows="1">
YUI({

	base: "<?php echo $buildDirectory; ?>",

	//	Load the stylesheet for the skinned checkboxes via JavaScript, since without 
	//	JavaScript skinning of the checkboxes wouldn't be possible.
	
	modules: {
		"checkboxcss": {
			type: "css",
			fullpath: "<?php echo $assetsDirectory; ?>checkbox.css"
		}    
	}

}).use(<?php echo $requiredModules; ?>, "checkboxcss", function(Y) {

	Y.on("contentready", function () {
	
		var getClassName = Y.ClassNameManager.getClassName,

			sCheckboxFocusClass = getClassName("checkbox", "focus"),	// Create yui-checkbox-focus
			sCheckboxCheckedClass = getClassName("checkbox", "checked"),	// Create yui-checkbox-checked
			sCheckboxActiveClass = getClassName("checkbox", "active"),	// Create yui-checkbox-active

			forAttr = (Y.UA.ie && Y.UA.ie < 8) ? "htmlFor" : "for",
			bBlockDocumentMouseUp = false,
			bBlockClearActive = false,
			oActiveCheckbox;


		var isLabel = function (node) {
		
			return (node.get("nodeName").toLowerCase() === "label");
		
		};


		var getCheckboxForLabel = function (label) {

			var sID = label.getAttribute(forAttr),
				oInput,
				oCheckbox;
				
			if (sID) {

				oInput = Y.Node.get("#" + sID);
				
				if (oInput) {
					oCheckbox = getCheckbox(oInput);
				}

			}

			return oCheckbox;
		
		};


		var getCheckbox = function (node) {

			return (node.hasClass("yui-checkbox") ? node : node.ancestor(".yui-checkbox"));
		
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


		var onDocumentMouseOver = function (event) {

			var oCheckbox = getCheckbox(event.target);
			
			if (oActiveCheckbox && oActiveCheckbox === oCheckbox) {
				oActiveCheckbox.addClass(sCheckboxActiveClass);
			}
		
		};
		

		var onDocumentMouseOut = function (event) {
		
			var oCheckbox = getCheckbox(event.target);

			if (oActiveCheckbox && oActiveCheckbox === oCheckbox) {
				oActiveCheckbox.removeClass(sCheckboxActiveClass);
			}
		
		};				
		

		var onDocumentMouseUp = function (event) {

			var oCheckbox;

			if (!bBlockDocumentMouseUp) {

				oCheckbox = getCheckbox(event.target);

				if ((oCheckbox && oActiveCheckbox !== oCheckbox) || !oCheckbox) {
					clearActiveCheckbox();
				}

			}

			bBlockDocumentMouseUp = false;
		
		};
		

		var onDocumentKeyUp = function (event) {

			var oCheckbox = getCheckbox(event.target);

			if ((oCheckbox && oActiveCheckbox !== oCheckbox) || !oCheckbox) {
				clearActiveCheckbox();
			}
		
		};


		var onCheckboxFocus = function (event) {
		
			var oCheckbox = getCheckbox(event.target);

			if (oCheckbox) {
				oCheckbox.addClass(sCheckboxFocusClass);
			}
		
		};


		var onCheckboxBlur = function (event) {
		
			var oCheckbox = getCheckbox(event.target);

			if (oCheckbox) {

				oCheckbox.removeClass(sCheckboxFocusClass);
			
				if (!bBlockClearActive && oCheckbox && oCheckbox === oActiveCheckbox) {
					clearActiveCheckbox();
				}

			}
		
			bBlockClearActive = false;
		
		};


		var onCheckboxClick = function (event) {
		
			var oTarget = event.target,
				oCheckbox = getCheckbox(oTarget),
				oInput;

			if (!isLabel(oTarget) && oCheckbox && oCheckbox === oActiveCheckbox) {

				oInput = oCheckbox.query("input");

				if (oInput) {

					// 	If the click event was fired via the keyboard, the target
					//	will be the input elment and the checked state of the input 
					//	element will therefore already be updated.  If the click event
					//	was fired via the mouse, the checked state will have to be 
					//	manually updated since the input is hidden offscreen and 
					//	therefore couldn't be the target of the click.
					
					if (oTarget !== oInput) {	
						oInput.set("checked", (!oInput.get("checked")));
					}

					updateCheckedState(oInput);
					clearActiveCheckbox();
				
				}

			}
		
		};


		var onCheckboxMouseDown = function (event) {

			var oTarget = event.target,
				oCheckbox = getCheckbox(oTarget),
				bTargetIsLabel = isLabel(oTarget),
				oInput; 

			if (bTargetIsLabel) { 

				oCheckbox = getCheckboxForLabel(oTarget);

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

			}


			if (oCheckbox) {

				if (!bTargetIsLabel) {
			
					oInput = oCheckbox.query("input");

					if (oInput) {
						oInput.focus();
					}

					//	Prevent text selection if the user moves the mouse over the 
					//	document after mousing down on the checkbox

					event.preventDefault();
				
				}

				setActiveCheckbox(oCheckbox);

			}
		
		};
		

		var onCheckboxKeyDown = function (event) {

			var oCheckbox = getCheckbox(event.target);
		
			//	Active the checkbox when the user presses the space bar
			if (oCheckbox && event.keyCode === 32) {
				setActiveCheckbox(oCheckbox);						
			}
		
		};

		
		var oDocument = Y.Node.get("#checkboxes").get("ownerDocument");

		oDocument.on("mouseover", onDocumentMouseOver);
		oDocument.on("mouseout", onDocumentMouseOut);
		oDocument.on("mouseup", onDocumentMouseUp);
		oDocument.on("keyup", onDocumentKeyUp);

		Y.on("mousedown", onCheckboxMouseDown, "#checkboxes");
		Y.on("keydown", onCheckboxKeyDown, "#checkboxes");	
		Y.on("click", onCheckboxClick, "#checkboxes");
		Y.on("focus", onCheckboxFocus, "#checkboxes");
		Y.on("blur", onCheckboxBlur, "#checkboxes");		

	}, "#checkboxes");
});
</textarea>