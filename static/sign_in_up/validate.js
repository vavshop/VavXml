
$('#two_token').keypress(function (e) {
  if (e.which == 13) {
    $('#two_factor_token_btn').click();
    return false;    //<---- Add this line
  }
});
$('#password-signin').keypress(function (e) {
  if (e.which == 13) {
    $('#sbtin').click();
    return false;    //<---- Add this line
  }
});
$('#email-signin').keypress(function (e) {
  if (e.which == 13) {
    $('#sbtin').click();
    return false;    //<---- Add this line
  }
});

function secondSMS(){
submitFormToken('secondsms')
}

function checkEmail() {
 var email = $('#email-signin');
 var patt = /^.+@.+[.].{2,}$/i;
 if(!patt.test(email.val())) {
	 $('#emailInfo').html('Enter correct email').show();
	 $('.faemailin').hide();
	 return false;
	}else if(patt.test(email.val())){
	 $('#emailInfo').html('');
	 $('.faemailin').show();
	 return true;
 }
}

 function checkPass() {
 var pass = $('#password-signin');
 if(pass.val().length < 4) {
	 $('#passwordInfo').html('Enter at least 4 charachters').show();
	 $('.fapassin').hide();
	 return false;
	}else{
	 $('#passwordInfo').html('');
	 $('.fapassin').show();
	 return true;
	}
}


 function checkToken() {
 var token = $('#two_token');
 if(token.val().length > 0) {
		 $('#tokenInfo').html('');
		 //$('.two_factor_token').show();
		 return true;
	}else{
		$('#tokenInfo').html('Enter token').show();
 	 //$('.two_factor_token').hide();
 	 return false;
	}
}

 function submitForm(){
	 console.log('checkEmail='+checkEmail());
	 console.log('checkPass='+checkPass());
	 if(!checkEmail()&&!checkPass()){
//event.preventDefault();
	console.log(false);
	return false;
	 }
	 else  if(checkEmail()&&checkPass()){
		 console.log(true);

			 $('#sbtin').attr('disabled','true');
					 ajaxSetup();
            //console.log('csrf1='+$('#jform input[name=csrfmiddlewaretoken]').val());
					 $.ajax({
						 type: "POST",
						 url: "/auth/login/",
						 data: $('#jform').serialize(),
						 success: function(data){
							 console.log(data);
							 //data = eval(data)
							 if(!data.error){
								 if(!data.two_factor){
									 window.location= '/dashboard/';
								 }else{
									 console.log('two_factor on');
									 $('#two_factor_token').show()
                   $('#two_token').focus()
                   if(data.sms){
                     $('#secondsms_two_token').show()
                   }else{
                     $('#secondsms_two_token').hide()
                   }
								 }
							 }else{
								 new PNotify({
			             title: 'Error',
			             text: data.message,
			             type: 'error'
			           });
								 $('#sbtin').removeAttr('disabled');
							 }
						 },
						 error: function(data) {
							 new PNotify({
								 title: 'Error',
								 text: 'Somethings went wrong:(.',
								 type: 'error'
							 });
               setTimeout(function(){window.location = '/auth/login/'}, 3000);
							 console.log(data.responseText);
							 $('#sbtin').removeAttr('disabled');
						 }
					 });
					 return false;


return true;
	 }
}


	function submitFormToken(secondsms){
    console.log($('#jform').serialize()+'&'+$('#jformToken').serialize());
	if(!checkEmail()||!checkPass()){
		document.getElementById('two_factor_token').style.display = 'none';
 		$('#sbtin').removeAttr('disabled');
	}
	else  if(checkEmail()&&checkPass()  ){
          var dataform = $('#jformToken').serialize()+"&username="+$('#email-signin').val()+'&password='+$('#password-signin').val()
					ajaxSetup();
          if(secondsms){
            dataform += '&secondsms=on'
          }
          console.log(dataform);
					$.ajax({
						type: "POST",
						url: "/auth/login/",
						data: dataform,
						success: function(data){
							console.log(data);
							//data = eval(data)
								if(!data.error){
                  if(data.secondsms){
                    new PNotify({
  										title: 'Success',
  										text: 'Second sms sendet',
  										type: 'success'
  									});
                  }else{
                    window.location= '/dashboard/';
                  }
								}else{
									new PNotify({
										title: 'Error',
										text: data.message,
										type: 'error'
									});
                  $('#two_token').val('')
                  $('#two_token').focus();
									//$('#sbtin').removeAttr('disabled');
								}
						},
						error: function(data) {
							new PNotify({
								title: 'Error',
								text: 'Somethings went wrong:(.',
								type: 'error'
							});
              setTimeout(function(){window.location = '/auth/login/'}, 3000);
							console.log(data.responseText);
							$('#sbtin').removeAttr('disabled');
						}
					});
          return false;


return true;
	}
}


