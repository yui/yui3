<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #test1 {
            height: 300px;
            width: 500px;
            border: 3px solid red;
            margin: 1em;
            position: absolute;
            top: 100px;
            left: 100px;
        }
        #test {
            height: 260px;
            width: 500px;
            border-top: 3px solid red;
        }
        #test1 button {
            background-color: #ccc;
        }
        #test1 button.selected {
            background-color: green;
        }
        #stub {
            display: none;
        }
        #out {
            position: absolute;
            top: 5px;
            right: 5px;
            width: 200px;
            border: 1px solid black;
            font-size: 10px;
        }

        #out p {
            margin: 0;
        }
	</style>
</head>
<body class="yui-skin-sam">

<div id="out"></div>

<h1 tabindex="1">Editor Testing</h1>

<div id="test1" role="widget">
    <div role="toolbar">
        <button value="b">Bold</button>
        <button value="i">Italic</button>
        <button value="u">Underline</button>
        <button value="foo">Foo</button>
        <button value="img">InsertImage</button>
        <button value="wrap">Wrap</button>
        <button value="inserthtml">InsertHTML</button>
    </div>
    <div id="test"></div>
</div>

<div id="stub">
<style>
del {
    background-color: yellow;
    font-weight: bold;
    color: black;
}
</style>
<p><b>This is a <u>test. <i>This is</i> another</u> test.</b></p>
<p>This <strong>is</strong> <font face="Courier New">another</font> test.</p>
<ul>
    <li style="font-family: courier">Item #1</li>
    <li>Item #1</li>
    <li>Item #1</li>
</ul>
<p>This is <span style="font-family: courier">another</span> test.</p>
<p><b>This is a <u>test. <i>This is</i> another</u> test.</b></p>
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/frame.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/exec-command.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/selection.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: true,
    //base: '../../build/',
    filter: 'DEBUG',
    allowRollup: false,
    logExclude: {
        'yui': true,
        'event': true,
        base: true,
        attribute: true,
        augment: true,
        get: true,
        loader: true,
        Selector: true//,
        //frame: true
    },
    throwFail: true
};

YUI(yConfig).use('node', 'selector-css3', 'base', 'frame', 'substitute', 'exec-command', function(Y) {
    //console.log(Y, Y.id);

    var out = function(str) {
        Y.one('#out').prepend('<p>' + str + '</p>');
    };

    var iframe = new Y.Frame({
        designMode: true,
        content: Y.one('#stub').get('innerHTML'),
        use: ['node','selector-css3', 'selection', 'stylesheet']
    }).plug(Y.Plugin.ExecCommand);

    iframe.on('ready', function() {
        var inst = this.getInstance();
        inst.Selection.filter();
    });

    Y.Plugin.ExecCommand.COMMANDS.foo = function() {
        alert('You clicked on Foo');
    };
    Y.Plugin.ExecCommand.COMMANDS.wrap = function() {
        var inst = this.getInstance();
        var sel = new inst.Selection();
        sel.wrapContent('del');
    };
    Y.Plugin.ExecCommand.COMMANDS.inserthtml = function() {
        //alert('You clicked on insertimage');
        var inst = this.getInstance();
        var sel = new inst.Selection();
        var html = ' <span style="color: red; background-color: blue;">Inserted Text (' + (new Date()).toString() + ')</span> ';
        sel.insertContent(html);
    };
    Y.Plugin.ExecCommand.COMMANDS.insertimage = function() {
        //alert('You clicked on insertimage');
        var host = this.get('host');
        //Using the private methods because we are an override..
        host._execCommand('insertimage', 'http://farm3.static.flickr.com/2723/4014885243_58772b8ff8_s_d.jpg');
    };

    iframe.render('#test');


    var updateButtons = function(tar) {
        var buttons = Y.all('#test1 button').removeClass('selected');
        buttons.each(function(v) {
            var val = v.get('value');
            if (tar.test(val + ', ' + val + ' *')) {
                v.addClass('selected');
            }
        });
    };

    iframe.after('ready', function() {
        var inst = this.getInstance();

        out('frame1: ' + Y.all('p'));

        this.on('mousedown', function(e) {
            var tar = e.frameTarget;
            updateButtons(tar);
        });

        this.on('keyup', function(e) {
            //console.log(e);
            var sel = new inst.Selection();
            if (sel.anchorNode) {
                updateButtons(sel.anchorNode);
            }

            /* Cursor Position Test.. Opera fails this..
            var sel = new inst.Selection();
            //console.log(sel);
            Y.one('h1').focus();
            Y.later(2000, null, function() {
                //console.log('setting cursor position..');
                iframe.focus();
                sel.setCursor();
            });
            */
        });
    });

    Y.delegate('click', function(e) {
        e.target.toggleClass('selected');
        var val = e.target.get('innerHTML').toLowerCase();
        iframe.focus();
        iframe.execCommand(val);
    }, '#test1 > div', 'button');
    
});
</script>
</body>
</html>
