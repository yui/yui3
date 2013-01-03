YUI.add('template-test', function (Y) {

var Assert = Y.Assert,
    Micro  = Y.Template.Micro,

    templateSuite = Y.TemplateTestSuite = new Y.Test.Suite('Template'),
    microSuite    = new Y.Test.Suite('Micro');

// -- Y.Template.Micro ---------------------------------------------------------

// -- Methods ------------------------------------------------------------------
microSuite.add(new Y.Test.Case({
    name: 'Methods',

    'compile() should return a compiled template function': function () {
        var compiled = Micro.compile('test');

        Assert.isFunction(compiled, 'return value should be a function');
        Assert.areSame('test', compiled(), 'executing the function should render the template');
    },

    'compile() should return precompiled source if the `precompile` option is `true`': function () {
        Assert.isString(Micro.compile('test', {precompile: true}));
    },

    'compile() options should be overridable': function () {
        var compiled = Micro.compile('{{data.foo}}', {escapedOutput: /\{\{([\s\S]+?)\}\}/g});
        Assert.areSame('bar', compiled({foo: 'bar'}));
    },

    'precompile() should return precompiled template code': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t='test';\nreturn $t;\n}",
            Micro.precompile('test')
        );
    },

    'precompile() should respect compile options': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t=''+\n$e($v(data.test))+\n'';\nreturn $t;\n}",

            Micro.precompile('{{data.test}}', {
                escapedOutput: /\{\{([\s\S]+?)\}\}/g
            })
        );
    },

    'render() should compile and render in a single step': function () {
        Assert.areSame('bar baz', Micro.render('<%=data.a%> <%=data.b%>', {a: 'bar', b: 'baz'}));
    },

    'render() should respect compile options': function () {
        Assert.areSame('foo', Micro.render('{{data.a}}', {a: 'foo'}, {escapedOutput: /\{\{([\s\S]+?)\}\}/g}));
    },

    'revive() should revive a precompiled template into an executable template function': function () {
        eval('var precompiled=' + Micro.precompile('<%== data.a %> <%= data.b %>') + ';');

        var revived = Micro.revive(precompiled);

        Assert.areSame('bar baz', revived({a: 'bar', b: 'baz'}));
    },

    '`this` object in the compiled template should refer to the data object': function () {
        Assert.areSame('bar', Micro.render('<%= this.foo %>', {foo: 'bar'}));
    }
}));

// -- Syntax -------------------------------------------------------------------
microSuite.add(new Y.Test.Case({
    name: 'Syntax',

    '<% ... %> should be rendered as a block of JavaScript code': function () {
        var compiled = Micro.compile('<% if (data.display) { %>hello<% } %>');

        Assert.areSame('hello', compiled({display: true}));
        Assert.areSame('', compiled({display: false}));
    },

    '<% ... %> should allow line breaks': function () {
        var compiled = Micro.compile("<%\nif (data.display) {\n%>hello<%\n}\n%>");

        Assert.areSame('hello', compiled({display: true}));
        Assert.areSame('', compiled({display: false}));
    },

    '<% ... %> should support switch statements': function () {
        var compiled = Micro.compile(
            'test' +
            '<% switch (data.foo) { %>' +
                '<% case "a": %>' +
                    'a' +
                    '<% break; %>' +

                '<% case "b": %>' +
                    'b' +
                    '<% break; %>' +

                '<% case "c": %>' +
                    'c' +
                    '<% break; %>' +
            '<% } %>' +
            'test'
        );

        Assert.areSame('testatest', compiled({foo: 'a'}));
        Assert.areSame('testbtest', compiled({foo: 'b'}));
        Assert.areSame('testctest', compiled({foo: 'c'}));
    },

    '<%= ... %> should be rendered as HTML-escaped output': function () {
        Assert.areSame('at&amp;t', Micro.render('<%= data.name %>', {name: 'at&t'}));
    },

    '<%= ... %> should print an empty string if given a falsy non-numeric value': function () {
        Assert.areSame('foobar', Micro.render('foo<%= data.value %>bar'), 'should print an empty string when the value is `undefined`');
        Assert.areSame('foobar', Micro.render('foo<%= data.value %>bar', {value: false}), 'should print an empty string when the value is `false`');
        Assert.areSame('foobar', Micro.render('foo<%= data.value %>bar', {value: null}), 'should print an empty string when the value is `null`');
    },

    '<%= ... %> should print "0" if given a numerical 0': function () {
        Assert.areSame('0', Micro.render('<%= data.zero %>', {zero: 0}));
    },

    '<%== ... %> should be rendered as raw output': function () {
        Assert.areSame('at&t', Micro.render('<%== data.name %>', {name: 'at&t'}));
    },

    '<%== ... %> should print an empty string if given a falsy non-numeric value': function () {
        Assert.areSame('foobar', Micro.render('foo<%== data.value %>bar'), 'should print an empty string when the value is `undefined`');
        Assert.areSame('foobar', Micro.render('foo<%== data.value %>bar', {value: false}), 'should print an empty string when the value is `false`');
        Assert.areSame('foobar', Micro.render('foo<%== data.value %>bar', {value: null}), 'should print an empty string when the value is `null`');
    },

    '<%== ... %> should print "0" if given a numerical 0': function () {
        Assert.areSame('0', Micro.render('<%== data.zero %>', {zero: 0}));
    },

    'Special characters in a template string should be properly escaped for use in a string literal': function () {
        Assert.areSame('\r\r\n\n\t\t\'\'\\\\\u2028\u2029', Micro.render('\r\r\n\n\t\t\'\'\\\\\u2028\u2029'));
    }
}));

