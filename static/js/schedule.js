function ChangeEventDate(event){
  ajaxSetup();
  if (event.start.hasTime()){
    if (event.end)
      var postData = {
        'id': event.id,
        'start': event.start.format('YYYY-MM-DD HH:mm'),
        'end': event.end.format('YYYY-MM-DD HH:mm')
      }
    else
    //From allDay to custom period.
      var postData = {
        'id': event.id,
        'start': event.start.format('YYYY-MM-DD HH:mm'),
        'end': event.start.format('YYYY-MM-DD HH:mm')
      }
  }
  else {
    // to allDay
    var postData = {
      'id': event.id,
      'start': event.start.format('YYYY-MM-DD HH:mm'),
      'end': event.end.format('YYYY-MM-DD HH:mm'),
      'all-day': 'on'
    }
  }
  $.ajax({
    type: 'POST',
    url: '/schedule/change_task_date/',
    data: postData
  }).done(function (data) {
    if (data.error)
        alert(data.message);
  }).fail(function (data) {
      alert(gettext('Somethings went wrong. Connect with support.'));
      console.log(data.responseText);
  });
}


function ExtendedGanttSearch(obj) {
  $(obj).attr('disabled', true);
  var $form = $('form#advanced-search');

  var startTime = $('#start-time span').html();
  var endTime = $('#end-time span').html();
  var closeTime = $('#close-time span').html();

  console.log($form.serialize());

  $.ajax({
    url: $form.attr('action'),
    type: $form.attr('method'),
    data: $form.serialize() + '&start-time=' + startTime + '&end-time=' + endTime + '&close-time=' + closeTime
  })
  .done(function(data) {
    console.log(data);
    if (data.gant){
      console.log(data.now);
      console.log(moment.utc(data.now));
      gantt.clearAll();
      var markerId = gantt.addMarker({
          start_date: moment(data.now),
          css: "today",
          text: "Now",
          title: moment(data.now).format('DD/MM/YYYY HH:mm')
      });
      gantt.getMarker(markerId);
      gantt.parse(data.gant);
    }
    /*  $('#ganttChart').gantt({
        source: data.gantt,
        scale: 'weeks',
        navigate: 'scroll',
        minScale: 'hours',
        maxScale: 'months',
        itemPerPage: 10
      });*/
    $(obj).attr('disabled', false);
  })
  .fail(function(data) {
    console.log(data.responseText);
    $(obj).attr('disabled', false);
  });

}

function ResetGanttSearch(){
    $('#advanced-search').trigger("reset");
    $('#advanced-search select').select2('val', '');
    $('#advanced-search input:checkbox').attr("checked", true);
    $('#advanced-search input:checkbox').iCheck('check');
    $("#advanced-search input:checkbox").each(function () {
      $(this).iCheck('check'); 
    });
}
