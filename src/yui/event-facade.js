YUI.add("event-facade", function(Y) {

    var whitelist = {
        "altKey"          : 1,
        "button"          : 1, // we supply
        "bubbles"         : 1,
        "cancelable"      : 1,
        "charCode"        : 1, // we supply
        "cancelBubble"    : 1,
        "currentTarget"   : 1,
        "ctrlKey"         : 1,
        "clientX"         : 1,
        "clientY"         : 1,
        "detail"          : 1, // not fully implemented
        // "fromElement"     : 1,
        "keyCode"         : 1,
        "height"          : 1,
        "initEvent"       : 1, // need the init events?
        "initMouseEvent"  : 1,
        "initUIEvent"     : 1,
        "layerX"          : 1,
        "layerY"          : 1,
        "metaKey"         : 1,
        "modifiers"       : 1,
        "offsetX"         : 1,
        "offsetY"         : 1,
        "preventDefault"  : 1, // we supply
        // "reason"          : 1, // IE proprietary
        // "relatedTarget"   : 1,
        "returnValue"     : 1,
        "shiftKey"        : 1,
        // "srcUrn"          : 1, // IE proprietary
        // "srcElement"      : 1,
        // "srcFilter"       : 1, IE proprietary
        "stopPropagation" : 1, // we supply
        // "target"          : 1,
        "timeStamp"       : 1,
        // "toElement"       : 1,
        "type"            : 1,
        // "view"            : 1,
        "which"           : 1, // we supply
        "width"           : 1,
        "x"               : 1,
        "y"               : 1
    };

    var webkitKeymap = {
        63232: 38, // up
        63233: 40, // down
        63234: 37, // left
        63235: 39, // right
        63276: 33, // page up
        63277: 34, // page down
        25: 9      // SHIFT-TAB (Safari provides a different key code in
                   // this case, even though the shiftKey modifier is set)
    };

    // return the element facade
    var wrapNode = function(n) {
        return (n && Y.Doc) ? Y.Doc.get(n) : n;
    };

    var resolve = function(n) {
        try {
            if (n && 3 == n.nodeType) {
                n = n.parentNode;
            } 
        } catch(ex) { }

        return wrapNode(n);
    };

    var ua = Y.ua;

    // provide a single event with browser abstractions resolved
    //
    // include all properties for both browers?
    // include only DOM2 spec properties?
    // provide browser-specific facade?
    Y.Event.Facade = function(ev, origTarg) {

        // @TODO the document should be the target's owner document

        var e = ev, ot = origTarg, d = document, b = d.body,
            x = e.pageX, y = e.pageY;

        for (var i in whitelist) {
            if (Y.object.owns(whitelist, i)) {
                this[i] = e[i];
            }
        }

        //////////////////////////////////////////////////////
        // pageX pageY

        if (!x && 0 !== x) {
            x = e.clientX || 0;
            y = e.clientY || 0;

            if (ua.ie) {
                x += b.scrollLeft;
                y += b.scrollTop;
            }
        }

        this.pageX = x;
        this.pageY = y;

        //////////////////////////////////////////////////////
        // keyCode

        var c = e.keyCode || e.charCode || 0;

        if (ua.webkit && (c in webkitKeymap)) {
            c = webkitKeymap[c];
        }

        this.keyCode = c;
        this.charCode = c;

        //////////////////////////////////////////////////////
        // time

        this.time = e.time || new Date().getTime();

        //////////////////////////////////////////////////////
        // targets
        
        this.target = resolve(e.target || e.srcElement);
        this.originalTarget = resolve(e.originalTarget || ot);

        var t = e.relatedTarget;
        if (!t) {
            if (e.type == "mouseout") {
                t = e.toElement;
            } else if (e.type == "mouseover") {
                t = e.fromElement;
            }
        }

        this.relatedTarget = resolve(t);
        
        //////////////////////////////////////////////////////
        // methods

        this.stopPropagation = function() {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        };

        this.preventDefault = function() {
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        };

        // stop event
        this.halt = function() {
            this.stopPropagation();
            this.preventDefault();
        };

    };

}, "3.0.0");
