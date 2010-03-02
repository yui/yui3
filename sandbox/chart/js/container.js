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
	 * @param {Object} config Configuration parameters for the Container instance.
	 * @class Container
	 * @constructor
	 */
	function Container (config) 
	{
		Container.superclass.constructor.apply(this, arguments);
	}

	Container.NAME = "container";

	/**
	 * Attribute config
	 * @private
	 */
	Container.ATTRS = {
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
		 * Reference to the layout strategy used for displaying child items.
		 */
		layout:  
		{
			value:"LayoutStrategy",

			//needs a setter

			validator: function(val)
			{
				return Y.Array.indexOf(this.LAYOUTS, val) > -1;
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
		}
	};

	Y.extend(Container, Y.SWFWidget, 
	{
		_items:[],

		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS: "Container",
		
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
				this.appswf.createInstance(item._id, item.get("className"), args); 
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
			if(item instanceof SWFWidget)
			{
				item.set("added", true);
			}
		},

		/**
		 * @private
		 *
		 * Hash of child references with style objects.
		 */
		_styleObjHash: {background:"background"}

	});

	Y.Container = Container;
