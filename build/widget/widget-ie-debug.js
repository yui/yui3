YUI.add('widget-ie', function(Y) {

var BOUNDING_BOX = "boundingBox",
    CONTENT_BOX = "contentBox",
    HEIGHT = "height",
    OFFSET_HEIGHT = "offsetHeight",
    EMPTY_STR = "",
    heightReallyMinHeight = Y.UA.ie && Y.UA.ie < 7,
    bbTempExpanding = Y.Widget.getClassName("tmp", "forcesize");

    // borderBoxSupported = this._bbs = !(IE && IE < 8 && doc.compatMode != "BackCompat")

Y.Widget.prototype._uiSizeCB = function(expand) {

    var bb = this.get(BOUNDING_BOX),
        cb = this.get(CONTENT_BOX);

    if (expand) {
        if (heightReallyMinHeight) {
            bb.addClass(bbTempExpanding);
        }

        cb.set(OFFSET_HEIGHT, bb.get(OFFSET_HEIGHT));

        if (heightReallyMinHeight) {
            bb.removeClass(bbTempExpanding);
        }
    } else {
        cb.setStyle(HEIGHT, EMPTY_STR);
    }
};


}, '@VERSION@' ,{requires:['widget-base']});
