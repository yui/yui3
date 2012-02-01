/**
 * Provides extended keyboard support for the contextmenu event such that:
 * 1) On Windows there is a uniform experience regardless of how the contextmenu is fired via the keyboard (either via the Menu key or using Shift + F10)
 * 2) On the Mac it enables the use of the Shift + Control + Option + M keyboard shortcut, which (by default) is only available when VoiceOver is enabled.
 * 3) When the contextmenu event is fired via the keyboard, the pageX, pageY, clientX and clientY properties are set using the center of the event target as the point of origin. This makes it easier for contextmenu event listeners to position an overlay in respose to the event by not having to worry about special handling of the x and y coordinates based on the device that fired the event.
 * @module event-contextmenu
 * @requires event
 */

var Event = Y.Event,
    DOM = Y.DOM,
    
    ie = Y.UA.ie,
    isIE9 = (ie >= 9),
    map = {},

    conf = {

        on: function (node, subscription, notifier, filter) {
    
            var isWin = (Y.UA.os === "windows"),
                handles = [];
    
            handles.push(Event._attach(["contextmenu", function (e) {
    
                var id = node.generateID(),
                    data = map[id];
    
                if (data) {
                    e.clientX = e.clientX;
                    e.clientY = e.clientY;
                    e.pageX = data.pageX;
                    e.pageY = data.pageY;
                    delete map[node.generateID()];
                }
    
                notifier.fire(e);
    
            }, node]));
    
            handles.push(node[filter ? "delegate" : "on"]("keydown", function (e) {
    
                var target = this.getDOMNode(),
                    shiftKey = e.shiftKey,
                    keyCode = e.keyCode,
                    shiftF10 = (shiftKey && keyCode == 121),
                    menuKey = (isWin && keyCode == 93),
                    clientX = 0,
                    clientY = 0,
                    scrollX,
                    scrollY,
                    xy,
                    x,
                    y;
    
    
                if ((isWin && (shiftF10 || menuKey)) ||
                        (!isWin && e.ctrlKey && shiftKey && e.altKey && keyCode == 77)) { // M
    
                    // Prevent IE's menubar from getting focus when the user presses Shift + F10
                    if (ie && shiftF10) {
                        e.preventDefault();
                    }
    
                    xy = DOM.getXY(target);
                    x = xy[0];
                    y = xy[1];
                    scrollX = DOM.docScrollX();
                    scrollY = DOM.docScrollY();

                    // Protect against instances where xy and might not be returned,  
                    // for example if the target is the document.
                    if (!Y.Lang.isUndefined(x)) {
                      clientX = (x + (target.offsetWidth/2)) - scrollX;
                      clientY = (y + (target.offsetHeight/2)) - scrollY;
                    }
                    
                    // Fixes two issues:
                    // 1) IE 9 doesn't set pageX and pageY for simulated events (bug #2531581)
                    // 2) The contextmenu doesn't provide clientX, clientY, pageX or pageY when fired via the Menu key
                    if ((isIE9 && shiftF10) || menuKey) {
                        map[node.generateID()] = { clientX: clientX, clientY: clientY, pageX: (clientX + scrollX), pageY: (clientY + scrollY) };
                    }

                    // Don't need to simulate the contextmenu event when the 
                    // menu key is pressed as it fires contextmenu by default.
                    
                    // TO node.getDOMNode() OR target.getDOMNode() ??
                    
                    if (!menuKey) {
                        Event.simulate(node.getDOMNode(), "contextmenu", { 
                            bubbles: !!filter,
                            button: 2,
                            clientX: clientX,
                            clientY: clientY
                        });                    
                    }
                }
    
            }, filter));
            
            subscription._handles = handles;
    
        },
    
        detach: function (node, subscription, notifier) {
    
            Y.each(subscription._handles, function (handle) {
                handle.detach();
            });
    
        }
    
    };

conf.delegate = conf.on;
conf.detachDelegate = conf.detach;

Event.define("contextmenu", conf, true);