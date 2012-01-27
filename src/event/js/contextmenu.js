/**
 * Provides extended keyboard support for the contextmenu event such that on Windows there is a uniform experience
 * whether the user presses the Menu key (sometimes referred to as the Application key), or Shift + F10. On Mac, provides 
 * support for the keyboard shortcut Shift + Control + Option + M.
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
    
                // IE 9 doesn't set pageX and pageY for simulated events,
                // so this is a temporary fix until bug #2531581 is addressed in event-simulate
                if (isIE9 >= 9 && data) {
                    e.pageX = data.pageX;
                    e.pageY = data.pageY;
                    delete map[node.generateID()];
                }
    
                notifier.fire(e);
    
            }, node]));
    

            handles.push(node[filter ? "delegate" : "on"]("keydown", function (e) {
    
                var target = this._node,
                    shiftKey = e.shiftKey,
                    keyCode = e.keyCode,
                    clientX,
                    clientY,
                    scrollX,
                    scrollY,
                    xy;
    
    
                if ((isWin && shiftKey && keyCode == 121) || // F10
                        (!isWin && e.ctrlKey && shiftKey && e.altKey && keyCode == 77)) { // M
    
                    // Prevent IE's menubar from getting focus when the user presses Shift + F10
                    if (ie) {
                        e.preventDefault();
                    }
    
                    xy = DOM.getXY(target);
                    
                    scrollX = DOM.docScrollX();
                    scrollY = DOM.docScrollY();
    
                    clientX = (xy[0] + (target.offsetWidth/2)) - DOM.docScrollX();
                    clientY = (xy[1] + (target.offsetHeight/2)) - DOM.docScrollY();
                    
                    if (isIE9) {
                       map[node.generateID()] = { pageX: (clientX + scrollX), pageY: (clientY + scrollY) };
                    }
                    
                    Event.simulate(node.getDOMNode(), "contextmenu", { 
                      bubbles: !!filter,
                      button: 2,
                      clientX: clientX,
                      clientY: clientY
                    });
    
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