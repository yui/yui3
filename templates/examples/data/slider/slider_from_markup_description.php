<h3>Start with markup</h3>
<p>For complete control of the DOM structure used by Slider, we'll start with markup that includes the <code>boundingBox</code> and <code>contentBox</code> that wrap all YUI widgets.</p>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="volume_slider"><!-- boundingBox -->
    <div id="volume_slider_content"><!-- contentBox -->
        <div><!-- rail -->
            <div><!-- thumb -->
                <img src="<?php echo($assetsDirectory); ?>images/thumb.png" height="17" width="17"><!-- thumb image -->
            </div>
        </div>
    </div>
</div>
</textarea>

<p>Slider is set up to inspect the DOM inside its <code>contentBox</code> for rail, thumb, and thumb image elements.  It does this by searching for specific class names assigned to elements.  Add these classes to the markup and Slider will use those elements rather than create its own.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="volume_slider"><!-- boundingBox -->
    <div id="volume_slider_content"><!-- contentBox -->
        <div class="yui-slider-rail">
            <div class="yui-slider-thumb">
                <img class="yui-slider-thumb-image" src="<?php echo($assetsDirectory); ?>images/thumb.png" height="17" width="17">
            </div>
        </div>
    </div>
</div>
</textarea>

<h3>Instantiate the Slider</h3>
<p>With the markup in place, all that's left to do is instantiate the Slider with references to the <code>boundingBox</code> and <code>contentBox</code> elements.  The rest it will do automatically.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Create a YUI instance and request the slider module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

var volume = new Y.Slider({
    boundingBox: '#volume_slider',
    contentBox : '#volume_slider_content',
    railSize   : '80px'
});

});
</textarea>

<h3>Creating a collapsible Slider</h3>
<p>When working from existing markup, you can include additional content that will remain unchanged when Slider initializes.  To build a collapsible volume Slider nestled in a menu bar, we'll wrap the Slider markup in an element to serve as the menu bar and include a button in the <code>contentBox</code> above the rail.</p>

<textarea name="code" class="HTML" cols="60" rows="1">
<div id="volume_control" class="volume-hide">
    <div id="volume_slider">
        <div id="volume_slider_content" class="level_2">
            <button type="button" id="volume_icon" title="Open volume slider"><p>Open</p></button>
            <div class="yui-slider-rail">
                <div class="yui-slider-thumb">
                    <img class="yui-slider-thumb-image" src="<?php echo($assetsDirectory); ?>images/thumb.png" height="17" width="17">
                </div>
            </div>
        </div>
    </div>
</div>
</textarea>

<p>We'll use the following sprite background image to show the appropriate icon for the volume level (quiet to loud) managed by a class applied to the <code>contentBox</code>.</p>

<img src="<?php echo($assetsDirectory); ?>images/volume_icon.png" alt="image sprite of speaker icon in active and inactive quiet to loud states">

<p>Below is the CSS we'll need to create the appearance.  Note how some Sam skin styles are overridden with more specific selectors.</p>
<textarea name="code" class="CSS" cols="60" rows="1">
#volume_control {
    height: 22px;
    line-height: 22px;
    background: url("<?php echo($assetsDirectory); ?>images/bg.png") repeat-x 0 -22px;
}

/* Override some default Sam skin styles */
#volume_control .yui-slider {
    display: inline;
    float: left;
}

#volume_control .yui-slider-content {
    background: url("<?php echo($assetsDirectory); ?>images/rail.png") no-repeat 0 22px;
    height: 131px;
    padding-bottom: 11px;
    position: absolute; /* to allow drop over content below */
    width: 31px;
}

#volume_control .yui-slider-rail-y {
    background-image: none;
    position: absolute;
    top: 39px;
    left: 7px;
    min-width: 17px;
}

/* Support open/close action for the slider */
#demo .volume-hide .yui-slider-content {
    height: 22px;
    padding-bottom: 0;
    overflow: hidden;
}

/* Use a sprite for the speaker icon */
#volume_icon {
    background: url("<?php echo($assetsDirectory); ?>images/volume_icon.png") no-repeat -30px 0;
    border: none;
    height: 22px;
    overflow: hidden;
    width: 30px;
}

/* move the button text offscreen left */
#volume_icon p {
    text-indent: -9999px;
}

/*
 * adjust the speaker icon sprite in accordance with volume level and
 * active state
*/
.volume-hide .level_0 #volume_icon { background-position: -30px 0; }
.volume-hide .level_1 #volume_icon { background-position: -30px -22px; }
.volume-hide .level_2 #volume_icon { background-position: -30px -44px; }
.volume-hide .level_3 #volume_icon { background-position: -30px -66px; }

