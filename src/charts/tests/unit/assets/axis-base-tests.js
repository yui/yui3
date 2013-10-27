YUI.add('axis-base-tests', function(Y) {
    var suite = new Y.Test.Suite("Charts: AxisBase"),
        DOC = Y.config.doc,
    AxisBaseTests = new Y.Test.Case({
        name: "AxisBase Tests",
        
        tearDown: function() {
            Y.Event.purgeElement(DOC, false);    
        },

        dataValues: [
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

        openValues: [
            90.27, 
            91.55, 
            337.55,
            220.27,
            276.72,
            85.27,
            180.29,
            216.21,
            292.35,
            80.23,
            60.42,
            303.55,
            47.48,
            327.64,
            124.13,
            58.21,
            85.55,
            277.76,
            263.3,
            196.88,
            198.91,
            229.28
        ],

        closeValues: [
            170.27,
            8.55,
            400.55,
            205.27,
            239.72,
            167.27,
            179.29,
            133.21,
            304.35,
            30.23,
            97.42,
            265.55,
            71.48,
            256.64,
            61.13,
            106.21,
            151.55,
            268.76,
            270.3,
            147.88,
            211.91,
            176.28
        ],

        keys: ["open", "close"],
        
        newKeys: ["expenses", "revenue"],

        dataMaximum: 400.55,
        
        dataMinimum: 8.55,
         
        newDataValues: [
            {date: "01/01/2009", revenue: 90.27, expenses: 170.27},
            {date: "01/02/2009", revenue: 91.55, expenses: 8.55},
            {date: "01/03/2009", revenue: 337.55, expenses: 400.55},
            {date: "01/04/2009", revenue: 220.27, expenses: 205.27},
            {date: "01/05/2009", revenue: 276.72, expenses: 239.72},
            {date: "01/06/2009", revenue: 85.27, expenses: 167.27},
            {date: "01/07/2009", revenue: 180.29, expenses: 179.29},
            {date: "01/08/2009", revenue: 216.21, expenses: 133.21},
            {date: "01/09/2009", revenue: 292.35, expenses: 304.35},
            {date: "01/10/2009", revenue: 80.23, expenses: 30.23},
            {date: "01/11/2009", revenue: 60.42, expenses: 97.42},
            {date: "01/12/2009", revenue: 303.55, expenses: 265.55},
            {date: "01/13/2009", revenue: 47.48, expenses: 71.48},
            {date: "01/14/2009", revenue: 327.64, expenses: 256.64},
            {date: "01/15/2009", revenue: 124.13, expenses: 61.13},
            {date: "01/16/2009", revenue: 58.21, expenses: 106.21},
            {date: "01/17/2009", revenue: 85.55, expenses: 151.55},
            {date: "01/18/2009", revenue: 277.76, expenses: 268.76},
            {date: "01/19/2009", revenue: 263.3, expenses: 270.3},
            {date: "01/20/2009", revenue: 196.88, expenses: 147.88},
            {date: "01/21/2009", revenue: 198.91, expenses: 211.91},
            {date: "01/22/2009", revenue: 229.28, expenses: 176.28}
        ],
        
        "test: getDataByKey()" : function() {
            var resultData,
                key,
                i,
                len,
                item,
                dataValue,
                axis = new Y.AxisBase({
                    dataProvider: this.dataValues
                });
            resultData = axis.getDataByKey(this.keys);
            Y.Assert.areEqual(0, Y.Object.size(resultData), "The getDataByKey method should return an empty object.");
            axis.set("keys", this.keys); 
            resultData = axis.getDataByKey(this.keys);
            for(key in resultData) {
                if(resultData.hasOwnProperty(key)) {
                    item = resultData[key];
                    for(i = 0; i < len; i = i + 1) {
                        dataValue = this.dataValues[i][key];
                        Y.Assert.areEqual(
                            dataValue, 
                            item[i], 
                            "The value of the " + i + " index of the " + key + " array from the object returned by getDataByKey should equal " + dataValue + "."
                       ); 
                    }
                }
            }
        },

        "test: AxisBase()" : function() {
            this.axis = new Y.AxisBase();
            Y.Assert.isInstanceOf(Y.AxisBase, this.axis, "The axis should be and instanceof AxisBase.");
            Y.Assert.isNull(this.axis.get("type"), "The axis instance should be of type null.");
        },

        "test: getEdgeOffset()" : function() {
            var axis = this.axis,
                length = 400,
                count = 11,
                calculatedOffset = (length/count)/2;
            Y.Assert.areEqual(0, axis.getEdgeOffset(), "The edge offset should be zero.");
            axis.set("calculateEdgeOffset", true);
            Y.Assert.areEqual(calculatedOffset, axis.getEdgeOffset(count, length), "The edge offset should be " + calculatedOffset + ".");
        },

        "test: _getCoordsFromValues()" : function() {
            var GetCoordsFromValuesMockAxis = Y.Base.create("getCoordsFromValuesMockAxis", Y.AxisBase, [], {
                    _getCoordFromValue: function(min, max, length, dataValue, offset, reverse) {
                        return dataValue;
                    }
                }),
                mockAxis = new GetCoordsFromValuesMockAxis(),
                axis = this.axis,
                dataValues = [0, 10, 20, 30, 40, 50, 60, 70],
                dataValue,
                result = axis._getCoordsFromValues.apply(
                    mockAxis,
                    [0, 70, 400, dataValues, 5, false]
                ),
                i,
                len = dataValues.length;
            for(i = 0; i < len; i = i + 1) {
                dataValue = dataValues[i];
                Y.Assert.areEqual(dataValue, result[i], "The result should be equal to " + dataValue + ".");   
            }
        },
        
        "test: _getDataValuesByCount()" : function() {
            var testValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                testValue,
                i,
                len = testValues.length,
                min = 0,
                max = 100,
                result = this.axis._getDataValuesByCount(len, min, max);
            for(i = 0; i < len; i = i + 1) {
                testValue = testValues[i];
                Y.Assert.areEqual(testValue, result[i], "The result should be equal to " + testValue + ".");
            }
        },

        "test: _getDefaultStyles()" : function() {
           var defaultMajorUnit = {
                    determinant: "count",
                    count: 11,
                    distance: 75
               },
               axisStyles = this.axis._getDefaultStyles(),
               key,
               axisMajorUnit;
           Y.Assert.isTrue(axisStyles.hasOwnProperty("majorUnit"), "The axis styles should include a majorUnit property.");
           axisMajorUnit = axisStyles.majorUnit;
           for(key in defaultMajorUnit) {
                if(defaultMajorUnit.hasOwnProperty(key)) {
                    Y.Assert.isTrue(axisMajorUnit.hasOwnProperty(key), "The default axis styles.majorUnit should contain a " + key + " property.");
                    Y.Assert.areEqual(
                        defaultMajorUnit[key], 
                        axisMajorUnit[key], 
                        "The default axis styles.majorUnit." + key + " property should be equal to the defaultMajorUnit." + key + " property."
                    ); 
                }
           }


        },

        "test:set(dataProvider)": function() {
            this.axis.set("dataProvider", this.dataValues);
            Y.Assert.areEqual(this.dataValues, this.axis.get("dataProvider"), "The dataProvider attribute should equal the values it received.");  
        },

        "test:set(keys) array" : function() {
            var i,
                len,
                axisKeys,
                openDataByKey,
                closeDataByKey;
            this.axis.set("keys", this.keys);
            axisKeys = this.axis.get("keys");
            openDataByKey = this.axis.getDataByKey("open");
            closeDataByKey = this.axis.getDataByKey("close");
            len = this.dataValues.length;
            
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.openValues[i], axisKeys.open[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.closeValues[i], axisKeys.close[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.openValues[i], openDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(this.closeValues[i], closeDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(
                    this.openValues[i], 
                    this.axis.getKeyValueAt("open", i), 
                    'The axis.getKeyValueAt("open", ' + i + ') method should return a value of ' + this.openValues[i] + '.'
                );
                Y.Assert.areEqual(
                    this.closeValues[i], 
                    this.axis.getKeyValueAt("close", i), 
                    'The axis.getKeyValueAt("close", ' + i + ') method should return a value of ' + this.closeValues[i] + '.'
                );
            }
            Y.Assert.isFalse(Y.Lang.isNumber(this.axis.getKeyValueAt("nonexistantKey", 0)), "A non-existant key should not return a valid number.");
        },

        "test:set(dataProvider, newDataProvider)": function() {
            this.axis.set("dataProvider", this.newDataValues);
            Y.Assert.areEqual(this.newDataValues, this.axis.get("dataProvider"), "The dataProvider attribute should equal the values it received.");  
        },

        "test:set(keys) new" : function() {
            var i,
                len,
                axisKeys,
                revenueDataByKey,
                expensesDataByKey;
            this.axis.set("keys", this.newKeys);
            axisKeys = this.axis.get("keys");
            revenueDataByKey = this.axis.getDataByKey("revenue");
            expensesDataByKey = this.axis.getDataByKey("expenses");
            len = this.dataValues.length;
            Y.Assert.isNull(this.axis.getDataByKey("open"), "There should not be an array of open values.");
            Y.Assert.isNull(this.axis.getDataByKey("close"), "There should not be an array of close values.");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.openValues[i], axisKeys.revenue[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.closeValues[i], axisKeys.expenses[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.openValues[i], revenueDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(this.closeValues[i], expensesDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(
                    this.openValues[i], 
                    this.axis.getKeyValueAt("revenue", i), 
                    'The axis.getKeyValueAt("revenue", ' + i + ') method should return a value of ' + this.openValues[i] + '.'
                );
                Y.Assert.areEqual(
                    this.closeValues[i], 
                    this.axis.getKeyValueAt("expenses", i), 
                    'The axis.getKeyValueAt("expenses", ' + i + ') method should return a value of ' + this.closeValues[i] + '.'
                );
            }
        },

        "test:removeKey()" : function() {
            this.axis.removeKey("revenue");
            this.axis.removeKey("expenses");
            Y.Assert.isNull(this.axis.getDataByKey("revenue"), "There should not be an array of revenue values.");
            Y.Assert.isNull(this.axis.getDataByKey("expenses"), "There should not be an array of expenses values.");
        },

        "test:set(keys) object literal": function() {
            var i,
                len = this.newDataValues.length,
                axisKeys,
                revenueDataByKey,
                expensesDataByKey;
            this.axis.set("keys", {
                revenue: "revenue",
                expenses: "expenses"
            });
            axisKeys = this.axis.get("keys");
            revenueDataByKey = this.axis.getDataByKey("revenue");
            expensesDataByKey = this.axis.getDataByKey("expenses");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.openValues[i], axisKeys.revenue[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.closeValues[i], axisKeys.expenses[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.openValues[i], revenueDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(this.closeValues[i], expensesDataByKey[i], "The getDataByKey method should return the correct values.");
            }
        },

        "test: addKey()" : function() {
            var i,
                len = this.dataValues.length,
                axisKeys,
                openDataByKey,
                closeDataByKey;
            this.axis.set("dataProvider", this.dataValues);
            this.axis.addKey("open");
            this.axis.addKey("close");
            axisKeys = this.axis.get("keys");
            openDataByKey = this.axis.getDataByKey("open");
            closeDataByKey = this.axis.getDataByKey("close");
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.openValues[i], axisKeys.open[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.closeValues[i], axisKeys.close[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.openValues[i], openDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(this.closeValues[i], closeDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(
                    this.openValues[i], 
                    this.axis.getKeyValueAt("open", i), 
                    'The axis.getKeyValueAt("open", ' + i + ') method should return a value of ' + this.openValues[i] + '.'
                );
                Y.Assert.areEqual(
                    this.closeValues[i], 
                    this.axis.getKeyValueAt("close", i), 
                    'The axis.getKeyValueAt("close", ' + i + ') method should return a value of ' + this.closeValues[i] + '.'
                );
            }
        },

        "test: removeKey()" : function() {
            var keys = this.axis.get("keys");
            Y.Assert.isTrue(keys.hasOwnProperty("revenue"), "The keys attribute should still contain the revenue key.");
            Y.Assert.isTrue(keys.hasOwnProperty("expenses"), "The keys attribute should still contain the expenses key.");
            this.axis.removeKey("revenue");
            Y.Assert.isFalse(keys.hasOwnProperty("revenue"), "The keys attribute should not contain the revenue key.");
            this.axis.removeKey("expenses");
            Y.Assert.isFalse(keys.hasOwnProperty("expenses"), "The keys attribute should not contain the expenses key.");
        },

        "test: get(data)" : function() {
            var length = this.closeValues.length + this.openValues.length,
                data = this.axis.get("data");
            Y.Assert.areEqual(length, data.length, "The length of the data attribute should be " + length + ".");
            //branch test
            data = this.axis.get("data");
            Y.Assert.areEqual(length, data.length, "The length of the data attribute should be " + length + ".");
        },

        "test: get(dataMaximum)" : function() {
            Y.Assert.isUndefined(this.axis.get("dataMaximum"), "The value for the attribute dataMaximum should be undefined.");
        },

        "test: get(dataMinimum)" : function() {
            Y.Assert.isUndefined(this.axis.get("dataMinimum"), "The value for the attribute dataMinimum should be undefined.");
        },

        "test: _maximumGetter(), _minimumGetter()" : function() {
            Y.Assert.isNaN(this.axis._maximumGetter(), "The _maximumGetter method should return NaN.");
            Y.Assert.isNaN(this.axis._minimumGetter(), "The _minimumGetter method should return NaN.");
            this.axis._dataMinimum = 0;
            this.axis._dataMaximum = 0;
            Y.Assert.areEqual(10, this.axis._maximumGetter(), "The _maximumGetter method should return 10.");
            Y.Assert.areEqual(0, this.axis._minimumGetter(), "The _minimumGetter method should return 0.");
        },

        "test: _maximumSetter()" : function() {
            var max = 1000;
            Y.Assert.isFalse(this.axis._getSetMax(), "The _getSetMax method should return false.");
            Y.Assert.areEqual(max, this.axis._maximumSetter(max), "The _maximumSetter method should return " + max + ".");
            Y.Assert.areEqual(max, this.axis._maximumGetter(), "The _maximumGetter method should return " + max + ".");
            Y.Assert.isTrue(this.axis._getSetMax(), "The _getSetMax method should return true.");
            
        },

        "test: _minimumSetter()" : function() {
            var min = -1000;
            Y.Assert.isFalse(this.axis._getSetMin(), "The _getSetMin method should return false.");
            Y.Assert.areEqual(min, this.axis._minimumSetter(min), "The _minimumSetter method should return " + min + ".");
            Y.Assert.areEqual(min, this.axis._minimumGetter(), "The _minimumGetter method should return " + min + ".");
            Y.Assert.isTrue(this.axis._getSetMin(), "The _getSetMin method should return true.");
        },

        "test: getTotalMajorUnits()" : function() {
            Y.Assert.areEqual(11, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 11.");
            this.axis.set("styles", {
                majorUnit: {
                    count: 8
                }
            });
            Y.Assert.areEqual(8, this.axis.getTotalMajorUnits(), "The getTotalMajorUnits method should return 8.");
        },

        "test: getOrigin()" : function() {
            var axis = this.axis,
                origin = axis.get("minimum");
            Y.Assert.areEqual(origin, axis.getOrigin(), "The origin value should be " + origin + ".");
        }
    });

    suite.add(AxisBaseTests);

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-base', 'test']});
