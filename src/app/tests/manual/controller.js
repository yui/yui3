var express = require('express'),
    app     = express.createServer();

app.configure(function(){
    app.use(express.static(__dirname));
});

app.get('*', function(req, res){
    res.sendfile('controller.html');
});

app.listen(4000);