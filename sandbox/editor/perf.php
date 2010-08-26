<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Editor Perforance Tests</title>
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
<!--button id="showEditor">Show Editor</button-->

<div id="stub">
    <p id="hammer">This is a test..</p>
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
</div>
<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(time()); ?>"></script>


<script type="text/javascript" src="js/editor-base.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/frame.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/exec-command.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/selection.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/lists.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-tab.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/createlink-base.js?bust=<?php echo(time()); ?>"></script>
<script type="text/javascript" src="js/editor-bidi.js?bust=<?php echo(time()); ?>"></script>

<script type="text/javascript">
var yConfig = {
    debug: false,
    filter: 'raw',
    //debug: false,
    //filter: 'MIN',
    allowRollup: false,
    logExclude: {
        'yui': true,
        'event': true,
        base: true,
        attribute: true,
        augment: true,
        get: true,
        loader: true,
        frame: true,
        Selector: true
    },
    throwFail: true
};

YUI(yConfig).use('node-event-simulate', 'node', 'selector-css3', 'base', 'editor-base', 'frame', 'substitute', 'exec-command', 'editor-lists', 'createlink-base', 'editor-bidi', 'editor-lists', function(Y) {
    //console.log(Y, Y.id);
    


    var editor = new Y.EditorBase({
        content: Y.one('#stub').get('innerHTML'),
        extracss: 'body { color: red; } p { border: 1px solid green; padding: .25em; margin: 1em; }'
    });
    editor.plug(Y.Plugin.EditorLists);
    editor.plug(Y.Plugin.EditorBidi);
    editor.on('frame:ready', function() {
        var inst = this.getInstance();

        inst.use('node-event-simulate', function() {
            var node = inst.one('#hammer');
            console.log('Simulate Loaded..');
            editor.focus();
            setTimeout(function() {
                var startTime = (new Date()).getTime();

                console.log('Starting keypress simulate..');
                for (var i = 0; i < 150; i ++) {
                    node.simulate('keydown');
                    node.simulate('keypress');
                    node.simulate('keyup');
                }
                var endTime = (new Date()).getTime();
                console.log('_defNodeChangeTimer: ' + (endTime - startTime) + 'ms');
                
            }, 1000);
        });
    });

    editor.render('#test');

});

</script>
</body>
</html>
