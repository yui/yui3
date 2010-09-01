function Plots(cfg)
{
    var attrs = {
        marker: {
            getter: function()
            {
                return this._plotDefaults || this._getPlotDefaults();
            },

            setter: function(val)
            {
                var defaults = this._plotDefaults || this._getPlotDefaults();
                this._plotDefaults = Y.merge(defaults, val);
            }
        }
    };
    this.addAttrs(attrs, cfg);
    this.get("styles");
}

Plots.prototype = {
    /**
     * @private
     */
    _plotDefaults: null,

    bindUI: function()
    {
        Y.delegate("mouseover", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mousedown", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseup", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
        Y.delegate("mouseout", Y.bind(this._markerEventHandler, this), this.get("node"), ".yui3-seriesmarker");
    },
    
    drawPlots: function()
    {
	    if(!this.get("xcoords") || this.get("xcoords").length < 1) 
		{
			return;
		}
        var style = this.get("marker"),
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
            offsetHeight = h/2;
            this._createMarkerCache();
        for(; i < len; ++i)
        {
            top = (ycoords[i] - offsetWidth) + "px";
            left = (xcoords[i] - offsetHeight) + "px";
            marker = this.getMarker.apply(this, [{index:i, styles:style}]);
            mnode = marker.get("boundingBox");
            mnode.setStyle("position", "absolute"); 
            mnode.setStyle("top", top);
            mnode.setStyle("left", left);
        }
        this._clearMarkerCache();
 	},

	_getPlotDefaults: function()
    {
        return {
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
            width: 6,
            height: 6,
            shape: "circle",

            padding:{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }
        };
    },

    _markerEventHandler: function(e)
    {
        var type = e.type,
            marker = Y.Widget.getByNode(e.currentTarget),
            w,
            h,
            xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            i = marker.get("index") || Y.Array.indexOf(this.get("markers"), marker),
            bb = marker.get("boundingBox");
            switch(type)
            {
                case "mouseout" :
                    marker.set("state", "off");
                break;
                case "mouseover" :
                    marker.set("state", "over");
                break;
                case "mouseup" :
                    marker.set("state", "over");
                break;
                case "mousedown" :
                    marker.set("state", "down");
                break;
            }
            w = marker.get("width");
            h = marker.get("height");
            bb.setStyle("left", (xcoords[i] - w/2) + "px");
            bb.setStyle("top", (ycoords[i] - h/2) + "px");    
    }
};

Y.augment(Plots, Y.Attribute);
Y.Plots = Plots;
