<style type="text/css">

    .yui-spinner-hidden {
        display:none;
    }

    .yui-spinner {
        display:-moz-inline-stack;
        display:inline-block;
        zoom:1;
        *display:inline;
    }
    
    .yui-spinner-content {
        padding:1px;
    }

    .yui-spinner-value {
        width:2em;
        height:1.6em;
        text-align:right;
        margin-right:0;
        vertical-align:top;
        border:1px solid #000;
    }

    .yui-spinner-increment, .yui-spinner-decrement {
        width:1.5em;
        overflow:hidden;
        text-indent:-10000em;
        border:1px solid #000;
        margin:0;
        height:1.9em;
        *margin-top:1px;
    }

    .yui-spinner-increment {
        background:#ddd url(<?php echo $assetsDirectory?>arrows.png) no-repeat 2px 4px;
    }

     .yui-spinner-decrement {
        background:#ddd url(<?php echo $assetsDirectory?>arrows.png) no-repeat 2px -14px;
     }

    #widget-extend-example {
        padding:5px;
    }

</style>