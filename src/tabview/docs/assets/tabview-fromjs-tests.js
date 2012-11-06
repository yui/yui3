YUI.add('tabview-fromjs-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'TabView Tests',

        'should apply widget className': function() {
            this.assert(Y.one('#demo div').hasClass('yui3-tabview'));
        },

        'should hide unselected tabs': function() {
            var tabPanels = Y.all('#demo .yui3-tab-panel');
            this.assert(tabPanels.item(0).getStyle('display') === 'none');
            this.assert(tabPanels.item(1).getStyle('display') === 'none');
        },

        'should change selected tab on click': function() {
            var node = Y.one('#demo li');
            node.simulate('click');
            this.assert(node.hasClass('yui3-tab-selected'));
        },

        'should change selected content on click': function() {
            var node = Y.one('li + li + li');
            node.simulate('click');
            this.assert(Y.one('#demo .yui3-tabview-panel div + div + div').hasClass('yui3-tab-panel-selected'));
        }
    }));

}, '@VERSION@' ,{requires:['tabview', 'test', 'node-event-simulate']});

