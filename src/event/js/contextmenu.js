var Event = Y.Event,
    DOM = Y.DOM,

    conf = {

    on: function (node, subscription, notifier, filter) {

        var isWin = (Y.UA.os === "windows"),
            handles = [];


        handles.push(Event._attach(["contextmenu", function (e) {
                          notifier.fire(e);                        
                      }, node]));


        handles.push(node[filter ? "delegate" : "on"]("keydown", function (e) {

            var target = this._node,
                shiftKey = e.shiftKey,
                keyCode = e.keyCode,
                clientX,
                clientY,
                xy;


            if ((isWin && shiftKey && keyCode == 121) || // F10
                    (!isWin && e.ctrlKey && shiftKey && e.altKey && keyCode == 77)) { // M

                // Prevent IE's menubar from getting focus
                // TO DO: confirm that this is necessary and for what browser(s)
                e.preventDefault();

                xy = DOM.getXY(target);

                clientX = (xy[0] + (target.offsetWidth/2)) - DOM.docScrollX();
                clientY = (xy[1] + (target.offsetHeight/2)) - DOM.docScrollY();
                
                // TO DO: intentionally pass the wrong value to the button param to account for what simulate fixes?
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