YUI.add('dd-delegate', function(Y) {

    D = function(o) {
        D.superclass.constructor.apply(this, arguments);
    };

    D.NAME = 'delegate';

    D.ATTRS = {
        cont: {
            value: null
        },
        nodes: {
            value: null
        },
        handles: {
            value: []
        }
    };

    Y.extend(D, Y.Base, {
        _dd: null,
        initializer: function() {
            this._dd = new Y.DD.Drag({
                node: Y.Node.create('<div>TEMP</div>'),
                bubbles: this
            });
            this._dd.on('drag:end', Y.bind(function() {
                this._dd._unprep();
            }, this));

            Y.delegate('mousedown', Y.bind(function(e) {
                this._dd.set('node', e.currentTarget).set('dragNode', e.currentTarget);
                this._dd._prep();
                this._dd.fire.call(this._dd, 'drag:mouseDown', { ev: e });
            }, this), this.get('cont'), this.get('nodes'));
        },
        destructor: function() {
        }
    });

    Y.namespace('DD');    
    Y.DD.Delegate = D;

}, '@VERSION@' ,{requires:['dd-drag'], skinnable:false});