templateSuite.add(microSuite);

// -- Y.Template ---------------------------------------------------------------

templateSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    _should: {
        error: {
            'constructor should error if no engine is loaded or supplied': true
        }
    },

    'constructor should accept an engine class': function () {
        Assert.areSame(Y.Handlebars, (new Y.Template(Y.Handlebars)).engine);
    },

    'engine should default to Y.Template.Micro if available': function () {
        Assert.areSame(Y.Template.Micro, (new Y.Template()).engine);
    },

    'constructor should error if no engine is loaded or supplied': function () {
        YUI().use('template-base', function (Y2) {
            var template = new Y2.Template();
        });
    },

    'An existing `Y.Template` namespace should be preserved': function () {
        YUI().use('yui-base', function (Y2) {
            Y2.Template = {foo: 'bar'};

            Y2.use('template-base', function () {
                Assert.areSame('bar', Y2.Template.foo);
            });
        });
    }
}));

templateSuite.add(new Y.Test.Case({
    name: 'Methods',

    'compile() should compile a template using the selected engine': function () {
        Assert.areSame('foo', (new Y.Template()).compile('<%=data.a%>')({a: 'foo'}), 'should compile Micro templates');
        Assert.areSame('foo', (new Y.Template(Y.Handlebars)).compile('{{a}}')({a: 'foo'}), 'should compile Handlebars templates');
    },

    'compile() should pass options to the selected engine': function () {
        Assert.areSame(
            'foo',
            (new Y.Template()).compile('{{data.a}}', {
                escapedOutput: /\{\{([\s\S]+?)\}\}/g
            })({a: 'foo'})
        );
    },

    'precompile() should precompile a template using the selected engine': function () {
        Assert.areSame(
            Y.Template.Micro.precompile('test'),
            (new Y.Template()).precompile('test')
        );
    },

    'precompile() should pass options to the selected engine': function () {
        var escapedOutputRegex = /\{\{([\s\S]+?)\}\}/g;

        Assert.areSame(
            Y.Template.Micro.precompile('{{data.test}}', {escapedOutput: escapedOutputRegex}),
            (new Y.Template()).precompile('{{data.test}}', {escapedOutput: escapedOutputRegex})
        );
    },

    'render() should compile and render a template using the selected engine': function () {
        Assert.areSame(
            'foo',
            (new Y.Template()).render('<%=data.a%>', {a: 'foo'})
        );
    },

    "render() should compile and render internally if the selected engine doesn't have a render() method": function () {
        var FakeEngine = Y.merge(Y.Template.Micro);
        delete FakeEngine.render;

        Assert.areSame(
            'foo',
            (new Y.Template(FakeEngine)).render('<%=data.a%>', {a: 'foo'})
        );
    },

    'render() should pass options to the selected engine': function () {
        Assert.areSame(
            'foo',
            (new Y.Template()).render('{{data.a}}', {a: 'foo'}, {
                escapedOutput: /\{\{([\s\S]+?)\}\}/g
            })
        );
    },

    'revive() should revive a precompiled template': function () {
        eval('var precompiled = ' + Micro.precompile('<%=data.a%>') + ';');
        Assert.areSame('foo', (new Y.Template()).revive(precompiled)({a: 'foo'}));
    },

    "revive() should return the given template if the engine doesn't have a revive() method": function () {
        eval('var precompiled = ' + Micro.precompile('<%=data.a%>') + ';');
        Assert.areSame(precompiled, (new Y.Template({})).revive(precompiled));
    }
}));

