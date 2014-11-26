/*! jQuery-lazyResp v0.1.0 by Alessandro Benoit */
(function ($, window) {

  'use strict';

  var $w = $(window),
      pixel_ratio = window.devicePixelRatio;

  // The actual plugin constructor
  function Plugin(element, settings) {

    var $original_image = $(element),
        loaded = false;

    this.checkImage = function () {

      if ( loaded || !in_viewport($original_image) ) {
        return false;
      }

      this.getRightImageSize();

    };

    this.getRightImageSize = function () {

      var window_width = $w.width(),
          image_size;

      if ( $original_image.data('large') && window_width > parseInt(settings.large, 10) ){
        image_size = 'large';
      } else if ( $original_image.data('medium') && window_width > parseInt(settings.medium, 10) ) {
        image_size = 'medium';
      } else {
        image_size = 'small';
      }

      if ( pixel_ratio >= settings.retina && $original_image.data(image_size + '-retina') ){
        image_size = image_size + '-retina';
      }

      if (image_size === 'small'){
        return false;
      }

      $('<img/>', {
        src: $original_image.data(image_size),
        'class': $original_image.attr('class'),
        alt: $original_image.attr('alt')
      }).appendTo('body').hide().load(function () {
        $original_image.replaceWith($(this).css('display', $original_image.css('display')));
      });

    };

    function in_viewport ($e) {
      
      // Credits to jQuery ReVIEW - https://github.com/resrcit/ReVIEW
      var wo = $w.offset() ? $w.offset().top : 0,
          wlo = $w.offset() ? $w.offset().left : 0,
          wt = $w.scrollTop() + wo,
          wlt = $w.scrollLeft() + wlo,
          wb = wt + $w.height(),
          wlb = wlt + $w.width(),
          et = $e.offset().top,
          el = $e.offset().left,
          eb = et + $e.height(),
          elb = el + $e.width();

      return eb >= wt - settings.tolerance && et <= wb + settings.tolerance && elb >= wlt - settings.tolerance && el <= wlb + settings.tolerance;

    }

    this.checkImage();

    $(window).scroll( $.proxy(function () {
      this.checkImage();
    }, this));

    return this;

  }

  $.fn.lazyResp = function (options) {

    // Settings
    var settings = $.extend({
          medium: 640,
          large: 1024,
          retina: 1.01,
          tolerance: 0
        }, options);

    this.each(function () {
      if (!$.data(this, "lazyResp")) {
        $.data(this, "lazyResp", new Plugin(this, settings));
      }
    });

    this.refresh = $.proxy(function () {
      this.each(function() {
        if ($.data(this, "lazyResp")){
          $.data(this, "lazyResp").checkImage();
        }
      });
    }, this);

    return this;

  };

})(jQuery, this);
