function taskload(id){
  myApp.task_id = id;
  myApp.mainView.loadPage(pages_url+"/pages/new_task.html");
}

function newtaskform(){
  $('#new-task').validate({
      rules: {
          'task-name': "required",
          'reservationtime' : "required",
      },
      submitHandler: function(form){
        //console.log('test2');
          var eventDate = $('#reservationtime').val();
          var startDate = '';
          var endDate = '';
          if(eventDate){
            if(eventDate.indexOf(' - ') != -1){
              eventDate = eventDate.split(' - ');
              startDate = eventDate[0];
              endDate = eventDate[1];
            }else{
              startDate = eventDate;
              endDate = startDate;
            }
          }
          startDate = moment(startDate,'MM/DD/YYYY').format('YYYY-MM-DD');
          endDate = moment(endDate,'MM/DD/YYYY').format('YYYY-MM-DD');
          if($('#new_task_all_day:checked').length){
            startDate += ' 00:00';
            endDate += ' 23:59';
          }else{
            var startTime = $('#new-task-start-time').val()
            var endTime = $('#new-task-end-time').val()
            if(!startTime)
              startTime = ' 00:00';
            if(!endTime)
              endTime = ' 23:59';
            if((startDate == endDate)&&(endTime < startTime))
              endTime = startTime
            startDate += ' '+startTime;
            endDate += ' '+endTime;
          }
          if(!user_token)
            myApp.loginScreen();
          $.ajax({
              type: "POST",
              url: "/api/new_task/",
              data: $(form).serialize() + '&start=' + startDate + '&end=' + endDate+'&token='+user_token,
              success: function(data){
                //console.log('test1');
                  if (!data.error)
                  {
                    //console.log(data);
                      myApp.addNotification({
                          message: '<p style="color:green;"><b>'+gettext('Task created.')+'</b></p>'
                      });
                  }else{
                    myApp.addNotification({
                       message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
                   });
                        //console.log(data.message);
                  }
                  //calendar.fullCalendar('unselect');
                  $('#new-task')[0].reset();
                  myApp.mainView.reloadPage(pages_url+'/index2.html')
              },
              error: function(data){
                  console.log(data.responseText);
              }
          });
          return false;
      }
  });
}

function Taskload(id){
  myApp.taskload_id = id;
  myApp.mainView.loadPage(pages_url+"/pages/edit_task.html");
}

