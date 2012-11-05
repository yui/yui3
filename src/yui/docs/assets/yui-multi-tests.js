YUI.add('yui-multi-tests', function(Y) {

    var suite = new Y.Test.Suite('yui-multi example test suite'),
        Assert = Y.Assert;

    suite.add(new Y.Test.Case({
        name: 'Example tests',
        'is item animating': function() {
            var test = this,
                item = Y.one('#demo'),
                i = 0, max = 10, timer,
                animating = [],
                firstH = item.getStyle('height'), firstW = item.getStyle('width'),
                lastH = item.getStyle('height'), lastW = item.getStyle('width');
            
            timer = setInterval(function() {
                i++;
                animating.push(lastH !== item.getStyle('height'));
                animating.push(lastW !== item.getStyle('width'));
                if (i === max) {
                    clearInterval(timer);
                    test.resume(function() {
                        Y.Array.each(animating, function(v) {
                            Assert.isTrue(v, 'Item is not animating');
                        });
                    });
                }
            }, 500);

            test.wait();
        },
        'is item draggable': function() {
            Assert.isTrue(Y.one('#demo').hasClass('yui3-dd-draggable'), 'Second instance DD did not attach to node');
        }
    }));

    Y.Test.Runner.add(suite);

}, '', { requires: [ 'node' ] });
