YUI.add('dom-deprecated-test', function(Y) {
    var Assert = Y.Assert,
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.children',

        'should return empty array when no element childNodes': function() {
            var node = document.createElement('div');
            ArrayAssert.itemsAreEqual([], Y.DOM.children(node));
        },

        'should return empty array when input is null': function() {
            ArrayAssert.itemsAreEqual([], Y.DOM.children(null));
        },

        'should return empty array when input is undefined': function() {
            ArrayAssert.itemsAreEqual([], Y.DOM.children());
        },

        'should return elements only': function() {
            var node = document.getElementById('test-children'),
                nodes = node.getElementsByTagName('span');

            ArrayAssert.itemsAreEqual(nodes, Y.DOM.children(node));
        }
    }));

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.firstByTag',

        'should return the first match': function() {
            Assert.areEqual(document.getElementsByTagName('div')[0],
                Y.DOM.firstByTag('div'));
        },

        'should return the first match (root element)': function() {
            var root = document.getElementById('test-names');

            Assert.areEqual(root.getElementsByTagName('input')[0],
                Y.DOM.firstByTag('input', root));

        },

        'should return null when no match': function() {
            Assert.isNull(Y.DOM.firstByTag('fake-tag'));
        },

        'should return null when tag is null': function() {
            Assert.isNull(Y.DOM.firstByTag(null));
        },

        'should search given document': function() {
            Assert.areEqual(document.getElementsByTagName('div')[0],
                Y.DOM.firstByTag('div', document));
        },

        'should search given document (frame)': function() {
            var frame = document.getElementById('test-frame'),
                doc = frame.contentWindow.document,
                node = doc .getElementById('demo');

            Assert.areEqual(node, Y.DOM.firstByTag('div', doc.body));
        }
    }));
}, '@VERSION@' ,{requires:['dom-base', 'dom-deprecated', 'test']});
