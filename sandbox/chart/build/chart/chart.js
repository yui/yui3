YUI.add('chart', function(Y) {

/**
 *
 * SWFWidget is the base class for all JS classes that manage styles
 * and communicates with a SWF Application.
 */



/**
 * Creates the SWFWidget instance and contains initialization data
 *
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class SWFWidget
 * @constructor
 */
function SWFWidget (config)
{
	this._createId();
	Y.SWF._instances[this._id] = this;
	SWFWidget.superclass.constructor.apply(this, arguments);
}

/**
 *
 */
SWFWidget.NAME = "swfWidget";

SWFWidget._instances = SWFWidget._instances || {};

/**
 * Handles an event from the application swf in which a listener has been
 * registered through an instance of SWFWidget. 
 * @method eventHandler
 * @param swfid {String} the id of the SWF dispatching the event
 * @param event {Object} the event being transmitted.
 * @private
 */
SWFWidget.eventHandler = function (swfid, event) {
	SWFWidget._instances[swfid]._eventHandler(event);
};

/**
 * Attribute config
 * @private
 */
SWFWidget.ATTRS = {
    /**
     * Reference to the application class
     */
    app: {
        getter: function()
        {
            return this._app;
        },
        setter: function(val)
        {
            this._app = val;
            return val;
        }
    },

    /**
	 * Parent element for the SWFWidget instance.
	 */
	parent:{
        lazyAdd:false,
		
        getter: function()
        {
            return this._parent;
        },

        setter: function(val)
        {
            this._parent = val;
            if(val instanceof Y.SWFApplication)
            {
                this.set("app", val);
            }
            else if(val instanceof Y.SWFWidget)
            {
                this.set("app", val.get("app"));
            }
        }   
	},

	/**
	 * Indicates whether item has been added to its parent.
	 */
	added:
	{
		value:false
	},
	/**
	 * Reference to corresponding Actionscript class.
	 */
	className:  
	{
		readOnly:true,

		getter: function()
		{
			return this.AS_CLASS;
		}
	},
	/**
	 * Hash of style properties for class
	 */
	styles:
	{
		value: {},

		lazyAdd: false,

		setter: function(val)
		{
			val = this._setStyles(val);
			if(this.swfReadyFlag)
			{
				this._updateStyles();
			}
			return val;
		},
		
		validator: function(val)
		{
			return Y.Lang.isObject(val);
		}
	},

	id: 
	{
		getter: function()
		{
			return this._id;
		}
	}
};

Y.extend(SWFWidget, Y.Base,
{
    /**
     * @private
     * Storage for parent
     */
    _parent: null,

    /**
     * @private
     * Storage for app
     */
    _app: null,

	/**
	 * Creates unique id for class instance.
	 *
	 * @private
	 */
	_createId: function()
	{
		this._id = Y.guid(this.GUID);
	},

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "SWFWidget",

	/**
	 * Indicates whether or not the swf has initialized.
	 * @type Boolean
	 */
	swfReadyFlag: false,

	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuiswfwidget",
	
	/**
	 * @private
	 *
	 * Returns a hash of default styles for the class.
	 */
	_getDefaultStyles:function()
	 {
		return {};
	 },

	/**
	 * @private
	 *
	 * Hash of child references with style objects.
	 */
	_styleObjHash: null,

	/**
	 * Sets multiple style properties on the instance.
	 *
	 * @method _setStyles
	 * @param {Object} styles Hash of styles to be applied.
	 */
	_setStyles: function(newstyles)
	{
		var j, styles = this.get("styles") || {},
		styleHash = this._styleObjHash;
		styles[this._id] = styles[this._id] || {};
		Y.Object.each(newstyles, function(value, key, newstyles)
		{
			if(styleHash && styleHash.hasOwnProperty(key))
			{
				j = styleHash[key];
				if(j instanceof SWFWidget)
				{
					j.set("styles", value);
					styles[key] = j.get("styles");
				}
				else if(Y.Lang.isObject(styles[j])) 
				{
					styles[j] = this._mergeStyles(value, styles[j]);
				}
				else
				{
					styles[j] = newstyles[j];
				}
			}
			else
			{
				j = this._id;
				if(Y.Lang.isObject(styles[j]) && Y.Lang.isObject(styles[j][key]))
				{
					styles[j][key] = this._mergeStyles(value, styles[j][key]);
				}
				else
				{
					styles[j][key] = value;
				}
			}
		}, this);
		return styles;
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
		Y.Object.each(a, function(value, key, a)
		{
			if(b.hasOwnProperty(key) && Y.Lang.isObject(value))
			{
				b[key] = this._mergeStyles(value, b[key]);
			}
			else
			{
				b[key] = value;
			}
		}, this);
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
		var styleHash = this._styleObjHash,
		styles = this.get("styles");
		Y.Object.each(styles, function(value, key, styles)
		{
			if(this._id === key || (styleHash && styleHash.hasOwnProperty(key) && !(styleHash[key] instanceof SWFWidget)))
			{
				this.get("app").applyMethod(key, "setStyles", [styles[key]]);
			}
		}, this);
	},

	_events: {},

	_init: function(swfowner)
    {
		this._addSWFEventListeners();
	},

	/**
	 * @private
	 * Registers event listeners from the _events queue.
	 */
	_addSWFEventListeners: function()
	{
		var events = this._events,
			type;
		for(type in events)
		{
			if(events.hasOwnProperty(type) && !events[type].registered)
			{
				events[type].registered = true;
				this.get("app").onFlash(type, this);
			}
		}
	},

	/**
	 * @private (override)
	 */
	on: function(type , fn , context , arg)
	{
		var events = this._events;
		if(!this._events.hasOwnProperty(type))
		{
			events[type] = {type:type, args:arguments, registered:false};
			if(this.swfowner && this.swfowner.swfReady && this._id)
			{
				events[type].registered = true;
				this.get("app").onFlash(type, this);
			}
		}
		SWFWidget.superclass.on.apply(this, arguments);
	},
	
	/**
	 * @private
	 * Dispatches events from flash.
	 */
	_eventHandler: function(event)
	{
		this.fire(event.type, event);
	}
});

Y.SWFWidget = SWFWidget;
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
			this._addSWFEventListeners();
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

		_events: {},
		/**
		 * @private
		 *
		 * Hash of child references with style objects.
		 */
		_styleObjHash: {background:"background"}

	});

	Y.Container = Container;
