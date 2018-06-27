/**
 * Created by Dev on 14.03.2016.
 */

function DeleteRecord(obj){
    var id = $(obj).parents('tr').attr('id');
    var url = '/delete_record/?id=' + id;
    $.get(url);
    $(obj).parents('tr').remove();
}

function HideRecord(obj){
    var id = $(obj).parents('tr').attr('id');
    var url = '/hide_record/?id=' + id;
    $.get(url);
    $(obj).parents('tr').remove();
}

// переписати
function DeleteFilter(obj){
    var id = $(obj).parents('tr').attr('id');
    var url = '/delete_filter/?id=' + id;
    $.get(url);
    $(obj).parents('tr').remove();
}

function StartParseFreeCompanies(obj, bind){
  var id = $(obj).parents('tr').attr('id');
  if (bind)
    var url = '/start_parse_free_companies/?fid=' + id + '&bind=1';
  else
    var url = '/start_parse_free_companies/?fid=' + id + '&bind=-1';
  $.get(url).done(function (data) {
    if (!data.error){
      $(obj).attr('disabled', 'true');
      $(obj).parents('tr').find('td:eq(1) span').removeClass('label-danger').addClass('label-success').html('так')
      new PNotify({
        title: 'Info',
        text: 'Parser started.',
        type: 'success'
      });
    }
    else{
      new PNotify({
        title: 'Error',
        text: data.message,
        type: 'error'
      });
    }
  }).fail(function(data){
    new PNotify({
      title: 'Error',
      text: 'Oops. Somethings went wrong :(',
      type: 'error'
    });
    console.log(data.responseText);
  });
}

// function SearchNow(obj){
//     var id = $(obj).parents('tr').attr('id');
//     var url = '/set_status_search_now/?fid=' + id + '&status=True';
//     $.get(url);
//     $(obj).attr('disabled', 'true');
// }

function OnOffFilter(obj, status){
    var id = $(obj).parents('tr').attr('id');
    var url = '/change_filter_status/?id=' + id + '&status=' + status;
    console.log(url);
    $.get(url);
    if (status == 'True') {
        $(obj).removeClass('btn-success fa-toggle-on').addClass('btn-danger fa-toggle-off');
        $(obj).attr('onclick', "OnOffFilter(this, 'False')");
        $(obj).parents('tr').find('td:eq(1)').html("<span class='label label-success'>Так</span>");
    }
    if (status == 'False'){
        $(obj).removeClass('btn-danger fa-toggle-off').addClass('btn-success fa-toggle-on');
        $(obj).attr('onclick', "OnOffFilter(this, 'True')");
        $(obj).parents('tr').find('td:eq(1)').html("<span class='label label-danger'>Ні</span>");
    }
}

function SearchWithBind(obj, status) {
    var id = $(obj).parents('tr').attr('id');
    var url = '/set_bind_status/?fid=' + id + '&status=' + status;
    $.get(url);
    $(obj).attr('disabled', 'true');

}


function StartParse(obj) {
  var $row = $(obj).parents('tr');
  $row.find('button').attr('disabled', true);
  var id = $row.attr('id');
  var get_url = '/start_parse?id=' + id;
  $.get(get_url).done(function (data) {
    if (data.error){
      $row.find('button').attr('disabled', false);
      alert(data.message);
    }
  }).fail(function (data) {
    console.log(data.responseText);
  })
}
