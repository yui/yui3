<button id="yui-run">run</button>

<script type="text/javascript">
var Y = YUI().use('*');
var node = Y.get('#yui-run');

var onclick = function(e) {
    alert('you clicked a ' + e.target.get('tagName'));
    node.detach('click', onclick);
};

node.on('click', onclick);
</script>
