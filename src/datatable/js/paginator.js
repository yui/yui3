var Model,
    View,
    sub = Y.Lang.sub,
    getClassName = Y.ClassNameManager.getClassName,
    CLASS_DISABLED = getClassName(NAME, 'control-disabled'),
    EVENT_UI = 'paginator:ui';

/**
 @class DataTable.Paginator.Model
 */
Model = Y.Base.create('dt-pg-model', Y.Model, [Y.Paginator.Core]),

/**
 @class DataTable.Paginator.View
 */
View = Y.Base.create('dt-pg-view', Y.View, [], {

    /**
     Array of event handles to keep track of what should be destroyed later
     @protected
     @property _eventHandles
     @type {Array}
     */
    _eventHandles: [],

    /**
     Template for this view's container.
     @property containerTemplate
     @type {String}
     @default '<div class="yui3-datatable-paginator"/>'
     */
    containerTemplate: '<div class="{paginator}"/>',

    /**
     Template used for control buttons
     @property buttonTemplate
     @type {String}
     @default '<a href="#{type}" class="control control-{type}" data-type="{type}">{label}</a>'
     */
    buttonTemplate: '<button class="{control} {control}-{type}" data-type="{type}">{label}</a>',

    /**
     Template for content. Helps maintain order of controls.
     @property contentTemplate
     @type {String}
     @default '{buttons}{goto}{perPage}'
     */
    contentTemplate: '{buttons}{goto}{perPage}',

    /**
     Disables ad-hoc ATTRS for our view.
     @protected
     @property _allowAdHocAttrs
     @type {Boolean}
     @default false
     */
    _allowAdHocAttrs: false,

    /**
     Sets classnames on the templates and bind events
     @method initializer
     */
    initializer: function () {
        this.containerTemplate = sub(this.containerTemplate, {
            paginator: getClassName(NAME)
        });

        var container = this.get('container'),
            events = this._eventHandles;

        this._initStrings();
        this._initClassNames();

        this.attachEvents();

        this.buttonTemplate = sub(this.buttonTemplate, {
            control: this.classNames.control
        });
    },

    /**
     @method render
     @chainable
     */
    render: function () {
        var model = this.get('model'),
            content = Y.Lang.sub(this.contentTemplate, {
                'buttons': this._buildButtonsGroup(),
                'goto': this._buildGotoGroup(),
                'perPage': this._buildPerPageGroup()
            });

        this.get('container').append(content);

        this._rendered = true;

        this._updateControlsUI(model.get('page'));
        this._updateItemsPerPageUI(model.get('itemsPerPage'));

        return this;
    },

    /**
     @method attachEvents
     */
    attachEvents: function () {
        var container = this.get('container');

        View.superclass.attachEvents.apply(this, arguments);

        if (!this.classNames) {
            this._initClassNames();
        }

        this._attachedViewEvents.push(
            container.delegate('click', this._controlClick, '.' + this.classNames.control, this),
            container.after('change', this._controlChange, this, 'select'),
            container.after('submit', this._controlSubmit, this, 'form'),
            this.get('model').after('change', this._modelChange, this)
        );

    },

    /**
     @protected
     @method _buildButtonsGroup
     */
    _buildButtonsGroup: function () {
        var temp = this.buttonTemplate,
            strings = this.get('strings');

        return sub('<div class="{controls} {group}">' +
                    sub(temp, { type: 'first', label: strings.first} ) +
                    sub(temp, { type: 'prev', label: strings.prev }) +
                    sub(temp, { type: 'next', label: strings.next }) +
                    sub(temp, { type: 'last', label: strings.last }) +
                '</div>', this.classNames);
    },

    /**
     @protected
     @method _buildGotoGroup
     */
    _buildGotoGroup: function () {
        var strings = this.get('strings');

        return sub('<form action="#" class="{group}">' +
                    '<label>' + strings.goToLabel +
                    '<input type="text" value="' + this.get('model').get('page') + '">' +
                    '<button>' + strings.goToAction + '</button>' +
                    '</label>' +
                '</form>', this.classNames);
    },

    /**
     @protected
     @method _buildPerPageGroup
     */
    _buildPerPageGroup: function () {
        // return {string} div containing a label and select of options
        var strings = this.get('strings'),
            select = '<div class="{group} {perPage}">' +
                        '<label>' + strings.perPage + ' <select>',
            options = this.get('pageSizes'),
            i,
            len;

        for (i=0, len = options.length; i < len; i++) {
            select += '<option value="' +
                        ( options[i].value || options[i] ) + '">' +
                        ( options[i].label || options[i] ) + '</option>';
        }

        select += '</select></label></div>';

        return sub(select, this.classNames);

    },

    /**
     @protected
     @method _modelChange
     */
    _modelChange: function (e) {
        var changed = e.changed,
            page = (changed && changed.page),
            itemsPerPage = (changed && changed.itemsPerPage);

        if (page) {
            this._updateControlsUI(page.newVal);
        }
        if (itemsPerPage) {
            this._updateItemsPerPageUI(itemsPerPage.newVal);
            if (!page) {
                this._updateControlsUI(e.target.get('page'));
            }
        }

    },

    /**
     @protected
     @method _updateControlsUI
     */
    _updateControlsUI: function (val) {
        if (!this._rendered) {
            return;
        }

        var model = this.get('model'),
            controlClass = '.' + this.classNames.control,
            container = this.get('container'),
            hasPrev = model.hasPrevPage(),
            hasNext = model.hasNextPage();

        container.one(controlClass + '-first')
                 .toggleClass(CLASS_DISABLED, !hasPrev)
                 .set('disabled', !hasPrev);

        container.one(controlClass + '-prev')
                 .toggleClass(CLASS_DISABLED, !hasPrev)
                 .set('disabled', !hasPrev);

        container.one(controlClass + '-next')
                 .toggleClass(CLASS_DISABLED, !hasNext)
                 .set('disabled', !hasNext);

        container.one(controlClass + '-last')
                 .toggleClass(CLASS_DISABLED, !hasNext)
                 .set('disabled', !hasNext);

        container.one('form input').set('value', val);
    },

    /**
     @protected
     @method _updateItemsPerPageUI
     */
    _updateItemsPerPageUI: function (val) {
        if (!this._rendered) {
            return;
        }

        this.get('container').one('select').set('value', val);
    },

    /**
     @protected
     @method _controlClick
     */
    _controlClick: function (e) { // buttons
        e.preventDefault();
        var control = e.currentTarget;
        // register click events from the four control buttons
        if (control.hasClass(CLASS_DISABLED)) {
            return;
        }
        this.fire(EVENT_UI, {
            type: control.getData('type'),
            val: control.getData('page') || null
        });
    },

    /**
     @protected
     @method _controlChange
     */
    _controlChange: function (e, selector) {

        var control = e.target;
        // register change events from the perPage select
        if (
            control.hasClass(CLASS_DISABLED) ||
            ( selector && !(control.test(selector)) )
        ) {
            return;
        }

        var val = e.target.get('value');
        this.fire(EVENT_UI, { type: 'perPage', val: parseInt(val, 10) });
    },

    /**
     @protected
     @method _controlSubmit
     */
    _controlSubmit: function (e, selector) {
        var control = e.target;
        if (
            control.hasClass(CLASS_DISABLED) ||
            (
                selector &&
                !Y.Selector.test(control.getDOMNode(), selector)
            )
        ) {
            return;
        }

        // the only form we have is the go to page form
        e.preventDefault();

        var input = e.target.one('input');
        this.fire(EVENT_UI, { type: 'page', val: input.get('value') });
    },

    /**
     Initializes classnames to be used with the templates
     @protected
     @method _initClassNames
     */
    _initClassNames: function () {
        this.classNames = {
            control: getClassName(NAME, 'control'),
            controls: getClassName(NAME, 'controls'),
            group: getClassName(NAME, 'group'),
            perPage: getClassName(NAME, 'per-page')
        };
    },

    /**
     @protected
     @method _initStrings
     */
    _initStrings: function () {
        // Not a valueFn because other class extensions may want to add to it
        this.set('strings', Y.mix((this.get('strings') || {}),
            Y.Intl.get('datatable-paginator')));
    }
}, {
    ATTRS: {
        /**
         @attribute pageSizes
         @type {Array}
         @default [10, 50, 100, { label: 'Show All', value: -1 }]
         */
        pageSizes: {
            value: [10, 50, 100, { label: 'Show All', value: -1 }]
        },

        model: {}
    }
});

