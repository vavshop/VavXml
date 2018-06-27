/**
 * Created by tito on 26.01.16.
 */

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function ajaxSetup(){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}


function email_test(){
    var email = $('#id_email').val();
    //console.log('email: '+email);
    var res = loadHTML('/auth/email_test/?email='+email);
    //console.log('res: '+res);
    if (res) {
        window.sendForm = true;
        $('#reg_form').submit();
    }

}

function loadHTML(sUrl){
    var request=null;
    //створюємо обєкт для запиту
    try {
        request=new XMLHttpRequest();
    } catch (e){}
    //надсилаємо запит
    request.open('GET', sUrl, false);
    request.send(null);

    var temp = request.responseText;
    //повертаємо відповідь
    return eval(temp);
}

function disableButton()
{
   var btn = document.getElementById('sbn').disabled = true;
}

function disableButton3()
{
   var btn = document.getElementById('disab_b').disabled = true;
}

function EnableButton(){
    document.getElementById('sbn2').disabled = false;
    //window.location.href = "/auth/success/";
}

function disableButton2()
{
    document.getElementById('sbn2').disabled = true;
}
function disableButton3()
{
   var btn = document.getElementById('sbn3').disabled = true;
}


function moveRightPerm(){
   var ro = $('#right')[0].selectedOptions;
   var rs = $('#left')[0];
   while (ro.length>0){
         ro[0].setAttribute('name', 'assign');
         rs.appendChild(ro[0]);
   }
}


function moveLeftPerm(){
   var lo = $('#left')[0].selectedOptions;
   var ls = $('#right')[0];
   while (lo.length>0){
         lo[0].setAttribute('name', 'remove');
         ls.appendChild(lo[0]);
   }
}
function assignPerm(){
   var aPerm = $('select#left option');
   var aStr = '';
   var uid = $('select#left')[0].getAttribute('name');
   for (var i = 0; i<aPerm.length; i++){
       aStr += aPerm[i].getAttribute('id') +',';
   }
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/set_perm/', { uid: uid, astr:aStr})
    .error(function(data){ alert(data.responseText)})
    .success(function(){
        location='/dashboard/';
    });
}

function ChangeLangvich(len,url){
  url = url.replace("//", "/");
  ajaxSetup();
  $.post('/i18n/setlang/', { language: len, next:url})
  .error(function(data){
    console.log(data.responseText);

  })
  .success(function(){
      window.location.href = url;
  });
}


function bin_load(){

$.ajax({
    type: 'POST',
    url: '/protect/bin_result/',
    data: $('#binform').serialize(),
    success: function(data){
      data = eval(data);
       console.log(data)
      if (!data.error) {
        console.log('to do something')
        //to do something
        var str = ''
        str += '<tr><td width="200px"><strong>valid</strong></td><td>'+data.bin_valid+'</td></tr>'
        str += '<tr><td><strong>card brand</strong></td><td>'+data.bin_card_brand+'</td></tr>'
        str += '<tr><td><strong>card category</strong></td><td>'+data.bin_card_category+'</td></tr>'
        str += '<tr><td><strong>card type</strong></td><td>'+data.bin_card_type+'</td></tr>'
        str += '<tr><td><strong>country</strong></td><td>'+data.bin_country+'</td></tr>'
        str += '<tr><td><strong>country code</strong></td><td>'+data.bin_country_code+'</td></tr>'
        str += '<tr><td><strong>issuer</strong></td><td>'+data.bin_issuer+'</td></tr>'
        str += '<tr><td><strong>issuer phone</strong></td><td>'+data.bin_issuer_phone+'</td></tr>'
        str += '<tr><td><strong>issuer website</strong></td><td><a href="'+data.bin_issuer_website+'" target="_blank">'+data.bin_issuer_website+'</a></td></tr>'
        $('#rbres').html(str)
      }else {
         console.log(data.message);
         $('#rbres').html('')
         if(data.message){
           new PNotify({
               title: 'Error',
               text: data.message,
               type: 'error'
           })
         }
      }
    },
    error: function(data){
        console.log(data.responseText);
        $('#rbres').html('')
    }
  });
}
