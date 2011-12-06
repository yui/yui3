A concurrent parallel processor to help in running several async functions.

    var stack = new Y.Parallel();

    for (var i = 0; i < 15; i++) {
        Y.io('./api/json/' + i, {
            on: {
                success: stack.add(function() {
                    Y.log('Done!');
                })
            }
        });
    }

    stack.done(function() {
        Y.log('All IO requests complete!');
    });