function Taskedit(id){
  var form = $$('form#edit-task');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#edit_task_page_title').html(gettext('Edit task'));
  $('#edit_task_name_title').html(gettext('Task name'));
  $('#edit_task_recipients_title').html(gettext('Assigned to'));
  $('#edit_task_auditors_title').html(gettext('Auditors'));
  $('#edit_task_customers_title').html(gettext('Customers'));
  $('#edit_task_all-day-text').html(gettext('All Day'));
  $('#edit_task_reservationtime_title').html(gettext('Date period:'));
  $('#edit_tak_time_period_title').html(gettext('Time period:'));
  $('#edit_task_start_time_title').html(gettext('Start time:'));
  $('#edit_task_end_time_title').html(gettext('End time:'));
  $('#edit_task_description_title').html(gettext('Description'));
  $('#edit_task_event_color_title').html(gettext('Choose event color:'));
  $('#edit_task_event_color option')[0].text=gettext('aqua');
  $('#edit_task_event_color option')[1].text=gettext('blue');
  $('#edit_task_event_color option')[2].text=gettext('light blue');
  $('#edit_task_event_color option')[3].text=gettext('teal');
  $('#edit_task_event_color option')[4].text=gettext('yellow');
  $('#edit_task_event_color option')[5].text=gettext('orange');
  $('#edit_task_event_color option')[6].text=gettext('green');
  $('#edit_task_event_color option')[7].text=gettext('lime');
  $('#edit_task_event_color option')[8].text=gettext('red');
  $('#edit_task_event_color option')[9].text=gettext('purple');
  $('#edit_task_event_color option')[10].text=gettext('fuchsia');
  $('#edit_task_event_color option')[11].text=gettext('muted');
  $('#edit_task_event_color option')[12].text=gettext('navy');
  $('#edit_task_submite_value').html(gettext('Save'));

  $$('#edit-task').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
  if(id > -1){
    var user_token = localStorage.getItem('token')
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/task_view_json/';
    $$.post(tasks_url, {'token': user_token, 'id': id}, function(data){
      var data = JSON.parse(data);
      //console.log(data);
      var recipients = data.recipients;
      var customers = data.customers;
      var auditors = data.auditors;
      var select = '';
      TaskRA(data, '#edit_task_recipients', recipients, '#edit_task_recipients_after');
      TaskRA(data, '#edit_task_auditors', auditors, '#edit_task_auditors_after');
      var client_str = '';
      var names_str = '';
      if(data.clients){
        client_str = '<optgroup label="'+gettext('Clients')+'">';
        for (var i = 0; i < data.clients.length; i++) {
          select = '';
          if (customers.indexOf(data.clients[i].id) >= 0){
            select = 'selected';
            names_str += data.clients[i].name+', ';
          }
          client_str += '<option value="'+data.clients[i].id+'" '+select+'>'+data.clients[i].name+'</option>';
        }
        client_str += '</optgroup>';
      }
      if(data.customer_companys){
        client_str += '<optgroup label="'+gettext('Companys')+'">';
        for (var i = 0; i < data.customer_companys.length; i++) {
          if (customers.indexOf(data.customer_companys[i].id) >= 0){
            select = 'selected';
            names_str += data.customer_companys[i].name+', ';
          }else{ select = ''; }
          client_str += '<option value="'+data.customer_companys[i].id+'" '+select+'>'+data.customer_companys[i].name+'</option>';
        }
        client_str += '</optgroup>';
      }
      $('#edit_task_customers').html(client_str);
      $('#edit_task_customers_after').html(names_str);
      $('#edit_task_reservationtime').val(data.date);
      var date = data.date.split(' - ');
      //console.log(new Date(date[0]));
      //console.log(new Date(date[1]));
      var calendarRange = myApp.calendar({
        input: '#edit_task_reservationtime',
        dateFormat: 'mm/dd/yyyy',
        value: [
          Date.parse(date[0]),
          Date.parse(date[1]),
        ],
        rangePicker: true
      });
      $('#edit_task_all_day').prop( "checked", data.all_day );
      $('#edit-task-start-time').val(data.time_start);
      $('#edit-task-end-time').val(data.time_end);
      $('#edit_task_description').val(data.description);
      if(data.description)
        $('#edit_task_description').parents('div.item-inner').addClass('not-empty-state');
      autosize(document.querySelectorAll('textarea'));
      var hexcolor = parseColor(data.hexcolor);
      var options = $('#edit_task_event_color option');
      var values = $.map(options ,function(option) {
          return option.value;
      });
      if(values.indexOf(hexcolor) < 0){
        var optionshtml = $('#edit_task_event_color').html();
        optionshtml += '<option value="'+hexcolor+'">'+gettext('loaded color')+'</option>';
        $('#edit_task_event_color').html(optionshtml);
      }
      $('#edit_task_event_color').val(hexcolor).css('color', hexcolor);
      $('#edit_task_event_color').change(function () {
        $('#edit_task_event_color').css('color', $('#edit_task_event_color').val());
      });
      $('#edit_task_name').val(data.taskname);
      $('#edit_task_name').parents('div.item-inner').addClass('not-empty-state')
  });
  }
  changetaskform();
}

