/*!
 * jQuery Mobile Events
 * by Ben Major (www.ben-major.co.uk)
 *
 * Copyright 2011, Ben Major
 * Licensed under the MIT License:
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

(function($) {

	var settings = {
		swipe_h_threshold 	: 50,
		swipe_v_threshold 	: 50,
		taphold_threshold 	: 750,
		doubletap_int       : 500,
		touch_capable       : ('ontouchstart' in document.documentElement),
		orientation_support : ('orientation' in window && 'onorientationchange' in window),
		startevent        	: ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown',
		endevent		  	: ('ontouchstart' in document.documentElement) ? 'touchend' : 'mouseup',
		moveevent         	: ('ontouchstart' in document.documentElement) ? 'touchmove' : 'mousemove',
		tapevent		  	: ('ontouchstart' in document.documentElement) ? 'tap' : 'click',
		scrollevent       	: ('ontouchstart' in document.documentElement) ? 'touchmove' : 'scroll',
		hold_timer 			: null,
		tap_timer 			: null
	};
	
	// Add Event shortcuts:
	$.each(('tapstart tapend tap singletap doubletap taphold swipe swipeup swiperight swipedown swipeleft scrollstart scrollend orientationchange').split(' '), function(i, name) {
		$.fn[name] = function(fn)
		{
			return fn ? this.bind(name, fn) : this.trigger(name);
		};
	
		$.attrFn[name] = true;
	});
	
	// tapstart Event:
	$.event.special.tapstart = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject);
			
			$this.bind(settings.startevent, function(e) {
				if(e.which && e.which !== 1)
				{
					return false;
				}
				else
				{
					triggerCustomEvent(thisObject, 'tapstart', e)
				}
			});
		}
	}
	
	// tapend Event:
	$.event.special.tapend = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject);
			
			$this.bind(settings.endevent, function(e) {
				triggerCustomEvent(thisObject, 'tapend', e);
			});
		}
	}
	
	// taphold Event:
	$.event.special.taphold = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject),
				origTarget,
				timer,
				start_pos = { x : 0, y : 0 };
			
			$this.bind(settings.startevent, function(e) {
				if(e.which && e.which !== 1)
				{
					return false;
				}
				else
				{
					$this.data('tapheld', false);
					origTarget = e.target;
					start_pos.x = (settings.touch_capabale) ? e.targetTouches[0].pageX : e.pageX;
					start_pos.y = (settings.touch_capabale) ? e.targetTouches[0].pageY : e.pageY;
					settings.hold_timer = window.setTimeout(function() {
						var end_x = (settings.touch_capabale) ? e.targetTouches[0].pageX : e.pageX,
							end_y = (settings.touch_capabale) ? e.targetTouches[0].pageY : e.pageY;
						if(e.target == origTarget && (start_pos.x == end_x && start_pos.y == end_y))
						{
							$this.data('tapheld', true);
							triggerCustomEvent(thisObject, 'taphold', e);
						}
					}, settings.taphold_threshold);
				}
			}).bind(settings.endevent, function() {
				window.clearTimeout(settings.hold_timer);
			});
		}
	}
	
	// doubletap Event:
	$.event.special.doubletap = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject),
				origTarget,
				action;
			
			$this.bind(settings.startevent, function(e) {
				if(e.which && e.which !== 1)
				{
					return false;
				}
				else
				{
					$this.data('doubletapped', false);
					origTarget = e.target;
				}
			}).bind(settings.endevent, function(e) {
				var now = new Date().getTime();
				var lastTouch = $this.data('lastTouch') || now + 1;
				var delta = now - lastTouch;
				window.clearTimeout(action);
				
				if(delta < settings.doubletap_int && delta > 0 && (e.target == origTarget))
				{
					$this.data('doubletapped', true);
					window.clearTimeout(settings.tap_timer);
					triggerCustomEvent(thisObject, 'doubletap', e);
				}
				else
				{
					$this.data('lastTouch', now);
					action = window.setTimeout(function(e){ window.clearTimeout(action); }, settings.doubletap_int, [e]);
				}
				$this.data('lastTouch', now);
			});
		}
	}
	
	// singletap Event:
	// This is used in conjuction with doubletap when both events are needed on the same element
	$.event.special.singletap = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject),
				origTarget = null,
				startTime  = null;
				
			$this.bind(settings.startevent, function(e) {
				if(e.which && e.which !== 1)
				{
					return false;
				}
				else
				{
					startTime = new Date().getTime();
					origTarget = e.target;
				}
			}).bind(settings.endevent, function(e) {
				if(e.target == origTarget)
				{
					settings.tap_timer = window.setTimeout(function() {
						if(!$this.data('doubletapped') && !$this.data('tapheld'))
						{
							triggerCustomEvent(thisObject, 'singletap', e);
						}
					}, settings.doubletap_int);
				}
			});
		}
	}
	
	// tap Event:
	$.event.special.tap = {
		setup: function() {
			var thisObject = this,
				$this = $(thisObject),
			    started = false,
				origTarget = null,
				start_time,
				start_pos = { x : 0, y : 0 };

			$this.bind(settings.startevent, function(e) {
				if(e.which && e.which !== 1)
				{
					return false;
				}
				else
				{
					started = true;
					start_pos.x = (settings.touch_capabale) ? e.targetTouches[0].pageX : e.pageX;
					start_pos.y = (settings.touch_capabale) ? e.targetTouches[0].pageY : e.pageY;
					start_time = new Date().getTime();
					origTarget = e.target;
				}
			}).bind(settings.endevent, function(e) { 
				// Only trigger if they've started, and the target matches:
				var end_x = (settings.touch_capabale) ? e.targetTouches[0].pageX : e.pageX,
					end_y = (settings.touch_capabale) ? e.targetTouches[0].pageY : e.pageY;
				
				if(origTarget == event.target && started && ((new Date().getTime() - start_time) < settings.taphold_threshold) && (start_pos.x == end_x && start_pos.y == end_y))
				{
					triggerCustomEvent(thisObject, 'tap', e);
				}
			});
		}
	};
	
	// swipe Event (also handles swipeup, swiperight, swipedown and swipeleft):
	$.event.special.swipe = {
		setup: function() {
			var thisObject = this,
			    $this = $(thisObject),
				originalCoord = { x: 0, y: 0 },
			    finalCoord    = { x: 0, y: 0 };
	
			// Screen touched, store the original coordinate
			function touchStart(event)
			{
				originalCoord.x = (settings.touch_capable) ? event.targetTouches[0].pageX : event.pageX;
				originalCoord.y = (settings.touch_capable) ? event.targetTouches[0].pageY : event.pageY;
				finalCoord.x = originalCoord.x
				finalCoord.y = originalCoord.y
			}
			
			// Store coordinates as finger is swiping
			function touchMove(event)
			{
				event.preventDefault();
				finalCoord.x = (settings.touch_capable) ? event.targetTouches[0].pageX : event.pageX;
				finalCoord.y = (settings.touch_capable) ? event.targetTouches[0].pageY : event.pageY;
				window.clearTimeout(settings.hold_timer);
			}
			
			function touchEnd(e)
			{
				var swipedir;
				if(originalCoord.y > finalCoord.y && (originalCoord.y - finalCoord.y > settings.swipe_v_threshold)) { swipedir = 'swipeup'; }
				if(originalCoord.x < finalCoord.x && (finalCoord.x - originalCoord.x > settings.swipe_h_threshold)) { swipedir = 'swiperight'; }
				if(originalCoord.y < finalCoord.y && (finalCoord.y - originalCoord.y > settings.swipe_v_threshold)) { swipedir = 'swipedown'; }
				if(originalCoord.x > finalCoord.x && (originalCoord.x - finalCoord.x > settings.swipe_h_threshold)) { swipedir = 'swipeleft'; }
				if(swipedir != undefined)
				{
					$this.trigger('swipe').trigger(swipedir);
				}
			}
			
			// Add gestures to all swipable areas
			thisObject.addEventListener(settings.startevent, touchStart, false);
			thisObject.addEventListener(settings.moveevent, touchMove, false);
			thisObject.addEventListener(settings.endevent, touchEnd, false);
		}
	};
	
	// scrollstart Event (also handles scrollend):
	$.event.special.scrollstart = {
		setup: function() {
			var thisObject = this,
				$this = $(thisObject),
				scrolling,
				timer;

			function trigger(event, state)
			{
				scrolling = state;
				triggerCustomEvent(thisObject, scrolling ? 'scrollstart' : 'scrollend', event);
			}

			// iPhone triggers scroll after a small delay; use touchmove instead
			$this.bind(settings.scrollevent, function(event) {
				if(!scrolling)
				{
					trigger(event, true);
				}
	
				clearTimeout(timer);
				timer = setTimeout(function() { trigger(event, false); }, 50);
			});
		}
	};
	
	// This is the orientation change (largely borrowed from jQuery Mobile):
	var win = $(window),
		special_event,
		get_orientation,
		last_orientation,
		initial_orientation_is_landscape,
		initial_orientation_is_default,
		portrait_map = { '0': true, '180': true };

	if(settings.orientation_support)
	{
		var ww = window.innerWidth || $(window).width(),
			wh = window.innerHeight || $(window).height(),
			landscape_threshold = 50;

		initial_orientation_is_landscape = ww > wh && (ww - wh) > landscape_threshold;
		initial_orientation_is_default = portrait_map[window.orientation];

		if((initial_orientation_is_landscape && initial_orientation_is_default) || (!initial_orientation_is_landscape && !initial_orientation_is_default))
		{
			portrait_map = { '-90': true, '90': true };
		}
	}

	$.event.special.orientationchange = special_event = {
		setup: function() {
			// If the event is supported natively, return false so that jQuery
			// will bind to the event using DOM methods.
			if(settings.orientation_support)
			{
				return false;
			}

			// Get the current orientation to avoid initial double-triggering.
			last_orientation = get_orientation();

			win.bind('throttledresize', handler);
		},
		teardown: function()
		{
			if (settings.orientation_support)
			{
				return false;
			}

			win.unbind('throttledresize', handler);
		},
		add: function(handleObj)
		{
			// Save a reference to the bound event handler.
			var old_handler = handleObj.handler;

			handleObj.handler = function(event)
			{
				event.orientation = get_orientation();
				return old_handler.apply(this, arguments);
			};
		}
	};

	// If the event is not supported natively, this handler will be bound to
	// the window resize event to simulate the orientationchange event.
	function handler()
	{
		// Get the current orientation.
		var orientation = get_orientation();

		if(orientation !== last_orientation)
		{
			// The orientation has changed, so trigger the orientationchange event.
			last_orientation = orientation;
			win.trigger( "orientationchange" );
		}
	}

	$.event.special.orientationchange.orientation = get_orientation = function() {
		var isPortrait = true,
		    elem = document.documentElement;

		if(settings.orientation_support)
		{
			isPortrait = portrait_map[window.orientation];
		}
		else
		{
			isPortrait = elem && elem.clientWidth / elem.clientHeight < 1.1;
		}

		return isPortrait ? 'portrait' : 'landscape';
	};
	
	// throttle Handler:
	$.event.special.throttledresize = {
		setup: function()
		{
			$(this).bind('resize', throttle_handler);
		},
		teardown: function()
		{
			$(this).unbind('resize', throttle_handler);
		}
	};

	var throttle = 250,
		throttle_handler = function()
		{
			curr = (new Date()).getTime();
			diff = curr - lastCall;

			if(diff >= throttle)
			{
				lastCall = curr;
				$(this).trigger('throttledresize');

			}
			else
			{
				if(heldCall)
				{
					window.clearTimeout(heldCall);
				}

				// Promise a held call will still execute
				heldCall = window.setTimeout(handler, throttle - diff);
			}
		},
		lastCall = 0,
		heldCall,
		curr,
		diff;
	
	// Trigger a custom event:
	function triggerCustomEvent( obj, eventType, event ) {
		var originalType = event.type;
		event.type = eventType;
		$.event.handle.call( obj, event );
		event.type = originalType;
	}
	
	// Correctly bind anything we've overloaded:
	$.each({
		scrollend: 'scrollstart',
		swipeup: 'swipe',
		swiperight: 'swipe',
		swipedown: 'swipe',
		swipeleft: 'swipe'
	}, function(e, srcE) {
		$.event.special[e] =
		{
			setup: function() {
				$(this).bind(srcE, $.noop);
			}
		};
	});
	
}) (jQuery);
