Y.mix( Y.Number, {
     _nonStandardFormat: Y.Number.format,
     _nonStandardParse:  Y.Number.parse
});

Y.mix( Y.Number, {
     /**
      * Takes a Number and formats to string for display to user
      *
      * @for Number
      * @method format
      * @param data {Number} Number
      * @param [config] {Object} Optional Configuration values.
      *   <dl>
      *      <dt>[style] {Number|String}</dt>
      *         <dd>Format/Style to use. See Y.Number.STYLES</dd>
      *      <dt>[parseIntegerOnly] {Boolean}</dt>
      *         <dd>If set to true, only the whole number part of data will be used</dd>
      *      <dt>[currency] {String}</dd>
      *         <dd>Currency code. Used only if style is a currency type</dd>
      *      <dt>[prefix] {String}</dd>
      *         <dd>String prepended before each number, like a currency designator "$"</dd>
      *      <dt>[decimalPlaces] {Number}</dd>
      *         <dd>Number of decimal places to round. Must be a number 0 to 20.</dd>
      *      <dt>[decimalSeparator] {String}</dd>
      *         <dd>Decimal separator</dd>
      *      <dt>[thousandsSeparator] {String}</dd>
      *         <dd>Thousands separator</dd>
      *      <dt>[suffix] {String}</dd>
      *         <dd>String appended after each number, like " items" (note the space)</dd>
      *   </dl>
      * @return {String} Formatted string representation of data
      */
     format: function(data, config) {
         config = config || {};
    
         if(config.prefix !== undefined || config.decimalPlaces !== undefined || config.decimalSeparator !== undefined
               || config.thousandsSeparator !== undefined || config.suffix !== undefined) {
             return Y.Number._nonStandardFormat(data, config);
         }

         if(Y.Lang.isString(config.style)) {
             config.style = Y.Number.STYLES[config.style];
         }
	
         //If ecmascript i18n api available, use that.
         //Ecmascript i18n api does not support scientific style
         if(Y.Number.formatEcma && config.style !== Y.Number.STYLES.SCIENTIFIC_STYLE) {
             return Y.Number.formatEcma(data, config);
         }

         var formatter = new YNumberFormat(config.style);
         if(config.parseIntegerOnly) {
             formatter.setParseIntegerOnly(true);
         }
         if(formatter.isCurrencyStyle()) {
             if(config.currency !== undefined) {
                 formatter.setCurrency(config.currency);
             }
         }
         return formatter.format(data);
     },

     /**
      * Parses data and returns a number
      *
      * @for Number
      * @method format
      * @param data {String} Data to be parsed
      * @param [config] (Object} Object containg 'style' (Pattern data is represented in.
               See Y.Number.STYLES) and 'parsePosition' (index position in data to start parsing at) Both parameters are optional.
               If omitted, style defaults to NUMBER_STYLE, and parsePosition defaults to 0
      * @return {Number} Number represented by data
      */
     parse: function(data, config) {
         config = config || {};
         if(config.style === undefined) {
             return Y.Number._nonStandardParse(data);
         }
         var formatter = new YNumberFormat(config.style);
         return formatter.parse(data, config.parsePosition);
     }
}, true);

//Update Parsers shortcut
Y.namespace("Parsers").number = Y.Number.parse;
