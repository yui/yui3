YUI.add('dd-delegate', function(Y) {

    var D = function(o) {
        D.superclass.constructor.apply(this, arguments);
    },
    dd_cache = {};

    D.NAME = 'delegate';

    D.ATTRS = {
        cont: {
            value: 'body'
        },
        nodes: {
            value: 'dd-draggable'
        }
    };

    Y.extend(D, Y.Base, {
        _dd: null,
        initializer: function() {
            //Create a tmp DD instance under the hood.
            this._dd = new Y.DD.Drag({
                node: Y.Node.create('<div>TEMP</div>'),
                bubbles: this
            });
            //On end drag, detach the listeners
            this._dd.on('drag:end', Y.bind(function() {
                this._dd._unprep();
            }, this));

            //Attach the delegate to the container
            Y.delegate('mousedown', Y.bind(function(e) {
                this._dd.set('node', e.currentTarget).set('dragNode', e.currentTarget);
                this._dd._prep();
                this._dd.fire.call(this._dd, 'drag:mouseDown', { ev: e });
            }, this), this.get('cont'), this.get('nodes'));
        },
        destructor: function() {
            if (this._dd) {
                this._dd.destroy();
            }
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;

}, '@VERSION@' ,{requires:['dd-drag'], skinnable:false});
