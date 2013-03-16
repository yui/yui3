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
_yuitest_coverage["build/series-plot-util/series-plot-util.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/series-plot-util/series-plot-util.js",
    code: []
};
_yuitest_coverage["build/series-plot-util/series-plot-util.js"].code=["YUI.add('series-plot-util', function (Y, NAME) {","","/**"," * Provides functionality for drawing plots in a series."," *"," * @module charts"," * @submodule series-plot-util"," */","var Y_Lang = Y.Lang,","    _getClassName = Y.ClassNameManager.getClassName,","    SERIES_MARKER = _getClassName(\"seriesmarker\");","","/**"," * Utility class used for drawing markers."," *"," * @class Plots"," * @constructor"," * @submodule series-plot-util"," */","function Plots(cfg)","{","    var attrs = {","        markers: {","            getter: function()","            {","                return this._markers;","            }","        }","    };","    this.addAttrs(attrs, cfg);","}","","Plots.prototype = {","    /**","     * Storage for default marker styles.","     *","     * @property _plotDefaults","     * @type Object","     * @private","     */","    _plotDefaults: null,","","    /**","     * Draws the markers","     *","     * @method drawPlots","     * @protected","     */","    drawPlots: function()","    {","        if(!this.get(\"xcoords\") || this.get(\"xcoords\").length < 1)","		{","			return;","		}","        var isNumber = Y_Lang.isNumber,","            style = Y.clone(this.get(\"styles\").marker),","            w = style.width,","            h = style.height,","            xcoords = this.get(\"xcoords\"),","            ycoords = this.get(\"ycoords\"),","            i = 0,","            len = xcoords.length,","            top = ycoords[0],","            left,","            marker,","            offsetWidth = w/2,","            offsetHeight = h/2,","            xvalues,","            yvalues,","            fillColors = null,","            borderColors = null,","            graphOrder = this.get(\"graphOrder\"),","            groupMarkers = this.get(\"groupMarkers\");","        if(groupMarkers)","        {","            xvalues = [];","            yvalues = [];","            for(; i < len; ++i)","            {","                xvalues.push(parseFloat(xcoords[i] - offsetWidth));","                yvalues.push(parseFloat(ycoords[i] - offsetHeight));","            }","            this._createGroupMarker({","                xvalues: xvalues,","                yvalues: yvalues,","                fill: style.fill,","                border: style.border,","                dimensions: {","                    width: w,","                    height: h","                },","                graphOrder: graphOrder,","                shape: style.shape","            });","            return;","        }","        if(Y_Lang.isArray(style.fill.color))","        {","            fillColors = style.fill.color.concat();","        }","        if(Y_Lang.isArray(style.border.color))","        {","            borderColors = style.border.color.concat();","        }","        this._createMarkerCache();","        for(; i < len; ++i)","        {","            top = parseFloat(ycoords[i] - offsetHeight);","            left = parseFloat(xcoords[i] - offsetWidth);","            if(!isNumber(left) || !isNumber(top))","            {","                this._markers.push(null);","                continue;","            }","            if(fillColors)","            {","                style.fill.color = fillColors[i % fillColors.length];","            }","            if(borderColors)","            {","                style.border.color = borderColors[i % borderColors.length];","            }","","            style.x = left;","            style.y = top;","            marker = this.getMarker(style, graphOrder, i);","        }","        this._clearMarkerCache();","    },","","    /**","     * Pre-defined group shapes.","     *","     * @property _groupShapes","     * @private","     */","    _groupShapes: {","        circle: Y.CircleGroup,","        rect: Y.RectGroup,","        ellipse: Y.EllipseGroup,","        diamond: Y.DiamondGroup","    },","","    /**","     * Returns the correct group shape class.","     *","     * @method _getGroupShape","     * @param {Shape | String} shape Indicates which shape class.","     * @return Function","     * @protected","     */","    _getGroupShape: function(shape)","    {","        if(Y_Lang.isString(shape))","        {","            shape = this._groupShapes[shape];","        }","        return shape;","    },","","    /**","     * Gets the default values for series that use the utility. This method is used by","     * the class' `styles` attribute's getter to get build default values.","     *","     * @method _getPlotDefaults","     * @return Object","     * @protected","     */","    _getPlotDefaults: function()","    {","        var defs = {","            fill:{","                type: \"solid\",","                alpha: 1,","                colors:null,","                alphas: null,","                ratios: null","            },","            border:{","                weight: 1,","                alpha: 1","            },","            width: 10,","            height: 10,","            shape: \"circle\"","        };","        defs.fill.color = this._getDefaultColor(this.get(\"graphOrder\"), \"fill\");","        defs.border.color = this._getDefaultColor(this.get(\"graphOrder\"), \"border\");","        return defs;","    },","","    /**","     * Collection of markers to be used in the series.","     *","     * @property _markers","     * @type Array","     * @private","     */","    _markers: null,","","    /**","     * Collection of markers to be re-used on a series redraw.","     *","     * @property _markerCache","     * @type Array","     * @private","     */","    _markerCache: null,","","    /**","     * Gets and styles a marker. If there is a marker in cache, it will use it. Otherwise","     * it will create one.","     *","     * @method getMarker","     * @param {Object} styles Hash of style properties.","     * @param {Number} order Order of the series.","     * @param {Number} index Index within the series associated with the marker.","     * @return Shape","     * @protected","     */","    getMarker: function(styles, order, index)","    {","        var marker,","            border = styles.border;","        styles.id = this._getChart().get(\"id\") + \"_\" + order + \"_\" + index;","        //fix name differences between graphic layer","        border.opacity = border.alpha;","        styles.stroke = border;","        styles.fill.opacity = styles.fill.alpha;","        if(this._markerCache.length > 0)","        {","            while(!marker)","            {","                if(this._markerCache.length < 1)","                {","                    marker = this._createMarker(styles);","                    break;","                }","                marker = this._markerCache.shift();","","            }","            marker.set(styles);","        }","        else","        {","            marker = this._createMarker(styles);","        }","        this._markers.push(marker);","        return marker;","    },","","    /**","     * Creates a shape to be used as a marker.","     *","     * @method _createMarker","     * @param {Object} styles Hash of style properties.","     * @return Shape","     * @private","     */","    _createMarker: function(styles)","    {","        var graphic = this.get(\"graphic\"),","            marker,","            cfg = Y.clone(styles);","        cfg.type = cfg.shape;","        marker = graphic.addShape(cfg);","        marker.addClass(SERIES_MARKER);","        return marker;","    },","","    /**","     * Creates a cache of markers for reuse.","     *","     * @method _createMarkerCache","     * @private","     */","    _createMarkerCache: function()","    {","        if(this._groupMarker)","        {","            this._groupMarker.destroy();","            this._groupMarker = null;","        }","        if(this._markers && this._markers.length > 0)","        {","            this._markerCache = this._markers.concat();","        }","        else","        {","            this._markerCache = [];","        }","        this._markers = [];","    },","","    /**","     * Draws a series of markers in a single shape instance.","     *","     * @method _createGroupMarkers","     * @param {Object} styles Set of configuration properties used to create the markers.","     * @protected","     */","    _createGroupMarker: function(styles)","    {","        var marker,","            markers = this.get(\"markers\"),","            border = styles.border,","            graphic,","            cfg,","            shape;","        if(markers && markers.length > 0)","        {","            while(markers.length > 0)","            {","                marker = markers.shift();","                marker.destroy();","            }","            this.set(\"markers\", []);","        }","        //fix name differences between graphic layer","        border.opacity = border.alpha;","        cfg = {","            id: this._getChart().get(\"id\") + \"_\" + styles.graphOrder,","            stroke: border,","            fill: styles.fill,","            dimensions: styles.dimensions,","            xvalues: styles.xvalues,","            yvalues: styles.yvalues","        };","        cfg.fill.opacity = styles.fill.alpha;","        shape = this._getGroupShape(styles.shape);","        if(shape)","        {","            cfg.type = shape;","        }","        if(styles.hasOwnProperty(\"radius\") && !isNaN(styles.radius))","        {","            cfg.dimensions.radius = styles.radius;","        }","        if(this._groupMarker)","        {","            this._groupMarker.destroy();","        }","        graphic = this.get(\"graphic\");","        this._groupMarker = graphic.addShape(cfg);","        graphic._redraw();","    },","","    /**","     * Toggles visibility","     *","     * @method _toggleVisible","     * @param {Boolean} visible indicates visibilitye","     * @private","     */","    _toggleVisible: function(visible)","    {","        var marker,","            markers = this.get(\"markers\"),","            i = 0,","            len;","        if(markers)","        {","            len = markers.length;","            for(; i < len; ++i)","            {","                marker = markers[i];","                if(marker)","                {","                    marker.set(\"visible\", visible);","                }","            }","        }","    },","","    /**","     * Removes unused markers from the marker cache","     *","     * @method _clearMarkerCache","     * @private","     */","    _clearMarkerCache: function()","    {","        var marker;","        while(this._markerCache.length > 0)","        {","            marker = this._markerCache.shift();","            if(marker)","            {","                marker.destroy();","            }","        }","    },","","    /**","     * Resizes and positions markers based on a mouse interaction.","     *","     * @method updateMarkerState","     * @param {String} type state of the marker","     * @param {Number} i index of the marker","     * @protected","     */","    updateMarkerState: function(type, i)","    {","        if(this._markers && this._markers[i])","        {","            var w,","                h,","                styles = Y.clone(this.get(\"styles\").marker),","                state = this._getState(type),","                xcoords = this.get(\"xcoords\"),","                ycoords = this.get(\"ycoords\"),","                marker = this._markers[i],","                markerStyles = state === \"off\" || !styles[state] ? styles : styles[state];","                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);","                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);","                markerStyles.stroke = markerStyles.border;","                marker.set(markerStyles);","                w = markerStyles.width;","                h = markerStyles.height;","                marker.set(\"x\", (xcoords[i] - w/2));","                marker.set(\"y\",  (ycoords[i] - h/2));","                marker.set(\"visible\", this.get(\"visible\"));","        }","    },","","    /**","     * Parses a color from an array.","     *","     * @method _getItemColor","     * @param {Array} val collection of colors","     * @param {Number} i index of the item","     * @return String","     * @protected","     */","    _getItemColor: function(val, i)","    {","        if(Y_Lang.isArray(val))","        {","            return val[i % val.length];","        }","        return val;","    },","","    /**","     * Method used by `styles` setter. Overrides base implementation.","     *","     * @method _setStyles","     * @param {Object} newStyles Hash of properties to update.","     * @return Object","     * @protected","     */","    _setStyles: function(val)","    {","        val = this._parseMarkerStyles(val);","        return Y.Renderer.prototype._setStyles.apply(this, [val]);","    },","","    /**","     * Combines new styles with existing styles.","     *","     * @method _parseMarkerStyles","     * @param {Object} Object containing style properties for the marker.","     * @return Object","     * @private","     */","    _parseMarkerStyles: function(val)","    {","        if(val.marker)","        {","            var defs = this._getPlotDefaults();","            val.marker = this._mergeStyles(val.marker, defs);","            if(val.marker.over)","            {","                val.marker.over = this._mergeStyles(val.marker.over, val.marker);","            }","            if(val.marker.down)","            {","                val.marker.down = this._mergeStyles(val.marker.down, val.marker);","            }","        }","        return val;","    },","","    /**","     * Returns marker state based on event type","     *","     * @method _getState","     * @param {String} type event type","     * @return String","     * @protected","     */","    _getState: function(type)","    {","        var state;","        switch(type)","        {","            case \"mouseout\" :","                state = \"off\";","            break;","            case \"mouseover\" :","                state = \"over\";","            break;","            case \"mouseup\" :","                state = \"over\";","            break;","            case \"mousedown\" :","                state = \"down\";","            break;","        }","        return state;","    },","","    /**","     * @property _statSyles","     * @type Object","     * @private","     */","    _stateSyles: null,","","    /**","     * @protected","     *","     * Draws the series.","     *","     * @method drawSeries","     */","    drawSeries: function()","    {","        this.drawPlots();","    },","","    /**","     * @protected","     *","     * Gets the default value for the `styles` attribute. Overrides","     * base implementation.","     *","     * @method _getDefaultStyles","     * @return Object","     */","    _getDefaultStyles: function()","    {","        var styles = this._mergeStyles({marker:this._getPlotDefaults()}, this.constructor.superclass._getDefaultStyles());","        return styles;","    }","};","","Y.augment(Plots, Y.Attribute);","Y.Plots = Plots;","","","}, '@VERSION@');"];
_yuitest_coverage["build/series-plot-util/series-plot-util.js"].lines = {"1":0,"9":0,"20":0,"22":0,"26":0,"30":0,"33":0,"51":0,"53":0,"55":0,"74":0,"76":0,"77":0,"78":0,"80":0,"81":0,"83":0,"95":0,"97":0,"99":0,"101":0,"103":0,"105":0,"106":0,"108":0,"109":0,"110":0,"112":0,"113":0,"115":0,"117":0,"119":0,"121":0,"124":0,"125":0,"126":0,"128":0,"154":0,"156":0,"158":0,"171":0,"187":0,"188":0,"189":0,"223":0,"225":0,"227":0,"228":0,"229":0,"230":0,"232":0,"234":0,"236":0,"237":0,"239":0,"242":0,"246":0,"248":0,"249":0,"262":0,"265":0,"266":0,"267":0,"268":0,"279":0,"281":0,"282":0,"284":0,"286":0,"290":0,"292":0,"304":0,"310":0,"312":0,"314":0,"315":0,"317":0,"320":0,"321":0,"329":0,"330":0,"331":0,"333":0,"335":0,"337":0,"339":0,"341":0,"343":0,"344":0,"345":0,"357":0,"361":0,"363":0,"364":0,"366":0,"367":0,"369":0,"383":0,"384":0,"386":0,"387":0,"389":0,"404":0,"406":0,"414":0,"415":0,"416":0,"417":0,"418":0,"419":0,"420":0,"421":0,"422":0,"437":0,"439":0,"441":0,"454":0,"455":0,"468":0,"470":0,"471":0,"472":0,"474":0,"476":0,"478":0,"481":0,"494":0,"495":0,"498":0,"499":0,"501":0,"502":0,"504":0,"505":0,"507":0,"508":0,"510":0,"529":0,"543":0,"544":0,"548":0,"549":0};
_yuitest_coverage["build/series-plot-util/series-plot-util.js"].functions = {"getter:24":0,"Plots:20":0,"drawPlots:49":0,"_getGroupShape:152":0,"_getPlotDefaults:169":0,"getMarker:221":0,"_createMarker:260":0,"_createMarkerCache:277":0,"_createGroupMarker:302":0,"_toggleVisible:355":0,"_clearMarkerCache:381":0,"updateMarkerState:402":0,"_getItemColor:435":0,"_setStyles:452":0,"_parseMarkerStyles:466":0,"_getState:492":0,"drawSeries:527":0,"_getDefaultStyles:541":0,"(anonymous 1):1":0};
_yuitest_coverage["build/series-plot-util/series-plot-util.js"].coveredLines = 142;
_yuitest_coverage["build/series-plot-util/series-plot-util.js"].coveredFunctions = 19;
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 1);
YUI.add('series-plot-util', function (Y, NAME) {

/**
 * Provides functionality for drawing plots in a series.
 *
 * @module charts
 * @submodule series-plot-util
 */
_yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "(anonymous 1)", 1);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 9);
var Y_Lang = Y.Lang,
    _getClassName = Y.ClassNameManager.getClassName,
    SERIES_MARKER = _getClassName("seriesmarker");

