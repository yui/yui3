YUI.add("yui", function(Y) {
    Y.log(Y.id + ' setup complete) .');
} , "3.0.0", {
    // the following will be bound automatically when this code is loaded
    use: ["lang", "array", "core", "object", "ua", "dump", "substitute", "later", "compat", 
          "event-target", "event-custom", "event-dom", "event-facade", "event-ready", "dom", 
          "io", "get"]
});

// Bind the core modules to the YUI global
YUI._setup();