//sign in form !!!!!!!!!!!!

//sign up form
function checkEmailUp() {
 var email = $('#emailsignup');
 var patt = /^.+@.+[.].{2,}$/i;
 if(!patt.test(email.val())) {
   $('#emailInfoUp').html('Enter correct email').show();
   $('.faemailUp').hide();
   return false;
 }
 else if(patt.test(email.val())){
   $('#emailInfoUp').html('');
   $('.faemailUp').show();
   return true;
  }
}


 function checkWebsite() {
 var wsite = $('#website');
	if(wsite.val().length < 6) {
 $('#websiteinfo').html('Enter correct url address').show();
 $('.fawebsite').hide();}
 else if(wsite.val().length >= 6){
 $('#websiteinfo').html('');
 $('.fawebsite').show();}
}

function checkPass1() {
  var pass = $('#password-sign-up1');
  var res = checkPass3();
  if(!res){
    $('.fapassin2').hide();
  }
  if(pass.val().length < 6) {
      $('#passwordInfo1').html('Enter at least 6 charachters').show();
      $('.fapassin1').hide();
      return false;
  }else if(pass.val().length >= 6){
    $('#passwordInfo1').html('');
    $('.fapassin1').show();
    if(res){
      $('.fapassin2').show();
    }
    return true;
  }
}


function checkPass2() {
 var pass = $('#password-sign-up2');
 if(pass.val().length < 6) {
   $('#passwordInfo2').html('Enter at least 6 charachters').show();
   $('.fapassin2').hide();
   return false;
 }
 else if(pass.val().length >= 6){
   $('#passwordInfo2').html('');
   var res=checkPass3();
   if(res){
     $('.fapassin2').show();
   }else{
     $('.fapassin2').hide();
   }
   return true;
 }
}

 function checkPass3() {
	 var pass1 = $('#password-sign-up1');
 var pass2 = $('#password-sign-up2');
 if(pass1.val() != pass2.val()&&pass2.val() != pass1.val())  {
 $('#passwordInfo2').html('Passwords must be match').show();
 return false;
}
 else if(pass1.val().length != 0 &&pass2.val().length != 0 &&pass1.val() == pass2.val()&&pass2.val() == pass1.val()){
 $('#passwordInfo2').html('');
 return true;
  }
}

	function submitFormUp(){
    console.log('checkEmailUp='+checkEmailUp());
    console.log('checkPass1='+checkPass1());
    console.log('checkPass2='+checkPass2());
    console.log('checkPass3='+checkPass3());
	 if(!checkEmailUp()||!checkPass1()||!checkPass3()||!checkPass2()){
    event.preventDefault();
    console.log(false);
  	return false;
	 }
	 else  if(checkEmailUp()&&checkPass1()&&checkPass3()&&checkPass2()){
     console.log(true);

     $('#sbtin').attr('disabled','true');
         ajaxSetup();
          //console.log('csrf1='+$('#jform input[name=csrfmiddlewaretoken]').val());
         $.ajax({
           type: "POST",
           url: "/auth/register/",
           data: $('#jform').serialize(),
           success: function(data){
             console.log(data);
             //data = eval(data)
             if(!data.error){
               window.location= '/dashboard/';
             }else{
               new PNotify({
                 title: 'Error',
                 text: data.message,
                 type: 'error'
               });
               $('#sbtin').removeAttr('disabled');
             }
           },
           error: function(data) {
             new PNotify({
               title: 'Error',
               text: 'Somethings went wrong:(.',
               type: 'error'
             });
             setTimeout(function(){window.location = '/auth/signup/'}, 3000);
             console.log(data.responseText);
             $('#sbtin').removeAttr('disabled');
           }
         });
         return false;

return true;
	 }
}


