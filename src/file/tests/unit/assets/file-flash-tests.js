YUI.add('file-flash-tests', function(Y) {

var Assert  = Y.Assert,
    suite = new Y.Test.Suite("File Flash"),
    btnRun  = Y.one("#btnRun");

    btnRun.set("disabled", false);


    suite.add(new Y.Test.Case({

        name: 'events',

        setUp: function () {
            var newFileConf = {};

            this.myUploader = new Y.UploaderFlash({});

            this.uniqueid = 'myuniqueid';

            newFileConf.id = this.uniqueid;
            newFileConf.name = 'myfilename';
            newFileConf.size = '1024';
            newFileConf.type = 'jpg';
            newFileConf.dateCreated = new Date();
            newFileConf.dateModified = new Date();
            newFileConf.uploader = this.myUploader;

            this.myFileFlash = new Y.FileFlash(newFileConf);

        },

        tearDown: function () {
            this.myUploader.destroy();
            this.myFileFlash.destroy();
        },

        "The FileFlash instance used in the test can fire an event": function () {
            Assert.isFunction(this.myFileFlash.fire, "The FileFlash instance lacks the fire() method");
            var ret = this.myFileFlash.fire('uploadstart');
            Assert.areEqual(true, ret, "Firing uploadstart did not return true");
        },

        "All the events dispatched by the Flash player are re-fired and can be listened to": function () {

            var eventsTriggered = 0;

            this.myFileFlash.on('file:uploadstart', function () {
                eventsTriggered += 1;
            });

            this.myFileFlash.on('file:uploadprogress', function () {
                eventsTriggered += 1;
            });

            this.myFileFlash.on('file:uploadcomplete', function () {
                eventsTriggered += 1;
            });

            this.myFileFlash.on('file:uploadcompletedata', function () {
                eventsTriggered += 1;
            });

            this.myFileFlash.on('file:uploadcancel', function () {
                eventsTriggered += 1;
            });

            this.myFileFlash.on('file:uploaderror', function () {
                eventsTriggered += 1;
            });

            var e = new Y.DOMEventFacade({type:'uploadstart', preventDefault: function () {}, stopPropagation: function () {}});

            //the _swfEventHandler requires an event.id equal to the file id attribute
            e.id = this.uniqueid;

            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(1, eventsTriggered);

            e.type = "uploadprogress";
            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(2, eventsTriggered);

            e.type = "uploadcomplete";
            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(3, eventsTriggered);

            e.type = "uploadcompletedata";
            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(4, eventsTriggered);

            e.type = "uploadcancel";
            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(5, eventsTriggered);

            e.type = "uploaderror";
            this.myFileFlash._swfEventHandler(e);
            Y.Assert.areEqual(6, eventsTriggered);
        }

    }));

    Y.Test.Runner.add(suite);

}, '@VERSION@', {
    requires: ['file-flash', 'uploader-flash']
});