templateSuite.add(new Y.Test.Case({
    name: 'Options',

    setUp: function () {
        // Creates a Template.Micro engine with specificed defaults.
        this.microEngine = new Y.Template(Y.Template.Micro, {
            code         : /\{\{%([\s\S]+?)%\}\}/g,
            escapedOutput: /\{\{(?!%)([\s\S]+?)\}\}/g,
            rawOutput    : /\{\{\{([\s\S]+?)\}\}\}/g
        });

        // Creates a Handlebars engine with specificed defaults.
        this.hbEngine = new Y.Template(Y.Handlebars, {
            partials: {
                foo: '!{{a}}!'
            }
        });
    },

    tearDown: function () {
        delete this.microEngine;
        delete this.hbEngine;
    },

    'compile() should compile a template using the specified `defaults`': function () {
        Assert.areSame('foo', this.microEngine.compile('{{this.a}}')({a: 'foo'}), 'should compile Micro templates with custom syntax');
        Assert.areSame('!foo!', this.hbEngine.compile('{{> foo}}')({a: 'foo'}, this.hbEngine.defaults), 'should compile Handlebars template with default partials');
    },

    'compile() should merge `defaults` with specificed `options`': function () {
        Assert.areSame(
            'foo',
            this.microEngine.compile('<%= data.a %>', {
                escapedOutput: /<%=([\s\S]+?)%>/g
            })({a: 'foo'})
        );
    },

    'precompile() should precompile a template using the specified `defaults`': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t=''+\n$e($v(data.test))+\n'';\nreturn $t;\n}",
            this.microEngine.precompile('{{data.test}}')
        );
    },

    'precompile() should merge `defaults` with the specified `options`': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='', $v=function (v){return v || v === 0 ? v : $b;}, $t=''+\n$e($v(data.test))+\n'';\nreturn $t;\n}",

            this.microEngine.precompile('<%=data.test%>', {
                escapedOutput:  /<%=([\s\S]+?)%>/g
            })
        );
    },

    'render() should compile and render a template using the the specified `defaults`': function () {
        Assert.areSame(
            'foo',
            this.microEngine.render('{{data.a}}', {a: 'foo'})
        );
    },

    'render() should merge `defaults` with the specified `options`': function () {
        Assert.areSame(
            'foo bar',
            this.microEngine.render('<%= data.a %> {{{ data.b }}}', {
                a: 'foo',
                b: 'bar'
            }, {
                escapedOutput:  /<%=([\s\S]+?)%>/g
            })
        );
    },

    'revive() should revive a precompiled template using the specified `defaults`': function () {
        eval('var precompiled = ' + this.microEngine.precompile('{{data.a}}') + ';');
        Assert.areSame('foo', this.microEngine.revive(precompiled)({a: 'foo'}));
    },

    'revive() should merge `defaults` with the specified `options`': function () {
        eval('var precompiled = ' + this.microEngine.precompile('{{data.a}}') + ';');
        Assert.areSame('foo', this.microEngine.revive(precompiled, {})({a: 'foo'}));
    }
}));

}, '@VERSION@', {
    requires: ['handlebars', 'template', 'test']
});
