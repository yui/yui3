/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

Y.mix(Y.Intl, {
    formatMessage: function(pattern, values, config) {
        config = config || {};
        for(var i=0; i<formatters.length; i++) {
            var formatter = formatters[i].createInstance(values);
            pattern = formatter.format(pattern, config);
        }
        return pattern;
    }
})
