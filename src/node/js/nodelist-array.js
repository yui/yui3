var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = [
        /** Returns a new NodeList combining the given NodeList(s) 
          * @for NodeList
          * @method concat
          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to
          * concatenate to the resulting NodeList
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'concat',
        /** Removes the first last from the NodeList and returns it.
          * @for NodeList
          * @method pop
          * @return {Node} The last item in the NodeList.
          */
        'pop',
        /** Adds the given Node(s) to the end of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the end of the NodeList. 
          */
        'push',
        /** Removes the first item from the NodeList and returns it.
          * @for NodeList
          * @method shift
          * @return {Node} The first item in the NodeList.
          */
        'shift',
        /** Returns a new NodeList comprising the Nodes in the given range. 
          * @for NodeList
          * @method slice
          * @param {Number} begin Zero-based index at which to begin extraction.
          As a negative index, start indicates an offset from the end of the sequence. slice(-2) extracts the second-to-last element and the last element in the sequence.
          * @param {Number} end Zero-based index at which to end extraction. slice extracts up to but not including end.
          slice(1,4) extracts the second element through the fourth element (elements indexed 1, 2, and 3).
          As a negative index, end indicates an offset from the end of the sequence. slice(2,-1) extracts the third element through the second-to-last element in the sequence.
          If end is omitted, slice extracts to the end of the sequence.
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'slice',
        /** Changes the content of the NodeList, adding new elements while removing old elements.
          * @for NodeList
          * @method splice
          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.
          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.
          * {Node | DOMNode| element1, ..., elementN 
          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.
          * @return {NodeList} The element(s) removed.
          */
        'splice',
        /** Adds the given Node(s) to the beginning of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodeN One or more nodes to add to the NodeList. 
          */
        'unshift'
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
