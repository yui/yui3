YUI.add('cache-basic-tests', function (Y) {
    var suite = new Y.Test.Suite('cache basic example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have rendered an enclosing div': function () {
            var example = Y.one('.example'),
                demo    = Y.one('#demo'),
                out     = Y.one('#out');

            Assert.isNotNull(example, 'Example enclosure missing');
            Assert.isNotNull(demo, 'Demo form element missing');
            Assert.isNotNull(out, 'Output div element missing');
        },

        'example should set a maximum number of elements': function () {
            var maxInput  = Y.one('#demo_max'),
                maxButton = Y.one('#demo_setMax'),
                out       = Y.one('#out');

            maxInput.set('value', 1);
            maxButton.simulate('click');

            Assert.areEqual('Cache max set to 1.', out.getHTML(), 'Example did not maximum number of elements');
        },

        'example should set an expiration time for the data': function () {
            var expiresInput  = Y.one('#demo_expires'),
                expiresButton = Y.one('#demo_setExpires'),
                out           = Y.one('#out');

            expiresInput.set('value', 3600000);
            expiresButton.simulate('click');

            Assert.areEqual('Cache "expires" set to 3600000.', out.getHTML(), 'Example did not set an expiration time');
        },

        'example should be able to set a key/value to be cached': function () {
            var addKey    = Y.one('#demo_addKey'),
                addValue  = Y.one('#demo_addValue'),
                addButton = Y.one('#demo_add'),
                out       = Y.one('#out');

            addKey.set('value', 'foo');
            addValue.set('value', 'bar');
            addButton.simulate('click');

            Assert.areEqual('Value cached. Cache size is now 1.', out.getHTML(), 'Example should set the cache key/value properly.'); 

            addKey.set('value', 'baz');
            addValue.set('value', 'qux');
            addButton.simulate('click');

            Assert.areEqual('Value cached. Cache size is now 1.', out.getHTML(),
 'Example max should allow only a single key');
        },

        'example should be able to get a value that was cached': function () {
            var retrieveKey    = Y.one('#demo_retrieveKey'),
                retrieveButton = Y.one('#demo_retrieve'),
                out            = Y.one('#out');

            retrieveKey.set('value', 'foo');
            retrieveButton.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), '`foo` key should have been overwritten');

            retrieveKey.set('value', 'baz');
            retrieveButton.simulate('click');

            Assert.areEqual('qux', out.getHTML(), '`baz` key should be retrievable in cache');
        },

        'example should be able to be flushed': function () {
            var retrieveKey    = Y.one('#demo_retrieveKey'),
                retrieveButton = Y.one('#demo_retrieve'),
                flushButton    = Y.one('#demo_flush'),
                out            = Y.one('#out');

            flushButton.simulate('click');
            
            Assert.areEqual('Cache flushed.', out.getHTML(), 'Cache should be flushed');

            retrieveKey.set('value', 'baz');
            retrieveButton.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), 'Previous values should not be retrievable after flush.');
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });
