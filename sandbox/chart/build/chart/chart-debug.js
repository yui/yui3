YUI.add('chart', function(Y) {

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
	 * @param {Object} p_oElement Parent class. If the this class instance is the top level
	 * of a flash application, the value is the id of its containing dom element. Otherwise, the
	 * value is a reference to it container.
	 * @param {Object} config (optional) Configuration parameters for the Chart.
	 */
	function BorderContainer (p_oElement, config) 
	{
		BorderContainer.superclass.constructor.apply(this, arguments);
	}

	/**
	 * Need to refactor to augment Attribute
	 */
	Y.extend(BorderContainer, Y.Container,
	{
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
		 * @private (override)
		 */
		_parseConfigs: function(config)
		{
			if(config && config.props)
			{
				this.props.push(config.props);
			}
		},

		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "BorderContainer",
		
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
			this._setStyles();
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
					item.setStyle("position", location);
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
		},
		
		/**
		 * Public accessor to the unique name of the BorderContainer instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the BorderContainer instance.
		 */
		toString: function()
		{
			return "BorderContainer " + this._id;
		}
	});
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
		Chart.superclass.constructor.apply(this, arguments);
	}

	/**
	 * Need to refactor to augment Attribute
	 */
	Y.extend(Chart, Y.Container, 
	{
		/**
		 * URL used for swf
		 */
		swfurl:Y.config.base + "chart/assets/cartesiancanvas.swf",

		/**
		 * Reference to corresponding Actionscript class.
		 */
		className: "CartesianCanvas",

		/**
		 * Constant used to generate unique id.
		 */
		GUID: "yuichart",
	
		/**
		 * Reference to the BorderContainer instance that contains graphs and axes of a cartesian chart.
		 */
		chartContainer: null,

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
					return;
				}
			}
			else
			{
				this.chartContainer = new BorderContainer(this);
			}
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
		 * Id used to insantiate a ChartDataProvider in the flash application.
		 *
		 * @private
		 */
		_dataId: null,

		/**
		 * Sets properties based on a configuration hash.
		 * @private
		 */
		_parseConfigs: function(config)
		{
			var containerHash, i, styles, flashvars = {appname:this._id};
			if(config)
			{
				if(config.hasOwnProperty("swfurl"))
				{
					this.swfurl = config.swfurl;
				}
				if(config.hasOwnProperty("flashvars"))
				{
					for(i in config.flashvars) 
					{
						if(config.flashvars.hasOwnProperty(i))
						{
							flashvars[i] = config.flashvars[i];
						}
					}
				}
				if(config.hasOwnProperty("autoLoad"))
				{
					this.autoLoad = config.autoLoad;
				}
				if(config.hasOwnProperty("chartContainer"))
				{
					containerHash = config.chartContainer;
				}
				if(config.hasOwnProperty("childContainers") && typeof config.childContainers == "array")
				{
					this.addChildContainers(config.childContainers);
				}
				if(config.hasOwnProperty("styles"))
				{
					styles = config.styles;
				}
			}
			this.params.flashVars = flashvars;
			this.setChartContainer(containerHash);
			this._styleObjHash.chart = this.chartContainer._id;
			this.setStyles(styles);
			this._dataId = this._id + "data";
			if(this.autoLoad)
			{
				this.loadswf();
			}
		},

		/**
		 * Indicates whether or not to call the loadswf method upon instantiation.
		 */
		autoLoad: true,

		/**
		 * Creates swf instance and event listeners for the chart application.
		 */
		loadswf: function()
		{
			this.appswf = new Y.SWF(this.oElement, this.swfurl, this.params);
			this.appswf.on ("swfReady", this._init, this);
		},

		/**
		 * Collection of attributes to be used for the swf embed.
		 */
		params: 
		{
			version: "10.0.0",
			useExpressInstall: true,
			fixedAttributes: {allowScriptAccess:"always", allowNetworking:"all", bgcolor:"#ffffff"}
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
			this._setStyles();
		},
		
		/**
		 * Reference to the dataProvider for the chart.
		 * @private
		 */
		_dataProvider: null,

		/**
		 * Sets the dataprovider for the chart application.
		 *
		 * @method setDataProvider
		 * @param {Object} data to be used by the chart application.
		 */
		setDataProvider: function(data)
		{
			this._dataProvider = data;
	 		this._initDataProvider();
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
		 * Indicates whether the swf draws automatically.
		 *
		 * @private
		 */
		_autoRender: true,

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
/**
 * The LineGraph is used in the chart visualization package
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
	 * @param xaxis {Axis} reference to the xaxis 
	 * @param yaxis {Axis} reference to the yaxis 
	 * @param xkey {String} pointer to the array of values contained in the xaxis
	 * @param ykey {String} point to ther array of values container in the yaxis
	 * @param {Object} config (optional) Configuration parameters for the Axis.
	 */
	function LineGraph (xaxis, yaxis, xkey, ykey, config) {
		this._id = Y.guid("yuilinegraph");
		this.xaxis = xaxis;
		this.yaxis = yaxis;
		this.xkey = xkey;
		this.ykey = ykey;
		this._parseConfigs(config);
		this.swfowner = null;
	}

	LineGraph.prototype = 
	{
		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "LineGraph",

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
			this.appswf.createInstance(this._id, "LineGraph", ["$" + this.xaxis._id + "data", "$" + this.yaxis._id + "data", this.xkey, this.ykey]);
			if(this._defaultStyles) 
			{
				this.appswf.applyMethod(this._id, "setStyles", [this._defaultStyles]);
				this._defaultStyles = null;
			}
		},

		/**
		 * Sets properties based on a configuration hash.
		 * @private
		 */
		_parseConfigs: function(config)
		{
			if(config && config.hasOwnProperty("styles"))
			{
				this.setStyles(config.styles);
			}
		},
		
		_defaultStyles: null,

		/**
		 * Sets a style property for the instance.
		 *
		 * @method setStyle
		 * @param {String} style name of the style to be set
		 * @param {Object} value value to be set for the style
		 */
		setStyle: function(style, value)
		{
			if(this.appswf) 
			{
				this.appswf.applyMethod(this._id, "setStyle", [style, value]);
			}
			else
			{
				if(!this._defaultStyles)
				{
					this._defaultStyles = {};
				}
				this._defaultStyles[style] = value;
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
			if(this.appswf)
			{
				this.appswf.applyMethod(this._id, "setStyles", [styles]);
				this._defaultStyles = null;
			}
			else
			{
				for(var i in styles) 
				{
					if(styles.hasOwnProperty(i))
					{
						if(!this._defaultStyles)
						{
							this._defaultStyles = {};
						}
						this._defaultStyles[i] = styles[i];
					}
				}
			}
		},
		
		/**
		 * Public accessor to the unique name of the LineGraph instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the LineGraph instance.
		 */
		toString: function()
		{
			return "LineGraph " + this._id;
		}

	};


	Y.augment(LineGraph, Y.EventTarget);

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
	 * @param {String} axisType type of axis: numeric, category or time.
	 * @param {Object} config (optional) Configuration parameters for the Axis.
	 */
	function Axis (axisType, config) 
	{
		this._id = Y.guid("yuiaxis");
		this._dataId = this._id + "data";
		this.axisType = axisType || "Numeric";
		this.keys = [];
		this.swfowner = null;
		this._parseConfigs(config);
	}

	/**
	 * Need to refactor to augment Attribute
	 */
	Axis.prototype = 
	{
	
		/**
		 * Reference to corresponding Actionscript class.
		 */
		className:  "Axis",
		
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
			this.appswf.createInstance(this._dataId, this.axisType + "Data", ["$" + this.swfowner._dataId]);
			for (var i in this.keys) 
			{
				if(this.keys.hasOwnProperty(i))
				{
					this.appswf.applyMethod(this._dataId, "addKey", [this.keys[i]]);
				}
			}
			this.appswf.createInstance(this._id, "Axis", ["$" + this._dataId]);
			if(this._defaultStyles !== null) 
			{
				this.appswf.applyMethod(this._id, "setStyles", [this._defaultStyles]);
				this._defaultStyles = null;
			}
		},
		
		/**
		 * Sets properties based on a configuration hash.
		 * @private
		 */
		_parseConfigs: function(config)
		{
			if(config && config.hasOwnProperty("styles"))
			{
				this.setStyles(config.styles);
			}
		},
		
		/**
		 * Uses key to lookup and extract specified data from a data source.
		 *
		 * @method addKey
		 * @param {String} key identifier used to specify data set.
		 */
		addKey: function(key) 
		{
			this.keys.push(key);
			if(this.appswf)
			{
				this.appswf.applyMethod("$" + this._dataId, "addKey", [key]);
			}
		},

		/**
		 * @private
		 *
		 * Hash of default styles for the instance.
		 */
		_defaultStyles: null,
		
		/**
		 * Sets a style property for the instance.
		 *
		 * @method setStyle
		 * @param {String} style name of the style to be set
		 * @param {Object} value value to be set for the style
		 */
		setStyle: function(style, value)
		{
			if(this.appswf) 
			{
				this.appswf.applyMethod(this._id, "setStyle", [style, value]);
			}
			else
			{
				if(!this._defaultStyles)
				{
					this._defaultStyles = {};
				}
				this._defaultStyles[style] = value;
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
			if(this.appswf)
			{
				this.appswf.applyMethod(this._id, "setStyles", [styles]);
				this._defaultStyles = null;
			}
			else
			{
				for(i in styles) 
				{
					if(styles.hasOwnProperty(i))
					{
						if(!this._defaultStyles)
						{
							this._defaultStyles = {};
						}
						this._defaultStyles[i] = styles[i];
					}
				}
			}
		},

		/**
		 * Public accessor to the unique name of the Axis instance.
		 *
		 * @method toString
		 * @return {String} Unique name of the Axis instance.
		 */
		toString: function()
		{
			return "Axis " + this._id;
		}
	};


	Y.augment(Axis, Y.EventTarget);
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
		this.chart = new Y.Chart(p_oElement, this._chartConfig);
		this.xaxis = new Y.Axis(this._xAxisProps.type, {styles:this._xaxisstyles});
		this.yaxis = new Y.Axis(this._yAxisProps.type, {styles:this._yaxisstyles});
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
			
			this.chart.setDataProvider(this.data);
			this.xaxis.addKey(this._xAxisProps.key);
			this.yaxis.addKey(this._yAxisProps.key);
			
			if (this._type == "line") 
			{
				this.graph = new Y.LineGraph(this.xaxis, this.yaxis, xkey, ykey, {styles:this._graphstyles});
			}
			this.chart.addBottomItem(this.xaxis);
			this.chart.addLeftItem(this.yaxis);
			this.chart.addCenterItem(this.graph);
		},

		_chartstyles:{
			chart:{
				padding:{
					left:20, top:20, bottom:20, right:20
				}
			}, 
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
			weight:"2"
		},

		_complexStyleKeys:{
			label:"label",
			line:"line",
			margin:"margin",
			padding:"padding",
			majorTicks:"majorTicks"
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
						this._chartstyles.chart = this._parseStyles(this._chartstyles.chart, styles.chart);
					}
					if(styles.hasOwnProperty("background"))
					{
						this._chartstyles.background = this._parseStyles(this._chartstyles.background, styles.background);
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
			this._chartConfig.styles = this._chartstyles;
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
					if(this._complexStyleKeys.hasOwnProperty(i))
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


}, '@VERSION@' );
