<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/transitional.dtd">
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
        #test iframe {
            border: 1px solid blue;
        }
        #test {
            height: 260px;
            width: 550px;
            border-top: 3px solid red;
            float: left;
            padding: 5px;
            _background-color: orange;
        }
        #test1 a {
            padding: 5px;
            margin: 3px;
            display: inline-block;
            background-color: #ccc;
            font-size: 60%;
        }
        #test1 a.selected {
            background-color: green;
        }
        #stub {
            display: none;
        }
        #smilies {
            width: 175px;
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
        #board {
            position: absolute;
            top: 10px;
            right: 3px;
            width: 220px;
            border: 1px solid black;
            padding: .5em;
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
        <a href ="#" value="bold">Bold</a>
        <a href ="#" value="italic">Italic</a>
        <a href ="#" value="underline">Underline</a>
        <a href ="#" value="foo">Foo</a>
        <a href ="#" value="img">InsertImage</a>
        <a href ="#" value="wrap">Wrap</a>
        <a href ="#" value="inserthtml">InsertHTML</a>
        <a href ="#" value="addclass">AddClass</a>
        <a href ="#" value="removeclass">RemoveClass</a>
        <a href ="#" value="bidi">BiDi</a>
        <a href ="#" value="indent">Indent</a>
        <a href ="#" value="outdent">Outdent</a>
        <a href ="#" value="insertorderedlist">InsertOrderedList</a>
        <a href ="#" value="insertunorderedlist">InsertUnOrderedList</a>
        <a href ="#" value="createlink">createlink</a>
        <a href ="#" value="inserthorizontalrule">inserthorizontalrule</a>
        <a href ="#" value="nocolor">nocolor</a>
        <a href ="#" value="backcolor">backcolor</a>
        <a href ="#" value="forecolor">forecolor</a>
        <a href ="#" value="justifycenter">justifycenter</a>
        <a href ="#" value="justifyleft">justifyleft</a>
        <a href ="#" value="justifyright">justifyright</a>
        <a href ="#" value="justifyfull">justifyfull</a>
        <a href ="#" value="replacecontent">ReplaceContent</a>
        <a href ="#" value="insertbr">InsertBR</a>
    </div>
    <div id="test"></div>
    <div id="smilies"></div>
</div>

<input type="text">
<button id="getHTML">Get HTML</button>
<button id="setHTML">Set HTML</button>
<button id="focusEditor">Focus Editor</button>
<!--button id="showEditor">Show Editor</button-->
<div id="board">
    <b>This is bold</b><br><br>
    <strong>This is strong</strong><br><br>
    <span style="font-weight: bold">This is font-weight bold</span><br><br>
    <i>This is italic</i><br><br>
    <span style="font-style: italic">This is font-style italic</span><br><br>
    <u>This is underline</u><br><br>
    <span style="text-decoration: underline">This is text-decoration: underline</span><br><br>
    <span style="font-weight: bold; text-decoration: underline; font-style:italic;">This is a multi styled element.</span>
</div>

<div id="stub">
</div>
<!--
    <b>This is bold</b><br><br>
    <strong>This is strong</strong><br><br>
    <span style="font-weight: bold">This is font-weight bold</span><br><br>
    <i>This is italic</i><br><br>
    <span style="font-style: italic">This is font-style italic</span><br><br>
    <u>This is underline</u><br><br>
    <span style="text-decoration: underline">This is text-decoration: underline</span><br><br>
    <span style="font-weight: bold; text-decoration: underline; font-style:italic;">This is a multi styled element.</span>
<hr size="1">
<?php //include('mail.php'); ?>
    <ul>
        <li style="font-family: courier new">Item #1</li>
        <li>Item #1</li>
        <li>Item #1</li>
    </ul>
    <p>This is a test..</p>
    <div style="font-family: ; font-size: ;"><br>
        <div style="font-family: times new roman, new york, times, serif; font-size: 12pt;">
            <font size="2" face="Tahoma">
            <hr size="1">
            <b><span style="font-weight:bold;">From:</span></b> yahoo-account-services-us@cc.yahoo-inc.com<br>
            <b><span style="font-weight: bold;">To:</span></b> hb.stone@yahoo.com<br>
            <b><span style="font-weight: bold;">Cc:</span></b> <br>
            <b><span style="font-weight: bold;">Sent:</span></b> 2010-07-09 14:19:12<br>
            <b><span style="font-weight: bold;">Subject:</span></b> Verify this email address<br>
            </font><br>
            <div id=yiv759936264>
                <div style="direction:ltr;">
                    <img src="https://s.yimg.com/lq/i/brand/purplelogo/base/us.gif" vspace="10" hspace="20">
                    <hr noshade width="95%"> <br><br>
                    <table border="0" width="735">
                        <tbody>
                            <tr>
                                <td width="10%">&nbsp;</td>
                                <td width="80%">  <font size="+1" color="#631266" face="Arial">  <b>Verify this email address</b>  </font>  <br>  </td>
                                <td width="10%">&nbsp;</td>
                            </tr>
                            <tr>
                                <td colspan="3">&nbsp;</td>
                            </tr>
                        </tbody>
                    </table>
                    <hr noshade width="95%">
                    <table width="750">
                        <tbody>
                            <tr>
                                <td width="2.5%">&nbsp;</td>
                                <td>  <font face="Arial" size="-3"></font>  </td>
                            </tr>
                            <tr>
                                <td width="2.5%">&nbsp;</td>
                                <td>  <font face="Arial" size="-3"><p>Copyright © 2010 Yahoo! Inc. All rights reserved.<a rel="nofollow" target="_blank" href='http://docs.yahoo.com/info/copyright/copyright.html'>Copyright/IP Policy</a> | <a rel="nofollow" target="_blank" href='http://docs.yahoo.com/info/terms/'>Terms of Service</a></p>  <p>NOTICE: We collect personal information on this site. To learn more about how we use your information, see our <a rel="nofollow" target="_blank" href='http://privacy.yahoo.com/'>Privacy Policy</a>.</p><br>  </font>  </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div><br><br>
        </div>
    </div>
