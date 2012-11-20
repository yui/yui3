var http = require('http');
var server = http.createServer(function (req, res) {
    

    var url = req.url.split('?');

    switch (url[0]) {
        case '/http':
            var qs = url[1].replace('a=', ''),
                state, header;
            switch (qs) {
                case '200':
                    header ='HTTP/1.1 200 OK';
                    state = 'success';
                    break;
                case '204':
                    header = 'HTTP/1.1 204 No Content';
                    break;
                case '304':
                    header = 'HTTP/1.1 304 Not Modified';
                    break;
                case '404':
                    header = 'HTTP/1.1 404 Not Found';
                    state = 'failure';
                    break;
                case '500':
                    header = 'HTTP/1.1 500 Server Error';
                    state = 'failure';
                    break;
                case '999':
                    header = 'HTTP/1.1 999 Unknown';
                    state = 'exception';
                    break;
            }
            var headers = {
                'Content-Type': 'text/plain'
            };

            res.writeHead(parseInt(qs), header, headers);
            res.end(state);

            break;
        case '/delete':
            var body = req.method;
            if (req.method === 'DELETE') {
                body = url[1];
            }
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(body);
            break;
        case '/non':
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
            break;
        case '/post':
            //console.log(req);
            var data = '',
                body = '';
            req.on('data', function(c) {
                data += c;
            });


            req.on('end', function() {
                var qs = require('querystring');
                var b = qs.parse(data);
                if (Object.keys(b).length > 0) {
                    body = b.hello + '&' + b.foo;
                } else {
                    body = ''+Object.keys(b).length;
                }
                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end(body);
            });

            break;
        case '/get':
            
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(url[1]);
            break;
        default: 
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Hello World\n');
    }

});

module.exports = {
    start: function() {
        server.listen(8181);
    },
    stop: function() {
        server.close();
    },
};