/**
 * Create data visualizations with line graphs, histograms, and other methods.
 * @module swfApplication
 *
 *
 * Note: SWFApplication is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash swfApplication rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
	/**
	 * The SWFApplication widget is the base class for hybrid flash applications.
	 * @module swfApplication
	 * @title SWFApplication
	 * @requires yahoo, dom, event, swfWidget, container
	 * @namespace YAHOO.widget
	 */
	/**
	 * Creates the SWFApplication instance and contains initialization data
	 *
	 * @class SWFApplication
	 * @extends Y.Container
	 * @constructor
	 * @param {Object} config Configuration parameters for the SWFApplication.
	 * 	<ul>
	 * 		<li><code>parent</code>: {String} id of dom element to be used as a container for the swfApplication swf</li>
	 * 		<li><code>flashvar</code>:hash of key value pairs that can be passed to the swf.</li>
	 * 		<li><code>autoLoad</code>:indicates whether the loadswf method will be automatically called on instantiation.</li>
	 * 		<li><code>styles/code>:hash of style properties to be applied to the SWFApplication application.</li>
	 * 	</ul>	
	 */
	function SWFApplication ( config ) 
	{
		SWFApplication.superclass.constructor.apply(this, arguments);
        this._dataId = this._id + "data";
	}

	SWFApplication.NAME = "swfApplication";

	SWFApplication.ATTRS = {
        app: {
            setter:function(val)
            {
            },

            getter:function()
            {
                return this;
            }
        },
        
        /**
		 * URL used for swf
		 */
		swfurl:
		{
			value: Y.config.base + "chart/assets/cartesiancanvas.swf"
		},

		/**
		 * Collection of attributes to be used for the swf embed.
		 */
		params: 
		{
			value:
			{
				version: "10.0.0",
				useExpressInstall: true,
				fixedAttributes: {allowScriptAccess:"always", allowNetworking:"all", bgcolor:"#ffffff"}
			},

			lazyAdd: false,

			setOnce: true,

			setter: function(val)
			{
				return this._mergeStyles(val,{version: "10.0.0",
				useExpressInstall: true,
				fixedAttributes: {allowScriptAccess:"always", allowNetworking:"all", bgcolor:"#ffffff"}});
			},

			validator: function(val)
			{
				return Y.Lang.isObject(val);
			}
		},

		/**
		 * Key value pairs passed to application swf at load time.
		 */
		flashvars:
		{
			value: {appname:this._id, YUIBridgeCallback:"SWF.eventHandler"},
    
			lazyAdd:false,

			setOnce: true,

			setter: function(val)
			{
				if(!val)
				{
					return;
				}
				
				if(!val.hasOwnProperty("appname") || !val.appname)
				{
					val.appname = this._id;
				}

				if(this.get("params").flashVars && Y.Lang.isObject(this.get("params").flashVars))
				{
					this.get("params").flashVars = this._mergeStyles(val, this.get("params").flashVars);
				}
				else
				{
					this.get("params").flashVars  = val;
				}
			},
			
			validator: function(val)
			{
				return Y.Lang.isObject(val);
			}
		},
		/**
		 * Indicates whether or not to call the loadswf method upon instantiation.
		 */
		autoLoad: 
		{
			value: true
		},
		/**
		 * Indicates whether the swf draws automatically.
		 *
		 * @private
		 */
		_autoRender: 
		{
			lazyAdd: false,

			value: true,

			setter: function(val)
			{
				return this.setAutoRender(val);
			}
		},
		/**
		 * Id used to insantiate a ChartDataProvider in the flash application.
		 *
		 * @private
		 */
		_dataId: 
		{
			value: null
		},
		/**
		 * Reference to the dataProvider for the SWFApplication.
		 * @private
		 */
		dataProvider: 
		{
			value: null,

			setter: function(val)
			{
				this._dataProvider = Y.JSON.stringify(val);
				this._initDataProvider();
			},

			getter: function()
			{
				return Y.JSON.parse(this._dataProvider);
			}

		}
	};
	
	Y.extend(SWFApplication, Y.Container, 
	{
        /**
         * @private
         * Propagates a specific event from Flash to JS.
         * @method _eventHandler
         * @param event {Object} The event to be propagated from Flash.
         */
        _eventHandler: function(event)
        {
            if (event.type == "swfReady") 
            {
                this.node = event.node = this.swf._swf._node;
                this.appswf = event.appswf = this;
                this._init(event);
                //this.publish("swfReady", {fireOnce:true});
                //this.fire("swfReady", event);
            }
            else if(event.type == "log")
            {
            }
            else
            {
                this.fire(event.type, event);
            } 
        },
		
        _events: {},
		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS: "CartesianCanvas",

		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuiSWFApplication",

		/**
		 * Creates swf instance and event listeners for the application.
		 */
		loadswf: function()
		{
            this.swf = new Y.SWF(this.get("parent"), this.get("swfurl"), this.get("params"), this);
		},

		initializer: function(cfg)
		{
			if(this.get("autoLoad"))
			{
				this.loadswf();
			}
		},

		/**
		 * Event handler for the swfReady event.
		 */
		_init: function(event)
		{
			var i, item, len;
			this._setAutoRender();
			this.swfReadyFlag = true;
			if(this._dataProvider)
			{
				this._initDataProvider();
			}
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
			this._addSWFEventListeners();
			this.fire("appReady");
		},
		
		
		/**
		 * Instantiates a DataProvider in the flash application.
		 *
		 * @private
		 */
		_initDataProvider: function() 
		{
			if(this.swfReadyFlag) 
			{
				this.createInstance(this._dataId, "ChartDataProvider", [this._dataProvider]);		
			}
		},
	
		/**
		 * Adds an item to a container instance.
		 *
		 * @param {Object} item to be added to the container instance.
		 * @props {Object} hash of layout information to be used by the parent container.
		 */
		addItem: function(item, props)
		{
			Container.prototype.addItem.apply(this, arguments);
			if(this.swfReadyFlag && item._init)
			{
				item._init(this);
			}
		},

		/**
		 * Sets the autoRender property for the swf.
		 */
		setAutoRender: function(value)
		{
			if(value != this._autoRender) 
			{
				this._autoRender = value;
				this._setAutoRender();
			}
		},

		/**
		 * Updates the autoRender property of the application swf.
		 */
		_setAutoRender: function()
		{
			if(this.swfReadyFlag) 
			{
				this.callSWF("setProperty", [this._id, "autoRender", this._autoRender]);
			}
		},
	/**
	 * Calls a specific function exposed by the SWF's
	 * ExternalInterface.
	 * @method callSWF
	 * @param func {String} the name of the function to call
	 * @param args {Object} the set of arguments to pass to the function.
	 */
	
	callSWF: function (func, args)
	{
		if (!args) { 
			  args= []; 
		};	
		if (this.node[func]) {
		return(this.node[func].apply(this.node, args));
	    } else {
		return null;
	    }
	},
	
	createInstance: function (instanceId, className, args) {
        if (!args) {args = []};
		if (this.node["createInstance"]) {
			this.node.createInstance(instanceId, className, args);
		}
	},
	
	applyMethod: function (instanceId, methodName, args) {
		if (!args) {args = []};
		if (this.node["applyMethod"]) {
			this.node.applyMethod(instanceId, methodName, args);
		}
	},
	
	exposeMethod: function (instanceId, methodName, exposedName) {
		if (this.node["exposeMethod"]) {
			this.node.exposeMethod(instanceId, methodName, exposedName);
		}
	},
	
	getProperty: function (instanceId, propertyName) {
		if (this.node["getProperty"]) {
			this.node.getProperty(instanceId, propertyName);
		}
	},
	
	setProperty: function (instanceId, propertyName, propertyValue) {
		if (this.node["setProperty"]) {
			this.node.setProperty(instanceId, propertyName, propertyValue);
		}
	},

	onFlash: function(type, instance)
	{
		var id = instance.get("id");
		if(!Y.SWF._instances.hasOwnProperty(id))
		{
			Y.SWF._instances[id] = instance;
		}
		if(this.node["subscribe"])
		{
			this.node.subscribe(type, id);
		}
	},

		_styleObjHash:{background:"background"}
	});

