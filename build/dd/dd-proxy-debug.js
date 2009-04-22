YUI.add('dd-proxy', function(Y) {


    /**
     * The Drag & Drop Utility allows you to create a draggable interface efficiently, buffering you from browser-level abnormalities and enabling you to focus on the interesting logic surrounding your particular implementation. This component enables you to create a variety of standard draggable objects with just a few lines of code and then, using its extensive API, add your own specific implementation logic.
     * @module dd
     * @submodule dd-proxy
     */
    /**
     * This plugin for dd-drag is for creating a proxy drag node, instead of dragging the original node.
     * @class DDProxy
     * @extends Base
     * @constructor
     * @namespace plugin     
     */
    var DDM = Y.DD.DDM,
        NODE = 'node',
        DRAG_NODE = 'dragNode',
        PROXY = 'proxy',
        OWNER = 'owner';

    var Proxy = function(config) {
        Proxy.superclass.constructor.apply(this, arguments);
    };
    
    Proxy.NAME = 'DDProxy';
    /**
    * @property proxy
    * @description The Proxy instance will be placed on the Drag instance under the proxy namespace.
    * @type {String}
    */
    Proxy.NS = 'proxy';

    Proxy.ATTRS = {
        /**
        * @attribute moveOnEnd
        * @description Move the original node at the end of the drag. Default: true
        * @type Boolean
        */
        moveOnEnd: {
            value: true
        },
        /**
        * @attribute resizeFrame
        * @description Make the Proxy node assume the size of the original node. Default: true
        * @type Boolean
        */
        resizeFrame: {
            value: true
        },
        /**
        * @attribute positionProxy
        * @description Make the Proxy node appear in the same place as the original node. Default: true
        * @type Boolean
        */
        positionProxy: {
            value: true
        },
        /**
        * @attribute borderStyle
        * @description The default border style for the border of the proxy. Default: 1px solid #808080
        * @type Boolean
        */
        borderStyle: {
            value: '1px solid #808080'
        },
        /**
        * @attribute owner
        * @description The object that this was plugged into.
        * @type Object
        */
        owner: {
            writeOnce: true,
            value: false
        }
    };

    var proto = {
        /**
        * @private
        * @property _proxyHandles
        * @description Holds the event handles for setting the proxy
        */
        _proxyHandles: null,
        /**
        * @private
        * @method _setProxy
        * @description Handler for the proxy config attribute
        */
        _setProxy: function() {
            if (!DDM._proxy) {
                Y.on('event:ready', Y.bind(this._setProxy, this));
                return;
            }
            if (!this._proxyHandles) {
                this._proxyHandles = [];
            }
            var i, h, h1, owner = this.get(OWNER), dnode = owner.get(DRAG_NODE);
            if (dnode.compareTo(owner.get(NODE))) {
                if (DDM._proxy) {
                    owner.set(DRAG_NODE, DDM._proxy);
                }
            }
            for (i in this._proxyHandles) {
                this._proxyHandles[i].detach();
            }
            h = DDM.on('ddm:start', Y.bind(function() {
                if (DDM.activeDrag === owner) {
                    DDM._setFrame(owner);
                }
            }, this));
            h1 = DDM.on('ddm:end', Y.bind(function() {
                if (owner.get('dragging')) {
                    if (this.get('moveOnEnd')) {
                        owner.get(NODE).setXY(owner.lastXY);
                    }
                    owner.get(DRAG_NODE).setStyle('display', 'none');
                }
            }, this));
            this._proxyHandles = [h, h1];
        },
        initializer: function() {
            this._setProxy();
        },
        destructor: function() {
            var owner = this.get(OWNER);
            for (var i in this._proxyHandles) {
                this._proxyHandles[i].detach();
            }
            owner.set(DRAG_NODE, owner.get(NODE));
        }
    };
    
    Y.namespace('plugin');
    Y.extend(Proxy, Y.Base, proto);
    Y.plugin.DDProxy = Proxy;

    //Add a couple of methods to the DDM
    Y.mix(DDM, {
        /**
        * @private
        * @for DDM
        * @method _createFrame
        * @description Create the proxy element if it doesn't already exist and set the DD.DDM._proxy value
        */
        _createFrame: function() {
            if (!Y.DD.DDM._proxy) {
                Y.DD.DDM._proxy = true;

                var p = Y.Node.create('<div></div>'),
                b = Y.Node.get('body');

                p.setStyles({
                    position: 'absolute',
                    display: 'none',
                    zIndex: '999',
                    top: '-999px',
                    left: '-999px'
                });

                b.insertBefore(p, b.get('firstChild'));
                p.set('id', Y.stamp(p));
                p.addClass(Y.DD.DDM.CSS_PREFIX + '-proxy');
                Y.DD.DDM._proxy = p;
            }
        },
        /**
        * @private
        * @for DDM
        * @method _setFrame
        * @description If resizeProxy is set to true (default) it will resize the proxy element to match the size of the Drag Element.
        * If positionProxy is set to true (default) it will position the proxy element in the same location as the Drag Element.
        */
        _setFrame: function(drag) {
            var n = drag.get(NODE), d = drag.get(DRAG_NODE), ah, cur = 'auto';
            if (drag.proxy.get('resizeFrame')) {
                DDM._proxy.setStyles({
                    height: n.get('offsetHeight') + 'px',
                    width: n.get('offsetWidth') + 'px'
                });
            }
            
            ah = DDM.activeDrag.get('activeHandle');
            if (ah) {
                cur = ah.getStyle('cursor');
            }
            if (cur == 'auto') {
                cur = DDM.get('dragCursor');
            }


            d.setStyles({
                visibility: 'hidden',
                display: 'block',
                cursor: cur,
                border: drag.proxy.get('borderStyle')
            });



            if (drag.proxy.get('positionProxy')) {
                d.setXY(drag.nodeXY);
            }
            d.setStyle('visibility', 'visible');
        }
    });

    //Create the frame when DOM is ready
    Y.on('event:ready', Y.bind(Y.DD.DDM._createFrame, Y.DD.DDM));



}, '@VERSION@' ,{requires:['dd-ddm', 'dd-drag'], skinnable:false});
