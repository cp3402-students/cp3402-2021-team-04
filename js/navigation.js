/* global jazzifyScreenReaderText */
/**
 * Theme functions file.
 * Modified version of the twentyseventeen theme
 * Contains handlers for navigation and widget area.
 */

(function ($) {
  var masthead, menuToggle, siteNavContain, siteNavigation;

  function initMainNavigation(container) {

    // Add dropdown toggle that displays child menu items.
    var dropdownToggle = $('<button />', {'class': 'dropdown-toggle', 'aria-expanded': false})
      .append($('<span />', {'class': 'dropdown-icon', text: '▾'}))
      .append($('<span />', {'class': 'screen-reader-text', text: jazzifyScreenReaderText.expand}));

    // Append dropdown-toggle to dropdown items
    container.find('.menu-item-has-children > a, .page_item_has_children > a').after(dropdownToggle);

    // Handle click of the dropdown toggle
    container.find('.dropdown-toggle').on('click', function (e) {
      var _this = $(this),
        screenReaderSpan = _this.find('.screen-reader-text');
      dropdownIcon = _this.find('.dropdown-icon');

      e.preventDefault();
      _this.toggleClass('toggled-on');
      _this.next('.children, .sub-menu').toggleClass('toggled-on');

      _this.attr('aria-expanded', _this.attr('aria-expanded') === 'false' ? 'true' : 'false');

      screenReaderSpan.text(screenReaderSpan.text() === jazzifyScreenReaderText.expand ? jazzifyScreenReaderText.collapse : jazzifyScreenReaderText.expand);
      dropdownIcon.text(dropdownIcon.text() === '▴' ? '▾' : '▴');
    });
  }

  initMainNavigation($('.main-navigation'));

  masthead = $('#masthead');
  menuToggle = masthead.find('.menu-toggle');
  siteNavContain = masthead.find('.main-navigation');
  siteNavigation = masthead.find('.main-navigation > div > ul');

  // Enable menuToggle.
  (function () {

    // Return early if menuToggle is missing.
    if (!menuToggle.length) {
      return;
    }

    // Add an initial value for the attribute.
    menuToggle.attr('aria-expanded', 'false');

    menuToggle.on('click.jazzify', function () {
      siteNavContain.toggleClass('toggled-on');

      $(this).attr('aria-expanded', siteNavContain.hasClass('toggled-on'));
    });
  })();

  // Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
  (function () {
    if (!siteNavigation.length || !siteNavigation.children().length) {
      return;
    }

    // Toggle `focus` class to allow submenu access on tablets.
    function toggleFocusClassTouchScreen() {
      if ('none' === $('.menu-toggle').css('display')) {

        $(document.body).on('touchstart.jazzify', function (e) {
          if (!$(e.target).closest('.main-navigation li').length) {
            $('.main-navigation li').removeClass('focus');
          }
        });

        siteNavigation.find('.menu-item-has-children > a, .page_item_has_children > a')
          .on('touchstart.jazzify', function (e) {
            var el = $(this).parent('li');

            if (!el.hasClass('focus')) {
              e.preventDefault();
              el.toggleClass('focus');
              el.siblings('.focus').removeClass('focus');
            }
          });

      } else {
        siteNavigation.find('.menu-item-has-children > a, .page_item_has_children > a').unbind('touchstart.jazzify');
      }
    }

    if ('ontouchstart' in window) {
      $(window).on('resize.jazzify', toggleFocusClassTouchScreen);
      toggleFocusClassTouchScreen();
    }

    siteNavigation.find('a').on('focus.jazzify blur.jazzify', function () {
      $(this).parents('.menu-item, .page_item').toggleClass('focus');
    });
  })();
})(jQuery);
