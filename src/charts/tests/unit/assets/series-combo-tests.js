YUI.add('series-combo-tests', function(Y) {
    var DOC = Y.config.doc,
        MockComboSeries = Y.Base.create("mockComboSeries", Y.Base, [], {
            _linesDrawn: false,
            
            _fillDrawn: false,

            _markersDrawn: false,

            _showAreaFill: false,

            _showLines: false,

            _showMarkers: false,


            _getClosingPoints: function() {
                return [true];
            },

            get: function(val) {
                return this["_" + val];
            },

            drawLines: function() {
                this._linesDrawn = true;
            },

            drawFill: function(val) {
                this._fillDrawn = val;
            },

            drawPlots: function() {
                this._markersDrawn = true;
            }
        }),
        suite = new Y.Test.Suite("Charts: ComboSeries");
    Y.ComboSeriesTest = function() {
        Y.ComboSeriesTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.ComboSeriesTest, Y.ChartTestTemplate, {
        setUp: function() {
            this.series = new Y.ComboSeries();
        },

        tearDown: function() {
            this.series.destroy();
            Y.Event.purgeElement(DOC, false);
        },
       
        "test: drawSeries()" : function() {
            var series = this.series,
                mockComboSeries = new MockComboSeries();
            series.drawSeries.apply(mockComboSeries);
            Y.Assert.isFalse(mockComboSeries._linesDrawn, "The drawLines method should not have been called.");     
            Y.Assert.isFalse(mockComboSeries._fillDrawn, "The drawFill method should not have been called.");     
            Y.Assert.isFalse(mockComboSeries._markersDrawn, "The drawMarkers method should not have been called.");     
            mockComboSeries._showLines = true;
            mockComboSeries._showAreaFill = true;
            mockComboSeries._showMarkers = true;
            series.drawSeries.apply(mockComboSeries);
            Y.Assert.isTrue(mockComboSeries._linesDrawn, "The drawLines method should have been called.");     
            Y.Assert.isTrue(mockComboSeries._fillDrawn, "The drawFill method should have been called.");     
            Y.Assert.isTrue(mockComboSeries._markersDrawn, "The drawMarkers method should have been called.");     
        },

        "test: _toggleVisible()" : function() {
            var VisibleToggler = Y.Base.create("visibleToggler", Y.Base, [], {

                }, {
                    ATTRS: {
                        visible: {
                            value: false
                        }
                    }
                }),
                path = new VisibleToggler(),
                lineGraphic = new VisibleToggler(),
                setMarkers,
                i,
                len,
                markers = [
                    new VisibleToggler(),
                    new VisibleToggler(),
                    new VisibleToggler()
                ],
                series = this.series,
                mockComboSeries = new MockComboSeries();
            series._toggleVisible.apply(mockComboSeries, [true]);
            Y.Assert.isUndefined(mockComboSeries._path, "The should not be a _path.");
            Y.Assert.isUndefined(mockComboSeries._lineGraphic, "The should not be a _lineGraphic.");
            Y.Assert.isUndefined(mockComboSeries.get("markers"), "The should not be any markers.");
            mockComboSeries._lineGraphic = lineGraphic;
            mockComboSeries._path = path;
            series._toggleVisible.apply(mockComboSeries, [true]);
            Y.Assert.isFalse(mockComboSeries._path.get("visible"), "The path's visible attribute should be false.");
            Y.Assert.isFalse(mockComboSeries._lineGraphic.get("visible"), "The lineGraphic's visible attribute should be false.");
            Y.Assert.isUndefined(mockComboSeries.get("markers"), "The should not be any markers.");
            
            mockComboSeries._showAreaFill = true;
            mockComboSeries._showLines = true;
            mockComboSeries._showMarkers = true;
            series._toggleVisible.apply(mockComboSeries, [true]);
            Y.Assert.isTrue(mockComboSeries._path.get("visible"), "The path's visible attribute should be true.");
            Y.Assert.isTrue(mockComboSeries._lineGraphic.get("visible"), "The lineGraphic's visible attribute should be true.");
            
            //get the case where there is a marker array but no marker    
            mockComboSeries._markers = [null];
            series._toggleVisible.apply(mockComboSeries, [true]);
            Y.Assert.isNull(mockComboSeries.get("markers")[0], "The item should be null.");  
            
            
            mockComboSeries._markers = markers;
            series._toggleVisible.apply(mockComboSeries, [true]);
            setMarkers = mockComboSeries.get("markers"); 
            len = setMarkers.length;
            for(i = 0; i < len; i = i + 1) {
                marker = setMarkers[i];
                Y.Assert.isTrue(marker.get("visible"), "The marker should be visible.");   
            }
        },

        "test: get('marker')" : function() {
            var series = this.series,
                testMarker = series.get("styles").marker,
                newMarker = {
                    border: {
                        weight: 3,
                        color: "#0f0"   
                    },
                    fill: {
                        color: "#9aa",
                        alpha: 0.85
                    },
                    width: 11,
                    height: 11
                },
                marker;
            Y.Assert.areEqual(testMarker, series.get("marker"), "The marker attribute should be equivalent to the styles.marker attribute."); 
            series.set("marker", newMarker);
            marker = series.get("marker");
            Y.Assert.areEqual(newMarker.width, marker.width, "The marker width should be " + newMarker.width + "."); 
            Y.Assert.areEqual(newMarker.height, marker.height, "The marker width should be " + newMarker.width + "."); 
            Y.Assert.areEqual(newMarker.fill.color, marker.fill.color, "The marker fill.color should be " + newMarker.fill.color + "."); 
            Y.Assert.areEqual(newMarker.fill.alpha, marker.fill.alpha, "The marker fill.alpha should be " + newMarker.fill.alpha + "."); 
            Y.Assert.areEqual(newMarker.border.color, marker.border.color, "The marker border.color should be " + newMarker.border.color + "."); 
            Y.Assert.areEqual(newMarker.border.weight, marker.border.weight, "The marker border.weight should be " + newMarker.border.weight + "."); 
        },

        "test: get('line')" : function() {
            var series = this.series,
                testLine = series.get("styles").line,
                newLine = {
                    weight: 3,
                    color: "#0f0"   
                },
                line;
            Y.Assert.areEqual(testLine, series.get("line"), "The line attribute should be equivalent to the styles.line attribute."); 
            series.set("line", newLine);
            line = series.get("line");
            Y.Assert.areEqual(newLine.color, line.color, "The  line.color should be " + newLine.color + "."); 
            Y.Assert.areEqual(newLine.weight, line.weight, "The line.weight should be " + newLine.weight + "."); 
        },

        "test: get('area')" : function() {
            var series = this.series,
                testArea = series.get("styles").area,
                newArea = {
                    alpha: 0.8,
                    color: "#0f0"   
                },
                area;
            series.set("area", newArea);
            area = series.get("area");
            Y.Assert.areEqual(newArea.color, area.color, "The  area.color should be " + newArea.color + "."); 
            Y.Assert.areEqual(newArea.alpha, area.alpha, "The area.alpha should be " + newArea.alpha + "."); 
        }
    });
    
    suite.add(new Y.ComboSeriesTest({
        name: "ComboSeries Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['series-combo', 'chart-test-template']});
