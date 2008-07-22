<style type="text/css">
    #example-out .entry {
        font-family:courier;
    }
    #example-out .entry strong {
        font-weight:bold;
        font-family:arial;
    }
</style>
<script type="text/javascript">
    YUI.namespace("example");
    YUI.example.print = function(msg) {
        var o = document.getElementById("example-out");
        if (o) {
            o.innerHTML += '<div class="entry">' + msg + '</div>';
        }
    }
</script>
