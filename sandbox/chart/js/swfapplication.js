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
                Y.log(event.message, event.category, this.toString());
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
