
<!-- include event dependencies -->
<script type="text/javascript" src="<?php echo $buildDirectory ?>oop/oop-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildDirectory ?>event/event-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildDirectory ?>dom/dom-debug.js"></script>
<script type="text/javascript" src="<?php echo $buildDirectory ?>node/node-debug.js"></script>
<div id="contentContainer">
<div id="demo"></div>

    <!--a ul with an arbitrarily large number of children:-->
    <ul>
        <?php
            for ($i=0; $i<100; $i++) {
                echo "<li id='li-$i'>child node #$i</li>\n";
            }
        ?>
    </ul>

    <img src="http://developer.yahoo.com/yui/docs/assets/examples/exampleimages/large/uluru.jpg" width="500" alt="Uluru" id="image" />

</div>


<script language="javascript">


YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
function(Y) {

    var results = Y.get('#demo');

    //we'll use this handler for all of our callbacks; the
    //message being logged will always be the last argument.
    function fnHandler(e) {
        var message = arguments[arguments.length - 1];
        // Y.log(message, "info", "example");
        results.set('innerHTML', results.get('innerHTML') + '<p>' + message + '</p>');
    }

    //assign page load handler:
    Y.on("load", fnHandler, window, Y, "The window load event fired.  The page and all of its image data, including the large image of Uluru, has completed loading.");

    //assign domready handler:
    Y.on("domready", fnHandler, Y, "The DOMContentLoaded event fired.  The DOM is now safe to modify via script.");
    
    //assign 'contentready' handler:
    Y.on("contentready", fnHandler, "#contentContainer", Y, "The 'contentready' event fired for the element 'contentContainer'.  That element and all of its children are present in the DOM.");

    //assign 'available' handler:
    Y.on("available", fnHandler, "#contentContainer", Y, "The 'available' event fired on the element 'contentContainer'.  That element is present in the DOM.");
    
    fnHandler("", "As the page loads, you'll see the 'available', 'contentready', 'domready', and window load events logged here as they fire in sequence.");
    
});

</script>
