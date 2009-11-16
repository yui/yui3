YUI.add('dd-delegate', function(Y) {


    var D = function(o) {
        D.superclass.constructor.apply(this, arguments);
    },
    _tmpNode = Y.Node.create('<div>Temp Node</div>'),
    dd_cache = {};

    D.NAME = 'delegate';

    D.ATTRS = {
        cont: {
            value: 'body'
        },
        nodes: {
            value: '.dd-draggable'
        },
        lastNode: {
            value: _tmpNode
        },
        currentNode: {
            value: _tmpNode
        },
        over: {
            value: false
        },
        target: {
            value: false
        }
    };

    Y.extend(D, Y.Base, {
        _dd: null,
        _shimState: null,
        initializer: function() {
            //Create a tmp DD instance under the hood.
            this._dd = new Y.DD.Drag({
                node: _tmpNode,
                bubbles: this
            });
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
        syncTargets: function() {
            if (!Y.Plugin.Drop) {
                Y.error('DD.Delegate: Drop Plugin Not Found');
                return;
            }
            if (this.get('target')) {
                var items = Y.one(this.get('cont')).all(this.get('nodes'));
                items.each(function(i) {
                    if (!i.drop) {
                        i.plug(Y.Plugin.Drop, { useShim: true });
                    }
                });

            }
        },
        plugdd: function(cls, conf) {
            this._dd.plug(cls, conf)
        },
        destructor: function() {
            if (this._dd) {
                this._dd.destroy();
            }
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;



}, '@VERSION@' ,{optional:['dd-drop-plugin'], skinnable:false, requires:['dd-drag', 'event-mouseenter']});
