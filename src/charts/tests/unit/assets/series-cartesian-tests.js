YUI.add('series-cartesian-tests', function(Y) {
    var DOC = Y.config.doc;
    Y.CartesianSeriesTest = function() {
        Y.CartesianSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.CartesianSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.CartesianSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
        
        //Returns an object literal containing x and y coordinates, xMarkerPlane and yMarkerPlane arrays, leftOrigin and bottomOrigin.
        //Used for testing CartesianSeries.setAreaData method. 
        getAreaData: function(
            xAxis,
            yAxis,
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
                dataWidth = wid - (leftPadding + padding.right + xOffset * 2),
                dataHeight = ht - (topPadding + padding.bottom + yOffset * 2),
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
                yAxisType = yAxis.get("type"),
                reverseYCoords = yAxisType === "numeric" || yAxisType === "stacked";
            dataLength = xData.length;
            xOffset = xOffset + leftPadding;
            yOffset = reverseYCoords ? yOffset + dataHeight + topPadding + padding.bottom : topPadding + yOffset;
            leftOrigin = Math.round(((0 - xMin) * xScaleFactor) + leftPadding + xOffset);
            bottomOrigin = (0 - yMin) * yScaleFactor;
            bottomOrigin = reverseYCoords ? Math.round(yOffset - bottomOrigin) : Math.round(yOffset + bottomOrigin);

            return {
                xData: xData,
                yData: yData,
                xMin: xMin,
                yMin: yMin,
                dataWidth: dataWidth,
                dataHeight: dataHeight,
                xScaleFactor: xScaleFactor,
                yScaleFactor: yScaleFactor,
                dataLength: dataLength,
                leftPadding: leftPadding,
                topPadding: topPadding,
                direction: direction,
                leftOrigin: leftOrigin,
                bottomOrigin: bottomOrigin
            };
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
            var UpdateAxisBaseMockSeries = Y.Base.create("updateAxisBaseMockSeries", Y.CartesianSeries, [], {
                    _checkForDataByKey: function(data, key) {
                        var i,
                            len,
                            hasData = false;
                        if(Y.Lang.isArray(key)) {
                            len = key.length;
                            for(i = 0; i < len; i = i + 1) {
                                if(data[key[i]] && Y.Lang.isArray(data[key[i]]))
                                {
                                    hasData = true;
                                }
                            }
                        }
                        return hasData;
                    }
                }),
                axisData = {},
                mockAxis = {
                    getDataByKey: function(key) {
                        var i,
                            len,
                            data;
                        if(Y.Lang.isArray(key)) {
                            len = key.length;
                            data = {};
                            for(i = 0; i < len; i = i + 1) {
                                if(axisData.hasOwnProperty(key[i])) {
                                    data[key[i]] = axisData[key[i]];
                                }
                            }
                        } else {
                            data = axisData[key]; 
                        }
                        return data; 
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
                series = this.series,
                mockSeries = new UpdateAxisBaseMockSeries();
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there are no defined axes or keys.");
            mockSeries.set("xAxis", mockAxis);
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because the is no defined yAxis or keys.");
            mockSeries.set("yAxis", mockAxis);
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there are no defined keys.");
            mockSeries.set("xKey", xAxisKey);
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there is no defined yKey.");
            mockSeries.set("yKey", yAxisKey);
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there is no data for either axis.");
            axisData.xAxisKey = xKeyData;
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there is no data for the y axis.");
            axisData.yAxisKey = yKeyData;
            Y.Assert.isTrue(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return true because there is a defined x and y axis and the both have data.");    
            seriesXData = mockSeries.get("xData");
            seriesYData = mockSeries.get("yData");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(xKeyData[i], seriesXData[i], "The value of xData[" + i + "] should equal " + xKeyData[i] + ".");
                Y.Assert.areEqual(yKeyData[i], seriesYData[i], "The value of yData[" + i + "] should equal " + xKeyData[i] + ".");
            }
            xAxisKey = ["xKey1", "xKey2"];
            yAxisKey = ["yKey1", "yKey2"];
            mockSeries.set("xKey", xAxisKey);
            mockSeries.set("yKey", yAxisKey);
            Y.Assert.isFalse(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return false because there is no data for either axis.");
            axisData = {
                xKey1: xKeyData,
                xKey2: xKeyData,
                yKey1: yKeyData,
                yKey2: yKeyData   
            };
            Y.Assert.isTrue(series._updateAxisBase.apply(mockSeries), "The _updateAxisBase method should return true because there is a defined x and y axis and the both have data.");    
        },
    
        "test: _checkForDataByKey()" : function() {
            var series = this.series,
                keys = ["key1", "key2"],
                data = {};
            Y.Assert.isFalse(series._checkForDataByKey(data, keys), "The _checkForDataByKey method should return false because there is no data in the object.");
            data.key1 = [10, 20, 30];
            data.key2 = [5, 15, 25];
            Y.Assert.isTrue(series._checkForDataByKey(data, keys), "The _checkForDataByKey method should return true because there is data in the object.");
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

        "test: setAreaData()" : function() {
            var series = this.series,
                wid = 500,
                ht = 500,
                i,
                len,
                direction = "horizontal",
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
                MockSetAreaDataSeries = Y.Base.create("mockSetAreaDataSeries", Y.CartesianSeries, [], {
                    _getCoords: function(
                        min, 
                        max, 
                        datalength, 
                        data, 
                        axis, 
                        offset, 
                        reverse 
                    ) {
                        if(!this._results || this._results.length > 1) {
                            this._results = [];
                        }
                        this._results.push({
                            min: min,
                            max: max,
                            dataLength: datalength,
                            data: data,
                            axis: axis,
                            offset: offset
                        });
                    }
                }, {
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
                        graphic: {
                            getter: function() {
                                return mockGraphic;
                            }
                        }
                    }
                }),
                mockSeries = new MockSetAreaDataSeries(),
                testData,
                setAreaDataAssert = function() { 
                    var xResults = mockSeries._results[0],
                        yResults = mockSeries._results[1],
                        xAxis = mockSeries.get("xAxis"),
                        yAxis = mockSeries.get("yAxis"),
                        xData = testData.xData,
                        yData = testData.yData,
                        xMin = testData.xMin,
                        yMin = testData.yMin,
                        dataWidth = testData.dataWidth,
                        dataHeight = testData.dataHeight,
                        xScaleFactor = testData.xScaleFactor,
                        yScaleFactor = testData.yScaleFactor,
                        dataLength = testData.dataLength,
                        leftPadding = testData.leftPadding,
                        topPadding = testData.topPadding,
                        len = dataLength,
                        i,
                        resultXData = xResults.data,
                        resultYData = yResults.data;
                    for(i = 0; i < len; i = i + 1) {
                        Y.Assert.areEqual(xData[i], resultXData[i], "The " + i + " index of the xData array should equal " + xData[i] + ".");
                        Y.Assert.areEqual(yData[i], resultYData[i], "The " + i + " index of the yData array should equal " + yData[i] + ".");
                    }
                    Y.Assert.areEqual(xMin, xResults.min, "The value of xMin should be " + xMin + ".");
                    Y.Assert.areEqual(yMin, yResults.min, "The value of yMin should be " + yMin + ".");
                    Y.Assert.areEqual(dataWidth, xResults.dataLength, "The value of dataWidth should be " + dataWidth + ".");
                    Y.Assert.areEqual(dataHeight, yResults.dataLength, "The value of dataHeight should be " + dataHeight + ".");
                    Y.Assert.areEqual(xAxis, xResults.axis, "The value should be the xAxis.");
                    Y.Assert.areEqual(yAxis, yResults.axis, "The value should be the yAxis.");
                    Y.Assert.areEqual(testData.leftOrigin, mockSeries._leftOrigin, "The leftOrigin should be " + testData.leftOrigin + ".");
                    Y.Assert.areEqual(testData.bottomOrigin, mockSeries._bottomOrigin, "The bottomOrigin should be " + testData.bottomOrigin + ".");
                };
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis,
                    valueAxis,
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
                setAreaDataAssert();
                mockSeries.set("direction", "vertical");
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    valueAxis,
                    categoryAxis,
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
                setAreaDataAssert(); 
                
                valueAxis.set("dataProvider", missingValuesDataProvider); 
                categoryAxis.set("dataProvider", missingValuesDataProvider); 
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    valueAxis,
                    categoryAxis,
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
                setAreaDataAssert(); 
                
                mockSeries.set("direction", "horizontal");
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis,
                    valueAxis,
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
                setAreaDataAssert(); 

                valueAxis.set("dataProvider", positiveAndNegativeValuesDataProvider); 
                categoryAxis.set("dataProvider", positiveAndNegativeValuesDataProvider); 
                series.setAreaData.apply(mockSeries);
                testData = this.getAreaData(
                    categoryAxis,
                    valueAxis,
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
                setAreaDataAssert(); 
        },
        
        "test: _setXMarkerPlane()" : function() {
            var series = this.series,
                getXMarkerPlane = function(coords, dataLength, offset)
                {
                    var i = 0,
                        xMarkerPlane,
                        nextX;
                    if(Y.Lang.isArray(coords))
                    {
                        xMarkerPlane = [];
                        for(i = 0; i < dataLength; i = i + 1) 
                        {
                            nextX = coords[i]; 
                            xMarkerPlane.push({start:nextX - offset, end: nextX + offset});
                        }
                    }
                    return xMarkerPlane;
                },
                compareAndAssert = function(test, results) {
                    var start,
                        end,
                        i,
                        len = test.length;
                    for(i = 0; i < len; i = i + 1) {
                        if(isNaN(test[i].start)) {
                            Y.Assert.isNaN(results[i].start, "The start value of the " + i + " index of the xMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                test[i].start, 
                                results[i].start, 
                                "The start value of the " + i + " index of the xMarkerPlane attribute should be " + test[i].start + "."
                            );
                        }
                        if(isNaN(test[i].end)) {
                            Y.Assert.isNaN(results[i].end, "The end value of the " + i + " index of the xMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                test[i].end, 
                                results[i].end, 
                                "The end value of the " + i + " index of the xMarkerPlane attribute should be " + test[i].end + "."
                            );
                        }
                    }
                },
                markerPlaneOffset = series.get("xMarkerPlaneOffset"),
                coords = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
                dataLen = 11,
                testMarkerPlane,
                resultMarkerPlane;
            series._setXMarkerPlane({}, 5);
            Y.Assert.isUndefined(series.get("xMarkerPlane"), "The xMarkerPlane attribute should be undefined.");
            series._setXMarkerPlane(coords, dataLen);
            compareAndAssert(getXMarkerPlane(coords, dataLen, series.get("xMarkerPlaneOffset")), series.get("xMarkerPlane"));
        },
        
        "test: _setYMarkerPlane()" : function() {
            var series = this.series,
                getYMarkerPlane = function(coords, dataLength, offset)
                {
                    var i = 0,
                        yMarkerPlane,
                        nextY;
                    if(Y.Lang.isArray(coords))
                    {
                        yMarkerPlane = [];
                        for(i = 0; i < dataLength; i = i + 1) 
                        {
                            nextY = coords[i]; 
                            yMarkerPlane.push({start:nextY - offset, end: nextY + offset});
                        }
                    }
                    return yMarkerPlane;
                },
                compareAndAssert = function(test, results) {
                    var start,
                        end,
                        i,
                        len = test.length;
                    for(i = 0; i < len; i = i + 1) {
                        if(isNaN(test[i].start)) {
                            Y.Assert.isNaN(results[i].start, "The start value of the " + i + " index of the yMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                test[i].start, 
                                results[i].start, 
                                "The start value of the " + i + " index of the yMarkerPlane attribute should be " + test[i].start + "."
                            );
                        }
                        if(isNaN(test[i].end)) {
                            Y.Assert.isNaN(results[i].end, "The end value of the " + i + " index of the yMarkerPlane attribute should be NaN.");
                        } else {
                            Y.Assert.areEqual(
                                test[i].end, 
                                results[i].end, 
                                "The end value of the " + i + " index of the yMarkerPlane attribute should be " + test[i].end + "."
                            );
                        }
                    }
                },
                markerPlaneOffset = series.get("yMarkerPlaneOffset"),
                coords = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
                dataLen = 11,
                testMarkerPlane,
                resultMarkerPlane;
            series._setYMarkerPlane({}, 5);
            Y.Assert.isUndefined(series.get("yMarkerPlane"), "The yMarkerPlane attribute should be undefined.");
            series._setYMarkerPlane(coords, dataLen);
            compareAndAssert(getYMarkerPlane(coords, dataLen, series.get("yMarkerPlaneOffset")), series.get("yMarkerPlane"));
        },
        
        "test: _getCoords()" : function() {
            var mockAxis = {
                    _getCoordsFromValues: function() {
                        return Y.Array(arguments);
                    }
                },
                series = this.series,
                len = 10,
                data1 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                data2 = {
                    key1: data1,
                    key2: [-5, 5, 15, 25, null, 45, 55, 65, 75, 85]
                },
                offset = 5,
                pixelLength = 400,
                args1 = [
                    0,
                    100,
                    pixelLength,
                    data1,
                    mockAxis,
                    offset     
                ], 
                args2 = [
                    -5,
                    100,
                    pixelLength,
                    data2,
                    mockAxis,
                    pixelLength - offset,
                    true
                ],
                compareResult = function(args, result) {
                    var testResult,
                        updatedArgs,
                        testResults,
                        key,
                        i,
                        len;
                    if(Y.Lang.isArray(result)) {
                        testResults = args.concat();
                        testResults.splice(4, 1);
                        len = result.length;
                        for(i = 0; i < len; i = i + 1) {
                            testResult = testResults[i];
                            Y.Assert.areEqual(testResult, result[i], "The results for " + i + " should equal " + testResult + ".");
                        }
                    } else {
                        for(key in result) {
                            if(result.hasOwnProperty(key)) {
                                updatedArgs = [
                                    args[0],
                                    args[1],
                                    args[2],
                                    args[3][key],
                                    args[4],
                                    args[5],
                                    args[6]
                                ];
                                compareResult(updatedArgs, result[key]);
                            }
                        }
                    }
                };
            compareResult(args1, series._getCoords.apply(series, args1));
            compareResult(args2, series._getCoords.apply(series, args2));
        },

        "test: _copyData()" : function() {
            var series = this.series,
                dataArray1 = [10, 20, 30],
                dataArray2 = [5, 15, 25],
                dataObj = {
                    key1: dataArray1,
                    key2: dataArray2
                },
                i,
                len = 3,
                key,
                resultData;
            resultData = series._copyData(dataArray1);
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(dataArray1[i], resultData[i], "The " + i + " index of the returned array should equal " + dataArray1[i] + ".");
            }
            resultData = series._copyData(dataObj);
            for(key in dataObj) {
                if(dataObj.hasOwnProperty(key)) {
                    for(i = 0; i < len; i = i + 1) {
                        Y.Assert.areEqual(
                            dataObj[key][i], 
                            resultData[key][i], "The " + i + " index of the " + key + " property of the returned object should equal " + dataObj[key][i] + "."
                        );
                    }
                }
            }
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
                forceCallLaterTrue = false,
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
                        if(forceCallLaterTrue) {
                            this._callLater = true;
                        }
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
            xcoords = [10, 20];
            ycoords = [];
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(seriesDrawn, "The drawSeries method should have been called.");
            mockSeries._drawing = true;
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(mockSeries._callLater, "The _callLater boolean should have been set.");
            mockSeries._drawing = false;
            forceCallLaterTrue = true;
            series.draw.apply(mockSeries);
            Y.Assert.isTrue(drawCalled, "If _callLater is set to true, the draw method should be called again.");
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
                    DestructorMockSeries.superclass.init.apply(this, arguments);
                },
                addSomeListeners: function() {
                    this._xAxisChangeHandle = new Destroyer(this);
                    this._yAxisChangeHandle = new Destroyer(this);
                    this._xDataReadyHandle = new Destroyer(this);
                    this._xDataUpdateHandle = new Destroyer(this);
                    this._yDataReadyHandle = new Destroyer(this);
                    this._yDataUpdateHandle = new Destroyer(this);
                }
            }, {
                ATTRS: {
                    markers: {},
                    rendered: {}
                }
            });
            mockSeries = new DestructorMockSeries();
            series.destructor.apply(mockSeries);
            mockSeries.set("rendered", true);
            series.destructor.apply(mockSeries);
            mockSeries.addSomeListeners();
            Y.Assert.isTrue(mockSeries._xAxisChangeHandle._attached, "The _xAxisChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yAxisChangeHandle._attached, "The _yAxisChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._xDataReadyHandle._attached, "The _xDataReadyHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yDataReadyHandle._attached, "The _yDataReadyHandle should be attached.");
            Y.Assert.isTrue(mockSeries._xDataUpdateHandle._attached, "The _xDataUpdateHandle should be attached.");
            Y.Assert.isTrue(mockSeries._yDataUpdateHandle._attached, "The _yDataUpdateHandle should be attached.");
            mockSeries.set("markers", []);
            series.destructor.apply(mockSeries); 
            Y.Assert.isFalse(mockSeries._xAxisChangeHandle._attached, "The _xAxisChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yAxisChangeHandle._attached, "The _yAxisChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._xDataReadyHandle._attached, "The _xDataReadyHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yDataReadyHandle._attached, "The _yDataReadyHandle should be detached.");
            Y.Assert.isFalse(mockSeries._xDataUpdateHandle._attached, "The _xDataUpdateHandle should be detached.");
            Y.Assert.isFalse(mockSeries._yDataUpdateHandle._attached, "The _yDataUpdateHandle should be detached.");
            series.destructor.apply(mockSeries);
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
}, '@VERSION@' ,{requires:['axis-numeric-base', 'axis-category-base', 'series-cartesian', 'chart-test-template']});
