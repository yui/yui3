function Marker(config)
{
	Marker.superclass.constructor.apply(this, arguments);
}

Marker.NAME = "marker";

Marker.ATTRS = {
    series: {
        value: null
    },

    drawMethod: {
        getter: function()
        {
            return this._drawMethod;
        },
        setter: function(val)
        {
            this._drawMethod = val;
            return val;
        }
    },

    index: {
        value: null
    },

    colorIndex: {
        value: null
    },
    
    state: {
        value:"off"
    }
};

Y.extend(Marker, Y.Renderer, {
    bindUI: function()
    {
        this.after("stylesChange", Y.bind(this._updateHandler, this));
        this.after("stateChange", Y.bind(this._updateHandler, this));
    },

    /**
     * @private
     */
    renderUI: function()
    {
        if(!this.get("graphic"))
        {
            this._setCanvas();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._update();
        }
    },
    
    /**
	 * @private
	 */
    _handleMouseOver: function(e)
    { 
        this.set("state", "over");
    },

    /**
	 * @private
	 */
    _handleMouseDown: function(e)
    {
        this.set("state", "down");
    },

    /**
	 * @private
	 */
    _handleMouseOut: function(e)
    {
        this.set("state", "off");
    },

    _getStateStyles: function()
    {
        var styles = this._mergeStyles(this.get("styles"), {}),
            state = this.get("state"),
            stateStyles,
            w,
            h,
            x = 0,
            y = 0,
            fill = this._mergeStyles(styles.fill, {}),
            border = this._mergeStyles(styles.border, {}),
            dc = this.get("series")._getDefaultColor(this.get("colorIndex"));
            fill.color = fill.color || dc;
            border.color = border.color || dc;
        stateStyles = {
                fill:fill,                
                border:border, 
                shape: styles.shape,
                width: styles.width,
                height: styles.height,
                props: this._mergeStyles(styles.props, {})
        };
        if((state === "over" || state === "down") && styles[state])
        {
            stateStyles = this._mergeStyles(styles[state], stateStyles);
        }
        w = stateStyles.width;
        h = stateStyles.height;
        stateStyles.x = x;
        stateStyles.y = y;
        stateStyles.width = w;
        stateStyles.height = h;
        this.set("width", w);
        this.set("height", h);
        return stateStyles;
    },

    /**
	 * @private (override)
	 */
	draw: function()
    {
        var stateStyles = this._getStateStyles(),
            w = stateStyles.width,
            h = stateStyles.height,
            graphic = this.get("graphic");
        this._shape = graphic.getShape(stateStyles);
        Y.one(this._shape.node).addClass("yui3-seriesmarker");

	},

    /**
     * @private
     * @description Reference to the graphic object.
     */
    _shape: null,

    /**
     * @private
     * @description Updates the properties of an existing state.
     */
    _update: function()
    {
        this.get("graphic").updateShape(this._shape, this._getStateStyles());
    }
});

Y.Marker = Marker;
