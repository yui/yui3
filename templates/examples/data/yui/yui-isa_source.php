<table id="demo">
    <thead>
        <tr>
            <th>Data</th>
            <th>isObject</th>
            <th>isArray</th>
            <th>isFunction</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><code>null<code></td>
            <td colspan="3"><input type="button" name="demo-1" id="demo-1" value="check"/></td>
        </tr>
        <tr>
            <td><code>[] or new Array()</code></td>
            <td colspan="3"><input type="button" name="demo-2" id="demo-2" value="check"/></td>
        </tr>
        <tr>
            <td><code>{} or new Object()</code></td>
            <td colspan="3"><input type="button" name="demo-3" id="demo-3" value="check"/></td>
        </tr>
        <tr>
            <td><code>function Foo() {}</code></td>
            <td colspan="3"><input type="button" name="demo-4" id="demo-4" value="check"/></td>
        </tr>
        <tr>
            <td><code>new Foo()</code></td>
            <td colspan="3"><input type="button" name="demo-5" id="demo-5" value="check"/></td>
        </tr>
        <!--
        <tr>
            <td><code>elem.getElementsByTagName('p')</code></td>
            <td colspan="3"><input type="button" name="demo-6" id="demo-6" value="check"/></td>
        </tr>
        <tr>
            <td><code>Y.all('#demo td:foo')</code></td>
            <td colspan="3"><input type="button" name="demo-7" id="demo-7" value="check"/></td>
        </tr>
        -->
    <tbody>
</table>
<script type="text/javascript">
YUI(<?php echo $yuiConfig ?>).use(<?php echo $requiredModules ?>,
// This method is in the core of the library, so we don't have to use() any
// additional modules to access it.  However, this example requires 'node'.
function(Y) {

    var checkType = function (val) {
        return {
            'object'  : Y.Lang.isObject(val),
            'array'   : Y.Lang.isArray(val),
            'function': Y.Lang.isFunction(val)
        };
    };

    var populateRow = function (e, data) {
        var target = e.target;
            cell = target.get('parentNode'),
            row  = cell.get('parentNode');

        row.removeChild(cell);

        var td0 = document.createElement('td'),
            td1 = td0.cloneNode(false),
            td2 = td0.cloneNode(false);

        var results = checkType(data);

        td0.appendChild(document.createTextNode(
            results['object'] ?   'Y' : 'N'));
        td1.appendChild(document.createTextNode(
            results['array'] ?    'Y' : 'N'));
        td2.appendChild(document.createTextNode(
            results['function'] ? 'Y' : 'N'));

        row.appendChild(td0);
        row.appendChild(td1);
        row.appendChild(td2);
    };

    var foo = function () {};
    var f = Y.get('#demo');

    Y.on('click',populateRow, '#demo-1', Y, null);
    Y.on('click',populateRow, '#demo-2', Y, []);
    Y.on('click',populateRow, '#demo-3', Y, {});
    Y.on('click',populateRow, '#demo-4', Y, foo);
    Y.on('click',populateRow, '#demo-5', Y, new foo());
    /*
    // We are working with Nodes and NodeLists now, so the results are not as interesting
    Y.on('click',populateRow, '#demo-6', Y, f.getElementsByTagName('tr'));
    Y.on('click',populateRow, '#demo-7', Y, Y.all('#demo td:foo'));
    */
});
</script>
