YUI.add("cssstatemanager", function (Y) { 

	if (!Y.CSS_PREFIX) {

        /**
         * String indicating the prefix for all CSS class names.
         *
         * @property YUI.CSS_PREFIX
         * @type {String}
         * @static
         */
		Y.CSS_PREFIX = "yui-";
	}


	// String constants
	var _HYPHEN = "-";

	Y.CSSStateManager = function() {

	};

	var CSSStateManager = Y.CSSStateManager;


	CSSStateManager.ATTRS = {

		/**
		* @attribute cssprefix
		* @description String indicating the prefix for all CSS class names.
		* @default YUI.CSS_PREFIX ("yui-")
		* @type String
		*/
		cssprefix: {
		
			value: Y.CSS_PREFIX,
			writeOnce: true
		
		}

	};


	CSSStateManager.prototype = {

		/**
		 * Collection of all of the CSS class names used by the widget.
		 *
		 * @property _cssClassNames
		 * @protected
		 */            
		_cssClassNames: null,

		/**
		 * Returns a CSS class name representing the provided state of the widget.
		 * 
		 * @method getClassNameForState
		 */
		getClassNameForState: function (state) {

			if (!this._cssClassNames) {
				this._cssClassNames = {};
			}
		

			var oClassNames = this._cssClassNames,
				sClassName  = oClassNames[state];


			if (!sClassName) {
				sClassName =  this._cssClassName + _HYPHEN + state;
				oClassNames[state] = sClassName;
			}
			
			return sClassName;				
		
		}

	};


}, '3.0.0');