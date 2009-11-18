YUI.add('dd-delegate', function(Y) {

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
        * @description Y.Node instance of the dd node.
        * @type Node
        */        
        currentNode: {
            value: _tmpNode
        },
        /**
        * @attribute dragNode
        * @description Y.Node instance of the dd dragNode.
        * @type Node
        */        
        dragNode: {
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
        },
        dragConfig: {
            value: null
        }
    };

    Y.extend(D, Y.Base, {
        /**
        * @property dd
        * @description A reference to the temporary dd instance used under the hood.
        */    
        dd: null,
        /**
        * @property _shimState
        * @private
        * @description The state of the Y.DD.DDM._noShim property to it can be reset.
        */    
        _shimState: null,
        initializer: function() {
            //Create a tmp DD instance under the hood.
            var conf = this.get('dragConfig') || {};
            conf.node = _tmpNode.cloneNode(true);
            conf.bubbles = this;

            this.dd = new Y.DD.Drag(conf);

            //Set this as the target
            this.addTarget(Y.DD.DDM);

            //On end drag, detach the listeners
            this.dd.after('drag:end', Y.bind(function(e) {
                Y.DD.DDM._noShim = this._shimState;
                this.set('lastNode', this.dd.get('node'));
                this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
                this.dd._unprep();
                
                this.dd.set('node', _tmpNode);

            }, this));

            this.dd.on('dragNodeChange', Y.bind(function(e) {
                this.set('dragNode', e.newVal);
            }, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(function(e) {
                this._shimState = Y.DD.DDM._noShim;
                Y.DD.DDM._noShim = true;
                this.set('currentNode', e.currentTarget);
                this.dd.set('node', e.currentTarget);
                if (this.dd.proxy) {
                    this.dd.set('dragNode', Y.DD.DDM._proxy);
                } else {
                    this.dd.set('dragNode', e.currentTarget);
                }
                this.dd._prep();
                this.dd.fire.call(this.dd, 'drag:mouseDown', { ev: e });
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
                var items = Y.one(this.get('cont')).all(this.get('nodes')),
                    dc = this.get('dragConfig');

                items.each(function(i) {
                    if (!i.drop) {
                        var config = {
                            useShim: false,
                            bubbles: this
                        };
                        if (dc && dc.groups) {
                            config.groups = dc.groups;
                        }
                        i.plug(Y.Plugin.Drop, config);
                    } else {
                        if (dc && dc.groups) {
                            i.drop.set('groups', this.dd.get('groups'));
                        }
                    }
                }, this);
            }
            return this;
        },
        //TODO
        plugdd: function(cls, conf) {
            this.dd.plug(cls, conf);
            return this;
        },
        destructor: function() {
            if (this.dd) {
                this.dd.destroy();
            }
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;

}, '@VERSION@' ,{requires:['dd-drag', 'event-mouseenter'], skinnable:false});