</div-->
<!--p><b>This is a <u>test. <i>This is</i> another</u> test.</b></p>
This is some <strong>other</strong> loose test.
<p>This <strong>is</strong> <font face="Courier New">another</font> test.</p>
<ul>
    <li style="font-family: courier new">Item #1</li>
    <li>Item #1</li>
    <li>Item #1</li>
</ul>
<hr>
<p>This <strong>is</strong> <font face="Courier New">another</font> test.</p>
<ul>
</div-->

<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(time()); ?>"></script>
<!--script type="text/javascript" src="http://yui.yahooapis.com/3.2.0/build/yui/yui-debug.js"></script-->


<script type="text/javascript" src="js/editor-base.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/frame.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/exec-command.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/selection.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/lists.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-tab.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/createlink-base.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-bidi.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-para.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-br.js?bust=<?php echo(time()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    //debug: false,
    //filter: 'RAW',
    debug: true,
    filter: 'debug',
    allowRollup: false,
    logExclude: {
        'yui': true,
        'event': true,
        base: true,
        attribute: true,
        augment: true,
        get: true,
        loader: true,
        Selector: true,
        selection: true
    },
    throwFail: true
};

YUI(yConfig).use('node', 'selector-css3', 'base', 'editor-base', 'editor-para', 'editor-br', 'frame', 'substitute', 'exec-command', 'editor-lists', 'createlink-base', 'editor-bidi', 'editor-lists', function(Y) {
    //console.log(Y, Y.id);

    var bCount = 0,
        bColors = [
            '#33CC99',
            'purple',
            'orange',
            'yellow'
        ];
    

    Y.delegate('click', function(e) {
        e.halt();
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
            case 'nocolor':
                cmd = 'backcolor';
                val = '#ffffff';
                break;
            case 'backcolor':
            case 'forecolor':
                val = bColors[bCount];
                if (bCount === (bColors.length - 1)) {
                    bCount = 0;
                } else {
                    bCount++;
                }
                break;
        }
        editor.focus(function() {
            editor.execCommand(cmd, val);
        });
    }, '#test1 > div', 'a');

    Y.on('change', function(e) {
        var cmd = e.currentTarget.get('id'),
            val = e.currentTarget.get('value');

        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
    }, '#fontsize');

    Y.on('change', function(e) {
        var cmd = e.currentTarget.get('id'),
            val = e.currentTarget.get('value');

        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
    }, '#fontname');


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
        var img = e.currentTarget, inst = editor.getInstance();
        editor.focus(function() {
            editor.execCommand('inserthtml', '<img src="' + img.get('src') + '">');
        });
        /*
        editor.focus(function() {
            editor.execCommand('insertandfocus', '<span>:)</span>');
        });
        e.halt();
        */
    }, 'img');

    var buttons = Y.all('#test1 a');
    var f_options = Y.all('#fontname option');
    var s_options = Y.all('#fontsize option');

    var updateButtons = function(e) {
        //console.log(e);
        var tar = e.changedNode;
        if (tar) {
            var cmds = e.commands;

            buttons.removeClass('selected');
            buttons.each(function(v) {
                if (cmds[v.get('innerHTML').toLowerCase()]) {
                    v.addClass('selected');
                }
            });

            var fname = e.fontFamily,
            size = e.fontSize;
            f_options.item(0).set('selected', true);
            if (fname) {
                f_options.each(function(v) {
                    var val = v.get('value').toLowerCase();
                    if (val === fname.toLowerCase()) {
                        v.set('selected', true);
                    }
                });
            }
            s_options.item(0).set('selected', true);
            if (size) {
                size = size.replace('px', '');
                s_options.each(function(v) {
                    var val = v.get('value').toLowerCase(),
                        txt = v.get('text');
                    if (size === txt) {
                        v.set('selected', true);
                    }
                });
            }
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
        //defaultblock: 'div',
        /*
        linkedcss: [
            'http://yui.yahooapis.com/2.8.1/build/reset/reset.css',
            'http://yui.yahooapis.com/2.8.1/build/fonts/fonts.css',
            'http://yui.yahooapis.com/2.8.1/build/grids/grids.css'
        ],
        */
        //extracss: 'body { color: red; } p,div { border: 1px solid green; padding: 8px; margin: 15px; } div { border: 1px solid purple; } blockquote { border: 1px solid orange; }'
        extracss: 'body { color: red; } p { border: 1px solid green; padding: 8px; margin: 15px; } blockquote { border: 1px solid orange; } div { border: 1px solid purple; padding: 0; margin: 0; }'
    });
    //editor.plug(Y.Plugin.EditorBR);
    editor.plug(Y.Plugin.EditorPara);
    editor.plug(Y.Plugin.EditorBidi);
    editor.plug(Y.Plugin.EditorLists);
    editor.on('dom:keydown', function(e) {
        if (e.keyCode === 13) {
            //editor.set('content', ' ');
            //e.frameEvent.halt();
        /*
            if (e.ctrlKey) {
                console.log('Control Pressed');
                //editor.execCommand('insertbr');
                e.frameEvent.halt();
            } else {
                //console.log('Not Pressed');
            }
            //console.log(e);
            */
        }
    });
    //editor.plug(Y.Plugin.EditorPara);

    /*
    setTimeout(function() {
        console.log('Injecting');
        editor.set('linkedcss', ['http://blog.davglass.com/files/yui/css/davglass.css']);
    }, 5000);
    */

    editor.after('nodeChange', function(e) {
        //console.log('changedType: ' + e.changedType);
        //if (e.changedType !== 'execcommand') {
        switch (e.changedType) {
            case 'keyup':
            case 'mouseup':
                updateButtons(e);
                break;
        }

        /*
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
        */

    });

    //editor.plug(Y.Plugin.EditorLists);
    //editor.plug(Y.Plugin.EditorBidi);

    //Disabled for IE testing..
    //editor.plug(Y.Plugin.EditorTab);
    editor.after('dom:paste', function(e) {
        console.log('DOM Paste');
        /*
        var inst = editor.getInstance();
        Y.later(100, null, function() {
            var div = inst.one('p > div');
            if (div) {
                div.setAttribute('style', '');
            }
        });
        */
        /*
        console.log(e);
        e.frameEvent.preventDefault();
        if (e.clipboardData.data) {
            console.log(e.clipboardData.data);
            editor.execCommand('paste');
            //editor.execCommand('insertandfocus', e.clipboardData.data);
        }
        */
    });

    editor.on('frame:ready', function() {
        Y.log('frame:ready, set content', 'info', 'editor');
        var inst = this.getInstance();
        //this.set('content', '<p>' + inst.Selection.CURSOR + '</p>');
        //this.set('content', '<div><div>' + inst.Selection.CURSOR + '</div><br><div>This is some content below the HR</div></div>');
        //this.set('content', ' ');

        //This stops image resizes, but for all images!!
        //editor.execCommand('enableObjectResizing', false);
        //this.set('content', Y.one('#stub').get('innerHTML'));
        editor.frame.on('keydown', function(e) {
            if (e.charCode == 83 && (e.ctrlKey || e.metaKey)) {
                e.halt();
            }
        });
    });
    //editor.on('dom:focus', function() {console.log("Focus called");});
    //editor.on('dom:blur', function() {console.log("Blur called");});
    /*
    editor.on('nodeChange', function(e) {
        if (Y.UA.ie) {

            var inst = this.getInstance(),
    	    sel = inst.config.doc.selection.createRange();

            editor._lastBookmark = sel.getBookmark();

            //console.log(e.changedType + ' :: ' + editor._lastBookmark);

        }
    });

    editor.frame.on('dom:focus', function() {
        var inst = this.getInstance(), sel, cur;

        console.log("Focus called");

        if (editor._lastBookmark) {
        } else {
            sel = new inst.Selection();
            cur = sel.getCursor();

            if (cur && cur.size()) {
                sel.focusCursor(true, false);
            }
        }
    });

    editor.frame.on('dom:activate', function(e) {
        var inst = this.getInstance(), sel, cur;
        console.log('activate called');
            sel = inst.config.doc.selection.createRange();
            console.log('focus: ' + editor._lastBookmark);
            var bk = sel.moveToBookmark(editor._lastBookmark);
            sel.collapse(true);
            sel.select();
            console.log('Move: ' + bk);
            editor._lastBookmark = null;


    });
    editor.frame.on('dom:focusout', function(e) {
        console.log('focusout called');
    });
    editor.frame.on('dom:blur', function(e) {
        console.log("Blur called");
        if (!Y.UA.ie) {
            var inst = this.getInstance(),
                sel = new inst.Selection();
            sel.setCursor();
        }
    });
    */


    /*
    editor.on('dom:keyup', function(e) {
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
    
    /*
    Y.on('click', function(e) {
        Y.one('#test1').setStyle('display', 'block');
        editor.render('#test');
    }, '#showEditor');
    */
});

</script>
</body>
</html>
