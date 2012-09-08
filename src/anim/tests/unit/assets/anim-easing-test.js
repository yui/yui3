YUI.add('anim-easing-test', function(Y) {
    function onEnd() {
        this.resume(function() {
            Y.Assert.areEqual('0px', node.getComputedStyle('height'));
            node.setStyle('height', '');
        });
    }
    
    var node = Y.one('.demo'),
        testCase = new Y.Test.Case({
            name: 'Anim Easing'
        });


    function addTest(easing) {
        testCase['should end at the final value for ' + easing] = function() {
            var anim = new Y.Anim({
                node: node,
                easing: easing,
                to: {
                    height: 0
                },

                duration: 0.25
            });
            
            anim.on('end', onEnd, this);
            anim.run();
            this.wait(500);
        }
    }

    Y.Object.each(Y.Easing, function(fn, name) {
        addTest(name); // test string
    });

    Y.Test.Runner.add(testCase);
}, '@VERSION@' ,{requires:['anim-easing', 'test']});
