function Renderer(config)
{
    Renderer.superclass.constructor.apply(this, arguments);
}

Renderer.NAME = "renderer";

Renderer.ATTRS = {
    padding: {
        getter: function()
        {
            return this._padding || this._getDefPadding();
        },

        setter: function(val)
        {
            var def = this._padding || this._getDefPadding();
            this._padding = Y.merge(def, val);
        }
    },

    node: {
        value: null
    },
    
    /**
	 * The graphic in which the series will be rendered.
	 */
	graphic: {
        value: null
    },
	
    /**
	 * Hash of style properties for class
	 */
	styles:
	{
		value: {},

		getter: function()
		{
            this._styles = this._styles || this._getDefaultStyles();
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

Y.extend(Renderer, Y.Widget, {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
        if(!this.get("graphic"))
        {
            this._setCanvas();
        }
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("stylesChange", Y.bind(this._updateHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this.draw();
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this.draw();
        }
    },

    _setNode: function()
    {
       var cb = this.get("contentBox"),
            n = document.createElement("div"),
            style = n.style;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.width = "100%";
        style.height = "100%";
        this.set("node", n);
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("contentBox"));
    },
	
    /**
     * @private
     * @description Hash of newly set styles.
     */
    _newStyles: null,

    /**
     * @private
     * @description Storage for styles
     */
	_styles: null,
	
    /**
	 * Sets multiple style properties on the instance.
	 *
	 * @method _setStyles
	 * @param {Object} styles Hash of styles to be applied.
	 */
	_setStyles: function(newstyles)
	{
		var styles = this.get("styles");
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
        this._newStyles = {};
		if(!b)
        {
            b = {};
        }
        Y.Object.each(a, function(value, key, a)
		{
			if(b.hasOwnProperty(key) && Y.Lang.isObject(value) && !Y.Lang.isArray(value))
			{
				b[key] = this._mergeStyles(value, b[key]);
			}
			else
			{
				b[key] = value;
			    this._newStyles[key] = value;
            }
		}, this);
		return b;
	},

    /**
     * @private
     * @description Default style values.
     */
    _getDefaultStyles: function()
    {
        return {};
    },

    /**
     * @private
     */
    _getDefPadding: function()
    {
        return {
            top:0,
            right: 0,
            bottom: 0,
            left: 0
        };
    }
});

Y.Renderer = Renderer;

