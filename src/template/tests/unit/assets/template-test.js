YUI.add('template-test', function (Y) {

var Assert = Y.Assert;

Y.TemplateTestSuite = new Y.Test.Suite('Template');

Y.TemplateTestSuite.add(new Y.Test.Case({
    'Y.template() should return a compiled template function': function () {
        var compiled = Y.template('test');

        Assert.isFunction(compiled, 'return value should be a function');
        Assert.areSame('test', compiled(), 'executing the function should render the template');
        Assert.areSame("function (data) {\nvar $t='';\nwith(this){\n$t+='test';}\nreturn $t;\n}", compiled.source, '`source` property of the function should contain the compiled template source');
    },

    '<% ... %> should be rendered as a block of JavaScript code': function () {
        var compiled = Y.template('<% if (display) { %>hello<% } %>');

        Assert.areSame('hello', compiled({display: true}));
        Assert.areSame('', compiled({display: false}));
    },

    '<%= ... %> should be rendered as HTML-escaped output': function () {
        Assert.areSame('at&amp;t', Y.template('<%= name %>')({name: 'at&t'}));
    },

    '<%== ... %> should be rendered as raw output': function () {
        Assert.areSame('at&t', Y.template('<%== name %>')({name: 'at&t'}));
    },

    'template options should be overridable': function () {
        var compiled = Y.template('{{foo}}', {escapedOutput: /\{\{([\s\S]+?)\}\}/g});
        Assert.areSame('bar', compiled({foo: 'bar'}));
    },

    '`this` object in the compiled template should refer to the data object': function () {
        Assert.areSame('bar', Y.template('<%= this.foo %>')({foo: 'bar'}));
    }
}));

}, '@VERSION@', {
    requires: ['template', 'test']
});
