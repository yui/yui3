if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/charts-base/charts-base.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/charts-base/charts-base.js",
    code: []
};
_yuitest_coverage["build/charts-base/charts-base.js"].code=["YUI.add('charts-base', function (Y, NAME) {","","/**"," * Provides functionality for creating charts."," *"," * @module charts"," * @submodule charts-base"," */","var CONFIG = Y.config,","    WINDOW = CONFIG.win,","    DOCUMENT = CONFIG.doc,","    Y_Lang = Y.Lang,","    IS_STRING = Y_Lang.isString,","    Y_DOM = Y.DOM,","    _getClassName = Y.ClassNameManager.getClassName,","    SERIES_MARKER = _getClassName(\"seriesmarker\");","","/**"," * Gridlines draws gridlines on a Graph."," *"," * @class Gridlines"," * @constructor"," * @extends Base"," * @uses Renderer"," * @param {Object} config (optional) Configuration parameters."," * @submodule charts-base"," */","Y.Gridlines = Y.Base.create(\"gridlines\", Y.Base, [Y.Renderer], {","    /**","     * Reference to the `Path` element used for drawing Gridlines.","     *","     * @property _path","     * @type Path","     * @private","     */","    _path: null,","","    /**","     * Removes the Gridlines.","     *","     * @method remove","     * @private","     */","    remove: function()","    {","        var path = this._path;","        if(path)","        {","            path.destroy();","        }","    },","","    /**","     * Draws the gridlines","     *","     * @method draw","     * @protected","     */","    draw: function()","    {","        if(this.get(\"axis\") && this.get(\"graph\"))","        {","            this._drawGridlines();","        }","    },","","    /**","     * Algorithm for drawing gridlines","     *","     * @method _drawGridlines","     * @private","     */","    _drawGridlines: function()","    {","        var path,","            axis = this.get(\"axis\"),","            axisPosition = axis.get(\"position\"),","            points,","            i = 0,","            l,","            direction = this.get(\"direction\"),","            graph = this.get(\"graph\"),","            w = graph.get(\"width\"),","            h = graph.get(\"height\"),","            line = this.get(\"styles\").line,","            color = line.color,","            weight = line.weight,","            alpha = line.alpha,","            count = this.get(\"count\"),","            lineFunction = direction == \"vertical\" ? this._verticalLine : this._horizontalLine;","        if(isFinite(w) && isFinite(h) && w > 0 && h > 0)","        {","            if(count && Y.Lang.isNumber(count))","            {","                points = this._getPoints(count, w, h);","            }","            else if(axisPosition != \"none\" && axis && axis.get(\"tickPoints\"))","            {","                points = axis.get(\"tickPoints\");","            }","            else","            {","                points = this._getPoints(axis.get(\"styles\").majorUnit.count, w, h);","            }","            l = points.length;","            path = graph.get(\"gridlines\");","            path.set(\"width\", w);","            path.set(\"height\", h);","            path.set(\"stroke\", {","                weight: weight,","                color: color,","                opacity: alpha","            });","            for(i = 0; i < l; i = i + 1)","            {","                lineFunction(path, points[i], w, h);","            }","            path.end();","        }","    },","","    /**","     * Calculates the coordinates for the gridlines based on a count.","     *","     * @method _getPoints","     * @param {Number} count Number of gridlines","     * @return Array","     * @private","     */","    _getPoints: function(count, w, h)","    {","        var i,","            points = [],","            multiplier,","            divisor = count - 1;","        for(i = 0; i < count; i = i + 1)","        {","            multiplier = i/divisor;","            points[i] = {","                x: w * multiplier,","                y: h * multiplier","            };","        }","        return points;","    },","","    /**","     * Algorithm for horizontal lines.","     *","     * @method _horizontalLine","     * @param {Path} path Reference to path element","     * @param {Object} pt Coordinates corresponding to a major unit of an axis.","     * @param {Number} w Width of the Graph","     * @param {Number} h Height of the Graph","     * @private","     */","    _horizontalLine: function(path, pt, w, h)","    {","        path.moveTo(0, pt.y);","        path.lineTo(w, pt.y);","    },","","    /**","     * Algorithm for vertical lines.","     *","     * @method _verticalLine","     * @param {Path} path Reference to path element","     * @param {Object} pt Coordinates corresponding to a major unit of an axis.","     * @param {Number} w Width of the Graph","     * @param {Number} h Height of the Graph","     * @private","     */","    _verticalLine: function(path, pt, w, h)","    {","        path.moveTo(pt.x, 0);","        path.lineTo(pt.x, h);","    },","","    /**","     * Gets the default value for the `styles` attribute. Overrides","     * base implementation.","     *","     * @method _getDefaultStyles","     * @return Object","     * @protected","     */","    _getDefaultStyles: function()","    {","        var defs = {","            line: {","                color:\"#f0efe9\",","                weight: 1,","                alpha: 1","            }","        };","        return defs;","    }","","},","{","    ATTRS: {","        /**","         * Indicates the direction of the gridline.","         *","         * @attribute direction","         * @type String","         */","        direction: {},","","        /**","         * Indicate the `Axis` in which to bind","         * the gridlines.","         *","         * @attribute axis","         * @type Axis","         */","        axis: {},","","        /**","         * Indicates the `Graph` in which the gridlines","         * are drawn.","         *","         * @attribute graph","         * @type Graph","         */","        graph: {},","","        /**","         * Indicates the number of gridlines to display. If no value is set, gridlines will equal the number of ticks in","         * the corresponding axis.","         *","         * @attribute count","         * @type Number","         */","        count: {}","    }","});","/**"," * Graph manages and contains series instances for a `CartesianChart`"," * instance."," *"," * @class Graph"," * @constructor"," * @extends Widget"," * @uses Renderer"," * @submodule charts-base"," */","Y.Graph = Y.Base.create(\"graph\", Y.Widget, [Y.Renderer], {","    /**","     * @method bindUI","     * @private","     */","    bindUI: function()","    {","        var bb = this.get(\"boundingBox\");","        bb.setStyle(\"position\", \"absolute\");","        this.after(\"widthChange\", this._sizeChangeHandler);","        this.after(\"heightChange\", this._sizeChangeHandler);","        this.after(\"stylesChange\", this._updateStyles);","        this.after(\"groupMarkersChange\", this._drawSeries);","    },","","    /**","     * @method syncUI","     * @private","     */","    syncUI: function()","    {","        var background,","            cb,","            bg,","            sc = this.get(\"seriesCollection\"),","            series,","            i = 0,","            len = sc ? sc.length : 0,","            hgl = this.get(\"horizontalGridlines\"),","            vgl = this.get(\"verticalGridlines\");","        if(this.get(\"showBackground\"))","        {","            background = this.get(\"background\");","            cb = this.get(\"contentBox\");","            bg = this.get(\"styles\").background;","            bg.stroke = bg.border;","            bg.stroke.opacity = bg.stroke.alpha;","            bg.fill.opacity = bg.fill.alpha;","            bg.width = this.get(\"width\");","            bg.height = this.get(\"height\");","            bg.type = bg.shape;","            background.set(bg);","        }","        for(; i < len; ++i)","        {","            series = sc[i];","            if(series instanceof Y.CartesianSeries)","            {","                series.render();","            }","        }","        if(hgl && hgl instanceof Y.Gridlines)","        {","            hgl.draw();","        }","        if(vgl && vgl instanceof Y.Gridlines)","        {","            vgl.draw();","        }","    },","","    /**","     * Object of arrays containing series mapped to a series type.","     *","     * @property seriesTypes","     * @type Object","     * @private","     */","    seriesTypes: null,","","    /**","     * Returns a series instance based on an index.","     *","     * @method getSeriesByIndex","     * @param {Number} val index of the series","     * @return CartesianSeries","     */","    getSeriesByIndex: function(val)","    {","        var col = this.get(\"seriesCollection\"),","            series;","        if(col && col.length > val)","        {","            series = col[val];","        }","        return series;","    },","","    /**","     * Returns a series instance based on a key value.","     *","     * @method getSeriesByKey","     * @param {String} val key value of the series","     * @return CartesianSeries","     */","    getSeriesByKey: function(val)","    {","        var obj = this._seriesDictionary,","            series;","        if(obj && obj.hasOwnProperty(val))","        {","            series = obj[val];","        }","        return series;","    },","","    /**","     * Adds dispatcher to a `_dispatcher` used to","     * to ensure all series have redrawn before for firing event.","     *","     * @method addDispatcher","     * @param {CartesianSeries} val series instance to add","     * @protected","     */","    addDispatcher: function(val)","    {","        if(!this._dispatchers)","        {","            this._dispatchers = [];","        }","        this._dispatchers.push(val);","    },","","    /**","     * Collection of series to be displayed in the graph.","     *","     * @property _seriesCollection","     * @type Array","     * @private","     */","    _seriesCollection: null,","","    /**","     * Object containing key value pairs of `CartesianSeries` instances.","     *","     * @property _seriesDictionary","     * @type Object","     * @private","     */","    _seriesDictionary: null,","","    /**","     * Parses series instances to be displayed in the graph.","     *","     * @method _parseSeriesCollection","     * @param {Array} Collection of `CartesianSeries` instances or objects container `CartesianSeries` attributes values.","     * @private","     */","    _parseSeriesCollection: function(val)","    {","        if(!val)","        {","            return;","        }","        var len = val.length,","            i = 0,","            series,","            seriesKey;","        this._seriesCollection = [];","        this._seriesDictionary = {};","        this.seriesTypes = [];","        for(; i < len; ++i)","        {","            series = val[i];","            if(!(series instanceof Y.CartesianSeries) && !(series instanceof Y.PieSeries))","            {","                this._createSeries(series);","                continue;","            }","            this._addSeries(series);","        }","        len = this._seriesCollection.length;","        for(i = 0; i < len; ++i)","        {","            series = this.get(\"seriesCollection\")[i];","            seriesKey = series.get(\"direction\") == \"horizontal\" ? \"yKey\" : \"xKey\";","            this._seriesDictionary[series.get(seriesKey)] = series;","        }","    },","","    /**","     * Adds a series to the graph.","     *","     * @method _addSeries","     * @param {CartesianSeries} series Series to add to the graph.","     * @private","     */","    _addSeries: function(series)","    {","        var type = series.get(\"type\"),","            seriesCollection = this.get(\"seriesCollection\"),","            graphSeriesLength = seriesCollection.length,","            seriesTypes = this.seriesTypes,","            typeSeriesCollection;","        if(!series.get(\"graph\"))","        {","            series.set(\"graph\", this);","        }","        seriesCollection.push(series);","        if(!seriesTypes.hasOwnProperty(type))","        {","            this.seriesTypes[type] = [];","        }","        typeSeriesCollection = this.seriesTypes[type];","        series.set(\"graphOrder\", graphSeriesLength);","        series.set(\"order\", typeSeriesCollection.length);","        typeSeriesCollection.push(series);","        series.set(\"seriesTypeCollection\", typeSeriesCollection);","        this.addDispatcher(series);","        series.after(\"drawingComplete\", Y.bind(this._drawingCompleteHandler, this));","        this.fire(\"seriesAdded\", series);","    },","","    /**","     * Creates a `CartesianSeries` instance from an object containing attribute key value pairs. The key value pairs include","     * attributes for the specific series and a type value which defines the type of series to be used.","     *","     * @method createSeries","     * @param {Object} seriesData Series attribute key value pairs.","     * @private","     */","    _createSeries: function(seriesData)","    {","        var type = seriesData.type,","            seriesCollection = this.get(\"seriesCollection\"),","            seriesTypes = this.seriesTypes,","            typeSeriesCollection,","            seriesType,","            series;","            seriesData.graph = this;","        if(!seriesTypes.hasOwnProperty(type))","        {","            seriesTypes[type] = [];","        }","        typeSeriesCollection = seriesTypes[type];","        seriesData.graph = this;","        seriesData.order = typeSeriesCollection.length;","        seriesData.graphOrder = seriesCollection.length;","        seriesType = this._getSeries(seriesData.type);","        series = new seriesType(seriesData);","        this.addDispatcher(series);","        series.after(\"drawingComplete\", Y.bind(this._drawingCompleteHandler, this));","        typeSeriesCollection.push(series);","        seriesCollection.push(series);","        series.set(\"seriesTypeCollection\", typeSeriesCollection);","        if(this.get(\"rendered\"))","        {","            series.render();","        }","    },","","    /**","     * String reference for pre-defined `Series` classes.","     *","     * @property _seriesMap","     * @type Object","     * @private","     */","    _seriesMap: {","        line : Y.LineSeries,","        column : Y.ColumnSeries,","        bar : Y.BarSeries,","        area :  Y.AreaSeries,","        candlestick : Y.CandlestickSeries,","        ohlc : Y.OHLCSeries,","        stackedarea : Y.StackedAreaSeries,","        stackedline : Y.StackedLineSeries,","        stackedcolumn : Y.StackedColumnSeries,","        stackedbar : Y.StackedBarSeries,","        markerseries : Y.MarkerSeries,","        spline : Y.SplineSeries,","        areaspline : Y.AreaSplineSeries,","        stackedspline : Y.StackedSplineSeries,","        stackedareaspline : Y.StackedAreaSplineSeries,","        stackedmarkerseries : Y.StackedMarkerSeries,","        pie : Y.PieSeries,","        combo : Y.ComboSeries,","        stackedcombo : Y.StackedComboSeries,","        combospline : Y.ComboSplineSeries,","        stackedcombospline : Y.StackedComboSplineSeries","    },","","    /**","     * Returns a specific `CartesianSeries` class based on key value from a look up table of a direct reference to a","     * class. When specifying a key value, the following options are available:","     *","     *  <table>","     *      <tr><th>Key Value</th><th>Class</th></tr>","     *      <tr><td>line</td><td>Y.LineSeries</td></tr>","     *      <tr><td>column</td><td>Y.ColumnSeries</td></tr>","     *      <tr><td>bar</td><td>Y.BarSeries</td></tr>","     *      <tr><td>area</td><td>Y.AreaSeries</td></tr>","     *      <tr><td>stackedarea</td><td>Y.StackedAreaSeries</td></tr>","     *      <tr><td>stackedline</td><td>Y.StackedLineSeries</td></tr>","     *      <tr><td>stackedcolumn</td><td>Y.StackedColumnSeries</td></tr>","     *      <tr><td>stackedbar</td><td>Y.StackedBarSeries</td></tr>","     *      <tr><td>markerseries</td><td>Y.MarkerSeries</td></tr>","     *      <tr><td>spline</td><td>Y.SplineSeries</td></tr>","     *      <tr><td>areaspline</td><td>Y.AreaSplineSeries</td></tr>","     *      <tr><td>stackedspline</td><td>Y.StackedSplineSeries</td></tr>","     *      <tr><td>stackedareaspline</td><td>Y.StackedAreaSplineSeries</td></tr>","     *      <tr><td>stackedmarkerseries</td><td>Y.StackedMarkerSeries</td></tr>","     *      <tr><td>pie</td><td>Y.PieSeries</td></tr>","     *      <tr><td>combo</td><td>Y.ComboSeries</td></tr>","     *      <tr><td>stackedcombo</td><td>Y.StackedComboSeries</td></tr>","     *      <tr><td>combospline</td><td>Y.ComboSplineSeries</td></tr>","     *      <tr><td>stackedcombospline</td><td>Y.StackedComboSplineSeries</td></tr>","     *  </table>","     *","     * When referencing a class directly, you can specify any of the above classes or any custom class that extends","     * `CartesianSeries` or `PieSeries`.","     *","     * @method _getSeries","     * @param {String | Object} type Series type.","     * @return CartesianSeries","     * @private","     */","    _getSeries: function(type)","    {","        var seriesClass;","        if(Y_Lang.isString(type))","        {","            seriesClass = this._seriesMap[type];","        }","        else","        {","            seriesClass = type;","        }","        return seriesClass;","    },","","    /**","     * Event handler for marker events.","     *","     * @method _markerEventHandler","     * @param {Object} e Event object.","     * @private","     */","    _markerEventHandler: function(e)","    {","        var type = e.type,","            markerNode = e.currentTarget,","            strArr = markerNode.getAttribute(\"id\").split(\"_\"),","            series = this.getSeriesByIndex(strArr[1]),","            index = strArr[2];","        series.updateMarkerState(type, index);","    },","","    /**","     * Collection of `CartesianSeries` instances to be redrawn.","     *","     * @property _dispatchers","     * @type Array","     * @private","     */","    _dispatchers: null,","","    /**","     * Updates the `Graph` styles.","     *","     * @method _updateStyles","     * @private","     */","    _updateStyles: function()","    {","        var styles = this.get(\"styles\").background,","            border = styles.border;","            border.opacity = border.alpha;","            styles.stroke = border;","            styles.fill.opacity = styles.fill.alpha;","        this.get(\"background\").set(styles);","        this._sizeChangeHandler();","    },","","    /**","     * Event handler for size changes.","     *","     * @method _sizeChangeHandler","     * @param {Object} e Event object.","     * @private","     */","    _sizeChangeHandler: function(e)","    {","        var hgl = this.get(\"horizontalGridlines\"),","            vgl = this.get(\"verticalGridlines\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            bg = this.get(\"styles\").background,","            weight,","            background;","        if(bg && bg.border)","        {","            weight = bg.border.weight || 0;","        }","        if(this.get(\"showBackground\"))","        {","            background = this.get(\"background\");","            if(w && h)","            {","                background.set(\"width\", w);","                background.set(\"height\", h);","            }","        }","        if(this._gridlines)","        {","            this._gridlines.clear();","        }","        if(hgl && hgl instanceof Y.Gridlines)","        {","            hgl.draw();","        }","        if(vgl && vgl instanceof Y.Gridlines)","        {","            vgl.draw();","        }","        this._drawSeries();","    },","","    /**","     * Draws each series.","     *","     * @method _drawSeries","     * @private","     */","    _drawSeries: function()","    {","        if(this._drawing)","        {","            this._callLater = true;","            return;","        }","        var sc,","            i,","            len,","            graphic = this.get(\"graphic\");","        graphic.set(\"autoDraw\", false);","        this._callLater = false;","        this._drawing = true;","        sc = this.get(\"seriesCollection\");","        i = 0;","        len = sc ? sc.length : 0;","        for(; i < len; ++i)","        {","            sc[i].draw();","            if((!sc[i].get(\"xcoords\") || !sc[i].get(\"ycoords\")) && !sc[i] instanceof Y.PieSeries)","            {","                this._callLater = true;","                break;","            }","        }","        this._drawing = false;","        if(this._callLater)","        {","            this._drawSeries();","        }","    },","","    /**","     * Event handler for series drawingComplete event.","     *","     * @method _drawingCompleteHandler","     * @param {Object} e Event object.","     * @private","     */","    _drawingCompleteHandler: function(e)","    {","        var series = e.currentTarget,","            graphic,","            index = Y.Array.indexOf(this._dispatchers, series);","        if(index > -1)","        {","            this._dispatchers.splice(index, 1);","        }","        if(this._dispatchers.length < 1)","        {","            graphic = this.get(\"graphic\");","            if(!graphic.get(\"autoDraw\"))","            {","                graphic._redraw();","            }","            this.fire(\"chartRendered\");","        }","    },","","    /**","     * Gets the default value for the `styles` attribute. Overrides","     * base implementation.","     *","     * @method _getDefaultStyles","     * @return Object","     * @protected","     */","    _getDefaultStyles: function()","    {","        var defs = {","            background: {","                shape: \"rect\",","                fill:{","                    color:\"#faf9f2\"","                },","                border: {","                    color:\"#dad8c9\",","                    weight: 1","                }","            }","        };","        return defs;","    },","","    /**","     * Destructor implementation Graph class. Removes all Graphic instances from the widget.","     *","     * @method destructor","     * @protected","     */","    destructor: function()","    {","        if(this._graphic)","        {","            this._graphic.destroy();","            this._graphic = null;","        }","        if(this._background)","        {","            this._background.get(\"graphic\").destroy();","            this._background = null;","        }","        if(this._gridlines)","        {","            this._gridlines.get(\"graphic\").destroy();","            this._gridlines = null;","        }","    }","}, {","    ATTRS: {","        /**","         * The x-coordinate for the graph.","         *","         * @attribute x","         * @type Number","         * @protected","         */","        x: {","            setter: function(val)","            {","                this.get(\"boundingBox\").setStyle(\"left\", val + \"px\");","                return val;","            }","        },","","        /**","         * The y-coordinate for the graph.","         *","         * @attribute y","         * @type Number","         * @protected","         */","        y: {","            setter: function(val)","            {","                this.get(\"boundingBox\").setStyle(\"top\", val + \"px\");","                return val;","            }","        },","","        /**","         * Reference to the chart instance using the graph.","         *","         * @attribute chart","         * @type ChartBase","         * @readOnly","         */","        chart: {","            getter: function() {","                var chart = this._state.chart || this;","                return chart;","            }","        },","","        /**","         * Collection of series. When setting the `seriesCollection` the array can contain a combination of either","         * `CartesianSeries` instances or object literals with properties that will define a series.","         *","         * @attribute seriesCollection","         * @type CartesianSeries","         */","        seriesCollection: {","            getter: function()","            {","                return this._seriesCollection;","            },","","            setter: function(val)","            {","                this._parseSeriesCollection(val);","                return this._seriesCollection;","            }","        },","","        /**","         * Indicates whether the `Graph` has a background.","         *","         * @attribute showBackground","         * @type Boolean","         * @default true","         */","        showBackground: {","            value: true","        },","","        /**","         * Read-only hash lookup for all series on in the `Graph`.","         *","         * @attribute seriesDictionary","         * @type Object","         * @readOnly","         */","        seriesDictionary: {","            readOnly: true,","","            getter: function()","            {","                return this._seriesDictionary;","            }","        },","","        /**","         * Reference to the horizontal `Gridlines` instance.","         *","         * @attribute horizontalGridlines","         * @type Gridlines","         * @default null","         */","        horizontalGridlines: {","            value: null,","","            setter: function(val)","            {","                var cfg,","                    key,","                    gl = this.get(\"horizontalGridlines\");","                if(gl && gl instanceof Y.Gridlines)","                {","                    gl.remove();","                }","                if(val instanceof Y.Gridlines)","                {","                    gl = val;","                    val.set(\"graph\", this);","                    return val;","                }","                else if(val)","                {","                    cfg = {","                        direction: \"horizonal\",","                        graph: this","                    };","                    for(key in val)","                    {","                        if(val.hasOwnProperty(key))","                        {","                            cfg[key] = val[key];","                        }","                    }","                    gl = new Y.Gridlines(cfg);","                    return gl;","                }","            }","        },","","        /**","         * Reference to the vertical `Gridlines` instance.","         *","         * @attribute verticalGridlines","         * @type Gridlines","         * @default null","         */","        verticalGridlines: {","            value: null,","","            setter: function(val)","            {","                var cfg,","                    key,","                    gl = this.get(\"verticalGridlines\");","                if(gl && gl instanceof Y.Gridlines)","                {","                    gl.remove();","                }","                if(val instanceof Y.Gridlines)","                {","                    gl = val;","                    val.set(\"graph\", this);","                    return val;","                }","                else if(val)","                {","                    cfg = {","                        direction: \"vertical\",","                        graph: this","                    };","                    for(key in val)","                    {","                        if(val.hasOwnProperty(key))","                        {","                            cfg[key] = val[key];","                        }","                    }","                    gl = new Y.Gridlines(cfg);","                    return gl;","                }","            }","        },","","        /**","         * Reference to graphic instance used for the background.","         *","         * @attribute background","         * @type Graphic","         * @readOnly","         */","        background: {","            getter: function()","            {","                if(!this._background)","                {","                    this._backgroundGraphic = new Y.Graphic({render:this.get(\"contentBox\")});","                    this._backgroundGraphic.get(\"node\").style.zIndex = 0;","                    this._background = this._backgroundGraphic.addShape({type: \"rect\"});","                }","                return this._background;","            }","        },","","        /**","         * Reference to graphic instance used for gridlines.","         *","         * @attribute gridlines","         * @type Graphic","         * @readOnly","         */","        gridlines: {","            readOnly: true,","","            getter: function()","            {","                if(!this._gridlines)","                {","                    this._gridlinesGraphic = new Y.Graphic({render:this.get(\"contentBox\")});","                    this._gridlinesGraphic.get(\"node\").style.zIndex = 1;","                    this._gridlines = this._gridlinesGraphic.addShape({type: \"path\"});","                }","                return this._gridlines;","            }","        },","","        /**","         * Reference to graphic instance used for series.","         *","         * @attribute graphic","         * @type Graphic","         * @readOnly","         */","        graphic: {","            readOnly: true,","","            getter: function()","            {","                if(!this._graphic)","                {","                    this._graphic = new Y.Graphic({render:this.get(\"contentBox\")});","                    this._graphic.get(\"node\").style.zIndex = 2;","                    this._graphic.set(\"autoDraw\", false);","                }","                return this._graphic;","            }","        },","","        /**","         * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.","         *","         * @attribute groupMarkers","         * @type Boolean","         */","        groupMarkers: {","            value: false","        }","","        /**","         * Style properties used for drawing a background. Below are the default values:","         *  <dl>","         *      <dt>background</dt><dd>An object containing the following values:","         *          <dl>","         *              <dt>fill</dt><dd>Defines the style properties for the fill. Contains the following values:","         *                  <dl>","         *                      <dt>color</dt><dd>Color of the fill. The default value is #faf9f2.</dd>","         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background fill.","         *                      The default value is 1.</dd>","         *                  </dl>","         *              </dd>","         *              <dt>border</dt><dd>Defines the style properties for the border. Contains the following values:","         *                  <dl>","         *                      <dt>color</dt><dd>Color of the border. The default value is #dad8c9.</dd>","         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background border.","         *                      The default value is 1.</dd>","         *                      <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>","         *                  </dl>","         *              </dd>","         *          </dl>","         *      </dd>","         *  </dl>","         *","         * @attribute styles","         * @type Object","         */","    }","});","/**"," * The ChartBase class is an abstract class used to create charts."," *"," * @class ChartBase"," * @constructor"," * @submodule charts-base"," */","function ChartBase() {}","","ChartBase.ATTRS = {","    /**","     * Data used to generate the chart.","     *","     * @attribute dataProvider","     * @type Array","     */","    dataProvider: {","        lazyAdd: false,","","        valueFn: function()","        {","            var defDataProvider = [];","            if(!this._seriesKeysExplicitlySet)","            {","                this._seriesKeys = this._buildSeriesKeys(defDataProvider);","            }","            return defDataProvider;","        },","","        setter: function(val)","        {","            var dataProvider = this._setDataValues(val);","            if(!this._seriesKeysExplicitlySet)","            {","                this._seriesKeys = this._buildSeriesKeys(dataProvider);","            }","            return dataProvider;","        }","    },","","    /**","     * A collection of keys that map to the series axes. If no keys are set,","     * they will be generated automatically depending on the data structure passed into","     * the chart.","     *","     * @attribute seriesKeys","     * @type Array","     */","    seriesKeys: {","        getter: function()","        {","            return this._seriesKeys;","        },","","        setter: function(val)","        {","            this._seriesKeysExplicitlySet = true;","            this._seriesKeys = val;","            return val;","        }","    },","","    /**","     * Sets the `aria-label` for the chart.","     *","     * @attribute ariaLabel","     * @type String","     */","    ariaLabel: {","        value: \"Chart Application\",","","        setter: function(val)","        {","            var cb = this.get(\"contentBox\");","            if(cb)","            {","                cb.setAttribute(\"aria-label\", val);","            }","            return val;","        }","    },","","    /**","     * Sets the aria description for the chart.","     *","     * @attribute ariaDescription","     * @type String","     */","    ariaDescription: {","        value: \"Use the up and down keys to navigate between series. Use the left and right keys to navigate through items in a series.\",","","        setter: function(val)","        {","            if(this._description)","            {","                this._description.setContent(\"\");","                this._description.appendChild(DOCUMENT.createTextNode(val));","            }","            return val;","        }","    },","","    /**","     * Reference to the default tooltip available for the chart.","     * <p>Contains the following properties:</p>","     *  <dl>","     *      <dt>node</dt><dd>Reference to the actual dom node</dd>","     *      <dt>showEvent</dt><dd>Event that should trigger the tooltip</dd>","     *      <dt>hideEvent</dt><dd>Event that should trigger the removal of a tooltip (can be an event or an array of events)</dd>","     *      <dt>styles</dt><dd>A hash of style properties that will be applied to the tooltip node</dd>","     *      <dt>show</dt><dd>Indicates whether or not to show the tooltip</dd>","     *      <dt>markerEventHandler</dt><dd>Displays and hides tooltip based on marker events</dd>","     *      <dt>planarEventHandler</dt><dd>Displays and hides tooltip based on planar events</dd>","     *      <dt>markerLabelFunction</dt><dd>Reference to the function used to format a marker event triggered tooltip's text.","     *      The method contains the following arguments:","     *  <dl>","     *      <dt>categoryItem</dt><dd>An object containing the following:","     *  <dl>","     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>","     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided).</dd>","     *      <dt>key</dt><dd>The key of the category.</dd>","     *      <dt>value</dt><dd>The value of the category.</dd>","     *  </dl>","     *  </dd>","     *  <dt>valueItem</dt><dd>An object containing the following:","     *      <dl>","     *          <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>","     *          <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>","     *          <dt>key</dt><dd>The key for the series.</dd>","     *          <dt>value</dt><dd>The value for the series item.</dd>","     *      </dl>","     *  </dd>","     *  <dt>itemIndex</dt><dd>The index of the item within the series.</dd>","     *  <dt>series</dt><dd> The `CartesianSeries` instance of the item.</dd>","     *  <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>","     *  </dl>","     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose","     *  to return an html string, you will also need to override the tooltip's `setTextFunction` method to accept an html string.","     *  </dd>","     *  <dt>planarLabelFunction</dt><dd>Reference to the function used to format a planar event triggered tooltip's text","     *  <dl>","     *      <dt>categoryAxis</dt><dd> `CategoryAxis` Reference to the categoryAxis of the chart.","     *      <dt>valueItems</dt><dd>Array of objects for each series that has a data point in the coordinate plane of the event. Each","     *      object contains the following data:","     *  <dl>","     *      <dt>axis</dt><dd>The value axis of the series.</dd>","     *      <dt>key</dt><dd>The key for the series.</dd>","     *      <dt>value</dt><dd>The value for the series item.</dd>","     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>","     *  </dl>","     *  </dd>","     *      <dt>index</dt><dd>The index of the item within its series.</dd>","     *      <dt>seriesArray</dt><dd>Array of series instances for each value item.</dd>","     *      <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>","     *  </dl>","     *  </dd>","     *  </dl>","     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose","     *  to return an html string, you will also need to override the tooltip's `setTextFunction` method to accept an html string.","     *  </dd>","     *  <dt>setTextFunction</dt><dd>Method that writes content returned from `planarLabelFunction` or `markerLabelFunction` into the","     *  the tooltip node. Has the following signature:","     *  <dl>","     *      <dt>label</dt><dd>The `HTMLElement` that the content is to be added.</dd>","     *      <dt>val</dt><dd>The content to be rendered into tooltip. This can be a `String` or `HTMLElement`. If an HTML string is used,","     *      it will be rendered as a string.</dd>","     *  </dl>","     *  </dd>","     *  </dl>","     * @attribute tooltip","     * @type Object","     */","    tooltip: {","        valueFn: \"_getTooltip\",","","        setter: function(val)","        {","            return this._updateTooltip(val);","        }","    },","","    /**","     * The key value used for the chart's category axis.","     *","     * @attribute categoryKey","     * @type String","     * @default category","     */","    categoryKey: {","        value: \"category\"","    },","","    /**","     * Indicates the type of axis to use for the category axis.","     *","     *  <dl>","     *      <dt>category</dt><dd>Specifies a `CategoryAxis`.</dd>","     *      <dt>time</dt><dd>Specifies a `TimeAxis</dd>","     *  </dl>","     *","     * @attribute categoryType","     * @type String","     * @default category","     */","    categoryType:{","        value:\"category\"","    },","","    /**","     * Indicates the the type of interactions that will fire events.","     *","     *  <dl>","     *      <dt>marker</dt><dd>Events will be broadcasted when the mouse interacts with individual markers.</dd>","     *      <dt>planar</dt><dd>Events will be broadcasted when the mouse intersects the plane of any markers on the chart.</dd>","     *      <dt>none</dt><dd>No events will be broadcasted.</dd>","     *  </dl>","     *","     * @attribute interactionType","     * @type String","     * @default marker","     */","    interactionType: {","        value: \"marker\"","    },","","    /**","     * Reference to all the axes in the chart.","     *","     * @attribute axesCollection","     * @type Array","     */","    axesCollection: {},","","    /**","     * Reference to graph instance.","     *","     * @attribute graph","     * @type Graph","     */","    graph: {","        valueFn: \"_getGraph\"","    },","","    /**","     * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.","     *","     * @attribute groupMarkers","     * @type Boolean","     */","    groupMarkers: {","        value: false","    }","};","","ChartBase.prototype = {","    /**","     * Handles groupMarkers change event.","     *","     * @method _groupMarkersChangeHandler","     * @param {Object} e Event object.","     * @private","     */","    _groupMarkersChangeHandler: function(e)","    {","        var graph = this.get(\"graph\"),","            useGroupMarkers = e.newVal;","        if(graph)","        {","            graph.set(\"groupMarkers\", useGroupMarkers);","        }","    },","","    /**","     * Handler for itemRendered event.","     *","     * @method _itemRendered","     * @param {Object} e Event object.","     * @private","     */","    _itemRendered: function(e)","    {","        this._itemRenderQueue = this._itemRenderQueue.splice(1 + Y.Array.indexOf(this._itemRenderQueue, e.currentTarget), 1);","        if(this._itemRenderQueue.length < 1)","        {","            this._redraw();","        }","    },","","    /**","     * Default value function for the `Graph` attribute.","     *","     * @method _getGraph","     * @return Graph","     * @private","     */","    _getGraph: function()","    {","        var graph = new Y.Graph({","            chart:this,","            groupMarkers: this.get(\"groupMarkers\")","        });","        graph.after(\"chartRendered\", Y.bind(function(e) {","            this.fire(\"chartRendered\");","        }, this));","        return graph;","    },","","    /**","     * Returns a series instance by index or key value.","     *","     * @method getSeries","     * @param val","     * @return CartesianSeries","     */","    getSeries: function(val)","    {","        var series = null,","            graph = this.get(\"graph\");","        if(graph)","        {","            if(Y_Lang.isNumber(val))","            {","                series = graph.getSeriesByIndex(val);","            }","            else","            {","                series = graph.getSeriesByKey(val);","            }","        }","        return series;","    },","","    /**","     * Returns an `Axis` instance by key reference. If the axis was explicitly set through the `axes` attribute,","     * the key will be the same as the key used in the `axes` object. For default axes, the key for","     * the category axis is the value of the `categoryKey` (`category`). For the value axis, the default","     * key is `values`.","     *","     * @method getAxisByKey","     * @param {String} val Key reference used to look up the axis.","     * @return Axis","     */","    getAxisByKey: function(val)","    {","        var axis,","            axes = this.get(\"axes\");","        if(axes && axes.hasOwnProperty(val))","        {","            axis = axes[val];","        }","        return axis;","    },","","    /**","     * Returns the category axis for the chart.","     *","     * @method getCategoryAxis","     * @return Axis","     */","    getCategoryAxis: function()","    {","        var axis,","            key = this.get(\"categoryKey\"),","            axes = this.get(\"axes\");","        if(axes.hasOwnProperty(key))","        {","            axis = axes[key];","        }","        return axis;","    },","","    /**","     * Default direction of the chart.","     *","     * @property _direction","     * @type String","     * @default horizontal","     * @private","     */","    _direction: \"horizontal\",","","    /**","     * Storage for the `dataProvider` attribute.","     *","     * @property _dataProvider","     * @type Array","     * @private","     */","    _dataProvider: null,","","    /**","     * Setter method for `dataProvider` attribute.","     *","     * @method _setDataValues","     * @param {Array} val Array to be set as `dataProvider`.","     * @return Array","     * @private","     */","    _setDataValues: function(val)","    {","        if(Y_Lang.isArray(val[0]))","        {","            var hash,","                dp = [],","                cats = val[0],","                i = 0,","                l = cats.length,","                n,","                sl = val.length;","            for(; i < l; ++i)","            {","                hash = {category:cats[i]};","                for(n = 1; n < sl; ++n)","                {","                    hash[\"series\" + n] = val[n][i];","                }","                dp[i] = hash;","            }","            return dp;","        }","        return val;","    },","","    /**","     * Storage for `seriesCollection` attribute.","     *","     * @property _seriesCollection","     * @type Array","     * @private","     */","    _seriesCollection: null,","","    /**","     * Setter method for `seriesCollection` attribute.","     *","     * @property _setSeriesCollection","     * @param {Array} val Array of either `CartesianSeries` instances or objects containing series attribute key value pairs.","     * @private","     */","    _setSeriesCollection: function(val)","    {","        this._seriesCollection = val;","    },","    /**","     * Helper method that returns the axis class that a key references.","     *","     * @method _getAxisClass","     * @param {String} t The type of axis.","     * @return Axis","     * @private","     */","    _getAxisClass: function(t)","    {","        return this._axisClass[t];","    },","","    /**","     * Key value pairs of axis types.","     *","     * @property _axisClass","     * @type Object","     * @private","     */","    _axisClass: {","        stacked: Y.StackedAxis,","        numeric: Y.NumericAxis,","        category: Y.CategoryAxis,","        time: Y.TimeAxis","    },","","    /**","     * Collection of axes.","     *","     * @property _axes","     * @type Array","     * @private","     */","    _axes: null,","","    /**","     * @method initializer","     * @private","     */","    initializer: function()","    {","        this._itemRenderQueue = [];","        this._seriesIndex = -1;","        this._itemIndex = -1;","        this.after(\"dataProviderChange\", this._dataProviderChangeHandler);","    },","","    /**","     * @method renderUI","     * @private","     */","    renderUI: function()","    {","        var tt = this.get(\"tooltip\"),","            bb = this.get(\"boundingBox\"),","            cb = this.get(\"contentBox\");","        //move the position = absolute logic to a class file","        bb.setStyle(\"position\", \"absolute\");","        cb.setStyle(\"position\", \"absolute\");","        this._addAxes();","        this._addSeries();","        if(tt && tt.show)","        {","            this._addTooltip();","        }","        this._setAriaElements(bb, cb);","    },","","    /**","     * Creates an aria `live-region`, `aria-label` and `aria-describedby` for the Chart.","     *","     * @method _setAriaElements","     * @param {Node} cb Reference to the Chart's `contentBox` attribute.","     * @private","     */","    _setAriaElements: function(bb, cb)","    {","        var description = this._getAriaOffscreenNode(),","            id = this.get(\"id\") + \"_description\",","            liveRegion = this._getAriaOffscreenNode();","        cb.set(\"tabIndex\", 0);","        cb.set(\"role\", \"img\");","        cb.setAttribute(\"aria-label\", this.get(\"ariaLabel\"));","        cb.setAttribute(\"aria-describedby\", id);","        description.set(\"id\", id);","        description.set(\"tabIndex\", -1);","        description.appendChild(DOCUMENT.createTextNode(this.get(\"ariaDescription\")));","        liveRegion.set(\"id\", \"live-region\");","        liveRegion.set(\"aria-live\", \"polite\");","        liveRegion.set(\"aria-atomic\", \"true\");","        liveRegion.set(\"role\", \"status\");","        bb.setAttribute(\"role\", \"application\");","        bb.appendChild(description);","        bb.appendChild(liveRegion);","        this._description = description;","        this._liveRegion = liveRegion;","    },","","    /**","     * Sets a node offscreen for use as aria-description or aria-live-regin.","     *","     * @method _setOffscreen","     * @return Node","     * @private","     */","    _getAriaOffscreenNode: function()","    {","        var node = Y.Node.create(\"<div></div>\"),","            ie = Y.UA.ie,","            clipRect = (ie && ie < 8) ? \"rect(1px 1px 1px 1px)\" : \"rect(1px, 1px, 1px, 1px)\";","        node.setStyle(\"position\", \"absolute\");","        node.setStyle(\"height\", \"1px\");","        node.setStyle(\"width\", \"1px\");","        node.setStyle(\"overflow\", \"hidden\");","        node.setStyle(\"clip\", clipRect);","        return node;","    },","","    /**","     * @method syncUI","     * @private","     */","    syncUI: function()","    {","        this._redraw();","    },","","    /**","     * @method bindUI","     * @private","     */","    bindUI: function()","    {","        this.after(\"tooltipChange\", Y.bind(this._tooltipChangeHandler, this));","        this.after(\"widthChange\", this._sizeChanged);","        this.after(\"heightChange\", this._sizeChanged);","        this.after(\"groupMarkersChange\", this._groupMarkersChangeHandler);","        var tt = this.get(\"tooltip\"),","            hideEvent = \"mouseout\",","            showEvent = \"mouseover\",","            cb = this.get(\"contentBox\"),","            interactionType = this.get(\"interactionType\"),","            i = 0,","            len,","            markerClassName = \".\" + SERIES_MARKER,","            isTouch = ((WINDOW && (\"ontouchstart\" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6));","        Y.on(\"keydown\", Y.bind(function(e) {","            var key = e.keyCode,","                numKey = parseFloat(key),","                msg;","            if(numKey > 36 && numKey < 41)","            {","                e.halt();","                msg = this._getAriaMessage(numKey);","                this._liveRegion.setContent(\"\");","                this._liveRegion.appendChild(DOCUMENT.createTextNode(msg));","            }","        }, this), this.get(\"contentBox\"));","        if(interactionType == \"marker\")","        {","            //if touch capabilities, toggle tooltip on touchend. otherwise, the tooltip attribute's hideEvent/showEvent types.","            hideEvent = tt.hideEvent;","            showEvent = tt.showEvent;","            if(isTouch)","            {","                Y.delegate(\"touchend\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                //hide active tooltip if the chart is touched","                Y.on(\"touchend\", Y.bind(function(e) {","                    //only halt the event if it originated from the chart","                    if(cb.contains(e.target))","                    {","                        e.halt(true);","                    }","                    if(this._activeMarker)","                    {","                        this._activeMarker = null;","                        this.hideTooltip(e);","                    }","                }, this));","            }","            else","            {","                Y.delegate(\"mouseenter\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                Y.delegate(\"mousedown\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                Y.delegate(\"mouseup\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                Y.delegate(\"mouseleave\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                Y.delegate(\"click\", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);","                Y.delegate(\"mousemove\", Y.bind(this._positionTooltip, this), cb, markerClassName);","            }","        }","        else if(interactionType == \"planar\")","        {","            if(isTouch)","            {","                this._overlay.on(\"touchend\", Y.bind(this._planarEventDispatcher, this));","            }","            else","            {","                this._overlay.on(\"mousemove\", Y.bind(this._planarEventDispatcher, this));","                this.on(\"mouseout\", this.hideTooltip);","            }","        }","        if(tt)","        {","            this.on(\"markerEvent:touchend\", Y.bind(function(e) {","                var marker = e.series.get(\"markers\")[e.index];","                if(this._activeMarker && marker === this._activeMarker)","                {","                    this._activeMarker = null;","                    this.hideTooltip(e);","                }","                else","                {","","                    this._activeMarker = marker;","                    tt.markerEventHandler.apply(this, [e]);","                }","            }, this));","            if(hideEvent && showEvent && hideEvent == showEvent)","            {","                this.on(interactionType + \"Event:\" + hideEvent, this.toggleTooltip);","            }","            else","            {","                if(showEvent)","                {","                    this.on(interactionType + \"Event:\" + showEvent, tt[interactionType + \"EventHandler\"]);","                }","                if(hideEvent)","                {","                    if(Y_Lang.isArray(hideEvent))","                    {","                        len = hideEvent.length;","                        for(; i < len; ++i)","                        {","                            this.on(interactionType + \"Event:\" + hideEvent[i], this.hideTooltip);","                        }","                    }","                    this.on(interactionType + \"Event:\" + hideEvent, this.hideTooltip);","                }","            }","        }","    },","","    /**","     * Event handler for marker events.","     *","     * @method _markerEventDispatcher","     * @param {Object} e Event object.","     * @private","     */","    _markerEventDispatcher: function(e)","    {","        var type = e.type,","            cb = this.get(\"contentBox\"),","            markerNode = e.currentTarget,","            strArr = markerNode.getAttribute(\"id\").split(\"_\"),","            index = strArr.pop(),","            seriesIndex = strArr.pop(),","            series = this.getSeries(parseInt(seriesIndex, 10)),","            items = this.getSeriesItems(series, index),","            isTouch = e && e.hasOwnProperty(\"changedTouches\"),","            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,","            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,","            x = pageX - cb.getX(),","            y = pageY - cb.getY();","        if(type == \"mouseenter\")","        {","            type = \"mouseover\";","        }","        else if(type == \"mouseleave\")","        {","            type = \"mouseout\";","        }","        series.updateMarkerState(type, index);","        e.halt();","        /**","         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseover event.","         *","         *","         * @event markerEvent:mouseover","         * @preventable false","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *  <dl>","         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>","         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>","         *      <dt>node</dt><dd>The dom node of the marker.</dd>","         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>","         *      <dt>index</dt><dd>Index of the marker in the series.</dd>","         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>","         *  </dl>","         */","        /**","         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseout event.","         *","         * @event markerEvent:mouseout","         * @preventable false","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *  <dl>","         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>","         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>","         *      <dt>node</dt><dd>The dom node of the marker.</dd>","         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>","         *      <dt>index</dt><dd>Index of the marker in the series.</dd>","         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>","         *  </dl>","         */","        /**","         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mousedown event.","         *","         * @event markerEvent:mousedown","         * @preventable false","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *  <dl>","         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>","         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>","         *      <dt>node</dt><dd>The dom node of the marker.</dd>","         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>","         *      <dt>index</dt><dd>Index of the marker in the series.</dd>","         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>","         *  </dl>","         */","        /**","         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseup event.","         *","         * @event markerEvent:mouseup","         * @preventable false","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *  <dl>","         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>","         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>","         *      <dt>node</dt><dd>The dom node of the marker.</dd>","         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>","         *      <dt>index</dt><dd>Index of the marker in the series.</dd>","         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>","         *  </dl>","         */","        /**","         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a click event.","         *","         * @event markerEvent:click","         * @preventable false","         * @param {EventFacade} e Event facade with the following additional","         *   properties:","         *  <dl>","         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>","         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>","         *      <dt>node</dt><dd>The dom node of the marker.</dd>","         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","         *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>","         *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>","         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>","         *      <dt>index</dt><dd>Index of the marker in the series.</dd>","         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>","         *      <dt>originEvent</dt><dd>Underlying dom event.</dd>","         *  </dl>","         */","        this.fire(\"markerEvent:\" + type, {","            originEvent: e,","            pageX:pageX,","            pageY:pageY,","            categoryItem:items.category,","            valueItem:items.value,","            node:markerNode,","            x:x,","            y:y,","            series:series,","            index:index,","            seriesIndex:seriesIndex","        });","    },","","    /**","     * Event handler for dataProviderChange.","     *","     * @method _dataProviderChangeHandler","     * @param {Object} e Event object.","     * @private","     */","    _dataProviderChangeHandler: function(e)","    {","        var dataProvider = e.newVal,","            axes,","            i,","            axis;","        this._seriesIndex = -1;","        this._itemIndex = -1;","        if(this instanceof Y.CartesianChart)","        {","            this.set(\"axes\", this.get(\"axes\"));","            this.set(\"seriesCollection\", this.get(\"seriesCollection\"));","        }","        axes = this.get(\"axes\");","        if(axes)","        {","            for(i in axes)","            {","                if(axes.hasOwnProperty(i))","                {","                    axis = axes[i];","                    if(axis instanceof Y.Axis)","                    {","                        if(axis.get(\"position\") != \"none\")","                        {","                            this._addToAxesRenderQueue(axis);","                        }","                        axis.set(\"dataProvider\", dataProvider);","                    }","                }","            }","        }","    },","","    /**","     * Event listener for toggling the tooltip. If a tooltip is visible, hide it. If not, it","     * will create and show a tooltip based on the event object.","     *","     * @method toggleTooltip","     * @param {Object} e Event object.","     */","    toggleTooltip: function(e)","    {","        var tt = this.get(\"tooltip\");","        if(tt.visible)","        {","            this.hideTooltip();","        }","        else","        {","            tt.markerEventHandler.apply(this, [e]);","        }","    },","","    /**","     * Shows a tooltip","     *","     * @method _showTooltip","     * @param {String} msg Message to dispaly in the tooltip.","     * @param {Number} x x-coordinate","     * @param {Number} y y-coordinate","     * @private","     */","    _showTooltip: function(msg, x, y)","    {","        var tt = this.get(\"tooltip\"),","            node = tt.node;","        if(msg)","        {","            tt.visible = true;","            tt.setTextFunction(node, msg);","            node.setStyle(\"top\", y + \"px\");","            node.setStyle(\"left\", x + \"px\");","            node.setStyle(\"visibility\", \"visible\");","        }","    },","","    /**","     * Positions the tooltip","     *","     * @method _positionTooltip","     * @param {Object} e Event object.","     * @private","     */","    _positionTooltip: function(e)","    {","        var tt = this.get(\"tooltip\"),","            node = tt.node,","            cb = this.get(\"contentBox\"),","            x = (e.pageX + 10) - cb.getX(),","            y = (e.pageY + 10) - cb.getY();","        if(node)","        {","            node.setStyle(\"left\", x + \"px\");","            node.setStyle(\"top\", y + \"px\");","        }","    },","","    /**","     * Hides the default tooltip","     *","     * @method hideTooltip","     */","    hideTooltip: function()","    {","        var tt = this.get(\"tooltip\"),","            node = tt.node;","        tt.visible = false;","        node.set(\"innerHTML\", \"\");","        node.setStyle(\"left\", -10000);","        node.setStyle(\"top\", -10000);","        node.setStyle(\"visibility\", \"hidden\");","    },","","    /**","     * Adds a tooltip to the dom.","     *","     * @method _addTooltip","     * @private","     */","    _addTooltip: function()","    {","        var tt = this.get(\"tooltip\"),","            id = this.get(\"id\") + \"_tooltip\",","            cb = this.get(\"contentBox\"),","            oldNode = DOCUMENT.getElementById(id);","        if(oldNode)","        {","            cb.removeChild(oldNode);","        }","        tt.node.set(\"id\", id);","        tt.node.setStyle(\"visibility\", \"hidden\");","        cb.appendChild(tt.node);","    },","","    /**","     * Updates the tooltip attribute.","     *","     * @method _updateTooltip","     * @param {Object} val Object containing properties for the tooltip.","     * @return Object","     * @private","     */","    _updateTooltip: function(val)","    {","        var tt = this.get(\"tooltip\") || this._getTooltip(),","            i,","            styles,","            node,","            props = {","                markerLabelFunction:\"markerLabelFunction\",","                planarLabelFunction:\"planarLabelFunction\",","                setTextFunction:\"setTextFunction\",","                showEvent:\"showEvent\",","                hideEvent:\"hideEvent\",","                markerEventHandler:\"markerEventHandler\",","                planarEventHandler:\"planarEventHandler\",","                show:\"show\"","            };","        if(Y_Lang.isObject(val))","        {","            styles = val.styles;","            node = Y.one(val.node) || tt.node;","            if(styles)","            {","                for(i in styles)","                {","                    if(styles.hasOwnProperty(i))","                    {","                        node.setStyle(i, styles[i]);","                    }","                }","            }","            for(i in props)","            {","                if(val.hasOwnProperty(i))","                {","                    tt[i] = val[i];","                }","            }","            tt.node = node;","        }","        return tt;","    },","","    /**","     * Default getter for `tooltip` attribute.","     *","     * @method _getTooltip","     * @return Object","     * @private","     */","    _getTooltip: function()","    {","        var node = DOCUMENT.createElement(\"div\"),","            tooltipClass = _getClassName(\"chart-tooltip\"),","            tt = {","                setTextFunction: this._setText,","                markerLabelFunction: this._tooltipLabelFunction,","                planarLabelFunction: this._planarLabelFunction,","                show: true,","                hideEvent: \"mouseout\",","                showEvent: \"mouseover\",","                markerEventHandler: function(e)","                {","                    var tt = this.get(\"tooltip\"),","                    msg = tt.markerLabelFunction.apply(this, [e.categoryItem, e.valueItem, e.index, e.series, e.seriesIndex]);","                    this._showTooltip(msg, e.x + 10, e.y + 10);","                },","                planarEventHandler: function(e)","                {","                    var tt = this.get(\"tooltip\"),","                        msg ,","                        categoryAxis = this.get(\"categoryAxis\");","                    msg = tt.planarLabelFunction.apply(this, [categoryAxis, e.valueItem, e.index, e.items, e.seriesIndex]);","                    this._showTooltip(msg, e.x + 10, e.y + 10);","                }","            };","        node = Y.one(node);","        node.set(\"id\", this.get(\"id\") + \"_tooltip\");","        node.setStyle(\"fontSize\", \"85%\");","        node.setStyle(\"opacity\", \"0.83\");","        node.setStyle(\"position\", \"absolute\");","        node.setStyle(\"paddingTop\", \"2px\");","        node.setStyle(\"paddingRight\", \"5px\");","        node.setStyle(\"paddingBottom\", \"4px\");","        node.setStyle(\"paddingLeft\", \"2px\");","        node.setStyle(\"backgroundColor\", \"#fff\");","        node.setStyle(\"border\", \"1px solid #dbdccc\");","        node.setStyle(\"pointerEvents\", \"none\");","        node.setStyle(\"zIndex\", 3);","        node.setStyle(\"whiteSpace\", \"noWrap\");","        node.setStyle(\"visibility\", \"hidden\");","        node.addClass(tooltipClass);","        tt.node = Y.one(node);","        return tt;","    },","","    /**","     * Formats tooltip text when `interactionType` is `planar`.","     *","     * @method _planarLabelFunction","     * @param {Axis} categoryAxis Reference to the categoryAxis of the chart.","     * @param {Array} valueItems Array of objects for each series that has a data point in the coordinate plane of the event.","     * Each object contains the following data:","     *  <dl>","     *      <dt>axis</dt><dd>The value axis of the series.</dd>","     *      <dt>key</dt><dd>The key for the series.</dd>","     *      <dt>value</dt><dd>The value for the series item.</dd>","     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>","     *  </dl>","     *  @param {Number} index The index of the item within its series.","     *  @param {Array} seriesArray Array of series instances for each value item.","     *  @param {Number} seriesIndex The index of the series in the `seriesCollection`.","     *  @return {String | HTML}","     * @private","     */","    _planarLabelFunction: function(categoryAxis, valueItems, index, seriesArray, seriesIndex)","    {","        var msg = DOCUMENT.createElement(\"div\"),","            valueItem,","            i = 0,","            len = seriesArray.length,","            axis,","            categoryValue,","            seriesValue,","            series;","        if(categoryAxis)","        {","            categoryValue = categoryAxis.get(\"labelFunction\").apply(this, [categoryAxis.getKeyValueAt(this.get(\"categoryKey\"), index), categoryAxis.get(\"labelFormat\")]);","            if(!Y_Lang.isObject(categoryValue))","            {","                categoryValue = DOCUMENT.createTextNode(categoryValue);","            }","            msg.appendChild(categoryValue);","        }","","        for(; i < len; ++i)","        {","            series = seriesArray[i];","            if(series.get(\"visible\"))","            {","                valueItem = valueItems[i];","                axis = valueItem.axis;","                seriesValue =  axis.get(\"labelFunction\").apply(this, [axis.getKeyValueAt(valueItem.key, index), axis.get(\"labelFormat\")]);","                msg.appendChild(DOCUMENT.createElement(\"br\"));","                msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName));","                msg.appendChild(DOCUMENT.createTextNode(\": \"));","                if(!Y_Lang.isObject(seriesValue))","                {","                    seriesValue = DOCUMENT.createTextNode(seriesValue);","                }","                msg.appendChild(seriesValue);","            }","        }","        return msg;","    },","","    /**","     * Formats tooltip text when `interactionType` is `marker`.","     *","     * @method _tooltipLabelFunction","     * @param {Object} categoryItem An object containing the following:","     *  <dl>","     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>","     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>","     *      <dt>key</dt><dd>The key of the category.</dd>","     *      <dt>value</dt><dd>The value of the category</dd>","     *  </dl>","     * @param {Object} valueItem An object containing the following:","     *  <dl>","     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>","     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>","     *      <dt>key</dt><dd>The key for the series.</dd>","     *      <dt>value</dt><dd>The value for the series item.</dd>","     *  </dl>","     * @param {Number} itemIndex The index of the item within the series.","     * @param {CartesianSeries} series The `CartesianSeries` instance of the item.","     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.","     * @return {String | HTML}","     * @private","     */","    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)","    {","        var msg = DOCUMENT.createElement(\"div\"),","            categoryValue = categoryItem.axis.get(\"labelFunction\").apply(this, [categoryItem.value, categoryItem.axis.get(\"labelFormat\")]),","            seriesValue = valueItem.axis.get(\"labelFunction\").apply(this, [valueItem.value, valueItem.axis.get(\"labelFormat\")]);","        msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName));","        msg.appendChild(DOCUMENT.createTextNode(\": \"));","        if(!Y_Lang.isObject(categoryValue))","        {","            categoryValue = DOCUMENT.createTextNode(categoryValue);","        }","        msg.appendChild(categoryValue);","        msg.appendChild(DOCUMENT.createElement(\"br\"));","        msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName));","        msg.appendChild(DOCUMENT.createTextNode(\": \"));","        if(!Y_Lang.isObject(seriesValue))","        {","            seriesValue = DOCUMENT.createTextNode(seriesValue);","        }","        msg.appendChild(seriesValue);","        return msg;","    },","","    /**","     * Event handler for the tooltipChange.","     *","     * @method _tooltipChangeHandler","     * @param {Object} e Event object.","     * @private","     */","    _tooltipChangeHandler: function(e)","    {","        if(this.get(\"tooltip\"))","        {","            var tt = this.get(\"tooltip\"),","                node = tt.node,","                show = tt.show,","                cb = this.get(\"contentBox\");","            if(node && show)","            {","                if(!cb.contains(node))","                {","                    this._addTooltip();","                }","            }","        }","    },","","    /**","     * Updates the content of text field. This method writes a value into a text field using","     * `appendChild`. If the value is a `String`, it is converted to a `TextNode` first.","     *","     * @method _setText","     * @param label {HTMLElement} label to be updated","     * @param val {String} value with which to update the label","     * @private","     */","    _setText: function(textField, val)","    {","        textField.setContent(\"\");","        if(Y_Lang.isNumber(val))","        {","            val = val + \"\";","        }","        else if(!val)","        {","            val = \"\";","        }","        if(IS_STRING(val))","        {","            val = DOCUMENT.createTextNode(val);","        }","        textField.appendChild(val);","    },","","    /**","     * Returns all the keys contained in a  `dataProvider`.","     *","     * @method _getAllKeys","     * @param {Array} dp Collection of objects to be parsed.","     * @return Object","     */","    _getAllKeys: function(dp)","    {","        var i = 0,","            len = dp.length,","            item,","            key,","            keys = {};","        for(; i < len; ++i)","        {","            item = dp[i];","            for(key in item)","            {","                if(item.hasOwnProperty(key))","                {","                    keys[key] = true;","                }","            }","        }","        return keys;","    },","","    /**","     * Constructs seriesKeys if not explicitly specified.","     *","     * @method _buildSeriesKeys","     * @param {Array} dataProvider The dataProvider for the chart.","     * @return Array","     * @private","     */","    _buildSeriesKeys: function(dataProvider)","    {","        var allKeys,","            catKey = this.get(\"categoryKey\"),","            keys = [],","            i;","        if(this._seriesKeysExplicitlySet)","        {","            return this._seriesKeys;","        }","        allKeys = this._getAllKeys(dataProvider);","        for(i in allKeys)","        {","            if(allKeys.hasOwnProperty(i) && i != catKey)","            {","                keys.push(i);","            }","        }","        return keys;","    }","};","Y.ChartBase = ChartBase;","/**"," * The CartesianChart class creates a chart with horizontal and vertical axes."," *"," * @class CartesianChart"," * @extends ChartBase"," * @constructor"," * @submodule charts-base"," */","Y.CartesianChart = Y.Base.create(\"cartesianChart\", Y.Widget, [Y.ChartBase], {","    /**","     * @method renderUI","     * @private","     */","    renderUI: function()","    {","        var bb = this.get(\"boundingBox\"),","            cb = this.get(\"contentBox\"),","            tt = this.get(\"tooltip\"),","            overlay,","            overlayClass = _getClassName(\"overlay\");","        //move the position = absolute logic to a class file","        bb.setStyle(\"position\", \"absolute\");","        cb.setStyle(\"position\", \"absolute\");","        this._addAxes();","        this._addGridlines();","        this._addSeries();","        if(tt && tt.show)","        {","            this._addTooltip();","        }","        //If there is a style definition. Force them to set.","        this.get(\"styles\");","        if(this.get(\"interactionType\") == \"planar\")","        {","            overlay = DOCUMENT.createElement(\"div\");","            this.get(\"contentBox\").appendChild(overlay);","            this._overlay = Y.one(overlay);","            this._overlay.set(\"id\", this.get(\"id\") + \"_overlay\");","            this._overlay.setStyle(\"position\", \"absolute\");","            this._overlay.setStyle(\"background\", \"#fff\");","            this._overlay.setStyle(\"opacity\", 0);","            this._overlay.addClass(overlayClass);","            this._overlay.setStyle(\"zIndex\", 4);","        }","        this._setAriaElements(bb, cb);","        this._redraw();","    },","","    /**","     * When `interactionType` is set to `planar`, listens for mouse move events and fires `planarEvent:mouseover` or `planarEvent:mouseout`","     * depending on the position of the mouse in relation to data points on the `Chart`.","     *","     * @method _planarEventDispatcher","     * @param {Object} e Event object.","     * @private","     */","    _planarEventDispatcher: function(e)","    {","        var graph = this.get(\"graph\"),","            bb = this.get(\"boundingBox\"),","            cb = graph.get(\"contentBox\"),","            isTouch = e && e.hasOwnProperty(\"changedTouches\"),","            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,","            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,","            posX = pageX - bb.getX(),","            posY = pageY - bb.getY(),","            offset = {","                x: pageX - cb.getX(),","                y: pageY - cb.getY()","            },","            sc = graph.get(\"seriesCollection\"),","            series,","            i = 0,","            index,","            oldIndex = this._selectedIndex,","            item,","            items = [],","            categoryItems = [],","            valueItems = [],","            direction = this.get(\"direction\"),","            hasMarkers,","            catAxis,","            valAxis,","            coord,","            //data columns and area data could be created on a graph level","            markerPlane,","            len,","            coords;","        e.halt(true);","        if(direction == \"horizontal\")","        {","            catAxis = \"x\";","            valAxis = \"y\";","        }","        else","        {","            valAxis = \"x\";","            catAxis = \"y\";","        }","        coord = offset[catAxis];","        if(sc)","        {","            len = sc.length;","            while(i < len && !markerPlane)","            {","                if(sc[i])","                {","                    markerPlane = sc[i].get(catAxis + \"MarkerPlane\");","                }","                i++;","            }","        }","        if(markerPlane)","        {","            len = markerPlane.length;","            for(i = 0; i < len; ++i)","            {","                if(coord <= markerPlane[i].end && coord >= markerPlane[i].start)","                {","                    index = i;","                    break;","                }","            }","            len = sc.length;","            for(i = 0; i < len; ++i)","            {","                series = sc[i];","                coords = series.get(valAxis + \"coords\");","                hasMarkers = series.get(\"markers\");","                if(hasMarkers && !isNaN(oldIndex) && oldIndex > -1)","                {","                    series.updateMarkerState(\"mouseout\", oldIndex);","                }","                if(coords && coords[index] > -1)","                {","                    if(hasMarkers && !isNaN(index) && index > -1)","                    {","                        series.updateMarkerState(\"mouseover\", index);","                    }","                    item = this.getSeriesItems(series, index);","                    categoryItems.push(item.category);","                    valueItems.push(item.value);","                    items.push(series);","                }","","            }","            this._selectedIndex = index;","","            /**","             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseover event.","             *","             *","             * @event planarEvent:mouseover","             * @preventable false","             * @param {EventFacade} e Event facade with the following additional","             *   properties:","             *  <dl>","             *      <dt>categoryItem</dt><dd>An array of hashes, each containing information about the category `Axis` of each marker","             *      whose plane has been intersected.</dd>","             *      <dt>valueItem</dt><dd>An array of hashes, each containing information about the value `Axis` of each marker whose","             *      plane has been intersected.</dd>","             *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>","             *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>","             *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>","             *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>","             *      <dt>items</dt><dd>An array including all the series which contain a marker whose plane has been intersected.</dd>","             *      <dt>index</dt><dd>Index of the markers in their respective series.</dd>","             *      <dt>originEvent</dt><dd>Underlying dom event.</dd>","             *  </dl>","             */","            /**","             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseout event.","             *","             * @event planarEvent:mouseout","             * @preventable false","             * @param {EventFacade} e","             */","            if(index > -1)","            {","                this.fire(\"planarEvent:mouseover\", {","                    categoryItem:categoryItems,","                    valueItem:valueItems,","                    x:posX,","                    y:posY,","                    pageX:pageX,","                    pageY:pageY,","                    items:items,","                    index:index,","                    originEvent:e","                });","            }","            else","            {","                this.fire(\"planarEvent:mouseout\");","            }","        }","    },","","    /**","     * Indicates the default series type for the chart.","     *","     * @property _type","     * @type {String}","     * @private","     */","    _type: \"combo\",","","    /**","     * Queue of axes instances that will be updated. This method is used internally to determine when all axes have been updated.","     *","     * @property _itemRenderQueue","     * @type Array","     * @private","     */","    _itemRenderQueue: null,","","    /**","     * Adds an `Axis` instance to the `_itemRenderQueue`.","     *","     * @method _addToAxesRenderQueue","     * @param {Axis} axis An `Axis` instance.","     * @private","     */","    _addToAxesRenderQueue: function(axis)","    {","        if(!this._itemRenderQueue)","        {","            this._itemRenderQueue = [];","        }","        if(Y.Array.indexOf(this._itemRenderQueue, axis) < 0)","        {","            this._itemRenderQueue.push(axis);","        }","    },","","    /**","     * Adds axis instance to the appropriate array based on position","     *","     * @method _addToAxesCollection","     * @param {String} position The position of the axis","     * @param {Axis} axis The `Axis` instance","     */","    _addToAxesCollection: function(position, axis)","    {","        var axesCollection = this.get(position + \"AxesCollection\");","        if(!axesCollection)","        {","            axesCollection = [];","            this.set(position + \"AxesCollection\", axesCollection);","        }","        axesCollection.push(axis);","    },","","    /**","     * Returns the default value for the `seriesCollection` attribute.","     *","     * @method _getDefaultSeriesCollection","     * @param {Array} val Array containing either `CartesianSeries` instances or objects containing data to construct series instances.","     * @return Array","     * @private","     */","    _getDefaultSeriesCollection: function()","    {","        var seriesCollection,","            dataProvider = this.get(\"dataProvider\");","        if(dataProvider)","        {","            seriesCollection = this._parseSeriesCollection();","        }","        return seriesCollection;","    },","","    /**","     * Parses and returns a series collection from an object and default properties.","     *","     * @method _parseSeriesCollection","     * @param {Object} val Object contain properties for series being set.","     * @return Object","     * @private","     */","    _parseSeriesCollection: function(val)","    {","        var dir = this.get(\"direction\"),","            sc = [],","            catAxis,","            valAxis,","            tempKeys = [],","            series,","            seriesKeys = this.get(\"seriesKeys\").concat(),","            i,","            index,","            l,","            type = this.get(\"type\"),","            key,","            catKey,","            seriesKey,","            graph,","            orphans = [],","            categoryKey = this.get(\"categoryKey\"),","            showMarkers = this.get(\"showMarkers\"),","            showAreaFill = this.get(\"showAreaFill\"),","            showLines = this.get(\"showLines\");","        val = val || [];","        if(dir == \"vertical\")","        {","            catAxis = \"yAxis\";","            catKey = \"yKey\";","            valAxis = \"xAxis\";","            seriesKey = \"xKey\";","        }","        else","        {","            catAxis = \"xAxis\";","            catKey = \"xKey\";","            valAxis = \"yAxis\";","            seriesKey = \"yKey\";","        }","        l = val.length;","        while(val && val.length > 0)","        {","            series = val.shift();","            key = this._getBaseAttribute(series, seriesKey);","            if(key)","            {","                index = Y.Array.indexOf(seriesKeys, key);","                if(index > -1)","                {","                    seriesKeys.splice(index, 1);","                    tempKeys.push(key);","                    sc.push(series);","                }","                else","                {","                    orphans.push(series);","                }","            }","            else","            {","                orphans.push(series);","            }","        }","        while(orphans.length > 0)","        {","            series = orphans.shift();","            if(seriesKeys.length > 0)","            {","                key = seriesKeys.shift();","                this._setBaseAttribute(series, seriesKey, key);","                tempKeys.push(key);","                sc.push(series);","            }","            else if(series instanceof Y.CartesianSeries)","            {","                series.destroy(true);","            }","        }","        if(seriesKeys.length > 0)","        {","            tempKeys = tempKeys.concat(seriesKeys);","        }","        l = tempKeys.length;","        for(i = 0; i < l; ++i)","        {","            series = sc[i] || {type:type};","            if(series instanceof Y.CartesianSeries)","            {","                this._parseSeriesAxes(series);","                continue;","            }","","            series[catKey] = series[catKey] || categoryKey;","            series[seriesKey] = series[seriesKey] || seriesKeys.shift();","            series[catAxis] = this._getCategoryAxis();","            series[valAxis] = this._getSeriesAxis(series[seriesKey]);","","            series.type = series.type || type;","            series.direction = series.direction || dir;","","            if((series.type == \"combo\" || series.type == \"stackedcombo\" || series.type == \"combospline\" || series.type == \"stackedcombospline\"))","            {","                if(showAreaFill !== null)","                {","                    series.showAreaFill = (series.showAreaFill !== null && series.showAreaFill !== undefined) ? series.showAreaFill : showAreaFill;","                }","                if(showMarkers !== null)","                {","                    series.showMarkers = (series.showMarkers !== null && series.showMarkers !== undefined) ? series.showMarkers : showMarkers;","                }","                if(showLines !== null)","                {","                    series.showLines = (series.showLines !== null && series.showLines !== undefined) ? series.showLines : showLines;","                }","            }","            sc[i] = series;","        }","        if(sc)","        {","            graph = this.get(\"graph\");","            graph.set(\"seriesCollection\", sc);","            sc = graph.get(\"seriesCollection\");","        }","        return sc;","    },","","    /**","     * Parse and sets the axes for a series instance.","     *","     * @method _parseSeriesAxes","     * @param {CartesianSeries} series A `CartesianSeries` instance.","     * @private","     */","    _parseSeriesAxes: function(series)","    {","        var axes = this.get(\"axes\"),","            xAxis = series.get(\"xAxis\"),","            yAxis = series.get(\"yAxis\"),","            YAxis = Y.Axis,","            axis;","        if(xAxis && !(xAxis instanceof YAxis) && Y_Lang.isString(xAxis) && axes.hasOwnProperty(xAxis))","        {","            axis = axes[xAxis];","            if(axis instanceof YAxis)","            {","                series.set(\"xAxis\", axis);","            }","        }","        if(yAxis && !(yAxis instanceof YAxis) && Y_Lang.isString(yAxis) && axes.hasOwnProperty(yAxis))","        {","            axis = axes[yAxis];","            if(axis instanceof YAxis)","            {","                series.set(\"yAxis\", axis);","            }","        }","","    },","","    /**","     * Returns the category axis instance for the chart.","     *","     * @method _getCategoryAxis","     * @return Axis","     * @private","     */","    _getCategoryAxis: function()","    {","        var axis,","            axes = this.get(\"axes\"),","            categoryAxisName = this.get(\"categoryAxisName\") || this.get(\"categoryKey\");","        axis = axes[categoryAxisName];","        return axis;","    },","","    /**","     * Returns the value axis for a series.","     *","     * @method _getSeriesAxis","     * @param {String} key The key value used to determine the axis instance.","     * @return Axis","     * @private","     */","    _getSeriesAxis:function(key, axisName)","    {","        var axes = this.get(\"axes\"),","            i,","            keys,","            axis;","        if(axes)","        {","            if(axisName && axes.hasOwnProperty(axisName))","            {","                axis = axes[axisName];","            }","            else","            {","                for(i in axes)","                {","                    if(axes.hasOwnProperty(i))","                    {","                        keys = axes[i].get(\"keys\");","                        if(keys && keys.hasOwnProperty(key))","                        {","                            axis = axes[i];","                            break;","                        }","                    }","                }","            }","        }","        return axis;","    },","","    /**","     * Gets an attribute from an object, using a getter for Base objects and a property for object","     * literals. Used for determining attributes from series/axis references which can be an actual class instance","     * or a hash of properties that will be used to create a class instance.","     *","     * @method _getBaseAttribute","     * @param {Object} item Object or instance in which the attribute resides.","     * @param {String} key Attribute whose value will be returned.","     * @return Object","     * @private","     */","    _getBaseAttribute: function(item, key)","    {","        if(item instanceof Y.Base)","        {","            return item.get(key);","        }","        if(item.hasOwnProperty(key))","        {","            return item[key];","        }","        return null;","    },","","    /**","     * Sets an attribute on an object, using a setter of Base objects and a property for object","     * literals. Used for setting attributes on a Base class, either directly or to be stored in an object literal","     * for use at instantiation.","     *","     * @method _setBaseAttribute","     * @param {Object} item Object or instance in which the attribute resides.","     * @param {String} key Attribute whose value will be assigned.","     * @param {Object} value Value to be assigned to the attribute.","     * @private","     */","    _setBaseAttribute: function(item, key, value)","    {","        if(item instanceof Y.Base)","        {","            item.set(key, value);","        }","        else","        {","            item[key] = value;","        }","    },","","    /**","     * Creates `Axis` instances.","     *","     * @method _setAxes","     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.","     * @return Object","     * @private","     */","    _setAxes: function(val)","    {","        var hash = this._parseAxes(val),","            axes = {},","            axesAttrs = {","                edgeOffset: \"edgeOffset\",","                position: \"position\",","                overlapGraph:\"overlapGraph\",","                labelFunction:\"labelFunction\",","                labelFunctionScope:\"labelFunctionScope\",","                labelFormat:\"labelFormat\",","                appendLabelFunction: \"appendLabelFunction\",","                appendTitleFunction: \"appendTitleFunction\",","                maximum:\"maximum\",","                minimum:\"minimum\",","                roundingMethod:\"roundingMethod\",","                alwaysShowZero:\"alwaysShowZero\",","                title:\"title\",","                width:\"width\",","                height:\"height\"","            },","            dp = this.get(\"dataProvider\"),","            ai,","            i,","            pos,","            axis,","            axisPosition,","            dh,","            axisClass,","            config,","            axesCollection;","        for(i in hash)","        {","            if(hash.hasOwnProperty(i))","            {","                dh = hash[i];","                if(dh instanceof Y.Axis)","                {","                    axis = dh;","                }","                else","                {","                    axis = null;","                    config = {};","                    config.dataProvider = dh.dataProvider || dp;","                    config.keys = dh.keys;","","                    if(dh.hasOwnProperty(\"roundingUnit\"))","                    {","                        config.roundingUnit = dh.roundingUnit;","                    }","                    pos = dh.position;","                    if(dh.styles)","                    {","                        config.styles = dh.styles;","                    }","                    config.position = dh.position;","                    for(ai in axesAttrs)","                    {","                        if(axesAttrs.hasOwnProperty(ai) && dh.hasOwnProperty(ai))","                        {","                            config[ai] = dh[ai];","                        }","                    }","","                    //only check for existing axis if we constructed the default axes already","                    if(val)","                    {","                        axis = this.getAxisByKey(i);","                    }","","                    if(axis && axis instanceof Y.Axis)","                    {","                        axisPosition = axis.get(\"position\");","                        if(pos != axisPosition)","                        {","                            if(axisPosition != \"none\")","                            {","                                axesCollection = this.get(axisPosition + \"AxesCollection\");","                                axesCollection.splice(Y.Array.indexOf(axesCollection, axis), 1);","                            }","                            if(pos != \"none\")","                            {","                                this._addToAxesCollection(pos, axis);","                            }","                        }","                        axis.setAttrs(config);","                    }","                    else","                    {","                        axisClass = this._getAxisClass(dh.type);","                        axis = new axisClass(config);","                        axis.after(\"axisRendered\", Y.bind(this._itemRendered, this));","                    }","                }","","                if(axis)","                {","                    axesCollection = this.get(pos + \"AxesCollection\");","                    if(axesCollection && Y.Array.indexOf(axesCollection, axis) > 0)","                    {","                        axis.set(\"overlapGraph\", false);","                    }","                    axes[i] = axis;","                }","            }","        }","        return axes;","    },","","    /**","     * Adds axes to the chart.","     *","     * @method _addAxes","     * @private","     */","    _addAxes: function()","    {","        var axes = this.get(\"axes\"),","            i,","            axis,","            pos,","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            node = Y.Node.one(this._parentNode);","        if(!this._axesCollection)","        {","            this._axesCollection = [];","        }","        for(i in axes)","        {","            if(axes.hasOwnProperty(i))","            {","                axis = axes[i];","                if(axis instanceof Y.Axis)","                {","                    if(!w)","                    {","                        this.set(\"width\", node.get(\"offsetWidth\"));","                        w = this.get(\"width\");","                    }","                    if(!h)","                    {","                        this.set(\"height\", node.get(\"offsetHeight\"));","                        h = this.get(\"height\");","                    }","                    this._addToAxesRenderQueue(axis);","                    pos = axis.get(\"position\");","                    if(!this.get(pos + \"AxesCollection\"))","                    {","                        this.set(pos + \"AxesCollection\", [axis]);","                    }","                    else","                    {","                        this.get(pos + \"AxesCollection\").push(axis);","                    }","                    this._axesCollection.push(axis);","                    if(axis.get(\"keys\").hasOwnProperty(this.get(\"categoryKey\")))","                    {","                        this.set(\"categoryAxis\", axis);","                    }","                    axis.render(this.get(\"contentBox\"));","                }","            }","        }","    },","","    /**","     * Renders the Graph.","     *","     * @method _addSeries","     * @private","     */","    _addSeries: function()","    {","        var graph = this.get(\"graph\"),","            sc = this.get(\"seriesCollection\");","        graph.render(this.get(\"contentBox\"));","","    },","","    /**","     * Adds gridlines to the chart.","     *","     * @method _addGridlines","     * @private","     */","    _addGridlines: function()","    {","        var graph = this.get(\"graph\"),","            hgl = this.get(\"horizontalGridlines\"),","            vgl = this.get(\"verticalGridlines\"),","            direction = this.get(\"direction\"),","            leftAxesCollection = this.get(\"leftAxesCollection\"),","            rightAxesCollection = this.get(\"rightAxesCollection\"),","            bottomAxesCollection = this.get(\"bottomAxesCollection\"),","            topAxesCollection = this.get(\"topAxesCollection\"),","            seriesAxesCollection,","            catAxis = this.get(\"categoryAxis\"),","            hAxis,","            vAxis;","        if(this._axesCollection)","        {","            seriesAxesCollection = this._axesCollection.concat();","            seriesAxesCollection.splice(Y.Array.indexOf(seriesAxesCollection, catAxis), 1);","        }","        if(hgl)","        {","            if(leftAxesCollection && leftAxesCollection[0])","            {","                hAxis = leftAxesCollection[0];","            }","            else if(rightAxesCollection && rightAxesCollection[0])","            {","                hAxis = rightAxesCollection[0];","            }","            else","            {","                hAxis = direction == \"horizontal\" ? catAxis : seriesAxesCollection[0];","            }","            if(!this._getBaseAttribute(hgl, \"axis\") && hAxis)","            {","                this._setBaseAttribute(hgl, \"axis\", hAxis);","            }","            if(this._getBaseAttribute(hgl, \"axis\"))","            {","                graph.set(\"horizontalGridlines\", hgl);","            }","        }","        if(vgl)","        {","            if(bottomAxesCollection && bottomAxesCollection[0])","            {","                vAxis = bottomAxesCollection[0];","            }","            else if (topAxesCollection && topAxesCollection[0])","            {","                vAxis = topAxesCollection[0];","            }","            else","            {","                vAxis = direction == \"vertical\" ? catAxis : seriesAxesCollection[0];","            }","            if(!this._getBaseAttribute(vgl, \"axis\") && vAxis)","            {","                this._setBaseAttribute(vgl, \"axis\", vAxis);","            }","            if(this._getBaseAttribute(vgl, \"axis\"))","            {","                graph.set(\"verticalGridlines\", vgl);","            }","        }","    },","","    /**","     * Default Function for the axes attribute.","     *","     * @method _getDefaultAxes","     * @return Object","     * @private","     */","    _getDefaultAxes: function()","    {","        var axes;","        if(this.get(\"dataProvider\"))","        {","            axes = this._parseAxes();","        }","        return axes;","    },","","    /**","     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.","     *","     * @method _parseAxes","     * @param {Object} axes Object containing `Axis` instances or `Axis` attributes.","     * @return Object","     * @private","     */","    _parseAxes: function(axes)","    {","        var catKey = this.get(\"categoryKey\"),","            axis,","            attr,","            keys,","            newAxes = {},","            claimedKeys = [],","            categoryAxisName = this.get(\"categoryAxisName\") || this.get(\"categoryKey\"),","            valueAxisName = this.get(\"valueAxisName\"),","            seriesKeys = this.get(\"seriesKeys\").concat(),","            i,","            l,","            ii,","            ll,","            cIndex,","            direction = this.get(\"direction\"),","            seriesPosition,","            categoryPosition,","            valueAxes = [],","            seriesAxis = this.get(\"stacked\") ? \"stacked\" : \"numeric\";","        if(direction == \"vertical\")","        {","            seriesPosition = \"bottom\";","            categoryPosition = \"left\";","        }","        else","        {","            seriesPosition = \"left\";","            categoryPosition = \"bottom\";","        }","        if(axes)","        {","            for(i in axes)","            {","                if(axes.hasOwnProperty(i))","                {","                    axis = axes[i];","                    keys = this._getBaseAttribute(axis, \"keys\");","                    attr = this._getBaseAttribute(axis, \"type\");","                    if(attr == \"time\" || attr == \"category\")","                    {","                        categoryAxisName = i;","                        this.set(\"categoryAxisName\", i);","                        if(Y_Lang.isArray(keys) && keys.length > 0)","                        {","                            catKey = keys[0];","                            this.set(\"categoryKey\", catKey);","                        }","                        newAxes[i] = axis;","                    }","                    else if(i == categoryAxisName)","                    {","                        newAxes[i] = axis;","                    }","                    else","                    {","                        newAxes[i] = axis;","                        if(i != valueAxisName && keys && Y_Lang.isArray(keys))","                        {","                            ll = keys.length;","                            for(ii = 0; ii < ll; ++ii)","                            {","                                claimedKeys.push(keys[ii]);","                            }","                            valueAxes.push(newAxes[i]);","                        }","                        if(!(this._getBaseAttribute(newAxes[i], \"type\")))","                        {","                            this._setBaseAttribute(newAxes[i], \"type\", seriesAxis);","                        }","                        if(!(this._getBaseAttribute(newAxes[i], \"position\")))","                        {","                            this._setBaseAttribute(newAxes[i], \"position\", this._getDefaultAxisPosition(newAxes[i], valueAxes, seriesPosition));","                        }","                    }","                }","            }","        }","        cIndex = Y.Array.indexOf(seriesKeys, catKey);","        if(cIndex > -1)","        {","            seriesKeys.splice(cIndex, 1);","        }","        l = claimedKeys.length;","        for(i = 0; i < l; ++i)","        {","            cIndex = Y.Array.indexOf(seriesKeys, claimedKeys[i]);","            if(cIndex > -1)","            {","                seriesKeys.splice(cIndex, 1);","            }","        }","        if(!newAxes.hasOwnProperty(categoryAxisName))","        {","            newAxes[categoryAxisName] = {};","        }","        if(!(this._getBaseAttribute(newAxes[categoryAxisName], \"keys\")))","        {","            this._setBaseAttribute(newAxes[categoryAxisName], \"keys\", [catKey]);","        }","","        if(!(this._getBaseAttribute(newAxes[categoryAxisName], \"position\")))","        {","            this._setBaseAttribute(newAxes[categoryAxisName], \"position\", categoryPosition);","        }","","        if(!(this._getBaseAttribute(newAxes[categoryAxisName], \"type\")))","        {","            this._setBaseAttribute(newAxes[categoryAxisName], \"type\", this.get(\"categoryType\"));","        }","        if(!newAxes.hasOwnProperty(valueAxisName) && seriesKeys && seriesKeys.length > 0)","        {","            newAxes[valueAxisName] = {keys:seriesKeys};","            valueAxes.push(newAxes[valueAxisName]);","        }","        if(claimedKeys.length > 0)","        {","            if(seriesKeys.length > 0)","            {","                seriesKeys = claimedKeys.concat(seriesKeys);","            }","            else","            {","                seriesKeys = claimedKeys;","            }","        }","        if(newAxes.hasOwnProperty(valueAxisName))","        {","            if(!(this._getBaseAttribute(newAxes[valueAxisName], \"position\")))","            {","                this._setBaseAttribute(newAxes[valueAxisName], \"position\", this._getDefaultAxisPosition(newAxes[valueAxisName], valueAxes, seriesPosition));","            }","            this._setBaseAttribute(newAxes[valueAxisName], \"type\", seriesAxis);","            this._setBaseAttribute(newAxes[valueAxisName], \"keys\", seriesKeys);","        }","        if(!this._seriesKeysExplicitlySet)","        {","            this._seriesKeys = seriesKeys;","        }","        return newAxes;","    },","","    /**","     * Determines the position of an axis when one is not specified.","     *","     * @method _getDefaultAxisPosition","     * @param {Axis} axis `Axis` instance.","     * @param {Array} valueAxes Array of `Axis` instances.","     * @param {String} position Default position depending on the direction of the chart and type of axis.","     * @return String","     * @private","     */","    _getDefaultAxisPosition: function(axis, valueAxes, position)","    {","        var direction = this.get(\"direction\"),","            i = Y.Array.indexOf(valueAxes, axis);","","        if(valueAxes[i - 1] && valueAxes[i - 1].position)","        {","            if(direction == \"horizontal\")","            {","                if(valueAxes[i - 1].position == \"left\")","                {","                    position = \"right\";","                }","                else if(valueAxes[i - 1].position == \"right\")","                {","                    position = \"left\";","                }","            }","            else","            {","                if (valueAxes[i -1].position == \"bottom\")","                {","                    position = \"top\";","                }","                else","                {","                    position = \"bottom\";","                }","            }","        }","        return position;","    },","","","    /**","     * Returns an object literal containing a categoryItem and a valueItem for a given series index. Below is the structure of each:","     *","     * @method getSeriesItems","     * @param {CartesianSeries} series Reference to a series.","     * @param {Number} index Index of the specified item within a series.","     * @return Object An object literal containing the following:","     *","     *  <dl>","     *      <dt>categoryItem</dt><dd>Object containing the following data related to the category axis of the series.","     *  <dl>","     *      <dt>axis</dt><dd>Reference to the category axis of the series.</dd>","     *      <dt>key</dt><dd>Category key for the series.</dd>","     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>","     *  </dl>","     *      </dd>","     *      <dt>valueItem</dt><dd>Object containing the following data related to the category axis of the series.","     *  <dl>","     *      <dt>axis</dt><dd>Reference to the value axis of the series.</dd>","     *      <dt>key</dt><dd>Value key for the series.</dd>","     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>","     *  </dl>","     *      </dd>","     *  </dl>","     */","    getSeriesItems: function(series, index)","    {","        var xAxis = series.get(\"xAxis\"),","            yAxis = series.get(\"yAxis\"),","            xKey = series.get(\"xKey\"),","            yKey = series.get(\"yKey\"),","            categoryItem,","            valueItem;","        if(this.get(\"direction\") == \"vertical\")","        {","            categoryItem = {","                axis:yAxis,","                key:yKey,","                value:yAxis.getKeyValueAt(yKey, index)","            };","            valueItem = {","                axis:xAxis,","                key:xKey,","                value: xAxis.getKeyValueAt(xKey, index)","            };","        }","        else","        {","            valueItem = {","                axis:yAxis,","                key:yKey,","                value:yAxis.getKeyValueAt(yKey, index)","            };","            categoryItem = {","                axis:xAxis,","                key:xKey,","                value: xAxis.getKeyValueAt(xKey, index)","            };","        }","        categoryItem.displayName = series.get(\"categoryDisplayName\");","        valueItem.displayName = series.get(\"valueDisplayName\");","        categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);","        valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);","        return {category:categoryItem, value:valueItem};","    },","","    /**","     * Handler for sizeChanged event.","     *","     * @method _sizeChanged","     * @param {Object} e Event object.","     * @private","     */","    _sizeChanged: function(e)","    {","        if(this._axesCollection)","        {","            var ac = this._axesCollection,","                i = 0,","                l = ac.length;","            for(; i < l; ++i)","            {","                this._addToAxesRenderQueue(ac[i]);","            }","            this._redraw();","        }","    },","","    /**","     * Returns the maximum distance in pixels that the extends outside the top bounds of all vertical axes.","     *","     * @method _getTopOverflow","     * @param {Array} set1 Collection of axes to check.","     * @param {Array} set2 Seconf collection of axes to check.","     * @param {Number} width Width of the axes","     * @return Number","     * @private","     */","    _getTopOverflow: function(set1, set2, height)","    {","        var i = 0,","            len,","            overflow = 0,","            axis;","        if(set1)","        {","            len = set1.length;","            for(; i < len; ++i)","            {","                axis = set1[i];","                overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, height) * 0.5));","            }","        }","        if(set2)","        {","            i = 0;","            len = set2.length;","            for(; i < len; ++i)","            {","                axis = set2[i];","                overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, height) * 0.5));","            }","        }","        return overflow;","    },","","    /**","     * Returns the maximum distance in pixels that the extends outside the right bounds of all horizontal axes.","     *","     * @method _getRightOverflow","     * @param {Array} set1 Collection of axes to check.","     * @param {Array} set2 Seconf collection of axes to check.","     * @param {Number} width Width of the axes","     * @return Number","     * @private","     */","    _getRightOverflow: function(set1, set2, width)","    {","        var i = 0,","            len,","            overflow = 0,","            axis;","        if(set1)","        {","            len = set1.length;","            for(; i < len; ++i)","            {","                axis = set1[i];","                overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, width) * 0.5));","            }","        }","        if(set2)","        {","            i = 0;","            len = set2.length;","            for(; i < len; ++i)","            {","                axis = set2[i];","                overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, width) * 0.5));","            }","        }","        return overflow;","    },","","    /**","     * Returns the maximum distance in pixels that the extends outside the left bounds of all horizontal axes.","     *","     * @method _getLeftOverflow","     * @param {Array} set1 Collection of axes to check.","     * @param {Array} set2 Seconf collection of axes to check.","     * @param {Number} width Width of the axes","     * @return Number","     * @private","     */","    _getLeftOverflow: function(set1, set2, width)","    {","        var i = 0,","            len,","            overflow = 0,","            axis;","        if(set1)","        {","            len = set1.length;","            for(; i < len; ++i)","            {","                axis = set1[i];","                overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, width) * 0.5));","            }","        }","        if(set2)","        {","            i = 0;","            len = set2.length;","            for(; i < len; ++i)","            {","                axis = set2[i];","                overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, width) * 0.5));","            }","        }","        return overflow;","    },","","    /**","     * Returns the maximum distance in pixels that the extends outside the bottom bounds of all vertical axes.","     *","     * @method _getBottomOverflow","     * @param {Array} set1 Collection of axes to check.","     * @param {Array} set2 Seconf collection of axes to check.","     * @param {Number} height Height of the axes","     * @return Number","     * @private","     */","    _getBottomOverflow: function(set1, set2, height)","    {","        var i = 0,","            len,","            overflow = 0,","            axis;","        if(set1)","        {","            len = set1.length;","            for(; i < len; ++i)","            {","                axis = set1[i];","                overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, height) * 0.5));","            }","        }","        if(set2)","        {","            i = 0;","            len = set2.length;","            for(; i < len; ++i)","            {","                axis = set2[i];","                overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get(\"styles\").majorTicks.count, height) * 0.5));","            }","        }","        return overflow;","    },","","    /**","     * Redraws and position all the components of the chart instance.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        if(this._drawing)","        {","            this._callLater = true;","            return;","        }","        this._drawing = true;","        this._callLater = false;","        var w = this.get(\"width\"),","            h = this.get(\"height\"),","            leftPaneWidth = 0,","            rightPaneWidth = 0,","            topPaneHeight = 0,","            bottomPaneHeight = 0,","            leftAxesCollection = this.get(\"leftAxesCollection\"),","            rightAxesCollection = this.get(\"rightAxesCollection\"),","            topAxesCollection = this.get(\"topAxesCollection\"),","            bottomAxesCollection = this.get(\"bottomAxesCollection\"),","            i = 0,","            l,","            axis,","            graphOverflow = \"visible\",","            graph = this.get(\"graph\"),","            topOverflow,","            bottomOverflow,","            leftOverflow,","            rightOverflow,","            graphWidth,","            graphHeight,","            graphX,","            graphY,","            allowContentOverflow = this.get(\"allowContentOverflow\"),","            diff,","            rightAxesXCoords,","            leftAxesXCoords,","            topAxesYCoords,","            bottomAxesYCoords,","            graphRect = {};","        if(leftAxesCollection)","        {","            leftAxesXCoords = [];","            l = leftAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                leftAxesXCoords.unshift(leftPaneWidth);","                leftPaneWidth += leftAxesCollection[i].get(\"width\");","            }","        }","        if(rightAxesCollection)","        {","            rightAxesXCoords = [];","            l = rightAxesCollection.length;","            i = 0;","            for(i = l - 1; i > -1; --i)","            {","                rightPaneWidth += rightAxesCollection[i].get(\"width\");","                rightAxesXCoords.unshift(w - rightPaneWidth);","            }","        }","        if(topAxesCollection)","        {","            topAxesYCoords = [];","            l = topAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                topAxesYCoords.unshift(topPaneHeight);","                topPaneHeight += topAxesCollection[i].get(\"height\");","            }","        }","        if(bottomAxesCollection)","        {","            bottomAxesYCoords = [];","            l = bottomAxesCollection.length;","            for(i = l - 1; i > -1; --i)","            {","                bottomPaneHeight += bottomAxesCollection[i].get(\"height\");","                bottomAxesYCoords.unshift(h - bottomPaneHeight);","            }","        }","","        graphWidth = w - (leftPaneWidth + rightPaneWidth);","        graphHeight = h - (bottomPaneHeight + topPaneHeight);","        graphRect.left = leftPaneWidth;","        graphRect.top = topPaneHeight;","        graphRect.bottom = h - bottomPaneHeight;","        graphRect.right = w - rightPaneWidth;","        if(!allowContentOverflow)","        {","            topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);","            bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);","            leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);","            rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);","","            diff = topOverflow - topPaneHeight;","            if(diff > 0)","            {","                graphRect.top = topOverflow;","                if(topAxesYCoords)","                {","                    i = 0;","                    l = topAxesYCoords.length;","                    for(; i < l; ++i)","                    {","                        topAxesYCoords[i] += diff;","                    }","                }","            }","","            diff = bottomOverflow - bottomPaneHeight;","            if(diff > 0)","            {","                graphRect.bottom = h - bottomOverflow;","                if(bottomAxesYCoords)","                {","                    i = 0;","                    l = bottomAxesYCoords.length;","                    for(; i < l; ++i)","                    {","                        bottomAxesYCoords[i] -= diff;","                    }","                }","            }","","            diff = leftOverflow - leftPaneWidth;","            if(diff > 0)","            {","                graphRect.left = leftOverflow;","                if(leftAxesXCoords)","                {","                    i = 0;","                    l = leftAxesXCoords.length;","                    for(; i < l; ++i)","                    {","                        leftAxesXCoords[i] += diff;","                    }","                }","            }","","            diff = rightOverflow - rightPaneWidth;","            if(diff > 0)","            {","                graphRect.right = w - rightOverflow;","                if(rightAxesXCoords)","                {","                    i = 0;","                    l = rightAxesXCoords.length;","                    for(; i < l; ++i)","                    {","                        rightAxesXCoords[i] -= diff;","                    }","                }","            }","        }","        graphWidth = graphRect.right - graphRect.left;","        graphHeight = graphRect.bottom - graphRect.top;","        graphX = graphRect.left;","        graphY = graphRect.top;","        if(topAxesCollection)","        {","            l = topAxesCollection.length;","            i = 0;","            for(; i < l; i++)","            {","                axis = topAxesCollection[i];","                if(axis.get(\"width\") !== graphWidth)","                {","                    axis.set(\"width\", graphWidth);","                }","                axis.get(\"boundingBox\").setStyle(\"left\", graphX + \"px\");","                axis.get(\"boundingBox\").setStyle(\"top\", topAxesYCoords[i] + \"px\");","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(bottomAxesCollection)","        {","            l = bottomAxesCollection.length;","            i = 0;","            for(; i < l; i++)","            {","                axis = bottomAxesCollection[i];","                if(axis.get(\"width\") !== graphWidth)","                {","                    axis.set(\"width\", graphWidth);","                }","                axis.get(\"boundingBox\").setStyle(\"left\", graphX + \"px\");","                axis.get(\"boundingBox\").setStyle(\"top\", bottomAxesYCoords[i] + \"px\");","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(leftAxesCollection)","        {","            l = leftAxesCollection.length;","            i = 0;","            for(; i < l; ++i)","            {","                axis = leftAxesCollection[i];","                axis.get(\"boundingBox\").setStyle(\"top\", graphY + \"px\");","                axis.get(\"boundingBox\").setStyle(\"left\", leftAxesXCoords[i] + \"px\");","                if(axis.get(\"height\") !== graphHeight)","                {","                    axis.set(\"height\", graphHeight);","                }","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        if(rightAxesCollection)","        {","            l = rightAxesCollection.length;","            i = 0;","            for(; i < l; ++i)","            {","                axis = rightAxesCollection[i];","                axis.get(\"boundingBox\").setStyle(\"top\", graphY + \"px\");","                axis.get(\"boundingBox\").setStyle(\"left\", rightAxesXCoords[i] + \"px\");","                if(axis.get(\"height\") !== graphHeight)","                {","                    axis.set(\"height\", graphHeight);","                }","            }","            if(axis._hasDataOverflow())","            {","                graphOverflow = \"hidden\";","            }","        }","        this._drawing = false;","        if(this._callLater)","        {","            this._redraw();","            return;","        }","        if(graph)","        {","            graph.get(\"boundingBox\").setStyle(\"left\", graphX + \"px\");","            graph.get(\"boundingBox\").setStyle(\"top\", graphY + \"px\");","            graph.set(\"width\", graphWidth);","            graph.set(\"height\", graphHeight);","            graph.get(\"boundingBox\").setStyle(\"overflow\", graphOverflow);","        }","","        if(this._overlay)","        {","            this._overlay.setStyle(\"left\", graphX + \"px\");","            this._overlay.setStyle(\"top\", graphY + \"px\");","            this._overlay.setStyle(\"width\", graphWidth + \"px\");","            this._overlay.setStyle(\"height\", graphHeight + \"px\");","        }","    },","","    /**","     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series and the Graph instance.","     * Removes the tooltip and overlay HTML elements.","     *","     * @method destructor","     * @protected","     */","    destructor: function()","    {","        var graph = this.get(\"graph\"),","            i = 0,","            len,","            seriesCollection = this.get(\"seriesCollection\"),","            axesCollection = this._axesCollection,","            tooltip = this.get(\"tooltip\").node;","        if(this._description)","        {","            this._description.empty();","            this._description.remove(true);","        }","        if(this._liveRegion)","        {","            this._liveRegion.empty();","            this._liveRegion.remove(true);","        }","        len = seriesCollection ? seriesCollection.length : 0;","        for(; i < len; ++i)","        {","            if(seriesCollection[i] instanceof Y.CartesianSeries)","            {","                seriesCollection[i].destroy(true);","            }","        }","        len = axesCollection ? axesCollection.length : 0;","        for(i = 0; i < len; ++i)","        {","            if(axesCollection[i] instanceof Y.Axis)","            {","                axesCollection[i].destroy(true);","            }","        }","        if(graph)","        {","            graph.destroy(true);","        }","        if(tooltip)","        {","            tooltip.empty();","            tooltip.remove(true);","        }","        if(this._overlay)","        {","            this._overlay.empty();","            this._overlay.remove(true);","        }","    },","","    /**","     * Returns the appropriate message based on the key press.","     *","     * @method _getAriaMessage","     * @param {Number} key The keycode that was pressed.","     * @return String","     */","    _getAriaMessage: function(key)","    {","        var msg = \"\",","            series,","            items,","            categoryItem,","            valueItem,","            seriesIndex = this._seriesIndex,","            itemIndex = this._itemIndex,","            seriesCollection = this.get(\"seriesCollection\"),","            len = seriesCollection.length,","            dataLength;","        if(key % 2 === 0)","        {","            if(len > 1)","            {","                if(key === 38)","                {","                    seriesIndex = seriesIndex < 1 ? len - 1 : seriesIndex - 1;","                }","                else if(key === 40)","                {","                    seriesIndex = seriesIndex >= len - 1 ? 0 : seriesIndex + 1;","                }","                this._itemIndex = -1;","            }","            else","            {","                seriesIndex = 0;","            }","            this._seriesIndex = seriesIndex;","            series = this.getSeries(parseInt(seriesIndex, 10));","            msg = series.get(\"valueDisplayName\") + \" series.\";","        }","        else","        {","            if(seriesIndex > -1)","            {","                msg = \"\";","                series = this.getSeries(parseInt(seriesIndex, 10));","            }","            else","            {","                seriesIndex = 0;","                this._seriesIndex = seriesIndex;","                series = this.getSeries(parseInt(seriesIndex, 10));","                msg = series.get(\"valueDisplayName\") + \" series.\";","            }","            dataLength = series._dataLength ? series._dataLength : 0;","            if(key === 37)","            {","                itemIndex = itemIndex > 0 ? itemIndex - 1 : dataLength - 1;","            }","            else if(key === 39)","            {","                itemIndex = itemIndex >= dataLength - 1 ? 0 : itemIndex + 1;","            }","            this._itemIndex = itemIndex;","            items = this.getSeriesItems(series, itemIndex);","            categoryItem = items.category;","            valueItem = items.value;","            if(categoryItem && valueItem && categoryItem.value && valueItem.value)","            {","                msg += categoryItem.displayName + \": \" + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get(\"labelFormat\")]) + \", \";","                msg += valueItem.displayName + \": \" + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get(\"labelFormat\")]) + \", \";","            }","           else","            {","                msg += \"No data available.\";","            }","            msg += (itemIndex + 1) + \" of \" + dataLength + \". \";","        }","        return msg;","    }","}, {","    ATTRS: {","        /**","         * Indicates whether axis labels are allowed to overflow beyond the bounds of the chart's content box.","         *","         * @attribute allowContentOverflow","         * @type Boolean","         */","        allowContentOverflow: {","            value: false","        },","","        /**","         * Style object for the axes.","         *","         * @attribute axesStyles","         * @type Object","         * @private","         */","        axesStyles: {","            getter: function()","            {","                var axes = this.get(\"axes\"),","                    i,","                    styles = this._axesStyles;","                if(axes)","                {","                    for(i in axes)","                    {","                        if(axes.hasOwnProperty(i) && axes[i] instanceof Y.Axis)","                        {","                            if(!styles)","                            {","                                styles = {};","                            }","                            styles[i] = axes[i].get(\"styles\");","                        }","                    }","                }","                return styles;","            },","","            setter: function(val)","            {","                var axes = this.get(\"axes\"),","                    i;","                for(i in val)","                {","                    if(val.hasOwnProperty(i) && axes.hasOwnProperty(i))","                    {","                        this._setBaseAttribute(axes[i], \"styles\", val[i]);","                    }","                }","            }","        },","","        /**","         * Style object for the series","         *","         * @attribute seriesStyles","         * @type Object","         * @private","         */","        seriesStyles: {","            getter: function()","            {","                var styles = this._seriesStyles,","                    graph = this.get(\"graph\"),","                    dict,","                    i;","                if(graph)","                {","                    dict = graph.get(\"seriesDictionary\");","                    if(dict)","                    {","                        styles = {};","                        for(i in dict)","                        {","                            if(dict.hasOwnProperty(i))","                            {","                                styles[i] = dict[i].get(\"styles\");","                            }","                        }","                    }","                }","                return styles;","            },","","            setter: function(val)","            {","                var i,","                    l,","                    s;","","                if(Y_Lang.isArray(val))","                {","                    s = this.get(\"seriesCollection\");","                    i = 0;","                    l = val.length;","","                    for(; i < l; ++i)","                    {","                        this._setBaseAttribute(s[i], \"styles\", val[i]);","                    }","                }","                else","                {","                    for(i in val)","                    {","                        if(val.hasOwnProperty(i))","                        {","                            s = this.getSeries(i);","                            this._setBaseAttribute(s, \"styles\", val[i]);","                        }","                    }","                }","            }","        },","","        /**","         * Styles for the graph.","         *","         * @attribute graphStyles","         * @type Object","         * @private","         */","        graphStyles: {","            getter: function()","            {","                var graph = this.get(\"graph\");","                if(graph)","                {","                    return(graph.get(\"styles\"));","                }","                return this._graphStyles;","            },","","            setter: function(val)","            {","                var graph = this.get(\"graph\");","                this._setBaseAttribute(graph, \"styles\", val);","            }","","        },","","        /**","         * Style properties for the chart. Contains a key indexed hash of the following:","         *  <dl>","         *      <dt>series</dt><dd>A key indexed hash containing references to the `styles` attribute for each series in the chart.","         *      Specific style attributes vary depending on the series:","         *      <ul>","         *          <li><a href=\"AreaSeries.html#attr_styles\">AreaSeries</a></li>","         *          <li><a href=\"BarSeries.html#attr_styles\">BarSeries</a></li>","         *          <li><a href=\"ColumnSeries.html#attr_styles\">ColumnSeries</a></li>","         *          <li><a href=\"ComboSeries.html#attr_styles\">ComboSeries</a></li>","         *          <li><a href=\"LineSeries.html#attr_styles\">LineSeries</a></li>","         *          <li><a href=\"MarkerSeries.html#attr_styles\">MarkerSeries</a></li>","         *          <li><a href=\"SplineSeries.html#attr_styles\">SplineSeries</a></li>","         *      </ul>","         *      </dd>","         *      <dt>axes</dt><dd>A key indexed hash containing references to the `styles` attribute for each axes in the chart. Specific","         *      style attributes can be found in the <a href=\"Axis.html#attr_styles\">Axis</a> class.</dd>","         *      <dt>graph</dt><dd>A reference to the `styles` attribute in the chart. Specific style attributes can be found in the","         *      <a href=\"Graph.html#attr_styles\">Graph</a> class.</dd>","         *  </dl>","         *","         * @attribute styles","         * @type Object","         */","        styles: {","            getter: function()","            {","                var styles = {","                    axes: this.get(\"axesStyles\"),","                    series: this.get(\"seriesStyles\"),","                    graph: this.get(\"graphStyles\")","                };","                return styles;","            },","            setter: function(val)","            {","                if(val.hasOwnProperty(\"axes\"))","                {","                    if(this.get(\"axesStyles\"))","                    {","                        this.set(\"axesStyles\", val.axes);","                    }","                    else","                    {","                        this._axesStyles = val.axes;","                    }","                }","                if(val.hasOwnProperty(\"series\"))","                {","                    if(this.get(\"seriesStyles\"))","                    {","                        this.set(\"seriesStyles\", val.series);","                    }","                    else","                    {","                        this._seriesStyles = val.series;","                    }","                }","                if(val.hasOwnProperty(\"graph\"))","                {","                    this.set(\"graphStyles\", val.graph);","                }","            }","        },","","        /**","         * Axes to appear in the chart. This can be a key indexed hash of axis instances or object literals","         * used to construct the appropriate axes.","         *","         * @attribute axes","         * @type Object","         */","        axes: {","            valueFn: \"_getDefaultAxes\",","","            setter: function(val)","            {","                if(this.get(\"dataProvider\"))","                {","                    val = this._setAxes(val);","                }","                return val;","            }","        },","","        /**","         * Collection of series to appear on the chart. This can be an array of Series instances or object literals","         * used to construct the appropriate series.","         *","         * @attribute seriesCollection","         * @type Array","         */","        seriesCollection: {","            valueFn: \"_getDefaultSeriesCollection\",","","            setter: function(val)","            {","                if(this.get(\"dataProvider\"))","                {","                    val = this._parseSeriesCollection(val);","                }","                return val;","            }","        },","","        /**","         * Reference to the left-aligned axes for the chart.","         *","         * @attribute leftAxesCollection","         * @type Array","         * @private","         */","        leftAxesCollection: {},","","        /**","         * Reference to the bottom-aligned axes for the chart.","         *","         * @attribute bottomAxesCollection","         * @type Array","         * @private","         */","        bottomAxesCollection: {},","","        /**","         * Reference to the right-aligned axes for the chart.","         *","         * @attribute rightAxesCollection","         * @type Array","         * @private","         */","        rightAxesCollection: {},","","        /**","         * Reference to the top-aligned axes for the chart.","         *","         * @attribute topAxesCollection","         * @type Array","         * @private","         */","        topAxesCollection: {},","","        /**","         * Indicates whether or not the chart is stacked.","         *","         * @attribute stacked","         * @type Boolean","         */","        stacked: {","            value: false","        },","","        /**","         * Direction of chart's category axis when there is no series collection specified. Charts can","         * be horizontal or vertical. When the chart type is column, the chart is horizontal.","         * When the chart type is bar, the chart is vertical.","         *","         * @attribute direction","         * @type String","         */","        direction: {","            getter: function()","            {","                var type = this.get(\"type\");","                if(type == \"bar\")","                {","                    return \"vertical\";","                }","                else if(type == \"column\")","                {","                    return \"horizontal\";","                }","                return this._direction;","            },","","            setter: function(val)","            {","                this._direction = val;","                return this._direction;","            }","        },","","        /**","         * Indicates whether or not an area is filled in a combo chart.","         *","         * @attribute showAreaFill","         * @type Boolean","         */","        showAreaFill: {},","","        /**","         * Indicates whether to display markers in a combo chart.","         *","         * @attribute showMarkers","         * @type Boolean","         */","        showMarkers:{},","","        /**","         * Indicates whether to display lines in a combo chart.","         *","         * @attribute showLines","         * @type Boolean","         */","        showLines:{},","","        /**","         * Indicates the key value used to identify a category axis in the `axes` hash. If","         * not specified, the categoryKey attribute value will be used.","         *","         * @attribute categoryAxisName","         * @type String","         */","        categoryAxisName: {","        },","","        /**","         * Indicates the key value used to identify a the series axis when an axis not generated.","         *","         * @attribute valueAxisName","         * @type String","         */","        valueAxisName: {","            value: \"values\"","        },","","        /**","         * Reference to the horizontalGridlines for the chart.","         *","         * @attribute horizontalGridlines","         * @type Gridlines","         */","        horizontalGridlines: {","            getter: function()","            {","                var graph = this.get(\"graph\");","                if(graph)","                {","                    return graph.get(\"horizontalGridlines\");","                }","                return this._horizontalGridlines;","            },","            setter: function(val)","            {","                var graph = this.get(\"graph\");","                if(val && !Y_Lang.isObject(val))","                {","                    val = {};","                }","                if(graph)","                {","                    graph.set(\"horizontalGridlines\", val);","                }","                else","                {","                    this._horizontalGridlines = val;","                }","            }","        },","","        /**","         * Reference to the verticalGridlines for the chart.","         *","         * @attribute verticalGridlines","         * @type Gridlines","         */","        verticalGridlines: {","            getter: function()","            {","                var graph = this.get(\"graph\");","                if(graph)","                {","                    return graph.get(\"verticalGridlines\");","                }","                return this._verticalGridlines;","            },","            setter: function(val)","            {","                var graph = this.get(\"graph\");","                if(val && !Y_Lang.isObject(val))","                {","                    val = {};","                }","                if(graph)","                {","                    graph.set(\"verticalGridlines\", val);","                }","                else","                {","                    this._verticalGridlines = val;","                }","            }","        },","","        /**","         * Type of chart when there is no series collection specified.","         *","         * @attribute type","         * @type String","         */","        type: {","            getter: function()","            {","                if(this.get(\"stacked\"))","                {","                    return \"stacked\" + this._type;","                }","                return this._type;","            },","","            setter: function(val)","            {","                if(this._type == \"bar\")","                {","                    if(val != \"bar\")","                    {","                        this.set(\"direction\", \"horizontal\");","                    }","                }","                else","                {","                    if(val == \"bar\")","                    {","                        this.set(\"direction\", \"vertical\");","                    }","                }","                this._type = val;","                return this._type;","            }","        },","","        /**","         * Reference to the category axis used by the chart.","         *","         * @attribute categoryAxis","         * @type Axis","         */","        categoryAxis:{}","    }","});","/**"," * The PieChart class creates a pie chart"," *"," * @class PieChart"," * @extends ChartBase"," * @constructor"," * @submodule charts-base"," */","Y.PieChart = Y.Base.create(\"pieChart\", Y.Widget, [Y.ChartBase], {","    /**","     * Calculates and returns a `seriesCollection`.","     *","     * @method _getSeriesCollection","     * @return Array","     * @private","     */","    _getSeriesCollection: function()","    {","        if(this._seriesCollection)","        {","            return this._seriesCollection;","        }","        var axes = this.get(\"axes\"),","            sc = [],","            seriesKeys,","            i = 0,","            l,","            type = this.get(\"type\"),","            key,","            catAxis = \"categoryAxis\",","            catKey = \"categoryKey\",","            valAxis = \"valueAxis\",","            seriesKey = \"valueKey\";","        if(axes)","        {","            seriesKeys = axes.values.get(\"keyCollection\");","            key = axes.category.get(\"keyCollection\")[0];","            l = seriesKeys.length;","            for(; i < l; ++i)","            {","                sc[i] = {type:type};","                sc[i][catAxis] = \"category\";","                sc[i][valAxis] = \"values\";","                sc[i][catKey] = key;","                sc[i][seriesKey] = seriesKeys[i];","            }","        }","        this._seriesCollection = sc;","        return sc;","    },","","    /**","     * Creates `Axis` instances.","     *","     * @method _parseAxes","     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.","     * @return Object","     * @private","     */","    _parseAxes: function(hash)","    {","        if(!this._axes)","        {","            this._axes = {};","        }","        var i, pos, axis, dh, config, axisClass,","            type = this.get(\"type\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            node = Y.Node.one(this._parentNode);","        if(!w)","        {","            this.set(\"width\", node.get(\"offsetWidth\"));","            w = this.get(\"width\");","        }","        if(!h)","        {","            this.set(\"height\", node.get(\"offsetHeight\"));","            h = this.get(\"height\");","        }","        for(i in hash)","        {","            if(hash.hasOwnProperty(i))","            {","                dh = hash[i];","                pos = type == \"pie\" ? \"none\" : dh.position;","                axisClass = this._getAxisClass(dh.type);","                config = {dataProvider:this.get(\"dataProvider\")};","                if(dh.hasOwnProperty(\"roundingUnit\"))","                {","                    config.roundingUnit = dh.roundingUnit;","                }","                config.keys = dh.keys;","                config.width = w;","                config.height = h;","                config.position = pos;","                config.styles = dh.styles;","                axis = new axisClass(config);","                axis.on(\"axisRendered\", Y.bind(this._itemRendered, this));","                this._axes[i] = axis;","            }","        }","    },","","    /**","     * Adds axes to the chart.","     *","     * @method _addAxes","     * @private","     */","    _addAxes: function()","    {","        var axes = this.get(\"axes\"),","            i,","            axis,","            p;","        if(!axes)","        {","            this.set(\"axes\", this._getDefaultAxes());","            axes = this.get(\"axes\");","        }","        if(!this._axesCollection)","        {","            this._axesCollection = [];","        }","        for(i in axes)","        {","            if(axes.hasOwnProperty(i))","            {","                axis = axes[i];","                p = axis.get(\"position\");","                if(!this.get(p + \"AxesCollection\"))","                {","                    this.set(p + \"AxesCollection\", [axis]);","                }","                else","                {","                    this.get(p + \"AxesCollection\").push(axis);","                }","                this._axesCollection.push(axis);","            }","        }","    },","","    /**","     * Renders the Graph.","     *","     * @method _addSeries","     * @private","     */","    _addSeries: function()","    {","        var graph = this.get(\"graph\"),","            seriesCollection = this.get(\"seriesCollection\");","        this._parseSeriesAxes(seriesCollection);","        graph.set(\"showBackground\", false);","        graph.set(\"width\", this.get(\"width\"));","        graph.set(\"height\", this.get(\"height\"));","        graph.set(\"seriesCollection\", seriesCollection);","        this._seriesCollection = graph.get(\"seriesCollection\");","        graph.render(this.get(\"contentBox\"));","    },","","    /**","     * Parse and sets the axes for the chart.","     *","     * @method _parseSeriesAxes","     * @param {Array} c A collection `PieSeries` instance.","     * @private","     */","    _parseSeriesAxes: function(c)","    {","        var i = 0,","            len = c.length,","            s,","            axes = this.get(\"axes\"),","            axis;","        for(; i < len; ++i)","        {","            s = c[i];","            if(s)","            {","                //If series is an actual series instance,","                //replace axes attribute string ids with axes","                if(s instanceof Y.PieSeries)","                {","                    axis = s.get(\"categoryAxis\");","                    if(axis && !(axis instanceof Y.Axis))","                    {","                        s.set(\"categoryAxis\", axes[axis]);","                    }","                    axis = s.get(\"valueAxis\");","                    if(axis && !(axis instanceof Y.Axis))","                    {","                        s.set(\"valueAxis\", axes[axis]);","                    }","                    continue;","                }","                s.categoryAxis = axes.category;","                s.valueAxis = axes.values;","                if(!s.type)","                {","                    s.type = this.get(\"type\");","                }","            }","        }","    },","","    /**","     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.","     *","     * @method _getDefaultAxes","     * @return Object","     * @private","     */","    _getDefaultAxes: function()","    {","        var catKey = this.get(\"categoryKey\"),","            seriesKeys = this.get(\"seriesKeys\").concat(),","            seriesAxis = \"numeric\";","        return {","            values:{","                keys:seriesKeys,","                type:seriesAxis","            },","            category:{","                keys:[catKey],","                type:this.get(\"categoryType\")","            }","        };","    },","","    /**","     * Returns an object literal containing a categoryItem and a valueItem for a given series index.","     *","     * @method getSeriesItem","     * @param series Reference to a series.","     * @param index Index of the specified item within a series.","     * @return Object","     */","    getSeriesItems: function(series, index)","    {","        var categoryItem = {","                axis: series.get(\"categoryAxis\"),","                key: series.get(\"categoryKey\"),","                displayName: series.get(\"categoryDisplayName\")","            },","            valueItem = {","                axis: series.get(\"valueAxis\"),","                key: series.get(\"valueKey\"),","                displayName: series.get(\"valueDisplayName\")","            };","        categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);","        valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);","        return {category:categoryItem, value:valueItem};","    },","","    /**","     * Handler for sizeChanged event.","     *","     * @method _sizeChanged","     * @param {Object} e Event object.","     * @private","     */","    _sizeChanged: function(e)","    {","        this._redraw();","    },","","    /**","     * Redraws the chart instance.","     *","     * @method _redraw","     * @private","     */","    _redraw: function()","    {","        var graph = this.get(\"graph\"),","            w = this.get(\"width\"),","            h = this.get(\"height\"),","            dimension;","        if(graph)","        {","            dimension = Math.min(w, h);","            graph.set(\"width\", dimension);","            graph.set(\"height\", dimension);","        }","    },","","    /**","     * Formats tooltip text for a pie chart.","     *","     * @method _tooltipLabelFunction","     * @param {Object} categoryItem An object containing the following:","     *  <dl>","     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>","     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>","     *      <dt>key</dt><dd>The key of the category.</dd>","     *      <dt>value</dt><dd>The value of the category</dd>","     *  </dl>","     * @param {Object} valueItem An object containing the following:","     *  <dl>","     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>","     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>","     *      <dt>key</dt><dd>The key for the series.</dd>","     *      <dt>value</dt><dd>The value for the series item.</dd>","     *  </dl>","     * @param {Number} itemIndex The index of the item within the series.","     * @param {CartesianSeries} series The `PieSeries` instance of the item.","     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.","     * @return {HTML}","     * @private","     */","    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)","    {","        var msg = DOCUMENT.createElement(\"div\"),","            total = series.getTotalValues(),","            pct = Math.round((valueItem.value / total) * 10000)/100;","        msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName +","        \": \" + categoryItem.axis.get(\"labelFunction\").apply(this, [categoryItem.value, categoryItem.axis.get(\"labelFormat\")])));","        msg.appendChild(DOCUMENT.createElement(\"br\"));","        msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName +","        \": \" + valueItem.axis.get(\"labelFunction\").apply(this, [valueItem.value, valueItem.axis.get(\"labelFormat\")])));","        msg.appendChild(DOCUMENT.createElement(\"br\"));","        msg.appendChild(DOCUMENT.createTextNode(pct + \"%\"));","        return msg;","    },","","    /**","     * Returns the appropriate message based on the key press.","     *","     * @method _getAriaMessage","     * @param {Number} key The keycode that was pressed.","     * @return String","     */","    _getAriaMessage: function(key)","    {","        var msg = \"\",","            categoryItem,","            items,","            series,","            valueItem,","            seriesIndex = 0,","            itemIndex = this._itemIndex,","            seriesCollection = this.get(\"seriesCollection\"),","            len,","            total,","            pct,","            markers;","        series = this.getSeries(parseInt(seriesIndex, 10));","        markers = series.get(\"markers\");","        len = markers && markers.length ? markers.length : 0;","        if(key === 37)","        {","            itemIndex = itemIndex > 0 ? itemIndex - 1 : len - 1;","        }","        else if(key === 39)","        {","            itemIndex = itemIndex >= len - 1 ? 0 : itemIndex + 1;","        }","        this._itemIndex = itemIndex;","        items = this.getSeriesItems(series, itemIndex);","        categoryItem = items.category;","        valueItem = items.value;","        total = series.getTotalValues();","        pct = Math.round((valueItem.value / total) * 10000)/100;","        if(categoryItem && valueItem)","        {","            msg += categoryItem.displayName + \": \" + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get(\"labelFormat\")]) + \", \";","            msg += valueItem.displayName + \": \" + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get(\"labelFormat\")]) + \", \";","            msg += \"Percent of total \" + valueItem.displayName + \": \" + pct + \"%,\";","        }","        else","        {","            msg += \"No data available,\";","        }","        msg += (itemIndex + 1) + \" of \" + len + \". \";","        return msg;","    }","}, {","    ATTRS: {","        /**","         * Sets the aria description for the chart.","         *","         * @attribute ariaDescription","         * @type String","         */","        ariaDescription: {","            value: \"Use the left and right keys to navigate through items.\",","","            setter: function(val)","            {","                if(this._description)","                {","                    this._description.setContent(\"\");","                    this._description.appendChild(DOCUMENT.createTextNode(val));","                }","                return val;","            }","        },","","        /**","         * Axes to appear in the chart.","         *","         * @attribute axes","         * @type Object","         */","        axes: {","            getter: function()","            {","                return this._axes;","            },","","            setter: function(val)","            {","                this._parseAxes(val);","            }","        },","","        /**","         * Collection of series to appear on the chart. This can be an array of Series instances or object literals","         * used to describe a Series instance.","         *","         * @attribute seriesCollection","         * @type Array","         */","        seriesCollection: {","            getter: function()","            {","                return this._getSeriesCollection();","            },","","            setter: function(val)","            {","                return this._setSeriesCollection(val);","            }","        },","","        /**","         * Type of chart when there is no series collection specified.","         *","         * @attribute type","         * @type String","         */","        type: {","            value: \"pie\"","        }","    }","});","/**"," * The Chart class is the basic application used to create a chart."," *"," * @class Chart"," * @constructor"," * @submodule charts-base"," */","function Chart(cfg)","{","    if(cfg.type != \"pie\")","    {","        return new Y.CartesianChart(cfg);","    }","    else","    {","        return new Y.PieChart(cfg);","    }","}","Y.Chart = Chart;","","","}, '@VERSION@', {","    \"requires\": [","        \"dom\",","        \"event-mouseenter\",","        \"event-touch\",","        \"graphics-group\",","        \"axes\",","        \"series-cartesian\",","        \"series-pie\",","        \"series-cartesian-stacked\"","    ]","});"];
_yuitest_coverage["build/charts-base/charts-base.js"].lines = {"1":0,"9":0,"28":0,"46":0,"47":0,"49":0,"61":0,"63":0,"75":0,"91":0,"93":0,"95":0,"97":0,"99":0,"103":0,"105":0,"106":0,"107":0,"108":0,"109":0,"114":0,"116":0,"118":0,"132":0,"136":0,"138":0,"139":0,"144":0,"159":0,"160":0,"175":0,"176":0,"189":0,"196":0,"248":0,"255":0,"256":0,"257":0,"258":0,"259":0,"260":0,"269":0,"278":0,"280":0,"281":0,"282":0,"283":0,"284":0,"285":0,"286":0,"287":0,"288":0,"289":0,"291":0,"293":0,"294":0,"296":0,"299":0,"301":0,"303":0,"305":0,"327":0,"329":0,"331":0,"333":0,"345":0,"347":0,"349":0,"351":0,"364":0,"366":0,"368":0,"398":0,"400":0,"402":0,"406":0,"407":0,"408":0,"409":0,"411":0,"412":0,"414":0,"415":0,"417":0,"419":0,"420":0,"422":0,"423":0,"424":0,"437":0,"442":0,"444":0,"446":0,"447":0,"449":0,"451":0,"452":0,"453":0,"454":0,"455":0,"456":0,"457":0,"458":0,"471":0,"477":0,"478":0,"480":0,"482":0,"483":0,"484":0,"485":0,"486":0,"487":0,"488":0,"489":0,"490":0,"491":0,"492":0,"493":0,"495":0,"567":0,"568":0,"570":0,"574":0,"576":0,"588":0,"593":0,"613":0,"615":0,"616":0,"617":0,"618":0,"619":0,"631":0,"638":0,"640":0,"642":0,"644":0,"645":0,"647":0,"648":0,"651":0,"653":0,"655":0,"657":0,"659":0,"661":0,"663":0,"674":0,"676":0,"677":0,"679":0,"683":0,"684":0,"685":0,"686":0,"687":0,"688":0,"689":0,"691":0,"692":0,"694":0,"695":0,"698":0,"699":0,"701":0,"714":0,"717":0,"719":0,"721":0,"723":0,"724":0,"726":0,"728":0,"742":0,"754":0,"765":0,"767":0,"768":0,"770":0,"772":0,"773":0,"775":0,"777":0,"778":0,"793":0,"794":0,"808":0,"809":0,"822":0,"823":0,"837":0,"842":0,"843":0,"870":0,"886":0,"889":0,"891":0,"893":0,"895":0,"896":0,"897":0,"899":0,"901":0,"905":0,"907":0,"909":0,"912":0,"913":0,"930":0,"933":0,"935":0,"937":0,"939":0,"940":0,"941":0,"943":0,"945":0,"949":0,"951":0,"953":0,"956":0,"957":0,"972":0,"974":0,"975":0,"976":0,"978":0,"994":0,"996":0,"997":0,"998":0,"1000":0,"1016":0,"1018":0,"1019":0,"1020":0,"1022":0,"1072":0,"1074":0,"1086":0,"1087":0,"1089":0,"1091":0,"1096":0,"1097":0,"1099":0,"1101":0,"1116":0,"1121":0,"1122":0,"1123":0,"1138":0,"1139":0,"1141":0,"1143":0,"1158":0,"1160":0,"1161":0,"1163":0,"1242":0,"1319":0,"1329":0,"1331":0,"1333":0,"1346":0,"1347":0,"1349":0,"1362":0,"1366":0,"1367":0,"1369":0,"1381":0,"1383":0,"1385":0,"1387":0,"1391":0,"1394":0,"1409":0,"1411":0,"1413":0,"1415":0,"1426":0,"1429":0,"1431":0,"1433":0,"1465":0,"1467":0,"1474":0,"1476":0,"1477":0,"1479":0,"1481":0,"1483":0,"1485":0,"1506":0,"1518":0,"1550":0,"1551":0,"1552":0,"1553":0,"1562":0,"1566":0,"1567":0,"1568":0,"1569":0,"1570":0,"1572":0,"1574":0,"1586":0,"1589":0,"1590":0,"1591":0,"1592":0,"1593":0,"1594":0,"1595":0,"1596":0,"1597":0,"1598":0,"1599":0,"1600":0,"1601":0,"1602":0,"1603":0,"1604":0,"1616":0,"1619":0,"1620":0,"1621":0,"1622":0,"1623":0,"1624":0,"1633":0,"1642":0,"1643":0,"1644":0,"1645":0,"1646":0,"1655":0,"1656":0,"1659":0,"1661":0,"1662":0,"1663":0,"1664":0,"1667":0,"1670":0,"1671":0,"1672":0,"1674":0,"1676":0,"1678":0,"1680":0,"1682":0,"1684":0,"1685":0,"1691":0,"1692":0,"1693":0,"1694":0,"1695":0,"1696":0,"1699":0,"1701":0,"1703":0,"1707":0,"1708":0,"1711":0,"1713":0,"1714":0,"1715":0,"1717":0,"1718":0,"1723":0,"1724":0,"1727":0,"1729":0,"1733":0,"1735":0,"1737":0,"1739":0,"1741":0,"1742":0,"1744":0,"1747":0,"1762":0,"1775":0,"1777":0,"1779":0,"1781":0,"1783":0,"1784":0,"1879":0,"1903":0,"1907":0,"1908":0,"1909":0,"1911":0,"1912":0,"1914":0,"1915":0,"1917":0,"1919":0,"1921":0,"1922":0,"1924":0,"1926":0,"1928":0,"1944":0,"1945":0,"1947":0,"1951":0,"1966":0,"1968":0,"1970":0,"1971":0,"1972":0,"1973":0,"1974":0,"1987":0,"1992":0,"1994":0,"1995":0,"2006":0,"2008":0,"2009":0,"2010":0,"2011":0,"2012":0,"2023":0,"2027":0,"2029":0,"2031":0,"2032":0,"2033":0,"2046":0,"2060":0,"2062":0,"2063":0,"2064":0,"2066":0,"2068":0,"2070":0,"2074":0,"2076":0,"2078":0,"2081":0,"2083":0,"2095":0,"2106":0,"2108":0,"2112":0,"2115":0,"2116":0,"2119":0,"2120":0,"2121":0,"2122":0,"2123":0,"2124":0,"2125":0,"2126":0,"2127":0,"2128":0,"2129":0,"2130":0,"2131":0,"2132":0,"2133":0,"2134":0,"2135":0,"2136":0,"2160":0,"2168":0,"2170":0,"2171":0,"2173":0,"2175":0,"2178":0,"2180":0,"2181":0,"2183":0,"2184":0,"2185":0,"2186":0,"2187":0,"2188":0,"2189":0,"2191":0,"2193":0,"2196":0,"2225":0,"2228":0,"2229":0,"2230":0,"2232":0,"2234":0,"2235":0,"2236":0,"2237":0,"2238":0,"2240":0,"2242":0,"2243":0,"2255":0,"2257":0,"2261":0,"2263":0,"2265":0,"2282":0,"2283":0,"2285":0,"2287":0,"2289":0,"2291":0,"2293":0,"2295":0,"2307":0,"2312":0,"2314":0,"2315":0,"2317":0,"2319":0,"2323":0,"2336":0,"2340":0,"2342":0,"2344":0,"2345":0,"2347":0,"2349":0,"2352":0,"2355":0,"2364":0,"2371":0,"2377":0,"2378":0,"2379":0,"2380":0,"2381":0,"2382":0,"2384":0,"2387":0,"2388":0,"2390":0,"2391":0,"2392":0,"2393":0,"2394":0,"2395":0,"2396":0,"2397":0,"2398":0,"2400":0,"2401":0,"2414":0,"2444":0,"2445":0,"2447":0,"2448":0,"2452":0,"2453":0,"2455":0,"2456":0,"2458":0,"2459":0,"2461":0,"2463":0,"2465":0,"2468":0,"2470":0,"2471":0,"2473":0,"2475":0,"2476":0,"2479":0,"2480":0,"2482":0,"2483":0,"2484":0,"2485":0,"2487":0,"2489":0,"2491":0,"2493":0,"2495":0,"2496":0,"2497":0,"2498":0,"2502":0,"2533":0,"2535":0,"2549":0,"2581":0,"2583":0,"2585":0,"2587":0,"2600":0,"2601":0,"2603":0,"2604":0,"2606":0,"2619":0,"2621":0,"2623":0,"2625":0,"2638":0,"2658":0,"2659":0,"2661":0,"2662":0,"2663":0,"2664":0,"2668":0,"2669":0,"2670":0,"2671":0,"2673":0,"2674":0,"2676":0,"2677":0,"2678":0,"2680":0,"2681":0,"2683":0,"2684":0,"2685":0,"2689":0,"2694":0,"2697":0,"2699":0,"2700":0,"2702":0,"2703":0,"2704":0,"2705":0,"2707":0,"2709":0,"2712":0,"2714":0,"2716":0,"2717":0,"2719":0,"2720":0,"2722":0,"2723":0,"2726":0,"2727":0,"2728":0,"2729":0,"2731":0,"2732":0,"2734":0,"2736":0,"2738":0,"2740":0,"2742":0,"2744":0,"2746":0,"2749":0,"2751":0,"2753":0,"2754":0,"2755":0,"2757":0,"2769":0,"2774":0,"2776":0,"2777":0,"2779":0,"2782":0,"2784":0,"2785":0,"2787":0,"2802":0,"2805":0,"2806":0,"2819":0,"2823":0,"2825":0,"2827":0,"2831":0,"2833":0,"2835":0,"2836":0,"2838":0,"2839":0,"2845":0,"2861":0,"2863":0,"2865":0,"2867":0,"2869":0,"2885":0,"2887":0,"2891":0,"2905":0,"2934":0,"2936":0,"2938":0,"2939":0,"2941":0,"2945":0,"2946":0,"2947":0,"2948":0,"2950":0,"2952":0,"2954":0,"2955":0,"2957":0,"2959":0,"2960":0,"2962":0,"2964":0,"2969":0,"2971":0,"2974":0,"2976":0,"2977":0,"2979":0,"2981":0,"2982":0,"2984":0,"2986":0,"2989":0,"2993":0,"2994":0,"2995":0,"2999":0,"3001":0,"3002":0,"3004":0,"3006":0,"3010":0,"3021":0,"3028":0,"3030":0,"3032":0,"3034":0,"3036":0,"3037":0,"3039":0,"3041":0,"3042":0,"3044":0,"3046":0,"3047":0,"3049":0,"3050":0,"3051":0,"3053":0,"3057":0,"3059":0,"3060":0,"3062":0,"3064":0,"3078":0,"3080":0,"3092":0,"3104":0,"3106":0,"3107":0,"3109":0,"3111":0,"3113":0,"3115":0,"3117":0,"3121":0,"3123":0,"3125":0,"3127":0,"3129":0,"3132":0,"3134":0,"3136":0,"3138":0,"3140":0,"3144":0,"3146":0,"3148":0,"3150":0,"3152":0,"3166":0,"3167":0,"3169":0,"3171":0,"3184":0,"3203":0,"3205":0,"3206":0,"3210":0,"3211":0,"3213":0,"3215":0,"3217":0,"3219":0,"3220":0,"3221":0,"3222":0,"3224":0,"3225":0,"3226":0,"3228":0,"3229":0,"3231":0,"3233":0,"3235":0,"3239":0,"3240":0,"3242":0,"3243":0,"3245":0,"3247":0,"3249":0,"3251":0,"3253":0,"3255":0,"3261":0,"3262":0,"3264":0,"3266":0,"3267":0,"3269":0,"3270":0,"3272":0,"3275":0,"3277":0,"3279":0,"3281":0,"3284":0,"3286":0,"3289":0,"3291":0,"3293":0,"3295":0,"3296":0,"3298":0,"3300":0,"3302":0,"3306":0,"3309":0,"3311":0,"3313":0,"3315":0,"3316":0,"3318":0,"3320":0,"3322":0,"3337":0,"3340":0,"3342":0,"3344":0,"3346":0,"3348":0,"3350":0,"3355":0,"3357":0,"3361":0,"3365":0,"3396":0,"3402":0,"3404":0,"3409":0,"3417":0,"3422":0,"3428":0,"3429":0,"3430":0,"3431":0,"3432":0,"3444":0,"3446":0,"3449":0,"3451":0,"3453":0,"3469":0,"3473":0,"3475":0,"3476":0,"3478":0,"3479":0,"3482":0,"3484":0,"3485":0,"3486":0,"3488":0,"3489":0,"3492":0,"3507":0,"3511":0,"3513":0,"3514":0,"3516":0,"3517":0,"3520":0,"3522":0,"3523":0,"3524":0,"3526":0,"3527":0,"3530":0,"3545":0,"3549":0,"3551":0,"3552":0,"3554":0,"3555":0,"3558":0,"3560":0,"3561":0,"3562":0,"3564":0,"3565":0,"3568":0,"3583":0,"3587":0,"3589":0,"3590":0,"3592":0,"3593":0,"3596":0,"3598":0,"3599":0,"3600":0,"3602":0,"3603":0,"3606":0,"3617":0,"3619":0,"3620":0,"3622":0,"3623":0,"3624":0,"3654":0,"3656":0,"3657":0,"3658":0,"3660":0,"3661":0,"3664":0,"3666":0,"3667":0,"3668":0,"3669":0,"3671":0,"3672":0,"3675":0,"3677":0,"3678":0,"3679":0,"3681":0,"3682":0,"3685":0,"3687":0,"3688":0,"3689":0,"3691":0,"3692":0,"3696":0,"3697":0,"3698":0,"3699":0,"3700":0,"3701":0,"3702":0,"3704":0,"3705":0,"3706":0,"3707":0,"3709":0,"3710":0,"3712":0,"3713":0,"3715":0,"3716":0,"3717":0,"3719":0,"3724":0,"3725":0,"3727":0,"3728":0,"3730":0,"3731":0,"3732":0,"3734":0,"3739":0,"3740":0,"3742":0,"3743":0,"3745":0,"3746":0,"3747":0,"3749":0,"3754":0,"3755":0,"3757":0,"3758":0,"3760":0,"3761":0,"3762":0,"3764":0,"3769":0,"3770":0,"3771":0,"3772":0,"3773":0,"3775":0,"3776":0,"3777":0,"3779":0,"3780":0,"3782":0,"3784":0,"3785":0,"3787":0,"3789":0,"3792":0,"3794":0,"3795":0,"3796":0,"3798":0,"3799":0,"3801":0,"3803":0,"3804":0,"3806":0,"3808":0,"3811":0,"3813":0,"3814":0,"3815":0,"3817":0,"3818":0,"3819":0,"3820":0,"3822":0,"3825":0,"3827":0,"3830":0,"3832":0,"3833":0,"3834":0,"3836":0,"3837":0,"3838":0,"3839":0,"3841":0,"3844":0,"3846":0,"3849":0,"3850":0,"3852":0,"3853":0,"3855":0,"3857":0,"3858":0,"3859":0,"3860":0,"3861":0,"3864":0,"3866":0,"3867":0,"3868":0,"3869":0,"3882":0,"3888":0,"3890":0,"3891":0,"3893":0,"3895":0,"3896":0,"3898":0,"3899":0,"3901":0,"3903":0,"3906":0,"3907":0,"3909":0,"3911":0,"3914":0,"3916":0,"3918":0,"3920":0,"3921":0,"3923":0,"3925":0,"3926":0,"3939":0,"3949":0,"3951":0,"3953":0,"3955":0,"3957":0,"3959":0,"3961":0,"3965":0,"3967":0,"3968":0,"3969":0,"3973":0,"3975":0,"3976":0,"3980":0,"3981":0,"3982":0,"3983":0,"3985":0,"3986":0,"3988":0,"3990":0,"3992":0,"3994":0,"3995":0,"3996":0,"3997":0,"3998":0,"4000":0,"4001":0,"4005":0,"4007":0,"4009":0,"4033":0,"4036":0,"4038":0,"4040":0,"4042":0,"4044":0,"4046":0,"4050":0,"4055":0,"4057":0,"4059":0,"4061":0,"4077":0,"4081":0,"4083":0,"4084":0,"4086":0,"4087":0,"4089":0,"4091":0,"4096":0,"4101":0,"4105":0,"4107":0,"4108":0,"4109":0,"4111":0,"4113":0,"4118":0,"4120":0,"4122":0,"4123":0,"4140":0,"4141":0,"4143":0,"4145":0,"4150":0,"4151":0,"4183":0,"4188":0,"4192":0,"4194":0,"4196":0,"4200":0,"4203":0,"4205":0,"4207":0,"4211":0,"4214":0,"4216":0,"4233":0,"4235":0,"4237":0,"4253":0,"4255":0,"4257":0,"4318":0,"4319":0,"4321":0,"4323":0,"4325":0,"4327":0,"4332":0,"4333":0,"4390":0,"4391":0,"4393":0,"4395":0,"4399":0,"4400":0,"4402":0,"4404":0,"4406":0,"4410":0,"4424":0,"4425":0,"4427":0,"4429":0,"4433":0,"4434":0,"4436":0,"4438":0,"4440":0,"4444":0,"4458":0,"4460":0,"4462":0,"4467":0,"4469":0,"4471":0,"4476":0,"4478":0,"4481":0,"4482":0,"4503":0,"4513":0,"4515":0,"4517":0,"4528":0,"4530":0,"4531":0,"4532":0,"4533":0,"4535":0,"4536":0,"4537":0,"4538":0,"4539":0,"4542":0,"4543":0,"4556":0,"4558":0,"4560":0,"4565":0,"4567":0,"4568":0,"4570":0,"4572":0,"4573":0,"4575":0,"4577":0,"4579":0,"4580":0,"4581":0,"4582":0,"4583":0,"4585":0,"4587":0,"4588":0,"4589":0,"4590":0,"4591":0,"4592":0,"4593":0,"4594":0,"4607":0,"4611":0,"4613":0,"4614":0,"4616":0,"4618":0,"4620":0,"4622":0,"4624":0,"4625":0,"4626":0,"4628":0,"4632":0,"4634":0,"4647":0,"4649":0,"4650":0,"4651":0,"4652":0,"4653":0,"4654":0,"4655":0,"4667":0,"4672":0,"4674":0,"4675":0,"4679":0,"4681":0,"4682":0,"4684":0,"4686":0,"4687":0,"4689":0,"4691":0,"4693":0,"4694":0,"4695":0,"4697":0,"4712":0,"4715":0,"4737":0,"4747":0,"4748":0,"4749":0,"4761":0,"4772":0,"4776":0,"4778":0,"4779":0,"4780":0,"4810":0,"4813":0,"4815":0,"4816":0,"4818":0,"4819":0,"4820":0,"4832":0,"4844":0,"4845":0,"4846":0,"4847":0,"4849":0,"4851":0,"4853":0,"4855":0,"4856":0,"4857":0,"4858":0,"4859":0,"4860":0,"4861":0,"4863":0,"4864":0,"4865":0,"4869":0,"4871":0,"4872":0,"4887":0,"4889":0,"4890":0,"4892":0,"4905":0,"4910":0,"4924":0,"4929":0,"4951":0,"4953":0,"4955":0,"4959":0,"4962":0};
_yuitest_coverage["build/charts-base/charts-base.js"].functions = {"remove:44":0,"draw:59":0,"_drawGridlines:73":0,"_getPoints:130":0,"_horizontalLine:157":0,"_verticalLine:173":0,"_getDefaultStyles:187":0,"bindUI:253":0,"syncUI:267":0,"getSeriesByIndex:325":0,"getSeriesByKey:343":0,"addDispatcher:362":0,"_parseSeriesCollection:396":0,"_addSeries:435":0,"_createSeries:469":0,"_getSeries:565":0,"_markerEventHandler:586":0,"_updateStyles:611":0,"_sizeChangeHandler:629":0,"_drawSeries:672":0,"_drawingCompleteHandler:712":0,"_getDefaultStyles:740":0,"destructor:763":0,"setter:791":0,"setter:806":0,"getter:821":0,"getter:835":0,"setter:840":0,"getter:868":0,"setter:884":0,"setter:928":0,"getter:970":0,"getter:992":0,"getter:1014":0,"ChartBase:1072":0,"valueFn:1084":0,"setter:1094":0,"getter:1114":0,"setter:1119":0,"setter:1136":0,"setter:1156":0,"setter:1240":0,"_groupMarkersChangeHandler:1327":0,"_itemRendered:1344":0,"(anonymous 2):1366":0,"_getGraph:1360":0,"getSeries:1379":0,"getAxisByKey:1407":0,"getCategoryAxis:1424":0,"_setDataValues:1463":0,"_setSeriesCollection:1504":0,"_getAxisClass:1516":0,"initializer:1548":0,"renderUI:1560":0,"_setAriaElements:1584":0,"_getAriaOffscreenNode:1614":0,"syncUI:1631":0,"(anonymous 3):1655":0,"(anonymous 4):1676":0,"(anonymous 5):1713":0,"bindUI:1640":0,"_markerEventDispatcher:1760":0,"_dataProviderChangeHandler:1901":0,"toggleTooltip:1942":0,"_showTooltip:1964":0,"_positionTooltip:1985":0,"hideTooltip:2004":0,"_addTooltip:2021":0,"_updateTooltip:2044":0,"markerEventHandler:2104":0,"planarEventHandler:2110":0,"_getTooltip:2093":0,"_planarLabelFunction:2158":0,"_tooltipLabelFunction:2223":0,"_tooltipChangeHandler:2253":0,"_setText:2280":0,"_getAllKeys:2305":0,"_buildSeriesKeys:2334":0,"renderUI:2369":0,"_planarEventDispatcher:2412":0,"_addToAxesRenderQueue:2579":0,"_addToAxesCollection:2598":0,"_getDefaultSeriesCollection:2617":0,"_parseSeriesCollection:2636":0,"_parseSeriesAxes:2767":0,"_getCategoryAxis:2800":0,"_getSeriesAxis:2817":0,"_getBaseAttribute:2859":0,"_setBaseAttribute:2883":0,"_setAxes:2903":0,"_addAxes:3019":0,"_addSeries:3076":0,"_addGridlines:3090":0,"_getDefaultAxes:3164":0,"_parseAxes:3182":0,"_getDefaultAxisPosition:3335":0,"getSeriesItems:3394":0,"_sizeChanged:3442":0,"_getTopOverflow:3467":0,"_getRightOverflow:3505":0,"_getLeftOverflow:3543":0,"_getBottomOverflow:3581":0,"_redraw:3615":0,"destructor:3880":0,"_getAriaMessage:3937":0,"getter:4031":0,"setter:4053":0,"getter:4075":0,"setter:4099":0,"getter:4138":0,"setter:4148":0,"getter:4181":0,"setter:4190":0,"setter:4231":0,"setter:4251":0,"getter:4316":0,"setter:4330":0,"getter:4388":0,"setter:4397":0,"getter:4422":0,"setter:4431":0,"getter:4456":0,"setter:4465":0,"_getSeriesCollection:4511":0,"_parseAxes:4554":0,"_addAxes:4605":0,"_addSeries:4645":0,"_parseSeriesAxes:4665":0,"_getDefaultAxes:4710":0,"getSeriesItems:4735":0,"_sizeChanged:4759":0,"_redraw:4770":0,"_tooltipLabelFunction:4808":0,"_getAriaMessage:4830":0,"setter:4885":0,"getter:4903":0,"setter:4908":0,"getter:4922":0,"setter:4927":0,"Chart:4951":0,"(anonymous 1):1":0};
_yuitest_coverage["build/charts-base/charts-base.js"].coveredLines = 1349;
_yuitest_coverage["build/charts-base/charts-base.js"].coveredFunctions = 141;
_yuitest_coverline("build/charts-base/charts-base.js", 1);
YUI.add('charts-base', function (Y, NAME) {

/**
 * Provides functionality for creating charts.
 *
 * @module charts
 * @submodule charts-base
 */
_yuitest_coverfunc("build/charts-base/charts-base.js", "(anonymous 1)", 1);
_yuitest_coverline("build/charts-base/charts-base.js", 9);
var CONFIG = Y.config,
    WINDOW = CONFIG.win,
    DOCUMENT = CONFIG.doc,
    Y_Lang = Y.Lang,
    IS_STRING = Y_Lang.isString,
    Y_DOM = Y.DOM,
    _getClassName = Y.ClassNameManager.getClassName,
    SERIES_MARKER = _getClassName("seriesmarker");

/**
 * Gridlines draws gridlines on a Graph.
 *
 * @class Gridlines
 * @constructor
 * @extends Base
 * @uses Renderer
 * @param {Object} config (optional) Configuration parameters.
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 28);
Y.Gridlines = Y.Base.create("gridlines", Y.Base, [Y.Renderer], {
    /**
     * Reference to the `Path` element used for drawing Gridlines.
     *
     * @property _path
     * @type Path
     * @private
     */
    _path: null,

    /**
     * Removes the Gridlines.
     *
     * @method remove
     * @private
     */
    remove: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "remove", 44);
_yuitest_coverline("build/charts-base/charts-base.js", 46);
var path = this._path;
        _yuitest_coverline("build/charts-base/charts-base.js", 47);
if(path)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 49);
path.destroy();
        }
    },

    /**
     * Draws the gridlines
     *
     * @method draw
     * @protected
     */
    draw: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "draw", 59);
