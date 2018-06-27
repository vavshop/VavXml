function DeleteComment(obj) {
  var $li = $(obj).parents('li');
  var id = $li.attr('id');
  ajaxSetup();
  $.ajax({
    type: 'POST',
    url: '/schedule/delete_comment/',
    data: {'id': id}
  }).done(function(data){
    if (!data.error) {
      $li.remove();
    }
    else{
      alert(data.message)
    }
  }).fail(function(data){
    console.log(data.responseText);
  })
}

function EditComment(obj) {
  var $li = $(obj).parents('li');
  var id = $li.attr('id');
  var $form = $('#comment-form');
  $form.find('input[name=type]').val('update');
  $form.find('textarea').val($li.find('div.timeline-body').html());
  $form.find('input[name=cid]').val(id);
}

function DeleteTask(id) {
  ajaxSetup();
  $.ajax({
    type: 'POST',
    url: '/schedule/delete_task/',
    data: {'id': id}
  }).done(function (data) {
    if (!data.error)
      location = '/schedule/';
    else {
      alert(data.message);
    }
  }).fail(function (data) {
    alert('Sorry. Somethings went wrong.');
    console.log(data.responseText);
  });
}

function ChangeTaskStatus(task_id, status) {
  ajaxSetup();
  $.ajax({
    type: 'POST',
    url: '/schedule/change_task_status/',
    data: { 'tid': task_id, 'status': status }
  }).done(function (data) {
    if (!data.error) {
      var commentTime = moment().format('MMM Do, YYYY, HH:mm a');
      if (status == "processing"){
        var comment = "<code>Accept task</code>";
        $('span#status').html(gettext(status)).removeClass('label-primary').removeClass('label-success').addClass('label-warning');
        $('button[name=task-action]').removeClass('btn-primary').addClass('btn-success').html(gettext('Close')).attr('onclick', 'ChangeTaskStatus(' + task_id +', \'closed\');');
        new PNotify({
          title: 'Task info',
          text: 'Task accepted.',
          type: 'success'
        });
      }
      if (status == "closed") {
        var comment = "<code>Close task</code>";
        $('span#status').html(gettext(status)).removeClass('label-warning').addClass('label-success');
        $('button[name=task-action]').removeClass('btn-success').addClass('btn-primary').html(gettext('Accept')).attr('onclick', 'ChangeTaskStatus(' + task_id +', \'processing\');');
        new PNotify({
          title: 'Task info',
          text: 'Task closed.',
          type: 'success'
        });
      }
      var $commentBlock = $('#blank-comment').clone().appendTo('ul.timeline');
      $commentBlock.find('h3 a').html(data.created_by);
      $commentBlock.find('span.comment_time').html(commentTime);
      $commentBlock.find('div.timeline-body').html(comment);
      $commentBlock.find('button').remove();
      $commentBlock.show();
      $commentBlock.attr('id', data.id);
    }
  })
}
