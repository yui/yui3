/**
 * Histogram is the base class for Column and Bar series.
 *
 * @class Histogram
 * @constructor
 */
function Histogram(){}

Histogram.prototype = {
    /**
     * @protected
     *
     * Draws the series.
     *
     * @method drawSeries
     */
    drawSeries: function()
    {
        if(this.get("xcoords").length < 1) 
        {
            return;
        }
        var style = Y.clone(this.get("styles").marker),
            setSize,
            calculatedSize,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = 0,
            len = xcoords.length,
            top = ycoords[0],
            type = this.get("type"),
            graph = this.get("graph"),
            seriesCollection = graph.seriesTypes[type],
            seriesLen = seriesCollection.length,
            seriesSize = 0,
            totalSize = 0,
            offset = 0,
            ratio,
            renderer,
            order = this.get("order"),
            graphOrder = this.get("graphOrder"),
            left,
            marker,
            setSizeKey,
            calculatedSizeKey,
            config,
            fillColors = null,
            borderColors = null,
            hotspot,
            isChrome = ISCHROME;
        if(Y.Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y.Lang.isArray(style.border.color))
        {
            borderColors = style.border.colors.concat();
        }
        if(this.get("direction") == "vertical")
        {
            setSizeKey = "height";
            calculatedSizeKey = "width";
        }
        else
        {
            setSizeKey = "width";
            calculatedSizeKey = "height";
        }
        setSize = style[setSizeKey];
        calculatedSize = style[calculatedSizeKey];
        this._createMarkerCache();
        if(isChrome)
        {
            this._createHotspotCache();
        }
        for(; i < seriesLen; ++i)
        {
            renderer = seriesCollection[i];
            seriesSize += renderer.get("styles").marker[setSizeKey];
            if(order > i) 
            {
                offset = seriesSize;
            }
        }
        totalSize = len * seriesSize;
        if(totalSize > graph.get(setSizeKey))
        {
            ratio = graph.get(setSizeKey)/totalSize;
            seriesSize *= ratio;
            offset *= ratio;
            setSize *= ratio;
            setSize = Math.max(setSize, 1);
        }
        offset -= seriesSize/2;
        for(i = 0; i < len; ++i)
        {
            config = this._getMarkerDimensions(xcoords[i], ycoords[i], calculatedSize, offset);
            top = config.top;
            calculatedSize = config.calculatedSize;
            left = config.left;
            style[setSizeKey] = setSize;
            style[calculatedSizeKey] = calculatedSize;
            if(fillColors)
            {
                style.fill.color = fillColors[i % fillColors.length];
            }
            if(borderColors)
            {
                style.border.colors = borderColors[i % borderColors.length];
            }
            marker = this.getMarker(style, graphOrder, i);
            marker.setPosition(left, top);
            if(isChrome)
            {
                hotspot = this.getHotspot(style, graphOrder, i);
                hotspot.setPosition(left, top);
                hotspot.parentNode.style.zIndex = 5;
            }
        }
        this._clearMarkerCache();
        if(isChrome)
        {
            this._clearHotspotCache();
        }
    },
    
    /**
     * @private
     */
    _defaultFillColors: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],
    
    /**
     * @private
     */
    _getPlotDefaults: function()
    {
        var defs = {
            fill:{
                type: "solid",
                alpha: 1,
                colors:null,
                alphas: null,
                ratios: null
            },
            border:{
                weight: 0,
                alpha: 1
            },
            width: 12,
            height: 12,
            shape: "rect",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    }
};

Y.Histogram = Histogram;
