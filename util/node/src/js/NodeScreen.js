/**
 * Extended interface for Node
 * @interface nodescreen
 */

YUI.add('nodescreen', function(Y) {

    /**
     * An interface for Node positioning.
     * @interface nodescreen
     */

    var ATTR = ['winWidth', 'winHeight', 'docWidth', 'docHeight', 'docScrollX', 'docScrollY'];

    Y.each(ATTR, function(v, n) {
        Y.Node.getters(v, Y.Node.wrapDOMMethod(v));
    });

    Y.Node.addDOMMethods(['getXY', 'setXY']);

}, '3.0.0', { requires: ['node', 'domscreen'] });
