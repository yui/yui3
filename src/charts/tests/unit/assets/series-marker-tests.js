YUI.add('series-marker-tests', function(Y) {
    var MockMarkerSeries = Y.Base.create("mockMarkerSeries", Y.MarkerSeries, [], {
            _markersDrawn: false,

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: MarkerSeries");
    Y.MarkerSeriesTest = function() {
        Y.MarkerSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.MarkerSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.MarkerSeries();
        },

        tearDown: function() {
            this.series = null;
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockMarkerSeries = new MockMarkerSeries();
            series.drawSeries.apply(mockMarkerSeries);
            Y.Assert.isTrue(mockMarkerSeries._markersDrawn, "The drawPlots method should have been called.");     
        },

        "test: _setStyles()" : function() {
            var series = this.series,
                prop,
                style,
                key,
                testStyles1 = {
                    border: {
                        weight: 1,
                        color: "#000"   
                    },
                    fill: {
                        color: "#f00",
                        alpha: 1
                    }
                },
                testStyles2 = {
                    border: {
                        weight: 2,
                        color: "#fc0"
                    },
                    fill: {
                        color: "#00f",
                        alpha: 0.5
                    }
                },
                setStyles;
            series.set("styles", {
                marker: testStyles1
            });
            setStyles = series.get("styles").marker;
            for(key in testStyles1) {
                if(testStyles1.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The marker property of the styles attribute should contain a value for " + key + ".");
                    style = testStyles1[key];
                    for(prop in style)
                    {
                        Y.Assert.areEqual(style[prop], setStyles[key][prop], "The " + prop + " property of the styles." + key + " object should equal " + style[prop] + ".");
                    }
                }
            }
            series.set("styles", testStyles2);
            setStyles = series.get("styles").marker;
            for(key in testStyles2) {
                if(testStyles2.hasOwnProperty(key)) {
                    Y.Assert.isTrue(setStyles.hasOwnProperty(key), "The marker property of the styles attribute should contain a value for " + key + ".");
                    style = testStyles2[key];
                    for(prop in style)
                    {
                        Y.Assert.areEqual(style[prop], setStyles[key][prop], "The " + prop + " property of the styles." + key + " object should equal " + style[prop] + ".");
                    }
                }
            }
        }
    });
    
    suite.add(new Y.MarkerSeriesTest({
        name: "MarkerSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-marker', 'chart-test-template']});
