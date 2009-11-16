YUI.add('sortable', function(Y) {

    /**
     * Sortable List.
     * @module sortable
     */     
    /**
     * Sortable Lists.
     * @class Sortable
     * @extends Base
     * @constructor
     */


    var S = function(o) {
        S.superclass.constructor.apply(this, arguments);
    };

    S.NAME = 'sortable';

    S.ATTRS = {
        /**
        * @attribute cont
        * @description A selector query to get the container to listen for mousedown events on. All "nodes" should be a child of this container.
        * @type String
        */    
        cont: {
            value: 'body'
        },
        /**
        * @attribute nodes
        * @description A selector query to get the children of the "container" to make draggable elements from.
        * @type String
        */        
        nodes: {
            value: '.dd-draggable'
        },
        /**
        * @attribute lastNode
        * @description Y.Node instance of the last item dragged.
        * @type Node
        */        
        lastNode: {
            value: false
        },
        /**
        * @attribute currentNode
        * @description Y.Node instance of the currently dragging node.
        * @type Node
        */        
        currentNode: {
            value: false
        },
        /**
        * @attribute over
        * @description Is the mouse currently over the container
        * @type Boolean
        */        
        over: {
            value: false
        },
        /**
        * @attribute target
        * @description Should the items also be a drop target.
        * @type Boolean
        */        
        target: {
            value: false
        }
    };

    Y.extend(S, Y.Base, {
        initializer: function() {
            var del = new Y.DD.Delegate({
                cont: this.get('cont'),
                nodes: this.get('nodes'),
                target: true
            });
            del.plugdd(Y.Plugin.DDProxy, {
                moveOnEnd: false,
                cloneNode: true
            });

            del.on('drag:start', function(e) {
                this.get('lastNode').setStyle('zIndex', '');
                this.get('currentNode').setStyle('zIndex', '999');
            });
            del.on('drag:over', function(e) {
                var sel = e.currentTarget.get('cont') + ' ' + e.currentTarget.get('nodes');
                if (e.drop.get('node').test(sel)) {
                    Y.DD.DDM.swapNode(e.drag, e.drop);
                }
            });
            del.on('drag:end', function(e) {
                this.get('currentNode').setStyles({
                    top: 0,
                    left: 0
                });
            });
        
        },
        destructor: function() {
        }
    });

    Y.Sortable = S;

}, '@VERSION@' ,{requires:['dd-delegate'], skinnable:false});

