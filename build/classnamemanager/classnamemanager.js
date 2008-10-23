YUI.add('classnamemanager', function(Y) {

// String constants
var CLASS_NAME_PREFIX = 'classNamePrefix',
    HYPHEN = '-';

/**
 * Run-time getClassName method (post infra initialization)
 */
function _getClassName(c,x) {
    // Test for multiple classname bits
    if (x) {
        c = Y.Array(arguments,0,true).join(HYPHEN);
    }

    // memoize in _classNames map
    return this._classNames[c] ||
            (this._classNames[c] = this._className + HYPHEN + c);
}
	
/**
 * First use initializer to set up infrastructure for getClassName
 */
function _initGetClassName() {
    this._className = this.get(CLASS_NAME_PREFIX) +
                      this.constructor.NAME.toLowerCase();

    this._classNames = {};

    // replace the instance method with run-time version and pass through
    this.getClassName = _getClassName;

    return _getClassName.apply(this,arguments);
}


// Global config

/**
 * Configuration property indicating the prefix for all CSS class names in
 * this YUI instance.  Set during new YUI({classNamePrefix:'foo-'}) or during
 * run-time Y.config.classNamePrefix = 'foo-';
 *
 * @property Y.config.classNamePrefix
 * @type {String}
 * @static
 */
Y.config[CLASS_NAME_PREFIX] = Y.config[CLASS_NAME_PREFIX] || 'yui-';


// Class definition

/**
 * A class for Widgets or classes that extend Base, providing: 
 * 
 * <ul>
 *    <li>Easy creation of prefixed class names</li>
 *    <li>Caching of previously created class names for improved performance.</li>
 * </ul>
 * 
 * @class ClassNameManager
 */
function ClassNameManager() {}

ClassNameManager.ATTRS = {};

/**
* @attribute classNamePrefix
* @description String indicating the prefix for all class names.
* @default YUI.CLASS_NAME_PREFIX ("yui-")
* @type String
*/
ClassNameManager.ATTRS[CLASS_NAME_PREFIX] = {
    value: Y.config[CLASS_NAME_PREFIX],
    writeOnce: true
};

ClassNameManager.prototype = {

	/**
	 * The class name for the instance, by default set to the value of the 
	 * <code>classNamePrefix</code> attribute + the <code>NAME</code> property.
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
	 * Returns a class name prefixed with the the value of the 
	 * <code>classNamePrefix</code> attribute + the <code>NAME</code> property.
     * E.g. this.getClassName('foo','bar'); // yui-mywidget-foo-bar
	 * 
	 * @method getClassName
	 * @param {String}+ one or more classname bits to be joined and prefixed
     *                  by this class's className base (see private _className)
	 */
	getClassName: _initGetClassName

};

Y.ClassNameManager = ClassNameManager;


}, '@VERSION@' );
