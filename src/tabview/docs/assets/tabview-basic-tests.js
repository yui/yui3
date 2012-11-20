YUI.add('tabview-basic-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should apply widget className': function() {
            this.assert(Y.one('#demo').ancestor('.yui3-tabview'));
        },

        'should hide unselected tabs': function() {
            this.assert(Y.one('#bar').getStyle('display') === 'none');
            this.assert(Y.one('#baz').getStyle('display') === 'none');
        },

        'should change selected tab on click': function() {
            var node = Y.one('#demo li + li');
            node.simulate('click');
            this.assert(node.hasClass('yui3-tab-selected'));
        },

        'should change selected content on click': function() {
            var node = Y.one('li + li + li');
            node.simulate('click');
            this.assert(Y.one('#baz').hasClass('yui3-tab-panel-selected'));
        }
    }));

}, '@VERSION@' ,{requires:['tabview', 'test', 'node-event-simulate']});

