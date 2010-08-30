/**
 * A basic chart application.
 */
function CartesianChart(config)
{
    CartesianChart.superclass.constructor.apply(this, arguments);
}

CartesianChart.NAME = "cartesianChart";

CartesianChart.ATTRS = {
    /**
     * Data used to generate the chart.
     */
    dataValues: {
        getter: function()
        {
            return this._dataValues;
        },

        setter: function(val)
        {
            this._setDataValues(val);
        }
    },

    /**
     * Axes to appear in the chart. 
     */
    axes: {
        getter: function()
        {
            return this._axes;
        },

        setter: function(val)
        {
            this._parseAxes(val);
        }
    },

    /**
     * Collection of series to appear on the chart.
     */
    seriesCollection: {
        getter: function()
        {
            return this._getSeriesCollection();
        },

        setter: function(val)
        {
            return this._setSeriesCollection(val);
        }
    },

    /**
     * Element that contains left axes
     */
    leftAxesContainer: {
        value: null
    },

    /**
     * Element that contains bottom axes
     */
    bottomAxesContainer: {
        value: null
    },

    /**
     * Element that contains right axes
     */
    rightAxesContainer: {
        value: null
    },

    /**
     * Element that contains top axes
     */
    topAxesContainer: {
        value: null
    },

    /**
     * Element that contains graphs
     */
    graphContainer: {
        value: null
    },

    /**
     * Reference to graph stack instance
     */
    graph: {
        value: null
    },

    /**
     * Type of chart when there is no series collection specified.
     */
    type: {
        getter: function()
        {
            if(this.get("stacked"))
            {
                return "stacked" + this._type;
            }
            return this._type;
        },

        setter: function(val)
        {
            this._type = val;
        }
    },
    
    stacked: {
        value: false
    },

    /**
     * Direction of chart when there is no series collection specified.
     */
    direction: {
        value: "horizontal"
    },

    /**
     * Indicates whether or not to show a tooltip.
     */
    showTooltip: {
        value:true
    },

    categoryKey: {
        value: "category"
    },

    showAreaFill: {
        value: false
    }
};

