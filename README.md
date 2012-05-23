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