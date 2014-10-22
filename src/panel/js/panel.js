// TODO: Change this description!
/**
Provides a Panel widget, a widget that mimics the functionality of a regular OS
window. Comes with Standard Module support, XY Positioning, Alignment Support,
Stack (z-index) support, modality, auto-focus and auto-hide functionality, and
header/footer button support.

@module panel
**/

var getClassName = Y.ClassNameManager.getClassName,

  BOUNDING_BOX = 'boundingBox',
  TITLE = 'title',
  PANEL_TYPE = 'panelType',
  HEADER = 'header',
  BODY = 'body',
  SIMPLE = 'simple',
  COMPLEX = 'complex',
  DIALOG = 'dialog',
  ALERT_DIALOG = 'alertdialog',
  ARIA_DESCRIBEDBY = 'aria-describedby',
  ARIA_LABELLEDBY = 'aria-labelledby',
  ROLE = 'role',

  FOCUSABLE_SELECTORS = 'a[href], area[href], input:not([disabled]), ' +
    'select:not([disabled]), textarea:not([disabled]), button:not([disabled]), ' +
    'iframe, object, embed, *[tabindex], *[contenteditable]';

// TODO: Change this description!
/**
A basic Panel Widget, which can be positioned based on Page XY co-ordinates and
is stackable (z-index support). It also provides alignment and centering support
and uses a standard module format for it's content, with header, body and footer
section support. It can be made modal, and has functionality to hide and focus
on different events. The header and footer sections can be modified to allow for
button support.

@class Panel
@constructor
@extends Widget
@uses WidgetAutohide
@uses WidgetButtons
@uses WidgetModality
@uses WidgetPosition
@uses WidgetPositionAlign
@uses WidgetPositionConstrain
@uses WidgetStack
@uses WidgetStdMod
@since 3.4.0
 */
