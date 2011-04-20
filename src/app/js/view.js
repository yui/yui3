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

View.NAME = 'view';

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
     * @type function
     */
    renderer: DEFAULT,

    /**
     * This function can be implemented for the view when the nav controller
     * begins navigation to another view.  This could hide the current view,
     * with or without a transition, or it could destroy the view.  The
     * transition receives a callback as the first parameter, which must
     * be executed when the transition is complete -- the next view will
     * be rendered after the transition is complete.  The function also
     * recevies a view parameter, which is the view that will be rendered
     * after the transition is complete.
     * @attribute transitioner
     * @type function
     */
    transitioner: DEFAULT,

    /**
     * Extra state that can be stored for a given rendered view.  This
     * can be updated by the implementer and can be saved to the
     * history stack by calling this.parent.parent.save();
     * @attribute state
     * @type string
     */
    viewState: DEFAULT, // history item is stored as nav.id=view.id|state

    /**
     * An optional url value that will be propogated to the history
     * component, but only when using HTML5 history.  See the history
     * component for details about how to use this property.
     * @attribute url
     * @type string
     */
    url: DEFAULT,

    /**
     * An optional title value that will be propogated to the history
     * component, but only when using HTML5 history.  See the history
     * component for details about how to use this property.
     * @attribute title
     * @type string
     */
    title: DEFAULT,

    /**
     * If this view is ephemeral (temporary), it will not participate
     * in state persistence.
     * @attribute ephemeral
     * @type boolean
     * @default false
     */
    ephemeral: {
        value: false
    }
};

Y.extend(View, Y.Base);

Y.augment(View, Y.RenderTarget);

Y.View = View;

