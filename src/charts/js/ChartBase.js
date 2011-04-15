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
     *  <dl>
     *      <dt>node</dt><dd>Reference to the actual dom node</dd>
     *      <dt>showEvent</dt><dd>Event that should trigger the tooltip</dd>
     *      <dt>hideEvent</dt><dd>Event that should trigger the removal of a tooltip (can be an event or an array of events)</dd>
     *      <dt>styles</dt><dd>A hash of style properties that will be applied to the tooltip node</dd>
     *      <dt>show</dt><dd>Indicates whether or not to show the tooltip</dd>
     *      <dt>markerEventHandler</dt><dd>Displays and hides tooltip based on marker events</dd>
     *      <dt>planarEventHandler</dt><dd>Displays and hides tooltip based on planar events</dd>
     *      <dt>markerLabelFunction</dt><dd>Reference to the function used to format a marker event triggered tooltip's text</dd>
     *      <dt>planarLabelFunction</dt><dd>Reference to the function used to format a planar event triggered tooltip's text</dd>
     *  </dl>
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
     * @default category
     */
    categoryKey: {
        value: "category"
    },
        
    /**
     * Indicates the type of axis to use for the category axis.
     *
     *  <dl>
     *      <dt>category</dt><dd>Specifies a <code>CategoryAxis</code>.</dd>
     *      <dt>time</dt><dd>Specifies a <code>TimeAxis</dd>
     *  </dl>
     *
     * @attribute categoryType
     * @type String
     * @default category
     */
    categoryType:{
        value:"category"
    },

    /**
     * Indicates the the type of interactions that will fire events.
     *
     *  <dl>
     *      <dt>marker</dt><dd>Events will be broadcasted when the mouse interacts with individual markers.</dd>
     *      <dt>planar</dt><dd>Events will be broadcasted when the mouse intersects the plane of any markers on the chart.</dd>
     *      <dt>none</dt><dd>No events will be broadcasted.</dd>
     *  </dl>
     *
     * @attribute interactionType
     * @type String
     * @default marker
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
     * @return CartesianSeries
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
     * Returns an <code>Axis</code> instance by key reference. If the axis was explicitly set through the <code>axes</code> attribute,
     * the key will be the same as the key used in the <code>axes</code> object. For default axes, the key for
     * the category axis is the value of the <code>categoryKey</code> (<code>category</code>). For the value axis, the default 
     * key is <code>values</code>.
     *
     * @method getAxisByKey
     * @param {String} val Key reference used to look up the axis.
     * @return Axis
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
     * @return Axis
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
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>marker</code> and a series marker has received a mouseover event.
         * 
         *
         * @event markerEvent:mouseover
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category <code>Axis</code>.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value <code>Axis</code>.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The <code>order</code> of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>marker</code> and a series marker has received a mouseout event.
         *
         * @event markerEvent:mouseout
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category <code>Axis</code>.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value <code>Axis</code>.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The <code>order</code> of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>marker</code> and a series marker has received a mousedown event.
         *
         * @event markerEvent:mousedown
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category <code>Axis</code>.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value <code>Axis</code>.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The <code>order</code> of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>marker</code> and a series marker has received a mouseup event.
         *
         * @event markerEvent:mouseup
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category <code>Axis</code>.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value <code>Axis</code>.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The <code>order</code> of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when <code>interactionType</code> is set to <code>marker</code> and a series marker has received a click event.
         *
         * @event markerEvent:click
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category <code>Axis</code>.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value <code>Axis</code>.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The <code>order</code> of the marker's series.</dd>
         *  </dl>
         */
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
        var tt = this.get("tooltip"),
            id = this.get("id") + "_tooltip",
            cb = this.get("contentBox"),
            oldNode = document.getElementById(id);
        if(oldNode)
        {
            cb.removeChild(oldNode);
        }
        tt.node.setAttribute("id", id);
        tt.node.addClass("yui3-widget-hidden");
        cb.appendChild(tt.node);
    },

    /**
     * @private
     */
    _updateTooltip: function(val)
    {
        var tt = this._tooltip,
            i,
            styles,
            node,
            props = {
                markerLabelFunction:"markerLabelFunction",
                planarLabelFunction:"planarLabelFunction",
                showEvent:"showEvent",
                hideEvent:"hideEvent",
                markerEventHandler:"markerEventHandler",
                planarEventHandler:"planarEventHandler",
                show:"show"
            };
        if(Y.Lang.isObject(val))
        {
            styles = val.styles;
            node = Y.one(val.node) || tt.node;
            if(styles)
            {
                for(i in styles)
                {
                    if(styles.hasOwnProperty(i))
                    {
                        node.setStyle(i, styles[i]);
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
            tt.node = node;
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
                markerLabelFunction: this._tooltipLabelFunction,
                planarLabelFunction: this._planarLabelFunction,
                show: true,
                hideEvent: "mouseout",
                showEvent: "mouseover",
                markerEventHandler: function(e)
                {
                    var tt = this.get("tooltip"),
                    msg = tt.markerLabelFunction.apply(this, [e.categoryItem, e.valueItem, e.index, e.series, e.seriesIndex]);
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                },
                planarEventHandler: function(e)
                {
                    var tt = this.get("tooltip"),
                        msg ,
                        categoryAxis = this.get("categoryAxis");
                    msg = tt.planarLabelFunction.apply(this, [categoryAxis, e.valueItem, e.index, e.items, e.seriesIndex]);
                    this._showTooltip(msg, e.x + 10, e.y + 10);
                }
            };
        node.setAttribute("id", this.get("id") + "_tooltip");
        node = Y.one(node);
        node.setStyle("fontSize", "85%");
        node.setStyle("opacity", "0.83");
        node.setStyle("position", "absolute");
        node.setStyle("paddingTop", "2px");
        node.setStyle("paddingRight", "5px");
        node.setStyle("paddingBottom", "4px");
        node.setStyle("paddingLeft", "2px");
        node.setStyle("backgroundColor", "#fff");
        node.setStyle("border", "1px solid #dbdccc");
        node.setStyle("pointerEvents", "none");
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
    _planarLabelFunction: function(categoryAxis, valueItems, index, seriesArray, seriesIndex)
    {
        var msg = "",
            valueItem,
            i = 0,
            len = seriesArray.length,
            axis,
            series;
        if(categoryAxis)
        {
            msg += categoryAxis.get("labelFunction").apply(this, [categoryAxis.getKeyValueAt(this.get("categoryKey"), index), categoryAxis.get("labelFormat")]);
        }

        for(; i < len; ++i)
        {
            series = seriesArray[i];
            if(series.get("visible"))
            {
                valueItem = valueItems[i];
                axis = valueItem.axis;
                msg += "<br/><span>" + valueItem.displayName + ": " + axis.get("labelFunction").apply(this, [axis.getKeyValueAt(valueItem.key, index), axis.get("labelFormat")]) + "</span>";
            }
        }
        return msg;
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
                if(!cb.contains(node))
                {
                    this._addTooltip();
                }
            }
        }
    }
};
Y.ChartBase = ChartBase;
