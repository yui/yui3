<style type="text/css">
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
</style>
