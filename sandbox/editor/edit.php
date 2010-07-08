<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor</title>
    <style type="text/css" media="screen">
        p, h2 {
            margin: 1em;
        }
        #test1 {
            height: 355px;
            border: 3px solid red;
            width: 740px;
            margin: 1em;
            position: absolute;
            top: 100px;
            left: 100px;
        }
        #test {
            height: 260px;
            width: 550px;
            border-top: 3px solid red;
            float: left;
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
        #test_render {
            position: absolute;
            top: 500px;
        }
	</style>
</head>
<body class="yui-skin-sam">

<h1 tabindex="1">Editor Testing</h1>

<div id="test1" role="widget">
    <div role="toolbar">
        <select id="fontname">
            <option selected> </option>
            <option>Arial</option>
            <option>Arial Black</option>
            <option>Comic Sans MS</option>
            <option>Courier New</option>
            <option>Lucida Console</option>
            <option>Tahoma</option>
            <option>Times New Roman</option>
            <option>Trebuchet MS</option>
            <option>Verdana</option>
        </select>
        <select id="fontsize">
            <option selected> </option>
            <option value="1">10</option>
            <option value="2">13</option>
            <option value="3">16</option>
            <option value="4">18</option>
            <option value="5">24</option>
            <option value="6">32</option>
            <option value="7">48</option>
        </select>
        <button value="bold">Bold</button>
        <button value="italic">Italic</button>
        <button value="underline">Underline</button>
        <button value="foo">Foo</button>
        <button value="img">InsertImage</button>
        <button value="wrap">Wrap</button>
        <button value="inserthtml">InsertHTML</button>
        <button value="addclass">AddClass</button>
        <button value="removeclass">RemoveClass</button>
        <button value="bidi">BiDi</button>
        <button value="indent">Indent</button>
        <button value="outdent">Outdent</button>
        <button value="insertorderedlist">InsertOrderedList</button>
        <button value="insertunorderedlist">InsertUnOrderedList</button>
        <button value="createlink">createlink</button>
        <button value="inserthorizontalrule">inserthorizontalrule</button>
        <button value="backcolor">backcolor</button>
        <button value="forecolor">forecolor</button>
        <button value="justifycenter">justifycenter</button>
        <button value="justifyleft">justifyleft</button>
        <button value="justifyright">justifyright</button>
        <button value="justifyfull">justifyfull</button>
        <button value="replacecontent">ReplaceContent</button>
    </div>
    <div id="test"></div>
    <div id="smilies"></div>
</div>

<button id="getHTML">Get HTML</button>
<button id="setHTML">Set HTML</button>
<button id="focusEditor">Focus Editor</button>

<div id="stub">
</div>
<!--p><b>This is a <u>test. <i>This is</i> another</u> test.</b></p>
This is some <strong>other</strong> loose test.
<p>This <strong>is</strong> <font face="Courier New">another</font> test.</p>
<ul>
    <li style="font-family: courier new">Item #1</li>
    <li>Item #1</li>
    <li>Item #1</li>
</ul>
<div><hr>This is some loose test.</div>
<ol>
    <li class="davglass" style="font-family: courier new">Item #1</li>
    <li>Item #1</li>
    <li><a href="http://yuilibrary.com/">Item #1</a></li>
</ol>
<p>This is <span style="font-family: Courier New">another</span> test.</p>
This is some more loose test.
<p><b>This is a <u>test. <i>This is</i> another</u> test.</b></p>
This is some more loose test.
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
This is some more loose test.
</div-->

<!--script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script-->
<script type="text/javascript" src="http://yui.yahooapis.com/3.1.0/build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>


<script type="text/javascript" src="js/editor-base.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/frame.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/exec-command.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/selection.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/lists.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/editor-tab.js?bust=<?php echo(mktime()); ?>"></script>
<script type="text/javascript" src="js/createlink-base.js?bust=<?php echo(mktime()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: true,
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

