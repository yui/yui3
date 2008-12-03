<h3>Creating a Slider from script</h3>
<p>In this example, we'll be generating an X axis and Y axis Slider using entirely JavaScript.  To start, we'll need elements on the page into which the Sliders will be rendered.</p>

<textarea class="HTML" name="code" cols="60" rows="1">
    <h4>Vertical Slider</h4>
    <p id="vert_value">Value: 0</p>
    <div class="vert_slider"></div>

    <h4>Horizontal Slider</h4>
    <p id="horiz_value">Value: 0</p>
    <div class="horiz_slider"></div>
</textarea>

<h3>Set up your YUI instance</h3>
<p>Create a YUI instance and <code>use</code> the <code>slider</code> module.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

/* our code goes here */

});
</textarea>

<h3>Creating a vertical Slider</h3>
<p>To create a vertical Slider you just need to set the <code>axis</code> attribute to &quot;y&quot;.  The Sam skin comes with a thumb image for both horizontal and vertical Sliders.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
var vert_slider;
    
// instantiate the vertical Slider.  Use the classic Y thumb provided with the
// Sam skin
vert_slider = new Y.Slider({
    axis: 'y',        // vertical Slider
    value: 30,        // initial value
    railSize: '10em', // range the thumb can move through
    thumbImage: Y.config.base+'/slider/assets/skins/sam/thumb-classic-y.png'
});
</textarea>

<p>We'll subscribe to our Slider's <code>valueChange</code> event and display the current value in the <code>#vert_value</code> Node above the Slider.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
var v_report = Y.get('#vert_value');

// callback function to display Slider's current value
function reportValue(e) {
    v_report.set('innerHTML', 'Value: ' + e.newVal);
}

vert_slider.after('valueChange', reportValue);
</textarea>

<p>Then finally, we'll render the Slider into the first element with the class &quot;vert_slider&quot;.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
vert_slider.render('.vert_slider');
</textarea>

<h3>Creating a horizontal Slider</h3>
<p>Sliders are horizontal by default, so there's no need to specify the <code>axis</code> attribute.  In lieu of an initial <code>value</code> setting, the <code>min</code> is used.  Slider's default <code>min</code> and <code>max</code> are 0 and 100 respectively.  All we need to do is describe how long the Slider's rail is and what (if any) thumb image to use.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
var horiz_slider = new Y.Slider({
    railSize: '200px',
    thumbImage: Y.config.base+'/slider/assets/skins/sam/thumb-classic-x.png'
});
</textarea>

<p>Rather than store the Slider in a variable this time around, however, let's use method chaining to render and set up the display handler inline.</p>

<textarea class="JScript" name="code" cols="60" rows="1">
new Y.Slider({
        railSize: '200px',
        thumbImage: Y.config.base+'/slider/assets/skins/sam/thumb-classic-x.png'
    }).
    render('.horiz_slider').
    after('valueChange',function (e) {
        Y.get('#horiz_value').set('innerHTML', 'Value: ' + e.newVal);
    });
</textarea>

<p>And that's all there is to it!</p>

<h3>Full Code Listing</h3>
<textarea class="JScript" name="code" cols="60" rows="1">
// Create a YUI instance and request the slider module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

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



// instantiate the horizontal Slider, render it, and subscribe to its
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
</textarea>
