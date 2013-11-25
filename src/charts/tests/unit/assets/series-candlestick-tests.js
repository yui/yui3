YUI.add('series-candlestick-tests', function(Y) {
    var DOC = Y.config.doc;
    function CandlestickMockShape() {
        this._path = "";
        this._command = "";
        this._inBack = false;
        this._destroyed = false;
    }
    CandlestickMockShape.prototype = {
        clear: function() {
            this._path = "";
            this._command = "";
        },
        moveTo: function(x, y) {
            if(this._command !== "M") {
                this._path = this._path + " M";
                this._command = "M";
            } else {
                this._path = this._path + " ";
            }
            this._path = this._path + x + " " + y;
        },
        lineTo: function(x, y) {
            if(this._command !== "L") {
                this._path = this._path + " L";
                this._command = "L";
            } else {
                this._path = this._path + " ";
            }
            this._path = this._path + x + " " + y;
        },
        drawRect: function(x, y, width, height) {
            this.moveTo(x, y);
            this.lineTo(width, y);
            this.lineTo(width, height);
            this.lineTo(x, height);
            this.lineTo(x, y);
        },
        toBack: function() {
            this._inBack = true;
        },
        end: function() {},

        set: function() {
            if(arguments[0] === "visible") {
                this._visible = arguments[1];
            } else {
                this._styles = arguments[0];
            }
        },
        get: function(val) {
            return this["_" + val];
        },
        destroy: function() {
            this._destroyed = true;
        }
    };
    var CandlestickMockSeries = Y.Base.create("candlestickMockSeries", Y.CandlestickSeries, [], {
        }, {
            ATTRS: {
                upcandle: {
                    valueFn: function() {
                        return new CandlestickMockShape();
                    }
                },
                downcandle: {
                    valueFn: function() {
                        return new CandlestickMockShape();
                    }
                },
                wick: {
                    valueFn: function() {
                        return new CandlestickMockShape();
                    }
                }
            }
        }),
        suite = new Y.Test.Suite("Charts: CandlestickSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.CandlestickSeries();
        },

        tearDown: function() {
            this.series = null;
            Y.Event.purgeElement(DOC, false);
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.CandlestickSeries, this.series, "The series should be and instanceof CandlestickSeries.");
            Y.Assert.areEqual("candlestick", this.series.get("type"), "The series type attribute should be candlestick.");
        },

        "test: drawMarkers()" : function() {
            var width = 400,
                upcandlepath = "",
                downcandlepath = "",
                wickpath = "",
                drawPaths = function()
                {
                    var opencoord,
                        highcoord,
                        lowcoord,
                        closecoord,
                        left,
                        right,
                        top,
                        bottom,
                        leftPadding = styles.padding.left,
                        up;
                    for(i = 0; i < len; i = i + 1)
                    {
                        cx = xcoords[i] + leftPadding;
                        left = cx - halfwidth;
                        right = cx + halfwidth;
                        opencoord = opencoords[i];
                        highcoord = highcoords[i];
                        lowcoord = lowcoords[i];
                        closecoord = closecoords[i];
                        up = opencoord > closecoord;
                        top = up ? closecoord : opencoord;
                        bottom = up ? opencoord : closecoord; 
                        height = bottom - top;
                        candle = up ? upcandlepath : downcandlepath;
                        if(up) {
                            upcandlepath = upcandlepath + " M" + left + " " + top + " L" + width + " " + top + " " + width + " " + height + " " + left + " " + height + " " + left + " " + top;
                        } else {
                            downcandlepath = downcandlepath + " M" + left + " " + top + " L" + width + " " + top + " " + width + " " + height + " " + left + " " + height + " " + left + " " + top;
                        }
                        wickpath = wickpath + " M" + (cx - styles.wick.width/2) + " " + highcoord + " L" + styles.wick.width + " " + highcoord + " " + styles.wick.width + " " + (lowcoord - highcoord) + " " + (cx - styles.wick.width/2) + " " + (lowcoord - highcoord) + " " + (cx - styles.wick.width/2) + " " + highcoord;
                    }
                },
                series = this.series,
                mockSeries = new CandlestickMockSeries(),
                xcoords = [0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400],
                opencoords = [20, 21, 20, 19, 18, 19, 20, 21, 20, 21, 22, 21],
                highcoords = [21, 22, 22, 22, 25, 23, 26, 27, 29, 25, 30, 29],
                lowcoords = [19, 20, 20, 19, 16, 18, 17, 16, 18, 18, 21, 20],
                closecoords = [19, 21, 21, 22, 23, 20, 22, 23, 21, 19, 23, 26],
                len = xcoords.length,
                i,
                dataWidth,
                padding,
                markerWidth,
                halfwidth,
                styles = mockSeries.get("styles");
            dataWidth = width - (styles.padding.left + styles.padding.right);
            markerWidth = dataWidth/len;
            halfwidth = markerWidth/2;
            series._drawMarkers.apply(mockSeries, [xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles]);
            drawPaths();
            Y.Assert.areEqual(upcandlepath, mockSeries.get("upcandle")._path, "The path for the upcandle should be " + upcandlepath + ".");
            Y.Assert.areEqual(downcandlepath, mockSeries.get("downcandle")._path, "The path for the downcandle should be " + downcandlepath + ".");
            Y.Assert.areEqual(wickpath, mockSeries.get("wick")._path, "The path for the wick should be " + wickpath + ".");
            Y.Assert.isTrue(mockSeries.get("wick")._inBack, "The wick's toBack method should have been called.");
        },

        "test: toggleVisible()" : function() {
            var series = this.series, 
                mockSeries = new CandlestickMockSeries();
            series._toggleVisible.apply(mockSeries, [false]);
            Y.Assert.isFalse(mockSeries.get("upcandle").get("visible"), "The visible attribute for upcandle should be false.");
            Y.Assert.isFalse(mockSeries.get("downcandle").get("visible"), "The visible attribute for downcandle should be false.");
            Y.Assert.isFalse(mockSeries.get("wick").get("visible"), "The visible attribute for wick should be false.");
            series._toggleVisible.apply(mockSeries, [true]);
            Y.Assert.isTrue(mockSeries.get("upcandle").get("visible"), "The visible attribute for upcandle should be true.");
            Y.Assert.isTrue(mockSeries.get("downcandle").get("visible"), "The visible attribute for downcandle should be true.");
            Y.Assert.isTrue(mockSeries.get("wick").get("visible"), "The visible attribute for wick should be true.");
        },

        "test: set(graphic)" : function() {
            var series = this.series,
                mydiv = Y.DOM.create('<div id="testdiv">'),
                graphic;
            DOC.body.appendChild(mydiv);    
            graphic = new Y.Graphic({
                render: mydiv
            });
            series.set("graphic", graphic);
            Y.Assert.isInstanceOf(Y.Path, series.get("upcandle"));
            Y.Assert.isInstanceOf(Y.Path, series.get("downcandle"));
            Y.Assert.isInstanceOf(Y.Path, series.get("wick"));
            series.set("upcandle", null);
            series.set("downcandle", null);
            series.set("wick", null);
            series.set("graphic", graphic);
            Y.Assert.isInstanceOf(Y.Path, series.get("upcandle"));
            Y.Assert.isInstanceOf(Y.Path, series.get("downcandle"));
            Y.Assert.isInstanceOf(Y.Path, series.get("wick"));
            graphic.destroy();
        },

        "test: destructor()" : function() {
            var series = this.series,
                mockSeries = new CandlestickMockSeries();
            Y.Assert.isFalse(mockSeries.get("upcandle")._destroyed, "The upcandle should not be destroyed.");
            Y.Assert.isFalse(mockSeries.get("downcandle")._destroyed, "The downcandle should not be destroyed.");
            Y.Assert.isFalse(mockSeries.get("wick")._destroyed, "The wick should not be destroyed.");
            series.destructor.apply(mockSeries); 
            Y.Assert.isTrue(mockSeries.get("upcandle")._destroyed, "The upcandle should be destroyed.");
            Y.Assert.isTrue(mockSeries.get("downcandle")._destroyed, "The downcandle should be destroyed.");
            Y.Assert.isTrue(mockSeries.get("wick")._destroyed, "The wick should be destroyed.");
            //get some branches
            mockSeries.set("upcandle", null);
            mockSeries.set("downcandle", null);
            mockSeries.set("wick", null);
            series.destructor.apply(mockSeries); 
        }
    });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-candlestick']});