/**
 * Utility class used for drawing markers.
 *
 * @class Plots
 * @constructor
 * @submodule series-plot-util
 */
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 20);
function Plots(cfg)
{
    _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "Plots", 20);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 22);
var attrs = {
        markers: {
            getter: function()
            {
                _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "getter", 24);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 26);
return this._markers;
            }
        }
    };
    _yuitest_coverline("build/series-plot-util/series-plot-util.js", 30);
this.addAttrs(attrs, cfg);
}

_yuitest_coverline("build/series-plot-util/series-plot-util.js", 33);
Plots.prototype = {
    /**
     * Storage for default marker styles.
     *
     * @property _plotDefaults
     * @type Object
     * @private
     */
    _plotDefaults: null,

    /**
     * Draws the markers
     *
     * @method drawPlots
     * @protected
     */
    drawPlots: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "drawPlots", 49);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 51);
if(!this.get("xcoords") || this.get("xcoords").length < 1)
		{
			_yuitest_coverline("build/series-plot-util/series-plot-util.js", 53);
return;
		}
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 55);
var isNumber = Y_Lang.isNumber,
            style = Y.clone(this.get("styles").marker),
            w = style.width,
            h = style.height,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            left,
            marker,
            offsetWidth = w/2,
            offsetHeight = h/2,
            xvalues,
            yvalues,
            fillColors = null,
            borderColors = null,
            graphOrder = this.get("graphOrder"),
            groupMarkers = this.get("groupMarkers");
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 74);
if(groupMarkers)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 76);
xvalues = [];
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 77);
yvalues = [];
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 78);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 80);
xvalues.push(parseFloat(xcoords[i] - offsetWidth));
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 81);
yvalues.push(parseFloat(ycoords[i] - offsetHeight));
            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 83);
