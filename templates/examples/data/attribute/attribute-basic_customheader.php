<style type="text/css">
    #example-out .entry {
        font-family:courier;
        margin-top:2px;
    }

    #example-out .header {
        font-weight:bold;
        font-family:arial;
        color:#8dd5e7;
        margin-top:10px;
        margin-bottom:3px;
    }

    #example-out {
        overflow:auto;
        border:1px solid #000;
        color:#ffffff;
        background-color:#004C6D;
        margin:5px;
        height:20em;
        width:30em;
        padding:2px;
    }

</style>
<script type="text/javascript">
    YUI.namespace("example");
    YUI.example.print = function(msg, cl) {
        var o = document.getElementById("example-out");
        if (o) {
            cl = cl || "";
            o.innerHTML += '<div class="entry ' + cl + '">' + msg + '</div>';
        }
    }
</script>
