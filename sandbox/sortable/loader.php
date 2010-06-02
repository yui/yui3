<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <!--link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"--> 
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }

        #demo {
            border: 1px solid black;
            height: 400px;
        }
        #demo ul {
            border: 1px solid blue;
            width: 200px;
            float: left;
            min-height: 100px;
        }
        #demo .item {
            border: 2px solid black;
            background-color: #ccc;
            margin: 4px;
        }
        #demo .list-item1 {
            background-color: red;
        }
        #demo .list-item2 {
            background-color: green;
        }
        #demo .list-item3 {
            background-color: blue;
        }
        #demo li.item {
            width: 150px;
            list-style-type: circle;
        }
        #demo div.item {
            height: 50px;
            float: left;
            width: 50px;
        }
        #demo .yui-dd-drop-over {
            border: 2px solid green;
        }
	</style>
</head>
<body class="yui-skin-sam">
<input type="button" value="Add <?php echo($count); ?> More Items" id="add"><br>

<div id="demo">
<ul id="one">
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item list-item1">'.$k.'</li>'."\n");
}
?>
</ul>
<ul id="two">
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item list-item2">'.$k.'</li>'."\n");
}
?>
</ul>
<ul id="three">
<?php
foreach (range(1, $count) as $k) {
    echo('  <li class="item list-item3">'.$k.'</li>'."\n");
}
?>
</ul>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
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

YUI(yConfig).use('sortable', 'dd', function(Y) {
    console.log(Y);
    
    //Y.DD.DDM._debugShim = true;

    var sel = new Y.Sortable({
        container: '#one',
        nodes: '.item',
        opacity: '.5',
        moveType: 'copy'
    });
    sel.plug(Y.Plugin.DDConstrained, {
        constrain2node: '#demo'
    });

    console.log('sel: ', sel.get('id'));

    

    var sel2 = new Y.Sortable({
        container: '#two',
        nodes: '.item',
        moveType: 'copy'
    });
    sel2.plug(Y.Plugin.DDConstrained, {
        constrain2node: '#demo'
    });
    console.log('sel2: ', sel2.get('id'));

    //sel2.bindTo(sel);
    //sel2.bindWith(sel);

    sel.join(sel2, 'outer');
    

    var sel3 = new Y.Sortable({
        container: '#three',
        nodes: '.item',
        moveType: 'move'
    });
    sel3.plug(Y.Plugin.DDConstrained, {
        constrain2node: '#demo'
    });
    console.log('sel3: ', sel3.get('id'));
    sel3.join(sel);

    /*
    console.log(Y.DD.DDM.getDelegate(Y.one('#three')));
    console.log(Y.DD.DDM.getDelegate('#one'));
    console.log(Y.DD.DDM.getDelegate('#two'));

    console.log(Y.Sortable.getSortable(Y.one('#three')));
    console.log(Y.Sortable.getSortable('#one'));
    console.log(Y.Sortable.getSortable('#two'));
    */

    var count = <?php echo($count); ?>,
        inc = 1;
    
    Y.one('#add').on('click', function(e) {
        var node, one = Y.one('#one'), two = Y.one('#two'), three = Y.one('#three');
        for (var i = 1; i < count + 1; i++) {
            node = Y.Node.create('<li class="item">(' + inc + ':1) ' + i + '</li>');
            one.append(node);
            two.append(node.cloneNode(true).set('innerHTML', '(' + inc + ':2) ' + i));
            three.append(node.cloneNode(true).set('innerHTML', '(' + inc + ':3) ' + i));
        }
        inc++;
        sel.sync();
        sel2.sync();
        sel3.sync();
    });

});

</script>
</body>
</html>
