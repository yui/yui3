/**
Adds the `Y.template()` method, which provides fast, simple string-based
micro-templating similar to ERB or Underscore templates.

@module template
@since 3.7.0
**/

// This code was heavily inspired by Underscore.js's _.template() method
// (written by Jeremy Ashkenas), which was in turn inspired by John Resig's
// micro-templating implementation.

/**
Default options for `Y.template()`.

@property {Object} templateOptions
@since 3.7.0
@for YUI
**/
Y.templateOptions = {
    code         : /<%([\s\S]+?)%>/g,
    escapedOutput: /<%=([\s\S]+?)%>/g,
    rawOutput    : /<%==([\s\S]+?)%>/g,
    stringEscape : /\\|'|\r|\n|\t|\u2028|\u2029/g
};

/**
Compiles a template string into a JavaScript function. Pass a data object to the
function to render the template using the given data and get back a rendered
string.

Properties of the data object passed to a template function are converted into
variables in the local scope and made available for interpolation in the
template.

To interpolate the value of a data property into the template, use
`<%= name %>`, where `name` is the property name. The value will automatically
be HTML-escaped. To output the raw value without escaping, use `<%== name %>`.

To execute arbitrary JavaScript code within the template, use `<% code %>`,
where `code` is the code to be executed. This allows the use of if/else blocks,
loops, function calls, etc., although it's recommended that you avoid embedding
anything beyond basic flow control logic in your templates.

The function returned by `Y.template()` has a `source` property that contains
the raw JavaScript source code of the function. This is useful for precompiling
templates that you want to evaluate and execute in a different context. For
example, you might precompile during a build step or on a server, then execute
the precompiled code somewhere else.

This method is provided by the <a href="../modules/template.html">template</a>
module, so be sure to include that module in your `YUI().use()` statement if you
want to use it.

@example

    YUI().use('node', 'template', function (Y) {
        var template = '<ul class="<%= className %>">' +
                           '<% Y.Array.each(items, function (item) { %>' +
                               '<li><%= item %></li>' +
                           '<% }); %>' +
                       '</ul>';

        // Compile the template into a function.
        var render = Y.template(template);

        // Render the template to HTML, passing in the data to use.
        var html = render({
            className: 'demo-list',
            items    : ['one', 'two', 'three', 'four']
        });

        // Append the HTML to the body.
        Y.one('body').append(html);
    });

@method template
@param {String} text Template text.
@param {Object} [options] Options. If specified, these options will override the
    default options defined in `Y.templateOptions`.

    @param {RegExp} [options.code] Regex that matches code blocks like
        `<% ... %>`.
    @param {RegExp} [options.escapedOutput] Regex that matches escaped output
        tags like `<%= ... %>`.
    @param {RegExp} [options.rawOutput] Regex that matches raw output tags like
        `<%== ... %>`.
    @param {RegExp} [options.stringEscape] Regex that matches characters that
        need to be escaped inside single-quoted JavaScript string literals.

@return {Function} Compiled template function. Execute this function and pass in
    a data object to render the template with the given data.
@since 3.7.0
@for YUI
**/
Y.template = function (text, options) {
    options = Y.merge(Y.templateOptions, options);

    var blocks = [],
        source = "var $t='';\nwith(this){\n",
        render,
        template;

    // U+FFFF is guaranteed to represent a non-character, so no valid UTF-8
    // string should ever contain it. That means we can freely strip it out of
    // the input text (just to be safe) and then use it for our own nefarious
    // purposes as a token placeholder!
    //
    // See http://en.wikipedia.org/wiki/Mapping_of_Unicode_characters#Noncharacters
    text = text.replace(/\ufffe|\uffff/g, '');

    // Parse the input text into a string of JavaScript code, with placeholders
    // for code blocks. Text outside of code blocks will be escaped for safe
    // usage within string literals.
    source += "$t+='" +

        text.replace(options.rawOutput, function (match, code) {
            return "\ufffe" + (blocks.push("'+\n(" + code + ")+\n'") - 1) + "\uffff";
        })

        .replace(options.escapedOutput, function (match, code) {
            return "\ufffe" + (blocks.push("'+\nY.Escape.html(" + code + ")+\n'") - 1) + "\uffff";
        })

        .replace(options.code, function (match, code) {
            return "\ufffe" + (blocks.push("';\n" + code + "\n;$t+='") - 1) + "\uffff";
        })

        .replace(options.stringEscape, "\\$&") +

        "';}\nreturn $t;";

    // Replace the token placeholders with code from the stack.
    source = source.replace(/\ufffe(\d+)\uffff/g, function (match, index) {
        return blocks[parseInt(index, 10)];
    });

    // Compile the template source into an executable function.
    render = new Function('Y', source);

    template = function (data) {
        return render.call(data || {}, Y);
    };

    // Include the generated template source code on the function to make
    // precompilation possible.
    template.source = "function (data) {\n" + source + "\n}";

    return template;
};
