(function() {
    var P = function(Y) {
        
        var proto = function () {
        };
        proto.prototype = {
            proxy: 'Here',
            _a : function() {
                console.info('Proxy: a method');
            },
            _proxyMethod: function() {
            }
        };
        console.info('drag:proxy');
        return proto;
    };
    YUI.add('drag:proxy', P, '3.0.0');
})();
