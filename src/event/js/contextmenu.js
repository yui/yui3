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
    UA = Y.UA,
    OS = Y.UA.os,
    
    ie = UA.ie,
    gecko = UA.gecko,
    webkit = UA.webkit,

    isWin = (OS === "windows"),
    isMac = (OS === "macintosh"),

    eventData = {},

    conf = {

        on: function (node, subscription, notifier, filter) {
    
            var handles = [];
    
            handles.push(Event._attach(["contextmenu", function (e) {

                // Any developer listening for contextmenu event is likely
                // going to call preventDefault() to prevent the display of 
                // the browser's context menu. So, you know, save them a step.
                e.preventDefault();
    
                var id = node.generateID(),
                    data = eventData[id];
    
                if (data) {
                    e.clientX = e.clientX;
                    e.clientY = e.clientY;
                    e.pageX = data.pageX;
                    e.pageY = data.pageY;
                    delete eventData[id];
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
                        (isMac && e.ctrlKey && shiftKey && e.altKey && keyCode == 77)) { // M
    
                    // Need to call preventDefault() here b/c:
                    // 1) To prevent IE's menubar from gaining focus when the 
                    // user presses Shift + F10
                    // 2) In Firefox for Win, Shift + F10 will display a contextmenu, 
                    // but won't fire the contextmenu event. So, need to call 
                    // preventDefault() to prevent the display of the
                    // browser's contextmenu
                    if ((ie || (isWin && gecko)) && shiftF10) {
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

                    // When the contextmenu is fired from the keyboard 
                    // clientX, clientY, pageX or pageY aren't set to useful
                    // values. So, we follow Safari's model here of setting 
                    // the x & x coords to the center of the event target.

                    // TO DO: can likely use Node's getData and setData methods
                    if (menuKey || (isWin && webkit && shiftF10)) {
                        eventData[node.generateID()] = { 
                            clientX: clientX,
                            clientY: clientY,
                            pageX: (clientX + scrollX),
                            pageY: (clientY + scrollY)
                        };
                    }
  
                    // Don't need to call notifier.fire(e) when the Menu key
                    // is pressed as it fires contextmenu by default.
                    //  
                    // In IE the call to preventDefault() for Shift + F10
                    // prevents the contextmenu event from firing, so we need
                    // to call notifier.fire(e)
                    //
                    // Need to also call notifier.fire(e) for gecko win since
                    // Shift + F10 doesn't fire the contextmenu event
                    //                    
                    // Lastly, also need to call notifier.fire(e) for 
                    // webkit for Mac && gecko for Mac since Shift + Ctrl + Option + M
                    // doesn't fire the contextmenu event when VoiceOver isn't enabled

                    if (((ie || (isWin && gecko)) && shiftF10) || isMac) {
                        e.clientX = clientX;
                        e.clientY = clientY;
                        e.pageX = (clientX + scrollX);
                        e.pageY = (clientY + scrollY);
                        
                        notifier.fire(e);
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