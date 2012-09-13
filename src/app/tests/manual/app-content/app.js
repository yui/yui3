YUI().use('app-base', 'app-content', function (Y) {

    var app = new Y.App({
        transitions  : true,
        serverRouting: true,

        viewContainer  : '#container',
        contentSelector: '#container',

        routes: [
            {path: '*', callbacks: Y.App.Content.route}
        ]
    });

    app.render().showContent('#container > .view', {transition: false});
    app.get('container').append('<p>App Created: ' + new Date() + '</p>');

});
