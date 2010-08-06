<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #test1 {
            height: 100px;
            width: 740px;
            margin: 1em;
            position: absolute;
            top: 100px;
            left: 100px;
            border: 1px solid black;
        }
        #test {
            height: 75px;
            width: 550px;
            border: 1px solid black;
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
        #smilies {
            width: 180px;
            height: 260px;
            border-top: 3px solid red;
            border-left: 3px solid red;
            float: right;
        }

        #smilies img {
            cursor: pointer;
            margin: 5px;
        }
	</style>
</head>
<body class="yui-skin-sam">

<h1 tabindex="1">Messenger Editor Testing</h1>

<div id="test1" role="widget">
    <div role="toolbar">
        <button value="b">Bold</button>
        <button value="i">Italic</button>
        <button value="u">Underline</button>
        <button value="bidi">BiDi</button>
    </div>
    <div id="test"></div>
</div>


<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript" src="js/editor-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/frame.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/exec-command.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/selection.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/editor-bidi.js?bust=<?php echo(mktime()); ?>"></script>

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

YUI(yConfig).use('node', 'selector-css3', 'base', 'editor-base', 'frame', 'substitute', 'exec-command', 'editor-bidi', function(Y) {
    //console.log(Y, Y.id);

    Y.delegate('click', function(e) {
        e.target.toggleClass('selected');
        var cmd = e.target.get('innerHTML').toLowerCase(),
            val = '';
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
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
        content: ''
    });
    editor.plug(Y.Plugin.EditorBidi);
    editor.on('nodeChange', function(e) {
        updateButtons(e.changedNode);
    });
    editor.on('frame:ready', function() {
        Y.log('frame:ready, set content', 'info', 'editor');
        editor.focus();
    });
    editor.on('frame:keydown', function(e) {
        if (e.keyCode === 13) {
            Y.log('Stopping Return', 'info', 'editor');
            e.frameEvent.halt();
            var inst = editor.getInstance();
            inst.all('br').remove(); //Remove the BR
            var html = editor.getContent();
            editor.set('content', '');
            //alert('Send: ' + html);
            editor.focus();
        }
    });
    editor.on('frame:keyup', function(e) {
        var inst = this.getInstance(),
            sel = new inst.Selection();

        if (sel.anchorNode) {
            var txt = sel.anchorNode.get('text');
            Y.each(smilies, function(v, k) {
                //Hackey, doesn't work on new line.
                if (txt.indexOf(' ' + v) !== -1) {
                    sel.replace(v, '<span>&nbsp;<img src="smilies/' + k + '.gif">&nbsp;</span>', sel.anchorTextNode);
                }
            });
        }
    });
    editor.render('#test');

});
</script>
</body>
</html>
