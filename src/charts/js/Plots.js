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
        if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var isNumber = Y.Lang.isNumber,
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
            fillColors = null,
            borderColors = null,
            graphOrder = this.get("graphOrder");
        if(Y.Lang.isArray(style.fill.color))
        {
            fillColors = style.fill.color.concat(); 
        }
        if(Y.Lang.isArray(style.border.color))
        {
            borderColors = style.border.colors.concat();
        }
        this._createMarkerCache();
        for(; i < len; ++i)
        {
            top = parseFloat(ycoords[i] - offsetHeight);
            left = parseFloat(xcoords[i] - offsetWidth);            
            if(!isNumber(left) || !isNumber(top))
            {
                this._markers.push(null);
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

            style.x = left;
            style.y = top;
            marker = this.getMarker(style, graphOrder, i);
        }
        this._clearMarkerCache();
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
        var marker,
            border = styles.border;
        styles.id = "series_" + order + "_" + index;
        //fix name differences between graphic layer
        border.opacity = border.alpha;
        styles.stroke = border;
        styles.fill.opacity = styles.fill.alpha;
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
            marker.set(styles);
        }
        else
        {
            marker = this._createMarker(styles, order, index);
        }
        this._markers.push(marker);
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
        var graphic = this.get("graphic"),
            marker,
            cfg = Y.clone(styles);
        graphic.set("autoDraw", false);
        cfg.type = cfg.shape;
        marker = graphic.addShape(cfg); 
        marker.addClass("yui3-seriesmarker");
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
        var marker,
            markers = this.get("markers"),
            i = 0,
            len;
        if(markers)
        {
            len = markers.length;
            for(; i < len; ++i)
            {
                marker = markers[i];
                if(marker)
                {
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
        var len = this._markerCache.length,
            i = 0,
            marker;
        while(this._markerCache.length > 0)
        {
            marker = this._markerCache.shift();
            if(marker)
            {
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
        if(this._markers[i])
        {
            var w,
                h,
                styles = Y.clone(this.get("styles").marker),
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                markerStyles.stroke = markerStyles.border;
                marker.set(markerStyles);
                w = markerStyles.width;
                h = markerStyles.height;
                marker.set("x", (xcoords[i] - w/2));
                marker.set("y",  (ycoords[i] - h/2));
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
        if(Y.Lang.isArray(val))
        {
            return val[i % val.length];
        }
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
        val = this._parseMarkerStyles(val);
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
     * @property _statSyles
     * @type Object
     * @private
     */
    _stateSyles: null
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
