YUI.add('series-pie-tests', function(Y) {
    var IE = Y.UA.ie,
        MockPieSeries = Y.Base.create("mockPieSeries", Y.PieSeries, [], {
            _markersDrawn: false,

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        DataChangeMockPieSeries = Y.Base.create("dataChangeMockPieSeries", Y.Base, [], {
            _hasDrawn: false,

            draw: function() {
                this._hasDrawn = true;
            }
        }),
        plainOldDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27, none: 0},
            {date: "01/02/2009", open: 91.55, close: null, none: 0},
            {date: "01/03/2009", open: 337.55, close: 400.55, none: 0},
            {date: "01/04/2009", open: 220.27, close: 205.27, none: 0},
            {date: "01/05/2009", open: 276.72, close: 239.72, none: 0},
            {date: "01/06/2009", open: 85.27, close: 167.27, none: 0},
            {date: "01/07/2009", close: 179.29, none: 0},
            {date: "01/08/2009", open: 216.21, close: 133.21, none: 0},
            {date: "01/09/2009", open: 292.35, close: 304.35, none: 0},
            {date: "01/10/2009", open: 80.23, close: 30.23, none: 0},
            {date: "01/11/2009", open: 0, close: 97.42, none: 0},
            {date: "01/12/2009", open: 0, close: 265.55, none: 0},
            {date: "01/13/2009", open: 0, close: 71.48, none: 0},
            {date: "01/14/2009", open: 0, close: 256.64, none: 0},
            {date: "01/15/2009", open: 0, close: 61.13, none: 0},
            {date: "01/16/2009", open: 58.21, close: 106.21, none: 0},
            {date: "01/17/2009", open: 85.55, close: 151.55, none: 0},
            {date: "01/18/2009", open: 277.76, close: 268.76, none: 0},
            {date: "01/19/2009", open: 263.3, close: 270.3, none: 0},
            {date: "01/20/2009", open: 196.88, close: 147.88, none: 0},
            {date: "01/21/2009", open: 198.91, close: 211.91, none: 0},
            {date: "01/22/2009", open: 229.28, close: 176.28, none: 0}
        ],
        suite = new Y.Test.Suite("Charts: PieSeries"),
        ChangeHandlerMockAxis = function() {};
    ChangeHandlerMockAxis.prototype = {
        _dataReadyHandleSet: false,

        _dataUpdateHandleSet: false,

        after: function(val) {
            if(val) {
                this["_" + val + "HandleSet"] = true;
            }
        }
    };
    Y.PieSeriesTest = function() {
        Y.PieSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.PieSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.PieSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: _setMap()" : function() {
            var setMapTestMockGraph = Y.Base.create("setMapTestMockGraph", Y.Base, [], {
                    init: function() {
                        this._node = Y.Node.create('<div>');
                        setMapTestMockGraph.superclass.init.apply(this, arguments);
                    }
                }, {
                    ATTRS: {
                        contentBox: {
                            getter: function() {
                                return this._node;
                            }
                        }
                    }
                }),
                setMapTestMockGraphic = Y.Base.create("setMapTestMockGraphic", Y.Base, [], {
                    init: function() {
                        this._node = Y.Node.create('<div>');
                        setMapTestMockGraphic.superclass.init.apply(this, arguments);
                    }
                }, {
                    ATTRS: {
                        node: {
                            getter: function() {
                                return this._node;
                            }
                        }
                    }
                }),
                mockGraphic = new setMapTestMockGraphic(),
                mockGraph,
                setMapMockPieSeries = Y.Base.create("setMapTestMockPieSeries", Y.Base, [], {

                }, {
                    ATTRS: {
                        graphic: {
                            getter: function() {
                                return mockGraphic;   
                            }
                        },
                        graph: {
                            getter: function() {
                                return mockGraph;   
                            }
                        }
                    }
                }),
                mockSeries = new setMapMockPieSeries(),
                series = this.series;
            series._setMap.apply(mockSeries);
            Y.Assert.areEqual(1, mockSeries._image.nodeType, "The _image property should be an element node.");
            Y.Assert.areEqual(1, mockSeries._map.nodeType, "The _image property should be an element node.");
            mockSeries._areaNodes = [
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div"),
                document.createElement("div")
            ];
            len = mockSeries._areaNodes.length;
            for(i = 0; i < len; i = i + 1) {
                mockSeries._map.appendChild(mockSeries._areaNodes[i]);
            }
            series._setMap.apply(mockSeries);
            Y.Assert.areEqual(1, mockSeries._image.nodeType, "The _image property should be an element node.");
            Y.Assert.areEqual(1, mockSeries._map.nodeType, "The _image property should be an element node.");
            mockGraphic.get("node").destroy(true);
            mockGraphic.set("node", null);
            mockSeries._image = null;
            mockSeries._map = null;
            mockGraph = new setMapTestMockGraph();
            series._setMap.apply(mockSeries);
            Y.Assert.areEqual(1, mockSeries._image.nodeType, "The _image property should be an element node.");
            Y.Assert.areEqual(1, mockSeries._map.nodeType, "The _image property should be an element node.");
        },

        "test: addListeners()" : function() {
            var series = this.series,
                drawn = false,
                axesUpdated = false,
                AddListenersMockSeries = Y.Base.create("addListenersMockSeries", Y.PieSeries, [], {
                    _updateAxisBase: function() {
                        return axesUpdated;
                    },
                    draw: function() {
                        drawn = true;
                    },
                    _categoryAxisChangeHandler: function() {},
                    _valueAxisChangeHandler: function() {}
                }),
                mockSeries = new AddListenersMockSeries();
                
                
            series.addListeners.apply(mockSeries); 
            Y.Assert.isObject(mockSeries._visibleChangeHandle, "The visibleChangeHandle should be set."); 
            mockSeries.set("categoryAxis", new Y.AxisBase()); 
            mockSeries.set("valueAxis", new Y.AxisBase()); 
            series.addListeners.apply(mockSeries); 
            Y.Assert.isObject(mockSeries._visibleChangeHandle, "The visibleChangeHandle should be set."); 
        },

        "test: validate()" : function() {
            var validateMockSeries = Y.Base.create("validateMockSeries", Y.Base, [], {
                    _hasDrawn: false,

                    draw: function() {
                        this._hasDrawn = true;
                    }
                }),
                mockSeries = new validateMockSeries(),
                series = this.series;
            series.validate.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._hasDrawn, "The draw method should have been called.");
            //typo in validate method, currently test matches typo :(
            Y.Assert.isTrue(mockSeries._renderered, "The _rendered boolean should be true.");
        },

        "test: _categoryAxisChangeHandler()" : function() {
            var series = this.series,
                mockAxis = new ChangeHandlerMockAxis();
            series.set("categoryAxis", mockAxis);
            Y.Assert.isFalse(mockAxis._dataUpdateHandleSet, "The _dataUpdateChangeHandle should not be set.")
            Y.Assert.isFalse(mockAxis._dataReadyHandleSet, "The _dataReadyChangeHandle should not be set.")
            series._categoryAxisChangeHandler.apply(series);
            Y.Assert.isTrue(mockAxis._dataUpdateHandleSet, "The _dataUpdateChangeHandle should be set.")
            Y.Assert.isTrue(mockAxis._dataReadyHandleSet, "The _dataReadyChangeHandle should be set.")
        },

        "test: _valueAxisChangeHandler()" : function() {
            var series = this.series,
                mockAxis = new ChangeHandlerMockAxis();
            series.set("valueAxis", mockAxis);
            Y.Assert.isFalse(mockAxis._dataUpdateHandleSet, "The _dataUpdateChangeHandle should not be set.")
            Y.Assert.isFalse(mockAxis._dataReadyHandleSet, "The _dataReadyChangeHandle should not be set.")
            series._valueAxisChangeHandler.apply(series);
            Y.Assert.isTrue(mockAxis._dataUpdateHandleSet, "The _dataUpdateChangeHandle should be set.")
            Y.Assert.isTrue(mockAxis._dataReadyHandleSet, "The _dataReadyChangeHandle should be set.")
        },
    
        "test: _categoryDataChangeHandler()" : function() {
            var series = this.series,
                mockSeries = new DataChangeMockPieSeries();
            series._categoryDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries._rendered = true;
            series._categoryDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries.set("categoryKey", "myCategoryKey");
            series._categoryDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries.set("valueKey", "myValueKey");
            series._categoryDataChangeHandler.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._hasDrawn, "The draw method should have been called.");
        },
    
        "test: _valueDataChangeHandler()" : function() {
            var series = this.series,
                mockSeries = new DataChangeMockPieSeries();
            series._valueDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries._rendered = true;
            series._valueDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries.set("categoryKey", "myCategoryKey");
            series._valueDataChangeHandler.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._hasDrawn, "The draw method should not have been called.");
            mockSeries.set("valueKey", "myValueKey");
            series._valueDataChangeHandler.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._hasDrawn, "The draw method should have been called.");
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
                GetTotalValuesMockSeries = Y.Base.create("getTotalValuesMockSeries", Y.SeriesBase, [], {}, {
                    ATTRS: Y.merge(Y.SeriesBase.ATTRS, {
                        valueAxis: {
                            getter: function(val) {
                                return mockAxis;  
                            }
                        }
                    })
                }),
                mockSeries = new GetTotalValuesMockSeries();
            Y.Assert.areEqual(totalData, series.getTotalValues.apply(mockSeries), "The getTotalByKey method should return " + totalData + ".");
        },
   
        "test: draw()" : function() {
            var series = this.series,
                wid,
                ht, 
                drawingComplete = false,
                seriesDrawn = false,
                drawCalled = false,
                forceCallLaterTrue = false,
                MockTestDrawSeries = Y.Base.create("mockTestDrawSeries", Y.Base, [], {
                    drawSeries: function() {
                        seriesDrawn = true;
                        if(forceCallLaterTrue) {
                            this._callLater = true;
                        }
                    },
                    draw: function() {
                        drawCalled = true;
                    },
                    fire: function(val) {
                        if(val === "drawingComplete") {
                            drawCompleteFired = true; 
                        } else {
                            Y.Base.prototype.fire.apply(this, arguments);
                        }
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
                        }
                    }
                }),
                mockSeries = new MockTestDrawSeries();
            series.draw.apply(mockSeries);
            Y.Assert.isFalse(seriesDrawn, "The drawSeries method should not have been called.");
            Y.Assert.isUndefined(mockSeries._rendered, "The _rendered property should not have been set.");
            wid = 100;
            ht = 100;
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(seriesDrawn, "The drawSeries method should have been called.");
            Y.Assert.isTrue(mockSeries._rendered, "The _rendered property should have been set.");
            mockSeries._drawing = true;
            series.draw.apply(mockSeries);  
            Y.Assert.isTrue(mockSeries._callLater, "The _callLater boolean should have been set.");
            mockSeries._drawing = false;
            forceCallLaterTrue = true;
            series.draw.apply(mockSeries);
            Y.Assert.isTrue(drawCalled, "If _callLater is set to true, the draw method should be called again.");
        },

        //Does not yet test the algorithm that generates the right values for drawing the correctly sized wedge.
        "test: drawPlots()" : function() {
            var series = this.series,
                wid = 500,
                ht = 500,
                valueKey = "open",
                valueAxis = new Y.NumericAxisBase({
                    dataProvider: plainOldDataProvider,
                    keys: ["open", "close", "none"]
                }),
                categoryAxis = new Y.CategoryAxisBase({
                    dataProvider: plainOldDataProvider,
                    keys: ["date"]
                }),
                MockDrawPlotsGraphic = Y.Base.create("mockDrawPlotsGraphic", Y.Base, [], {}, {
                    ATTRS: {
                        width: {},
                        height: {}
                    }
                }),
                MockDrawPlotsSeries = Y.Base.create("mockDrawPlotsSeries", Y.PieSeries, [], {
                    init: function() {
                        this._markers = 0;
                        this._markerCache = [];
                        MockDrawPlotsSeries.superclass.init.apply(this, arguments);
                    },
                    
                    _mapSet: false,

                    _hotspotAdded: false,

                    _image: {},

                    _markerCacheCreated: false,

                    _markerCacheCleared: false,

                    _setMap: function() {
                        this._mapSet = true;
                    },

                    _addHotspot: function() {
                        this._hotspotAdded = true;
                    },

                    _createMarkerCache: function() {
                        this._markerCacheCreated = true;   
                    },

                    getMarker: function() {
                        this._markers = this._markers + 1;
                        this._markerCache.push({});
                    },
                    _clearMarkerCache: function() {
                        this._markerCacheCleared = true;
                        this._markers = 0;
                        this._markerCache = [];
                    },
                    _reset: function() {
                        this._image = {};
                        this._markerCacheCreated = false
                        this._markerCacheClearded = false;
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
                        categoryAxis: {
                            getter: function() {
                                return categoryAxis;
                            }
                        },
                        valueAxis: {
                            getter: function() {
                                return valueAxis;
                            }
                        },
                        graphic: {
                            getter: function() {
                                return mockGraphic;
                            }
                        },
                        valueKey: {
                            getter: function() {
                                return valueKey;
                            }
                        }
                    }
                }),
                mockSeries = new MockDrawPlotsSeries({
                    categoryKey: "date"   
                }),
                mockGraphic = new MockDrawPlotsGraphic(),
                storedGraphicName = Y.Graphic.NAME;
            //Assume svg or vml
            Y.Graphic.NAME = storedGraphicName === "canvasGraphic" ? "svgGraphic" : storedGraphicName;
            series.drawPlots.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
            Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");
            Y.Assert.isFalse(mockSeries._mapSet, "The _setMap function should not have been called.");
            Y.Assert.isFalse(mockSeries._hotspotAdded, "The _addHotspot function should not have been called.");

            //force canvas implementation
            Y.Graphic.NAME = "canvasGraphic";
            //reset mock series
            mockSeries._reset();
            series.drawPlots.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._mapSet, "The _setMap function should have been called.");
            Y.Assert.isTrue(mockSeries._hotspotAdded, "The _addHotspot function should have been called.");
            
            Y.Graphic.NAME = storedGraphicName;
            
            //change data to key that contains null
            valueKey = "close";
            //reset mock series
            mockSeries._reset();
            series.drawPlots.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
            Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");
           
            valueKey = "none";
            //reset mock series
            mockSeries._reset();
            series.drawPlots.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
            Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");
            
            //reset mock series
            mockSeries._reset();
            //catch some branches
            mockSeries.set("styles", {
                fill: {
                    colors: null,
                    alphas: null
                }
            });
            series.drawPlots.apply(mockSeries);
            Y.Assert.isTrue(mockSeries._markerCacheCreated, "The _createMarkerCache method should have been called.");
            Y.Assert.isTrue(mockSeries._markerCacheCleared, "The _clearMarkerCache method should have been called.");
        },

        "test: _setStyles()" : function() {
            var series = this.series,
                prop,
                style,
                key,
                i,
                len,
                testStyles1 = {
                    border: {
                        weight: 1,
                        colors: ["#000"],   
                        colors: ["#dc143c", "#c41e3a", "#000080", "#fa4a1e", "#ee0000"]
                    },
                    fill: {
                        color: ["#0000ff", "#800080", "#0f4d92", "#d21d66", "#ffd700"], 
                        alphas: [1]
                    }
                },
                testStyles2 = {
                    border: {
                        weight: 2,
                        colors: ["#8b1a1a", "#ffa858", "#800000", "#000000", "#ff0000"]
                    },
                    fill: {
                        colors: ["#dc143c", "#c41e3a", "#000080", "#fa4a1e", "#ee0000"],
                        alphas: [0.5]
                    }
                },
                styleProp,
                setStyles,
                setStyle,
                setStyleProp;
            series.set("styles", {
                marker: testStyles1
            });
            setStyles = series.get("styles").marker;
            for(key in testStyles1) {
                if(testStyles1.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The marker property of the styles attribute should contain a value for " + key + ".");
                    style = testStyles1[key];
                    setStyle = setStyles[key];
                    for(prop in style)
                    {
                        styleProp = style[prop];
                        setStyleProp = setStyle[prop];
                        if(Y.Lang.isArray(styleProp)) {
                            len = styleProp.length;
                            for(i = 0; i < len; i = i + 1) {
                                Y.Assert.areEqual(
                                    styleProp[i], setStyleProp[i], 
                                    "The " + i + " index of the " + styleProp + " property of the styles." + key + " object should equal " + styleProp[i] + "."
                                );
                            }
                        } else {
                            Y.Assert.areEqual(styleProp, setStyleProp, "The " + prop + " property of the styles." + key + " object should equal " + styleProp + ".");
                        }
                    }
                }
            }
            series.set("styles", testStyles2);
            setStyles = series.get("styles").marker;
            for(key in testStyles2) {
                if(testStyles2.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The marker property of the styles attribute should contain a value for " + key + ".");
                    style = testStyles2[key];
                    setStyle = setStyles[key];
                    for(prop in style)
                    {
                        styleProp = style[prop];
                        setStyleProp = setStyle[prop];
                        if(Y.Lang.isArray(styleProp)) {
                            len = styleProp.length;
                            for(i = 0; i < len; i = i + 1) {
                                Y.Assert.areEqual(
                                    styleProp[i], setStyleProp[i], 
                                    "The " + i + " index of the " + styleProp + " property of the styles." + key + " object should equal " + styleProp[i] + "."
                                );
                            }
                        } else {
                            Y.Assert.areEqual(styleProp, setStyleProp, "The " + prop + " property of the styles." + key + " object should equal " + styleProp + ".");
                        }
                    }
                }
            }
        },
   
        "test: addHotspot()" : function() {
            var AddHotspotMockSeries = Y.Base.create("addHotspotMockSeries", Y.Base, [], {
                    init: function() {
                        this._map = document.createElement("map");
                        this._areaNodes = [];  
                        AddHotspotMockSeries.superclass.init.apply(this, arguments); 
                    }
                }),
                mockSeries = new AddHotspotMockSeries(),
                series = this.series,
                getCoords = function(cfg) {
                    var i = 1,
                        x = cfg.cx,
                        y = cfg.cy,
                        arc = cfg.arc,
                        startAngle = cfg.startAngle - arc,
                        endAngle = cfg.startAngle,
                        radius = cfg.radius,
                        ax = x + Math.cos(startAngle / 180 * Math.PI) * radius,
                        ay = y + Math.sin(startAngle / 180 * Math.PI) * radius,
                        bx = x + Math.cos(endAngle / 180 * Math.PI) * radius,
                        by = y + Math.sin(endAngle / 180 * Math.PI) * radius,
                        numPoints = Math.floor(arc/10) - 1,
                        divAngle = (arc/(Math.floor(arc/10)) / 180) * Math.PI,
                        angleCoord = Math.atan((ay - y)/(ax - x)),
                        pts = [x, y, ax, ay],
                        cosAng,
                        sinAng,
                        multDivAng;
                    for(i = 1; i <= numPoints; ++i)
                    {
                        multDivAng = divAngle * i;
                        cosAng = Math.cos(angleCoord + multDivAng);
                        sinAng = Math.sin(angleCoord + multDivAng);
                        if(startAngle <= 90)
                        {
                            pts.push((x + (radius * Math.cos(angleCoord + (divAngle * i)))));
                            pts.push((y + (radius * Math.sin(angleCoord + (divAngle * i)))));
                        }
                        else
                        {
                            pts.push((x - (radius * Math.cos(angleCoord + (divAngle * i)))));
                            pts.push((y - (radius * Math.sin(angleCoord + (divAngle * i)))));
                        }
                    }
                    pts.push(bx);
                    pts.push(by);
                    pts.push(x);
                    pts.push(y);
                    return pts; 
                },
                testCoords,
                resultCoords,
                i,
                len,
                cfg1 = {
                    arc: 120,
                    cx: 175,
                    cy: 175,
                    startAngle: 30,
                    radius: 175
                },
                cfg2 = {
                    arc: 45,
                    cx: 175,
                    cy: 175,
                    startAngle: 180,
                    radius: 175
                },
                closeEnough = function(expected, actual) { // compensates for rounding that occurs in IE 
                    return (Math.abs(expected - actual) < 2);
                };
            series._addHotspot.apply(mockSeries, [
                cfg1,
                0,
                0
            ]);
            Y.Assert.areEqual(1, mockSeries._areaNodes.length, "The length of the _areaNodes property should be 1.");
            Y.Assert.areEqual(1, mockSeries._areaNodes[0].nodeType, "The 0 index of the _areaNodes array should be an element node.");
            testCoords = getCoords(cfg1);
            map = Y.one(mockSeries._areaNodes[0]);
            resultCoords = map.get("coords").split(",");
            len = Math.min(testCoords.length, resultCoords.length);
            for(i = 0; i < len; i = i + 1) {
                if(IE) {
                    Y.Assert.isTrue(closeEnough(testCoords[i], parseFloat(resultCoords[i])), "The coord should be " + testCoords[i] + " instead of " + resultCoords[i] + ".");
                } else {
                    Y.Assert.areEqual(testCoords[i], parseFloat(resultCoords[i]), "The coord should be the same.");
                }
            }
            series._addHotspot.apply(mockSeries, [
                cfg2,
                0,
                1
            ]);
            Y.Assert.areEqual(2, mockSeries._areaNodes.length, "The length of the _areaNodes property should be 2.");
            Y.Assert.areEqual(1, mockSeries._areaNodes[1].nodeType, "The 1 index of the _areaNodes array should be an element node.");
            testCoords = getCoords(cfg2);
            map = Y.one(mockSeries._areaNodes[1]);
            resultCoords = map.get("coords").split(",");
            len = Math.min(testCoords.length, resultCoords.length);
            for(i = 0; i < len; i = i + 1) {
                if(IE) {
                    Y.Assert.isTrue(closeEnough(testCoords[i], parseFloat(resultCoords[i])), "The coord should be the same.");
                } else {
                    Y.Assert.areEqual(testCoords[i], parseFloat(resultCoords[i]), "The coord should be the same.");
                }
            }
        },
    
        "test: updateMarkerState()" : function() {
            var updateMarkerStateMockMarker = Y.Base.create("updateMarkerStateMockMarker", Y.Base, [], {
                    indexStyles: null,

                    set: function(val) {
                        if(Y.Lang.isObject(val)) {
                            this.indexStyles = val;
                        }
                    }
                }),
                updateMarkerStateMockPieSeries = Y.Base.create("updateMarkerStateMockPieSeries", Y.PieSeries, [], {
                    _getState: function(val) {
                        return val;
                    }
                }),
                mockSeries = new updateMarkerStateMockPieSeries(),
                markerStyles,
                series = this.series,
                i,
                len = 10,
                markerStyles,
                getFillStyles = function(fill, index) {
                    return {
                        color: fill.colors[i % fill.colors.length],
                        alpha: fill.alphas[i % fill.alphas.length]
                    };  
                },
                testFill,
                resultFill;
            mockSeries.set("styles", {
                marker: {
                    over: {
                        fill: {
                            colors: ["#0f0", "#9aa", "#fc0", "#008"],
                            alphas: [0.5]
                        }
                    },
                    down: {
                        fill: {
                            colors: ["#008", "#fc0", "#9aa", "#0f0"],
                            alphas: [0.8]
                        }
                    }
                }
            });
            markerStyles = mockSeries.get("styles").marker;
            mockSeries._markers = [];
            for(i = 0; i < len; i = i + 1) {
                mockSeries._markers.push(new updateMarkerStateMockMarker());
            }
            for(i = 0; i < len; i = i + 1) {
                testFill = getFillStyles(markerStyles.fill, i);
                series.updateMarkerState.apply(mockSeries, ["off", i]);
                resultFill = mockSeries._markers[i].indexStyles.fill;
                Y.Assert.areEqual(testFill.color, resultFill.color, "The color should be " + testFill.color + ".");
                Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha should be " + testFill.alpha + ".");
                
                //over
                testFill = getFillStyles(markerStyles.over.fill, i);
                series.updateMarkerState.apply(mockSeries, ["over", i]);
                resultFill = mockSeries._markers[i].indexStyles.fill;
                Y.Assert.areEqual(testFill.color, resultFill.color, "The color should be " + testFill.color + ".");
                Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha should be " + testFill.alpha + ".");
                
                //down
                testFill = getFillStyles(markerStyles.down.fill, i);
                series.updateMarkerState.apply(mockSeries, ["down", i]);
                resultFill = mockSeries._markers[i].indexStyles.fill;
                Y.Assert.areEqual(testFill.color, resultFill.color, "The color should be " + testFill.color + ".");
                Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha should be " + testFill.alpha + ".");
            }
            //test branch with null marker
            series.updateMarkerState.apply(mockSeries, ["off", len]);
        },

        "test: _createMarker()" : function() {
            var PieSeriesCreateMarkerMockGraphic = Y.Base.create("pieSeriesCreateMarkerMockGraphic", Y.Base, [], {
                    styles: null,

                    addClass: function(val) {
                        //do nothing
                    },
                    addShape: function(val) {
                        this.styles = val;
                        return this;
                    }
                }),
                series = this.series,
                resultConfig,
                config = {
                    arc: 87.3,
                    cx: 175,
                    cy: 175,
                    width: 350,
                    height: 350,
                    radius: 175,
                    startAngle: 2.7,
                    border: {
                        alpha: 1,
                        color: "#205096",
                        weight: 0
                    },
                    fill: {
                        alpha: 1,
                        color: "#6084d0"
                    },
                    type: "pieSlice"
                },
                mockGraphic = new PieSeriesCreateMarkerMockGraphic();
            series.set("graphic", mockGraphic);
            series._createMarker.apply(series, [config]);
            resultConfig = mockGraphic.styles;
            Y.Assert.areEqual(config.arc, resultConfig.arc, "The arc should equal " + config.arc + ".");
            Y.Assert.areEqual(config.cx, resultConfig.cx, "The cx should equal " + config.cx + ".");
            Y.Assert.areEqual(config.cy, resultConfig.cy, "The cy should equal " + config.cy + ".");
            Y.Assert.areEqual(config.width, resultConfig.width, "The width should equal " + config.width + ".");
            Y.Assert.areEqual(config.height, resultConfig.height, "The height should equal " + config.height + ".");
            Y.Assert.areEqual(config.radius, resultConfig.radius, "The radius should equal " + config.radius + ".");
            Y.Assert.areEqual(config.startAngle, resultConfig.startAngle, "The startAngle should equal " + config.startAngle + ".");
            Y.Assert.areEqual(config.type, resultConfig.type, "The type should equal " + config.type + ".");
            Y.Assert.areEqual(config.border.alpha, resultConfig.border.alpha, "The border alpha should equal " + config.border.alpha + ".");
            Y.Assert.areEqual(config.border.color, resultConfig.border.color, "The border color should equal " + config.border.color + ".");
            Y.Assert.areEqual(config.fill.color, resultConfig.fill.color, "The fill color should equal " + config.fill.color + ".");
            Y.Assert.areEqual(config.fill.alpha, resultConfig.fill.alpha, "The fill alpha should equal " + config.fill.alpha + ".");
            Y.Assert.areEqual(config.border.color, resultConfig.border.color, "The border color should equal " + config.border.color + ".");
        },

        "test: _clearMarkerCache()" : function() {
            var series = this.series;
            series._markerCache = [
                Y.Node.create('div'),
                Y.Node.create('div'),
                null,
                Y.Node.create('div')
            ];
            Y.Assert.areEqual(4, series._markerCache.length, "There should be 4 items in the marker cache.");
            series._clearMarkerCache.apply(series);
            Y.Assert.areEqual(0, series._markerCache.length, "There should be 0 items in the marker cache.");
        },

        "test: _getPlotDefaults()" : function() {
            var series = this.series,
                fillColors = ["#66007f", "#a86f41", "#295454", "#996ab2", "#e8cdb7", "#90bdbd","#000000","#c3b8ca", "#968373", "#678585"],
                fillAlphas = ["1"],
                borderColors = ["#205096", "#b38206", "#000000", "#94001e", "#9d6fa0", "#e55b00", "#5e85c9", "#adab9e", "#6ac291", "#006457"],
                borderWeight = 0,
                borderAlpha = 1,
                padding = 0,
                resultBorderColors,
                resultFillColors,
                i,
                len = borderColors.length;
                resultPlotDefaults = series._getPlotDefaults.apply(series);
            Y.Assert.areEqual(padding, resultPlotDefaults.padding.top, "The top padding should be " + padding + ".");
            Y.Assert.areEqual(padding, resultPlotDefaults.padding.right, "The right padding should be " + padding + ".");
            Y.Assert.areEqual(padding, resultPlotDefaults.padding.bottom, "The bottom padding should be " + padding + ".");
            Y.Assert.areEqual(padding, resultPlotDefaults.padding.left, "The left padding should be " + padding + ".");
            Y.Assert.areEqual(borderWeight, resultPlotDefaults.border.weight, "The border weight should be " + borderWeight + ".");
            Y.Assert.areEqual(borderAlpha, resultPlotDefaults.border.alpha, "The border alpha should be " + borderAlpha + "."); 
            Y.Assert.areEqual(fillAlphas[0], resultPlotDefaults.fill.alphas[0], "The fill alpha should be " + fillAlphas[0] + ".");
            resultBorderColors = resultPlotDefaults.border.colors;
            resultFillColors = resultPlotDefaults.fill.colors;
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(borderColors[i], resultBorderColors[i], "The " + i + " index of the default border colors should be " + borderColors[i] + ".");
                Y.Assert.areEqual(fillColors[i], resultFillColors[i], "The " + i + " index of the default fill colors should be " + fillColors[i] + ".");
            }
        },

        "test: get('categoryDisplayName') set('categoryDisplayName')" : function() {
            var series = this.series,
                categoryKey = series.get("categoryKey"),
                setKey = "myCategoryKey";
            Y.Assert.areEqual(categoryKey, series.get("categoryDisplayName"), "The categoryDispayName attribute should be " + categoryKey + ".");
            series.set("categoryDisplayName", setKey);
            Y.Assert.areEqual(setKey, series.get("categoryDisplayName"), "The categoryDispayName attribute should be " + setKey + ".");
        },

        "test: get('valueDisplayName') set('valueDisplayName')" : function() {
            var series = this.series,
                valueKey = series.get("valueKey"),
                setKey = "myValueKey";
            Y.Assert.areEqual(valueKey, series.get("valueDisplayName"), "The categoryDispayName attribute should be " + valueKey + ".");
            series.set("valueDisplayName", setKey);
            Y.Assert.areEqual(setKey, series.get("valueDisplayName"), "The categoryDispayName attribute should be " + setKey + ".");
        }
    });
    
    suite.add(new Y.PieSeriesTest({
        name: "PieSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-numeric-base', 'axis-category-base', 'series-pie', 'chart-test-template']});
