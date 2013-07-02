YUI.add('serialize-tests', function (Y) {

    var suite = new Y.Test.Suite('IO Serialize Tests'),
        form  = Y.one('#test-form');

    suite.add(new Y.Test.Case({
        name: 'Form Serialization',

        setUp: function () {
            this.form = Y.one('#test-form');
        },

        tearDown: function () {
            this.form.remove();
            delete this.form;
            form.cloneNode(true).appendTo('body');
        },

        'stringify should serialize the form': function () {
            var postBody = Y.IO.stringify(this.form);
            Y.Assert.areSame('name=eric&age=27&secret=p%4055w0rd&save=Save', postBody);
        },

        'stringify should serialize the form by id': function () {
            var postBody = Y.IO.stringify('test-form');
            Y.Assert.areSame('name=eric&age=27&secret=p%4055w0rd&save=Save', postBody);
        },

        'stringify with `useDisabled` should serialize the form including disabled fields': function () {
            var postBody = Y.IO.stringify(this.form, {useDisabled: true});
            Y.Assert.areSame('name=eric&age=27&username=ericf&secret=p%4055w0rd&save=Save', postBody);
        },

        'stringify should serialize the form plus string data': function () {
            var postBody = Y.IO.stringify(this.form, {extra: 'foo=bar'});
            Y.Assert.areSame('name=eric&age=27&secret=p%4055w0rd&save=Save&foo=bar', postBody);
        },

        'stringify should serialize the form plus object data': function () {
            var postBody = Y.IO.stringify(this.form, {extra: {foo:'bar'}});
            Y.Assert.areSame('name=eric&age=27&secret=p%4055w0rd&save=Save&foo=bar', postBody);
        },

        'stringify should serialize empty form': function () {
            var postBody = Y.IO.stringify('empty-form');
            Y.Assert.areSame('', postBody);
        },

        'stringify should serialize empty form plus data': function () {
            var postBody = Y.IO.stringify('empty-form', {extra: 'foo=bar'});
            Y.Assert.areSame('foo=bar', postBody);
        },

        'stringify should serialize disabled form': function () {
            var postBody = Y.IO.stringify('disabled-form');
            Y.Assert.areSame('', postBody);
        }
    }));

    Y.Test.Runner.add(suite);

});
