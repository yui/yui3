var Model,
    View,
    sub = Y.Lang.sub,
    CLASS_DISABLED = 'control-disabled'
    EVENT_UI = 'paginator:ui';

Model = Y.Base.create('dt-pg-model', Y.Model, [Y.Paginator.Core]),

View = Y.Base.create('dt-pg-view', Y.View, [], {

    containerTemplate: '<div class="yui3-table-paginator"/>',

    buttonTemplate: '<a href="#{type}" class="control control-{type}" data-type="{type}">{label}</a>',

    initializer: function () {
        var container = this.get('container');

        this._initStrings();

        container.delegate('click', this._controlClick, '.control', this);
        container.delegate('change', this._controlChange, 'select', this);
        container.delegate('submit', this._controlSubmit, 'form', this);

        this.get('model').after('change', this._modelChange, this);
    },

    render: function () {
        this.get('container').append(
            this._buildButtonsGroup() +
            this._buildGotoGroup() +
            this._buildPerPageGroup()
        );

        this._rendered = true;

        var model = this.get('model');

        this._updateControlsUI(model.get('page'));
        this._updateItemsPerPageUI(model.get('itemsPerPage'));

        return this;
    },

    _buildButtonsGroup: function () {
        var temp = this.buttonTemplate,
            strings = this.get('strings');

        return '<div class="controls group">' +
                    sub(temp, { type: 'first', label: strings.first} ) +
                    sub(temp, { type: 'prev', label: strings.prev }) +
                    sub(temp, { type: 'next', label: strings.next }) +
                    sub(temp, { type: 'last', label: strings.last }) +
                '</div>';
    },

    _buildGotoGroup: function () {
        var strings = this.get('strings');

        return '<form action="#" class="group">' +
                    '<label>' + strings.goToLabel +
                    '<input type="text" value="' + this.get('model').get('page') + '">' +
                    '<button>' + strings.goToAction + '</button>' +
                    '</label>' +
                '</form>';
    },

    _buildPerPageGroup: function () {
        // return {string} div containing a label and select of options
        var strings = this.get('strings'),
            select = '<div class="group per-page">' +
                        '<label>' + strings.perPage + ' <select>',
            options = this.get('perPage'),
            i,
            len;

        for (i=0, len = options.length; i < len; i++) {
            select += '<option value="' +
                        ( options[i].value || options[i] ) + '">' +
                        ( options[i].label || options[i] ) + '</option>';
        }

        select += '</select></label></div>';

        return select;

    },

    _modelChange: function (e) {
        // update control states based on changes
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

    _updateControlsUI: function (val) {
        if (!this._rendered) {
            return;
        }

        var model = this.get('model'),
            container = this.get('container'),
            hasPrev = model.hasPrevPage(),
            hasNext = model.hasNextPage();

        container.one('.control-first').toggleClass(CLASS_DISABLED, !hasPrev);
        container.one('.control-prev').toggleClass(CLASS_DISABLED, !hasPrev);
        container.one('.control-next').toggleClass(CLASS_DISABLED, !hasNext);
        container.one('.control-last').toggleClass(CLASS_DISABLED, !hasNext);

        container.one('form input').set('value', val);
    },

    _updateItemsPerPageUI: function (val) {
        if (!this._rendered) {
            return;
        }

        this.get('container').one('select').set('value', val);
    },

    _controlClick: function (e) {
        e.preventDefault();
        // register click events from the four control buttons
        if (e.currentTarget.hasClass(CLASS_DISABLED)) {
            return;
        }
        this.fire(EVENT_UI, { type: e.currentTarget.getData('type') });
    },

    _controlChange: function (e) {
        // register change events from the perPage select
        if (e.currentTarget.hasClass(CLASS_DISABLED)) {
            return;
        }

        var val = e.currentTarget.get('value');
        this.fire(EVENT_UI, { type: 'perPage', val: parseInt(val, 10) });
    },

    _controlSubmit: function (e) {
        // the only form we have is the go to page form
        e.preventDefault();
        if (e.currentTarget.hasClass(CLASS_DISABLED)) {
            return;
        }
        var input = e.currentTarget.one('input');
        this.fire(EVENT_UI, { type: 'page', val: input.get('value') });
    },

    _initStrings: function () {
        // Not a valueFn because other class extensions will want to add to it
        this.set('strings', Y.mix((this.get('strings') || {}),
            Y.Intl.get('datatable-paginator')));
    }
}, {
    ATTRS: {
        strings: {},

        perPage: {
            value: [10, 50, 100, { label: 'Show All', value: -1 }]
        }

    }
});

function Controller () {}

Controller.ATTRS = {
    paginatorModel: {
        setter: '_setPaginatorModel',
        value: null,
        writeOnce: 'initOnly'
    },

    paginatorModelType: {
        getter: '_getConstructor',
        value: 'DataTable.Paginator.Model',
        writeOnce: 'initOnly'
    },

    paginatorView: {
        setter: '_setPaginatorView',
        value: null
    },

    paginatorViewType: {
        getter: '_getConstructor',
        value: 'DataTable.Paginator.View',
        writeOnce: 'initOnly'
    },

    // PAGINATOR CONFIGS
    pageSizes: {
        setter: '_setPageSizesFn',
        getter: '_getPageSizesFn'
    },
    rowsPerPage: {
        setter: '_setRowsPerPageFn',
        getter: '_getRowsPerPageFn'
    },
    location: {
        value: 'footer'
    }
};

Y.mix(Controller.prototype, {

    /// Sugar
    // would like to abstract this into something like table.page.next()
    firstPage: function () {
        this.get('paginatorModel').set('page', 1);
        return this;
    },
    lastPage: function () {
        var model = this.get('paginatorModel');
        model.set('page', model.get('totalPages'));
        return this;
    },
    previousPage: function () {
        this.get('paginatorModel').prevPage();
        return this;
    },
    nextPage: function () {
        this.get('paginatorModel').nextPage();
        return this;
    },


    /// Init and protected

    initializer: function () {
        var view = this.get('paginatorView'),
            model = this.get('paginatorModel');

        view.on('*:ui', this._uiPgHandler, this);

        this._augmentModelList();

        model.set('totalItems', this.get('data').size());
        model.after('change', this._afterModelChange, this);

        this.after('render', this._renderPg, this);
        this.after('dataChange', this._renderPg, this);
    },

    _renderPg: function () {
        var container = this.get('paginatorView').render().get('container');

        // TODO: respect `location` config for
        this.get('contentBox').append(container);
    },

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

    _afterModelChange: function (e) {
        var model = this.get('paginatorModel'),
            data = this.get('data');

        data._paged.index = (model.get('page') - 1) * model.get('itemsPerPage');
        data._paged.length = model.get('itemsPerPage');

        data.fire.call(data, 'reset', {
            src: 'reset',
            models: data._items.concat()
        });
    },

    _augmentModelList: function () {
        var model = this.get('paginatorModel');

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

            each: function (callback, thisObj) {
                var items = this.getPage(),
                    i, item, len;

                for (i = 0, len = items.length; i < len; i++) {
                    item = items[i];
                    callback.call(thisObj || item, item, i, this);
                }

                return this;
            }
        }, true);

    },

    _getConstructor: function (type) {
        return typeof type === 'string' ?
            Y.Object.getValue(Y, type.split('.')) :
            type;
    },

    // Model
    _setPaginatorModel: function (model) {
        var ModelConstructor = this.get('paginatorModelType');

        if (!(model && model._isYUIModel)) {
            model = new ModelConstructor(model);
        }

        return model;
    },

    // View
    _setPaginatorView: function (view) {
        var ViewConstructor = this.get('paginatorViewType'),
            viewConfig;

        if (!(view instanceof Y.View)) {
            viewConfig = Y.merge(view);

            viewConfig.container = this.get('container');
            viewConfig.model = this.get('paginatorModel');

            view = new ViewConstructor(viewConfig);
        } else {
            view.setAttrs({
                container: this.get('container'),
                model: this.get('paginatorModel')
            });
        }

        return view;
    },

    _setPageSizesFn: function (val) {
        var i,
            len = val.length,
            label,
            value;

        for ( i = 0; i < len; i++ ) {
            if (typeof val !== 'object') {
                label = val;
                value = val;

                // we want to check to see if we have a number or a string
                // of a number. if we do not, we want the value to be -1 to
                // indicate "all rows"
                if (parseInt(value, 10) != val) {
                    val = -1;
                }
                val = { label: val, value: val };
            }
        }

        this.get('paginatorView').set('perPage', val);
        return val;
    },

    _getPageSizesFn: function () {
        return this.get('paginatorView').get('perPage');
    },

    _setRowsPerPageFn: function (val) {
        this.get('paginatorModel').set('itemsPerPage', val);
        return val;
    },

    _getRowsPerPageFn: function () {
        return this.get('paginatorModel').get('itemsPerPage');
    }

}, true);


Y.DataTable.Paginator = Controller;
Y.DataTable.Paginator.Model = Model;
Y.DataTable.Paginator.View = View;

Y.Base.mix(Y.DataTable, [Y.DataTable.Paginator]);