_yuitest_coverline("build/charts-base/charts-base.js", 61);
if(this.get("axis") && this.get("graph"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 63);
this._drawGridlines();
        }
    },

    /**
     * Algorithm for drawing gridlines
     *
     * @method _drawGridlines
     * @private
     */
    _drawGridlines: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_drawGridlines", 73);
_yuitest_coverline("build/charts-base/charts-base.js", 75);
var path,
            axis = this.get("axis"),
            axisPosition = axis.get("position"),
            points,
            i = 0,
            l,
            direction = this.get("direction"),
            graph = this.get("graph"),
            w = graph.get("width"),
            h = graph.get("height"),
            line = this.get("styles").line,
            color = line.color,
            weight = line.weight,
            alpha = line.alpha,
            count = this.get("count"),
            lineFunction = direction == "vertical" ? this._verticalLine : this._horizontalLine;
        _yuitest_coverline("build/charts-base/charts-base.js", 91);
if(isFinite(w) && isFinite(h) && w > 0 && h > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 93);
if(count && Y.Lang.isNumber(count))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 95);
points = this._getPoints(count, w, h);
            }
            else {_yuitest_coverline("build/charts-base/charts-base.js", 97);
if(axisPosition != "none" && axis && axis.get("tickPoints"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 99);
points = axis.get("tickPoints");
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 103);
points = this._getPoints(axis.get("styles").majorUnit.count, w, h);
            }}
            _yuitest_coverline("build/charts-base/charts-base.js", 105);
