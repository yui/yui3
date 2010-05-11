function Renderer(config)
{
	this._createId();
    Renderer.superclass.constructor.apply(this, arguments);
}

Renderer.NAME = "renderer";

Renderer.ATTRS = {
	width: {
		getter: function()
		{
			return this._width;
		},
		setter: function(value)
		{
			this._width = value;
			return value;
		}
	},
	height: {
		getter: function()
		{
			return this._height;
		},
		setter: function(value)
		{
			this._height = value;
			return value;
		}
	},
	rendering: {
		getter: function()
		{
			return this._rendering;
		},
		setter: function(value)
		{
			this._rendering = value;
			return value;
		}
	},

	previousWidth: {
		getter: function()
		{
			return this._previousWidth;
		},
		validator: function(value)
		{
			return Y.Lang.isNumber(value) && (this._previousWidth !== value);
		},
		setter: function(value)
		{
			this._previousWidth = value;
			return value;
		}
	},

	previousHeight: {
		getter: function()
		{
			return this._previousHeight;
		},
		validator: function(value)
		{
			return Y.Lang.isNumber(value) && (this._previousHeight !== value);
		},
		setter: function(value)
		{
			this._previousHeight = value;
			return value;
		}
	},

	/**
	 * Hash of style properties for class
	 */
	styles:
	{
		value: {},

		lazyAdd: false,

		getter: function()
		{
			return this._styles;
		},
			   
		setter: function(val)
		{
			this._styles = this._setStyles(val);
			return this._styles;
		},
		
		validator: function(val)
		{
			return Y.Lang.isObject(val);
		}
	}
};

Y.extend(Renderer, Y.Base, {
	/**
	 * Creates unique id for class instance.
	 *
	 * @private
	 */
	_createId: function()
	{
		this._id = Y.guid(this.GUID);
	},
	
    _width: 0,

	_height: 0,

	_styles: null,
	/**
	 * @private
	 * Indicates whether or not the class is in the process or rendering.
	 */
	_rendering: false,
	
	/**
	 * @private
	 * Previous width of the object.
	 */
	_previousWidth: 0,
	
	/**
	 * @private
	 * Previous height of the object.
	 */
	_previousHeight: 0,
	
	/**
	 * Indicates whether or not any changes have occurred that would
	 * require a rendering.
	 */
	_hasFlag: false,
	
	/**
	 * @private
	 * Indicates whether a flag has been created for a later rendering.
	 */
	_hasLaterFlag: false,
	
	/**
	 * @private
	 * Hash of values that indicates which properties need to be updated.
	 */
	_renderFlags: {},
	
	/**
	 * @private
	 * Hash of values that indicates which properties need to be updated
	 * on the following render cycle.
	 */
	_laterFlags: {},
	
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
		var styles = this.get("styles") || {};
		return this._mergeStyles(newstyles, styles);
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
	 * @private
	 * Event handler for rendering. 
	 */
	callRender: function()
	{
		if(!this.get("rendering"))
		{
			this.set("rendering", true);
			this.render();
			this.clearFlags();
			this._updateRenderStatus();
		}
	},

	/**
	 * @private 
	 */
	_updateRenderStatus: function()
	{
		this.set("rendering", false);
		this._dispatchRenderEvents();
	},
	
	/**
	 * @private (protected)
	 * All the events that need to be dispatched after <code>render</code> has completed.
	 */
	_dispatchRenderEvents: function()
	{
		var event = {type:"renderComplete"};
		event.changeFlags = this._renderFlags;
		this.fire(event.type, event);
		if(this._hasFlag) 
		{
			this.callRender();
		}
	},
	
	/**
	 * @private
	 */
	setFlag: function(value)
	{
		if(!this._hasFlag)
		{
			this._hasFlag = true;
		}
		this._renderFlags[value] = true;
	},
	
	/**
	 * @private 
	 * Sets a flag to mark for rendering on a later enterFrame.
	 */
	setLaterFlag: function(value)
	{
		if(!this._hasLaterFlag)
		{
			this._hasLaterFlag = true;
		}
		this._laterFlags[value] = true;
	},

	/**
	 * @private
	 */
	setFlags: function(value)
	{
		for(var i = 0; i < value.length; i++)
		{
			this.setFlag(value[i]);
		}
	},	

	/**
	 * @private
	 */
	clearFlags: function()
	{
		this._renderFlags = {};
		this._hasFlag = false;
		for(var i in this._laterFlags)
		{
			if(this._laterFlags.hasOwnProperty(i))
			{
				this._renderFlags[i] = this._laterFlags[i];
				this._hasFlag = true;
			}
		}
		this._hasLaterFlag = false;
		this._laterFlags = {};
	},
	
	/**
	 * @private
	 */
	checkFlag: function(value)
	{
		return this._renderFlags[value];
	},

	/**
	 * @private (protected)
	 */
	checkFlags: function(flags)
	{
		var hasFlag = false;
		for(var i in flags)
		{
			if(this._renderFlags[i]) 
			{
				hasFlag = true;
				break;
			}
		}
		return hasFlag;
	}
});

Y.Renderer = Renderer;
