var template = new Y.Template(),

    controlWrapper = '<li class="<%= this.classname %>"><%== this.control %></li>',

    control = '<a href="<%= this.link %>" title="<%= this.title %>" class="<%= this.classname %>"><%= this.label %></a>',

    pageWrapper = '<li class="<%= this.classname %>"><%== this.page %></li>',

    page = '<a href="<%= this.link %>" title="<%= this.title %>" class="<%= this.classname %>"><%= this.label %></a>',

    pageInput = '<label>Go to page: <input type="text"></label>',

    pageSelect = '<label>Go to page: <select><%= this.pageOptions %></select></label>',

    itemsSelect = '<label>Items per page: <select><option>10</option><option>50</option><option>100</option></select></label>',

    list = '<ul class="<%= this.classname %>"><%== this.first %><%== this.prev %><ul class="<%= this.pagesClass %>"><%== this.pages %></ul><%== this.next %><%== this.last %></ul>',

    dt = '<ul class="<%= this.classname %>"><%= this.first %><%= this.prev %><%= this.pageInput %><%= this.next %><%= this.last %><%= this.itemsSelect %></ul>',

    PageTemplates = {
        control: template.compile(control),
        controlWrapper: template.compile(controlWrapper),
        page: template.compile(page),
        pageWrapper: template.compile(pageWrapper),
        pageInput: template.compile(pageInput),
        pageSelect: template.compile(pageSelect),
        itemsSelect: template.compile(itemsSelect),
        list: template.compile(list),
        dt: template.compile(dt)
    };


Y.namespace('Paginator').Templates = PageTemplates;

if (Y.Lang.isFunction(Y.Paginator)) {
    Y.Base.mix(Y.Paginator, [PageTemplates]);
}