l = points.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 106);
path = graph.get("gridlines");
            _yuitest_coverline("build/charts-base/charts-base.js", 107);
path.set("width", w);
            _yuitest_coverline("build/charts-base/charts-base.js", 108);
path.set("height", h);
            _yuitest_coverline("build/charts-base/charts-base.js", 109);
path.set("stroke", {
                weight: weight,
                color: color,
                opacity: alpha
            });
            _yuitest_coverline("build/charts-base/charts-base.js", 114);
for(i = 0; i < l; i = i + 1)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 116);
lineFunction(path, points[i], w, h);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 118);
path.end();
        }
    },

    /**
     * Calculates the coordinates for the gridlines based on a count.
     *
     * @method _getPoints
     * @param {Number} count Number of gridlines
     * @return Array
     * @private
     */
    _getPoints: function(count, w, h)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getPoints", 130);
_yuitest_coverline("build/charts-base/charts-base.js", 132);
var i,
            points = [],
            multiplier,
            divisor = count - 1;
        _yuitest_coverline("build/charts-base/charts-base.js", 136);
for(i = 0; i < count; i = i + 1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 138);
multiplier = i/divisor;
            _yuitest_coverline("build/charts-base/charts-base.js", 139);
points[i] = {
                x: w * multiplier,
                y: h * multiplier
            };
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 144);
return points;
    },

    /**
     * Algorithm for horizontal lines.
     *
     * @method _horizontalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _horizontalLine: function(path, pt, w, h)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_horizontalLine", 157);
_yuitest_coverline("build/charts-base/charts-base.js", 159);
path.moveTo(0, pt.y);
        _yuitest_coverline("build/charts-base/charts-base.js", 160);
path.lineTo(w, pt.y);
    },

    /**
     * Algorithm for vertical lines.
     *
     * @method _verticalLine
     * @param {Path} path Reference to path element
     * @param {Object} pt Coordinates corresponding to a major unit of an axis.
     * @param {Number} w Width of the Graph
     * @param {Number} h Height of the Graph
     * @private
     */
    _verticalLine: function(path, pt, w, h)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_verticalLine", 173);
