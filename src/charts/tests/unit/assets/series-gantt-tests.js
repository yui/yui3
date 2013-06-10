YUI.add('series-gantt-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: GanttSeries"),
        seriesTest,
        MockMarker = function() {};
    MockMarker.prototype = {
        set: function(param1, param2) {
            if(param1 === "visible") {
                this._visible = param2;
            } else {
                this._markerStyles = param1;   
            }
        },
        get: function(val) {
            return val;
        }
    };
    seriesTest = new Y.Test.Case({
            setUp: function() {
                this.series = new Y.GanttSeries();
            },

            tearDown: function() {
                this.series = null;
            },
            
            "test: drawSeries()" : function() {
                var startcoords = [0.25, 15, 15, 15, 15, 15, 135.5, 136.8, 141.25, 142.75, 130,5],
                    endcoords = [15, 130, 135.3, 136.5, 141, 142.75, 244, 261.7, 272.75, 282, 612.5],
                    ycoords = [15.1, 45.27, 75.45, 105.64, 135.82, 166, 196.18, NaN, 256.55, 286.73, 316.91],
                    DrawSeriesMock = Y.Base.create("drawSeriesMock", Y.GanttSeries, [], {
                        prepMock: function() {
                            this._markerStyles = [];
                        },
                        _createMarkerCache: function() {
                            //only need to check and see if the method has been called. 
                            this._markers = [];
                            this._markerCacheCreated = true;
                        },
                        _clearMarkerCache: function() {
                            //only need to check and see if the method has been called. 
                            this._markerCacheCleared = true;
                        },
                        getMarker: function(markerStyles, graphOrder, i) {
                            this._markerStyles[i] = {
                                x: markerStyles.x,
                                y: markerStyles.y,
                                fill: {
                                    color: markerStyles.fill.color,
                                    alpha: markerStyles.fill.alpha
                                },
                                border: {
                                    color: markerStyles.border.color,
                                    alpha: markerStyles.border.alpha,
                                    weight: markerStyles.border.weight
                                }
                            };
                        }
                    }, {
                        ATTRS: {
                           xcoords: {
                               valueFn: function() {
                                    return {
                                        start: startcoords,
                                        end: endcoords
                                    };
                               }
                            },
                            ycoords: {
                                valueFn: function() {
                                    return ycoords;
                                }
                            }
                        }
                    }),
                    seriesMarkerStyles,
                    mockSeries = new DrawSeriesMock(),
                    series = this.series,
                    getMarkerY = function(y, ht) {
                        return y - ht/2;
                    },
                    testStyles = function() {
                        var mockMarkerStyles,
                            fillColor,
                            borderColor,
                            fillColors,
                            borderColors,
                            mockFillColor,
                            mockBorderColor,
                            mockFillColors,
                            mockBorderColors,
                            i,
                            markerX,
                            markerY;
                        for(i = 0; i < ycoords.length; i = i + 1) {
                            if(Y.Lang.isNumber(ycoords[i]) && Y.Lang.isNumber(startcoords[i])) {
                                mockMarkerStyles = mockSeries._markerStyles[i];
                                fillColor= seriesMarkerStyles.fill.color;
                                borderColor = seriesMarkerStyles.border.color;
                                fillColors = Y.Lang.isArray(fillColor) ? fillColor : null;
                                borderColors = Y.Lang.isArray(borderColor) ? borderColor : null;
                                mockFillColor = mockMarkerStyles.fill.color;
                                mockBorderColor = mockMarkerStyles.border.color;
                                mockFillColors = Y.Lang.isArray(mockFillColor) ? mockFillColor : null;
                                mockBorderColors = Y.Lang.isArray(mockBorderColor) ? mockBorderColor : null;
                                markerX = startcoords[i];
                                markerY = getMarkerY(ycoords[i], markerHeight);
                                if(fillColors) {
                                    fillColor = fillColors[i % fillColors.length];
                                }
                                if(borderColors) {
                                    borderColor = borderColors[i % fillColors.length];
                                }   
                                if(mockBorderColors) {
                                    mockBorderColor = mockBorderColors[i];
                                }
                                if(mockFillColors) {
                                    mockFillColor = mockFillColors[i];
                                }
                                Y.Assert.areEqual(markerX, mockMarkerStyles.x, "The x coordinate of the marker at index " + i + " should be " + markerX + ".");   
                                Y.Assert.areEqual(markerY, mockMarkerStyles.y, "The y coordinate of the marker at index " + i + " should be " + markerY + ".");   
                                Y.Assert.areEqual(fillColor, mockFillColor, "The fill color of the marker should be " + fillColor + ".");
                                Y.Assert.areEqual(
                                    borderColor,
                                    mockBorderColor,
                                    "The border color of the marker should be " + borderColor + "."
                                );
                            }
                        }
                    };
                mockSeries.prepMock();
                series.drawSeries.apply(mockSeries);
                seriesMarkerStyles = mockSeries.get("styles").marker,
                markerHeight = seriesMarkerStyles.height;
                Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
                Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");  
                testStyles();
                mockSeries.prepMock();
                mockSeries.set("styles", {
                    marker: {
                        fill: {
                            color: ["#9aa", "#eee", "#f80"]
                        },
                        border: {
                            color: ["#f99", "#dcd", "#cf0"]
                        }
                    }
                });
                seriesMarkerStyles = mockSeries.get("styles");
                series.drawSeries.apply(mockSeries);
                seriesMarkerStyles = mockSeries.get("styles").marker,
                markerHeight = seriesMarkerStyles.height;
                testStyles();
            },
            
            "test: updateMarkerState()" : function() {
                var series = this.series,
                    fillColor = "#f00";
                    borderColor = "#00f";
                    overFillColor = "#fff";
                    overBorderColor = "#000";
                    downFillColor = "#9aa";
                    downBorderColor = "#eee";
                    UpdateMarkerSeries = Y.Base.create("updateMarkerSeries", Y.GanttSeries, [], {
                        _getPlotDefaults: function() {
                            return {
                                fill: {
                                    color: fillColor
                                },
                                border: {
                                    color: borderColor
                                },
                                over: {
                                    fill: {
                                        color: overFillColor
                                    },
                                    border: {
                                        color: overBorderColor
                                    }
                                },
                                down: {
                                    fill: {
                                        color: downFillColor
                                    },
                                    border: {
                                        color: downBorderColor
                                    }
                                }
                            }
                        }
                    }),
                    mockSeries = new UpdateMarkerSeries();
                    mockMarker = new MockMarker();

                mockSeries._markers = [mockMarker];
                series.updateMarkerState.apply(mockSeries, ["off", 0]);
                Y.Assert.areEqual(fillColor, mockMarker._markerStyles.fill.color, "The fill color should be " + fillColor + ".");
                Y.Assert.areEqual(borderColor, mockMarker._markerStyles.border.color, "The border color should be " + borderColor + ".");  
                series.updateMarkerState.apply(mockSeries, ["over", 0]);
                Y.Assert.areEqual(overFillColor, mockMarker._markerStyles.over.fill.color, "The over fill color should be " + overFillColor + ".");
                Y.Assert.areEqual(overBorderColor, mockMarker._markerStyles.over.border.color, "The over border color should be " + overBorderColor + ".");  
                series.updateMarkerState.apply(mockSeries, ["down", 0]);
                Y.Assert.areEqual(downFillColor, mockMarker._markerStyles.down.fill.color, "The down fill color should be " + downFillColor + ".");
                Y.Assert.areEqual(downBorderColor, mockMarker._markerStyles.down.border.color, "The down border color should be " + downBorderColor + ".");  
                //hit the else branch.
                series.updateMarkerState.apply(mockSeries, ["down", 5]);
            },

            "test: _getPlotDefaults()" : function() {
                var MockSeries = Y.Base.create("mockSeries", Y.GanttSeries, [], {
                        _getDefaultColor: function(order, type) {
                            if(type === "border") {
                                return "#00f";
                            } else {
                                return "#f00";
                            }
                        }
                    }),
                    series = this.series,
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
                Y.Assert.areEqual(testHeight, plotDefaults.height, "The height should be " + testHeight + ".");
                Y.Assert.areEqual(testShape, plotDefaults.shape, "The shape should be " + testShape + ".");
                Y.Assert.areEqual(0, plotDefaults.padding.left, "The left padding should be zero.");
                Y.Assert.areEqual(0, plotDefaults.padding.top, "The top padding should be zero.");
                Y.Assert.areEqual(0, plotDefaults.padding.right, "The right padding should be zero.");
                Y.Assert.areEqual(0, plotDefaults.padding.bottom, "The bottom padding should be zero.");
            },
            
            "test: get('type')" : function() {
                Y.Assert.isInstanceOf(Y.GanttSeries, this.series, "The series should be and instanceof GanttSeries.");
                Y.Assert.areEqual("gantt", this.series.get("type"), "The series type attribute should be gantt.");
            },

            "test: get('ganttkeys')" : function() {
                var myGantt = new Y.GanttSeries(),
                    ganttkeys = myGantt.get("ganttkeys"),
                    newKeys = {
                        start: "startTime",
                        end: "endTime"   
                    };
                Y.Assert.areEqual("start", ganttkeys.start, "The start gantt key should be start.");
                Y.Assert.areEqual("end", ganttkeys.end, "The end gantt key should be end.");
                myGantt.set("ganttkeys", newKeys);
                ganttkeys = myGantt.get("ganttkeys");
                Y.Assert.areEqual(newKeys.start, ganttkeys.start, "The start gantt key should be " + newKeys.start + ".");
                Y.Assert.areEqual(newKeys.end, ganttkeys.end, "The end gantt key should be " + newKeys.end + ".");
            }
        });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-gantt']});
