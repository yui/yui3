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
            "function (Y, $e, data) {\nvar $b='',$t='test';\nreturn $t;\n}",
            Micro.precompile('test')
        );
    },

    'precompile() should respect compile options': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='',$t=''+\n$e((data.test)||$b)+\n'';\nreturn $t;\n}",

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

    '<%= ... %> should print an empty string if given a falsy value': function () {
        Assert.areSame('foobar', Micro.render('foo<%= data.bogus %>bar'));
    },

    '<%== ... %> should be rendered as raw output': function () {
        Assert.areSame('at&t', Micro.render('<%== data.name %>', {name: 'at&t'}));
    },

    '<%== ... %> should print an empty string if given a falsy value': function () {
        Assert.areSame('foobar', Micro.render('foo<%== data.bogus %>bar'));
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
            "function (Y, $e, data) {\nvar $b='',$t='test';\nreturn $t;\n}",
            (new Y.Template()).precompile('test')
        );
    },

    'precompile() should pass options to the selected engine': function () {
        Assert.areSame(
            "function (Y, $e, data) {\nvar $b='',$t=''+\n$e((data.test)||$b)+\n'';\nreturn $t;\n}",

            (new Y.Template()).precompile('{{data.test}}', {
                escapedOutput: /\{\{([\s\S]+?)\}\}/g
            })
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

}, '@VERSION@', {
    requires: ['handlebars', 'template', 'test']
});
