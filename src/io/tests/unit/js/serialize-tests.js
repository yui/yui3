YUI.add('serialize-tests', function (Y) {

    var suite = new Y.Test.Suite('IO Serialize Tests'),
        form  = Y.one('#test-form').remove();

    suite.add(new Y.Test.Case({
        name: 'Form Serialization',

        setUp: function () {
            this.form = form.cloneNode(true).appendTo('body');
        },

        tearDown: function () {
            this.form.remove();
            delete this.form;
        },

        'stringify should serialize the form': function () {
            var postBody = Y.IO.stringify(this.form);
            Y.Assert.areSame('name=eric&age=27&secret=p%4055w0rd&save=Save', postBody);
        },

        'stringify with `useDisabled` should serialize the form including disabled fields': function () {
            var postBody = Y.IO.stringify(this.form, {useDisabled: true});
            Y.Assert.areSame('name=eric&age=27&username=ericf&secret=p%4055w0rd&save=Save', postBody);
        }
    }));

    Y.Test.Runner.add(suite);

});
