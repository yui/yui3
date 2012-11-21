PluralFormatter = function(values) {
    PluralFormatter.superclass.constructor.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*plural\\s*,\\s*";
}

Y.extend(PluralFormatter, SelectFormatter);

PluralFormatter.createInstance = function(values) {
    return new PluralFormatter(values);
}

PluralFormatter.prototype.select = function(options, params) {
    var result = options.other;
    if(params.value == 0 && options.zero) {
        result = options.zero;
    }
    if(params.value == 1 && options.one) {
        result = options.one;
    }
    if(params.value == 2 && options.two) {
        result = options.two;
    }

    result = result.replace("#", new NumberFormatter({VAL: params.value}).format("{VAL, number, integer}"));	//Use 'number' to format this part

    return result;
}
