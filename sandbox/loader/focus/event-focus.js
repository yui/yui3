YUI().use("event-focus", function(Y) {
    Y.one('body').setContent('Y instance in the iframe is ready!');

    setTimeout(function() {
        console.warn('Creating second instance');
        YUI({
            bootstrap: false,
            win: Y.config.win.parent.window,
            doc: Y.config.win.parent.window.document
        }).use("event-focus", function(X) {
            X.one('body').append('<p>Y instance in the parent is ready!</p>');
            X.one("input").on("focus",  function(e) {
                console.log("Does this work?");
                e.halt();
                console.log("If you see this, then yes it worked!");
            });
        });
    }, 3000);
});
