YUI.add('scrollview-test-utils', function(Y, NAME) {

    Y.simulateMousewheel = function (node, down) {
        var evt = document.createEvent("WheelEvent");
        evt.initWebKitWheelEvent(0, (down ? -1:1), Y.config.win, 0, 0, 0, 0, 0, 0, 0, 0);
        node.getDOMNode().dispatchEvent(evt);
    };

    Y.renderNewScrollview = function (scrollViewAxis, paginatorAxis, startIndex, optimizeMemory) {

        var config = {},
            paginatorConfig = {},
            guid = Y.guid(),
            html,
            scrollview,
            widgetClass,
            widgetWidth = (Y.SCROLLVIEW_TEST_UTIL_WIDGET_WIDTH || 300) + 'px',
            widgetHeight = (Y.SCROLLVIEW_TEST_UTIL_WIDGET_HEIGHT || 100) + 'px';

        config.srcNode = '#' + guid;

        if (scrollViewAxis) {
            config.axis = scrollViewAxis;
        }

        switch(scrollViewAxis) {
            case 'x':
                config.width = widgetWidth;
                widgetClass = 'horizontal';
                break;
            case 'y':
                config.height = widgetHeight;
                widgetClass = 'vertical';
                break;
            case 'xy':
            default:
                config.height = widgetHeight;
                config.width = widgetWidth;
                widgetClass = 'horizontal';
                break;
        }

        if (paginatorAxis !== undefined) {
            paginatorConfig = {
                index: startIndex || 0,
                _optimizeMemory: optimizeMemory || false,
                selector:">ul>li"
            };

            if (paginatorAxis) {
                paginatorConfig.axis = paginatorAxis;
            }

            config.plugins = [{
                fn:Y.Plugin.ScrollViewPaginator,
                cfg:paginatorConfig
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
});