_yuitest_coverline("build/charts-base/charts-base.js", 175);
path.moveTo(pt.x, 0);
        _yuitest_coverline("build/charts-base/charts-base.js", 176);
path.lineTo(pt.x, h);
    },

    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultStyles", 187);
_yuitest_coverline("build/charts-base/charts-base.js", 189);
var defs = {
            line: {
                color:"#f0efe9",
                weight: 1,
                alpha: 1
            }
        };
        _yuitest_coverline("build/charts-base/charts-base.js", 196);
return defs;
    }

},
{
    ATTRS: {
        /**
         * Indicates the direction of the gridline.
         *
         * @attribute direction
         * @type String
         */
        direction: {},

        /**
         * Indicate the `Axis` in which to bind
         * the gridlines.
         *
         * @attribute axis
         * @type Axis
         */
        axis: {},

        /**
         * Indicates the `Graph` in which the gridlines
         * are drawn.
         *
         * @attribute graph
         * @type Graph
         */
        graph: {},

        /**
         * Indicates the number of gridlines to display. If no value is set, gridlines will equal the number of ticks in
         * the corresponding axis.
         *
         * @attribute count
         * @type Number
         */
        count: {}
    }
});
/**
 * Graph manages and contains series instances for a `CartesianChart`
 * instance.
 *
 * @class Graph
 * @constructor
 * @extends Widget
 * @uses Renderer
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 248);
Y.Graph = Y.Base.create("graph", Y.Widget, [Y.Renderer], {
    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "bindUI", 253);
_yuitest_coverline("build/charts-base/charts-base.js", 255);
var bb = this.get("boundingBox");
        _yuitest_coverline("build/charts-base/charts-base.js", 256);
bb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 257);
this.after("widthChange", this._sizeChangeHandler);
        _yuitest_coverline("build/charts-base/charts-base.js", 258);
this.after("heightChange", this._sizeChangeHandler);
        _yuitest_coverline("build/charts-base/charts-base.js", 259);
this.after("stylesChange", this._updateStyles);
        _yuitest_coverline("build/charts-base/charts-base.js", 260);
this.after("groupMarkersChange", this._drawSeries);
    },

    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "syncUI", 267);
_yuitest_coverline("build/charts-base/charts-base.js", 269);
var background,
            cb,
            bg,
            sc = this.get("seriesCollection"),
            series,
            i = 0,
            len = sc ? sc.length : 0,
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines");
        _yuitest_coverline("build/charts-base/charts-base.js", 278);
if(this.get("showBackground"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 280);
background = this.get("background");
            _yuitest_coverline("build/charts-base/charts-base.js", 281);
cb = this.get("contentBox");
            _yuitest_coverline("build/charts-base/charts-base.js", 282);
bg = this.get("styles").background;
            _yuitest_coverline("build/charts-base/charts-base.js", 283);
bg.stroke = bg.border;
            _yuitest_coverline("build/charts-base/charts-base.js", 284);
bg.stroke.opacity = bg.stroke.alpha;
            _yuitest_coverline("build/charts-base/charts-base.js", 285);
bg.fill.opacity = bg.fill.alpha;
            _yuitest_coverline("build/charts-base/charts-base.js", 286);
bg.width = this.get("width");
            _yuitest_coverline("build/charts-base/charts-base.js", 287);
bg.height = this.get("height");
            _yuitest_coverline("build/charts-base/charts-base.js", 288);
bg.type = bg.shape;
            _yuitest_coverline("build/charts-base/charts-base.js", 289);
background.set(bg);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 291);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 293);
series = sc[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 294);
if(series instanceof Y.CartesianSeries)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 296);
series.render();
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 299);
if(hgl && hgl instanceof Y.Gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 301);
hgl.draw();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 303);
if(vgl && vgl instanceof Y.Gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 305);
vgl.draw();
        }
    },

    /**
     * Object of arrays containing series mapped to a series type.
     *
     * @property seriesTypes
     * @type Object
     * @private
     */
    seriesTypes: null,

    /**
     * Returns a series instance based on an index.
     *
     * @method getSeriesByIndex
     * @param {Number} val index of the series
     * @return CartesianSeries
     */
    getSeriesByIndex: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getSeriesByIndex", 325);
