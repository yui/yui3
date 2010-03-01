<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #out {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 200px;
            border: 1px solid black;
            font-size: 10px;
        }

        #out p {
            margin: 0;
        }
	</style>
</head>
<body class="yui-skin-sam">

<div id="out"></div>

<p>This is a test. This is only a test. This is a test. This is only a test. This is a test. This is only a test. This is a test. This is only a test. </p>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../dd/js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/selection.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: true,
    //base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'yui': true,
        'event': true,
        base: true,
        attribute: true,
        augment: true,
        get: true,
        loader: true,
        Selector: true
    },
    throwFail: true
};

//YUI(yConfig).use('node', 'selector-css3', 'base', 'iframe', 'substitute', 'anim', 'dd', function(Y) {
var GY;
YUI(yConfig).use('node', 'selector-css3', 'base', 'selection', function(Y) {
    //console.log(Y, Y.id);
    GY = Y;
    var out = function(str) {
        Y.one('#out').prepend('<p>' + str + '</p>');
    };



});
</script>
</body>
</html>
