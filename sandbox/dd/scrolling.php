<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.3.0/build/reset-fonts-grids/reset-fonts-grids.css"> 
        <link rel="stylesheet" type="text/css" href="../yui-dev/build/assets/skins/sam/logger.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/wp-content/themes/davglass/style.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="http://us.js2.yimg.com/us.js.yimg.com/i/ydn/yuiweb/css/dpsyntax-min-11.css">
    <!--link rel="stylesheet" type="text/css" href="dd.css"-->
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #davdoc {
            min-height: 2000px;
            width: 3000px;
        }
        #drag, #drag2, #drag3, #drag4, #drag5, #drag6, #drag7, .drop, #anim_drop {
            height: 75px;
            width: 75px;
            border: 1px solid black;
            z-index: 1;
            text-align: center;
        }
        #bd {
            position: relative;
        }
        #drag4 {
            position: relative;
            top: 3px;
            left: 3px;
        }
        #drag4Cont {
            border: 1px solid black;
            height: 400px;
            width: 400px;
            overflow: auto;
        }
        #wrap {
            height: 900px;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <!--div id="drag4Cont">
            <div id="wrap"-->
                <div id="drag4">Drag Me IV <strong class="no">NO</strong><br><strong class="yes">Yes</strong></div>
            <!--/div>
        </div-->

    </div>
    <div id="ft">&nbsp;</div>
</div>
    <script type="text/javascript" src="../3.x/build/yui/yui.js"></script>

    <!-- needed until built into a module -->
    <script type="text/javascript" src="../3.x/util/yui/src/js/State.js"></script>
    <script type="text/javascript" src="../3.x/build/attribute/attribute.js"></script>
    <script type="text/javascript" src="../3.x/build/base/base.js"></script>

    <!-- needed until new node.js is built into yui.js -->
    <script type="text/javascript" src="../3.x/build/node/node.js"></script>

    <script type="text/javascript" src="ddm-base.js"></script>
    <script type="text/javascript" src="ddm.js"></script>
    <script type="text/javascript" src="ddm-drop.js"></script>
    <script type="text/javascript" src="drag.js"></script>
    <script type="text/javascript" src="drop.js"></script>
    <script type="text/javascript" src="proxy.js"></script>
    <script type="text/javascript" src="constrain.js"></script>
    <script type="text/javascript" src="scroll.js"></script>

<script type="text/javascript">
var yConfig = {
    logExclude: {
        'YUI': true,
        Event: true,
        Base: true,
        Attribute: true
    } 
};
var yConfig2 = {};
YUI().mix(yConfig2, yConfig);

//var Y1 = new YUI().use('dd-drag', 'dd-proxy');
var Y1 = new YUI(yConfig).use('dd-ddm', 'dd-drag', 'dd-scroll');

Y1.on('event:ready', function() {

    Y1.DD.DDM._debugShim = true;

    dd4 = new Y1.DD.DragScroll({
        node: '#drag4',
        windowScroll: true
    });

});


</script>
</body>
</html>
<?php @include_once($_SERVER["DOCUMENT_ROOT"]."/wp-content/plugins/shortstat/inc.stats.php"); ?>
