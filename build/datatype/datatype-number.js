YUI.add('datatype-number', function(Y) {

/**
 * The DataType utility provides a set of utility functions to operate on native
 * JavaScript data types.
 *
 * @module datatype
 */
var LANG = Y.Lang,

/**
 * Number submodule.
 *
 * @class DataType.Number
 * @static
 */
Number = {

    /**
     * Converts data to type Number.
     *
     * @method parse
     * @param data {String | Number | Boolean} Data to convert. Note, the following
     * values return as null: null, undefined, NaN, "".
     * @return {Number} A number, or null.
     * @static
     */
    parse : function(data) {
        if(!LANG.isValue(data) || (data === "")) {
            return null;
        }

        //Convert to number
        var number = data * 1;

        // Validate
        if(LANG.isNumber(number)) {
            return number;
        }
        else {
            return null;
        }
    },

     /**
     * Takes a Number and formats to string for display to user.
     *
     * @method format
     * @param data {Number} Number.
     * @param config {Object} (Optional) Optional configuration values:
     *  <dl>
     *   <dt>prefix {String}</dd>
     *   <dd>String prepended before each number, like a currency designator "$"</dd>
     *   <dt>decimalPlaces {Number}</dd>
     *   <dd>Number of decimal places to round.</dd>
     *   <dt>decimalSeparator {String}</dd>
     *   <dd>Decimal separator</dd>
     *   <dt>thousandsSeparator {String}</dd>
     *   <dd>Thousands separator</dd>
     *   <dt>suffix {String}</dd>
     *   <dd>String appended after each number, like " items" (note the space)</dd>
     *  </dl>
     * @return {String} Formatted number for display. Note, the following values
     * return as "": null, undefined, NaN, "".
     */
    format : function(data, config) {
        if(!LANG.isValue(data) || (data === "")) {
            return "";
        }

        config = config || {};

        if(!LANG.isNumber(data)) {
            data *= 1;
        }

        if(LANG.isNumber(data)) {
            var isNeg = (data < 0);
            var output = data + "";
            var decSep = (config.decimalSeparator) ? config.decimalSeparator : ".";
            var dotIndex;

            // Manage decimals
            if(LANG.isNumber(config.decimalPlaces)) {
                // Round to the correct decimal place
                var decPlaces = config.decimalPlaces;
                var dec = Math.pow(10, decPlaces);
                output = Math.round(data*dec)/dec + "";
                dotIndex = output.lastIndexOf(".");

                if(decPlaces > 0) {
                    // Add the decimal separator
                    if(dotIndex < 0) {
                        output += decSep;
                        dotIndex = output.length-1;
                    }
                    // Replace the "."
                    else if(decSep !== "."){
                        output = output.replace(".",decSep);
                    }
                    // Add missing zeros
                    while((output.length - 1 - dotIndex) < decPlaces) {
                        output += "0";
                    }
                }
            }

            // Add the thousands separator
            if(config.thousandsSeparator) {
                var thouSep = config.thousandsSeparator;
                dotIndex = output.lastIndexOf(decSep);
                dotIndex = (dotIndex > -1) ? dotIndex : output.length;
                var newOutput = output.substring(dotIndex);
                var count = -1;
                for (var i=dotIndex; i>0; i--) {
                    count++;
                    if ((count%3 === 0) && (i !== dotIndex) && (!isNeg || (i > 1))) {
                        newOutput = thouSep + newOutput;
                    }
                    newOutput = output.charAt(i-1) + newOutput;
                }
                output = newOutput;
            }

            // Prepend prefix
            output = (config.prefix) ? config.prefix + output : output;

            // Append suffix
            output = (config.suffix) ? output + config.suffix : output;

            return output;
        }
        // Still not a Number, just return unaltered
        else {
            return data;
        }
    }
};

Y.namespace("DataType").Number = Number;



}, '@VERSION@' ,{requires:['??']});
