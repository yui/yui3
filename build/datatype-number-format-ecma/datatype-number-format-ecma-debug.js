YUI.add('datatype-number-format-ecma', function (Y, NAME) {

/**
 * This module adds the ability to fallback to ecmascript i18n api if available when formatting numbers.
 *
 * @module datatype-number-format-ecma
 * @requires datatype-number-format-advanced
 */
Y.namespace("Number");

Y.mix(Y.Number, {
   /**
    * Style options for formatting. Mapping to the required form
    * @property STYLES_ECMA
    * @type Object
    * @static
    * @final
    * @for Number
    */
   STYLES_ECMA: {
      1: /*CURRENCY_STYLE*/         {style: "currency", currencyDisplay:"symbol"},
      2: /*ISO_CURRENCY_STYLE*/     {style: "currency", currencyDisplay: "code"},
      4: /*NUMBER_STYLE*/           {style: "decimal"},
      8: /*PERCENT_STYLE*/          {style: "percent", maximumFractionDigits: 0},
      16: /*PLURAL_CURRENCY_STYLE*/ {style: "currency", currencyDisplay: "name"}
      //32: /*SCIENTIFIC_STYLE*/    {}//Scientific notation not supported by ecma api
   },

   /**
    * Format a number
    * @method formatEcma
    * @param data {Number} the number to format
    * @param config {Object} Configuration parameters
    * @for Number
    * @return {String}
    */
   formatEcma: function(data, config) {
      Y.log("Using ecmascript i18n api.");
      var options = {useGrouping: true};

      //Make a copy, do not modify original object
      Y.mix(options, Y.Number.STYLES_ECMA[config.style]);

      //If set, do not display fractional parts. Also, do not display .0 at end of number
      if(config.parseIntegerOnly) {
          options.maximumFractionDigits = 0;
      }

      //If currency style, need to specify currency
      if(options.style === "currency") {
          options.currency = config.currency || Y.Intl.get("datatype-number-format-advanced").defaultCurrency || "USD";
      }

      return data.toLocaleString(Y.config.lang, options);
   }
});


}, '@VERSION@', {"requires": ["intl"]});