Y.augment(SWFApplication, Y.EventTarget);
Y.SWFApplication = SWFApplication;
/**
 * Creates a BorderContainer for use in a chart application.
 *
 *
 * Note: BorderContainer is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
	/**
	 * Complex Container that allows for items to be added to the following child
	 * containers:
	 * 	<ul>
	 *		<li><code>topContainer</code>: A <code>VFlowLayout</code> Container positioned at the top of the BorderContainer.</li>
	 *		<li><code>rightContainer</code>: An <code>HFlowLayout</code> Container positioned at the right of the BorderContainer.</li>
	 *		<li><code>bottomContainer</code>: A <code>VFlowLayout</code> Container positioned at the bottom of the BorderContainer.</li>
	 *		<li><code>leftContainer</code>: An <code>HFlowLayout</code> Container positioned at the left of the BorderContainer.</li>
	 *		<li><code>centerContainer</code>: A <code>LayerStack</code> Container positioned at the center of the BorderContainer.</li>
	 * 	</ul>
	 *
	 * @extends Container
	 * @class BorderContainer
	 * @param {Object} config Configuration parameters for the Chart.
	 */
	function BorderContainer (config) 
	{
		BorderContainer.superclass.constructor.apply(this, arguments);
	}

	BorderContainer.NAME = "borderContainer";

	/**
	 * Need to refactor to augment Attribute
	 */
	Y.extend(BorderContainer, Y.Container,
	{
		_events: {},
		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuibordercontainer",

		/**
		 * Hash containing an array of child items for each child container in the 
		 * BorderContainer. The child items are store here until the application swf
		 * has been initalized. Upon initialization, they will be added.
		 */
		itemsQueue: {},
		
		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS:"BorderContainer",
		
		/**
		 * Reference to the layout strategy used for displaying child items.
		 */
		layout:  "LayoutStrategy",

		/**
		 * Initialized class instance after the application swf has initialized.
		 *
		 * @method _init
		 * @param {Object} reference to the class that has direct communication with the application swf.
		 * @private
		 */
		_init: function(swfowner)
		{
			var i, itemsArray;
			this.swfowner = swfowner;
			this.appswf = this.swfowner.appswf;
			this.swfReadyFlag = true;
			this._updateStyles();
			for(i in this.itemsQueue)
			{
				if(this.itemsQueue.hasOwnProperty(i))
				{
					itemsArray = this.itemsQueue[i];
					while(itemsArray.length > 0)
					{
						this.addItem(itemsArray.shift(), i);
					}
				}
			}
			this._addSWFEventListeners();
		},
		
		/**
		 * Adds an item to the bottom Container.
		 *
		 * @method addBottomItem
		 * @param {Object} item child element
		 */
		addBottomItem: function (item)
		{
			this.addItem(item, "bottom");
		},
		
		/**
		 * Adds an item to the left Container.
		 *
		 * @method addLeftItem
		 * @param {Object} item child element
		 */
		addLeftItem: function (item) 
		{
			this.addItem(item, "left");
		},
		
		/**
		 * Adds an item to the top Container.
		 *
		 * @method addTopItem
		 * @param {Object} item child element
		 */
		addTopItem: function (item)
		{
			this.addItem(item, "top");
		},
		
		/**
		 * Adds an item to the right Container.
		 *
		 * @method addRightItem
		 * @param {Object} item child element
		 */
		addRightItem: function (item) 
		{
			this.addItem(item, "right");
		},

		/**
		 * Adds an item to the center Container.
		 *
		 * @method addCenterItem
		 * @param {Object} item child element
		 */
		addCenterItem: function (item)
		{
			this.addItem(item, "center");
		},		
		
		/**
		 * Adds children to the appropriate Container.
		 *	<ul>
		 *		<li>Adds an item to the specified child container if the application swf has initialized.</li>
		 *		<li>Adds an item to the appropriate aray in the <code>itemsQueue</code> hash to be stored until the application swf 
		 *		has been initialized.</li>
		 *	</ul>
		 * @method addItem
		 * @param {Object} item child to be added
		 * @param {String} location location of the container in which the child will be added.
		 */
		addItem: function (item, location)
		{
			var locationToUpperCase = (location.charAt(0)).toUpperCase() + location.substr(1);
			if (this.swfReadyFlag) 
			{
				item._init(this.swfowner);
				this.appswf.applyMethod(this._id, "add" + locationToUpperCase + "Item", ["$" + item._id]);
				if (location != "center")
				{
					item.set("styles", {position: location});
				}
			}
			else
			{
				if(!this.itemsQueue || !this.itemsQueue.hasOwnProperty(location))
				{
					this.itemsQueue[location] = [];
				}
				this.itemsQueue[location].push(item);
			}
		}
	});

