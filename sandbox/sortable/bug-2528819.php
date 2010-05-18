<html>
<head>
    <title>TEST</title>
    <style>
        .container {
            border: 1px solid black;
            height: 300px;
            width: 300px;
        }
        .div {
            background-color: #4684EE;
        }
    </style>
</head>
<body>
<div id="sort1" class="container">
    <div class="div">1</div>
    <div class="div">2</div>
</div>
<script src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script src="../dd/js/delegate.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/sortable.js?bust=<?php echo(mktime()); ?>"></script>

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

    YUI(yConfig).use('sortable', function(Y) {
        var sortable1 = new Y.Sortable({
            container: '#sort1',
            nodes: 'div'
        });
    });
</script>
</body>
</html>

