var template = new Y.Template(),

    controlWrapper = '<li class="<%= this.classname %>"><%== this.control %></li>',

    control = '<a href="<%= this.link %>" title="<%= this.title %>" class="<%= this.classname %>"><%= this.label %></a>',

    pageWrapper = '<li class="<%= this.classname %>"><%== this.page %></li>',

    page = '<a href="<%= this.link %>" data-page="<%= this.number %>" title="Page <%= this.title %>" class="<%= this.classname %>"><%= this.label %></a>',

    pageInput = '<label class="<%= this.classname %>">Page <input type="text" value="<%= this.page %>"> of <%= this.pages %></label>',

    pageSelect = '<label class="<%= this.classname %>" class="<%= this.classname %>">Go to page: <select><%== this.options %></select></label>',

    pageSelectOption = '<option value="<%= this.page %>"<% if(this.selected) { %> selected="selected"<% }; %>><%= this.page %></option>',

    perPageSelect = '<label class="<%= this.classname %>">Items per page: <select><%== this.options %></label>',

    perPageSelectOption = '<option value="<%= this.display %>"<% if(this.selected) { %> selected="selected"<% }; %>><%= this.display %></option>',

    list = '<ul class="<%= this.classname %>"><%== this.first %><%== this.prev %><ul class="<%= this.pagesClass %>"><%== this.pages %></ul><%== this.next %><%== this.last %></ul>',

    dt = '<ul class="<%= this.classname %>"><%== this.first %><%== this.prev %><%== this.pageInput %><%== this.next %><%== this.last %><%== this.pageSelect %><%== this.perPageSelect %></ul>',

    all = '<ul class="<%= this.classname %>"><%== this.first %><%== this.prev %><ul class="<%= this.pagesClass %>"><%== this.pages %></ul><%== this.next %><%== this.last %><%== this.pageInput %><%== this.pageSelect %><%== this.perPageSelect %></ul>',

    PageTemplates = {
        control: template.compile(control),
        controlWrapper: template.compile(controlWrapper),
        page: template.compile(page),
        pageWrapper: template.compile(pageWrapper),
        pageInput: template.compile(pageInput),
        pageSelect: template.compile(pageSelect),
        pageSelectOption: template.compile(pageSelectOption),
        perPageSelect: template.compile(perPageSelect),
        perPageSelectOption: template.compile(perPageSelectOption),
        list: template.compile(list),
        all: template.compile(all),
        dt: template.compile(dt)
    };


Y.namespace('Paginator').Templates = PageTemplates;
