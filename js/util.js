/*
 2015.04.09 Mask modified based on CGQ版本
*/
;(function(){
	/*start--$.util.init
	//===========================================================================
	*/
	$.util = {} ;
	
	$.util.initShareTVAPI = function(callback){//分享
		try{
			if( shaketv ){
				callback() ;
			}else{
				$.getScript("http://yaotv.qq.com/shake_tv/include/js/jsapi.js", callback );
			}
		}catch(e){
			$.getScript("http://yaotv.qq.com/shake_tv/include/js/jsapi.js", callback );
		}
	};
	/*end--init*/
	
	/*start--$.util.queryString 从地址栏根据key获取value*/
	$.util.queryString = function(item){
		var locationHref = location.search;
		var svalue = locationHref.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
		return svalue ? svalue[1] : svalue;
	};
	/*end--queryString*/
	
	/*start--$.util.ajax 异步请求*/
	/**	
	 * 	默认JSOP方式发送请求，且不允许更改
	 * 	opt.url	RequestUrl		string
	 * 	opt.async				string
	 * 	opt.timeout default 3s	int
	 * 	opt.data RequestData-Object	object	
	 * 	opt.success				function
	 * 	opt.error				function
	 	opt.actionType			授权
	 * 
	 */
	$.util.ajax = function(opt){
		// window.debug("Request-URL:" + opt.url ); 
		opt.async = opt.async || true ;
		opt.dataType = opt.dataType || 'jsonp' ;
		opt.scriptCharset = opt.scriptCharset || 'UTF-8' ;
		opt.contentType = opt.contentType || 'application/x-www-form-urlencoded; charset=utf-8' ;
		opt.timeout = opt.timeout || (10*1000) ;
		opt.error = opt.error || function(errData){console.log(errData)} ;

		$.ajax({
			url : opt.url ,
			data : opt.data ,
			async : opt.async ,
			dataType : opt.dataType ,
			scriptCharset : opt.scriptCharset ,
			contentType: opt.contentType ,
			timeout : opt.timeout , 
			beforeSend : function(beforeData){
				if( opt.beforeSend ){
						opt.beforeSend.call( this , beforeData ) ;
				}
			},
			success : function( sucData ){
				if( opt.success ){
					opt.success.call( this , sucData ) ;
				}
				// if(sucData["ret"] == 0){
				// 	if( opt.success ){
				// 		opt.success.call( this , sucData ) ;
				// 	}	
				// }else{
				// 	if( opt.sucError ){
				// 		opt.sucError.call( this , sucData ) ;
				// 	}else{
				// 		window.alertbug("信息获取异常ret:" + sucData["ret"]);	
				// 	}
				// }
			},
			error : function( errData ){
				if( opt.error ){
					opt.error.call( this , errData ) ;
					//opt.error() ;
				}else{
				}
			},
			complete : function(data){
				//
			}
		}) ;
		
	};
	/*end--$.util.ajax*/
	
	
	/*start--$.util.share 分享工具类*/
	/**
	 * 	opt.img		string
	 * 	opt.url	string
	 * 	opt.title	string
	 * 	opt.desc	string
	 */
	$.util.share = function(opt){
		$.util.initShareTVAPI( function(){
			shaketv.wxShare( opt.img , opt.title , opt.desc , opt.url); 
		});
	};
	
	/*end--$.util.share*/
	
	/*start--$.util.getUserTicket*/
	/**
	 * 	opt.callback	function
	 */
	$.util.getUserTicket = function(opt){
		$.util.initShareTVAPI( function(){
			var ticket = shaketv.getUserTicket() ;
			opt.callback(ticket);
		} );
	};
	/*end--$.util.getUserTicket*/
	
	/*start--$.util.subscribe */
	/**一键关注
	 * 	opt.appid		string
	 * 	opt.callback	function
	 */
	$.util.subscribe = function(opt){
		$.util.initShareTVAPI(function(){
			shaketv.subscribe( opt.appid, opt.callback );
		});
	};
	/*end--$.util.subscribe */
	
	/*start--$.util.reserve */
	/**
	 * tvid,// 电视台的ID
	 * reserveid,// 预约ID，录入预约信息后会返回预约ID
	 * callback_function//处理调用结果，会传一个json{errorCode:0,errorMsg:""}的参数
	 */
	$.util.reserve = function( opt ){
		$.util.initShareTVAPI(function(){
			shaketv.subscribe( opt.tvid, opt.reserveid , opt.callback );
		});
	};
	/*end--$.util.reserve */
	
	/*start--$.util.Cookie */
	$.util.Cookie = function( key , value , expireMin ){
		this.key = key;
		this.expireMin = expireMin||-1 ;
		if( typeof value == "object"  )
			this.value = JSON.stringify( value );
		else
			this.value = value ;

		// window.debug("Cookie-Key：" + this.key );
		// window.debug("Cookie-Value：" + this.value );
		// window.debug("Cookie-expireMin：" + this.expireMin );

		this.set = function(){
			// window.debug("---------------Set-----------------");
			this.del();	//delete
			var cookieString = this.key + "=" + encodeURIComponent(this.value);
	        if (expireMin > 0) {
	            var date = new Date();
	            date.setTime(date.getTime() + expireMin * 60 * 1000);
	            cookieString = cookieString + "; expire=" + date.toGMTString();
	        }
	        document.cookie = cookieString;
		};

		this.del = function(){
			// window.debug("---------------Del-----------------");
			if( this.get() != null ){
				//this.set(this.key, "", -1);
				document.cookie = this.key + '=0;expires=' + new Date(0).toUTCString()
			}
		};
		
		this.get = function(){
	        var strCookie = document.cookie;
	        var arrCookie = strCookie.split(";");
	        var cookieValue = null  ;
	        for (var i = 0; i < arrCookie.length; i++) {
	            var arr = arrCookie[i].split("=");
	            if (arr[0].trim() == this.key.trim()){
	            	cookieValue =  decodeURIComponent(arr[1]);
	            	try{
	            		cookieValue = JSON.parse( cookieValue ) ;
	            	}catch(e){
	            		// not object
	            	}
	            	break ;
	            }
	        }
			// window.debug("---------------Get " + cookieValue + "-----------------");
	        return cookieValue ;
		} ;
		
		this.clear = function(){
			var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
	        if ( keys ) {
	            for (var i = keys.length; i--;)
	                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
	        }
		};
		
		return this ;
	};
	/*end--$.util.Cookie */
	

	/*start--$.util.alert */
	$.util.alert = function( tips,times,effect,mode ){
		if(times==undefined){
    		var optTimes=2000;
    	}else{
    		var optTimes=times;
    	}

        if(!$("#util-pop-alert").length){

            $("body").append("<div id=\"util-pop-alert\" class=\'pop_alert\'></div>")

            $("#util-pop-alert").css({
            	position: 'fixed',
            	left: '50%',
            	top: '50%',
            	background: 'rgba(0,0,0,.6)',
            	color: '#fff',
            	padding: '10px',
            	display: 'none',
            	'-webkit-transform':'translate(-50%,-50%)',
            	'transform':'translate(-50%,-50%)',
            	'z-index': '2000',
            	'max-width': '78%',
            	'border-radius': '5px',
            	'line-height': '1.5'
            });
        }

        if(!$("#util-pop-alert").is(':visible')){
        	$("#util-pop-alert").html(tips).fadeIn(150).delay(optTimes).fadeOut(150);
        }
    };
    /*end--$.util.alert */
})();