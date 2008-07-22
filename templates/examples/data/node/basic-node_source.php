<div id="demo"></div>

<script type="text/javascript">
var Y = YUI().use('*');
var node = Y.get('#demo');
node.set('innerHTML', 'my parentNode is a ' + node.get('parentNode').get('tagName'));
</script>
