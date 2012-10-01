YUI.add('yql-winjs', function (Y, NAME) {

/**
* WinJS plugin for YQL to use XHR to make requests
* @module yql
* @submodule yql-winjs
*/

//Over writes Y.YQLRequest._send to use IO instead of JSONP
Y.YQLRequest.prototype._send = function (url, o) {
    Y.io(url, o);
};


}, '@VERSION@', {"requires": ["yql", "io-base"]});
