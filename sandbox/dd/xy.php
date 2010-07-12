<?php
$count = (($_GET['count']) ? $_GET['count'] : 100);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: XY</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #node {
            position: relative;
            top: 700px;
            left: 200px;
            border: 1px solid black;
            background-color: #ccc;
            height: 100px;
            width: 100px;
        }
	</style>
</head>
<body class="yui-skin-sam">
    <div id="node"></div>
    <div id="res"></div>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-touch.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-synthetic-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event-gestures/event-gestures-debug.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript">
var yConfig = {
    base: '../../build/',
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

//var Y1 = new YUI().use('dd-drag', 'dd-proxy');
YUI(yConfig).use('event-synthetic', 'event-gestures', function(Y) {
    console.log('Go!');
    var node = Y.one('#node'),
        res = Y.one('#res');

    node.on('movestart', function(e) {
        var html = '<p>pageX: ' + e.pageX + '<br>pageY: ' + e.pageY + '</p><hr>';
        res.append(html);
    });

});


</script>
</body>
</html>