/**
 @class DataTable.Paginator
 */
function Controller () {}

Controller.ATTRS = {
    /**
     @attribute paginatorModel
     @type {Y.Model}
     @default null
     */
    paginatorModel: {
        setter: '_setPaginatorModel',
        value: null,
        writeOnce: 'initOnly'
    },

    /**
     @attribute paginatorModelType
     @type {Y.Model | String}
     @default 'DataTable.Paginator.Model'
     */
    paginatorModelType: {
        getter: '_getConstructor',
        value: 'DataTable.Paginator.Model',
        writeOnce: 'initOnly'
    },

    /**
     @attribute paginatorView
     @type {Y.View | String}
     @default 'DataTable.Paginator.View'
     */
    paginatorView: {
        getter: '_getConstructor',
        value: 'DataTable.Paginator.View',
        writeOnce: 'initOnly'
    },

    // PAGINATOR CONFIGS
    /**
     @attribute pageSizes
     @type {Array}
     @default [10, 50, 100, { label: 'Show All', value: -1 }]
     */
    pageSizes: {
        setter: '_setPageSizesFn',
        value: [10, 50, 100, { label: 'Show All', value: -1 }]
    },

    /**
     @attribute rowsPerPage
     @type {Number | null}
     @default null
     */
    rowsPerPage: {},

    /**
     @attribute paginatorLocation
     @type {String | Array | Y.Node}
     @default footer
     */
    paginatorLocation: {
        value: 'footer'
    }
};

