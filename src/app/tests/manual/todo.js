YUI.add('todo', function (Y) {

var TodoAppView, TodoList, TodoModel, TodoView;

// -- Model --------------------------------------------------------------------
TodoModel = Y.TodoModel = Y.Base.create('todoModel', Y.Model, [], {
    sync: LocalStorageSync('todo'),

    toggleDone: function () {
        this.set('done', !this.get('done')).save();
    }
}, {
    ATTRS: {
        createdAt: {valueFn: Y.Lang.now},
        done     : {value: false},
        text     : {value: ''}
    }
});

// -- ModelList ----------------------------------------------------------------
TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
    comparator: function (model) {
        return model.get('createdAt');
    },

    model: TodoModel,
    sync : LocalStorageSync('todo')
});

// -- Views --------------------------------------------------------------------
TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
    container: '<li class="todo-item"/>',
    template : Y.one('#todo-item-template').getContent(),

    events: {
        '.todo-checkbox': {click: 'toggleDone'},
        '.todo-content' : {click: 'edit'},

        '.todo-input'   : {
            blur    : 'save',
            keypress: 'enter'
        },

        '.todo-remove': {click: 'remove'}
    },

    initializer: function () {
        this.model.after('change', function(e){
            this.render();
        }, this);
    },

    render: function () {
        var model = this.model;

        this.container.setContent(Y.Lang.sub(this.template, {
            checked: model.get('done') ? 'checked' : '',
            text   : model.getAsHTML('text')
        }));

        this.inputNode = this.container.one('.todo-input');

        return this;
    },

    // -- Event Handlers -------------------------------------------------------
    edit: function () {
        this.container.addClass('editing');
        this.inputNode.focus();
    },

    enter: function (e) {
        if (e.keyCode === 13) { // enter key
            Y.one('#new-todo').focus();
        }
    },

    remove: function () {
        this.constructor.superclass.remove.call(this);

        this.model.delete().destroy();
        this.destroy();
    },

    save: function () {
        this.container.removeClass('editing');
        this.model.set('text', this.inputNode.get('value')).save();
    },

    toggleDone: function () {
        this.model.toggleDone();
    }
});

TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
    container: Y.one('#todo-app'),
    inputNode: Y.one('#new-todo'),

    events: {
        '#new-todo': {keypress: 'create'}
        // TODO: clear completed
    },

    initializer: function (config) {
        this.todoList = (config && config.todoList) || new TodoList();

        this.todoList.after('add', this.add, this);
        this.todoList.after('refresh', this.refresh, this);

        this.todoList.load();
    },

    // -- Event Handlers -------------------------------------------------------
    add: function (e) {
        new TodoView({
            model   : e.model,
            render  : this.container.one('#todo-list')
        });
    },

    create: function (e) {
        if (e.keyCode === 13) { // enter key
            this.todoList.create({
                text: this.inputNode.get('value')
            });

            this.inputNode.set('value', '');
        }
    },

    refresh: function (e) {
        var fragment = Y.one(Y.config.doc.createDocumentFragment());

        Y.Array.each(e.models, function (model) {
            new TodoView({
                model   : model,
                render  : fragment
            });
        });

        this.container.one('#todo-list').setContent(fragment);
    }
});

// -- localStorage Sync Implementation -----------------------------------------
function LocalStorageSync(key) {
    if (!key) { Y.error('No storage key specified.'); }
    if (!localStorage) { Y.error("localStorage isn't supported."); }

    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    function destroy (id) {
        var modelHash;

        if ((modelHash = data[id])) {
            delete data[id];
            save();
        }

        return modelHash;
    }

    function generateId () {
        var id = '',
            i  = 4;

        while (i--) {
            id += (((1 + Math.random()) * 0x10000) | 0)
                    .toString(16).substring(1);
        }

        return id;
    }

    function get(id) {
        return id ? data[id] : Y.Object.values(data);
    }

    function save() {
        localStorage && localStorage.setItem(key, Y.JSON.stringify(data));
    }

    function set(modelHash) {
        modelHash.id || (modelHash.id = generateId());
        data[modelHash.id] = modelHash;
        save();

        return modelHash;
    }

    return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached. `store` refers to the LocalStorageSync instance.
        var isModel = Y.Model && this instanceof Y.Model,
            hash;

        if (action === 'create' || action === 'update') {
            hash = this.toJSON();
            delete hash.clientId; // never store the clientId
        }

        switch (action) {
        case 'create': // intentional fallthru
        case 'update':
            callback(null, set(hash));
            return;

        case 'read':
            callback(null, get(isModel && this.get('id')));
            return;

        case 'delete':
            callback(null, destroy(isModel && this.get('id')));
            return;
        }
    };
}

}, '@VERSION@', {requires: ["event-focus", "json", "model", "model-list", "view"]});
