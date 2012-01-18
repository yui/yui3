<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: Delegate</title>
    <!--link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"--> 
    <style type="text/css" media="screen">
    #open-transaction .tile {
    border: 1px solid black;
    background-color: green;
    color: white;
    text-align: center;
    height: 25px;
    width: 25px;
    cursor: move;
}

#bin {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 300px;
    height: 50px;
    border: 1px solid black;
    background-color: #ccc;
}
	</style>
</head>
<body class="yui-skin-sam">

<div id="bin"></div>

<div id="open-transaction">
    <div class="tile">1</div>
    <div class="tile">2</div>
    <div class="tile">3</div>
    <div class="tile">4</div>
    <div class="tile">5</div>
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
<script type="text/javascript" src="js/delegate.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag-gestures.js?bust=<?php echo(mktime()); ?>"></script>

<script>
YUI().use('dd-delegate', 'dd-proxy', function(Y) {

    var target = Y.one('#bin').plug(Y.Plugin.Drop);
        target.drop.on('drop:hit', function (e) {
        e.drag.get('node').hide();
    });

    var del = new Y.DD.Delegate({
        container: '#open-transaction',
        nodes: 'div.tile'
    });

    del.dd.plug(Y.Plugin.DDProxy, {
        moveOnEnd: false,
        cloneNode: true
    });

    del.on('drag:start', function (e) {
        e.target.get('node').setStyle('opacity', '.5');
        //This breaks things..
        //e.target.deltaXY = [150, 40];
    });

    del.on('drag:end', function (e) {
        e.target.get('node').setStyle('opacity', '1');
    });

});
</script>

</body>
</html>
