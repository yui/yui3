YUI.add('editor-lists', function(Y) {
    
    var EditorLists = function() {
        EditorLists.superclass.constructor.apply(this, arguments);
    };

    Y.extend(EditorLists, Y.Base, {
        initializer: function() {
            console.log(this);
            this.get('host').on('nodeChange', Y.bind(function(e) {
                switch (e.changedType) {
                    case 'tab':
                        if (e.changedNode.test('li, li *')) {
                            Y.log('Overriding TAB to move list', 'info', 'editorLists');
                            e.changedEvent.halt();
                            e.preventDefault();
                            var li = e.changedNode;
                            if (!li.test('li')) {
                                li = li.ancestor('li');
                            }
                            if (li.previous('li')) {
                                var newList = Y.Node.create("<ul></ul>");
                                li.previous('li').append(newList);
                                newList.append(li);
                                li.all('br').remove();
                                //Selection here..
                            } else {
                                Y.log('Can not tab on first item, nothing to append to', 'warn', 'editorLists');
                            }
                        }
                        break;
                }
            }, this));
        }
    }, {
        NAME: 'editorLists',
        NS: 'lists',
        ATTRS: {
            host: {
                value: false
            }
        }
    });


    Y.namespace('Plugin');

    Y.Plugin.EditorLists = EditorLists;

    Y.mix(Y.Plugin.ExecCommand.COMMANDS, {
        insertunorderedlist: function() {
        },
        insertorderedlist: function() {
        }
    });
});
