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
		this._parseConfigs(config);
	}

	/**
	 * Need to refactor to augment or extend Attribute
	 */
	Container.prototype =
	{
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
		 * Hash of optional layout parameters to be used by a parent container.
		 * @type Object
		 */
		props: null,
		
		/**
		 * Sets the parent.
		 * @private
		 */
		_setParent: function(p_oElement)
		{
			this.oElement = p_oElement;
		},

		/**
		 * Sets properties based on a configuration hash.
		 * @private
		 */
		_parseConfigs: function(config)
		{
			if(config && config.hasOwnProperty("layout")) 
			{
				this.layout = config.layout;
			}
			this.swfargs.push(this.layout);
			if(config && config.hasOwnProperty("props"))
			{
				this.props = this.config.props;
			}
			if(config && config.hasOWnProperty("styles"))
			{
				this.setStyles(config.styles);
			}
		},
		
		/**
		 * An array of constructor arguments used when creating an actionscript instance
		 * of the Container.
		 */
		swfargs: [],

		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "Container",
		
		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuicontainer",

		/**
		 * Reference to the layout strategy used for displaying child items.
		 */
		layout:  "LayoutStrategy",

		/**
		 * Array of layoutChildren added to the Container instance.
		 *
		 * @private
		 */
		_items: [],

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
			this._setStyles();
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
				this._setStyles();
			}
		},

		/**
		 * Sets multiple style properties on the instance.
		 *
		 * @method setStyles
		 * @param {Object} styles Hash of styles to be applied.
		 */
		setStyles: function(styles)
		{
			var i;
			for(i in styles)
			{
				if(styles.hasOwnProperty(i))
				{
					if(this._styleObjHash.hasOwnProperty(i))
					{
						this._defaultStyles[this._styleObjHash[i]] = styles[i];
						continue;
					}
					if(!this._defaultStyles.hasOwnProperty(this._id))
					{
						this._defaultStyles[this._id] = {};
					}
					this._defaultStyles[this._id][i] = styles[i];
				}
			}
			if(this.swfReadyFlag)
			{
				this._setStyles();
			}
		},
		
		/**
		 * Updates and applies styles to the appropriate object in the flash application.
		 *
		 * @method _setStyles
		 * @private
		 */
		_setStyles: function()
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

	Y.Container = Container;
