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
        this.on("mouseover", Y.bind(this._handleMouseOver, this));
        this.on("mousedown", Y.bind(this._handleMouseDown, this));
        this.on("mouseout", Y.bind(this._handleMouseOut, this));
        this.on("mouseup", Y.bind(this._handleMouseOver, this));
    },

    _handleMouseOver: function(e)
    {
        this.set("state", "over");
    },

    _handleMouseDown: function(e)
    {
        this.set("state", "down");
    },

    _handleMouseOut: function(e)
    {
        this.set("state", "off");
    },

    /**
	 * @private (override)
	 */
	draw: function()
    {
        var graphic = this.get("graphic"),
            styles = this._mergeStyles(this.get("styles"), {}),
            state = this.get("state"),
            node = this.get("node"),
            stateStyles,
            border,
            fill,
            borderWidth,
            borderColor,
            borderAlpha,
            fillColor,
            fillAlpha,
            shape,
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
        graphic.clear();
        w = stateStyles.width;
        h = stateStyles.height;
        if(stateStyles.border && stateStyles.border.weight && stateStyles.border.weight > 0)
        {
            w += stateStyles.border.weight * 2;
            h += stateStyles.border.weight * 2;
            x += stateStyles.border.weight;
            y += stateStyles.border.weight;
        }
        this.set("width", w);
        this.set("height", h);
        node.style.width = w + "px";
        node.style.height = h + "px";
        node.style.position = "absolute";
        node.style.overflow = "visible"; 
        graphic.setPosition(0, 0);
        graphic.setSize(w, h);
        if(stateStyles.border)
        {
            border = stateStyles.border;
            borderWidth = border.weight || 0;
            borderColor = border.color || "#000";
            borderAlpha = border.alpha || 1;
            if(borderWidth > 0)
            {
                graphic.lineStyle(borderWidth, borderColor, borderAlpha);
            }
        }
		if(stateStyles.fill)
        {
            fill = stateStyles.fill;
            fillColor = fill.color || "#000";
            fillAlpha = fill.alpha || 1;
            graphic.beginFill(fillColor, fillAlpha);
        }
        this[stateStyles.shape](x, y, stateStyles);
        graphic.end();
	},

    circle: function(x, y, config)
    {
        var graphic = this.get("graphic"),
            w = config.width,
            h = config.height;
        graphic.drawEllipse(x, y, w, h);
    },

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
