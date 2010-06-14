function GraphStack(config)
{
    GraphStack.superclass.constructor.apply(this, arguments);
}

GraphStack.NAME = "graphstack";

GraphStack.ATTRS = {
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
        getter: function()
        {
            return this._parent;
        },

        setter: function(val)
        {
            this._parent = val;
            return val;
        }
    }
};

Y.extend(GraphStack, Y.Base, {
	/**
	 * Constant used to generate unique id.
	 */
	GUID: "yuigraphstack",
    
    _parent: null,

    _seriesCollection: null,

    seriesTypes: null,

    _parseSeriesCollection: function(val)
    {
        var len = val.length,
            i = 0,
            series;
        if(!val)
        {
            return;
        }	
        if(!this._seriesCollection)
        {
            this._seriesCollection = [];
        }
        if(!this.seriesTypes)
        {
            this.seriesTypes = [];
        }
        for(; i < len; ++i)
        {	
            series = val[i];
            if(Y.Lang.isObject(series))
            {
                this._createSeries(series);
                continue;
            }
            this.addSeries(series);
        }
        len = this._seriesCollection.length;
        for(i = 0; i < len; ++i)
        {
            this._seriesCollection[i].render(this.get("parent"));
        }
    },

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
        series.graphOrder = graphSeriesLength;
        seriesCollection.push(series);
        if(!seriesTypes.hasOwnProperty(type))
        {
            this.seriesTypes[type] = [];
        }
        typeSeriesCollection = this.seriesTypes[type];
        series.set("order", typeSeriesCollection.length);
        typeSeriesCollection.push(series);
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
            seriesData.parent = this.get("parent");
        if(!seriesTypes.hasOwnProperty(type))
        {
            seriesTypes[type] = [];
        }
        typeSeriesCollection = seriesTypes[type];
        seriesData.graph = this;
        seriesData.order = typeSeriesCollection.length;
        seriesType = this._getSeries(seriesData.type);
        series = new seriesType(seriesData);
        typeSeriesCollection.push(series);
        seriesCollection.push(series);
    },

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
            default:
                seriesClass = Y.CartesianSeries;
            break;
        }
        return seriesClass;
    }

});

Y.GraphStack = GraphStack;
