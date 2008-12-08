<div id="checkboxes">
	<div>
		<label for="field-1">Field 1: </label>
		<span class="yui-checkbox">
			<span>
				<input type="checkbox" id="field-1" name="field-1" value="1">
			</span>
		</span>
	</div>
	<div>
		<label for="field-2">Field 2: </label>
		<span class="yui-checkbox">
			<span>
				<input type="checkbox" id="field-2" name="field-2" value="2">
			</span>
		</span>
	</div>
	<div>
		<label for="field-3">Field 3: </label>
		<span class="yui-checkbox">
			<span>
				<input type="checkbox" id="field-3" name="field-3" value="3">
			</span>
		</span>
	</div>			
</div>

<script type="text/javascript">

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

</script>
