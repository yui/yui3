if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/axis-numeric/axis-numeric.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/axis-numeric/axis-numeric.js",
    code: []
};
_yuitest_coverage["build/axis-numeric/axis-numeric.js"].code=["YUI.add('axis-numeric', function (Y, NAME) {","","/**"," * Provides functionality for drawing a numeric axis for use with a chart."," *"," * @module charts"," * @submodule axis-numeric"," */","Y_Lang = Y.Lang;","/**"," * NumericAxis draws a numeric axis."," *"," * @class NumericAxis"," * @constructor"," * @extends Axis"," * @uses NumericImpl"," * @param {Object} config (optional) Configuration parameters."," * @submodule axis-numeric"," */","Y.NumericAxis = Y.Base.create(\"numericAxis\", Y.Axis, [Y.NumericImpl], {","    /**","     * Calculates and returns a value based on the number of labels and the index of","     * the current label.","     *","     * @method getLabelByIndex","     * @param {Number} i Index of the label.","     * @param {Number} l Total number of labels.","     * @return String","     * @private","     */","    _getLabelByIndex: function(i, l)","    {","        var min = this.get(\"minimum\"),","            max = this.get(\"maximum\"),","            increm = (max - min)/(l-1),","            label,","            roundingMethod = this.get(\"roundingMethod\");","            l -= 1;","        //respect the min and max. calculate all other labels.","        if(i === 0)","        {","            label = min;","        }","        else if(i === l)","        {","            label = max;","        }","        else","        {","            label = (i * increm);","            if(roundingMethod === \"niceNumber\")","            {","                label = this._roundToNearest(label, increm);","            }","            label += min;","        }","        return parseFloat(label);","    },","","    /**","     * Calculates points based off the majorUnit count or distance of the Axis.","     *","     * @method _getPoints","     * @param {Object} startPoint An object literal containing the x and y coordinates of the first","     * point on the axis.","     * @param {Number} len The number of points on an axis.","     * @param {Number} edgeOffset The distance from the start of the axis and the point.","     * @param {Number} majorUnitDistance The distance between points on an axis.","     * @param {String} direction Indicates whether the axis is horizontal or vertical.","     * @return Array","     * @private","     */","    _getPoints: function(startPoint, len, edgeOffset, majorUnitDistance, direction)","    {","        var points = Y.NumericAxis.superclass._getPoints.apply(this, arguments);","        if(direction === \"vertical\")","        {","            points.reverse();","        }","        return points;","    },","","    /**","     * Calculates the position of ticks and labels based on an array of specified label values. Returns","     * an object containing an array of values to be used for labels and an array of objects containing","     * x and y coordinates for each label.","     *","     * @method _getDataFromLabelValues","     * @param {Object} startPoint An object containing the x and y coordinates for the start of the axis.","     * @param {Array} labelValues An array containing values to be used for determining the number and","     * position of labels and ticks on the axis.","     * @param {Number} edgeOffset The distance, in pixels, on either edge of the axis.","     * @param {Number} layoutLength The length, in pixels, of the axis. If the axis is vertical, the length","     * is equal to the height. If the axis is horizontal, the length is equal to the width.","     * @return Object","     * @private","     */","    _getDataFromLabelValues: function(startPoint, labelValues, edgeOffset, layoutLength, direction)","    {","        var points = [],","            labelValue,","            i,","            len = labelValues.length,","            staticCoord,","            dynamicCoord,","            constantVal,","            newPoint,","            max = this.get(\"maximum\"),","            min = this.get(\"minimum\"),","            values = [],","            scaleFactor = (layoutLength - (edgeOffset * 2)) / (max - min);","        if(direction === \"vertical\")","        {","            staticCoord = \"x\";","            dynamicCoord = \"y\";","        }","        else","        {","            staticCoord = \"y\";","            dynamicCoord = \"x\";","        }","        constantVal = startPoint[staticCoord];","        for(i = 0; i < len; i = i + 1)","        {","            labelValue = labelValues[i];","            if(Y.Lang.isNumber(labelValue) && labelValue >= min && labelValue <= max)","            {","                newPoint = {};","                newPoint[staticCoord] = constantVal;","                newPoint[dynamicCoord] = (layoutLength - edgeOffset) - (labelValue - min) * scaleFactor;","                points.push(newPoint);","                values.push(labelValue);","            }","        }","        return {","            points: points,","            values: values","        };","    },","","    /**","     * Checks to see if data extends beyond the range of the axis. If so,","     * that data will need to be hidden. This method is internal, temporary and subject","     * to removal in the future.","     *","     * @method _hasDataOverflow","     * @protected","     * @return Boolean","     */","    _hasDataOverflow: function()","    {","        var roundingMethod,","            min,","            max;","        if(this.get(\"setMin\") || this.get(\"setMax\"))","        {","            return true;","        }","        roundingMethod = this.get(\"roundingMethod\");","        min = this._actualMinimum;","        max = this._actualMaximum;","        if(Y_Lang.isNumber(roundingMethod) &&","            ((Y_Lang.isNumber(max) && max > this._dataMaximum) || (Y_Lang.isNumber(min) && min < this._dataMinimum)))","        {","            return true;","        }","        return false;","    }","});","","","","}, '@VERSION@', {\"requires\": [\"axis\", \"axis-numeric-base\"]});"];
_yuitest_coverage["build/axis-numeric/axis-numeric.js"].lines = {"1":0,"9":0,"20":0,"33":0,"38":0,"40":0,"42":0,"44":0,"46":0,"50":0,"51":0,"53":0,"55":0,"57":0,"75":0,"76":0,"78":0,"80":0,"100":0,"112":0,"114":0,"115":0,"119":0,"120":0,"122":0,"123":0,"125":0,"126":0,"128":0,"129":0,"130":0,"131":0,"132":0,"135":0,"152":0,"155":0,"157":0,"159":0,"160":0,"161":0,"162":0,"165":0,"167":0};
_yuitest_coverage["build/axis-numeric/axis-numeric.js"].functions = {"_getLabelByIndex:31":0,"_getPoints:73":0,"_getDataFromLabelValues:98":0,"_hasDataOverflow:150":0,"(anonymous 1):1":0};
_yuitest_coverage["build/axis-numeric/axis-numeric.js"].coveredLines = 43;
_yuitest_coverage["build/axis-numeric/axis-numeric.js"].coveredFunctions = 5;
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 1);
YUI.add('axis-numeric', function (Y, NAME) {

/**
 * Provides functionality for drawing a numeric axis for use with a chart.
 *
 * @module charts
 * @submodule axis-numeric
 */
_yuitest_coverfunc("build/axis-numeric/axis-numeric.js", "(anonymous 1)", 1);
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 9);
Y_Lang = Y.Lang;
/**
 * NumericAxis draws a numeric axis.
 *
 * @class NumericAxis
 * @constructor
 * @extends Axis
 * @uses NumericImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-numeric
 */
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 20);
Y.NumericAxis = Y.Base.create("numericAxis", Y.Axis, [Y.NumericImpl], {
    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     * @private
     */
    _getLabelByIndex: function(i, l)
    {
        _yuitest_coverfunc("build/axis-numeric/axis-numeric.js", "_getLabelByIndex", 31);
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 33);
var min = this.get("minimum"),
            max = this.get("maximum"),
            increm = (max - min)/(l-1),
            label,
            roundingMethod = this.get("roundingMethod");
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 38);
l -= 1;
        //respect the min and max. calculate all other labels.
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 40);
if(i === 0)
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 42);
label = min;
        }
        else {_yuitest_coverline("build/axis-numeric/axis-numeric.js", 44);
if(i === l)
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 46);
label = max;
        }
        else
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 50);
label = (i * increm);
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 51);
if(roundingMethod === "niceNumber")
            {
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 53);
label = this._roundToNearest(label, increm);
            }
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 55);
label += min;
        }}
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 57);
return parseFloat(label);
    },

    /**
     * Calculates points based off the majorUnit count or distance of the Axis.
     *
     * @method _getPoints
     * @param {Object} startPoint An object literal containing the x and y coordinates of the first
     * point on the axis.
     * @param {Number} len The number of points on an axis.
     * @param {Number} edgeOffset The distance from the start of the axis and the point.
     * @param {Number} majorUnitDistance The distance between points on an axis.
     * @param {String} direction Indicates whether the axis is horizontal or vertical.
     * @return Array
     * @private
     */
    _getPoints: function(startPoint, len, edgeOffset, majorUnitDistance, direction)
    {
        _yuitest_coverfunc("build/axis-numeric/axis-numeric.js", "_getPoints", 73);
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 75);
var points = Y.NumericAxis.superclass._getPoints.apply(this, arguments);
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 76);
if(direction === "vertical")
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 78);
points.reverse();
        }
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 80);
return points;
    },

    /**
     * Calculates the position of ticks and labels based on an array of specified label values. Returns
     * an object containing an array of values to be used for labels and an array of objects containing
     * x and y coordinates for each label.
     *
     * @method _getDataFromLabelValues
     * @param {Object} startPoint An object containing the x and y coordinates for the start of the axis.
     * @param {Array} labelValues An array containing values to be used for determining the number and
     * position of labels and ticks on the axis.
     * @param {Number} edgeOffset The distance, in pixels, on either edge of the axis.
     * @param {Number} layoutLength The length, in pixels, of the axis. If the axis is vertical, the length
     * is equal to the height. If the axis is horizontal, the length is equal to the width.
     * @return Object
     * @private
     */
    _getDataFromLabelValues: function(startPoint, labelValues, edgeOffset, layoutLength, direction)
    {
        _yuitest_coverfunc("build/axis-numeric/axis-numeric.js", "_getDataFromLabelValues", 98);
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 100);
var points = [],
            labelValue,
            i,
            len = labelValues.length,
            staticCoord,
            dynamicCoord,
            constantVal,
            newPoint,
            max = this.get("maximum"),
            min = this.get("minimum"),
            values = [],
            scaleFactor = (layoutLength - (edgeOffset * 2)) / (max - min);
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 112);
if(direction === "vertical")
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 114);
staticCoord = "x";
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 115);
dynamicCoord = "y";
        }
        else
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 119);
staticCoord = "y";
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 120);
dynamicCoord = "x";
        }
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 122);
constantVal = startPoint[staticCoord];
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 123);
for(i = 0; i < len; i = i + 1)
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 125);
labelValue = labelValues[i];
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 126);
if(Y.Lang.isNumber(labelValue) && labelValue >= min && labelValue <= max)
            {
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 128);
newPoint = {};
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 129);
newPoint[staticCoord] = constantVal;
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 130);
newPoint[dynamicCoord] = (layoutLength - edgeOffset) - (labelValue - min) * scaleFactor;
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 131);
points.push(newPoint);
                _yuitest_coverline("build/axis-numeric/axis-numeric.js", 132);
