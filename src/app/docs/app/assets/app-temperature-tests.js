YUI.add('app-temperature-tests', function (Y) {

var Assert = Y.Assert,

    fahrenheitSelector = '#fahrenheit',
    celsiusSelector = '#celsius',
    kelvinSelector = '#kelvin',
    fahrenheitNode = Y.one(fahrenheitSelector),
    celsiusNode = Y.one(celsiusSelector),
    kelvinNode = Y.one(kelvinSelector),

    suite = new Y.Test.Suite('Temperature Example Suite');

suite.add(new Y.Test.Case({
    name: 'Example Tests',

    'Converting Fahrenheit temperature': function () {
        Assert.isNotNull(fahrenheitNode, 'Fahrenheit input field not found.');

        fahrenheitNode.focus();
        fahrenheitNode.set('value', '32');

        this.wait(function () {
            Assert.areSame(0, parseFloat(celsiusNode.get('value')),
                'Conversion from Fahrenheit to Celsius');
            Assert.areSame(273.15, parseFloat(kelvinNode.get('value')),
                'Conversion from Fahrenheit to Kelvin');
        }, 500);
    },

    'Converting Celsius temperature': function () {
        Assert.isNotNull(celsiusNode, 'Celsius input field not found.');

        celsiusNode.focus();
        celsiusNode.set('value', '30');

        this.wait(function () {
            Assert.areSame(86, parseFloat(fahrenheitNode.get('value')),
                'Conversion from Celsius to Fahrenheit');
            Assert.areSame(303.15, parseFloat(kelvinNode.get('value')),
                'Conversion from Celsius to Kelvin');
        }, 500);
    },

    'Converting Kelvin temperature': function () {
        Assert.isNotNull(kelvinNode, 'Kelvin input field not found.');

        kelvinNode.focus();
        kelvinNode.set('value', '273.15');

        this.wait(function () {
            Assert.areSame(32, parseFloat(fahrenheitNode.get('value')),
                'Conversion from Kelvin to Fahrenheit');
            Assert.areSame(0, parseFloat(celsiusNode.get('value')),
                'Conversion from Kelvin to Celsius');
        }, 500);
    }

}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['node', 'node-event-simulate']
});

