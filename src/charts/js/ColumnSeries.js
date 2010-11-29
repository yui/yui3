Y.ColumnSeries = Y.Base.create("columnSeries", Y.MarkerSeries, [Y.Histogram], {
    _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset)
    {
        var config = {
            top: ycoord,
            left: xcoord + offset
        };
        config.calculatedSize = this._bottomOrigin - config.top;
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
                xs = [],
                order = this.get("order");
            markerStyles = state == "off" || !styles[state] ? styles : styles[state]; 
            markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
            markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
            markerStyles.height = this._bottomOrigin - ycoords[i];
            marker.update(markerStyles);
            for(; n < seriesLen; ++n)
            {
                renderer = seriesCollection[n].get("markers")[i];
                xs[n] = xcoords[i] + seriesSize;
                seriesSize += renderer.width;
                if(order > n)
                {
                    offset = seriesSize;
                }
                offset -= seriesSize/2;
            }
            for(n = 0; n < seriesLen; ++n)
            {
                renderer = Y.one(seriesCollection[n]._graphicNodes[i]);
                renderer.setStyle("left", (xs[n] - seriesSize/2) + "px");
            }
        }
    }
}, {
    ATTRS: {
        type: {
            value: "column"
        }
    }
});
