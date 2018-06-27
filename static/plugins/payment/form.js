(function($){

	var $cc_num = $("#id_card_number");
	var $cc_exp = $("#id_expery_date");
	var $cc_cvv = $("#id_cvc");
	var card_type = null;

	$cc_num.payment("formatCardNumber");
	$cc_exp.payment("formatCardExpiry");
	$cc_cvv.payment("formatCardCVC");

	$cc_num.on("input", function(){
		var current_num = $(this).val();
		card_type = $.payment.cardType(current_num);
		var current_card = $("img[src='/static/plugins/payment/img/"+ card_type +".png']");
		var card = current_card.parent().parent().parent();
    $('#id_card_type')[0].value=card_type;
		if($(".show_card").length){
			$(".show_card").removeClass("show_card");
		}
		card.addClass("show_card");
	});

	$cc_num.on("blur", function(){
		var _ = $(this);
		if(_.val() !== ""){
			if($.payment.validateCardNumber(_.val())){
				_.parent().removeClass("error").addClass("valid");
			} else {
				_.parent().removeClass("valid").addClass("error");
			}
		}
	});

	$cc_exp.on("blur", function(){
		var _ = $(this);
		if(_.val() !== ""){
			var exp = _.val().split(" / ");
			if($.payment.validateCardExpiry(exp[0], exp[1])){
				_.parent().removeClass("error").addClass("valid");
			} else {
				_.parent().removeClass("valid").addClass("error");
			}
		}
	});

	$cc_cvv.on("blur", function(){
		var _ = $(this);
		if(card_type && _.val() !== ""){
			if($.payment.validateCardCVC(_.val(), card_type)){
				_.parent().removeClass("error").addClass("valid");
			} else {
				_.parent().removeClass("valid").addClass("error");
			}
		}
	});

	$cc_cvv.on("focus", function(){
		var current_card = $(".show_card");
		if(current_card.length){
			current_card.addClass("show_cvc");
		}
		$(this).one("blur", function(){
			if($(".show_cvc").length){
				$(".show_cvc").removeClass("show_cvc");
			}
		});
	});


})(jQuery);
