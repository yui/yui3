YUI.add('number-tests', function(Y) {
        var ASSERT = Y.Assert,
            ARRAYASSERT = Y.ArrayAssert;


        var testParse = new Y.Test.Case({
            name: "Number Parse Tests",

            testUndefined: function() {
                var number = Y.Number.parse();
                ASSERT.isNull(number, "Expected null.");
            },

            testNull: function() {
                var number = Y.Number.parse(null);
                ASSERT.isNull(number, "Expected null.")
            },

            testEmpty: function() {
                var number = Y.Number.parse("");
                ASSERT.isNull(number, "Expected null.");

                ASSERT.isNull(Y.Number.parse('     '), 'Expected null for a string made only of spaces.');
            },

            testStrings: function() {
                var number = Y.Number.parse("0");
                ASSERT.areSame(0, number, "Incorrect number 0.");

                number = Y.Number.parse("1");
                ASSERT.areSame(1, number, "Incorrect number 1.");

                number = Y.Number.parse("-1");
                ASSERT.areSame(-1, number, "Incorrect number -1.");
            },

            testNumbers: function() {
                var number = Y.Number.parse(0);
                ASSERT.areSame(0, number, "Incorrect number 0.");

                number = Y.Number.parse(1);
                ASSERT.areSame(1, number, "Incorrect number 1.");

                number = Y.Number.parse(-1);
                ASSERT.areSame(-1, number, "Incorrect number -1.");
            },

            testBooleans: function () {
                ASSERT.isNull(Y.Number.parse(true), 'Expected null for `true`.');
                ASSERT.isNull(Y.Number.parse(false), 'Expected null for `false`.');
            },

            testNumberStringCombos: function () {
                ASSERT.isNull(Y.Number.parse('1a'), 'Expected null.');

                ASSERT.isNull(Y.Number.parse('  1 1 '), 'Expected null.');

                ASSERT.areSame(1, Y.Number.parse('   1   '), 'Incorrect number 1.');
            },

            testWithConfig: function () {
                var i, v, values = [
                    ["1234.5", {}, 1234.5],
                    ["1234.5", {
                            decimalSeparator: '.'
                    }, 1234.5],
                    ["$1.234,50", {
                            prefix: '$',
                            decimalSeparator:',',
                            thousandsSeparator: '.'
                    }, 1234.5],
                    [" $ 1.234.567,80 ", {
                            prefix: '$',
                            decimalSeparator:',',
                            thousandsSeparator: '.'
                    }, 1234567.8],
                    [" 1.234,50 € ", {
                            suffix: '€',
                            decimalSeparator:',',
                            thousandsSeparator: '.'
                    }, 1234.5],
                    ["abc 1//234//567--89 def ", {
                            prefix: 'abc',
                            suffix: 'def',
                            decimalSeparator:'--',
                            thousandsSeparator: '//'
                    }, 1234567.89],
                    ["[ 1*234*567|89 ] ", {
                            prefix: '[',
                            suffix: ']',
                            decimalSeparator:'|',
                            thousandsSeparator: '*'
                    }, 1234567.89],
                    ["1234567.89", {
                            prefix: '[',
                            suffix: ']',
                            decimalSeparator:'|',
                            thousandsSeparator: '*'
                    }, 1234567.89],
                    ["123456789", {
                            prefix: '[',
                            suffix: ']',
                            decimalSeparator:'|',
                            thousandsSeparator: '*'
                    }, 123456789]

                ];
                for (i = 0; i < values.length; i +=1) {
                    v = values[i];
                    ASSERT.areSame(v[2],Y.Number.parse(v[0], v[1]),i + ': ' + v[1]  + Y.dump(v[1]));

                }

            },
            testWithConfigFails: function () {
                ASSERT.isNull(Y.Number.parse(null, {}), 'nulls should return null');
                ASSERT.isNull(Y.Number.parse(undefined, {}), 'undefined should return null');
                ASSERT.isNull(Y.Number.parse("", {}), 'empty string should return null');
                ASSERT.isNull(Y.Number.parse("    ", {}), 'non-empty blank string should return null');
                ASSERT.isNull(Y.Number.parse(" asdfa ", {}), 'random characters should return null');
                ASSERT.isNull(Y.Number.parse("$ (USD)", { prefix: '$', suffix: '(USD)' }),'format resulting in empty string should return null');
                ASSERT.isNull(Y.Number.parse("boom,boom", { decimal: ',' }), ' format resulting in random characters should return null');
            }
        });

        var testFormat = new Y.Test.Case({
            name: "Number Format Tests",

            testUndefined: function() {
                var output = Y.Number.format();
                ASSERT.areSame("", output, "Expected empty string.");
            },

            testNull: function() {
                var output = Y.Number.format(null);
                ASSERT.areSame("", output, "Expected empty string.");
            },

            testStrings: function() {
                var output = Y.Number.format("0");
                ASSERT.areSame("0", output, "Incorrect output 0.");

                output = Y.Number.format("1");
                ASSERT.areSame("1", output, "Incorrect output 1.");

                output = Y.Number.format("-1");
                ASSERT.areSame("-1", output, "Incorrect output -1.");
            },

            testNumbers: function() {
                var output = Y.Number.format(0);
                ASSERT.areSame("0", output, "Incorrect output 0.");

                output = Y.Number.format(1);
                ASSERT.areSame("1", output, "Incorrect output 1.");

                output = Y.Number.format(-1);
                ASSERT.areSame("-1", output, "Incorrect output -1.");
            },

            testPrefix: function() {
                var output = Y.Number.format(123, {prefix:"$"});
                ASSERT.areSame("$123", output, "Incorrect prefix.");

                output = Y.Number.format(-123, {prefix:"$"});
                ASSERT.areSame("$-123", output, "Incorrect prefix neg.");
            },

            testSuffix: function() {
                var output = Y.Number.format(123, {suffix:" items"});
                ASSERT.areSame("123 items", output, "Incorrect suffix.");

                output = Y.Number.format(-123, {suffix:" items"});
                ASSERT.areSame("-123 items", output, "Incorrect suffix neg.");
            },

            testDecimalPlaces: function() {
                var output = Y.Number.format(123.123456, {decimalPlaces:5});
                ASSERT.areSame("123.12346", output, "Incorrect decimal rounding to 5 places.");

                output = Y.Number.format(-123.123456, {decimalPlaces:5});
                ASSERT.areSame("-123.12346", output, "Incorrect decimal rounding to 5 places neg.");

                output = Y.Number.format(123.123, {decimalPlaces:5});
                ASSERT.areSame("123.12300", output, "Incorrect decimal padding to 5 places.");

                output = Y.Number.format(-123.123, {decimalPlaces:5});
                ASSERT.areSame("-123.12300", output, "Incorrect decimal padding to 5 places neg.");

                output = Y.Number.format(123, {decimalPlaces:5});
                ASSERT.areSame("123.00000", output, "Incorrect integer padding to 5 places.");

                output = Y.Number.format(-123, {decimalPlaces:5});
                ASSERT.areSame("-123.00000", output, "Incorrect integer padding to 5 places neg.");

                output = Y.Number.format(123.127, {decimalPlaces:2});
                ASSERT.areSame("123.13", output, "Incorrect decimal rounding to 2 places up.");

                output = Y.Number.format(-123.127, {decimalPlaces:2});
                ASSERT.areSame("-123.13", output, "Incorrect decimal rounding to 2 places up neg.");

                output = Y.Number.format(123.123, {decimalPlaces:2});
                ASSERT.areSame("123.12", output, "Incorrect decimal rounding to 2 places down.");

                output = Y.Number.format(-123.123, {decimalPlaces:2});
                ASSERT.areSame("-123.12", output, "Incorrect decimal rounding to 2 places down neg.");

                output = Y.Number.format(123.123, {decimalPlaces:1});
                ASSERT.areSame("123.1", output, "Incorrect decimal rounding to 1 place.");

                output = Y.Number.format(-123.123, {decimalPlaces:1});
                ASSERT.areSame("-123.1", output, "Incorrect decimal rounding to 1 place neg.");

                output = Y.Number.format(123.123, {decimalPlaces:0});
                ASSERT.areSame("123", output, "Incorrect decimal rounding to 0 places.");

                output = Y.Number.format(-123.123, {decimalPlaces:0});
                ASSERT.areSame("-123", output, "Incorrect decimal rounding to 0 places neg.");

                output = Y.Number.format(123.123, {decimalPlaces:-1});
                ASSERT.areSame("123.123", output, "Must ignore decimalPlaces < 0.");

                output = Y.Number.format(-123.123, {decimalPlaces:21});
                ASSERT.areSame("-123.123", output, "Must ignore decimalPlaces > 20.");
            },

            testThousandsSeparator: function() {
                var output = Y.Number.format(123456789, {thousandsSeparator:","});
                ASSERT.areSame("123,456,789", output, "Incorrect thousands separation.");

                output = Y.Number.format(-123456789, {thousandsSeparator:","});
                ASSERT.areSame("-123,456,789", output, "Incorrect thousands separation neg.");

                output = Y.Number.format(12345678, {thousandsSeparator:","});
                ASSERT.areSame("12,345,678", output, "Incorrect thousands separation when (number-of-digits % 3) == 2");

                output = Y.Number.format(1234567, {thousandsSeparator:","});
                ASSERT.areSame("1,234,567", output, "Incorrect thousands separation when (number-of-digits % 3) == 1");

                output = Y.Number.format(-12345678, {thousandsSeparator:","});
                ASSERT.areSame("-12,345,678", output, "Incorrect thousands separation neg. when (number-of-digits % 3) == 2");

                var output = Y.Number.format(12.34, {thousandsSeparator:","});
                ASSERT.areSame("12.34", output, "Incorrect thousands separation when number is short.");

            },

            testComplex: function() {
                var output = Y.Number.format(123456789.176,{
                        prefix: "&#165;",
                        decimalPlaces:2,
                        thousandsSeparator:".",
                        decimalSeparator:","
                    });
                ASSERT.areSame("&#165;123.456.789,18", output, "Incorrect Yen formatting neg.");

                output = Y.Number.format(-123456789.176,{
                        prefix: "&#165;",
                        decimalPlaces:2,
                        thousandsSeparator:".",
                        decimalSeparator:","
                    });
                ASSERT.areSame("&#165;-123.456.789,18", output, "Incorrect Yen formatting neg.");
            }
        });


        var suite = new Y.Test.Suite("Number");
        suite.add(testParse);
        suite.add(testFormat);

        Y.Test.Runner.add(suite);
});
