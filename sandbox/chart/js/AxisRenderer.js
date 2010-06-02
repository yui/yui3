function AxisRenderer(config)
{
    AxisRenderer.superclass.constructor.apply(this, arguments);
}

AxisRenderer.NAME = "AxisRenderer";

AxisRenderer.ATTRS = {
    /**
	 * The graphic in which the axis line and ticks will be rendered.
	 */
	graphic: {
		getter: function()
		{
			return this._graphic;
		},
		setter: function(value)
		{
			this._graphic = value;
			return value;
		}
	},
	
    parent: {
        lazyAdd: false,

		getter: function()
		{
			return this._parent;
		},

		setter: function(value)
		{
            if(Y.Lang.isString(value))
			{
				this._parent = document.getElementById(value);
			}
			else
			{
				this._parent = value;
			}
            this._setCanvas();
			return this._parent;
		}
	},

	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * <code>AxisRenderer</code>.
	 */
	axis: {
		getter: function()
		{ 
			return this._axis;
		},
		validator: function(value)
		{
			return value !== this._axis;
		},
		setter: function(value)
		{
			this._axis = value;			
			this._axis.on("axisReady", Y.bind(this.axisChangeHandler, this));
			this._axis.on("dataChange", Y.bind(this.axisChangeHandler, this));
			this.setFlag("axisDataChange");
			return value;
		},
		lazyAdd: false
    },

    /**
     * Distance determined by the tick styles used to calculate the distance between the axis
     * line in relation to the top of the axis.
     */
    topTickOffset: {
        getter: function()
        {
            return this._topTickOffset;
        },
        setter: function(val)
        {
            this._topTickOffset = val;
            return val;
        }
    },

    /**
     * Distance determined by the tick styles used to calculate the distance between the axis
     * line in relation to the bottom of the axis.
     */
    bottomTickOffset: {
        getter: function()
        {
            return this._bottomTickOffset;
        },
        setter: function(val)
        {
            this._bottomTickOffset = val;
            return val;
        }
    },

    /**
     * Distance determined by the tick styles used to calculate the distance between the axis
     * line in relation to the left of the axis.
     */
    leftTickOffset: {
        getter: function()
        {
            return this._leftTickOffset;
        },
        setter: function(val)
        {
            this._leftTickOffset = val;
            return val;
        }
    },

    /**
     * Distance determined by the tick styles used to calculate the distance between the axis
     * line in relation to the right side of the axis.
     */
    rightTickOffset: {
        getter: function()
        {
            return this._rightTickOffset;
        },
        setter: function(val)
        {
            this._rightTickOffset = val;
            return val;
        }
    },

    maxTickLength: {
        getter: function()
        {
            return this._maxTickLength;
        },

        setter: function(val)
        {
            this._maxTickLength = val;
        }
    }
};

