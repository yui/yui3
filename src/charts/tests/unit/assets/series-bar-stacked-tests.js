YUI.add('series-bar-stacked-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: StackedBarSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.StackedBarSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.StackedBarSeries, this.series, "The series should be and instanceof StackedBarSeries.");
            Y.Assert.areEqual("stackedBar", this.series.get("type"), "The series type attribute should be stackedBar.");
        },

        "test: updateMarkerState()" : function() {
            var series = this.series,
                updateMarkerStateMockMarker = Y.Base.create("updateMarkerStateMockMarker", Y.Base, [], {
                    indexStyles: null,

                    set: function(prop, val) {
                        
                        if(Y.Lang.isObject(prop)) {
                            this.indexStyles = prop;
                        } else {
                            this["_" + prop] = val;
                        }

                    }
                }, {
                    ATTRS: {
                        y: {
                            getter: function() {
                                return this.indexStyles.y;
                            }   
                        }
                    }
                }),
                updateMarkerStateMockBarSeries = Y.Base.create("updateMarkerStateMockBarSeries", Y.BarSeries, [], {
                    _getState: function(val) {
                        return val;
                    }
                }, {
                    ATTRS: {   
                        xcoords: {},
                        ycoords: {
                            value: [380, 340, 300, 260, 220, 180, 140, 100, 60, 20]
                        }
                    }
                }),
                maxSize = 12,
                seriesTypeCollection = [],
                mockSeriesCollection = [
                    new updateMarkerStateMockBarSeries({
                        order: 0,
                        graphOrder: 0,
                        xcoords: [280, 100, 60, 49, 38, 42, 120, 90, 45, 60],
                        seriesTypeCollection: seriesTypeCollection 
                    }),
                    new updateMarkerStateMockBarSeries({
                        order: 1,
                        graphOrder: 1,
                        xcoords: [210, 150, 40, 89, 78, 142, 130, 80, 65, 90],
                        seriesTypeCollection: seriesTypeCollection   
                    })
                ],
                markerStyles,
                series,
                mockSeries,
                seriesIterator,
                markerIterator,
                len = mockSeriesCollection.length,
                markerNum = 10,
                marker,
                markerStyles,
                testFill,
                markerYs,
                markerY,
                yslen,
                ysiterator,
                overColors = [
                    "#f00",
                    ["#9aa", "#0f0", "#00f", "#999", "#a9a", "#a0a0a0", "#f0f", "#c0c0ff", "#800000", "#800080"]
                ],
                downColors = [
                    "#00f",
                    ["#a0a0a0", "#f0f", "#c0c0ff", "#800000", "#a9a", "#800080", "#999", "#f00", "#0f0", "#9aa"]

                ],
                fillColor,
                borderColor,
                resultFill;
            for(seriesIterator = 0; seriesIterator < len; seriesIterator = seriesIterator + 1) {
                mockSeries = mockSeriesCollection[seriesIterator];
                mockSeries._markers = [];
                seriesTypeCollection.push(mockSeries);
                mockSeries.set("styles", {
                    marker: {
                        over: {
                            fill: {
                                color: overColors[seriesIterator],
                                alpha: 0.5
                            }
                        },
                        down: {
                            fill: {
                                color: downColors[seriesIterator],
                                alpha: 0.8
                            }
                        }
                    }
                });
                mockSeries._maxSize = maxSize;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    //hit the branch with an invalid marker
                    if(seriesIterator > 0 && markerIterator === 3) {
                        mockSeries._markers.push(null);
                    } else {
                        mockSeries._markers.push(new updateMarkerStateMockMarker());
                    }
                }
            }
            seriesTypeCollection.push(
                    new updateMarkerStateMockBarSeries({
                        order: 2,
                        graphOrder: 2,
                        xcoords: [null, null, null, null, null, null, null, null, null, null],
                        seriesTypeCollection: seriesTypeCollection   
                    })
            );
            for(seriesIterator = 0; seriesIterator < len; seriesIterator = seriesIterator + 1) {
                mockSeries = mockSeriesCollection[seriesIterator];
                markerStyles = mockSeries.get("styles").marker;
                testFill = markerStyles.fill;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    series.updateMarkerState.apply(mockSeries, ["off", markerIterator]);
                    marker = mockSeries._markers[markerIterator];
                    markerYs = mockSeries.get("ycoords");
                    if(marker) {
                        fillColor = Y.Lang.isArray(testFill.color) ? testFill.color[markerIterator] : testFill.color;
                        resultFill = marker.indexStyles.fill;
                        markerY = markerYs[markerIterator] - markerStyles.height/2;
                        //ensure no markers are highlighted
                        Y.Assert.areEqual(fillColor, resultFill.color, "The color of the selected series marker should be " + fillColor + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        Y.Assert.areEqual(markerY, marker.get("y"), "The y attribute should be " + markerY + ".");
                    }
                }
                testFill = markerStyles.over.fill;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    series.updateMarkerState.apply(mockSeries, ["over", markerIterator]);
                    marker = mockSeries._markers[markerIterator];
                    markerYs = mockSeries.get("ycoords");
                    if(marker) {
                        fillColor = Y.Lang.isArray(testFill.color) ? testFill.color[markerIterator] : testFill.color;
                        resultFill = marker.indexStyles.fill;
                        markerY = markerYs[markerIterator] - markerStyles.height/2;
                        //the current series' current marker should be highlighted with specified "over" styles
                        Y.Assert.areEqual(fillColor, resultFill.color, "The color of the selected series marker should be " + fillColor + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        Y.Assert.areEqual(markerY, marker.get("y"), "The y attribute should be " + markerY + ".");
                    }
                }
                testFill = markerStyles.down.fill;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    series.updateMarkerState.apply(mockSeries, ["down", markerIterator]);
                    marker = mockSeries._markers[markerIterator];
                    markerYs = mockSeries.get("ycoords");
                    if(marker) {
                        fillColor = Y.Lang.isArray(testFill.color) ? testFill.color[markerIterator] : testFill.color;
                        resultFill = marker.indexStyles.fill;
                        markerY = markerYs[markerIterator] - markerStyles.height/2;
                        //the current series' current marker should be highlighted with specified "down" styles
                        Y.Assert.areEqual(fillColor, resultFill.color, "The color of the selected series marker should be " + fillColor + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        Y.Assert.areEqual(markerY, marker.get("y"), "The y attribute should be " + markerY + ".");
                    }
                }
                //test branch with null marker
                series.updateMarkerState.apply(mockSeries, ["off", markerNum]);
            }
        },

        "test: _getPlotDefaults()" : function() {
            var series = this.series,
                fillColor = series._getDefaultColor(series.get("graphOrder"), "fill"),
                borderColor = series._getDefaultColor(series.get("graphOrder"), "border"),
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
                testWidth = 24,
                testHeight = 24,
                testShape = "rect",
                plotDefaults = series._getPlotDefaults(),
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
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-bar-stacked']});
