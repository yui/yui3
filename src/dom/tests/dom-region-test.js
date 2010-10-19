YUI.add('dom-region-test', function(Y) {
    var Assert = Y.Assert;
        ArrayAssert = Y.ArrayAssert;

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Y.DOM.region',

        'should return a region containing the correct data': function() {
            var node = document.body,
                r = Y.DOM.region(node),
                xy = Y.DOM.getXY(node);

            Assert.areEqual(node.offsetWidth, r.width);
            Assert.areEqual(node.offsetHeight, r.height);

            Assert.areEqual(xy[0], r.left);
            Assert.areEqual(xy[1], r.top);
            
            Assert.areEqual(node.offsetWidth + xy[0], r.right);
            Assert.areEqual(node.offsetHeight + xy[1], r.bottom);
            
            Assert.areEqual(xy[0], r[0]);
            Assert.areEqual(xy[1], r[1]);
        },

        'should return false for bad input': function() {
            Assert.isFalse(Y.DOM.region());
            Assert.isFalse(Y.DOM.region(document));
        }
    }));
}, '@VERSION@' ,{requires:['dom-screen', 'test']});
