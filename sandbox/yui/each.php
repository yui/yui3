<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Each</title>
</head>
<body class="yui-skin-sam">
<div id="demo">
    <ul>
    <?php
    for ($i = 1; $i <= 30; $i++) {
        echo('<li id="item_'.$i.'">Item #'.$i.'</li>'."\n");
    }
    ?>
    </ul>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/attribute/attribute-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/base/base-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event-custom/event-custom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/oop/oop-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/node/node-debug.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    allowRollup: false,

    logExclude: {
        event: true,
        base: true,
        attribute: true,
        augment: true
    },

    throwFail: true,
    debug: true 
};

YUI(yConfig).use('node', function(Y) {
    var demo = Y.get('#demo');
    var lis = demo.getElementsByTagName('li');
    Y.log('collection length: ' + lis.length);
    Y.log('collection tagName: ' + lis.tagName);
    Y.log('collection alert: ' + lis.alert);
    Y.log('collection size: ' + lis.size());
    lis.each(function(item) {
        item.setStyle('border', '1px solid red');
    });

    var nlis = document.getElementsByTagName('li');
    Y.log('native collection length: ' + nlis.length);
    Y.log('native collection tagName: ' + nlis.tagName);
    Y.log('native collection alert: ' + nlis.alert);
    Y.log('native collection size: ' + nlis.size);
    Y.log('native collection test: ' + Y.Array.test(nlis));
    Y.log('native collection isObject and not function: ' + Y.Lang.isObject(nlis, true));
});

</script>
</body>
</html>
