/**
Standalone Paginator Widget implementation.

@module paginator
@submodule paginator-base
@since 3.6.0
**/

// Paginator API docs included before Paginator.Base to make yuidoc work
/**
A Widget for displaying pagination controls.  Before feature modules are
`use()`d, this class is functionally equivalent to Paginator.Base.  However,
feature modules can modify this class in non-destructive ways, expanding the
API and functionality.

This is the primary standalone Paginator class.

@class Paginator
@extends Paginator.Base
@since 3.6.0
**/

/**
Base class for the Paginator Widget.  Adds attributes `view` and `viewConfig`
to specify the class responsible for generating the Widget UI and allow its
configuration.

@class Base
@extends Widget
@uses Paginator.Core
@namespace Paginator
@constructor
@since 3.6.0
**/
Y.Paginator.Base = Y.Base.create('paginator', Y.Widget, [ Y.Paginator.Core ], {
        initializer: function () {
            this.publish('renderView', {
                defaultFn: Y.bind('_defRenderViewFn', this)
            });
        },

        renderUI: function () {
            var View = this.get('view'),
                config = Y.merge(
                    this.getAttrs(),
                    (this.get('viewConfig') || {}), {
                        host: this,
                        container: this.get('contentBox')
                    });

            if (View) {
                this.view = new View(config);
            }
        },

        syncUI: function () {
            if (this.view) {
                this.fire('renderView', {
                    view: this.view
                });
            }
        },

        _defRenderViewFn: function (e) {
            if (e.view && e.view.render) {
                e.view.render();
            }
        },

        _validateView: function (val) {
            return val === null ||
                (Y.Lang.isFunction(val) && val.prototype.render);
        }
    }, {
        ATTRS: {
            /**
            The View class responsible for rendering the controls.  When
            `render()`ed, the Paginator will create an instance of the View
            class with the configuration object in the `viewConfig` attribute,
            decorated with the current state, plus a _host_ property pointing
            back to the Pagintor instance.

            The View instance is stored in the `view` property of the instance.

            @attribute view
            @type {Function}
            **/
            view: {
                value: Y.Paginator.SimpleView,
                validator: '_validateView'
            },

            /**
            The configuration object to pass to the View instance responsible
            for rendering the controls.

            @attribute viewConfig
            @type {Object}
            **/
            viewConfig: {}
        }
    });

// The Paginator API docs are above Paginator.Base docs.
Y.Paginator = Y.mix(
    Y.Base.create('paginator', Y.Paginator.Base, []), // Create the class
    Y.Paginator); // Migrate static and namespaced classes
