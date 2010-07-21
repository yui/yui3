<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <title>Touch/Gesture Events</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0" />

        <style>
        .pos {
            background-color: red;
            position:absolute;
            padding:2px;
        }
        
        #p1 {
            background-color: yellow;
            padding:5px;
        }

        #scroll {
            border:2px dashed black;
            height:2000px;
            width:1px;
        }

        body {
            background: -webkit-gradient(linear, left top, left bottom, from(#00abeb), to(#fff));
            -webkit-background-origin: padding-box; -webkit-background-clip: content-box;
        }
        </style>
    </head>

    <body>

        <script type="text/javascript" src="../../build/yui/yui-debug.js"></script>
        <script type="text/javascript" src="../../build/event/event-touch.js"></script>
        <script type="text/javascript" src="../../build/event/event-debug.js"></script>
        <script type="text/javascript" src="../../build/event/event-synthetic-debug.js"></script>
        <script type="text/javascript" src="../../build/event-gestures/event-gestures-debug.js"></script>
        <script type="text/javascript" src="../../build/dom/dom-debug.js?time=<?php echo(mktime()); ?>"></script>
        

        <div class="pos" id="p1">setXY</div>
        <div class="pos" id="p2">top,left</div>

        <div id="scroll"></div>

        <script>
            YUI({ filter: 'DEBUG' }).use("node", "event", "event-touch", "event-synthetic", "event-gestures", function(Y) {

                var p1 = Y.Node.get("#p1");
                var p2 = Y.Node.get("#p2");

                Y.Node.get("document").on("touchstart", function(e) {

                    var pageXY = [e.touches[0].pageX, e.touches[0].pageY];

                    p1.setXY(pageXY);

                    p2.setStyle("left", pageXY[0] + "px");
                    p2.setStyle("top", pageXY[1] + "px");
                    alert(navigator.userAgent);
                });

            });
        </script>

    </body>
</html>
