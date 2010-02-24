/**
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
	this._id = Y.guid(this.GUID);
	this._setParent(p_oElement);
	this.addAttrs(this._attributeConfig, config);
}

SWFWidget.prototype =
{
	_setParent: function(p_oElement)
	{
		this.oElement = p_oElement;
	},

	/**
	 * Reference to corresponding Actionscript class.
	 */
	CLASSNAME: "SWFWidget",

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
	 * Hash of default styles for the instance.
	 */
	_defaultStyles: {},

	/**
	 * @private
	 *
	 * Hash of child references with style objects.
	 */
	_styleObjHash: null,

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
		if(this._styleObjHash && this._styleObjHash.hasOwnProperty(style))
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
			this._updateStyles();
		}
	},

	/**
	 * Sets multiple style properties on the instance.
	 *
	 * @method _setStyles
	 * @param {Object} styles Hash of styles to be applied.
	 */
	_setStyles: function(styles)
	{
		var i, j, defaults = this._defaultStyles;
		if(!defaults.hasOwnProperty(this._id))
		{
			defaults[this._id] = {};
		}
		for(i in styles)
		{
			if(styles.hasOwnProperty(i))
			{
				if(this._styleObjHash && this._styleObjHash.hasOwnProperty(i))
				{
					j = this._styleObjHash[i];
					if(defaults && defaults.hasOwnProperty(j) && Y.Lang.isObject(defaults[j])) 
					{
						defaults[j] = this._mergeStyles(styles[i], defaults[j]);
					}
					else
					{
						defaults[j] = styles[i];
					}
				}
				else
				{
					j = this._id;
					if(defaults && defaults.hasOwnProperty(j) && defaults[j].hasOwnProperty(i) && Y.Lang.isObject(defaults[j][i]))
					{
						defaults[j][i] = this._mergeStyles(styles[i], defaults[j][i]);
					}
					else
					{
						defaults[j][i] = styles[i];
					}
				}
			}
		}
		this._defaultStyles = defaults;
		if(this.swfReadyFlag)
		{
			this._updateStyles();
		}
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
		var i;
		for(i in a)
		{
			if(a.hasOwnProperty(i))
			{
				if(b.hasOwnProperty(i) && Y.Lang.isObject(a[i]))
				{
					b[i] = this._mergeStyles(a[i], b[i]);
				}
				else
				{
					b[i] = a[i];
				}

			}
		}
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
		for(var id in this._defaultStyles)
		{
			if(this._defaultStyles.hasOwnProperty(id))
			{
				if(this._id === id || (this._styleObjHash && this._styleObjHash.hasOwnProperty(id))) 
				{
					this.appswf.applyMethod(id, "setStyles", [this._defaultStyles[id]]);
				}
			}
		}
		this._defaultStyles = null;
		this._defaultStyles = {};
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
			value:this.CLASSNAME,

			readOnly:true,

			getter: function()
			{
				return this.CLASSNAME;
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
			},

			validator: function(val)
			{
				return Y.Lang.isObject(val);
			}

		}
	},	

	/**
	 * Public accessor to the unique name of the Container instance.
	 *
	 * @method toString
	 * @return {String} Unique name of the Container instance.
	 */
	toString: function()
	{
		return "SWFWidget " + this._id;
	}


};

Y.augment(SWFWidget, Y.Attribute);
Y.SWFWidget = SWFWidget;
