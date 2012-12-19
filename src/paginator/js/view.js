var getClassName = Y.ClassNameManager.getClassName;

function PaginatorView() {
    PaginatorView.superclass.constructor.apply(this, arguments);
}

PaginatorView.NAME = 'paginator-view';

PaginatorView.ATTRS = {

};

Y.extend(PaginatorView, Y.View, {
    /**
    Classnames used in templates
    @type Object
    **/
    classnames: {
        firstLinkClass:  getClassName('first'),
        lastLinkClass:   getClassName('last'),
        prevLinkClass:   getClassName('prev'),
        nextLinkClass:   getClassName('next'),
        pageLinkClass:   getClassName('page'),
        activeLinkClass: getClassName('active'),
        moreLinkClass:   getClassName('more'),
        selectPageClass: getClassName('select')
    },

    events: {

    },

    template: '',

    initializer: function() {

    },

    render: function() {

    }
});

Y.namespace('Paginator').View = PaginatorView;