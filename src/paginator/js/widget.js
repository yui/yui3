/**
Widget implementation attributes for rendering pagination controls provided as
a class extension.  Use as follows when creating a widget with rendered
pagination controls:

`Y.Base.create(NAME, Y.Widget, [ Y.Paginator.Core, Y.Paginator.Widget, ... ])`

@module paginator
@submodule paginator-widget
@since 3.6.0
**/

/**
Class extension adding `paginatorView` and `paginatorViewConfig` attributes and
binding to the Widget superclass's renderUI and `syncUI` methods to also render
the pagination controls via the configured `paginatorView`.

@class Paginator.Widget
@constructor
@since 3.6.0
**/
function PaginatorWidget() {}

PaginatorWidget.ATTRS = {
    /**
    The View class responsible for rendering the controls.  When `render()`ed,
    the Paginator will create an instance of the View class with the
    configuration object in the `paginatorViewConfig` attribute, decorated with
    the current state, plus a _host_ property pointing back to the Pagintor
    instance.

    The View instance is stored in the `view` property of the instance.

    @attribute paginatorView
    @type {Function}
    **/
    paginatorView: {
        validator: '_validatePaginationView'
    },

    /**
    The configuration object to pass to the View instance responsible for
    rendering the controls.

    @attribute paginatorViewConfig
    @type {Object}
    **/
    paginatorViewConfig: {}
};

Y.mix(PaginatorWidget.prototype, {
    initializer: function () {
        Y.Do.after(Y.bind('_renderPaginationUI', this), this, 'renderUI');
        Y.Do.after(Y.bind('_syncPaginationUI', this), this, 'syncUI');
    },

    _renderPaginationUI: function () {
        var View = this.get('paginatorView'),
            config = Y.merge((this.get('paginatorViewConfig') || {}),
                        this.getAttrs(['page', 'totalItems', 'itemsPerPage']), {
                            host: this,
                            container: this.get('contentBox')
                        });

        if (View) {
            this.paginator = new View(config);
        }
    },

    _syncPaginationUI: function () {
        if (this.paginator) {
            this.paginator.render();
        }
    },

    _validatePaginationView: function (val) {
        return val === null || (Y.Lang.isFunction(val) && val.prototype.render);
    }
}, true);

Y.namespace('Paginator').Widget = PaginatorWidget;
