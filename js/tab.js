//tab切换
function tab(obj){
	var $obj = $(obj);
	$obj.find('.tab ul li').each(function(idx,ele){
		$(ele).click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			$obj.find('.content>div').eq(idx).show().siblings().hide();
		})
	})
}
