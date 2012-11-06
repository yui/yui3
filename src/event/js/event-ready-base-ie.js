(function() {

var stateChangeListener,
    GLOBAL_ENV   = YUI.Env,
    config       = YUI.config,
    doc          = config.doc,
    docElement   = doc && doc.documentElement,
    EVENT_NAME   = 'onreadystatechange',
    pollInterval = config.pollInterval || 40;

if (docElement.doScroll && !GLOBAL_ENV._ieready) {
    GLOBAL_ENV._ieready = function() {
        GLOBAL_ENV._ready();
    };

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
// Internet Explorer: use the doScroll() method on the root element.
// This isolates what appears to be a safe moment to manipulate the
// DOM prior to when the document's readyState suggests it is safe to do so.
    if (self !== self.top) {
        stateChangeListener = function() {
            if (doc.readyState == 'complete') {
                GLOBAL_ENV.remove(doc, EVENT_NAME, stateChangeListener);
                GLOBAL_ENV.ieready();
            }
        };
        GLOBAL_ENV.add(doc, EVENT_NAME, stateChangeListener);
    } else {
        GLOBAL_ENV._dri = setInterval(function() {
            try {
                docElement.doScroll('left');
                clearInterval(GLOBAL_ENV._dri);
                GLOBAL_ENV._dri = null;
                GLOBAL_ENV._ieready();
            } catch (domNotReady) { }
        }, pollInterval);
    }
}

})();
