YUI.add('series-ohlc-tests', function(Y) {
    function OHLCMockShape() {
        this._path = "";
        this._command = "";
        this._inBack = false;
        this._destroyed = false;
    }
    OHLCMockShape.prototype = {
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
    var OHLCMockSeries = Y.Base.create("ohlcMockSeries", Y.OHLCSeries, [], {
        }, {
            ATTRS: {
                upmarker: {
                    valueFn: function() {
                        return new OHLCMockShape();
                    }
                },
                downmarker: {
                    valueFn: function() {
                        return new OHLCMockShape();
                    }
                }
            }
        }),
        suite = new Y.Test.Suite("Charts: OHLCSeries"),
        seriesTest = new Y.Test.Case({
        setUp: function() {
            this.series = new Y.OHLCSeries();
        },

        tearDown: function() {
            this.series = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.OHLCSeries, this.series, "The series should be and instanceof OHLCSeries.");
            Y.Assert.areEqual("ohlc", this.series.get("type"), "The series type attribute should be ohlc.");
        },

        "test: drawMarkers()" : function() {
            var width = 400,
                upmarkerpath = "",
                downmarkerpath = "",
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
                        height,
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
                        height = lowcoord - highcoord;
                        if(up) {
                            upmarkerpath = upmarkerpath + " M" + left + " " + opencoord + " L" + cx + " " + opencoord + " M" + cx + " " + highcoord + " L" + cx + " " + lowcoord + " M" + cx + " " + closecoord + " L" + right + " " + closecoord;
                        } else {
                            downmarkerpath = downmarkerpath + " M" + left + " " + opencoord + " L" + cx + " " + opencoord + " M" + cx + " " + highcoord + " L" + cx + " " + lowcoord + " M" + cx + " " + closecoord + " L" + right + " " + closecoord; 
                        }
                    }
                },
                series = this.series,
                mockSeries = new OHLCMockSeries(),
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
                styles,
            styles = mockSeries.get("styles");
            dataWidth = width - (styles.padding.left + styles.padding.right);
            markerWidth = dataWidth/len;
            halfwidth = markerWidth/2;
            series._drawMarkers.apply(mockSeries, [xcoords, opencoords, highcoords, lowcoords, closecoords, len, width, halfwidth, styles]);
            drawPaths();
            Y.Assert.areEqual(upmarkerpath, mockSeries.get("upmarker")._path, "The path for the upmarker should be " + upmarkerpath + ".");
            Y.Assert.areEqual(downmarkerpath, mockSeries.get("downmarker")._path, "The path for the downmarker should be " + downmarkerpath + ".");
        },

        "test: toggleVisible()" : function() {
            var series = this.series, 
                mockSeries = new OHLCMockSeries();
            series._toggleVisible.apply(mockSeries, [false]);
            Y.Assert.isFalse(mockSeries.get("upmarker").get("visible"), "The visible attribute for upmarker should be false.");
            Y.Assert.isFalse(mockSeries.get("downmarker").get("visible"), "The visible attribute for downmarker should be false.");
            series._toggleVisible.apply(mockSeries, [true]);
            Y.Assert.isTrue(mockSeries.get("upmarker").get("visible"), "The visible attribute for upmarker should be true.");
            Y.Assert.isTrue(mockSeries.get("downmarker").get("visible"), "The visible attribute for downmarker should be true.");
        },

        "test: set(graphic)" : function() {
            var series = this.series,
                mydiv = document.createElement('div'),
                graphic;
            Y.one('body').append(mydiv);    
            graphic = new Y.Graphic({
                render: mydiv
            });
            series.set("graphic", graphic);
            Y.Assert.isInstanceOf(Y.Path, series.get("upmarker"));
            Y.Assert.isInstanceOf(Y.Path, series.get("downmarker"));
            series.set("upmarker", null);
            series.set("downmarker", null);
            series.set("graphic", graphic);
            Y.Assert.isInstanceOf(Y.Path, series.get("upmarker"));
            Y.Assert.isInstanceOf(Y.Path, series.get("downmarker"));
        },

        "test: destructor()" : function() {
            var series = this.series,
                mockSeries = new OHLCMockSeries();
            Y.Assert.isFalse(mockSeries.get("upmarker")._destroyed, "The upmarker should not be destroyed.");
            Y.Assert.isFalse(mockSeries.get("downmarker")._destroyed, "The downmarker should not be destroyed.");
            series.destructor.apply(mockSeries); 
            Y.Assert.isTrue(mockSeries.get("upmarker")._destroyed, "The upmarker should be destroyed.");
            Y.Assert.isTrue(mockSeries.get("downmarker")._destroyed, "The downmarker should be destroyed.");
            //get some branches
            mockSeries.set("upmarker", null);
            mockSeries.set("downmarker", null);
            series.destructor.apply(mockSeries); 
        }
    });
    suite.add(seriesTest);
    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-ohlc']});
