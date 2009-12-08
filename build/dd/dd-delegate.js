YUI.add('dd-delegate', function(Y) {


    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation. This component enables you to create a variety of standard draggable objects with just a few lines of code and then, using its extensive API, add your own specific implementation logic.
     * @module dd
     * @submodule dd-delegate
     */     
    /**
     * This class provides the ability to drag multiple nodes under a container element using only one Y.DD.Drag instance as a delegate.
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
        /**
        * @attribute dragConfig
        * @description The default config to be used when creating the DD instance.
        * @type Object
        */        
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
        /**
        * @private
        * @method _handleNodeChange
        * @description Listens to the nodeChange event and sets the dragNode on the temp dd instance.
        * @param {Event} e The Event.
        */
        _handleNodeChange: function(e) {
            this.set('dragNode', e.newVal);
        },
        /**
        * @private
        * @method _handleDragEnd
        * @description Listens for the drag:end event and updates the temp dd instance.
        * @param {Event} e The Event.
        */
        _handleDragEnd: function(e) {
            Y.DD.DDM._noShim = this._shimState;
            this.set('lastNode', this.dd.get('node'));
            this.get('lastNode').removeClass(Y.DD.DDM.CSS_PREFIX + '-dragging');
            this.dd._unprep();
            this.dd.set('node', _tmpNode);
        },
        /**
        * @private
        * @method _handleDelegate
        * @description The callback for the Y.DD.Delegate instance used
        * @param {Event} e The MouseDown Event.
        */
        _handleDelegate: function(e) {
            if (e.currentTarget.test(this.get('nodes'))) {
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
            }
        },
        /**
        * @private
        * @method _handleMouseEnter
        * @description Sets the target shim state
        * @param {Event} e The MouseEnter Event
        */
        _handleMouseEnter: function(e) {
            this._shimState = Y.DD.DDM._noShim;
            Y.DD.DDM._noShim = true;
        },
        /**
        * @private
        * @method _handleMouseLeave
        * @description Resets the target shim state
        * @param {Event} e The MouseLeave Event
        */
        _handleMouseLeave: function(e) {
            Y.DD.DDM._noShim = this._shimState;
        },
        initializer: function() {
            //Create a tmp DD instance under the hood.
            var conf = this.get('dragConfig') || {};
            conf.node = _tmpNode.cloneNode(true);
            conf.bubbles = this;

            this.dd = new Y.DD.Drag(conf);

            //Set this as the target
            this.addTarget(Y.DD.DDM);

            //On end drag, detach the listeners
            this.dd.after('drag:end', Y.bind(this._handleDragEnd, this));
            this.dd.on('dragNodeChange', Y.bind(this._handleNodeChange, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(this._handleDelegate, this), this.get('cont'), this.get('nodes'));

            Y.on('mouseenter', Y.bind(this._handleMouseEnter, this), this.get('cont'));

            Y.on('mouseleave', Y.bind(this._handleMouseLeave, this), this.get('cont'));

            this.syncTargets();
            Y.DD.DDM.regDelegate(this);
        },
        /**
        * @method syncTargets
        * @description Applies the Y.Plugin.Drop to all nodes matching the cont + nodes selector query.
        * @param {String} group The default group to assign this target to. Optional.
        * @return {Self}
        * @chainable
        */        
        syncTargets: function(group) {
            if (!Y.Plugin.Drop) {
                Y.error('DD.Delegate: Drop Plugin Not Found');
                return;
            }
            if (this.get('target')) {
                var items = Y.one(this.get('cont')).all(this.get('nodes')),
                    groups = this.dd.get('groups');

                if (group) {
                    groups = [group];
                }

                items.each(function(i) {
                    this.createDrop(i, groups);
                }, this);
            }
            return this;
        },
        /**
        * @method createDrop
        * @description Apply the Drop plugin to this node
        * @param {Node} node The Node to apply the plugin to
        * @param {Array} groups The default groups to assign this target to.
        * @return Node
        */
        createDrop: function(node, groups) {
            var config = {
                useShim: false,
                bubbles: this
            };

            if (!node.drop) {
                node.plug(Y.Plugin.Drop, config);
            }
            node.drop.set('groups', groups);
            return node;
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
            if (Y.Plugin.Drop) {
                var targets = Y.one(this.get('cont')).all(this.get('nodes'));
                targets.each(function(node) {
                    node.drop.destroy();
                    node.unplug(Y.Plugin.Drop);
                });
            }
        }
    });

    Y.mix(Y.DD.DDM, {
        /**
        * @private
        * @for DDM
        * @property _delegates
        * @description Holder for all Y.DD.Delegate instances
        * @type Array
        */
        _delegates: [],
        /**
        * @for DDM
        * @method regDelegate
        * @description Register a Delegate with the DDM
        */
        regDelegate: function(del) {
            this._delegates.push(del);
        },
        /**
        * @for DDM
        * @method getDelegate
        * @description Get a delegate instance from a container node
        * @returns Y.DD.Delegate
        */
        getDelegate: function(node) {
            var del = null;
            node = Y.one(node);
            Y.each(this._delegates, function(v) {
                if (node.test(v.get('cont'))) {
                    del = v;
                }
            }, this);
            return del;
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;



}, '@VERSION@' ,{skinnable:false, optional:['dd-drop-plugin'], requires:['dd-drag', 'event-mouseenter']});
