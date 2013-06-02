var files = [
'less/accordion.lessimport',
'less/alerts.lessimport',
'less/badges.lessimport',
'less/bootstrap.lessimport',
'less/breadcrumbs.lessimport',
'less/button-groups.lessimport',
'less/buttons.lessimport',
'less/carousel.lessimport',
'less/close.lessimport',
'less/code.lessimport',
'less/component-animations.lessimport',
'less/dropdowns.lessimport',
'less/forms.lessimport',
'less/glyphicons.lessimport',
'less/grid.lessimport',
'less/jumbotron.lessimport',
'less/labels.lessimport',
'less/list-group.lessimport',
'less/media.lessimport',
'less/mixins.lessimport',
'less/modals.lessimport',
'less/navbar.lessimport',
'less/navs.lessimport',
'less/normalize.lessimport',
'less/pager.lessimport',
'less/pagination.lessimport',
'less/panels.lessimport',
'less/popovers.lessimport',
'less/print.lessimport',
'less/progress-bars.lessimport',
'less/responsive-utilities.lessimport',
'less/scaffolding.lessimport',
'less/tables.lessimport',
'less/thumbnails.lessimport',
'less/tooltip.lessimport',
'less/type.lessimport',
'less/utilities.lessimport',
'less/variables.lessimport',
'less/wells.lessimport',
'js/bootstrap.js',
'fonts/glyphiconshalflings-regular.eot',
'fonts/glyphiconshalflings-regular.otf',
'fonts/glyphiconshalflings-regular.svg',
'fonts/glyphiconshalflings-regular.ttf',
'fonts/glyphiconshalflings-regular.woff'];

Package.describe({
  summary: 'Bootstrap 3 Less Package'
});

Package.on_use(function(api) {
  // files will be defined by bash script
  api.add_files(files, 'client');
});
