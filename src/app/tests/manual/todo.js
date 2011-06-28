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
        done: {value: false},
        text: {value: ''}
    }
});

// -- ModelList ----------------------------------------------------------------
TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [], {
    model: TodoModel,
    sync : LocalStorageSync('todo'),

    // Returns an array of all models in this list with the `done` attribute
    // set to `true`.
    done: function () {
        return Y.Array.filter(this.toArray(), function (model) {
            return model.get('done');
        });
    },

    // Returns an array of all models in this list with the `done` attribute
    // set to `false`.
    remaining: function () {
        return Y.Array.filter(this.toArray(), function (model) {
            return !model.get('done');
        });
    }
});

// -- Todo app view ------------------------------------------------------------
TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
    container: Y.one('#todo-app'),
    inputNode: Y.one('#new-todo'),
    template : Y.one('#todo-stats-template').getContent(),

    events: {
        '#new-todo'  : {keypress: 'createTodo'},
        '.todo-clear': {click: 'clearDone'},

        '.todo-item': {
            mouseover: 'hoverOn',
            mouseout : 'hoverOff'
        }
    },

    initializer: function () {
        var list = this.todoList = new TodoList();

        // Update the display when a new item is added to the list, or when the
        // entire list is refreshed.
        list.after('add', this.add, this);
        list.after('refresh', this.refresh, this);

        // Re-render the stats in the footer whenever an item is added, removed
        // or changed.
        list.after(['add', 'refresh', 'remove', 'todoModel:doneChange'],
                this.render, this);

        // Load saved items from localStorage, if available.
        list.load();
    },

    render: function () {
        var todoList = this.todoList,
            stats    = this.container.one('#todo-stats'),
            numRemaining, numDone;

        if (todoList.isEmpty()) {
            stats.empty();
            return this;
        }

        numDone      = todoList.done().length;
        numRemaining = todoList.remaining().length;

        stats.setContent(Y.Lang.sub(this.template, {
            numDone       : numDone,
            numRemaining  : numRemaining,
            doneLabel     : numDone === 1 ? 'task' : 'tasks',
            remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
        }));

        if (!numDone) {
            stats.one('.todo-clear').remove();
        }

        return this;
    },

    // -- Event Handlers -------------------------------------------------------

    // Creates a new TodoView instance and renders it into the list whenever a
    // todo item is added to the list.
    add: function (e) {
        var view = new TodoView({model: e.model});
        this.container.one('#todo-list').append(view.render().container);
    },

    // Removes all finished todo items from the list.
    clearDone: function (e) {
        var done = this.todoList.done();

        e.preventDefault();

        this.todoList.remove(done, {silent: true});

        Y.Array.each(done, function (todo) {
            todo.destroy({'delete': true});
        });

        this.render();
    },

    // Creates a new todo item when the enter key is pressed in the new todo
    // input field.
    createTodo: function (e) {
        if (e.keyCode === 13) { // enter key
            this.todoList.create({
                text: this.inputNode.get('value')
            });

            this.inputNode.set('value', '');
        }
    },

    // Turns off the hover state on a todo item.
    hoverOff: function (e) {
        e.currentTarget.removeClass('todo-hover');
    },

    // Turns on the hover state on a todo item.
    hoverOn: function (e) {
        e.currentTarget.addClass('todo-hover');
    },

    // Creates and renders views for every todo item in the list when the entire
    // list is refreshed.
    refresh: function (e) {
        var fragment = Y.one(Y.config.doc.createDocumentFragment());

        Y.Array.each(e.models, function (model) {
            var view = new TodoView({model: model});
            fragment.append(view.render().container);
        });

        this.container.one('#todo-list').setContent(fragment);
    }
});

// -- Todo item view -----------------------------------------------------------
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
        var model = this.model;

        // Re-render this view when the model changes, and destroy this view
        // when the model is destroyed.
        model.after('change', this.render, this);
        model.after('destroy', this.destroy, this);
    },

    render: function () {
        var container = this.container,
            model     = this.model,
            done      = model.get('done');

        container.setContent(Y.Lang.sub(this.template, {
            checked: done ? 'checked' : '',
            text   : model.getAsHTML('text')
        }));

        container[done ? 'addClass' : 'removeClass']('todo-done');
        this.inputNode = container.one('.todo-input');

        return this;
    },

    // -- Event Handlers -------------------------------------------------------

    // Toggles this item into edit mode.
    edit: function () {
        this.container.addClass('editing');
        this.inputNode.focus();
    },

    // When the enter key is pressed, focus the new todo input field. This
    // causes a blur event on the current edit field, which calls the save()
    // handler below.
    enter: function (e) {
        if (e.keyCode === 13) { // enter key
            Y.one('#new-todo').focus();
        }
    },

    // Removes this item from the list.
    remove: function (e) {
        e.preventDefault();

        this.constructor.superclass.remove.call(this);
        this.model.destroy({'delete': true});
    },

    // Toggles this item out of edit mode and saves it.
    save: function () {
        this.container.removeClass('editing');
        this.model.set('text', this.inputNode.get('value')).save();
    },

    // Toggles the `done` state on this item's model.
    toggleDone: function () {
        this.model.toggleDone();
    }
});

// -- localStorage Sync Implementation -----------------------------------------
function LocalStorageSync(key) {
    if (!key) { Y.error('No storage key specified.'); }
    if (!Y.config.win.localStorage) { Y.error("localStorage isn't supported."); }

    var data = Y.JSON.parse((localStorage && localStorage.getItem(key)) || '{}');

    function destroy(id) {
        var modelHash;

        if ((modelHash = data[id])) {
            delete data[id];
            save();
        }

        return modelHash;
    }

    function generateId() {
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

    function set(model) {
        var hash        = model.toJSON(),
            idAttribute = model.idAttribute;

        if (!Y.Lang.isValue(hash[idAttribute])) {
            hash[idAttribute] = generateId();
        }

        data[hash[idAttribute]] = hash;
        save();

        return hash;
    }

    return function (action, options, callback) {
        // `this` refers to the Model or ModelList instance to which this sync
        // method is attached. `store` refers to the LocalStorageSync instance.
        var isModel = Y.Model && this instanceof Y.Model;

        switch (action) {
        case 'create': // intentional fallthru
        case 'update':
            callback(null, set(this));
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