//sign up form



//change password form

function checkEmailChange() {
 var email = $('#emailchange');
 var patt = /^.+@.+[.].{2,}$/i;
 if(!patt.test(email.val())) {
 $('#emailInfochange').html('Enter correct email').show();
 $('.faemailchange').hide();}
 else if(patt.test(email.val())){
 $('#emailInfochange').html('');
 $('.faemailchange').show();}
}

 function submitFormChange(){
   $('#restbtn').attr('disabled','disabled');
   ajaxSetup();
    //console.log('csrf1='+$('#jform input[name=csrfmiddlewaretoken]').val());
   $.ajax({
     type: "POST",
     url: "/auth/restore/",
     data: $('#jformemail').serialize(),
     success: function(data){
       console.log(data);
       if(!data.error){
        // window.location= '/';
        new PNotify({
          title: 'Success',
          text: 'Sended email to reset password',
          type: 'success'
        });
         $('#restbtn').removeAttr('disabled');
         $('#forgot-first-step form')[0].reset();
         $('#forgot-first-step').hide();
       }else{
         new PNotify({
           title: 'Error',
           text: data.message,
           type: 'error'
         });
         $('#restbtn').removeAttr('disabled');
       }
     },
     error: function(data) {
       new PNotify({
         title: 'Error',
         text: 'Somethings went wrong:(.',
         type: 'error'
       });
       setTimeout(function(){window.location = '/auth/login/'}, 3000);
       console.log(data.responseText);
       $('#restbtn').removeAttr('disabled');
     }
   });
   return false;
	 /*$('#forgot-first-step').hide();
	 $('#forgot-second-step').show();
	 setTimeout(function(){$('#forgot-second-step').hide()}, 7000)*/
	 }


function forgot1Show(){
  $('#forgot-first-step form')[0].reset();
  $('#forgot-first-step').show();
}
//change password form

﻿$(function(){




 function checkEmail() {
 	var email = $('#email-signin');
 	var patt = /^.+@.+[.].{2,}$/i;
 	if(!patt.test(email.val())) {
	$('#emailInfo').html('Enter correct email').show();
	$('.faemailin').hide();}
	else if(patt.test(email.val())){
	$('#emailInfo').html('');
	$('.faemailin').show();}
 }

  function checkPass() {
 	var pass = $('#password-signin');
 	if(pass.val().length < 6) {
	$('#passwordInfo').html('Enter at least 6 charachters').show();
	$('.fapassin').hide();}
	else if(pass.val().length >= 6){
	$('#passwordInfo').html('');
	$('.fapassin').show();}
 }


//sign in form !!!!!!!!!!!!

//sign up form



  function checkWebsite() {
 	var wsite = $('#website');
	 if(wsite.val().length < 6) {
	$('#websiteinfo').html('Enter correct url address').show();
	$('.fawebsite').hide();}
	else if(wsite.val().length >= 6){
	$('#websiteinfo').html('');
	$('.fawebsite').show();}
 }


//sign up form



//change password form

 function checkEmailChange() {
 	var email = $('#emailchange');
 	var patt = /^.+@.+[.].{2,}$/i;
 	if(!patt.test(email.val())) {
	$('#emailInfochange').html('Enter correct email').show();
	$('.faemailchange').hide();}
	else if(patt.test(email.val())){
	$('#emailInfochange').html('');
	$('.faemailchange').show();}
 }


});
