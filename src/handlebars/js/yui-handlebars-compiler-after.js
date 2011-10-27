// This file contains YUI-specific wrapper code and overrides for the
// handlebars-compiler module.

var levels = ['debug', 'info', 'warn', 'error'];

Handlebars.logger.log = function (level, message) {
    Y.log(message, levels[level] || 'error', 'Handlebars');
};

Handlebars.render = function (string, context, options) {
    var template = Handlebars.compile(string);
    return template(context, options);
};
