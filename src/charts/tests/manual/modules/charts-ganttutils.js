YUI.add('charts-ganttutils', function (Y, NAME) {
/**
 * Provides functionality for adding a custom background, indicator line and start/end labels for a 
 * Gantt Chart.
 *
 * @module charts-ganttutils
 */
        /**
         * @class GanttUtils
         * @constructor
         * @param {Y.Chart} chart Reference to the chart instance.
         */ 
        Y.GanttUtils = function(chart) {
            this.chart = chart;
        };
        Y.GanttUtils.prototype = {
            /**
             * Adds start and end labels for each series item in the Gantt chart. Returns an object literal containing 
             * an array of labels for its start and end key.
             *
             * @method addItemLabels
             * @param {Y.GanttSeries} series Reference to the GanttSeries instance
             * @param {String} className The class name to be used for the labels so that they can be styled with css
             * @param {Number} spacing The distance, in pixels, to add between the series marker and each label
             * @return Object
             */
            addItemLabels: function(series, className, spacing) {
                var markers = series.get("markers"),
                    graphic = series.get("graphic"),
                    graphicNode = graphic.get("node"),
                    ganttkeys = series.get("ganttkeys"),
                    seriesData = series.get("xData"),
                    startValues = seriesData[ganttkeys.start],
                    endValues = seriesData[ganttkeys.end],
                    marker,
                    x,
                    y,
                    width = graphic.get("width"),
                    markerWidth,
                    markerHeight = series.get("styles").marker.height,
                    startLabel,
                    endLabel,
                    startLabelWidth,
                    endLabelWidth,
                    startLabelLeft,
                    endLabelLeft,
                    startLabels = [],
                    endLabels = [],
                    i,
                    len = markers.length;
                spacing = spacing || 0;
                for(i = 0; i < len; i = i +1) {
                    marker = markers[i];
                    x = marker.get("x");
                    y = marker.get("y");
                    markerWidth = marker.get("width");
                    startLabel = Y.Node.create('<span style="position: absolute;" class="' + Y.Escape.html(className) + '">' + Y.Escape.html(startValues[i]) + '</span>');
                    endLabel = Y.Node.create('<span style="position: absolute;" class="' + Y.Escape.html(className) + '">' + Y.Escape.html(endValues[i]) + '</span>');
                    startLabel.appendTo(graphicNode);
                    endLabel.appendTo(graphicNode);
                    startLabelWidth = parseFloat(startLabel.getComputedStyle("width"));
                    endLabelWidth = parseFloat(endLabel.getComputedStyle("width"));
                    startLabelLeft = x - spacing - startLabelWidth;
                    endLabelLeft = x + spacing + markerWidth;
                    startLabel.setStyle("left", startLabelLeft + "px");
                    startLabel.setStyle("top", (y + markerHeight/2 - (parseFloat(startLabel.getComputedStyle("height"))/2))); 
                    endLabel.setStyle("left", endLabelLeft + "px");
                    endLabel.setStyle("top", (y + markerHeight/2 - (parseFloat(endLabel.getComputedStyle("height"))/2))); 
                    startLabels.push(startLabel);
                    endLabels.push(endLabel);
                    if(startLabelLeft < 0) {
                        startLabel.setStyle("visibility", "hidden");
                    }
                    if(Math.floor(endLabelLeft + endLabelWidth) > width) {
                        endLabel.setStyle("visibility", "hidden");
                    }
                }
                return {
                    start: startLabels,
                    end: endLabels
                };
            },
            
            /**
             * Draws an alternating color background on the chart. Returns an array containing a
             * reference to each Y.Path instance used to draw the colors.
             *
             * @method addBackgroundGrid
             * @param {Object} fill1 Object literal containing data about the fill. (color, alpha)
             * @param {Object} fill2 Object literal containing data about the fill. (color, alpha)
             * @return Array 
             */
            addBackgroundGrid: function(fill1, fill2) {
                var chart = this.chart,
                    background = chart.get("graph").get("background").get("graphic"),
                    grids = [
                        background.addShape({
                            type: "path",
                            stroke: {
                                weight: 0   
                            },
                            fill: fill1
                        }),
                        background.addShape({
                            type: "path",
                            stroke: {
                                weight: 0   
                            },
                            fill: fill2 
                        })
                    ],
                    stripe,
                    i,
                    y = 0,
                    yAxis = chart.getAxisByKey("category"),
                    majorUnits = yAxis.getTotalMajorUnits(),
                    width = background.get("width"),
                    height = background.get("height"),
                    distance = height / majorUnits;
                for(i = 0; i < majorUnits; i = i + 1) {
                    stripe = grids[i % 2];
                    stripe.moveTo(0, y).lineTo(width, y);
                    y = y + distance;
                    stripe.lineTo(width, y).lineTo(0, y).lineTo(0, y - distance).closePath();
                }
                grids[0].end();
                grids[1].end();
                return grids;
            },

            /**
             * Draws a line along the category axis positioned based on a numeric value.
             * Returns a reference to the Y.Path instance representing the line.
             *
             * @method addIndicatorLine
             * @param {Y.Axis} axis Reference to the numeric axis.
             * @param {Number} value Number used to determine the position of the line.
             * @param {Object} stroke Object literal containing the color and weight of the line.
             * @return Y.Path
             */
            addIndicatorLine: function(axis, value, stroke) {
                var chart = this.chart,
                    direction = chart.get("direction"),
                    graphic = chart.get("graph").get("graphic"),
                    min = axis.get("minimum"),
                    max = axis.get("maximum"),
                    range = max - min,
                    width = graphic.get("width"),
                    height = graphic.get("height"),
                    x1,
                    x2,
                    y1,
                    y2,
                    path = graphic.addShape({
                        type: "path",
                        stroke: stroke 
                    });
                value = value - min;
                if(direction === "vertical") {
                    x1 = x2 = value/range * width;
                    y1 = 0;
                    y2 = height;
                } else {
                    x1 = 0;
                    x2 = width;
                    y1 = y2 = value/range * height;
                }
                path.clear()
                .moveTo(x1, y1)
                .lineTo(x2, y2)
                .end();
                graphic._redraw();
                return path;
            }
        };
}, '@VERSION@', {"requires": ['escape', "charts"]});