this._createGroupMarker({
                xvalues: xvalues,
                yvalues: yvalues,
                fill: style.fill,
                border: style.border,
                dimensions: {
                    width: w,
                    height: h
                },
                graphOrder: graphOrder,
                shape: style.shape
            });
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 95);
return;
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 97);
if(Y_Lang.isArray(style.fill.color))
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 99);
fillColors = style.fill.color.concat();
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 101);
if(Y_Lang.isArray(style.border.color))
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 103);
borderColors = style.border.color.concat();
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 105);
this._createMarkerCache();
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 106);
for(; i < len; ++i)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 108);
top = parseFloat(ycoords[i] - offsetHeight);
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 109);
left = parseFloat(xcoords[i] - offsetWidth);
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 110);
if(!isNumber(left) || !isNumber(top))
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 112);
this._markers.push(null);
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 113);
continue;
            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 115);
if(fillColors)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 117);
style.fill.color = fillColors[i % fillColors.length];
            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 119);
if(borderColors)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 121);
style.border.color = borderColors[i % borderColors.length];
            }

            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 124);
style.x = left;
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 125);
style.y = top;
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 126);
marker = this.getMarker(style, graphOrder, i);
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 128);
this._clearMarkerCache();
    },

    /**
     * Pre-defined group shapes.
     *
     * @property _groupShapes
     * @private
     */
    _groupShapes: {
        circle: Y.CircleGroup,
        rect: Y.RectGroup,
        ellipse: Y.EllipseGroup,
        diamond: Y.DiamondGroup
    },

    /**
     * Returns the correct group shape class.
     *
     * @method _getGroupShape
     * @param {Shape | String} shape Indicates which shape class.
     * @return Function
     * @protected
     */
    _getGroupShape: function(shape)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_getGroupShape", 152);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 154);
