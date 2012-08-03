YUI.add('cache-offline-tests', function (Y) {
    var suite = new Y.Test.Suite('cache offline example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'example should have rendered an enclosing div': function () {
            var example = Y.one('.example'),
                demo    = Y.all('.demo'),
                out     = Y.one('#out');

            Assert.isNotNull(example, 'Example enclosure missing');
            Assert.areSame(2, demo.size(), 'Number of demo instances is not 2');
            Assert.isNotNull(out, 'Output div element missing');
        },

        'example should set an expiration time for the data': function () {
            var expiresInputOne = Y.one('#demo1_expires'),
                expiresInputTwo = Y.one('#demo2_expires'),
                expiresBtnOne   = Y.one('#demo1_setExpires'),
                expiresBtnTwo   = Y.one('#demo2_setExpires'),
                out             = Y.one('#out');

            expiresInputOne.set('value', '2400000');
            expiresBtnOne.simulate('click');

            Assert.areSame('Cache 1 "expires" set to 2400000.', out.getHTML(), 'Example demo #1 did not set the expiration time correctly');

            expiresInputTwo.set('value', '3600000');
            expiresBtnTwo.simulate('click');

            Assert.areSame('Cache 2 "expires" set to 3600000.', out.getHTML(), 'Example demo #2 did not set the expiration time correctly');
        },

        'example should be able to set a key/value to be cached': function () {
            var addKeyOne   = Y.one('#demo1_addKey'),
                addValueOne = Y.one('#demo1_addValue'),
                addBtnOne   = Y.one('#demo1_add'),
                addKeyTwo   = Y.one('#demo2_addKey'),
                addValueTwo = Y.one('#demo2_addValue'),
                addBtnTwo   = Y.one('#demo2_add'),
                out         = Y.one('#out');

            addKeyOne.set('value', 'foo');
            addValueOne.set('value', 'bar');
            addBtnOne.simulate('click');
            
            Assert.areEqual('Value cached. Cache 1 "size" is now 1.', out.getHTML(), 'Example demo #1 did not set key/value pair');

            addKeyTwo.set('value', 'baz');
            addValueTwo.set('value', 'qux');
            addBtnTwo.simulate('click');

            Assert.areEqual('Value cached. Cache 2 "size" is now 1.', out.getHTML(), 'Example demo #2 did not set key/value pair');
        },

        'example should be able to get a value that was cached': function () {
            var retrieveKeyOne = Y.one('#demo1_retrieveKey'),
                retrieveBtnOne = Y.one('#demo1_retrieve'),
                retrieveKeyTwo = Y.one('#demo2_retrieveKey'),
                retrieveBtnTwo = Y.one('#demo2_retrieve'),
                out            = Y.one('#out');

            retrieveKeyOne.set('value', 'baz');
            retrieveBtnOne.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), 'Cache #1 should not be able to access data of cache #2');

            retrieveKeyOne.set('value', 'foo');
            retrieveBtnOne.simulate('click');

            Assert.areEqual('bar', out.getHTML(), 'Cache #1 should be able to retrieve set data');

            retrieveKeyTwo.set('value', 'foo');
            retrieveBtnTwo.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), 'Cache #2 should not be able to access data of cache #1');

            retrieveKeyTwo.set('value', 'baz');
            retrieveBtnTwo.simulate('click');

            Assert.areEqual('qux', out.getHTML(), 'Cache #2 should be able to retrieve set data');
        },

        'example should be able to be flushed': function () {
            var retrieveKeyOne = Y.one('#demo1_retrieveKey'),
                retrieveBtnOne = Y.one('#demo1_retrieve'),
                retrieveKeyTwo = Y.one('#demo2_retrieveKey'),
                retrieveBtnTwo = Y.one('#demo2_retrieve'),
                flushBtnOne    = Y.one('#demo1_flush'),
                flushBtnTwo    = Y.one('#demo2_flush'),
                out            = Y.one('#out');

            flushBtnOne.simulate('click');

            Assert.areEqual('Cache 1 flushed.', out.getHTML(), 'Cache #1 should be flushed');

            flushBtnTwo.simulate('click');

            Assert.areEqual('Cache 2 flushed.', out.getHTML(), 'Cache #2 should be flushed');
            
            retrieveKeyOne.set('value', 'foo');
            retrieveBtnOne.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), 'Cache #1 should not be able to access flushed data');

            retrieveKeyTwo.set('value', 'baz');
            retrieveBtnOne.simulate('click');

            Assert.areEqual('Value not cached.', out.getHTML(), 'Cache #2 should not be able to access flushed data');
        }
    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', { requires: [ 'node', 'node-event-simulate', 'test' ] });
