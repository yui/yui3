<!-- In this style block, we override some of the css styles for the calendar.
     We will use the 'insertBefore' config to make the loader insert the css
     node before our style block so that our styles will be applied in the
     correct order. -->
<style type="text/css" id="styleoverrides">
#cal1Cont {
    background-color:#004C6D;
}

#cal1Cont div.calheader {
    cursor: move;
}

#cal1Cont .yui-calendar {
    width:auto;
    background-color:transparent;
}

#cal1Cont .yui-calendar tr, #cal1Cont .yui-calendar th {
    background-color:transparent;
    vertical-align:middle;
    text-transform:none;
    color:#fff;
}

#cal1Cont .yui-calendar a:hover {
    text-decoration:none;
}

#results {
    background-color:#8DD5E7;
    border:1px solid black;
    position: absolute;
    top: 15px;
    right: 5px;
    width: 300px;
}
</style>
