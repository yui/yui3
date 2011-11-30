<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.6.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/files/yui/css/davglass.css" type="text/css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #davdoc {
            min-height: 2000px;
        }
        #drag h2 {
            cursor: text;
        }
        #drag, #drag2, #drag3, #drag4, #drag5, #drag6, #drag7, .drop {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
            /*overflow: hidden;*/
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
        #drag4 {
            cursor: ne-resize;
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
        #drag4.yui3-dd-dragging {
            opacity: .5;

        }
        .yui3-dd-proxy {
            background-color: red;
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

        .yui3-dd-drop-active {
            border-style: dotted;
        }
        .yui3-dd-drop-active-valid {
            border-color: blue;
        }
        .yui3-dd-drop-active-invalid {
            border-color: red;
        }
        .yui3-dd-drop-over {
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
        <div id="drag"><h2><strong>Drag</strong> Me</h2>
        <select name="wtf">
            <option>Test Select</option>
            <option selected>Test #2 Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
        </select>
        </div>
        <div id="drag2"><h2><strong>Drag</strong> <a href="#">Me II</a></h2></div>
        <div id="drag3"><h2 class="one">X</h2><h2 class="two">X</h2><h2 class="three">X</h2><h2 class="four">X</h2><br><br>Drag Me III</div>
        <button id="test">Test Programmatic Move</button><br>
        <div id="drag4Cont">
            <div id="drag4">Drag Me IV <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        </div>
        <div id="drag5">Drag Me V <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <div id="drag6">Drag Me VI <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <div id="drag7">Drag Me VII <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
        <button id="drag8">Drag 8</button><br>
        <iframe src="blank.htm" height="300" width="300"></iframe>
        <p>
        <select name="wtf">
            <option>Test Select</option>
            <option selected>Test #2 Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
            <option>Test Select</option>
        </select>
        </p>

    </div>
    <div id="ft">&nbsp;</div>
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

<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    //base: 'http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/',
    allowRollup: false,
    logExclude: {
        'yui': true,
        event: true,
        base: true,
        attribute: true,
        augment: true
    },
    throwFail: true,
    debug: false
};
var yConfig2 = {
    base: '../../build/',
    //base: 'http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'yui': true,
        //event: true,
        base: true,
        attribute: true,
        augment: true
    },
    throwFail: true,
    debug: false
};