_yuitest_coverline("build/charts-base/charts-base.js", 327);
var col = this.get("seriesCollection"),
            series;
        _yuitest_coverline("build/charts-base/charts-base.js", 329);
if(col && col.length > val)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 331);
series = col[val];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 333);
return series;
    },

    /**
     * Returns a series instance based on a key value.
     *
     * @method getSeriesByKey
     * @param {String} val key value of the series
     * @return CartesianSeries
     */
    getSeriesByKey: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getSeriesByKey", 343);
_yuitest_coverline("build/charts-base/charts-base.js", 345);
var obj = this._seriesDictionary,
            series;
        _yuitest_coverline("build/charts-base/charts-base.js", 347);
if(obj && obj.hasOwnProperty(val))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 349);
series = obj[val];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 351);
return series;
    },

    /**
     * Adds dispatcher to a `_dispatcher` used to
     * to ensure all series have redrawn before for firing event.
     *
     * @method addDispatcher
     * @param {CartesianSeries} val series instance to add
     * @protected
     */
    addDispatcher: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "addDispatcher", 362);
_yuitest_coverline("build/charts-base/charts-base.js", 364);
if(!this._dispatchers)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 366);
this._dispatchers = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 368);
this._dispatchers.push(val);
    },

    /**
     * Collection of series to be displayed in the graph.
     *
     * @property _seriesCollection
     * @type Array
     * @private
     */
    _seriesCollection: null,

    /**
     * Object containing key value pairs of `CartesianSeries` instances.
     *
     * @property _seriesDictionary
     * @type Object
     * @private
     */
    _seriesDictionary: null,

    /**
     * Parses series instances to be displayed in the graph.
     *
     * @method _parseSeriesCollection
     * @param {Array} Collection of `CartesianSeries` instances or objects container `CartesianSeries` attributes values.
     * @private
     */
    _parseSeriesCollection: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseSeriesCollection", 396);
_yuitest_coverline("build/charts-base/charts-base.js", 398);
if(!val)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 400);
return;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 402);
var len = val.length,
            i = 0,
            series,
            seriesKey;
        _yuitest_coverline("build/charts-base/charts-base.js", 406);
this._seriesCollection = [];
        _yuitest_coverline("build/charts-base/charts-base.js", 407);
this._seriesDictionary = {};
        _yuitest_coverline("build/charts-base/charts-base.js", 408);
this.seriesTypes = [];
        _yuitest_coverline("build/charts-base/charts-base.js", 409);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 411);
series = val[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 412);
if(!(series instanceof Y.CartesianSeries) && !(series instanceof Y.PieSeries))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 414);
this._createSeries(series);
                _yuitest_coverline("build/charts-base/charts-base.js", 415);
continue;
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 417);
this._addSeries(series);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 419);
len = this._seriesCollection.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 420);
for(i = 0; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 422);
series = this.get("seriesCollection")[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 423);
seriesKey = series.get("direction") == "horizontal" ? "yKey" : "xKey";
            _yuitest_coverline("build/charts-base/charts-base.js", 424);
this._seriesDictionary[series.get(seriesKey)] = series;
        }
    },

    /**
     * Adds a series to the graph.
     *
     * @method _addSeries
     * @param {CartesianSeries} series Series to add to the graph.
     * @private
     */
    _addSeries: function(series)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addSeries", 435);
_yuitest_coverline("build/charts-base/charts-base.js", 437);
var type = series.get("type"),
            seriesCollection = this.get("seriesCollection"),
            graphSeriesLength = seriesCollection.length,
            seriesTypes = this.seriesTypes,
            typeSeriesCollection;
        _yuitest_coverline("build/charts-base/charts-base.js", 442);
if(!series.get("graph"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 444);
series.set("graph", this);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 446);
seriesCollection.push(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 447);
if(!seriesTypes.hasOwnProperty(type))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 449);
this.seriesTypes[type] = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 451);
typeSeriesCollection = this.seriesTypes[type];
        _yuitest_coverline("build/charts-base/charts-base.js", 452);
series.set("graphOrder", graphSeriesLength);
        _yuitest_coverline("build/charts-base/charts-base.js", 453);
series.set("order", typeSeriesCollection.length);
        _yuitest_coverline("build/charts-base/charts-base.js", 454);
typeSeriesCollection.push(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 455);
series.set("seriesTypeCollection", typeSeriesCollection);
        _yuitest_coverline("build/charts-base/charts-base.js", 456);
this.addDispatcher(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 457);
series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        _yuitest_coverline("build/charts-base/charts-base.js", 458);
this.fire("seriesAdded", series);
    },

    /**
     * Creates a `CartesianSeries` instance from an object containing attribute key value pairs. The key value pairs include
     * attributes for the specific series and a type value which defines the type of series to be used.
     *
     * @method createSeries
     * @param {Object} seriesData Series attribute key value pairs.
     * @private
     */
    _createSeries: function(seriesData)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_createSeries", 469);
_yuitest_coverline("build/charts-base/charts-base.js", 471);
var type = seriesData.type,
            seriesCollection = this.get("seriesCollection"),
            seriesTypes = this.seriesTypes,
            typeSeriesCollection,
            seriesType,
            series;
            _yuitest_coverline("build/charts-base/charts-base.js", 477);
seriesData.graph = this;
        _yuitest_coverline("build/charts-base/charts-base.js", 478);
if(!seriesTypes.hasOwnProperty(type))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 480);
seriesTypes[type] = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 482);
typeSeriesCollection = seriesTypes[type];
        _yuitest_coverline("build/charts-base/charts-base.js", 483);
seriesData.graph = this;
        _yuitest_coverline("build/charts-base/charts-base.js", 484);
seriesData.order = typeSeriesCollection.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 485);
seriesData.graphOrder = seriesCollection.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 486);
seriesType = this._getSeries(seriesData.type);
        _yuitest_coverline("build/charts-base/charts-base.js", 487);
series = new seriesType(seriesData);
        _yuitest_coverline("build/charts-base/charts-base.js", 488);
this.addDispatcher(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 489);
series.after("drawingComplete", Y.bind(this._drawingCompleteHandler, this));
        _yuitest_coverline("build/charts-base/charts-base.js", 490);
typeSeriesCollection.push(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 491);
seriesCollection.push(series);
        _yuitest_coverline("build/charts-base/charts-base.js", 492);
series.set("seriesTypeCollection", typeSeriesCollection);
        _yuitest_coverline("build/charts-base/charts-base.js", 493);
if(this.get("rendered"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 495);
series.render();
        }
    },

    /**
     * String reference for pre-defined `Series` classes.
     *
     * @property _seriesMap
     * @type Object
     * @private
     */
    _seriesMap: {
        line : Y.LineSeries,
        column : Y.ColumnSeries,
        bar : Y.BarSeries,
        area :  Y.AreaSeries,
        candlestick : Y.CandlestickSeries,
        ohlc : Y.OHLCSeries,
        stackedarea : Y.StackedAreaSeries,
        stackedline : Y.StackedLineSeries,
        stackedcolumn : Y.StackedColumnSeries,
        stackedbar : Y.StackedBarSeries,
        markerseries : Y.MarkerSeries,
        spline : Y.SplineSeries,
        areaspline : Y.AreaSplineSeries,
        stackedspline : Y.StackedSplineSeries,
        stackedareaspline : Y.StackedAreaSplineSeries,
        stackedmarkerseries : Y.StackedMarkerSeries,
        pie : Y.PieSeries,
        combo : Y.ComboSeries,
        stackedcombo : Y.StackedComboSeries,
        combospline : Y.ComboSplineSeries,
        stackedcombospline : Y.StackedComboSplineSeries
    },

    /**
     * Returns a specific `CartesianSeries` class based on key value from a look up table of a direct reference to a
     * class. When specifying a key value, the following options are available:
     *
     *  <table>
     *      <tr><th>Key Value</th><th>Class</th></tr>
     *      <tr><td>line</td><td>Y.LineSeries</td></tr>
     *      <tr><td>column</td><td>Y.ColumnSeries</td></tr>
     *      <tr><td>bar</td><td>Y.BarSeries</td></tr>
     *      <tr><td>area</td><td>Y.AreaSeries</td></tr>
     *      <tr><td>stackedarea</td><td>Y.StackedAreaSeries</td></tr>
     *      <tr><td>stackedline</td><td>Y.StackedLineSeries</td></tr>
     *      <tr><td>stackedcolumn</td><td>Y.StackedColumnSeries</td></tr>
     *      <tr><td>stackedbar</td><td>Y.StackedBarSeries</td></tr>
     *      <tr><td>markerseries</td><td>Y.MarkerSeries</td></tr>
     *      <tr><td>spline</td><td>Y.SplineSeries</td></tr>
     *      <tr><td>areaspline</td><td>Y.AreaSplineSeries</td></tr>
     *      <tr><td>stackedspline</td><td>Y.StackedSplineSeries</td></tr>
     *      <tr><td>stackedareaspline</td><td>Y.StackedAreaSplineSeries</td></tr>
     *      <tr><td>stackedmarkerseries</td><td>Y.StackedMarkerSeries</td></tr>
     *      <tr><td>pie</td><td>Y.PieSeries</td></tr>
     *      <tr><td>combo</td><td>Y.ComboSeries</td></tr>
     *      <tr><td>stackedcombo</td><td>Y.StackedComboSeries</td></tr>
     *      <tr><td>combospline</td><td>Y.ComboSplineSeries</td></tr>
     *      <tr><td>stackedcombospline</td><td>Y.StackedComboSplineSeries</td></tr>
     *  </table>
     *
     * When referencing a class directly, you can specify any of the above classes or any custom class that extends
     * `CartesianSeries` or `PieSeries`.
     *
     * @method _getSeries
     * @param {String | Object} type Series type.
     * @return CartesianSeries
     * @private
     */
    _getSeries: function(type)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getSeries", 565);
_yuitest_coverline("build/charts-base/charts-base.js", 567);
var seriesClass;
        _yuitest_coverline("build/charts-base/charts-base.js", 568);
if(Y_Lang.isString(type))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 570);
seriesClass = this._seriesMap[type];
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 574);
seriesClass = type;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 576);
return seriesClass;
    },

    /**
     * Event handler for marker events.
     *
     * @method _markerEventHandler
     * @param {Object} e Event object.
     * @private
     */
    _markerEventHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_markerEventHandler", 586);
_yuitest_coverline("build/charts-base/charts-base.js", 588);
var type = e.type,
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            series = this.getSeriesByIndex(strArr[1]),
            index = strArr[2];
        _yuitest_coverline("build/charts-base/charts-base.js", 593);
series.updateMarkerState(type, index);
    },

    /**
     * Collection of `CartesianSeries` instances to be redrawn.
     *
     * @property _dispatchers
     * @type Array
     * @private
     */
    _dispatchers: null,

    /**
     * Updates the `Graph` styles.
     *
     * @method _updateStyles
     * @private
     */
    _updateStyles: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_updateStyles", 611);
_yuitest_coverline("build/charts-base/charts-base.js", 613);
var styles = this.get("styles").background,
            border = styles.border;
            _yuitest_coverline("build/charts-base/charts-base.js", 615);
border.opacity = border.alpha;
            _yuitest_coverline("build/charts-base/charts-base.js", 616);
styles.stroke = border;
            _yuitest_coverline("build/charts-base/charts-base.js", 617);
styles.fill.opacity = styles.fill.alpha;
        _yuitest_coverline("build/charts-base/charts-base.js", 618);
this.get("background").set(styles);
        _yuitest_coverline("build/charts-base/charts-base.js", 619);
this._sizeChangeHandler();
    },

    /**
     * Event handler for size changes.
     *
     * @method _sizeChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _sizeChangeHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_sizeChangeHandler", 629);
_yuitest_coverline("build/charts-base/charts-base.js", 631);
var hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            w = this.get("width"),
            h = this.get("height"),
            bg = this.get("styles").background,
            weight,
            background;
        _yuitest_coverline("build/charts-base/charts-base.js", 638);
if(bg && bg.border)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 640);
weight = bg.border.weight || 0;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 642);
if(this.get("showBackground"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 644);
background = this.get("background");
            _yuitest_coverline("build/charts-base/charts-base.js", 645);
if(w && h)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 647);
background.set("width", w);
                _yuitest_coverline("build/charts-base/charts-base.js", 648);
background.set("height", h);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 651);
if(this._gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 653);
this._gridlines.clear();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 655);
if(hgl && hgl instanceof Y.Gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 657);
hgl.draw();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 659);
if(vgl && vgl instanceof Y.Gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 661);
vgl.draw();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 663);
this._drawSeries();
    },

    /**
     * Draws each series.
     *
     * @method _drawSeries
     * @private
     */
    _drawSeries: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_drawSeries", 672);
_yuitest_coverline("build/charts-base/charts-base.js", 674);
if(this._drawing)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 676);
this._callLater = true;
            _yuitest_coverline("build/charts-base/charts-base.js", 677);
return;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 679);
var sc,
            i,
            len,
            graphic = this.get("graphic");
        _yuitest_coverline("build/charts-base/charts-base.js", 683);
graphic.set("autoDraw", false);
        _yuitest_coverline("build/charts-base/charts-base.js", 684);
this._callLater = false;
        _yuitest_coverline("build/charts-base/charts-base.js", 685);
this._drawing = true;
        _yuitest_coverline("build/charts-base/charts-base.js", 686);
sc = this.get("seriesCollection");
        _yuitest_coverline("build/charts-base/charts-base.js", 687);
i = 0;
        _yuitest_coverline("build/charts-base/charts-base.js", 688);
len = sc ? sc.length : 0;
        _yuitest_coverline("build/charts-base/charts-base.js", 689);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 691);
sc[i].draw();
            _yuitest_coverline("build/charts-base/charts-base.js", 692);
if((!sc[i].get("xcoords") || !sc[i].get("ycoords")) && !sc[i] instanceof Y.PieSeries)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 694);
this._callLater = true;
                _yuitest_coverline("build/charts-base/charts-base.js", 695);
break;
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 698);
this._drawing = false;
        _yuitest_coverline("build/charts-base/charts-base.js", 699);
if(this._callLater)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 701);
this._drawSeries();
        }
    },

    /**
     * Event handler for series drawingComplete event.
     *
     * @method _drawingCompleteHandler
     * @param {Object} e Event object.
     * @private
     */
    _drawingCompleteHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_drawingCompleteHandler", 712);
_yuitest_coverline("build/charts-base/charts-base.js", 714);
var series = e.currentTarget,
            graphic,
            index = Y.Array.indexOf(this._dispatchers, series);
        _yuitest_coverline("build/charts-base/charts-base.js", 717);
if(index > -1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 719);
this._dispatchers.splice(index, 1);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 721);
if(this._dispatchers.length < 1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 723);
graphic = this.get("graphic");
            _yuitest_coverline("build/charts-base/charts-base.js", 724);
if(!graphic.get("autoDraw"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 726);
graphic._redraw();
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 728);
this.fire("chartRendered");
        }
    },

    /**
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     * @protected
     */
    _getDefaultStyles: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultStyles", 740);
_yuitest_coverline("build/charts-base/charts-base.js", 742);
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
        _yuitest_coverline("build/charts-base/charts-base.js", 754);
return defs;
    },

    /**
     * Destructor implementation Graph class. Removes all Graphic instances from the widget.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "destructor", 763);
_yuitest_coverline("build/charts-base/charts-base.js", 765);
if(this._graphic)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 767);
this._graphic.destroy();
            _yuitest_coverline("build/charts-base/charts-base.js", 768);
this._graphic = null;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 770);
if(this._background)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 772);
this._background.get("graphic").destroy();
            _yuitest_coverline("build/charts-base/charts-base.js", 773);
this._background = null;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 775);
if(this._gridlines)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 777);
this._gridlines.get("graphic").destroy();
            _yuitest_coverline("build/charts-base/charts-base.js", 778);
this._gridlines = null;
        }
    }
}, {
    ATTRS: {
        /**
         * The x-coordinate for the graph.
         *
         * @attribute x
         * @type Number
         * @protected
         */
        x: {
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 791);
_yuitest_coverline("build/charts-base/charts-base.js", 793);
this.get("boundingBox").setStyle("left", val + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 794);
return val;
            }
        },

        /**
         * The y-coordinate for the graph.
         *
         * @attribute y
         * @type Number
         * @protected
         */
        y: {
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 806);
_yuitest_coverline("build/charts-base/charts-base.js", 808);
this.get("boundingBox").setStyle("top", val + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 809);
return val;
            }
        },

        /**
         * Reference to the chart instance using the graph.
         *
         * @attribute chart
         * @type ChartBase
         * @readOnly
         */
        chart: {
            getter: function() {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 821);
_yuitest_coverline("build/charts-base/charts-base.js", 822);
var chart = this._state.chart || this;
                _yuitest_coverline("build/charts-base/charts-base.js", 823);
return chart;
            }
        },

        /**
         * Collection of series. When setting the `seriesCollection` the array can contain a combination of either
         * `CartesianSeries` instances or object literals with properties that will define a series.
         *
         * @attribute seriesCollection
         * @type CartesianSeries
         */
        seriesCollection: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 835);
_yuitest_coverline("build/charts-base/charts-base.js", 837);
return this._seriesCollection;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 840);
_yuitest_coverline("build/charts-base/charts-base.js", 842);
this._parseSeriesCollection(val);
                _yuitest_coverline("build/charts-base/charts-base.js", 843);
return this._seriesCollection;
            }
        },

        /**
         * Indicates whether the `Graph` has a background.
         *
         * @attribute showBackground
         * @type Boolean
         * @default true
         */
        showBackground: {
            value: true
        },

        /**
         * Read-only hash lookup for all series on in the `Graph`.
         *
         * @attribute seriesDictionary
         * @type Object
         * @readOnly
         */
        seriesDictionary: {
            readOnly: true,

            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 868);
_yuitest_coverline("build/charts-base/charts-base.js", 870);
return this._seriesDictionary;
            }
        },

        /**
         * Reference to the horizontal `Gridlines` instance.
         *
         * @attribute horizontalGridlines
         * @type Gridlines
         * @default null
         */
        horizontalGridlines: {
            value: null,

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 884);
_yuitest_coverline("build/charts-base/charts-base.js", 886);
var cfg,
                    key,
                    gl = this.get("horizontalGridlines");
                _yuitest_coverline("build/charts-base/charts-base.js", 889);
if(gl && gl instanceof Y.Gridlines)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 891);
gl.remove();
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 893);
if(val instanceof Y.Gridlines)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 895);
gl = val;
                    _yuitest_coverline("build/charts-base/charts-base.js", 896);
val.set("graph", this);
                    _yuitest_coverline("build/charts-base/charts-base.js", 897);
return val;
                }
                else {_yuitest_coverline("build/charts-base/charts-base.js", 899);
if(val)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 901);
cfg = {
                        direction: "horizonal",
                        graph: this
                    };
                    _yuitest_coverline("build/charts-base/charts-base.js", 905);
for(key in val)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 907);
if(val.hasOwnProperty(key))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 909);
cfg[key] = val[key];
                        }
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 912);
gl = new Y.Gridlines(cfg);
                    _yuitest_coverline("build/charts-base/charts-base.js", 913);
return gl;
                }}
            }
        },

        /**
         * Reference to the vertical `Gridlines` instance.
         *
         * @attribute verticalGridlines
         * @type Gridlines
         * @default null
         */
        verticalGridlines: {
            value: null,

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 928);
_yuitest_coverline("build/charts-base/charts-base.js", 930);
var cfg,
                    key,
                    gl = this.get("verticalGridlines");
                _yuitest_coverline("build/charts-base/charts-base.js", 933);
if(gl && gl instanceof Y.Gridlines)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 935);
gl.remove();
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 937);
if(val instanceof Y.Gridlines)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 939);
gl = val;
                    _yuitest_coverline("build/charts-base/charts-base.js", 940);
val.set("graph", this);
                    _yuitest_coverline("build/charts-base/charts-base.js", 941);
return val;
                }
                else {_yuitest_coverline("build/charts-base/charts-base.js", 943);
if(val)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 945);
cfg = {
                        direction: "vertical",
                        graph: this
                    };
                    _yuitest_coverline("build/charts-base/charts-base.js", 949);
for(key in val)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 951);
if(val.hasOwnProperty(key))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 953);
cfg[key] = val[key];
                        }
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 956);
gl = new Y.Gridlines(cfg);
                    _yuitest_coverline("build/charts-base/charts-base.js", 957);
return gl;
                }}
            }
        },

        /**
         * Reference to graphic instance used for the background.
         *
         * @attribute background
         * @type Graphic
         * @readOnly
         */
        background: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 970);
_yuitest_coverline("build/charts-base/charts-base.js", 972);
if(!this._background)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 974);
this._backgroundGraphic = new Y.Graphic({render:this.get("contentBox")});
                    _yuitest_coverline("build/charts-base/charts-base.js", 975);
this._backgroundGraphic.get("node").style.zIndex = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 976);
this._background = this._backgroundGraphic.addShape({type: "rect"});
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 978);
return this._background;
            }
        },

        /**
         * Reference to graphic instance used for gridlines.
         *
         * @attribute gridlines
         * @type Graphic
         * @readOnly
         */
        gridlines: {
            readOnly: true,

            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 992);
_yuitest_coverline("build/charts-base/charts-base.js", 994);
if(!this._gridlines)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 996);
this._gridlinesGraphic = new Y.Graphic({render:this.get("contentBox")});
                    _yuitest_coverline("build/charts-base/charts-base.js", 997);
this._gridlinesGraphic.get("node").style.zIndex = 1;
                    _yuitest_coverline("build/charts-base/charts-base.js", 998);
this._gridlines = this._gridlinesGraphic.addShape({type: "path"});
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 1000);
return this._gridlines;
            }
        },

        /**
         * Reference to graphic instance used for series.
         *
         * @attribute graphic
         * @type Graphic
         * @readOnly
         */
        graphic: {
            readOnly: true,

            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 1014);
_yuitest_coverline("build/charts-base/charts-base.js", 1016);
if(!this._graphic)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1018);
this._graphic = new Y.Graphic({render:this.get("contentBox")});
                    _yuitest_coverline("build/charts-base/charts-base.js", 1019);
this._graphic.get("node").style.zIndex = 2;
                    _yuitest_coverline("build/charts-base/charts-base.js", 1020);
this._graphic.set("autoDraw", false);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 1022);
return this._graphic;
            }
        },

        /**
         * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.
         *
         * @attribute groupMarkers
         * @type Boolean
         */
        groupMarkers: {
            value: false
        }

        /**
         * Style properties used for drawing a background. Below are the default values:
         *  <dl>
         *      <dt>background</dt><dd>An object containing the following values:
         *          <dl>
         *              <dt>fill</dt><dd>Defines the style properties for the fill. Contains the following values:
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the fill. The default value is #faf9f2.</dd>
         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background fill.
         *                      The default value is 1.</dd>
         *                  </dl>
         *              </dd>
         *              <dt>border</dt><dd>Defines the style properties for the border. Contains the following values:
         *                  <dl>
         *                      <dt>color</dt><dd>Color of the border. The default value is #dad8c9.</dd>
         *                      <dt>alpha</dt><dd>Number from 0 to 1 indicating the opacity of the background border.
         *                      The default value is 1.</dd>
         *                      <dt>weight</dt><dd>Number indicating the width of the border. The default value is 1.</dd>
         *                  </dl>
         *              </dd>
         *          </dl>
         *      </dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
    }
});
/**
 * The ChartBase class is an abstract class used to create charts.
 *
 * @class ChartBase
 * @constructor
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 1072);
function ChartBase() {}

_yuitest_coverline("build/charts-base/charts-base.js", 1074);
ChartBase.ATTRS = {
    /**
     * Data used to generate the chart.
     *
     * @attribute dataProvider
     * @type Array
     */
    dataProvider: {
        lazyAdd: false,

        valueFn: function()
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "valueFn", 1084);
_yuitest_coverline("build/charts-base/charts-base.js", 1086);
var defDataProvider = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 1087);
if(!this._seriesKeysExplicitlySet)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1089);
this._seriesKeys = this._buildSeriesKeys(defDataProvider);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 1091);
return defDataProvider;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 1094);
_yuitest_coverline("build/charts-base/charts-base.js", 1096);
var dataProvider = this._setDataValues(val);
            _yuitest_coverline("build/charts-base/charts-base.js", 1097);
if(!this._seriesKeysExplicitlySet)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1099);
this._seriesKeys = this._buildSeriesKeys(dataProvider);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 1101);
return dataProvider;
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
    seriesKeys: {
        getter: function()
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 1114);
_yuitest_coverline("build/charts-base/charts-base.js", 1116);
return this._seriesKeys;
        },

        setter: function(val)
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 1119);
_yuitest_coverline("build/charts-base/charts-base.js", 1121);
this._seriesKeysExplicitlySet = true;
            _yuitest_coverline("build/charts-base/charts-base.js", 1122);
this._seriesKeys = val;
            _yuitest_coverline("build/charts-base/charts-base.js", 1123);
return val;
        }
    },

    /**
     * Sets the `aria-label` for the chart.
     *
     * @attribute ariaLabel
     * @type String
     */
    ariaLabel: {
        value: "Chart Application",

        setter: function(val)
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 1136);
_yuitest_coverline("build/charts-base/charts-base.js", 1138);
var cb = this.get("contentBox");
            _yuitest_coverline("build/charts-base/charts-base.js", 1139);
if(cb)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1141);
cb.setAttribute("aria-label", val);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 1143);
return val;
        }
    },

    /**
     * Sets the aria description for the chart.
     *
     * @attribute ariaDescription
     * @type String
     */
    ariaDescription: {
        value: "Use the up and down keys to navigate between series. Use the left and right keys to navigate through items in a series.",

        setter: function(val)
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 1156);
_yuitest_coverline("build/charts-base/charts-base.js", 1158);
if(this._description)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1160);
this._description.setContent("");
                _yuitest_coverline("build/charts-base/charts-base.js", 1161);
