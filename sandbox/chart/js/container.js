/**
 * Manages flash child objects.
 * @module chart
 *
 * Note: Container is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
		
	/**
	 * Creates the Container instance and contains initialization data
	 *
	 * @param {Object} p_oElement Parent class. If the this class instance is the top level
	 * of a flash application, the value is the id of its containing dom element. Otherwise, the
	 * value is a reference to it container.
	 * @param {Object} config (optional) Configuration parameters for the Chart.
	 * @class Container
	 * @constructor
	 */
	function Container (p_oElement, config) 
	{
		this._id = Y.guid(this.GUID);
		this._setParent(p_oElement);
		this.addAttrs(this._attributeConfig, config);
	}

	Container.prototype = 
	{
		_items:[],
		/**
		 * Sets the parent.
		 * @private
		 */
		_setParent: function(p_oElement)
		{
			this.oElement = p_oElement;
		},

		/**
		 * Reference to corresponding Actionscript class.
		 */
		CLASSNAME: "Container",
		
		/**
		 * Indicates whether or not the swf has initialized.
		 * @type Boolean
		 */
		swfReadyFlag: false,
		
		/**
		 * Id for a background skin
		 * @private
		 * @type String
		 * @default "background"
		 */
		_backgroundId:"background",
			  
		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuicontainer",

		/**
		 * @private
		 * Available layout strategies
		 */
		LAYOUTS: ["LayoutStrategy", "HLayout", "VLayout", "HFlowLayout", "VFlowLayout", "LayerStack", "BorderContainer"],

		/**
		 * @private
		 * Initializes Container properties.
		 * @method _init
		 */
		_init: function(swfowner)
		{
			var i, item, len;
			this.swfowner = swfowner;
			this.appswf = swfowner.appswf;
			this._addBackground();
			len = this._items.length;
			if(len < 1) 
			{
				return;
			}
			for(i = 0; i < len; i++)
			{
				item = this._items[i];
				this.addItem(item.item, item.props);
			}
			this._updateStyles();
		},

		/**
		 * Adds a background skin to the container.
		 *
		 * @private
		 */
		_addBackground:function()
		{
			this.appswf.createInstance("background", "Skin");
			this.appswf.applyMethod(this._id, "addItem", ["$background", {index:0}]);
			this._styleObjHash.background = "background";
		},

		/**
		 * Adds an item to a container instance.
		 *
		 * @param {Object} item to be added to the container instance.
		 * @props {Object} hash of layout information to be used by the parent container.
		 */
		addItem: function(item, props)
		{
			if(this.swfReadyFlag)
			{
				var args = item.swfarguments && typeof item.swfarguments == "array" ? item.args : [];
				this.appswf.createInstance(item._id, item.className, args); 
				args =  ["$" + item._id]; 
				if(props)
				{
					args.push(props);
				}
				this.appswf.applyMethod(this._id, "addItem", args);
			}
			else
			{
				this._items.push({item:item, props:props});
			}
		},

		/**
		 * @private
		 *
		 * Hash of default styles for the instance.
		 */
		_defaultStyles: {},

		/**
		 * @private
		 *
		 * Hash of child references with style objects.
		 */
		_styleObjHash: {background:"background"},

		/**
		 * Sets a style property for the instance.
		 *
		 * @method setStyle
		 * @param {String} style name of the style to be set
		 * @param {Object} value value to be set for the style
		 */
		setStyle: function(style, value)
		{
			var i, styles;
			if(this._styleObjHash.hasOwnProperty(style))
			{
				if(this._defaultStyles[style]) 
				{
					styles = this._defaultStyles[style];
					for(i in value)
					{
						if(value.hasOwnProperty(i))
						{
							styles[i] = value[i];
						}
					}
				}
				else
				{
					styles = value;
				}
				this._defaultStyles[style] = styles;
			}
			else
			{
				if(!this._defaultStyles.hasOwnProperty(this._id))
				{
					this._defaultStyles[this._id] = {};
				}
				this._defaultStyles[this._id][style] = value;
			}
			if(this.swfReadyFlag)
			{
				this._updateStyles();
			}
		},

		/**
		 * Sets multiple style properties on the instance.
		 *
		 * @method _setStyles
		 * @param {Object} styles Hash of styles to be applied.
		 */
		_setStyles: function(styles)
		{
			var i, j, defaults = this._defaultStyles;
			if(!defaults.hasOwnProperty(this._id))
			{
				defaults[this._id] = {};
			}
			for(i in styles)
			{
				if(styles.hasOwnProperty(i))
				{
					if(this._styleObjHash.hasOwnProperty(i))
					{
						j = this._styleObjHash[i];
						if(defaults && defaults.hasOwnProperty(j) && Y.Lang.isObject(defaults[j])) 
						{
							defaults[j] = this._mergeStyles(styles[i], defaults[j]);
						}
						else
						{
							defaults[j] = styles[i];
						}
					}
					else
					{
						j = this._id;
						if(defaults && defaults.hasOwnProperty(j) && defaults[j].hasOwnProperty(i) && Y.Lang.isObject(defaults[j][i]))
						{
							defaults[j][i] = this._mergeStyles(styles[i], defaults[j][i]);
						}
						else
						{
							defaults[j][i] = styles[i];
						}
					}
				}
			}
			this._defaultStyles = defaults;
			if(this.swfReadyFlag)
			{
				this._updateStyles();
			}
		},

		/**
		 * Merges to object literals only overriding properties explicitly.
		 * 
		 * @private
		 * @param {Object} newHash hash of properties to set
		 * @param {Object} default hash of properties to be overwritten
		 * @return {Object}
		 */
		_mergeStyles: function(a, b)
		{
			var i;
			for(i in a)
			{
				if(a.hasOwnProperty(i))
				{
					if(b.hasOwnProperty(i) && Y.Lang.isObject(a[i]))
					{
						b[i] = this._mergeStyles(a[i], b[i]);
					}
					else
					{
						b[i] = a[i];
					}

				}
			}
			return b;
		},
		
		/**
		 * Updates and applies styles to the appropriate object in the flash application.
		 *
		 * @method _updateStyles
		 * @private
		 */
		_updateStyles: function()
		{
			for(var id in this._defaultStyles)
			{
				if(this._defaultStyles.hasOwnProperty(id))
				{
					this.appswf.applyMethod(id, "setStyles", [this._defaultStyles[id]]);
				}
			}
			this._defaultStyles = null;
			this._defaultStyles = {};
		},

		/**
		 * Attribute config
		 * @private
		 */
		_attributeConfig:
		{
			/**
			 * Hash of optional layout parameters to be used by a parent container.
			 * @type Object
			 */
			props:{
				value: null,
				
				setter: function(val)
				{
					return val;
				},

				validator: function(val)
				{
					return Y.Lang.isObject(val);
				}
			},
			/**
			 * An array of constructor arguments used when creating an actionscript instance
			 * of the Container.
			 */
			swfargs: 
			{
				value: [],

				validator: function(val)
				{
					return Y.Lang.isArray(val);
				}
			},
			/**
			 * Reference to corresponding Actionscript class.
			 */
			className:  
			{
				value:this.CLASSNAME,

				readOnly:true
			},
			/**
			 * Reference to the layout strategy used for displaying child items.
			 */
			layout:  
			{
				value:"LayoutStrategy",

				//needs a setter

				validator: function(val)
				{
					return this.LAYOUTS.hasOwnProperty(val);
				}
			},
			
			/**
			 * Array of layoutChildren added to the Container instance.
			 *
			 * @private
			 */
			items:
			{
				value:[],

				setter: function(val)
				{
					this._items = val;
				},

				getter: function()
				{
					return this._items;
				},

				validator: function(val)
				{
					return Y.Lang.isArray(val);
				}
			},

			/**
			 * Hash of style properties for container
			 */

			styles:
			{
				value: null,

				setter: function(val)
				{
					this._setStyles(val);
				},

				validator: function(val)
				{
					return Y.Lang.isObject(val);
				}

			}

		},	
		/**
		 * Public accessor to the unique name of the Container instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the Container instance.
		 */
		toString: function()
		{
			return "Container " + this._id;
		}
	};

	Y.augment(Container, Y.Attribute);
	Y.Container = Container;
