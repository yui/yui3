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
        value: null
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
        value: null
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
    }
};

Y.extend(CartesianChart, Y.Widget, {
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
        this.after("dataValuesChange", Y.bind(this._dataUpdateHandler, this));
        this.after("axesChange", Y.bind(this._axesUpdateHandler, this));
        this.after("seriesCollectionChange", Y.bind(this._seriesUpdateHandler, this));
    },
   
    /**
     * @private
     */
    syncUI: function()
    {
        this._addAxes();
        this._addSeries();
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
        if(axes)
        {
            for(i in axes)
            {
                if(axes.hasOwnProperty(i))
                {
                    axis = axes[i];
                    p = axis.get("position");
                    axis.render(containers[p]);
                }
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

    _parseSeriesAxes: function(c)
    {
        var i = 0, len = c.length, s, ar;
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
            gc = document.createElement("div");
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
        
        ta.setAttribute("style", "position:relative;width:800px");
        ta.setAttribute("id", "topAxesContainer");
        la.setAttribute("style", "position:relative;height:300px");
        la.setAttribute("id", "leftAxesContainer");
        ba.setAttribute("style", "position:relative;width:800px");
        ba.setAttribute("id", "bottomAxesContainer");
        ra.setAttribute("style", "position:relative;height:300px");
        ra.setAttribute("id", "rightAxesContainer");
        gc.style.width = "100%";
        gc.style.height = "100%";
        gc.style.position = "relative";
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

    _dataUpdateHandler: function(e)
    {
    },

    _axesUpdateHandler: function(e)
    {
    },
    
    _seriesUpdateHandler: function(e)
    {
    }
});

Y.CartesianChart = CartesianChart;
