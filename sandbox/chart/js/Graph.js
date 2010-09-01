function Graph(config)
{
    Graph.superclass.constructor.apply(this, arguments);
}

Graph.NAME = "graph";

Graph.ATTRS = {
    seriesCollection: {
        lazyAdd: false,

        getter: function()
        {
            return this._seriesCollection;
        },

        setter: function(val)
        {
            this._parseSeriesCollection(val);
            return this._seriesCollection;
        }
    },

    parent: {
        value: null
    }
};

Y.extend(Graph, Y.Base, {
    /**
     * Hash of arrays containing series mapped to a series type.
     */
    seriesTypes: null,

    /**
     * Returns a series instance based on an index.
     */
    getSeriesByIndex: function(val)
    {
        var col = this._seriesCollection,
            series;
        if(col && col.length > val)
        {
            series = col[val];
        }
        return series;
    },

    /**
     * Returns a series instance based on a key value.
     */
    getSeriesByKey: function(val)
    {
        var obj = this._seriesDictionary,
            series;
        if(obj && obj.hasOwnProperty(val))
        {
            series = obj[val];
        }
        return series;
    },

    /**
     * Adds dispatcher to collection
     */
    addDispatcher: function(val)
    {
        if(!this._dispatchers)
        {
            this._dispatchers = [];
        }
        this._dispatchers.push(val);
    },

    /**
     * @private 
     * @description Collection of series to be displayed in the graph.
     */
    _seriesCollection: null,
    
    /**
     * @private
     */
    _seriesDictionary: null,

    /**
     * @private
     * @description Parses series instances to be displayed in the graph.
     * @param {Array} Collection of series instances or object literals containing necessary properties for creating a series instance.
     */
    _parseSeriesCollection: function(val)
    {
        if(!val)
        {
            return;
        }	
        var len = val.length,
            i = 0,
            series,
            seriesKey;
        if(!this._seriesCollection)
        {
            this._seriesCollection = [];
        }
        if(!this._seriesDictionary)
        {
            this._seriesDictionary = {};
        }
        if(!this.seriesTypes)
        {
            this.seriesTypes = [];
        }
        for(; i < len; ++i)
        {	
            series = val[i];
            if(!(series instanceof Y.CartesianSeries) && !(series instanceof Y.PieSeries))
            {
                this._createSeries(series);
                continue;
            }
            this._addSeries(series);
        }
        len = this._seriesCollection.length;
        for(i = 0; i < len; ++i)
        {
            series = this._seriesCollection[i];
            seriesKey = series.get("direction") == "horizontal" ? "yKey" : "xKey";
            this._seriesDictionary[series.get(seriesKey)] = series;
            series.render(this.get("parent"));
        }
    },

    /**
     * @private
     * @description Adds a series to the graph.
     * @param {Series}
     */
    _addSeries: function(series)
    {
        var type = series.get("type"),
            seriesCollection = this._seriesCollection,
            graphSeriesLength = seriesCollection.length,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection;	
        if(!series.get("graph")) 
        {
            series.set("graph", this);
        }
        seriesCollection.push(series);
        if(!seriesTypes.hasOwnProperty(type))
        {
            this.seriesTypes[type] = [];
        }
        typeSeriesCollection = this.seriesTypes[type];
        series.set("graphOrder", graphSeriesLength);
        series.set("order", typeSeriesCollection.length);
        typeSeriesCollection.push(series);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        this.fire("seriesAdded", series);
    },

    _createSeries: function(seriesData)
    {
        var type = seriesData.type,
            seriesCollection = this._seriesCollection,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection,
            seriesType,
            series;
            seriesData.graph = this;
        if(!seriesTypes.hasOwnProperty(type))
        {
            seriesTypes[type] = [];
        }
        typeSeriesCollection = seriesTypes[type];
        seriesData.graph = this;
        seriesData.order = typeSeriesCollection.length;
        seriesData.graphOrder = seriesCollection.length;
        seriesType = this._getSeries(seriesData.type);
        series = new seriesType(seriesData);
        this.addDispatcher(series);
        series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        typeSeriesCollection.push(series);
        seriesCollection.push(series);
    },

    /**
     * @private
     * @description Creates a series instance based on a specified type.
     * @param {String} Indicates type of series instance to be created.
     * @return {Series} Series instance created.
     */
    _getSeries: function(type)
    {
        var seriesClass;
        switch(type)
        {
            case "line" :
                seriesClass = Y.LineSeries;
            break;
            case "column" :
                seriesClass = Y.ColumnSeries;
            break;
            case "bar" :
                seriesClass = Y.BarSeries;
            break;
            case "area" : 
                seriesClass = Y.AreaSeries;
            break;
            case "candlestick" :
                seriesClass = Y.CandlestickSeries;
            break;
            case "ohlc" :
                seriesClass = Y.OHLCSeries;
            break;
            case "stackedarea" :
                seriesClass = Y.StackedAreaSeries;
            break;
            case "stackedline" :
                seriesClass = Y.StackedLineSeries;
            break;
            case "stackedcolumn" :
                seriesClass = Y.StackedColumnSeries;
            break;
            case "stackedbar" :
                seriesClass = Y.StackedBarSeries;
            break;
            case "markerseries" :
                seriesClass = Y.MarkerSeries;
            break;
            case "spline" :
                seriesClass = Y.SplineSeries;
            break;
            case "areaspline" :
                seriesClass = Y.AreaSplineSeries;
            break;
            case "stackedspline" :
                seriesClass = Y.StackedSplineSeries;
            break;
            case "stackedareaspline" :
                seriesClass = Y.StackedAreaSplineSeries;
            break;
            case "stackedmarkerseries" :
                seriesClass = Y.StackedMarkerSeries;
            break;
            case "pieseries" :
                seriesClass = Y.PieSeries;
            break;
            case "combo" :
                seriesClass = Y.ComboSeries;
            break;
            case "stackedcombo" :
                seriesClass = Y.StackedComboSeries;
            break;
            case "combospline" :
                seriesClass = Y.ComboSplineSeries;
            break;
            case "stackedcombospline" :
                seriesClass = Y.StackedComboSplineSeries;
            break;
            default:
                seriesClass = Y.CartesianSeries;
            break;
        }
        return seriesClass;
    },

    /**
     * @private
     */
    _dispatchers: null,

    /**
     * @private
     */
    _drawingCompleteHandler: function(e)
    {
        var series = e.currentTarget,
            index = Y.Array.indexOf(this._dispatchers, series);
        if(index > -1)
        {
            this._dispatchers.splice(index, 1);
        }
        if(this._dispatchers.length < 1)
        {
            this.fire("chartRendered");
        }
    }
});

Y.Graph = Graph;
