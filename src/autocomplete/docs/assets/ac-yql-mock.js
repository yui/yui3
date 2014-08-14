YUI.add('ac-yql-mock', function (Y) {
    var MockYQLRequest = function (query, config) {
        this._callback = config.on.success;
    };

    MockYQLRequest.prototype.send = function () {
        var result = {
            "query": {
                "count": 10,
                "created": "2014-02-14T19:32:32Z",
                "lang": "en-US",
                "results": {
                    "key": [
                        "car",
                        "capital one",
                        "cartoon network",
                        "carnival cruises 2014",
                        "cabela's",
                        "california lottery",
                        "carmax",
                        "careerbuilder",
                        "calculator",
                        "canon"
                    ]
                }
            }
        };

        Y.later(100, this, this._callback, [result]);
    };

    Y.YQLRequest = MockYQLRequest;
});
