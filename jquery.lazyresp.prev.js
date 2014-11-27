/*! jQuery-lazyResp v0.1.0 by Alessandro Benoit */
(function ($, window, i) {

  'use strict';

  var $w = $(window),
      pixel_ratio = window.devicePixelRatio;

  // The actual plugin constructor
  function Plugin(element, settings) {

    var plugin = this,
        $original_image = $(element),
        original_image_display = $original_image.css('display'),
        loaded = false,
        last_quality = 1,
        id = i++;

    plugin.checkImage = function (reload) {

      if ( loaded || ($('#lazyResp_' + id).length > 0 && !in_viewport($('#lazyResp_' + id))) || !in_viewport($original_image) ) {
        return false;
      }

      this.getRightImageSize();

    };

    plugin.reloadImage = function () {

      loaded = false;

      if ( ($('#lazyResp_' + id).length > 0 && !in_viewport($('#lazyResp_' + id))) || !in_viewport($original_image) ) {
        return false;
      }

      this.getRightImageSize();

    };

    plugin.getRightImageSize = function () {

      var window_width = $w.width(),
          image_size,
          quality;

      if ( $original_image.data('large') && window_width > parseInt(settings.large, 10) ){
        image_size = 'large';
        quality = 5;
      } else if ( $original_image.data('medium') && window_width > parseInt(settings.medium, 10) ) {
        image_size = 'medium';
        quality = 3;
      } else {
        image_size = 'small';
        quality = 1;
      }

      if ( pixel_ratio >= settings.retina && $original_image.data(image_size + '-retina') ){
        image_size = image_size + '-retina';
        quality++;
      }

      if (image_size === 'small' || last_quality >= quality){
        return false;
      }

      loaded = true;
      settings.beforeLoad($original_image);

      $('<img/>', {
        src: $original_image.data(image_size),
        'class': $original_image.attr('class'),
        alt: $original_image.attr('alt')
      }).appendTo('body').hide().load(function () {
        last_quality = quality;
        if ( $('#lazyResp_' + id).length > 0 ){
          $('#lazyResp_' + id).remove();
        } else {
          $original_image.hide();
        }
        $(this).attr('id', 'lazyResp_' + id).css('display', original_image_display).insertAfter($original_image);
        settings.afterLoad($original_image, $(this));
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

    $(window).resize(function () {
      plugin.reloadImage();
    });
    
    if ( settings.lazy ){

      plugin.checkImage();

      $(window).scroll(function () {
        plugin.checkImage();
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
          beforeLoad: function (img) {},
          afterLoad: function (img, newImg) {}
        }, options);

    this.each(function () {
      if (!$.data(this, "lazyResp")) {
        $.data(this, "lazyResp", new Plugin(this, settings));
      }
    });

    this.refresh = $.proxy(function () {
      this.each(function() {
        $.data(this, "lazyResp").checkImage();
      });
    }, this);

    return this;

  };

})(jQuery, this, 0);
