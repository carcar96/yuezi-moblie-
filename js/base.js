
//nav
$('#nav').load('nav.html');
//banner
$('#banner').load('banner.html');
//cusServer
$('#cusServer').load('cusServer.html');
//footer
$('footer').load('footer.html');

$(document).ready(function(){
	//nav-menu
	$('.menu').click(function(){
		$('.topNav').stop().slideDown(500);
		$('.menu').hide();
		$('.closeMenu').show();
	});
	$('.closeMenu').click(function(){
		$('.topNav').stop().slideUp(500);
		$('.closeMenu').hide();
		$('.menu').show();
	});

	//carousel
	$('.owl-carousel').owlCarousel({
		items:1,
		loop:true,
		dotsEach:true,
		autoplay:true,
		autoplayTimeout:2000,
		autoplayHoverPause:true
	});

	//底部导航——navigator
	var flag = false;
	$('footer .bottom ul .navigate').click(function(){
		var $nav = $('footer .bottom .menus');	
		if(!flag){
			$nav.stop().animate({
				bottom:3.2 +'rem'
			},500);
			flag = true;
		}else{
			$nav.stop().animate({
				bottom:-11.5 +'rem'
			},500);			
			flag = false;
		}
	})
	//字体自适应
	var px = $(window).width()/320 * 20;
	$('html').css('fontSize',px+'px');	 
})