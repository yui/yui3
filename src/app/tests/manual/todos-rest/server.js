var fs      = require('fs'),
    combo   = require('combohandler'),
    express = require('express'),

    app      = express.createServer(),
    data     = {},
    yui3Path = __dirname + '/../../../../../';

// *** Collection *** //

function Collection() {
    this._lastId = 0;
    this.items   = {};
}

Collection.prototype = {
    item: function (id) {
        return this.items[id];
    },

    add: function (item) {
        var id = this._generateId();

        item.id        = id;
        this.items[id] = item;

        return item;
    },

    update: function (item) {
        var id = item && item.id;

        if (this.items[id]) {
            this.items[id] = item;
        }
    },

    remove: function (item) {
        var id = item && item.id;
        delete this.items[id];
    },

    toJSON: function () {
        var items      = this.items,
            ids        = Object.keys(items),
            collection = [];

        // Sort Ids.
        ids.sort(function (a, b) {
            return a - b;
        });

        // Put items into a result-set.
        ids.forEach(function (id) {
            collection.push(items[id]);
        });

        return collection;
    },

    _generateId: function () {
        this._lastId++;
        return this._lastId;
    }
};

// *** App *** //

app.configure(function () {
    // Static files.
    app.use(express.static(__dirname + '/public'));
    // Handles parsing HTTP request entitiy bodies from the client.
    app.use(express.bodyParser());
    // Handles requests which use POST instead of PUT or DELETE.
    app.use(express.methodOverride());

    app.use(express.cookieParser());
    app.use(express.session({secret: 'bla bla'}));
    app.use(express.csrf());
});

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

// YUI 3 combo handler.
app.get('/yui3', combo.combine({rootPath: yui3Path}), function (req, res) {
    res.send(res.body, 200);
});

app.all('*', function (req, res, next) {
    console.log('CSRF Token: ' + req.session._csrf);
    next();
});

// Lookup the data collection and set it on the request object and continue.
app.all('/data/:collection/:id?', function (req, res, next) {
    var collection = req.params.collection;
    req.collection = data[collection] || (data[collection] = new Collection());
    next();
});

app.get('/data/:collection', function (req, res) {
    res.json(req.collection);
});

app.post('/data/:collection', function (req, res) {
    res.json(req.collection.add(req.body));
});

// Lookup specific item on a collection and set it on the request then continue,
// or error out with a 404.
app.all('/data/:collection/:id', function (req, res, next) {
    var id   = req.params.id,
        item = req.collection.item(id);

    if (item) {
        req.item = item;
        return next();
    }

    res.send('Cannot find item: ' + id + ' in: ' + req.params.collection, 404);
});

app.get('/data/:collection/:id', function (req, res) {
    res.json(req.item);
});

app.put('/data/:collection/:id', function (req, res) {
    req.collection.update(req.body);
    res.send();
});

app.del('/data/:collection/:id', function (req, res) {
    req.collection.remove(req.item);
    res.send();
});

// Toss a 404 for everything else.
app.get('*', function (req, res) {
    res.send('REST Model Sync Test Server', 404);
});

// Go Go Gadget Server.
app.listen(3000);

// Say what's up with the env.
console.log('YUI 3 at: ' + fs.realpathSync(yui3Path));
console.log('REST Model Sync Test Server running at: http://localhost:3000/');
