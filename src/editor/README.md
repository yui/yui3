Rich Text Editor
================

The Rich Text Editor is a UI control that allows for the rich formatting
of text content, including common structural treatments like lists,
formatting treatments like bold and italic text.

The current release of the Rich Text Editor for YUI 3 is the base utility
layers that provide a foundation on which you can create an Editor.
**This version of Editor does not contain a GUI of any kind.**


    YUI().use('editor-base', function(Y) {

        var editor = new Y.EditorBase({
            content: '<strong>This is <em>a test</em></strong> <strong>This is <em>a test</em></strong> '
        });

        //Add the BiDi plugin
        editor.plug(Y.Plugin.EditorBidi);

        //Focusing the Editor when the frame is ready..
        editor.on('frame:ready', function() {
            this.focus();
        });

        //Rendering the Editor.
        editor.render('#editor');

    });


