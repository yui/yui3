<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/wp-content/themes/davglass/style.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="http://us.js2.yimg.com/us.js.yimg.com/i/ydn/yuiweb/css/dpsyntax-min-11.css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #davdoc {
            min-height: 2000px;
        }
        #drag, #drag2, #drag3, #drag4, #drag5, #drag6, #drag7, .drop, #anim_drop {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
        }
        #anim_drop {
            position: relative;
        }
        #bd {
            position: relative;
        }
        .drop {
            border-width: 4px; 
            background-color: #ccc;
            height: 100px;
            width: 100px;
            float: left;
            margin: 5px;
        }
        #play {
            position: absolute;
            top: 50px;
            right: 100px;
            width: 500px;
            border: 3px solid black;
            /*height: 500px;
            overflow: auto;*/
        }
        #fixed {
            position: fixed;
            left: 485px;
            height: 100px;
            width: 200px;
            border: 1px solid black;
            background-color: #ccc;
        }
        #drag h2, #drag2 h2, #drag3 h2 {
            margin: 0;
            padding: 0;
            border: none;
        }
        #drag3 {
            position: relative;
        }
        #drag3 h2 {
            position: absolute;
            font-size: 85%;
            height: 25px;
            width: 25px;
            background-color: red;
            color: white;
        }
        #drag3 h2.one {
            top: 0;
            left: 0;
        }
        #drag3 h2.two {
            top: 0;
            right: 0;
        }
        #drag3 h2.three {
            bottom: 0;
            left: 0;
        }
        #drag3 h2.four {
            bottom: 0;
            right: 0;
        }
        #drag6 {
            height: 150px;
            width: 150px;
        }
        #drag4 {
            position: absolute;
            top: 13px;
            left: 13px;
            height: 73px;
            width: 73px;
            background-color: green;
        }
        #drag4.yui-dd-dragging {
            opacity: .5;
        }
        #drag7EL {
            position: absolute;
            display: none;
            height: 30px;
            width: 200px;
            background-color: green;
            color: white;
            font-weight: bold;
            border: 2px solid black;
            z-index: 999;
        }
        #drag4Cont {
            border: 1px solid black;
            position: relative;
            height: 400px;
            width: 400px;
            background-image: url( grid.png );
        }

        .dd-drop-active {
            border-style: dotted;
        }
        .dd-drop-active-valid {
            border-color: blue;
        }
        .dd-drop-active-invalid {
            border-color: red;
        }
        .dd-drop-over {
            border-color: green;
        }
        #drop_4 {
            position: relative;
            top: -50px;
            left: -10px;
        }
        #drop_8 {
            position: relative;
            top: -200px;
            left: 25px;
        }
        #drop_2 {
            position: relative;
            top: 20px;
            left: -195px;
        }
        #drop_6 {
            position: relative;
            top: -70px;
            left: -185px;
        }
        #drop_1 {
            position: relative;
            left: 275px;
            top: 10px;
        }
        #drop_5 {
            position: relative;
            left: 205px;
            top: -81px;
        }
        #drop_7 {
            position: relative;
            top: -61px;
            left: -10px;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="drag7EL">I'm a custom proxy</div>
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <div id="play"></div>
        <div id="drag"><h2><strong>Drag</strong> Me</h2></div>
        <div id="drag2"><h2><strong>Drag</strong> <a href="#">Me II</a></h2></div>
        <div id="drag3"><h2 class="one">X</h2><h2 class="two">X</h2><h2 class="three">X</h2><h2 class="four">X</h2><br><br>Drag Me III</div>
        <div id="drag4Cont">
            <div id="drag4">Drag Me IV <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        </div>
        <div id="drag5">Drag Me V <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <div id="drag6">Drag Me VI <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <div id="drag7">Drag Me VII <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <button id="test">Test Programmatic Move</button><br>
        <select>
            <option>Test Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
        </select>
        <iframe src="blank.htm" height="300" width="300"></iframe>
        <div id="anim_drop">Anim Drop</div>

    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../../../../build/yui/yui.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until built into a module -->
    <script type="text/javascript" src="../../../../util/yui/src/js/State.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/attribute/attribute.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../../../../build/base/base.js?bust=<?php echo(mktime()); ?>"></script>

    <!-- needed until new node.js is built into yui.js -->
    <script type="text/javascript" src="../../../../build/node/node.js?bust=<?php echo(mktime()); ?>"></script>

    <script type="text/javascript" src="../js/node-region.js?bust=<?php echo(mktime()); ?>"></script>


    <script type="text/javascript" src="../js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/drag.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/drop.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
    <script type="text/javascript" src="../js/constrain.js?bust=<?php echo(mktime()); ?>"></script>

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
var yConfig2 = {};
YUI().mix(yConfig2, yConfig);

//var Y1 = new YUI().use('dd-drag', 'dd-proxy');
var Y1 = new YUI(yConfig).use('node-region', 'dd-ddm', 'dd-drag', 'dd-constrain', 'dd-proxy');

