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
_yuitest_coverage["build/axis-time/axis-time.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/axis-time/axis-time.js",
    code: []
};
_yuitest_coverage["build/axis-time/axis-time.js"].code=["YUI.add('axis-time', function (Y, NAME) {","","/**"," * Provides functionality for drawing a time axis for use with a chart."," *"," * @module charts"," * @submodule axis-time"," */","/**"," * TimeAxis draws a time-based axis for a chart."," *"," * @class TimeAxis"," * @constructor"," * @extends Axis"," * @uses TimeImpl"," * @param {Object} config (optional) Configuration parameters."," * @submodule axis-time"," */","Y.TimeAxis = Y.Base.create(\"timeAxis\", Y.Axis, [Y.TimeImpl], {","    /**","     * Calculates and returns a value based on the number of labels and the index of","     * the current label.","     *","     * @method _getLabelByIndex","     * @param {Number} i Index of the label.","     * @param {Number} l Total number of labels.","     * @return String","     * @private","     */","    _getLabelByIndex: function(i, l)","    {","        var min = this.get(\"minimum\"),","            max = this.get(\"maximum\"),","            increm,","            label;","            l -= 1;","        increm = ((max - min)/l) * i;","        label = min + increm;","        return label;","    },","","    /**","     * Calculates the position of ticks and labels based on an array of specified label values. Returns","     * an object containing an array of values to be used for labels and an array of objects containing","     * x and y coordinates for each label.","     *","     * @method _getDataFromLabelValues","     * @param {Object} startPoint An object containing the x and y coordinates for the start of the axis.","     * @param {Array} labelValues An array containing values to be used for determining the number and","     * position of labels and ticks on the axis.","     * @param {Number} edgeOffset The distance, in pixels, on either edge of the axis.","     * @param {Number} layoutLength The length, in pixels, of the axis. If the axis is vertical, the length","     * is equal to the height. If the axis is horizontal, the length is equal to the width.","     * @return Object","     * @private","     */","    _getDataFromLabelValues: function(startPoint, labelValues, edgeOffset, layoutLength, direction)","    {","        var points = [],","            labelValue,","            i,","            len = labelValues.length,","            staticCoord,","            dynamicCoord,","            constantVal,","            newPoint,","            max = this.get(\"maximum\"),","            min = this.get(\"minimum\"),","            values = [],","            scaleFactor = (layoutLength - (edgeOffset * 2)) / (max - min);","        if(direction === \"vertical\")","        {","            staticCoord = \"x\";","            dynamicCoord = \"y\";","        }","        else","        {","            staticCoord = \"y\";","            dynamicCoord = \"x\";","        }","        constantVal = startPoint[staticCoord];","        for(i = 0; i < len; i = i + 1)","        {","            labelValue = this._getNumber(labelValues[i]);","            if(Y.Lang.isNumber(labelValue) && labelValue >= min && labelValue <= max)","            {","                newPoint = {};","                newPoint[staticCoord] = constantVal;","                newPoint[dynamicCoord] = edgeOffset + ((labelValue - min) * scaleFactor);","                points.push(newPoint);","                values.push(labelValue);","            }","        }","        return {","            points: points,","            values: values","        };","    }","});","","","","}, '@VERSION@', {\"requires\": [\"axis\", \"axis-time-base\"]});"];
_yuitest_coverage["build/axis-time/axis-time.js"].lines = {"1":0,"19":0,"32":0,"36":0,"37":0,"38":0,"39":0,"59":0,"71":0,"73":0,"74":0,"78":0,"79":0,"81":0,"82":0,"84":0,"85":0,"87":0,"88":0,"89":0,"90":0,"91":0,"94":0};
_yuitest_coverage["build/axis-time/axis-time.js"].functions = {"_getLabelByIndex:30":0,"_getDataFromLabelValues:57":0,"(anonymous 1):1":0};
_yuitest_coverage["build/axis-time/axis-time.js"].coveredLines = 23;
_yuitest_coverage["build/axis-time/axis-time.js"].coveredFunctions = 3;
_yuitest_coverline("build/axis-time/axis-time.js", 1);
YUI.add('axis-time', function (Y, NAME) {

/**
 * Provides functionality for drawing a time axis for use with a chart.
 *
 * @module charts
 * @submodule axis-time
 */
/**
 * TimeAxis draws a time-based axis for a chart.
 *
 * @class TimeAxis
 * @constructor
 * @extends Axis
 * @uses TimeImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-time
 */
_yuitest_coverfunc("build/axis-time/axis-time.js", "(anonymous 1)", 1);
_yuitest_coverline("build/axis-time/axis-time.js", 19);
Y.TimeAxis = Y.Base.create("timeAxis", Y.Axis, [Y.TimeImpl], {
    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method _getLabelByIndex
     * @param {Number} i Index of the label.
     * @param {Number} l Total number of labels.
     * @return String
     * @private
     */
    _getLabelByIndex: function(i, l)
    {
        _yuitest_coverfunc("build/axis-time/axis-time.js", "_getLabelByIndex", 30);
_yuitest_coverline("build/axis-time/axis-time.js", 32);
var min = this.get("minimum"),
            max = this.get("maximum"),
            increm,
            label;
            _yuitest_coverline("build/axis-time/axis-time.js", 36);
l -= 1;
        _yuitest_coverline("build/axis-time/axis-time.js", 37);
increm = ((max - min)/l) * i;
        _yuitest_coverline("build/axis-time/axis-time.js", 38);
label = min + increm;
        _yuitest_coverline("build/axis-time/axis-time.js", 39);
return label;
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
        _yuitest_coverfunc("build/axis-time/axis-time.js", "_getDataFromLabelValues", 57);
_yuitest_coverline("build/axis-time/axis-time.js", 59);
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
        _yuitest_coverline("build/axis-time/axis-time.js", 71);
if(direction === "vertical")
        {
            _yuitest_coverline("build/axis-time/axis-time.js", 73);
staticCoord = "x";
            _yuitest_coverline("build/axis-time/axis-time.js", 74);
dynamicCoord = "y";
        }
        else
        {
            _yuitest_coverline("build/axis-time/axis-time.js", 78);
staticCoord = "y";
            _yuitest_coverline("build/axis-time/axis-time.js", 79);
dynamicCoord = "x";
        }
        _yuitest_coverline("build/axis-time/axis-time.js", 81);
constantVal = startPoint[staticCoord];
        _yuitest_coverline("build/axis-time/axis-time.js", 82);
for(i = 0; i < len; i = i + 1)
        {
            _yuitest_coverline("build/axis-time/axis-time.js", 84);
labelValue = this._getNumber(labelValues[i]);
            _yuitest_coverline("build/axis-time/axis-time.js", 85);
if(Y.Lang.isNumber(labelValue) && labelValue >= min && labelValue <= max)
            {
                _yuitest_coverline("build/axis-time/axis-time.js", 87);
newPoint = {};
                _yuitest_coverline("build/axis-time/axis-time.js", 88);
newPoint[staticCoord] = constantVal;
                _yuitest_coverline("build/axis-time/axis-time.js", 89);
newPoint[dynamicCoord] = edgeOffset + ((labelValue - min) * scaleFactor);
                _yuitest_coverline("build/axis-time/axis-time.js", 90);
points.push(newPoint);
                _yuitest_coverline("build/axis-time/axis-time.js", 91);
values.push(labelValue);
            }
        }
        _yuitest_coverline("build/axis-time/axis-time.js", 94);
return {
            points: points,
            values: values
        };
    }
});



}, '@VERSION@', {"requires": ["axis", "axis-time-base"]});
