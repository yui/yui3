YUI.add('dd-base', function(Y) {
    
    var old;

    /*
    This file just tells DD to delete the original _pg
    reference in the DDM so that code that executes to
    create it will create it and be tested.
    */
    Y.use('dd-tests', function() {
        if (!old) {
            old = Y.DD.DDM._pg_activate;
            Y.DD.DDM._pg_activate = function() {
                delete this._pg;
                old.apply(this, arguments);
            };
        }
        Y.Test.Runner.run();
    });

});