Y1.on('event:ready', function() {

    //Y1.DD.DDM._debugShim = true;

    dd4 = new Y1.DD.DragConstrained({
        node: '#drag4',
        useShim: false,
        //tickX: 25,
        //tickY: 25,
        //tickXArray: [10, 133, 245, 333, 388, 455, 488, 546, 667, 798, 892],
        //tickXArray: [133, 245, 333, 455, 488, 546, 667, 798, 892],
        //tickYArray: [249, 339, 459, 479, 579],
        /*
        constrain2region: {
            top: 200,
            left: 100,
            right: 800,
            bottom: 700
        },
        */
    
        constrain2node: '#drag4Cont',
        //constrain2view: true,
        //gutter: '-15 20 15 -20'
        gutter: '5',
        //stickX: true,
        //stickY: true
        foo: true
    });
    /*
    dd4.addInvalid('strong.no').on('drag:beforeMouseDown', function(e) {
        Y.log('beforeMouseDown::HALT');
        Y.log(arguments);
        //e.ev.halt();
        //return false;
    });
    //}).addInvalid('strong.no');
    */

    dd5 = new Y1.DD.Proxy({
        node: '#drag5',
        moveOnEnd: false
    }).addInvalid('strong.no');
    //dd4.setHandle('#drag4Handle', true);

    dd6 = new Y1.DD.Proxy({
        node: '#drag6',
        resizeFrame: false,
        offsetNode: false
    }).addInvalid('strong.no').on('drag:start', function() {
        this.get('dragNode').setStyles({
            height: '25px',
            width: '105px',
            color: 'white',
            backgroundColor: 'blue'
        }).set('innerHTML', 'Dragging Me!!')
    });
    dd7 = new Y1.DD.Proxy({
        node: '#drag7',
        resizeFrame: false,
        offsetNode: false,
        dragNode: '#drag7EL'
    }).addInvalid('strong.no').on('drag:beforeStart', function() {
        this.deltaXY = [-10, -10];
    });

});

