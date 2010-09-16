YUI.add('window-focus', function (Y) {

    Y.isWindowInFocus = function () {
        var ret = false,
            doc = Y.config.doc,
            input = doc.createElement('input');

        input.onfocus = input.onfocusout = function () {
            ret = true;
        };

        doc.body.insertBefore(input, doc.body.firstChild);

        input.focus();
        input.blur();

        doc.body.removeChild(input);

        input.onfocus = input.onfocusout = null;

        return ret;
    }

});
