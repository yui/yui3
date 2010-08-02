function Marker(config)
{
	Marker.superclass.constructor.apply(this, arguments);
}

Marker.NAME = "marker";

Marker.ATTRS = {
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
            y = 0;
        stateStyles = {
                fill: this._mergeStyles(styles.fill, {}),
                border: this._mergeStyles(styles.border, {}),
                shape: styles.shape,
                width: styles.width,
                height: styles.height
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
            node = this.get("node"),
            graphic = this.get("graphic");
        node.style.width = w + "px";
        node.style.height = h + "px";
        node.style.position = "absolute";
        this._shape = graphic.getShape(stateStyles);
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
    },

    /**
	 * @private
	 */
    _getDefaultStyles: function()
    {
        return {
            fill:{
                type: "solid",
                color: "#000000",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                color: "#000000",
                weight: 1,
                alpha: 1
            },
            width: 6,
            height: 6,
            shape: "circle",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },

            over: null,        
            down: null
        };
    }
});

Y.Marker = Marker;
