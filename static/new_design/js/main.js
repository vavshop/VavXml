////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////// УМНАЯ ШИРИНА БЛОКОВ  ////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var sidebar = '256'; //размер сайдбара в PX
function smartColumns() {
var screen = $(document).width(); // узнаем ширину документа в браузере (ширину экрана)
var sidebar_percent = sidebar / screen * 100; // узнаем процент сайдбара из 100%
var main = 100 - sidebar_percent - 0.5; // узнаем процент блока контента, при включенном сайдбаре
	if ($("#sidebar").hasClass('sidebar_open')) { // добавляем живое обновление ширины контента
		//$(".main_wrap").css('width', main +'%');
	} else {
		//$(".main_wrap").css('width', '100%');
	}
}
smartColumns(); // Запуск функци сразу после загрузки экрана
$(window).resize(function () { //запускаем функцию после каждого изменения размера экрана
  smartColumns();
  var screen = $(document).width(); // при изменении размера нужно опть вычислять ширину экрана
  if (screen <= 800) {
  	mobilehide();
  }
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////////////////////// Sidebar ////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$("#open_sidebar").click(function(){
	if ($("#sidebar").hasClass('sidebar_open')) {
  	$("#sidebar").removeClass('sidebar_open').addClass('sidebar_close');
		$("#main_wrap").removeClass('main_wrap_open');
  	$(".main_wrap").removeClass('main_min').addClass('main_full').css('width','100%');
  	$("#open_sidebar").removeClass('active');
  	setHeiHeight();
	} else {
		$("#sidebar").removeClass('sidebar_close').addClass('sidebar_open');
		$("#main_wrap").addClass('main_wrap_open');
		$(".main_wrap").removeClass('main_full').addClass('main_min');
		$("#open_sidebar").addClass('active');
		var screen = $(document).width(); // узнаем ширину документа в браузере (ширину экрана)
		var sidebar_percent = sidebar / screen * 100; // узнаем процент сайдбара из 100%
		var main = 100 - sidebar_percent - 0.5; // узнаем процент блока контента, при включенном сайдбаре
		//$(".main_wrap").css('width', main +'%');
		setHeiHeight();
	}
	if($('#revenue-chart')){
		setTimeout(function() { $('#revenue-chart').resize(); }, 500);
	}
});

var scrolled = window.pageYOffset || document.documentElement.scrollTop;
if(scrolled < 56){
	$("#sidebar").css('top', (56-scrolled) +'px');
}else{
	$("#sidebar").css('top', '0');
}

window.onscroll = function() {
  var scrolled = window.pageYOffset || document.documentElement.scrollTop;
	if(scrolled < 56){
		$("#sidebar").css('top', (56-scrolled) +'px');
		//$("#sidebar").css('position','absolute')
	}else{
		$("#sidebar").css('top', '0');
		//$("#sidebar").css('position','fixed')
	}
}

///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////////////////////// Умные виджеты //////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
var mainWidth = $('.main_wrap').width(); // узнаем ширину MAIN
function smartWidjets() {
var mainWidth = $('.main_wrap').width();
	if (mainWidth <= 900) { // Усли MAIN меньше чем 1100 px - меняем размер виджетов
		$(".hp_info_3b_box_pays_wp").css('width' , '100%');
		$(".hp_info_3b_box_revenue_wp").addClass('nhp').css('width','100%');
	} else {
		$(".hp_info_3b_box_pays_wp").css('width' , '55%');
		$(".hp_info_3b_box_revenue_wp").removeClass('nhp').css('width','100%');
	}
}

smartWidjets(); // Запуск функци сразу после загрузки экрана
$(window).resize(function () { //запускаем функцию после каждого изменения размера экрана
  var mainWidth = $('.main_wrap').width(); // при изменении размера нужно опть вычислять ширину экрана
  smartWidjets();
});

