/**
 * The view class holds the configuration for a given view and handles the
 * rendering of the view. It also holds onto any extra state an implementer
 * wants to keep with the view.
 * @class View
 * @constructor
 * @param o The configuration options
 * @extends Base
 * @uses RenderTarget
 */
var View = function(o) {
        View.superclass.constructor.apply(this, arguments);
    };

View.NAME = 'View';

View.ATTRS = {

    /**
     * The view id
     * @attribute id
     * @type string
     */
    id: DEFAULT,

    /**
     * The nav controller host
     * @attribute parent
     * @type Nav
     */
    parent: DEFAULT,

    /**
     * A configuration to help the nav controller or the view to
     * add a header nav to the content
     * @attribute header
     */
    header: DEFAULT, // header/footer are used by the nav control for navbar

    /**
     * A configuration to help the nav controller or the view to
     * add a nav footer to the content
     * @attribute footer
     */
    footer: DEFAULT, // you could define any property for this, however

    /**
     * This function must be supplied by the implementer to render the view.
     * The function is executed in the context of the view control, and receives
     * a callback and possibly a data payload as parameters.  The callback
     * must be executed when the render is complete.  The data payload, if
     * provided, contains extra state data (which populates the state attribute
     * as well).
     * @attribute renderer
     */
    renderer: DEFAULT, // implementer provides the renderer

    /**
     * Extra state that can be stored for a given rendered view.  This
     * can be updated by the implementer and can be saved to the
     * history stack by calling this.parent.parent.save();
     * @attribute state
     */
    state: DEFAULT, // history item is stored as nav.id=view.id|state

    /**
     * If this view is ephemeral (temporary), it will not participate
     * in state persistence.
     */
    ephemeral: { //
        value: false
    }
};

Y.extend(View, Y.Base, {

});

Y.augment(View, Y.RenderTarget);

Y.View = View;

