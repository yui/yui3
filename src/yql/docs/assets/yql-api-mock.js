YUI.add('yql-api-mock', function (Y) {
    Y.YQL = function (query, callback) {    
        var description = '<img src="http://l.yimg.com/a/i/us/we/52/34.gif"/><br />'
            + '<b>Current Conditions:</b><br />'
            + 'Fair, 60 F<BR />'
            + '<BR /><b>Forecast:</b><BR />'
            + 'Wed - Partly Cloudy. High: 67 Low: 46<br />'
            + 'Thu - Partly Cloudy. High: 67 Low: 46<br />'
            + 'Fri - Sunny. High: 73 Low: 48<br />'
            + 'Sat - Partly Cloudy. High: 72 Low: 48<br />'
            + 'Sun - Sunny. High: 75 Low: 48<br />'
            + '<br />'
            + '<a href="http://us.rd.yahoo.com/dailynews/rss/weather/Beverly_Hills__CA/*http://weather.yahoo.com/forecast/USCA0090_f.html">Full Forecast at Yahoo! Weather</a><BR/><BR/>'
            + '(provided by <a href="http://www.weather.com" >The Weather Channel</a>)<br/>',

        data = {
            query: {
                results: {
                    photo: [
                        {owner: 'ydn', id: 10932328555, server: 3692, secret: '0b012d3583'},
                        {owner: 'ydn', id: 10932577016, server: 5515, secret: '9690dcee11'},
                        {owner: 'ydn', id: 10877691073, server: 7339, secret: 'cf41a86624'},
                        {owner: 'ydn', id: 10716886094, server: 3758, secret: 'f13aab27c9'},
                        {owner: 'ydn', id: 10715972973, server: 5515, secret: '3e7ba7e431'},
                        {owner: 'ydn', id: 10714186855, server: 7365, secret: 'c6395b3cfe'},
                        {owner: 'ydn', id: 10714260636, server: 5538, secret: 'be8cc2a34a'},
                        {owner: 'ydn', id: 10933711513, server: 3824, secret: '80bbaff4e6'},
                        {owner: 'ydn', id: 10933495534, server: 5526, secret: '9c7a62e399'},
                        {owner: 'ydn', id: 10932363034, server: 3685, secret: '50922e6b93'}
                    ],
                    channel: {
                        item: {
                            description: description
                        }
                    }
                }
            }
        };

        if (typeof callback !== 'function') {
            callback = callback.on.success;
        }
        
        callback(data);
        
        return {
            send: function () {
                callback(data);             
            }
        };
    };
});