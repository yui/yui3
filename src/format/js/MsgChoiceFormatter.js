ChoiceFormatter = function(values) {
    SelectFormatter.call(this, values);
    this.regex = "{\\s*([a-zA-Z0-9_]+)\\s*,\\s*choice\\s*,\\s*(.+)}";
}

ChoiceFormatter.prototype = new SelectFormatter;
ChoiceFormatter.prototype.constructor = ChoiceFormatter;


ChoiceFormatter.createInstance = function(values) {
    return new ChoiceFormatter(values);
}

ChoiceFormatter.prototype.parseOptions = function(choicesStr) {
    var options = [];
    var choicesArray = choicesStr.split("|");
    for (var i=0; i<choicesArray.length; i++) {
        var choice = choicesArray[i];
        var relations = ['#', '<', '\u2264'];
        for (var j=0; j<relations.length; j++) {
            var rel = relations[j];
            if(choice.indexOf(rel) != -1) {
                var mapping = choice.split(rel);
                var ch = {
                    value: mapping[0],
                    result: mapping[1],
                    relation: rel
                };
                options.push(ch);
                break;
            }
        }
    }

    return options;
}

ChoiceFormatter.prototype.getParams = function(params, matches) {
    if(SelectFormatter.prototype.getParams.call(this, params, matches)) {
        if(matches[2]) {
            params.choices = this.parseOptions(matches[2]);
            return params.choices === [] ? false: true;
        }
    }

    return false;
}

ChoiceFormatter.prototype.select = function(params) {
    for ( var i=0; i<params.choices.length; i++) {
        var choice = params.choices[i];
        var value = choice.value, result = choice.result, relation = choice.relation;
        if( (relation == '#' && value == params.value) || (relation == '<' && value < params.value) || (relation == '\u2264' && value <= params.value)) {
        return result;
        }
    }

    return "";
}

ChoiceFormatter.prototype.format = function(str) {
    var regex = new RegExp(this.regex, "gm");
    var matches = null;
    while((matches = regex.exec(str))) {
        var params = {};

        if(this.getParams(params, matches)) {
            var result = this.select(params);
            if(result) {
                str = str.replace(matches[0], result);
            }
        }
    }

    return str;
}
