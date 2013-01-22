var Y_Paginator = Y.Paginator,
    Y_Paginator_Templates = Y_Paginator.Templates,
    PREFIX = 'yui3-paginator',

    PaginatorView = Y.Base.create('paginator', Y.View, [], {

        events: {
            '.yui3-paginator-control': {
                'click': '_onControlClick'
            },
            '.yui3-paginator-page': {
                'click': '_onPageClick'
            },
            '.yui3-paginator-page-input input': {
                'change': '_onPageInputChange'
            },
            '.yui3-paginator-page-select select': {
                'change': '_onPageSelectChange'
            },
            '.yui3-paginator-per-page-select select': {
                'change': '_onPerPageSelectChange'
            }
        },

        initializer: function (config) {
            console.log(config);
            this.classNames = PaginatorView.CLASSNAMES;
            PaginatorView.superclass.initializer.apply(this, arguments);
        },

        render: function () {
            var container = this.get('container');

            container.setHTML(this.buildControls());

            if (!container.inDoc()) {
                Y.one('body').append(container);
            }
        },


        ///////////////////////////////////////
        // T E M P L A T E   R E N D E R I N G
        ///////////////////////////////////////

        buildControls: function () {},

        buildControl: function (type) {
            var link,
                title,
                label,
                classNames = this.classNames,
                controlClasses = [classNames.control],
                controller = this.controller,
                strings = this.get('strings');

            switch (type) {
                case 'first':
                    link = controller.formatUrl(1);
                    title = strings.firstTitle;
                    label = strings.firstText;
                    controlClasses.push(classNames.controlFirst);
                    disabled = !controller.hasPrev();
                    break;
                case 'prev':
                    link = controller.formatUrl(this.get('page') - 1);
                    title = strings.prevTitle;
                    label = strings.prevText;
                    controlClasses.push(classNames.controlPrev);
                    disabled = !controller.hasPrev();
                    break;
                case 'next':
                    link = controller.formatUrl(this.get('page') + 1);
                    title = strings.nextTitle;
                    label = strings.nextText;
                    controlClasses.push(classNames.controlNext);
                    disabled = !controller.hasNext();
                    break;
                case 'last':
                    link = controller.formatUrl(this.get('pages'));
                    title = strings.lastTitle;
                    label = strings.lastText;
                    controlClasses.push(classNames.controlLast);
                    disabled = !controller.hasNext();
                    break;
            }

            if (disabled) {
                controlClasses.push(classNames.controlDisabled);
            }

            return Y_Paginator_Templates.controlWrapper({
                classname: classNames.controlWrapper,
                control: Y_Paginator_Templates.control({
                    link: link,
                    title: title,
                    classname: controlClasses.join(' '),
                    label: label
                })
            });

        },

        buildPages: function () {
            console.log('buildPages', '::', 'Y.Paginator.View');
            var range = this.getDisplayRange(),
                pages = '',
                i,
                l;

            for(i = range.min, l = range.max; i <= l; i++) {
                pages += this.buildPage(i);
            }

            return pages;
        },

        buildPage: function (pageNumber) {
            console.log('buildPage', '::', 'Y.Paginator.View');
            var classNames = this.classNames,
                pageClasses = [
                    classNames.page,
                    classNames.page + '-' + pageNumber
                ],
                controller = this.controller;

            if (pageNumber === controller.get('page')) {
                pageClasses.push(classNames.controlSelected);
            }

            return Y_Paginator_Templates.pageWrapper({
                classname: classNames.pageWrapper,
                page: Y_Paginator_Templates.page({
                    link: controller.formatUrl(pageNumber),
                    title: pageNumber,
                    classname: pageClasses.join(' '),
                    label: pageNumber,
                    number: pageNumber
                })
            });
        },

        buildPageInput: function () {
            console.log('buildPageInput', '::', 'Y.Paginator.View');
            var classNames = this.classNames,
                inputClasses = [classNames.control, classNames.pageInput];
            // return <input> template with label and classnames
            return Y_Paginator_Templates.pageInput({
                classname: inputClasses.join(' '),
                page: this.controller.get('page'),
                pages: this.controller.get('pages')
            });
        },

        buildPageSelect: function () {
            console.log('buildPageSelect', '::', 'Y.Paginator.View');
            // loop through items and build options
            var classNames = this.classNames,
                selectClasses = [classNames.control, classNames.pageSelect],
                options = '',
                controller = this.controller,
                currentPage = controller.get('page'),
                i,
                l;

            for (i = 1, l = controller.get('pages'); i <= l; i++) {
                options += Y_Paginator_Templates.pageSelectOption({
                    page: i,
                    selected: i === currentPage
                });
            }
            // return <select> template with label, classnames and <option>s
            return Y_Paginator_Templates.pageSelect({
                options: options,
                classname: selectClasses.join(' ')
            });
        },

        buildPerPageSelect: function () {
            console.log('buildPerPageSelect', '::', 'Y.Paginator.View');
            // options should be predefined in template
            // return <select> template with label, classnames and <option>s
            var classNames = this.classNames,
                selectClasses = [classNames.control, classNames.perPageSelect],
                options = '',
                totalItems = this.controller.get('totalItems'),
                itemsPerPage = this.controller.get('itemsPerPage'),
                pageSizes = this.get('pageSizes'),
                pageSize,
                i,
                l;

            for (i = 0, l = pageSizes.length; i < l; i++) {
                pageSize = pageSizes[i]
                options += Y_Paginator_Templates.perPageSelectOption({
                    display: pageSize,
                    selected: pageSize === itemsPerPage ||
                        (
                            (pageSize === 'all' || pageSize === '*') &&
                            itemsPerPage === totalItems
                        )
                });
            }

            return Y_Paginator_Templates.perPageSelect({
                classname: selectClasses.join(' '),
                options: options
            });
        },

        getDisplayRange: function () {
            console.log('getDisplayRange', '::', 'Y.Paginator.View');
            var controller = this.controller,
                currentPage = controller.get('page'),
                pages = controller.get('pages'),
                displayRange = this.get('displayRange'),
                halfRange = Math.floor(displayRange / 2),

                minRange = currentPage - halfRange,
                maxRange = currentPage + halfRange;

            if (minRange < 1) {
              maxRange += -minRange;
            }

            if (maxRange > pages) {
              minRange -= maxRange - pages;
            }

            return {
                min: Math.max(1, minRange),
                max: Math.min(pages, maxRange)
            };
        },


        /////////////////////////////////////
        // T E M P L A T E   U P D A T I N G
        /////////////////////////////////////

        syncControls: function () {
            console.log('syncControls', '::', 'Y.Paginator.View');
            this.replaceControls();
            this.updateDisabled();
        },

        syncPages: function () {
            console.log('syncPages', '::', 'Y.Paginator.View');
            this.updatePages();
            this.updatePageInput();
            this.updatePageSelect();
            this.updateDisabled();
        },

        updateDisabled: function () {
            var container = this.get('container'),
                classNames = this.classNames,
                controller = this.controller,
                disabledClass = this.classNames.controlDisabled;

            container.one('.' + classNames.controlFirst).toggleClass(disabledClass, !controller.hasPrev());
            container.one('.' + classNames.controlPrev).toggleClass(disabledClass, !controller.hasPrev());
            container.one('.' + classNames.controlNext).toggleClass(disabledClass, !controller.hasNext());
            container.one('.' + classNames.controlLast).toggleClass(disabledClass, !controller.hasNext());
        },

        updatePages: function () {
            console.log('updatePages', '::', 'Y.Paginator.View');
            if (this.get('container').one('.' + this.classNames.pages)) {
                this.replacePages();
            }

        },

        updatePageInput: function () {
            console.log('updatePageInput', '::', 'Y.Paginator.View');
            var pageInput = this.get('container').one('.' + this.classNames.pageInput);

            if (pageInput) {
                pageInput.one('input').set('value', this.controller.get('page'));
            }
        },

        updatePageSelect: function () {
            console.log('updatePageSelect', '::', 'Y.Paginator.View');
            var pageSelect = this.get('container').one('.' + this.classNames.pageSelect),
                pages = this.controller.get('pages');

            if (pageSelect) {
                if (pageSelect.all('option').size() !== pages) {
                    pageSelect.replace(this.buildPageSelect());
                }
                pageSelect.one('select').set('value', this.controller.get('page'));
            }
        },

        updatePerPageSelect: function () {
            console.log('updatePerPageSelect', '::', 'Y.Paginator.View');
            var perPageSelect = this.get('container').one('.' + this.classNames.perPageSelect);

            if (perPageSelect) {
                perPageSelect.one('select').set('value', this.controller._viewItemsPerPage);
            }
        },

        replaceControls: function () {
            console.log('replaceControls', '::', 'Y.Paginator.View');

            this.get('container').setHTML(this.buildControls());

            this.updatePageInput();
            this.updatePageSelect();
            this.updatePerPageSelect();

            return this;
        },

        replacePages: function () {
            console.log('replacePages', '::', 'Y.Paginator.View');
            this.get('container').one('.' + this.classNames.pages).setHTML(this.buildPages());

            return this;
        },



        /////////////////////////////////
        // E V E N T   C A L L B A C K S
        /////////////////////////////////

        _onControlClick: function (e) {
            e.preventDefault();

            var control = e.target,
                classNames = this.classNames,
                controller = this.controller;

            if (control.hasClass(classNames.controlDisabled)) {
                return;
            }

            if (control.hasClass(classNames.controlFirst)) {
                controller.first();
            } else if (control.hasClass(classNames.controlPrev)) {
                controller.prev();
            } else if (control.hasClass(classNames.controlNext)) {
                controller.next();
            } else if (control.hasClass(classNames.controlLast)) {
                controller.last();
            }
        },

        _onPageClick: function (e) {
            console.log('_onPageClick');
            this.controller.set('page', e.target.getData('page'));
        },

        _onPageInputChange: function (e) {
            console.log('_onPageInputChange');
            this.controller.set('page', e.target.get('value'));
        },

        _onPageSelectChange: function (e) {
            console.log('_onPageSelectChange');
            this.controller.set('page', e.target.get('value'));
        },

        _onPerPageSelectChange: function (e) {
            console.log('_onPerPageSelectChange');
            this.controller.set('itemsPerPage', e.target.get('value'));
        },

        _defControllerSetter: function (val) {
            if (!this.controller) {
                this.controller = val;
            }
            return this.controller;
        },

        _defControllerGetter: function () {
            return this.controller;
        }

    }, {
        CLASSNAMES: {
            container: PREFIX + '-container',
            controls: PREFIX + '-controls',
            control: PREFIX + '-control',
            controlWrapper: PREFIX + '-control-wrapper',
            controlDisabled: PREFIX + '-control-disabled',
            controlSelected: PREFIX + '-control-selected',
            controlFirst: PREFIX + '-control-first',
            controlPrev: PREFIX + '-control-prev',
            controlNext: PREFIX + '-control-next',
            controlLast: PREFIX + '-control-last',
            pages: PREFIX + '-pages',
            page: PREFIX + '-page',
            pageWrapper: PREFIX + '-page-wrapper',
            pageSelect: PREFIX + '-page-select',
            pageInput: PREFIX + '-page-input',
            perPageSelect: PREFIX + '-per-page-select'
        },

        ATTRS: {
            pageSizes: {
                value: ['all']
            },
            controller: {
                setter: '_defControllerSetter',
                getter: '_defControllerGetter',
                lazyAdd: false
            }
        }
    });


Y.namespace('Paginator').View = PaginatorView;