Y.extend(AxisRenderer, Y.Renderer, {
	axisChangeHandler: function(e)
    {
        this.setFlag("data");
        this.callRender();
    },

    _node: null,

    /**
	 * Constant used to generate unique id.
	 */
	GUID: "yuiaxisrenderer",

	/**
	 * @private
	 */
	_graphic: null,
    
    /**
     * @private
     */
    _parent: null,
    
    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var p = this.get("parent"),
            n = document.createElement("div");
        p.appendChild(n);
        n.style.position = "absolute";
        n.style.display = "block";
        n.style.top = p.style.top;
        n.style.left = p.style.left;
        n.style.width = p.offsetWidth + "px";
        n.style.minHeight = p.offsetHeight + "px";
        this._node = n;
        this._graphic = new Y.Graphic();
        this._graphic.render(this._node);
    },
	
    /**
	 * @private
	 * Storage for keys
	 */
	_keys: null,
		
    /**
     * @private
     */
    render: function ()
    {
        var axisPosition = this.get("styles").position,
            positionChange = this.checkFlag("position");
        if(!axisPosition) 
        {
            return;
        }

        if(positionChange || !this._layout)
        {
            this._layout = this.getLayout(axisPosition);
        }

        if(this.checkFlag("calculateSizeByTickLength")) 
        {
            this.calculateSizeByTickLength = this.get("styles").calculateSizeByTickLength;
        }
        if(this.checkFlag("dataFormat") || 
            this.checkFlag("majorTicks") || 
            positionChange || 
            this.checkFlag("padding") || 
            this.checkFlag("data") || 
            this.checkFlag("resize") ||
            this.checkFlag("majorUnit") ||
            this.checkFlag("label") ||
            this.checkFlag("styles") ||
            this.checkFlag("calculateSizeByTickLength")) 
        {
            this.drawAxis();
        }
    },

    _layout: null,

    getLayout: function(pos)
    {
        var l;
        switch(pos)
        {
            case "top" :
                l = new Y.TopAxisLayout({axisRenderer:this});
            break;
            case "bottom" : 
                l = new Y.BottomAxisLayout({axisRenderer:this});
            break;
            case "left" :
                l = new Y.LeftAxisLayout({axisRenderer:this});
            break;
            case "right" :
                l = new Y.RightAxisLayout({axisRenderer:this});
            break;
        }
        return l;
    },

    /**
     * @private
     * Draws line based on start point, end point and line object.
     */
    drawLine: function(startPoint, endPoint, line)
    {
        var graphic = this.get("graphic");
        graphic.lineStyle(line.weight, line.color, line.alpha);
        graphic.moveTo(startPoint.x, startPoint.y);
        graphic.lineTo(endPoint.x, endPoint.y);
        graphic.endFill();
    },

    /**
     * @private
     * Basic logic for drawing an axis.
     */
    drawAxis: function ()
    {
        var style = this.get("styles"),
            majorTickStyles = style.majorTicks,
            drawTicks = majorTickStyles.display != "none",
            tickPoint,
            majorUnit = style.majorUnit,
            axis = this.get("axis"),
            len,
            majorUnitDistance,
            i = 0,
            layoutLength,
            position,
            lineStart,
            label,
            graphic = this.get("graphic");
        
        graphic.clear();
		this._layout.setTickOffsets();
        layoutLength = this.getLength();
        lineStart = this._layout.getLineStart();
        tickPoint = this.getFirstPoint(lineStart);
        this.drawLine(lineStart, this.getLineEnd(tickPoint), this.get("styles").line);
        if(drawTicks) 
        {
           this._layout.drawTick(tickPoint, majorTickStyles);
        }
        len = axis.getTotalMajorUnits(majorUnit, layoutLength);
        if(len < 1) 
        {
            return;
        }
        majorUnitDistance = layoutLength/(len - 1);
        for(; i < len; ++i)
	    {
            if(drawTicks) 
            {
                this._layout.drawTick(tickPoint, majorTickStyles);
            }
            position = this.getPosition(tickPoint);
            label = this.getLabel(tickPoint, axis.getLabelAtPosition(position, layoutLength));
            this._layout.positionLabel(label, this._layout.getLabelPoint(tickPoint));
            tickPoint = this.getNextPoint(tickPoint, majorUnitDistance);
        }
        if(this._calculateSizeByTickLength)
        {
            this._layout.offsetNodeForTick(this._node);
        }
    },

    /**
     * @private
     * @description Draws and positions a label based on its style properties.
     */
    getLabel: function(pt, txt, pos)
    {
        var label = document.createElement("div"),
            textNode = document.createTextNode(txt);
        label.nodeValue = txt;
        label.style.display = "block";
        label.style.position = "absolute";
        this._node.appendChild(label);
        label.appendChild(textNode);
        return label;
    },   
    
    /**
     * @private
     * Indicates how to include tick length in the size calculation of an
     * axis. If set to true, the length of the tick is used to calculate
     * this size. If false, the offset of tick will be used.
     */
    _calculateSizeByTickLength: true,

    /**
     * Indicate the end point of the axis line
     */
    getLineEnd: function(pt)
    {
        var w = this._node.offsetWidth,
            h = this._node.offsetHeight,
            pos = this.get("styles").position;
        if(pos === "top" || pos === "bottom")
        {
            return {x:w, y:pt.y};
        }
        else
        {
            return {x:pt.x, y:h};
        }
    },

    /**
     * Returns the distance between the first and last data points.
     */
    getLength: function()
    {
        var l,
            style = this.get("styles"),
            padding = style.padding,
            w = this._node.offsetWidth,
            h = this._node.offsetHeight,
            pos = style.position;
        if(pos === "top" || pos === "bottom")
        {
            l = w - (padding.left + padding.right);
        }
        else
        {
            l = h - (padding.top + padding.bottom);
        }
        return l;
    },

    getFirstPoint:function(pt)
    {
        var style = this.get("styles"),
            pos = style.position,
            padding = style.padding,
            np = {x:pt.x, y:pt.y};
        if(pos === "top" || pos === "bottom")
        {
            np.x += padding.left;
        }
        else
        {
            np.y += padding.top;
        }
        return np;
    },

    /**
     * Returns the next majorUnit point.
     */
    getNextPoint: function(point, majorUnitDistance)
    {
        var style = this.get("styles"),
            pos = style.position;
        if(pos === "top" || pos === "bottom")
        {
            point.x = point.x + majorUnitDistance;		
        }
        else
        {
            point.y = point.y + majorUnitDistance;
        }
        return point;
    },

    /**
     * Calculates the coordinates for the last point on an axis.
     */
    getLastPoint: function()
    {
        var style = this.get("styles"),
            padding = style.padding,
            w = this._node.offsetWidth,
            pos = style.position;
        if(pos === "top" || pos === "bottom")
        {
            return {x:w - padding.right, y:padding.top};
        }
        else
        {
            return {x:padding.left, y:padding.top};
        }
    },

    /**
     * Calculates the position of a point on the axis.
     */
    getPosition: function(point)
    {
        var p,
            h = this._node.offsetHeight,
            style = this.get("styles"),
            padding = style.padding,
            pos = style.position;
        if(pos === "left" || pos === "right")
        {
            p = (h - (padding.top + padding.bottom)) - (point.y - padding.top);
        }
        else
        {
            p = point.x - padding.left;
        }
        return p;
    },
    
    /**
     * @private 
     */
    _leftTickOffset: 0,

    /**
     * @private 
     */
    _topTickOffset: 0,

    /**
     * @private 
     */
    _rightTickOffset: 0,

    /**
     * @private 
     */
    _bottomTickOffset: 0,

    /**
     * @private
     */
    _maxTickLength: 0,

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
                count:5,
                distance:75
            },
            padding: {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            },
            calculateSizeByTickLength: false,
            hideOverlappingLabelTicks: false
        };
    }
});

Y.AxisRenderer = AxisRenderer;
		
        