$('body').click(function() {
	var mainWidth = $('.main_wrap').width(); // узнаем ширину MAIN
	//alert(mainWidth);
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////// Скрываем сайдбар на мобильных при загрузке //////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
mobilehide();
function mobilehide() {
var screenSize = $(document).width();
if (screenSize <= 800) {
	if (!$("#sidebar").hasClass('sidebar_mobile')){
		$("#sidebar").removeClass('sidebar_open').addClass('sidebar_close').addClass('sidebar_mobile');
		$("#main_wrap").removeClass('main_wrap_open');
		$(".main_wrap").removeClass('main_min').addClass('main_full').css('width','100%');
		$("#widget_messages").css('left', '0px');
	}
}}

///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
/////////////////////// Кнопка "ДОБАВИТЬ"///////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$("#app_page_plus_btn").click(function(){
	if ($("#app_page_plus_btn").hasClass('close')) {
    	$("#app_page_plus_btn").removeClass('close').addClass('open');
    	$(".app_btn").removeClass('close_b').addClass('open_b');
	} else {
		$("#app_page_plus_btn").removeClass('open').addClass('close');
		$(".app_btn").removeClass('open_b').addClass('close_b');
	}
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////// Кнопка "Открыть меню юзера"//////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$("#open_sidebar_user_menu").click(function() {
	if ($("#user_navigation").hasClass('user_navigation_close')) {
		$("#user_navigation").removeClass('user_navigation_close').addClass('user_navigation_open');
	} else {
		$('#user_navigation').removeClass('user_navigation_open').addClass('user_navigation_close');
	}
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
////////////////// dropdown menu ///////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$(".dropdown_menu_button").click(function() {
	if ($(this).children('.main_nav_dropdown_list').hasClass('user_navigation_close')) {
		$(this).children('.main_nav_dropdown_list').removeClass('user_navigation_close').addClass('user_navigation_open');
		$(this).children('.dropdown_menu_button .btn').removeClass('close_b').addClass('open_b');
	} else {
		$(this).children('.main_nav_dropdown_list').removeClass('user_navigation_open').addClass('user_navigation_close');
		$(this).children('.dropdown_menu_button .btn').removeClass('open_b').addClass('close_b');
	}
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///////////////////////// SWITCH  //////////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$('.switch').click(function() {
 if ($(this).hasClass('switchOn')) {
		$(this).removeClass('switchOn');
	} else {
		$(this).addClass('switchOn');
	}
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////// Подставляем высоту для sidebar  ///////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
function setHeiHeight() {
    $('#sidebar').css({
        'min-height': $(".main_wrap").height() + 'px'
    });
    /*$('#widget_side_users').css({
        height: $(".main_wrap").height() + 'px'
    });*/
}
setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
$(window).resize( setHeiHeight ); // обновляем при изменении размеров окна

 setTimeout(function(){ // на всякий случай подчищаем высоту после загрузки
     window.onload = setHeiHeight();
},1000)
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////// Открывашка для виджетов в хедере  /////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$("#open_tasks").click(function(){
	$("#widget_messages").removeClass('widget_open');
	$("#widget_notifications").removeClass('widget_open');
    $("#widget_tasks").addClass('widget_open');
});
$("#open_notofications").click(function(){
	$("#widget_tasks").removeClass('widget_open');
	$("#widget_messages").removeClass('widget_open');
    $("#widget_notifications").addClass('widget_open');
});
$("#open_messages").click(function(){
	$("#widget_tasks").removeClass('widget_open');
	$("#open_notofications").removeClass('widget_open');
    $("#widget_messages").addClass('widget_open');
});

$(".close_widget").click(function(){
    $(".dropped_widget").removeClass('widget_open');
});

$("#open_search").click(function() {
		$("#search_widget").addClass('search_container_open');
});
$("#close_search_btn").click(function() {
		$("#search_widget").removeClass('search_container_open');
});
///////////////////////////Конец функции////////////////////////

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//////////////////// Сайдбар с юзерами  ////////////////////////
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
$("#open_side_users").click(function(){
    if ($("#widget_side_users").hasClass('closed_side_users')) {
    	$("#widget_side_users").css("transform","translate(0, 0%)");
    	$("#widget_side_users").removeClass('closed_side_users');
    	$(".dropped_widget").removeClass('widget_open');
    } else {
    	$("#widget_side_users").css("transform","translate(0, -110%)");
    	$("#widget_side_users").addClass('closed_side_users');
    }
});
