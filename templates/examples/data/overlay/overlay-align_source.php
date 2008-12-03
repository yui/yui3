<div class="overlay-example" id="overlay-align">
    <button type="button" id="align">Align Next</button><pre id="alignment"></pre><span id="step"></span>
    <p class="filler">Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Nunc pretium quam eu mi varius pulvinar. Duis orci arcu, ullamcorper sit amet, luctus ut, interdum ac, quam. Pellentesque euismod. Nam tincidunt, purus in ultrices congue, urna neque posuere arcu, aliquam tristique purus sapien id nulla. Etiam rhoncus nulla at leo. Cras scelerisque nisl in nibh. Sed eget odio. Morbi elit elit, porta a, convallis sit amet, rhoncus non, felis. Mauris nulla pede, pretium eleifend, porttitor at, rutrum id, orci. Quisque non urna. Nulla aliquam rhoncus est.</p>
    <div id="align1" class="align-box"><span class="title">id = #align1</span></div>
    <div id="align2" class="align-box"><span class="title">id = #align2</span></div>
    <div id="align3" class="align-box"><span class="title">id = #align3</span></div>
</div>

<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>, function(Y) {

    /* Create Overlay from script, this time. No footer */
    var overlay = new Y.Overlay({
        width:"10em",
        height:"10em",
        headerContent: "Aligned Overlay",
        bodyContent: "Click the 'Align Next' button to try a new alignment",
        zIndex:2
    });

    /* Render it to #overlay-align element */
    overlay.render("#overlay-align");

    var alignment = Y.Node.get("#alignment");
    var stepNumber = Y.Node.get("#step");

    var WidgetPositionExt = Y.WidgetPositionExt;

    var steps = [
        function() {
            /* Center in #overlay-align */
            overlay.set("align", {node:"#overlay-align", points:[WidgetPositionExt.CC, WidgetPositionExt.CC]});
            alignment.set("innerHTML", 'align: {node:"#overlay-align", points:["cc", "cc"]}');
        },
        function() {
            /* Align top-left corner of overlay, with top-right corner of #align1 */
            overlay.set("align", {node:"#align1", points:[WidgetPositionExt.TL, WidgetPositionExt.TR]});
            alignment.set("innerHTML", 'align: {node:"#align1", points:["tl", "tr"]}');
        },
        function() {
            /* Center overlay in #align2 */
            overlay.set("centered", "#align2");
            alignment.set("innerHTML", 'centered: "#align2"');
        },
        function() {
            /* Align right-center edge of overlay with right-center edge of viewport */
            overlay.set("align", {points:[WidgetPositionExt.RC, WidgetPositionExt.RC]});
            alignment.set("innerHTML", 'align: {points:["rc", "rc"]} (viewport)');
        },
        function() {
            /* Center overlay in viewport */
           overlay.set("centered", true);
            alignment.set("innerHTML", "centered: true (viewport)");
        },
        function() {
            /* Align top-center edge of overlay with bottom-center edge of #align3 */
            overlay.set("align", {node:"#align3", points:[WidgetPositionExt.TC, WidgetPositionExt.BC]});
            alignment.set("innerHTML", 'align: {node:"#align3", points:["tc", "bc"]}');
        }
    ];

    var step = 0;
    var totalSteps = steps.length;
    function alignNext() {
        stepNumber.set("innerHTML", "Alignment " + (step+1) + " of " + totalSteps);
        steps[step]();
        step = (++step)%(totalSteps);
    }

    alignNext();

    Y.on("click", alignNext, "#align");
});
</script>
