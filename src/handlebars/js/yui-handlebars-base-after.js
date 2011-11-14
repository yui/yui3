// This file contains YUI-specific wrapper code and overrides for the
// handlebars-base module.

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@module handlebars
@main handlebars
*/

/**
Provides basic Handlebars template rendering functionality. Use this module when
you only need to render pre-compiled templates.

@module handlebars
@submodule handlebars-base
*/

/**
Handlebars is a simple template language inspired by Mustache.

This is a YUI port of the original Handlebars project, which can be found at
<https://github.com/wycats/handlebars.js>.

@class Handlebars
*/
Y.Handlebars = Handlebars;

Handlebars.VERSION += '-yui';

// The rest of this file is just API docs for methods defined in Handlebars
// itself.

/**
Registers a helper function that will be made available to all templates.

Helper functions receive the current template context as the `this` object, and
can also receive arguments passed by the template.

@example

    Y.Handlebars.registerHelper('linkify', function () {
        return '<a href="' + Y.Escape.html(this.url) + '">' +
            Y.Escape.html(this.text) + '</a>';
    });

    var source = '<ul>{{#each links}}<li>{{linkify}}</li>{{/each}}</ul>';

    Y.Handlebars.render(source, {
        links: [
            {url: '/foo', text: 'Foo'},
            {url: '/bar', text: 'Bar'},
            {url: '/baz', text: 'Baz'}
        ]
    });

@method registerHelper
@param {String} name Name of this helper.
@param {Function} fn Helper function.
@param {Boolean} [inverse=false] If `true`, this helper will be considered an
    "inverse" helper, like "unless". This means it will only be called if the
    expression given in the template evaluates to a false or empty value.
*/

/**
Registers a partial that will be made available to all templates.

A partial is another template that can be used to render part of a larger
template. For example, a website with a common header and footer across all its
pages might use a template for each page, which would call shared partials to
render the headers and footers.

Partials may be specified as uncompiled template strings or as compiled template
functions.

@example

    Y.Handlebars.registerPartial('header', '<h1>{{title}}</h1>');
    Y.Handlebars.registerPartial('footer', 'Copyright (c) 2011 by Me.');

    var source = '{{> header}} <p>Mustaches are awesome!</p> {{> footer}}';

    Y.Handlebars.render(source, {title: 'My Page About Mustaches'});

@method registerPartial
@param {String} name Name of this partial.
@param {Function|String} partial Template string or compiled template function.
*/

/**
Converts a precompiled template into a renderable template function.

@example

    <script src="precompiled-template.js"></script>
    <script>
    YUI().use('handlebars-base', function (Y) {
        // Convert the precompiled template function into a renderable template
        // function.
        var template = Y.Handlebars.template(precompiledTemplate);

        // Render it.
        template({pie: 'Pumpkin'});
    });
    </script>

@method template
@param {Function} template Precompiled Handlebars template function.
@return {Function} Compiled template function.
*/
