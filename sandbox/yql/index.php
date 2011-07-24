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

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/jsonp/jsonp-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="./js/yql.js?bust=<?php echo(mktime()); ?>"></script>
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
YUI(yConfig).use('node', 'jsonp', 'jsonp-url', 'yql', function(Y) {

    var res = Y.one('#res');
    
    var q = Y.YQL('select * from weather.forecast where location=<?php echo($zip); ?>', function(r) {
        var el = Y.Node.create('<div class="mod"></div>');
        el.set('innerHTML', '<h2>Weather for <?php echo($zip); ?></h2>' +
            r.query.results.channel.item.description);
        res.setContent(new Date() + '<br>');
        res.appendChild(el);
    });

    Y.later(3000, null, function() {
        console.log('sending...');
        q.send();
    }, null, true);
});
</script>
</body>
</html>