Y.mix(Controller.prototype, {

    /**
     Used to wrap the paginator into a safe row when the location is defined
       as "footer"
     @property rowWrapperTemplate
     @type String
     @default '<tr><td class="{wrapperClass}" colspan="{numOfCols}"/></tr>'
     */
    rowWrapperTemplate: '<tr><td class="{wrapperClass}" colspan="{numOfCols}"/></tr>',

    /**
     @method firstPage
     @chainable
     */
    firstPage: function () {
        this.get('paginatorModel').set('page', 1);
        return this;
    },
    /**
     @method lastPage
     @chainable
     */
    lastPage: function () {
        var model = this.get('paginatorModel');
        model.set('page', model.get('totalPages'));
        return this;
    },
    /**
     @method previousPage
     @chainable
     */
    previousPage: function () {
        this.get('paginatorModel').prevPage();
        return this;
    },
    /**
     @method nextPage
     @chainable
     */
    nextPage: function () {
        this.get('paginatorModel').nextPage();
        return this;
    },


    /// Init and protected
    /**
     @method initializer
     */
    initializer: function () {
        var model = this.get('paginatorModel')

        // allow DT to use paged data
        this._augmentData();

        // ensure our model has the correct totalItems set
        model.set('totalItems', this.get('data').size());

        if (!this._eventHandles.paginatorRender) {
            this._eventHandles.paginatorRender = Y.Do.after(this._paginatorRender, this, 'render');
        }
    },

    /**
     @protected
     @method _paginatorRender
     */
    _paginatorRender: function () {
        this._paginatorRenderUI();
        this.get('paginatorModel').after('change', this._afterPaginatorModelChange, this);
        this.after('dataChange', this._afterDataChangeWithPaginator, this);
        this.after('rowsPerPageChange', this._afterRowsPerPageChange, this);
    },

    /**
     @protected
     @method _afterDataChangeWithPaginator
     */
    _afterDataChangeWithPaginator: function () {
        var data = this.get('data'),
            model = this.get('paginatorModel');

        if (model.get('page') !== 1) {
            this.firstPage();
        } else {
            this._augmentData();

            data.fire.call(data, 'reset', {
                src: 'reset',
                models: data._items.concat()
            });
        }
    },

    /**
     @protected
     @method _afterRowsPerPageChange
     @param {EventFacade} e
     */
    _afterRowsPerPageChange: function (e) {
        var data = this.get('data'),
            model = this.get('paginatorModel'),
            view;

        if (e.newVal !== null) {
            // turning on
            this._paginatorRenderUI();

            if (!(data._paged)) {
                this._augmentData();
            }

            data._paged.index = (model.get('page') - 1) * model.get('itemsPerPage');
            data._paged.length = model.get('itemsPerPage');

        } else if (e.newVal === null) {
            // destroy!
            while(this._pgViews.length) {
                view = this._pgViews.shift();
                view.destroy({ remove: true });
            }

            data._paged.index = 0;
            data._paged.length = null;
        }

        this.get('paginatorModel').set('itemsPerPage', parseInt(e.newVal, 10));
    },

    /**
     @protected
     @method _paginatorRenderUI
     */
    _paginatorRenderUI: function () {
        var views = this._pgViews,
            ViewClass = this.get('paginatorView'),
            viewConfig = {
                pageSizes: this.get('pageSizes'),
                model: this.get('paginatorModel')
            },
            locations = this.get('paginatorLocation');

        if (!Y.Lang.isArray(locations)) {
            locations = [locations];
        }

        if (!views) { // set up initial rendering of views
            views = this._pgViews = [];
        }

        // for each placement area, push to views
        Y.Array.each(locations, function (location) {
            var view = new ViewClass(viewConfig),
                container = view.render().get('container'),
                row;

            view.after('*:ui', this._uiPgHandler, this);
            views.push(view);

            if (location._node) { // assume Y.Node
                location.append(container);
            } else if (location === 'footer') { // DT Footer
                // Render a table footer if there isn't one
                if (!this.foot) {
                    this.foot = new Y.DataTable.FooterView({ host: this });
                    this.foot.render();
                    this.fire('renderFooter', { view: this.foot });
                }

                // create a row for the paginator to sit in
                row = Y.Node.create(sub(this.rowWrapperTemplate, {
                    wrapperClass: getClassName(NAME, 'wrapper'),
                    numOfCols: this.get('columns').length
                }));

                row.one('td').append(container);
                this.foot.tfootNode.append(row);

                // remove this container row if the view is ever destroyed
                view.after('destroy', function (/* e */) {
                    row.remove(true);
                });
            } else if (location === 'header') {
                // 'header' means insert before the table
                // placement with the caption may need to be addressed
                if (this.view && this.view.tableNode) {
                    this.view.tableNode.insert(container, 'before');
                } else {
                    this.get('contentBox').prepend(container);
                }
            }
        }, this);

    },

    /**
     @protected
     @method _uiPgHandler
     @param {EventFacade} e
     */
    _uiPgHandler: function (e) {
        // e.type = control type (first|prev|next|last|page|perPage)
        // e.val = value based on the control type to pass to the model
        var model = this.get('paginatorModel');

        switch (e.type) {
            case 'first':
                model.set('page', 1);
                break;
            case 'last':
                model.set('page', model.get('totalPages'));
                break;
            case 'prev':
            case 'next':
                model[e.type + 'Page']();
                break;
            case 'page':
                model.set('page', e.val);
                break;
            case 'perPage':
                model.set('itemsPerPage', e.val);
                model.set('page', 1);
                break;
        }
    },

    /**
     @protected
     @method _afterPaginatorModelChange
     @param {EventFacade} e
     */
    _afterPaginatorModelChange: function (/* e */) {
        var model = this.get('paginatorModel'),
            data = this.get('data');

        if (!data._paged) {
            this._augmentData();
        }

        data._paged.index = (model.get('page') - 1) * model.get('itemsPerPage');
        data._paged.length = model.get('itemsPerPage');

        data.fire.call(data, 'reset', {
            src: 'reset',
            models: data._items.concat()
        });
    },

    /**
     @protected
     @method _augmentData
     */
    _augmentData: function () {
        var model = this.get('paginatorModel');

        if (this.get('rowsPerPage') === null) {
            return;
        }

        Y.mix(this.get('data'), {

            _paged: {
                index: (model.get('page') - 1) * model.get('itemsPerPage'),
                length: model.get('itemsPerPage')
            },

            getPage: function () {
                var _pg = this._paged,
                    min = _pg.index,
                    max = (_pg.length >= 0) ? min + _pg.length : undefined;

                return this._items.slice(min, max);
            },

            size: function (paged) {
                return (paged && this._paged.length >=0 ) ?
                            this._paged.length :
                            this._items.length;
            },

            each: function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this.getPage());

                Y.Array.each.apply(null, args);

                return this;
            }
        }, true);
    },

    /**
     @protected
     @method _setPageSizesFn
     @param {Array} val
     */
    _setPageSizesFn: function (val) {
        var i,
            len = val.length,
            label,
            value;

        if (!Y.Lang.isArray(val)) {
            val = [val];
            len = val.length;
        }

        for ( i = 0; i < len; i++ ) {
            if (typeof val[i] !== 'object') {
                label = val[i];
                value = val[i];

                // We want to check to see if we have a number or a string
                // of a number. If we do not, we want the value to be -1 to
                // indicate "all rows"
                if (parseInt(value, 10) != value) {
                    value = -1;
                }
                val[i] = { label: label, value: value };
            }
        }

        return val;
    },

    /**
     @protected
     @method _setPaginatorModel
     @param {Y.Model | Object} model
     */
    _setPaginatorModel: function (model) {
        if (!(model && model._isYUIModel)) {
            var ModelConstructor = this.get('paginatorModelType');
            model = new ModelConstructor(model);
        }

        return model;
    },

    /**
     @protected
     @method _getConstructor
     @param {Object | String} type Type of Object to contruct. If `type` is a
       String, we assume it is a namespace off the Y object
     */
    _getConstructor: function (type) {
        return typeof type === 'string' ?
            Y.Object.getValue(Y, type.split('.')) :
            type;
    }

}, true);


Y.DataTable.Paginator = Controller;
Y.DataTable.Paginator.Model = Model;
Y.DataTable.Paginator.View = View;

Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);
