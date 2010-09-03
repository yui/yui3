/**
 * Renders an axis.
 */
function AxisRenderer(config)
{
    AxisRenderer.superclass.constructor.apply(this, arguments);
}

AxisRenderer.NAME = "axisRenderer";

AxisRenderer.ATTRS = {
        edgeOffset: {
            value: 0
        },

        /**
         * The graphic in which the axis line and ticks will be rendered.
         */
        graphic: {
            value: null
        },
        
        /**
         * Reference to the <code>Axis</code> instance used for assigning 
         * <code>AxisRenderer</code>.
         */
        axis: {
            
            value: null,

            validator: function(value)
            {
                return value !== this.get("axis");
            }
        },

        /**
         * Contains the contents of the axis. 
         */
        node: {
            value: null
        },

        /**
         * Direction of the axis.
         */
        position: {
            value: "bottom",

            validator: function(val)
            {
                return ((val !== this.get("position")) && (val === "bottom" || val === "top" || val === "left" || val === "right"));
            }
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the top of the axis.
         */
        topTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the bottom of the axis.
         */
        bottomTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the left of the axis.
         */
        leftTickOffset: {
            value: 0
        },

        /**
         * Distance determined by the tick styles used to calculate the distance between the axis
         * line in relation to the right side of the axis.
         */
        rightTickOffset: {
            value: 0
        },

        /**
         * Indicates whether the axis overlaps the graph. If an axis is the inner most axis on a given
         * position and the tick position is inside or cross, the axis will need to overlap the graph.
         */
        overlapGraph: {
            value:true,

            validator: function(val)
            {
                return Y.Lang.isBoolean(val);
            }
        }
    };
    Y.extend(AxisRenderer, Y.Renderer, {    
    /**
     * @private
     * @description Triggered by a change in the axis attribute. Removes any old axis listeners and sets up listeners for the new axis.
     */
    axisChangeHandler: function(e)
    {
       var axis = e.newVal,
            oldAxis = e.prevVal;
        if(oldAxis)
        {
            oldAxis.detach("axisReady", this._axisDataChangeHandler);
            oldAxis.detach("axisUpdate", this._axisDataChangeHandler);
        }
        axis.after("axisReady", Y.bind(this._axisDataChangeHandler, this));
        axis.after("axisUpdate", Y.bind(this._axisDataChangeHandler, this));
    },

    /**
     * @private
     * @description Handler for data changes.
     */
    _axisDataChangeHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _updateHandler: function(e)
    {
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    _positionChangeHandler: function(e)
    {
        this._ui =this.getLayout(this.get("position"));
        if(this.get("rendered"))
        {
            this._drawAxis();
        }
    },

    /**
     * @private
     */
    renderUI: function()
    {
        this._ui =this.getLayout(this.get("position"));
        this._setCanvas();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        var axis = this.get("axis");
        if(axis)
        {
            axis.after("axisReady", Y.bind(this._axisDataChangeHandler, this));
            axis.after("axisUpdate", Y.bind(this._axisDataChangeHandler, this));
        }
        this.after("axisChange", this.axisChangeHandler);
        this.after("stylesChange", this._updateHandler);
        this.after("positionChange", this._positionChangeHandler);
        this.after("overlapGraphChange", this._updateHandler);
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._drawAxis();
    },

    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            p = this.get("position"),
            n = document.createElement("div"),
            style = n.style,
            pn = this._parentNode;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.border = "1px";
        if(p === "top" || p === "bottom")
        {
            cb.setStyle("width", pn.getStyle("width"));
        }
        else
        {
            cb.setStyle("height", pn.getStyle("height"));
        }
        style.width = cb.getStyle("width");
        style.height = cb.getStyle("height");
        this.set("node", n);
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("node"));
    },
	
    /**
     * @private
     * @description Returns the default style values for the axis.
     */
    _getDefaultStyles: function()
    {
        return {
            majorTicks: {
                display:"inside",
                length:4,
                color:"#000000",
                weight:1,
                alpha:1
            },
            minorTicks: {
                display:"none",
                length:2,
                color:"#000000",
                weight:1
            },
            line: {
                weight:1,
                color:"#000000",
                alpha:1
            },
            majorUnit: {
                determinant:"count",
                count:11,
                distance:75
            },
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            top: "0px",
            left: "0px",
            width: "100px",
            height: "100px",
            label: {
                rotation: 0,
                margin: {
                    top:4,
                    right:4,
                    bottom:4,
                    left:4
                }
            },
            hideOverlappingLabelTicks: false
        };
    }

});

Y.AxisRenderer = AxisRenderer;        
