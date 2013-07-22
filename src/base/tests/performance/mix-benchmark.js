{
    title: 'Y.Mix performance tests',
    slug: 'mix-performance',
    yui: {
        use: ['base']
    },
    global: {
        setup: function () {
            var _wlhash = function(r, s, wlhash) {
                var p;
                for (p in s) {
                    if(wlhash[p]) {
                        r[p] = s[p];
                    }
                }
                return r;
            };

            var _wlarr = function(r, s, wl) {
                var i, l, p;
                for (i = 0, l = wl.length; i < l; i++) {
                   p = wl[i];
                   r[p] = s[p];
                }
                return r;
            };

            var _wlarrcheck = function(r, s, wl) {
                var i, l, p;
                for (i = 0, l = wl.length; i < l; i++) {
                    p = wl[i];
                    if (p in s) {
                        r[p] = s[p];
                    }
                }
                return r;
            };

            var _wlarrcheck2 = function(r, s, wl) {
                var i, l, p;
                for (i = 0, l = wl.length; i < l; i++) {
                    p = wl[i];
                    if (s.hasOwnProperty(p)) {
                        r[p] = s[p];
                    }
                }
                return r;
            };

            var s = {
                value: 10,
                setter: function() {},
                getter: function() {}
            };

            var props = [
                "setter",
                "getter",
                "validator",
                "value",
                "valueFn",
                "writeOnce",
                "readOnly",
                "lazyAdd",
                "broadcast",
                "_bypassProxy",
                "cloneDefaultValue"
            ];

            var hash = Y.Array.hash(props);
        }
    },
    tests: [
        {
            title: 'Y.mix wl',
            fn: function () {
                var o = Y.mix({}, s, true, props);
            }
        },
        {
            title: 'wlHash',
            fn: function () {
                var o = _wlhash({}, s, hash);
            }
        },
        {
            title: 'wlArr',
            fn: function () {
                var o = _wlarr({}, s, props);
            }
        },
        {
            title: 'wlArrCheck - in',
            fn: function () {
                var o = _wlarrcheck({}, s, props);
            }
        },
        {
            title: 'wlArrCheck - hasOwnProp',
            fn: function () {
                var o = _wlarrcheck2({}, s, props);
            }
        },
        {
            title: 'Y.Object',
            fn: function () {
                var o = Y.Object(s);
            }
        }
    ]
};
