Y.Paginator.Base = Y.Base.create('paginator', Y.Widget,
    [ Y.Paginator.Core, Y.Paginator.Widget ],
    null, {
        ATTRS: {
            // Default view
            paginatorView: { value: Y.Paginator.SimpleView }
        }
    });

// The DataTable API docs are above DataTable.Base docs.
Y.Paginator = Y.mix(
    Y.Base.create('paginator', Y.Paginator.Base, []), // Create the class
    Y.Paginator); // Migrate static and namespaced classes
