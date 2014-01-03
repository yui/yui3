YUI.add('github-api-mock', function (Y) {

    var GITHUB_BASE_URL = 'https://api.github.com/users/';

    Y.jsonp = function (url, callback) {
        var result = {
            meta: {
                "X-RateLimit-Limit": "60",
                "X-RateLimit-Remaining": "52",
                "X-RateLimit-Reset": "1388766826",
                "Cache-Control": "public, max-age=60, s-maxage=60",
                "Last-Modified": "Wed, 01 Jan 2014 21:35:39 GMT",
                "Vary": "Accept",
                "ETag": "\"18e2ea7379f9f010f22c4736ab0a84b3\"",
                "X-GitHub-Media-Type": "github.beta",
                "status": 200
            }
        };
        var user = url.substring(GITHUB_BASE_URL.length);
        user = user.substring(0, user.indexOf('?callback'));

        switch (user) {
            case 'yui':
                result.data = {
                    "login": "yui",
                    "id": 38181,
                    "avatar_url": "https://gravatar.com/avatar/af34a0de54b2b7a34cc6d7196ef12fc0?d=https%3A%2F%2Fidenticons.github.com%2F8a3150dc62fcb95f309ee021e3a2d4f2.png&r=x",
                    "gravatar_id": "af34a0de54b2b7a34cc6d7196ef12fc0",
                    "url": "https://api.github.com/users/yui",
                    "html_url": "https://github.com/yui",
                    "followers_url": "https://api.github.com/users/yui/followers",
                    "following_url": "https://api.github.com/users/yui/following{/other_user}",
                    "gists_url": "https://api.github.com/users/yui/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/yui/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/yui/subscriptions",
                    "organizations_url": "https://api.github.com/users/yui/orgs",
                    "repos_url": "https://api.github.com/users/yui/repos",
                    "events_url": "https://api.github.com/users/yui/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/yui/received_events",
                    "type": "Organization",
                    "site_admin": false,
                    "name": "YUI Library",
                    "company": null,
                    "blog": "http://yuilibrary.com/",
                    "location": "Sunnyvale, CA",
                    "email": null,
                    "hireable": null,
                    "bio": null,
                    "public_repos": 34,
                    "public_gists": 0,
                    "followers": 0,
                    "following": 0,
                    "created_at": "2008-12-04T01:46:11Z",
                    "updated_at": "2014-01-03T14:57:20Z"
                };
                break;
            case 'yahoo':
                result.data = {
                    "login": "yahoo",
                    "id": 16574,
                    "avatar_url": "https://gravatar.com/avatar/cf776780e895d2c099f8fb13cb7c6af2?d=https%3A%2F%2Fidenticons.github.com%2F55487d77a3826d9b920e0ee486ed99c3.png&r=x",
                    "gravatar_id": "cf776780e895d2c099f8fb13cb7c6af2",
                    "url": "https://api.github.com/users/yahoo",
                    "html_url": "https://github.com/yahoo",
                    "followers_url": "https://api.github.com/users/yahoo/followers",
                    "following_url": "https://api.github.com/users/yahoo/following{/other_user}",
                    "gists_url": "https://api.github.com/users/yahoo/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/yahoo/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/yahoo/subscriptions",
                    "organizations_url": "https://api.github.com/users/yahoo/orgs",
                    "repos_url": "https://api.github.com/users/yahoo/repos",
                    "events_url": "https://api.github.com/users/yahoo/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/yahoo/received_events",
                    "type": "Organization",
                    "site_admin": false,
                    "name": "Yahoo Inc.",
                    "company": null,
                    "blog": "http://developer.yahoo.com/",
                    "location": "Sunnyvale, California",
                    "email": null,
                    "hireable": null,
                    "bio": null,
                    "public_repos": 152,
                    "public_gists": 0,
                    "followers": 1,
                    "following": 0,
                    "created_at": "2008-07-09T20:37:32Z",
                    "updated_at": "2014-01-03T14:09:48Z"
                };
                break;
            case 'davglass':
                result.data = {
                    "login": "davglass",
                    "id": 32551,
                    "avatar_url": "https://gravatar.com/avatar/05243ae612fb4dcfb151e08489f334b0?d=https%3A%2F%2Fidenticons.github.com%2Fdef32002582287e0636afa7edb65a192.png&r=x",
                    "gravatar_id": "05243ae612fb4dcfb151e08489f334b0",
                    "url": "https://api.github.com/users/davglass",
                    "html_url": "https://github.com/davglass",
                    "followers_url": "https://api.github.com/users/davglass/followers",
                    "following_url": "https://api.github.com/users/davglass/following{/other_user}",
                    "gists_url": "https://api.github.com/users/davglass/gists{/gist_id}",
                    "starred_url": "https://api.github.com/users/davglass/starred{/owner}{/repo}",
                    "subscriptions_url": "https://api.github.com/users/davglass/subscriptions",
                    "organizations_url": "https://api.github.com/users/davglass/orgs",
                    "repos_url": "https://api.github.com/users/davglass/repos",
                    "events_url": "https://api.github.com/users/davglass/events{/privacy}",
                    "received_events_url": "https://api.github.com/users/davglass/received_events",
                    "type": "User",
                    "site_admin": false,
                    "name": "Dav Glass",
                    "company": "Yahoo Inc.",
                    "blog": "http://davglass.com/",
                    "location": "Marion, IL",
                    "email": "davglass@gmail.com",
                    "hireable": false,
                    "bio": null,
                    "public_repos": 164,
                    "public_gists": 340,
                    "followers": 584,
                    "following": 108,
                    "created_at": "2008-11-04T04:22:29Z",
                    "updated_at": "2014-01-01T21:35:39Z"
                };
                break;
        }

        setTimeout(function () {
            callback(result);
        }, 0);
    };
});
