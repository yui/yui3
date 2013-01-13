var template = new Y.Template(),
    controlWrapper = '<li class="<%= classname %>"><%= control %></li>',
    control = '<a href="<%= link %>" title="<%= title %>" class="<%= classname %>"><%= label =></a>',
    pageWrapper = '<li class="<%= classname %>"><%= page %></li>',
    page = '<a href="<%= link %>" title="<%= title %>" class="<%= classname %>"><%= label =></a>',
    pageInput = '<label>Go to page: <input type="text"></label>',
    pageSelect = '<label>Go to page: <select><%= pageOptions %></select></label>',
    itemsSelect = '<label>Items per page: <select><option>10</option><option>50</option><option>100</option></select></label>',
    list = '<ul class="<%= classname %>"><%= first %><%= prev %><ul class="<%= pagesClass %>"><%= pages %></ul><%= next %><%= last %=></ul>',
    dt = '<ul class="<%= classname %>"><%= first %><%= prev %><%= pageInput %><%= next %><%= last %><%= itemsSelect %></ul>';




Y.Paginator.Templates = {
    control: template.compile(control),
    page: template.compile(page),
    pageInput: template.compile(pageInput),
    pageSelect: template.compile(pageSelect),
    itemsSelect: template.compile(itemsSelect),
    list: template.compile(list),
    dt: template.compile(dt)
};