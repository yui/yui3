YUI.add('todo-app', function (Y) {

var TodoAppView, TodoList, TodoModel, TodoView;

// -- Model --------------------------------------------------------------------

// The TodoModel class extends Y.Model and customizes it to use a localStorage
// sync provider (the source for that is further below) and to provide
// attributes and methods useful for todo items.

TodoModel = Y.TodoModel = Y.Base.create('todoModel', Y.Model, [Y.ModelSync.REST], {
    // This is the URL to the root Todos resource on the server.
    root: '/data/todos',

    // This method will toggle the `done` attribute from `true` to `false`, or
    // vice versa.
    toggleDone: function () {
        this.set('done', !this.get('done')).save();
    }
}, {
    ATTRS: {
        // Indicates whether or not this todo item has been completed.
        done: {value: false},

        // Contains the text of the todo item.
        text: {value: ''}
    }
});


// -- ModelList ----------------------------------------------------------------

// The TodoList class extends Y.ModelList and customizes it to hold a list of
// TodoModel instances, and to provide some convenience methods for getting
// information about the todo items in the list.

TodoList = Y.TodoList = Y.Base.create('todoList', Y.ModelList, [Y.ModelSync.REST], {
    // This tells the list that it will hold instances of the TodoModel class.
    model: TodoModel,

    // Returns an array of all models in this list with the `done` attribute
    // set to `true`.
    done: function () {
        return this.filter(function (model) {
            return model.get('done');
        });
    },

    // Returns an array of all models in this list with the `done` attribute
    // set to `false`.
    remaining: function () {
        return this.filter(function (model) {
            return !model.get('done');
        });
    }
});


// -- Todo App View ------------------------------------------------------------

// The TodoAppView class extends Y.View and customizes it to represent the
// main shell of the application, including the new item input field and the
// list of todo items.
//
// This class also takes care of initializing a TodoList instance and creating
// and rendering a TodoView instance for each todo item when the list is
// initially loaded or reset.

TodoAppView = Y.TodoAppView = Y.Base.create('todoAppView', Y.View, [], {
    // This is where we attach DOM events for the view. The `events` object is a
    // mapping of selectors to an object containing one or more events to attach
    // to the node(s) matching each selector.
    events: {
        // Handle <enter> keypresses on the "new todo" input field.
        '#new-todo': {keypress: 'createTodo'},

        // Clear all completed items from the list when the "Clear" link is
        // clicked.
        '.todo-clear': {click: 'clearDone'},

        // Add and remove hover states on todo items.
        '.todo-item': {
            mouseover: 'hoverOn',
            mouseout : 'hoverOff'
        }
    },

    // The `template` property is a convenience property for holding a
    // template for this view. In this case, we'll use it to store the
    // contents of the #todo-stats-template element, which will serve as the
    // template for the statistics displayed at the bottom of the list.
    template: Y.one('#todo-stats-template').getHTML(),

    // The initializer runs when a TodoAppView instance is created, and gives
    // us an opportunity to set up the view.
    initializer: function () {
        // Create a new TodoList instance to hold the todo items.
        var list = this.todoList = new TodoList();

        // Update the display when a new item is added to the list, or when the
        // entire list is reset.
        list.after('add', this.add, this);
        list.after('reset', this.reset, this);

        // Re-render the stats in the footer whenever an item is added, removed
        // or changed, or when the entire list is reset.
        list.after(['add', 'reset', 'remove', 'todoModel:doneChange'],
                this.render, this);

        // Load saved items from localStorage, if available.
        list.load();
    },

    // The render function is called whenever a todo item is added, removed, or
    // changed, thanks to the list event handler we attached in the initializer
    // above.
    render: function () {
        var todoList = this.todoList,
            stats    = this.get('container').one('#todo-stats'),
            numRemaining, numDone;

        // If there are no todo items, then clear the stats.
        if (todoList.isEmpty()) {
            stats.empty();
            return this;
        }

        // Figure out how many todo items are completed and how many remain.
        numDone      = todoList.done().length;
        numRemaining = todoList.remaining().length;

        // Update the statistics.
        stats.setHTML(Y.Lang.sub(this.template, {
            numDone       : numDone,
            numRemaining  : numRemaining,
            doneLabel     : numDone === 1 ? 'task' : 'tasks',
            remainingLabel: numRemaining === 1 ? 'task' : 'tasks'
        }));

        // If there are no completed todo items, don't show the "Clear
        // completed items" link.
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

        this.get('container').one('#todo-list').append(
            view.render().get('container')
        );
    },

    // Removes all finished todo items from the list.
    clearDone: function (e) {
        var done = this.todoList.done();

        e.preventDefault();

        // Remove all finished items from the list, but do it silently so as not
        // to re-render the app view after each item is removed.
        this.todoList.remove(done, {silent: true});

        // Destroy each removed TodoModel instance.
        Y.Array.each(done, function (todo) {
            // Passing {remove: true} to the todo model's `destroy()` method
            // tells it to delete itself from localStorage as well.
            todo.destroy({remove: true});
        });

        // Finally, re-render the app view.
        this.render();
    },

    // Creates a new todo item when the enter key is pressed in the new todo
    // input field.
    createTodo: function (e) {
        var inputNode, value;

        if (e.keyCode === 13) { // enter key
            inputNode = this.get('inputNode');
            value     = Y.Lang.trim(inputNode.get('value'));

            if (!value) { return; }

            // This tells the list to create a new TodoModel instance with the
            // specified text and automatically save it to localStorage in a
            // single step.
            this.todoList.create({text: value});

            inputNode.set('value', '');
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
    // list is reset.
    reset: function (e) {
        var fragment = Y.one(Y.config.doc.createDocumentFragment());

        Y.Array.each(e.models, function (model) {
            var view = new TodoView({model: model});
            fragment.append(view.render().get('container'));
        });

        this.get('container').one('#todo-list').setHTML(fragment);
    }
}, {
    ATTRS: {
        // The container node is the wrapper for this view. All the view's
        // events will be delegated from the container. In this case, the
        // #todo-app node already exists on the page, so we don't need to create
        // it.
        container: {
            valueFn: function () {
                return '#todo-app';
            }
        },

        // This is a custom attribute that we'll use to hold a reference to the
        // "new todo" input field.
        inputNode: {
            valueFn: function () {
                return Y.one('#new-todo');
            }
        }
    }
});


// -- Todo item view -----------------------------------------------------------

// The TodoView class extends Y.View and customizes it to represent the content
// of a single todo item in the list. It also handles DOM events on the item to
// allow it to be edited and removed from the list.

TodoView = Y.TodoView = Y.Base.create('todoView', Y.View, [], {
    // This customizes the HTML used for this view's container node.
    containerTemplate: '<li class="todo-item"/>',

    // Delegated DOM events to handle this view's interactions.
    events: {
        // Toggle the "done" state of this todo item when the checkbox is
        // clicked.
        '.todo-checkbox': {click: 'toggleDone'},

        // When the text of this todo item is clicked or focused, switch to edit
        // mode to allow editing.
        '.todo-content': {
            click: 'edit',
            focus: 'edit'
        },

        // On the edit field, when enter is pressed or the field loses focus,
        // save the current value and switch out of edit mode.
        '.todo-input'   : {
            blur    : 'save',
            keypress: 'enter'
        },

        // When the remove icon is clicked, delete this todo item.
        '.todo-remove': {click: 'remove'}
    },

    // The template property holds the contents of the #todo-item-template
    // element, which will be used as the HTML template for each todo item.
    template: Y.one('#todo-item-template').getHTML(),

    initializer: function () {
        // The model property is set to a TodoModel instance by TodoAppView when
        // it instantiates this TodoView.
        var model = this.get('model');

        // Re-render this view when the model changes, and destroy this view
        // when the model is destroyed.
        model.after('change', this.render, this);

        model.after('destroy', function () {
            this.destroy({remove: true});
        }, this);
    },

    render: function () {
        var container = this.get('container'),
            model     = this.get('model'),
            done      = model.get('done');

        container.setHTML(Y.Lang.sub(this.template, {
            checked: done ? 'checked' : '',
            text   : model.getAsHTML('text')
        }));

        container[done ? 'addClass' : 'removeClass']('todo-done');
        this.set('inputNode', container.one('.todo-input'));

        return this;
    },

    // -- Event Handlers -------------------------------------------------------

    // Toggles this item into edit mode.
    edit: function () {
        this.get('container').addClass('editing');
        this.get('inputNode').focus();
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
        this.get('model').destroy({'delete': true});
    },

    // Toggles this item out of edit mode and saves it.
    save: function () {
        this.get('container').removeClass('editing');
        this.get('model').set('text', this.get('inputNode').get('value')).save();
    },

    // Toggles the `done` state on this item's model.
    toggleDone: function () {
        this.get('model').toggleDone();
    }
});

}, '@VERSION@', {
    requires: ['event-focus', 'model', 'model-list', 'model-sync-rest', 'view']
});
