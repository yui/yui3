/**
 * Extended Node interface for managing classNames.
 * @module node
 * @for Node
 */

    Y.Node.addDOMMethods([
        /**
         * Determines whether an HTMLElement has the given className.
         * @method hasClass
         * @param {String} className the class name to search for
         * @return {Boolean} A boolean value or array of boolean values
         */
        'hasClass',

        /**
         * Adds a class name to a given element or collection of elements.
         * @method addClass         
         * @param {String} className the class name to add to the class attribute
         * @chainable
         */
        'addClass',

        /**
         * Removes a class name from a given element or collection of elements.
         * @method removeClass         
         * @param {String} className the class name to remove from the class attribute
         * @chainable
         */
        'removeClass',

        /**
         * Replace a class with another class for a given element or collection of elements.
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
    ]);
