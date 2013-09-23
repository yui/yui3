YUI.add('series-histogram-tests', function(Y) {
    var MockSeries = function() {
            MockSeries.superclass.constructor.apply(this, arguments);
        },
        suite = new Y.Test.Suite("Charts: Histogram");
    Y.extend(MockSeries, Y.Histogram, {
        _getDefaultColor: function(order, type) {
            if(type === "border") {
                return "#00f";
            } else {
                return "#f00";
            }
        },
        get: function() {
           return 0;
        }
    });
    Y.HistogramTest = function() {
        Y.HistogramTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.HistogramTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.Histogram();
        },

        tearDown: function() {
            this.series = null;
        },
       
        getDrawSeriesData: function(
            xcoords,
            ycoords,
            style,
            graphic,
            seriesTypeCollection,
            groupMarkers,
            order,
            graphOrder,
            direction
        ) {
            var markers = [],
                setSize,
                calculatedSize,
                i = 0,
                len = xcoords.length,
                top = ycoords[0],
                seriesLen = seriesTypeCollection.length || 0,
                seriesSize = 0,
                totalSize = 0,
                offset = 0,
                ratio,
                renderer,
                left,
                marker,
                setSizeKey,
                calculatedSizeKey,
                config,
                fillColors = null,
                borderColors = null,
                xMarkerPlane = [],
                yMarkerPlane = [],
                xMarkerPlaneLeft,
                xMarkerPlaneRight,
                yMarkerPlaneTop,
                yMarkerPlaneBottom,
                dimensions = {
                    width: [],
                    height: []
                },
                xvalues = [],
                yvalues = [],
                maxSize,
                groupMarker = null,
                markerCacheCleared = false,
                markerCacheCreated = false;
            if(Y.Lang.isArray(style.fill.color))
            {
                fillColors = style.fill.color.concat();
            }
            if(Y.Lang.isArray(style.border.color))
            {
                borderColors = style.border.color.concat();
            }
            if(direction === "vertical")
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
            for(; i < seriesLen; ++i)
            {
                renderer = seriesTypeCollection[i];
                seriesSize += renderer.get("styles").marker[setSizeKey];
                if(order > i)
                {
                    offset = seriesSize;
                }
            }
            totalSize = len * seriesSize;
            maxSize = graphic.get(setSizeKey);
            if(totalSize > maxSize)
            {
                ratio = graphic.get(setSizeKey)/totalSize;
                seriesSize *= ratio;
                offset *= ratio;
                setSize *= ratio;
                setSize = Math.max(setSize, 1);
                maxSize = setSize;
            }
            offset -= seriesSize/2;
            for(i = 0; i < len; ++i)
            {
                xMarkerPlaneLeft = xcoords[i] - seriesSize/2;
                xMarkerPlaneRight = xMarkerPlaneLeft + seriesSize;
                yMarkerPlaneTop = ycoords[i] - seriesSize/2;
                yMarkerPlaneBottom = yMarkerPlaneTop + seriesSize;
                xMarkerPlane.push({start: xMarkerPlaneLeft, end: xMarkerPlaneRight});
                yMarkerPlane.push({start: yMarkerPlaneTop, end: yMarkerPlaneBottom});
                if(isNaN(xcoords[i]) || isNaN(ycoords[i]))
                {
                    markers.push(null);
                    continue;
                }
                config = {
                    left: xcoords[i],
                    top: ycoords[i]
                };
                if(!isNaN(config.calculatedSize) && config.calculatedSize > 0)
                {
                    top = config.top;
                    left = config.left;

                    if(groupMarkers)
                    {
                        dimensions[setSizeKey][i] = setSize;
                        dimensions[calculatedSizeKey][i] = config.calculatedSize;
                        xvalues.push(left);
                        yvalues.push(top);
                    }
                    else
                    {
                        style[setSizeKey] = setSize;
                        style[calculatedSizeKey] = config.calculatedSize;
                        style.x = left;
                        style.y = top;
                        if(fillColors)
                        {
                            style.fill.color = fillColors[i % fillColors.length];
                        }
                        if(borderColors)
                        {
                            style.border.color = borderColors[i % borderColors.length];
                        }
                        marker = {
                            style: style, 
                            graphOrder: graphOrder, 
                            i: i
                        };
                    }

                }
                else if(!groupMarkers)
                {
                    markers.push(null);
                }

            }
            if(groupMarkers)
            {
                groupMarker = {
                    fill: style.fill,
                    border: style.border,
                    dimensions: dimensions,
                    xvalues: xvalues,
                    yvalues: yvalues,
                    shape: style.shape
                };
            }
            else
            {
                markerCacheCleared = true;
            }
            return {
                maxSize: maxSize,
                markers: markers,
                fillColors: fillColors,
                borderColors: borderColors,
                setSize: setSize,
                calculatedSize: calculatedSize,
                groupMarker: groupMarker,
                markerCacheCleared: markerCacheCleared,
                markerCacheCreated: markerCacheCreated,
                xMarkerPlane: xMarkerPlane,
                yMarkerPlane: yMarkerPlane
            }
        },

        "test: _drawSeries()" : function() {
            var width = 400,
                height = 400,
                HistogramMockGraphic = Y.Base.create("histogramMockGraphic", Y.Base, [], {}, {
                }, {
                    ATTRS: {
                        width: {
                            value: 0
                        },
                        height: {
                            value: 0
                        }
                    }
                }),
                HistogramDrawSeriesMock = Y.Base.create("histogramDrawSeriesMock", Y.CartesianSeries, [Y.Histogram], {
                    _leftOrigin: 0,

                    _bottomOrigin: height, 

                    _getMarkerDimensions: function(x, y, size, offset) {
                        return {
                            top: y,
                            left: x   
                        };
                    },
                    
                    _createMarkerCache: function() {
                        this._markerCacheCreated = true;
                    },

                    _clearMarkerCache: function() {
                        this._markerCacheCleared = true;
                    },

                    _createGroupMarker: function(val) {
                        this._groupMarker = val;
                    },

                    _getDefaultStyles: function() {
                        var styles = {};
                        styles.marker = this._getPlotDefaults();
                        return styles;        
                    }
                }, {
                    ATTRS: {
                        xcoords: {
                            valueFn: function() {
                                return [];
                            }
                        },
                        ycoords: {
                            valueFn: function() {
                                return [];
                            }
                        }
                    }
                }),
                series = this.series,
                seriesTypeCollection = [],
                graphic = new HistogramMockGraphic({
                    width: width,
                    height: height
                }),
                series1 = new HistogramDrawSeriesMock({
                    width: width,
                    height: height,
                    graphic: graphic,
                    seriesTypeCollection: seriesTypeCollection 
                }),
                series2 = new HistogramDrawSeriesMock({
                    width: width,
                    height: height,
                    graphic: graphic,
                    seriesTypeCollection: seriesTypeCollection 
                });
                seriesTypeCollection.push(series1);
                seriesTypeCollection.push(series2); 
                series1._markers = [];
                series2._markers = [];
                series.drawSeries.apply(series1);
                series1.set("xcoords", [20, 60, 100, 140, 180, 220, 260, 300, 340, 380]);
                series1.set("ycoords", [280, 80, 310, 270, 300, 210, 240, 160, 220, 40]);
                series.drawSeries.apply(series1);

                series1.set("direction", "vertical");
                series.drawSeries.apply(series1);
        },

        "test: _getPlotDefaults()" : function() {
            var series = this.series,
                fillColor = "#f00",
                borderColor = "#00f",
                testFill = {
                    type: "solid",
                    alpha: 1,
                    color: fillColor
                },
                testBorder = {
                    weight: 0,
                    alpha: 1,
                    color: borderColor
                },
                testWidth = 12,
                testHeight = 12,
                testShape = "rect",
                mockSeries = new MockSeries(),
                plotDefaults = series._getPlotDefaults.apply(mockSeries),
                key;
            for(key in testFill) {
                if(testFill.hasOwnProperty(key)) {
                    Y.Assert.isTrue(plotDefaults.fill.hasOwnProperty(key), "The fill should have a " + key + " value.");
                    Y.Assert.areEqual(testFill[key], plotDefaults.fill[key], "The " + key + " value of fill should be " + testFill[key] + "."); 
                }
            }
            for(key in testBorder) {
                if(testBorder.hasOwnProperty(key)) {
                    Y.Assert.isTrue(plotDefaults.border.hasOwnProperty(key), "The border should have a " + key + " value.");
                    Y.Assert.areEqual(testBorder[key], plotDefaults.border[key], "The " + key + " value of border should be " + testBorder[key] + "."); 
                }
            }
            Y.Assert.areEqual(testWidth, plotDefaults.width, "The width should be " + testWidth + ".");
            Y.Assert.areEqual(testHeight, plotDefaults.height, "The height should be " + testHeight + ".");
            Y.Assert.areEqual(testShape, plotDefaults.shape, "The shape should be " + testShape + ".");
            Y.Assert.areEqual(0, plotDefaults.padding.left, "The left padding should be zero.");
            Y.Assert.areEqual(0, plotDefaults.padding.top, "The top padding should be zero.");
            Y.Assert.areEqual(0, plotDefaults.padding.right, "The right padding should be zero.");
            Y.Assert.areEqual(0, plotDefaults.padding.bottom, "The bottom padding should be zero.");
        }
            
    });
    
    suite.add(new Y.HistogramTest({
        name: "Histogram Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-histogram-base', 'chart-test-template']});
