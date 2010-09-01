YUI.add('perf-db-lg', function (Y) {

var ITERATIONS = 10,
    USESTRICTSANDBOX = false;

function clearDB() {
    window.db.transaction(function(t) {
        t.executeSql('DROP TABLE data', [], function(t, r) {
            done();
        }, function(e) {
            sandbox.log('Error in clearing DB.'+e, 'error', 'sandbox');
            done(false);
        })
    }, function(e) {
        sandbox.log('Error in clearing DB.'+e, 'error', 'sandbox');
        done(false);
    });
}

Y.Performance.addTestGroup({
    name   : 'db (useStrictSandbox=' + USESTRICTSANDBOX + ')',
    suite  : 'Offline Data (>1MB)',
    version: '2010-06-18',

    tests: {
        "Read 1MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,
            asyncSetup: true,
            asyncTeardown: true,
            
            setup: function() {
                if(window.openDatabase) {
                    var data = sandbox.xhrGet('tests/offlinedata-assets/string-1MB.js');

                    if(!data) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }
                    eval(data);

                    if (!window.string) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }

                    try {
                        var db = openDatabase("yui-tests", "1.0", "HTML 5 Database Performance Tests", 5242880); // 2097152
                        if(db) {
                            db.transaction(function(t) {
                                t.executeSql("CREATE TABLE IF NOT EXISTS data (key TEXT, value TEXT)", [], function(t, r) {
                                    t.executeSql("INSERT INTO data (key, value) VALUES (?, ?)", ["string", window.string], function(t, r) {
                                        window.db = db;
                                        done();
                                    }, function(e) {
                                        sandbox.log('Failed to init DB.'+e, 'warn', 'sandbox');
                                        done(false);
                                    });
                                }, function(e) {
                                    sandbox.log('Failed to init DB.'+e, 'warn', 'sandbox');
                                    done(false);
                                });
                            });
                        }
                        else {
                            sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                            done(false);
                        }
                    }
                    catch(e) {
                        sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                        done(false);
                    }
                }
                else {
                    sandbox.log('API not supported.', 'warn', 'sandbox');
                    done(false);
                }
            },

            test: function() {
                window.db.transaction(function(t, r) {
                    t.executeSql("SELECT * FROM data WHERE key = ?", ["string"], function(t, r) {
                        done();
                    }, function(e) {
                        sandbox.log('Error in reading 1MB.'+e, 'error', 'sandbox');
                        done(false);
                    });
                });
            },

            teardown: clearDB

        },

        "Write 1MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,
            asyncSetup: true,
            asyncTeardown: true,
            setup: function() {
                if(window.openDatabase) {
                    var data = sandbox.xhrGet('tests/offlinedata-assets/string-1MB.js');

                    if(!data) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false)
                    }
                    eval(data);

                    if (!window.string) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }

                    try {
                        var db = openDatabase("yui-tests", "1.0", "HTML 5 Database Performance Tests", 5242880); // 2097152
                        if(db) {
                            db.transaction(function(t) {
                                t.executeSql("CREATE TABLE IF NOT EXISTS data (key TEXT, value TEXT)");
                                window.db = db;
                                done();
                            });
                        }
                        else {
                            sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                            return false;
                        }
                    }
                    catch(e) {
                        sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                        return false;
                    }
                }
                else {
                    sandbox.log('API not supported.', 'warn', 'sandbox');
                    done(false);
                }
            },

            test: function() {
                window.db.transaction(function(t, r) {
                    t.executeSql("INSERT INTO data (key, value) VALUES (?, ?)", ["string", window.string], function(t, r) {
                        done();
                    }, function(e) {
                        sandbox.log('Error in writing 1MB.'+e, 'error', 'sandbox');
                        done(false);
                    });
                });
            },

            teardown: clearDB

        },

        "Read 2MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,
            asyncSetup: true,
            asyncTeardown: true,

            setup: function() {
                if(window.openDatabase) {
                    var data = sandbox.xhrGet('tests/offlinedata-assets/string-2MB.js');

                    if(!data) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }
                    eval(data);

                    if (!window.string) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }

                    try {
                        var db = openDatabase("yui-tests", "1.0", "HTML 5 Database Performance Tests", 5242880); // 3145728
                        if(db) {
                            db.transaction(function(t) {
                                t.executeSql("CREATE TABLE IF NOT EXISTS data (key TEXT, value TEXT)", [], function(t, r) {
                                    t.executeSql("INSERT INTO data (key, value) VALUES (?, ?)", ["string", window.string], function(t, r) {
                                        window.db = db;
                                        done();
                                    }, function(e) {
                                        sandbox.log('Failed to init DB.'+e, 'warn', 'sandbox');
                                        done(false);
                                    });
                                }, function(e) {
                                    sandbox.log('Failed to init DB.'+e, 'warn', 'sandbox');
                                    done(false);
                                });
                            });
                        }
                        else {
                            sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                            done(false);
                        }
                    }
                    catch(e) {
                        sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                        done(false);
                    }
                }
                else {
                    sandbox.log('API not supported.', 'warn', 'sandbox');
                    done(false);
                }
            },

            test: function() {
                window.db.transaction(function(t, r) {
                    t.executeSql("SELECT * FROM data WHERE key = ?", ["string"], function(t, r) {
                        done();
                    }, function(e) {
                        sandbox.log('Error in reading 2MB.'+e, 'error', 'sandbox');
                        done(false);
                    });
                });
            },

            teardown: clearDB

        },

        "Write 2MB string": {
            useStrictSandbox: USESTRICTSANDBOX,
            iterations: ITERATIONS,
            asyncSetup: true,
            asyncTeardown: true,

            setup: function() {
                if(window.openDatabase) {
                    var data = sandbox.xhrGet('tests/offlinedata-assets/string-2MB.js');

                    if(!data) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }
                    eval(data);

                    if (!window.string) {
                        sandbox.log('Failed to load test resources.', 'warn', 'sandbox');
                        done(false);
                    }

                    try {
                        var db = openDatabase("yui-tests", "1.0", "HTML 5 Database Performance Tests", 5242880); // 3145728
                        if(db) {
                            db.transaction(function(t) {
                                t.executeSql("CREATE TABLE IF NOT EXISTS data (key TEXT, value TEXT)", [], function(t, r) {
                                    window.db = db;
                                    done();
                                }, function(e) {
                                    console.log('Failed to init DB.'+e, 'warn', 'sandbox');
                                    done(false);
                                });
                            }, function(e) {
                                console.log('Failed to init DB.'+e, 'warn', 'sandbox');
                            });
                        }
                        else {
                            sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                            done(false);
                        }
                    }
                    catch(e) {
                        sandbox.log('Failed to init DB.', 'warn', 'sandbox');
                        done(false);
                    }
                }
                else {
                    sandbox.log('API not supported.', 'warn', 'sandbox');
                    done(false);
                }
            },

            test: function() {
                window.db.transaction(function(t) {
                    t.executeSql("INSERT INTO data (key, value) VALUES (?, ?)", ["string", window.string], function(t, r) {
                        done();
                    }, function(e) {
                        sandbox.log('Error in writing 2MB.'+e, 'error', 'sandbox');
                        done(false);
                    });
                });
            },

            teardown: clearDB

        }
    }
});

}, '@VERSION@', {requires: ['performance']});
