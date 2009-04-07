/**
 * Extended Node interface for managing classNames.
 * @module node
 * @submodule node
 * @for Node
 */

    var methods = [
        /**
         * Determines whether the node has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean} Whether or not the node has the given class. 
         */
        'hasClass',

        /**
         * Adds a class name to the node.
         * @method addClass         
         * @param {String} className the class name to add to the node's class attribute
         * @chainable
         */
        'addClass',

        /**
         * Removes a class name from the node.
         * @method removeClass         
         * @param {String} className the class name to remove from the node's class attribute
         * @chainable
         */
        'removeClass',

        /**
         * Replace a class with another class.
         * If no oldClassName is present, the newClassName is simply added.
         * @method replaceClass  
         * @param {String} oldClassName the class name to be replaced
         * @param {String} newClassName the class name that will be replacing the old class name
         * @chainable
         */
        'replaceClass',

        /**
         * If the className exists on the node it is removed, if it doesn't exist it is added.
         * @method toggleClass  
         * @param {String} className the class name to be toggled
         * @chainable
         */
        'toggleClass'
    ];

    Y.Node.importMethod(Y.DOM, methods);
    Y.NodeList.importMethod(Y.DOM, methods);
