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
        }
    };

    Y.extend(D, Y.Base, {
        _dd: null,
        initializer: function() {
            //Create a tmp DD instance under the hood.
            this._dd = new Y.DD.Drag({
                node: _tmpNode,
                bubbles: this
            });
            this.addTarget(Y.DD.DDM);
            //On end drag, detach the listeners
            this._dd.on('drag:end', Y.bind(function(e) {
                this.set('lastNode', this._dd.get('node'));
                this._dd._unprep();
                this._dd.set('node', _tmpNode);
                Y.DD.DDM._noShim = false;
            }, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(function(e) {
                Y.DD.DDM._noShim = true;
                this.set('currentNode', e.currentTarget);
                this._dd.set('node', e.currentTarget).set('dragNode', e.currentTarget);
                this._dd._prep();
                this._dd.fire.call(this._dd, 'drag:mouseDown', { ev: e });
            }, this), this.get('cont'), this.get('nodes'));

            Y.on('mouseenter', Y.bind(function() {
                this.set('over', true);
            }, this), this.get('cont'));

            Y.on('mouseleave', Y.bind(function() {
                this.set('over', false);
            }, this), this.get('cont'));
        },
        destructor: function() {
            if (this._dd) {
                this._dd.destroy();
            }
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;

}, '@VERSION@' ,{requires:['dd-drag', 'event-mouseenter'], skinnable:false});
