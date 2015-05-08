;
(function($) {
	$.fn.dragPinch = function(options) {


		var divCont = this; //jquery插件的对象
		var endParas = {
				Rotate: 0,
				Scale: 1,
				X: 0,
				Y: 0
			},
			startParas = {
				X: 0,
				Y: 0
			},
			canDrag = true;

		var body = $('body')[0];


		var opts = $.extend({ //整合默认参数和自定义参数
			restrict: [30, 30],
			onFinish: function(endParas) {}
		}, options);


		if(opts.dragArea){
			body=opts.dragArea[0];
		}

		var gestures = { // listeners for various event types.
			gesture: function(event) { // fingers, minFingers, maxFingers
				// log(event, "gesture", "identifier", "state", "fingers", "rotation", "scale");
				// log(event, "rotation", "scale");
				if (event.state == 'start') {
					canDrag = false;
				} else if (event.state == 'end') {
					endParas.Scale = endParas.Scale * event.scale;
					endParas.Rotate = endParas.Rotate + event.rotation;
					opts.onFinish(endParas);
					setTimeout(function() {
						canDrag = true;
					}, 100);
				} else if (event.fingers == 2 && event.state == 'change') {
					var a = endParas.Scale * event.scale;
					var b = endParas.Rotate + event.rotation;
					// write( endParas.X );
					divCont.css({
						'position':'relative',
						'-webkit-transform': 'scale(' + a + ') rotate(' + b + 'deg)',
						'left': (endParas.X) + 'px',
						'top': (endParas.Y) + 'px'
					});
				}
			},
			drag: function(event) { // fingers, maxFingers, position
				// log(event, "gesture", "identifier", "state", "fingers", "state", "x", "y");
				// log(event, "state", "fingers", "state", "x", "y");
				// write( event.x );
				if (canDrag) {
					if (event.fingers == 1 && event.state == 'down') {
						startParas.X = event.x;
						startParas.Y = event.y;
					} else if (event.fingers == 1 && event.state == 'up') {
						endParas.X += event.x - startParas.X;
						endParas.Y += event.y - startParas.Y;
						opts.onFinish(endParas);
					} else if (event.fingers == 1 && event.state == 'move') {
						if (opts.restrict[0])
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'scale(' + endParas.Scale + ') rotate(' + endParas.Rotate + 'deg)',
								'left': (endParas.X + event.x - startParas.X) + 'px',
								'top': (endParas.Y + event.y - startParas.Y) + 'px'
							});
					}
				}
			}

		};

		divCont.stop = function() {
			document.removeEventListener("touchmove", eventjs.prevent);
			body.removeEventListener('gesture', gestures['gesture']);
			body.removeEventListener('drag', gestures['drag']);
		}

		divCont.restart = function() {
			eventjs.configure({
				modifySelectors: true,
				modifyEventListener: true
			});
			document.addEventListener("touchmove", eventjs.prevent);
			body.addEventListener('gesture', gestures['gesture']);
			body.addEventListener('drag', gestures['drag']);
		}

		divCont.reset = function() {
			document.removeEventListener("touchmove", eventjs.prevent);
			body.removeEventListener('gesture', gestures['gesture']);
			body.removeEventListener('drag', gestures['drag']);
			endParas = {
					Rotate: 0,
					Scale: 1,
					X: 0,
					Y: 0
				},
				startParas = {
					X: 0,
					Y: 0
				},
				divCont.css({
					'-webkit-transform': 'scale(1) rotate(0deg)',
					'left': '0px',
					'top': '0px'
				});
			opts.onFinish(endParas);
		}

		var init = function() {
			eventjs.configure({
				modifySelectors: true,
				modifyEventListener: true
			});

			document.addEventListener("touchmove", eventjs.prevent);
			body.addEventListener('gesture', gestures['gesture']);
			body.addEventListener('drag', gestures['drag']);
		};

		init();

		return this;
	}
})(jQuery);