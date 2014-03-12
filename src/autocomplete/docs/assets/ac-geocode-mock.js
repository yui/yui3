YUI.add('ac-geocode-mock', function (Y) {
    var MockYQLRequest = function (query, config) {
        this._callback = config.on.success;
    };

    MockYQLRequest.prototype.send = function () {
        var result = {
            "query":{
                "count":1,
                "created":"2014-02-14T19:47:14Z",
                "lang":"en-US",
                "results":{
                    "json":{
                        "results":[
                            {
                                "formatted_address":"Main Street, Minden, LA 71055, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "32.6189361",
                                        "lng": "-93.28259919999999"
                                    }
                                }
                            }, {
                                "formatted_address":"Main Street, Kaplan, LA 70548, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "30.0058219",
                                        "lng": "-92.3776962"
                                    }
                                }
                            }, {
                                "formatted_address":"Main Street, 10, LA, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "31.6496445",
                                        "lng": "-93.2028031"
                                    }
                                }
                            }, {
                                "formatted_address":"Main Street, Coats, KS 67028, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "37.51155560000001",
                                        "lng": "-98.82589779999999"
                                    }
                                }
                            }, {
                                "formatted_address":"Main Street, Zurich, KS 67663, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "39.2321023",
                                        "lng": "-99.43405480000001"
                                    }
                                }
                            }, {
                                "formatted_address":"Main Street, Baton Rouge, LA, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "30.4519381",
                                        "lng": "-91.17062519999999"
                                    }
                                }
                            }, {
                                "formatted_address":"West Main Street, Ville Platte, LA 70586, USA",
                                "geometry": {
                                    "location": {
                                        "lat": "30.695714",
                                        "lng": "-92.300482"
                                    }
                                }
                            }
                        ],
                        "status":"OK"
                    }
                }
            }
        }

        Y.later(100, this, this._callback, [result]);
    };

    Y.YQLRequest = MockYQLRequest;
});
