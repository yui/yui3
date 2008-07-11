<?php
$count = (($_GET['count']) ? $_GET['count'] : 10);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: DragDrop</title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.1/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" href="http://blog.davglass.com/wp-content/themes/davglass/style.css" type="text/css">    
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        ul {
            margin-left: 20px;
        }
        ul li {
            list-style-type: disc;
            padding: 3px;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="index.php">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
        <h2>DragDrop Test Pages/Examples</h2>
        <ul>
            <li><a href="test.php">General Test Page</a></li>
            <li><a href="list.php">Lists Example</a></li>
            <li><a href="anim.php">Animated Drop Targets Example</a></li>
            <li><a href="portal.php">Portal Example</a></li>
        </ul>
    </div>
    <div id="ft">&nbsp;</div>
</div>

</body>
</html>
