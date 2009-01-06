<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: List Example</title>
    <link rel="stylesheet" type="text/css" href="../yui-dev/build/reset-fonts-grids/reset-fonts-grids.css"> 
        <link rel="stylesheet" type="text/css" href="../yui-dev/build/assets/skins/sam/logger.css"> 
    <link rel="stylesheet" href="../css/davglass.css" type="text/css">
    <!--link rel="stylesheet" type="text/css" href="dd.css"-->
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #play {
            border: 1px solid black;
            padding: 10px;
            width: 700px;
            margin: 10px;
        }
        #play:after { display: block; clear: both; visibility: hidden; content: '.'; height: 0;}        
        #list1, #list2 {
            border: 1px solid black;
            margin: 10px;
            width: 200px;
            height: 500px;
            float: left;

        }
        #list1 li, #list2 li {
            padding-left: 20px;
            padding: 5px;
            margin: 2px;
            cursor: move;
            zoom: 1;
        }
        li.list1 {
            background-color: #8DD5E7;
            border:1px solid #004C6D;
        }
        li.list2 {
            background-color: #EDFF9F;
            border:1px solid #CDCDCD;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x: List Example</a></h1></div>
    <div id="bd">
        <div id="play">
            <ul id="list1">
                <li class="list1">Item #1</li>
                <li class="list1">Item #2</li>
                <li class="list1">Item #3</li>
                <li class="list1">Item #4</li>
                <li class="list1">Item #5</li>
                <li class="list1">Item #6</li>
                <li class="list1">Item #7</li>
                <li class="list1">Item #8</li>
                <li class="list1">Item #9</li>
                <li class="list1">Item #10</li>
            </ul>
            <ul id="list2">
                <li class="list2">Item #1</li>
                <li class="list2">Item #2</li>
                <li class="list2">Item #3</li>
                <li class="list2">Item #4</li>
                <li class="list2">Item #5</li>
                <li class="list2">Item #6</li>
                <li class="list2">Item #7</li>
                <li class="list2">Item #8</li>
                <li class="list2">Item #9</li>
                <li class="list2">Item #10</li>
            </ul>
        </div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../3.x/build/yui/yui.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until built into a module -->
    <script type="text/javascript" src="../3.x/build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/base/base.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until new node.js is built into yui.js -->
    <script type="text/javascript" src="../3.x/build/dom/dom.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../3.x/build/node/node.js?bust=<?php echo(mktime()); ?>"></script>



    <script type="text/javascript" src="ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="ddm.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="drag.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="proxy.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="constrain.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var Y = new YUI().use('dd-constrain', 'dd-proxy', 'dd-drop', function(Y) {
    Y.DD.DDM.on('drop:over', function(e) {
        var drag = e.drag.get('node'),
            drop = e.drop.get('node');
        
        if (drop.get('tagName').toLowerCase() === 'li') {
            if (!goingUp) {
                drop = drop.get('nextSibling');
            }
            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            e.drop.sizeShim();
        }
    });
    
    Y.DD.DDM.on('drag:drag', function(e) {
        var y = e.target.lastXY[1];
        if (y < lastY) {
            goingUp = true;
        } else {
            goingUp = false;
        }
        lastY = y;
    });

    Y.DD.DDM.on('drag:start', function(e) {
        var drag = e.target;
        offTarget = false;
        drag.get('node').setStyle('opacity', '.25');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
            }
        }
    });
    
    var goingUp = false, lastY = 0, offTarget = false;
    var lis = Y.Node.all('#list1 li, #list2 li');
    lis.each(function(v, k, items) {
        var dd = new Y.DD.Drag({
            node: items.item(k),
            proxy: true,
            moveOnEnd: false,
            constrain2node: '#play',
            target: {
                padding: '0 0 0 20'
            }
        });
        //dd.on('drag:drag', function() {});
        //dd.on('drag:start', function() {});
        //dd.on('drag:end', function() {});
    });

    //Create simple targets for the 2 lists..
    var uls = Y.Node.all('#list1, #list2');
    uls.each(function(v, k, items) {
        var tar = new Y.DD.Drop({
            node: items.item(k)
        });
    });
    
});

</script>
</body>
</html>
