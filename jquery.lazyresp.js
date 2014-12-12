/*! jQuery-lazyResp v0.1.1 by Alessandro Benoit */
(function ($, window) {

  'use strict';

  var $w = $(window),
      pixelRatio = window.devicePixelRatio;

  // The actual plugin constructor
  function Plugin(element, settings) {

    var plugin = this,
        $originalImage = $(element),
        loaded = false,
        lastQuality = 1;

    plugin.loadImage = function () {

      if ( loaded || !in_viewport($originalImage) ) {
        return false;
      }

      this.getRightImageSize();

    };

    plugin.reloadImage = function () {

      loaded = false;

      if ( !in_viewport($originalImage) ) {
        return false;
      }

      this.getRightImageSize();

    };

    plugin.getRightImageSize = function () {

      var window_width = $w.width(),
          imageSize,
          quality;

      if ( $originalImage.data('large') && window_width > parseInt(settings.large, 10) ){
        imageSize = 'large';
        quality = 5;
      } else if ( $originalImage.data('medium') && window_width > parseInt(settings.medium, 10) ) {
        imageSize = 'medium';
        quality = 3;
      } else {
        imageSize = 'small';
        quality = 1;
      }

      if ( pixelRatio >= settings.retina && $originalImage.data(imageSize + '-retina') ){
        imageSize = imageSize + '-retina';
        quality++;
      }

      if (imageSize === 'small' || lastQuality >= quality){
        // Events are fired with a custom attr when no image is loaded
        settings.beforeLoad($originalImage, true);
        settings.afterLoad($originalImage, true);
        return false;
      }

      loaded = true;
      settings.beforeLoad($originalImage);

      $('<img/>', {
        src: $originalImage.data(imageSize)
      }).load(function () {
        lastQuality = quality;
        $originalImage.attr('src', $(this).attr('src'));
        $(this).remove();
        settings.afterLoad($originalImage);
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

    $w.resize(function () {
      plugin.reloadImage();
    });
    
    if ( settings.lazy ){

      plugin.loadImage();

      $w.scroll(function () {
        plugin.loadImage();
      });

    } else {

      plugin.getRightImageSize();

    }

    return plugin;

  }

  $.fn.lazyResp = function (options) {

    // Settings
    var settings = $.extend({
          medium: 640,
          large: 1024,
          retina: 1.01,
          tolerance: 0,
          lazy: true,
          beforeLoad: function (img, preloaded) {},
          afterLoad: function (img, preloaded) {}
        }, options);

    this.each(function () {
      if ( !$.data(this, "lazyResp") ) {
        $.data(this, "lazyResp", new Plugin(this, settings));
      } else if ( !settings.lazy ){
        $.data(this, "lazyResp").getRightImageSize();
      }
    });

    this.refresh = $.proxy(function () {
      this.each(function() {
        $.data(this, "lazyResp").loadImage();
      });
    }, this);

    return this;

  };

})(jQuery, this);