if(Y_Lang.isString(shape))
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 156);
shape = this._groupShapes[shape];
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 158);
return shape;
    },

    /**
     * Gets the default values for series that use the utility. This method is used by
     * the class' `styles` attribute's getter to get build default values.
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
     */
    _getPlotDefaults: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_getPlotDefaults", 169);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 171);
var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 1,
                alpha: 1
            },
            width: 10,
            height: 10,
            shape: "circle"
        };
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 187);
defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 188);
defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 189);
return defs;
    },

    /**
     * Collection of markers to be used in the series.
     *
     * @property _markers
     * @type Array
     * @private
     */
    _markers: null,

    /**
     * Collection of markers to be re-used on a series redraw.
     *
     * @property _markerCache
     * @type Array
     * @private
     */
    _markerCache: null,

    /**
     * Gets and styles a marker. If there is a marker in cache, it will use it. Otherwise
     * it will create one.
     *
     * @method getMarker
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the marker.
     * @return Shape
     * @protected
     */
    getMarker: function(styles, order, index)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "getMarker", 221);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 223);
var marker,
            border = styles.border;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 225);
styles.id = this._getChart().get("id") + "_" + order + "_" + index;
        //fix name differences between graphic layer
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 227);
border.opacity = border.alpha;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 228);
styles.stroke = border;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 229);
styles.fill.opacity = styles.fill.alpha;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 230);
if(this._markerCache.length > 0)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 232);
while(!marker)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 234);
if(this._markerCache.length < 1)
                {
                    _yuitest_coverline("build/series-plot-util/series-plot-util.js", 236);
marker = this._createMarker(styles);
                    _yuitest_coverline("build/series-plot-util/series-plot-util.js", 237);
break;
                }
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 239);
marker = this._markerCache.shift();

            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 242);
