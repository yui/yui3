YUI.add('format-numbers-tests', function(Y) {

    var numberFormatTests = new Y.Test.Case({
        name: "Number Format Tests",
                    
        setUp: function() {
            Y.Intl.add(
                "format-numbers",
                "en-US",
                {
                    "USD_currencyISO" : "US Dollar",
                    "USD_currencyPlural" : "US dollars",
                    "USD_currencySingular" : "US dollar",
                    "USD_currencySymbol" : "$",
                    "currencyFormat" : "¤#,##0.00;(¤#,##0.00)",
                    "decimalFormat" : "#,##0.###",
                    "decimalSeparator" : ".",
                    "defaultCurrency" : "USD",
                    "exponentialSymbol" : "E",
                    "groupingSeparator" : ",",
                    "minusSign" : "-",
                    "numberZero" : "0",
                    "percentFormat" : "#,##0%",
                    "percentSign" : "%",
                    "scientificFormat" : "#E0",
                    "currencyPatternPlural" : "{0} {1}",
                    "currencyPatternSingular" : "{0} {1}"
                }
                );
        },
                    
        "Test Currency Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.CURRENCY_STYLE);
                       
            var value = 10000000;
            var result1 = format.format(value);
            var expect1 = "$10,000,000.00";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test ISO Currency Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.ISO_CURRENCY_STYLE);
                       
            var value = 10000000;
            var result1 = format.format(value);
            var expect1 = "US Dollar10,000,000.00";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Number Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.NUMBER_STYLE);
                       
            var value = -10000000;
            var result1 = format.format(value);
            var expect1 = "-10,000,000";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Percent Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.PERCENT_STYLE);
                       
            var value = 0.25;
            var result1 = format.format(value);
            var expect1 = "25%";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Plural Currency Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.PLURAL_CURRENCY_STYLE);
                       
            var value = 10000000;
            var result1 = format.format(value);
            var expect1 = "10,000,000 US dollars";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Scientific Style" : function() {
            var format = new Y.NumberFormat(Y.NumberFormat.STYLES.SCIENTIFIC_STYLE);
                       
            var value = 10000000;
            var result1 = format.format(value);
            var expect1 = "1E7";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = format.parse(result1);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        }
    });

    //Add tests to runner
    var TestRunner = Y.Test.Runner;
    TestRunner.add(numberFormatTests);
});
