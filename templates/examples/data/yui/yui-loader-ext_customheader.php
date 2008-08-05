<!-- In this style block, we override some of the css styles for the calendar.
     We will use the 'insertBefore' config to make the loader insert the css
     node before our style block so that our styles will be applied in the
     correct order. -->
<style type="text/css" id="styleoverrides">
#cal1Cont {
    background-color:#8DD5E7;
}
#cal1Cont div.calheader {
    cursor: move;
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
