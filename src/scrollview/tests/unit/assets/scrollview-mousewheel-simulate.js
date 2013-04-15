YUI.add('scrollview-mousewheel-simulate', function(Y, NAME) {

    Y.simulateMousewheel = function (node, down) {
        var evt = document.createEvent("WheelEvent");
        evt.initWebKitWheelEvent(0, (down ? -1:1), Y.config.win, 0, 0, 0, 0, 0, 0, 0, 0);
        node.getDOMNode().dispatchEvent(evt);
    };

}, '', {requires: []});
