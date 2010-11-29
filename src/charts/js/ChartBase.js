/**
 * The ChartBase class is an abstract class used to create charts.
 *
 * @class ChartBase
 * @constructor
 */
function ChartBase() {}

ChartBase.ATTRS = {
    /**
     * Reference to the default tooltip available for the chart.
     * <p>Contains the following properties:</p>
     *  <ul>
     *      <li>node: reference to the actual dom node</li>
     *      <li>labelFunction: reference to the function used to format the tooltip's text</li>
     *      <li>showEvent: event that should trigger the tooltip</li>
     *      <li>hideEvent: event that should trigger the removal of a tooltip (can be an event or an array of events)</li>
     *      <li>styles: hash of style properties that will be applied to the tooltip node</li>
     *      <li>show: indicates whether or not to show the tooltip</li>
     *      <li>markerEventHandler: displays and hides tooltip based on marker events</li>
     *      <li>planarEventHandler: displays and hides tooltip based on planar events</li>
     *  </ul>
     * @attribute tooltip
     * @type Object
     */
    tooltip: {
        valueFn: "_getTooltip",

        setter: function(val)
        {
            return this._updateTooltip(val);
        }
    },

    /** 
     * The key value used for the chart's category axis. 
     *
     * @attribute categoryKey
     * @type String
     */
    categoryKey: {
        value: "category"
    },
        
    /**
     * Indicates the type of axis to use for the category axis.
     *
     *  <ul>
     *      <li>category</li>
     *      <li>time</li>
     *  </ul>
     *
     * @attribute categoryType
     * @type String
     */
    categoryType:{
        value:"category"
    },

    /**
     * Indicates the the type of interactions that will fire events.
     *
     *  <ul>
     *      <li>marker</li>
     *      <li>planar</li>
     *      <li>none</li>
     *  </ul>
     *
     * @attribute interactionType
     * @type String
     */
    interactionType: {
        value: "marker"
    },

    /**
     * Data used to generate the chart.
     * 
     * @attribute dataProvider
     * @type Array
     */
    dataProvider: {
        setter: function(val)
        {
            return this._setDataValues(val);
        }
    },
        
    /**
     * A collection of keys that map to the series axes. If no keys are set,
     * they will be generated automatically depending on the data structure passed into 
     * the chart.
     *
     * @attribute seriesKeys
     * @type Array
     */
    seriesKeys: {},

    /**
     * Reference to all the axes in the chart.
     *
     * @attribute axesCollection
     * @type Array
     */
    axesCollection: {},

    /**
     * Reference to graph instance.
     * 
     * @attribute graph
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
     * Returns a series instance by index or key value.
     *
     * @method getSeries
     * @param val
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
     *
     * @method getAxisByKey
     * @param {String} val Key reference used to look up the axis.
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
     *
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
        var tt = this.get("tooltip");
        //move the position = absolute logic to a class file
        this.get("boundingBox").setStyle("position", "absolute");
        this.get("contentBox").setStyle("position", "absolute");
        this._addAxes();
        this._addSeries();
        if(tt && tt.show)
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
        this.after("tooltipChange", Y.bind(this._tooltipChangeHandler, this));
        this.after("widthChange", this._sizeChanged);
        this.after("heightChange", this._sizeChanged);
        this.after("dataProviderChange", this._dataProviderChangeHandler);
        var tt = this.get("tooltip"),
            hideEvent = "mouseout",
            showEvent = "mouseover",
            cb = this.get("contentBox"),
            interactionType = this.get("interactionType"),
            i = 0,
            len;
        if(interactionType == "marker")
        {
            hideEvent = tt.hideEvent;
            showEvent = tt.showEvent;
            Y.delegate("mouseenter", Y.bind(this._markerEventDispatcher, this), cb, ".yui3-seriesmarker");
            Y.delegate("mousedown", Y.bind(this._markerEventDispatcher, this), cb, ".yui3-seriesmarker");
            Y.delegate("mouseup", Y.bind(this._markerEventDispatcher, this), cb, ".yui3-seriesmarker");
            Y.delegate("mouseleave", Y.bind(this._markerEventDispatcher, this), cb, ".yui3-seriesmarker");
            Y.delegate("click", Y.bind(this._markerEventDispatcher, this), cb, ".yui3-seriesmarker");
            Y.delegate("mousemove", Y.bind(this._positionTooltip, this), cb, ".yui3-seriesmarker");
        }
        else if(interactionType == "planar")
        {
            this._overlay.on("mousemove", Y.bind(this._planarEventDispatcher, this));
            this.on("mouseout", this.hideTooltip);
        }
        if(tt)
        {
            if(hideEvent && showEvent && hideEvent == showEvent)
            {
                this.on(interactionType + "Event:" + hideEvent, this.toggleTooltip);
            }
            else
            {
                if(showEvent)
                {
                    this.on(interactionType + "Event:" + showEvent, tt[interactionType + "EventHandler"]);
                }
                if(hideEvent)
                {
                    if(Y.Lang.isArray(hideEvent))
                    {
                        len = hideEvent.length;
                        for(; i < len; ++i)
                        {
                            this.on(interactionType + "Event:" + hideEvent[i], this.hideTooltip);
                        }
                    }
                    this.on(interactionType + "Event:" + hideEvent, this.hideTooltip);
                }
            }
        }
    },
    
    /**
     * @private
     */
    _markerEventDispatcher: function(e)
    {
        var type = e.type,
            cb = this.get("contentBox"),
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            seriesIndex = strArr[1],
            series = this.getSeries(parseInt(seriesIndex, 10)),
            index = strArr[2],
            items = this.getSeriesItems(series, index),
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
        e.halt();
        this.fire("markerEvent:" + type, {categoryItem:items.category, valueItem:items.value, node:markerNode, x:x, y:y, series:series, index:index, seriesIndex:seriesIndex});
    },

    /**
     * @private
     */
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
                if(axis instanceof Y.Axis)
                {
                    axis.set("dataProvider", dataProvider);
                }
            }
        }
    },
    
    /**
     * Event listener for toggling the tooltip. If a tooltip is visible, hide it. If not, it 
     * will create and show a tooltip based on the event object.
     * 
     * @method toggleTooltip
     */
    toggleTooltip: function(e)
    {
        var tt = this.get("tooltip");
        if(tt.visible)
        {
            this.hideTooltip();
        }
        else
        {
            tt.markerEventHandler.apply(this, [e]);
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
            tt.visible = true;
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
     * Hides the default tooltip
     */
    hideTooltip: function()
    {
        var tt = this.get("tooltip"),
            node = tt.node;
        tt.visible = false;
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
            styles = val.styles,
            props = {
                labelFunction:"labelFunction",
                showEvent:"showEvent",
                hideEvent:"hideEvent",
                markerEventHandler:"markerEventHandler",
                planarEventHandler:"planarEventHandler"
            };
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
        for(i in props)
        {
            if(val.hasOwnProperty(i))
            {
                tt[i] = val[i];
            }
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
                labelFunction: this._tooltipLabelFunction,
                show: true,
                hideEvent: "mouseout",
                showEvent: "mouseover",
                markerEventHandler: function(e)
                {
                    var tt = this.get("tooltip"),
                    msg = tt.labelFunction.apply(this, [e.categoryItem, e.valueItem, e.index, e.series, e.seriesIndex]);
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                },
                planarEventHandler: function(e)
                {
                    var items = e.items,
                        len = items.length,
                        valueItem,
                        i = 0,
                        index = e.index,
                        msg = "",
                        series,
                        axis,
                        categoryAxis = this.get("categoryAxis");
                    if(categoryAxis)
                    {
                        msg = categoryAxis.get("labelFunction").apply(this, [categoryAxis.getKeyValueAt(this.get("categoryKey"), index), categoryAxis.get("labelFormat")]);
                    }

                    for(; i < len; ++i)
                    {
                        series = items[i];
                        if(series.get("visible"))
                        {
                            valueItem = e.valueItem[i];
                            axis = valueItem.axis;
                            msg += "<br/><span>" + valueItem.displayName + " " + axis.get("labelFunction").apply(this, [axis.getKeyValueAt(valueItem.key, index), axis.get("labelFormat")]) + "</span>";
                        }
                    }
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                }
            };
        node.setAttribute("id", this.get("id") + "_tooltip");
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
    _tooltipChangeHandler: function(e)
    {
        if(this.get("tooltip"))
        {
            var tt = this.get("tooltip"),
                node = tt.node,
                show = tt.show,
                cb = this.get("contentBox");
            if(node && show)
            {
                if(!cb.containes(node))
                {
                    this._addTooltip();
                }
            }
        }
    }
};
Y.ChartBase = ChartBase;
