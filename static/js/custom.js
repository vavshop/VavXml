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

function Auth(step) {
  var form = $('form#authForm');
  ajaxSetup();
  var auth_url = '/auth_' + step + '/';
  $.ajax({
    url: auth_url,
    type: 'POST',
    data: form.serialize()
  })
  .done(function(data) {
    if (step == 1){
      if(!data.error)
        new PNotify({
          title: 'Info',
          text: 'Now enter sms code and press \'Send code\'.',
          type: 'success'
        });
      else
        new PNotify({
          title: 'Error',
          text: data.message,
          type: 'error'
        })
    }
    if (step == 2){
      if(!data.error){
        new PNotify({
          title: 'Info',
          text: 'Authorization completed',
          type: 'success'
        });
        location = '/parse_info/';
      }
      else
        new PNotify({
          title: 'Error',
          text: data.message,
          type: 'error'
        })
    }
  })
  .fail(function(data) {
    console.log(data.responseText);
  });
}