function TaskRA(data, element,recipients, element_after, worker_id){
  var users_str = '';
  var select = '';
  var names_str = '';
  //console.log(recipients);
  if(recipients){
    if (recipients.indexOf(data.director.id) >= 0){
      select = 'selected';
      names_str += data.director.name+', ';
    }
  }
  var users_str = '<optgroup label="'+gettext('Director')+'">';
  users_str += '<option value="'+data.director.id+'" '+select+'>'+data.director.name+'</option>';
  if(data.topmanagers){
    users_str += '<optgroup label="'+gettext('Top managers')+'">';
    for (var i = 0; i < data.topmanagers.length; i++) {
      select = '';
      disabled = '';
      if(recipients){
        if (recipients.indexOf(data.topmanagers[i].id) >= 0){
          select = 'selected';
          names_str += data.topmanagers[i].name+', ';
        }
        if(worker_id)
          if (worker_id.indexOf(data.topmanagers[i].id) >= 0){
            disabled = ' disabled';
          }
      }
      users_str += '<option value="'+data.topmanagers[i].id+'" '+select+disabled+'>'+data.topmanagers[i].name+'</option>';
    }
  }
  if(data.managers){
    users_str += '<optgroup label="'+gettext('Managers')+'">';
    for (var i = 0; i < data.managers.length; i++) {
      select = '';
      disabled = '';
      if(recipients){
        if (recipients.indexOf(data.managers[i].id) >= 0){
          select = 'selected';
          names_str += data.managers[i].name+', ';
        }
        if(worker_id)
          if (worker_id.indexOf(data.managers[i].id) >= 0){
            disabled = ' disabled';
          }
      }
      users_str += '<option value="'+data.managers[i].id+'" '+select+disabled+'>'+data.managers[i].name+'</option>';
    }
  }
  if(data.employees){
    users_str += '<optgroup label="'+gettext('Employees')+'">';
    for (var i = 0; i < data.employees.length; i++) {
      select = '';
      disabled = '';
      if(recipients){
        if (recipients.indexOf(data.employees[i].id) >= 0){
          select = 'selected';
          names_str += data.employees[i].name+', ';
        }
        if(worker_id)
          if (worker_id.indexOf(data.employees[i].id) >= 0){
            disabled = ' disabled';
        }
      }
      users_str += '<option value="'+data.employees[i].id+'" '+select+disabled+'>'+data.employees[i].name+'</option>';
    }
  }
  $(element).html(users_str);
  if(element_after)
    $(element_after).html(names_str);
}

