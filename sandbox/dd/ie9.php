<!doctype html>
<html>
<head>
    <title>Test Page</title>
    <style type="text/css">
        #x {
            height: 100px;
            width: 100px;
            background: #999;
            position: absolute;
        }
    </style>
</head>
<body class="yui3-skin-sam">
<p><img src="http://yui.yahooapis.com/3.2.0/build/slider/assets/skins/sam/thumb-x.png"></p>
<p><img src="http://yui.yahooapis.com/3.2.0/build/slider/assets/skins/sam/thumb-x.png"></p>
<div id="x">
    <img src="http://yui.yahooapis.com/3.2.0/build/slider/assets/skins/sam/thumb-x.png" id="img-x">
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag-gestures.js?bust=<?php echo(mktime()); ?>"></script>

<script>
YUI({ filter: 'raw' }).use('dd-drag', function (Y) {
    new Y.DD.Drag({ node: '#x' });
});
</script>
</body>
</html>

