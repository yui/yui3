<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
	<head>
		<style type="text/css">
			#one{
				background-color: yellow;
				top: 30px;
				width: 140px;
				height: 80px;
				padding: 10px;
			}
			#two{
				width: 140px;
				height: 80px;				
				background-color: green;
				padding: 10px;
			}
			#dragme{
				background-color: white;
				border: 1px solid black;
				width: 80px;
			}
		</style>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/attribute/attribute-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/base/base-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event/event-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/event-custom/event-custom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/oop/oop-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/dom/dom-screen-debug.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="../../build/node/node-debug.js?bust=<?php echo(mktime()); ?>"></script>

<!--script src="http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/yui/yui-debug.js"></script-->


<script type="text/javascript" src="js/ddm-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/ddm-drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drag.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/drop.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/proxy.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/constrain.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-plugin.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/dd-drop-plugin.js?bust=<?php echo(mktime()); ?>"></script>
		<script type="text/javascript">
var yConfig = {
    base: '../../build/',
    filter: 'DEBUG',
    //base: 'http://yeshouseborn-lx.corp.yahoo.com/yui-clean/yui3/build/',
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
			YUI(yConfig).use('dd-drag', 'dd-drop', function(Y){
				new Y.DD.Drag({
						node: '#dragme',
						dragMode: "intersect"
					});
				new Y.DD.Drop({node: '#one'});
				new Y.DD.Drop({node: '#two'});
				
				Y.on("mousedown", console.log, '#dragme');
				Y.DD.DDM.on('drag:start', console.log);
				Y.DD.DDM.on('drag:enter', console.log);
			});
		</script>
	</head>
<body>
	<div id="one">
		<div id="dragme">	
			dragme
		</div>
	</div>
	<div id="two">
	</div>
</body>
</html>