function parseColor(color) {
  if(color.indexOf('rgb') >= 0){
    var arr=[]; color.replace(/[\d+\.]+/g, function(v) { arr.push(parseFloat(v)); });
    return  "#" + arr.slice(0, 3).map(toHex).join("");
  }else{
    return color;
  }
}
function toHex(int) {
    var hex = int.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function changetaskform(){
  $('#edit-task').validate({
      rules: {
          'task-name': "required",
          'reservationtime' : "required",
      },
      submitHandler: function(form){
          var eventDate = $('#edit_task_reservationtime').val();
          var startDate = '';
          var endDate = '';
          if(eventDate){
            if(eventDate.indexOf(' - ') != -1){
              eventDate = eventDate.split(' - ');
              startDate = eventDate[0];
              endDate = eventDate[1];
            }else{
              startDate = eventDate;
              endDate = startDate;
            }
          }
          startDate = moment(startDate,'MM/DD/YYYY').format('YYYY-MM-DD');
          endDate = moment(endDate,'MM/DD/YYYY').format('YYYY-MM-DD');
          var startTime = $('#edit-task-start-time').val()
          var endTime = $('#edit-task-end-time').val()

          if($('#edit_task_all_day:checked').length){
            startDate += ' 00:00';
            endDate += ' 23:59';
          }else{
            if(!startTime){
              startTime = ' 00:00';}
            if(!endTime){
              endTime = ' 23:59';}
            if((startDate == endDate)&&(endTime < startTime))
              endTime = startTime
            startDate += ' '+startTime;
            endDate += ' '+endTime;
          }
          if(!user_token)
            myApp.loginScreen();
          $.ajax({
              type: "POST",
              url: "/api/save_changed_task/",
              data: $(form).serialize() + '&start=' + startDate + '&end=' + endDate+'&token='+user_token+'&task_id='+myApp.taskload_id,
              success: function(data){
                if (!data.error)
                {
                  //console.log(data);
                    myApp.addNotification({
                        message: '<p style="color:green;"><b>'+gettext('Task changed.')+'</b></p>'
                    });
                }else{
                  myApp.addNotification({
                     message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
                 });
                      //console.log(data.message);
                }
                //calendar.fullCalendar('unselect');
                $('#edit-task')[0].reset();
                $('#worker_tasks').DataTable().ajax.reload();
                $('#tasks_table').DataTable().ajax.reload();
                myApp.mainView.back();
                //myApp.mainView.reloadPage(pages_url+'/index2.html')
              },
              error: function(data){
                  console.log(data.responseText);
              }
        });
        return false;
      }
  });
}

function PopupTaskSearch(){
  if($('div[name=hidden_search_task]').hasClass('hiddend')){
    $('div[name=hidden_search_task]').removeClass('hiddend');
  }else{
    $('div[name=hidden_search_task]').addClass('hiddend');
  }
}

function OpenTasks(data, date_start, date_end, date_close, assigned_to, status){
  myApp.user_edit_task = data.edit_task;
  myApp.user_id = data.user_id;
  myApp.user_position = data.position;
  OpenTasksDateRanges(data,date_start,date_end,date_close,assigned_to,status)
  $('#serch_task_ignore_start_text').html(gettext('Date ignore'));
  $('#serch_task_date_start_title').html(gettext('Choose start date range'));
  $('#serch_task_ignore_end_text').html(gettext('Date ignore'));
  $('#serch_task_end_time_title').html(gettext('Choose end date range'));
  $('#serch_task_ignore_close_text').html(gettext('Date ignore'));
  $('#serch_task_close_time_text').html(gettext('Choose close date range'));
  $('#serch_task_recipients').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search users'));
  $('#serch_task_recipients_title').html(gettext('Assigned to:'));
  $('#serch_task_status_ids').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search status'));
  $('#serch_task_status_ids_title').html(gettext('Status'));
  $('#serch_task_name_title').html(gettext('Task Title'));
  $('#btn_search_task').html(gettext('Search'));
  $('#btn_close_search_task').html(gettext('Close'));
  $('#search_tasks').html('<i class="fa fa-search"></i> '+gettext('Search tasks'));

  $('#search-task').validate({
      submitHandler: function(form){
        //console.log('test');
          var startTime = $('#serch_task_start_date').val();
          var endTime = $('#serch_task_end_time').val();
          var closeTime = $('#serch_task_close_time').val();
          //console.log(startTime);
          if(!startTime){
            myApp.addNotification({
                title: gettext('Error'),
                message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter start date.')
            });
            return false;
          }else if(startTime.length < 20){
            startTime = startTime+' - '+startTime
          }
          if(!endTime){
            myApp.addNotification({
                title: gettext('Error'),
                message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter end date.')
            });
            return false;
          }else if(endTime.length < 20){
            endTime = endTime+' - '+endTime
          }
          if(!closeTime){
            myApp.addNotification({
                title: gettext('Error'),
                message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter close date.')
            });
            return false;
          }else if(closeTime.length < 20){
            closeTime = closeTime+' - '+closeTime
          }
          if(!user_token)
            myApp.loginScreen();
          var recipients = $('#serch_task_recipients').val();
          var status = $('#serch_task_status_ids').val();

          var datatable = {
            'token': user_token,
            'start-time': startTime,
            'end-time': endTime,
            'close-time': closeTime,
            'for': 'worker_info',
            'worker_list': 'search',
          }
          if(recipients)
            datatable['recipients'] = recipients.toString();
          if(status)
            datatable['status-ids'] = status.toString();
          if($('#serch_task_ignore_start:checked').length){
            datatable['ignore-start'] = 'on'; }
          if($('#serch_task_ignore_end:checked').length){
            datatable['ignore-end'] = 'on'; }
          if($('#serch_task_ignore_close:checked').length){
            datatable['ignore-close'] = 'on'; }
          if($('#serch_task_name').val())
            datatable['name'] = $('#serch_task_name').val();
          //console.log(datatable);
        var $table = $('table#tasks_table');
        $table.DataTable().destroy();
        table = $('#tasks_table').DataTable( {
          //paging: false,
          //searching: false,
          lengthChange: false,
          //info: false,
          destroy: true,
          ordering: false,
          iDisplayLength: 5,
          "ajax": {
                  url: domen + '/api/search_tasks.json',
                  type: "POST",
                  data: datatable,
          },
          "columns": columns_tasks,
          "initComplete": function(settings, json) {
            myApp.addNotification({
                message: '<p style="color:green;"><b>'+gettext('Firnd ')+json.data.length+gettext(' Tasks')+'</b></p>'
            });
            $('#hidden_search_task').addClass('hiddend');
            saveSearchTasks(startTime,endTime,closeTime);
          },
          //responsive: true
        } );
        return false;
      }
  });
}

function saveSearchTasks(startTime,endTime,closeTime){
  myApp.searchTask = true;
  if($('#serch_task_ignore_start:checked').length){
    myApp.searchTask_ignore_date_start = true;
  }else{
    myApp.searchTask_ignore_date_start = false;
  }
  myApp.searchTask_date_start = startTime;
  if($('#serch_task_ignore_end:checked').length){
    myApp.searchTask_ignore_date_end = true;
  }else{
    myApp.searchTask_ignore_date_end = false;
  }
  myApp.searchTask_date_end = endTime;
  if($('#serch_task_ignore_close:checked').length){
    myApp.searchTask_ignore_date_close = true;
  }else{
    myApp.searchTask_ignore_date_close = false;
  }
  myApp.searchTask_date_close = closeTime;
  console.log( $('#serch_task_recipients').val());
  myApp.searchTask_assigned_to = $('#serch_task_recipients').val();
  console.log('asto='+myApp.searchTask_assigned_to);
  myApp.searchTask_assigned_to_after = $('#serch_task_recipients_after').html();
  myApp.searchTask_status = $('#serch_task_status_ids').val();
  console.log('stat='+myApp.searchTask_status);
  myApp.searchTask_status_after = $('#serch_task_status_ids_after').html();
  myApp.searchTask_name = $('#serch_task_name').val();
  //console.log('awd');
}

function loadSavedSearchTasks(){
  var ignor_start = '';
  if(myApp.searchTask_ignore_date_start)
    ignor_start = 'on';
  $('#serch_task_ignore_start').prop( "checked", myApp.searchTask_ignore_date_start);
  var date_start = myApp.searchTask_date_start;
  //zamorochutus
  $('#serch_task_start_date').val(date_start);
  var ignor_end = '';
  if(myApp.searchTask_ignore_date_end)
    ignor_end = 'on';
  $('#serch_task_ignore_end').prop( "checked", myApp.searchTask_ignore_date_end);
  var date_end = myApp.searchTask_date_end;
  //zamorochutus
  $('#serch_task_end_time').val(date_end);
  var ignor_close = '';
  if(myApp.searchTask_ignore_date_close)
    ignor_close = 'on';
  $('#serch_task_ignore_close').prop( "checked", myApp.searchTask_ignore_date_close);
  var date_close = myApp.searchTask_date_close;
  //zamorochutus
  $('#serch_task_close_time').val(date_close);
  var assigned_to = myApp.searchTask_assigned_to;
  $('#serch_task_recipients').val(assigned_to);
  $('#serch_task_recipients_after').html(myApp.searchTask_assigned_to_after);
  var status = myApp.searchTask_status;
  $('#serch_task_status_ids').val(status);
  $('#serch_task_status_ids_after').html(myApp.searchTask_status_after);
  var task_name = myApp.searchTask_name;
  $('#serch_task_name').val(task_name);
  var tasks_url = domen + '/api/search_tasks.json';
  myApp.showIndicator();
  var datatable = {
    'token': user_token,
    'start-time': date_start,
    'end-time': date_end,
    'closeTime': date_close,
    'ignore-start': ignor_start,
    'ignore-end': ignor_end,
    'ignore-close': ignor_close,
    'name': task_name,
  }
  if(assigned_to){
    datatable['recipients'] = assigned_to.toString();
  }else{
    assigned_to='';
  }
  if(status)
    datatable['status-ids'] = status.toString();
  //console.log(data);
  $$.post(tasks_url, datatable, function(data){
    data = JSON.parse(data)
    if(!data.add_task)
      $('a[name=float_button_new_task]').remove();
    console.log('asto='+assigned_to+' st='+status);
    OpenTasks(data, date_start, date_end, date_close, assigned_to, status);
    myApp.hideIndicator();
  });

  datatable['for'] = 'worker_info'
  datatable['worker_list'] = 'search'
  var $table = $('table#tasks_table');
  $table.DataTable().destroy();
  table = $('#tasks_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: domen + '/api/search_tasks.json',
            type: "POST",
            data: datatable,
    },
    "columns": columns_tasks,
    "initComplete": function(settings, json) {
      $('#hidden_search_task').addClass('hiddend');
      saveSearchTasks(date_start,date_end,date_close);
    },
    //responsive: true
  } );
}

