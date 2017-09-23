function tabPage(json){
	this.obj = json.obj;
	this.data = json.data;

	this.pNum = json.pNum ? json.pNum :6;//每页条数
	this.nPage = 1;//当前页数
	this.tPage = 0;//总页数
	this.key = 0;

	this.init();
}
tabPage.prototype = {
	init:function(){
		this.page();
	},
	//处理分页
	page:function(){
		this.tPage = Math.ceil(this.data.length / this.pNum);
		if(this.tPage<1) return;//没有评论
		//有评论
		this.commentHtml();
		//总页数大于1
		if(this.tPage>1){
			var $that = this;
			this.createLi();
			$(this.obj).children('.page').show();
			$(this.obj).find('span').each(function(idx,ele){
				$(ele).click(function(){
					$that.changePage(idx);
				})
			})
		}
	},
	//生成评论列表
	commentHtml:function(){
		var start = (this.nPage - 1)*this.pNum;
		var end = this.nPage*this.pNum;
		var data = this.data.slice(start,end);
		var str = '';
		for(var i=0;i<data.length;i++){
			var $list = data[i];
			var star = '';
			for(var j=0;j<$list.grade;j++){
				star += '<img src="http://www.shixinyuezi.com/m/images/index_04.png">'
			}
			
			str += '<li>'+
						'<div class="left"><img src='+$list.avatarImg+'></div>'+
						'<div class="right">'+
							'<p class="stars">'+
								star +
							'</p>'+
							'<div class="comment">'+
								'<p>'+$list.comment+'</p>'+
							'</div>'+
						'</div>'+
					'</li>'
		}

		$(this.obj).children('ul').html(str);
	},
	//li
	createLi:function(){
		var str = '';
		if(this.tPage>=3){
			str += '<li>1</li><li>2</li><li>3</li>'
		}else{
			str += '<li>1</li><li>2</li>'
		}
		var $ul = $(this.obj).children('.page').children('ul');
		$ul.html(str);
		$ul.find('li').eq(0).addClass('cur');
		this.ellipsis();
		this.tabChange();
	},
	//tabChange
	tabChange:function(){
		var $aLi = $(this.obj).children('.page').find('li');
		var $that = this;
		$aLi.each(function(idx,ele){
			$(ele).click(function(){
				$that.nPage = parseInt($(ele).text());
				$that.key = idx;
				$that.curPage();
				$that.commentHtml();
			})
		})
	},
	//changePage
	changePage:function(idx){
		switch(idx){
			case 0:
				this.nPage = 1;
				this.key=0;
				this.changeLi(this.nPage+1);//tabLi
				break;
			case 1:
				if(this.nPage<=1){
					alert('已经是第一张了！')
				}else{
					this.nPage--;
					this.key--;
					
					if(this.key<0){
						this.key=0;
						this.changeLi(this.nPage+1);//tabLi
					}
				}	
				break;
			case 2:
				if(this.nPage>=this.tPage){
					alert('已经是最后一张了！')
				}else{
					this.nPage++;
					this.key++;
					if(this.key>2){
						this.key=2;
						this.changeLi(this.nPage-1);//tabLi
					}
				}
				break;
			case 3:
				this.nPage = this.tPage;
				if(this.tPage==2){
					this.key=1;
				}else{
					this.key=2;
				}
				this.changeLi(this.tPage-1);//tabLi
				break;
		}
		this.commentHtml();//评论列表
		this.curPage();//当前页 li高亮
		this.tabChange();
		this.ellipsis();//显示隐藏“...”
	},

	//cur
	curPage:function(){
		var $aLi = $(this.obj).children('.page').find('li');
		$aLi.eq(this.key).addClass('cur').siblings().removeClass('cur');
	},
	//...
	ellipsis:function(){
		if(this.tPage<=3) return;
		//next
		if(this.tPage>this.nPage){
			$(this.obj).find('.next').show();
		}else{
			$(this.obj).find('.next').hide();
		}
		//last
		if(this.nPage>3){
			$(this.obj).find('.last').show();
		}else if(this.nPage<=1){
			$(this.obj).find('.last').hide();
		}
	},
	//changeLi
	changeLi:function(n){	
		if(this.tPage<=3) return;
		var $ul = $(this.obj).children('.page').children('ul');
		var str = '<li>'+(n-1)+'</li><li>'+n+'</li><li>'+(n+1)+'</li>'
		$ul.html(str);
	},
}