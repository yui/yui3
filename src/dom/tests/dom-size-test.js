YUI.add('dom-size-test', function(Y) {
    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM._setSize',

        'should set the node offsetWidth to the given value': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'width', 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the node offsetHeight to the given value': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'height', 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set the node offsetWidth to zero if given a negative number': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM._setSize(node, 'width', -100);

            Assert.areEqual(0, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the node offsetHeight to zero if given a negative number': function() {
            var node = document.createElement('div');

            node.style.overflow = 'hidden'; // IE6 includes overflow in offsetHeight
            document.body.appendChild(node);
            Y.DOM._setSize(node, 'height', -100);

            Assert.areEqual(0, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set the offsetWidth via setWidth': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM.setWidth(node, 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set the offsetHeight via setHeight': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            Y.DOM.setHeight(node, 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set offsetWidth accounting for padding': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setWidth(node, 100);

            Assert.areEqual(100, node.offsetWidth);
            document.body.removeChild(node);

        },

        'should set offsetHeight accounting for padding': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setHeight(node, 100);

            Assert.areEqual(100, node.offsetHeight);
            document.body.removeChild(node);
        },

        'should set offsetWidth to padding when setting to zero': function() {
            var node = document.createElement('div');

            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setWidth(node, 0);

            Assert.areEqual(20, node.offsetWidth);
            document.body.removeChild(node);
        },

        'should set offsetHeight to padding when setting to zero': function() {
            var node = document.createElement('div');

            node.style.overflow = 'hidden'; // IE6 includes overflow in offsetHeight
            document.body.appendChild(node);
            node.style.padding = '10px';
            Y.DOM.setHeight(node, 0);

            Assert.areEqual(20, node.offsetHeight);
            document.body.removeChild(node);
        }
    }));

}, '@VERSION@' ,{requires:['dom-base', 'test']});