.level_0 #volume_icon, #volume_icon:hover,
#volume_control .level_0 #volume_icon:hover {
    background-position: 0 0;
}
.level_1 #volume_icon,
#volume_control .level_1 #volume_icon:hover {
    background-position: 0 -22px;
}
.level_2 #volume_icon,
#volume_control .level_2 #volume_icon:hover {
    background-position: 0 -44px;
}
.level_3 #volume_icon,
#volume_control .level_3 #volume_icon:hover {
    background-position: 0 -66px;
}
</textarea>

<p>We'll also set the default volume to 50 and reverse the Slider's <code>min</code> and <code>max</code> so the top corresponds to higher values.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
// Create a YUI instance and request the slider module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

var control    = Y.get('#volume_control'),
    icon       = Y.get('#volume_icon'),
    open       = false,
    level      = 2,
    volume;
    
// Notice the chained call to render()
volume = new Y.Slider({
    boundingBox: '#volume_slider',
    contentBox : '#volume_slider_content',
    axis       : 'y',
    min        : 100,
    max        : 0,
    value      : 50,
    railSize   : '80px'
}).render();

// Initialize event listeners
volume.after('valueChange', updateIcon);

icon.on('click', showHideSlider);

Y.on('click', handleDocumentClick, 'document');


/*
 * Support functions
 */

// Adjust the class responsible for displaying the correct speaker icon
function updateIcon(e) {
    var newLevel = e.newVal && Math.ceil(e.newVal / 34);

    if (level !== newLevel) {
        volume.get('boundingBox').replaceClass('level_'+level, 'level_'+newLevel);
        level = newLevel;
    }
}

// Show or hide the Slider in response to clicking on the speaker icon
function showHideSlider(e) {
    control.toggleClass('volume-hide');
    open = !open;

    if (open) {
        // Needed to correctly place the thumb
        volume.syncUI();
    }
}

// Close the Slider when clicking elsewhere on the page
function handleDocumentClick(e) {
    if (open && !icon.contains(e.target) &&
            !volume.get('boundingBox').contains(e.target)) {
        showHideSlider();
    }
}
</textarea>

<h3>Adding a few more controls</h3>
<p>In addition to the volume icon and Slider, we'll add a mute button and an input to show or update the current volume's numeric value.  The markup, CSS, and JavaScript for this is included below in the <a href="#full_code_listing">Full Code Listing</a>.</p>

<h3 id="full_code_listing">Full Code Listing</h3>

<h4>Markup</h4>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">

    <div id="volume_control" class="volume-hide">
        <label for="volume">volume</label><input type="text" size="3" maxlength="3" name="volume" id="volume" value="50">
        <div id="volume_slider" class="level_2">
            <div id="volume_slider_content">
                <button type="button" id="volume_icon" title="Open volume slider"><p>Open</p></button>
                <div class="yui-slider-rail">
                    <div class="yui-slider-thumb">
                        <img class="yui-slider-thumb-image" src="<?php echo($assetsDirectory); ?>images/thumb.png" height="17" width="17">
                    </div>
                </div>
            </div>
        </div>

        <button type="button" title="Mute" id="mute"><p>mute</p></button>
    </div>

</div>
</textarea>

