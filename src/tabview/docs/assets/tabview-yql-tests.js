YUI.add('tabview-yql-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should apply widget className': function() {
            this.assert(Y.one('#demo div').hasClass('yui3-tabview'));
        },

        'should load the tab content on click': function() {
            var test = this;
            Y.one('#demo li + li').simulate('click');

            window.setTimeout(function() {
                test.resume(function() {
                    test.assert(Y.one('#demo .yui3-tabview-panel div + div ul'));
                });
            }, 2000);

            test.wait();

        }
    }));

}, '@VERSION@' ,{requires:['tabview', 'test', 'node-event-simulate']});

