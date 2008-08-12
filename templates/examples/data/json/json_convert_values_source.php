<div id="demo">
    <p>Choose a currency, then get the data</p>
    <select>
        <option value="ARS">Argentine Peso</option>
        <option value="AUD">Australian Dollar</option>
        <option value="BRL">Brazilian Real</option>
        <option value="GBP">British Pound</option>
        <option value="CAD">Canadian Dollar</option>
        <option value="CNY">Chinese Yuan</option>
        <option value="COP">Colombian Peso</option>
        <option value="HRK">Croatian Kuna</option>
        <option value="CZK">Czech Koruna</option>
        <option value="DKK">Danish Krone</option>
        <option value="EEK">Estonian Kroon</option>
        <option value="EUR">Euro</option>
        <option value="HKD">Hong Kong Dollar</option>
        <option value="HUF">Hungarian Forint</option>
        <option value="ISK">Iceland Krona</option>
        <option value="INR">Indian Rupee</option>
        <option value="JPY">Japanese Yen</option>
        <option value="KRW">Korean Won</option>
        <option value="LVL">Latvian Lat</option>
        <option value="LTL">Lithuanian Lita</option>
        <option value="MYR">Malaysian Ringgit</option>
        <option value="MXN">Mexican Peso</option>
        <option value="NZD">New Zealand Dollar</option>
        <option value="NOK">Norwegian Krone</option>
        <option value="PHP">Philippine Peso</option>
        <option value="PLN">Polish Zloty</option>
        <option value="RUB">Russian Rouble</option>
        <option value="SGD">Singapore Dollar</option>
        <option value="SKK">Slovak Koruna</option>
        <option value="ZAR">South African Rand</option>
        <option value="LKR">Sri Lanka Rupee</option>
        <option value="SEK">Swedish Krona</option>
        <option value="TRY">Turkey Lira</option>
        <option value="USD" selected="selected">U.S. Dollar</option>
        <option value="CHF">Swiss Franc</option>
        <option value="TWD">Taiwan Dollar</option>
        <option value="THB">Thai Baht</option>
    </select>
    <input type="button" id="demo_go" value="Get Data">

    <table cellspacing="0">
    <caption>Inventory</caption>
    <thead>
        <tr>
            <th>SKU</th>
            <th>Item</th>
            <th>Price (USD)</th>
            <th>Price (<span>USD</span>)</th>
        </tr>
    </thead>
    <tbody>
        <tr><td colspan="4">Click <em>Get Data</em></td></tr>
    </tbody>
    </table>
</div>

<script type="text/javascript">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

var example = {
    rates : {"USD":1,"EUR":0.6661,"GBP":0.5207,"AUD":1.1225,"BRL":1.609,"NZD":1.4198,"CAD":1.0667,"CHF":1.0792,"CNY":6.8587 ,"DKK":4.9702,"HKD":7.8064,"INR":42.0168,"JPY":109.8901,"KRW":1000,"LKR":107.5269,"MXN":10.1317,"MYR" :3.3167,"NOK":5.3277,"SEK":6.2617,"SGD":1.4073,"THB":33.7838,"TWD":31.1526,"VEF":2.1445,"ZAR":7.6923 ,"BGN":1.3028,"CZK":16.0514,"EEK":10.4275,"HUF":158.7302,"LTL":2.2999,"LVL":0.4692,"PLN":2.1758,"RON" :2.3804,"SKK":20.2429,"ISK":4.8008,"HRK":81.3008,"RUB":24.3309,"TRY":1.1811,"PHP":44.2478,"COP":2000 ,"ARS":3.1289},

    currency : 'USD',

    formatCurrency : function (amt) {
        amt += amt % 1 ? "0" : ".00";
        return amt.substr(0,amt.indexOf('.')+3);
    },

    convert : function (k,v) {
        // 'this' will refer to the object containing the key:value pair,
        // so this will add a new object member while leaving the original
        // in tact (but formatted to two decimal places).  If the original
        // is not needed, just return the converted value.
        if (k === 'Price') {
            var x = Math.round(v * example.rates[example.currency] * 100) / 100;
            this.convertedPrice = example.formatCurrency(x); // added to item
            return example.formatCurrency(v); // assigned to item.Price
        }
        return v;
    },

    updateTable : function (inventory) {
        // Update the column header
        Y.get('#demo table th span').set('innerHTML',example.currency);

        var tbl   = Y.get('#demo table'),
            html  = ["<tbody>"],i,j = 1,l,item;

        if (inventory) {
            for (i = 0, l = inventory.length; i < l; ++i) {
                item = inventory[i];
                html[j++] = '<tr><td>';
                html[j++] = item.SKU;
                html[j++] = '</td><td>';
                html[j++] = item.Item;
                html[j++] = '</td><td>';
                html[j++] = item.Price;
                html[j++] = '</td><td>';
                html[j++] = item.convertedPrice;
                html[j++] = '</td></tr>';
            }
        } else {
            html = [
                '<tbody><tr><td colspan="4">No Inventory data</td></tr></tbody>'
            ];
        }
        html[j] = "</tbody>";

        tbl.replaceChild(Y.Node.create(html.join('')),tbl.query('tbody'));
    }
};

Y.get('#demo_go').on('click', function (e) {
    // Disable the button temporarily
    this.set('disabled',true);

    // Store the requested currency
    var sel = Y.get("#demo select");
    example.currency = sel.get('value');
    //example.currency = sel.get('options').item(sel.get("selectedIndex")).get('value');

    Y.io('<?php echo($assetsDirectory) ?>data.php',{
        timeout : 3000,
        on : {
            success : function (xid, res) {
                var inventory;
                try {
                    inventory = Y.JSON.parse(res.responseText,example.convert);

                    example.updateTable(inventory);
                }
                catch(e) {
                    alert("Error getting inventory data");
                }
                finally {
                    Y.get('#demo_go').set('disabled',false);
                }
            },
            failure : function () {
                alert("Error getting inventory data");
            }
        }
    });
});

// Expose example objects for inspection
YUI.example = example;
});
</script>
</script>
