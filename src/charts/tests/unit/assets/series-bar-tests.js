YUI.add('series-bar-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: BarSeries");
    Y.BarSeriesTest = function() {
        Y.BarSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.BarSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.BarSeries();
        },

        tearDown: function() {
            this.series = null;
        },
        
        _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset, leftOrigin)
        {
            var config = {
                top: ycoord + offset
            };
            if(xcoord >= leftOrigin)
            {
                config.left = leftOrigin;
                config.calculatedSize = xcoord - config.left;
            }
            else
            {
                config.left = xcoord;
                config.calculatedSize = leftOrigin - xcoord;
            }
            return config;
        },
       
        "test: _getMarkerDimensions()" : function() {
            var series = this.series,
                testData,
                actualData,
                key,
                offset = 8;
                xcoord1 = 150,
                xcoord2 = 20,
                ycoord1 = 100,
                ycoord2 = 50,
                calculatedSize = "width",
                assertMarkerDimensionsAreEqual  = function() {
                    for(key in testData) {
                        if(testData.hasOwnProperty(key)) {
                            Y.Assert.isTrue(actualData.hasOwnProperty(key), "The _getMarkerDimensions method should have a value for " + key + ".");
                            Y.Assert.areEqual(testData[key], actualData[key], "The " + key + " property should equal " + testData[key] + ".");   
                        }
                    }
                };
            series._leftOrigin = 30;
            actualData = series._getMarkerDimensions.apply(series, [xcoord1, ycoord1, calculatedSize, offset]);
            testData = this._getMarkerDimensions(xcoord1, ycoord1, calculatedSize, offset, series._leftOrigin);
            assertMarkerDimensionsAreEqual();
            actualData = series._getMarkerDimensions.apply(series, [xcoord2, ycoord2, calculatedSize, offset]);
            testData = this._getMarkerDimensions(xcoord2, ycoord2, calculatedSize, offset, series._leftOrigin);
            assertMarkerDimensionsAreEqual();
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
                                return this._y;
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
                getY = function(allSeries, index, maxSize) {
                    var seriesSize = 0,
                        offset = 0,
                        markers,
                        marker,
                        seriesStyles,
                        len = allSeries.length,
                        i,
                        y,
                        ys = [],
                        ycoords;
                    for(i = 0; i < len; i = i + 1) {
                        ycoords = allSeries[i].get("ycoords");
                        ys[i] = ycoords[index] + seriesSize;
                        seriesStyles = allSeries[i].get("styles").marker;
                        seriesSize = seriesSize + Math.min(maxSize, seriesStyles.height);
                        if(index > i) {
                            offset = seriesSize;
                        }
                        offset = offset - seriesSize/2;
                    }
                    for(i = 0; i < len; i = i + 1) {
                        markers = allSeries[i].get("markers");
                        if(markers) {
                            marker = markers[index];
                            if(marker && marker !== undefined) {
                                ys[i] = ys[i] - seriesSize/2;
                            } else {
                                ys[i] = null;
                            }

                        }
                    }
                    return ys;
                },
                resultFill;
            for(seriesIterator = 0; seriesIterator < len; seriesIterator = seriesIterator + 1) {
                mockSeries = mockSeriesCollection[seriesIterator];
                mockSeries._markers = [];
                seriesTypeCollection.push(mockSeries);
                mockSeries.set("styles", {
                    marker: {
                        over: {
                            fill: {
                                color: "#0f0",
                                alpha: 0.5
                            }
                        },
                        down: {
                            fill: {
                                color: "#008",
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
                    if(marker) {
                        resultFill = marker.indexStyles.fill;
                        //ensure no markers are highlighted
                        Y.Assert.areEqual(testFill.color, resultFill.color, "The color of the selected series marker should be " + testFill.color + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        markerYs = getY(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerYs[seriesIterator], marker.get("y"), "The y attribute should be " + markerYs[ysiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct y attribute
                        for(ysiterator = 0; ysiterator < len; ysiterator = ysiterator + 1) {
                            markerY = markerYs[ysiterator];
                            if(markerY && markerY !== undefined) {
                                Y.Assert.areEqual(markerY, seriesTypeCollection[ysiterator]._markers[markerIterator].get("y"), "The y attribute of the marker should be " + markerY + ".");
                            }
                        }
                    }

                }
                testFill = markerStyles.over.fill;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    series.updateMarkerState.apply(mockSeries, ["over", markerIterator]);
                    marker = mockSeries._markers[markerIterator];
                    if(marker) {
                        resultFill = marker.indexStyles.fill;
                        //the current series' current marker should be highlighted with specified "over" styles
                        Y.Assert.areEqual(testFill.color, resultFill.color, "The color of the selected series marker should be " + testFill.color + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        markerYs = getY(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerYs[seriesIterator], marker.get("y"), "The y attribute should be " + markerYs[ysiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct y attribute
                        for(ysiterator = 0; ysiterator < len; ysiterator = ysiterator + 1) {
                            markerY = markerYs[ysiterator];
                            if(markerY && markerY !== undefined) {
                                Y.Assert.areEqual(markerY, seriesTypeCollection[ysiterator]._markers[markerIterator].get("y"), "The y attribute of the marker should be " + markerY + ".");
                            }
                        }
                    }
                }
                testFill = markerStyles.down.fill;
                for(markerIterator = 0; markerIterator < markerNum; markerIterator = markerIterator + 1) {
                    series.updateMarkerState.apply(mockSeries, ["down", markerIterator]);
                    marker = mockSeries._markers[markerIterator];
                    if(marker) {
                        resultFill = marker.indexStyles.fill;
                        //the current series' current marker should be highlighted with specified "down" styles
                        Y.Assert.areEqual(testFill.color, resultFill.color, "The color of the selected series marker should be " + testFill.color + ".");
                        Y.Assert.areEqual(testFill.alpha, resultFill.alpha, "The alpha of the selected series marker should be " + testFill.alpha + ".");
                        markerYs = getY(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerYs[seriesIterator], marker.get("y"), "The y attribute should be " + markerYs[ysiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct y attribute
                        for(ysiterator = 0; ysiterator < len; ysiterator = ysiterator + 1) {
                            markerY = markerYs[ysiterator];
                            if(markerY && markerY !== undefined) {
                                Y.Assert.areEqual(markerY, seriesTypeCollection[ysiterator]._markers[markerIterator].get("y"), "The y attribute of the marker should be " + markerY + ".");
                            }
                        }
                    }
                }
                //test branch with null marker
                series.updateMarkerState.apply(mockSeries, ["off", markerNum]);
            }
        }
            
    });
    
    suite.add(new Y.BarSeriesTest({
        name: "BarSeries Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-bar', 'chart-test-template']});
