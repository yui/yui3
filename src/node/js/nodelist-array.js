var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = [
        'concat', 'pop', 'push', 'shift', 'slice', 'splice', 'unshift'
    ];


Y.Array.each(ArrayMethods, function(name) {
    Y_NodeList.prototype[name] = function() {
        var args = [],
            i = 0,
            arg;

        while ((arg = arguments[i++])) { // use DOM nodes/nodeLists 
            args.push(arg._node || arg._nodes || arg);
        }
        return Y.Node.scrubVal(ArrayProto[name].apply(this._nodes, args));
    };
});