function OpenTasksDateRanges(data, date_start, date_end, date_close, assigned_to, status){
  var date1 = Date.parse(new Date());
  var date2 = Date.parse(new Date());
  if(date_start){
    date1 = Date.parse(date_start.split(' - ')[0]);
    date2 = Date.parse(date_start.split(' - ')[1]);
  }
  var calendarRange = myApp.calendar({
    input: '#serch_task_start_date',
    dateFormat: 'yyyy/mm/dd',
    value: [
      date1,
      date2,
    ],
    rangePicker: true
  });
  if(date_end){
    date1 = Date.parse(date_end.split(' - ')[0]);
    date2 = Date.parse(date_end.split(' - ')[1]);
  }else{
    date1 = Date.parse(new Date());
    date2 = Date.parse(new Date());
  }
  var calendarRange2 = myApp.calendar({
    input: '#serch_task_end_time',
    dateFormat: 'yyyy/mm/dd',
    value: [
      date1,
      date2,
    ],
    rangePicker: true
  });
  if(date_close){
    date1 = Date.parse(date_close.split(' - ')[0]);
    date2 = Date.parse(date_close.split(' - ')[1]);
  }else{
    date1 = Date.parse(new Date());
    date2 = Date.parse(new Date());
  }
  var calendarRange3 = myApp.calendar({
    input: '#serch_task_close_time',
    dateFormat: 'yyyy/mm/dd',
    value: [
      date1,
      date2,
    ],
    rangePicker: true
  });
  //console.log('assigned_to='+assigned_to);
  if(assigned_to){
    for (var i=0; i< assigned_to.length; i++){
        assigned_to[i] = parseInt(assigned_to[i], 10);
    }
  }
  TaskRA(data, '#serch_task_recipients', assigned_to, '#serch_task_recipients_after')
  var status_str = '';
  for (var i = 0; i < data.statuses.length; i++) {
    status_str += '<option value="'+data.statuses[i].id+'">'+gettext(data.statuses[i].name)+'</option>';
  }
  status_str +='<option value="overdue">'+gettext('overdue')+'</option>';
  $('#serch_task_status_ids').html(status_str);
  if(status)
    $('#serch_task_status_ids').val(status);
}

function fixsave(named){
  setTimeout(function() {
      //console.log('test');
  $('[data-select-name='+named+'] .navbar-inner').click(function(){
    console.log('test2');
  var startTime = $('#serch_task_start_date').val();
  var endTime = $('#serch_task_end_time').val();
  var closeTime = $('#serch_task_close_time').val();
  //console.log(startTime);
  var d = new Date();
  var today = d.getFullYear+'/'+d.getMonth+'/'+d.getDate;
  if(!startTime){
    startTime = today+' - '+today
  }else if(startTime.length < 20){
    startTime = startTime+' - '+startTime
  }
  if(!endTime){
    endTime = today+' - '+today
  }else if(endTime.length < 20){
    endTime = endTime+' - '+endTime
  }
  if(!closeTime){
    closeTime = today+' - '+today
  }else if(closeTime.length < 20){
    closeTime = closeTime+' - '+closeTime
  }
  console.log(closeTime);
  saveSearchTasks(startTime,endTime,closeTime);
  })
}, 200)
}

function MaterialsHistory(){
  myApp.mainView.loadPage(pages_url+"/pages/storage_history.html");
}
