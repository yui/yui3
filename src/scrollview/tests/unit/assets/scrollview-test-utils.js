YUI.add('scrollview-test-utils', function(Y, NAME) {

    Y.simulateMousewheel = function (node, down) {
        var evt = document.createEvent("WheelEvent");
        evt.initWebKitWheelEvent(0, (down ? -1:1), Y.config.win, 0, 0, 0, 0, 0, 0, 0, 0);
        node.getDOMNode().dispatchEvent(evt);
    };

    Y.renderNewScrollview = function (scrollViewAxis, paginatorAxis, startIndex, optimizeMemory) {

        var config = {},
            guid = Y.guid(),
            html,
            scrollview,
            widgetClass;

        config.srcNode = '#' + guid;
        config.axis = scrollViewAxis;

        switch(scrollViewAxis) {
            case 'x':
                config.width = "300px";
                widgetClass = 'horizontal';
                break;
            case 'y':
                config.height = "100px";
                widgetClass = 'vertical';
                break;
            case 'xy':
            default:
                config.height = "100px";
                config.width = "300px";
                widgetClass = 'horizontal';
                break;
        }

        if (paginatorAxis !== undefined) {

            config.plugins = [{
                fn:Y.Plugin.ScrollViewPaginator,
                cfg:{
                    index: startIndex || 0,
                    _optimizeMemory: optimizeMemory || false,
                    axis: paginatorAxis,
                    selector:">ul>li"
                }
            }];
        }

        html = "<div class='" + widgetClass + "'><div id='" + guid + "'><ul><li>a</li><li>b</li><li>c</li><li>e</li><li>f</li><li>g</li><li>h</li><li>i</li><li>j</li><li>k</li></ul></div></div>",
        Y.one('#container').append(html);

        scrollview = new Y.ScrollView(config);
        scrollview.render();

        return scrollview;
    };

    Y.getMockMousewheelEvent = function (delta, target) {
        var mock = new Y.Test.Mock();
        mock.wheelDelta = delta;
        mock.target = target;
        mock.preventDefault = function () {};
        return mock;
    };

    Y.getMockGestureEvent = function (x, y) {
        var mock = new Y.Test.Mock();
        mock.clientX = x;
        mock.clientY = y;
        mock.preventDefault = function () {};

        return mock;
    };

    Y.getMockGestureObject = function (axis, x, y) {
        return {
            axis: axis,
            startX: x,
            startY: y,
            startClientX: x,
            startClientY: y,
            onGestureMove: {
                detach: function () {}
            },
            onGestureMoveEnd: {
                detach: function () {}
            }
        };
    };

}, '', {requires: []});
