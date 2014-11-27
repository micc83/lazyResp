jQuery lazyResp
========

**lazyResp** is a jQuery plugin with a very small footprint ( *~ 0.7 Kb Gzipped* ) that handle images loading on multiple screen resolution.

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
## What's behind jQuery lazyResp development?

Lately i dealt with the development of a website with a huge amount of images on the GUI. So i've looked around for solutions in order to keep the website fast and usable. I figured out that i was dealing with two main techniques: *Responsive Images* and *Lazy Loading*.

### Responsive Images

Let's see which images sizes are involved:

* **Small screen no retina** 480x360 ~ 43Kb * 10 images = 430 Kb
* **Small screen retina (2x)** 960x720 ~ 119Kb * 10 images = 1.190 Kb
* **Medium screen no retina** 1024x768 ~ 131Kb * 10 images = 1.310 Kb
* **Medium screen retina (2x)** 2048x1536 ~ 353Kb * 10 images = 3.530 Kb
* **Large screen no retina** 1920x1440 ~ 322Kb * 10 images = 3.220 Kb
* **Large screen retina (2x)** 2560x1920 ~ 483Kb * 10 images = 4.830Kb

The first thing i noticed is that small screen images total size (430Kb) is ridicoulous if compared with any of the other sizes. So i started doing some test using **Chrome Dev Tools** to limit the bandwidth to *Edge/3G connection* on small and medium screen size. The only condition in which the website was fully usable was indeed with the small images set.

The problem is that most of the javascript plugin available to handle responsize images are loading directly the screen fitting image so untill all the high res images are fully loaded the website isn't really usable.

With **jQuery lazyResp** small screen images load first while screen fitting image are loaded only after the window is fully loaded replacing previous loaded small images.

#### Pros

* Low res images are loaded pretty fast on slow connections in order to give shape to the user interface before high res images get loaded;
* On fast connections you almost don't see small images beeing loaded as they are replaced almost instantly by the right image size;
* On large screen when a slow connection is present something is shown even if at a very poor quality while nothing would be, for example, if trying to load directy large screen retina images (*4Mb takes 2.5 minutes to download on Edge Connection, i guess most people would leave the website far before*).

#### Cons

* All the images need to have the same aspect ratio;
* Image sizes must be set in css (px, %, ecc..) in order to keep graphic consinstency;
* A very small delay is added to the loading of the right image size.

As you can see this solution might fit your needs, **or may not**. Just do a lot of testing when images loading speed is crytical to the website usability.

### Lazy loading

Actually i didn't add much to a standard lazy loading script. When small screen images get into the viewport (check on scroll event or manually) high quality images are loaded saving bandwidth, thanks to [jQuery ReVIEW](https://github.com/resrcit/ReVIEW) for the viewport visibily code.

