// This file contains YUI-specific wrapper code and overrides for the
// handlebars-compiler module.

/**
Handlebars parser and compiler. Use this module when you need to compile
Handlebars templates.

@module handlebars
@submodule handlebars-compiler
*/

var levels = ['debug', 'info', 'warn', 'error'];

/**
Logs a debugging message. Note that messages will only be logged when the
handlebars module is loaded in "debug" mode.

@method log
@param {String} level Log level for this message. Supported levels are "debug",
    "info", "warn", and "error".
@param {String} message Message to log.
@for Handlebars
*/
Handlebars.logger.log = function (level, message) {
    Y.log(message, levels[level] || 'error', 'Handlebars');
};

/**
Compiles and renders a Handlebars template string in a single step.

If you'll be using a template more than once, it's more efficient to compile it
into a function once using `compile()`, and then render it whenever you need to
by simply executing the compiled function. However, if you only need to compile
and render a template once, `render()` is a handy shortcut for doing both in a
single step.

@example

    Y.Handlebars.render('The pie of the day is {{pie}}!', {
        pie: 'Maple Custard'
    });
    // => "The pie of the day is Maple Custard!"

@method render
@param {String} string Handlebars template string to render.
@param {Object} context Context object to pass to the template.
@param {Object} [options] Compile/render options.
    @param {Object} [options.helpers] Helper functions.
    @param {Object} [options.partials] Partials.
    @param {Object} [options.data] Data.
@return {String} Rendered template string.
*/
Handlebars.render = function (string, context, options) {
    return this.compile(string)(context, options);
};

// The rest of this file is just API docs for methods defined in Handlebars
// itself.

/**
Compiles a Handlebars template string into a function. To render the template,
call the function and pass in a context object.

@example

    var template = Y.Handlebars.compile('The pie of the day is {{pie}}!.');
    template({pie: 'Pecan'});
    // => "The pie of the day is Pecan!"

@method compile
@param {String} string Handlebars template string to compile.
@param {Object} [options] Compiler options.
@return {Function} Compiled template function.
*/

/**
Precompiles a Handlebars template string into a string of JavaScript code. This
can be used to precompile a template at build time or on the server, and the
resulting template can then be rendered at runtime or on the client without
needing to go through a compile step.

To render a precompiled template, evaluate the code and then pass the resulting
function to `Y.Handlebars.template()` to get back an executable template
function.

@method precompile
@param {String} string Handlebars template string to compile.
@param {Object} [options] Compiler options.
@return {String} Precompiled template code.
*/
