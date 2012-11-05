YUI.add('console-basic-tests', function(Y) {

    var suite = new Y.Test.Suite('console-basic example test suite');

    suite.add(new Y.Test.Case({
        name: 'Example tests',

        'first console should be visible, second and third hidden': function () {
            var consoles = Y.all('#demo .yui3-console'),
                hidden   = Y.all('#demo .yui3-console-hidden');

            Y.Assert.areSame(3, consoles.size());
            Y.Assert.areSame(2, hidden.size());
            Y.Assert.areSame(consoles.item(1), hidden.item(0));
            Y.Assert.areSame(consoles.item(2), hidden.item(1));
            Y.Assert.areSame('add_to_bottom', hidden.item(0).ancestor().get('id'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-separate'));
        },

        'check show/hide toggle button clicks': function() {
            var demo    = Y.one('#demo'),
                hidden  = demo.all('.yui3-console-hidden'),
                basic   = Y.one('#toggle_basic'),
                atb     = Y.one('#toggle_atb'),
                strings = Y.one('#toggle_cstrings');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-inline'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-separate'));

            // hide basic (all three hidden)
            basic.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.areSame('basic', hidden.item(0).ancestor().get('id'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-inline'));
            Y.Assert.isTrue(hidden.item(2).test('.yui3-console-separate'));

            // show basic (second two hidden)
            basic.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-inline'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-separate'));

            // show atb (last one still hidden)
            atb.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-separate'));

            // hide atb again (second two hidden)
            atb.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-inline'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-separate'));

            // show cstrings (second one still hidden)
            strings.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-inline'));

            // hide cstrings again (second two hidden)
            strings.simulate('click');

            hidden = demo.all('.yui3-console-hidden');

            Y.Assert.isTrue(hidden.item(0).test('.yui3-console-inline'));
            Y.Assert.isTrue(hidden.item(1).test('.yui3-console-separate'));
        },

        'log buttons should report in each console': function() {
            var test = this;

            Y.one('#info_text').set('value', 'test info');
            Y.one('#warn_text').set('value', 'test warn');
            Y.one('#error_text').set('value', 'test error');

            Y.one('#info').simulate('click');
            Y.one('#warn').simulate('click');
            Y.one('#error').simulate('click');

            // Console output is asynchronous
            setTimeout(function () {
                test.resume(function () {
                    Y.all('#demo .yui3-console-bd').each(function (node) {
                        Y.Assert.areSame(4,
                            node.all('.yui3-console-entry').size());
                        Y.Assert.areSame(2,
                            node.all('.yui3-console-entry-info').size());
                        Y.Assert.areSame(1,
                            node.all('.yui3-console-entry-warn').size());
                        Y.Assert.areSame(1,
                            node.all('.yui3-console-entry-error').size());
                    });
                });
            }, 500);

            this.wait();
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node', 'node-event-simulate' ] });