values.push(labelValue);
            }
        }
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 135);
return {
            points: points,
            values: values
        };
    },

    /**
     * Checks to see if data extends beyond the range of the axis. If so,
     * that data will need to be hidden. This method is internal, temporary and subject
     * to removal in the future.
     *
     * @method _hasDataOverflow
     * @protected
     * @return Boolean
     */
    _hasDataOverflow: function()
    {
        _yuitest_coverfunc("build/axis-numeric/axis-numeric.js", "_hasDataOverflow", 150);
_yuitest_coverline("build/axis-numeric/axis-numeric.js", 152);
var roundingMethod,
            min,
            max;
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 155);
if(this.get("setMin") || this.get("setMax"))
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 157);
return true;
        }
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 159);
roundingMethod = this.get("roundingMethod");
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 160);
min = this._actualMinimum;
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 161);
max = this._actualMaximum;
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 162);
if(Y_Lang.isNumber(roundingMethod) &&
            ((Y_Lang.isNumber(max) && max > this._dataMaximum) || (Y_Lang.isNumber(min) && min < this._dataMinimum)))
        {
            _yuitest_coverline("build/axis-numeric/axis-numeric.js", 165);
return true;
        }
        _yuitest_coverline("build/axis-numeric/axis-numeric.js", 167);
return false;
    }
});



}, '@VERSION@', {"requires": ["axis", "axis-numeric-base"]});