YUI(yConfig).use('node', 'selector-css3', 'base', 'editor-base', 'frame', 'substitute', 'exec-command', 'editor-lists', 'createlink-base', 'editor-tab', function(Y) {
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
            case 'backcolor':
                val = '#33CC99';
                break;
            case 'forecolor':
                val = '#0000FF';
                break;
        }
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
        //console.info('Return: ', cmd, ' :: ', ex_return);
    }, '#test1 > div', 'button');

    Y.delegate('change', function(e) {
        //console.log(e);
        var cmd = e.currentTarget.get('id'),
            val = e.currentTarget.get('value');
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
    }, '#test1 > div', 'select');


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
    
    var s_cont = Y.one('#smilies');
    Y.each(smilies, function(v, k) {
        if (v) {
            s_cont.append('<img src="smilies/' + k + '.gif" alt="Click to insert">');
        }
    });
    s_cont.delegate('click', function(e) {
        var img = e.currentTarget;
        editor.focus();
        editor.execCommand('inserthtml', '<span>&nbsp;<img src="' + img.get('src') + '">&nbsp;</span>');
    }, 'img');
    
    var buttons = Y.all('#test1 button');
    var f_options = Y.all('#fontname option');
    var s_options = Y.all('#fontsize option');

    var updateButtons = function(e) {
        //console.log(e);
        var tar = e.changedNode;
        if (tar) {
            var cmds = e.commands;

            buttons.removeClass('selected');
            buttons.each(function(v) {
                if (cmds[v.get('value')]) {
                    v.addClass('selected');
                }
            });
            
            var fname = e.fontFamily,
            size = e.fontSize;
            f_options.item(0).set('selected', true);
            f_options.each(function(v) {
                var val = v.get('value').toLowerCase();
                if (val === fname.toLowerCase()) {
                    v.set('selected', true);
                }
            });
            s_options.item(0).set('selected', true);
            size = size.replace('px', '');
            s_options.each(function(v) {
                var val = v.get('value').toLowerCase(),
                    txt = v.get('text');
                if (size === txt) {
                    v.set('selected', true);
                }
            });
        }
    };

    //Mixin the new commands
    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
        foo: function() {
            alert('You clicked on Foo');
        },
        replacecontent: function() {
            var inst = this.getInstance(),
                sel = new inst.Selection();

            sel.setCursor();
            var html = this.get('host').get('content');
            html = '<div><p>Added From Selection Cache Test.</p>' + html + '</div>';
            this.get('host').set('content', html);
            var cur = sel.focusCursor();
        }
    });


    editor = new Y.EditorBase({
        content: Y.one('#stub').get('innerHTML'),
        extracss: 'body { color: red; }'
    });
    editor.after('nodeChange', function(e) {
        if (e.changedType !== 'execcommand') {
            updateButtons(e);
        }
        
        if (e.changedType === 'keyup') {
            if (e.changedNode) {
                var txt = e.changedNode.get('text');
                Y.each(smilies, function(v, k) {
                    //Hackey, doesn't work on new line.
                    if (txt.indexOf(' ' + v) !== -1) {
                        e.selection.replace(v, '<span>&nbsp;<img src="smilies/' + k + '.gif">&nbsp;</span>');
                    }
                });
            }
        }
        
    });
    //Disabled for IE testing..
    //editor.plug(Y.Plugin.EditorLists);
    editor.plug(Y.Plugin.EditorTab);
    editor.on('frame:ready', function() {
        Y.log('frame:ready, set content', 'info', 'editor');

        //This stops image resizes, but for all images!!
        //editor.execCommand('enableObjectResizing', false);
        //this.set('content', Y.one('#stub').get('innerHTML'));
        editor.frame.on('keydown', function(e) {
            if (e.charCode == 83 && (e.ctrlKey || e.metaKey)) {
                e.halt();
            }
        });
    });
    /*
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
    */
    editor.render('#test');
    

    Y.on('click', function(e) {
        var html = editor.getContent();
        console.log(html);
    }, '#getHTML');

    Y.on('click', function(e) {
        editor.set('content', '<p>This is a test: ' + (new Date()) + '</p>');
    }, '#setHTML');

    Y.on('click', function(e) {
        editor.focus(true);
    }, '#focusEditor');

});

</script>
</body>
</html>
