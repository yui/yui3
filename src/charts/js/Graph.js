Y.Graph = Y.Base.create("graph", Y.Widget, [Y.Renderer], {
    bindUI: function()
    {
        var bb = this.get("boundingBox");
        bb.setStyle("position", "absolute");
        this.after("widthChange", this._sizeChangeHandler);
        this.after("heightChange", this._sizeChangeHandler);
        this.after("stylesChange", this._updateStyles);
    },

    /**
     * @private
     */
    syncUI: function()
    {
        if(this.get("showBackground"))
        {
            var graphic = new Y.Graphic(),
                graphicNode,
                cb = this.get("contentBox"),
                bg = this.get("styles").background,
                border = bg.border,
                weight = border.weight || 0,
                w = this.get("width"),
                h = this.get("height");
            if(w)
            {
                w += weight * 2;
                bg.width = w;
            }   
            if(h)
            {
                h += weight * 2;
                bg.height = h;
            }
            this._background = graphic.getShape(bg);
            graphic.render(cb);
            graphicNode = Y.one(graphic.node);
            graphicNode.setStyle("left", 0 - weight);
            graphicNode.setStyle("top", 0 - weight);
            graphicNode.setStyle("zIndex", -1);
        }
    },
   
    /**
     * @private
     */
    renderUI: function()
    {
        var sc = this.get("seriesCollection"),
            series,
            i = 0,
            len = sc.length,
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines");
        for(; i < len; ++i)
        {
            series = sc[i];
            if(series instanceof Y.CartesianSeries)
            {
                series.render();
            }
        }
        if(hgl && hgl instanceof Y.Gridlines)
        {
            hgl.draw();
        }
        if(vgl && vgl instanceof Y.Gridlines)
        {
            vgl.draw();
        }
    },

    /**
     * Hash of arrays containing series mapped to a series type.
     */
    seriesTypes: null,

    /**
     * Returns a series instance based on an index.
     */
    getSeriesByIndex: function(val)
    {
        var col = this.get("seriesCollection"),
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
        if(!this.get("seriesCollection"))
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
        len = this.get("seriesCollection").length;
        for(i = 0; i < len; ++i)
        {
            series = this.get("seriesCollection")[i];
            seriesKey = series.get("direction") == "horizontal" ? "yKey" : "xKey";
            this._seriesDictionary[series.get(seriesKey)] = series;
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
            seriesCollection = this.get("seriesCollection"),
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
            seriesCollection = this.get("seriesCollection"),
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
            case "pie" :
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
    _markerEventHandler: function(e)
    {
        var type = e.type,
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            series = this.getSeriesByIndex(strArr[1]),
            index = strArr[2];
        series.updateMarkerState(type, index);
    },

    /**
     * @private
     */
    _dispatchers: null,

    /**
     * @private
     */
    _updateStyles: function()
    {
        this._background.update(this.get("styles").background);
        this._sizeChangeHandler();
    },

    /**
     * @private
     */
    _sizeChangeHandler: function(e)
    {
        var hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            w = this.get("width"),
            h = this.get("height"),
            graphicNode,
            x = 0,
            y = 0,
            bg = this.get("styles").background,
            weight;
        if(bg && bg.border)
        {
            weight = bg.border.weight || 0;
        }
        if(this._background)
        {
            graphicNode = Y.one(this._background.parentNode);
            if(w && h)
            {
                if(weight)
                {
                    w += weight * 2;
                    h += weight * 2;
                    x -= weight;
                    y -= weight;
                }
                graphicNode.setStyle("width", w);
                graphicNode.setStyle("height", h);
                graphicNode.setStyle("left", x);
                graphicNode.setStyle("top", y);
                this._background.update({width:w, height:h});
            }
        }
        if(hgl && hgl instanceof Y.Gridlines)
        {
            hgl.draw();
        }
        if(vgl && vgl instanceof Y.Gridlines)
        {
            vgl.draw();
        }
        this._drawSeries();
    },

    /**
     * @private
     */
    _drawSeries: function()
    {
        if(this._drawing)
        {
            this._callLater = true;
            return;
        }
        this._callLater = false;
        this._drawing = true;
        var sc = this.get("seriesCollection"),
            i = 0,
            len = sc.length;
        for(; i < len; ++i)
        {
            sc[i].draw();
            if(!sc[i].get("xcoords") || !sc[i].get("ycoords"))
            {
                this._callLater = true;
                break;
            }
        }
        this._drawing = false;
        if(this._callLater)
        {
            this._drawSeries();
        }
    },

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
    },

    /**
     * @private
     */
    _getDefaultStyles: function()
    {
        var defs = {
            background: {
                shape: "rect",
                fill:{
                    color:"#faf9f2"
                },
                border: {
                    color:"#dad8c9",
                    weight: 1
                }
            }
        };
        return defs;
    }
}, {
    ATTRS: {
        seriesCollection: {
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
        
        showBackground: {
            value: true
        },

        seriesDictionary: {
            readOnly: true,

            getter: function()
            {
                return this._seriesDictionary;
            }
        },

        horizontalGridlines: {
            value: null,

            setter: function(val)
            {
                var gl = this.get("horizontalGridlines");
                if(gl && gl instanceof Y.Gridlines)
                {
                    gl.remove();
                }
                if(val instanceof Y.Gridlines)
                {
                    gl = val;
                    val.set("graph", this);
                    val.render();
                    return val;
                }
                else if(val && val.axis)
                {
                    gl = new Y.Gridlines({direction:"horizontal", axis:val.axis, graph:this, styles:val.styles});
                    gl.render();
                    return gl;
                }
            }
        },
        
        verticalGridlines: {
            value: null,

            setter: function(val)
            {
                var gl = this.get("verticalGridlines");
                if(gl && gl instanceof Y.Gridlines)
                {
                    gl.remove();
                }
                if(val instanceof Y.Gridlines)
                {
                    gl = val;
                    val.set("graph", this);
                    val.render();
                    return val;
                }
                else if(val && val.axis)
                {
                    gl = new Y.Gridlines({x:0, y:0, direction:"vertical", axis:val.axis, graph:this, styles:val.styles});
                    gl.render();
                    return gl;
                }
            }
        }
    }
});
