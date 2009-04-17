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
            Y.log("Could not convert data " + Y.dump(data) + " to type Number", "warn", this.toString());
            return null;
        }
    },

     /**
     * Takes a Number and formats to string for display to user.
     *
     * @method format
     * @param nData {Number} Number.
     * @param oConfig {Object} (Optional) Optional configuration values:
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
    format : function(nData, oConfig) {
        var lang = YAHOO.lang;
        if(!lang.isValue(nData) || (nData === "")) {
            return "";
        }

        oConfig = oConfig || {};

        if(!lang.isNumber(nData)) {
            nData *= 1;
        }

        if(lang.isNumber(nData)) {
            var bNegative = (nData < 0);
            var sOutput = nData + "";
            var sDecimalSeparator = (oConfig.decimalSeparator) ? oConfig.decimalSeparator : ".";
            var nDotIndex;

            // Manage decimals
            if(lang.isNumber(oConfig.decimalPlaces)) {
                // Round to the correct decimal place
                var nDecimalPlaces = oConfig.decimalPlaces;
                var nDecimal = Math.pow(10, nDecimalPlaces);
                sOutput = Math.round(nData*nDecimal)/nDecimal + "";
                nDotIndex = sOutput.lastIndexOf(".");

                if(nDecimalPlaces > 0) {
                    // Add the decimal separator
                    if(nDotIndex < 0) {
                        sOutput += sDecimalSeparator;
                        nDotIndex = sOutput.length-1;
                    }
                    // Replace the "."
                    else if(sDecimalSeparator !== "."){
                        sOutput = sOutput.replace(".",sDecimalSeparator);
                    }
                    // Add missing zeros
                    while((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
                        sOutput += "0";
                    }
                }
            }

            // Add the thousands separator
            if(oConfig.thousandsSeparator) {
                var sThousandsSeparator = oConfig.thousandsSeparator;
                nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
                nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
                var sNewOutput = sOutput.substring(nDotIndex);
                var nCount = -1;
                for (var i=nDotIndex; i>0; i--) {
                    nCount++;
                    if ((nCount%3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1))) {
                        sNewOutput = sThousandsSeparator + sNewOutput;
                    }
                    sNewOutput = sOutput.charAt(i-1) + sNewOutput;
                }
                sOutput = sNewOutput;
            }

            // Prepend prefix
            sOutput = (oConfig.prefix) ? oConfig.prefix + sOutput : sOutput;

            // Append suffix
            sOutput = (oConfig.suffix) ? sOutput + oConfig.suffix : sOutput;

            return sOutput;
        }
        // Still not a Number, just return unaltered
        else {
            return nData;
        }
    }
};

Y.namespace("DataType").Number = Number;
