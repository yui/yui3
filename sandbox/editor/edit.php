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
            width: 550px;
            border: 3px solid red;
            margin: 1em;
            position: absolute;
            top: 100px;
            left: 100px;
        }
        #test {
            height: 260px;
            width: 550px;
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
        <button value="addclass">AddClass</button>
        <button value="removeclass">RemoveClass</button>
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
.foo {
    text-decoration: underline overline;
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

<script type="text/javascript" src="js/editor-base.js?bust=<?php echo(mktime()); ?>"></script>
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

YUI(yConfig).use('node', 'selector-css3', 'base', 'editor-base', 'frame', 'substitute', 'exec-command', function(Y) {
    //console.log(Y, Y.id);

    Y.delegate('click', function(e) {
        e.target.toggleClass('selected');
        var cmd = e.target.get('innerHTML').toLowerCase(),
            val = '';
        switch (cmd) {
            case 'wrap':
                val = 'del';
                break;
            case 'addclass':
            case 'removeclass':
                val = 'foo';
                break;
            case 'insertimage':
                val = 'http://farm3.static.flickr.com/2723/4014885243_58772b8ff8_s_d.jpg';
                break;
            case 'inserthtml':
                val = ' <span style="color: red; background-color: blue;">Inserted Text (' + (new Date()).toString() + ')</span> ';
                break;
        }
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
        //console.info('Return: ', cmd, ' :: ', ex_return);
    }, '#test1 > div', 'button');


    var smilies = [
        null,
        ':)',
        ':(',
        ';)',
        ':D',
        ';;)',
        '>:D<',
        ':-/',
        ':x',
        ':">',
        ':P' 
    ];
    
    var updateButtons = function(tar) {
        var buttons = Y.all('#test1 button').removeClass('selected');
        buttons.each(function(v) {
            var val = v.get('value');
            if (tar.test(val + ', ' + val + ' *')) {
                v.addClass('selected');
            }
        });
    };

    var editor = new Y.EditorBase({
        //content: Y.one('#stub').get('innerHTML')
    });
    editor.on('nodeChange', function(e) {
        updateButtons(e.node);
    });
    editor.on('frame:ready', function() {
        Y.log('frame:ready, set content', 'info', 'editor');
        this.set('content', Y.one('#stub').get('innerHTML'));
    });
    editor.on('frame:keyup', function(e) {
        var inst = this.getInstance(),
            sel = new inst.Selection();
        
        if (sel.anchorNode) {
            var txt = sel.anchorNode.get('text');
            Y.each(smilies, function(v, k) {
                //Hackey, doesn't work on new line.
                if (txt.indexOf(' ' + v) !== -1) {
                    sel.replace(v, '<img src="smilies/' + k + '.gif">', sel.anchorTextNode);
                }
            });
        }
    });
    editor.render('#test');

/* {{{ OLD

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

    iframe.render('#test');

    var smilies = [
        null,
        ':)',
        ':(',
        ';)',
        ':D',
        ';;)',
        '>:D<',
        ':-/',
        ':x',
        ':">',
        ':P' 
    ];


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
                var txt = sel.anchorNode.get('text');
                Y.each(smilies, function(v, k) {
                    if (txt.indexOf(' ' + v) !== -1) {
                        sel.replace(v, '<img src="smilies/' + k + '.gif">', sel.anchorTextNode);
                    }
                });
            }
        });
    });

    Y.delegate('click', function(e) {
        e.target.toggleClass('selected');
        var cmd = e.target.get('innerHTML').toLowerCase(),
            val = '';
        switch (cmd) {
            case 'wrap':
                val = 'del';
                break;
            case 'addclass':
            case 'removeclass':
                val = 'foo';
                break;
            case 'insertimage':
                val = 'http://farm3.static.flickr.com/2723/4014885243_58772b8ff8_s_d.jpg';
                break;
            case 'inserthtml':
                val = ' <span style="color: red; background-color: blue;">Inserted Text (' + (new Date()).toString() + ')</span> ';
                break;
        }
        iframe.focus();
        var ex_return = iframe.execCommand(cmd, val);
        //console.info('Return: ', cmd, ' :: ', ex_return);
    }, '#test1 > div', 'button');
  }}} */  
});
</script>
</body>
</html>
