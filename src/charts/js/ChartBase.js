function ChartBase() {}

ChartBase.ATTRS = {
    tooltip: {
        valueFn: "_getTooltip",

        setter: function(val)
        {
            return this._updateTooltip(val);
        }
    },

    /**
     * @description Indicates the the type of interactions that will fire events.
     * <ul>
     *  <li>marker</li>
     *  <li>all</li>
     *  <li>none</li>
     */
    interactionType: {
        value: "marker"
    },

    /**
     * Data used to generate the chart.
     */
    dataProvider: {
        setter: function(val)
        {
            return this._setDataValues(val);
        }
    },

    /**
     * Reference to graph instance
     * @type Graph 
     */
    graph: {
        valueFn: "_getGraph"
   }
};

ChartBase.prototype = {
    /**
     * @private
     * @description Default value function for the <code>graph</code> attribute.
     */
    _getGraph: function()
    {
        var graph = new Y.Graph();
        graph.after("chartRendered", Y.bind(function(e) {
            this.fire("chartRendered");
        }, this));
        return graph; 
    },

    /**
     * Returns a series instance
     * @method getSeries
     */
    getSeries: function(val)
    {
        var series = null, 
            graph = this.get("graph");
        if(graph)
        {
            if(Y.Lang.isNumber(val))
            {
                series = graph.getSeriesByIndex(val);
            }
            else
            {
                series = graph.getSeriesByKey(val);
            }
        }
        return series;
    },

    /**
     * Returns axis by key reference
     * @method getAxisByKey
     */
    getAxisByKey: function(val)
    {
        var axis,
            axes = this.get("axes");
        if(axes.hasOwnProperty(val))
        {
            axis = axes[val];
        }
        return axis;
    },

    /**
     * Returns the category axis for the chart.
     * @method getCategoryAxis
     */
    getCategoryAxis: function()
    {
        var axis,
            key = this.get("categoryKey"),
            axes = this.get("axes");
        if(axes.hasOwnProperty(key))
        {
            axis = axes[key];
        }
        return axis;
    },

    /**
     * @private
     */
    _direction: "horizontal",
    
    /**
     * @private
     */
    _dataProvider: null,

    /**
     * @private
     */
    _setDataValues: function(val)
    {
        if(Y.Lang.isArray(val[0]))
        {
            var hash, 
                dp = [], 
                cats = val[0], 
                i = 0, 
                l = cats.length, 
                n, 
                sl = val.length;
            for(; i < l; ++i)
            {
                hash = {category:cats[i]};
                for(n = 1; n < sl; ++n)
                {
                    hash["series" + n] = val[n][i];
                }
                dp[i] = hash; 
            }
            return dp;
        }
        return val;
    },

    /**
     * @private 
     */
    _seriesCollection: null,

    /**
     * @private
     */
    _setSeriesCollection: function(val)
    {
        this._seriesCollection = val;
    },
    /**
     * @private
     */
    _getAxisClass: function(t)
    {
        return this._axisClass[t];
    },
    /**
     * @private
     */
    _axisClass: {
        stacked: Y.StackedAxis,
        numeric: Y.NumericAxis,
        category: Y.CategoryAxis,
        time: Y.TimeAxis
    },

    /**
     * @private
     */
    _axes: null,

    /**
     * @private
     */
    renderUI: function()
    {
        //move the position = absolute logic to a class file
        this.get("boundingBox").setStyle("position", "absolute");
        this.get("contentBox").setStyle("position", "absolute");
        this._addAxes();
        this._addSeries();
        if(this.get("showTooltip"))
        {
            this._addTooltip();
        }
        this._redraw();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("showTooltipChange", Y.bind(this._showTooltipChangeHandler, this));
        this.after("widthChange", this._sizeChanged);
        this.after("heightChange", this._sizeChanged);
        this.after("dataProviderChange", this._dataProviderChangeHandler);
        var cb = this.get("contentBox"),
            interactionType = this.get("interactionType"),
            defaultTooltipFunction;
        if(interactionType == "marker")
        {
            Y.delegate("mouseenter", Y.bind(this._markerEventHandler, this), cb, ".yui3-seriesmarker");
            Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), cb, ".yui3-seriesmarker");
            Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), cb, ".yui3-seriesmarker");
            Y.delegate("mouseleave", Y.bind(this._markerEventHandler, this), cb, ".yui3-seriesmarker");
            Y.delegate("mousemove", Y.bind(this._positionTooltip, this), cb, ".yui3-seriesmarker");
            defaultTooltipFunction = this._displayTooltip;
        }
        else if(interactionType == "all")
        {
            this._overlay.on("mousemove", Y.bind(this._mouseMoveHandler, this));
            this.on("mouseout", this._hideTooltip);
            defaultTooltipFunction = this._displayMultiTooltip;
        }
        if(this.get("tooltip"))
        {
            this.on("markerEvent:mouseover", defaultTooltipFunction);
            this.on("markerEvent:mouseout", this._hideTooltip);
        }
    },
    
    /**
     * @private
     */
    _markerEventHandler: function(e)
    {
        var type = e.type,
            cb = this.get("contentBox"),
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            seriesIndex = strArr[0],
            series = this.getSeries(parseInt(strArr[1], 10)),
            index = strArr[2],
            x = e.pageX - cb.getX(),
            y = e.pageY - cb.getY();
        if(type == "mouseenter")
        {
            type = "mouseover";
        }
        else if(type == "mouseleave")
        {
            type = "mouseout";
        }
        series.updateMarkerState(type, index);
        this.fire("markerEvent:" + type, {node:markerNode, x:x, y:y, series:series, index:index, seriesIndex:seriesIndex});
    },
    
    _dataProviderChangeHandler: function(e)
    {
        var dataProvider = this.get("dataProvider"),
            axes = this.get("axes"),
            i,
            axis;
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                if(axis instanceof Y.BaseAxis)
                {
                    axis.set("dataProvider", dataProvider);
                }
            }
        }
    },

    /**
     * @private
     */
    _showTooltip: function(msg, x, y)
    {
        var tt = this.get("tooltip"),
            node = tt.node;
        if(msg)
        {
            node.set("innerHTML", msg);
            node.setStyle("top", y + "px");
            node.setStyle("left", x + "px");
            node.removeClass("yui3-widget-hidden");
        }
    },

    /**
     * @private
     */
    _positionTooltip: function(e)
    {
        var tt = this.get("tooltip"),
            node = tt.node,
            cb = this.get("contentBox"),
            x = (e.pageX + 10) - cb.getX(),
            y = (e.pageY + 10) - cb.getY();
        if(node)
        {
            node.setStyle("left", x + "px");
            node.setStyle("top", y + "px");
        }
    },

    /**
     * @private
     */
    _hideTooltip: function()
    {
        var tt = this.get("tooltip"),
            node = tt.node;
        node.set("innerHTML", "");
        node.setStyle("left", -10000);
        node.setStyle("top", -10000);
        node.addClass("yui3-widget-hidden");
    },

    /**
     * @private
     */
    _addTooltip: function()
    {
        var tt = this.get("tooltip");
        this.get("contentBox").appendChild(tt.node);
    },

    /**
     * @private
     */
    _updateTooltip: function(val)
    {
        var tt = this._tooltip,
            i,
            styles = val.styles;
        if(styles)
        {
            for(i in styles)
            {
                if(styles.hasOwnProperty(i))
                {
                    tt.node.setStyle(i, styles[i]);
                }
            }
        }
        if(val.hasOwnProperty("labelFunction"))
        {
            tt.labelFunction = val.labelFunction;
        }
        return tt;
    },

    /**
     * @private
     */
    _getTooltip: function()
    {
        var node = document.createElement("div"),
            tt = {
                labelFunction: this._tooltipLabelFunction
            };
        node = Y.one(node);
        node.setStyle("fontSize", "9px");
        node.setStyle("fontWeight", "bold");
        node.setStyle("position", "absolute");
        node.setStyle("paddingTop", "2px");
        node.setStyle("paddingRight", "5px");
        node.setStyle("paddingBottom", "5px");
        node.setStyle("paddingLeft", "2px");
        node.setStyle("backgroundColor", "#edeeee");
        node.setStyle("border", "1px solid #aeae9e");
        node.setStyle("zIndex", 3);
        node.setStyle("whiteSpace", "noWrap");
        node.addClass("yui3-widget-hidden");
        tt.node = Y.one(node);
        this._tooltip = tt;
        return tt;
    },

    /**
     * @private
     */
    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
    {
        var msg = categoryItem.displayName +
        ":&nbsp;" + categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + 
        "<br/>" + valueItem.displayName + 
        ":&nbsp;" + valueItem.axis.get("labelFunction").apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]);
        return msg; 
    },

    /**
     * @private
     */
    _showTooltipChangeHandler: function(e)
    {
        if(this.get("showTooltip"))
        {
            this._addTooltip();
        }
    }
};
Y.ChartBase = ChartBase;
