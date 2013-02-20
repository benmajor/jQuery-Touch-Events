jQuery Mobile Events
====================

This is a series of plugins that create additional events that can be used in combination with jQuery when developing for mobile devices. The events are also compatible with desktop browsers to ensure ultimate compatibility for your projects. In time, we will update the Repository to include some very basic demos to get you started with using the events, but for now, we've put together a list of the events that are provided, and what they do.

As explained, the events are each triggered by native touch events, or alternatively by click events. The plugin automatically detects whether the user's device is touch compatible, and will use the correct native events whenever required. It is hoped that these events will help to aid single-environment development with jQuery for mobile web app development.

Events Provided:
---------------

+ **tapstart**  
Fired as soon as the user begins touching an element (or clicking, for desktop environments).
+ **tapend**  
Fired after the user releases their finger from the target element (or releases their mouse button on desktops).
+ **tap**  
This event is fired whenever the user taps and releases their finger on the target element. Caution should be observed when using this event in conjuction without tap events, especially ``doubletap``. This event will be fired twice when ``doubletap`` is used, so it is recommended to use ``singletap`` in this case.
+ **singletap**  
Unlike ``tap`` this event is only triggered once we are certain the user has only tapped the target element a single time. This will not be triggered by ``doubletap`` or ``taphold``, unlike ``tap``. Since we need to run some tests to make sure the user isn't double tapping or holding a tap on the target element, this event is fired with a short delay (currently of 500 milliseconds).
+ **doubletap**  
Triggered whenever the user double taps on the target element. The threshold (time between taps) is currently set at 500 milliseconds.
+ **taphold**  
This event is triggered whenever the user taps on the target element and leaves their finger on the element for at least *750 milliseconds*.
+ **swipe**  
This is called whenever the user swipes their finger on the target element. It is not direction-dependent, and is fired regardless of the direction the user swiped.
+ **swipeup**  
Similar to ``swipe``, except only called when the user swipes their finger in an upward direction on the target element (i.e. bottom to top)
+ **swiperight**  
Similar to ``swipe``, but triggered only when the user swipes their finger left to right on the target element.
+ **swipedown**  
Similar to ``swipe``, but triggered only when the user swipes their finger top to bottom on the target element.
+ **swipeleft**  
Similar to ``swipe``, but triggered only when the user swipes their finger from right to left.
+ **scrollstart**  
Triggered as soon as scrolling begins on the target element.
+ **scrollend**  
Triggered as soon as scrolling is stopped on the target element.
+ **orientationchange**  
This event is triggered when the orientiation of the device is changed. Please note that it uses throttling for non-mobile devices, or devices which do not support the native ``orientationchange`` event. In the latter instance, a detection of the viewport size change occurs.

Demo:
-----
I have put together a simple demo application that shows the numerous events in action. The console on the left hand side is used to show information about the events that have been called. You can examine the code easily by viewing the page's source to lear more about how this works. Please click on the below to check out the demo:

http://ben-major.co.uk/jquery-mobile-events/

Please be aware that this demonstration uses Google's hosted jQuery file, and also pulls the latest version of the events library from GitHub. It is a great place to check the status of the library. Since this demo uses the vanilla code, it is a good idea to check the library functionality here for your own reference. If you're running into problems with the library, please check this demonstration using your device in the first instance. You can scan in the QR below to go directly to the web page:

![Demonstration QR Code](http://qrfree.kaywa.com/?l=1&s=8&d=http%3A%2F%2Fben-major.co.uk%2Fjquery-mobile-events%2F)

Usage:
------
All of the events outlined above have been written using jQuery's ``event.special`` object, and so can be used in conjuction with jQuery's event handling functions, as well as shortcut wrappers.

**Binding a ``tap`` event to an element:**  
``$('#myElement').bind('tap', function(e) { console.log('User tapped #myElement'); });``

**Using with ``.on()`` and ``.live()``:**  
``$('#myElement').live('tap', function(e) { console.log('User tapped #myElement'); });``  
``$('#myElement').on('tap', function(e) { console.log('User tapped #myElement'); });``

**Triggering the event:**  
``$('#myElement').trigger('tap');``

**Removing the event with ``.off()``, ``.die()`` and ``.unbind()``:**  
``$('#myElement').off('tap', hander);``  
``$('#myElement').die('tap', hander);``  
``$('#myElement').unbind('tap', hander);``

**Using method wrapper:**  
``$('#myElement').tap(function(e) { console.log('User tapped #myElement'); });``

**Method chaining:**  
Chaining has also been preserved, so you can easily use these events in conjuction with other jQuery functions, or attach multiple events in a single, chained LOC:  
``$('#myElement').singletap(function() { console.log('singletap'); }).doubletap(function() { console.log('doubletap'); });``

Defining Thresholds:
--------------------
You can also define custom thresholds to be used for ``swipe`` events (``swipeup``, ``swiperight``, ``swipedown`` and ``swipeleft``) to prevent interference with scrolling and other events. To do so, simply assign a `data-xthreshold` or `date-ythreshold` to the target element as follows:

``<div id="mySwiper" data-xthreshold="500"></div>``

The value you define is the difference in pixels that the user must move before the event is triggered on the target element. If no threshold is defined, a default of 50px will be used. 

``data-xthreshold`` defines the horizontal threshold.

``data-ythreshold`` defines the vertical threshold.

Requirements:
-------------
The library works with jQuery 1.7.0+. All major browsers have been tested without problem. The library is not compatible with jQuery < 1.7.

License:
--------
Licensed under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
