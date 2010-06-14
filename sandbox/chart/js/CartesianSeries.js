Y.CartesianSeries = Y.Base.create("cartesianSeries", Y.Widget, [Y.Renderer], {
    renderUI: function()
    {
        this._setCanvas();
    },
    
    bindUI: function()
    {
        var xAxis = this.get("xAxis"),
            yAxis = this.get("yAxis");
        if(xAxis)
        {
            xAxis.after("axisReady", Y.bind(this._xAxisChangeHandler, this));
            xAxis.after("axisUpdate", Y.bind(this._xAxisChangeHandler, this));
        }
        if(yAxis)
        {
            yAxis.after("axisReady", Y.bind(this._yAxisChangeHandler, this));
            yAxis.after("axisUpdate", Y.bind(this._yAxisChangeHandler, this));
        }
        this.after("xAxisChange", Y.bind(this.xAxisChangeHandler, this));
        this.after("yAxisChange", Y.bind(this.yAxisChangeHandler, this));
        this.after("stylesChange", Y.bind(this._updateHandler, this));
        this._parentNode.after("widthChange", Y.bind(this._resizeHandler, this));
        this._parentNode.after("heightChange", Y.bind(this._resizeHandler, this));
    },
   
    _resizeHandler: function(e)
    {
    },

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
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuicartesianseries",
	
    /**
     * @private
     * Creates a <code>Graphic</code> instance.
     */
    _setCanvas: function()
    {
        var cb = this.get("contentBox"),
            n = document.createElement("div"),
            style = n.style;
        cb.appendChild(n);
        style.position = "absolute";
        style.display = "block";
        style.top = "0px"; 
        style.left = "0px";
        style.width = "800px";
        style.height = "300px";
        this.set("node", n);
        this.set("graphic", new Y.Graphic());
        this.get("graphic").render(this.get("node"));
   },

	/**
	 * @private
	 */
	_graphic: null,
	
	/**
	 * @private (protected)
	 * Handles updating the graph when the x < code>Axis</code> values
	 * change.
	 */
	_xAxisChangeHandler: function(event)
	{
        var xAxis = this.get("xAxis");
        this._xMin = xAxis.get("minimum");
        this._xMax = xAxis.get("maximum");
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private (protected)
	 * Handles updating the chart when the y <code>Axis</code> values
	 * change.
	 */
	_yAxisChangeHandler: function(event)
	{
        var yAxis = this.get("yAxis");
        this._yMin = yAxis.get("minimum");
        this._yMax = yAxis.get("maximum");
        if(this.get("rendered") && this.get("xKey") && this.get("yKey"))
		{
			this.draw();
		}
	},

	/**
	 * @private
	 */
	_type: "cartesian",

	/**
	 * @private 
	 * Storage for <code>order</code>
	 */
	_order: NaN,
	
	/**
	 * @private 
	 * Storage for <code>xcoords</code>.
	 */
	_xcoords: [],

	
	/**
	 * @private
	 * Storage for xKey
	 */
	_xKey: null,
	/**
	 * @private (protected)
	 * Storage for <code>ycoords</code>
	 */
	_ycoords: [],
	/**
	 * @private 
	 * Storage for <code>graph</code>.
	 */
	_graph: null,
	/**
	 * @private
	 * Storage for xAxis
	 */
	_xAxis: null,
	
	/**
	 * @private
	 * Storage for yAxis
	 */
	_yAxis: null,
	/**
	 * @private
	 * Storage for yKey
	 */
	_yKey: null,
	
	/**
	 * @private (protected)
	 */
	_xMin:NaN,
	
	/**
	 * @private (protected)
	 */
	_xMax: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMin: NaN,
	
	/**
	 * @private (protected)
	 */
	_yMax: NaN,

	/**
	 * @private (protected)
	 * Storage for xCoords
	 */
	_xCoords: [],

	/**
	 * @private
	 */
	setAreaData: function()
	{
        var nextX, nextY,
            node = this.get("node"),
			w = node.offsetWidth,
            h = node.offsetHeight,
            padding = this.get("styles").padding,
			leftPadding = padding.left,
			topPadding = padding.top,
			dataWidth = w - (leftPadding + padding.right),
			dataHeight = h - (topPadding + padding.bottom),
			xcoords = [],
			ycoords = [],
			xMax = this.get("xAxis").get("maximum"),
			xMin = this.get("xAxis").get("minimum"),
			yMax = this.get("yAxis").get("maximum"),
			yMin = this.get("yAxis").get("minimum"),
			xKey = this.get("xKey"),
			yKey = this.get("yKey"),
			xScaleFactor = dataWidth / (xMax - xMin),
			yScaleFactor = dataHeight / (yMax - yMin),
			xData = this.get("xAxis").getDataByKey(xKey),
			yData = this.get("yAxis").getDataByKey(yKey),
			dataLength = xData.length, 	
            i;
        this._leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding);
        this._bottomOrigin =  Math.round((dataHeight + topPadding) - (0 - yMin) * yScaleFactor);
        for (i = 0; i < dataLength; ++i) 
		{
            nextX = Math.round((((xData[i] - xMin) * xScaleFactor) + leftPadding));
			nextY = Math.round(((dataHeight + topPadding) - (yData[i] - yMin) * yScaleFactor));
            xcoords.push(nextX);
            ycoords.push(nextY);
        }
        this.set("xcoords", xcoords);
		this.set("ycoords", ycoords);
    },

    _leftOrigin: null,

    _bottomOrigin: null,

	/**
	 * @private
	 */
	drawGraph: function()
	{
        this.drawMarkers();
	},
	
	/**
	 * @private (override)
	 */
	draw: function()
    {
        var node = this.get("node"),
			w = node.offsetWidth,
            h = node.offsetHeight;
        if  (!isNaN(w) && !isNaN(h) && w > 0 && h > 0)
		{
            this.setAreaData();
            this.drawGraph();
		}
	},

	drawMarkers: function()
	{
	    if(this._xcoords.length < 1) 
		{
			return;
		}
        var graphic = this.get("graphic"),
            style = this.get("styles").marker,
            w = style.width,
            h = style.height,
            fillColor = style.fillColor,
            alpha = style.fillAlpha,
            fillType = style.fillType || "solid",
            borderWidth = style.borderWidth,
            borderColor = style.borderColor,
            borderAlpha = style.borderAlpha || 1,
            colors = style.colors,
            alphas = style.alpha || [],
            ratios = style.ratios || [],
            rotation = style.rotation || 0,
            xcoords = this._xcoords,
            ycoords = this._ycoords,
            shapeMethod = style.func || "drawCircle",
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left;
        for(; i < len; ++i)
        {
            top = ycoords[i];
            left = xcoords[i];
            if(borderWidth > 0)
            {
                graphic.lineStyle(borderWidth, borderColor, borderAlpha);
            }
            if(fillType === "solid")
            {
                graphic.beginFill(fillColor, alpha);
            }
            else
            {
                graphic.beginGradientFill(fillType, colors, alphas, ratios, {rotation:rotation, width:w, height:h});
            }
            this.drawMarker(graphic, shapeMethod, left, top, w, h);
            graphic.endFill();
        }
 	},

    drawMarker: function(graphic, func, left, top, w, h)
    {
        if(func === "drawCircle")
        {
            graphic.drawCircle(left, top, w/2);
        }
        else
        {
            left -= w/2;
            top -= h/2;
            graphic[func].call(graphic, left, top, w, h);
        }
    },

    _getDefaultStyles: function()
    {
        return {padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }};
    }
}, {
ATTRS: {

	type: {		
		getter: function()
		{
			return this._type;
		},
		setter: function(value)
		{
			this._type = value;
			return value;
		}
  	},
	/**
	 * Order of this ISeries instance of this <code>type</code>.
	 */
	order: {
		getter: function()
		{
			return this._order;
		},
		setter:function(value)
		{
			this._order = value;
			return value;
		}
	},
	/**
	 * x coordinates for the series.
	 */
	xcoords: {
		getter: function()
		{
			return this._xcoords;
		},

		setter: function(value)
		{
			this._xcoords = value;
			return value;
		}
	},
	/**
	 * y coordinates for the series
	 */
	ycoords: {
		getter: function()
		{
			return this._ycoords;
		},
		setter: function(value)
		{
			this._ycoords = value;
			return value;
		}
	},
	graph: {
		getter: function()
		{
			return this._graph;
		},
		setter: function(value)
		{
			this._graph = value;
			return value;
		}
	},
	/**
	 * Reference to the <code>Axis</code> instance used for assigning 
	 * x-values to the graph.
	 */
	xAxis: {
		getter: function()
		{ 
			return this._xAxis;
		},
		validator: function(value)
		{
			return value !== this._xAxis;
		},
		setter: function(value)
		{
			this._xAxis = value;			
			return value;
		},
		lazyAdd: false
	},
	
	yAxis: {
		getter: function()
		{ 
			return this._yAxis;
		},
		validator: function(value)
		{
			return value !== this._yAxis;
		},
		setter: function(value)
		{
			this._yAxis = value;
			return value;
		},
		lazyAdd: false
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the x-axis <code>Axis</code> instance.
	 */
	xKey: {
		getter: function()
		{ 
			return this._xKey; 
		},
		validator: function(value)
		{
			return value !== this._xKey;
		},
		setter: function(value)
		{
			this._xKey = value;
			return value;
		}
	},
	/**
	 * Indicates which array to from the hash of value arrays in 
	 * the y-axis <code>Axis</code> instance.
	 */
	yKey: {
		getter: function()
		{ 
			return this._yKey; 
		},
		validator: function(value)
		{
			return value !== this._yKey;
		},
		setter: function(value)
		{
			this._yKey = value;
			return value;
		}
	},

    node: {
        value: null
    },
    
    /**
	 * The graphic in which the series will be rendered.
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
	}
}
});

