jQuery lazyResp
========

jQuery plugin to lazy load responsive images with retina support.

## How it works

...

## What's behind jQuery lazyResp development?

Lately i dealt with the development of a website with a huge amount of images on the GUI. So i've looked around for solutions in order to keep the website fast and usable. I figured out that i was dealing with two main techniques: Lazy Loading and Responsive Images.

### Responsive Images

Let's see which images sizes are involved:

* Small screen no retina 480x360 ~ 43Kb * 10 images = 430 Kb
* Small screen retina 960x720 ~ 119Kb * 10 images = 1.190 Kb
* Medium screen no retina 1024x768 ~ 131Kb * 10 images = 1.310 Kb
* Medium screen retina 2048x1536 ~ 353Kb * 10 images = 3.530 Kb
* Large screen no retina 1920x1440 ~ 322Kb * 10 images = 3.220 Kb
* Large screen retina 2560x1920 ~ 483Kb * 10 images = 4.830Kb

The first thing i noticed is that Small screen total image size (430Kb) is ridicoulous if compared with any of the other sizes. So i started doing some test using Chrome development tools to limit the bandwidth to Edge/3G connection on small and medium screen size. The only condition in which the website was fully usable was indeed with the small images set.

The problem is that most of the javascript plugin available to handle responsize images are loading directly the screen fitting image so untill all the high res images are fully loaded the website isn't usable at all.

With jQuery lazyResp small screen images load first while screen fitting image are loaded only after the window is fully loaded replacing previous loaded small images.

The pro of this solution are:

* Low res images are loaded pretty fast on slow connections in order to give shape to the user interface before high res images get loaded;
* On fast connections you almost don't see small images beeing loaded as they are replaced almost instantly by the right image size;
* On large screen when a slow connection is present something is shown even if at a very poor quality while nothing would be, for example, if trying to load directy large screen retina images (4Mb takes 2.5 minutes to download on Edge Connection, i guess most people would leave the website far before).

Looking at the cons:

* All the images need to have the same aspect ratio;
* A very small delay is added to the loading of the right image size.

As you can see this solution might fit your needs, or may not. Just do a lot of testing when images loading speed is crytical to the website usability.

### Lazy loading

Actually i didn't add much to a standard lazy loading script. When small screen images get into the viewport the high quality image is loaded saving bandwidth,thanks to [jQuery ReVIEW](https://github.com/resrcit/ReVIEW) for the viewport visibily code.

