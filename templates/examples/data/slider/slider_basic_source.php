<div id="demo">

    <h4>Vertical Slider</h4>
    <p id="vert_value">Value: 0</p>
    <div class="vert_slider"></div>

    <h4>Horizontal Slider</h4>
    <p id="horiz_value">Value: 0</p>
    <div class="horiz_slider"></div>

</div>
<script type="text/javascript">
// Create a YUI instance and request the slider module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {
//YUI({base:'/3.x/build/',filter:'debug',logExclude:{event:true,attribute:true}}).use(<?php echo($requiredModules); ?>, function (Y) {

// store the node to display the vertical Slider's current value
var v_report = Y.get('#vert_value'),
    vert_slider;
    
// instantiate the vertical Slider.  Use the classic thumb provided with the
// Sam skin
vert_slider = new Y.Slider({
    axis: 'y', // vertical Slider
    value: 30, // initial value
    railSize: '10em', // range the thumb can move through
    thumbImage: Y.config.base+'/slider/assets/skins/sam/thumb-classic-y.png'
});

// callback function to display Slider's current value
function reportValue(e) {
    v_report.set('innerHTML', 'Value: ' + e.newVal);
}

vert_slider.after('valueChange', reportValue);

// render the slider into the first element with class vert_slider
vert_slider.render('.vert_slider');



// instatiate the horizontal Slider, render it, and subscribe to its
// valueChange event via method chaining.  No need to store the created Slider
// in this case.
new Y.Slider({
        railSize: '200px',
        thumbImage: Y.config.base+'/slider/assets/skins/sam/thumb-classic-x.png'
    }).
    render('.horiz_slider').
    after('valueChange',function (e) {
        Y.get('#horiz_value').set('innerHTML', 'Value: ' + e.newVal);
    });

});
</script>
