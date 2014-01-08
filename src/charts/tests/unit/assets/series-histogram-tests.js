YUI.add('series-histogram-tests', function(Y) {
    var DOC = Y.config.doc,
        MockSeries = function() {
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
            Y.Event.purgeElement(DOC, false);
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
            direction,
            width,
            height
        ) {
            var markers = [],
                style,
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
            markerCacheCreated = true;
            
            maxSize = graphic.get(setSizeKey);
            if(seriesTypeCollection && seriesLen > 1)
            {
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
                if(totalSize > maxSize)
                {
                    ratio = graphic.get(setSizeKey)/totalSize;
                    seriesSize *= ratio;
                    offset *= ratio;
                    setSize *= ratio;
                    setSize = Math.max(setSize, 1);
                    maxSize = setSize;
                }
            }
            else
            {
                seriesSize = style[setSizeKey];
                totalSize = len * seriesSize;
                if(totalSize  > maxSize)
                {
                    seriesSize = maxSize/len;
                    maxSize = seriesSize;
                }
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
                if(direction === "vertical") {
                    config.calculatedSize = xcoords[i];
                } else {
                    config.calculatedSize = height - ycoords[i];
                }
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
                            fillColor: style.fill.color,
                            borderColor: style.border.color, 
                            graphOrder: graphOrder, 
                            i: i
                        };
                        markers.push(marker);
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
                setSize: setSize,
                calculatedSize: calculatedSize,
                groupMarker: groupMarker,
                markerCacheCleared: markerCacheCleared,
                markerCacheCreated: markerCacheCreated,
                xMarkerPlane: xMarkerPlane,
                yMarkerPlane: yMarkerPlane
            };
        },

        "test: drawSeries()" : function() {
            var width = 400,
                height = 400,
                test = this,
                HistogramMockGraphic = Y.Base.create("histogramMockGraphic", Y.Base, [], {
                }, {
                    ATTRS: {
                        width: {
                            valueFn: function() {
                                return width;
                            }
                        },
                        height: {
                            valueFn: function() {
                                return height;
                            }
                        }
                    }
                }),
                HistogramDrawSeriesMock = Y.Base.create("histogramDrawSeriesMock", Y.CartesianSeries, [Y.Histogram], {
                    _leftOrigin: 0,

                    _bottomOrigin: height, 

                    _getMarkerDimensions: function(x, y, size, offset) {
                        return {
                            top: y,
                            left: x,
                            width: size,
                            height: size,  
                            offset: offset,
                            calculatedSize: size 
                        };
                    },
                   
                    getMarker: function(style, graphOrder, i) {
                        var marker =  {
                            fillColor: style.fill.color,
                            borderColor: style.border.color,
                            graphOrder: graphOrder,
                            i: i
                        };
                        this._markers.push(marker);
                        return marker;    
                    },

                    _createMarkerCache: function() {
                        this._markerCacheCreated = true;
                        this._markers = [];
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
                        },
                        graphic: {
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
                    seriesTypeCollection: seriesTypeCollection,
                    order: 0,
                    styles: {
                        marker: {
                            border: {
                                color: "#f00"   
                            },
                            fill: {
                                color: "#00f"
                            }
                        }
                    }
                }),
                series2 = new HistogramDrawSeriesMock({
                    width: width,
                    height: height,
                    graphic: graphic,
                    seriesTypeCollection: seriesTypeCollection,
                    order: 1,
                    styles: {
                        marker: {
                            border: {
                                color: ["#f00", "#00f"]   
                            },
                            fill: {
                                color: ["#00f", "#f00"]
                            }
                        }
                    }
                }),
                testDrawSeries = function(series) {
                    var i,
                        len,
                        fillColor,
                        strokeColor,
                        testMarker,
                        marker,
                        testData = test.getDrawSeriesData(
                        series.get("xcoords"),
                        series.get("ycoords"),
                        series.get("styles").marker,
                        series.get("graphic"),
                        seriesTypeCollection,
                        series.get("groupMarkers"),
                        series.get("order"),
                        series.get("graphOrder"),
                        series.get("direction"),
                        width,
                        height
                    );
                    //test _maxSize
                    Y.Assert.areEqual(
                        testData.maxSize, series._maxSize,
                        "The _maxSize of the series should be " + testData.maxSize + "."
                    );
                    //test markers
                    len = testData.markers.length;
                    Y.Assert.areEqual(
                        len,
                        series._markers.length,
                        "There should be " + len + " markers."
                    );
                    for(i = 0; i < len; i = i + 1) {
                        testMarker = testData.markers[i];
                        marker = series._markers[i];  
                        if(testMarker) {
                            Y.Assert.isNotNull(marker, "There should be a marker.");
                            fillColor = testMarker.fillColor;
                            strokeColor = testMarker.borderColor;
                            Y.Assert.areEqual(fillColor, marker.fillColor, "The marker's fill color should be " + fillColor + ".");   
                            Y.Assert.areEqual(strokeColor, marker.borderColor, "The marker's border color should be " + strokeColor + ".");   
                        }
                    }
                };
                seriesTypeCollection.push(series1);
                series1._markers = [];
                series.drawSeries.apply(series1);
                series1.set("xcoords", [20, 60, 100, 140, 180, 220, 260, 300, 340, 380]);
                series1.set("ycoords", [280, 80, 310, 270, 300, 400, 240, 160, 220, 40]);
                series.drawSeries.apply(series1);
                testDrawSeries(series1); 
                series1.set("styles", {
                   marker: {
                        width: 50   
                   }
                });
                series.drawSeries.apply(series1);
                testDrawSeries(series1); 
                series1.set("styles", {
                   marker: {
                        width: 12   
                   }
                });
                series1.set("direction", "vertical");
                series.drawSeries.apply(series1);
                testDrawSeries(series1); 
                seriesTypeCollection.push(series2); 
                series2._markers = [];
                series1.set("direction", "horizontal");
                series.drawSeries.apply(series1);
                testDrawSeries(series1); 
                series2.set("xcoords", [20, 60, 100, 140, 180, 220, 260, 300, 340, 380]);
                series2.set("ycoords", [280, 80, 310, 270, 300, 210, 240, 160, 220, 40]);
                series.drawSeries.apply(series2);
                testDrawSeries(series2);
                series1.set("styles", {
                   marker: {
                        width: 30   
                   }
                });
                series.drawSeries.apply(series1);
                testDrawSeries(series1); 
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
