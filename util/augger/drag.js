(function() {
    var D = function(Y) {
        Y.use('augger');

        var Drag = function() {
            console.info('Drag Initialized');
        };
        Drag.NAME = 'drag';

        var proto = {
            dd: 'Here',
            _a: function() {
                console.info('Drag: a method');
            }
        };
        Y.extend(Drag, Y.Augger, proto);
        Y.Drag = Drag;
        console.info('Drag: ', Drag);
        
    };
    YUI.add('drag', D, '3.0.0');
})();
