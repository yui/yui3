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
            mnode,
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
            top = (ycoords[i] - offsetHeight);
            left = (xcoords[i] - offsetWidth);            
            if(!top || !left || top === undefined || left === undefined || top == "undefined" || left == "undefined" || isNaN(top) || isNaN(left))
            {
                this._markers.push(null);
                this._graphicNodes.push(null);
                continue;
            }
            top += "px";
            left += "px";
            if(fillColors)
            {
                style.fill.color = fillColors[i % fillColors.length];
            }
            if(borderColors)
            {
                style.border.colors = borderColors[i % borderColors.length];
            }
            marker = this.getMarker(style, graphOrder, i);
            mnode = Y.one(marker.parentNode);
            mnode.setStyle("position", "absolute"); 
            mnode.setStyle("top", top);
            mnode.setStyle("left", left);
        }
        this._clearMarkerCache();
    },

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
     * @private
     * Collection of markers to be used in the series.
     */
    _markers: null,

    /**
     * @private
     * Collection of markers to be re-used on a series redraw.
     */
    _markerCache: null,
    
    /**
     * @private
     * @description Creates a marker based on its style properties.
     */
    getMarker: function(styles, order, index)
    {
        var marker,
            graphic,
            cfg;
        if(this._markerCache.length > 0)
        {
            while(!marker)
            {
                if(this._markerCache.length < 1)
                {
                    marker = this.getMarker(styles, order, index);
                    break;
                }
                marker = this._markerCache.shift();

            }
            marker.update(styles);
        }
        else
        {
            graphic = new Y.Graphic();
            graphic.render(this.get("graph").get("contentBox"));
            graphic.node.setAttribute("id", "markerParent_" + order + "_" + index);
            cfg = Y.clone(styles);
            marker = graphic.getShape(cfg);
            marker.addClass("yui3-seriesmarker");
            marker.node.setAttribute("id", "series_" + order + "_" + index);
            graphic.render(this.get("graph").get("contentBox"));
        }
        this._markers.push(marker);
        this._graphicNodes.push(marker.parentNode);
        return marker;
    },   
    
    /**
     * @private
     * Creates a cache of markers for reuse.
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
     * @private
     * Removes unused markers from the marker cache
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
     * @protected
     * @description parses a color from an array.
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
     * @private
     */
    _setStyles: function(val)
    {
        val = this._parseMarkerStyles(val);
        return Y.Renderer.prototype._setStyles.apply(this, [val]);
    },

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
    _toggleVisible: function(e) 
    {
        var graphic = this.get("graphic"),
            markers = this.get("markers"),
            i = 0,
            len,
            visible = this.get("visible"),
            marker;
        if(graphic)
        {
            graphic.toggleVisible(visible);
        }
        if(markers)
        {
            len = markers.length;
            for(; i < len; ++i)
            {
                marker = markers[i];
                if(marker)
                {
                    marker.toggleVisible(visible);
                }
            }

        }
    },

    _stateSyles: null
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
