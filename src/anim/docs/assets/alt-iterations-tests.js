YUI.add('alt-iterations-tests', function(Y) {
    // NOTE: IE strips spaces from inline color styles (e.g. domNode.style.backgroundColor = 'rgb(255, 255, 255')
    // becomes 'rgb(255, 255, 255')).

    var node = Y.one('#demo'),
        to = {
            backgroundColor: 'rgb(255,136,0)',
            borderColor: 'rgb(186,98,0)',
            color: 'rgb(255,255,255)'
        },

        from = {
            backgroundColor: node.getComputedStyle('backgroundColor').replace(/\s+/g, ''),
            borderColor: node.getComputedStyle('borderTopColor').replace(/\s+/g, ''),
            color: node.getComputedStyle('color').replace(/\s+/g, '')
        };


    Y.Test.Runner.add(new Y.Test.Case({
        name: 'Alternate Itertation Tests',

        'should end at "to" values on mouseover': function() {
            var node = Y.one('#demo'),
                count = 0,
                test = this;

            node.on('mouseover', function(e) {
                if (!count) {
                    count += 1;
                    setTimeout(function() {
                        test.resume(function() {
                            Y.Assert.areNotEqual(to.backgroundColor, node.getStyle('backgroundColor').replace(/\s+/g, ''), 'backgroundColor');
                            Y.Assert.areNotEqual(to.color, node.getStyle('color').replace(/\s+/g, ''), 'color');
                            Y.Assert.areNotEqual(to.borderColor, node.getStyle('borderColor').replace(/\s+/g, ''), 'borderColor');
                        });
                    }, 800);
                }
            });

            setTimeout(function() {
                node.simulate('mouseover');
            }, 0);
            test.wait(1200);
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
                            Y.Assert.areEqual(from.backgroundColor, node.getStyle('backgroundColor').replace(/\s+/g, ''), 'backgrounColor');
                            Y.Assert.areEqual(from.color, node.getStyle('color').replace(/\s+/g, ''), 'color');
                            Y.Assert.areEqual(from.borderColor, node.getStyle('borderColor').replace(/\s+/g, ''), 'borderColor');
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
