module('controlbar', function() {
  return {
    initAffix: function() {
      $('.control-bar').each(function() {
        $(this).affix({ offset: { top: 112 } });
      });
    }
  };
});
