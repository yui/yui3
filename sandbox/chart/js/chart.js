/**
 * Create data visualizations with line graphs, histograms, and other methods.
 * @module chart
 *
 *
 * Note: Chart is a temporary class that has been created for the purposes of observing and testing the current state of the underlying flash chart rendering engine. This file
 * will be replaced in future iterations and its api will vary significantly. 
 */
	/**
	 * The Chart widget is a tool for creating Cartesian data visualizations.
	 * @module chart
	 * @title Chart
	 * @requires yahoo, dom, event
	 * @namespace YAHOO.widget
	 */
	/**
	 * Creates the Chart instance and contains initialization data
	 *
	 * @class Chart
	 * @augments Y.Event.Target
	 * @constructor
	 * @param {String|HTMLElement} id The id of the element, or the element itself that the Chart will be placed into.  
	 *        The width and height of the Chart will be set to the width and height of this Container element.
	 * @param {Object} config (optional) Configuration parameters for the Chart.
	 * 	<ul>
	 * 		<li><code>chartContainer</code>: Hash of values that allows for changing the default chart Container
	 * 			<ul>
	 * 				<li><code>classInstance</code>: class instance to be used</li>
	 * 				<li><code>added</code>: indicates whether Container has already been added to its parent</li>
	 * 				<li><code>parentContainer</code>: allows to specify a Container other than the chart application for placing the chartContainer</li>
	 *			</ul>
	 * 		</li>
	 * 		<li><code>childContainers</code>:Array of containers to be added to chart.
	 *			<ul>
	 *				<li><code>classInstance</code>: Container class instance to add to the application.</li>
	 *				<li><code>props</code>: Optional has of properties </li>
	 *			</ul>
	 * 		</li>
	 * 		<li><code>flashvar</code>:hash of key value pairs that can be passed to the swf.</li>
	 * 		<li><code>autoLoad</code>:indicates whether the loadswf method will be automatically called on instantiation.</li>
	 * 		<li><code>styles/code>:hash of style properties to be applied to the Chart application.</li>
	 * 	</ul>	
	 */
	function Chart (p_oElement /*:String*/, config /*:Object*/ ) 
	{
		this._attributeConfig = Y.merge(this._attributeConfig, Chart.superclass._attributeConfig);
		Chart.superclass.constructor.apply(this, arguments);
		this._dataId = this._id + "data";
		if(this.get("autoLoad"))
		{
			this.loadswf();
		}
	}

	/**
	 * Need to refactor to augment Attribute
	 */
	Y.extend(Chart, Y.Container, 
	{
		/**
		 * Reference to corresponding Actionscript class.
		 */
		CLASSNAME: "CartesianCanvas",

		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuichart",
	
		_attributeConfig:
		{
			/**
			 * URL used for swf
			 */
			swfurl:
			{
				value: Y.config.base + "chart/assets/cartesiancanvas.swf"
			},

			/**
			 * Reference to the BorderContainer instance that contains graphs and axes of a cartesian chart.
			 */
			chartContainer: 
			{
				value: null,

				setter: function(val)
				{
					return this.setChartContainer(val);
				},

				validator: function(val)
				{	
					return Y.Lang.isObject(val);
				}
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
				value: {appname:this._id},

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
			 * Reference to the dataProvider for the chart.
			 * @private
			 */
			dataProvider: 
			{
				value: null,

				setter: function(val)
				{
					this._dataProvider = val;
					this._initDataProvider();
				}
			}
		},

		/**
		 * Specifies different properties of the chartContainer
		 *
		 * @method setChartContainer
		 * @param {Object} containerHash Hash of chartContainer values:
		 *	<ul>
		 *		<li><code>classInstance</code>:User specifed BorderContainer instance to be used as a chart container.</li>
		 *		<li><code>added</code>:Indicates whether or not a user-specified chart container has been added to its parent</li>
		 *		<li><code>parentContainer</code>:Specifies object to be used as a container for the chart container</li>
		 *	</ul>
		 */
		setChartContainer: function(containerHash)
		{
			if(containerHash && containerHash.hasOwnProperty("classInstance"))
			{
				this.chartContainer = containerHash.classInstance;
				if(containerHash.hasOwnProperty("added") && !containerHash.added)
				{
					this._styleObjHash.chart = this.chartContainer._id;
					return;
				}
			}
			else
			{
				this.chartContainer = new BorderContainer(this);
			}
			this._styleObjHash.chart = this.chartContainer._id;
			this.chartContainer.oElement.addItem(this.chartContainer);
		},

		/**
		 * Adds child containers to application.
		 *
		 * @param {Array} childContainers Collection of hashes that container necessary data to add a container to 
		 * the flash instance. The properties are below:
		 *	<ul>
		 *		<li><code>classInstance</code>: Container class instance to add to the application.</li>
		 *		<li><code>props</code>: Optional has of properties </li>
		 *	</ul>
		 */
		addChildContainers: function (childContainers)
		{
			var i, len, container, child, props;
			for(i = 0; i < len; i++)
			{
				container = childContainers[i];
				if(container.hasOwnProperty("classInstance"))
				{
					child = container.classInstance;
					if(container.hasOwnProperty("props"))
					{
						props = container.props;
					}
					this.addItem(child, props);
				}
			}
		},


		/**
		 * Creates swf instance and event listeners for the chart application.
		 */
		loadswf: function()
		{
			this.appswf = new Y.SWF(this.oElement, this.get("swfurl"), this.get("params"));
			this.appswf.on ("swfReady", this._init, this);
		},


		/**
		 * Event handler for the swfReady event.
		 */
		_init: function(event)
		{
			var i, item, len;
			this._setAutoRender();
			if(this._dataProvider)
			{
				this._initDataProvider();
			}
			this._addBackground();
			this.swfReadyFlag = true;
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
		 * Instantiates a DataProvider in the flash application.
		 *
		 * @private
		 */
		_initDataProvider: function() 
		{
			if(this.appswf) 
			{
				this.appswf.createInstance(this._dataId, "ChartDataProvider", [this._dataProvider]);		
			}
		},
	
		/**
		 * Adds an item to the top subcontainer of the chartContainer instance.
		 *
		 * @param {Object} item to be added to the chartContainer instance.
		 */
		addTopItem: function (item)
		{
			this.chartContainer.addTopItem(item);
		},
		
		/**
		 * Adds an item to the right subcontainer of the chartContainer instance.
		 *
		 * @param {Object} item to be added to the chartContainer instance.
		 */
		addRightItem: function (item) 
		{
			this.chartContainer.addRightItem(item);
		},

		/**
		 * Adds an item to the bottom subcontainer of the chartContainer instance.
		 *
		 * @param {Object} item to be added to the chartContainer instance.
		 */
		addBottomItem: function (item)
		{
			this.chartContainer.addBottomItem(item);
		},
		
		/**
		 * Adds an item to the left subcontainer of the chartContainer instance.
		 *
		 * @param {Object} item to be added to the chartContainer instance.
		 */
		addLeftItem: function (item) 
		{
			this.chartContainer.addLeftItem(item);
		},
		
		/**
		 * Adds an item to the center subcontainer of the chartContainer instance.
		 *
		 * @param {Object} item to be added to the chartContainer instance.
		 */
		addCenterItem: function (item)
		{
			this.chartContainer.addCenterItem(item);
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
			if(this.appswf) 
			{
				this.appswf.callSWF("setProperty", [this._id, "autoRender", this._autoRender]);
			}
		},

		/**
		 * Public accessor to the unique name of the Chart instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the Chart instance.
		 */
		toString: function()
		{
			return "Chart " + this._id;
		}
	});

Y.augment(Chart, Y.EventTarget);
Y.Chart = Chart;
