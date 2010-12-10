/**
 * The ColumnSeries class renders columns positioned horizontally along a category or time axis. The columns'
 * lengths are proportional to the values they represent along a vertical axis.
 * and the relevant data points.
 *
 * @class ColumnSeries
 * @extends MarkerSeries
 * @uses Histogram
 * @constructor
 */
Y.ColumnSeries = Y.Base.create("columnSeries", Y.MarkerSeries, [Y.Histogram], {
    /**
     * @private
     */
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
     * @protected
     *
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
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
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default column
         */
        type: {
            value: "column"
        }
    }
});
