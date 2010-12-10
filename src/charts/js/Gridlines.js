/**
 * Gridlines draws gridlines on a Graph.
 *
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 */
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * @private
     */
    render: function()
    {
        this._setCanvas();
    },

    /**
     * @private
     */
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
     * @protected
     *
     * Draws the gridlines
     *
     * @method draw
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

    /**
     * @private
     */
    _horizontalLine: function(graphic, pt, w, h)
    {
        graphic.moveTo(0, pt.y);
        graphic.lineTo(w, pt.y);
    },

    /**
     * @private
     */
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
     * @protected
     *
     * Gets the default value for the <code>styles</code> attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
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
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},
        
        /**
         * Indicate the <code>Axis</code> in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},
        
        /**
         * Indicates the <code>Graph</code> in which the gridlines 
         * are drawn.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {}
    }
});
