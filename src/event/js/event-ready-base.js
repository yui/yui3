/*
 * DOM event listener abstraction layer
 * @module event
 * @submodule event-base
 */

(function() {

// Unlike most of the library, this code has to be executed as soon as it is
// introduced into the page -- and it should only be executed one time
// regardless of the number of instances that use it.

var stateChangeListener,
    GLOBAL_ENV   = YUI.Env, 
    config       = YUI.config, 
    doc          = config.doc, 
    docElement   = doc.documentElement, 
    doScrollCap  = docElement.doScroll,
    add          = YUI.Env.add,
    remove       = YUI.Env.remove,
    targetEvent  = (doScrollCap) ? 'onreadystatechange' : 'DOMContentLoaded',
    pollInterval = config.pollInterval || 40,
    _ready       = function(e) {
                     GLOBAL_ENV._ready();
                 };

if (!GLOBAL_ENV._ready) {
    GLOBAL_ENV._ready = function() {
        if (!GLOBAL_ENV.DOMReady) {
            GLOBAL_ENV.DOMReady = true;
            remove(doc, targetEvent, _ready); // remove DOMContentLoaded listener
        }
    };

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller/Diego Perini */
// Internet Explorer: use the doScroll() method on the root element.  This isolates what 
// appears to be a safe moment to manipulate the DOM prior to when the document's readyState 
// suggests it is safe to do so.
    if (doScrollCap) {
        if (self !== self.top) {
            stateChangeListener = function() {
                if (doc.readyState == 'complete') {
                    remove(doc, targetEvent, stateChangeListener); // remove onreadystatechange listener
                    _ready();
                }
            };
            add(doc, targetEvent, stateChangeListener); // add onreadystatechange listener
        } else {
            GLOBAL_ENV._dri = setInterval(function() {
                try {
                    docElement.doScroll('left');
                    clearInterval(GLOBAL_ENV._dri);
                    GLOBAL_ENV._dri = null;
                    _ready();
                } catch (domNotReady) { }
            }, pollInterval); 
        }
    } else { // FireFox, Opera, Safari 3+ provide an event for this moment.
        add(doc, targetEvent, _ready); // add DOMContentLoaded listener
    }
}

})();
