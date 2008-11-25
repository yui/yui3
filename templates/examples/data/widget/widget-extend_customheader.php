<style type="text/css">

    .yui-spinner-hidden {
        display:none;
    }

    .yui-spinner {
        display:-moz-inline-stack;
        display:inline-block;
        zoom:1;
        *display:inline;
        vertical-align:middle;
    }

    .yui-spinner-content {
        padding:1px;
        position:relative;
    }

    .yui-spinner-value {
        width:2em;
        height:1.5em;
        text-align:right;
        margin-right:22px;
        vertical-align:top;
        border:1px solid #000;
        padding:2px;
    }

    .yui-spinner-increment, .yui-spinner-decrement {
        position:absolute;
        height:1em;
        width:22px;
        overflow:hidden;
        text-indent:-10em;
        border:1px solid #999;
        margin:0;
        padding:0px;
    }

    .yui-spinner-increment {
        top:1px;
        *top:2px;
        right:1px;
        background:#ddd url(<?php echo $assetsDirectory?>arrows.png) no-repeat 50% 0px;
    }

     .yui-spinner-decrement {
        bottom:1px;
        *bottom:2px;
        right:1px;
        background:#ddd url(<?php echo $assetsDirectory?>arrows.png) no-repeat 50% -20px;
     }

    #widget-extend-example {
        padding:5px;
    }

</style>