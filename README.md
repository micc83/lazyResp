jQuery lazyResp
========

**lazyResp** is a jQuery plugin with a very small footprint ( *~ 0.7 Kb Gzipped* ) that handle images loading on multiple screen resolution. Check the **demo** on the [official web page](http://codeb.it/lazyresp/) of the plugin.

## How it works

Using **jQuery lazyResp** is pretty straightforward, just include the script in your page:
```html
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="../jquery.lazyresp.js"></script>
```
Then initialize it on `$(window).load()` as follow:

```html
<img src="http://placehold.it/480x360" height="250" width="250" class="lazyResp"
    data-small-retina="http://placehold.it/960x720" 
    data-medium="http://placehold.it/1024x768" 
    data-medium-retina="http://placehold.it/2048x1536" 
    data-large="http://placehold.it/1920x1440" 
    data-large-retina="http://placehold.it/2560x1920">
  
...
  
<script type="text/javascript">
$(window).load(function() {
  $('img.lazyResp').lazyResp();
});
</script>
```
Here's the script options and default values:
```javascript
$('img.lazyResp').lazyResp({
  medium: 640,    // Medium > 640px
  large: 1024,    // Large > 1024px
  retina: 1.01,   // Device pixel ratio to be considered retina >= 1.01
  tolerance: 0,   // Extend the viewport of 0px vertically and horizontally
  lazy: true,     // If set to false disable lazy loading
  beforeLoad: function (img) {},  // Do something before the right image is loaded
  afterLoad: function (img) {}    // Do something after the right image is loaded
});
```
**jQuery lazyResp** provide also a `refresh()` method to check if elements are in the viewport without having to scroll the page:
```javascript
var lr = $('img.lazyResp').lazyResp();
$('a.check').click(function (e) {
  e.preventDefault();
  lr.refresh();
});
```
You can also target a given image setting `lazy` to false in order to load the right image size on demand, here's an example using jQuery lazyResp with **jQuery owlCarousel**:
```javascript
$(document).ready(function() {
  $("#owl-demo").owlCarousel({
    singleItem:true,
    navigation : true,
    afterInit: function () {
      var $firstImage = $(this.owl.owlItems[0]).find('img');
      $firstImage.lazyResp({lazy:false});
    },
    afterMove: function () {
      var $currentImage = $(this.owl.owlItems[this.owl.currentItem]).find('img');
      $currentImage.lazyResp({lazy:false});
    }
  });
});
```