YUI(yConfig).use('classnamemanager', 'event-synthetic', 'event-gestures', 'dd-ddm', 'dd-drag', 'dd-plugin', 'dd-proxy', 'dd-constrain', 'yui-throttle', 'drag-gestures', function(Y1) {
    Y1.DD.DDM._debugShim = true;
    //dd4 = Y1.Base.create(Y1.DD.Proxy, [Y1.DD.DragConstrained], {
    /*
    myDD = Y1.Base.build(Y1.DD.Proxy, [Y1.DD.DragConstrained]);
    console.log(myDD);
    dd4 = new myDD({
        node: '#drag4',
        constrain2node: '#drag4Cont',
        tickX: 25,
        tickY: 25,
        gutter: '5'
    });
    console.log(dd4);
    */
    /*
    var DOC_SCROLL_X = 0,
        DOC_SCROLL_Y = 0;
    
    Y1.get(window).on('scroll', function() {
        var doc = document;
        DOC_SCROLL_X = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        DOC_SCROLL_Y = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    });
    Y1.DOM.docScrollX = function(node) {
        return DOC_SCROLL_X;
    };

    Y1.DOM.docScrollY = function(node) {
        return DOC_SCROLL_Y;
    };
    */
    
    dd4 = new Y1.DD.Drag({
        node: '#drag4',
        useShim: false,
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
    
        //constrain2node: '#drag4Cont',
        //constrain2view: true,
        //gutter: '-15 20 15 -20'
        //gutter:  '-20',
        //stickX: true,
        //stickY: true
        foo: true
    });
    dd4.plug(Y1.Plugin.DDConstrained, {
        //tickX: 25,
        //tickY: 25,
        //cacheRegion: false,
        constrain2node: '#drag4Cont',
        gutter:  '-20'
    });
    
    dd4.on('drag:end', function() {
        if (dd4.proxy) {
            dd4.unplug(Y1.Plugin.DDProxy);
        } else {
            dd4.plug(Y1.Plugin.DDProxy);
        }
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
    
    dd5 = new Y1.DD.Drag({
        node: '#drag5'
    }).addInvalid('strong.no');
    dd5.plug(Y1.Plugin.DDProxy, {
        moveOnEnd: false,
        borderStyle: '3px solid orange'
    });
    //dd4.setHandle('#drag4Handle', true);

    dd6 = new Y1.DD.Drag({
        node: '#drag6',
        offsetNode: false
    }).plug(Y1.Plugin.DDProxy, {
        resizeFrame: false
    }).addInvalid('strong.no').on('drag:start', function() {
        this.get('dragNode').setStyles({
            height: '25px',
            width: '105px',
            color: 'white',
            backgroundColor: 'blue'
        }).set('innerHTML', 'Dragging Me!!')
    });
    dd7 = new Y1.DD.Drag({
        node: '#drag7',
        offsetNode: false,
        dragNode: '#drag7EL'
    }).plug(Y1.Plugin.DDProxy, {
        resizeFrame: false
    }).addInvalid('strong.no').on('drag:start', function() {
        this.deltaXY = [-10, -10];
    });
    
    var drag8 = Y1.one('#drag8').plug(Y1.Plugin.Drag);
    drag8.dd.removeInvalid('button');
    

});

YUI(yConfig2).use('classnamemanager', 'event-synthetic', 'event-gestures', 'dd-drop', 'dd-proxy', 'dd-plugin', 'dd-drop-plugin', 'yui-throttle','drag-gestures', function(Y) {
    
    //alert(navigator.userAgent);
//var Y = new YUI().use('dd-ddm', 'dd-drag');
//Y.on('event:ready', function() {
    Y.DD.DDM._debugShim = true;
    //Y.DD.DDM.set('dragMode', 'strict');
    //Y.DD.DDM.useHash = false;
    //Y.DD.DDM.mode = Y.DD.DDM.INTERSECT;
    //Y.DD.DDM = null;
    
    Y.DD.DDM.set('throttleTime', 50);

    Y.DD.DDM.on('drop:over', function(e) {
        //console.log('DDM:drop:over :: ', arguments);
    });
    
    Y.DD.DDM.on('drag:drag', function(e) {
        //console.log('DDM:drag:drag :: ', e);
    });
    Y.DD.DDM.on('drag:dropmiss', function(e) {
        //console.log('DDM:drag:dropmiss :: ', e);
    });
    //Y.DD.DDM.set('multiDrop', false);

/* //Event Hijacking
    Y.Event._nativeAdd = Y.Event.nativeAdd;
    Y.Event.nativeAdd = function(el, type, fn, capture) {
        this._nativeAdd.apply(this, arguments);
        var fn2 = function() {
            console.log(arguments);
        };
        if (el.addEventListener) {
                el.addEventListener(type, fn2, !!capture);
        } else if (el.attachEvent) {
                el.attachEvent("on" + type, fn2);
        } 
    };
  */

    Y.DD.DDM.on('ddm:start', function(e) {
        console.log('DDM:start :: ', e);
    });
    Y.DD.DDM.on('drag:end', function(e) {
        console.log('DDM:end :: ', e);
    });
    
    Y.one('#drag').on('click', function() {
        console.log('Clicked', dd);
        if (dd) {
            dd.destroy();
            dd = null;
        }
    });

    dd = new Y.DD.Drag({
        node: '#drag',
        groups: ['one', 'three'],
        target: true,
        dragMode: 'intersect',
        handles: [Y.one('#drag h2')],
        //bubbles: false,
        //dragMode: 'strict',
        data: {
            one: 'This is my data object',
            two: 'This is my data object',
            three: 'This is my data object'
        }
    });

    //dd.on('drag', console.log);

    dd.on('drag:end', function(e) {
        console.log('drag:end: ', e);
        e.preventDefault();
    });
    
    //}).addHandle('h2');
    
    /*
    dd.on('drag:start', function() {
        console.log('start-event: ', (new Date()).getTime());        
    });
    dd.on('drag:drag', function() {
        console.log('drag-event: ', (new Date()).getTime());        
    });
    
    dd.on('drag:drag', function(e) {
        console.log('drag-event: ', e.pageX);
        if (e.pageX > 250) {
            e.preventDefault();
        }
    });
    */
    //}).addHandle('h2')._bubbles.beforeMouseDown.subscribe('drag:beforeMouseDown', function(e) {
    /*
    dd.on('drag:mouseDown', function(e) {
        Y.log('mouseDown:: ', arguments);
        e.halt();
        Y.log('mouseDown Event stopped');
    });

    
    dd.on('drag:start', function(e) {
    //dd.on('drag:mouseDown', function(e) {
        dd.addToGroup('two');
    });
    */
    
    Y.one('document').on('keypress', function(e) {
        if ((e.keyCode === 27) || (e.charCode === 27)) {
            if (Y.DD.DDM.activeDrag) {
                //console.info('DD is dragging, stop it..');
                Y.DD.DDM.activeDrag.stopDrag();
            }
        }
    });
    
    /*
    dd.on('drag:enter', function() {
        //Y.log('drag:enter', arguments);
    });
    
    dd.on('drag:over', function() {
        //Y.log('drag:over', arguments);
    });
    
    dd.on('drag:exit', function() {
        //Y.log('drag:exit', arguments);
    });
    */

    Y.DD.DDM.on('drag:drophit', function(e) {
        console.log('drag:drophit :: ' + e.drop.get('node').get('id'), e);
    });
    
    Y.DD.DDM.on('drag:dropmiss', function() {
        console.log('drag:dropmiss', arguments);
    });

    //dd.destroy();
    //console.log(dd);
    
    
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


    
    dd3 = Y.one('#drag3');
    dd3.plug(Y.Plugin.Drag, {
        groups: ['one', 'three'],
        dragMode: 'intersect',
        handles: [Y.all('#drag3 h2')],
        startCentered: true
    });
    dd3.dd.plug(Y.Plugin.DDProxy, {});
    //dd3.dd.addHandle('h2.one').addHandle('h2.two').removeHandle('h2.one').addHandle('h2.three').addHandle('h2.four');
    dd3.dd.addInvalid('h2.one');
    dd3.dd.after('drag:start', function(e) {
        this.get('dragNode').setStyles({
            width: '50px',
            height: '50px'
        });
    });

    

/*
    dd3.dd.on('activeHandle', function(e) {
        console.log('activeHandle::halt');
        e.halt();
    });
*/
    
    /*
    dd3 = new Y.DD.Drag({
        node: '#drag3'//,
        //move: false
    //}).addHandle('h2');
    //}).addHandle('h2').addInvalid('h2.two');
    }).addHandle('h2.one').addHandle('h2.two').removeHandle('h2.one').addHandle('h2.three').addHandle('h2.four');
    dd3.on('drag:drophit', function(e) {
        //console.log('drag:drophit :: ' + e.drop.get('node').get('id'), e);
    });
    */
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
    
    Y.one('#test').on('click', function() {
        Y.DD.DDM._noShim = true;
        Y.log('_setStartPosition:', 'info', 'Dav Test');
        dd.set('activeHandle', dd.get('node'));
        dd._setStartPosition(dd.get('node').getXY());
        Y.log('DDM::activeDrag:', 'info', 'Dav Test');
        Y.DD.DDM.activeDrag = dd;
        Y.log('dd.start():', 'info', 'Dav Test');
        dd.start();
        for (var i = 0; i < 726; i++) {
            //Y.log('moveNode([' + i + ', 129]):', 'info', 'Dav Test');
            Y.DD.DDM._move({ pageX: i, pageY: 129});
        }
        Y.log('end', 'info', 'Dav Test');
        dd.end();
        Y.log('_handleMouseUp():', 'info', 'Dav Test');
        dd._handleMouseUp();
        Y.DD.DDM._noShim = false;
    });

    
    //var b = Y.Node.get('#play');
    var b = document.getElementById('play');
    for (var i = 0; i < <?php echo($count); ?>; i++) {
        var el = document.createElement('div');
        el.id = 'drop_' + i;
        el.className = 'drop';
        el.innerHTML = 'Drop on Me (#' + i + ')';
        b.appendChild(el);
        
        var start = (new Date()).getTime();
        var drop = new Y.DD.Drop( {
            zIndex: i,
            node: el,
            groups: [((i % 2) ? 'two' : 'one')]
            //lock: ((i % 2) ? true : false)//,
            //padding: '0'
        });
        var end = (new Date()).getTime();
        //console.log(i, ': ', (end - start));
        /*
        drop.on('drop:enter', function(ev) {
            //Y.log('drop:enter :: ', this.get('node').get('id'));
        });
        drop.on('drop:over', function() {
            //Y.log('drop:over :: ', this.get('node').get('id'));
        });
        drop.on('drop:exit', function() {
            //Y.log('drop:exit :: ', this.get('node').get('id'));
        });
        */
        drop.on('drop:hit', function(e) {
            console.log('drop:hit :: Drag: ' + e.drag.get('node').get('id') + ' ::: Drop: ' + this.get('node').get('id'), e);
            if (e.drag.get('data')) {
                //console.log('Payload: ', e.drag.get('data'));
            }
        });
        
        
    }
        
    
    localStorage.clear();
});
</script>
</body>
</html>