marker.set(styles);
        }
        else
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 246);
marker = this._createMarker(styles);
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 248);
this._markers.push(marker);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 249);
return marker;
    },

    /**
     * Creates a shape to be used as a marker.
     *
     * @method _createMarker
     * @param {Object} styles Hash of style properties.
     * @return Shape
     * @private
     */
    _createMarker: function(styles)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_createMarker", 260);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 262);
var graphic = this.get("graphic"),
            marker,
            cfg = Y.clone(styles);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 265);
cfg.type = cfg.shape;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 266);
marker = graphic.addShape(cfg);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 267);
marker.addClass(SERIES_MARKER);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 268);
return marker;
    },

    /**
     * Creates a cache of markers for reuse.
     *
     * @method _createMarkerCache
     * @private
     */
    _createMarkerCache: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_createMarkerCache", 277);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 279);
if(this._groupMarker)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 281);
this._groupMarker.destroy();
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 282);
this._groupMarker = null;
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 284);
if(this._markers && this._markers.length > 0)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 286);
this._markerCache = this._markers.concat();
        }
        else
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 290);
this._markerCache = [];
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 292);
this._markers = [];
    },

    /**
     * Draws a series of markers in a single shape instance.
     *
     * @method _createGroupMarkers
     * @param {Object} styles Set of configuration properties used to create the markers.
     * @protected
     */
    _createGroupMarker: function(styles)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_createGroupMarker", 302);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 304);
