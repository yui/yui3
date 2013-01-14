YUI.add('series-base-tests', function(Y) {
    Y.CartesianSeriesTest = function() {
        Y.CartesianSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.CartesianSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.CartesianSeries();
        },

        tearDown: function() {
            this.series = null;
        },
        
        //Returns an object literal containing x and y coordinates, xMarkerPlane and yMarkerPlane arrays, leftOrigin and bottomOrigin.
        //Used for testing CartesianSeries.setAreaData method. 
        getAreaData: function(
            xData, 
            yData, 
            xOffset, 
            yOffset, 
            padding, 
            xMax,
            xMin,
            yMax,
            yMin,
            xMarkerPlaneOffset,
            yMarkerPlaneOffset,
            direction,
            wid,
            ht
        ) {
            var isNumber = Y.Lang.isNumber,
                nextX, 
                nextY,
                xValue,
                yValue,
                leftPadding = padding.left,
                topPadding = padding.top,
                dataWidth = wid - (leftPadding + padding.right + xOffset),
                dataHeight = ht - (topPadding + padding.bottom + yOffset),
                xcoords = [],
                ycoords = [],
                leftOrigin,
                bottomOrigin,
                xScaleFactor = dataWidth / (xMax - xMin),
                yScaleFactor = dataHeight / (yMax - yMin),
                dataLength,
                i = 0,
                xMarkerPlane = [],
                yMarkerPlane = [],
            dataLength = xData.length;
            xOffset *= 0.5;
            yOffset *= 0.5;
            //Assuming a vertical graph has a range/category for its vertical axis.
            if(direction === "vertical")
            {
                yData = yData.reverse();
            }
            leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding + xOffset);
            bottomOrigin = Math.round((dataHeight + topPadding + yOffset));
            if(yMin < 0)
            {
                bottomOrigin = bottomOrigin - ((0 - yMin) * yScaleFactor);
            }
            for (i = 0; i < dataLength; ++i)
            {
                xValue = parseFloat(xData[i]);
                yValue = parseFloat(yData[i]);
                if(isNumber(xValue))
                {
                    nextX = (((xValue - xMin) * xScaleFactor) + leftPadding + xOffset);
                }
                else
                {
                    nextX = NaN;
                }
                if(isNumber(yValue))
                {
                    nextY = ((dataHeight + topPadding + yOffset) - (yValue - yMin) * yScaleFactor);
                }
                else
                {
                    nextY = NaN;
                }
                xcoords.push(nextX);
                ycoords.push(nextY);
                xMarkerPlane.push({start:nextX - xMarkerPlaneOffset, end: nextX + xMarkerPlaneOffset});
                yMarkerPlane.push({start:nextY - yMarkerPlaneOffset, end: nextY + yMarkerPlaneOffset});
            }
            return({
                xcoords: xcoords,
                ycoords: ycoords,
                xMarkerPlane: xMarkerPlane,
                yMarkerPlane: yMarkerPlane,
                leftOrigin: leftOrigin,
                bottomOrigin: bottomOrigin
            });
        },

        "test: render()" : function() {
            var series = this.series,
                canvasSet = false,
                listenersSet = false,
                validated = false,
                RenderSeries = Y.Base.create("renderSeries", Y.CartesianSeries, [], {
                    _setCanvas: function() {
                        canvasSet = true;
                    },
                    addListeners: function() {
                        listenersSet = true;
                    },
                    validate: function() {
                        validated = true;
                    }
                }),
                mockSeries = new RenderSeries();
                Y.Assert.isFalse(mockSeries.get("rendered"), "The rendered attribute should be false.");
                Y.Assert.isFalse(canvasSet, "The _setCanvas method should not have been called yet.");
                Y.Assert.isFalse(listenersSet, "The addListeners method should not have been called yet.");
                Y.Assert.isFalse(validated, "The valideat method should not have been called yet.");
                series.render.apply(mockSeries);
        },
        
        "test: addListeners()" : function() {
            var series = this.series,
                drawn = false,
                axesUpdated = false,
                AddListenersMockSeries = Y.Base.create("addListenersMockSeries", Y.CartesianSeries, [], {
                    _updateAxisBase: function() {
                        return axesUpdated;
                    },
                    draw: function() {
                        drawn = true;
                    },
                    _xAxisChangeHandler: function() {},
                    _yAxisChangeHandler: function() {}
                }),
                mockSeries = new AddListenersMockSeries();
                Y.Assert.isUndefined(mockSeries._xDataReadyHandle, "The _xDataReadyHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._xDataUpdateHandle, "The _xDataUpdateHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._yDataReadyHandle, "The _yDataReadyHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._yDataUpdateHandle, "The _yDataUpdateHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._xAxisChangeHandle, "The _xAxisChangeHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._yAxisChangeHandle, "The _yAxisChangeHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._stylesChangeHandle, "The _stylesChangeHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._widthChangeHandle, "The _widthChangeHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._heightChangeHandle, "The _heightChangeHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._visibleChangeHandle, "The _visibleChangeHandle should not be set yet.");
                series.addListeners.apply(mockSeries);
                Y.Assert.isUndefined(mockSeries._xDataReadyHandle, "The _xDataReadyHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._xDataUpdateHandle, "The _xDataUpdateHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._yDataReadyHandle, "The _yDataReadyHandle should not be set yet.");
                Y.Assert.isUndefined(mockSeries._yDataUpdateHandle, "The _yDataUpdateHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._xAxisChangeHandle, "The _xAxisChangeHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._yAxisChangeHandle, "The _yAxisChangeHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._stylesChangeHandle, "The _stylesChangeHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._widthChangeHandle, "The _widthChangeHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._heightChangeHandle, "The _heightChangeHandle should not be set yet.");
                Y.Assert.isObject(mockSeries._visibleChangeHandle, "The _visibleChangeHandle should not be set yet.");
               
                mockSeries.set("xAxis", new Y.AxisBase()); 
                mockSeries.set("yAxis", new Y.AxisBase()); 
                series.addListeners.apply(mockSeries);
                Y.Assert.isObject(mockSeries._xDataReadyHandle, "The _xDataReadyHandle should be set.");
                Y.Assert.isObject(mockSeries._xDataUpdateHandle, "The _xDataUpdateHandle should be set.");
                Y.Assert.isObject(mockSeries._yDataReadyHandle, "The _yDataReadyHandle should be set.");
                Y.Assert.isObject(mockSeries._yDataUpdateHandle, "The _yDataUpdateHandle should be set.");
                Y.Assert.isFalse(axesUpdated, "The _updateAxisBase method should not have been called.");
                Y.Assert.isFalse(drawn, "The draw method should not have been called.");
                axesUpdated = true;
                series.addListeners.apply(mockSeries); 
                Y.Assert.isTrue(axesUpdated, "The _updateAxisBase method should have been called.");
                //Y.Assert.isTrue(drawn, "The draw method should have been called.");

                //simulate
                axesUpdated = false;
                mockSeries._widthChangeHandle.evt._afters[0].fn.apply(mockSeries);
                mockSeries._heightChangeHandle.evt._afters[0].fn.apply(mockSeries); 
                mockSeries._stylesChangeHandle.evt._afters[0].fn.apply(mockSeries); 
                Y.Assert.isFalse(drawn, "The draw method should not have been called.");
                axesUpdated = true;
                mockSeries._widthChangeHandle.evt._afters[0].fn.apply(mockSeries);
                Y.Assert.isTrue(drawn, "The draw method should have been called.");
                drawn = false;
                mockSeries._heightChangeHandle.evt._afters[0].fn.apply(mockSeries); 
                Y.Assert.isTrue(drawn, "The draw method should have been called.");
                drawn = false;
                mockSeries._stylesChangeHandle.evt._afters[0].fn.apply(mockSeries); 
                Y.Assert.isTrue(drawn, "The draw method should have been called.");
        },

        "test: xAxisChangeHandler()" : function() {
            var axisEvents,
                dataReady,
                dataUpdate,
                axis,
                series = this.series,
                id = series.get("id");
            series.set("xAxis", new Y.AxisBase());
            series._xAxisChangeHandler.apply(series);
            axis = series.get("xAxis");
            dataReady = axis.constructor.NAME + ":dataReady";
            dataUpdate = axis.constructor.NAME + ":dataUpdate";
            axisEvents = axis._yuievt.events;
            Y.Assert.isTrue(axisEvents.hasOwnProperty(dataReady), "The axis should have a dataReadyEvent.");
            Y.Assert.isTrue(axisEvents.hasOwnProperty(dataUpdate), "The axis should have a dataUpdateEvent.");
        },

        "test: yAxisChangeHandler()" : function() {
            var axisEvents,
                dataReady,
                dataUpdate,
                axis,
                series = this.series,
                id = series.get("id");
            series.set("yAxis", new Y.AxisBase());
            series._yAxisChangeHandler.apply(series);
            axis = series.get("yAxis");
            dataReady = axis.constructor.NAME + ":dataReady";
            dataUpdate = axis.constructor.NAME + ":dataUpdate";
            axisEvents = axis._yuievt.events;
            Y.Assert.isTrue(axisEvents.hasOwnProperty(dataReady), "The axis should have a dataReadyEvent.");
            Y.Assert.isTrue(axisEvents.hasOwnProperty(dataUpdate), "The axis should have a dataUpdateEvent.");
        },

        "test: _xDataChangeHandler()" : function() {
            var series = this.series,
                drawn = false,
                axesUpdated = false,
                DataChangeMockSeries = Y.Base.create("dataChangeMockSeries", Y.CartesianSeries, [], {
                    _updateAxisBase: function() {
                        return axesUpdated;
                    },
                    draw: function() {
                        drawn = true;
                    }
                }),
                mockSeries = new DataChangeMockSeries();
            series._xDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(drawn, "The series should not have called the draw method.");
            axesUpdated = true;
            series._xDataChangeHandler.apply(mockSeries);
            Y.Assert.isTrue(drawn, "The series should have called the draw method.");
        },

        "test: _yDataChangeHandler()" : function() {
            var series = this.series,
                drawn = false,
                axesUpdated = false,
                DataChangeMockSeries = Y.Base.create("dataChangeMockSeries", Y.CartesianSeries, [], {
                    _updateAxisBase: function() {
                        return axesUpdated;
                    },
                    draw: function() {
                        drawn = true;
                    }
                }),
                mockSeries = new DataChangeMockSeries();
            series._yDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(drawn, "The series should not have called the draw method.");
            axesUpdated = true;
            series._yDataChangeHandler.apply(mockSeries);
            Y.Assert.isTrue(drawn, "The series should have called the draw method.");
        },

        "test: _updateAxisBase()" : function() {
            var axisData = {},
                mockAxis = {
                    getDataByKey: function(key) {
                        return axisData[key];
                    }
                },
                xAxisKey = "xAxisKey",
                yAxisKey = "yAxisKey",
                xKeyData = ["1/1/2013", "1/2/2013", "1/3/2013", "1/4/2013", "1/5/2013"],
                yKeyData = [100, 321, 78, 154, 209],
                seriesXData,
                seriesYData,
                i,
                len = xKeyData.length,
                series = this.series;
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because there are no defined axes or keys.");
            series.set("xAxis", mockAxis);
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because the is no defined yAxis or keys.");
            series.set("yAxis", mockAxis);
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because there are no defined keys.");
            series.set("xKey", xAxisKey);
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because there is no defined yKey.");
            series.set("yKey", yAxisKey);
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because there is no data for either axis.");
            axisData.xAxisKey = xKeyData;
            Y.Assert.isFalse(series._updateAxisBase(), "The _updateAxisBase method should return false because there is no data for the y axis.");
            axisData.yAxisKey = yKeyData;
            Y.Assert.isTrue(series._updateAxisBase(), "The _updateAxisBase method should return true because there is a defined x and y axis and the both have data.");    
            seriesXData = series.get("xData");
            seriesYData = series.get("yData");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(xKeyData[i], seriesXData[i], "The value of xData[" + i + "] should equal " + xKeyData[i] + ".");
                Y.Assert.areEqual(yKeyData[i], seriesYData[i], "The value of yData[" + i + "] should equal " + xKeyData[i] + ".");
            }
        },

        "test: validate()" : function() {
            var series = this.series,
                drawn = false,
                drawCompleteFired = false,
                axisBaseUpdated = false,
                ValidateMockSeries = Y.Base.create("validateMockSeries", Y.CartesianSeries, [], {
                    draw: function() {
                        drawn = true;
                    },

                    fire: function(val) {
                        if(val === "drawingComplete") {
                            drawCompleteFired = true; 
                        } else {
                            Y.CartesianSeries.prototype.fire.apply(this, arguments);
                        }
                    },

                    get: function(val) {
                        return keyData[val];
                    },

                    _updateAxisBase: function() {
                        return axisBaseUpdated;
                    }
                }),
                keyData = {};
                xKeyData = ["1/1/2013", "1/2/2013", "1/3/2013", "1/4/2013", "1/5/2013"],
                yKeyData = [100, 321, 78, 154, 209],
                mockSeries = new ValidateMockSeries();
            series.validate.apply(mockSeries);
            Y.Assert.isFalse(drawn, "The series should not draw because xData and yData have not been set.");
            Y.Assert.isTrue(drawCompleteFired, "The series should have fired the drawingComplete event because xData and yData have not been set.");
            drawn = false;
            drawCompleteFired = false;
            keyData.xData = xKeyData;
            series.validate.apply(mockSeries);
            Y.Assert.isFalse(drawn, "The series should not draw because yData has not been set.");
            Y.Assert.isTrue(drawCompleteFired, "The series should have fired the drawingComplete event because yData has not been set.");
            drawCompleteFired = false;
            axisBaseUpdated = true;
            series.validate.apply(mockSeries);
            Y.Assert.isTrue(drawn, "The series should draw because updateAxisBase returned true.");
            Y.Assert.isFalse(drawCompleteFired, "The series should not have fired the drawingComplete event because updateAxisBase returned true.");
            drawCompleteFired = false;
            axisBaseUpdated = false;
            keyData.yData = yKeyData;
            Y.Assert.isTrue(drawn, "The series should draw because the xData and yData have both been set.");
            Y.Assert.isFalse(drawCompleteFired, "The series should not have fired the drawingComplete event because the xData and yData have both been set.");
        },

        "test: _setCanvas()" : function() {
            var series = this.series,
                graphicSet = false,
                MockSetCanvasSeries = Y.Base.create("mockSetCanvasSeries", Y.CartesianSeries, [], {
                    _graph: {
                        get: function(val) {
                            return {};
                        }
                    },
                    get: function(val) {
                        return this._graph;
                    },
                    set: function(attr, val) {
                        if(attr && val) {
                            graphicSet = true;
                        }
                    }
                }),
                mockSeries = new MockSetCanvasSeries();
            Y.Assert.isFalse(graphicSet, "The graphic should not exist until _setCanvas is called.");
            series._setCanvas.apply(mockSeries);
            Y.Assert.isTrue(graphicSet, "The graphic should exist after _setCanvas is called.");
        },

        "test: setAreaData()" : function() {
            var series = this.series,
                catMax = 0,
                catMin = 0,
                valueMax = 0,
                valueMin = 0,
                wid = 500,
                ht = 500,
                xcoords,
                ycoords,
                xMarkerPlane,
                yMarkerPlane,
                testXCoords,
                testYCoords,
                testXMarkerPlane,
                testYMarkerPlane,
                i,
                len,
                direction = "horizontal",
                isVertical = direction === "vertical",
                xOffset = 0, 
                yOffset = 0, 
                padding = {
                    top: 0,
                    right:0,
                    bottom: 0,
                    left: 0   
                }, 
                xMarkerPlaneOffset,
                yMarkerPlaneOffset,
                valueAxis = new Y.NumericAxisBase({
                    dataProvider: plainOldDataProvider,
                    keys: ["open"]
                }),
                categoryAxis = new Y.CategoryAxisBase({
                    dataProvider: plainOldDataProvider,
                    keys: ["date"]
                }),
                MockSetAreaDataGraphic = Y.Base.create("mockSetAreaDataGraphic", Y.Base, [], {}, {
                    ATTRS: {
                        width: {},
                        height: {}
                    }
                }),
                mockGraphic = new MockSetAreaDataGraphic(),
                MockSetAreaDataSeries = Y.Base.create("mockSetAreaDataSeries", Y.CartesianSeries, [], {}, {
                    ATTRS: {
                        maximimum: {
                            getter: function() {
                                return max;
                            }
                        },
                        minimum: {
                            getter: function() {
                                return min;
                            }
                        },
                        width: {
                            getter: function() {
                                return wid;
                            }
                        },
                        height: {
                            getter: function() {
                                return ht;
                            }
                        },
                        xAxis: {
                            getter: function() {
                                return this.get("direction") === "vertical" ? valueAxis : categoryAxis;
                            }
                        },
                        yAxis: {
                            getter: function() {
                                return this.get("direction") === "vertical" ? categoryAxis : valueAxis;
                            }
                        },
                        xData: {
                            getter: function() {
                                return this.get("direction") === "vertical" ? valueAxis.getDataByKey("open") : categoryAxis.getDataByKey("date");

                            }
                        },
                        yData: {
                            getter: function() {
                                return this.get("direction") === "vertical" ? categoryAxis.getDataByKey("date") : valueAxis.getDataByKey("open");
                            }
                        },
                        xcoords: {
                            value: [] 
                        },
                        ycoords: {
                            value: []
                        },
                        xMarkerPlane: {
                            value: null
                        },
                        yMarkerPlane: {
                            value: null
                        },
                        graphic: {
                            getter: function() {
                                return mockGraphic;
                            }
                        }
                    }
                }),
                mockSeries = new MockSetAreaDataSeries(),
                testData,
                key,
                loopThroughAndAssert = function() {
                    xcoords = mockSeries.get("xcoords");
                    ycoords = mockSeries.get("ycoords");
                    xMarkerPlane = mockSeries.get("xMarkerPlane");
                    yMarkerPlane = mockSeries.get("yMarkerPlane"); 
                    testXCoords = testData.xcoords;
                    testYCoords = testData.ycoords;
                    testXMarkerPlane = testData.xMarkerPlane;
                    testYMarkerPlane = testData.yMarkerPlane;
                    len = testXCoords.length;
                    for(i = 0; i < len; i = i + 1) {
                        if(isNaN(testXCoords[i])) {
                            Y.Assert.isNaN(xcoords[i], "The " + i + " index of the xcoords attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(testXCoords[i], xcoords[i], "The " + i + " index of the xcoords attribute should be " + testXCoords[i] + ".");
                        }
                        if(isNaN(testYCoords[i])) {
                            Y.Assert.isNaN(ycoords[i], "The " + i + " index of the ycoords attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(testYCoords[i], ycoords[i], "The " + i + " index of the ycoords attribute should be " + testYCoords[i] + ".");
                        }
                        if(isNaN(testXMarkerPlane[i].start)) {
                            Y.Assert.isNaN(xMarkerPlane[i].start, "The start value of the " + i + " index of the xMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                testXMarkerPlane[i].start, 
                                xMarkerPlane[i].start, 
                                "The start value of the " + i + " index of the xMarkerPlane attribute should be " + testXMarkerPlane[i].start + "."
                            );
                        }
                        if(isNaN(testXMarkerPlane[i].end)) {
                            Y.Assert.isNaN(xMarkerPlane[i].end, "The end value of the " + i + " index of the xMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                testXMarkerPlane[i].end, 
                                xMarkerPlane[i].end, 
                                "The end value of the " + i + " index of the xMarkerPlane attribute should be " + testXMarkerPlane[i].end + "."
                            );
                        }
                        if(isNaN(testYMarkerPlane[i].start)) {
                            Y.Assert.isNaN(yMarkerPlane[i].start, "The start value of the " + i + " index of the yMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                testYMarkerPlane[i].start, 
                                yMarkerPlane[i].start, 
                                "The start value of the " + i + " index of the yMarkerPlane attribute should be " + testYMarkerPlane[i].start + "."
                            );
                        }
                        if(isNaN(testYMarkerPlane[i].end)) {
                            Y.Assert.isNaN(yMarkerPlane[i].end, "The end value of the " + i + " index of the yMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                testYMarkerPlane[i].end, 
                                yMarkerPlane[i].end, 
                                "The end value of the " + i + " index of the yMarkerPlane attribute should be " + testYMarkerPlane[i].end + "."
                            );
                        }
                    }
                    Y.Assert.areEqual(testData.leftOrigin, mockSeries._leftOrigin, "The leftOrigin should be " + testData.leftOrigin + ".");
                    Y.Assert.areEqual(testData.bottomOrigin, mockSeries._bottomOrigin, "The bottomOrigin should be " + testData.bottomOrigin + ".");
                };
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis.getDataByKey("date"),
                    valueAxis.getDataByKey("open"), 
                    categoryAxis.getEdgeOffset(22, 500),
                    valueAxis.getEdgeOffset(22, 500), 
                    padding, 
                    categoryAxis.get("maximum"),
                    categoryAxis.get("minimum"),
                    valueAxis.get("maximum"),
                    valueAxis.get("minimum"),
                    mockSeries.get("xMarkerPlaneOffset"),
                    mockSeries.get("yMarkerPlaneOffset"),
                    "horizontal",
                    wid,
                    ht
                );
                loopThroughAndAssert(); 
                
                mockSeries.set("direction", "vertical");
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    valueAxis.getDataByKey("open"), 
                    categoryAxis.getDataByKey("date"),
                    valueAxis.getEdgeOffset(22, 500), 
                    categoryAxis.getEdgeOffset(22, 500),
                    padding, 
                    valueAxis.get("maximum"),
                    valueAxis.get("minimum"),
                    categoryAxis.get("maximum"),
                    categoryAxis.get("minimum"),
                    mockSeries.get("yMarkerPlaneOffset"),
                    mockSeries.get("xMarkerPlaneOffset"),
                    "vertical",
                    wid,
                    ht
                );
                loopThroughAndAssert(); 
                
                valueAxis.set("dataProvider", missingValuesDataProvider); 
                categoryAxis.set("dataProvider", missingValuesDataProvider); 
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    valueAxis.getDataByKey("open"), 
                    categoryAxis.getDataByKey("date"),
                    valueAxis.getEdgeOffset(22, 500), 
                    categoryAxis.getEdgeOffset(22, 500),
                    padding, 
                    valueAxis.get("maximum"),
                    valueAxis.get("minimum"),
                    categoryAxis.get("maximum"),
                    categoryAxis.get("minimum"),
                    mockSeries.get("yMarkerPlaneOffset"),
                    mockSeries.get("xMarkerPlaneOffset"),
                    "vertical",
                    wid,
                    ht
                );
                loopThroughAndAssert(); 
                
                mockSeries.set("direction", "horizontal");
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis.getDataByKey("date"),
                    valueAxis.getDataByKey("open"), 
                    categoryAxis.getEdgeOffset(22, 500),
                    valueAxis.getEdgeOffset(22, 500), 
                    padding, 
                    categoryAxis.get("maximum"),
                    categoryAxis.get("minimum"),
                    valueAxis.get("maximum"),
                    valueAxis.get("minimum"),
                    mockSeries.get("xMarkerPlaneOffset"),
                    mockSeries.get("yMarkerPlaneOffset"),
                    "horizontal",
                    wid,
                    ht
                );
                loopThroughAndAssert(); 

                valueAxis.set("dataProvider", positiveAndNegativeValuesDataProvider); 
                categoryAxis.set("dataProvider", positiveAndNegativeValuesDataProvider); 
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis.getDataByKey("date"),
                    valueAxis.getDataByKey("open"), 
                    categoryAxis.getEdgeOffset(22, 500),
                    valueAxis.getEdgeOffset(22, 500), 
                    padding, 
                    categoryAxis.get("maximum"),
                    categoryAxis.get("minimum"),
                    valueAxis.get("maximum"),
                    valueAxis.get("minimum"),
                    mockSeries.get("xMarkerPlaneOffset"),
                    mockSeries.get("yMarkerPlaneOffset"),
                    "horizontal",
                    wid,
                    ht
                );
                loopThroughAndAssert(); 


        },

        "test: _getFirstValidIndex()" : function() {
            var series = this.series,
                validIndex = 2,
                coords = [NaN, NaN, 345, 400, 124, 843, NaN];
            Y.Assert.areEqual(validIndex, series._getFirstValidIndex(coords), "The first valid index should be " + validIndex + ".");
        },

        "test: _getLastValidIndex()" : function() {
            var series = this.series,
                validIndex = 5,
                coords = [NaN, NaN, 345, 400, 124, 843, NaN];
            Y.Assert.areEqual(validIndex, series._getLastValidIndex(coords), "The first valid index should be " + validIndex + ".");
        },

        "test: draw()" : function() {
            var series = this.series,
                wid,
                ht, 
                areaDataSet = false,
                axisBaseUpdated = false,
                xData,
                yData,
                xcoords,
                ycoords,
                visibleToggled = false,
                drawingComplete = false,
                hasRendered = false,
                seriesDrawn = false,
                drawCalled = false,
                MockTestDrawSeries = Y.Base.create("mockTestDrawSeries", Y.CartesianSeries, [], {
                    setAreaData: function() {
                        areaDataSet = true;
                    },
                    _updateAxisBase: function() {
                        axisBaseUpdated = true;
                    },
                    _toggleVisible: function() {
                        visibleToggled = true;
                    },
                    drawSeries: function() {
                        seriesDrawn = true;
                    },
                    draw: function() {
                        drawCalled = true;
                    }
                }, {
                    ATTRS: {
                        width: {
                            getter: function() {
                                return wid;
                            }
                        },
                        height: {
                            getter: function() {
                                return ht;
                            }
                        },
                        xData: {
                            readOnly: true,

                            getter: function() {
                                return xData;
                            }
                        },
                        yData: {
                            readOnly: true,

                            getter: function() {
                                return yData;
                            }
                        },
                        xcoords: {
                            readOnly: true,

                            getter: function() {
                                return xcoords;
                            }
                        },
                        ycoords: {
                            readOnly: true,

                            getter: function() {
                                return ycoords;
                            }
                        },
                        rendered: {
                            readOnly: true,

                            getter: function() {
                                return hasRendered;
                            }
                        }
                    }
                }),
                
                mockSeries = new MockTestDrawSeries();
            series.draw.apply(mockSeries);
            hasRendered = true;
            series.draw.apply(mockSeries);
            wid = 100;
            ht = 100;
            axisBaseUpdated = true;
            series.draw.apply(mockSeries);
            xData = {};
            yData = {};
            Y.Assert.isFalse(areaDataSet, "The setAreaData method should not have been called.");
            series.draw.apply(mockSeries);
            Y.Assert.isTrue(areaDataSet, "The setAreaData method should have been called.");
            Y.Assert.isTrue(visibleToggled, "The _toggleVisible method should have been called.");
            xcoords = [];
            ycoords = [];
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(seriesDrawn, "The drawSeries method should have been called.");
            mockSeries._drawing = true;
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(mockSeries._callLater, "The _callLater boolean should have been set.");
        },

        "test: getDefaultStyles()" : function() {
            var padding = this.series._getDefaultStyles().padding;
            Y.Assert.areEqual(0, padding.left, "The left padding should be zero.");
            Y.Assert.areEqual(0, padding.top, "The top padding should be zero.");
            Y.Assert.areEqual(0, padding.right, "The right padding should be zero.");
            Y.Assert.areEqual(0, padding.bottom, "The bottom padding should be zero.");
        },

        "test: getDefaultColor()" : function() {
            var series = this.series,
                colors = {
                    line: ["#426ab3", "#d09b2c", "#000000", "#b82837", "#b384b5", "#ff7200", "#779de3", "#cbc8ba", "#7ed7a6", "#007a6c"],
                    fill: ["#6084d0", "#eeb647", "#6c6b5f", "#d6484f", "#ce9ed1", "#ff9f3b", "#93b7ff", "#e0ddd0", "#94ecba", "#309687"],
                    border: ["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"],
                    slice: ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"]
                },
                i,
                color,
                returnedColor,
                colorLength = 10,
                colorIndex,
                len = 15,
                key;
            for(i = 0; i < len; i = i + 1) {
                colorIndex = i > colorLength - 1 ? i % colorLength : i;
                for(key in colors) {
                    color = colors[key][colorIndex];
                    Y.Assert.areEqual(color, series._getDefaultColor(i, key), "The default color for an index of " + i + " for a " + key + " should be " + color + ".");    
                }
                color = colors.fill[colorIndex];
                Y.Assert.areEqual(color, series._getDefaultColor(i), "The default color for an index of " + i + " when a type is not specified should be " + color + ".");
            }
        },

        "test: _handleVisibleChange()" : function() {
            var visibleChanged = false,
                MockHandleVisibleChangeSeries = Y.Base.create("mockHandleVisibleChange", Y.CartesianSeries, [], {
                    _toggleVisible: function() {
                        visibleChanged = true;
                    }
                }),
                series = this.series,
                mockSeries = new MockHandleVisibleChangeSeries();
            series._handleVisibleChange.apply(mockSeries);
            Y.Assert.isTrue(visibleChanged, "The visible attribute of the series should have been toggled.");
        },

        "test: getTotalValues()" : function() {
            var series = this.series,
                valueKey = "values",
                valueData = [100, 321, 78, 154, 209],
                totalData = 862,
                i,
                len = valueData.length,
                mockAxis = {
                    getTotalByKey: function() {
                        return totalData;
                    }
                },
                GetTotalValuesMockSeries = Y.Base.create("getTotalValuesMockSeries", Y.CartesianSeries, [], {}, {
                    ATTRS: Y.merge(Y.CartesianSeries.ATTRS, {
                        xAxis: {
                            getter: function(val) {
                                return mockAxis;  
                            }
                        },
                        yAxis: {
                            getter: function(val) {
                                return mockAxis;  
                            }
                        }
                    })
                }),
                mockSeries = new GetTotalValuesMockSeries();
            Y.Assert.areEqual(totalData, series.getTotalValues.apply(mockSeries), "The getTotalByKey method should return " + totalData + ".");
            mockSeries.set("direction", "vertical");
            Y.Assert.areEqual(totalData, series.getTotalValues.apply(mockSeries), "The getTotalByKey method should return " + totalData + ".");
        },

        "test: destructor()" : function() {
            var series = this.series,
                graphic = new Y.Graphic({
                    autoDraw: false   
                }),
                Destroyer = function(owner, instance) {
                    this._owner = owner;
                },
                DestructorMockSeries,
                mockSeries;

            Destroyer.prototype = {
                _attached: true,

                detach: function() {
                    this._attached = false;
                },

                destroy: function() {
                    //don't need to nothing
                }
            };
            DestructorMockSeries = Y.Base.create("destructorMockSeries", Y.CartesianSeries, [], {
                init: function() {
                    this._xAxisChangeHandle = new Destroyer(this);
                    this._yAxisChangeHandle = new Destroyer(this);
                    this._stylesChangeHandle = new Destroyer(this);
                    this._widthChangeHandle = new Destroyer(this);
                    this._heightChangeHandle = new Destroyer(this);
                    this._visibleChangeHandle = new Destroyer(this);
                    DestructorMockSeries.superclass.init.apply(this, arguments);
                },
                addSomeListeners: function() {
                    this._xDataReadyHandle = new Destroyer(this);
                    this._xDataUpdateHandle = new Destroyer(this);
                    this._yDataReadyHandle = new Destroyer(this);
                    this._yDataUpdateHandle = new Destroyer(this);
                },
                addSomeShapes: function() {
                    this._path = new Destroyer(this);
                    this._lineGraphic = new Destroyer(this);
                    this._groupMarker = new Destroyer(this);
                }
            }, {
                ATTRS: {
                    markers: {},
                    rendered: {}
                }
            });
            mockSeries = new DestructorMockSeries();
            series.destructor.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._xAxisChangeHandle._attached, "The _xAxisChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yAxisChangeHandle._attached, "The _yAxisChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._stylesChangeHandle._attached, "The _stylesChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._widthChangeHandle._attached, "The _widthChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._heightChangeHandle._attached, "The _heightChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._visibleChangeHandle._attached, "The _visibleChangeHandle should be attached.");
            mockSeries.set("rendered", true);
            series.destructor.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._xAxisChangeHandle._attached, "The _xAxisChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yAxisChangeHandle._attached, "The _yAxisChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._stylesChangeHandle._attached, "The _stylesChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._widthChangeHandle._attached, "The _widthChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._heightChangeHandle._attached, "The _heightChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._visibleChangeHandle._attached, "The _visibleChangeHandle should be detached.");
            mockSeries.addSomeListeners();
            Y.Assert.isTrue(mockSeries._xDataReadyHandle._attached, "The _xDataReadyHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yDataReadyHandle._attached, "The _yDataReadyHandle should be attached.");
            Y.Assert.isTrue(mockSeries._xDataUpdateHandle._attached, "The _xDataUpdateHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yDataUpdateHandle._attached, "The _yDataUpdateHandle should be attached.");
            mockSeries.set("markers", []);
            series.destructor.apply(mockSeries); 
            Y.Assert.isFalse(mockSeries._xDataReadyHandle._attached, "The _xDataReadyHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yDataReadyHandle._attached, "The _yDataReadyHandle should be detached.");
            Y.Assert.isFalse(mockSeries._xDataUpdateHandle._attached, "The _xDataUpdateHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yDataUpdateHandle._attached, "The _yDataUpdateHandle should be detached.");
            mockSeries.set("markers", [
                graphic.addShape({type:"circle"}),
                "randomstring",
                graphic.addShape({type:"circle"}),
                graphic.addShape({type:"circle"})
            ]);
            series.destructor.apply(mockSeries);
            Y.Assert.areEqual(0, mockSeries.get("markers"), "All markers should be removed."); 
            mockSeries.addSomeShapes();
            series.destructor.apply(mockSeries);
            Y.Assert.isNull(mockSeries._path, "The _path should be destroyed.");
            Y.Assert.isNull(mockSeries._lineGraphic, "The _lineGraphic should be destroyed.");
            Y.Assert.isNull(mockSeries._groupMarker, "The _groupMarker should be destroyed.");
        },

        "test: _getChart()" : function() {
            var series = this.series,
                mockChart,
                mockGraph,
                mockGraphic,
                MockGetChartGraph = Y.Base.create("mockGetChartGraph", Y.Base, [], {}, {
                    ATTRS: {
                        chart: {
                            getter: function() {
                                return mockChart;
                            }
                        }
                    }
                }),
                MockGetChartSeries = Y.Base.create("mockGetChartSeries", Y.Base, [], {}, {
                    ATTRS: {
                        graph: {
                            getter: function() {
                                return mockGraph;
                            }
                        },

                        graphic: {
                            getter: function() {
                                return mockGraphic;
                            }
                        }
                    }
                }),
                mockSeries = new MockGetChartSeries();
            Y.Assert.isUndefined(series._getChart.apply(mockSeries), "The getChart method should return null.");
            mockGraphic = "graphicInstance";
            Y.Assert.areEqual("graphicInstance", series._getChart.apply(mockSeries), "The getChart method should return the graphic attribute if the graph attribute is not set.");
            mockGraph = new MockGetChartGraph();
            Y.Assert.areEqual(
                "graphicInstance", 
                series._getChart.apply(mockSeries), 
                "The getChart method should return the graphic attribute if the graph attribute is not have a chart attribute set."
            );
            mockChart = "chartInstance";
            Y.Assert.areEqual("chartInstance", series._getChart.apply(mockSeries), "The getChart method should return the chart attribute of the graph attribute.");
        },

        "test: get('xDisplayName')" : function() {
            var series = this.series,
                xKeyValue = "xKeyValue",
                xDisplayNameValue = "xDisplayNameValue";
            series.set("xKey", xKeyValue);
            Y.Assert.areEqual(xKeyValue, series.get("xDisplayName"), "The xDisplayName attribute should equal " + xKeyValue + ".");
            series.set("xDisplayName", xDisplayNameValue);
            Y.Assert.areEqual(xDisplayNameValue, series.get("xDisplayName"), "The xDisplayName attribute should equal " + xDisplayNameValue + ".");
        },

        "test: get('yDisplayName')" : function() {
            var series = this.series,
                yKeyValue = "yKeyValue",
                yDisplayNameValue = "yDisplayNameValue";
            series.set("yKey", yKeyValue);
            Y.Assert.areEqual(yKeyValue, series.get("yDisplayName"), "The yDisplayName attribute should equal " + yKeyValue + ".");
            series.set("yDisplayName", yDisplayNameValue);
            Y.Assert.areEqual(yDisplayNameValue, series.get("yDisplayName"), "The yDisplayName attribute should equal " + yDisplayNameValue + ".");
        },

        "test: get('categoryDisplayName')" : function() {
            var series = this.series,
                xKeyValue = "xKeyValue",
                xDisplayNameValue = "xDisplayNameValue";
                yKeyValue = "yKeyValue",
                yDisplayNameValue = "yDisplayNameValue";
            series.set("categoryDisplayName", xDisplayNameValue);
            Y.Assert.areEqual(
                xDisplayNameValue, 
                series.get("categoryDisplayName"), 
                "The categoryDisplayName attribute should equal the xDisplayName attribute when the direction of the series is horizontal."
            );
            series.set("direction", "vertical");
            series.set("categoryDisplayName", yDisplayNameValue);
            Y.Assert.areEqual(
                yDisplayNameValue, 
                series.get("categoryDisplayName"), 
                "The categoryDisplayName attribute should equal the yDisplayName attribute when the direction of the series is vertical."
            );
        },

        "test: get('valueDisplayName')" : function() {
            var series = this.series,
                xKeyValue = "xKeyValue",
                xDisplayNameValue = "xDisplayNameValue";
                yKeyValue = "yKeyValue",
                yDisplayNameValue = "yDisplayNameValue";
            series.set("valueDisplayName", yDisplayNameValue);
            Y.Assert.areEqual(
                yDisplayNameValue, 
                series.get("valueDisplayName"), 
                "The valueDisplayName attribute should equal the yDisplayName attribute when the direction of the series is horizontal."
            );
            series.set("direction", "vertical");
            series.set("valueDisplayName", xDisplayNameValue);
            Y.Assert.areEqual(
                xDisplayNameValue, 
                series.get("valueDisplayName"), 
                "The valueDisplayName attribute should equal the xDisplayName attribute when the direction of the series is vertical."
            );
        },

        "test: get('chart')" : function() {
            var mockGraph = {
                    get: function(val) {
                        if(val === "chart") {
                            return "chart";
                        }
                    }
                },
                series = this.series;
            series.set("graph", mockGraph);
            Y.Assert.areEqual("chart", series.get("chart"), "Calling get('chart') should return the chart instance.");
        },

        "test: get('width')" : function() {
            var series = this.series,
                width = 100,
                mockGraphic = {
                    get: function(val) {
                        if(val === "width") {
                            return width;
                        }
                    }
                };
            series.set("graphic", mockGraphic);
            Y.Assert.areEqual(width, series.get("width"), "The width should be " + width + ".");
        },

        "test: get('height')" : function() {
            var series = this.series,
                height = 100,
                mockGraphic = {
                    get: function(val) {
                        if(val === "height") {
                            return height;
                        }
                    }
                };
            series.set("graphic", mockGraphic);
            Y.Assert.areEqual(height, series.get("height"), "The height should be " + height + ".");
        },

        "test: get('xMarkerPlaneOffset')" : function() {
            var series = this.series,
                defaultOffset = 4,
                markerSize = 10;
            Y.Assert.areEqual(defaultOffset, series.get("xMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
            series.set("styles", {
                marker: {}
            });
            Y.Assert.areEqual(defaultOffset, series.get("xMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
            series.set("styles", {
                marker: {
                    width: markerSize
                }
            });
            Y.Assert.areEqual(markerSize/2, series.get("xMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
        },

        "test: get('yMarkerPlaneOffset')" : function() {
            var series = this.series,
                defaultOffset = 4,
                markerSize = 10;
            Y.Assert.areEqual(defaultOffset, series.get("yMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
            series.set("styles", {
                marker: {}
            });
            Y.Assert.areEqual(defaultOffset, series.get("yMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
            series.set("styles", {
                marker: {
                    height: markerSize
                }
            });
            Y.Assert.areEqual(markerSize/2, series.get("yMarkerPlaneOffset"), "The offset should be " + defaultOffset + ".");
        },

        "test: get('groupMarkers')" : function() {
            var series = this.series,
                mockGraph = {
                    get: function(val) {
                        if(val === "groupMarkers") {
                            return false;
                        }
                    }
                };
            series.set("graph", mockGraph);
            Y.Assert.isFalse(series.get("groupMarkers"), "The graph instance has groupMarkers set to false.");
            series.set("groupMarkers", true);
            Y.Assert.isTrue(series.get("groupMarkers"), "The _groupMarkes property is set to true.");
        }
    });
    
    var suite = new Y.Test.Suite("Charts: CartesianSeries"),
        plainOldDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72, close: 239.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", open: 216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: "01/12/2009", open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: 124.13, close: 61.13},
            {date: "01/16/2009", open: 58.21, close: 106.21},
            {date: "01/17/2009", open: 85.55, close: 151.55},
            {date: "01/18/2009", open: 277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: 270.3},
            {date: "01/20/2009", open: 196.88, close: 147.88},
            {date: "01/21/2009", open: 198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ],
        missingValuesDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", close: 133.21},
            {date: "01/09/2009", open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: "01/12/2009", open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: 124.13, close: 61.13},
            {date: "01/16/2009", open: 58.21, close: 106.21},
            {date: "01/17/2009", open: 85.55, close: 151.55},
            {date: "01/18/2009", open: 277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: 270.3},
            {date: "01/20/2009", open: 196.88, close: 147.88},
            {date: "01/21/2009", open: 198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ],
        positiveAndNegativeValuesDataProvider = [
            {date: "01/01/2009", open: 90.27, close: -170.27},
            {date: "01/02/2009", open: -91.55, close: 8.55},
            {date: "01/03/2009", open: -337.55, close: 450.55},
            {date: "01/04/2009", open: 220.27, close: -205.27},
            {date: "01/05/2009", open: 276.72, close: -239.72},
            {date: "01/06/2009", open: -85.27, close: -167.27},
            {date: "01/07/2009", open: -180.29, close: 179.29},
            {date: "01/08/2009", open: -216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: -304.35},
            {date: "01/10/2009", open: 80.23, close: -30.23},
            {date: "01/11/2009", open: -60.42, close: 97.42},
            {date: "01/12/2009", open: -303.55, close: 265.55},
            {date: "01/13/2009", open: -47.48, close: -71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: -124.13, close: 61.13},
            {date: "01/16/2009", open: -58.21, close: -106.21},
            {date: "01/17/2009", open: 85.55, close: -151.55},
            {date: "01/18/2009", open: -277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: -270.3},
            {date: "01/20/2009", open: -196.88, close: -147.88},
            {date: "01/21/2009", open: -198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ];
    suite.add(new Y.CartesianSeriesTest({
        name: "CartesianSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-numeric-base', 'axis-category-base', 'series-base', 'chart-test-template']});
