var _JSON = Y.config.global.JSON;

Y.namespace('JSON').parse = function () {
    if(typeof arguments[0] !== 'string') {
        arguments[0] = arguments[0] + '';
    }
    return _JSON.parse.apply(_JSON, arguments);
};
