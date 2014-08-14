YUI.add('ac-flickr-mock', function (Y) {
    var MockYQLRequest = function (query, config) {
        this._callback = config.on.success;
    };

    MockYQLRequest.prototype.send = function () {
        var result = {
           "query":{
                "count":5,
                "created":"2014-02-18T17:23:39Z",
                "lang":"en-US",
                "results":{
                    "photo":[
                        {
                           "farm":"3",
                           "id":"12616569714",
                           "secret":"9a88e273ef",
                           "server":"2840",
                           "title":"An Awesome Photo"
                        },
                        {
                            "farm":"8",
                            "id":"12616327173",
                            "secret":"141ebc20bc",
                            "server":"7447",
                            "title":"A Beautiful Photo"
                        },
                        {
                            "farm":"4",
                            "id":"12616474394",
                            "secret":"270ea93de0",
                            "server":"3734",
                            "title":"A Cool Photo"
                        },
                        {
                            "farm":"3",
                            "id":"12616629874",
                            "secret":"ddcdc768e1",
                            "server":"2847",
                            "title":"A Delightful Photo"
                        },
                        {
                            "farm":"8",
                            "id":"12616254955",
                            "secret":"b874fea4e1",
                            "server":"7293",
                            "title":"An Excellent Photo"
                        }
                    ]
                }
            }
        };

        Y.later(100, this, this._callback, [result]);
    };

    Y.YQLRequest = MockYQLRequest;
});
