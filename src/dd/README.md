Drag and Drop
=============

The Drag and Drop Utility allows you to create a draggable interface efficiently,
buffering you from browser-level abnormalities and enabling you to focus on the
interesting logic surrounding your particular implementation. This component
enables you to create a variety of standard draggable objects with just a few
lines of code and then, using its extensive API, add your own specific
implementation logic.

    YUI().use('dd-drag', function(Y) {
        var dd = new Y.DD.Drag({
            node: '#drag'
        });
    });


### File Structure and Module Info


Source Files:
    ddm-base.js         ==> Base DragDrop Manager
    ddm.js              ==> Adds shim support
    ddm-drop.js         ==> Adds Drop support
    drag.js             ==> Main drag class
    proxy.js            ==> Adds proxy support to Drag
    constrain.js        ==> Adds constrain support to drag
    scroll.js           ==> Adds scroll support to drag
    drop.js             ==> Drop Support
    dd-plugin.js        ==> Node plugin for Drag
    dd-drop-plugin.js   ==> Node plugin for Drop


Module Names:
    dd-ddm-base         ==> Base DragDrop Manager
    dd-ddm              ==> Adds shim support
    dd-ddm-drop         ==> Adds Drop support
    dd-drag             ==> Main drag class
    dd-proxy            ==> Adds proxy support to Drag
    dd-constrain        ==> Adds constrain support to drag
    dd-scroll           ==> Adds scroll support to drag
    dd-drop             ==> Drop Support
    dd-plugin           ==> Node plugin for Drag
    dd-drop-plugin      ==> Node plugin for Drop
    dd                  ==> All Drag & Drop related code

Build Files:
    dd-ddm-base.js      ==> Base DragDrop Manager
    dd-ddm.js           ==> Adds shim support
    dd-ddm-drop.js      ==> Adds Drop support
    dd-drag.js          ==> Main drag class
    dd-proxy.js         ==> Adds proxy support to Drag
    dd-constrain.js     ==> Adds constrain support to drag
    dd-scroll.js        ==> Adds scroll support to drag
    dd-drop.js          ==> Drop Support
    dd-plugin.js        ==> Node plugin for Drag
    dd-drop-plugin.js   ==> Node plugin for Drop


Rollup File:
    dd.js  ==> dd-ddm-base, dd-ddm, dd-ddm-drop, dd-drag, dd-proxy, dd-constrain, dd-scroll, dd-drop, dd-plugin, dd-drop-plugin


