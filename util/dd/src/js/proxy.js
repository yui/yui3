/**
* 3.x DragDrop Proxy
* @module dd-proxy
*/
YUI.add('dd-proxy', function(Y) {
    /**
     * 3.x DragDrop
     * @class Proxy
     * @namespace DD
     * @extends Drag
     * @constructor
     */

    var Proxy = function() {
        Proxy.superclass.constructor.apply(this, arguments);

    };
    Proxy.NAME = 'DDProxy';

    Proxy.ATTRS = {
        moveOnEnd: {
            value: true
        },
        resizeFrame: {
            value: true
        },
        positionProxy: {
            value: true
        }
    };

    Y.extend(Proxy, Y.DD.Drag, {
        /**
        * @private
        * @method _createFrame
        * @description Create the proxy element if it doesn't already exist and set the DD.DDM._proxy value
        */
        _createFrame: function() {
            if (!Y.DD.DDM._proxy) {
                Y.DD.DDM._proxy = true;
                var p = Y.Node.create(['div']),
                bd = Y.Node.get('body');

                p.setStyles({
                    position: 'absolute',
                    display: 'none',
                    backgroundColor: 'red',
                    border: '1px solid #808080'
                });

                if (bd.get('firstChild')) {
                    bd.insertBefore(p, bd.get('firstChild'));
                } else {
                    bd.appendChild(p);
                }
                p.set('id', Y.stamp(p));
                p.addClass('dd-proxy');
                Y.DD.DDM._proxy = p;
            }
        },
        /**
        * @private
        * @method _setFrame
        * @description If resizeProxy is set to true (default) it will resize the proxy element to match the size of the Drag Element.
        * If positionProxy is set to true (default) it will position the proxy element in the same location as the Drag Element.
        */
        _setFrame: function() {
            var n = this.get('node');
            if (this.get('resizeFrame')) {
                Y.DD.DDM._proxy.setStyles({
                    height: n.get('clientHeight') + 'px',
                    width: n.get('clientWidth') + 'px'
                });
            }
            this.get('dragNode').setStyles({
                visibility: 'hidden',
                display: 'block'
            });

            if (this.get('positionProxy')) {
                this.get('dragNode').setXY(this.nodeXY);
            }
            this.get('dragNode').setStyle('visibility', 'visible');
        },
        /**
        * @private
        * @method initializer
        * @description Lifecycle method
        */
        initializer: function() {
            this._createFrame();
        },
        /**
        * @private
        * @method start
        * @description Starts the drag operation and sets the dragNode config option.
        */       
        start: function() {
            if (!this.get('lock')) {
                if (this.get('dragNode').compareTo(this.get('node'))) {
                    this.set('dragNode', Y.DD.DDM._proxy);
                }
            }
            Proxy.superclass.start.apply(this);
            this._setFrame();
        },
        /**
        * @private
        * @method end
        * @description Ends the drag operation, if moveOnEnd is set it will position the Drag Element to the new location of the proxy.
        */        
        end: function() {
            if (this.get('moveOnEnd')) {
                this.get('node').setXY(this.lastXY);
            }
            this.get('dragNode').setStyle('display', 'none');
            Proxy.superclass.end.apply(this);
        },
        /**
        * @method toString
        * @description General toString method for logging
        * @return String name for the object
        */
        toString: function() {
            return Proxy.NAME + ' #' + this.get('node').get('id');
        }
    });
    Y.DD.Proxy = Proxy;

}, '3.0.0', { requires: ['dd-drag'] });
