function PaginatorAsView(){}

PaginatorAsView.ATTRS = {
    container: {
        getter: '_containerGetterFn',
        setter: '_containerSetterFn',
        value: null,
        writeOnce: true
    }
};

Y.mix(PaginatorAsView.protype, {

    _containerSetterFn: function (node) {
        this.set('boundingBox', node);
        return this.get('boundingBox');
    },

    _containerGetterFn: function () {
        return this.get('boundingBox');
    }
});

if (typeof Y.namespace('Paginator') === 'function') {
    Y.Base.mix(Y.Paginator, [PaginatorAsView]);
}