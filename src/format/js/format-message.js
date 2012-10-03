/**
 * Formatter classes. For each group found in the pattern, will try to parse with all of these formatters.
 * If a formatter fails to parse, the next one in the list try to do so.
 */
var formatters = [ StringFormatter, DateFormatter, TimeFormatter, NumberFormatter, ChoiceFormatter, PluralFormatter, SelectFormatter ];

Y.MessageFormat = {
    setTimeZone: Formatter.setTimeZone,

    getTimeZone: Formatter.getTimeZone,

    format: function(pattern, values) {
        for(var i=0; i<formatters.length; i++) {
            var formatter = formatters[i].createInstance(values);
            pattern = formatter.format(pattern);
        }
        return pattern;
    }
}
