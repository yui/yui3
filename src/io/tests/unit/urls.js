YUI.add('io-urls', function (Y) {

    Y.IO.URLS = {
        'http'  : 'echo/status/',
        'get'   : 'echo/get/',
        'delete': 'echo/delete/',
        'post'  : 'echo/post/',
        'non'   : 'echo/status/404',
        'delay' : 'echo/delay/1'
    };

});
