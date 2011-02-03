<html>
	<head>
		<title>DD test case</title>
        <style>
.clear { clear:both; font-size:0; height:0; line-height:1px; margin:0; padding:0; }

.dragContainer { border: 2px solid blue; }

.container_wrapper { width: 300px; min-height: 100px; padding: 10px;float: left;  border:2px solid #000; margin: 10px 0 0 10px; }

.drag { display: block; background: #EFEFEF; border: 2px solid red; font-weight: bold; margin-bottom: 5px; height: 50px; }
   .drag h3 { margin: 0; background: #ddd; padding: 1px; cursor: move; }
        
        </style>
	</head>
	<body>
    <h1>Yui3 D&D Test</h1>
    <div class="dragContainer">
       <div class="container_wrapper" id="container_one">
          <div id="draggableStuff1" class="drag"><h3>Drag me!</h3></div>
          <div id="draggableStuff2" class="drag"><h3>Drag me!</h3></div>
          <div id="draggableStuff3" class="drag"><h3>Drag me!</h3></div>
       </div>
       <div class="container_wrapper" id="container_two">
          <div id="draggableStuff4" class="drag"><h3>Drag me!</h3></div>
          <div id="draggableStuff5" class="drag"><h3>Drag me!</h3></div>
       </div>
       <div class="clear"></div>
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
	<script type="text/javascript">
        YUI().use('dd-drag', 'dd-drop', function(Y) {
           var del = new Y.DD.Delegate({
              container: '.dragContainer', //The common container
              nodes: '.drag' //The items to make draggable
           });

           del.on('drag:end', function(e) {
                e.target._prevEndFn(e);
           });
        });
    
	</script>
	</body>
</html>
