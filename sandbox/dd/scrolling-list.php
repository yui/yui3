
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=utf-8">
<title>List reorder w/Scrolling</title>

<style type="text/css">
/*margin and padding on body element
  can introduce errors in determining
  element position and are not recommended;
  we turn them off as a foundation for YUI
  CSS treatments. */
body {
	margin:0;
	padding:0;
}
</style>

<link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"> 


<!--there is no custom header content for this example-->

</head>

<body class=" yui-skin-sam">

<h1>List reorder w/Scrolling</h1>

<div class="exampleIntro">
	<p>This example shows how to make a sortable list using Custom Event Bubbling and Node scrolling.</p>
			
</div>

<!--BEGIN SOURCE CODE FOR EXAMPLE =============================== -->

<style type="text/css" media="screen">
    .yui-dd-proxy {
        text-align: left;
    }
    #play {
        border: 1px solid black;
        padding: 10px;
        margin: 10px;
        zoom: 1;
    }
    #play:after { display: block; clear: both; visibility: hidden; content: '.'; height: 0;}
    #play ul {
        border: 1px solid black;
        margin: 10px;
        width: 200px;
        height: 300px;
        float: left;
        padding: 0;
        zoom: 1;
        position: relative;
        overflow: auto;
    }
    #play ul li {
        background-image: none;
        list-style-type: none;
        padding-left: 20px;
        padding: 5px;
        margin: 2px;
        cursor: move;
        zoom: 1;
        position: relative;
    }
    #play ul li.list1 {
        background-color: #8DD5E7;
        border:1px solid #004C6D;
    }
    #play ul li.list2 {
        background-color: #EDFF9F;
        border:1px solid #CDCDCD;
    }
    
</style>

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
        <li class="list1">Item #11</li>
        <li class="list1">Item #12</li>
        <li class="list1">Item #13</li>
        <li class="list1">Item #14</li>
        <li class="list1">Item #15</li>
        <li class="list1">Item #16</li>
        <li class="list1">Item #17</li>
        <li class="list1">Item #18</li>
        <li class="list1">Item #19</li>
        <li class="list1">Item #20</li>
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
        <li class="list2">Item #11</li>
        <li class="list2">Item #12</li>
        <li class="list2">Item #13</li>
        <li class="list2">Item #14</li>
        <li class="list2">Item #15</li>
        <li class="list2">Item #16</li>
        <li class="list2">Item #17</li>
        <li class="list2">Item #18</li>
        <li class="list2">Item #19</li>
        <li class="list2">Item #20</li>
    </ul>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/attribute/attribute-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/base/base-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/oop/oop-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/node/node-debug.js?bust=<?php echo(mktime()); ?>"></script>



<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/scroll.js?bust=<?php echo(mktime()); ?>"></script>


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

YUI(yConfig).use('dd-constrain', 'dd-proxy', 'dd-drop', 'dd-scroll', function(Y) {
    //Listen for all drop:over events
    //Y.DD.DDM._debugShim = true;

    Y.DD.DDM.on('drop:over', function(e) {
        //Get a reference to out drag and drop nodes
        var drag = e.drag.get('node'),
            drop = e.drop.get('node');
        
        //Are we dropping on a li node?
        if (drop.get('tagName').toLowerCase() === 'li') {
            //Are we not going up?
            if (!goingUp) {
                drop = drop.get('nextSibling');
            }
            //Add the node to this list
            e.drop.get('node').get('parentNode').insertBefore(drag, drop);
            //Set the new parentScroll on the nodescroll plugin
            e.drag.nodescroll.set('parentScroll', e.drop.get('node').get('parentNode'));
            //Resize this nodes shim, so we can drop on it later.
            e.drop.sizeShim();
        }
    });
    //Listen for all drag:drag events
    Y.DD.DDM.on('drag:drag', function(e) {
        //Get the last y point
        var y = e.target.lastXY[1];
        //is it greater than the lastY var?
        if (y < lastY) {
            //We are going up
            goingUp = true;
        } else {
            //We are going down..
            goingUp = false;
        }
        //Cache for next check
        lastY = y;
        Y.DD.DDM.syncActiveShims(true);
    });
    //Listen for all drag:start events
    Y.DD.DDM.on('drag:start', function(e) {
        //Get our drag object
        var drag = e.target;
        //Set some styles here
        drag.get('node').setStyle('opacity', '.25');
        drag.get('dragNode').set('innerHTML', drag.get('node').get('innerHTML'));
        drag.get('dragNode').setStyles({
            opacity: '.5',
            borderColor: drag.get('node').getStyle('borderColor'),
            backgroundColor: drag.get('node').getStyle('backgroundColor')
        });
    });
    //Listen for a drag:end events
    Y.DD.DDM.on('drag:end', function(e) {
        var drag = e.target;
        //Put out styles back
        drag.get('node').setStyles({
            visibility: '',
            opacity: '1'
        });
    });
    //Listen for all drag:drophit events
    Y.DD.DDM.on('drag:drophit', function(e) {
        var drop = e.drop.get('node'),
            drag = e.drag.get('node');

        //if we are not on an li, we must have been dropped on a ul
        if (drop.get('tagName').toLowerCase() !== 'li') {
            if (!drop.contains(drag)) {
                drop.appendChild(drag);
                //Set the new parentScroll on the nodescroll plugin
                e.drag.nodescroll.set('parentScroll', e.drop.get('node'));
            }
        }
    });
    
    //Static Vars
    var goingUp = false, lastY = 0;

    //Get the list of li's in the lists and make them draggable
    var lis = Y.Node.all('#play ul li');
    lis.each(function(v, k) {
        var dd = new Y.DD.Drag({
            node: v,
            target: {
                padding: '0 0 0 20'
            }
        }).plug(Y.Plugin.DDProxy, {
            moveOnEnd: false
        }).plug(Y.Plugin.DDConstrained, {
            constrain2node: '#play'
        }).plug(Y.Plugin.DDNodeScroll, {
            node: v.get('parentNode')
        });
    });

    //Create simple targets for the 2 lists..
    var tar = new Y.DD.Drop({
        node: '#list1'
    });
    
});

</script>


<!--END SOURCE CODE FOR EXAMPLE =============================== -->

</body>
</html>
