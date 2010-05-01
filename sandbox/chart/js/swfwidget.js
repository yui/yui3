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

	_init: function()
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
			if(this.get("app") && this._id)
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
