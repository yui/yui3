
    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation. This component enables you to create a variety of standard draggable objects with just a few lines of code and then, using its extensive API, add your own specific implementation logic.
     * @module dd
     * @submodule dd-delegate
     */     
    /**
     * This class provides the ability to drag multiple nodes under a container element.
     * @class Delegate
     * @extends Base
     * @constructor
     * @namespace DD
     */


    var D = function(o) {
        D.superclass.constructor.apply(this, arguments);
    },
    _tmpNode = Y.Node.create('<div>Temp Node</div>');

    D.NAME = 'delegate';

    D.ATTRS = {
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
            value: _tmpNode
        },
        /**
        * @attribute currentNode
        * @description Y.Node instance of the currently dragging node.
        * @type Node
        */        
        currentNode: {
            value: _tmpNode
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

    Y.extend(D, Y.Base, {
        /**
        * @property _dd
        * @description A reference to the temporary dd instance used under the hood.
        */    
        _dd: null,
        /**
        * @property _shimState
        * @description The state of the Y.DD.DDM._noShim property to it can be reset.
        */    
        _shimState: null,
        initializer: function() {
            //Create a tmp DD instance under the hood.
            this._dd = new Y.DD.Drag({
                node: _tmpNode,
                bubbles: this
            });

            //Set this as the target
            this.addTarget(Y.DD.DDM);

            //On end drag, detach the listeners
            this._dd.on('drag:end', Y.bind(function(e) {
                Y.DD.DDM._noShim = this._shimState;
                this.set('lastNode', this._dd.get('node'));
                this._dd._unprep();
                this._dd.set('node', _tmpNode);
            }, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(function(e) {
                this._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
                this.set('currentNode', e.currentTarget);
                this._dd.set('node', e.currentTarget);
                if (this._dd.proxy) {
                    this._dd.set('dragNode', Y.DD.DDM._proxy);
                } else {
                    this._dd.set('dragNode', e.currentTarget);
                }
                this._dd._prep();
                this._dd.fire.call(this._dd, 'drag:mouseDown', { ev: e });
            }, this), this.get('cont'), this.get('nodes'));

            Y.on('mouseenter', Y.bind(function() {
                this._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
            }, this), this.get('cont'));

            Y.on('mouseleave', Y.bind(function() {
                Y.DD.DDM._noShim = this._shimState;
            }, this), this.get('cont'));

            this.syncTargets();
        },
        /**
        * @method syncTargets
        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @return {Self}
        * @chainable
        */        
        syncTargets: function() {
            if (!Y.Plugin.Drop) {
                Y.error('DD.Delegate: Drop Plugin Not Found');
                return;
            }
            if (this.get('target')) {
                var items = Y.one(this.get('cont')).all(this.get('nodes'));
                items.each(function(i) {
                    if (!i.drop) {
                        i.plug(Y.Plugin.Drop, { useShim: false, bubbles: this });
                    }
                });
            }
            return this;
        },
        //TODO
        plugdd: function(cls, conf) {
            this._dd.plug(cls, conf);
            return this;
        },
        destructor: function() {
            if (this._dd) {
                this._dd.destroy();
            }
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;

