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

        fahrenheitNode.set('value', '32');
        fahrenheitNode.simulate('keypress', {keyCode: 48});

        Assert.areSame(0, parseInt(celsiusNode.get('text'), 10),
            'Conversion from Fahrenheit to Celsius');
        Assert.areSame(273.15, parseInt(kelvinNode.get('text'), 10),
            'Conversion from Fahrenheit to Kelvin');
    },

    'Converting Celsius temperature': function () {
        Assert.isNotNull(celsiusNode, 'Celsius input field not found.');

        celsiusNode.set('value', '30');
        celsiusNode.simulate('keypress', {keyCode: 48});

        Assert.areSame(86, parseInt(fahrenheitNode.get('text'), 10),
            'Conversion from Celsius to Fahrenheit');
        Assert.areSame(303.15, parseInt(kelvinNode.get('text'), 10),
            'Conversion from Celsius to Kelvin');
    },

    'Converting Kelvin temperature': function () {
        Assert.isNotNull(kelvinNode, 'Kelvin input field not found.');

        kelvinNode.set('value', '273.15');
        kelvinNode.simulate('keypress', {keyCode: 48});

        Assert.areSame(32, parseInt(fahrenheitNode.get('text'), 10),
            'Conversion from Kelvin to Fahrenheit');
        Assert.areSame(0, parseInt(celsiusNode.get('text'), 10),
            'Conversion from Kelvin to Celsius');
    }

}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['node', 'node-event-simulate']
});

