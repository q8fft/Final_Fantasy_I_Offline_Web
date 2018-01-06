
//クラス継承
function inherits(childCtor, parentCtor) {
  Object.setPrototypeOf(childCtor.prototype, parentCtor.prototype);
}

//Array
Array.prototype.remove = function(element){
	for(var i=0;i<this.length;i++){
		if(this[i]==element){
			this.splice(i,1);
			break;
		}
	}
};
Array.prototype.getCount = function(){
	var ret=0;
	for(var i=0;i<this.length;i++){
		if(this[i]){
			ret++;
		}
	}
	return(ret);
};
Array.prototype.sortOn=function(name){
	this.sort(
		function(a,b){
			var aName = a[name];
			var bName = b[name];
			if( aName < bName ) return -1;
			if( aName > bName ) return 1;
			return 0;
		 }
	);
};
Array.prototype.sortOn=function(name){
	this.sort(
		function(a,b){
			var aName = a[name];
			var bName = b[name];
			if( aName < bName ) return -1;
			if( aName > bName ) return 1;
			return 0;
		 }
	);
};
Array.prototype.getIndex=function(element){
	var ret=-1;
	for(var i=0;i<this.length;i++){
		if(this[i]==element){
			ret=i;
			break;
		}
	}
	return(ret);
};
if(!Array.prototype.filter){
	Array.prototype.filter = function(fun /*, thisp */){
		"use strict";

		if (this === void 0 || this === null)throw new TypeError();

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== "function")throw new TypeError();

		var res = [];
		var thisp = arguments[1];
		for (var i = 0; i < len; i++){
			if (i in t)	{
				var val = t[i]; // in case fun mutates this
				if (fun.call(thisp, val, i, t))res.push(val);
			}
		}

		return res;
	};
}

//query
function getQuery(isDecode) {
	var ret = {};
  var decode = (isDecode) ? decodeURIComponent : function(a) { return a; };
	var pair=location.search.substring(1).split('&');
	for(var i=0;pair[i];i++) {
    var kv = pair[i].split('=');
    ret[kv[0]]=decode(kv[1]);
	}
	return ret;
}
function makeQuery(obj, isEncode) {
	var ret = "";
  var encode = (isEncode) ? encodeURIComponent : function(a) { return a; };
	for(var i in obj){
		ret += i+"="+encode(obj[i])+"&";
	}
	return ret;
}


//popup
function popup(url,name,w,h,menu,st,scrl){
	menu=menu||0;
	st=st||0;
	scrl=scrl||1;
	//console.log('"width='+w+',height='+h+',menubar='+menu+',status='+st+',scrollbars='+scrl+'"')
	var per;
	if(w.toString().indexOf("%")!=-1){
		per=(w.substr(0,w.length-1))/100;
		h=screen.width*per;
	}
	if(h.toString().indexOf("%")!=-1){
		per=(h.substr(0,h.length-1))/100;
		h=screen.height*per;
	}

	window.open(url,name,"width="+w+",height="+h+",menubar="+menu+",status="+st+",scrollbars="+scrl);
}


//
function addZero(num,keta){
	var num2=num.toString();
	var orgKeta=num2.length;
	var ret=num2;
	for(var i=orgKeta+1;i<=keta;i++){
		ret="0"+ret;
	}
	return(ret);
}

var jumpTo,share;
$(function(){
	//css3 transition & animation callback
	$.fn.setCssCallback=function(type,func){
		var trg=(type=="transition")?"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd":"animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";
		//$(this).one(trg,func);
		$(this).bind(trg,function(_fn){
			return function(evt){
				if(evt.currentTarget == evt.target){
					_fn();
				}
			}
		}(func));
		return $(this);
	};
	$.fn.removeCssCallback=function(type){
		var trg=(type=="transition")?"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd":"animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd";
		$(this).unbind(trg);
		return $(this);
	};

	//smooth jump
	var jumpCompFunc;
	var jumpCompTO;
	var isAutoScroll;
	var scrollWithDlt;
	jumpTo=function($trg,offset,callback){
		if($trg.length===0)$trg=$("body");
		if(offset===undefined)offset=0;
		var pos=$trg.offset().top-offset;
		jumpCompFunc=(callback)?callback:function(){};
		var dist1=Math.abs($('html').scrollTop()-pos);
		var dist2=Math.abs($('body').scrollTop()-pos);
		if((dist1<1 && dist2<1) && pos!==0){
			jumpCompFunc();
		}else{
			isAutoScroll=true;
			var nowY=$(window).scrollTop();
			var duration=500+Math.abs(nowY-pos)*0.2;
			$('html,body').stop(true).animate({scrollTop:pos},duration,'easeOutQuart');
			$('html').animate({top:0},duration,'linear');
			//clearTimeout(jumpCompTO);
			//jumpCompTO=setTimeout(function(){jumpCompFunc();isAutoScroll=false;},duration-100);
		}
	};

	//share
	var href = $('meta[property="og:url"]').attr("content");
	//var href=location.href;
	//href=href.substr(0,href.lastIndexOf("/")+1);
	var ogTitle = $('meta[property="og:title"]').attr("content");
	var ogDesc = $('meta[property="og:description"]').attr("content");
	var hash = "FFRK,FINALFANTASY,はじまりの記憶";

	var twDesc = $('meta[name="twitter:description"]').attr("content");

	share = function(id,url,text){
	  var url = url || href;
	  var text = text || ogDesc;

	  var fbShare='http://www.facebook.com/sharer.php?u='+encodeURIComponent(url);
	  var twShare='http://twitter.com/share?text='+encodeURIComponent(text)+'&url='+encodeURIComponent(url)+'&hashtags='+encodeURIComponent(hash);
	  var lineShare='http://line.me/R/msg/text/?'+encodeURIComponent(text)+' '+encodeURIComponent(url+'?openExternalBrowser=1');

    //console.log("share",id);

	  switch(id){
	    case "fb":
      window.open(fbShare);
	    //popup(fbShare,"fasebook",500,400,0,0,0);
	    break;

	    case "tw":
      window.open(twShare);
	    //popup(twShare,"twitter",560,450,0,0,0);
	    break;

	    case "ln":
      window.open(lineShare);
	    //popup(lineShare,"line",500,400,0,0,0);
	    break;
	  }
	}

});
