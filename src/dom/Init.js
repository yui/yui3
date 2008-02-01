(function() {

    var M = function(Y) {
        Y.log(Y.id + ' DOM setup complete) .');
    };

    YUI.add("dom", M, "3.0.0", {
        use: ["domcore", "region", "screen", "style", "domextras"]
    });

})();