this._description.appendChild(DOCUMENT.createTextNode(val));
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 1163);
return val;
        }
    },

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
     *      <dt>markerLabelFunction</dt><dd>Reference to the function used to format a marker event triggered tooltip's text.
     *      The method contains the following arguments:
     *  <dl>
     *      <dt>categoryItem</dt><dd>An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided).</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category.</dd>
     *  </dl>
     *  </dd>
     *  <dt>valueItem</dt><dd>An object containing the following:
     *      <dl>
     *          <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *          <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *          <dt>key</dt><dd>The key for the series.</dd>
     *          <dt>value</dt><dd>The value for the series item.</dd>
     *      </dl>
     *  </dd>
     *  <dt>itemIndex</dt><dd>The index of the item within the series.</dd>
     *  <dt>series</dt><dd> The `CartesianSeries` instance of the item.</dd>
     *  <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>
     *  </dl>
     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose
     *  to return an html string, you will also need to override the tooltip's `setTextFunction` method to accept an html string.
     *  </dd>
     *  <dt>planarLabelFunction</dt><dd>Reference to the function used to format a planar event triggered tooltip's text
     *  <dl>
     *      <dt>categoryAxis</dt><dd> `CategoryAxis` Reference to the categoryAxis of the chart.
     *      <dt>valueItems</dt><dd>Array of objects for each series that has a data point in the coordinate plane of the event. Each
     *      object contains the following data:
     *  <dl>
     *      <dt>axis</dt><dd>The value axis of the series.</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *  </dl>
     *  </dd>
     *      <dt>index</dt><dd>The index of the item within its series.</dd>
     *      <dt>seriesArray</dt><dd>Array of series instances for each value item.</dd>
     *      <dt>seriesIndex</dt><dd>The index of the series in the `seriesCollection`.</dd>
     *  </dl>
     *  </dd>
     *  </dl>
     *  The method returns an `HTMLElement` which is written into the DOM using `appendChild`. If you override this method and choose
     *  to return an html string, you will also need to override the tooltip's `setTextFunction` method to accept an html string.
     *  </dd>
     *  <dt>setTextFunction</dt><dd>Method that writes content returned from `planarLabelFunction` or `markerLabelFunction` into the
     *  the tooltip node. Has the following signature:
     *  <dl>
     *      <dt>label</dt><dd>The `HTMLElement` that the content is to be added.</dd>
     *      <dt>val</dt><dd>The content to be rendered into tooltip. This can be a `String` or `HTMLElement`. If an HTML string is used,
     *      it will be rendered as a string.</dd>
     *  </dl>
     *  </dd>
     *  </dl>
     * @attribute tooltip
     * @type Object
     */
    tooltip: {
        valueFn: "_getTooltip",

        setter: function(val)
        {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 1240);
_yuitest_coverline("build/charts-base/charts-base.js", 1242);
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
     *      <dt>category</dt><dd>Specifies a `CategoryAxis`.</dd>
     *      <dt>time</dt><dd>Specifies a `TimeAxis</dd>
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
    },

    /**
     * Indicates whether or not markers for a series will be grouped and rendered in a single complex shape instance.
     *
     * @attribute groupMarkers
     * @type Boolean
     */
    groupMarkers: {
        value: false
    }
};

_yuitest_coverline("build/charts-base/charts-base.js", 1319);
ChartBase.prototype = {
    /**
     * Handles groupMarkers change event.
     *
     * @method _groupMarkersChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _groupMarkersChangeHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_groupMarkersChangeHandler", 1327);
_yuitest_coverline("build/charts-base/charts-base.js", 1329);
var graph = this.get("graph"),
            useGroupMarkers = e.newVal;
        _yuitest_coverline("build/charts-base/charts-base.js", 1331);
if(graph)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1333);
graph.set("groupMarkers", useGroupMarkers);
        }
    },

    /**
     * Handler for itemRendered event.
     *
     * @method _itemRendered
     * @param {Object} e Event object.
     * @private
     */
    _itemRendered: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_itemRendered", 1344);
_yuitest_coverline("build/charts-base/charts-base.js", 1346);
this._itemRenderQueue = this._itemRenderQueue.splice(1 + Y.Array.indexOf(this._itemRenderQueue, e.currentTarget), 1);
        _yuitest_coverline("build/charts-base/charts-base.js", 1347);
if(this._itemRenderQueue.length < 1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1349);
this._redraw();
        }
    },

    /**
     * Default value function for the `Graph` attribute.
     *
     * @method _getGraph
     * @return Graph
     * @private
     */
    _getGraph: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getGraph", 1360);
_yuitest_coverline("build/charts-base/charts-base.js", 1362);
var graph = new Y.Graph({
            chart:this,
            groupMarkers: this.get("groupMarkers")
        });
        _yuitest_coverline("build/charts-base/charts-base.js", 1366);
graph.after("chartRendered", Y.bind(function(e) {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "(anonymous 2)", 1366);
_yuitest_coverline("build/charts-base/charts-base.js", 1367);
this.fire("chartRendered");
        }, this));
        _yuitest_coverline("build/charts-base/charts-base.js", 1369);
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
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getSeries", 1379);
_yuitest_coverline("build/charts-base/charts-base.js", 1381);
var series = null,
            graph = this.get("graph");
        _yuitest_coverline("build/charts-base/charts-base.js", 1383);
if(graph)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1385);
if(Y_Lang.isNumber(val))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1387);
series = graph.getSeriesByIndex(val);
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1391);
series = graph.getSeriesByKey(val);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1394);
return series;
    },

    /**
     * Returns an `Axis` instance by key reference. If the axis was explicitly set through the `axes` attribute,
     * the key will be the same as the key used in the `axes` object. For default axes, the key for
     * the category axis is the value of the `categoryKey` (`category`). For the value axis, the default
     * key is `values`.
     *
     * @method getAxisByKey
     * @param {String} val Key reference used to look up the axis.
     * @return Axis
     */
    getAxisByKey: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getAxisByKey", 1407);
_yuitest_coverline("build/charts-base/charts-base.js", 1409);
var axis,
            axes = this.get("axes");
        _yuitest_coverline("build/charts-base/charts-base.js", 1411);
if(axes && axes.hasOwnProperty(val))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1413);
axis = axes[val];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1415);
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
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getCategoryAxis", 1424);
_yuitest_coverline("build/charts-base/charts-base.js", 1426);
var axis,
            key = this.get("categoryKey"),
            axes = this.get("axes");
        _yuitest_coverline("build/charts-base/charts-base.js", 1429);
if(axes.hasOwnProperty(key))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1431);
axis = axes[key];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1433);
return axis;
    },

    /**
     * Default direction of the chart.
     *
     * @property _direction
     * @type String
     * @default horizontal
     * @private
     */
    _direction: "horizontal",

    /**
     * Storage for the `dataProvider` attribute.
     *
     * @property _dataProvider
     * @type Array
     * @private
     */
    _dataProvider: null,

    /**
     * Setter method for `dataProvider` attribute.
     *
     * @method _setDataValues
     * @param {Array} val Array to be set as `dataProvider`.
     * @return Array
     * @private
     */
    _setDataValues: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setDataValues", 1463);
_yuitest_coverline("build/charts-base/charts-base.js", 1465);
if(Y_Lang.isArray(val[0]))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1467);
var hash,
                dp = [],
                cats = val[0],
                i = 0,
                l = cats.length,
                n,
                sl = val.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 1474);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1476);
hash = {category:cats[i]};
                _yuitest_coverline("build/charts-base/charts-base.js", 1477);
for(n = 1; n < sl; ++n)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1479);
hash["series" + n] = val[n][i];
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 1481);
dp[i] = hash;
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 1483);
return dp;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1485);
return val;
    },

    /**
     * Storage for `seriesCollection` attribute.
     *
     * @property _seriesCollection
     * @type Array
     * @private
     */
    _seriesCollection: null,

    /**
     * Setter method for `seriesCollection` attribute.
     *
     * @property _setSeriesCollection
     * @param {Array} val Array of either `CartesianSeries` instances or objects containing series attribute key value pairs.
     * @private
     */
    _setSeriesCollection: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setSeriesCollection", 1504);
_yuitest_coverline("build/charts-base/charts-base.js", 1506);
this._seriesCollection = val;
    },
    /**
     * Helper method that returns the axis class that a key references.
     *
     * @method _getAxisClass
     * @param {String} t The type of axis.
     * @return Axis
     * @private
     */
    _getAxisClass: function(t)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getAxisClass", 1516);
_yuitest_coverline("build/charts-base/charts-base.js", 1518);
return this._axisClass[t];
    },

    /**
     * Key value pairs of axis types.
     *
     * @property _axisClass
     * @type Object
     * @private
     */
    _axisClass: {
        stacked: Y.StackedAxis,
        numeric: Y.NumericAxis,
        category: Y.CategoryAxis,
        time: Y.TimeAxis
    },

    /**
     * Collection of axes.
     *
     * @property _axes
     * @type Array
     * @private
     */
    _axes: null,

    /**
     * @method initializer
     * @private
     */
    initializer: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "initializer", 1548);
_yuitest_coverline("build/charts-base/charts-base.js", 1550);
this._itemRenderQueue = [];
        _yuitest_coverline("build/charts-base/charts-base.js", 1551);
this._seriesIndex = -1;
        _yuitest_coverline("build/charts-base/charts-base.js", 1552);
this._itemIndex = -1;
        _yuitest_coverline("build/charts-base/charts-base.js", 1553);
this.after("dataProviderChange", this._dataProviderChangeHandler);
    },

    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "renderUI", 1560);
_yuitest_coverline("build/charts-base/charts-base.js", 1562);
var tt = this.get("tooltip"),
            bb = this.get("boundingBox"),
            cb = this.get("contentBox");
        //move the position = absolute logic to a class file
        _yuitest_coverline("build/charts-base/charts-base.js", 1566);
bb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 1567);
cb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 1568);
this._addAxes();
        _yuitest_coverline("build/charts-base/charts-base.js", 1569);
this._addSeries();
        _yuitest_coverline("build/charts-base/charts-base.js", 1570);
if(tt && tt.show)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1572);
this._addTooltip();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1574);
this._setAriaElements(bb, cb);
    },

    /**
     * Creates an aria `live-region`, `aria-label` and `aria-describedby` for the Chart.
     *
     * @method _setAriaElements
     * @param {Node} cb Reference to the Chart's `contentBox` attribute.
     * @private
     */
    _setAriaElements: function(bb, cb)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setAriaElements", 1584);
_yuitest_coverline("build/charts-base/charts-base.js", 1586);
var description = this._getAriaOffscreenNode(),
            id = this.get("id") + "_description",
            liveRegion = this._getAriaOffscreenNode();
        _yuitest_coverline("build/charts-base/charts-base.js", 1589);
cb.set("tabIndex", 0);
        _yuitest_coverline("build/charts-base/charts-base.js", 1590);
cb.set("role", "img");
        _yuitest_coverline("build/charts-base/charts-base.js", 1591);
cb.setAttribute("aria-label", this.get("ariaLabel"));
        _yuitest_coverline("build/charts-base/charts-base.js", 1592);
cb.setAttribute("aria-describedby", id);
        _yuitest_coverline("build/charts-base/charts-base.js", 1593);
description.set("id", id);
        _yuitest_coverline("build/charts-base/charts-base.js", 1594);
description.set("tabIndex", -1);
        _yuitest_coverline("build/charts-base/charts-base.js", 1595);
description.appendChild(DOCUMENT.createTextNode(this.get("ariaDescription")));
        _yuitest_coverline("build/charts-base/charts-base.js", 1596);
liveRegion.set("id", "live-region");
        _yuitest_coverline("build/charts-base/charts-base.js", 1597);
liveRegion.set("aria-live", "polite");
        _yuitest_coverline("build/charts-base/charts-base.js", 1598);
liveRegion.set("aria-atomic", "true");
        _yuitest_coverline("build/charts-base/charts-base.js", 1599);
liveRegion.set("role", "status");
        _yuitest_coverline("build/charts-base/charts-base.js", 1600);
bb.setAttribute("role", "application");
        _yuitest_coverline("build/charts-base/charts-base.js", 1601);
bb.appendChild(description);
        _yuitest_coverline("build/charts-base/charts-base.js", 1602);
bb.appendChild(liveRegion);
        _yuitest_coverline("build/charts-base/charts-base.js", 1603);
this._description = description;
        _yuitest_coverline("build/charts-base/charts-base.js", 1604);
this._liveRegion = liveRegion;
    },

    /**
     * Sets a node offscreen for use as aria-description or aria-live-regin.
     *
     * @method _setOffscreen
     * @return Node
     * @private
     */
    _getAriaOffscreenNode: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getAriaOffscreenNode", 1614);
_yuitest_coverline("build/charts-base/charts-base.js", 1616);
var node = Y.Node.create("<div></div>"),
            ie = Y.UA.ie,
            clipRect = (ie && ie < 8) ? "rect(1px 1px 1px 1px)" : "rect(1px, 1px, 1px, 1px)";
        _yuitest_coverline("build/charts-base/charts-base.js", 1619);
node.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 1620);
node.setStyle("height", "1px");
        _yuitest_coverline("build/charts-base/charts-base.js", 1621);
node.setStyle("width", "1px");
        _yuitest_coverline("build/charts-base/charts-base.js", 1622);
node.setStyle("overflow", "hidden");
        _yuitest_coverline("build/charts-base/charts-base.js", 1623);
node.setStyle("clip", clipRect);
        _yuitest_coverline("build/charts-base/charts-base.js", 1624);
return node;
    },

    /**
     * @method syncUI
     * @private
     */
    syncUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "syncUI", 1631);
_yuitest_coverline("build/charts-base/charts-base.js", 1633);
this._redraw();
    },

    /**
     * @method bindUI
     * @private
     */
    bindUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "bindUI", 1640);
_yuitest_coverline("build/charts-base/charts-base.js", 1642);
this.after("tooltipChange", Y.bind(this._tooltipChangeHandler, this));
        _yuitest_coverline("build/charts-base/charts-base.js", 1643);
this.after("widthChange", this._sizeChanged);
        _yuitest_coverline("build/charts-base/charts-base.js", 1644);
this.after("heightChange", this._sizeChanged);
        _yuitest_coverline("build/charts-base/charts-base.js", 1645);
this.after("groupMarkersChange", this._groupMarkersChangeHandler);
        _yuitest_coverline("build/charts-base/charts-base.js", 1646);
var tt = this.get("tooltip"),
            hideEvent = "mouseout",
            showEvent = "mouseover",
            cb = this.get("contentBox"),
            interactionType = this.get("interactionType"),
            i = 0,
            len,
            markerClassName = "." + SERIES_MARKER,
            isTouch = ((WINDOW && ("ontouchstart" in WINDOW)) && !(Y.UA.chrome && Y.UA.chrome < 6));
        _yuitest_coverline("build/charts-base/charts-base.js", 1655);
Y.on("keydown", Y.bind(function(e) {
            _yuitest_coverfunc("build/charts-base/charts-base.js", "(anonymous 3)", 1655);
_yuitest_coverline("build/charts-base/charts-base.js", 1656);
var key = e.keyCode,
                numKey = parseFloat(key),
                msg;
            _yuitest_coverline("build/charts-base/charts-base.js", 1659);
if(numKey > 36 && numKey < 41)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1661);
e.halt();
                _yuitest_coverline("build/charts-base/charts-base.js", 1662);
msg = this._getAriaMessage(numKey);
                _yuitest_coverline("build/charts-base/charts-base.js", 1663);
this._liveRegion.setContent("");
                _yuitest_coverline("build/charts-base/charts-base.js", 1664);
this._liveRegion.appendChild(DOCUMENT.createTextNode(msg));
            }
        }, this), this.get("contentBox"));
        _yuitest_coverline("build/charts-base/charts-base.js", 1667);
if(interactionType == "marker")
        {
            //if touch capabilities, toggle tooltip on touchend. otherwise, the tooltip attribute's hideEvent/showEvent types.
            _yuitest_coverline("build/charts-base/charts-base.js", 1670);
hideEvent = tt.hideEvent;
            _yuitest_coverline("build/charts-base/charts-base.js", 1671);
showEvent = tt.showEvent;
            _yuitest_coverline("build/charts-base/charts-base.js", 1672);
if(isTouch)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1674);
Y.delegate("touchend", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                //hide active tooltip if the chart is touched
                _yuitest_coverline("build/charts-base/charts-base.js", 1676);
Y.on("touchend", Y.bind(function(e) {
                    //only halt the event if it originated from the chart
                    _yuitest_coverfunc("build/charts-base/charts-base.js", "(anonymous 4)", 1676);
_yuitest_coverline("build/charts-base/charts-base.js", 1678);
if(cb.contains(e.target))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 1680);
e.halt(true);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 1682);
if(this._activeMarker)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 1684);
this._activeMarker = null;
                        _yuitest_coverline("build/charts-base/charts-base.js", 1685);
this.hideTooltip(e);
                    }
                }, this));
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1691);
Y.delegate("mouseenter", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                _yuitest_coverline("build/charts-base/charts-base.js", 1692);
Y.delegate("mousedown", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                _yuitest_coverline("build/charts-base/charts-base.js", 1693);
Y.delegate("mouseup", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                _yuitest_coverline("build/charts-base/charts-base.js", 1694);
Y.delegate("mouseleave", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                _yuitest_coverline("build/charts-base/charts-base.js", 1695);
Y.delegate("click", Y.bind(this._markerEventDispatcher, this), cb, markerClassName);
                _yuitest_coverline("build/charts-base/charts-base.js", 1696);
Y.delegate("mousemove", Y.bind(this._positionTooltip, this), cb, markerClassName);
            }
        }
        else {_yuitest_coverline("build/charts-base/charts-base.js", 1699);
if(interactionType == "planar")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1701);
if(isTouch)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1703);
this._overlay.on("touchend", Y.bind(this._planarEventDispatcher, this));
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1707);
this._overlay.on("mousemove", Y.bind(this._planarEventDispatcher, this));
                _yuitest_coverline("build/charts-base/charts-base.js", 1708);
this.on("mouseout", this.hideTooltip);
            }
        }}
        _yuitest_coverline("build/charts-base/charts-base.js", 1711);
if(tt)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1713);
this.on("markerEvent:touchend", Y.bind(function(e) {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "(anonymous 5)", 1713);
_yuitest_coverline("build/charts-base/charts-base.js", 1714);
var marker = e.series.get("markers")[e.index];
                _yuitest_coverline("build/charts-base/charts-base.js", 1715);
if(this._activeMarker && marker === this._activeMarker)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1717);
this._activeMarker = null;
                    _yuitest_coverline("build/charts-base/charts-base.js", 1718);
this.hideTooltip(e);
                }
                else
                {

                    _yuitest_coverline("build/charts-base/charts-base.js", 1723);
this._activeMarker = marker;
                    _yuitest_coverline("build/charts-base/charts-base.js", 1724);
tt.markerEventHandler.apply(this, [e]);
                }
            }, this));
            _yuitest_coverline("build/charts-base/charts-base.js", 1727);
if(hideEvent && showEvent && hideEvent == showEvent)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1729);
this.on(interactionType + "Event:" + hideEvent, this.toggleTooltip);
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1733);
if(showEvent)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1735);
this.on(interactionType + "Event:" + showEvent, tt[interactionType + "EventHandler"]);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 1737);
if(hideEvent)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1739);
if(Y_Lang.isArray(hideEvent))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 1741);
len = hideEvent.length;
                        _yuitest_coverline("build/charts-base/charts-base.js", 1742);
for(; i < len; ++i)
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 1744);
this.on(interactionType + "Event:" + hideEvent[i], this.hideTooltip);
                        }
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 1747);
this.on(interactionType + "Event:" + hideEvent, this.hideTooltip);
                }
            }
        }
    },

    /**
     * Event handler for marker events.
     *
     * @method _markerEventDispatcher
     * @param {Object} e Event object.
     * @private
     */
    _markerEventDispatcher: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_markerEventDispatcher", 1760);
_yuitest_coverline("build/charts-base/charts-base.js", 1762);
var type = e.type,
            cb = this.get("contentBox"),
            markerNode = e.currentTarget,
            strArr = markerNode.getAttribute("id").split("_"),
            index = strArr.pop(),
            seriesIndex = strArr.pop(),
            series = this.getSeries(parseInt(seriesIndex, 10)),
            items = this.getSeriesItems(series, index),
            isTouch = e && e.hasOwnProperty("changedTouches"),
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            x = pageX - cb.getX(),
            y = pageY - cb.getY();
        _yuitest_coverline("build/charts-base/charts-base.js", 1775);
if(type == "mouseenter")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1777);
type = "mouseover";
        }
        else {_yuitest_coverline("build/charts-base/charts-base.js", 1779);
if(type == "mouseleave")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1781);
type = "mouseout";
        }}
        _yuitest_coverline("build/charts-base/charts-base.js", 1783);
series.updateMarkerState(type, index);
        _yuitest_coverline("build/charts-base/charts-base.js", 1784);
e.halt();
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseover event.
         *
         *
         * @event markerEvent:mouseover
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseout event.
         *
         * @event markerEvent:mouseout
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mousedown event.
         *
         * @event markerEvent:mousedown
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a mouseup event.
         *
         * @event markerEvent:mouseup
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *  </dl>
         */
        /**
         * Broadcasts when `interactionType` is set to `marker` and a series marker has received a click event.
         *
         * @event markerEvent:click
         * @preventable false
         * @param {EventFacade} e Event facade with the following additional
         *   properties:
         *  <dl>
         *      <dt>categoryItem</dt><dd>Hash containing information about the category `Axis`.</dd>
         *      <dt>valueItem</dt><dd>Hash containing information about the value `Axis`.</dd>
         *      <dt>node</dt><dd>The dom node of the marker.</dd>
         *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
         *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>
         *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>
         *      <dt>series</dt><dd>Reference to the series of the marker.</dd>
         *      <dt>index</dt><dd>Index of the marker in the series.</dd>
         *      <dt>seriesIndex</dt><dd>The `order` of the marker's series.</dd>
         *      <dt>originEvent</dt><dd>Underlying dom event.</dd>
         *  </dl>
         */
        _yuitest_coverline("build/charts-base/charts-base.js", 1879);
this.fire("markerEvent:" + type, {
            originEvent: e,
            pageX:pageX,
            pageY:pageY,
            categoryItem:items.category,
            valueItem:items.value,
            node:markerNode,
            x:x,
            y:y,
            series:series,
            index:index,
            seriesIndex:seriesIndex
        });
    },

    /**
     * Event handler for dataProviderChange.
     *
     * @method _dataProviderChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _dataProviderChangeHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_dataProviderChangeHandler", 1901);
_yuitest_coverline("build/charts-base/charts-base.js", 1903);
var dataProvider = e.newVal,
            axes,
            i,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 1907);
this._seriesIndex = -1;
        _yuitest_coverline("build/charts-base/charts-base.js", 1908);
this._itemIndex = -1;
        _yuitest_coverline("build/charts-base/charts-base.js", 1909);
if(this instanceof Y.CartesianChart)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1911);
this.set("axes", this.get("axes"));
            _yuitest_coverline("build/charts-base/charts-base.js", 1912);
this.set("seriesCollection", this.get("seriesCollection"));
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 1914);
axes = this.get("axes");
        _yuitest_coverline("build/charts-base/charts-base.js", 1915);
if(axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1917);
for(i in axes)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 1919);
if(axes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 1921);
axis = axes[i];
                    _yuitest_coverline("build/charts-base/charts-base.js", 1922);
if(axis instanceof Y.Axis)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 1924);
if(axis.get("position") != "none")
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 1926);
this._addToAxesRenderQueue(axis);
                        }
                        _yuitest_coverline("build/charts-base/charts-base.js", 1928);
axis.set("dataProvider", dataProvider);
                    }
                }
            }
        }
    },

    /**
     * Event listener for toggling the tooltip. If a tooltip is visible, hide it. If not, it
     * will create and show a tooltip based on the event object.
     *
     * @method toggleTooltip
     * @param {Object} e Event object.
     */
    toggleTooltip: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "toggleTooltip", 1942);
_yuitest_coverline("build/charts-base/charts-base.js", 1944);
var tt = this.get("tooltip");
        _yuitest_coverline("build/charts-base/charts-base.js", 1945);
if(tt.visible)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1947);
this.hideTooltip();
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1951);
tt.markerEventHandler.apply(this, [e]);
        }
    },

    /**
     * Shows a tooltip
     *
     * @method _showTooltip
     * @param {String} msg Message to dispaly in the tooltip.
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     * @private
     */
    _showTooltip: function(msg, x, y)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_showTooltip", 1964);
_yuitest_coverline("build/charts-base/charts-base.js", 1966);
var tt = this.get("tooltip"),
            node = tt.node;
        _yuitest_coverline("build/charts-base/charts-base.js", 1968);
if(msg)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1970);
tt.visible = true;
            _yuitest_coverline("build/charts-base/charts-base.js", 1971);
tt.setTextFunction(node, msg);
            _yuitest_coverline("build/charts-base/charts-base.js", 1972);
node.setStyle("top", y + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 1973);
node.setStyle("left", x + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 1974);
node.setStyle("visibility", "visible");
        }
    },

    /**
     * Positions the tooltip
     *
     * @method _positionTooltip
     * @param {Object} e Event object.
     * @private
     */
    _positionTooltip: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_positionTooltip", 1985);
_yuitest_coverline("build/charts-base/charts-base.js", 1987);
var tt = this.get("tooltip"),
            node = tt.node,
            cb = this.get("contentBox"),
            x = (e.pageX + 10) - cb.getX(),
            y = (e.pageY + 10) - cb.getY();
        _yuitest_coverline("build/charts-base/charts-base.js", 1992);
if(node)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 1994);
node.setStyle("left", x + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 1995);
node.setStyle("top", y + "px");
        }
    },

    /**
     * Hides the default tooltip
     *
     * @method hideTooltip
     */
    hideTooltip: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "hideTooltip", 2004);
_yuitest_coverline("build/charts-base/charts-base.js", 2006);
var tt = this.get("tooltip"),
            node = tt.node;
        _yuitest_coverline("build/charts-base/charts-base.js", 2008);
tt.visible = false;
        _yuitest_coverline("build/charts-base/charts-base.js", 2009);
node.set("innerHTML", "");
        _yuitest_coverline("build/charts-base/charts-base.js", 2010);
node.setStyle("left", -10000);
        _yuitest_coverline("build/charts-base/charts-base.js", 2011);
node.setStyle("top", -10000);
        _yuitest_coverline("build/charts-base/charts-base.js", 2012);
node.setStyle("visibility", "hidden");
    },

    /**
     * Adds a tooltip to the dom.
     *
     * @method _addTooltip
     * @private
     */
    _addTooltip: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addTooltip", 2021);
_yuitest_coverline("build/charts-base/charts-base.js", 2023);
var tt = this.get("tooltip"),
            id = this.get("id") + "_tooltip",
            cb = this.get("contentBox"),
            oldNode = DOCUMENT.getElementById(id);
        _yuitest_coverline("build/charts-base/charts-base.js", 2027);
if(oldNode)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2029);
cb.removeChild(oldNode);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2031);
tt.node.set("id", id);
        _yuitest_coverline("build/charts-base/charts-base.js", 2032);
tt.node.setStyle("visibility", "hidden");
        _yuitest_coverline("build/charts-base/charts-base.js", 2033);
cb.appendChild(tt.node);
    },

    /**
     * Updates the tooltip attribute.
     *
     * @method _updateTooltip
     * @param {Object} val Object containing properties for the tooltip.
     * @return Object
     * @private
     */
    _updateTooltip: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_updateTooltip", 2044);
_yuitest_coverline("build/charts-base/charts-base.js", 2046);
var tt = this.get("tooltip") || this._getTooltip(),
            i,
            styles,
            node,
            props = {
                markerLabelFunction:"markerLabelFunction",
                planarLabelFunction:"planarLabelFunction",
                setTextFunction:"setTextFunction",
                showEvent:"showEvent",
                hideEvent:"hideEvent",
                markerEventHandler:"markerEventHandler",
                planarEventHandler:"planarEventHandler",
                show:"show"
            };
        _yuitest_coverline("build/charts-base/charts-base.js", 2060);
if(Y_Lang.isObject(val))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2062);
styles = val.styles;
            _yuitest_coverline("build/charts-base/charts-base.js", 2063);
node = Y.one(val.node) || tt.node;
            _yuitest_coverline("build/charts-base/charts-base.js", 2064);
if(styles)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2066);
for(i in styles)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2068);
if(styles.hasOwnProperty(i))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2070);
node.setStyle(i, styles[i]);
                    }
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2074);
for(i in props)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2076);
if(val.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2078);
tt[i] = val[i];
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2081);
tt.node = node;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2083);
return tt;
    },

    /**
     * Default getter for `tooltip` attribute.
     *
     * @method _getTooltip
     * @return Object
     * @private
     */
    _getTooltip: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getTooltip", 2093);
_yuitest_coverline("build/charts-base/charts-base.js", 2095);
var node = DOCUMENT.createElement("div"),
            tooltipClass = _getClassName("chart-tooltip"),
            tt = {
                setTextFunction: this._setText,
                markerLabelFunction: this._tooltipLabelFunction,
                planarLabelFunction: this._planarLabelFunction,
                show: true,
                hideEvent: "mouseout",
                showEvent: "mouseover",
                markerEventHandler: function(e)
                {
                    _yuitest_coverfunc("build/charts-base/charts-base.js", "markerEventHandler", 2104);
_yuitest_coverline("build/charts-base/charts-base.js", 2106);
var tt = this.get("tooltip"),
                    msg = tt.markerLabelFunction.apply(this, [e.categoryItem, e.valueItem, e.index, e.series, e.seriesIndex]);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2108);
this._showTooltip(msg, e.x + 10, e.y + 10);
                },
                planarEventHandler: function(e)
                {
                    _yuitest_coverfunc("build/charts-base/charts-base.js", "planarEventHandler", 2110);
_yuitest_coverline("build/charts-base/charts-base.js", 2112);
var tt = this.get("tooltip"),
                        msg ,
                        categoryAxis = this.get("categoryAxis");
                    _yuitest_coverline("build/charts-base/charts-base.js", 2115);
msg = tt.planarLabelFunction.apply(this, [categoryAxis, e.valueItem, e.index, e.items, e.seriesIndex]);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2116);
this._showTooltip(msg, e.x + 10, e.y + 10);
                }
            };
        _yuitest_coverline("build/charts-base/charts-base.js", 2119);
node = Y.one(node);
        _yuitest_coverline("build/charts-base/charts-base.js", 2120);
node.set("id", this.get("id") + "_tooltip");
        _yuitest_coverline("build/charts-base/charts-base.js", 2121);
node.setStyle("fontSize", "85%");
        _yuitest_coverline("build/charts-base/charts-base.js", 2122);
node.setStyle("opacity", "0.83");
        _yuitest_coverline("build/charts-base/charts-base.js", 2123);
node.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 2124);
node.setStyle("paddingTop", "2px");
        _yuitest_coverline("build/charts-base/charts-base.js", 2125);
node.setStyle("paddingRight", "5px");
        _yuitest_coverline("build/charts-base/charts-base.js", 2126);
node.setStyle("paddingBottom", "4px");
        _yuitest_coverline("build/charts-base/charts-base.js", 2127);
node.setStyle("paddingLeft", "2px");
        _yuitest_coverline("build/charts-base/charts-base.js", 2128);
node.setStyle("backgroundColor", "#fff");
        _yuitest_coverline("build/charts-base/charts-base.js", 2129);
node.setStyle("border", "1px solid #dbdccc");
        _yuitest_coverline("build/charts-base/charts-base.js", 2130);
node.setStyle("pointerEvents", "none");
        _yuitest_coverline("build/charts-base/charts-base.js", 2131);
node.setStyle("zIndex", 3);
        _yuitest_coverline("build/charts-base/charts-base.js", 2132);
node.setStyle("whiteSpace", "noWrap");
        _yuitest_coverline("build/charts-base/charts-base.js", 2133);
node.setStyle("visibility", "hidden");
        _yuitest_coverline("build/charts-base/charts-base.js", 2134);
node.addClass(tooltipClass);
        _yuitest_coverline("build/charts-base/charts-base.js", 2135);
tt.node = Y.one(node);
        _yuitest_coverline("build/charts-base/charts-base.js", 2136);
return tt;
    },

    /**
     * Formats tooltip text when `interactionType` is `planar`.
     *
     * @method _planarLabelFunction
     * @param {Axis} categoryAxis Reference to the categoryAxis of the chart.
     * @param {Array} valueItems Array of objects for each series that has a data point in the coordinate plane of the event.
     * Each object contains the following data:
     *  <dl>
     *      <dt>axis</dt><dd>The value axis of the series.</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *  </dl>
     *  @param {Number} index The index of the item within its series.
     *  @param {Array} seriesArray Array of series instances for each value item.
     *  @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     *  @return {String | HTML}
     * @private
     */
    _planarLabelFunction: function(categoryAxis, valueItems, index, seriesArray, seriesIndex)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_planarLabelFunction", 2158);
_yuitest_coverline("build/charts-base/charts-base.js", 2160);
var msg = DOCUMENT.createElement("div"),
            valueItem,
            i = 0,
            len = seriesArray.length,
            axis,
            categoryValue,
            seriesValue,
            series;
        _yuitest_coverline("build/charts-base/charts-base.js", 2168);
if(categoryAxis)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2170);
categoryValue = categoryAxis.get("labelFunction").apply(this, [categoryAxis.getKeyValueAt(this.get("categoryKey"), index), categoryAxis.get("labelFormat")]);
            _yuitest_coverline("build/charts-base/charts-base.js", 2171);
if(!Y_Lang.isObject(categoryValue))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2173);
categoryValue = DOCUMENT.createTextNode(categoryValue);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2175);
msg.appendChild(categoryValue);
        }

        _yuitest_coverline("build/charts-base/charts-base.js", 2178);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2180);
series = seriesArray[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 2181);
if(series.get("visible"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2183);
valueItem = valueItems[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 2184);
axis = valueItem.axis;
                _yuitest_coverline("build/charts-base/charts-base.js", 2185);
seriesValue =  axis.get("labelFunction").apply(this, [axis.getKeyValueAt(valueItem.key, index), axis.get("labelFormat")]);
                _yuitest_coverline("build/charts-base/charts-base.js", 2186);
msg.appendChild(DOCUMENT.createElement("br"));
                _yuitest_coverline("build/charts-base/charts-base.js", 2187);
msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName));
                _yuitest_coverline("build/charts-base/charts-base.js", 2188);
msg.appendChild(DOCUMENT.createTextNode(": "));
                _yuitest_coverline("build/charts-base/charts-base.js", 2189);
if(!Y_Lang.isObject(seriesValue))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2191);
seriesValue = DOCUMENT.createTextNode(seriesValue);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 2193);
msg.appendChild(seriesValue);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2196);
return msg;
    },

    /**
     * Formats tooltip text when `interactionType` is `marker`.
     *
     * @method _tooltipLabelFunction
     * @param {Object} categoryItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category</dd>
     *  </dl>
     * @param {Object} valueItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *  </dl>
     * @param {Number} itemIndex The index of the item within the series.
     * @param {CartesianSeries} series The `CartesianSeries` instance of the item.
     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     * @return {String | HTML}
     * @private
     */
    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_tooltipLabelFunction", 2223);
_yuitest_coverline("build/charts-base/charts-base.js", 2225);
var msg = DOCUMENT.createElement("div"),
            categoryValue = categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]),
            seriesValue = valueItem.axis.get("labelFunction").apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]);
        _yuitest_coverline("build/charts-base/charts-base.js", 2228);
msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName));
        _yuitest_coverline("build/charts-base/charts-base.js", 2229);
msg.appendChild(DOCUMENT.createTextNode(": "));
        _yuitest_coverline("build/charts-base/charts-base.js", 2230);
if(!Y_Lang.isObject(categoryValue))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2232);
categoryValue = DOCUMENT.createTextNode(categoryValue);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2234);
msg.appendChild(categoryValue);
        _yuitest_coverline("build/charts-base/charts-base.js", 2235);
msg.appendChild(DOCUMENT.createElement("br"));
        _yuitest_coverline("build/charts-base/charts-base.js", 2236);
msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName));
        _yuitest_coverline("build/charts-base/charts-base.js", 2237);
msg.appendChild(DOCUMENT.createTextNode(": "));
        _yuitest_coverline("build/charts-base/charts-base.js", 2238);
if(!Y_Lang.isObject(seriesValue))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2240);
seriesValue = DOCUMENT.createTextNode(seriesValue);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2242);
msg.appendChild(seriesValue);
        _yuitest_coverline("build/charts-base/charts-base.js", 2243);
return msg;
    },

    /**
     * Event handler for the tooltipChange.
     *
     * @method _tooltipChangeHandler
     * @param {Object} e Event object.
     * @private
     */
    _tooltipChangeHandler: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_tooltipChangeHandler", 2253);
_yuitest_coverline("build/charts-base/charts-base.js", 2255);
if(this.get("tooltip"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2257);
var tt = this.get("tooltip"),
                node = tt.node,
                show = tt.show,
                cb = this.get("contentBox");
            _yuitest_coverline("build/charts-base/charts-base.js", 2261);
if(node && show)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2263);
if(!cb.contains(node))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2265);
this._addTooltip();
                }
            }
        }
    },

    /**
     * Updates the content of text field. This method writes a value into a text field using
     * `appendChild`. If the value is a `String`, it is converted to a `TextNode` first.
     *
     * @method _setText
     * @param label {HTMLElement} label to be updated
     * @param val {String} value with which to update the label
     * @private
     */
    _setText: function(textField, val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setText", 2280);
_yuitest_coverline("build/charts-base/charts-base.js", 2282);
textField.setContent("");
        _yuitest_coverline("build/charts-base/charts-base.js", 2283);
if(Y_Lang.isNumber(val))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2285);
val = val + "";
        }
        else {_yuitest_coverline("build/charts-base/charts-base.js", 2287);
if(!val)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2289);
val = "";
        }}
        _yuitest_coverline("build/charts-base/charts-base.js", 2291);
if(IS_STRING(val))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2293);
val = DOCUMENT.createTextNode(val);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2295);
textField.appendChild(val);
    },

    /**
     * Returns all the keys contained in a  `dataProvider`.
     *
     * @method _getAllKeys
     * @param {Array} dp Collection of objects to be parsed.
     * @return Object
     */
    _getAllKeys: function(dp)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getAllKeys", 2305);
_yuitest_coverline("build/charts-base/charts-base.js", 2307);
var i = 0,
            len = dp.length,
            item,
            key,
            keys = {};
        _yuitest_coverline("build/charts-base/charts-base.js", 2312);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2314);
item = dp[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 2315);
for(key in item)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2317);
if(item.hasOwnProperty(key))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2319);
keys[key] = true;
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2323);
return keys;
    },

    /**
     * Constructs seriesKeys if not explicitly specified.
     *
     * @method _buildSeriesKeys
     * @param {Array} dataProvider The dataProvider for the chart.
     * @return Array
     * @private
     */
    _buildSeriesKeys: function(dataProvider)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_buildSeriesKeys", 2334);
_yuitest_coverline("build/charts-base/charts-base.js", 2336);
var allKeys,
            catKey = this.get("categoryKey"),
            keys = [],
            i;
        _yuitest_coverline("build/charts-base/charts-base.js", 2340);
if(this._seriesKeysExplicitlySet)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2342);
return this._seriesKeys;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2344);
allKeys = this._getAllKeys(dataProvider);
        _yuitest_coverline("build/charts-base/charts-base.js", 2345);
for(i in allKeys)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2347);
if(allKeys.hasOwnProperty(i) && i != catKey)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2349);
keys.push(i);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2352);
return keys;
    }
};
_yuitest_coverline("build/charts-base/charts-base.js", 2355);
Y.ChartBase = ChartBase;
/**
 * The CartesianChart class creates a chart with horizontal and vertical axes.
 *
 * @class CartesianChart
 * @extends ChartBase
 * @constructor
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 2364);
Y.CartesianChart = Y.Base.create("cartesianChart", Y.Widget, [Y.ChartBase], {
    /**
     * @method renderUI
     * @private
     */
    renderUI: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "renderUI", 2369);
_yuitest_coverline("build/charts-base/charts-base.js", 2371);
var bb = this.get("boundingBox"),
            cb = this.get("contentBox"),
            tt = this.get("tooltip"),
            overlay,
            overlayClass = _getClassName("overlay");
        //move the position = absolute logic to a class file
        _yuitest_coverline("build/charts-base/charts-base.js", 2377);
bb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 2378);
cb.setStyle("position", "absolute");
        _yuitest_coverline("build/charts-base/charts-base.js", 2379);
this._addAxes();
        _yuitest_coverline("build/charts-base/charts-base.js", 2380);
this._addGridlines();
        _yuitest_coverline("build/charts-base/charts-base.js", 2381);
this._addSeries();
        _yuitest_coverline("build/charts-base/charts-base.js", 2382);
if(tt && tt.show)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2384);
this._addTooltip();
        }
        //If there is a style definition. Force them to set.
        _yuitest_coverline("build/charts-base/charts-base.js", 2387);
this.get("styles");
        _yuitest_coverline("build/charts-base/charts-base.js", 2388);
if(this.get("interactionType") == "planar")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2390);
overlay = DOCUMENT.createElement("div");
            _yuitest_coverline("build/charts-base/charts-base.js", 2391);
this.get("contentBox").appendChild(overlay);
            _yuitest_coverline("build/charts-base/charts-base.js", 2392);
this._overlay = Y.one(overlay);
            _yuitest_coverline("build/charts-base/charts-base.js", 2393);
this._overlay.set("id", this.get("id") + "_overlay");
            _yuitest_coverline("build/charts-base/charts-base.js", 2394);
this._overlay.setStyle("position", "absolute");
            _yuitest_coverline("build/charts-base/charts-base.js", 2395);
this._overlay.setStyle("background", "#fff");
            _yuitest_coverline("build/charts-base/charts-base.js", 2396);
this._overlay.setStyle("opacity", 0);
            _yuitest_coverline("build/charts-base/charts-base.js", 2397);
this._overlay.addClass(overlayClass);
            _yuitest_coverline("build/charts-base/charts-base.js", 2398);
this._overlay.setStyle("zIndex", 4);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2400);
this._setAriaElements(bb, cb);
        _yuitest_coverline("build/charts-base/charts-base.js", 2401);
this._redraw();
    },

    /**
     * When `interactionType` is set to `planar`, listens for mouse move events and fires `planarEvent:mouseover` or `planarEvent:mouseout`
     * depending on the position of the mouse in relation to data points on the `Chart`.
     *
     * @method _planarEventDispatcher
     * @param {Object} e Event object.
     * @private
     */
    _planarEventDispatcher: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_planarEventDispatcher", 2412);
_yuitest_coverline("build/charts-base/charts-base.js", 2414);
var graph = this.get("graph"),
            bb = this.get("boundingBox"),
            cb = graph.get("contentBox"),
            isTouch = e && e.hasOwnProperty("changedTouches"),
            pageX = isTouch ? e.changedTouches[0].pageX : e.pageX,
            pageY = isTouch ? e.changedTouches[0].pageY : e.pageY,
            posX = pageX - bb.getX(),
            posY = pageY - bb.getY(),
            offset = {
                x: pageX - cb.getX(),
                y: pageY - cb.getY()
            },
            sc = graph.get("seriesCollection"),
            series,
            i = 0,
            index,
            oldIndex = this._selectedIndex,
            item,
            items = [],
            categoryItems = [],
            valueItems = [],
            direction = this.get("direction"),
            hasMarkers,
            catAxis,
            valAxis,
            coord,
            //data columns and area data could be created on a graph level
            markerPlane,
            len,
            coords;
        _yuitest_coverline("build/charts-base/charts-base.js", 2444);
e.halt(true);
        _yuitest_coverline("build/charts-base/charts-base.js", 2445);
if(direction == "horizontal")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2447);
catAxis = "x";
            _yuitest_coverline("build/charts-base/charts-base.js", 2448);
valAxis = "y";
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2452);
valAxis = "x";
            _yuitest_coverline("build/charts-base/charts-base.js", 2453);
catAxis = "y";
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2455);
coord = offset[catAxis];
        _yuitest_coverline("build/charts-base/charts-base.js", 2456);
if(sc)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2458);
len = sc.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 2459);
while(i < len && !markerPlane)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2461);
if(sc[i])
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2463);
markerPlane = sc[i].get(catAxis + "MarkerPlane");
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 2465);
i++;
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2468);
if(markerPlane)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2470);
len = markerPlane.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 2471);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2473);
if(coord <= markerPlane[i].end && coord >= markerPlane[i].start)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2475);
index = i;
                    _yuitest_coverline("build/charts-base/charts-base.js", 2476);
break;
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2479);
len = sc.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 2480);
for(i = 0; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2482);
series = sc[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 2483);
coords = series.get(valAxis + "coords");
                _yuitest_coverline("build/charts-base/charts-base.js", 2484);
hasMarkers = series.get("markers");
                _yuitest_coverline("build/charts-base/charts-base.js", 2485);
if(hasMarkers && !isNaN(oldIndex) && oldIndex > -1)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2487);
series.updateMarkerState("mouseout", oldIndex);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 2489);
if(coords && coords[index] > -1)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2491);
if(hasMarkers && !isNaN(index) && index > -1)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2493);
series.updateMarkerState("mouseover", index);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 2495);
item = this.getSeriesItems(series, index);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2496);
categoryItems.push(item.category);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2497);
valueItems.push(item.value);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2498);
items.push(series);
                }

            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2502);
this._selectedIndex = index;

            /**
             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseover event.
             *
             *
             * @event planarEvent:mouseover
             * @preventable false
             * @param {EventFacade} e Event facade with the following additional
             *   properties:
             *  <dl>
             *      <dt>categoryItem</dt><dd>An array of hashes, each containing information about the category `Axis` of each marker
             *      whose plane has been intersected.</dd>
             *      <dt>valueItem</dt><dd>An array of hashes, each containing information about the value `Axis` of each marker whose
             *      plane has been intersected.</dd>
             *      <dt>x</dt><dd>The x-coordinate of the mouse in relation to the Chart.</dd>
             *      <dt>y</dt><dd>The y-coordinate of the mouse in relation to the Chart.</dd>
             *      <dt>pageX</dt><dd>The x location of the event on the page (including scroll)</dd>
             *      <dt>pageY</dt><dd>The y location of the event on the page (including scroll)</dd>
             *      <dt>items</dt><dd>An array including all the series which contain a marker whose plane has been intersected.</dd>
             *      <dt>index</dt><dd>Index of the markers in their respective series.</dd>
             *      <dt>originEvent</dt><dd>Underlying dom event.</dd>
             *  </dl>
             */
            /**
             * Broadcasts when `interactionType` is set to `planar` and a series' marker plane has received a mouseout event.
             *
             * @event planarEvent:mouseout
             * @preventable false
             * @param {EventFacade} e
             */
            _yuitest_coverline("build/charts-base/charts-base.js", 2533);
if(index > -1)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2535);
this.fire("planarEvent:mouseover", {
                    categoryItem:categoryItems,
                    valueItem:valueItems,
                    x:posX,
                    y:posY,
                    pageX:pageX,
                    pageY:pageY,
                    items:items,
                    index:index,
                    originEvent:e
                });
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2549);
this.fire("planarEvent:mouseout");
            }
        }
    },

    /**
     * Indicates the default series type for the chart.
     *
     * @property _type
     * @type {String}
     * @private
     */
    _type: "combo",

    /**
     * Queue of axes instances that will be updated. This method is used internally to determine when all axes have been updated.
     *
     * @property _itemRenderQueue
     * @type Array
     * @private
     */
    _itemRenderQueue: null,

    /**
     * Adds an `Axis` instance to the `_itemRenderQueue`.
     *
     * @method _addToAxesRenderQueue
     * @param {Axis} axis An `Axis` instance.
     * @private
     */
    _addToAxesRenderQueue: function(axis)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addToAxesRenderQueue", 2579);
_yuitest_coverline("build/charts-base/charts-base.js", 2581);
if(!this._itemRenderQueue)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2583);
this._itemRenderQueue = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2585);
if(Y.Array.indexOf(this._itemRenderQueue, axis) < 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2587);
this._itemRenderQueue.push(axis);
        }
    },

    /**
     * Adds axis instance to the appropriate array based on position
     *
     * @method _addToAxesCollection
     * @param {String} position The position of the axis
     * @param {Axis} axis The `Axis` instance
     */
    _addToAxesCollection: function(position, axis)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addToAxesCollection", 2598);
_yuitest_coverline("build/charts-base/charts-base.js", 2600);
var axesCollection = this.get(position + "AxesCollection");
        _yuitest_coverline("build/charts-base/charts-base.js", 2601);
if(!axesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2603);
axesCollection = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 2604);
this.set(position + "AxesCollection", axesCollection);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2606);
axesCollection.push(axis);
    },

    /**
     * Returns the default value for the `seriesCollection` attribute.
     *
     * @method _getDefaultSeriesCollection
     * @param {Array} val Array containing either `CartesianSeries` instances or objects containing data to construct series instances.
     * @return Array
     * @private
     */
    _getDefaultSeriesCollection: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultSeriesCollection", 2617);
_yuitest_coverline("build/charts-base/charts-base.js", 2619);
var seriesCollection,
            dataProvider = this.get("dataProvider");
        _yuitest_coverline("build/charts-base/charts-base.js", 2621);
if(dataProvider)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2623);
seriesCollection = this._parseSeriesCollection();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2625);
return seriesCollection;
    },

    /**
     * Parses and returns a series collection from an object and default properties.
     *
     * @method _parseSeriesCollection
     * @param {Object} val Object contain properties for series being set.
     * @return Object
     * @private
     */
    _parseSeriesCollection: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseSeriesCollection", 2636);
_yuitest_coverline("build/charts-base/charts-base.js", 2638);
var dir = this.get("direction"),
            sc = [],
            catAxis,
            valAxis,
            tempKeys = [],
            series,
            seriesKeys = this.get("seriesKeys").concat(),
            i,
            index,
            l,
            type = this.get("type"),
            key,
            catKey,
            seriesKey,
            graph,
            orphans = [],
            categoryKey = this.get("categoryKey"),
            showMarkers = this.get("showMarkers"),
            showAreaFill = this.get("showAreaFill"),
            showLines = this.get("showLines");
        _yuitest_coverline("build/charts-base/charts-base.js", 2658);
val = val || [];
        _yuitest_coverline("build/charts-base/charts-base.js", 2659);
if(dir == "vertical")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2661);
catAxis = "yAxis";
            _yuitest_coverline("build/charts-base/charts-base.js", 2662);
catKey = "yKey";
            _yuitest_coverline("build/charts-base/charts-base.js", 2663);
valAxis = "xAxis";
            _yuitest_coverline("build/charts-base/charts-base.js", 2664);
seriesKey = "xKey";
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2668);
catAxis = "xAxis";
            _yuitest_coverline("build/charts-base/charts-base.js", 2669);
catKey = "xKey";
            _yuitest_coverline("build/charts-base/charts-base.js", 2670);
valAxis = "yAxis";
            _yuitest_coverline("build/charts-base/charts-base.js", 2671);
seriesKey = "yKey";
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2673);
l = val.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 2674);
while(val && val.length > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2676);
series = val.shift();
            _yuitest_coverline("build/charts-base/charts-base.js", 2677);
key = this._getBaseAttribute(series, seriesKey);
            _yuitest_coverline("build/charts-base/charts-base.js", 2678);
if(key)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2680);
index = Y.Array.indexOf(seriesKeys, key);
                _yuitest_coverline("build/charts-base/charts-base.js", 2681);
if(index > -1)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2683);
seriesKeys.splice(index, 1);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2684);
tempKeys.push(key);
                    _yuitest_coverline("build/charts-base/charts-base.js", 2685);
sc.push(series);
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2689);
orphans.push(series);
                }
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2694);
orphans.push(series);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2697);
while(orphans.length > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2699);
series = orphans.shift();
            _yuitest_coverline("build/charts-base/charts-base.js", 2700);
if(seriesKeys.length > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2702);
key = seriesKeys.shift();
                _yuitest_coverline("build/charts-base/charts-base.js", 2703);
this._setBaseAttribute(series, seriesKey, key);
                _yuitest_coverline("build/charts-base/charts-base.js", 2704);
tempKeys.push(key);
                _yuitest_coverline("build/charts-base/charts-base.js", 2705);
sc.push(series);
            }
            else {_yuitest_coverline("build/charts-base/charts-base.js", 2707);
if(series instanceof Y.CartesianSeries)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2709);
series.destroy(true);
            }}
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2712);
if(seriesKeys.length > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2714);
tempKeys = tempKeys.concat(seriesKeys);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2716);
l = tempKeys.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 2717);
for(i = 0; i < l; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2719);
series = sc[i] || {type:type};
            _yuitest_coverline("build/charts-base/charts-base.js", 2720);
if(series instanceof Y.CartesianSeries)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2722);
this._parseSeriesAxes(series);
                _yuitest_coverline("build/charts-base/charts-base.js", 2723);
continue;
            }

            _yuitest_coverline("build/charts-base/charts-base.js", 2726);
series[catKey] = series[catKey] || categoryKey;
            _yuitest_coverline("build/charts-base/charts-base.js", 2727);
series[seriesKey] = series[seriesKey] || seriesKeys.shift();
            _yuitest_coverline("build/charts-base/charts-base.js", 2728);
series[catAxis] = this._getCategoryAxis();
            _yuitest_coverline("build/charts-base/charts-base.js", 2729);
series[valAxis] = this._getSeriesAxis(series[seriesKey]);

            _yuitest_coverline("build/charts-base/charts-base.js", 2731);
series.type = series.type || type;
            _yuitest_coverline("build/charts-base/charts-base.js", 2732);
series.direction = series.direction || dir;

            _yuitest_coverline("build/charts-base/charts-base.js", 2734);
if((series.type == "combo" || series.type == "stackedcombo" || series.type == "combospline" || series.type == "stackedcombospline"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2736);
if(showAreaFill !== null)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2738);
series.showAreaFill = (series.showAreaFill !== null && series.showAreaFill !== undefined) ? series.showAreaFill : showAreaFill;
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 2740);
if(showMarkers !== null)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2742);
series.showMarkers = (series.showMarkers !== null && series.showMarkers !== undefined) ? series.showMarkers : showMarkers;
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 2744);
if(showLines !== null)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2746);
series.showLines = (series.showLines !== null && series.showLines !== undefined) ? series.showLines : showLines;
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 2749);
sc[i] = series;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2751);
if(sc)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2753);
graph = this.get("graph");
            _yuitest_coverline("build/charts-base/charts-base.js", 2754);
graph.set("seriesCollection", sc);
            _yuitest_coverline("build/charts-base/charts-base.js", 2755);
sc = graph.get("seriesCollection");
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2757);
return sc;
    },

    /**
     * Parse and sets the axes for a series instance.
     *
     * @method _parseSeriesAxes
     * @param {CartesianSeries} series A `CartesianSeries` instance.
     * @private
     */
    _parseSeriesAxes: function(series)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseSeriesAxes", 2767);
_yuitest_coverline("build/charts-base/charts-base.js", 2769);
var axes = this.get("axes"),
            xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            YAxis = Y.Axis,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 2774);
if(xAxis && !(xAxis instanceof YAxis) && Y_Lang.isString(xAxis) && axes.hasOwnProperty(xAxis))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2776);
axis = axes[xAxis];
            _yuitest_coverline("build/charts-base/charts-base.js", 2777);
if(axis instanceof YAxis)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2779);
series.set("xAxis", axis);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2782);
if(yAxis && !(yAxis instanceof YAxis) && Y_Lang.isString(yAxis) && axes.hasOwnProperty(yAxis))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2784);
axis = axes[yAxis];
            _yuitest_coverline("build/charts-base/charts-base.js", 2785);
if(axis instanceof YAxis)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2787);
series.set("yAxis", axis);
            }
        }

    },

    /**
     * Returns the category axis instance for the chart.
     *
     * @method _getCategoryAxis
     * @return Axis
     * @private
     */
    _getCategoryAxis: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getCategoryAxis", 2800);
_yuitest_coverline("build/charts-base/charts-base.js", 2802);
var axis,
            axes = this.get("axes"),
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey");
        _yuitest_coverline("build/charts-base/charts-base.js", 2805);
axis = axes[categoryAxisName];
        _yuitest_coverline("build/charts-base/charts-base.js", 2806);
return axis;
    },

    /**
     * Returns the value axis for a series.
     *
     * @method _getSeriesAxis
     * @param {String} key The key value used to determine the axis instance.
     * @return Axis
     * @private
     */
    _getSeriesAxis:function(key, axisName)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getSeriesAxis", 2817);
_yuitest_coverline("build/charts-base/charts-base.js", 2819);
var axes = this.get("axes"),
            i,
            keys,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 2823);
if(axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2825);
if(axisName && axes.hasOwnProperty(axisName))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2827);
axis = axes[axisName];
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2831);
for(i in axes)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2833);
if(axes.hasOwnProperty(i))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2835);
keys = axes[i].get("keys");
                        _yuitest_coverline("build/charts-base/charts-base.js", 2836);
if(keys && keys.hasOwnProperty(key))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 2838);
axis = axes[i];
                            _yuitest_coverline("build/charts-base/charts-base.js", 2839);
break;
                        }
                    }
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2845);
return axis;
    },

    /**
     * Gets an attribute from an object, using a getter for Base objects and a property for object
     * literals. Used for determining attributes from series/axis references which can be an actual class instance
     * or a hash of properties that will be used to create a class instance.
     *
     * @method _getBaseAttribute
     * @param {Object} item Object or instance in which the attribute resides.
     * @param {String} key Attribute whose value will be returned.
     * @return Object
     * @private
     */
    _getBaseAttribute: function(item, key)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getBaseAttribute", 2859);
_yuitest_coverline("build/charts-base/charts-base.js", 2861);
if(item instanceof Y.Base)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2863);
return item.get(key);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2865);
if(item.hasOwnProperty(key))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2867);
return item[key];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 2869);
return null;
    },

    /**
     * Sets an attribute on an object, using a setter of Base objects and a property for object
     * literals. Used for setting attributes on a Base class, either directly or to be stored in an object literal
     * for use at instantiation.
     *
     * @method _setBaseAttribute
     * @param {Object} item Object or instance in which the attribute resides.
     * @param {String} key Attribute whose value will be assigned.
     * @param {Object} value Value to be assigned to the attribute.
     * @private
     */
    _setBaseAttribute: function(item, key, value)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setBaseAttribute", 2883);
_yuitest_coverline("build/charts-base/charts-base.js", 2885);
if(item instanceof Y.Base)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2887);
item.set(key, value);
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2891);
item[key] = value;
        }
    },

    /**
     * Creates `Axis` instances.
     *
     * @method _setAxes
     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.
     * @return Object
     * @private
     */
    _setAxes: function(val)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_setAxes", 2903);
_yuitest_coverline("build/charts-base/charts-base.js", 2905);
var hash = this._parseAxes(val),
            axes = {},
            axesAttrs = {
                edgeOffset: "edgeOffset",
                position: "position",
                overlapGraph:"overlapGraph",
                labelFunction:"labelFunction",
                labelFunctionScope:"labelFunctionScope",
                labelFormat:"labelFormat",
                appendLabelFunction: "appendLabelFunction",
                appendTitleFunction: "appendTitleFunction",
                maximum:"maximum",
                minimum:"minimum",
                roundingMethod:"roundingMethod",
                alwaysShowZero:"alwaysShowZero",
                title:"title",
                width:"width",
                height:"height"
            },
            dp = this.get("dataProvider"),
            ai,
            i,
            pos,
            axis,
            axisPosition,
            dh,
            axisClass,
            config,
            axesCollection;
        _yuitest_coverline("build/charts-base/charts-base.js", 2934);
for(i in hash)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 2936);
if(hash.hasOwnProperty(i))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 2938);
dh = hash[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 2939);
if(dh instanceof Y.Axis)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2941);
axis = dh;
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 2945);
axis = null;
                    _yuitest_coverline("build/charts-base/charts-base.js", 2946);
config = {};
                    _yuitest_coverline("build/charts-base/charts-base.js", 2947);
config.dataProvider = dh.dataProvider || dp;
                    _yuitest_coverline("build/charts-base/charts-base.js", 2948);
config.keys = dh.keys;

                    _yuitest_coverline("build/charts-base/charts-base.js", 2950);
if(dh.hasOwnProperty("roundingUnit"))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2952);
config.roundingUnit = dh.roundingUnit;
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 2954);
pos = dh.position;
                    _yuitest_coverline("build/charts-base/charts-base.js", 2955);
if(dh.styles)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2957);
config.styles = dh.styles;
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 2959);
config.position = dh.position;
                    _yuitest_coverline("build/charts-base/charts-base.js", 2960);
for(ai in axesAttrs)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2962);
if(axesAttrs.hasOwnProperty(ai) && dh.hasOwnProperty(ai))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 2964);
config[ai] = dh[ai];
                        }
                    }

                    //only check for existing axis if we constructed the default axes already
                    _yuitest_coverline("build/charts-base/charts-base.js", 2969);
if(val)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2971);
axis = this.getAxisByKey(i);
                    }

                    _yuitest_coverline("build/charts-base/charts-base.js", 2974);
if(axis && axis instanceof Y.Axis)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2976);
axisPosition = axis.get("position");
                        _yuitest_coverline("build/charts-base/charts-base.js", 2977);
if(pos != axisPosition)
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 2979);
if(axisPosition != "none")
                            {
                                _yuitest_coverline("build/charts-base/charts-base.js", 2981);
axesCollection = this.get(axisPosition + "AxesCollection");
                                _yuitest_coverline("build/charts-base/charts-base.js", 2982);
axesCollection.splice(Y.Array.indexOf(axesCollection, axis), 1);
                            }
                            _yuitest_coverline("build/charts-base/charts-base.js", 2984);
if(pos != "none")
                            {
                                _yuitest_coverline("build/charts-base/charts-base.js", 2986);
this._addToAxesCollection(pos, axis);
                            }
                        }
                        _yuitest_coverline("build/charts-base/charts-base.js", 2989);
axis.setAttrs(config);
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 2993);
axisClass = this._getAxisClass(dh.type);
                        _yuitest_coverline("build/charts-base/charts-base.js", 2994);
axis = new axisClass(config);
                        _yuitest_coverline("build/charts-base/charts-base.js", 2995);
axis.after("axisRendered", Y.bind(this._itemRendered, this));
                    }
                }

                _yuitest_coverline("build/charts-base/charts-base.js", 2999);
if(axis)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3001);
axesCollection = this.get(pos + "AxesCollection");
                    _yuitest_coverline("build/charts-base/charts-base.js", 3002);
if(axesCollection && Y.Array.indexOf(axesCollection, axis) > 0)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3004);
axis.set("overlapGraph", false);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 3006);
axes[i] = axis;
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3010);
return axes;
    },

    /**
     * Adds axes to the chart.
     *
     * @method _addAxes
     * @private
     */
    _addAxes: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addAxes", 3019);
_yuitest_coverline("build/charts-base/charts-base.js", 3021);
var axes = this.get("axes"),
            i,
            axis,
            pos,
            w = this.get("width"),
            h = this.get("height"),
            node = Y.Node.one(this._parentNode);
        _yuitest_coverline("build/charts-base/charts-base.js", 3028);
if(!this._axesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3030);
this._axesCollection = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3032);
for(i in axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3034);
if(axes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3036);
axis = axes[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3037);
if(axis instanceof Y.Axis)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3039);
if(!w)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3041);
this.set("width", node.get("offsetWidth"));
                        _yuitest_coverline("build/charts-base/charts-base.js", 3042);
w = this.get("width");
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 3044);
if(!h)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3046);
this.set("height", node.get("offsetHeight"));
                        _yuitest_coverline("build/charts-base/charts-base.js", 3047);
h = this.get("height");
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 3049);
this._addToAxesRenderQueue(axis);
                    _yuitest_coverline("build/charts-base/charts-base.js", 3050);
pos = axis.get("position");
                    _yuitest_coverline("build/charts-base/charts-base.js", 3051);
if(!this.get(pos + "AxesCollection"))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3053);
this.set(pos + "AxesCollection", [axis]);
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3057);
this.get(pos + "AxesCollection").push(axis);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 3059);
this._axesCollection.push(axis);
                    _yuitest_coverline("build/charts-base/charts-base.js", 3060);
if(axis.get("keys").hasOwnProperty(this.get("categoryKey")))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3062);
this.set("categoryAxis", axis);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 3064);
axis.render(this.get("contentBox"));
                }
            }
        }
    },

    /**
     * Renders the Graph.
     *
     * @method _addSeries
     * @private
     */
    _addSeries: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addSeries", 3076);
_yuitest_coverline("build/charts-base/charts-base.js", 3078);
var graph = this.get("graph"),
            sc = this.get("seriesCollection");
        _yuitest_coverline("build/charts-base/charts-base.js", 3080);
graph.render(this.get("contentBox"));

    },

    /**
     * Adds gridlines to the chart.
     *
     * @method _addGridlines
     * @private
     */
    _addGridlines: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addGridlines", 3090);
_yuitest_coverline("build/charts-base/charts-base.js", 3092);
var graph = this.get("graph"),
            hgl = this.get("horizontalGridlines"),
            vgl = this.get("verticalGridlines"),
            direction = this.get("direction"),
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            seriesAxesCollection,
            catAxis = this.get("categoryAxis"),
            hAxis,
            vAxis;
        _yuitest_coverline("build/charts-base/charts-base.js", 3104);
if(this._axesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3106);
seriesAxesCollection = this._axesCollection.concat();
            _yuitest_coverline("build/charts-base/charts-base.js", 3107);
seriesAxesCollection.splice(Y.Array.indexOf(seriesAxesCollection, catAxis), 1);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3109);
if(hgl)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3111);
if(leftAxesCollection && leftAxesCollection[0])
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3113);
hAxis = leftAxesCollection[0];
            }
            else {_yuitest_coverline("build/charts-base/charts-base.js", 3115);
if(rightAxesCollection && rightAxesCollection[0])
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3117);
hAxis = rightAxesCollection[0];
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3121);
hAxis = direction == "horizontal" ? catAxis : seriesAxesCollection[0];
            }}
            _yuitest_coverline("build/charts-base/charts-base.js", 3123);
if(!this._getBaseAttribute(hgl, "axis") && hAxis)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3125);
this._setBaseAttribute(hgl, "axis", hAxis);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3127);
if(this._getBaseAttribute(hgl, "axis"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3129);
graph.set("horizontalGridlines", hgl);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3132);
if(vgl)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3134);
if(bottomAxesCollection && bottomAxesCollection[0])
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3136);
vAxis = bottomAxesCollection[0];
            }
            else {_yuitest_coverline("build/charts-base/charts-base.js", 3138);
if (topAxesCollection && topAxesCollection[0])
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3140);
vAxis = topAxesCollection[0];
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3144);
vAxis = direction == "vertical" ? catAxis : seriesAxesCollection[0];
            }}
            _yuitest_coverline("build/charts-base/charts-base.js", 3146);
if(!this._getBaseAttribute(vgl, "axis") && vAxis)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3148);
this._setBaseAttribute(vgl, "axis", vAxis);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3150);
if(this._getBaseAttribute(vgl, "axis"))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3152);
graph.set("verticalGridlines", vgl);
            }
        }
    },

    /**
     * Default Function for the axes attribute.
     *
     * @method _getDefaultAxes
     * @return Object
     * @private
     */
    _getDefaultAxes: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultAxes", 3164);
_yuitest_coverline("build/charts-base/charts-base.js", 3166);
var axes;
        _yuitest_coverline("build/charts-base/charts-base.js", 3167);
if(this.get("dataProvider"))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3169);
axes = this._parseAxes();
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3171);
return axes;
    },

    /**
     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.
     *
     * @method _parseAxes
     * @param {Object} axes Object containing `Axis` instances or `Axis` attributes.
     * @return Object
     * @private
     */
    _parseAxes: function(axes)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseAxes", 3182);
_yuitest_coverline("build/charts-base/charts-base.js", 3184);
var catKey = this.get("categoryKey"),
            axis,
            attr,
            keys,
            newAxes = {},
            claimedKeys = [],
            categoryAxisName = this.get("categoryAxisName") || this.get("categoryKey"),
            valueAxisName = this.get("valueAxisName"),
            seriesKeys = this.get("seriesKeys").concat(),
            i,
            l,
            ii,
            ll,
            cIndex,
            direction = this.get("direction"),
            seriesPosition,
            categoryPosition,
            valueAxes = [],
            seriesAxis = this.get("stacked") ? "stacked" : "numeric";
        _yuitest_coverline("build/charts-base/charts-base.js", 3203);
if(direction == "vertical")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3205);
seriesPosition = "bottom";
            _yuitest_coverline("build/charts-base/charts-base.js", 3206);
categoryPosition = "left";
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3210);
seriesPosition = "left";
            _yuitest_coverline("build/charts-base/charts-base.js", 3211);
categoryPosition = "bottom";
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3213);
if(axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3215);
for(i in axes)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3217);
if(axes.hasOwnProperty(i))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3219);
axis = axes[i];
                    _yuitest_coverline("build/charts-base/charts-base.js", 3220);
keys = this._getBaseAttribute(axis, "keys");
                    _yuitest_coverline("build/charts-base/charts-base.js", 3221);
attr = this._getBaseAttribute(axis, "type");
                    _yuitest_coverline("build/charts-base/charts-base.js", 3222);
if(attr == "time" || attr == "category")
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3224);
categoryAxisName = i;
                        _yuitest_coverline("build/charts-base/charts-base.js", 3225);
this.set("categoryAxisName", i);
                        _yuitest_coverline("build/charts-base/charts-base.js", 3226);
if(Y_Lang.isArray(keys) && keys.length > 0)
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 3228);
catKey = keys[0];
                            _yuitest_coverline("build/charts-base/charts-base.js", 3229);
this.set("categoryKey", catKey);
                        }
                        _yuitest_coverline("build/charts-base/charts-base.js", 3231);
newAxes[i] = axis;
                    }
                    else {_yuitest_coverline("build/charts-base/charts-base.js", 3233);
if(i == categoryAxisName)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3235);
newAxes[i] = axis;
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3239);
newAxes[i] = axis;
                        _yuitest_coverline("build/charts-base/charts-base.js", 3240);
if(i != valueAxisName && keys && Y_Lang.isArray(keys))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 3242);
ll = keys.length;
                            _yuitest_coverline("build/charts-base/charts-base.js", 3243);
for(ii = 0; ii < ll; ++ii)
                            {
                                _yuitest_coverline("build/charts-base/charts-base.js", 3245);
claimedKeys.push(keys[ii]);
                            }
                            _yuitest_coverline("build/charts-base/charts-base.js", 3247);
valueAxes.push(newAxes[i]);
                        }
                        _yuitest_coverline("build/charts-base/charts-base.js", 3249);
if(!(this._getBaseAttribute(newAxes[i], "type")))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 3251);
this._setBaseAttribute(newAxes[i], "type", seriesAxis);
                        }
                        _yuitest_coverline("build/charts-base/charts-base.js", 3253);
if(!(this._getBaseAttribute(newAxes[i], "position")))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 3255);
this._setBaseAttribute(newAxes[i], "position", this._getDefaultAxisPosition(newAxes[i], valueAxes, seriesPosition));
                        }
                    }}
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3261);
cIndex = Y.Array.indexOf(seriesKeys, catKey);
        _yuitest_coverline("build/charts-base/charts-base.js", 3262);
if(cIndex > -1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3264);
seriesKeys.splice(cIndex, 1);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3266);
l = claimedKeys.length;
        _yuitest_coverline("build/charts-base/charts-base.js", 3267);
for(i = 0; i < l; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3269);
cIndex = Y.Array.indexOf(seriesKeys, claimedKeys[i]);
            _yuitest_coverline("build/charts-base/charts-base.js", 3270);
if(cIndex > -1)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3272);
seriesKeys.splice(cIndex, 1);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3275);
if(!newAxes.hasOwnProperty(categoryAxisName))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3277);
newAxes[categoryAxisName] = {};
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3279);
if(!(this._getBaseAttribute(newAxes[categoryAxisName], "keys")))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3281);
this._setBaseAttribute(newAxes[categoryAxisName], "keys", [catKey]);
        }

        _yuitest_coverline("build/charts-base/charts-base.js", 3284);
if(!(this._getBaseAttribute(newAxes[categoryAxisName], "position")))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3286);
this._setBaseAttribute(newAxes[categoryAxisName], "position", categoryPosition);
        }

        _yuitest_coverline("build/charts-base/charts-base.js", 3289);
if(!(this._getBaseAttribute(newAxes[categoryAxisName], "type")))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3291);
this._setBaseAttribute(newAxes[categoryAxisName], "type", this.get("categoryType"));
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3293);
if(!newAxes.hasOwnProperty(valueAxisName) && seriesKeys && seriesKeys.length > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3295);
newAxes[valueAxisName] = {keys:seriesKeys};
            _yuitest_coverline("build/charts-base/charts-base.js", 3296);
valueAxes.push(newAxes[valueAxisName]);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3298);
if(claimedKeys.length > 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3300);
if(seriesKeys.length > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3302);
seriesKeys = claimedKeys.concat(seriesKeys);
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3306);
seriesKeys = claimedKeys;
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3309);
if(newAxes.hasOwnProperty(valueAxisName))
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3311);
if(!(this._getBaseAttribute(newAxes[valueAxisName], "position")))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3313);
this._setBaseAttribute(newAxes[valueAxisName], "position", this._getDefaultAxisPosition(newAxes[valueAxisName], valueAxes, seriesPosition));
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3315);
this._setBaseAttribute(newAxes[valueAxisName], "type", seriesAxis);
            _yuitest_coverline("build/charts-base/charts-base.js", 3316);
this._setBaseAttribute(newAxes[valueAxisName], "keys", seriesKeys);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3318);
if(!this._seriesKeysExplicitlySet)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3320);
this._seriesKeys = seriesKeys;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3322);
return newAxes;
    },

    /**
     * Determines the position of an axis when one is not specified.
     *
     * @method _getDefaultAxisPosition
     * @param {Axis} axis `Axis` instance.
     * @param {Array} valueAxes Array of `Axis` instances.
     * @param {String} position Default position depending on the direction of the chart and type of axis.
     * @return String
     * @private
     */
    _getDefaultAxisPosition: function(axis, valueAxes, position)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultAxisPosition", 3335);
_yuitest_coverline("build/charts-base/charts-base.js", 3337);
var direction = this.get("direction"),
            i = Y.Array.indexOf(valueAxes, axis);

        _yuitest_coverline("build/charts-base/charts-base.js", 3340);
if(valueAxes[i - 1] && valueAxes[i - 1].position)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3342);
if(direction == "horizontal")
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3344);
if(valueAxes[i - 1].position == "left")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3346);
position = "right";
                }
                else {_yuitest_coverline("build/charts-base/charts-base.js", 3348);
if(valueAxes[i - 1].position == "right")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3350);
position = "left";
                }}
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3355);
if (valueAxes[i -1].position == "bottom")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3357);
position = "top";
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3361);
position = "bottom";
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3365);
return position;
    },


    /**
     * Returns an object literal containing a categoryItem and a valueItem for a given series index. Below is the structure of each:
     *
     * @method getSeriesItems
     * @param {CartesianSeries} series Reference to a series.
     * @param {Number} index Index of the specified item within a series.
     * @return Object An object literal containing the following:
     *
     *  <dl>
     *      <dt>categoryItem</dt><dd>Object containing the following data related to the category axis of the series.
     *  <dl>
     *      <dt>axis</dt><dd>Reference to the category axis of the series.</dd>
     *      <dt>key</dt><dd>Category key for the series.</dd>
     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>
     *  </dl>
     *      </dd>
     *      <dt>valueItem</dt><dd>Object containing the following data related to the category axis of the series.
     *  <dl>
     *      <dt>axis</dt><dd>Reference to the value axis of the series.</dd>
     *      <dt>key</dt><dd>Value key for the series.</dd>
     *      <dt>value</dt><dd>Value on the axis corresponding to the series index.</dd>
     *  </dl>
     *      </dd>
     *  </dl>
     */
    getSeriesItems: function(series, index)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getSeriesItems", 3394);
_yuitest_coverline("build/charts-base/charts-base.js", 3396);
var xAxis = series.get("xAxis"),
            yAxis = series.get("yAxis"),
            xKey = series.get("xKey"),
            yKey = series.get("yKey"),
            categoryItem,
            valueItem;
        _yuitest_coverline("build/charts-base/charts-base.js", 3402);
if(this.get("direction") == "vertical")
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3404);
categoryItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            _yuitest_coverline("build/charts-base/charts-base.js", 3409);
valueItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3417);
valueItem = {
                axis:yAxis,
                key:yKey,
                value:yAxis.getKeyValueAt(yKey, index)
            };
            _yuitest_coverline("build/charts-base/charts-base.js", 3422);
categoryItem = {
                axis:xAxis,
                key:xKey,
                value: xAxis.getKeyValueAt(xKey, index)
            };
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3428);
categoryItem.displayName = series.get("categoryDisplayName");
        _yuitest_coverline("build/charts-base/charts-base.js", 3429);
valueItem.displayName = series.get("valueDisplayName");
        _yuitest_coverline("build/charts-base/charts-base.js", 3430);
categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);
        _yuitest_coverline("build/charts-base/charts-base.js", 3431);
valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);
        _yuitest_coverline("build/charts-base/charts-base.js", 3432);
return {category:categoryItem, value:valueItem};
    },

    /**
     * Handler for sizeChanged event.
     *
     * @method _sizeChanged
     * @param {Object} e Event object.
     * @private
     */
    _sizeChanged: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_sizeChanged", 3442);
_yuitest_coverline("build/charts-base/charts-base.js", 3444);
if(this._axesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3446);
var ac = this._axesCollection,
                i = 0,
                l = ac.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3449);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3451);
this._addToAxesRenderQueue(ac[i]);
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3453);
this._redraw();
        }
    },

    /**
     * Returns the maximum distance in pixels that the extends outside the top bounds of all vertical axes.
     *
     * @method _getTopOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getTopOverflow: function(set1, set2, height)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getTopOverflow", 3467);
_yuitest_coverline("build/charts-base/charts-base.js", 3469);
var i = 0,
            len,
            overflow = 0,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 3473);
if(set1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3475);
len = set1.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3476);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3478);
axis = set1[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3479);
overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3482);
if(set2)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3484);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3485);
len = set2.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3486);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3488);
axis = set2[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3489);
overflow = Math.max(overflow, Math.abs(axis.getMaxLabelBounds().top) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3492);
return overflow;
    },

    /**
     * Returns the maximum distance in pixels that the extends outside the right bounds of all horizontal axes.
     *
     * @method _getRightOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getRightOverflow: function(set1, set2, width)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getRightOverflow", 3505);
_yuitest_coverline("build/charts-base/charts-base.js", 3507);
var i = 0,
            len,
            overflow = 0,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 3511);
if(set1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3513);
len = set1.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3514);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3516);
axis = set1[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3517);
overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3520);
if(set2)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3522);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3523);
len = set2.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3524);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3526);
axis = set2[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3527);
overflow = Math.max(overflow, axis.getMaxLabelBounds().right - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3530);
return overflow;
    },

    /**
     * Returns the maximum distance in pixels that the extends outside the left bounds of all horizontal axes.
     *
     * @method _getLeftOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} width Width of the axes
     * @return Number
     * @private
     */
    _getLeftOverflow: function(set1, set2, width)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getLeftOverflow", 3543);
_yuitest_coverline("build/charts-base/charts-base.js", 3545);
var i = 0,
            len,
            overflow = 0,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 3549);
if(set1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3551);
len = set1.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3552);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3554);
axis = set1[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3555);
overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3558);
if(set2)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3560);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3561);
len = set2.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3562);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3564);
axis = set2[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3565);
overflow = Math.max(overflow, Math.abs(axis.getMinLabelBounds().left) - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, width) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3568);
return overflow;
    },

    /**
     * Returns the maximum distance in pixels that the extends outside the bottom bounds of all vertical axes.
     *
     * @method _getBottomOverflow
     * @param {Array} set1 Collection of axes to check.
     * @param {Array} set2 Seconf collection of axes to check.
     * @param {Number} height Height of the axes
     * @return Number
     * @private
     */
    _getBottomOverflow: function(set1, set2, height)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getBottomOverflow", 3581);
_yuitest_coverline("build/charts-base/charts-base.js", 3583);
var i = 0,
            len,
            overflow = 0,
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 3587);
if(set1)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3589);
len = set1.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3590);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3592);
axis = set1[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3593);
overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3596);
if(set2)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3598);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3599);
len = set2.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3600);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3602);
axis = set2[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3603);
overflow = Math.max(overflow, axis.getMinLabelBounds().bottom - (axis.getEdgeOffset(axis.get("styles").majorTicks.count, height) * 0.5));
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3606);
return overflow;
    },

    /**
     * Redraws and position all the components of the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_redraw", 3615);
_yuitest_coverline("build/charts-base/charts-base.js", 3617);
if(this._drawing)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3619);
this._callLater = true;
            _yuitest_coverline("build/charts-base/charts-base.js", 3620);
return;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3622);
this._drawing = true;
        _yuitest_coverline("build/charts-base/charts-base.js", 3623);
this._callLater = false;
        _yuitest_coverline("build/charts-base/charts-base.js", 3624);
var w = this.get("width"),
            h = this.get("height"),
            leftPaneWidth = 0,
            rightPaneWidth = 0,
            topPaneHeight = 0,
            bottomPaneHeight = 0,
            leftAxesCollection = this.get("leftAxesCollection"),
            rightAxesCollection = this.get("rightAxesCollection"),
            topAxesCollection = this.get("topAxesCollection"),
            bottomAxesCollection = this.get("bottomAxesCollection"),
            i = 0,
            l,
            axis,
            graphOverflow = "visible",
            graph = this.get("graph"),
            topOverflow,
            bottomOverflow,
            leftOverflow,
            rightOverflow,
            graphWidth,
            graphHeight,
            graphX,
            graphY,
            allowContentOverflow = this.get("allowContentOverflow"),
            diff,
            rightAxesXCoords,
            leftAxesXCoords,
            topAxesYCoords,
            bottomAxesYCoords,
            graphRect = {};
        _yuitest_coverline("build/charts-base/charts-base.js", 3654);
if(leftAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3656);
leftAxesXCoords = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 3657);
l = leftAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3658);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3660);
leftAxesXCoords.unshift(leftPaneWidth);
                _yuitest_coverline("build/charts-base/charts-base.js", 3661);
leftPaneWidth += leftAxesCollection[i].get("width");
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3664);
if(rightAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3666);
rightAxesXCoords = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 3667);
l = rightAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3668);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3669);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3671);
rightPaneWidth += rightAxesCollection[i].get("width");
                _yuitest_coverline("build/charts-base/charts-base.js", 3672);
rightAxesXCoords.unshift(w - rightPaneWidth);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3675);
if(topAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3677);
topAxesYCoords = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 3678);
l = topAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3679);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3681);
topAxesYCoords.unshift(topPaneHeight);
                _yuitest_coverline("build/charts-base/charts-base.js", 3682);
topPaneHeight += topAxesCollection[i].get("height");
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3685);
if(bottomAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3687);
bottomAxesYCoords = [];
            _yuitest_coverline("build/charts-base/charts-base.js", 3688);
l = bottomAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3689);
for(i = l - 1; i > -1; --i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3691);
bottomPaneHeight += bottomAxesCollection[i].get("height");
                _yuitest_coverline("build/charts-base/charts-base.js", 3692);
bottomAxesYCoords.unshift(h - bottomPaneHeight);
            }
        }

        _yuitest_coverline("build/charts-base/charts-base.js", 3696);
graphWidth = w - (leftPaneWidth + rightPaneWidth);
        _yuitest_coverline("build/charts-base/charts-base.js", 3697);
graphHeight = h - (bottomPaneHeight + topPaneHeight);
        _yuitest_coverline("build/charts-base/charts-base.js", 3698);
graphRect.left = leftPaneWidth;
        _yuitest_coverline("build/charts-base/charts-base.js", 3699);
graphRect.top = topPaneHeight;
        _yuitest_coverline("build/charts-base/charts-base.js", 3700);
graphRect.bottom = h - bottomPaneHeight;
        _yuitest_coverline("build/charts-base/charts-base.js", 3701);
graphRect.right = w - rightPaneWidth;
        _yuitest_coverline("build/charts-base/charts-base.js", 3702);
if(!allowContentOverflow)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3704);
topOverflow = this._getTopOverflow(leftAxesCollection, rightAxesCollection);
            _yuitest_coverline("build/charts-base/charts-base.js", 3705);
bottomOverflow = this._getBottomOverflow(leftAxesCollection, rightAxesCollection);
            _yuitest_coverline("build/charts-base/charts-base.js", 3706);
leftOverflow = this._getLeftOverflow(bottomAxesCollection, topAxesCollection);
            _yuitest_coverline("build/charts-base/charts-base.js", 3707);
rightOverflow = this._getRightOverflow(bottomAxesCollection, topAxesCollection);

            _yuitest_coverline("build/charts-base/charts-base.js", 3709);
diff = topOverflow - topPaneHeight;
            _yuitest_coverline("build/charts-base/charts-base.js", 3710);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3712);
graphRect.top = topOverflow;
                _yuitest_coverline("build/charts-base/charts-base.js", 3713);
if(topAxesYCoords)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3715);
i = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3716);
l = topAxesYCoords.length;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3717);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3719);
topAxesYCoords[i] += diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-base/charts-base.js", 3724);
diff = bottomOverflow - bottomPaneHeight;
            _yuitest_coverline("build/charts-base/charts-base.js", 3725);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3727);
graphRect.bottom = h - bottomOverflow;
                _yuitest_coverline("build/charts-base/charts-base.js", 3728);
if(bottomAxesYCoords)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3730);
i = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3731);
l = bottomAxesYCoords.length;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3732);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3734);
bottomAxesYCoords[i] -= diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-base/charts-base.js", 3739);
diff = leftOverflow - leftPaneWidth;
            _yuitest_coverline("build/charts-base/charts-base.js", 3740);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3742);
graphRect.left = leftOverflow;
                _yuitest_coverline("build/charts-base/charts-base.js", 3743);
if(leftAxesXCoords)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3745);
i = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3746);
l = leftAxesXCoords.length;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3747);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3749);
leftAxesXCoords[i] += diff;
                    }
                }
            }

            _yuitest_coverline("build/charts-base/charts-base.js", 3754);
diff = rightOverflow - rightPaneWidth;
            _yuitest_coverline("build/charts-base/charts-base.js", 3755);
if(diff > 0)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3757);
graphRect.right = w - rightOverflow;
                _yuitest_coverline("build/charts-base/charts-base.js", 3758);
if(rightAxesXCoords)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3760);
i = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3761);
l = rightAxesXCoords.length;
                    _yuitest_coverline("build/charts-base/charts-base.js", 3762);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 3764);
rightAxesXCoords[i] -= diff;
                    }
                }
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3769);
graphWidth = graphRect.right - graphRect.left;
        _yuitest_coverline("build/charts-base/charts-base.js", 3770);
graphHeight = graphRect.bottom - graphRect.top;
        _yuitest_coverline("build/charts-base/charts-base.js", 3771);
graphX = graphRect.left;
        _yuitest_coverline("build/charts-base/charts-base.js", 3772);
graphY = graphRect.top;
        _yuitest_coverline("build/charts-base/charts-base.js", 3773);
if(topAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3775);
l = topAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3776);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3777);
for(; i < l; i++)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3779);
axis = topAxesCollection[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3780);
if(axis.get("width") !== graphWidth)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3782);
axis.set("width", graphWidth);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 3784);
axis.get("boundingBox").setStyle("left", graphX + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3785);
axis.get("boundingBox").setStyle("top", topAxesYCoords[i] + "px");
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3787);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3789);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3792);
if(bottomAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3794);
l = bottomAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3795);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3796);
for(; i < l; i++)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3798);
axis = bottomAxesCollection[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3799);
if(axis.get("width") !== graphWidth)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3801);
axis.set("width", graphWidth);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 3803);
axis.get("boundingBox").setStyle("left", graphX + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3804);
axis.get("boundingBox").setStyle("top", bottomAxesYCoords[i] + "px");
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3806);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3808);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3811);
if(leftAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3813);
l = leftAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3814);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3815);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3817);
axis = leftAxesCollection[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3818);
axis.get("boundingBox").setStyle("top", graphY + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3819);
axis.get("boundingBox").setStyle("left", leftAxesXCoords[i] + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3820);
if(axis.get("height") !== graphHeight)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3822);
axis.set("height", graphHeight);
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3825);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3827);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3830);
if(rightAxesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3832);
l = rightAxesCollection.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 3833);
i = 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3834);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3836);
axis = rightAxesCollection[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 3837);
axis.get("boundingBox").setStyle("top", graphY + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3838);
axis.get("boundingBox").setStyle("left", rightAxesXCoords[i] + "px");
                _yuitest_coverline("build/charts-base/charts-base.js", 3839);
if(axis.get("height") !== graphHeight)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3841);
axis.set("height", graphHeight);
                }
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3844);
if(axis._hasDataOverflow())
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3846);
graphOverflow = "hidden";
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3849);
this._drawing = false;
        _yuitest_coverline("build/charts-base/charts-base.js", 3850);
if(this._callLater)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3852);
this._redraw();
            _yuitest_coverline("build/charts-base/charts-base.js", 3853);
return;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3855);
if(graph)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3857);
graph.get("boundingBox").setStyle("left", graphX + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 3858);
graph.get("boundingBox").setStyle("top", graphY + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 3859);
graph.set("width", graphWidth);
            _yuitest_coverline("build/charts-base/charts-base.js", 3860);
graph.set("height", graphHeight);
            _yuitest_coverline("build/charts-base/charts-base.js", 3861);
graph.get("boundingBox").setStyle("overflow", graphOverflow);
        }

        _yuitest_coverline("build/charts-base/charts-base.js", 3864);
if(this._overlay)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3866);
this._overlay.setStyle("left", graphX + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 3867);
this._overlay.setStyle("top", graphY + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 3868);
this._overlay.setStyle("width", graphWidth + "px");
            _yuitest_coverline("build/charts-base/charts-base.js", 3869);
this._overlay.setStyle("height", graphHeight + "px");
        }
    },

    /**
     * Destructor implementation for the CartesianChart class. Calls destroy on all axes, series and the Graph instance.
     * Removes the tooltip and overlay HTML elements.
     *
     * @method destructor
     * @protected
     */
    destructor: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "destructor", 3880);
_yuitest_coverline("build/charts-base/charts-base.js", 3882);
var graph = this.get("graph"),
            i = 0,
            len,
            seriesCollection = this.get("seriesCollection"),
            axesCollection = this._axesCollection,
            tooltip = this.get("tooltip").node;
        _yuitest_coverline("build/charts-base/charts-base.js", 3888);
if(this._description)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3890);
this._description.empty();
            _yuitest_coverline("build/charts-base/charts-base.js", 3891);
this._description.remove(true);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3893);
if(this._liveRegion)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3895);
this._liveRegion.empty();
            _yuitest_coverline("build/charts-base/charts-base.js", 3896);
this._liveRegion.remove(true);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3898);
len = seriesCollection ? seriesCollection.length : 0;
        _yuitest_coverline("build/charts-base/charts-base.js", 3899);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3901);
if(seriesCollection[i] instanceof Y.CartesianSeries)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3903);
seriesCollection[i].destroy(true);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3906);
len = axesCollection ? axesCollection.length : 0;
        _yuitest_coverline("build/charts-base/charts-base.js", 3907);
for(i = 0; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3909);
if(axesCollection[i] instanceof Y.Axis)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3911);
axesCollection[i].destroy(true);
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3914);
if(graph)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3916);
graph.destroy(true);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3918);
if(tooltip)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3920);
tooltip.empty();
            _yuitest_coverline("build/charts-base/charts-base.js", 3921);
tooltip.remove(true);
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 3923);
if(this._overlay)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3925);
this._overlay.empty();
            _yuitest_coverline("build/charts-base/charts-base.js", 3926);
this._overlay.remove(true);
        }
    },

    /**
     * Returns the appropriate message based on the key press.
     *
     * @method _getAriaMessage
     * @param {Number} key The keycode that was pressed.
     * @return String
     */
    _getAriaMessage: function(key)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getAriaMessage", 3937);
_yuitest_coverline("build/charts-base/charts-base.js", 3939);
var msg = "",
            series,
            items,
            categoryItem,
            valueItem,
            seriesIndex = this._seriesIndex,
            itemIndex = this._itemIndex,
            seriesCollection = this.get("seriesCollection"),
            len = seriesCollection.length,
            dataLength;
        _yuitest_coverline("build/charts-base/charts-base.js", 3949);
if(key % 2 === 0)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3951);
if(len > 1)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3953);
if(key === 38)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3955);
seriesIndex = seriesIndex < 1 ? len - 1 : seriesIndex - 1;
                }
                else {_yuitest_coverline("build/charts-base/charts-base.js", 3957);
if(key === 40)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 3959);
seriesIndex = seriesIndex >= len - 1 ? 0 : seriesIndex + 1;
                }}
                _yuitest_coverline("build/charts-base/charts-base.js", 3961);
this._itemIndex = -1;
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3965);
seriesIndex = 0;
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3967);
this._seriesIndex = seriesIndex;
            _yuitest_coverline("build/charts-base/charts-base.js", 3968);
series = this.getSeries(parseInt(seriesIndex, 10));
            _yuitest_coverline("build/charts-base/charts-base.js", 3969);
msg = series.get("valueDisplayName") + " series.";
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 3973);
if(seriesIndex > -1)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3975);
msg = "";
                _yuitest_coverline("build/charts-base/charts-base.js", 3976);
series = this.getSeries(parseInt(seriesIndex, 10));
            }
            else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3980);
seriesIndex = 0;
                _yuitest_coverline("build/charts-base/charts-base.js", 3981);
this._seriesIndex = seriesIndex;
                _yuitest_coverline("build/charts-base/charts-base.js", 3982);
series = this.getSeries(parseInt(seriesIndex, 10));
                _yuitest_coverline("build/charts-base/charts-base.js", 3983);
msg = series.get("valueDisplayName") + " series.";
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 3985);
dataLength = series._dataLength ? series._dataLength : 0;
            _yuitest_coverline("build/charts-base/charts-base.js", 3986);
if(key === 37)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3988);
itemIndex = itemIndex > 0 ? itemIndex - 1 : dataLength - 1;
            }
            else {_yuitest_coverline("build/charts-base/charts-base.js", 3990);
if(key === 39)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 3992);
itemIndex = itemIndex >= dataLength - 1 ? 0 : itemIndex + 1;
            }}
            _yuitest_coverline("build/charts-base/charts-base.js", 3994);
this._itemIndex = itemIndex;
            _yuitest_coverline("build/charts-base/charts-base.js", 3995);
items = this.getSeriesItems(series, itemIndex);
            _yuitest_coverline("build/charts-base/charts-base.js", 3996);
categoryItem = items.category;
            _yuitest_coverline("build/charts-base/charts-base.js", 3997);
valueItem = items.value;
            _yuitest_coverline("build/charts-base/charts-base.js", 3998);
if(categoryItem && valueItem && categoryItem.value && valueItem.value)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 4000);
msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
                _yuitest_coverline("build/charts-base/charts-base.js", 4001);
msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", ";
            }
           else
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 4005);
msg += "No data available.";
            }
            _yuitest_coverline("build/charts-base/charts-base.js", 4007);
msg += (itemIndex + 1) + " of " + dataLength + ". ";
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4009);
return msg;
    }
}, {
    ATTRS: {
        /**
         * Indicates whether axis labels are allowed to overflow beyond the bounds of the chart's content box.
         *
         * @attribute allowContentOverflow
         * @type Boolean
         */
        allowContentOverflow: {
            value: false
        },

        /**
         * Style object for the axes.
         *
         * @attribute axesStyles
         * @type Object
         * @private
         */
        axesStyles: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4031);
_yuitest_coverline("build/charts-base/charts-base.js", 4033);
var axes = this.get("axes"),
                    i,
                    styles = this._axesStyles;
                _yuitest_coverline("build/charts-base/charts-base.js", 4036);
if(axes)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4038);
for(i in axes)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4040);
if(axes.hasOwnProperty(i) && axes[i] instanceof Y.Axis)
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 4042);
if(!styles)
                            {
                                _yuitest_coverline("build/charts-base/charts-base.js", 4044);
styles = {};
                            }
                            _yuitest_coverline("build/charts-base/charts-base.js", 4046);
styles[i] = axes[i].get("styles");
                        }
                    }
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4050);
return styles;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4053);
_yuitest_coverline("build/charts-base/charts-base.js", 4055);
var axes = this.get("axes"),
                    i;
                _yuitest_coverline("build/charts-base/charts-base.js", 4057);
for(i in val)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4059);
if(val.hasOwnProperty(i) && axes.hasOwnProperty(i))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4061);
this._setBaseAttribute(axes[i], "styles", val[i]);
                    }
                }
            }
        },

        /**
         * Style object for the series
         *
         * @attribute seriesStyles
         * @type Object
         * @private
         */
        seriesStyles: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4075);
_yuitest_coverline("build/charts-base/charts-base.js", 4077);
var styles = this._seriesStyles,
                    graph = this.get("graph"),
                    dict,
                    i;
                _yuitest_coverline("build/charts-base/charts-base.js", 4081);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4083);
dict = graph.get("seriesDictionary");
                    _yuitest_coverline("build/charts-base/charts-base.js", 4084);
if(dict)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4086);
styles = {};
                        _yuitest_coverline("build/charts-base/charts-base.js", 4087);
for(i in dict)
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 4089);
if(dict.hasOwnProperty(i))
                            {
                                _yuitest_coverline("build/charts-base/charts-base.js", 4091);
styles[i] = dict[i].get("styles");
                            }
                        }
                    }
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4096);
return styles;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4099);
_yuitest_coverline("build/charts-base/charts-base.js", 4101);
var i,
                    l,
                    s;

                _yuitest_coverline("build/charts-base/charts-base.js", 4105);
if(Y_Lang.isArray(val))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4107);
s = this.get("seriesCollection");
                    _yuitest_coverline("build/charts-base/charts-base.js", 4108);
i = 0;
                    _yuitest_coverline("build/charts-base/charts-base.js", 4109);
l = val.length;

                    _yuitest_coverline("build/charts-base/charts-base.js", 4111);
for(; i < l; ++i)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4113);
this._setBaseAttribute(s[i], "styles", val[i]);
                    }
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4118);
for(i in val)
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4120);
if(val.hasOwnProperty(i))
                        {
                            _yuitest_coverline("build/charts-base/charts-base.js", 4122);
s = this.getSeries(i);
                            _yuitest_coverline("build/charts-base/charts-base.js", 4123);
this._setBaseAttribute(s, "styles", val[i]);
                        }
                    }
                }
            }
        },

        /**
         * Styles for the graph.
         *
         * @attribute graphStyles
         * @type Object
         * @private
         */
        graphStyles: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4138);
_yuitest_coverline("build/charts-base/charts-base.js", 4140);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4141);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4143);
return(graph.get("styles"));
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4145);
return this._graphStyles;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4148);
_yuitest_coverline("build/charts-base/charts-base.js", 4150);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4151);
this._setBaseAttribute(graph, "styles", val);
            }

        },

        /**
         * Style properties for the chart. Contains a key indexed hash of the following:
         *  <dl>
         *      <dt>series</dt><dd>A key indexed hash containing references to the `styles` attribute for each series in the chart.
         *      Specific style attributes vary depending on the series:
         *      <ul>
         *          <li><a href="AreaSeries.html#attr_styles">AreaSeries</a></li>
         *          <li><a href="BarSeries.html#attr_styles">BarSeries</a></li>
         *          <li><a href="ColumnSeries.html#attr_styles">ColumnSeries</a></li>
         *          <li><a href="ComboSeries.html#attr_styles">ComboSeries</a></li>
         *          <li><a href="LineSeries.html#attr_styles">LineSeries</a></li>
         *          <li><a href="MarkerSeries.html#attr_styles">MarkerSeries</a></li>
         *          <li><a href="SplineSeries.html#attr_styles">SplineSeries</a></li>
         *      </ul>
         *      </dd>
         *      <dt>axes</dt><dd>A key indexed hash containing references to the `styles` attribute for each axes in the chart. Specific
         *      style attributes can be found in the <a href="Axis.html#attr_styles">Axis</a> class.</dd>
         *      <dt>graph</dt><dd>A reference to the `styles` attribute in the chart. Specific style attributes can be found in the
         *      <a href="Graph.html#attr_styles">Graph</a> class.</dd>
         *  </dl>
         *
         * @attribute styles
         * @type Object
         */
        styles: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4181);
_yuitest_coverline("build/charts-base/charts-base.js", 4183);
var styles = {
                    axes: this.get("axesStyles"),
                    series: this.get("seriesStyles"),
                    graph: this.get("graphStyles")
                };
                _yuitest_coverline("build/charts-base/charts-base.js", 4188);
return styles;
            },
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4190);
_yuitest_coverline("build/charts-base/charts-base.js", 4192);
if(val.hasOwnProperty("axes"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4194);
if(this.get("axesStyles"))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4196);
this.set("axesStyles", val.axes);
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4200);
this._axesStyles = val.axes;
                    }
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4203);
if(val.hasOwnProperty("series"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4205);
if(this.get("seriesStyles"))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4207);
this.set("seriesStyles", val.series);
                    }
                    else
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4211);
this._seriesStyles = val.series;
                    }
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4214);
if(val.hasOwnProperty("graph"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4216);
this.set("graphStyles", val.graph);
                }
            }
        },

        /**
         * Axes to appear in the chart. This can be a key indexed hash of axis instances or object literals
         * used to construct the appropriate axes.
         *
         * @attribute axes
         * @type Object
         */
        axes: {
            valueFn: "_getDefaultAxes",

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4231);
_yuitest_coverline("build/charts-base/charts-base.js", 4233);
if(this.get("dataProvider"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4235);
val = this._setAxes(val);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4237);
return val;
            }
        },

        /**
         * Collection of series to appear on the chart. This can be an array of Series instances or object literals
         * used to construct the appropriate series.
         *
         * @attribute seriesCollection
         * @type Array
         */
        seriesCollection: {
            valueFn: "_getDefaultSeriesCollection",

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4251);
_yuitest_coverline("build/charts-base/charts-base.js", 4253);
if(this.get("dataProvider"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4255);
val = this._parseSeriesCollection(val);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4257);
return val;
            }
        },

        /**
         * Reference to the left-aligned axes for the chart.
         *
         * @attribute leftAxesCollection
         * @type Array
         * @private
         */
        leftAxesCollection: {},

        /**
         * Reference to the bottom-aligned axes for the chart.
         *
         * @attribute bottomAxesCollection
         * @type Array
         * @private
         */
        bottomAxesCollection: {},

        /**
         * Reference to the right-aligned axes for the chart.
         *
         * @attribute rightAxesCollection
         * @type Array
         * @private
         */
        rightAxesCollection: {},

        /**
         * Reference to the top-aligned axes for the chart.
         *
         * @attribute topAxesCollection
         * @type Array
         * @private
         */
        topAxesCollection: {},

        /**
         * Indicates whether or not the chart is stacked.
         *
         * @attribute stacked
         * @type Boolean
         */
        stacked: {
            value: false
        },

        /**
         * Direction of chart's category axis when there is no series collection specified. Charts can
         * be horizontal or vertical. When the chart type is column, the chart is horizontal.
         * When the chart type is bar, the chart is vertical.
         *
         * @attribute direction
         * @type String
         */
        direction: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4316);
_yuitest_coverline("build/charts-base/charts-base.js", 4318);
var type = this.get("type");
                _yuitest_coverline("build/charts-base/charts-base.js", 4319);
if(type == "bar")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4321);
return "vertical";
                }
                else {_yuitest_coverline("build/charts-base/charts-base.js", 4323);
if(type == "column")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4325);
return "horizontal";
                }}
                _yuitest_coverline("build/charts-base/charts-base.js", 4327);
return this._direction;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4330);
_yuitest_coverline("build/charts-base/charts-base.js", 4332);
this._direction = val;
                _yuitest_coverline("build/charts-base/charts-base.js", 4333);
return this._direction;
            }
        },

        /**
         * Indicates whether or not an area is filled in a combo chart.
         *
         * @attribute showAreaFill
         * @type Boolean
         */
        showAreaFill: {},

        /**
         * Indicates whether to display markers in a combo chart.
         *
         * @attribute showMarkers
         * @type Boolean
         */
        showMarkers:{},

        /**
         * Indicates whether to display lines in a combo chart.
         *
         * @attribute showLines
         * @type Boolean
         */
        showLines:{},

        /**
         * Indicates the key value used to identify a category axis in the `axes` hash. If
         * not specified, the categoryKey attribute value will be used.
         *
         * @attribute categoryAxisName
         * @type String
         */
        categoryAxisName: {
        },

        /**
         * Indicates the key value used to identify a the series axis when an axis not generated.
         *
         * @attribute valueAxisName
         * @type String
         */
        valueAxisName: {
            value: "values"
        },

        /**
         * Reference to the horizontalGridlines for the chart.
         *
         * @attribute horizontalGridlines
         * @type Gridlines
         */
        horizontalGridlines: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4388);
_yuitest_coverline("build/charts-base/charts-base.js", 4390);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4391);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4393);
return graph.get("horizontalGridlines");
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4395);
return this._horizontalGridlines;
            },
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4397);
_yuitest_coverline("build/charts-base/charts-base.js", 4399);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4400);
if(val && !Y_Lang.isObject(val))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4402);
val = {};
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4404);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4406);
graph.set("horizontalGridlines", val);
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4410);
this._horizontalGridlines = val;
                }
            }
        },

        /**
         * Reference to the verticalGridlines for the chart.
         *
         * @attribute verticalGridlines
         * @type Gridlines
         */
        verticalGridlines: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4422);
_yuitest_coverline("build/charts-base/charts-base.js", 4424);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4425);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4427);
return graph.get("verticalGridlines");
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4429);
return this._verticalGridlines;
            },
            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4431);
_yuitest_coverline("build/charts-base/charts-base.js", 4433);
var graph = this.get("graph");
                _yuitest_coverline("build/charts-base/charts-base.js", 4434);
if(val && !Y_Lang.isObject(val))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4436);
val = {};
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4438);
if(graph)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4440);
graph.set("verticalGridlines", val);
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4444);
this._verticalGridlines = val;
                }
            }
        },

        /**
         * Type of chart when there is no series collection specified.
         *
         * @attribute type
         * @type String
         */
        type: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4456);
_yuitest_coverline("build/charts-base/charts-base.js", 4458);
if(this.get("stacked"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4460);
return "stacked" + this._type;
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4462);
return this._type;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4465);
_yuitest_coverline("build/charts-base/charts-base.js", 4467);
if(this._type == "bar")
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4469);
if(val != "bar")
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4471);
this.set("direction", "horizontal");
                    }
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4476);
if(val == "bar")
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4478);
this.set("direction", "vertical");
                    }
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4481);
this._type = val;
                _yuitest_coverline("build/charts-base/charts-base.js", 4482);
return this._type;
            }
        },

        /**
         * Reference to the category axis used by the chart.
         *
         * @attribute categoryAxis
         * @type Axis
         */
        categoryAxis:{}
    }
});
/**
 * The PieChart class creates a pie chart
 *
 * @class PieChart
 * @extends ChartBase
 * @constructor
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 4503);
Y.PieChart = Y.Base.create("pieChart", Y.Widget, [Y.ChartBase], {
    /**
     * Calculates and returns a `seriesCollection`.
     *
     * @method _getSeriesCollection
     * @return Array
     * @private
     */
    _getSeriesCollection: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getSeriesCollection", 4511);
_yuitest_coverline("build/charts-base/charts-base.js", 4513);
if(this._seriesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4515);
return this._seriesCollection;
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4517);
var axes = this.get("axes"),
            sc = [],
            seriesKeys,
            i = 0,
            l,
            type = this.get("type"),
            key,
            catAxis = "categoryAxis",
            catKey = "categoryKey",
            valAxis = "valueAxis",
            seriesKey = "valueKey";
        _yuitest_coverline("build/charts-base/charts-base.js", 4528);
if(axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4530);
seriesKeys = axes.values.get("keyCollection");
            _yuitest_coverline("build/charts-base/charts-base.js", 4531);
key = axes.category.get("keyCollection")[0];
            _yuitest_coverline("build/charts-base/charts-base.js", 4532);
l = seriesKeys.length;
            _yuitest_coverline("build/charts-base/charts-base.js", 4533);
for(; i < l; ++i)
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 4535);
sc[i] = {type:type};
                _yuitest_coverline("build/charts-base/charts-base.js", 4536);
sc[i][catAxis] = "category";
                _yuitest_coverline("build/charts-base/charts-base.js", 4537);
sc[i][valAxis] = "values";
                _yuitest_coverline("build/charts-base/charts-base.js", 4538);
sc[i][catKey] = key;
                _yuitest_coverline("build/charts-base/charts-base.js", 4539);
sc[i][seriesKey] = seriesKeys[i];
            }
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4542);
this._seriesCollection = sc;
        _yuitest_coverline("build/charts-base/charts-base.js", 4543);
return sc;
    },

    /**
     * Creates `Axis` instances.
     *
     * @method _parseAxes
     * @param {Object} val Object containing `Axis` instances or objects in which to construct `Axis` instances.
     * @return Object
     * @private
     */
    _parseAxes: function(hash)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseAxes", 4554);
_yuitest_coverline("build/charts-base/charts-base.js", 4556);
if(!this._axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4558);
this._axes = {};
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4560);
var i, pos, axis, dh, config, axisClass,
            type = this.get("type"),
            w = this.get("width"),
            h = this.get("height"),
            node = Y.Node.one(this._parentNode);
        _yuitest_coverline("build/charts-base/charts-base.js", 4565);
if(!w)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4567);
this.set("width", node.get("offsetWidth"));
            _yuitest_coverline("build/charts-base/charts-base.js", 4568);
w = this.get("width");
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4570);
if(!h)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4572);
this.set("height", node.get("offsetHeight"));
            _yuitest_coverline("build/charts-base/charts-base.js", 4573);
h = this.get("height");
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4575);
for(i in hash)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4577);
if(hash.hasOwnProperty(i))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 4579);
dh = hash[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 4580);
pos = type == "pie" ? "none" : dh.position;
                _yuitest_coverline("build/charts-base/charts-base.js", 4581);
axisClass = this._getAxisClass(dh.type);
                _yuitest_coverline("build/charts-base/charts-base.js", 4582);
config = {dataProvider:this.get("dataProvider")};
                _yuitest_coverline("build/charts-base/charts-base.js", 4583);
if(dh.hasOwnProperty("roundingUnit"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4585);
config.roundingUnit = dh.roundingUnit;
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4587);
config.keys = dh.keys;
                _yuitest_coverline("build/charts-base/charts-base.js", 4588);
config.width = w;
                _yuitest_coverline("build/charts-base/charts-base.js", 4589);
config.height = h;
                _yuitest_coverline("build/charts-base/charts-base.js", 4590);
config.position = pos;
                _yuitest_coverline("build/charts-base/charts-base.js", 4591);
config.styles = dh.styles;
                _yuitest_coverline("build/charts-base/charts-base.js", 4592);
axis = new axisClass(config);
                _yuitest_coverline("build/charts-base/charts-base.js", 4593);
axis.on("axisRendered", Y.bind(this._itemRendered, this));
                _yuitest_coverline("build/charts-base/charts-base.js", 4594);
this._axes[i] = axis;
            }
        }
    },

    /**
     * Adds axes to the chart.
     *
     * @method _addAxes
     * @private
     */
    _addAxes: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addAxes", 4605);
_yuitest_coverline("build/charts-base/charts-base.js", 4607);
var axes = this.get("axes"),
            i,
            axis,
            p;
        _yuitest_coverline("build/charts-base/charts-base.js", 4611);
if(!axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4613);
this.set("axes", this._getDefaultAxes());
            _yuitest_coverline("build/charts-base/charts-base.js", 4614);
axes = this.get("axes");
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4616);
if(!this._axesCollection)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4618);
this._axesCollection = [];
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4620);
for(i in axes)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4622);
if(axes.hasOwnProperty(i))
            {
                _yuitest_coverline("build/charts-base/charts-base.js", 4624);
axis = axes[i];
                _yuitest_coverline("build/charts-base/charts-base.js", 4625);
p = axis.get("position");
                _yuitest_coverline("build/charts-base/charts-base.js", 4626);
if(!this.get(p + "AxesCollection"))
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4628);
this.set(p + "AxesCollection", [axis]);
                }
                else
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4632);
this.get(p + "AxesCollection").push(axis);
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4634);
this._axesCollection.push(axis);
            }
        }
    },

    /**
     * Renders the Graph.
     *
     * @method _addSeries
     * @private
     */
    _addSeries: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_addSeries", 4645);
_yuitest_coverline("build/charts-base/charts-base.js", 4647);
var graph = this.get("graph"),
            seriesCollection = this.get("seriesCollection");
        _yuitest_coverline("build/charts-base/charts-base.js", 4649);
this._parseSeriesAxes(seriesCollection);
        _yuitest_coverline("build/charts-base/charts-base.js", 4650);
graph.set("showBackground", false);
        _yuitest_coverline("build/charts-base/charts-base.js", 4651);
graph.set("width", this.get("width"));
        _yuitest_coverline("build/charts-base/charts-base.js", 4652);
graph.set("height", this.get("height"));
        _yuitest_coverline("build/charts-base/charts-base.js", 4653);
graph.set("seriesCollection", seriesCollection);
        _yuitest_coverline("build/charts-base/charts-base.js", 4654);
this._seriesCollection = graph.get("seriesCollection");
        _yuitest_coverline("build/charts-base/charts-base.js", 4655);
graph.render(this.get("contentBox"));
    },

    /**
     * Parse and sets the axes for the chart.
     *
     * @method _parseSeriesAxes
     * @param {Array} c A collection `PieSeries` instance.
     * @private
     */
    _parseSeriesAxes: function(c)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_parseSeriesAxes", 4665);
_yuitest_coverline("build/charts-base/charts-base.js", 4667);
var i = 0,
            len = c.length,
            s,
            axes = this.get("axes"),
            axis;
        _yuitest_coverline("build/charts-base/charts-base.js", 4672);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4674);
s = c[i];
            _yuitest_coverline("build/charts-base/charts-base.js", 4675);
if(s)
            {
                //If series is an actual series instance,
                //replace axes attribute string ids with axes
                _yuitest_coverline("build/charts-base/charts-base.js", 4679);
if(s instanceof Y.PieSeries)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4681);
axis = s.get("categoryAxis");
                    _yuitest_coverline("build/charts-base/charts-base.js", 4682);
if(axis && !(axis instanceof Y.Axis))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4684);
s.set("categoryAxis", axes[axis]);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 4686);
axis = s.get("valueAxis");
                    _yuitest_coverline("build/charts-base/charts-base.js", 4687);
if(axis && !(axis instanceof Y.Axis))
                    {
                        _yuitest_coverline("build/charts-base/charts-base.js", 4689);
s.set("valueAxis", axes[axis]);
                    }
                    _yuitest_coverline("build/charts-base/charts-base.js", 4691);
continue;
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4693);
s.categoryAxis = axes.category;
                _yuitest_coverline("build/charts-base/charts-base.js", 4694);
s.valueAxis = axes.values;
                _yuitest_coverline("build/charts-base/charts-base.js", 4695);
if(!s.type)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4697);
s.type = this.get("type");
                }
            }
        }
    },

    /**
     * Generates and returns a key-indexed object containing `Axis` instances or objects used to create `Axis` instances.
     *
     * @method _getDefaultAxes
     * @return Object
     * @private
     */
    _getDefaultAxes: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getDefaultAxes", 4710);
_yuitest_coverline("build/charts-base/charts-base.js", 4712);
var catKey = this.get("categoryKey"),
            seriesKeys = this.get("seriesKeys").concat(),
            seriesAxis = "numeric";
        _yuitest_coverline("build/charts-base/charts-base.js", 4715);
return {
            values:{
                keys:seriesKeys,
                type:seriesAxis
            },
            category:{
                keys:[catKey],
                type:this.get("categoryType")
            }
        };
    },

    /**
     * Returns an object literal containing a categoryItem and a valueItem for a given series index.
     *
     * @method getSeriesItem
     * @param series Reference to a series.
     * @param index Index of the specified item within a series.
     * @return Object
     */
    getSeriesItems: function(series, index)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "getSeriesItems", 4735);
_yuitest_coverline("build/charts-base/charts-base.js", 4737);
var categoryItem = {
                axis: series.get("categoryAxis"),
                key: series.get("categoryKey"),
                displayName: series.get("categoryDisplayName")
            },
            valueItem = {
                axis: series.get("valueAxis"),
                key: series.get("valueKey"),
                displayName: series.get("valueDisplayName")
            };
        _yuitest_coverline("build/charts-base/charts-base.js", 4747);
categoryItem.value = categoryItem.axis.getKeyValueAt(categoryItem.key, index);
        _yuitest_coverline("build/charts-base/charts-base.js", 4748);
valueItem.value = valueItem.axis.getKeyValueAt(valueItem.key, index);
        _yuitest_coverline("build/charts-base/charts-base.js", 4749);
return {category:categoryItem, value:valueItem};
    },

    /**
     * Handler for sizeChanged event.
     *
     * @method _sizeChanged
     * @param {Object} e Event object.
     * @private
     */
    _sizeChanged: function(e)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_sizeChanged", 4759);
_yuitest_coverline("build/charts-base/charts-base.js", 4761);
this._redraw();
    },

    /**
     * Redraws the chart instance.
     *
     * @method _redraw
     * @private
     */
    _redraw: function()
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_redraw", 4770);
_yuitest_coverline("build/charts-base/charts-base.js", 4772);
var graph = this.get("graph"),
            w = this.get("width"),
            h = this.get("height"),
            dimension;
        _yuitest_coverline("build/charts-base/charts-base.js", 4776);
if(graph)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4778);
dimension = Math.min(w, h);
            _yuitest_coverline("build/charts-base/charts-base.js", 4779);
graph.set("width", dimension);
            _yuitest_coverline("build/charts-base/charts-base.js", 4780);
graph.set("height", dimension);
        }
    },

    /**
     * Formats tooltip text for a pie chart.
     *
     * @method _tooltipLabelFunction
     * @param {Object} categoryItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the category is bound.</dd>
     *      <dt>displayName</dt><dd>The display name set to the category (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key of the category.</dd>
     *      <dt>value</dt><dd>The value of the category</dd>
     *  </dl>
     * @param {Object} valueItem An object containing the following:
     *  <dl>
     *      <dt>axis</dt><dd>The axis to which the item's series is bound.</dd>
     *      <dt>displayName</dt><dd>The display name of the series. (defaults to key if not provided)</dd>
     *      <dt>key</dt><dd>The key for the series.</dd>
     *      <dt>value</dt><dd>The value for the series item.</dd>
     *  </dl>
     * @param {Number} itemIndex The index of the item within the series.
     * @param {CartesianSeries} series The `PieSeries` instance of the item.
     * @param {Number} seriesIndex The index of the series in the `seriesCollection`.
     * @return {HTML}
     * @private
     */
    _tooltipLabelFunction: function(categoryItem, valueItem, itemIndex, series, seriesIndex)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_tooltipLabelFunction", 4808);
_yuitest_coverline("build/charts-base/charts-base.js", 4810);
var msg = DOCUMENT.createElement("div"),
            total = series.getTotalValues(),
            pct = Math.round((valueItem.value / total) * 10000)/100;
        _yuitest_coverline("build/charts-base/charts-base.js", 4813);
msg.appendChild(DOCUMENT.createTextNode(categoryItem.displayName +
        ": " + categoryItem.axis.get("labelFunction").apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")])));
        _yuitest_coverline("build/charts-base/charts-base.js", 4815);
msg.appendChild(DOCUMENT.createElement("br"));
        _yuitest_coverline("build/charts-base/charts-base.js", 4816);
msg.appendChild(DOCUMENT.createTextNode(valueItem.displayName +
        ": " + valueItem.axis.get("labelFunction").apply(this, [valueItem.value, valueItem.axis.get("labelFormat")])));
        _yuitest_coverline("build/charts-base/charts-base.js", 4818);
msg.appendChild(DOCUMENT.createElement("br"));
        _yuitest_coverline("build/charts-base/charts-base.js", 4819);
msg.appendChild(DOCUMENT.createTextNode(pct + "%"));
        _yuitest_coverline("build/charts-base/charts-base.js", 4820);
return msg;
    },

    /**
     * Returns the appropriate message based on the key press.
     *
     * @method _getAriaMessage
     * @param {Number} key The keycode that was pressed.
     * @return String
     */
    _getAriaMessage: function(key)
    {
        _yuitest_coverfunc("build/charts-base/charts-base.js", "_getAriaMessage", 4830);
_yuitest_coverline("build/charts-base/charts-base.js", 4832);
var msg = "",
            categoryItem,
            items,
            series,
            valueItem,
            seriesIndex = 0,
            itemIndex = this._itemIndex,
            seriesCollection = this.get("seriesCollection"),
            len,
            total,
            pct,
            markers;
        _yuitest_coverline("build/charts-base/charts-base.js", 4844);
series = this.getSeries(parseInt(seriesIndex, 10));
        _yuitest_coverline("build/charts-base/charts-base.js", 4845);
markers = series.get("markers");
        _yuitest_coverline("build/charts-base/charts-base.js", 4846);
len = markers && markers.length ? markers.length : 0;
        _yuitest_coverline("build/charts-base/charts-base.js", 4847);
if(key === 37)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4849);
itemIndex = itemIndex > 0 ? itemIndex - 1 : len - 1;
        }
        else {_yuitest_coverline("build/charts-base/charts-base.js", 4851);
if(key === 39)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4853);
itemIndex = itemIndex >= len - 1 ? 0 : itemIndex + 1;
        }}
        _yuitest_coverline("build/charts-base/charts-base.js", 4855);
this._itemIndex = itemIndex;
        _yuitest_coverline("build/charts-base/charts-base.js", 4856);
items = this.getSeriesItems(series, itemIndex);
        _yuitest_coverline("build/charts-base/charts-base.js", 4857);
categoryItem = items.category;
        _yuitest_coverline("build/charts-base/charts-base.js", 4858);
valueItem = items.value;
        _yuitest_coverline("build/charts-base/charts-base.js", 4859);
total = series.getTotalValues();
        _yuitest_coverline("build/charts-base/charts-base.js", 4860);
pct = Math.round((valueItem.value / total) * 10000)/100;
        _yuitest_coverline("build/charts-base/charts-base.js", 4861);
if(categoryItem && valueItem)
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4863);
msg += categoryItem.displayName + ": " + categoryItem.axis.formatLabel.apply(this, [categoryItem.value, categoryItem.axis.get("labelFormat")]) + ", ";
            _yuitest_coverline("build/charts-base/charts-base.js", 4864);
msg += valueItem.displayName + ": " + valueItem.axis.formatLabel.apply(this, [valueItem.value, valueItem.axis.get("labelFormat")]) + ", ";
            _yuitest_coverline("build/charts-base/charts-base.js", 4865);
msg += "Percent of total " + valueItem.displayName + ": " + pct + "%,";
        }
        else
        {
            _yuitest_coverline("build/charts-base/charts-base.js", 4869);
msg += "No data available,";
        }
        _yuitest_coverline("build/charts-base/charts-base.js", 4871);
msg += (itemIndex + 1) + " of " + len + ". ";
        _yuitest_coverline("build/charts-base/charts-base.js", 4872);
return msg;
    }
}, {
    ATTRS: {
        /**
         * Sets the aria description for the chart.
         *
         * @attribute ariaDescription
         * @type String
         */
        ariaDescription: {
            value: "Use the left and right keys to navigate through items.",

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4885);
_yuitest_coverline("build/charts-base/charts-base.js", 4887);
if(this._description)
                {
                    _yuitest_coverline("build/charts-base/charts-base.js", 4889);
this._description.setContent("");
                    _yuitest_coverline("build/charts-base/charts-base.js", 4890);
this._description.appendChild(DOCUMENT.createTextNode(val));
                }
                _yuitest_coverline("build/charts-base/charts-base.js", 4892);
return val;
            }
        },

        /**
         * Axes to appear in the chart.
         *
         * @attribute axes
         * @type Object
         */
        axes: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4903);
_yuitest_coverline("build/charts-base/charts-base.js", 4905);
return this._axes;
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4908);
_yuitest_coverline("build/charts-base/charts-base.js", 4910);
this._parseAxes(val);
            }
        },

        /**
         * Collection of series to appear on the chart. This can be an array of Series instances or object literals
         * used to describe a Series instance.
         *
         * @attribute seriesCollection
         * @type Array
         */
        seriesCollection: {
            getter: function()
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "getter", 4922);
_yuitest_coverline("build/charts-base/charts-base.js", 4924);
return this._getSeriesCollection();
            },

            setter: function(val)
            {
                _yuitest_coverfunc("build/charts-base/charts-base.js", "setter", 4927);
_yuitest_coverline("build/charts-base/charts-base.js", 4929);
return this._setSeriesCollection(val);
            }
        },

        /**
         * Type of chart when there is no series collection specified.
         *
         * @attribute type
         * @type String
         */
        type: {
            value: "pie"
        }
    }
});
/**
 * The Chart class is the basic application used to create a chart.
 *
 * @class Chart
 * @constructor
 * @submodule charts-base
 */
_yuitest_coverline("build/charts-base/charts-base.js", 4951);
function Chart(cfg)
{
    _yuitest_coverfunc("build/charts-base/charts-base.js", "Chart", 4951);
_yuitest_coverline("build/charts-base/charts-base.js", 4953);
if(cfg.type != "pie")
    {
        _yuitest_coverline("build/charts-base/charts-base.js", 4955);
return new Y.CartesianChart(cfg);
    }
    else
    {
        _yuitest_coverline("build/charts-base/charts-base.js", 4959);
return new Y.PieChart(cfg);
    }
}
_yuitest_coverline("build/charts-base/charts-base.js", 4962);
Y.Chart = Chart;


}, '@VERSION@', {
    "requires": [
        "dom",
        "event-mouseenter",
        "event-touch",
        "graphics-group",
        "axes",
        "series-cartesian",
        "series-pie",
        "series-cartesian-stacked"
    ]
});
