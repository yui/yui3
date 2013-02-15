var _JSON = Y.config.global.JSON;

Y.namespace('JSON').parse = function () {
    return _JSON.parse.apply(_JSON, arguments);
};