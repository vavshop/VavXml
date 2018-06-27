// ANIMATED MENU

var cbpAnimatedHeader = (function() {

  var docElem = document.documentElement,
    header = document.querySelector('.navbar-default'),
    didScroll = false,
    changeHeaderOn = 50;

  function init() {
    window.addEventListener('scroll', function(event) {
      if (!didScroll) {
        didScroll = true;
        setTimeout(scrollPage, 100);
      }
    }, false);
    window.addEventListener('load', function(event) {
      if (!didScroll) {
        didScroll = true;
        setTimeout(scrollPage, 100);
      }
    }, false);
  }

  function scrollPage() {
    var sy = scrollY();
    if (sy >= changeHeaderOn) {
      $('nav.navbar.navbar-default').addClass('navbar-shrink')
    } else {
        $('nav.navbar.navbar-default').removeClass('navbar-shrink')
    }
    didScroll = false;
  }

  function scrollY() {
    return window.pageYOffset || docElem.scrollTop;
  }

  init();

})();


// end menu
