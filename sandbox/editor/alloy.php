<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <title>YUI: Alloy + Editor</title>
    <style type="text/css" media="screen">
    #editor_cont {
        width: 600px;
        border: 1px solid #999;
        margin: 2em;
    }
    #editor {
        height: 265px;
    }
    #toolbar {
        border-bottom: 1px solid #999;
        padding: 5px;
        background-color: #EEE;
        min-height: 25px;
    }
    #toolbar select {
        position: relative;
        top: -4px;
    }
    #toolbar .yui3-icon {
        background: url("http://yui.yahooapis.com/2.8.1/build/editor/assets/skins/sam/editor-sprite.gif") no-repeat scroll 30px 30px transparent;
    }
    #toolbar .yui3-icon-bold {
        background-position: 0 0;
    }
    #toolbar .yui3-icon-italic {
        background-position:0 -36px;
    }
    #toolbar .yui3-icon-underline {
        background-position:0 -72px;
    }
    #toolbar .yui3-icon-createlink {
        background-position:0 -792px;
    }
    #toolbar .yui3-state-active {
        background:none repeat scroll 0 0 #BFDFFF;
        border-color:#333333;
    }
    
	</style>
</head>
<body class="yui3-skin-sam">

<h1 tabindex="1">Editor Testing</h1>

<div id="editor_cont">
    <div id="toolbar">
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
    </div>
    <div id="editor"></div>
</div>


<script type="text/javascript" src="../../build/yui/yui-debug.js?bust=<?php echo(mktime()); ?>"></script>

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
    throwFail: true,
    //Last Gallery Build of this module
    gallery: 'gallery-2010.06.07-17-52',
    modules: {
        'gallery-aui-skin-base': {
            fullpath: 'http://yui.yahooapis.com/gallery-2010.06.07-17-52/build/gallery-aui-skin-base/css/gallery-aui-skin-base-min.css',
            type: 'css'
        },
        'gallery-aui-skin-classic': {
            fullpath: 'http://yui.yahooapis.com/gallery-2010.06.07-17-52/build/gallery-aui-skin-classic/css/gallery-aui-skin-classic-min.css',
            type: 'css',
            requires: ['gallery-aui-skin-base']
        }
    }
};

YUI(yConfig).use('gallery-aui-toolbar', 'node', 'selector-css3', 'base', 'editor-base', 'frame', 'substitute', 'exec-command', 'editor-lists', 'createlink-base', 'editor-tab', function(Y) {
    //console.log(Y, Y.id);


    editor = new Y.EditorBase({
        content: '<strong>This is <em>a test</em></strong> <strong>This is <em>a test</em></strong> '
    });
    editor.after('nodeChange', function(e) {
        updateButtons(e);
    });
    editor.plug(Y.Plugin.EditorTab);
    editor.on('frame:ready', function() {
        Y.log('frame:ready, set content', 'info', 'editor');
    });
    editor.render('#editor');

    var toolbar = new Y.Toolbar({
			activeState: true,
			children: [
				{ icon: 'bold' },
				{ icon: 'italic' },
				{ icon: 'underline' },
				{ icon: 'createlink' }
			]
		}
	).render('#toolbar');
    
    console.log(toolbar);

    toolbar.on('buttonitem:click', function(e) {
        console.log(e);
        var cmd = e.target.get('icon'), val = '';
        switch (cmd) {
            case 'bold':
                break;
        }
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
        
    });

    Y.delegate('change', function(e) {
        //console.log(e);
        var cmd = e.currentTarget.get('id'),
            val = e.currentTarget.get('value');
        editor.frame.focus();
        var ex_return = editor.execCommand(cmd, val);
    }, '#toolbar', 'select');
    
    var f_options = Y.all('#fontname option');
    var s_options = Y.all('#fontsize option');

    var updateButtons = function(e) {
        //console.log(e);
        var tar = e.changedNode;
        if (tar) {
            var cmds = e.commands;

            console.log(toolbar);
            toolbar.each(function(b) {
                var st = false;
                if (cmds[b.get('icon')]) {
                    st = true;
                }
                console.log(b, b.get('icon'), st);
                b.StateInteraction.set('active', st);
                //b.set('selected', st);
            });
            /*
            buttons.removeClass('selected');
            buttons.each(function(v) {
                if (cmds[v.get('value')]) {
                    v.addClass('selected');
                }
            });
            */

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

});

</script>
</body>
</html>
