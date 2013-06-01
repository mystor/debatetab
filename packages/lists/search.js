Template.search_box.events({
  'submit .search_box': function(e, tmpl) {
    e.preventDefault();

    textbox = tmpl.find('input[type=text]');
    Session.set('search_query', textbox.val());
  }
});
