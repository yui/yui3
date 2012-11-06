function (Y) {

    var testFeature = Y.Features.test,
        addFeature = Y.Features.add,
        WINDOW = Y.config.win,
        DOCUMENT = Y.config.doc,
        DOCUMENT_ELEMENT = 'documentElement',
        ret = false;

    addFeature('style', 'computedStyle', {
        test: function() {
            return WINDOW && 'getComputedStyle' in WINDOW;
        }
    });

    addFeature('style', 'opacity', {
        test: function() {
            return DOCUMENT && 'opacity' in DOCUMENT[DOCUMENT_ELEMENT].style;
        }
    });

    ret =  (!testFeature('style', 'opacity') &&
            !testFeature('style', 'computedStyle'));

    return ret;
}

