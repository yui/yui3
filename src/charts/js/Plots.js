/**
 * Utility class used for drawing markers.
 *
 * @class Plots
 * @constructor
 */
function Plots(cfg)
{
    var attrs = { 
        markers: {
            getter: function()
            {
                return this._markers;
            }
        }
    };
    this.addAttrs(attrs, cfg);
}

Plots.prototype = {
    /**
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
        if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = Y.clone(this.get("styles").marker),
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
            fillColors = null,
            borderColors = null,
            graphOrder = this.get("graphOrder"),
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
        this._createMarkerCache();
        if(isChrome)
        {
            this._createHotspotCache();
        }
        for(; i < len; ++i)
        {
            top = (ycoords[i] - offsetHeight);
            left = (xcoords[i] - offsetWidth);            
            if(!top || !left || top === undefined || left === undefined || top == "undefined" || left == "undefined" || isNaN(top) || isNaN(left))
            {
                this._markers.push(null);
                this._graphicNodes.push(null);
                continue;
            }
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
     * Gets the default values for series that use the utility. This method is used by
     * the class' <code>styles</code> attribute's getter to get build default values.
     *
     * @method _getPlotDefaults
     * @return Object
     * @protected
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
                weight: 1,
                alpha: 1
            },
            width: 10,
            height: 10,
            shape: "circle"
        };
        defs.fill.color = this._getDefaultColor(this.get("graphOrder"), "fill");
        defs.border.color = this._getDefaultColor(this.get("graphOrder"), "border");
        return defs;
    },

    /**
     * Collection of markers to be used in the series.
     *
     * @private
     */
    _markers: null,

    /**
     * Collection of markers to be re-used on a series redraw.
     *
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
        var marker;
        if(this._markerCache.length > 0)
        {
            while(!marker)
            {
                if(this._markerCache.length < 1)
                {
                    marker = this._createMarker(styles, order, index);
                    break;
                }
                marker = this._markerCache.shift();

            }
            marker.update(styles);
        }
        else
        {
            marker = this._createMarker(styles, order, index);
        }
        this._markers.push(marker);
        this._graphicNodes.push(marker.parentNode);
        return marker;
    },   
    
    /**
     * Creates a shape to be used as a marker.
     *
     * @method _createMarker
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the marker.
     * @return Shape
     * @private
     */
    _createMarker: function(styles, order, index)
    {
        var graphic = new Y.Graphic(),
            marker,
            cfg = Y.clone(styles);
        graphic.render(this.get("graph").get("contentBox"));
        graphic.node.setAttribute("id", "markerParent_" + order + "_" + index);
        cfg.graphic = graphic;
        marker = new Y.Shape(cfg); 
        marker.addClass("yui3-seriesmarker");
        marker.node.setAttribute("id", "series_" + order + "_" + index);
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
        if(this._markers && this._markers.length > 0)
        {
            this._markerCache = this._markers.concat();
        }
        else
        {
            this._markerCache = [];
        }
        this._markers = [];
        this._graphicNodes = [];
    },
    
    /**
     * Removes unused markers from the marker cache
     *
     * @method _clearMarkerCache
     * @private
     */
    _clearMarkerCache: function()
    {
        var len = this._markerCache.length,
            i = 0,
            graphic,
            marker;
        for(; i < len; ++i)
        {
            marker = this._markerCache[i];
            if(marker)
            {
                graphic = marker.graphics;
                graphic.destroy();
            }
        }
        this._markerCache = [];
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
        if(this._markers[i])
        {
            var w,
                h,
                markerStyles,
                styles = Y.clone(this.get("styles").marker),
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                graphicNode = marker.parentNode;
                markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                marker.update(markerStyles);
                w = markerStyles.width;
                h = markerStyles.height;
                graphicNode.style.left = (xcoords[i] - w/2) + "px";
                graphicNode.style.top = (ycoords[i] - h/2) + "px";
                marker.toggleVisible(this.get("visible"));
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
        if(Y.Lang.isArray(val))
        {
            return val[i % val.length];
        }
        return val;
    },

    /**
     * Method used by <code>styles</code> setter. Overrides base implementation.
     *
     * @method _setStyles
     * @param {Object} newStyles Hash of properties to update.
     * @return Object
     * @protected
     */
    _setStyles: function(val)
    {
        val = this._parseMarkerStyles(val);
        return Y.Renderer.prototype._setStyles.apply(this, [val]);
    },

    /**
     * Combines new styles with existing styles.
     *
     * @method _parseMarkerStyles
     * @private
     */
    _parseMarkerStyles: function(val)
    {
        if(val.marker)
        {
            var defs = this._getPlotDefaults();
            val.marker = this._mergeStyles(val.marker, defs);
            if(val.marker.over)
            {
                val.marker.over = this._mergeStyles(val.marker.over, val.marker);
            }
            if(val.marker.down)
            {
                val.marker.down = this._mergeStyles(val.marker.down, val.marker);
            }
        }
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
        var state;
        switch(type)
        {
            case "mouseout" :
                state = "off";
            break;
            case "mouseover" :
                state = "over";
            break;
            case "mouseup" :
                state = "over";
            break;
            case "mousedown" :
                state = "down";
            break;
        }
        return state;
    },
    
    /**
     * @private
     */
    _stateSyles: null,

    /**
     * Collection of hotspots to be used in the series.
     *
     * @private
     */
    _hotspots: null,

    /**
     * Collection of hotspots to be re-used on a series redraw.
     *
     * @private
     */
    _hotspotCache: null,
    
    /**
     * Gets and styles a hotspot. If there is a hotspot in cache, it will use it. Otherwise
     * it will create one.
     *
     * @method getHotspot
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the hotspot.
     * @return Shape
     * @protected
     */
    getHotspot: function(hotspotStyles, order, index)
    {
        var hotspot,
            styles = Y.clone(hotspotStyles);
        styles.fill = {
            type: "solid",
            color: "#000",
            alpha: 0
        };
        styles.border = {
            weight: 0
        };
        if(this._hotspotCache.length > 0)
        {
            while(!hotspot)
            {
                if(this._hotspotCache.length < 1)
                {
                    hotspot = this._createHotspot(styles, order, index);
                    break;
                }
                hotspot = this._hotspotCache.shift();

            }
            hotspot.update(styles);
        }
        else
        {
            hotspot = this._createHotspot(styles, order, index);
        }
        this._hotspots.push(hotspot);
        return hotspot;
    },   
    
    /**
     * Creates a shape to be used as a hotspot.
     *
     * @method _createHotspot
     * @param {Object} styles Hash of style properties.
     * @param {Number} order Order of the series.
     * @param {Number} index Index within the series associated with the hotspot.
     * @return Shape
     * @private
     */
    _createHotspot: function(styles, order, index)
    {
        var graphic = new Y.Graphic(),
            hotspot,
            cfg = Y.clone(styles);
        graphic.render(this.get("graph").get("contentBox"));
        graphic.node.setAttribute("id", "hotspotParent_" + order + "_" + index);
        cfg.graphic = graphic;
        hotspot = new Y.Shape(cfg); 
        hotspot.addClass("yui3-seriesmarker");
        hotspot.node.setAttribute("id", "hotspot_" + order + "_" + index);
        return hotspot;
    },
    
    /**
     * Creates a cache of hotspots for reuse.
     *
     * @method _createHotspotCache
     * @private
     */
    _createHotspotCache: function()
    {
        if(this._hotspots && this._hotspots.length > 0)
        {
            this._hotspotCache = this._hotspots.concat();
        }
        else
        {
            this._hotspotCache = [];
        }
        this._hotspots = [];
    },
    
    /**
     * Removes unused hotspots from the hotspot cache
     *
     * @method _clearHotspotCache
     * @private
     */
    _clearHotspotCache: function()
    {
        var len = this._hotspotCache.length,
            i = 0,
            graphic,
            hotspot;
        for(; i < len; ++i)
        {
            hotspot = this._hotspotCache[i];
            if(hotspot)
            {
                graphic = hotspot.graphics;
                graphic.destroy();
            }
        }
        this._hotspotCache = [];
    }
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
