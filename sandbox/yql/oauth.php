<?php

$zip = (($_GET['zip']) ? htmlentities($_GET['zip']) : '62959');
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>Example</title>
</head>
<body class="yui-skin-sam">

<p>YUI Gallery YQL example</p>

<div id="res"></div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="../../build/jsonp/jsonp-debug.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="./js/yql.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="../../../yui3-gallery/build/gallery-oauth/gallery-oauth-debug.js?bust=<?php echo(time()); ?>"></script>
<script>
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    },
    throwFail: true,
    debug: false
};
YUI(yConfig).use('node', 'jsonp', 'yql', 'gallery-oauth', function(Y) {


    var res = Y.one('#res');

    Y.oAuth.ready(function() {
        Y.YQL('SELECT title,abstract,url,source FROM search.news WHERE query="storms" and appid = "lduc8F6q"', function() {
            console.log('success: ', arguments);
        }, {
            key: 'dj0yJmk9SXNaaTF2TGVMM1Q3JmQ9WVdrOVJGSlJRelpHTlRJbWNHbzlNelF6TlRjMk9EWXkmcz1jb25zdW1lcnNlY3JldCZ4PWMw',
            secret: 'f6cb68d25da294a584b541ff29da599a3f53db76',
            base: '://query.yahooapis.com/v1/yql?'
        });

        /*{{{ JSONP way
        var q = new Y.YQLRequest('select title,abstract from search.news where query="election"', {
                on: {
                    success: function() {
                        console.log('success: ', arguments);
                    }
                },
                format: function(url, proxy) {
                    var finalURL = url + 'callback=' + proxy;
                    return Y.oAuth.signURL("dj0yJmk9SXNaaTF2TGVMM1Q3JmQ9WVdrOVJGSlJRelpHTlRJbWNHbzlNelF6TlRjMk9EWXkmcz1jb25zdW1lcnNlY3JldCZ4PWMw", "f6cb68d25da294a584b541ff29da599a3f53db76", finalURL);
                }
            }, {}, {
                base: '://query.yahooapis.com/v1/yql?'
            });

         q.send();
        }}}*/
    });
    
});
</script>
</body>
</html>

