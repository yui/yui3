YUI.add('assoc', function (Y, NAME) {

Y.Assoc = function() {
    var _arr = [],
        _obj = {},
        _keyExists = function (key) {
            return (_obj[key] !== undefined);
        },
        _getKey = function(obj) {
            var key = null,
                p;

            for (p in obj) {
                if (obj.hasOwnProperty(p)) {
                    key = p;
                }
                if (key !== null) {
                    break;
                }
            }

            return key;
        },
        _assoc = {

            push : function() {
                var i = 0,
                    l = arguments.length,
                    key,
                    value;

                for (i = 0; i < l; i++) {
                    value = arguments[i];

                    key = _getKey(value);
                    if (key) {
                        if (_keyExists(key)) {
                            _arr = _arr.splice(_arr.indexOf(key),1);
                        }
                        _arr.push(key);
                        _obj[key] = value[key];
                    }
                }

                return _assoc;
            },

            pop : function() {
                var key = _arr.pop(),
                    val = {};

                if (_obj[key]) {
                    val = _obj[key];
                    delete _obj[key];
                }

                return val;
            },

            shift : function() {
                var key = _arr.shift(),
                    val = {};

                if (_obj[key]) {
                    val = _obj[key];
                    delete _obj[key];
                }

                return val;
            },

            unshift : function() {
                var i = 0,
                    l = arguments.length,
                    key,
                    value;

                for (i = 0; i < l; i++) {
                    value = arguments[i];

                    key = _getKey(value);
                    if (key) {
                        if (_keyExists(key)) {
                            _arr = _arr.splice(_arr.indexOf(key),1);
                        }
                        _arr.unshift(key);
                        _obj[key] = value[key];
                    }
                }

                return _assoc;
            },

            reverse: function() {
                _arr.reverse();

                return _assoc;
            },

            splice: function (index, numToRemove, elementsN) {
                // TODO: complete splice method
            },

            indexOf : function(key) {
                return _arr.indexOf(key);
            },

            lastIndexOf: function(key) {
                return _arr.lastIndexOf(key);
            },

            size : function() {
                return _arr.length;
            },

            each : function(callback) {
                var i = 0,
                    l = _arr.length;

                for (i = 0; i < l; i++) {
                    (callback(/*value*/_obj[_arr[i]], /*key*/_arr[i], /*index*/i));
                }

                return _assoc;
            },

            setItem : function(index, value) {
                if (typeof index === 'string' && _keyExists(index)) {
                    _obj[index] = value;
                } else if (_arr[parseInt(index, 10)]) {
                    index = parseInt(index, 10);

                    var key = _getKey(value);

                    if (key) {
                        _arr[index] = key;
                        _obj[key] = value[key];
                    }

                } else {
                    throw "Key is not already set. Use `push`, `unshift` or ";
                }

                return _assoc;
            },

            getItem : function(index) {
                var retObj = {};
                if (typeof index === 'string' && _keyExists(index)) {
                    retObj = _obj[index];
                } else if (_arr[parseInt(index, 10)]) {
                    retObj = _obj[_arr[parseInt(index, 10)]];
                } else {
                    throw "Item at index " + index + " is not found.";
                }

                return retObj;
            },

            empty: function() {
                _arr = [];
                _obj = {};

                return _assoc;
            },

            keys: function() {
                return _arr.concat();
            },

            values: function() {
                var i,
                    l = _arr.length,
                    retArr = [];

                for (i=0; i<l; i++) {
                    retArr.push(_obj[_arr[i]]);
                }

                return retArr;
            },

            pairs: function() {
                var i,
                    l = _arr.length,
                    retArr = [],
                    key;

                for (i=0; i<l; i++) {
                    key = _arr[i];
                    retArr.push({ key: _obj[key]});
                }

                return retArr;
            }

        };

    return _assoc;
};


}, '@VERSION@', {"requires": ["yui-base"]});
