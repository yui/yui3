<ul id="demo">
   <li>item 1</li> 
   <li>item 2</li> 
   <li>item 3</li> 
   <li>item 4</li> 
   <li>item 5</li> 
</ul>
<button id="yui-run">run</button>

<script type="text/javascript">
var Y = YUI().use('*');
var nodelist = Y.all('#demo li');

Y.get('#yui-run').on('click', function() {
    nodelist.set('innerHTML', 'updated via NodeList');
});
</script>
