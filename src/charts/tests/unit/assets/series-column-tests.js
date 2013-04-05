YUI.add('series-column-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: ColumnSeries");
    Y.ColumnSeriesTest = function() {
        Y.ColumnSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.ColumnSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.ColumnSeries();
        },

        tearDown: function() {
            this.series = null;
        },
        
        _getMarkerDimensions: function(xcoord, ycoord, calculatedSize, offset, bottomOrigin)
        {
            var config = {
                left: xcoord + offset
            };
            if(bottomOrigin >= ycoord)
            {
                config.top = ycoord;
                config.calculatedSize = bottomOrigin - config.top;
            }
            else
            {
                config.top = bottomOrigin;
                config.calculatedSize = ycoord - bottomOrigin;
            }
            return config;
        },
       
        "test: _getMarkerDimensions()" : function() {
            var series = this.series,
                testData,
                actualData,
                key,
                offset = 8;
                xcoord1 = 50,
                xcoord2 = 100,
                ycoord1 = 20,
                ycoord2 = 150,
                calculatedSize = "height",
                assertMarkerDimensionsAreEqual  = function() {
                    for(key in testData) {
                        if(testData.hasOwnProperty(key)) {
                            Y.Assert.isTrue(actualData.hasOwnProperty(key), "The _getMarkerDimensions method should have a value for " + key + ".");
                            Y.Assert.areEqual(testData[key], actualData[key], "The " + key + " property should equal " + testData[key] + ".");   
                        }
                    }
                };
            series._bottomOrigin = 100;
            actualData = series._getMarkerDimensions.apply(series, [xcoord1, ycoord1, calculatedSize, offset]);
            testData = this._getMarkerDimensions(xcoord1, ycoord1, calculatedSize, offset, series._bottomOrigin);
            assertMarkerDimensionsAreEqual();
            actualData = series._getMarkerDimensions.apply(series, [xcoord2, ycoord2, calculatedSize, offset]);
            testData = this._getMarkerDimensions(xcoord2, ycoord2, calculatedSize, offset, series._bottomOrigin);
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
                        x: {
                            getter: function() {
                                return this._x;
                            }   
                        }
                    }
                }),
                updateMarkerStateMockColumnSeries = Y.Base.create("updateMarkerStateMockColumnSeries", Y.ColumnSeries, [], {
                    _getState: function(val) {
                        return val;
                    }
                }, {
                    ATTRS: {   
                        xcoords: {
                            value: [20, 60, 100, 140, 180, 220, 260, 300, 340, 380]
                        },
                        ycoords: {}
                    }
                }),
                maxSize = 12,
                seriesTypeCollection = [],
                mockSeriesCollection = [
                    new updateMarkerStateMockColumnSeries({
                        order: 0,
                        graphOrder: 0,
                        ycoords: [280, 100, 60, 49, 38, 42, 120, 90, 45, 60],
                        seriesTypeCollection: seriesTypeCollection 
                    }),
                    new updateMarkerStateMockColumnSeries({
                        order: 1,
                        graphOrder: 1,
                        ycoords: [210, 150, 40, 89, 78, 142, 130, 80, 65, 90],
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
                markerXs,
                markerX,
                xslen,
                xsiterator,
                getX = function(allSeries, index, maxSize) {
                    var seriesSize = 0,
                        offset = 0,
                        markers,
                        marker,
                        seriesStyles,
                        len = allSeries.length,
                        i,
                        x,
                        xs = [],
                        xcoords;
                    for(i = 0; i < len; i = i + 1) {
                        xcoords = allSeries[i].get("xcoords");
                        xs[i] = xcoords[index] + seriesSize;
                        seriesStyles = allSeries[i].get("styles").marker;
                        seriesSize = seriesSize + Math.min(maxSize, seriesStyles.width);
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
                                xs[i] = xs[i] - seriesSize/2;
                            } else {
                                xs[i] = null;
                            }

                        }
                    }
                    return xs;
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
                    new updateMarkerStateMockColumnSeries({
                        order: 2,
                        graphOrder: 2,
                        ycoords: [null, null, null, null, null, null, null, null, null, null],
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
                        markerXs = getX(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerXs[seriesIterator], marker.get("x"), "The x attribute should be " + markerXs[xsiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct x attribute
                        for(xsiterator = 0; xsiterator < len; xsiterator = xsiterator + 1) {
                            markerX = markerXs[xsiterator];
                            if(markerX && markerX !== undefined) {
                                Y.Assert.areEqual(markerX, seriesTypeCollection[xsiterator]._markers[markerIterator].get("x"), "The x attribute of the marker should be " + markerX + ".");
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
                        markerXs = getX(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerXs[seriesIterator], marker.get("x"), "The x attribute should be " + markerXs[xsiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct x attribute
                        for(xsiterator = 0; xsiterator < len; xsiterator = xsiterator + 1) {
                            markerX = markerXs[xsiterator];
                            if(markerX && markerX !== undefined) {
                                Y.Assert.areEqual(markerX, seriesTypeCollection[xsiterator]._markers[markerIterator].get("x"), "The x attribute of the marker should be " + markerX + ".");
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
                        markerXs = getX(seriesTypeCollection, markerIterator, mockSeries._maxSize);
                        Y.Assert.areEqual(markerXs[seriesIterator], marker.get("x"), "The x attribute should be " + markerXs[xsiterator] + ".");
                        //loop through each series and ensure the marker for the marker index has the correct x attribute
                        for(xsiterator = 0; xsiterator < len; xsiterator = xsiterator + 1) {
                            markerX = markerXs[xsiterator];
                            if(markerX && markerX !== undefined) {
                                Y.Assert.areEqual(markerX, seriesTypeCollection[xsiterator]._markers[markerIterator].get("x"), "The x attribute of the marker should be " + markerX + ".");
                            }
                        }
                    }
                }
                //test branch with null marker
                series.updateMarkerState.apply(mockSeries, ["off", markerNum]);
            }
        }
            
    });
    
    suite.add(new Y.ColumnSeriesTest({
        name: "ColumnSeries Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-column', 'chart-test-template']});
