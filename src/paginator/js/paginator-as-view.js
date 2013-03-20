/**
 Mixes into Y.Paginator a classical interface to use the Paginator as a View.

 @module paginator
 @submodule paginator-as-view
 @namespace Paginator
 @since 3.10.0
 */

function PaginatorAsView(){}

PaginatorAsView.ATTRS = {
    /**
     @attribute container
     @type {Y.Node}
     */
    container: {
        getter: '_containerGetterFn',
        setter: '_containerSetterFn',
        value: null,
        writeOnce: true
    }
};

Y.mix(PaginatorAsView.protype, {

    /**
     @method _containerSetterFn
     @attribute {Y.Node} node
     @return Y.Node
     */
    _containerSetterFn: function (node) {
        this.set('boundingBox', node);
        return this.get('boundingBox');
    },

    /**
     @method _containerGetterFn
     @return Y.Node
     */
    _containerGetterFn: function () {
        return this.get('boundingBox');
    }
});

if (typeof Y.namespace('Paginator') === 'function') {
    Y.Base.mix(Y.Paginator, [PaginatorAsView]);
}