Y.BorderContainer = BorderContainer;

function Graph (config) 
{
	Graph.superclass.constructor.apply(this, arguments);
}

Graph.NAME = "graph";

Graph.ATTRS = {
	/**
	 * Reference to the layout strategy used for displaying child items.
	 */
	layout:  
	{
		value:"LayerStack",

		//needs a setter

		validator: function(val)
		{
			return Y.Array.indexOf(this.LAYOUTS, val) > -1;
		}
	},

	seriesCollection:
	{
		validator: function(val)
		{
			return Y.Lang.isArray(val);
		},

		setter: function(val)
		{
			this._seriesCollection = this._convertReferences(val);
		}
	},

	handleEventListening: {
		validator: function(val)
		{
			return Y.Lang.isBoolean(val);
		},

		getter: function()
		{
			return this._handleEventListening;
		},

		setter: function(val)
		{
			this._handleEventListening = val;
			return val;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Graph, Y.Container, 
{
	_events: {},
	GUID:"yuigraph",

	/**
	 * @private
	 * Indicates whether the Graph will act as a delegate for
	 * mouse events.
	 */
	_handleEventListening: false,

	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "Graph",

	_seriesCollection:null,
	/**
	 * @private
	 * Called by the class instance containing the application swf after the swf
	 * has been initialized.
	 *
	 * @method _init
	 * @param swfowner {Object} Class instance with direct access to the application swf.
	 */
	_init: function(swfowner)
	{
		this.swfowner = swfowner;
		this.appswf = this.swfowner.appswf;
		if(this.get("seriesCollection"))
		{
			this.appswf.createInstance(this._id, "Graph", [Y.JSON.stringify(this.get("seriesCollection")), this.get("handleEventListening")]);
			this.fire("graphReady", {swfowner:swfowner});
		}
		this._addSWFEventListeners();
	},

	/**
	 * Converts references of AS class wrappers to string references to used with 
	 * ExternalInterface.
	 */
	_convertReferences: function(collection)
	{
		var i,
			len = collection.length,
			series,
			arr = [];
		for(i = 0; i < len; ++i)
		{
			series = collection[i];
			series.xAxisData = "$" + series.xAxisData._id + "data";
			series.yAxisData = "$" + series.yAxisData._id + "data";
			arr.push(series);
		}
		return arr;
	}
});

Y.Graph = Graph;
/* The LineGraph is used in the chart visualization package
 * @module axis
 *
 * Note: LineGraph is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
	/**
	 * The LineGraph module allows creating single line cartesian graphs.
	 * @module linegraph
	 * @title Line Graph
	 * @namespace YAHOO.widget
	 */

	/**
	 * Creates the LineGraph instance and contains initialization data
	 *
	 * @class LineGraph
	 * @constructor
	 * @param {Object} config Configuration parameters for the Axis.
	 */
	function LineGraph (config) 
	{
		LineGraph.superclass.constructor.apply(this, arguments);
	}

	LineGraph.NAME = "lineGraph";

	LineGraph.ATTRS = {
		xaxis:
		{
			value:null
		},

		yaxis:
		{
			value:null
		},
		
		xkey:
		{
			value:null
		},

		ykey:
		{
			value:null
		}
	};

	Y.extend(LineGraph, Y.SWFWidget, 
	{
		/**
		 * Reference to corresponding Actionscript class.
		 */
		AS_CLASS:  "LineSeries",

		GUID: "yuilinechart",

		/**
		 * @private
		 * Called by the class instance containing the application swf after the swf
		 * has been initialized.
		 *
		 * @method _init
		 * @param swfowner {Object} Class instance with direct access to the application swf.
		 */
		_init: function(swfowner)
		{
			this.swfowner = swfowner;
			this.appswf = this.swfowner.appswf;
			this.appswf.createInstance(this._id, 
				"LineSeries", 
				[
					{
						xAxisData:"$" + this.get("xaxis")._id + "data", 
						yAxisData:"$" + this.get("yaxis")._id + "data", 
						xKey:this.get("xkey"), 
						yKey:this.get("ykey")
					}
				]);
			this._updateStyles();
		}

	});

	Y.LineGraph = LineGraph;
/**
 * The Axis used in the chart visualization package
 * @module axis
 *
 *
 * Note: Axis is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
		/**
		 * The Axis module allows creating numeric, category and time axes in the Chart module.
		 * @module axis
		 * @title Axis
		 * @requires yahoo, dom, event
		 * @namespace YAHOO.widget
		 */

/**
 * Creates the Axis instance and contains initialization data
 *
 * @class Axis
 * @augments Y.Event.Target
 * @constructor
 * @param {Object} config Configuration parameters for the Axis.
 */
function Axis (config) 
{
	Axis.superclass.constructor.apply(this, arguments);
	this._dataId = this._id + "data";

}

Axis.NAME = "axis";

Axis.ATTRS = {
	keys:{
		value:[],
		
		setter: function(val)
		{
			this._keys = val;
		},

		getter: function()
		{
			return this._keys;
		}
	},
	axisType:{
		value: "Numeric",

		setter: function(val)
		{
			this._axisType = val;
		},

		getter: function()
		{
			return this._axisType;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(Axis, Y.SWFWidget, 
{
	_events: {},

	GUID:"yuiaxis",

	_axisType: "Numeric",

	_keys: [],

	swfReadyFlag:false,


	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS:  "Axis",
	
	/**
	 * @private
	 * Called when the Axis is initialized
	 * @method _axisInit
	 * @param swfowner {Object} The class with a direct reference to the application swf. 
	 */
	_init: function(swfowner)
	{
		this.swfowner = swfowner;
		this.appswf = this.swfowner.appswf;
		this.appswf.createInstance(this._dataId, this.get("axisType") + "Data", ["$" + this.swfowner._dataId]);
		var i, keys = this.get("keys");
		for (i in keys) 
		{
			if(keys.hasOwnProperty(i))
			{
				this.appswf.applyMethod(this._dataId, "addKey", [keys[i]]);
			}
		}
		this.appswf.createInstance(this._id, "Axis", ["$" + this._dataId]);
		this._addSWFEventListeners();
		this.swfReadyFlag = true;
	},
	
	/**
	 * Uses key to lookup and extract specified data from a data source.
	 *
	 * @method addKey
	 * @param {String} key identifier used to specify data set.
	 */
	addKey: function(key) 
	{
		this.get("keys").push(key);
		if(this.appswf)
		{
			this.appswf.applyMethod("$" + this._dataId, "addKey", [key]);
		}
	}
});


Y.augment(Axis, Y.SWFWidget);
Y.Axis = Axis;
/**
 * Create data visualizations with line graphs, histograms, and other methods.
 * @module chart
 *
 * Note: SimpleChart is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
		
	/**
	 * SimpleChart creates a basic line chart. SimpleChart uses the existing chart classes to allow for easy creation of a chart.
	 * @module chart
	 * @title SimpleChart
	 * @namespace YAHOO.widget
	 */
	/**
	 * Creates the Chart instance that includes an x-axis, y-axis and graph.
	 *
	 * @class SimpleChart
	 * @extends Y.Event.Target
	 * @constructor
	 * @param {String|HTMLElement} id The id of the element, or the element itself that the Chart will be placed into.  
	 *        The width and height of the Chart will be set to the width and height of this container element.
     * @param {String} charttype The type of chart to render. Defaults to "line".
	 * @param {Object} optional hash of properties and styles.
	 */
	
	function SimpleChart (p_oElement /*:String*/, charttype /*:String*/, config /*:Object*/) 
	{					
		if(charttype) 
		{
			this._type = charttype;
		}
		this._parseConfig(config);
		this._chartConfig.parent = p_oElement;
		this.app = new Y.SWFApplication(this._chartConfig);
		this.chart = new Y.BorderContainer({parent:this.app, styles:this._chartstyles});
		this.app.addItem(this.chart);
		this.xaxis = new Y.Axis({parent:this.app, axisType:this._xAxisProps.type, styles:this._xaxisstyles});
		this.yaxis = new Y.Axis({parent:this.app, axisType:this._yAxisProps.type, styles:this._yaxisstyles});
		this.data = {};
		this.graph = null;
		
	}

	Y.extend(SimpleChart, Y.EventTarget, 
	{
		/**
		 * Graph type
		 */
		_type:"line",

		/**
		 * Axis type for x axis
		 */
		_xAxisProps:{
			type:"Category",
			key:"item"
		},

		/**
		 * Axis type for y axis
		 */
		_yAxisProps:{
			type:"Numeric",
			key:"value"
		},

		setData: function(data /*:Object*/, xkey /*:String*/, ykey /*:String*/)
		{
			this.data = data;
			var chart = this.chart, app = this.app, xaxis = this.xaxis, yaxis = this.yaxis, graph = this.graph, styles = this._graphstyles;

			app.set("dataProvider", data);
			xaxis.addKey(this._xAxisProps.key);
			yaxis.addKey(this._yAxisProps.key);
			
			if (this._type == "line") 
			{
				graph = new Y.Graph({parent:chart, seriesCollection:[{type:this._type, xAxisData:xaxis, yAxisData:yaxis, xKey:xkey, yKey:ykey, styles:styles}]});
			}
			chart.addBottomItem(xaxis);
			chart.addLeftItem(yaxis);
			chart.addCenterItem(graph);
		},

		_chartstyles:{
				padding:{
					left:20, top:20, bottom:20, right:20
				}

		},
		
		_appstyles:{
			background:{
				fillColor:0xDEE2FF,
				borderColor:0xDEE2FF
			}
		},

		_xaxisstyles:{
			majorTicks:{color:0x000000},
			line:{color:0x000000},
			label:{
				fontName:"Georgia",
				fontSize:12,
				color:0x000000,
				margin:{top:3}
			}
		},
		_yaxisstyles:{
			majorTicks:{color:0x663333},
			line:{color:0x663333},
			label:{
				fontName:"Georgia",
				fontSize:12,
				color:0x000000,
				margin:{right:3}
			}
		},
		_graphstyles:{
			color:0x000000,
			alpha:1,
			weight:"2",
			marker:{
				fillColor:0x000000
			}
		},

		_parseConfig: function(config)
		{
			var styles, props;
			if(config)
			{
				if(config.hasOwnProperty("swfurl"))
				{
					this._chartConfig.swfurl = config.swfurl;
				}
				if(config.hasOwnProperty("xaxisprops"))
				{
					props = config.xaxisprops;
					if(props.hasOwnProperty("type")) 
					{
						this._xAxisProps.type = props.type;
					}
					
					if(props.hasOwnProperty("key")) 
					{
						this._xAxisProps.key = props.key;
					}
				}

				if(config.hasOwnProperty("yaxisprops"))
				{
					props = config.yaxisprops;
					if(props.hasOwnProperty("type")) 
					{
						this._yAxisProps.type = props.type;
					}
					
					if(props.hasOwnProperty("key")) 
					{
						this._yAxisProps.key = props.key;
					}
				}

				if(config.hasOwnProperty("autoRender")) 
				{
					this._chartConfig.autoRender = config.autoRender;
				}
				
				if(this._yAxisProps.type == "Category")
				{
					this._yaxisstyles.padding = {top:50, bottom:50};
					this._graphstyles.padding = {top:50, bottom:50};
				}
		
				if(this._xAxisProps.type == "Category")
				{
					this._xaxisstyles.padding = {left:50, right:50};
					this._graphstyles.padding = {left:50, right:50};
				}
				
				
				if(config.hasOwnProperty("styles"))
				{
					styles = config.styles;
					if(styles.hasOwnProperty("chart"))
					{
						this._chartstyles = this._parseStyles(this._chartstyles, styles.chart);
					}
					if(styles.hasOwnProperty("background"))
					{
						this._appstyles.background = this._parseStyles(this._appstyles.background, styles.background);
					}
					if(styles.hasOwnProperty("xaxisstyles"))
					{
						this._xaxisstyles = this._parseStyles(this._xaxisstyles, styles.xaxisstyles);
					}
					if(styles.hasOwnProperty("yaxisstyles"))
					{
						this._yaxisstyles = this._parseStyles(this._yaxisstyles, styles.yaxisstyles);
					}
					if(styles.hasOwnProperty("graphstyles"))
					{
						this._graphstyles = this._parseStyles(this._graphstyles, styles.graphstyles);
					}
				}
			}
			else 
			{
				if(this._yAxisProps.type == "Category")
				{
					this._yaxisstyles.padding = {top:50, bottom:50};
					this._graphstyles.padding = {top:50, bottom:50};
				}
		
				if(this._xAxisProps.type == "Category")
				{
					this._xaxisstyles.padding = {left:50, right:50};
					this._graphstyles.padding = {left:50, right:50};
				}
			}
			this._chartConfig.styles = this._appstyles;
		},

		_chartConfig:{},

		_parseStyles:function(defaultStyles, configStyles)
		{
			var i;
			if(!defaultStyles)
			{
				return configStyles;
			}
			for(i in configStyles)
			{
				if(configStyles.hasOwnProperty(i))
				{
					if(defaultStyles.hasOwnProperty(i) && Y.Lang.isObject(defaultStyles[i]))
					{
						defaultStyles[i] = this._parseStyles(defaultStyles[i], configStyles[i]);
					}
					else
					{
						defaultStyles[i] = configStyles[i];
					}
				}
			}
			return defaultStyles;

		}
	});

Y.SimpleChart = SimpleChart;

function DataTip (config) 
{
	DataTip.superclass.constructor.apply(this, arguments);
	if(this.get("graph") && this.get("graph").swfReady)
	{
	}
}

DataTip.NAME = "dataTip";

DataTip.ATTRS = {
	/**
	 * Reference to the layout strategy used for displaying child items.
	 */
	layout:  
	{
		value:"LayerStack",

		//needs a setter

		validator: function(val)
		{
			return Y.Array.indexOf(this.LAYOUTS, val) > -1;
		}
	},

	graph: {
		lazyAdd: false,

		getter: function()
		{
			return this._graph;
		},

		setter: function(val)
		{
			this._graph = val;
			if(this._graph && this._graph.swfReady)
			{
				this._init(this._graph);
			}
			else
			{
				this._graph.on("graphReady", Y.bind(function(evt){
					this._initDataTip(evt.swfowner);
				}, this));
			}
			return val;
		}
	}
};

/**
 * Need to refactor to augment Attribute
 */
Y.extend(DataTip, Y.Container, 
{
	GUID:"yuidataTip",


	/**
	 * Reference to corresponding Actionscript class.
	 */
	AS_CLASS: "DataTip",

	_graph: null,

	/**
	 * @private
	 * Called by the class instance containing the application swf after the swf
	 * has been initialized.
	 *
	 * @method _init
	 * @param swfowner {Object} Class instance with direct access to the application swf.
	 */
	_initDataTip: function(swfowner)
	{
		this.swfowner = swfowner;
		this.swfReady = true;
		this.appswf = this.swfowner.appswf;
		this.appswf.createInstance(this._id, "DataTip", ["$" + this.get("graph")._id]);
		this.appswf.applyMethod(this.get("parent")._id, "addItem", ["$" + this._id, {excludeFromLayout:true}]);
	}
});

Y.DataTip = DataTip;


}, '@VERSION@' );
