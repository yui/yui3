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

	BorderContainer.NAME = "borderContainer";

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
