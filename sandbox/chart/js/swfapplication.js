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
				this._dataProvider = val;				
                if(val)
                {
                    this.createInstance(this._dataId, "ChartDataProvider", [Y.JSON.stringify(val)]);		
                }
			},

			getter: function()
			{
                return this._dataProvider;
			}
		}
	};
	
	Y.extend(SWFApplication, Y.Container, 
	{
        /**
         * @private
         */
        _createId: function()
        {
            Y.SWFWidget.prototype._createId.apply(this, arguments);
            if(Y.SWF._instances)
            {
                Y.SWF._instance = {};
            }
            Y.SWF._instances[this._id] = this;
        },  

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
                this._init();
                this._clearMethodQueue();
                this.publish("swfReady", {fireOnce:true});
                this.fire("swfReady", event);
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
            this.swf = new Y.SWF(this.get("parent"), this.get("swfurl"), this.get("params"));
		},

		_instantiateSWFClass: function()
		{
            this._dataId = this._id + "data";
			if(this.get("autoLoad"))
			{
				this.loadswf();
			}
		},

		/**
		 * Event handler for the swfReady event.
		 */
		_init: function()
		{
			this._addBackground();
            this._updateStyles();
            this.fire("appReady");
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
	    	if(item._init)
            {
                item._init();
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
                this.setProperty(this._id, "autoRender", this._autoRender);
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
            if (!args) 
            { 
                  args= []; 
            }	
            if (this.node && this.node[func]) 
            {
                return(this.node[func].apply(this.node, args));
            } 
            else 
            {
                this._methodQueue.push({func:this.callSWF, args:arguments});
            }
        },
        
        createInstance: function (instanceId, className, args) 
        {
            if (!args) 
            {
                args = [];
            }
            if (this.node && this.node.createInstance) 
            {
                this.node.createInstance(instanceId, className, args);
            }
            else
            {
                this._methodQueue.push({func:this.createInstance, args:arguments});
            }
        },
        
        applyMethod: function (instanceId, methodName, args) 
        {
            if (!args) 
            {
                args = [];
            }
            if (this.node && this.node.applyMethod) 
            {
                this.node.applyMethod(instanceId, methodName, args);
            }
            else
            {
                this._methodQueue.push({func:this.applyMethod, args:arguments});
            }
        },
        
        exposeMethod: function (instanceId, methodName, exposedName) 
        {
            if (this.node && this.node.exposeMethod) 
            {
                this.node.exposeMethod(instanceId, methodName, exposedName);
            }
            else
            {
                this._methodQueue.push({func:this.exposeMethod, args:arguments});
            }
        },
        
        getProperty: function (instanceId, propertyName) 
        {
            if (this.node && this.node.getProperty) 
            {
                this.node.getProperty(instanceId, propertyName);
            }
            else
            {
                this._methodQueue.push({func:this.getProperty, args:arguments});
            }
        },
        
        setProperty: function (instanceId, propertyName, propertyValue) 
        {
            if (this.node && this.node.setProperty) 
            {
                this.node.setProperty(instanceId, propertyName, propertyValue);
            }
            else
            {
                this._methodQueue.push({func:this.setProperty, args:arguments});
            }
        },

        onFlash: function(type, instance)
        {
            if(this.node && this.node.subscribe)
            {
                var id = instance.get("id");
                if(!Y.SWF._instances.hasOwnProperty(id))
                {
                    Y.SWF._instances[id] = instance;
                }
                this.node.subscribe(type, id);
            }
            else
            {
                this._methodQueue.push({func:this.onFlash, args:arguments});
            }
        },

        _methodQueue: [],

        _clearMethodQueue: function()
        {
            var q = this._methodQueue,
                l = q.length,
                item;
            while(l > 0)
            {
                item = q.shift();
                item.func.apply(this, item.args);
                l--;
            }
        },

		_styleObjHash:{background:"background"}
	});

Y.augment(SWFApplication, Y.EventTarget);
Y.SWFApplication = SWFApplication;
