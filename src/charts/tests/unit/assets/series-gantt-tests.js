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
                var startdata = [1, 59, 59, 59, 59, 59, 528, 533, 550, 556, 508],
                    enddata = [58, 507, 527, 532, 549, 556, 950, 1019, 1062, 1098,2385],
                    ydata = [0, 1, 2, 3, 4, 5, 6, null, 8, 9, 10],
                    startcoords = [0.25, 15, 15, 15, 15, 15, 135.5, 136.8, 141.25, 142.75, 130,5],
                    endcoords = [15, 130, 135.3, 136.5, 141, 142.75, 244, 261.7, 272.75, 282, 612.5],
                    ycoords = [15.1, 45.27, 75.45, 105.64, 135.82, 166, 196.18, NaN, 256.55, 286.73, 316.91],
                    MockGraphic = Y.Base.create("drawSeriesMockGraphic", Y.Base, [], {}, {
                        ATTRS: {
                            node: {
                                valueFn: function() {
                                    return {};
                                }
                            }
                        }
                    }),
                    DrawSeriesMock = Y.Base.create("drawSeriesMock", Y.GanttSeries, [], {
                        prepMock: function() {
                            this._markerStyles = [];
                        },
                        _createLabelCache: function() {
                            //only need to check and see if the method has been called. 
                            this._labels = [];
                            this._labelFunctionArgs = [];
                            this._labelCacheCreated = true;
                        },
                        _clearLabelCache: function() {
                            //only need to check and see if the method has been called. 
                            this._labelCacheCleared = true;
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
                            },
                            xData: {
                                valueFn: function() {
                                    return {
                                        start: startdata,
                                        end: enddata
                                    }
                                }
                            },
                            yData: {
                                valueFn: function() {
                                    return ydata;
                                }
                            },
                            graphic: {
                                valueFn: function() {
                                    return new MockGraphic();
                                }
                            },
                            labelFunction: {
                                value: function(parentNode, startValue, endValue, startX, startY, endX, endY, width, styles, className) {
                                    var data = {
                                        startValue: startValue,
                                        endValue: endValue, 
                                        startX: startX,
                                        startY: startY,
                                        endX: endX,
                                        endY: endY 
                                    };
                                    //account for out of sync arrays due to bad data (for test comparisons)
                                    if(!Y.Lang.isNumber(ycoords[this._labelFunctionArgs.length])) {
                                        this._labelFunctionArgs.push(null);
                                    }
                                    this._labelFunctionArgs.push(data);
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
                            markerY,
                            labelFunctionArgs;
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
                                if(mockSeries._labelFunctionArgs[i]) {
                                    Y.Assert.areEqual(startdata[i], mockSeries._labelFunctionArgs[i].startValue, "The start value should be " + startdata[i] + ".");
                                    Y.Assert.areEqual(enddata[i], mockSeries._labelFunctionArgs[i].endValue, "The end value should be " + enddata[i] + ".");
                                    Y.Assert.areEqual(startcoords[i], mockSeries._labelFunctionArgs[i].startX, "The start x-coordinate should be " + startcoords[i] + ".");
                                    Y.Assert.areEqual(ycoords[i], mockSeries._labelFunctionArgs[i].startY, "The start y-coordinate should be " + ycoords[i] + ".");
                                    Y.Assert.areEqual(endcoords[i], mockSeries._labelFunctionArgs[i].endX, "The end x-coordinate should be " + endcoords[i] + ".");
                                    Y.Assert.areEqual(ycoords[i], mockSeries._labelFunctionArgs[i].endY, "The end y-coordinate should be " + ycoords[i] + ".");
                                }
                            }
                        }
                    };
                mockSeries.prepMock();
                series.drawSeries.apply(mockSeries);
                seriesMarkerStyles = mockSeries.get("styles").marker,
                markerHeight = seriesMarkerStyles.height;
                Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
                Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");  
                Y.Assert.isTrue(mockSeries._labelCacheCreated, "The _createLabelCache method should have been called.");
                Y.Assert.isTrue(mockSeries._labelCacheCleared, "The _clearLabelCache method should have been called.");  
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
                mockSeries.prepMock();
                mockSeries.set("showLabels", false);
                //hit the else branch
                series.drawSeries.apply(mockSeries); 
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
                series.updateMarkerState.apply(mockSeries, ["mouseout", 0]);
                Y.Assert.areEqual(fillColor, mockMarker._markerStyles.fill.color, "The fill color should be " + fillColor + ".");
                Y.Assert.areEqual(borderColor, mockMarker._markerStyles.border.color, "The border color should be " + borderColor + ".");  
                series.updateMarkerState.apply(mockSeries, ["mouseover", 0]);
                Y.Assert.areEqual(overFillColor, mockMarker._markerStyles.fill.color, "The over fill color should be " + overFillColor + ".");
                Y.Assert.areEqual(overBorderColor, mockMarker._markerStyles.border.color, "The over border color should be " + overBorderColor + ".");  
                series.updateMarkerState.apply(mockSeries, ["mousedown", 0]);
                Y.Assert.areEqual(downFillColor, mockMarker._markerStyles.fill.color, "The down fill color should be " + downFillColor + ".");
                Y.Assert.areEqual(downBorderColor, mockMarker._markerStyles.border.color, "The down border color should be " + downBorderColor + ".");  
                //hit the else branch.
                series.updateMarkerState.apply(mockSeries, ["mousedown", 5]);
            },

            "test: _applyLabelStyles()" : function() {
                var series = this.series,
                    styles = {
                        gutter: 5,
                        fontSize : "85%",
                        color: "#f00"
                    },
                    label = Y.Node.create('<span>'),
                    color = Y.Color.toRGB(styles.color),
                    key;
                series._applyLabelStyles(label, styles);
                Y.Assert.areEqual(color, Y.Color.toRGB(label.getStyle("color")), "The color of the label should be " + color + ".");
                Y.Assert.areEqual(styles.fontSize, label.getStyle("fontSize"), "The fontSize of the label should be " + styles.fontSize + ".");
            },

            "test: _defaultLabelFunction()" : function() {
                var DefaultLabelFunctionMockSeries = Y.Base.create("defaultLabelFunctionMockSeries", Y.GanttSeries, [], {
                        _applyLabelStyles: function(label, styles) {
                            this._labelStyles = this._labelStyles || [];
                            this._labelStyles.push(styles);
                        }
                    }),
                    mockSeries = new DefaultLabelFunctionMockSeries(),
                    mockStartValue = "startvalue",
                    mockEndValue = "endvalue",
                    mockParentNode = Y.Node.create('<div>'),
                    mockStartX = 100,
                    mockStartY = 15,
                    mockEndX = 130,
                    mockEndY = 15,
                    mockClassName = "mockclass",
                    mockStyles = {
                        startlabel: {
                            gutter: 4
                        },
                        endlabel: {
                            gutter: 6
                        }
                    },
                    mockWidth = 400,
                    series = this.series,
                    startLabel,
                    endLabel,
                    startLabelX,
                    startLabelY,
                    endLabelX,
                    endLabelY,
                    closeEnough = function(expected, actual) { // compensates for rounding that occurs in IE 
                        return (Math.abs(expected - actual) < 2);
                    };
                    runTests = function(visibility) {
                        startLabel = Y.one(mockSeries._labels[0]);
                        endLabel = Y.one(mockSeries._labels[1]);
                        startLabelX = (mockStartX - startLabel.get("offsetWidth") - mockStyles.startlabel.gutter);
                        startLabelY = (mockStartY - startLabel.get("offsetHeight")/2);
                        endLabelX = (mockEndX + mockStyles.endlabel.gutter);
                        endLabelY = (mockEndY - endLabel.get("offsetHeight")/2);
                        Y.Assert.areEqual(mockParentNode, startLabel.get("parentNode"), "The parent node of the label should be the same as the argument passed to the method.");
                        Y.Assert.areEqual(mockParentNode, endLabel.get("parentNode"), "The parent node of the label should be the same as the argument passed to the method.");
                        Y.Assert.areEqual(mockStyles.startlabel, mockSeries._labelStyles[0], "The styles should be the same.");
                        Y.Assert.areEqual(mockStyles.endlabel, mockSeries._labelStyles[1], "The styles should be the same.");
                        Y.Assert.areEqual(mockStartValue, startLabel.get("innerHTML"), "The text value in the start label should be " + mockStartValue + ".");
                        Y.Assert.areEqual(mockEndValue, endLabel.get("innerHTML"), "The text value in the end label should be " + mockEndValue + ".");
                        Y.Assert.areEqual(visibility, startLabel.getStyle("visibility"), "The start label should be " + visibility + ".");
                        Y.Assert.areEqual(visibility, endLabel.getStyle("visibility"), "The start label should be " + visibility + ".");
                        Y.Assert.isTrue(closeEnough(startLabelX, parseFloat(startLabel.getStyle("left"))), "The left style of the start label should be " + startLabelX + ".");
                        Y.Assert.isTrue(closeEnough(startLabelY, parseFloat(startLabel.getStyle("top"))), "The top style of the start label should be " + startLabelY + ".");
                        Y.Assert.isTrue(closeEnough(endLabelX, parseFloat(endLabel.getStyle("left"))), "The left style of the end label should be " + endLabelX + ".");
                        Y.Assert.isTrue(closeEnough(endLabelY, parseFloat(endLabel.getStyle("top"))), "The top style of the end label should be " + endLabelY + ".");
                    };
                Y.one('body').append(mockParentNode);
                mockParentNode.setStyle("width", mockWidth + "px");
                mockParentNode.setStyle("height", "300px");
                mockSeries._labels = [];
                series._defaultLabelFunction.apply(mockSeries, [
                    mockParentNode,
                    mockStartValue,
                    mockEndValue,
                    mockStartX,
                    mockStartY,
                    mockEndX,
                    mockEndY,
                    mockWidth,
                    mockStyles,
                    mockClassName
                ]);
                runTests("visible"); 
                mockStartX = 5;
                mockEndX = 395;
                //just to get the branches
                mockStyles.startlabel.gutter = 0;
                mockStyles.endlabel.gutter = 0;
                mockSeries._labels = [];
                series._defaultLabelFunction.apply(mockSeries, [
                    mockParentNode,
                    mockStartValue,
                    mockEndValue,
                    mockStartX,
                    mockStartY,
                    mockEndX,
                    mockEndY,
                    mockWidth,
                    mockStyles,
                    mockClassName
                ]);
                runTests("hidden");
                mockParentNode.remove(true);
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
