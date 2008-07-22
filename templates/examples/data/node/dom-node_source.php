<div id="demo">
    <h4>Demo Element</h4>
    <p>This is a demo of Node in action.</p>
    <p>This paragraph will be removed dynamically.</p>
</div>

<script type="text/javascript">
var Y = YUI().use('*');
var node = Y.get('#demo');
var removedNode = node.removeChild(Y.get('#demo p:last-child'));
</script>
