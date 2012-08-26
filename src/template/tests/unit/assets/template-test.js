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

        Assert.areSame(
            "function(Y,data,htmlEscaper){\nvar $t='';\nwith(data){\n$t+='test';}\nreturn $t;\n}",
            compiled.source,
            '`source` property of the function should contain the compiled template source'
        );
    },

    'compile() should support a custom data variable': function () {
        var compiled = Micro.compile('<%= stuff.test %>', {variable: 'stuff'});

        Assert.areSame('foo', compiled({test: 'foo'}), 'template should be rendered correctly');

        Assert.areSame(
            "function(Y,stuff,htmlEscaper){\nvar $t='';\n$t+=''+\nhtmlEscaper( stuff.test )+\n'';\nreturn $t;\n}",
            compiled.source,
            'source should not contain a with block'
        );
    },

    'precompile() should return precompiled template code': function () {
        Assert.areSame(
            "function(Y,data,htmlEscaper){\nvar $t='';\nwith(data){\n$t+='test';}\nreturn $t;\n}",
            Micro.precompile('test')
        );
    },

    'precompile() should respect custom options': function () {
        Assert.areSame(
            "function(Y,stuff,htmlEscaper){\nvar $t='';\n$t+=''+\nhtmlEscaper( stuff.test )+\n'';\nreturn $t;\n}",
            Micro.precompile('<%= stuff.test %>', {variable: 'stuff'})
        );
    },

    'render() should compile and render in a single step': function () {
        Assert.areSame('bar baz', Micro.render('<%=a%> <%=b%>', {a: 'bar', b: 'baz'}));
    },

    'render() should respect custom options': function () {
        Assert.areSame('bar baz', Micro.render('<%=foo.a%> <%=foo.b%>', {a: 'bar', b: 'baz'}, {variable: 'foo'}));
    },

    'revive() should revive a precompiled template into an executable template function': function () {
        eval('var precompiled=' + Micro.precompile('<%== a %> <%= b %>') + ';');

        var revived = Micro.revive(precompiled);

        Assert.areSame('bar baz', revived({a: 'bar', b: 'baz'}));
    },

    'template options should be overridable': function () {
        var compiled = Micro.compile('{{foo}}', {escapedOutput: /\{\{([\s\S]+?)\}\}/g});
        Assert.areSame('bar', compiled({foo: 'bar'}));
    },

    '`this` object in the compiled template should refer to the data object': function () {
        Assert.areSame('bar', Micro.render('<%= this.foo %>', {foo: 'bar'}));
    }
}));

// -- Syntax -------------------------------------------------------------------
microSuite.add(new Y.Test.Case({
    name: 'Syntax',

    '<% ... %> should be rendered as a block of JavaScript code': function () {
        var compiled = Micro.compile('<% if (display) { %>hello<% } %>');

        Assert.areSame('hello', compiled({display: true}));
        Assert.areSame('', compiled({display: false}));
    },

    '<% ... %> should allow line breaks': function () {
        var compiled = Micro.compile("<%\nif (display) {\n%>hello<%\n}\n%>");

        Assert.areSame('hello', compiled({display: true}));
        Assert.areSame('', compiled({display: false}));
    },

    '<%= ... %> should be rendered as HTML-escaped output': function () {
        Assert.areSame('at&amp;t', Micro.render('<%= name %>', {name: 'at&t'}));
    },

    '<%== ... %> should be rendered as raw output': function () {
        Assert.areSame('at&t', Micro.render('<%== name %>', {name: 'at&t'}));
    }
}));

templateSuite.add(microSuite);

// -- Y.Template ---------------------------------------------------------------

templateSuite.add(new Y.Test.Case({
    name: 'Lifecycle',

    'constructor should accept an engine class': function () {
        Assert.areSame(Y.Handlebars, (new Y.Template(Y.Handlebars)).engine);
    },

    'engine should default to Y.Template.Micro if available': function () {
        Assert.areSame(Y.Template.Micro, (new Y.Template()).engine);
    }
}));

templateSuite.add(new Y.Test.Case({
    name: 'Methods',

    'compile() should compile a template using the selected engine': function () {
        Assert.areSame('foo', (new Y.Template()).compile('<%=a%>')({a: 'foo'}), 'should compile Micro templates');
        Assert.areSame('foo', (new Y.Template(Y.Handlebars)).compile('{{a}}')({a: 'foo'}), 'should compile Handlebars templates');
    },

    'compile() should pass options to the selected engine': function () {
        Assert.areSame('foo', (new Y.Template()).compile('<%=foo.a%>', {variable: 'foo'})({a: 'foo'}));
    },

    'precompile() should precompile a template using the selected engine': function () {
        Assert.areSame(Micro.precompile('<%=foo%>'), (new Y.Template().precompile('<%=foo%>')));
    },

    'precompile() should pass options to the selected engine': function () {
        Assert.areSame(Micro.precompile('<%=a.foo%>', {variable: 'a'}), (new Y.Template().precompile('<%=a.foo%>', {variable: 'a'})));
    },

    'render() should compile and render a template using the selected engine': function () {
        Assert.areSame('foo', (new Y.Template()).render('<%=a%>', {a: 'foo'}));
    },

    "render() should compile and render internally if the selected engine doesn't have a render() method": function () {
        var FakeEngine = Y.merge(Y.Template.Micro);
        delete FakeEngine.render;

        Assert.areSame('foo', (new Y.Template(FakeEngine)).render('<%=a%>', {a: 'foo'}));
    },

    'revive() should revive a precompiled template': function () {
        eval('var precompiled = ' + Micro.precompile('<%=a%>') + ';');
        Assert.areSame('foo', (new Y.Template()).revive(precompiled)({a: 'foo'}));
    },

    "revive() should return the given template if the engine doesn't have a revive() method": function () {
        eval('var precompiled = ' + Micro.precompile('<%=a%>') + ';');
        Assert.areSame(precompiled, (new Y.Template({})).revive(precompiled));

    }
}));

}, '@VERSION@', {
    requires: ['handlebars', 'template', 'test']
});
