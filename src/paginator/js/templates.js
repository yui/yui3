var Micro = new Y.Template(Y.Template.Micro);

Y.namespace('Paginator').Templates = {

    pageText: Micro.compile('<%= this.currentPage %> of <%= this.totalPages %>'),

    itemText: Micro.compile('<%= this.currentItem %> of <%= this.totalItems %>'),

    pageNumber: Micro.compile('<a href="#" class="<%= data.classNames.pageIndex %>" page="<%= this.index %>" title="Page <%= this.index %>">' +
                    '<span><%= this.index %></span>' +
                '</a>'),

    firstLink: Micro.compile('<a href="#" class="<%= data.classNames.firstLink %>" title="">' +
                    '<span>First</span>' +
                '</a>'),

    lastLink: Micro.compile('<a href="#" class="<%= data.classNames.lastLink %>" title="">' +
                    '<span>Last</span>' +
                '</a>'),

    previousLink: Micro.compile('<a href="#" class="<%= data.classNames.previousLink %>" title="">' +
                    '<span>Previous</span>' +
                '</a>'),

    nextLink: Micro.compile('<a href="#" class="<%= data.classNames.nextLink %>" title="">' +
                    '<span>Next</span>' +
               '</a>')

    // list: '<< < # # # # # # ... > >>'

    // rows: ' << < # > >>     # of Rows: '

};