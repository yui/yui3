var Y_Paginator = Y.namespace('Paginator'),
    getClassName = Y.ClassNameManager.getClassName,
    LNAME = NAME + '::',
    PaginatorBase;

PaginatorBase = Y.Base.create('paginator', Y.View, [], {

    containerTemplate: '<div class="' + getClassName('paginator') + '"></div>',

    events: {
        '.yui3-paginator-control': {
            'click': 'controlClick',
            'change': 'controlChange'
        },
        '.yui3-paginator-page': {
            'click': 'pageClick'
        }
    },


    initializer: function () {
        console.log(LNAME, 'initializer');
        this.get('model').addTarget(this);
    },

    destructor: function () {
        console.log(LNAME, 'destructor');
    },

    render: function () {
        console.log(LNAME, 'render');

        this.renderUI();

        if (!this.bound) {
            this.bindUI();
        }
    },

    renderUI: function () {
        console.log(LNAME, 'renderUI');
        var container = this.get('container'),
            view = this.get('view');

        if (!view.get('model')) {
            view.set('model', this.get('model'));
            view.bind();
        }

        if (!view._container) {
            view.set('container', container);
        } else {
            container.append(view.get('container'));
        }

        view.render();

        if (!container.inDoc()) {
            Y.one('body').append(container);
        }
    },

    bindUI: function () {},

    // MODEL METHODS

    first: function() {
        return this._model.first();
    },

    last: function () {
        return this._model.last();
    },

    prev: function () {
        return this._model.prev();
    },

    next: function () {
        return this._model.next();
    },

    page: function (page) {
        return this._model.page(page);
    },

    perPage: function (perPage) {
        return this._model.perPage(perPage);
    },

    hasPrev: function () {
        return this._model.hasPrev();
    },

    hasNext: function () {
        return this._model.hasNext();
    },


    //---- PROTECTED ----


    // ATTRS
    _defModelVal: function () {
        console.log(LNAME, '_defModelVal');
        var Model = this.get('modelType');
        return new Model(this.getAttrs());
    },

    _modelSetter: function (val) {
        this._model = val;
        return val;
    },

    _defViewVal: function () {
        console.log(LNAME, '_defViewVal');
        var View = this.get('viewType');

        return new View({
            container: this.get('contentBox'),
            model: this.get('model')
        });
    },

    // EVENT CALL BACKS
    controlClick: function(e) {
        console.log(LNAME, 'controlClick');
        e.preventDefault();
        var model = this.get('model'),
            type = e.currentTarget.getData('type');

        if (model[type]) {
            (model[type])();
        }
    },

    controlChange: function (e) {
        console.log(LNAME, 'controlChange');
        e.preventDefault();

        var model = this.get('model'),
            type = e.currentTarget.getData('type');

        if (model[type]) {
            (model[type])(e.target.get('value'));
        }
    },

    pageClick: function(e) {
        console.log(LNAME, 'pageClick');
        e.preventDefault();
        this.get('model').page(e.currentTarget.getData('page'));
    }

}, {
    ATTRS: {
        model: {
            valueFn: '_defModelVal',
            setter: '_modelSetter'
        },

        view: {
            valueFn: '_defViewVal'
        },

        modelType: {
            value: Y_Paginator.Model
        },

        viewType: {
            value: Y_Paginator.View
        }
    }
});

Y_Paginator.Base = PaginatorBase;

Y.Paginator = Y.mix(PaginatorBase, Y_Paginator);
