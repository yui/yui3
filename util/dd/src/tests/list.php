<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop: List Example</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.1/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/wp-content/themes/davglass/style.css" type="text/css">    
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
            background-color: #D1E6EC;
            border:1px solid #7EA6B2;
        }
        li.list2 {
            background-color: #D8D4E2;
            border:1px solid #6B4C86;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="index.php">YUI: DragDrop 3.x: List Example</a></h1></div>
    <div id="bd">
        <div id="play">
            <ul id="list1">
                <li class="list1">Item #1</li>
                <li class="list1">Item #2</li>
                <li class="list1">Item #3</li>
                <li class="list1">Item #4</li>
                <li class="list1">Item #5</li>
                <!--li class="list1">Item #6</li>
                <li class="list1">Item #7</li>
                <li class="list1">Item #8</li>
                <li class="list1">Item #9</li>
                <li class="list1">Item #10</li-->
            </ul>
            <ul id="list2">
                <li class="list2">Item #1</li>
                <li class="list2">Item #2</li>
                <li class="list2">Item #3</li>
                <li class="list2">Item #4</li>
                <li class="list2">Item #5</li>
                <!--li class="list2">Item #6</li>
                <li class="list2">Item #7</li>
                <li class="list2">Item #8</li>
                <li class="list2">Item #9</li>
                <li class="list2">Item #10</li-->
            </ul>
        </div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../../../../build/yui/yui.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/base/base.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/dom/dom.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/node/node.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/dd/dd-dragdrop-all-min.js?bust=<?php echo(mktime()); ?>"></script>    

<script type="text/javascript">
var yConfig = {
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true,
        augment: true
    } 
};

var Y = new YUI(yConfig).use('dd-drop', 'dd-constrain', 'dd-proxy');

Y.on('event:ready', function() {
    //Y.DD.DDM._debugShim = true;
    

    var dds = [], goingUp = false, lastY = 0, offTarget = false;
    var lis = Y.Node.get('document').queryAll('#list1 li, #list2 li');
    Y.each(lis, function(v, k, items) {
        var dd = new Y.DD.Drag({
            node: items.item(k),
            proxy: true,
            constrain2node: '#play',
            target: {
                padding: '0 0 0 20'
            }
        });
        dd.target.on('drop:over', function(e) {
            var drag = e.drag.get('node'),
                drop = e.drop.get('node');

            if (!goingUp) {
                drop = drop.get('nextSibling');
            }
            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            e.drop.sizeShim();
        });
        dd.on('drag:drag', function() {
            var y = this.lastXY[1];
            if (y < lastY) {
                goingUp = true;
            } else {
                goingUp = false;
            }
            lastY = y;
        });
        dd.on('drag:start', function() {
            offTarget = false;
            this.get('node').setStyle('opacity', '.25');
            this.get('dragNode').set('innerHTML', this.get('node').get('innerHTML'));
            this.get('dragNode').setStyles({
                opacity: '.5',
                borderColor: this.get('node').getStyle('borderColor'),
                backgroundColor: this.get('node').getStyle('backgroundColor')
            });
        });
        dd.on('drag:end', function() {
            this.get('node').setStyles({
                top: '',
                left: '',
                visibility: '',
                opacity: '1'
            });
        });
        dd.on('drag:drophit', function(e) {
            var drop = e.drop.get('node'),
                drag = e.drag.get('node');

            if (drop.get('tagName').toLowerCase() !== 'li') {
                if (!drop.contains(drag)) {
                    drop.appendChild(drag);
                }
            }
        });
        dds[dds.length] = dd;
    });
    //Create simple targets for the 2 lists..
    var uls = Y.Node.get('document').queryAll('#list1, #list2');
    Y.each(uls, function(v, k, items) {
        var tar = new Y.DD.Drop({
            node: items.item(k)
        });
    });
});

</script>
</body>
</html>