<h4 id="full_js">JavaScript</h4>
<textarea name="code" class="JScript" cols="60" rows="1">
// Create a YUI instance and request the slider module and its dependencies
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>, function (Y) {

var control    = Y.get('#volume_control'),
    vol_input  = Y.get('#volume'),
    icon       = Y.get('#volume_icon'),
    mute       = Y.get('#mute'),
    open       = false,
    level      = 2,
    beforeMute = 0,
    volume;
    
volume = new Y.Slider({
    boundingBox: '#volume_slider',
    contentBox : '#volume_slider_content',
    axis       : 'y',
    min        : 100,
    max        : 0,
    value      : 50,
    railSize   : '80px'
}).render();

// Initialize event listeners
volume.after('valueChange', updateInput);
volume.after('valueChange', updateIcon);

mute.on('click', muteVolume);

vol_input.on('keydown', handleInput);
vol_input.on('keyup',   updateVolume);

icon.on('click', showHideSlider);

Y.on('click', handleDocumentClick, 'document');


// Support functions
function updateInput(e) {
    if (e.src !== 'KEY') {
        vol_input.set('value',e.newVal);
    }
}

function updateIcon(e) {
    var newLevel = e.newVal && Math.ceil(e.newVal / 34);

    if (level !== newLevel) {
        volume.get('boundingBox').replaceClass('level_'+level, 'level_'+newLevel);
        level = newLevel;
    }
}

function muteVolume(e) {
    var disabled = !volume.get('disabled');
    volume.set('disabled', disabled);

    if (disabled) {
        beforeMute = volume.getValue();
        volume.setValue(0);
        this.set('innerHTML','unmute');
        vol_input.set('disabled','disabled');
    } else {
        volume.set('value', beforeMute);
        this.set('innerHTML','mute');
        vol_input.set('disabled','');
    }
}

function handleInput(e) {
    // Allow only numbers and various other control keys
    if (e.keyCode > 57) {
        e.halt();
    }

    // Stop numbers that would result in a value > 100
    if (e.keyCode >= 48) {
        var val = vol_input.get('value'),
            key = e.keyCode - 48;

        if (parseInt(val + key,10) > 100) {
            e.halt();
        }
    }
}

function updateVolume(e) {
    var value = parseInt(vol_input.get('value'),10) || 0;

    volume.setValue(value, { src: 'KEY' });
}

function showHideSlider(e) {
    control.toggleClass('volume-hide');
    open = !open;

    if (open) {
        volume.syncUI();
    }
}

function handleDocumentClick(e) {
    if (open && !icon.contains(e.target) &&
            !volume.get('boundingBox').contains(e.target)) {
        showHideSlider();
    }
}

});
</textarea>

<h4 id="full_css">CSS</h4>
<textarea name="code" class="CSS" cols="60" rows="1">
#volume_control {
    height: 22px;
    line-height: 22px;
    background: url("<?php echo($assetsDirectory); ?>images/bg.png") repeat-x 0 -22px;
}

#volume_control label {
    margin: 0 1ex 0 1em;
    float: left;
    font-weight: bold;
}

#volume {
    border: 1px inset #999;
    float: left;
    height: 16px;
    margin: 2px 1ex 0 0;
    padding: 0 3px;
    text-align: right;
    width: 2em;
}

/* Override some default Sam skin styles */
#volume_control .yui-slider {
    display: inline;
    float: left;
}

#volume_control .yui-slider-content {
    background: url("<?php echo($assetsDirectory); ?>images/rail.png") no-repeat 0 22px;
    height: 131px;
    padding-bottom: 11px;
    position: absolute; /* to allow drop over content below */
    width: 31px;
}

#volume_control .yui-slider-rail-y {
    background-image: none;
    position: absolute;
    top: 39px;
    left: 7px;
    min-width: 17px;
}

/* Support open/close action for the slider */
#demo .volume-hide .yui-slider-content {
    height: 22px;
    padding-bottom: 0;
    overflow: hidden;
}

/* Use a sprite for the speaker icon */
#volume_icon {
    background: url("<?php echo($assetsDirectory); ?>images/volume_icon.png") no-repeat -30px 0;
    border: none;
    height: 22px;
    overflow: hidden;
    width: 30px;
}

/* move the button text offscreen left */
#volume_icon p {
    text-indent: -9999px;
}

#mute {
    background: url("<?php echo($assetsDirectory); ?>images/bg.png") repeat-x 0 -22px;
    border: none;
    float: left;
    height: 22px;
    margin-left: 30px; /* to account for abs positioned slider container */
}

#mute p {
    margin: 0;
}

#mute:hover {
    background-position: 0 0;
    color: #fff;
}

/*
 * adjust the speaker icon sprite in accordance with volume level and
 * active state
*/
.volume-hide .level_0 #volume_icon { background-position: -30px 0; }
.volume-hide .level_1 #volume_icon { background-position: -30px -22px; }
.volume-hide .level_2 #volume_icon { background-position: -30px -44px; }
.volume-hide .level_3 #volume_icon { background-position: -30px -66px; }

.level_0 #volume_icon, #volume_icon:hover,
#volume_control .level_0 #volume_icon:hover {
    background-position: 0 0;
}
.level_1 #volume_icon,
#volume_control .level_1 #volume_icon:hover {
    background-position: 0 -22px;
}
.level_2 #volume_icon,
#volume_control .level_2 #volume_icon:hover {
    background-position: 0 -44px;
}
.level_3 #volume_icon,
#volume_control .level_3 #volume_icon:hover {
    background-position: 0 -66px;
}
</textarea>
