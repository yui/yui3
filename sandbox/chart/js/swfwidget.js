/**
 *
 * SWFWidget is the base class for all JS classes that manage styles
 * and communicates with a SWF Application.
 */



/**
 * Creates the SWFWidget instance and contains initialization data
 *
 * @param {Object} p_oElement Parent class. If the this class instance is the top level
 * of a flash application, the value is the id of its containing dom element. Otherwise, the
 * value is a reference to it container.
 * @param {Object} config (optional) Configuration parameters for the Chart.
 * @class SWFWidget
 * @constructor
 */
function SWFWidget (p_oElement, config)
{
	this._initConfig(p_oElement, config);
}

SWFWidget.prototype =
{
	/**
	 * Initializes class
	 *
	 * @private
	 */
	_initConfig: function(p_oElement, config)
	{
		this._styles = this._mergeStyles(this._styles, this._getDefaultStyles());
		this._id = Y.guid(this.GUID);
		this._setParent(p_oElement);
		this.addAttrs(this._attributeConfig, config);
	},

	_setParent: function(p_oElement)
	{
		this.oElement = p_oElement;
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
		var j, styles = this._styles,
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
		this._styles = styles;
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
		styles = this._styles;
		Y.Object.each(styles, function(value, key, styles)
		{
			if(this._id === key || (styleHash && styleHash.hasOwnProperty(key) && !(styleHash[key] instanceof SWFWidget)))
			{
				this.appswf.applyMethod(key, "setStyles", [styles[key]]);
			}
		}, this);
	},

	/**
	 * Attribute config
	 * @private
	 */
	_attributeConfig:
	{
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
			value: null,

			setter: function(val)
			{
				this._setStyles(val);
				if(this.swfReadyFlag)
				{
					this._updateStyles();
				}
				return this._styles;
			},
			
			getter: function()
			{
				return this._styles;
			},
		
			validator: function(val)
			{
				return Y.Lang.isObject(val);
			}
		}
	}	
};

Y.augment(SWFWidget, Y.Attribute);
Y.SWFWidget = SWFWidget;
