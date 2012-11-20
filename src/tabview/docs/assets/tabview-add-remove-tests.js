YUI.add('tabview-add-remove-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should apply widget className': function() {
            this.assert(Y.one('#demo').ancestor('.yui3-tabview'));
        },

        'should remove the tab on click': function() {
            var node = Y.one('#demo2 .yui3-tab-remove');
            node.simulate('click');
            this.assert(Y.one('#demo2 li a').get('text') === 'bar');
        }
    }));

}, '@VERSION@' ,{requires:['tabview', 'test', 'node-event-simulate']});

