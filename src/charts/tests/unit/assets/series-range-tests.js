YUI.add('series-range-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: RangeSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.RangeSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.RangeSeries, this.series, "The series should be and instanceof RangeSeries.");
            Y.Assert.areEqual("range", this.series.get("type"), "The series type attribute should be range.");
        },

        "test: drawSeries()" : function() {
            var width = 400,
                RangeMockSeries = Y.Base.create("rangeMockSeries", Y.RangeSeries, [], {
                    _drawMarkers: function(xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles) {
                        this._drawMarkersArgs = {
                            xcoords: xcoords, 
                            opencoords: opencoords,
                            highcoords: highcoords,
                            lowcoords: lowcoords,
                            closecoords: closecoords,
                            len: len,
                            width: width,
                            halfwidth: halfwidth,
                            styles: styles  
                        };
                    }
                }, {
                    ATTRS: {
                        width: {
                            getter: function() {
                                return width;   
                            }
                        }
                    }
                }),
                series = this.series,
                mockSeries = new RangeMockSeries(),
                xcoords = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
                ycoords = {
                    open: [20, 21, 20, 19, 18, 19, 20, 21, 20, 21, 22, 21],
                    high: [21, 22, 22, 22, 25, 23, 26, 27, 29, 25, 30, 29],
                    low: [19, 20, 20, 19, 16, 18, 17, 16, 18, 18, 21, 20],
                    close:[19, 21, 21, 22, 23, 20, 22, 23, 21, 19, 23, 26]
                },
                len = xcoords.length,
                i,
                dataWidth,
                padding,
                markerWidth,
                halfwidth,
                styles,
                resultOpenCoords,
                resultHighCoords,
                resultLowCoords,
                resultCloseCoords,
                drawMarkersArgs;
            mockSeries.set("xcoords", xcoords);
            mockSeries.set("ycoords", ycoords);
            mockSeries.set("width", width);
            styles = mockSeries.get("styles");
            dataWidth = width - (styles.padding.left + styles.padding.right);
            markerWidth = dataWidth/len;
            halfwidth = markerWidth/2;
            series.drawSeries.apply(mockSeries);
            drawMarkersArgs = mockSeries._drawMarkersArgs;
            
            resultOpenCoords = drawMarkersArgs.opencoords;
            resultHighCoords = drawMarkersArgs.highcoords;
            resultLowCoords = drawMarkersArgs.lowcoords;
            resultCloseCoords = drawMarkersArgs.closecoords;
            resultXCoords = drawMarkersArgs.xcoords;
            Y.Assert.areEqual(len, drawMarkersArgs.len, "The len argument should equal " + len);
            Y.Assert.areEqual(markerWidth, drawMarkersArgs.width, "The width argument should equal " + markerWidth + ".");
            Y.Assert.areEqual(halfwidth, drawMarkersArgs.halfwidth, "The halfwidth argument should equal " + halfwidth + ".");
            Y.Assert.areEqual(styles, drawMarkersArgs.styles, "The styles argument sholud equal " + styles + ".");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(xcoords[i], resultXCoords[i], "The " + i + " index of the xcoords argument should equal " + xcoords[i] + ".");
                Y.Assert.areEqual(ycoords.open[i], resultOpenCoords[i], "The " + i + " index of the opencoords argument should equal " + ycoords.open[i] + ".");
                Y.Assert.areEqual(ycoords.high[i], resultHighCoords[i], "The " + i + " index of the highcoords argument should equal " + ycoords.high[i] + ".");
                Y.Assert.areEqual(ycoords.low[i], resultLowCoords[i], "The " + i + " index of the lowcoords argument should equal " + ycoords.low[i] + ".");
                Y.Assert.areEqual(ycoords.close[i], resultCloseCoords[i], "The " + i + " index of the closecoords argument should equal " + ycoords.close[i] + ".");
            }
        }
    });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-range']});
