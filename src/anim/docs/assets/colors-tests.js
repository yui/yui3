YUI.add('colors-tests', function(Y) {

    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Color Tests',

        'should end at "to" values on mouseover': function() {
            var node = Y.one('#demo'),
                count = 0,
                test = this;

            node.on('mouseover', function(e) {
                if (!count) {
                    count += 1;
                    setTimeout(function() {
                        test.resume(function() {
                            Y.Assert.areEqual('rgb(255,136,0)', node.getStyle('backgroundColor').replace(/\s+/g, ''), 'backgrounColor');
                            Y.Assert.areEqual('rgb(255,255,255)', node.getStyle('color').replace(/\s+/g, ''), 'color');
                            Y.Assert.areEqual('rgb(186,98,0)', node.getStyle('borderColor').replace(/\s+/g, ''), 'borderColor');
                        });
                    }, 800);
                }
            });

            setTimeout(function() {
                node.simulate('mouseover');
            }, 0);
            test.wait(1000);
        },

        'should end at "from" values on mouseout': function() {
            var node = Y.one('#demo'),
                count = 0,
                test = this;

            node.on('mouseout', function(e) {
                if (!count) {
                    count += 1;
                    setTimeout(function() {
                        test.resume(function() {
                            Y.Assert.areEqual('rgb(236,239,251)', node.getStyle('backgroundColor').replace(/\s+/g, ''), 'backgrounColor');
                            Y.Assert.areEqual('rgb(0,76,109)', node.getStyle('color').replace(/\s+/g, ''), 'color');
                            Y.Assert.areEqual('rgb(158,168,198)', node.getStyle('borderColor').replace(/\s+/g, ''), 'borderColor');
                        });
                    }, 800);
                }
            });

            setTimeout(function() {
                node.simulate('mouseout');
            }, 0);
            test.wait(1000);
        }
    }));

}, '@VERSION@' ,{requires:['anim', 'test', 'node-event-simulate']});
