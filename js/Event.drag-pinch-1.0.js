;
(function($) {
	$.fn.dragPinch = function(options) {

		var divCont = this; //jquery插件的对象
		var endParas = {
				Rotate: 0,
				Scale: 1,
				x: 0,
				y: 0
			},
			startParas = {
				x: 0,
				y: 0
			},
			canDrag = true;

		var body = $('body')[0];


		var opts = $.extend({ //整合默认参数和自定义参数
			// restrict: [30, 30],
			allowDrag:true,
			allowScale:true,
			allowRotate:true,
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
					if(opts.allowScale){
						endParas.Scale = endParas.Scale * event.scale;
					}
					if(opts.allowRotate){
						endParas.Rotate = endParas.Rotate + event.rotation;
					}
					opts.onFinish(endParas);
					setTimeout(function() {
						canDrag = true;
					}, 100);
				} else if (event.fingers == 2 && event.state == 'change') {
					if(opts.allowDrag){
						if(opts.allowScale && opts.allowRotate){
							var a = endParas.Scale * event.scale;
							var b = endParas.Rotate + event.rotation;
							// write( endParas.x );
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'scale(' + a + ') rotate(' + b + 'deg)',
								'left': (endParas.x) + 'px',
								'top': (endParas.y) + 'px'
							});
						}else if(opts.allowScale){
							var a = endParas.Scale * event.scale;
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'scale(' + a + ')',
								'left': (endParas.x) + 'px',
								'top': (endParas.y) + 'px'
							});
						}else if(opts.allowRotate){
							var b = endParas.Rotate + event.rotation;
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'rotate(' + b + 'deg)',
								'left': (endParas.x) + 'px',
								'top': (endParas.y) + 'px'
							});
						}
					}else{
						if(opts.allowScale && opts.allowRotate){
							var a = endParas.Scale * event.scale;
							var b = endParas.Rotate + event.rotation;
							// write( endParas.x );
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'scale(' + a + ') rotate(' + b + 'deg)'
							});
						}else if(opts.allowScale){
							var a = endParas.Scale * event.scale;
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'scale(' + a + ')'
							});
						}else if(opts.allowRotate){
							var b = endParas.Rotate + event.rotation;
							divCont.css({
								'position':'relative',
								'-webkit-transform': 'rotate(' + b + 'deg)'
							});
						}
					}
				}
			},
			drag: function(event) { // fingers, maxFingers, position
				// log(event, "gesture", "identifier", "state", "fingers", "state", "x", "y");
				// log(event, "state", "fingers", "state", "x", "y");
				// write( event.x );
				if (canDrag) {
					if (event.fingers == 1 && event.state == 'down') {
						startParas.x = event.x;
						startParas.y = event.y;
					} else if (event.fingers == 1 && event.state == 'up') {
						endParas.x += event.x - startParas.x;
						endParas.y += event.y - startParas.y;
						opts.onFinish(endParas);
					} else if (event.fingers == 1 && event.state == 'move') {
						divCont.css({
							'position':'relative',
							'-webkit-transform': 'scale(' + endParas.Scale + ') rotate(' + endParas.Rotate + 'deg)',
							'left': (endParas.x + event.x - startParas.x) + 'px',
							'top': (endParas.y + event.y - startParas.y) + 'px'
						});
					}
				}
			}

		};

		divCont.stop = function() {
			document.removeEventListener("touchmove", eventjs.prevent);
			body.removeEventListener('gesture', gestures['gesture']);
			if(opts.allowDrag){
				body.removeEventListener('drag', gestures['drag']);
			}
		}

		divCont.restart = function() {
			eventjs.configure({
				modifySelectors: true,
				modifyEventListener: true
			});
			document.addEventListener("touchmove", eventjs.prevent);
			body.addEventListener('gesture', gestures['gesture']);
			if(opts.allowDrag){
				body.addEventListener('drag', gestures['drag']);
			}
		}

		divCont.reset = function() {
			document.removeEventListener("touchmove", eventjs.prevent);
			body.removeEventListener('gesture', gestures['gesture']);
			if(opts.allowDrag){
				body.removeEventListener('drag', gestures['drag']);
			}
			endParas = {
					Rotate: 0,
					Scale: 1,
					x: 0,
					y: 0
				},
				startParas = {
					x: 0,
					y: 0
				},
				divCont.css({
					'-webkit-transform': 'scale(1) rotate(0deg)',
					'left': '0px',
					'top': '0px'
				});
			opts.onFinish(endParas);
			divCont.restart();
		}

		var init = function() {
			eventjs.configure({
				modifySelectors: true,
				modifyEventListener: true
			});

			document.addEventListener("touchmove", eventjs.prevent);
			body.addEventListener('gesture', gestures['gesture']);
			if(opts.allowDrag){
				console.log(opts.allowDrag)
				body.addEventListener('drag', gestures['drag']);
			}
		};

		init();


		return this;
	}
})(jQuery);