var marker,
            markers = this.get("markers"),
            border = styles.border,
            graphic,
            cfg,
            shape;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 310);
if(markers && markers.length > 0)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 312);
while(markers.length > 0)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 314);
marker = markers.shift();
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 315);
marker.destroy();
            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 317);
this.set("markers", []);
        }
        //fix name differences between graphic layer
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 320);
border.opacity = border.alpha;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 321);
cfg = {
            id: this._getChart().get("id") + "_" + styles.graphOrder,
            stroke: border,
            fill: styles.fill,
            dimensions: styles.dimensions,
            xvalues: styles.xvalues,
            yvalues: styles.yvalues
        };
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 329);
cfg.fill.opacity = styles.fill.alpha;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 330);
shape = this._getGroupShape(styles.shape);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 331);
if(shape)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 333);
cfg.type = shape;
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 335);
if(styles.hasOwnProperty("radius") && !isNaN(styles.radius))
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 337);
cfg.dimensions.radius = styles.radius;
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 339);
if(this._groupMarker)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 341);
this._groupMarker.destroy();
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 343);
graphic = this.get("graphic");
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 344);
this._groupMarker = graphic.addShape(cfg);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 345);
graphic._redraw();
    },

    /**
     * Toggles visibility
     *
     * @method _toggleVisible
     * @param {Boolean} visible indicates visibilitye
     * @private
     */
    _toggleVisible: function(visible)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_toggleVisible", 355);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 357);
var marker,
            markers = this.get("markers"),
            i = 0,
            len;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 361);
if(markers)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 363);
len = markers.length;
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 364);
for(; i < len; ++i)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 366);
marker = markers[i];
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 367);
if(marker)
                {
                    _yuitest_coverline("build/series-plot-util/series-plot-util.js", 369);
marker.set("visible", visible);
                }
            }
        }
    },

    /**
     * Removes unused markers from the marker cache
     *
     * @method _clearMarkerCache
     * @private
     */
    _clearMarkerCache: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_clearMarkerCache", 381);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 383);
