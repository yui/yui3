YUI.add('series-base-tests', function(Y) {
    var DOC = Y.config.doc;
    Y.SeriesBaseTest = function() {
        Y.SeriesBaseTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.SeriesBaseTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.SeriesBase();
        },

        tearDown: function() {
            this.series = null;
            Y.Event.purgeElement(DOC, false);
        },
        
        "test: render()" : function() {
            var series = this.series,
                canvasSet = false,
                listenersSet = false,
                validated = false,
                RenderSeries = Y.Base.create("renderSeries", Y.SeriesBase, [], {
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

        "test: _setCanvas()" : function() {
            var series = this.series,
                graphicSet = false,
                MockSetCanvasSeries = Y.Base.create("mockSetCanvasSeries", Y.SeriesBase, [], {
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

        "test: getDefaultStyles()" : function() {
            var padding = this.series._getDefaultStyles().padding;
            Y.Assert.areEqual(0, padding.left, "The left padding should be zero.");
            Y.Assert.areEqual(0, padding.top, "The top padding should be zero.");
            Y.Assert.areEqual(0, padding.right, "The right padding should be zero.");
            Y.Assert.areEqual(0, padding.bottom, "The bottom padding should be zero.");
        },

        "test: _handleVisibleChange()" : function() {
            var visibleChanged = false,
                MockHandleVisibleChangeSeries = Y.Base.create("mockHandleVisibleChange", Y.SeriesBase, [], {
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
                GetTotalValuesMockSeries = Y.Base.create("getTotalValuesMockSeries", Y.SeriesBase, [], {}, {
                    ATTRS: Y.merge(Y.SeriesBase.ATTRS, {
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
            DestructorMockSeries = Y.Base.create("destructorMockSeries", Y.SeriesBase, [], {
                init: function() {
                    this._stylesChangeHandle = new Destroyer(this);
                    this._widthChangeHandle = new Destroyer(this);
                    this._heightChangeHandle = new Destroyer(this);
                    this._visibleChangeHandle = new Destroyer(this);
                    DestructorMockSeries.superclass.init.apply(this, arguments);
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
            Y.Assert.isTrue(mockSeries._stylesChangeHandle._attached, "The _stylesChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._widthChangeHandle._attached, "The _widthChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._heightChangeHandle._attached, "The _heightChangeHandle should be attached.");
            Y.Assert.isTrue(mockSeries._visibleChangeHandle._attached, "The _visibleChangeHandle should be attached.");
            mockSeries.set("rendered", true);
            series.destructor.apply(mockSeries);
            Y.Assert.isFalse(mockSeries._stylesChangeHandle._attached, "The _stylesChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._widthChangeHandle._attached, "The _widthChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._heightChangeHandle._attached, "The _heightChangeHandle should be detached.");
            Y.Assert.isFalse(mockSeries._visibleChangeHandle._attached, "The _visibleChangeHandle should be detached.");
            mockSeries.set("markers", []);
            series.destructor.apply(mockSeries); 
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
       
        "test: set('graphic')" : function() {
            var graphic = new Y.Graphic(),
                series = this.series;
            series.set("graphic", graphic);
            Y.Assert.areEqual(graphic, series.get("graphic"), "The series graphic has been set.");
            series.set("graphic", null);
            series.set("graphic", graphic);
            Y.Assert.areEqual(graphic, series.get("graphic"), "The series graphic has been set.");
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
            Y.Assert.isUndefined(series.get("chart"), "Calling get('chart') should return undefined.");
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

        "test: get('groupMarkers')" : function() {
            var series = this.series,
                mockGraph = {
                    get: function(val) {
                        if(val === "groupMarkers") {
                            return false;
                        }
                    }
                };
            Y.Assert.isUndefined(series.get("groupMarkers"), "The groupMarkers attribute should be undefined.");
            series.set("graph", mockGraph);
            Y.Assert.isFalse(series.get("groupMarkers"), "The graph instance has groupMarkers set to false.");
            series.set("groupMarkers", true);
            Y.Assert.isTrue(series.get("groupMarkers"), "The _groupMarkes property is set to true.");
        }
    });
    
    var suite = new Y.Test.Suite("Charts: SeriesBase");
    suite.add(new Y.SeriesBaseTest({
        name: "SeriesBase Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-numeric-base', 'axis-category-base', 'series-base', 'chart-test-template']});
