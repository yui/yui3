var addClass, hasClass, removeClass;

// Some old browers don't support classList, fallbacks use className property
var _hasClassList = Y.config.doc && 'classList' in Y.config.doc.body;

Y.mix(Y.DOM, {
    /**
     * Determines whether a DOM element has the given className.
     * @method hasClass
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to search for
     * @return {Boolean} Whether or not the element has the given class. 
     */
    hasClass: _hasClassList ? function (node, className) {
        var re = Y.DOM._getRegExp('[^\\s]+(?:\\s+|$)','g');
        if (className && re.test(className)){
            re.lastIndex = 0;
            var classes = className.match(re);
            for (var i=0; i < classes.length; i++){
                if (!node.classList.contains(classes[i].trim())){
                    return false;
                }
            }
            return true;
        }
        return false
    } : function (node, className) {
        var re = Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
        return re.test(node.className);
    },

    /**
     * Adds a class name to a given DOM element.
     * @method addClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to add to the class attribute
     */
    addClass: _hasClassList ? function (node, className) {
        var re = Y.DOM._getRegExp('[^\\s]+(?:\\s+|$)','g');
        if (className && re.test(className)){
            re.lastIndex = 0;
            var classes = className.match(re);
            for (var i=0; i < classes.length; i++){
                classes[i] = classes[i].trim();
                if (!Y.DOM.hasClass(node, classes[i])){ // skip if already present
                    node.classList.add(classes[i]);
                }
            }
        }
    } : function (node, className) {
        if (!Y.DOM.hasClass(node, className)){ // skip if already present
            node.className = Y.Lang.trim([node.className, className].join(' '));
        }
    },

    /**
     * Removes a class name from a given element.
     * @method removeClass         
     * @for DOM
     * @param {HTMLElement} element The DOM element. 
     * @param {String} className the class name to remove from the class attribute
     */
    removeClass: _hasClassList ? function (node, className) {
        var re = Y.DOM._getRegExp('[^\\s]+(?:\\s+|$)','g');
        if (className && re.test(className)){
            re.lastIndex = 0;
            var classes = className.match(re);
            for (var i=0; i < classes.length; i++){
                classes[i] = classes[i].trim();
                if (classes[i] && hasClass(node, classes[i])) {
                    node.classList.remove(classes[i]);
                }
            }
        }
    } : function (node, className) {
        if (className && hasClass(node, className)) {
            node.className = Y.Lang.trim(node.className.replace(Y.DOM._getRegExp('(?:^|\\s+)' + className + '(?:\\s+|$)'), ' '));
        }
        if ( hasClass(node, className) ) { // in case of multiple adjacent
            removeClass(node, className);
        }
    },

    /**
     * Replace a class with another class for a given element.
     * If no oldClassName is present, the newClassName is simply added.
     * @method replaceClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element 
     * @param {String} oldClassName the class name to be replaced
     * @param {String} newClassName the class name that will be replacing the old class name
     */
    replaceClass: function(node, oldC, newC) {
        //Y.log('replaceClass replacing ' + oldC + ' with ' + newC, 'info', 'Node');
        removeClass(node, oldC); // remove first in case oldC === newC
        addClass(node, newC);
    },

    /**
     * If the className exists on the node it is removed, if it doesn't exist it is added.
     * @method toggleClass  
     * @for DOM
     * @param {HTMLElement} element The DOM element
     * @param {String} className the class name to be toggled
     * @param {Boolean} addClass optional boolean to indicate whether class
     * should be added or removed regardless of current state
     */
    toggleClass: function(node, className, force) {
        var add = (force !== undefined) ? force :
                !(hasClass(node, className));

        if (add) {
            addClass(node, className);
        } else {
            removeClass(node, className);
        }
    }
});

hasClass = Y.DOM.hasClass;
removeClass = Y.DOM.removeClass;
addClass = Y.DOM.addClass;

