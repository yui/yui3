YUI.add('app-contributors-mock', function (Y) {
    var API_ORIGIN = 'https://api.github.com';

    function processURL(url) {
        var data,
            status = 200;

        switch (url) {
            case '/users/yui':
                data = {
                    "login": "yui",
                    "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x",
                    "html_url": "https://github.com/yui",
                    "name": "YUI Library",
                    "public_repos": 34,
                    "followers": 0
                };
                break;
            case '/users/yui/repos':
                data = [
                    {
                        "name": "pure",
                        "html_url": "https://github.com/yui/pure",
                        "description": "A set of small, responsive CSS modules that you can use in every web project.",
                        "watchers": 6978,
                        "forks": 877,
                        "languages": "CSS",
                        "owner": {
                            "login": "yui",
                            "html_url": "https://github.com/yui",
                            "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x"
                        }
                    },
                    {
                        "name": "yeti",
                        "html_url": "https://github.com/yui/yeti",
                        "description": "Yeti automates browser testing.",
                        "watchers": 333,
                        "forks": 69,
                        "languages": "JavaScript",
                        "owner": {
                            "login": "yui",
                            "html_url": "https://github.com/yui",
                            "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x"
                        }
                    },
                    {
                        "name": "yui3",
                        "html_url": "https://github.com/yui/yui3",
                        "description": "A library for building richly interactive web applications.",
                        "watchers": 2396,
                        "forks": 717,
                        "languages": "JavaScript",
                        "owner": {
                            "login": "yui",
                            "html_url": "https://github.com/yui",
                            "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x"
                        }
                    },
                    {
                        "name": "yuicompressor",
                        "html_url": "https://github.com/yui/yuicompressor",
                        "description": "YUI Compressor",
                        "watchers": 1306,
                        "forks": 241,
                        "languages": "Java",
                        "owner": {
                            "login": "yui",
                            "html_url": "https://github.com/yui",
                            "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x"
                        }
                    },
                    {
                        "name": "yuidoc",
                        "html_url": "https://github.com/yui/yuidoc",
                        "description": "YUI Javascript Documentation Tool",
                        "watchers": 427,
                        "forks": 108,
                        "languages": "JavaScript",
                        "owner": {
                            "login": "yui",
                            "html_url": "https://github.com/yui",
                            "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x"
                        }
                    }
                ];
                break;
            case '/repos/yui/pure/contributors':
                data = [
                    {
                        "login": "ericf",
                        "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x",
                        "html_url": "https://github.com/ericf",
                        "contributions": 171
                    },
                    {
                        "login": "tilomitra",
                        "avatar_url": "https://gravatar.com/avatar/39416e8a4f8a9c9677a0a67da51f2207?d=https%3A%2F%2Fidenticons.github.com%2F568fe58ba4afa54d2db108fbd57a1f11.png&r=x",
                        "html_url": "https://github.com/tilomitra",
                        "contributions": 94
                    },
                    {
                        "login": "msweeney",
                        "avatar_url": "https://gravatar.com/avatar/f3f746d4b8201c3692001cb8922fff98?d=https%3A%2F%2Fidenticons.github.com%2Fb3ab7a7c84d8d782efb167422af07ef0.png&r=x",
                        "html_url": "https://github.com/msweeney",
                        "contributions": 14
                    }
                ];
                break;
            case '/users/ericf':
                data = {
                    "login": "ericf",
                    "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x",
                    "html_url": "https://github.com/ericf",
                    "name": "Eric Ferraiuolo",
                    "public_repos": 47,
                    "followers": 185
                };
                break;
            case '/users/ericf/repos':
                data = [
                    {
                        "name": "express-slash",
                        "html_url": "https://github.com/ericf/express-slash",
                        "description": "Express middleware for people who are anal about trailing slashes.",
                        "watchers": 19,
                        "forks": 0,
                        "owner": {
                            "login": "ericf",
                            "html_url": "https://github.com/ericf",
                            "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x"
                        }
                    },
                    {
                        "name": "express3-handlebars",
                        "html_url": "https://github.com/ericf/express3-handlebars",
                        "description": "A Handlebars view engine for Express which doesn't suck.",
                        "watchers": 219,
                        "forks": 19,
                        "owner": {
                            "login": "ericf",
                            "html_url": "https://github.com/ericf",
                            "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x"
                        }
                    },
                    {
                        "name": "open-marriage",
                        "html_url": "https://github.com/ericf/open-marriage",
                        "description": "The open source website for Leslie Verploegen's and Eric Ferraiuolo's wedding",
                        "watchers": 19,
                        "forks": 1,
                        "owner": {
                            "login": "ericf",
                            "html_url": "https://github.com/ericf",
                            "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x"
                        }
                    },
                    {
                        "name": "photosnear.me",
                        "html_url": "https://github.com/ericf/photosnear.me",
                        "description": "Photos Near Me",
                        "watchers": 100,
                        "forks": 29,
                        "owner": {
                            "login": "ericf",
                            "html_url": "https://github.com/ericf",
                            "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x"
                        }
                    },
                    {
                        "name": "pure",
                        "html_url": "https://github.com/ericf/pure",
                        "description": "A set of small, responsive CSS modules that you can use in every web project.",
                        "watchers": 2,
                        "forks": 0,
                        "owner": {
                            "login": "ericf",
                            "html_url": "https://github.com/ericf",
                            "avatar_url": "https://gravatar.com/avatar/cf33841918d90fe941f522dde5ee4ff0?d=https%3A%2F%2Fidenticons.github.com%2F19317b848dbb3dcbfb5684c662fd25ff.png&r=x"
                        }
                    }
                ];
                break;
            default:
                data = null;
                status = 500;
                break;
        }

        return {
            meta: {
                status: status
            },
            data: data
        };
    };

    function mockJSONP(url, callback) {
        var route    = /[^?]*/.exec(url)[0],
            endpoint = route.replace(API_ORIGIN, ''),
            result   = processURL(endpoint);

        Y.later(100, this, callback, [result]);
    };

    Y.jsonp = mockJSONP;
});
