YUI.add("widget", function(Y) {

	var L = Y.Lang;


	// String constants
	var _WIDGET = "widget",
		_CONTENT = "content",
		_VISIBLE = "visible",
		_HIDDEN = "hidden",
		_ENABLED = "enabled",
		_DISABLED = "disabled",
		_FOCUS = "focus",
		_HAS_FOCUS = "hasFocus",
		_WIDTH = "width",
		_HEIGHT = "height",
		_UI = "ui",
		_DIV = "div",
		_EMPTY = "",
		_HYPHEN = "-";

	// Widget nodeid-to-instance map for now, 1-to-1. 
	// Expand to nodeid-to-arrayofinstances if required.
	var _instances = {};

	/**
	 * A base class for widgets, providing:
	 * <ul>
	 *    <li>The render lifecycle method, in addition to the init and destroy 
	 *        lifecycle methods provide by Base</li>
	 *    <li>Abstract methods to support consistent MVC structure across 
	 *        widgets: renderer, initUI, syncUI</li>
	 *    <li>Support for common widget attributes, such as id, node, visible, 
	 *        disabled, strings</li>
	 *    <li>Plugin registration and activation support</li>
	 * </ul>
	 *
	 * @param config {Object} Object literal specifying widget configuration 
	 * properties (may container both attribute and non attribute configuration).
	 * 
	 * @class YUI.Widget
	 * @extends YUI.Base
	 */
	function Widget(config) {
		Y.log('constructor called', 'life', 'Widget');

		this.uid = Y.guid(_WIDGET);
		this.rendered = false;
		this._plugins = {};

		var boundingBox;

		if (!config.boundingBox) { // create from template if no bounding box provided
			config = Y.merge(config);
			
			boundingBox = Y.Node.create(this.constructor.TEMPLATE || Widget.TEMPLATE);
			
			config.boundingBox = boundingBox;
			config.contentBox = boundingBox.get("firstChild");
			
		}

		Widget.superclass.constructor.apply(this, arguments);
	}

	/**
	 * Static property provides a string to identify the class.
	 * Currently used to apply class identifiers to the bounding box 
	 * and to classify events fired by the widget.
	 *
	 * @property YUI.Widget.NAME
	 * @type {String}
	 * @static
	 */
	Widget.NAME = _WIDGET;

	/**
	 * Static property outlining the markup template for the class in JsonML.
	 *
	 * @property YUI.Widget.TEMPLATE
	 * @type {Array}
	 * @static
	 */
	Widget.TEMPLATE = [_DIV, [_DIV]];

	/**
	 * Static property used to define the default attribute 
	 * configuration for the Widget.
	 * 
	 * @property YUI.Widget.ATTRS
	 * @type {Object}
	 */
	Widget.ATTRS = {

		/**
		* @attribute boundingBox
		* @description The outermost DOM node for the Widget, used for sizing and positioning 
		* of a Widget as well as a containing element for any decorator elements used 
		* for skinning.
		* @type YUI.Node
		*/
		boundingBox: {
			set: function(val) {
				return this._initNode(val);
			},
			writeOnce: true
		},

		/**
		* @attribute contentBox
		* @description A DOM node that is a direct descendent of a Widget's bounding box that 
		* houses its content.
		* @type YUI.Node
		*/            
		contentBox: {
			writeOnce: true
		},


		/**
		* @attribute hasFocus
		* @description Boolean indicating if the Widget has focus.
		* @default false
		* @type Boolean
		*/
		hasFocus: {
			value: false
		},


		/**
		* @attribute disabled
		* @description Boolean indicating if the Widget should be disabled.  
		* (Disabled widgets will not respond to user input or fire events.)
		* @default false
		* @type Boolean
		*/
		disabled: {
			value: false
		},


		/**
		* @attribute visible
		* @description Boolean indicating weather or not the Widget is visible.
		* @default true
		* @type Boolean
		*/
		visible: {
			value: true
		},


		/**
		* @attribute height
		* @description String or number representing the height of the Widget.
		* @default ""
		* @type {String | Number}
		*/
		height: {
			// Default to not set on element style
			value: _EMPTY
		},

		/**
		* @attribute width
		* @description String or number representing the width of the Widget.
		* @default ""
		* @type {String | Number}
		*/
		width: {
			// Default to not set on element style
			value: _EMPTY
		},

		/**
		* @attribute strings
		* @description Collection of strings used to label elements of a Widget's UI.
		* @type Object
		*/
		strings: {
			// Widget UI strings go here
		}
	};

	/**
	 * Obtain Widget instances by bounding box id.
	 *
	 * @method YUI.Widget.getByNodeId
	 * @param id {String} Id used to identify the widget uniquely.
	 * @return {Widget} Widget instance
	 */
	Widget.getByNodeId = function(id) {
		return _instances[id];
	};

	var proto = {

		/**
		 * Initializer lifecycle implementation for the Widget class.
		 * 
		 * Base.init will invoke all prototype.initializer methods, for the
		 * class hierarchy (starting from Base), after all attributes have 
		 * been configured.
		 * 
		 * @param  config {Object} Configuration obejct literal for the widget
		 */
		initializer: function(config) {
			Y.log('initializer called', 'life', 'Widget');

			this._className = this.get("classNamePrefix") + this.constructor.NAME.toLowerCase();

			this._initPlugins(config);

			if (this.id) {
				_instances[this.id] = this;
			}
		},

		/**
		 * Descructor lifecycle implementation for the Widget class.
		 * 
		 * Base.destroy will invoke all prototype.destructor methods, for the
		 * class hierarchy (starting from the lowest sub-class).
		 *
		 */
		destructor: function() {
			Y.log('destructor called', 'life', 'Widget');

			this._destroyPlugins();

			if (this.id) {
				delete _instances[this.id];
			}
		},

		/**
		 * Establishes the initial DOM for the widget. Invoking this
		 * method will lead to the creating of all DOM elements for
		 * the widget (or the manipulation of existing DOM elements 
		 * for the progressive enhancement use case).
		 * <p>
		 * This method should only be invoked once for an initialized
		 * widget.
		 * </p>
		 * <p>
		 * It delegates to the widget specific renderer method to do
		 * the actual work.
		 * </p>
		 * 
		 * @method render
		 * @public
		 * @chain
		 * @final 
		 * @param  parentNode {Object | String} Object representing a YUI.Node instance or a string 
		 * representing a CSS selector used to retrieve a YUI.Node reference.
		 */
		render: function(parentNode) {
			if (this.destroyed) {
				throw('render failed; widget has been destroyed');
			}

			if (L.isString(parentNode)) {
				parentNode = Y.Node.get(parentNode);
			}

			// append to parent if provided, or to body if no parent and not in body 
			parentNode = parentNode || Y.Node.get("body");
			if (parentNode && !parentNode.contains(this._boundingBox)) {
				parentNode.appendChild(this._boundingBox);
			}

			if (!this.rendered && this.fire("beforeRender") !== false) {
				this._uiInitNode();

				this._bindUI();
				this._syncUI();

				if (this.renderer) {
					this.renderer();
				}

				this.rendered = true;
				this.fire("render");
			}

			return this;
		},

		/** 
		 * Creates DOM (or manipulates DOM for progressive enhancement)
		 * This method is invoked by render() and is not chained 
		 * automatically for the class hierarchy (like initializer, destructor) 
		 * so it should be chained manually for subclasses if required.
		 * 
		 * @method renderer
		 */
		renderer: function() {},

		/**
		 * Configures/Setsup listeners to bind Widget State to UI/DOM
		 * 
		 * This method is not called by framework and is not chained 
		 * automatically for the class hierarchy.
		 * 
		 * @method bindUI
		 */
		bindUI: function() {},

		/**
		 * Adds nodes to the DOM 
		 * 
		 * This method is not called by framework and is not chained 
		 * automatically for the class hierarchy.
		 * 
		 * @method renderUI
		 */
		renderUI: function() {},

		/**
		 * Refreshes the rendered UI, based on Widget State
		 * 
		 * This method is not called by framework and is not chained
		 * automatically for the class hierarchy.
		 * 
		 * @method syncUI
		 */
		syncUI: function(){},

		/**
		* @method hide
		* @description Shows the Module element by setting the "visible" attribute to "false".
		*/
		hide: function() {
			return this.set(_VISIBLE, false);
		},

		/**
		* @method show
		* @description Shows the Module element by setting the "visible" attribute to "true".
		*/
		show: function() {
			return this.set(_VISIBLE, true);
		},

		/**
		* @method focus
		* @description Causes the Widget to receive the focus by setting the "hasFocus" 
		* attribute to "true".
		*/
		focus: function () {
			return this.set(_HAS_FOCUS, true);
		},

		/**
		* @method blur
		* @description Causes the Widget to lose focus by setting the "hasFocus" attribute 
		* to "false"
		*/            
		blur: function () {
			return this.set(_HAS_FOCUS, false);
		},

		/**
		* @method enable
		* @description Set the Widget's "disabled" attribute to "false".
		*/
		enable: function() {
			return this.set(_ENABLED, true);
		},

		/**
		* @method disabled
		* @description Set the Widget's "disabled" attribute to "true".
		*/
		disable: function() {
			return this.set(_DISABLED, false);
		},

		/**
		 * Sets the state of an attribute. Wrapper for
		 * AttributeProvider.set, with additional ability 
		 * to chain.
		 * 
		 * @method set
		 * @chain
		 */
		set: function() { 
			// extend to chain set calls
			Y.Attribute.prototype.set.apply(this, arguments);
			return this;
		},

		/**
		 * Returns an attribute of the Node instance specified as the Widget's bounding box.
		 * 
		 * @method getNodeAttr
		 */
		getNodeAttr: function(attr) {
			if (this._boundingBox) {
				return this._boundingBox.att(attr);
			}
			return undefined;
		},

		/**
		 * Sets an attribute for the Node instance specified as the Widget's bounding box.
		 * 
		 * @method getNodeAttr
		 * @chain             
		 */
		setNodeAttr: function(attr, val) {
			if (this._boundingBox) {
				this._boundingBox.att(attr, val);
			}
			return this;
		},

		/**
		 * Register and instantiate a plugin with the Widget.
		 * 
		 * @param p {String | Object |Array} Accepts the registered 
		 * namespace for the Plugin or an object literal with an "fn" property
		 * specifying the Plugin class and a "cfg" property specifying
		 * the configuration for the Plugin.
		 * <p>
		 * Additionally an Array can also be passed in, with either String or 
		 * Object literal elements, allowing for multiple plugin registration in 
		 * a single call
		 * </p>
		 * @method plug
		 * @chain
		 * @public
		 */
		plug: function(p) {
			if (p) {
				if (L.isArray(p)) {
					var ln = p.length;
					for (var i = 0; i < ln; i++) {
						this.plug(p[i]);
					}
				} else if (L.isFunction(p)) {
					this._plug(p);
				} else {
					this._plug(p.fn, p.cfg);
				}
			}
			return this;
		},

		/**
		 * Unregister and destroy a plugin already instantiated with the Widget.
		 * 
		 * @method unplug
		 * @param {String} ns The namespace key for the Plugin
		 * @chain
		 * @public
		 */
		unplug: function(ns) {
			if (ns) {
				this._unplug(ns);
			} else {
				for (ns in this._plugins) {
					this._unplug(ns);
				}
			}
			return this;
		},

		/**
		 * Determines if a plugin has been registered and instantiated 
		 * for this widget.
		 * 
		 * @method hasPlugin
		 * @public
		 * @return {Boolean} returns true, if the plugin has been applied
		 * to this widget.
		 */
		hasPlugin : function(ns) {
			return (this._plugins[ns] && this[ns]);
		},

		/**
		 * @private
		 */
		 
		_initPlugins: function(config) {

			// Class Configuration
			var classes = this._getClasses(), constructor;
			for (var i = 0; i < classes.length; i++) {
				constructor = classes[i];
				if (constructor.PLUGINS) {
					this.plug(constructor.PLUGINS);
				}
			}

			// User Configuration
			if (config && config.plugins) {
				this.plug(config.plugins);
			}
		},

		/**
		 * @private
		 */
		_destroyPlugins: function() {
			this._unplug();
		},

		/**
		 * @private
		 */
		_plug: function(PluginClass, config) {
			if (PluginClass && PluginClass.NS) {
				var ns = PluginClass.NS;

				config = config || {};
				config.owner = this;

				if (this.hasPlugin(ns)) {
					// Update config
					// this[ns].setAttributeConfigs(config, false);
					this[ns].setAtts(config);
				} else {
					// Create new instance
					this[ns] = new PluginClass(config);
					this._plugins[ns] = PluginClass;
				}
			}
		},


		/**
		 * @private
		 */
		_unplug : function(ns) {
			if (ns) {
				if (this[ns]) {
					this[ns].destroy();
					delete this[ns];
				}
				if (this._plugins[ns]) {
					delete this._plugins[ns];
				}
			}
		},


		/**
		 * Sets up listeners to synchronize UI state to attribute
		 * state.
		 *
		 * @method _bindUI
		 * @protected
		 */
		_bindUI: function() {
			this.on('visibleChange', this._onVisibleChange);
			this.on('disabledChange', this._onDisabledChange);
			this.on('heightChange', this._onHeightChange);
			this.on('widthChange', this._onWidthChange);
			this.on('hasFocusChange', this._onHasFocusChange);
			this._boundingBox.on(_FOCUS, Y.bind(this._onFocus, this));
			this._boundingBox.on("blur", Y.bind(this._onBlur, this));
		},


		/**
		 * Updates the widget UI to reflect the attribute state.
		 * 
		 * @method _syncUI
		 * @protected
		 */
		_syncUI: function() {
			this._uiSetVisible(this.get(_VISIBLE));
			this._uiSetDisabled(this.get(_DISABLED));
			this._uiSetHeight(this.get(_HEIGHT));
			this._uiSetWidth(this.get(_WIDTH));
			this._uiSetHasFocus(this.get(_HAS_FOCUS));
		},

		/**
		 * Sets the height on the widget's bounding box element
		 * 
		 * @method _uiSetHeight
		 * @protected
		 * @param {String | Number} val
		 */
		_uiSetHeight: function(val) {
			if (L.isNumber(val)) {
				val = val + this.DEF_UNIT;
			}
			this._boundingBox.setStyle(_HEIGHT, val);
		},

		/**
		 * Sets the width on the widget's bounding box element
		 *
		 * @method _uiSetWidth
		 * @protected
		 * @param {String | Number} val
		 */
		_uiSetWidth: function(val) {
			if (L.isNumber(val)) {
				val = val + this.DEF_UNIT;
			}
			this._boundingBox.setStyle(_WIDTH, val);
		},

		/**
		 * Sets the visible state for the UI
		 * 
		 * @method _uiSetVisible
		 * @protected
		 * @param {boolean} val
		 */
		_uiSetVisible: function(val) {

			var sClassName = this.getClassName(_HIDDEN);

			if (val === true) { 
				this._boundingBox.removeClass(sClassName); 
			} else {
				this._boundingBox.addClass(sClassName); 
			}
		},

		/**
		 * Sets the disabled state for the UI
		 * 
		 * @protected
		 * @param {boolean} val
		 */
		_uiSetDisabled: function(val) {

			var sClassName = this.getClassName(_DISABLED);

			if (val === true) {
				this._boundingBox.addClass(sClassName);
			} else {
				this._boundingBox.removeClass(sClassName);
			}
		},

		/**
		 * Sets the hasFocus state for the UI
		 * 
		 * @protected
		 * @param {boolean} val
		 * @param {string} src String representing the source that triggered an update to 
		 * the UI.     
		 */
		_uiSetHasFocus: function(val, src) {
			
			var sClassName = this.getClassName(_FOCUS);

			if (val === true) {
				this._boundingBox.addClass(sClassName);
				if (src !== _UI) {
					this._boundingBox.focus();
				}
				
			} else {
				this._boundingBox.removeClass(sClassName);
				if (src !== _UI) {
					this._boundingBox.blur();
				}
			}
		
		},

		/**
		 * Initializes widget state based on the node value
		 * provided, which maybe an instance of Y.Node, or a selector
		 * string
		 * 
		 * @method _initNode
		 * @protected
		 * @param {Node | String} node An instance of Y.Node, 
		 * representing the widget's bounding box, or a selector
		 * string which can be used to retrieve it. 
		 */
		_initNode: function(node) {
			// TODO: Looking at the node impl, this should 
			// also take care of id generation, if an id doesn't exist
			if (L.isString(node)) {
				node = Y.Node.get(node);
			}

			// Node not found
			if (node) {
				this.id = node.get("id");
				this._boundingBox = node;

				var contentBox = node.get("firstChild");
				
				if (contentBox) {
					this._contentBox = contentBox;
					this.set("contentBox", contentBox);
				}
				else {
					throw("node for content box not found");					
				}
			}
			else {
				throw("node for bounding box not found");                
			}

			return node;
		},

		/**
		 * Initializes the UI state for the bounding box. Applies marker
		 * classes to identify the widget.
		 * 
		 * @method _uiInitNode
		 * @protected
		 */
		_uiInitNode: function() {
			var classes = this._getClasses(), 
				constructor,
				classname;

			// Starting from 1, because we don't need Base (yui-base) marker
			for (var i = 1; i < classes.length; i++) {
				constructor = classes[i];
				if (constructor.NAME) {
				
					classname = this._className;
				
					this._boundingBox.addClass(classname);
					this._contentBox.addClass(classname + _HYPHEN + _CONTENT);
				}
			}
			
			this._boundingBox.set("tabIndex", 0);

		},

		/**
		 * Visible attribute UI handler
		 * 
		 * @method _onVisibleChange
		 * @protected
		 * @param {Object} evt Event object literal passed by AttributeProvider
		 */
		_onVisibleChange: function(evt) {
			this._uiSetVisible(evt.newVal);
		},

		/**
		 * Disabled attribute UI handler
		 * 
		 * @method _onDisabledChange
		 * @protected
		 * @param {Object} evt Event object literal passed by AttributeProvider
		 */
		_onDisabledChange: function(evt) {
			this._uiSetDisabled(evt.newVal);
		},
		
		/**
		 * Height attribute UI handler
		 * 
		 * @method _onHeightChange
		 * @protected
		 * @param {Object} evt Event object literal passed by AttributeProvider
		 */
		_onHeightChange: function(evt) {
			this._uiSetHeight(evt.newVal);
		},

		/**
		 * Width attribute UI handler
		 * 
		 * @method _onWidthChange
		 * @protected
		 * @param {Object} evt Event object literal passed by AttributeProvider
		 */
		_onWidthChange: function(evt) {
			this._uiSetWidth(evt.newVal);
		},

		/**
		 * hasFocus attribute UI handler
		 * 
		 * @method _onHasFocusChange
		 * @protected
		 * @param {Object} evt Event object literal passed by AttributeProvider
		 */
		_onHasFocusChange: function(evt) {
			this._uiSetHasFocus(evt.newVal, evt.src);
		},

		/**
		 * focus event UI handler used to sync the state of the Widget with the DOM
		 * 
		 * @method _onFocus
		 * @protected
		 */
		_onFocus: function () {
			this.set(_HAS_FOCUS, true, { src: _UI });
		},

		/**
		 * blur event UI handler used to sync the state of the Widget with the DOM
		 * 
		 * @method _onBlur
		 * @protected
		 */			
		_onBlur: function () {
			this.set(_HAS_FOCUS, false, { src: _UI });
		},

		/**
		 * Generic toString implementation for all widgets.
		 * @method toString
		 */
		toString: function() {
			return this.constructor.NAME + "[" + this.id + "]";
		},

		/**
		 * Default unit to use for style values
		 */
		DEF_UNIT : "px"

	};

	/**
	 * Static registration of default plugins for the class.
	 * 
	 * @property Y.Widget.PLUGINS
	 * @static
	 */
	Widget.PLUGINS = [
		// Placeholder for Widget Class Default plugins

		// - OR -
		// Instantiate a new plugin with or configure an existing plugin
		// { fn:Y.Plugin.Mouse, cfg:mousecfg }
	];

	Y.extend(Widget, Y.Base, proto);

	Y.augment(Widget, Y.ClassNameManager);

	Y.aggregate(Widget, Y.ClassNameManager);

	Y.Widget = Widget;

}, "3.0.0");