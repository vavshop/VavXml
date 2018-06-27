function Choice_Plan(){
  $('#buy_plan_credit_card')[0].reset();
  $('#buy-plan-paypal')[0].reset();
  $('#buy_plan_credit_card .show_card').removeClass('show_card');
  validator.resetForm();
  $('#buy_plan_credit_card .error').removeClass('error');
  $('#buy_plan_credit_card .valid').removeClass('valid');
  var my_plan = $('#id_my_plan')[0].value;
  var plan1 = $('#id_plans')[0].value;
  var plan2 = $('#id_plans_form')[0].value;
  $('#btnok_card').removeAttr('disabled');
  if(my_plan == plan2){
    $('#btnok_card').html(gettext("continue a package"));
  }else{
    $('#btnok_card').html(gettext("buy a package"));
  }
  $('#btnok').removeAttr('disabled');
  if(my_plan == plan1){
    $('#btnok').html(gettext("continue a package"));
  }else{
    $('#btnok').html(gettext("buy a package"));
  }
}

function Change_Plan(type){
  var my_plan = $('#id_my_plan')[0].value;
  var plan1 = $('#id_plans')[0].value;
  var plan2 = $('#id_plans_form')[0].value;
  if(my_plan == plan2){
    $('#btnok_card').html(gettext("continue a package"));
  }else{
    $('#btnok_card').html(gettext("buy a package"));
  }
  if(my_plan == plan1){
    $('#btnok').html(gettext("continue a package"));
  }else{
    $('#btnok').html(gettext("buy a package"));
  }
  var plan = plan1;
  if(type == 2){
    plan = plan2;
  }
  console.log(type);
  console.log(plan);
  console.log('plan2='+plan2);
    $.get('/billing/plan_options?plan='+plan).done(function(data){
      var str = ''
      if(!data.error){
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          str += '<li>'+data[i].name+'<span>'+data[i].amount+'</span></li>';
        }
      }
      $('#plan_options').html(str);
    });
   //plan_options

}

function Card_Chenge(){
  $('#btnok_card')[0].disabled=true;
  $('#btnok_card').html(gettext("Please wait")+'...');
}

function ChangePassword() {
  var $form = $('#change_pass_form');
  $form.find('button').attr('disabled', true);
  var pswd1 = $form.find('input[name=id_password]').val();
  var pswd2 = $form.find('input[name=id_password2]').val();
  var opswd = $form.find('input[name=old_password]').val();
  if ((pswd1 == pswd2) && (opswd.length > 0)) {
    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize()
    })
    .done(function(data) {
      if (!data.error) {
        new PNotify({
          title: gettext("Info"),
          text: gettext("Password changed successfull."),
          type: 'success'
        });
        location = '/auth/login/';
      }
      else {
        new PNotify ({
          title: gettext("Error"),
          text: data.message,
          type: 'error'
        });
        $form.find('button').attr('disabled', false);
      }
    })
    .fail(function(data) {
      new PNotify({
        title: gettext("Error"),
        text: gettext("Somethings went wrong. Contact with support."),
        type: 'error'
      });
      $form.find('button').attr('disabled', false);
      console.log(data.responseText);
    });
  }
else {
  if (pswd1 != pswd2) {
    new PNotify({
      title: gettext("Error"),
      text: gettext("Passwords mismatch."),
      type: 'error'
    });
    $form.find('button').attr('disabled', false);
  }
  if (opswd.length == 0) {
    new PNotify({
      title: gettext("Error"),
      text: gettext("Please enter old password."),
      type: 'error'
    });
    $form.find('button').attr('disabled', false);
  }
}
}
