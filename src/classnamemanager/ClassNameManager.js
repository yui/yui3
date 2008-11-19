/**
 * @module classnamemanager
 */

/**
 * A class for Widgets or classes that extend Base, providing: 
 * 
 * <ul>
 *    <li>Easy creation of prefixed class names</li>
 *    <li>Caching of previously created class names for improved performance.</li>
 * </ul>
 *
 * @class YUI.ClassNameManager
 */

if (!Y.CLASS_NAME_PREFIX) {

	/**
	 * String indicating the prefix for all CSS class names.
	 *
	 * @property YUI.CLASS_NAME_PREFIX
	 * @type {String}
	 * @static
	 */
	Y.CLASS_NAME_PREFIX = "yui-";
}

// String constants
var _HYPHEN = "-";

Y.ClassNameManager = function() {

};

var ClassNameManager = Y.ClassNameManager;


ClassNameManager.ATTRS = {

	/**
	* @attribute classNamePrefix
	* @description String indicating the prefix for all class names.
	* @default YUI.CLASS_NAME_PREFIX ("yui-")
	* @type String
	*/
	classNamePrefix: {
	
		value: Y.CLASS_NAME_PREFIX,
		writeOnce: true
	
	}

};


ClassNameManager.prototype = {

	/**
	 * The class name for the instance, by default set to the value of the 
	 * <code>classNamePrefix</code> attribute and the <code>NAME</code> property.
	 *
	 * @property _className
	 * @protected
	 * @type {String}		 
	 */            
	_className: null,

	/**
	 * Collection of all of the class names used by the instance.
	 *
	 * @property _classNames
	 * @protected
	 * @type {Object}
	 */            
	_classNames: null,

	/**
	 * Returns a class name prefixed with the both the value of the 
	 * <code>classNamePrefix</code> attribute and the <code>NAME</code> property.
	 * 
	 * @method getClassName
	 * @param {String} classname
	 */
	getClassName: function (classname) {

		if (!this._className) {
			this._className = this.get("classNamePrefix") + this.constructor.NAME.toLowerCase();
		}


		if (!this._classNames) {
			this._classNames = {};
		}
	

		var oClassNames = this._classNames,
			sClassName  = oClassNames[classname];


		if (!sClassName) {
			sClassName =  this._className + _HYPHEN + classname;
			oClassNames[classname] = sClassName;
		}
		
		return sClassName;				
	
	}

};