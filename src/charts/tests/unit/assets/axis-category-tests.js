YUI.add('axis-category-tests', function(Y) {
    Y.CategoryAxisTest = function() {
        Y.CategoryAxisTest.superclass.constructor.apply(this, arguments);
    }
    Y.extend(Y.CategoryAxisTest, Y.ChartTestTemplate, {
        setUp: function() {
            var position = this.position,
                cfg = {
                    dataProvider: this.dataProvider,
                    keys: this.dataKeys,
                    position: position
                };
            if(position === "right" || position === "left") {
                cfg.height = this.height;
            } else {
                cfg.width = this.width;
            }
            this.axis = new Y.CategoryAxis(cfg);
        },

        tearDown: function() {
            this.axis = null;
        },
        
        _getDataFromLabelValues: function(startPoint, labelValues, edgeOffset, multiplier, direction, data)
        {
            var points = [],
                values = [],
                labelValue,
                labelIndex,
                i,
                len = labelValues.length,
                staticCoord,
                dynamicCoord,
                constantVal,
                newPoint,
                rawVal;
            if(direction === "vertical")
            {
                staticCoord = "x";
                dynamicCoord = "y";
            }
            else
            {
                staticCoord = "y";
                dynamicCoord = "x";
            }
            constantVal = startPoint[staticCoord];
            for(i = 0; i < len; i = i + 1)
            {
                labelValue = labelValues[i];
                labelIndex = Y.Array.indexOf(data, labelValues);
                if(Y.Lang.isNumber(labelIndex) && labelIndex > -1)
                {
                    rawVal = labelIndex ? (labelIndex * multiplier) : 0;
                    newPoint = {};
                    newPoint[staticCoord] = constantVal;
                    newPoint[dynamicCoord] = rawVal + edgeOffset;
                    points.push(newPoint);
                    values.push(labelValue);
                }
            }
            return {
                points: points,
                values: values
            };
        },
        
        "test: getMajorUnitDistance()" : function() {
            var position = this.position,
                vertical = position === "left" || position === "right",
                size = vertical ? "height" : "width",
                length = 400,
                distance = length/8;
            this.axis.set("length", length);
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            ); 
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "distance",
                    distance: distance
                }
            });
            Y.Assert.areEqual(
                distance, 
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit),
                "The getMajorUnitDistance method should return " + distance + "."
            );
            this.axis.set("styles", {
                majorUnit: {
                    determinant: "random"   
                }
            });
            Y.Assert.isUndefined(
                this.axis.getMajorUnitDistance(8, length, this.axis.get("styles").majorUnit), 
                "An invalid majorUnit.determinant should result in the getMajorUnitDistance method returning undefined."
            );
        },

        "test: getMinimumValue()" : function() {
            var axis = this.axis,
                data = axis.get("data"),
                testLabel = data[0];
            Y.Assert.areEqual(testLabel, axis.getMinimumValue(), "The getMinimumValue method should return " + testLabel + ".");
        },

        "test: getMaximumValue()" : function() {
            var axis = this.axis,
                data = axis.get("data"),
                len = data.length,
                testLabel = data[len - 1];
            Y.Assert.areEqual(testLabel, axis.getMaximumValue(), "The getMaximumValue method should return " + testLabel + ".");
        },

        "test: _getLabelByIndex()" : function() {
            var axis = this.axis,
                index = 5,
                data = axis.get("data"),
                len = data.length,
                testLabel,
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
                testLabel = data[index];
            
            Y.Assert.areEqual(testLabel, axis._getLabelByIndex(index, len), "The label's value should be " + testLabel + ".");
        },

        "test: get(labels)" : function() {
            var axis = this.axis,
                labels,
                i,
                len,
                label,
                date,
                mydiv = Y.Node.create('<div style="width: 400px; height: 400px;">'),
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal";
                
            Y.one('body').append(mydiv);
            axis.render(mydiv);
            labels = axis.get("labels");
            len = plainOldDataProvider.length;
            for(i = 0; i < len; i = i + 1) {
                label = labels[i];
                date = plainOldDataProvider[i].date;
                Y.Assert.areEqual(date, label.innerHTML, "The label should be equal to " + date + ".");
            }
            axis.destroy(true);
            mydiv.destroy(true);
        },

        "test: _getDataFromLabelValues()" : function() {
            var axis = this.axis,
                labelValues = [
                    "01/02/2009",
                    "01/07/2009",
                    "01/12/2009",
                    "01/17/2009",
                    "01/22/2009"
                ],
                len,
                i,
                layoutLength = axis.getLength(),
                data = axis.get("data"),
                startPoint = axis.getFirstPoint(axis._layout.getLineStart.apply(axis)),
                edgeOffset = 0,
                multiplier = (layoutLength - (edgeOffset * 2))/(axis.getTotalMajorUnits() - 1),
                position = this.position,
                direction = position === "left" || position === "right" ? "vertical" : "horizontal",
                axisLabelValues,
                testLabelValues,
                axisPoint,
                testPoint,
                data = axis.get("data"),
                assertFn = function() {
                    axisLabelData = axis._getDataFromLabelValues.apply(axis, [
                        startPoint,
                        labelValues,
                        edgeOffset,
                        layoutLength,
                        direction
                    ]);
                    testLabelData = this._getDataFromLabelValues(
                        startPoint,
                        labelValues,
                        edgeOffset,
                        multiplier,
                        direction,
                        data
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
                        axisValue = axisPoints[i];
                        if(testPoint) {
                            Y.Assert.areEqual(testPoint.x, axisPoint.x, "The x value for the " + i + " index of the axis points should be " + testPoint.x + "."); 
                            Y.Assert.areEqual(testPoint.y, axisPoint.y, "The y value for the " + i + " index of the axis points should be " + testPoint.y + "."); 
                        } else {
                            Y.Assert.isNull(axisPoint, "There should not be a value for the axis point.");
                        }
                    }
                };
            assertFn.apply(this);
            //hit the branch
            labelValues[3] = "2/11/2012";
            assertFn.apply(this);
            //use labels that include the first (to hit another branch)
            labelValues = ["01/01/2009", "01/11/2009", "01/21/2009"];
            assertFn.apply(this);
        }
    });
    
    var suite = new Y.Test.Suite("Charts: CategoryAxis"),
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
        ];
    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "left",
        height: 400,
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "top",
        width: 700,
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "right",
        height: 400,
        name: "CategoryAxis Tests"
    }));

    suite.add(new Y.CategoryAxisTest({
        dataProvider: plainOldDataProvider,
        dataKeys: ["date"],
        position: "bottom",
        width: 700,
        name: "CategoryAxis Tests"
    }));


    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-category', 'chart-test-template']});
