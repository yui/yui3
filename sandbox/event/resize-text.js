(function() {
/**
 * Firefox fires the window resize event once when the resize action
 * finishes, other browsers fire the event periodically during the
 * resize.  This code uses timeout logic to simulate the Firefox 
 * behavior in other browsers.
 * @event textresize
 * @for YUI
 */

var DOC    = Y.config.doc,
    GECKO  = Y.UA.gecko,
    SECURE = (Y.UA.secure),
    SUPPORTS_CW_RESIZE = !(GECKO && GECKO <= 1.8),
    SECURE_FRAME_SOURCE = SECURE && Y.config.secureFrameSource

/*
* Initialize an empty IFRAME that is placed out of the visible area 
* that can be used to detect text resize.
* @method initResizeMonitor
*/
initResizeMonitor: function () {

    var isGeckoWin = (GECKO && this.platform == "windows");
    if (isGeckoWin) {
        // Help prevent spinning loading icon which 
        // started with FireFox 2.0.0.8/Win
        var self = this;
        setTimeout(function(){self._initResizeMonitor();}, 0);
    } else {
        this._initResizeMonitor();
    }
},

/*
 * Create and initialize the text resize monitoring iframe.
 * 
 * @protected
 * @method _initResizeMonitor
 */
_initResizeMonitor : function() {

    var frameDoc, 
        frame, 
        sHTML,
        st;

    function fireTextResize() {
        Module.textResizeEvent.fire();
    }

    if (!UA.opera) {
        frame = Dom.get("_yuiResizeMonitor");

        // Gecko 1.8.0 (FF1.5), 1.8.1.0-5 (FF2) won't fire resize on contentWindow.
        // Gecko 1.8.1.6+ (FF2.0.0.6+) and all other browsers will fire resize on contentWindow.

        // We don't want to start sniffing for patch versions, so fire textResize the same
        // way on all FF2 flavors
        

        if (!frame) {
            frame = DOC.createElement("iframe");

            if (SECURE && Module.RESIZE_MONITOR_SECURE_URL && Y.UA.ie) {
                frame.src = Module.RESIZE_MONITOR_SECURE_URL;
            }

            if (!SUPPORTS_CW_RESIZE) {
                // Can't monitor on contentWindow, so fire from inside iframe
                sHTML = ["<html><head><script ",
                         "type=\"text/javascript\">",
                         "window.onresize=function(){window.parent.",
                         "YAHOO.widget.Module.textResizeEvent.",
                         "fire();};<",
                         "\/script></head>",
                         "<body></body></html>"].join('');

                frame.src = "data:text/html;charset=utf-8," + encodeURIComponent(sHTML);
            }

            frame.id = Y.stamp('_yuiResize');
            frame.title = "Text Resize Monitor";

            // Need to set "position" property before inserting the 
            // iframe into the document or Safari's status bar will 
            // forever indicate the iframe is loading 
            // (See SourceForge bug #1723064)

            st = frame.style;
            
            st.position = "absolute";
            st.visibility = "hidden";

            var db = document.body,
                fc = db.firstChild;
            if (fc) {
                db.insertBefore(frame, fc);
            } else {
                db.appendChild(frame);
            }

            st.width = "2em";
            st.height = "2em";
            st.top = (-1 * (frame.offsetHeight + Module.RESIZE_MONITOR_BUFFER)) + "px";
            st.left = "0";
            st.borderWidth = "0";
            st.visibility = "visible";

            /*
               Don't open/close the document for Gecko like we used to, since it
               leads to duplicate cookies. (See SourceForge bug #1721755)
            */
            if (UA.webkit) {
                frameDoc = frame.contentWindow.document;
                frameDoc.open();
                frameDoc.close();
            }
        }

        if (frame && frame.contentWindow) {
            Module.textResizeEvent.subscribe(this.onDomResize, this, true);

            if (!Module.textResizeInitialized) {
                if (SUPPORTS_CW_RESIZE) {
                    if (!Event.on(frame.contentWindow, "resize", fireTextResize)) {
                        // This will fail in IE if document.domain has 
                        // changed, so we must change the listener to 
                        // use the frame element instead
                        Event.on(frame, "resize", fireTextResize);
                    }
                }
                Module.textResizeInitialized = true;
            }
            this.resizeMonitor = frame;
        }
    }
},

    /*
    * Event handler fired when the resize monitor element is resized.
    * @method onDomResize
    * @param {DOMEvent} e The DOM resize event
    * @param {Object} obj The scope object passed to the handler
    */
    onDomResize: function (e, obj) {

        var nTop = -1 * (this.resizeMonitor.offsetHeight + Module.RESIZE_MONITOR_BUFFER);

        this.resizeMonitor.style.top = nTop + "px";
        this.resizeMonitor.style.left = "0";
    },


Y.Env.evt.plugins.textresize = {

    on: function(type, fn) {

        // check for single window listener and add if needed
        if (!detachHandle) {
            detachHandle = Y.on('resize', handler);
        }

        var a = Y.Array(arguments, 0, true);
        a[0] = CE_NAME;

        return Y.on.apply(Y, a);
    }
};

})();
