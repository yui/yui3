YUI.add('module-tests', function(Y) {

    var numberFormatTests = new Y.Test.Case({
        name: "Number Format Tests",
                    
        "Test Currency Style" : function() {
            var config = {
                style: "CURRENCY_STYLE"
            };           
            
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "$10,000,000";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test ISO Currency Style" : function() {
            var config = {
                style:  "ISO_CURRENCY_STYLE"
            };

            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "USD10,000,000";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Number Style" : function() {
            var config = {
                style: "NUMBER_STYLE"
            };
                       
            var value = -10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "-10,000,000";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Percent Style" : function() {
            var config = {
                style: "PERCENT_STYLE"
            };
            
            var value = 0.25;
            var result1 = Y.Number.format(value, config);
            var expect1 = "25%";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Plural Currency Style" : function() {
            var config = {
                style: "PLURAL_CURRENCY_STYLE"
            };
                       
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "10,000,000 US dollars";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        },
                    
        "Test Scientific Style" : function() {
            var config = {
                style: "SCIENTIFIC_STYLE"
            };
                       
            var value = 10000000;
            var result1 = Y.Number.format(value, config);
            var expect1 = "1E7";
                        
            Y.Assert.areEqual(expect1, result1, "Unexpected result on format");
                        
            var result2 = Y.Number.parse(result1, config);
            Y.Assert.areEqual(value, result2, "Unexpected result on parse");
        }
    });

    Y.Test.Runner.add(numberFormatTests);

},'', { requires: [ 'test', 'datatype-number-format-advanced' ] });
