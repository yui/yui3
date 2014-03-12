YUI.add('jsonp-github-mock', function (Y) {
    var API_ORIGIN = 'https://api.github.com/users/';

    function processURL(user) {
        var names = {
                'yui'             : 'YUI Library',
                'allenrabinovich' : 'Allen Rabinovich',
                'davglass'        : 'Dav Glass',
                'derek'           : 'Derek Gathright',
                'ericf'           : 'Eric Ferraiuolo',
                'jenny'           : 'Jenny Donnelly',
                'lsmith'          : 'Luke Smith',
                'msweeney'        : 'Matt Sweeney',
                'reid'            : 'Reid Burke',
                'rgrove'          : 'Ryan Grove',
                'sdesai'          : 'Satyen Desai',
                'tripp'           : 'Tripp Bridges'
            },

            data = {
                public_repos : Math.random() * 100|0,
                public_gists : Math.random() * 100|0,
                followers    : Math.random() * 100|0,
                following    : Math.random() * 100|0
            },

            result = Y.mix(data, {
                login : user,
                name  : names[user]
            });

        return {
            meta: {
                status: 200
            },
            data: result
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
