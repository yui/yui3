<h3>The data</h3>
<p>The data returned from the server will be a JSON string containing this object structure:</p>
<textarea name="code" class="JScript" cols="60" rows="1">
[
    {"SKU":"23-23874", "Price":23.99,  "Item":"Helmet"},
    {"SKU":"48-38835", "Price":14.97,  "Item":"Football"},
    {"SKU":"84-84848", "Price":3.49,   "Item":"Goggles"},
    {"SKU":"84-84843", "Price":183,    "Item":"Badminton Set"},
    {"SKU":"84-39321", "Price":6.79,   "Item":"Tennis Balls"},
    {"SKU":"39-48949", "Price":618,    "Item":"Snowboard"},
    {"SKU":"99-28128", "Price":78.99,  "Item":"Cleats"},
    {"SKU":"83-48281", "Price":4.69,   "Item":"Volleyball"},
    {"SKU":"89-32811", "Price":0.59,   "Item":"Sweatband"},
    {"SKU":"28-22847", "Price":779.98, "Item":"Golf Set"},
    {"SKU":"38-38281", "Price":8.25,   "Item":"Basketball Shorts"},
    {"SKU":"82-38333", "Price":1.39,   "Item":"Lip balm"},
    {"SKU":"21-38485", "Price":0.07,   "Item":"Ping Pong ball"},
    {"SKU":"83-38285", "Price":3.99,   "Item" :"Hockey Puck"}
]
</textarea>

<h3>Create a reviver function</h3>
<p>We'll contain all the moving parts in an <code>example</code> namespace.  In it, we'll include the currency exchange rates and a function to reference the rates to add a new member to the JSON response as it is being parsed.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
YUI(<?php echo($yuiConfig); ?>).use(<?php echo($requiredModules); ?>,function (Y) {

var example = {
    rates : {"USD":1,"EUR":0.6661,...,"COP":2000 ,"ARS":3.1289},

    currency : 'USD', // updated by the select element

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
    ...
};

...
</textarea>

<h3>Sending the request and parsing the JSON response</h3>
<p>When the Get Data button is clicked, we send an <code>io</code> request for the JSON data, and in our success handler, pass our conversion function to <code>JSON.parse</code> with the response text.  The resulting inventory records will have an additional member, <code>convertedPrice</code>.  This data is then passed to a UI method to update the inventory table.</p>
<textarea name="code" class="JScript" cols="60" rows="1">
Y.get('#demo_go').on('click', function (e) {
    // Disable the button temporarily
    this.set('disabled',true);

    // Store the requested currency
    example.currency = Y.get("#demo select").get('value');

    // Send the request for the JSON data
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

}); // End YUI(..).use(..,function (Y) {
</textarea>

<h3>Example markup</h3>
<textarea name="code" class="HTML" cols="60" rows="1">
<div id="demo">
    <p>Choose a currency, then get the data</p>
    <select>
        <option value="ARS">Argentine Peso</option>
        <option value="AUD">Australian Dollar</option>
        ...
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
</textarea>

<h3>Full Code Listing</h3>
<p>Below is the full source for the example, including the functions responsible for formatting the price and updating the UI.</p>

<textarea name="code" class="JScript" cols="60" rows="1">
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

    updateTable : function () {
        // Update the column header
        Y.get('#demo table th span').set('innerHTML',example.currency);

        var tbl   = Y.get('#demo table'),
            html  = ["<tbody>"],i,j = 1,l,item;

        if (example.inventory) {
            for (i = 0, l = example.inventory.length; i < l; ++i) {
                item = example.inventory[i];
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
    example.currency = Y.get("#demo select").get('value');

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
</textarea>
