<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <title>YUI use all available modules</title>


    <script type="text/javascript" src="../../build/yui/yui-debug.js"></script>
    <script type="text/javascript" src="../../build/oop/oop.js"></script>
    <script type="text/javascript" src="../../build/event/event.js"></script>
    <script type="text/javascript" src="../../build/dom/dom.js"></script>
    <script type="text/javascript" src="../../build/node/node.js"></script>

<style>
    #demo {
        border: 1px solid black;
        background-color: #8DD5E7;
    }
    #demo strong {
        font-weight: bold;
    }
</style>
</head>
<body>

<div id="demo"></div>

<script>

YUI().use('*', function(Y) {
    var node = Y.get('#demo');
    var used = [];
    Y.each(Y.Env._attached, function(v, k) {
        used[used.length] = k;
    });
    used.sort();
    node.set('innerHTML', '<strong>Modules Loaded:</strong> ' + used.join(', '));
});
</script>
</body>
</html>
