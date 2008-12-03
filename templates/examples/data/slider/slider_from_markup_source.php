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
<script type="text/javascript">
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

    if (e) {
        e.preventDefault();
    }
}

function handleDocumentClick(e) {
    if (open && !icon.contains(e.target) &&
            !volume.get('boundingBox').contains(e.target)) {
        showHideSlider();
    }
}

});
</script>
