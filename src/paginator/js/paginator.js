function Paginator() {
    Paginator.superclass.constructor.apply(this, arguments);
}

Paginator.NAME = 'paginator';

Paginator.ATTRS = {
    model: {
        value: 'Y.Paginator.Model'
    },
    view: {
        value: 'Y.Paginator.View'
    }
};

Y.extend(Paginator, Y.Base, {

});

Y.namespace('Paginator').Base = Paginator;

// The DataTable API docs are above DataTable.Base docs.
Y.Paginator = Y.mix(
    Y.Base.create('paginator', Y.Paginator.Base, []), // Create the class
    Y.Paginator); // Migrate static and namespaced classes
