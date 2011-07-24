var Y_NodeList = Y.NodeList,
    ArrayProto = Array.prototype,
    ArrayMethods = {
        /** Returns a new NodeList combining the given NodeList(s) 
          * @for NodeList
          * @method concat
          * @param {NodeList | Array} valueN Arrays/NodeLists and/or values to
          * concatenate to the resulting NodeList
          * @return {NodeList} A new NodeList comprised of this NodeList joined with the input.
          */
        'concat': 1,
        /** Removes the first last from the NodeList and returns it.
          * @for NodeList
          * @method pop
          * @return {Node} The last item in the NodeList.
          */
        'pop': 0,
        /** Adds the given Node(s) to the end of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodes One or more nodes to add to the end of the NodeList. 
          */
        'push': 0,
        /** Removes the first item from the NodeList and returns it.
          * @for NodeList
          * @method shift
          * @return {Node} The first item in the NodeList.
          */
        'shift': 0,
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
        'slice': 1,
        /** Changes the content of the NodeList, adding new elements while removing old elements.
          * @for NodeList
          * @method splice
          * @param {Number} index Index at which to start changing the array. If negative, will begin that many elements from the end.
          * @param {Number} howMany An integer indicating the number of old array elements to remove. If howMany is 0, no elements are removed. In this case, you should specify at least one new element. If no howMany parameter is specified (second syntax above, which is a SpiderMonkey extension), all elements after index are removed.
          * {Node | DOMNode| element1, ..., elementN 
          The elements to add to the array. If you don't specify any elements, splice simply removes elements from the array.
          * @return {NodeList} The element(s) removed.
          */
        'splice': 1,
        /** Adds the given Node(s) to the beginning of the NodeList. 
          * @for NodeList
          * @method push
          * @param {Node | DOMNode} nodes One or more nodes to add to the NodeList. 
          */
        'unshift': 0
    };


Y.Object.each(ArrayMethods, function(returnNodeList, name) {
    Y_NodeList.prototype[name] = function() {
        var args = [],
            i = 0,
            arg,
            ret;

        while (typeof (arg = arguments[i++]) != 'undefined') { // use DOM nodes/nodeLists 
            args.push(arg._node || arg._nodes || arg);
        }

        ret = ArrayProto[name].apply(this._nodes, args);

        if (returnNodeList) {
            ret = Y.all(ret);
        } else {
            ret = Y.Node.scrubVal(ret);
        }

        return ret;
    };
});
