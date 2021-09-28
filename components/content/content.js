(function() {

    var content  = $('#output');
    var scrollto = content.offset().left + (content.width() / 2);
    content.animate({scrollLeft: scrollto});

})();