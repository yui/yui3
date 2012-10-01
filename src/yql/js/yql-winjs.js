/**
* WinJS plugin for YQL to use XHR to make requests
* @module yql
* @submodule yql-winjs
*/

//Over writes Y.YQLRequest._send to use IO instead of JSONP
Y.YQLRequest.prototype._send = function (url, o) {
    Y.io(url, {
        on: {
            complete: function (id, e) {
                o.on.success(Y.JSON.parse(e.responseText));
            }
        }
    });
};