var Y = new YUI(yConfig2).use('node-region', 'dd-drop', 'dd-scroll');
//var Y = new YUI().use('dd-ddm', 'dd-drag');
Y.on('event:ready', function() {
    //Y.DD.DDM._debugShim = true;
    //Y.DD.DDM.mode = Y.DD.DDM.INTERSECT;

    /*
    Y.DD.DDM.on('drag:drag', function(e) {
        console.log('DDM:drag:drag :: ', arguments);
    });
    Y.DD.DDM.on('drop:over', function(e) {
        console.log('DDM:drop:over :: ', arguments);
    });
    */

    dd = new Y.DD.Drag({
        node: '#drag',
        groups: ['one', 'three'],
        target: true,
        dragMode: 'intersect',
        data: {
            one: 'This is my data object',
            two: 'This is my data object',
            three: 'This is my data object'
        }
    }).addHandle('h2');
    //}).addHandle('h2')._bubbles.beforeMouseDown.subscribe('drag:beforeMouseDown', function(e) {
    /*
    dd.on('drag:mouseDown', function(e) {
        Y.log('mouseDown:: ', arguments);
        e.halt();
        Y.log('mouseDown Event stopped');
    });

    dd.on('drag:start', function(e) {
        Y.log('start:: ', arguments);
        e.halt();
        Y.log('start Event stopped');
    });
    */
    <?php
    if ($_GET['events']) {
    ?>
    dd.on('drag:enter', function() {
        //Y.log('drag:enter', arguments);
    });
    
    dd.on('drag:over', function() {
        //Y.log('drag:over', arguments);
    });
    
    dd.on('drag:exit', function() {
        //Y.log('drag:exit', arguments);
    });
    <?php
    }
    ?>
    dd.on('drag:drophit', function(e) {
        Y.log('drag:drophit :: ' + e.drop.get('node').get('id'));
    });
    
    dd.on('drag:dropmiss', function() {
        Y.log('drag:dropmiss', arguments);
    });
    
    
    
    
    /*
    Y.DD.DDM.on('drag:drag', function(e) {
        console.log('DDM:drag:drag :: ', arguments);
    });
    Y.DD.DDM.on('drop:over', function(e) {
        console.log('DDM:drop:over :: ', arguments);
    });
    
    Y.DD.DDM.on('drag:mouseDown', function(e) {
        Y.log('DDMFire: drag:mouseDown :: ', arguments);
        e.ev.preventDefault();
        e.ev.halt();
        Y.log('DDM stopped event..');
    });
    */
    

    dd2 = new Y.DD.Drag( {
        node: '#drag2',
        //clickPixelThresh: 20,
        //clickTimeThresh: 0,
        //offsetNode: false,
        groups: ['two'],
        lock: false,
        dragMode: 'point'
        //dragMode: 'intersect'
    }).addInvalid('h2 a');

    <?php
    if ($_GET['events']) {
    ?>
    dd2.on('drag:enter', function() {
        //Y.log('drag2:enter', arguments);
    });
    
    dd2.on('drag:over', function() {
        //Y.log('drag2:over', arguments);
    });
    
    dd2.on('drag:exit', function() {
        //Y.log('drag2:exit', arguments);
    });
    <?php
    }
    ?>


    dd3 = new Y.DD.Drag({
        node: '#drag3'//,
        //move: false
    //}).addHandle('h2');
    //}).addHandle('h2').addInvalid('h2.two');
    }).addHandle('h2.one').addHandle('h2.two').removeHandle('h2.one').addHandle('h2.three').addHandle('h2.four');
    dd3.on('drag:drophit', function(e) {
        console.log('drag:drophit :: ' + e.drop.get('node').get('id'), e);
    });
    /*
    dd3.on('drag:start', function(args) {
        if (this.get('activeHandle').test('h2.two')) {
            this.set('move', false);
        } else {
            this.set('move', true);
        }
    });
    dd3.on('drag:drag', function(args) {
        if (this.get('activeHandle').test('h2.two')) {
            var size = (args.info.xy[0] - args.info.start[0]);
            var w = parseInt(this.get('dragNode').getStyle('width'), 10);
            this.get('dragNode').setStyle('width', (size) + 'px');
        }
    });
    */
    
    Y.Node.get('#test').on('click', function() {
        Y.log('_setStartPosition:', 'info', 'Dav Test');
        dd._setStartPosition(dd.get('node').getXY());
        Y.log('DDM::activeDrag:', 'info', 'Dav Test');
        Y.DD.DDM.activeDrag = dd;
        Y.log('dd.start():', 'info', 'Dav Test');
        dd.start();
        for (var i = 0; i < 726; i++) {
            Y.log('moveNode([' + i + ', 129]):', 'info', 'Dav Test');
            dd.moveNode([i, 129]);
        }
        Y.log('end', 'info', 'Dav Test');
        dd.end();
        Y.log('_handleMouseUp():', 'info', 'Dav Test');
        dd._handleMouseUp();
    });


    
    //var b = Y.Node.get('#play');
    var b = document.getElementById('play');
    for (var i = 0; i < <?php echo($count); ?>; i++) {
        var el = document.createElement('div');
        el.id = 'drop_' + i;
        el.className = 'drop';
        el.innerHTML = 'Drop on Me (#' + i + ')';
        b.appendChild(el);
        
        var drop = new Y.DD.Drop( {
            node: el,
            groups: [((i % 2) ? 'two' : 'one')]//,
            //padding: '2 4 6 8'
        });
        
        drop.on('drop:enter', function(ev) {
            //Y.log('drop:enter :: ', this.get('node').get('id'));
        });
        drop.on('drop:over', function() {
            //Y.log('drop:over :: ', this.get('node').get('id'));
        });
        drop.on('drop:exit', function() {
            //Y.log('drop:exit :: ', this.get('node').get('id'));
        });
        drop.on('drop:hit', function(e) {
            console.log('drop:hit :: Drag: ' + e.drag.get('node').get('id') + ' ::: Drop: ' + this.get('node').get('id'), e);
            if (e.drag.get('data')) {
                console.log('Payload: ', e.drag.get('data'));
            }
        });
        
    }
        
  
});


/* {{{ OLD DD Code
(function() {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event;

    Event.onDOMReady(function() {
        var dd = new YAHOO.Drag('drag');
        var dd2 = new YAHOO.Drag('drag2');
        var dd3 = new YAHOO.Drop('anim_drop');

        new YAHOO.Drop('fixed');

        var b = Dom.get('play');
        for (var i = 0; i < <?php echo($count); ?>; i++) {
            el = document.createElement('div');
            el.id = Dom.generateId();
            el.className = 'drop';
            el.innerHTML = 'Drop on Me';
            b.appendChild(el);
            new YAHOO.Drop(el);
        }

        <?php
        if ($_GET['anim']) {
        ?>
        var anim = new YAHOO.util.Anim('anim_drop', {
            left: {
                from: 0,
                to: 700
            }
        }, 10);
        anim.onTween.subscribe(function() {
            dd3.activateShim();
        });
        anim.onComplete.subscribe(function() {
            //Loop animation
            if (!dd3.overTarget) {
                anim.attributes.left.from = 0;
                anim.animate();
            }
        });
        anim.animate();
        dd3.onDragOver = function() {
            //mimic a pause..
            anim.attributes.left.from = parseInt(dd3.el.style.left, 10);
            anim.stop();
        };
        dd3.onDragOut = function() {
            anim.animate();
        };
        <?php
        }
        ?>
    });


})();
}}} */
</script>
</body>
</html>
<?php @include_once($_SERVER["DOCUMENT_ROOT"]."/wp-content/plugins/shortstat/inc.stats.php"); ?>
