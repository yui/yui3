var _JSON = Y.config.global.JSON;

Y.namespace('JSON').stringify = function () {
    return _JSON.stringify.apply(_JSON, arguments);
};