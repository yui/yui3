YUI.add('series-gantt', function (Y, NAME) {

/**
 * Provides functionality for creating a gantt series.
 *
 * @module charts
 * @submodule series-gantt
 */
var DOCUMENT = Y.config.doc;
/**
 * An abstract class for creating gantt series instances.
 *
 * @class GanttSeries
 * @extends CartesianSeries
 * @constructor
 * @param {Object} config (optional) Configuration parameters.
 * @submodule series-gantt
 */
Y.GanttSeries = Y.Base.create("ganttSeries", Y.CartesianSeries, [Y.Plots, Y.ChartsLabelCache], {
    /**
     * Draws the series.
     *
     * @method drawSeries
     * @protected
     */
    drawSeries: function()
    {
        var xcoords = this.get("xcoords"),
            ycoords = this.get("ycoords"),
            styles = this._copyObject(this.get("styles")),
            markerStyles = styles.marker,
            markerHeight = markerStyles.height,
            len = ycoords.length,
            keys = this.get("ganttkeys"),
            startcoords = xcoords[keys.start],
            endcoords = xcoords[keys.end],
            xData,
            startValues,
            fillColors,
            borderColors,
            graphOrder = this.get("graphOrder"),
            i,
            showLabels = this.get("showLabels"),
            markerX,
            markerY,
            markerWidth,
            leftEdge,
            graphic = this.get("graphic"),
            labelParent = graphic.get("node"),
            labelFunction;
        if(showLabels)
        {
            xData = this._copyData(this.get("xData"));
            startValues = xData[keys.start];
            endValues = xData[keys.end];
            leftEdge = graphic.get("width");
            labelFunction = this.get("labelFunction");
        }
        if(Y.Lang.isArray(markerStyles.fill.color))
        {
            fillColors = markerStyles.fill.color;
        }
        if(Y.Lang.isArray(markerStyles.border.color))
        {
            borderColors = markerStyles.border.color;
        }
        this._createMarkerCache();
        this._createLabelCache();
        for(i = 0; i < len; i = i + 1)
        {
            if(isNaN(ycoords[i]) || isNaN(startcoords[i]) || isNaN(endcoords[i]))
            {
                this._markers.push(null);
            }
            else
            {
                markerStyles.x = markerX = startcoords[i];
                markerStyles.y = markerY = ycoords[i] - markerHeight/2;
                markerStyles.width = markerWidth = endcoords[i] - markerStyles.x;
                if(fillColors)
                {
                    markerStyles.fill.color = fillColors[i % fillColors.length];
                }
                if(borderColors)
                {
                    markerStyles.border.color = borderColors[i % borderColors.length];
                }
                marker = this.getMarker(markerStyles, graphOrder, i);
                if(showLabels)
                {
                    labelFunction.apply(this,
                        [labelParent, startValues[i], endValues[i], markerX, ycoords[i], markerX + markerWidth, ycoords[i], leftEdge, styles]
                    );
                }
            }
        }
        this._clearMarkerCache();
        this._clearLabelCache();
    },

    /**
     * Resizes and positions markers based on a mouse interaction.
     *
     * @method updateMarkerState
     * @param {String} type state of the marker
     * @param {Number} i index of the marker
     * @protected
     */
    updateMarkerState: function(type, i) {
        if(this._markers && this._markers[i])
        {
            var styles = this._copyObject(this.get("styles").marker),
                state = this._getState(type),
                marker = this._markers[i],
                markerStyles = state === "off" || !styles[state] ? styles : styles[state];
                markerStyles.fill.color = this._getItemColor(markerStyles.fill.color, i);
                markerStyles.border.color = this._getItemColor(markerStyles.border.color, i);
                markerStyles.y = marker.get("y");
                markerStyles.x = marker.get("x");
                markerStyles.width = marker.get("width");
                markerStyles.stroke = markerStyles.border;
                marker.set(markerStyles);
                marker.set("visible", this.get("visible"));
        }
    },

    /**
     * Applies css to a label.
     *
     * @method _applyLabelStyles
     * @param {Node} label The label to apply the styles to.
     * @param {Object} styles Object literal containing styles.
     * @private
     */
    _applyLabelStyles: function(label, styles)
    {
        var style;
        for(style in styles)
        {
            if(styles.hasOwnProperty(style))
            {
                if(style !== "gutter")
                {
                    label.setStyle(style, styles[style]);
                }
            }
        }
    },

    /**
     * Creates and positions start and end labels for a marker.
     *
     * @method _defaultLabelFunction
     * @param {HTML} parentNode The dom element in which to attach the labels.
     * @param {String} startValue The text that goes into the start label.
     * @param {String} endValue The text that goes into the end label.
     * @param {Number} startX The x-coordinate for the start label.
     * @param {Number} startY The y-coordinate for the start label.
     * @param {Number} endX The x-coordinate for the end label.
     * @param {Number} endY The y-coordinate for the end label.
     * @param {Object} styles Reference to the styles attribute.
     * @param {String} className Optional class to attach to labels.
     * @private
     */
    _defaultLabelFunction: function(parentNode, startValue, endValue, startX, startY, endX, endY, width, styles, className)
    {
        var startLabel = Y.one(this._getLabel(parentNode, className)),
            endLabel = Y.one(this._getLabel(parentNode, className)),
            startWidth,
            endWidth,
            startstyles = styles.startlabel,
            endstyles = styles.endlabel,
            startgutter = startstyles.gutter || 0,
            endgutter = endstyles.gutter || 0,
            startvisibility,
            endvisibility;
        this._applyLabelStyles(startLabel, startstyles);
        this._applyLabelStyles(endLabel, endstyles);
        startLabel.appendChild(DOCUMENT.createTextNode(startValue));
        endLabel.appendChild(DOCUMENT.createTextNode(endValue));
        startWidth = parseFloat(startLabel.get("offsetWidth"));
        endWidth = parseFloat(endLabel.get("offsetWidth"));
        startX = startX - startWidth - startgutter;
        startY = startY - startLabel.get("offsetHeight")/2;
        endX = endX + endgutter;
        endY = endY - endLabel.get("offsetHeight")/2;
        startLabel.setStyle("left", startX + "px");
        startLabel.setStyle("top", startY + "px");
        endLabel.setStyle("left", endX + "px");
        endLabel.setStyle("top", endY + "px");
        startvisibility = startX < 0 ? "hidden" : "visible";
        endvisibility = Math.floor(endX + endWidth > width) ? "hidden" : "visible";
        startLabel.setStyle("visibility", startvisibility);
        endLabel.setStyle("visibility", endvisibility);
        this._labels.push(startLabel.getDOMNode());
        this._labels.push(endLabel.getDOMNode());
    },


    /**
     * Gets the default value for the `styles` attribute.
     *
     * @method _getDefaultStyles
     * @return Object
     * @private
     */
    _getDefaultStyles: function()
    {
        var styles = {
                startlabel: {
                    gutter: 2,
                    color:"#808080",
                    fontSize:"75%"
                },
                endlabel: {
                    gutter: 2,
                    color:"#808080",
                    fontSize:"75%"
                },
                marker: this._getPlotDefaults()
            };
        return this._mergeStyles(styles, Y.GanttSeries.superclass._getDefaultStyles());
    },

    /**
     * Gets the default style values for the markers.
     *
     * @method _getPlotDefaults
     * @return Object
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
}, {
    ATTRS: {
        /**
         * Read-only attribute indicating the type of series.
         *
         * @attribute type
         * @type String
         * @default gantt
         */
        type: {
            value: "gantt"
        },

        /**
         * Values to be used for start and end keys.
         *
         * @attribute gantkeys
         * @type Object
         */
        ganttkeys: {
            valueFn: function() {
                return {
                    start: "start",
                    end: "end"
                };
            }
        },

        /**
         * Indicates whether or not to display start and end labels.
         *
         * @attribute showLabels
         * @type Boolean
         */
        showLabels: {
            value: true
        },

        /**
         * Method used to position start and end labels.
         *
         * @attribute labelFunction
         * @type Function
         */
        labelFunction: {
            valueFn: function() {
                return this._defaultLabelFunction;
            }
        }
    }
});


}, '@VERSION@', {"requires": ["series-cartesian", "series-plot-util", "charts-labelcache"]});
