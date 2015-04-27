;(function($){
		$.fn.drag=function(options){
			var opts=$.extend({   //整合默认参数和自定义参数
				allowX: false,
				allowY: false,
				subElement:null,
				onFinish: function(){}
			},options);

			var divCont=this;  //jquery插件的对象
			var commEnd={X:0,Y:0},
		        commStart={X:0,Y:0}
		    if(!opts.subElement){
		    	console.error('option subElement needed!');
		    }
		    var maxTop=-(opts.subElement.height()-divCont.height());
		    var maxLeft=-(opts.subElement.width()-divCont.width());
		    var instanceMoveX;
		    var instanceMoveY;

		    var comm = { // listeners for various event types.
				dragY: function (event) { // fingers, maxFingers, position
					if(event.fingers==1&&event.state=='down'){
						commStart.X=event.x;
						commStart.Y=event.y;
					}else if(event.fingers==1&&event.state=='up'){
						commEnd.X+=event.x-commStart.X;
						commEnd.Y+=event.y-commStart.Y;
						if(commEnd.Y>0){
							commEnd.Y=0;
						}
						if(commEnd.Y < maxTop){
							commEnd.Y=maxTop;
						}
					}else if(event.fingers==1&&event.state=='move'){
						instanceMoveY=commEnd.Y+event.y-commStart.Y;
						
						if(instanceMoveY>0){
							instanceMoveY=0;
						}
						if(instanceMoveY < maxTop){
							instanceMoveY=maxTop;
						}
						opts.subElement.css({
							'-webkit-transform': 'translateY('+ instanceMoveY +'px)'
						});
					}
				},
				dragX: function (event) { // fingers, maxFingers, position
					if(event.fingers==1&&event.state=='down'){
						commStart.X=event.x;
						commStart.Y=event.y;
					}else if(event.fingers==1&&event.state=='up'){
						commEnd.X+=event.x-commStart.X;
						commEnd.Y+=event.y-commStart.Y;
						if(commEnd.X>0){
							commEnd.X=0;
						}
						if(commEnd.X < maxLeft){
							commEnd.X=maxLeft;
						}
					}else if(event.fingers==1&&event.state=='move'){
						instanceMoveX=commEnd.X+event.x-commStart.X;
						
						if(instanceMoveX>0){
							instanceMoveX=0;
						}
						if(instanceMoveX < maxLeft){
							instanceMoveX=maxLeft;
						}
						opts.subElement.css({
							'-webkit-transform': 'translateX('+ instanceMoveX +'px)'
						});
					}
				},
				drag: function (event) { // fingers, maxFingers, position
					if(event.fingers==1&&event.state=='down'){
						commStart.X=event.x;
						commStart.Y=event.y;
					}else if(event.fingers==1&&event.state=='up'){
						commEnd.X+=event.x-commStart.X;
						commEnd.Y+=event.y-commStart.Y;
						if(commEnd.X>0 && commEnd.Y>0){
							commEnd.X=0;
							commEnd.Y=0;
						}
						if(commEnd.X < maxLeft){
							commEnd.X=maxLeft;
						}
						
						if(commEnd.Y < maxTop){
							commEnd.Y=maxTop;
						}
					}else if(event.fingers==1&&event.state=='move'){
						instanceMoveX=commEnd.X+event.x-commStart.X;
						instanceMoveY=commEnd.X+event.y-commStart.Y;
						console.log(instanceMoveX,instanceMoveY)
						
						if(instanceMoveX>0){
							instanceMoveX=0;
						}
						if(instanceMoveX < maxLeft){
							instanceMoveX=maxLeft;
						}
						if(instanceMoveY>0){
							instanceMoveY=0;
						}
						if(instanceMoveY < maxTop){
							instanceMoveY=maxTop;
						}
						opts.subElement.css({
							'-webkit-transform': 'translate('+ instanceMoveX +'px,'+ instanceMoveY +'px)'
						});
					}
				}
			};

			var init = function() {
				document.addEventListener("touchstart", eventjs.prevent);
				if( opts.allowY && !opts.allowX){
					divCont[0].addEventListener('drag', comm['dragY']);
				}else if( !opts.allowY && opts.allowX ){
					divCont[0].addEventListener('drag', comm['dragX']);
				}else if( opts.allowY && opts.allowX ){
					divCont[0].addEventListener('drag', comm['drag']);
				}
			};

			init();
		}
	})(jQuery);