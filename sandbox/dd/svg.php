
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"> 
<html> 
<head> 
<meta http-equiv="content-type" content="text/html; charset=utf-8"> 
<style> 
/*Supplemental: CSS for the YUI distribution*/
#custom-doc { width: 95%; min-width: 950px; }
#mycanvas {
    width:500px;
    height:350px;
}
 
DIV {
    display:inline-block
}
BODY {
    background-color: #9aa
}
</style> 
</head>		
<body class="yui3-skin-sam"> 
<script type="text/javascript" src="http://yui.yahooapis.com/3.3.0/build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>
<!--script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script-->
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

<div id="mycanvas" style="overflow:visible;position:absolute;top:50px;left:100px;border:1px solid"></div> 
<script type="text/javascript">            
    YUI().use('dd-plugin',  function (Y) 
    {
        function getSVGNode(type, pe)
        {
            var node = document.createElementNS("http://www.w3.org/2000/svg", "svg:" + type),
                v = pe || "none";
            node.setAttribute("pointer-events", v);
            return node;
        }
 
        //Wrapper div because we cannot pass an svg node to DD
        var mydiv = document.createElement("div");
        document.getElementById("mycanvas").appendChild(mydiv);
        
        //SVG Outer element
        var svgGroup = getSVGNode("svg");
        svgGroup.setAttribute("width", 300);
        svgGroup.setAttribute("height", 300);
        svgGroup.style.pos
        mydiv.setAttribute("id", "mypath");
        mydiv.appendChild(svgGroup);
 
        //Add SVG Path
        var myPath = getSVGNode("path", "visiblePainted");
        myPath.setAttribute("stroke", "#ff0000");
        myPath.setAttribute("stroke-width", 5);
        myPath.setAttribute("stroke-opacity", 1);
        myPath.setAttribute("d", " m0, 0 L300, 300");
        svgGroup.appendChild(myPath);
        
        //Add drag to the outer-most div
        var mydrag = new Y.DD.Drag({
            node:"#mycanvas"
        });
 
        //Add drag to the svg path in the container div
        //Add drag to the path
        
        var mypathdrag = new Y.DD.Drag({
            node:"#mypath"
        }).addHandle('path');

        mypathdrag.on('drag:drag', function(e) {
            console.log(e);
            e.preventDefault();
        });

        
 
  });
</script> 
</body> 
</html> 

