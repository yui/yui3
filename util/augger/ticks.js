(function() {
    var T = function(Y) {
        
        var proto = function () {
        };
        proto.prototype = {
            ticks: 'Here',
            _a : function() {
                console.info('Ticks: a method');
            },
            _ticksMethod: function() {
            }
        };
        console.info('drag:ticks');
        return proto;
    };
    YUI.add('drag:ticks', T, '3.0.0');
})();
