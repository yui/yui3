Y.BarSeries = Y.Base.create("barSeries", Y.MarkerSeries, [Y.Histogram], {
    /**
     * @private
     */
    renderUI: function()
    {
        this._setNode();
    },

    _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset)
    {
        var config = {
            top: ycoord + offset,
            left: this._leftOrigin
        };
        config.calculatedSize = xcoord - config.left;
        return config;
    },
    
    /**
     * @private
     * Resizes and positions markers based on a mouse interaction.
     */
    updateMarkerState: function(type, i)
    {
        if(this._markers[i])
        {
            var styles = Y.clone(this.get("styles").marker),
                markerStyles,
                state = this._getState(type),
                xcoords = this.get("xcoords"),
                ycoords = this.get("ycoords"),
                marker = this._markers[i],
                graph = this.get("graph"),
                seriesCollection = graph.seriesTypes[this.get("type")],
                seriesLen = seriesCollection.length,
                seriesSize = 0,
                offset = 0,
                renderer,
                n = 0,
                ys = [],
                order = this.get("order");
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            markerStyles.width = (xcoords[i] - this._leftOrigin);
            marker.update(markerStyles);
            for(; n < seriesLen; ++n)
            {
                renderer = seriesCollection[n].get("markers")[i];
                ys[n] = ycoords[i] + seriesSize;
                seriesSize += renderer.height;
                if(order > n)
                {
                    offset = seriesSize;
                }
                offset -= seriesSize/2;
            }
            for(n = 0; n < seriesLen; ++n)
            {
                renderer = Y.one(seriesCollection[n]._graphicNodes[i]);
                renderer.setStyle("top", (ys[n] - seriesSize/2));
            }
        }
    }
}, {
    ATTRS: {
        type: {
            value: "bar"
        },
        direction: {
            value: "vertical"
        }
    }
});
