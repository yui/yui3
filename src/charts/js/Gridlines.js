Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * @private
     */
    render: function()
    {
        this._setCanvas();
    },

    remove: function()
    {
        var graphic = this.get("graphic"),
            gNode;
        if(graphic)
        {
            gNode = graphic.node;
            if(gNode)
            {
                Y.one(gNode).remove();
            }
        }
    },

    /**
     * Draws the gridlines
     */
    draw: function()
    {
        if(this.get("axis") && this.get("graph"))
        {
            this._drawGridlines();
        }
    },

    /**
     * @private
     */
    _drawGridlines: function()
    {
        var graphic = this.get("graphic"),
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            i = 0,
            l,
            direction = this.get("direction"),
            graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height"),
            line = this.get("styles").line,
            color = line.color,
            weight = line.weight,
            alpha = line.alpha,
            lineFunction = direction == "vertical" ? this._verticalLine : this._horizontalLine;
        if(axisPosition == "none")
        {
            points = [];
            l = axis.get("styles").majorUnit.count;
            for(; i < l; ++i)
            {
                points[i] = {
                    x: w * (i/(l-1)),
                    y: h * (i/(l-1))
                };
            }
            i = 0;
        }
        else
        {
            points = axis.get("tickPoints");
            l = points.length;
        }
        if(!graphic)
        {
            this._setCanvas();
            graphic = this.get("graphic");
        }
        graphic.clear();
        graphic.setSize(w, h);
        graphic.lineStyle(weight, color, alpha);
        for(; i < l; ++i)
        {
            lineFunction(graphic, points[i], w, h);
        }
        graphic.end();
    },

    _horizontalLine: function(graphic, pt, w, h)
    {
        graphic.moveTo(0, pt.y);
        graphic.lineTo(w, pt.y);
    },

    _verticalLine: function(graphic, pt, w, h)
    {
        graphic.moveTo(pt.x, 0);
        graphic.lineTo(pt.x, h);
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("graph").get("contentBox"));
    },
    
    /**
     * @private
     */
    _getDefaultStyles: function()
    {
        var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            }
        };
        return defs;
    }

},
{
    ATTRS: {
        direction: {},
        axis: {},
        graph: {}
    }
});
