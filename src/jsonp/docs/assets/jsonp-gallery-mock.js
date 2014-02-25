YUI.add('jsonp-gallery-mock', function (Y) {
    var counter = 0;

    function processURL(url) {
        var data = [
            {
                modules: [
                    {
                        url: "http:\/\/yuilibrary.com\/gallery\/show\/base-componentmgr",
                        title: "Component Manager",
                        summary: "Don't need all your page's components to be ready and loaded on page load? Want to lazily load their dependencies and lazily instantiate them on-demand based on some user action? Then use this Y.Base Extension.",
                        owner: {
                            fullname: "Eric Ferraiuolo",
                            rank: "YUI Developer",
                            icon: "http:\/\/www.gravatar.com\/avatar\/cf33841918d90fe941f522dde5ee4ff0?s=64&d=http:\/\/yuilibrary.com\/assets\/gravatar-64.png"
                        }
                    }
                ]
            },
            {
                modules: [
                    {
                        url: "http:\/\/yuilibrary.com\/gallery\/show\/model-sync-socket",
                        title: "Socket Model Sync",
                        summary: "An extension which provides a sync implementation using Socket.IO as the\r\ntransport method, which can be mixed into a Model or ModelList subclass.",
                        owner: {    
                            fullname: "Clarence Leung",
                            rank: "YUI Contributor",
                            icon: "http:\/\/www.gravatar.com\/avatar\/fd6d95d8ba7e22c228d90f4c5a6d4c77?s=64&d=http:\/\/yuilibrary.com\/assets\/gravatar-64.png"
                        }
                    }
                ]
            },
            {
                modules: [
                    {
                        url: "http:\/\/yuilibrary.com\/gallery\/show\/tabby",
                        title: "Textarea Tab Control",
                        summary: "This little module adds the ability to use the tab key inside of a textarea. Currently it doesn't support Opera and it doesn't support text-selection tabbing.",
                        owner: {    
                            fullname: "Dav Glass",
                            rank: null,
                            icon: "http:\/\/www.gravatar.com\/avatar\/05243ae612fb4dcfb151e08489f334b0?s=64&d=http:\/\/yuilibrary.com\/assets\/gravatar-64.png"
                        }
                    }
                ]
            }
        ];

        return data[counter++ % 3]
    };

    var mockJSONPRequest = function (url, config) {
        this.success = config.on.success;
        this.failure = config.on.failure;
    };

    mockJSONPRequest.prototype.send = function () {
        var result = processURL();
        Y.later(200, this, this.success, [result]);
    };

    Y.JSONPRequest = mockJSONPRequest;
});
