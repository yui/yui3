(function() {
    var A = function(Y) {
        Y.use('attribute', 'attributeprovider', 'base');

        var Augger = function() {
            console.info('Augger Constructed');
        };
        
        var aug = function(n, s) {
            //Use the new namespaces pieces
            Y.use(n + ':' + s);
            //Exec the piece and get the object back
            var proto = YUI.env.mods[n + ':' + s].fn(Y);
            console.info('Proxy Proto: ', proto);
            //Mix this object and the prototype of the new one.
            Y.mix(this, proto, true, null, 3);
        };

        Augger.prototype = {
            _used: null,
            use: function() {
                if (this._used) {
                    console.info('Augger bailed, use has already been called..');
                    return false;
                }
                console.info('Augger Use Called: ', arguments);
                console.info('Augger: ', this.constructor.NAME);
                var n = this.constructor.NAME, len = arguments.length;

                //Grab everything that was passed except the last arg
                for (var i = 0; i < len; i++) {
                    if (Y.lang.isString(arguments[i])) {
                        aug.call(this, n, arguments[i]);
                    }
                }
                //If the last arg is a function, exec it as a scoped callback passing a ref
                if (Y.lang.isFunction(arguments[arguments.length - 1])) {
                    var fn = arguments[arguments.length - 1];
                    fn.call(this, this);
                }
                this._used = true;
            }
        };
        //Use base as a base to get attributes
        Y.augment(Augger, Y.Base);
        Y.Augger = Augger;
        console.info('Augger: ', Augger);
    };
    YUI.add('augger', A, '3.0.0');
})();
