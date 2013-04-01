YUI.add('axis-numeric-base-tests', function(Y) {
    Y.NumericAxisBaseTest = function() {
        Y.NumericAxisBaseTest.superclass.constructor.apply(this, arguments);
        this.prepValues();
    }
    Y.extend(Y.NumericAxisBaseTest, Y.ChartTestTemplate, {
        prepValues : function() {
            var i,
                dataProvider = this.dataProvider,
                len = dataProvider.length,
                openValue,
                closeValue,
                openValues = [],
                closeValues = [],
                openTotal = 0,
                closeTotal = 0,
                record;
            for(i = 0; i < len; i = i + 1) {
                record = dataProvider[i];
                openValue = record.open;
                closeValue = record.close;
                    openValues.push(openValue);
                    closeValues.push(closeValue);
                if(Y.Lang.isNumber(openValue)) {
                    openTotal = openTotal + openValue;
                } else {
                  //  openValues.push(NaN);
                }
                if(Y.Lang.isNumber(closeValue)) {
                    closeTotal = closeTotal + closeValue;
                } else {
                //    closeValues.push(NaN);
                }
            }
            this.openValues = openValues;
            this.closeValues = closeValues;
            this.openTotal = openTotal;
            this.closeTotal = closeTotal;
            this.keys = ["open", "close"];
        },

        setUp: function() {
            this.axis = new Y.NumericAxisBase();
            this.axis.set("dataProvider", this.dataProvider);
            this.axis.set("alwaysShowZero", this.alwaysShowZero);
            this.axis.set("roundingMethod", this.roundingMethod);
        },

        tearDown: function() {
            this.axis = null;
        },

        "test: get('type')" : function() {
            Y.Assert.isInstanceOf(Y.NumericAxisBase, this.axis, "The axis should be and instanceof NumericAxisBase.");
            Y.Assert.areEqual("numeric", this.axis.get("type"), "The axis type attribute should be numeric.");
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

        "test: set('alwaysShowZero')" : function() {
            var alwaysShowZero = this.alwaysShowZero,
                testMethod = alwaysShowZero ? "isTrue" : "isFalse";
            Y.Assert[testMethod](this.axis.get("alwaysShowZero"), "The attribute alwaysShowZero should be " + alwaysShowZero + ".");
        },

        "test: set('roundingMethod')" : function() {
            var roundingMethod = this.roundingMethod;
            Y.Assert.areEqual(roundingMethod, this.axis.get("roundingMethod"), "The roundingMethod attribute should be " + roundingMethod + ".");
        },

        "test: get('dataProvider')" : function() {
            Y.Assert.areEqual(this.dataProvider, this.axis.get("dataProvider"), "The dataProvider attribute should equal the values it received.");  
        },

        "test: set('keys')" : function() {
            var i,
                len,
                axisKeys,
                openDataByKey,
                closeDataByKey,
                openKeyValue,
                closeKeyValue;
            this.axis.set("keys", this.keys);
            axisKeys = this.axis.get("keys");
            openDataByKey = this.axis.getDataByKey("open");
            closeDataByKey = this.axis.getDataByKey("close");
            len = this.dataProvider.length;
            
            for(i = 0; i < len; i = i + 1) {
                Y.Assert.areEqual(this.openValues[i], axisKeys.open[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.closeValues[i], axisKeys.close[i], "The keys attribute should be equal to the values it received.");
                Y.Assert.areEqual(this.openValues[i], openDataByKey[i], "The getDataByKey method should return the correct values.");
                Y.Assert.areEqual(this.closeValues[i], closeDataByKey[i], "The getDataByKey method should return the correct values.");
                openKeyValue = this.axis.getKeyValueAt("open", i);
                closeKeyValue = this.axis.getKeyValueAt("close", i);
                if(!Y.Lang.isNumber(openKeyValue)) {
                    openKeyValue = undefined;
                } 
                if(!Y.Lang.isNumber(closeKeyValue)) {
                    closeKeyValue = undefined;
                } 
                Y.Assert.areEqual(
                    this.openValues[i], 
                    openKeyValue,
                    'The axis.getKeyValueAt("open", ' + i + ') method should return a value of ' + this.openValues[i] + '.'
                );
                Y.Assert.areEqual(
                    this.closeValues[i], 
                    closeKeyValue, 
                    'The axis.getKeyValueAt("close", ' + i + ') method should return a value of ' + this.closeValues[i] + '.'
                );
            }
        },
        
        "test: addKey()" : function() {
            var i,
                len = this.dataProvider.length,
                axisKeys,
                openDataByKey,
                closeDataByKey,
                openKeyValue,
                closeKeyValue;
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
                openKeyValue = this.axis.getKeyValueAt("open", i);
                closeKeyValue = this.axis.getKeyValueAt("close", i);
                if(!Y.Lang.isNumber(openKeyValue)) {
                    openKeyValue = undefined;
                } 
                if(!Y.Lang.isNumber(closeKeyValue)) {
                    closeKeyValue = undefined;
                } 
                Y.Assert.areEqual(
                    this.openValues[i], 
                    openKeyValue,
                    'The axis.getKeyValueAt("open", ' + i + ') method should return a value of ' + this.openValues[i] + '.'
                );
                Y.Assert.areEqual(
                    this.closeValues[i], 
                    closeKeyValue, 
                    'The axis.getKeyValueAt("close", ' + i + ') method should return a value of ' + this.closeValues[i] + '.'
                );
            }
        },

        "test: get('data')" : function() {
            var length,
                data;
            this.axis.set("keys", ["open", "close"]);
            length = this.closeValues.length + this.openValues.length;
            data = this.axis.get("data");
            Y.Assert.areEqual(length, data.length, "The length of the data attribute should be " + length + ".");
        },

        "test: get('dataMaximum')" : function() {
            var dataMaximum;
            this.axis.set("keys", ["open", "close"]);
            dataMaximum = this.axis.get("dataMaximum")
            Y.Assert.isTrue(dataMaximum >= this.dataMaximum, "The value for the attribute dataMaximum (" + dataMaximum + ") should be greater than or equal to " + this.dataMaximum + ".");
        },

        "test: get('dataMinimum')" : function() {
            var dataMinimum;
            this.axis.set("keys", ["open", "close"]);
            dataMinimum = this.axis.get("dataMinimum");
            Y.Assert.isTrue(dataMinimum <= this.dataMinimum, "The value for the attribute dataMinimum (" + dataMinimum + ") should be less than or equal to " + this.dataMinimum + ".");
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

        "test: getTotalByKey()" : function() {
            this.axis.set("keys", ["open", "close"]);
            Y.Assert.areEqual(this.openTotal, this.axis.getTotalByKey("open"), "The sum of all open values should be " + this.openTotal + ".");
            Y.Assert.areEqual(this.closeTotal, this.axis.getTotalByKey("close"), "The sum of all close values should be " + this.closeTotal + ".");
            Y.Assert.areEqual(0, this.axis.getTotalByKey("nonexistantkey"), "The getTotalByKey method should return 0 for a non-existant key.");
        },

        "test: set('maximum')" : function() {
            this.axis.set("keys", ["open", "close"]);
            this.axis.set("maximum", this.setMaximum);
            Y.Assert.areEqual(this.setMaximum, this.axis.get("maximum"), "The get max method should return " + this.setMaximum + ".");
        },

        "test: set('minimum')" : function() {
            this.axis.set("keys", ["open", "close"]);
            this.axis.set("minimum", this.setMinimum);
            Y.Assert.areEqual(this.setMinimum, this.axis.get("minimum"), "The get min method should return " + this.setMinimum + ".");
        },

        "test: set('maximum') and set('minimum')" : function() {
            this.axis.set("keys", ["open", "close"]);
            this.axis.set("maximum", this.setMaximum);
            this.axis.set("minimum", this.setMinimum);
            Y.Assert.areEqual(this.setMaximum, this.axis.get("maximum"), "The get max method should return " + this.setMaximum + ".");
            Y.Assert.areEqual(this.setMinimum, this.axis.get("minimum"), "The get min method should return " + this.setMinimum + ".");
        },
        
        "test: labelFunction()" : function() {
            var val = 300,
                format = {
                    prefix: "$",
                    decimalPlaces: 2
                },
                unformatted = "300",
                formatted = "$300.00";
             Y.Assert.areEqual(unformatted, this.axis.get("labelFunction")(val), "The label should equal " + unformatted + ".");
             Y.Assert.areEqual(formatted, this.axis.get("labelFunction")(val, format), "The label should equal " + formatted + ".");
        },
        
        "test: roundingMethods" : function() {
            Y.Assert.areEqual(18, this.axis._roundToNearest(18), "The _roundToNearest method should round 18 to 18.");
            Y.Assert.areEqual(18, this.axis._roundToNearest(18, 0), "The _roundToNearest method should round 18 to 18.");
            Y.Assert.areEqual(0, this.axis._roundDownToNearest(0.2), "The _roundDownToNearest method should round to 0.");
            Y.Assert.areEqual(2, this.axis._roundToPrecision(1.8), "The _roundToPrecision method should round 1.8 to 2.");
        }
    });
    
    var suite = new Y.Test.Suite("Charts: NumericAxisBase"),
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
        missingValuesDataProvider = [
            {date: "01/01/2009", open: 90.27, close: 170.27},
            {date: "01/02/2009", open: 91.55, close: 8.55},
            {date: "01/03/2009", open: 337.55, close: 400.55},
            {date: "01/04/2009", open: 220.27, close: 205.27},
            {date: "01/05/2009", open: 276.72},
            {date: "01/06/2009", open: 85.27, close: 167.27},
            {date: "01/07/2009", open: 180.29, close: 179.29},
            {date: "01/08/2009", close: 133.21},
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
        allNegativeDataProvider = [
            {date: "01/01/2009", open: -90.27, close: -170.27},
            {date: "01/02/2009", open: -91.55, close: -8.55},
            {date: "01/03/2009", open: -337.55, close: -400.55},
            {date: "01/04/2009", open: -220.27, close: -205.27},
            {date: "01/05/2009", open: -276.72, close: -239.72},
            {date: "01/06/2009", open: -85.27, close: -167.27},
            {date: "01/07/2009", open: -180.29, close: -179.29},
            {date: "01/08/2009", open: -216.21, close: -133.21},
            {date: "01/09/2009", open: -292.35, close: -304.35},
            {date: "01/10/2009", open: -80.23, close: -30.23},
            {date: "01/11/2009", open: -60.42, close: -97.42},
            {date: "01/12/2009", open: -303.55, close: -265.55},
            {date: "01/13/2009", open: -47.48, close: -71.48},
            {date: "01/14/2009", open: -327.64, close: -256.64},
            {date: "01/15/2009", open: -124.13, close: -61.13},
            {date: "01/16/2009", open: -58.21, close: -106.21},
            {date: "01/17/2009", open: -85.55, close: -151.55},
            {date: "01/18/2009", open: -277.76, close: -268.76},
            {date: "01/19/2009", open: -263.3, close: -270.3},
            {date: "01/20/2009", open: -196.88, close: -147.88},
            {date: "01/21/2009", open: -198.91, close: -211.91},
            {date: "01/22/2009", open: -229.28, close: -176.28}
        ],
        positiveAndNegativeData = [
            {date: "01/01/2009", open: 90.27, close: -170.27},
            {date: "01/02/2009", open: -91.55, close: 8.55},
            {date: "01/03/2009", open: -337.55, close: 450.55},
            {date: "01/04/2009", open: 220.27, close: -205.27},
            {date: "01/05/2009", open: 276.72, close: -239.72},
            {date: "01/06/2009", open: -85.27, close: -167.27},
            {date: "01/07/2009", open: -180.29, close: 179.29},
            {date: "01/08/2009", open: -216.21, close: 133.21},
            {date: "01/09/2009", open: 292.35, close: -304.35},
            {date: "01/10/2009", open: 80.23, close: -30.23},
            {date: "01/11/2009", open: -60.42, close: 97.42},
            {date: "01/12/2009", open: -303.55, close: 265.55},
            {date: "01/13/2009", open: -47.48, close: -71.48},
            {date: "01/14/2009", open: 327.64, close: 256.64},
            {date: "01/15/2009", open: -124.13, close: 61.13},
            {date: "01/16/2009", open: -58.21, close: -106.21},
            {date: "01/17/2009", open: 85.55, close: -151.55},
            {date: "01/18/2009", open: -277.76, close: 268.76},
            {date: "01/19/2009", open: 263.3, close: -270.3},
            {date: "01/20/2009", open: -196.88, close: -147.88},
            {date: "01/21/2009", open: -198.91, close: 211.91},
            {date: "01/22/2009", open: 229.28, close: 176.28}
        ],
        smallValuesDataProvider = [
            {date: "01/01/2009", open: 0.27, close: 0.27},
            {date: "01/02/2009", open: 0.55, close: 0.55},
            {date: "01/03/2009", open: 0.55, close: 0.55},
            {date: "01/04/2009", open: 0.27, close: 0.27},
            {date: "01/05/2009", open: 0.72, close: 0.72},
            {date: "01/06/2009", open: 0.27, close: 0.27},
            {date: "01/07/2009", open: 0.29, close: 0.29},
            {date: "01/08/2009", open: 0.21, close: 0.21},
            {date: "01/09/2009", open: 0.35, close: 0.35},
            {date: "01/10/2009", open: 0.23, close: 0.23},
            {date: "01/11/2009", open: 0.42, close: 0.42},
            {date: "01/12/2009", open: 0.55, close: 0.55},
            {date: "01/13/2009", open: 0.48, close: 0.48},
            {date: "01/14/2009", open: 0.64, close: 0.64},
            {date: "01/15/2009", open: 0.13, close: 0.13},
            {date: "01/16/2009", open: 0.21, close: 0.21},
            {date: "01/17/2009", open: 0.55, close: 0.55},
            {date: "01/18/2009", open: 0.76, close: 0.76},
            {date: "01/19/2009", open: 0.3, close: 0.3},
            {date: "01/20/2009", open: 0.88, close: 0.88},
            {date: "01/21/2009", open: 0.91, close: 0.91},
            {date: "01/22/2009", open: 0.28, close: 0.28}
        ],
        allNegativeSmallValuesDataProvider = [
            {date: "01/01/2009", open: -0.27, close: -0.27},
            {date: "01/02/2009", open: -0.55, close: -0.55},
            {date: "01/03/2009", open: -0.55, close: -0.55},
            {date: "01/04/2009", open: -0.27, close: -0.27},
            {date: "01/05/2009", open: -0.72, close: -0.72},
            {date: "01/06/2009", open: -0.27, close: -0.27},
            {date: "01/07/2009", open: -0.29, close: -0.29},
            {date: "01/08/2009", open: -0.21, close: -0.21},
            {date: "01/09/2009", open: -0.35, close: -0.35},
            {date: "01/10/2009", open: -0.23, close: -0.23},
            {date: "01/11/2009", open: -0.42, close: -0.42},
            {date: "01/12/2009", open: -0.55, close: -0.55},
            {date: "01/13/2009", open: -0.48, close: -0.48},
            {date: "01/14/2009", open: -0.64, close: -0.64},
            {date: "01/15/2009", open: -0.13, close: -0.13},
            {date: "01/16/2009", open: -0.21, close: -0.21},
            {date: "01/17/2009", open: -0.55, close: -0.55},
            {date: "01/18/2009", open: -0.76, close: -0.76},
            {date: "01/19/2009", open: -0.3, close: -0.3},
            {date: "01/20/2009", open: -0.88, close: -0.88},
            {date: "01/21/2009", open: -0.91, close: -0.91},
            {date: "01/22/2009", open: -0.28, close: -0.28}
        ],

        positiveAndNegativeSmallValuesData = [
            {date: "01/01/2009", open: 0.27, close: -0.27},
            {date: "01/02/2009", open: -0.55, close: 0.55},
            {date: "01/03/2009", open: -0.55, close: 0.55},
            {date: "01/04/2009", open: 0.27, close: -0.27},
            {date: "01/05/2009", open: 0.72, close: -0.72},
            {date: "01/06/2009", open: -0.27, close: -0.27},
            {date: "01/07/2009", open: -0.29, close: 0.29},
            {date: "01/08/2009", open: -0.21, close: 0.21},
            {date: "01/09/2009", open: 0.35, close: -0.35},
            {date: "01/10/2009", open: 0.23, close: -0.23},
            {date: "01/11/2009", open: -0.42, close: 0.42},
            {date: "01/12/2009", open: -0.55, close: 0.55},
            {date: "01/13/2009", open: -0.48, close: -0.48},
            {date: "01/14/2009", open: 0.64, close: 0.64},
            {date: "01/15/2009", open: -0.13, close: 0.13},
            {date: "01/16/2009", open: -0.21, close: -0.21},
            {date: "01/17/2009", open: 0.55, close: -0.55},
            {date: "01/18/2009", open: -0.76, close: 0.76},
            {date: "01/19/2009", open: 0.3, close: -0.3},
            {date: "01/20/2009", open: -0.88, close: -0.88},
            {date: "01/21/2009", open: -0.91, close: 0.91},
            {date: "01/22/2009", open: 0.28, close: 0.28}
        ];
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Missing Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase All Negative Data Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase All Negative Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -50,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 30,
        setMinimum: -500,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Data Low Min and Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -5,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Small Values Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Large Min/Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Small Values alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Missing Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase All Negative Data alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase All Negative Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -200,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 10,
        setMinimum: -0.005,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Small Values Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -50,
        alwaysShowZero: true,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Positive and Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: false,
        roundingMethod: "niceNumber",
        name: "NumericAxisBase Large Min/Max alwaysShowZero=false Tests"
    }));
      
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Missing Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase All Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase All Negative Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -50,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Positive and Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 30,
        setMinimum: -500,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Positive and Negative Data Low Min and Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Positive and Negative Small Values Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: true,
        roundingMethod: "auto",
        name: "NumericAxisBase Large Min/Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase Missing Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase All Negative Data alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase All Negative Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -200,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase Positive and Negative Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase Positive and Negative Small Values Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: false,
        roundingMethod: "auto",
        name: "NumericAxisBase Large Min/Max alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Missing Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase All Negative Data Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase All Negative Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -50,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Positive and Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 30,
        setMinimum: -500,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Positive and Negative Data Low Min and Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Positive and Negative Small Values Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: true,
        roundingMethod: null,
        name: "NumericAxisBase Large Min/Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase Small Values alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase Missing Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase All Negative Data alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase All Negative Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -200,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase Positive and Negative Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase Positive and Negative Small Values Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: false,
        roundingMethod: null,
        name: "NumericAxisBase Large Min/Max alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: true,
        roundingMethod: 0.1,
        name: "NumericAxisBase Small Values Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase Missing Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase All Negative Data Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: 0.1,
        name: "NumericAxisBase All Negative Small Values Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -50,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase Positive and Negative Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 30,
        setMinimum: -500,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase Positive and Negative Data Low Min and Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: true,
        roundingMethod: 0.1,
        name: "NumericAxisBase Positive and Negative Small Values Data Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: true,
        roundingMethod: 100,
        name: "NumericAxisBase Large Min/Max Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: 100,
        name: "NumericAxisBase alwaysShowZero=false Tests"
    }));
    
    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: smallValuesDataProvider,
        dataMaximum: 0.91,
        dataMinimum: 0.13,
        setMaximum: 2,
        setMinimum: 0.5,
        alwaysShowZero: false,
        roundingMethod: 0.1,
        name: "NumericAxisBase Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: missingValuesDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 300,
        setMinimum: 20,
        alwaysShowZero: false,
        roundingMethod: 100,
        name: "NumericAxisBase Missing Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeDataProvider,
        dataMaximum: -8.55,
        dataMinimum: -400.55,
        setMaximum: -100,
        setMinimum: -300,
        alwaysShowZero: false,
        roundingMethod: 100,
        name: "NumericAxisBase All Negative Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: allNegativeSmallValuesDataProvider,
        dataMaximum: -0.91,
        dataMinimum: -0.13,
        setMaximum: -2,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: 0.1,
        name: "NumericAxisBase All Negative Small Values alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeData,
        dataMaximum: 400.55,
        dataMinimum: -304.35,
        setMaximum: 300,
        setMinimum: -200,
        alwaysShowZero: false,
        roundingMethod: 100,
        name: "NumericAxisBase Positive and Negative Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: positiveAndNegativeSmallValuesData,
        dataMaximum: 0.91,
        dataMinimum: -0.91,
        setMaximum: 1,
        setMinimum: -0.5,
        alwaysShowZero: false,
        roundingMethod: 0.1,
        name: "NumericAxisBase Positive and Negative Small Values Data alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: false,
        roundingMethod: 100,
        name: "NumericAxisBase Large Min/Max alwaysShowZero=false Tests"
    }));

    suite.add(new Y.NumericAxisBaseTest({
        dataProvider: plainOldDataProvider,
        dataMaximum: 400.55,
        dataMinimum: 8.55,
        setMaximum: 10,
        setMinimum: -10000,
        alwaysShowZero: false,
        roundingMethod: "badValue",
        name: "NumericAxisBase Large Min/Max alwaysShowZero=false badValue roundingMethod Tests"
    }));

    Y.Test.Runner.add(suite);
}, '@VERSION@' ,{requires:['axis-numeric-base', 'chart-test-template']});
