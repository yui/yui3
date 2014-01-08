YUI.add('axis-numeric-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: NumericAxis"),
        plainOldDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72, close: 239.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", open: 216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: 304.35},
            {date: "01/10/2009", open: 80.23, close: 30.23},
            {date: "01/11/2009", open: 60.42, close: 97.42},
            {date: "01/12/2009", open: 303.55, close: 265.55},
            {date: "01/13/2009", open: 47.48, close: 71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: 124.13, close: 61.13},
            {date: "01/16/2009", open: 58.21, close: 106.21},
            {date: "01/17/2009", open: 85.55, close: 151.55},
            {date: "01/18/2009", open: 277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: 270.3},
            {date: "01/20/2009", open: 196.88, close: 147.88},
            {date: "01/21/2009", open: 198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ],
        DOC = Y.config.doc;

    Y.NumericAxisTest = function() {
        Y.NumericAxisTest.superclass.constructor.apply(this, arguments);
    };
    Y.extend(Y.NumericAxisTest, Y.ChartTestTemplate, {
        setUp: function() {
            var position = this.position,
                cfg = {
                    dataProvider: this.dataProvider,
                    keys: this.dataKeys,
                    position: position,
                    roundingMethod: this.roundingMethod   
                };
            if(position === "right" || position === "left") {
                cfg.height = this.height;
            } else {
                cfg.width = this.width;
            }
            this.axis = new Y.NumericAxis(cfg);
        },

        tearDown: function() {
            this.axis.destroy(true);
            Y.Event.purgeElement(DOC, false);
        },

        _getDataFromLabelValues: function(startPoint, len, edgeOffset, layoutLength, direction, min, max, labelValues)
        {
            var points = [],
                values = [],
                labelValue,
                i,
                staticCoord,
                dynamicCoord,
                constantVal,
                newPoint,
                coord,
                offset,
                isVertical = direction === "vertical",
                range = max - min,
                scaleFactor = (layoutLength - (edgeOffset * 2)) / range,
                increm = range/(len - 1);
            if(isVertical)
            {
                staticCoord = "x";
                dynamicCoord = "y";
                offset = layoutLength - edgeOffset;
            }
            else
            {
                staticCoord = "y";
                dynamicCoord = "x";
                offset = edgeOffset;
            }
            constantVal = startPoint[staticCoord];
            if(!labelValues) {
                labelValues = [];
                labelValue = min;
                for(i = 0; i < len - 1; i = i + 1) {
                    labelValues.push(labelValue);
                    labelValue = labelValue + increm;
                }
                labelValues.push(max);
            }
            for(i = 0; i < len; i = i + 1)
            {
                labelValue = labelValues[i];
                if(Y.Lang.isNumber(labelValue) && labelValue >= min && labelValue <= max)
                {
                    newPoint = {};
                    newPoint[staticCoord] = constantVal;
                    coord = (labelValue - min) * scaleFactor;
                    newPoint[dynamicCoord] = isVertical ? offset - coord : offset + coord;
                    points.push(newPoint);
                    values.push(labelValue);
                }
            }
            return {
                points: points,
                values: values
            };
        },

        "test: _getLabelByIndex()" : function() {
            var axis = this.axis,
                min = axis.get("minimum"),
                max = axis.get("maximum"),
                index = 5,
                len = 11,
                testLabel,
                roundingMethod = this.roundingMethod,
                increm = ((max - min)/(len - 1)),
                position = this.position;
            if(index === 0)
            {
                testLabel = min;
            }
            else if(index === len - 1)
            {
                testLabel = max;
            }
            else
            {
                testLabel = ((index) * increm);
                if(roundingMethod == "niceNumber")
                {
                    testLabel = axis._roundToNearest(testLabel, increm);
                }
                testLabel += min;
            }
            testLabel = parseFloat(testLabel);
            Y.Assert.areEqual(testLabel, axis._getLabelByIndex(index, len), "The testLabel's value should be " + testLabel + ".");
            Y.Assert.areEqual(min, axis._getLabelByIndex(0, len), "The testLabel's value should be " + min + ".");
            Y.Assert.areEqual(max, axis._getLabelByIndex(len - 1, len), "The testLabel's value should be " + max + ".");
        },
        
        getHasDataOverflow: function(setMin, setMax, min, max, dataMinimum, dataMaximum, roundingMethod) {
            if(setMin || setMax) {
                return true;
            } else if(Y.Lang.isNumber(roundingMethod) && ((Y.Lang.isNumber(max) && max > dataMaximum) || (Y.Lang.isNumber(min) && min < dataMinimum))) {
                return true;
            } else {
                return false;
            }
        },

        "test: _hasDataOverflow()" : function() {
            var axis = this.axis,
                roundingMethod = this.roundingMethod,
                setMin = axis.get("setMin"),
                setMax = axis.get("setMax"),
                min = axis._actualMinimum,
                max = axis._actualMaximum,
                dataMaximum = axis._dataMaximum,
                dataMinimum = axis._dataMinimum,
                testHasDataOverflow = this.getHasDataOverflow(
                    setMin,
                    setMax,
                    min,
                    max,
                    dataMinimum,
                    dataMaximum,
                    roundingMethod
                );
            if(testHasDataOverflow) {
                Y.Assert.isTrue(axis._hasDataOverflow(), "The _hasDataOverflow should return true.");
            } else {
                Y.Assert.isFalse(axis._hasDataOverflow(), "The _hasDataOverflow should return false.");
            }

            axis.set("minimum", 50);
            setMin = 50;
            testHasDataOverflow = this.getHasDataOverflow(
                setMin,
                setMax,
                min,
                max,
                dataMinimum,
                dataMaximum,
                roundingMethod
            );
            if(testHasDataOverflow) {
                Y.Assert.isTrue(axis._hasDataOverflow(), "The _hasDataOverflow should return true.");
            } else {
                Y.Assert.isFalse(axis._hasDataOverflow(), "The _hasDataOverflow should return false.");
            }
        },

        "test: _getLabelData()" : function() {
            var axis = this.axis,
                labelValues = [
                    5,
                    105,
                    205,
                    305,
                    405
                ],
                len,
                i,
                layoutLength = axis.getLength(),
                startPoint = axis.getFirstPoint(axis._layout.getLineStart.apply(axis)),
                edgeOffset = 0,
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                axisLabelData,
                testLabelData,
                testPoints,
                axisPoints,
                testsValues,
                axisValues,
                axisPoint,
                testPoint,
                assertFn = function() {
                    var min = axis.get("minimum"),
                        max = axis.get("maximum"),
                        staticCoord,
                        dynamicCoord,
                        constantVal;
                    if(direction === "vertical") {
                        staticCoord = "x";
                        dynamicCoord = "y";
                    } else {
                        staticCoord = "y";
                        dynamicCoord = "x";
                    }
                    constantVal = startPoint[staticCoord];
                    axisLabelData = axis._getLabelData.apply(axis, [
                        constantVal,
                        staticCoord,
                        dynamicCoord,
                        min,
                        max,
                        edgeOffset,
                        layoutLength - edgeOffset - edgeOffset,
                        len,
                        labelValues
                    ]);
                    testLabelData = this._getDataFromLabelValues(
                        startPoint,
                        len,
                        edgeOffset,
                        layoutLength,
                        direction,
                        min,
                        max,
                        labelValues
                    );
                    testPoints = testLabelData.points;
                    testValues = testLabelData.values;
                    axisPoints = axisLabelData.points;
                    axisValues = axisLabelData.values;
                    len = testPoints.length;
                    for(i = 0; i < len; i = i + 1) {
                        testPoint = testPoints[i];
                        axisPoint = axisPoints[i];
                        testValue = testValues[i];
                        axisValue = axisValues[i];
                        if(testPoint) {
                            Y.Assert.areEqual(testPoint.x, axisPoint.x, "The x value for the " + i + " index of the axis points should be " + testPoint.x + "."); 
                            Y.Assert.areEqual(testPoint.y, axisPoint.y, "The y value for the " + i + " index of the axis points should be " + testPoint.y + "."); 
                        } else {
                            Y.Assert.isNull(axisPoint, "There should not be a value for the axis point.");
                        }
                        if(testValue) {
                            Y.Assert.areEqual(testValue, axisValue, "The label value for the " + i + " index should be " + testValue + ".");
                        }
                    }
                };
            assertFn.apply(this);
            labelValues = null;
            len = axis.getTotalMajorUnits();
            assertFn.apply(this);
        }
    });
    
    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "left",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: "niceNumber",
        name: "NumericAxis Tests, position=left, roundingMethod=niceNumber"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "top",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: "niceNumber",
        name: "NumericAxis Tests, position=top, roundingMethod=niceNumber"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "right",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: "niceNumber",
        name: "NumericAxis Tests, position=right, roundingMethod=niceNumber"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "bottom",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: "niceNumber",
        name: "NumericAxis Tests, position=bottom, roundingMethod=niceNumber"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "left",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: null,
        name: "NumericAxis Tests, position=left, roundingMethod=null"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "top",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: null,
        name: "NumericAxis Tests, position=top, roundingMethod=null"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "right",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: null,
        name: "NumericAxis Tests, position=right, roundingMethod=null"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "bottom",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: null,
        name: "NumericAxis Tests, position=bottom, roundingMethod=null"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "left",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: 1000000000,
        name: "NumericAxis Tests, position=left, roundingMethod=90"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "top",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: 1000000000,
        name: "NumericAxis Tests, position=top, roundingMethod=90"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "right",
		height: 400,
        dataKeys: ["open", "close"],
        roundingMethod: 1000000000,
        name: "NumericAxis Tests, position=right, roundingMethod=90"
    }));

    suite.add(new Y.NumericAxisTest({
        dataProvider: plainOldDataProvider,
        position: "bottom",
		width: 700,
        dataKeys: ["open", "close"],
        roundingMethod: 1000000000,
        name: "NumericAxis Tests, position=bottom, roundingMethod=90"
    }));



    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-numeric', 'chart-test-template']});
