<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: </title>
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.1/build/reset-fonts-grids/reset-fonts-grids.css"> 
    <link rel="stylesheet" type="text/css" href="http://yui.yahooapis.com/2.5.1/build/assets/skins/sam/skin.css">     
    <link rel="stylesheet" href="http://blog.davglass.com/wp-content/themes/davglass/style.css" type="text/css">
    <link rel="stylesheet" type="text/css" href="http://developer.yahoo.com/yui/assets/dpSyntaxHighlighter.css">
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #comp, #mods {
            width: 175px;
            padding-left: 20px;
            margin: 2em;
            float: left;
        }
        #comp li, #mods li {
            list-style-type: circle;
        }
        #chart {
            margin: 2em;
        }
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: </a></h1></div>
    <div id="bd">
        <div>File Type: <select id="fileType">
            <option value="min" selected> Min </option>
            <option value="full"> Full </option>
            <option value="debug"> Debug </option>
        </select></div>
        <ul id="comp">
        </ul>
        <ul id="mods">
        </ul>
        <div id="chart"></div>
        <div id="total"></div>
    </div>
    <div id="ft">&nbsp;</div>
</div>
<script type="text/javascript" src="../3.x/build/yui/yui-min.js"></script> 

<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/utilities/utilities.js"></script> 
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/selector/selector-beta-min.js"></script>
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/json/json-min.js"></script> 
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/datasource/datasource-beta-min.js"></script> 
<script type="text/javascript" src="http://yui.yahooapis.com/2.5.2/build/charts/charts-experimental-min.js"></script> 


<script src="http://developer.yahoo.com/yui/assets/dpSyntaxHighlighter.js"></script>
<script type="text/javascript" src="../js/toolseffects-min.js"></script>
<script type="text/javascript" src="../js/davglass.js"></script>
<script type="text/javascript" src="data.js"></script>
<script type="text/javascript" src="config.js"></script>
</body>
</html>
<?php @include_once($_SERVER["DOCUMENT_ROOT"]."/wp-content/plugins/shortstat/inc.stats.php"); ?>
