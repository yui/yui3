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
	</style>
</head>
<body class="yui-skin-sam">
<div id="davdoc" class="yui-t7">
    <div id="hd"><h1 id="header"><a href="http://blog.davglass.com/">YUI: DragDrop 3.x</a></h1></div>
    <div id="bd">
    </div>
    <div id="ft">&nbsp;</div>
</div>

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

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

YUI(yConfig).use('base', function(Y) {
    
    var Test = function() {
        Test.superclass.constructor.apply(this, arguments);
    };

    Test.NAME = 'test';

    Test.ATTRS = {
        foo: {
            setter: function(n) {
                this._handleFoo(n);
                return n;
            }
        }
    };

    Y.extend(Test, Y.Base, {
        _handleFoo: function(o) {
            console.log('_handleFoo: ', o);
        }
    });
    
    //Should this fire _handleFoo since it's set in the inital config??
    var bar = new Test({
        foo: {
            bax: 1
        }
    });

});


</script>
</body>
</html>
<?php @include_once($_SERVER["DOCUMENT_ROOT"]."/wp-content/plugins/shortstat/inc.stats.php"); ?>
