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
_yuitest_coverage["build/axis-category/axis-category.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/axis-category/axis-category.js",
    code: []
};
_yuitest_coverage["build/axis-category/axis-category.js"].code=["YUI.add('axis-category', function (Y, NAME) {","","/**"," * Provides functionality for drawing a category axis for use with a chart."," *"," * @module charts"," * @submodule axis-category"," */","/**"," * CategoryAxis draws a category axis for a chart."," *"," * @class CategoryAxis"," * @constructor"," * @extends Axis"," * @uses CategoryImpl"," * @param {Object} config (optional) Configuration parameters."," * @submodule axis-category"," */","Y.CategoryAxis = Y.Base.create(\"categoryAxis\", Y.Axis, [Y.CategoryImpl], {","    /**","     * Returns a string corresponding to the first label on an","     * axis.","     *","     * @method getMinimumValue","     * @return String","     */","    getMinimumValue: function()","    {","        var data = this.get(\"data\"),","            label = data[0];","        return label;","    },","","    /**","     * Returns a string corresponding to the last label on an","     * axis.","     *","     * @method getMaximumValue","     * @return String","     */","    getMaximumValue: function()","    {","        var data = this.get(\"data\"),","            len = data.length - 1,","            label = data[len];","        return label;","    },","","    /**","     * Calculates and returns a value based on the number of labels and the index of","     * the current label.","     *","     * @method _getLabelByIndex","     * @param {Number} i Index of the label.","     * @return String","     * @private","     */","    _getLabelByIndex: function(i)","    {","        var label,","            data = this.get(\"data\");","        label = data[i];","        return label;","    },","","    /**","     * Calculates the position of ticks and labels based on an array of specified label values. Returns","     * an object containing an array of values to be used for labels and an array of objects containing","     * x and y coordinates for each label.","     *","     * @method _getDataFromLabelValues","     * @param {Object} startPoint An object containing the x and y coordinates for the start of the axis.","     * @param {Array} labelValues An array containing values to be used for determining the number and","     * position of labels and ticks on the axis.","     * @param {Number} edgeOffset The distance, in pixels, on either edge of the axis.","     * @param {Number} layoutLength The length, in pixels, of the axis. If the axis is vertical, the length","     * is equal to the height. If the axis is horizontal, the length is equal to the width.","     * @return Object","     * @private","     */","    _getDataFromLabelValues: function(startPoint, labelValues, edgeOffset, layoutLength, direction)","    {","        var points = [],","            values = [],","            labelValue,","            multiplier = (layoutLength - (edgeOffset * 2))/(this.getTotalMajorUnits() - 1),","            data = this.get(\"data\"),","            labelIndex,","            i,","            len = labelValues.length,","            staticCoord,","            dynamicCoord,","            constantVal,","            newPoint,","            rawVal;","        if(direction === \"vertical\")","        {","            staticCoord = \"x\";","            dynamicCoord = \"y\";","        }","        else","        {","            staticCoord = \"y\";","            dynamicCoord = \"x\";","        }","        constantVal = startPoint[staticCoord];","        for(i = 0; i < len; i = i + 1)","        {","            labelValue = labelValues[i];","            labelIndex = Y.Array.indexOf(data, labelValue);","            if(Y.Lang.isNumber(labelIndex) && labelIndex > -1)","            {","                rawVal = labelIndex ? (labelIndex * multiplier) : 0;","                newPoint = {};","                newPoint[staticCoord] = constantVal;","                newPoint[dynamicCoord] = rawVal + edgeOffset;","                points.push(newPoint);","                values.push(labelValue);","            }","        }","        return {","            points: points,","            values: values","        };","    }","});","","","","}, '@VERSION@', {\"requires\": [\"axis\", \"axis-category-base\"]});"];
_yuitest_coverage["build/axis-category/axis-category.js"].lines = {"1":0,"19":0,"29":0,"31":0,"43":0,"46":0,"60":0,"62":0,"63":0,"83":0,"96":0,"98":0,"99":0,"103":0,"104":0,"106":0,"107":0,"109":0,"110":0,"111":0,"113":0,"114":0,"115":0,"116":0,"117":0,"118":0,"121":0};
_yuitest_coverage["build/axis-category/axis-category.js"].functions = {"getMinimumValue:27":0,"getMaximumValue:41":0,"_getLabelByIndex:58":0,"_getDataFromLabelValues:81":0,"(anonymous 1):1":0};
_yuitest_coverage["build/axis-category/axis-category.js"].coveredLines = 27;
_yuitest_coverage["build/axis-category/axis-category.js"].coveredFunctions = 5;
_yuitest_coverline("build/axis-category/axis-category.js", 1);
YUI.add('axis-category', function (Y, NAME) {

/**
 * Provides functionality for drawing a category axis for use with a chart.
 *
 * @module charts
 * @submodule axis-category
 */
/**
 * CategoryAxis draws a category axis for a chart.
 *
 * @class CategoryAxis
 * @constructor
 * @extends Axis
 * @uses CategoryImpl
 * @param {Object} config (optional) Configuration parameters.
 * @submodule axis-category
 */
_yuitest_coverfunc("build/axis-category/axis-category.js", "(anonymous 1)", 1);
_yuitest_coverline("build/axis-category/axis-category.js", 19);
Y.CategoryAxis = Y.Base.create("categoryAxis", Y.Axis, [Y.CategoryImpl], {
    /**
     * Returns a string corresponding to the first label on an
     * axis.
     *
     * @method getMinimumValue
     * @return String
     */
    getMinimumValue: function()
    {
        _yuitest_coverfunc("build/axis-category/axis-category.js", "getMinimumValue", 27);
_yuitest_coverline("build/axis-category/axis-category.js", 29);
var data = this.get("data"),
            label = data[0];
        _yuitest_coverline("build/axis-category/axis-category.js", 31);
return label;
    },

    /**
     * Returns a string corresponding to the last label on an
     * axis.
     *
     * @method getMaximumValue
     * @return String
     */
    getMaximumValue: function()
    {
        _yuitest_coverfunc("build/axis-category/axis-category.js", "getMaximumValue", 41);
_yuitest_coverline("build/axis-category/axis-category.js", 43);
var data = this.get("data"),
            len = data.length - 1,
            label = data[len];
        _yuitest_coverline("build/axis-category/axis-category.js", 46);
return label;
    },

    /**
     * Calculates and returns a value based on the number of labels and the index of
     * the current label.
     *
     * @method _getLabelByIndex
     * @param {Number} i Index of the label.
     * @return String
     * @private
     */
    _getLabelByIndex: function(i)
    {
        _yuitest_coverfunc("build/axis-category/axis-category.js", "_getLabelByIndex", 58);
_yuitest_coverline("build/axis-category/axis-category.js", 60);
var label,
            data = this.get("data");
        _yuitest_coverline("build/axis-category/axis-category.js", 62);
label = data[i];
        _yuitest_coverline("build/axis-category/axis-category.js", 63);
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
        _yuitest_coverfunc("build/axis-category/axis-category.js", "_getDataFromLabelValues", 81);
_yuitest_coverline("build/axis-category/axis-category.js", 83);
var points = [],
            values = [],
            labelValue,
            multiplier = (layoutLength - (edgeOffset * 2))/(this.getTotalMajorUnits() - 1),
            data = this.get("data"),
            labelIndex,
            i,
            len = labelValues.length,
            staticCoord,
            dynamicCoord,
            constantVal,
            newPoint,
            rawVal;
        _yuitest_coverline("build/axis-category/axis-category.js", 96);
if(direction === "vertical")
        {
            _yuitest_coverline("build/axis-category/axis-category.js", 98);
staticCoord = "x";
            _yuitest_coverline("build/axis-category/axis-category.js", 99);
dynamicCoord = "y";
        }
        else
        {
            _yuitest_coverline("build/axis-category/axis-category.js", 103);
staticCoord = "y";
            _yuitest_coverline("build/axis-category/axis-category.js", 104);
dynamicCoord = "x";
        }
        _yuitest_coverline("build/axis-category/axis-category.js", 106);
constantVal = startPoint[staticCoord];
        _yuitest_coverline("build/axis-category/axis-category.js", 107);
for(i = 0; i < len; i = i + 1)
        {
            _yuitest_coverline("build/axis-category/axis-category.js", 109);
labelValue = labelValues[i];
            _yuitest_coverline("build/axis-category/axis-category.js", 110);
labelIndex = Y.Array.indexOf(data, labelValue);
            _yuitest_coverline("build/axis-category/axis-category.js", 111);
if(Y.Lang.isNumber(labelIndex) && labelIndex > -1)
            {
                _yuitest_coverline("build/axis-category/axis-category.js", 113);
rawVal = labelIndex ? (labelIndex * multiplier) : 0;
                _yuitest_coverline("build/axis-category/axis-category.js", 114);
newPoint = {};
                _yuitest_coverline("build/axis-category/axis-category.js", 115);
newPoint[staticCoord] = constantVal;
                _yuitest_coverline("build/axis-category/axis-category.js", 116);
newPoint[dynamicCoord] = rawVal + edgeOffset;
                _yuitest_coverline("build/axis-category/axis-category.js", 117);
points.push(newPoint);
                _yuitest_coverline("build/axis-category/axis-category.js", 118);
values.push(labelValue);
            }
        }
        _yuitest_coverline("build/axis-category/axis-category.js", 121);
return {
            points: points,
            values: values
        };
    }
});



}, '@VERSION@', {"requires": ["axis", "axis-category-base"]});
