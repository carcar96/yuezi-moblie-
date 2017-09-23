function Carousel(json){
	this.obj = json.obj;//对象
	this.auto = json.auto ? json.auto : false;	//是否自动轮播
	this.drap = json.drap ? json.drap : false;	//是否拖拽
	this.dot = json.dot ? json.dot : false;	//是否显示小圆点
	this.min = json.min ? json.min : false;	//是否显示缩略图
	this.arrow = json.arrow ? json.arrow : false;	//是否显示上、下一张
	this.item = json.item  ? json.item : 1;	//每个页面显示几个item

	this.flag = true;	//是否滚动完毕的标识
	this.timer = null;
	this.time = json.time ? json.time : 5000;	//轮播时间

	this.$ul = $(json.obj).children('ul');
	this.length = $(json.obj).find('li').length;
	this.liWidth = 0;
	this.bWidth = 0;
	this.marL = 0;
	this.key = this.length;	
	this.init();
};
Carousel.prototype = {
	//初始化
	init:function(){
		this.showMin();
		this.copyItem();
		this.dotHtml();
		this.autoPlay();
		this.drapSlide();
		this.tabDot();
		this.Arrow();
	},
	//复制一份
	copyItem:function(){
		this.$ul.append(this.$ul.html());
		this.bWidth = $(this.obj).width();
		var $aLi = this.$ul.find('li');		
		this.marL = parseInt($aLi.eq(2).css('marginLeft'));
		this.liWidth = this.bWidth/this.item;

		this.$ul.find('li').css('width',this.liWidth - this.marL*($aLi.length-1)/$aLi.length);
		this.$ul.css('width',this.liWidth*$aLi.length);
		this.$ul.css('left',-this.liWidth*this.length);
	},
	//自动轮播
	autoPlay:function(){
		if(!this.auto) return;
		var $that = this;
		setInterval(function(){
			if(!$that.flag) return;
			$that.key ++;
			$that.buffer(-$that.liWidth*$that.key);
			$that.curDot();
			$that.curMin();
		},this.time)
	},
	//滑动拖拽
	drapSlide:function(){
		if(!this.drap) return;
		var $that = this;
		var startX,moveX,idx,left=0;
		//按下
		$(this.$ul).on("touchstart",function(ev){
			if(!$that.flag) return;
			$that.flag = false;
			var x = ev.originalEvent.changedTouches[0].clientX;
		  	startX = x-$that.$ul.offset().left;
		  	left = $that.$ul.css('left');
		});
		//移动
		$(this.$ul).on("touchmove",function(ev){
		    var x = ev.originalEvent.changedTouches[0].clientX;
		    moveX = x - startX;
		    $that.$ul.css('left',moveX);
		});
		//松开
		$(this.$ul).on("touchend",function(ev){
			idx = -moveX/$that.liWidth;
		  	if(idx>$that.key){
		    	$that.key = Math.ceil(idx);
		    }else if(idx<$that.key){
		    	$that.key = Math.floor(idx);
		    }
			$that.buffer(-$that.bWidth/$that.item*$that.key);
			$that.curDot();
		})
	},
	//生成小圆点
	dotHtml:function(){
		if(!this.dot) return;
		var str = '';
		var length = Math.ceil(this.length/this.item);
		for(var i=0;i<this.length;i++){
			str += '<li></li>'
		}
		str = '<ol>'+ str +'</ol>';
		$(this.obj).append(str);
		this.curDot();
	},
	//选中小圆点
	curDot:function(){
		var $oaLi = $(this.obj).children('ol').children('li');
		$oaLi.eq(this.key%this.length).addClass('cur').siblings().removeClass();
	},
	//点击小圆点切换
	tabDot:function(){
		var $oaLi = $(this.obj).children('ol').children('li');
		var $that = this;
		$oaLi.each(function(idx,ele){
			$(ele).click(function(){
				if(!$that.flag) return;
				$that.key = $that.key+idx-$that.key%$that.length;
				$that.buffer(-$that.bWidth/$that.item*$that.key);
				$that.curDot($oaLi);
			})
		})
	},
	//是否显示缩略图
	showMin:function(){
		if(!this.min) return;
		var str = '';
		$(this.$ul).find('img').each(function(idx,ele){
			str += "<p>"+$(ele)[0].outerHTML+"</p>";
		})
		$(this.obj).append("<div class='min_p'>"+str+"</div>");
		this.tabMin();
	},
	//点击缩略图
	tabMin:function(){
		var $that = this;
		$(this.obj).find('.min_p p').each(function(idx,ele){
			if(!idx){
				$(ele).addClass('cur');
			}
			$(ele).click(function(){
				if(!$that.flag) return;
				$that.key = $that.key+idx-$that.key%$that.length;
				$that.buffer(-$that.bWidth/$that.item*$that.key);
				$that.curMin();
			})
		})
	},
	//选中缩略图
	curMin:function(){
		var $aP = $(this.obj).find('.min_p p');
		$aP.eq(this.key%this.length).addClass('cur').siblings().removeClass();
	},
	//是否显示左右箭头
	Arrow:function(){
		if(!this.arrow) return;
		var str = "<span class='left'><</span><span class='right'>></span>"
		$(this.obj).append(str);
		this.changeItem();
	},
	//上下一张
	changeItem:function(){
		var $that = this;
		//上一张
		$(this.obj).find('.left').click(function(){
			if(!$that.flag) return;
			$that.key--;
			$that.buffer(-$that.bWidth/$that.item*$that.key);
			$that.curDot();
		});
		//下一张
		$(this.obj).find('.right').click(function(){
			if(!$that.flag) return;
			$that.key++;
			$that.buffer(-$that.bWidth/$that.item*$that.key);
			$that.curDot();
		})
	},
	//缓冲运动
	buffer:function(t){
		var $that = this;
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			$that.flag = false;
			var current = parseInt($that.$ul.css('left'));
			var speed = (parseInt(t) - current) /5;
			speed = speed>0 ? Math.ceil(speed) : Math.floor(speed);

			$that.$ul.css('left',current+speed);
			if(!speed){
				$that.dealKey();
				clearInterval($that.timer);
			}
		},10)
	},
	//到达第2n个，返回n个
	dealKey:function(){
		var $liWidth = this.bWidth/this.item;
		if(this.key<=0){
			this.$ul.css('left',-$liWidth*this.length);
			this.key = this.length;
		}else if(this.key >= (this.length*2-this.item)){
			//this.length*2-this.item：复制ul部分的最后一个版面
			//this.length-this.item：原来ul部分的最后一个版面
			this.$ul.css('left',-$liWidth*(this.length-this.item));
			this.key = this.length-this.item;
		}
		this.flag = true;
	}
}