Y.Panel = Y.Base.create('panel', Y.Widget, [
  // Other Widget extensions depend on these two.
  Y.WidgetPosition,
  Y.WidgetStdMod,

  Y.WidgetAutohide,
  Y.WidgetModality,
  Y.WidgetButtons,
  Y.WidgetPositionAlign,
  Y.WidgetPositionConstrain,
  Y.WidgetStack
], {
  // -- Public Properties ----------------------------------------------------

  /**
    Collection of predefined buttons mapped from name => config.

    Panel includes a "close" button which can be use by name. When the close
    button is in the header (which is the default), it will look like: [x].

    See `addButton()` for a list of possible configuration values.

    @example
        // Panel with close button in header.
        var panel = new Y.Panel({
            buttons: ['close']
        });

        // Panel with close button in footer.
        var otherPanel = new Y.Panel({
            buttons: {
                footer: ['close']
            }
        });

    @property BUTTONS
    @type Object
    @default {close: {}}
    @since 3.5.0
    **/
  BUTTONS: {
    close: {
      label: 'Close',
      action: 'hide',
      section: HEADER,

      // Uses `type="button"` so the button's default action can still
      // occur but it won't cause things like a form to submit.
      template: '<button type="button" />',
      classNames: getClassName('button', 'close'),
      isDefault: true
    }
  },

  /**
   * Template for Panel's title. Wrapped in a `<h1>` for accessibility.
   * For multi-line titles, it is recommended to use additional markup inside
   * the title and style as necessary.
   *
   * @example
   *
   *     <h1>This is the main title <span>This is a sub-ttile on a second line</span></h1>
   *
   * @property TITLE_TEMPLATE
   * @type {String}
   * @default '<h1 class="{className}">{title}</h1>'
   */
  TITLE_TEMPLATE: '<h1 class="{className}">{title}</h1>',

  /**
   * Additional classes for the Panel
   *
   * @property PANEL_CLASSES
   * @type {Object}
   */
  PANEL_CLASSES: {
    title: getClassName(this.name, TITLE)
  },

  // -- Private Properties ----------------------------------------------------

  /**
   * Internal cache for storing cycleFocusTab's event handle
   *
   * @property _focusHandle
   * @type {EventHandle}
   * @default null
   */
  _focusHandles: null,

  /**
   *
   * @method bindUI
   * @protected
   */
  bindUI: function () {
    this.after('panelTypeChange', this._afterPanelTypeChange, this);
    this.after('titleChange', this._afterTitleChange, this);
    this.after('visibleChange', this._afterPanelVisibleChange, this);
  },

  /**
   *
   * @method render
   */
  render: function () {

    var title = this.get(TITLE);

    Y.Panel.superclass.render.apply(this, arguments);

    if (title) {
      this._renderTitle(title);
    }

    this._setAria(this.get(PANEL_TYPE));
  },

  /**
   * Reacts to the `panelType` attribute change by setting proper aria roles
   * on the Panel
   *
   * @method _afterPanelTypeChange
   * @param {EventFacade} e The relevant change event
   * @protected
   */
  _afterPanelTypeChange: function (e) {
    this._setAria(e.newVal);
  },

  /**
   * Reacts to the `visible` attribute change by binding or unbinding tab press
   * events
   *
   * @method _afterPanelTypeChange
   * @param {EventFacade} e The relevant change event
   * @protected
   */
  _afterPanelVisibleChange: function (e) {

    if (e.newVal) {
      this._bindTabCycle();
    } else {
      this._unbindTabCycle();
    }
  },

  /**
   * Reacts to the `title` attribute change by the Panel's title
   *
   * @method _afterPanelTypeChange
   * @param {EventFacade} e The relevant change event
   * @protected
   */
  _afterTitleChange: function (e) {
    this._renderTitle(e.newVal);
  },

  /**
   * Binds tab press to the bounding box and last focusable node in the Panel
   *
   * @method _bindTabCycle
   * @protected
   */
  _bindTabCycle: function () {

    var bb = this.get(BOUNDING_BOX),
      focusableNodes = bb.all(FOCUSABLE_SELECTORS),
      lastNode = focusableNodes.item(focusableNodes.size() - 1),
      nodes = {
        firstNode: bb,
        lastNode: lastNode
      };

    this._unbindTabCycle();
    this._focusHandle = bb.on('key', this._onTabPress, 'down:9', this, nodes);
  },

  /**
   * Handler for tab presses, for cycling focus inside the Panel
   *
   * @method _onTabPress
   * @param {EventFacade} e The relevant change event
   * @protected
   */
  _onTabPress: function (e, nodes) {

    var target = e.target;

    if (target === nodes.firstNode && e.shiftKey) {
      e.preventDefault();
      nodes.lastNode.focus();
    } else if (target === nodes.lastNode && !e.shiftKey) {
      e.preventDefault();
      nodes.firstNode.focus();
    }
  },

  /**
   * Either wraps and renders the specified title in a `h1` tag or updates
   * an existing title
   *
   * @method _renderTitle
   * @param {String} title The title for Panel instance
   * @protected
   */
  _renderTitle: function (title) {

    var titleNode = this.getStdModNode(HEADER).one('.' + this.PANEL_CLASSES.title);

    if (titleNode) {
      titleNode.set('text', title);
    } else {
      this.setStdModContent(HEADER, Y.Lang.sub(this.TITLE_TEMPLATE, {
        className: this.PANEL_CLASSES.title,
        title: title
      }), 'before');
    }

  },

  /**
   * Panel type, either `simple` or `complex` which helps determine the proper
   * ARIA role for the Panel. Also sets the aria-labelledby and aria-describedby
   * properties
   *
   * @method _setAria
   * @param {String} panelType
   * @protected
   */
  _setAria: function (panelType) {

    var bb = this.get(BOUNDING_BOX),
      bodyNode = this.getStdModNode(BODY),
      role;

    if (panelType === SIMPLE) {
      role = ALERT_DIALOG;
      bodyNode.removeAttribute(ROLE);
    } else if (panelType === COMPLEX) {
      role = DIALOG;
      bodyNode.set(ROLE, 'document');
    }

    if (this.get(TITLE)) {
      bb.set(ARIA_LABELLEDBY, this.getStdModNode(HEADER).one('.' + this.PANEL_CLASSES.title).generateID());
    }

    bb.set(ROLE, role);
    bb.set(ARIA_DESCRIBEDBY, bodyNode.generateID());
  },

  /**
   * Detaches tab cycle listener
   *
   * @method _unbindTabCycle
   * @protected
   */
  _unbindTabCycle: function () {

    if (this._focusHandle) {
      this._focusHandle.detach();
      this._focusHandle = null;
    }
  },

  /**
   * Panel type, either `simple` or `complex` which helps determine the proper
   * ARIA role for the Panel
   *
   * @method _validatePanelType
   * @param {String} val
   */
  _validatePanelType: function (val) {
    return (val === SIMPLE || val === COMPLEX);
  }
}, {
  ATTRS: {
    // TODO: API Docs.
    buttons: {
      value: ['close']
    },

    /**
     * Panel type, either `simple` or `complex` which helps determine the proper
     * ARIA role for the Panel
     *
     * @attribute panelType
     * @value 'simple'
     */
    panelType: {
      value: SIMPLE,
      validator: '_validatePanelType',
    },

    /**
     * Panel's title, wrapped in a `<h1>`
     *
     * @attribute title
     * @value null
     */
    title: {
      value: null
    }
  },

  /**
   * The HTML parsing rules for the Panel
   *
   * @property HTML_PARSER
   * @static
   * @type Object
   */
  HTML_PARSER: {
    title: function (srcNode) {

      var titleNode = srcNode.one('.' + this.PANEL_CLASSES.title);

      if (titleNode) {
        return titleNode.get('innerHTML');
      }

      return null;
    }
  }
});