Y.extend(CartesianChart, Y.Widget, {
    /**
     * @private
     */
    _type: "combo",

    /**
     * @private
     */
    _dataValues: null,

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
            this._dataValues = dp;
            return;
        }
        this._dataValues = val;
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
    _getSeriesCollection: function()
    {
        if(this._seriesCollection)
        {
            return this._seriesCollection;
        }
        var axes = this.get("axes"),
            dir = this.get("direction"), 
            sc = [], 
            catAxis,
            valAxis,
            seriesKeys,
            i = 0,
            l,
            type = this.get("type"),
            key,
            catKey,
            seriesKey,
            showAreaFill = this.get("showAreaFill");
        if(dir == "vertical")
        {
            catAxis = "yAxis";
            catKey = "yKey";
            valAxis = "xAxis";
            seriesKey = "xKey";
        }
        else
        {
            catAxis = "xAxis";
            catKey = "xKey";
            valAxis = "yAxis";
            seriesKey = "yKey";
        }
        if(axes)
        {
            seriesKeys = axes.values.get("axis").get("keyCollection");
            key = axes.category.get("axis").get("keyCollection")[0];
            l = seriesKeys.length;
            for(; i < l; ++i)
            {
                sc[i] = {type:type};
                sc[i][catAxis] = "category";
                sc[i][valAxis] = "values";
                sc[i][catKey] = key;
                sc[i][seriesKey] = seriesKeys[i];
                if(type == "combo" || type == "stackedcombo")
                {
                    sc[i].showAreaFill = showAreaFill;
                }
            }
        }
        this._seriesCollection = sc;
        return sc;
    },

    /**
     * @private
     */
    _getDataClass: function(t)
    {
        return this._dataClass[t];
    },

    /**
     * @private
     */
    _dataClass: {
        stacked: Y.StackedAxis,
        numeric: Y.NumericAxis,
        category: Y.CategoryAxis,
        time: Y.TimeAxis
    },

    /**
     * @private
     */
    _parseAxes: function(hash)
    {
        if(!this._axes)
        {
            this._axes = {};
        }
        if(!this._dataAxes)
        {
            this._dataAxes = {};
        }
        var i, pos, axis, dataAxis, dh, config, dataClass;

        for(i in hash)
        {
            if(hash.hasOwnProperty(i))
            {
                dh = hash[i];
                pos = dh.position;
                dataClass = this._getDataClass(dh.type);
                config = {dataProvider:this.get("dataValues"), keys:dh.keys};
                if(dh.hasOwnProperty("roundingUnit"))
                {
                    config.roundingUnit = dh.roundingUnit;
                }
                dataAxis = new dataClass(config);
                if(pos && pos != "none")
                {
                    axis = new Y.AxisRenderer({axis:dataAxis, position:dh.position, styles:dh.styles});
                    this._axes[i] = axis;
                }
                this._dataAxes[i] = dataAxis;
            }
        }
    },

    /**
     * @private
     */
    _dataAxes: null,

    /**
     * @private
     */
    _axes: null,

    /**
     * @private
     */
    renderUI: function()
    {
        this._createLayout();
    },
    
    /**
     * @private
     */
    bindUI: function()
    {
        this.after("showTooltipChange", Y.bind(this._showTooltipChangeHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._addAxes();
        this._addSeries();
        if(!this.tooltip && this.get("showTooltip"))
        {
            this._addTooltip();
        }
    },
    
    /**
     * @private
     */
    _addAxes: function()
    {
        var axes = this.get("axes"),
            containers = {
                left:this.get("leftAxesContainer"),
                bottom:this.get("bottomAxesContainer"),
                right:this.get("rightAxesContainer"),
                top:this.get("topAxesContainer")
            }, i, axis, p;
        if(!axes)
        {
            this.set("axes", this._getDefaultAxes());
            axes = this.get("axes");
        }
        for(i in axes)
        {
            if(axes.hasOwnProperty(i))
            {
                axis = axes[i];
                p = axis.get("position");
                axis.render(containers[p]);
            }
        }
    },

    /**
     * @private
     */
    _addSeries: function()
    {
        var seriesCollection = this.get("seriesCollection");
        this._parseSeriesAxes(seriesCollection);
        this.set("graph", new Y.Graph({parent:this.get("graphContainer"), seriesCollection:seriesCollection}));
    },

    /**
     * @private
     */
    _parseSeriesAxes: function(c)
    {
        var i = 0, 
            len = c.length, 
            s;
        for(; i < len; ++i)
        {
            s = c[i];
            s.xAxis = this._dataAxes[s.xAxis];
            s.yAxis = this._dataAxes[s.yAxis];
        }
    },

    /**
     * @private
     * @description Creates the layout container for the chart.
     */
    _createLayout: function()
    {
        var cb = this.get("contentBox"),
            tbl = document.createElement("table"),
            tr = document.createElement("tr"),
            mr = document.createElement("tr"),
            br = document.createElement("tr"),
            tlc = document.createElement("td"),
            tcc = document.createElement("td"),
            trc = document.createElement("td"),
            mlc = document.createElement("td"),
            mcc = document.createElement("td"),
            mrc = document.createElement("td"),
            blc = document.createElement("td"),
            bcc = document.createElement("td"),
            brc = document.createElement("td"),
            la = document.createElement("div"),
            ba = document.createElement("div"),
            ra = document.createElement("div"),
            ta = document.createElement("div"),
            gc = document.createElement("div"),
            tblstyles = "vertical-align:top;border:0px;margin:0px;padding:0px;border-spacing:0px";
        tbl.setAttribute("style", tblstyles);
        tr.setAttribute("style", tblstyles);
        mr.setAttribute("style", tblstyles);
        br.setAttribute("style", tblstyles);
        tlc.setAttribute("style", tblstyles);
        tcc.setAttribute("style", tblstyles);
        trc.setAttribute("style", tblstyles);
        mlc.setAttribute("style", tblstyles);
        mcc.setAttribute("style", tblstyles);
        mrc.setAttribute("style", tblstyles);
        blc.setAttribute("style", tblstyles);
        bcc.setAttribute("style", tblstyles);
        brc.setAttribute("style", tblstyles);


        tr.id = "topRow";
        mr.id = "midRow";
        br.id = "bottomRow";
        cb.appendChild(tbl);
        tbl.appendChild(tr);
        tr.appendChild(tlc);
        tr.appendChild(tcc);
        tr.appendChild(trc);
        tbl.appendChild(mr);
        mr.appendChild(mlc);
        mr.appendChild(mcc);
        mr.appendChild(mrc);
        tbl.appendChild(br);
        br.appendChild(blc);
        br.appendChild(bcc);
        br.appendChild(brc);
        
        
        ta.setAttribute("style", "position:relative;width:800px;");
        ta.setAttribute("id", "topAxesContainer");
        la.setAttribute("style", "position:relative;height:300px;");
        la.setAttribute("id", "leftAxesContainer");
        ba.setAttribute("style", "position:relative;width:800px;");
        ba.setAttribute("id", "bottomAxesContainer");
        ra.setAttribute("style", "position:relative;height:300px;");
        ra.setAttribute("id", "rightAxesContainer");
        gc.setAttribute("style", "position:relative;width:100%;height:100%;");
        tcc.appendChild(ta);
        mlc.appendChild(la);
        bcc.appendChild(ba);
        mrc.appendChild(ra);
        mcc.appendChild(gc);

        this.set("leftAxesContainer", la);
        this.set("bottomAxesContainer", ba);
        this.set("rightAxesContainer", ra);
        this.set("topAxesContainer", ta);
        this.set("graphContainer", gc);
    },

    /**
     * @private
     */
    _getDefaultAxes: function()
    {
        var catKey = this.get("categoryKey"),
            seriesKeys = [], 
            i, 
            dv = this.get("dataValues")[0],
            seriesAxis = this.get("stacked") ? "stacked" : "numeric";
        for(i in dv)
        {
            if(i != catKey)
            {
                seriesKeys.push(i);
            }
        }
        return {
            values:{
                keys:seriesKeys,
                position:"left",
                type:seriesAxis
            },
            category:{
                keys:[catKey],
                position:"bottom",
                type:"category"
            }
        };
    },

    /**
     * Reference to the tooltip
     */
    tooltip: null,

    /**
     * @private
     */
    _addTooltip: function(e)
    {
        if(!Y.Tooltip)
        {
            return;
        }
        var tt = new Y.Tooltip({
            triggerNodes:".yui3-seriesmarker",
            delegate: "#" + this._parentNode.get("id"),
            shim:false,
            zIndex:2
        });
        
        tt.render();
        
        tt.on("triggerEnter", function(e) {
            var node = e.node,
            marker = Y.Widget.getByNode(node),
            index = marker.get("index"),
            series = marker.get("series"),
            xKey = series.get("xKey"),
            yKey = series.get("yKey"),
            msg = series.get("xDisplayName") + 
            ": " + series.get("xAxis").getKeyValueAt(xKey, index) + 
            "<br/>" + series.get("yDisplayName") + 
            ": " + series.get("yAxis").getKeyValueAt(yKey, index);
            if (node) {
                this.setTriggerContent(msg);
            }
        });
        this.tooltip = tt;
    },

    /**
     * @private
     */
    _showTooltipChangeHandler: function(e)
    {
        if(this.get("showTooltip") && this.get("rendered"))
        {
            this._addTooltip();
        }
    }
});

Y.CartesianChart = CartesianChart;