var marker;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 384);
while(this._markerCache.length > 0)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 386);
marker = this._markerCache.shift();
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 387);
if(marker)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 389);
marker.destroy();
            }
        }
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "updateMarkerState", 402);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 404);
if(this._markers && this._markers[i])
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 406);
var w,
                h,
                styles = Y.clone(this.get("styles").marker),
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                markerStyles = state === "off" || !styles[state] ? styles : styles[state];
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 414);
markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 415);
markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 416);
markerStyles.stroke = markerStyles.border;
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 417);
marker.set(markerStyles);
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 418);
w = markerStyles.width;
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 419);
h = markerStyles.height;
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 420);
marker.set("x", (xcoords[i] - w/2));
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 421);
marker.set("y",  (ycoords[i] - h/2));
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 422);
marker.set("visible", this.get("visible"));
        }
    },

    /**
     * Parses a color from an array.
     *
     * @method _getItemColor
     * @param {Array} val collection of colors
     * @param {Number} i index of the item
     * @return String
     * @protected
     */
    _getItemColor: function(val, i)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_getItemColor", 435);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 437);
if(Y_Lang.isArray(val))
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 439);
return val[i % val.length];
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 441);
return val;
    },

    /**
     * Method used by `styles` setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     * @protected
     */
    _setStyles: function(val)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_setStyles", 452);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 454);
val = this._parseMarkerStyles(val);
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 455);
return Y.Renderer.prototype._setStyles.apply(this, [val]);
    },

    /**
     * Combines new styles with existing styles.
     *
     * @method _parseMarkerStyles
     * @param {Object} Object containing style properties for the marker.
     * @return Object
     * @private
     */
    _parseMarkerStyles: function(val)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_parseMarkerStyles", 466);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 468);
if(val.marker)
        {
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 470);
var defs = this._getPlotDefaults();
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 471);
val.marker = this._mergeStyles(val.marker, defs);
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 472);
if(val.marker.over)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 474);
val.marker.over = this._mergeStyles(val.marker.over, val.marker);
            }
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 476);
if(val.marker.down)
            {
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 478);
val.marker.down = this._mergeStyles(val.marker.down, val.marker);
            }
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 481);
return val;
    },

    /**
     * Returns marker state based on event type
     *
     * @method _getState
     * @param {String} type event type
     * @return String
     * @protected
     */
    _getState: function(type)
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_getState", 492);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 494);
var state;
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 495);
switch(type)
        {
            case "mouseout" :
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 498);
state = "off";
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 499);
break;
            case "mouseover" :
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 501);
state = "over";
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 502);
break;
            case "mouseup" :
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 504);
state = "over";
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 505);
break;
            case "mousedown" :
                _yuitest_coverline("build/series-plot-util/series-plot-util.js", 507);
state = "down";
            _yuitest_coverline("build/series-plot-util/series-plot-util.js", 508);
break;
        }
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 510);
return state;
    },

    /**
     * @property _statSyles
     * @type Object
     * @private
     */
    _stateSyles: null,

    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "drawSeries", 527);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 529);
this.drawPlots();
    },

    /**
     * @protected
     *
     * Gets the default value for the `styles` attribute. Overrides
     * base implementation.
     *
     * @method _getDefaultStyles
     * @return Object
     */
    _getDefaultStyles: function()
    {
        _yuitest_coverfunc("build/series-plot-util/series-plot-util.js", "_getDefaultStyles", 541);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 543);
var styles = this._mergeStyles({marker:this._getPlotDefaults()}, this.constructor.superclass._getDefaultStyles());
        _yuitest_coverline("build/series-plot-util/series-plot-util.js", 544);
return styles;
    }
};

_yuitest_coverline("build/series-plot-util/series-plot-util.js", 548);
Y.augment(Plots, Y.Attribute);
_yuitest_coverline("build/series-plot-util/series-plot-util.js", 549);
Y.Plots = Plots;


}, '@VERSION@');
