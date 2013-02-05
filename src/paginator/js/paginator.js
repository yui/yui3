var Y_Paginator = Y.namespace('Paginator'),
    getClassName = Y.ClassNameManager.getClassName,
    LNAME = NAME + '::',
    Paginator;

Paginator = Y.Base.create('paginator', Y.Widget, [], {

    renderUI: function () {
        console.log(LNAME, 'renderUI');
        this.get('view').render();
    },

    bindUI: function () {
        console.log(LNAME, 'bindUI');
        var view = this.get('view');

        this.on('*:first', this.first, this);
        this.on('*:last', this.last, this);
        this.on('*:prev', this.prev, this);
        this.on('*:next', this.next, this);
        this.on('*:page', this.page, this);
        this.on('*:perPage', this.perPage, this);

        view.addTarget(this);
        view.attachEvents();
    },

    // MODEL METHODS

    first: function() {
        console.log(LNAME, 'first');
        return this.get('model').first();
    },

    last: function () {
        console.log(LNAME, 'last');
        return this.get('model').last();
    },

    prev: function () {
        console.log(LNAME, 'prev');
        return this.get('model').prev();
    },

    next: function () {
        console.log(LNAME, 'next');
        return this.get('model').next();
    },

    page: function (e) {
        console.log(LNAME, 'page');
        return this.get('model').page(e.page);
    },

    perPage: function (e) {
        console.log(LNAME, 'perPage');
        return this.get('model').perPage(e.perPage);
    },

    hasPrev: function () {
        console.log(LNAME, 'bindUI');
        return this.get('model').hasPrev();
    },

    hasNext: function () {
        console.log(LNAME, 'bindUI');
        return this.get('model').hasNext();
    },


    //---- PROTECTED ----

    _getConstructor: function (type) {
        return typeof type === 'string' ?
            Y.Object.getValue(Y, type.split('.')) :
            type;
    },

    // ATTRS

    // Container
    _getContainer: function () {
        return this.get('boundingBox');
    },

    _setContainer: function (node) {
        this.set('boundingBox', node);
        return this.get('boundingBox');
    },

    // Model
    _setModel: function (model) {
        var ModelConstructor = this.get('modelType');

        if (!(model && model._isYUIModel)) {
            model = new ModelConstructor(model);
        }

        return model;
    },

    // View
    _setView: function (view) {
        var ViewConstructor = this.get('viewType'),
            viewConfig;

        if (!(view instanceof Y.View)) {
            viewConfig = Y.merge(view);

            delete viewConfig.container;
            delete viewConfig.model;

            view = new ViewConstructor(viewConfig);
        }

        view.setAttrs({
            container: this.get('container'),
            model: this.get('model')
        });

        return view;
    }


}, {
    ATTRS: {
        container: {
            getter: '_getContainer',
            setter: '_setContainer',
            value: null,
            writeOnce: true
        },

        model: {
            setter: '_setModel',
            value: null,
            writeOnce: 'initOnly'
        },

        modelType: {
            getter: '_getConstructor',
            value: 'Paginator.Model',
            writeOnce: 'initOnly'
        },

        view: {
            setter: '_setView',
            value: null
        },

        viewType: {
            getter: '_getConstructor',
            value: 'Paginator.View',
            writeOnce: 'initOnly'
        }
    }
});

Y.Paginator = Y.mix(Paginator, Y_Paginator);
