YUI.add('app-todo-tests', function (Y) {

var Assert = Y.Assert,

    newSelector       = '#new-todo',
    listSelector      = '#todo-list',
    remainingSelector = '#todo-stats .todo-remaining',

    suite = new Y.Test.Suite('Todo List Example App Suite');

suite.add(new Y.Test.Case({
    name: 'Example Tests',

    'Entering a new todo should add it to the list': function () {
        var input        = Y.one(newSelector),
            list         = Y.one(listSelector),
            remaining    = Y.one(remainingSelector),
            numItems     = list.get('children').size(),
            numRemaining = remaining ? parseInt(remaining.get('text'), 10) : 0;

        Assert.isNotNull(input, 'Todo input field not found.');
        Assert.isNotNull(list, 'Todo list not found.');

        input.set('value', 'buy milk');
        input.simulate('keypress', {keyCode: 13});
        numItems += 1;
        numRemaining += 1;

        Assert.areSame(numItems, list.get('children').size(), 'A new todo was not added to the list.');
        Assert.areSame(numRemaining, parseInt(Y.one(remainingSelector).get('text'), 10), 'Stats were not updated for new item.');
    },

    'Clicking a todo should allow you to edit its text': function () {
        var todo = Y.one(listSelector).get('lastChild');

        Assert.areSame('buy milk', todo.one('.todo-content').get('text'), 'Not the todo item added in previous test.');

        todo.one('.todo-content').simulate('click');
        todo.one('.todo-edit').one('input').set('value', 'Walk the dog').blur();

        Assert.areSame('Walk the dog', todo.one('.todo-content').get('text'), 'Todo was not updated.');
    },

    'Toggling a checkbox for a todo should change its "done" state.': function () {
        var todo         = Y.one(listSelector).get('lastChild'),
            checkbox     = todo.one('input[type=checkbox]'),
            numRemaining = parseInt(Y.one(remainingSelector).get('text'), 10);

        Assert.isFalse(checkbox.get('checked'), 'Todo should not be done.');

        checkbox.simulate('click');
        numRemaining -= 1;

        // View gets re-rendered.
        checkbox = todo.one('input[type=checkbox]');

        Assert.isTrue(checkbox.get('checked'), 'Checkbox should be checked.');
        Assert.isTrue(todo.hasClass('todo-done'), 'CSS class was not applied to todo.');
        Assert.areSame(numRemaining, parseInt(Y.one(remainingSelector).get('text'), 10), 'Stats were not updated.');

        checkbox.simulate('click');
        numRemaining += 1;

        // View gets re-rendered.
        checkbox = todo.one('input[type=checkbox]');

        Assert.isFalse(checkbox.get('checked'), 'Checkbox should be unchecked.');
        Assert.isFalse(todo.hasClass('todo-done'), 'CSS class was not removed from todo.');
        Assert.areSame(numRemaining, parseInt(Y.one(remainingSelector).get('text'), 10), 'Stats were not updated.');
    },

    'Click the remove button should remove the todo': function () {
        var list     = Y.one(listSelector),
            todo     = list.get('lastChild'),
            numItems = list.get('children').size();

        Assert.isTrue(list.contains(todo), 'Todo is not a child of the list.');

        todo.one('.todo-remove').simulate('click');
        numItems -= 1;

        Assert.isFalse(list.contains(todo), 'Todo node was not removed form its parentNode.');
        Assert.areSame(numItems, list.get('children').size(), 'Todo was not removed from the list.');
    }
}));

Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['node', 'node-event-simulate']
});
