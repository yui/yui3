<style>
    #demo {
        height: 100px;
        width: 100px;
        border: 1px solid black;
        background-color: #8DD5E7;
        cursor: move;
    }
    #play {
        height: 200px;
    }
</style>

<div id="play">
    <div id="demo"></div>
</div>
<script>

YUI(<?php echo $yuiConfig ?>).use('anim',
function(Y) {
    var anim = new Y.Anim({
        node: '#demo',
        to: {
            height: 50,
            width: 150
        },
        from: {
            height: 100,
            width: 100
        },
        direction: 'alternate',
        iterations: 30,
        duration: .5
    });
    anim.run();
});

YUI(<?php echo $yuiConfig ?>).use('dd-drag',
function(Y) {
    var dd = new Y.DD.Drag({
        node: '#demo'
    });
});
</script>
