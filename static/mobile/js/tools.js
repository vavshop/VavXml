function BuildTasksList(tasks) {
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
            url: domen + '/api/tasks.json',
            type: "POST",
            data: {'token': user_token, 'end': moment().format('YYYY-MM-DD'), 'for': 'table'},
            complete: function(data) {
              //console.log(data);
            },
    },
    "columns": columns_tasks,
    //responsive: true
  } );
}

function Task(id) {
  var user_token = localStorage.getItem('token');
  var task_url = domen + '/api/task_view/';
  //console.log('task_url='+task_url);
  $$.post(task_url, {'token': user_token, 'id': id}, function(data){
      var inHTML = BuildTaskWiew(JSON.parse(data));
      $$('#task_view').html(inHTML);
      $$('#task-comment-form').on('submitted', function(e){
        var response = JSON.parse(e.detail.data)
        if (!response.error){
          $$('#comment').val('');
          var commentBlock = $$('#comment_content').html();
          var list_innerHTML = '<li class="card">'
          list_innerHTML += '<div class="card-header">'+response.created_by+'</div>'
          list_innerHTML += '<div class="card-content">'
          list_innerHTML += '<div class="card-content-inner comment_task">'+response.comment_body+'</div>'
          list_innerHTML += '</div><div class="card-footer">'+moment.utc(response.time).format('YYYY-MM-DD HH:mm')+'</div>'
          list_innerHTML += '</li>'
          $$('#comment_content').html(commentBlock+list_innerHTML);
            myApp.addNotification({
                title: gettext('Task'),
                message: gettext('Task add comment to')+response.task_name
            });
            setTimeout(function () {
              myApp.closeNotification(".notification-item");
            }, 4000);
        }
        else{
          myApp.addNotification({
              title: gettext('Error'),
              message: response.message
          });
        }
      });
    });
}

function BuildTaskWiew(data) {
  var list_innerHTML = '';
    list_innerHTML += '<div class="content-block-inner">';
    list_innerHTML += '<div class="content-block">';
    list_innerHTML += '<div class="row">';
    list_innerHTML += '<div class="col-50">'+gettext('Task info')+'</div>';
    list_innerHTML += '<div class="col-50 t_r">ID: '+data.task.id+'</div>';
    list_innerHTML += '</div><div class="row">';
    list_innerHTML += '<div class="col-50"><b>'+gettext('Status')+'</b></div>';
    var status = data.task.status;
    switch (status.toUpperCase()) {
        case 'NEW':
            list_innerHTML += '<div class="col-50 t_r color-blue" id="status">'+gettext(data.task.status)+'</div>';
            break;
        case 'CLOSED':
            list_innerHTML += '<div class="col-50 t_r color-green" id="status">'+gettext(data.task.status)+'</div>';
            break;
        case 'PROCESSING':
            list_innerHTML += '<div class="col-50 t_r color-orange" id="status">'+gettext(data.task.status)+'</div>';
            break;
        default:
            list_innerHTML += '<div class="col-50 t_r" id="status">'+gettext(data.task.status)+'</div>';
    }
    list_innerHTML += '</div><div class="row">';
    list_innerHTML += '<div class="col-20"><b>'+gettext('Start')+':</b></div>';
    list_innerHTML += '<div class="col-80 t_r">'+moment.utc(data.task.start).format('YYYY-MM-DD HH:mm')+'</div>';
    list_innerHTML += '</div><div class="row">';
    list_innerHTML += '<div class="col-20"><b>'+gettext('End')+':</b></div>';
    list_innerHTML += '<div class="col-80 t_r">'+moment.utc(data.task.end).format('YYYY-MM-DD HH:mm')+'</div>';
    list_innerHTML += '</div></div></div></div>';

    list_innerHTML += '<div class="content-block-title">'+gettext('Assigned to')+'</div>'
    list_innerHTML += '<div class="content-block">'
    list_innerHTML += '<div class="row no-gutter">'
    if(data.recipients){
      for (var i = 0; i < data.recipients.length; i++) {
        list_innerHTML += '<div class="col-100"><i class="fa fa-user-circle"></i> '+data.recipients[i]+'</div>'
      }
    }
    list_innerHTML += '</div></div>'
    if(data.auditors){
      list_innerHTML += '<div class="content-block-title">'+gettext('Auditors')+'</div>'
      list_innerHTML += '<div class="content-block">'
      list_innerHTML += '<div class="row no-gutter">'
      for (var i = 0; i < data.auditors.length; i++) {
        list_innerHTML += '<div class="col-100"><i class="fa fa-user-circle"></i>'+data.auditors[i]+'</div>'
      }
      list_innerHTML += '</div></div>'
    }
    if(data.clients){
      list_innerHTML += '<div class="content-block-title">'+gettext('Customers  ')+'</div>'
      list_innerHTML += '<div class="content-block">'
      list_innerHTML += '<div class="row no-gutter">'
      for (var i = 0; i < data.clients.length; i++) {
        list_innerHTML += '<div class="col-100"><i class="fa fa-user-o"></i> '+data.clients[i]+'</div>'
      }
      list_innerHTML += '</div></div>'
    }

    list_innerHTML += '<div class="content-block-inner">'
    list_innerHTML += '<div class="content-block"><div class="row">'
    list_innerHTML += '<div class="col-100 t_c">'+gettext('Task detail')+'</div>'

    switch (status.toUpperCase()) {
        case 'NEW':
            list_innerHTML += '<div class="col-100"><a href="#" class="button button-fill color-blue" name="task-action" onclick="ChangeTaskStatus('+data.task.id+', \'processing\');">'+gettext('ACCEPT')+'</a></div>'
            break;
        case 'CLOSED':
            list_innerHTML += '<div class="col-100"><a href="#" class="button button-fill color-blue" name="task-action" onclick="ChangeTaskStatus('+data.task.id+', \'processing\');">'+gettext('ACCEPT')+'</a></div>'
            break;
        case 'PROCESSING':
            list_innerHTML += '<div class="col-100"><a href="#" class="button button-fill color-green" name="task-action" onclick="ChangeTaskStatus('+data.task.id+', \'closed\');">'+gettext('CLOSE')+'</a></div>'
            break;
        default:
            list_innerHTML += ''
    }
    list_innerHTML += '</div>'
    list_innerHTML += '<div class="content-block"><div class="row">'
    list_innerHTML += '<div class="col-100"><b>'+data.task.title+'</b></div>'
    list_innerHTML += '<div class="col-100">'+gettext('Created: ')+data.task.created_by_name+'</div>'
    list_innerHTML += '<div class="col-100">'+data.task.created_date+'</div>'
    list_innerHTML += '</div><div class="row">'
    list_innerHTML += '<div class="col-100">'+data.task.description+'</div>'
    list_innerHTML += '</div></div></div></div>'

    list_innerHTML += '<div class="content-block-title">'+gettext('Comments')+'</div>'
    list_innerHTML += '<div class="list-block cards-list">'
    list_innerHTML += '<ul id="comment_content">'
    if(data.comments){
      for (var i = 0; i < data.comments.length; i++) {
        list_innerHTML += '<li class="card">'
        list_innerHTML += '<div class="card-header">'+data.comments[i].created_by+'</div>'
        list_innerHTML += '<div class="card-content">'
        list_innerHTML += '<div class="card-content-inner comment_task">'+data.comments[i].comment+'</div>'
        list_innerHTML += '</div><div class="card-footer">'+data.comments[i].created_date+'</div>'
        list_innerHTML += '</li>'
      }
    }
    list_innerHTML += '</ul></div></div>'

    list_innerHTML += '<div class="list-block cards-list">'
    list_innerHTML += '<ul>'
      list_innerHTML += '<li class="card align-top">'
      list_innerHTML += '<div class="card-header">'+gettext('Leave comment')+':</div>'
      list_innerHTML += '<form method="post" id="task-comment-form" action="/api/task_new_comment/" class="ajax-submit">'
      list_innerHTML += '<input type="hidden" name="id" value="'+data.task.id+'">'
      list_innerHTML += '<input type="hidden" name="token" value="'+user_token+'">'
      list_innerHTML += '<div class="card-content">'
      list_innerHTML += '<div class="card-content-inner comment_task">'
      list_innerHTML += '<div class="item-input">'
      list_innerHTML += '<textarea class="resizable" name="comment" id="comment" placeholder="'+gettext('Text comemnt')+'"></textarea>'
      list_innerHTML += '</div></div>'
      list_innerHTML += '</div><div class="card-footer">'
      list_innerHTML += '<button type="submit" class="button button-fill color-green">'+gettext('Submit')+'</button>'
      list_innerHTML += '</div></form>'
      list_innerHTML += '</li>'
    list_innerHTML += '</ul></div></div>'
  return list_innerHTML;
}


function ChangeTaskStatus(task_id, status) {
  var user_token = localStorage.getItem('token');
  var task_url = domen +'/api/change_task_status/';
  $$.post(task_url, {'token': user_token, 'tid': task_id, 'status': status}, function(data){
    if (!data.error) {
      var commentTime = moment().format('MMM Do, YYYY, HH:mm a');
      if (status == "processing"){
        var comment = "<code>"+gettext('Accept task')+"</code>";
        $$('div#status').html(gettext(status)).removeClass('color-green').removeClass('color-blue').addClass('color-orange');
        $$('a.button[name=task-action]').removeClass('color-blue').addClass('color-green').html(gettext('CLOSE')).attr('onclick', 'ChangeTaskStatus(' + task_id +', \'closed\');');
      /*  new PNotify({
          title: 'Task info',
          text: 'Task accepted.',
          type: 'success'
        });*/
      }
      if (status == "closed") {
        var comment = "<code>"+gettext('Close task')+"</code>";
        $$('div#status').html(gettext(status)).removeClass('color-orange').addClass('color-green');
        $$('a.button[name=task-action]').removeClass('color-green').addClass('color-blue').html(gettext('ACCEPT')).attr('onclick', 'ChangeTaskStatus(' + task_id +', \'processing\');');
        /*new PNotify({
          title: 'Task info',
          text: 'Task closed.',
          type: 'success'
        });*/
      }
      //console.log(data);
      data=JSON.parse(data);
      var commentBlock = $$('#comment_content').html();
      var list_innerHTML = '<li class="card">'
      list_innerHTML += '<div class="card-header">'+data.created_by+'</div>'
      list_innerHTML += '<div class="card-content">'
      list_innerHTML += '<div class="card-content-inner comment_task">'+data.comment_body+'</div>'
      list_innerHTML += '</div><div class="card-footer">'+moment.utc(data.time).format('YYYY-MM-DD HH:mm')+'</div>'
      list_innerHTML += '</li>'
      $$('#comment_content').html(commentBlock+list_innerHTML);
      myApp.addNotification({
          title: gettext('Task'),
          message: gettext('Task status changed to')+' '+gettext(status)
      });
      setTimeout(function () {
        myApp.closeNotification(".notification-item");
      }, 4000);
    }else{
      myApp.addNotification({
          title: gettext('Error'),
          message: data.message
      });
    }
  });
}

function BuildClientsList() {
  var clients_url = domen + '/api/clients.json/';
  $('#customers_page_title').html(gettext('Customers'));
  $('#group_customers_btn').html('<i class="fa fa-address-card-o" aria-hidden="true"></i> '+gettext(' Groups Customers'))
  $('#search_bar_placehoder').attr('placeholder', gettext('Search'));
  $('#text_nothing_found').html(gettext('Nothing found'));
  $$.post(clients_url, {for: 'list', token: user_token}, function(data){
    data = JSON.parse(data)
    if (!data.error) {
      var ulHtml = '';
      ulHtml = '<li class="swipeout">'+gettext('Clients')+'</li>';
      ulHtml += listClients(data.clients)
      ulHtml += '<li class="swipeout">'+gettext('Companys')+'</li>';
      ulHtml += listClients(data.c_companys)
      $$('ul#clients').html(ulHtml)
    }
    else {
      if (data.relogin)
        myApp.loginScreen();
      else
        myApp.alert(data.message);
    }
  });
}

function listClients(data){
  var ulHtml = '';
  for (var i = 0; i < data.length; i++) {
    ulHtml += '<li class="swipeout">';
    ulHtml += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
    //ulHtml += '<a onclick="myApp.clientId=\''+data[i].id+'\'; myApp.mainView.loadPage(\''+pages_url+'/pages/client_info.html\');" class="item-content item-link">';
    ulHtml += '<div class="item-inner"><div class="item-title-row"><div class="item-title">'+ data[i].name +'</div></div>';
    //ulHtml += '</a>';
    ulHtml += '<div class="item-text n_tc">';
    ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Phone')+'</div>'+data[i].mobile_phone+'</div>';
    if(data[i].email){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Email')+'</div>'+data[i].email+'</div>';
    }
    if(data[i].another_phone && data[i].another_phone != 'None'){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Phone')+' 2</div>'+data[i].another_phone+'</div>';
    }
    if(data[i].address){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Address')+'</div>'+data[i].address+'</div>';
    }
    if(data[i].address2){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Address')+' 2</div>'+data[i].address2+'</div>';
    }
    if(data[i].city){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('City')+'</div>'+data[i].city+'</div>';
    }
    if(data[i].state){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('State')+'</div>'+data[i].state+'</div>';
    }
    if(data[i].came_from){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Came from')+'</div>'+data[i].came_from+'</div>';
    }
    if(data[i].groups.length > 0){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Groups')+':</div></div>';
      ulHtml += '<div class="row col-100">';
      for (var j = 0; j < data[i].groups.length; j++) {
        if(j>0){ ulHtml += ', '; }
        ulHtml += data[i].groups[j].name;
      }
      ulHtml += '</div>';
    }
    if(data[i].note){
      ulHtml += '<div class="row col-100"><div class="l_tc">'+gettext('Note')+':</div></div>';
      ulHtml += '<div class="row col-100">'+data[i].note+'</div>';
    }
    ulHtml += '</div></div></a></div>';
    ulHtml += '<div class="swipeout-actions-left">';
    ulHtml += '<a onclick="myApp.clientId=\''+data[i].id+'\'; myApp.mainView.loadPage(\''+pages_url+'/pages/edit_client.html\');" class="action1">'+gettext('Edit ')+'</a>';
    ulHtml += '<a href="new_invoice.html" onclick="InvocesClientload('+data[i].id+', 1, \''+data[i].name.replace(/"/g, '').replace(/'/g, '')+'\')" class="action2 bg-lightblue">'+gettext('Invoices')+'</a>';
    ulHtml += '<a href="new_estimate.html" onclick="InvocesClientload('+data[i].id+', 0, \''+data[i].name.replace(/"/g, '').replace(/'/g, '')+'\')" class="action3 bg-orange">'+gettext('Estimates')+'</a>';
    ulHtml += '</div>';
    ulHtml += '<div class="swipeout-actions-right">';
    ulHtml += '<a href="new_invoice.html" onclick="Invoceload(\'\', \'New\', 1, '+data[i].id+', \''+data[i].name.replace(/"/g, '').replace(/'/g, '')+'\')" class="action1 bg-lightblue">'+gettext('Invoice')+'</a>';
    ulHtml += '<a href="new_estimate.html" onclick="Invoceload(\'\', \'New\', 0, '+data[i].id+', \''+data[i].name.replace(/"/g, '').replace(/'/g, '')+'\')" class="action2 bg-orange">'+gettext('Estimate')+'</a>';
    ulHtml += '</div>';
    ulHtml += '</li>';
  }
  return ulHtml;
}
function GetClientInfo() {
  var clientInfoUrl = domen + '/api/client_info.json/';
  //translate
  $('#customer_info_page').html(gettext('Customer info'));
  $$.post(clientInfoUrl, {cid: myApp.clientId, token: user_token}, function(data){
    data = JSON.parse(data);
    if (!data.error) {
      var client = data.client_info;
      if (client.is_company) {
          $$('div#client-name').html(client.company_name);
      }
      else {
        $$('div#client-name').html(client.first_name + ' ' + client.last_name);
      }

      pBasicHTML = "<p><b><u>"+gettext('Contacts')+":</u></b><br>";
      if ((client.mobile_phone) && (client.mobile_phone != 'None'))
        pBasicHTML += "<b>"+gettext("mobile")+": </b>" + client.mobile_phone + "<br>";
      if ((client.another_phone) && (client.another_phone != 'None'))
        pBasicHTML += "<b>"+gettext('cell')+": </b>" + client.another_phone + "<br>";
      if ((client.email) && (client.email != 'None'))
        pBasicHTML += "<b>"+gettext('email')+": </b>" + client.email + "<br>";
      pBasicHTML += "</b>";
      $$('div#client-basic').html(pBasicHTML);

      pAdditionalHTML = "<p><b><u>Address:</u></b><br>";
      if ((client.address) && (client.address != 'None'))
        pAdditionalHTML += client.address;
      if ((client.address2) && (client.address2 != 'None'))
        if ((client.address) && (client.address != 'None'))
          pAdditionalHTML += ', ' + client.address2 + "<br>";
        else {
          pAdditionalHTML += client.address2 + "<br>";
        }
      else {
        if ((client.address) && (client.address != 'None'))
          pAdditionalHTML += "<br>";
      }
      if ((client.city) && (client.city != 'None'))
        pAdditionalHTML += client.city
        if ((client.state) && (client.state != 'None'))
          if ((client.city) && (client.city != 'None'))
            pAdditionalHTML += ", " + client.state + "<br>";
          else {
            pAdditionalHTML += client.state + "<br>";
          }
        else {
          if ((client.city) && (client.city != 'None'))
            pAdditionalHTML += "<br>";
        }
      if ((client.zip_code) && (client.zip_code != 'None'))
        pAdditionalHTML += client.zip_code + "<br>";
      pAdditionalHTML += "</p>";
      if (pAdditionalHTML.length == 33)
        $$('div#client-additional').html("<p><b><u>"+gettext('Address')+":</u></b><br>"+gettext('No data')+"</p>");
      else
        $$('div#client-additional').html(pAdditionalHTML);
    }
    //console.log(data);
  });
};

function UpdateMultiSelect(value){
  var itemText = [],
      inputValue = [];
  for (var i = 0; i < value.length; i++) {
      itemText.push(value[i].text);
      inputValue.push(value[i].id);
  }
  // Add item text value to item-after
  $$('#groups-ajax').find('.item-after').text(itemText.join(', '));
  // Add item value to input value
  $$('#groups-ajax').find('input').val(inputValue.join(', '));
};

function FillClientForm() {
  var clientInfoUrl = domen + '/api/client_info.json/';
  //translate
  $('#edit_customer_page').html(gettext('Edit customer'));
  $('#basic_info_customer').html(gettext('Basic info'));
  $('#customer_company_name_title').html(gettext('Company name'));
  $('#customer_first_name_title').html(gettext('First name'));
  $('#customer_last_name_title').html(gettext('Last name'));
  $('#customer_phone_title').html(gettext('Phone'));
  $('#customer_phone_2_title').html(gettext('Phone')+' 2');
  $('#customer_email_title').html(gettext('E-mail'));
  $('#customer_came_grome_title').html(gettext('Came from'));
  $('#customer_choose_gtoup_title').html(gettext('Choose groups'));
  $('#customer_address_title').html(gettext('Address'));
  $('#customer_address_2_title').html(gettext('Address 2'));
  $('#customer_city_title').html(gettext('City'));
  $('#customer_state_title').html(gettext('State'));
  $('#customer_ZIP_title').html(gettext('ZIP'));
  $('#customer_note_title').html(gettext('Note'));
  $('#customer_save_button_value').html(gettext('Save'));
  $$.post(clientInfoUrl, {cid: myApp.clientId, token: user_token}, function (data){
    data = JSON.parse(data);
    var client = data.client_info;
    console.log(client);
    var groupsArray = [];
    var formData = {
      'cid': client.id,
      'phone': client.mobile_phone,
      'token': user_token
    }
    $$('input[name=phone]').parents('div.item-inner').addClass('not-empty-state');
    if ((client.company_name) && (client.company_name != 'None') && (client.company_name != '')) {
      formData['company_name'] = client.company_name;
      $$('input[name=company_name]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.first_name) && (client.first_name != 'None') && (client.first_name != '')) {
      formData['first_name'] = client.first_name;
      $$('input[name=first_name]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.last_name) && (client.last_name != 'None') && (client.last_name != '')) {
      formData['last_name'] = client.last_name;
      $$('input[name=last_name]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.address) && (client.address != 'None') && (client.address != '')) {
      formData['address'] = client.address;
      $$('input[name=address]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.another_phone) && (client.another_phone != 'None') && (client.another_phone != '')) {
      formData['another_phone'] = client.another_phone;
      $$('input[name=another_phone]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.address2) && (client.address2 != 'None') && (client.address2 != '')) {
      formData['address2'] = client.address2;
      $$('input[name=address2]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.came_from) && (client.came_from != 'None') && (client.came_from != '')) {
      formData['coming_from'] = client.came_from;
      $$('input[name=coming_from]').parents('div.item-inner').addClass('not-empty-state');
    }

    if ((client.city) && (client.city != 'None') && (client.city != '')) {
      formData['city'] = client.city;
      $$('input[name=city]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.email) && (client.email != 'None') && (client.email != '')) {
      formData['email'] = client.email;
      $$('input[name=email]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.note) && (client.note != 'None') && (client.note != '')) {
      formData['note'] = client.note;
      $$('textarea[name=note]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.state) && (client.state != 'None') && (client.state != '')) {
      formData['state'] = client.state;
      $$('input[name=state]').parents('div.item-inner').addClass('not-empty-state');
    }
    if ((client.zip_code) && (client.zip_code != 'None') && (client.zip_code != '')) {
      formData['zip_code'] = client.zip_code;
      $$('input[name=zip_code]').parents('div.item-inner').addClass('not-empty-state');
    }
    myApp.formFromJSON('#edit-client', formData);
    if (client.groups) {
      for (var i=0; i < client.groups.length; i++) {
        groupsArray.push({'id': client.groups[i].id, 'text': client.groups[i].name});
      }
    }
    //console.log(groupsArray);
    var autocompleteStandaloneAjax = myApp.autocomplete({
        openIn: 'page', //open in page
        opener: $$('#groups-ajax'), //link that opens autocomplete
        multiple: true, //allow multiple values
        valueProperty: 'id', //object's "value" property name
        textProperty: 'text', //object's "text" property name
        limit: 50,
        preloader: true, //enable preloader
        source: function (autocomplete, query, render) {
            var results = [];
            if (query.length === 0) {
                render(results);
                return;
            }
            // Show Preloader
            autocomplete.showPreloader();
            // Do Ajax request to Autocomplete data
            var groupsURL = domen + '/api/groups.json';
            $$.ajax({
                url: groupsURL,
                method: 'POST',
                dataType: 'json',
                //send "query" to server. Useful in case you generate response dynamically
                data: {
                    query: query,
                    token: user_token
                },
                success: function (data) {
                    // Find matched items
                    for (var i = 0; i < data.query.length; i++) {
                        results.push(data.query[i]);
                    }
                    // Hide Preoloader
                    autocomplete.hidePreloader();
                    // Render items by passing array with result items
                    render(results);
                }
            });
        },
        onChange: function (autocomplete, value) {
            var itemText = [],
                inputValue = [];
            for (var i = 0; i < value.length; i++) {
                itemText.push(value[i].text);
                inputValue.push(value[i].id);
            }
            // Add item text value to item-after
            $$('#groups-ajax').find('.item-after').text(itemText.join(', '));
            // Add item value to input value
            $$('#groups-ajax').find('input').val(inputValue.join(', '));
        }
    });
    //console.log(groupsArray);
    autocompleteStandaloneAjax.value = groupsArray;
    UpdateMultiSelect(groupsArray);
  });

};

function expandPayments(obj){
  if($(obj).find('.item-text').hasClass('expand-text')){
    $(obj).find('.item-text').removeClass('expand-text');
  }else{
    $(obj).find('.item-text').addClass('expand-text');
  }
}

function searhPayment(data){
  var form = $$('form#search-payments');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#payments_page_title').html(gettext('Payments'));
  $('#search_payments').html('<i class="fa fa-search"></i> '+gettext('Search payments'));
  $('#serch_paiments_invoice_num_title').html(gettext('Invoice #'));
  $('#serch_paiments_invoice_num').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#serch_payments_accepted_title').html(gettext('Accepted By'));
  $('#serch_payments_accepted').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#serch_payments_customers_title').html(gettext('Customers'));
  $('#serch_payments_customers').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#search-payments a.item-link.smart-select[data-picker-close-text]').attr('data-picker-close-text', gettext('Close'));
  $('#serch_payments_payment_method_title').html(gettext('Payment Method'));
  $('#serch_payment_price_title').html('<i class="fa fa-usd" aria-hidden="true"></i> '+gettext('Amount'));
  $('#serch_payments_p_price_title').html(gettext('Amount is'));
  $('#serch_payments_active_refound_title').html(gettext('Status'));
  $('#serch_payments_ignore_date_text').html(gettext('Date ignore'));
  $('#serch_payments_date_range_title').html(gettext('Date'));
  $('#btn_search_payments').html(gettext('Search'));
  $('#btn_close_search_payments').html(gettext('Close'));

  $$('#search-payments').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

  var calendarRange = myApp.calendar({
    input: '#serch_payments_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(new Date()),
      Date.parse(new Date()),
    ],
    rangePicker: true
  });
  //invoices num
  var invoice_num_str = '';
  for (var i = 0; i < data.invoices.length; i++) {
    invoice_num_str += '<option value="'+data.invoices[i].inv_num+'">'+data.invoices[i].inv_num+'</option>';
  }
  $('#serch_paiments_invoice_num').html(invoice_num_str);
  //users
  TaskRA(data, '#serch_payments_accepted');
  //clients
  var clients_str = '';
  if(data.customers){
    clients_str = '<optgroup label="'+gettext('CLients')+'">';
    for (var i = 0; i < data.customers.length; i++) {
      clients_str += '<option value="'+data.customers[i].id+'">'+data.customers[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  if(data.customer_companys){
    clients_str += '<optgroup label="'+gettext('Companys')+'">';
    for (var i = 0; i < data.customer_companys.length; i++) {
      clients_str += '<option value="'+data.customer_companys[i].id+'">'+data.customer_companys[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  $('#serch_payments_customers').html(clients_str);
  //payment method
  var payment_method_str = '';
  for (var i = 0; i < data.payment_methods.length; i++) {
    payment_method_str += '<option value="'+data.payment_methods[i].name+'">'+data.payment_methods[i].name+'</option>';
  }
  $('#serch_payments_payment_method').html(payment_method_str);
  //amoind is
  var p_price_str = '<option value="lte" selected>'+gettext('Less')+'</option>';
  p_price_str += '<option value="equal">'+gettext('Equal')+'</option>';
  p_price_str += '<option value="gte">'+gettext('More')+'</option>';
  $('#serch_payments_p_price').html(p_price_str);
  $('#serch_payments_p_price_after').html(gettext('Less'));
  $('#serch_payments_p_price').val('lte');
  //paid status
  var paid_ref_str = '<option value="">'+gettext('Paid+Refunded')+'</option>';
  paid_ref_str += '<option value="refund">'+gettext('Refunded')+'</option>';
  paid_ref_str += '<option value="payed">'+gettext('Paid')+'</option>';
  $('#serch_payments_active_refound').html(paid_ref_str);

  $('form#search-payments').validate({
      submitHandler: function(form){
        //console.log('test');
          var date_range = $('#serch_payments_date_range').val();
          //console.log(startTime);
          if(!date_range){
            myApp.addNotification({
                title: gettext('Error'),
                message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter date.')
            });
            return false;
          }else if(date_range.length < 20){
            date_range = date_range+' - '+date_range
          }
          if(!user_token){
            myApp.loginScreen();
            return false;
          }


            var $table = $('table#payments');
            $table.DataTable().destroy();
            table = $('#payments').DataTable( {
              //paging: false,
              //searching: false,
              lengthChange: false,
              //info: false,
              destroy: true,
              ordering: false,
              iDisplayLength: 3,
              "ajax": {
                      url: "/api/payments.json?search=true&"+$(form).serialize(),
                      type: "POST",
                      data: {'token': user_token},
                      complete: function(data) {
                        //console.log(data);
                        myApp.addNotification({
                            message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' payments')+'</b></p>'
                        });
                        $('div[name=hidden_search_task]').addClass('hiddend');
                 },
                  },
              "columns": columns,
              //responsive: true
              } );
        }
  });

  var columns = [{
    'render': function (data, type, row){
      var r_str = '';
        r_str +='<li class="swipeout">';
        r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
        r_str += '<div class="item-inner"><div class="item-title-row">';
        r_str += '<div class="item-title">'+gettext('Invoice #')+row.invoice_number+'</div>';
        r_str += '<div class="item-after">'+row.date+'</div>';
        r_str += '</div><div class="item-subtitle">';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+' $</div>'+row.payment+'</div>';
        r_str += '</div><div class="item-text n_tc">';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Customer')+'</div>'+row.client+'</div>';
        if(row.refund){
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('refunded')+"</span></div>";
        }else{
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('paid')+"</span></div>";
        }
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Method')+'</div>'+row.payment_method+'</div>';
        r_str += '<div class="row col-100" id="customers_inv_title"><div class="l_tc">'+gettext('Accepted')+'</div>'+row.accepted_by+'</div>';
        r_str += '</div></div></a></div>';
        r_str += '<div class="swipeout-actions-left">';
       if(row.is_active){
          r_str += '<a href="#" onclick="PopupInvPay('+row.iid+', 0); AddPayments(0);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }else{
          r_str += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }
        r_str += '</div><div class="swipeout-actions-right">';
        r_str += '<a href="#" onclick="InvoceIdload('+row.invoice_number+')" class="bg-orange">Invoice</a>';
        r_str += '</div></li>';
      return r_str;
    }
  }];

  function footerCallbackPayments( row, data, start, end, display ) {
      var total = 0.0;

      $.each(display, function () {
        if((!data[this].refund)){
          total += parseFloat(data[this].payment);
        }
      });
      var totalPage = parseFloat(myApp.totalPage)
      //total on this page

      var footStr = "$ " + total.toFixed(2);
      if(totalPage.toFixed(2) != total.toFixed(2))
        footStr = "$ " + total.toFixed(2) + " ($ " + totalPage.toFixed(2) + gettext(' total')+")";
      /* Modify the footer row to match what we want */
      $(row).find('span:eq(0)').html(gettext('Total: ')+footStr);
  }

  var table = $('#payments').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 3,
    "ajax": {
            "url": "/api/payments.json",
            "type": "POST",
            "data": {'token':user_token},
        },
    "columns": columns,
    "footerCallback": function ( row, data, start, end, display ) {
        footerCallbackPayments( row, data, start, end, display );
    },
    //responsive: true
    } );
}

function InvocesClientload(client_id, is_invoice, client_name){
  myApp.invoice_client_id = client_id;
  myApp.is_invoice_client = is_invoice;
  myApp.invoice_client_name = client_name;
  if(is_invoice){
    myApp.mainView.loadPage(pages_url+"/pages/invoices_client.html");
  }else{
    myApp.mainView.loadPage(pages_url+"/pages/estimates_client.html");
  }
}

function InvocesClientPage(tasks_url){
  myApp.showIndicator();
  $$('#invoices_client_title_name').html(gettext('Invoices'));

  var columns = [{
    'render': function (data, type, row){
      console.log(row);
      var r_str = '';
        r_str +='<li class="swipeout">';
        r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
        r_str += '<div class="item-inner"><div class="item-title-row">';
        r_str += '<div class="item-title">'+gettext('Invoice #')+row.invoice_number+'</div>';
        r_str += '<div class="item-after">'+row.date_issued+'</div>';
        r_str += '</div><div class="item-subtitle">';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Customer')+'</div>'+row.client+'</div>';
        r_str += '</div><div class="item-text n_tc">';

        var str = "";
        var strDate = row.date_issued.toString().split('-');
        var dateX = new Date();
        dateX.setFullYear(parseInt(strDate[0]), parseInt(strDate[1])-1, parseInt(strDate[2]));
        dateX.setDate(dateX.getDate() + parseInt(row.pay_terms));
        var today = new Date();
        switch (row.status.toUpperCase()) {
            case 'PAID': str ="<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
                break;
            case 'PARTIAL': if (today >= dateX) {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-blue' style='text-transform: uppercase'>"+gettext(row.status);
                str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
            }
            else {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-blue' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>&nbsp;";
            }
                break;
            case 'DRAFT': if (today >= dateX) {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status);
                str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
            }
            else {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
            }
                break;
            case 'UNPAID': if (today >= dateX) {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status);
                str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
            }
            else {
                str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
            }
        }
        r_str += str;
        var debt = parseFloat(row.total) - parseFloat(row.payed);
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Balance')+'</div>'+(-debt.toFixed(2))+'</div>';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+'</div>'+parseFloat(row.total).toFixed(2)+'</div>';
        if(row.is_active){
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('active')+"</span></div>";
        }else{
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('inactive')+"</span></div>";
        }
        r_str += '<div class="row col-100" ><div class="l_tc">'+gettext('User')+'</div>'+row.manager+'</div>';
        r_str += '</div></div></a></div>';
        r_str += '<div class="swipeout-actions-left">';
        if(row.is_active){
          r_str += '<a href="#" onclick="PopupInvPay('+row.id+', 1);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }else{
          r_str += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }
        r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Clone\', 1)" class="bg-pink">'+gettext('Clone')+'</a>'
        r_str += '</div>'
        r_str += '<div class="swipeout-actions-right">'
        if(row.status == 'Unpaid' && row.is_active){
          r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Edit\', 1)" class="bg-orange">'+gettext('Edit')+'</a>'
        }else{
          r_str += '<a href="#" class="">'+gettext('Edit')+'</a>'
        }
        r_str += '<a href="#" onclick="Pdfload('+row.id+', \'invoice\')" class="bg-blue">'+gettext('Pdf')+'</a>'
        r_str += '</div></li>';
      return r_str;
    }
  }];

  var $table = $('table#invoices_table');
  $table.DataTable().destroy();
  table = $('#invoices_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 3,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token, 'for': 'invoices_client', 'id': myApp.invoice_client_id},
            complete: function() {
                myApp.hideIndicator();
                $('#float_action_inv_client').attr('onclick', 'Invoceload("", "New", 1,'+myApp.invoice_client_id+', "'+myApp.invoice_client_name+'")');
            },
    },
    "columns": columns,
    //responsive: true
    });
}


function EstimatesClientPage(tasks_url){
  myApp.showIndicator();

  var $table = $('table#estimates_table');
  $table.DataTable().destroy();
  table = $('#estimates_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 3,
    "ajax": {
            url: "/api/estimates.json",
            type: "POST",
            data: {'token': user_token, 'for': 'estimates_client', 'id': myApp.invoice_client_id},
            complete: function(data) {
              myApp.hideIndicator();
              $('#float_action_inv_client').attr('onclick', 'Invoceload("", "New", 0,'+myApp.invoice_client_id+', "'+myApp.invoice_client_name+'")');

       },
        },
    "columns": columns_estimats,
    //responsive: true
  } );
}




var columns_workers = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="swipeout">';
      r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
      r_str += '<div class="item-inner"><div class="item-title-row">';
      r_str += '<div class="item-title">'+row.name+'</div>';
      r_str += '<div class="item-after">'+gettext(row.position)+'</div>';
      r_str += '</div><div class="item-subtitle">';
      r_str += '</div><div class="item-text n_tc">';
      r_str += '</div></div></a></div>';
      r_str += '<div class="swipeout-actions-right">'
      r_str += '<a href="#" onclick="Usersload('+row.id+')" class="bg-orange">'+gettext('Info')+'</a>'
      r_str += '</div></li>';
    return r_str;
  }
}];

function WorkersListPage(tasks_url){
  myApp.showIndicator();
  $('#users_page_title').html(gettext('Users'))
  $$.post(tasks_url, {'token': user_token, 'for': 'workers'}, function(data){
      var data = JSON.parse(data);
      console.log(data);
      if(!data.add_empl){
        $('#btn_fl_new_worker')[0].remove();
      }
    });

  var $table = $('table#users_table');
  $table.DataTable().destroy();
  table = $('#users_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data: {'token': user_token, 'for': 'workers_list'},
            complete: function(data) {
              myApp.hideIndicator();
            },
    },
    "columns": columns_workers,
    //responsive: true
  } );
}

function Usersload(id){
  myApp.worker_id = id;
  console.log(pages_url);
  myApp.mainView.loadPage(pages_url+"/pages/worker_info.html");
}

function BuldWorkerInfoPage(data) {
  $$('#worker_info_page').html(gettext('Worker info'));
  var img_str = '<img class="t_c profile-user-img img-responsive img-circle" ';
  img_str += 'src="'+data.info.url+'" alt="User profile picture" style="transform: rotate('+data.info.degr+'deg);">';
  $('#worker-info-name').html(img_str);
  var list_str = '<h3 class="t_c"><i class="fa fa-book margin-r-5"></i> '+gettext('Information')+'</h3>'
  list_str += '<div><b>'+gettext('Full name')+':</b> '+data.info.first_name+' '+data.info.last_name+'</div>';
  list_str += '<div><b>'+gettext('Position')+':</b> '+gettext(data.worker_position)+'</div>';
  list_str += '<div><b>'+gettext('Login name')+':</b> '+data.info.username+'</div>';
  list_str += '<div><b>'+gettext('Phone')+':</b> '+data.info.phone+'</div>';
  list_str += '<div><b>'+gettext('Phone 2')+':</b> '+data.info.another_phone+'</div>';
  list_str += '<div><b>'+gettext('Email')+':</b> '+data.info.email+'</div>';
  list_str += '<div><b>'+gettext('Date join')+':</b> '+data.info.date_joined+'</div>';
  if(data.info.last_login){
    list_str += '<div><b>'+gettext('Last login')+':</b> '+data.info.last_login+'</div>'; }
  $('#worker-info-list').html(list_str);
  if(data.me){
    console.log('me');
    $('#worker_info_change_group_btn').attr('disabled', 'disabled');
    avatarscript();
    $('#avatarform').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
    $('#avatarform').append('<input type=\'hidden\' name=\'uid\' value=\''+data.worker_id+'\'>');
    $('#card_avatar_user').removeClass('hidden')
  }else{
    $('#card_avatar_user').remove()
  }
  myApp.user_edit_task = data.edit_task;
  myApp.user_position = data.position;
  myApp.user_id = data.user_id;
  myApp.worker_id = data.worker_id;
  var str = ''
  var selid = 0;
  var seltext = '';
  for (var i = 0; i < data.inventory.length; i++) {
    var sel = '';
    if(i==0){
      sel = 'selected';
      selid = data.inventory[i].id;
      seltext = data.inventory[i].text;
      }
    str += '<option value="'+data.inventory[i].id+'" '+sel+'>'+data.inventory[i].text+'</option>';
  }
  $('#worker_info_eq').html(str);
  $('#worker_info_eq').val(selid);
  $('#worker_info_eq_after').html(seltext);

  $('#worker_info_basic_info_title').html(gettext('Edit information'));
  $('#worker_info_first_name_title').html(gettext('First name'));
  $('#worker_info_last_name_title').html(gettext('Last name'));
  $('#worker_info_phone_title').html(gettext('Phone'));
  $('#worker_info_phone_2_title').html(gettext('Phone')+' 2');
  $('#worker_info_email_title').html('E-mail');
  $('#worker_info_change_email').html(gettext('Change e-mail'));
  $('#worker_info_date_of_birth_title').html(gettext('Date of birth'));
  $('#worker_info_save_btn').html(gettext('Save user info'));
  $('#worker-info-form input[name=first_name]').val(data.info.first_name);
  $('#worker-info-form input[name=last_name]').val(data.info.last_name);
  $('#worker-info-form input[name=phone]').val(data.info.phone);
  $('#worker-info-form input[name=another_phone]').val(data.info.another_phone);
  $('#worker-info-form input[name=email]').val(data.info.email);
  if(data.info.date_of_birth){
    $('#worker-info-form input[name=date_of_birth]').val(data.info.date_of_birth);
  }else{
    $('#worker-info-form input[name=date_of_birth]').val('');
  }
  $('#worker_add_inv_title').html('<i class="fa fa-plus-square"></i> '+gettext('Add Inventory'));
  $('#worker_info_eq_stor_title').html(gettext('Add amount from Storage'));
  $('#worker_info_eq_title').html(gettext('Inventory:'));
  $('#worker_add_eq_amount_title').html(gettext('Quantity'));
  $('#worker_add_eq_btn').html(gettext('add'));
  $('#worker_info_change_group_title').html(gettext('Change group'));
  $('#worker_info_change_permissions_title').html(gettext('Change permissions'));
  $('#worker_info_choose_permissions_title').html(gettext('Choose permissions'));
  var str = '';
  var selval = [];
  var select = '';
  var names_str = '';
  for (var i = 0; i < data.all_perm.length; i++) {
    select = '';
    if(data.user_perm){
      if (data.user_perm.indexOf(data.all_perm[i].id) >= 0){
        select = 'selected';
        names_str += data.all_perm[i].name+', ';
        selval.push(data.all_perm[i].id);
      }
    }
    str += '<option value="'+data.all_perm[i].id+'" '+select+'>'+data.all_perm[i].name+'</option>';
  }
  $('#worker_info_choose_permissions').html(str);
  $('#worker_info_choose_permissions').val(selval);
  $('#worker_info_choose_permissions_after').html(names_str);


  $('#worker_info_choose_group_title').html(gettext('Choose group'));
  $('#worker_info_change_group_btn').html(gettext('Change group'));
  $('#worker_info_change_password_btn').html(gettext('Change password'));
  $('#worker_info_inventory_title').html(gettext('Inventory'));
  if(!data.change_employee){
    $('#worker-info-form input[name=first_name]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=last_name]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=phone]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=another_phone]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=email]').attr('readonly', 'readonly');
    $('#worker_info_change_email').attr('disabled', 'disabled');
    $('#worker_info_save_btn').attr('disabled', 'disabled');
    $('#worker_info_change_group_btn').attr('disabled', 'disabled')
    $('#worker_info_change_password_btn').attr('disabled', 'disabled')
    $('#worker_info_change_permissions_btn').attr('disabled', 'disabled')
  }
  if(!data.add_equipments){
      $('#worker_add_inv')[0].remove();
  }
  if(!data.delete_employee || data.me){
      $('#worker_info_delete_btn')[0].remove();
  }else{
    $('#worker_info_delete_btn').html(gettext('Delete worker'))
  }
  myApp.worker_info_change_equipments = data.change_equipments;
  var selid = -1;
  var seltext = '';
  var str = '';
  for (var i=0; i< data.val_grp.length; i++){
    var sel = '';
    if(i==0){
      sel = 'selected';
      selid = data.val_grp[i].id;
      seltext = gettext(data.val_grp[i].text);
      }
    str += '<option id="'+data.val_grp[i].text+'" value="'+data.val_grp[i].id+'" '+sel+'>'+gettext(data.val_grp[i].text)+'</option>';
  }
  $('#worker_info_choose_group').html(str);
  $('#worker_info_choose_group').val(selid);
  $('#worker_info_choose_group_after').html(seltext);
  var $table = $('table#worker_tasks');
  $table.DataTable().destroy();
  table = $('#worker_tasks').DataTable( {
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
            data: {'token': user_token, 'for': 'worker_info', 'worker_list': 'table','recipients':data.seach_rec,'status-ids':data.seach_stid},
            complete: function(data) {
              myApp.hideIndicator();
            },
    },
    "columns": columns_tasks,
    //responsive: true
  } );
  //inventory
  var $table = $('table#inventory_table');
  $table.DataTable().destroy();
  table = $('#inventory_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: domen + '/api/item.json',
            type: "POST",
            data: {'token': user_token, 'uid': myApp.worker_id, 'for': 'list'},
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": columns_inventory,
    //responsive: true
  } );

  //search workers task
  OpenWorkerTasksDateRanges(data, '', '', '', [data.worker_id], '');
  $('#worker-search-task').validate({
      submitHandler: function(form){
        //console.log('test');
          var startTime = $('#worker_serch_task_start_date').val();
          var endTime = $('#worker_serch_task_end_time').val();
          var closeTime = $('#worker_serch_task_close_time').val();
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
          var recipients = $('#worker_serch_task_recipients').val();
          recipients.push(myApp.worker_id);
          var status = $('#worker_serch_task_status_ids').val();
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
          if($('#worker_serch_task_ignore_start:checked').length){
            datatable['ignore-start'] = 'on'; }
          if($('#worker_serch_task_ignore_end:checked').length){
            datatable['ignore-end'] = 'on'; }
          if($('#worker_serch_task_ignore_close:checked').length){
            datatable['ignore-close'] = 'on'; }
          if($('#worker_serch_task_name').val())
          datatable['name'] = $('#worker_serch_task_name').val();
          console.log(datatable);
        /**/  $$.post(domen + '/api/search_tasks.json',  datatable, function(data){
            console.log('data test');
            console.log(data);
          });//*/
          var $table = $('table#worker_tasks');
          $table.DataTable().destroy();
          table = $('#worker_tasks').DataTable( {
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
                    complete: function(data) {
                      console.log(data);
                    },
            },
            "columns": columns_tasks,
            //responsive: true
          } );
        return false;
      }
  });
}


var columns_tasks = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title shot_text">'+row.title+'</div>';
      r_str +='<div class="item-after" style="color:'+row.color+';">'+row.created_date+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Status')+'</div>';
      switch (row.status.toUpperCase()) {
          case 'NEW':
              r_str += '<div class="chip lable-blue"><div class="chip-label lable-blue" style="text-transform: uppercase">'+gettext(row.status)+'</div></div></div>';
              break;
          case 'CLOSED':
              r_str += '<div class="chip lable-green"><div class="chip-label lable-green" style="text-transform: uppercase">'+gettext(row.status)+'</div></div></div>';
              break;
          case 'PROCESSING':
              r_str += '<div class="chip lable-orange"><div class="chip-label lable-orange" style="text-transform: uppercase">'+gettext(row.status)+'</div></div></div>';
              break;
          default:
              r_str += '<div class="t_r">'+gettext(row.status)+'</div>';
      }
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Created by')+'</div>'+row.created_by_name+'</div>';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Start')+'</div>'+row.start+'</div>';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('End')+'</div>'+row.end+'</div>';
      if(row.recipients){
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Recipients')+'</div>'+row.recipients+'</div>'; }
      if(row.clients){
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Clients')+'</div>'+row.clients+'</div>'; }
      if(row.close){
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Close')+'</div>'+row.close+'</div>'; }
      if(row.description){
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Description')+'</div>'+row.description+'</div>'; }
      r_str += '<div class="buttons-row col-100" style="padding-top:20px">';
      r_str += '<a href="#" onclick="myApp.task_id='+row.id+'; myApp.mainView.loadPage(\''+pages_url+'/pages/task_view.html\');" class="button button-raised button-fill">'+gettext('Info')+'</a></div>';
      if((myApp.user_edit_task)&&(myApp.user_position == 'Manager' && myApp.user_id == row.created_by_id || myApp.user_position != 'Manager')){
        r_str += '<div class="buttons-row col-100" style="padding-top:20px">';
        r_str += '<a href="#" onclick="Taskload('+row.id+')" class="button button-raised button-fill  bg-orange">'+gettext('Edit')+'</a>'
        r_str += '</div>';
      }
      //deletetask
      if((myApp.user_delete_task)&&(myApp.user_position == 'Manager' && myApp.user_id == row.created_by_id || myApp.user_position != 'Manager')){
        r_str += '<div class="buttons-row col-100" style="padding-top:20px">';
        r_str += '<a href="#" onclick="DeleteTask('+row.id+')" class="button button-raised button-fill  bg-red">'+gettext('Delete')+'</a>'
        r_str += '</div>';
      }
      r_str += '</div>'
      r_str +='</div></div></li>';
    return r_str;
  }
}];


function OpenWorkerTasksDateRanges(data, date_start, date_end, date_close, assigned_to, status){
  var date1 = Date.parse(new Date());
  var date2 = Date.parse(new Date());
  if(date_start){
    date1 = Date.parse(date_start.split(' - ')[0]);
    date2 = Date.parse(date_start.split(' - ')[1]);
  }
  var calendarRange = myApp.calendar({
    input: '#worker_serch_task_start_date',
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
    input: '#worker_serch_task_end_time',
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
    input: '#worker_serch_task_close_time',
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
  }else{
    assigned_to =[data.worker_id];
  }
  TaskRA(data.task_data, '#worker_serch_task_recipients', assigned_to, '#worker_serch_task_recipients_after',[data.worker_id])
  $('#worker_serch_task_recipients').val(assigned_to);
  var status_str = '';
  for (var i = 0; i < data.task_data.statuses.length; i++) {
    status_str += '<option value="'+data.task_data.statuses[i].id+'">'+gettext(data.task_data.statuses[i].name)+'</option>';
  }
  status_str +='<option value="overdue">'+gettext('overdue')+'</option>';
  $('#worker_serch_task_status_ids').html(status_str);
  if(status)
    $('#worker_serch_task_status_ids').val(status);
}

var columns_inventory = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title">'+row.item_name+'</div>';
      r_str +='<div class="item-after">'+row.amount+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('In storage')+'</div>'+row.in_storage+'</div>';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount');
      if(myApp.worker_info_change_equipments){
        r_str += '<a href="#return_to_stor" onclick="ReturnAmount('+row.id+')" data-toggle="modal" class="padingleft"><i class="fa fa-minus-circle"></i></a>'
        r_str +=  '</div><a href="#return_to_stor" onclick="AddAmount('+row.id+')" data-toggle="modal" class=""><i class="fa fa-plus-circle"></i></a>';
      }else{ r_str +=  '</div>'; }
      r_str += row.amount+'</div>';
      if(myApp.worker_info_change_equipments){
        r_str += '<div class="row col-100"><div class="l_tc" style="line-height:33px;">'+gettext('Return all amount equip')+'</div>';
        r_str += '<a href="#return_to_stor" onclick="RetarnInventory('+row.id+')" data-toggle="modal" class="button button-raised button-fill btn-round bg-orange"><i class="fa fa-reply" aria-hidden="true" style="font-size: 20px; padding-top:7px;"></i></a></div>';
        r_str += '<div class="row col-100"><div class="l_tc" style="line-height:33px;">'+gettext('Cancel employee equipment')+'</div>';
        r_str += '<a href="#return_to_stor" onclick="CanselInventory('+row.id+')" data-toggle="modal" class="button button-raised button-fill btn-round bg-red"><i class="fa fa-window-minimize" aria-hidden="true" style="font-size: 16px;"></i></a>'+'</div>'
      }
      r_str += '</div><div class="col-5"></div></div>'

      r_str +='</div></div></li>';
    return r_str;
  }
}];

function RetarnInventory(id, type){
  myApp.equipment_id = id;
  myApp.confirm(gettext('Are you sure?'), gettext('Return in storage'), function () {
      $.post('/api/return_to_storage/', {
          'token': user_token,
          'stor_it_id': myApp.equipment_id,
          'u_id': myApp.worker_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
            if(type == 2){
              $('#materials_table').DataTable().ajax.reload();
              $('#storage_in_use_table').DataTable().ajax.reload();
              $('#company_info_inventory_table').DataTable().ajax.reload();
            }else{
              $('#inventory_table').DataTable().ajax.reload();
            }
          });
  });
}

function CanselInventory(id, type){
  myApp.equipment_cancel_id = id;
    var modal = myApp.modal({
      title:  gettext('Cancel equipment'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Amount')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="amount" type="text" maxlength="30">'+
        '</div></div></div></li><li>'+
          '<div class="item-content"><div class="item-inner">'+
          '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Note')+'</div>'+
          '<div class="item-input item-input-field">'+
          '<textarea name="note" class="resizable"></textarea>'+
          '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: 'OK',
          bold: true,
          onClick: function() {
            var amount = parseFloat($(modal).find('input[name=amount]').val());
            var note = $(modal).find('textarea').val();
            if(amount){
              datatable = {
                'token': user_token,
                'uid': myApp.worker_id,
                'sid': myApp.equipment_cancel_id,
                'amount': amount,
                'note': note,
              }
              $.ajax({
                type: 'POST',
                url: '/api/cancel_equipment_amount/',
                data: datatable,
                success: function(data) {
                  if (!data.error) {
                    if(type == 2){
                      $('#materials_table').DataTable().ajax.reload();
                      $('#storage_in_use_table').DataTable().ajax.reload();
                      $('#company_info_inventory_table').DataTable().ajax.reload();
                    }else{
                      $('#inventory_table').DataTable().ajax.reload();
                    }
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
             });
            }
            console.log(amount+' '+note);
          }
        },
      ]
    });
    autosize(document.querySelectorAll('textarea'));
}


function ReturnAmount(id, type){
  myApp.equipment_return_id = id;
    var modal = myApp.modal({
      title:  gettext('Return amount to Storage'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Amount')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="amount" type="text" maxlength="30">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: gettext('Return amount'),
          bold: true,
          onClick: function() {
            var amount = parseFloat($(modal).find('input[name=amount]').val());
            if(amount){
              datatable = {
                'token': user_token,
                'u_id': myApp.worker_id,
                'stor_it_id': myApp.equipment_return_id,
                'amount': amount,
              }
              $.ajax({
                type: 'POST',
                url: '/api/staff/minus/',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    if(type == 2){
                      $('#materials_table').DataTable().ajax.reload();
                      $('#storage_in_use_table').DataTable().ajax.reload();
                      $('#company_info_inventory_table').DataTable().ajax.reload();
                    }else{
                      $('#inventory_table').DataTable().ajax.reload();
                    }
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
             });
            }
          }
        },
      ]
    });
}

function AddAmount(id, type){
  myApp.equipment_add_id = id;
    var modal = myApp.modal({
      title:  gettext('Add amount'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Amount')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="amount" type="text" maxlength="30">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: gettext('Add amount'),
          bold: true,
          onClick: function() {
            var amount = parseFloat($(modal).find('input[name=amount]').val());
            console.log(amount);
            if(amount){
              datatable = {
                'token': user_token,
                'u_id': myApp.worker_id,
                'stor_it_id': myApp.equipment_add_id,
                'amount': amount,
              }
              $.ajax({
                type: 'POST',
                url: '/api/staff/plus/',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    if(type == 2){
                      $('#materials_table').DataTable().ajax.reload();
                      $('#storage_in_use_table').DataTable().ajax.reload();
                      $('#company_info_inventory_table').DataTable().ajax.reload();
                    }else{
                      $('#inventory_table').DataTable().ajax.reload();
                    }
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
             });
            }
          }
        },
      ]
    });
}


function AddEquipmentWorker(type){
  if(type == 2){
    var amount = parseFloat($('#company_info_add_eq_amount').val());
    var material = $('#company_info_eq').val();
  }else{
    var amount = parseFloat($('#worker_add_eq_amount').val());
    var material = $('#worker_info_eq').val();
  }

  if(amount){
    if(!material){
      myApp.addNotification({
         message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p> '+gettext('select inventory')
     });
     return false;
    }
    datatable = {
      'token': user_token,
      'u_id': myApp.worker_id,
      'stor_it_id': material,
      'amount': amount,
    }
    $.ajax({
      type: 'POST',
      url: '/api/staff/add_equip_user/',
      data: datatable,
      success: function(data) {
        console.log(data);
        if (!data.error) {
          if(type == 2){
            $('#company_info_inventory_table').DataTable().ajax.reload();
            $('#company_info_add_inv').removeClass('accordion-item-expanded');
            $('#company_info_add_inv div.accordion-item-content').css('height', '0px');
          }else{
            $('#inventory_table').DataTable().ajax.reload();
            $('#worker_add_inv').removeClass('accordion-item-expanded');
            $('#worker_add_inv div.accordion-item-content').css('height', '0px');
          }
          var str = ''
          var selid = 0;
          var seltext = '';
          console.log(data.inv);
          for (var i = 0; i < data.inv.length; i++) {
            var sel = '';
            if(i==0){
              sel = 'selected';
              selid = data.inv[i].id;
              seltext = data.inv[i].text;
              }
            str += '<option value="'+data.inv[i].id+'" '+sel+'>'+data.inv[i].text+'</option>';
          }
          if(type == 2){
            $('#company_info_eq').html(str);
            $('#company_info_eq').val(selid);
            $('#company_info_eq_after').html(seltext);
          }else{
            $('#worker_info_eq').html(str);
            $('#worker_info_eq').val(selid);
            $('#worker_info_eq_after').html(seltext);
            $('#materials_table').DataTable().ajax.reload();
            $('#storage_in_use_table').DataTable().ajax.reload();
          }
        }
        else {
          myApp.addNotification({
              title: gettext('Error'),
              message: data.message,
          });
        }
      },
      error: function(data) {
        myApp.addNotification({
            title: gettext('Error'),
            message: gettext('Somethings went wrong:(.')
        });
        console.log(data.responseText);
      }
    });
  }else{
    myApp.addNotification({
       message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
   });
  }
}

function validateEmail(email) {
 var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
 return emailReg.test( email );
}

function ChangeEmailWorker(){
    var modal = myApp.modal({
      title:  gettext('Return amount to Storage'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Email')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="mail" type="email" value="'+$('#worker_info_email_title').val()+'" maxlength="30">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: gettext('UPDATE'),
          bold: true,
          onClick: function() {
            var mail = $(modal).find('input[name=mail]').val();
            if(validateEmail(mail)){
              datatable = {
                'token': user_token,
                'u_id': myApp.worker_id,
                'email': mail,
              }
              $.ajax({
                type: 'POST',
                url: '/api/email_emploues_change/',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    //console.log(data);
                    $('#worker_info_email_inp').val(data.mail);
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong email')
             });
            }
          }
        },
      ]
    });
}


//  staff/change_user_profile_info
function SaveWorkerInfo(){
  var first_name = $('#worker-info-form input[name=first_name]').val();
  if(first_name.length == 0){
     myApp.addNotification({
         message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('please anter first name')
     });
    return false;
  }
  var last_name = $('#worker-info-form input[name=last_name]').val();
  if(last_name.length == 0){
     myApp.addNotification({
         message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('please anter last name')
     });
    return false;
  }
  var phone = $('#worker-info-form input[name=phone]').val();
  if(phone.length == 0){
     myApp.addNotification({
         message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('please anter phone number')
     });
    return false;
  }
  var another_phone = $('#worker-info-form input[name=another_phone]').val();
  var date_of_birth = $('#worker-info-form input[name=date_of_birth]').val();
  datatable = {
    'token': user_token,
    'uid': myApp.worker_id,
    'first_name': first_name,
    'last_name': last_name,
    'phone': phone,
    'another_phone': another_phone,
    'date_of_birth': date_of_birth,
  }
  $.ajax({
    type: 'POST',
    url: '/api/staff/change_user_profile_info/',
    data: datatable,
    success: function(data) {
      console.log(data);
      if (!data.error) {
        console.log(data);
        myApp.addNotification({
            message: gettext('Change info successful')
        });
        $('#users_table').DataTable().ajax.reload();
      }
      else {
        myApp.addNotification({
            title: gettext('Error'),
            message: data.message,
        });
      }
    },
    error: function(data) {
      myApp.addNotification({
          title: gettext('Error'),
          message: gettext('Somethings went wrong:(.')
      });
      console.log(data.responseText);
    }
  });
}


function ChangeGroupWorker(id){
  myApp.confirm(gettext('Are you sure?'), gettext('Change group'), function () {
    var gid = $('#worker_info_choose_group').val()
    var group_name = $('#worker_info_choose_group')[0].selectedOptions[0].getAttribute('id');
      $.post('/api/staff/change_employee_group/', {
          'token': user_token,
          'gid': gid,
          'uid': myApp.worker_id,
          'group_name':group_name,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
            if(!data.error){
              $('#users_table').DataTable().ajax.reload();
              myApp.mainView.back();
            }else {
              myApp.addNotification({
                  title: gettext('Error'),
                  message: data.message,
              });
            }

          });
  });
}


function DeleteWorker(){
  myApp.confirm(gettext('Are you sure?'), gettext('Delete worker'), function () {
      $.post('/api/staff/delete/', {
          'token': user_token,
          'uid': myApp.worker_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
            if(!data.error){
              $('#users_table').DataTable().ajax.reload();
              myApp.mainView.back();
            }else {
              myApp.addNotification({
                  title: gettext('Error'),
                  message: data.message,
              });
            }

          });
  });
}


function ChangePasswordWorker(id){
  myApp.equipment_return_id = id;
    var modal = myApp.modal({
      title:  gettext('Change user password'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Password')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="password" type="password" maxlength="30" minlength="6">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: gettext('ok'),
          bold: true,
          onClick: function() {
            var password = $(modal).find('input[name=password]').val();
            if(password){
              datatable = {
                'token': user_token,
                'u_id': myApp.worker_id,
                'password': password,
              }
              $.ajax({
                type: 'POST',
                url: '/api/staff/password/',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    myApp.addNotification({
                        title: gettext('Success'),
                        message: data.message,
                    });
                    //$('#inventory_table').DataTable().ajax.reload();
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong password')
             });
            }
          }
        },
      ]
    });
}


function StoragePage(tasks_url){
  var $table = $('table#materials_table');
  $table.DataTable().destroy();
  table = $('#materials_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: tasks_url+'?for=table',
            type: "POST",
            data:{'token': user_token},
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": columns_materials,
    //responsive: true
    });
    $('#materials_history_btn').html('<i class="fa fa-book"></i> '+gettext('Materials history'));
}


var columns_materials = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title shot_text">'+row.item_name+'</div>';
      //r_str +='<div class="item-after">'+row.amount+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Quantity')+'</div><div class="col-40">'+row.amount;
        r_str += '</div><div class="col-15"><a href="#" class="btn-mini bg-green" onclick="AddStorageAmount('+row.id+');"><i class="fa fa-plus" aria-hidden="true"></i></a></div></div>';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Price')+'</div><div class="col-40">'+row.sell_price;
        r_str += '</div><div class="col-15"><a class="btn-mini bg-green" onclick="EditStoragePrice('+row.id+');"><i class="fa fa-pencil" aria-hidden="true"></i></a></div></div>';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('In Use (Quantity)')+'</div><div class="col-55">';
        r_str += '<a class="btn-mini bg-green" onclick="ShowInUse('+row.id+');">'+row.in_use+'</a></div></div>';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Sum $')+'</div><div class="col-55">'+(parseFloat(row.amount) * parseFloat(row.sell_price)).toFixed(2)+'</div></div>';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Total')+'</div><div class="col-55">'+(parseFloat(row.amount) + parseFloat(row.in_use))+'</div></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="EditStorageMaterial('+row.id+');" class="button button-raised button-fill"><i class="fa fa-pencil" aria-hidden="true"></i> '+gettext('Edit')+'</a></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="EquipStorageMaterial('+row.id+');" class="button button-raised button-fill bg-orange"><i class="fa fa-wrench" aria-hidden="true"></i> '+gettext('Equip')+'</a></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="DeleteStorageMaterial('+row.id+');" class="button button-raised button-fill bg-red"><i class="fa fa-trash" aria-hidden="true"></i> '+gettext('Delete')+'</a></div>';
      r_str +='</div></div></li>';
    return r_str;
  }
}];



function AddStorageAmount(id){
  myApp.storage_add_id = id;
    var modal = myApp.modal({
      title:  gettext('Add amount'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Amount')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="amount" type="text">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('CLOSE'),
        },
        {
          text: gettext('Add amount'),
          bold: true,
          onClick: function() {
            var amount = parseFloat($(modal).find('input[name=amount]').val());
            if(amount){
              datatable = {
                'token': user_token,
                'storage_item_id': myApp.storage_add_id,
                'amount': amount,
              }
              $$.ajax({
                type: 'POST',
                url: '/api/storage/add_amount',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    $('#materials_table').DataTable().ajax.reload();
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
             });
            }
          }
        },
      ]
    });
}


function EditStoragePrice(id){
  myApp.storage_add_id = id;
    var modal = myApp.modal({
      title:  gettext('Edit price'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner">'+
        '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Price')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="amount" type="text">'+
        '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('Close'),
        },
        {
          text: gettext('Change price'),
          bold: true,
          onClick: function() {
            var amount = parseFloat($(modal).find('input[name=amount]').val());
            if(amount){
              datatable = {
                'token': user_token,
                'item_id': myApp.storage_add_id,
                'price': amount,
              }
              $$.ajax({
                type: 'POST',
                url: '/api/storage/change_price',
                data: datatable,
                success: function(data) {
                  console.log(data);
                  if (!data.error) {
                    $('#materials_table').DataTable().ajax.reload();
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong price')
             });
            }
          }
        },
      ]
    });
}



function EditStorageMaterial(id){
  var row = $('table#materials_table tr[id='+id+']');
  var table = $('#materials_table').DataTable();
  var row_info = table.row( row ).data();
  myApp.Storege_item_id = row_info.id;
  myApp.Storege_item_name = row_info.item_name;
  myApp.Storege_item_amount = row_info.amount;
  myApp.Storege_item_sell_price = row_info.sell_price;
  myApp.mainView.loadPage(pages_url+"/pages/storage_edit.html");
}

function EquipStorageMaterial(id){
  var row = $('table#materials_table tr[id='+id+']');
  var table = $('#materials_table').DataTable();
  var row_info = table.row( row ).data();
  myApp.Storege_item_id = row_info.id;
  myApp.Storege_item_name = row_info.item_name;
  myApp.mainView.loadPage(pages_url+"/pages/storage_add_equip.html");
}


function DeleteStorageMaterial(id){
  myApp.equipment_id = id;
  myApp.confirm(gettext('Are you sure?'), gettext('Delete material'), function () {
      $.post('/api/storage/delete_storage_item', {
          'token': user_token,
          'id': myApp.equipment_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
              $('#materials_table').DataTable().ajax.reload();
          });
  });
}

function NewStorageMaterial(){
  myApp.mainView.loadPage(pages_url+"/pages/storage_new.html");
}

function ShowInUse(id){
  myApp.Storege_item_id = id;
  myApp.mainView.loadPage(pages_url+"/pages/storage_in_use.html");
}

var columns_in_use = [{
  'render': function (data, type, row){
    console.log(row);
    var r_str = '';
      r_str +='<a href="#" onclick="';
      if(!row.hidden){
        if(row.position == 'Director'){
          r_str +='myApp.mainView.loadPage(pages_url+\'/pages/company_info.html\');" class="item-link item-content row">';
        }else{
          r_str +='Usersload('+row.uid+')" class="item-link item-content row">';
        }
      }else{
        r_str +='" class="item-link item-content row" disabled>';
      }
      r_str +='<div class="col-70">'+row.username+'</div>';
      r_str +='<div class="col-25 t_r">'+row.amount+'</div>';
      r_str +='<div class="col-5"></div></a>';
    return r_str;
  }
}];




function refreshAvatar(){
  var degr = parseFloat($('#degr_avatar').val())+90;
  if(degr >= 360)
    degr = 0;
  $('#degr_avatar').val(degr);
  $('#div_container_avatar img').css({transform: 'rotate(' + degr + 'deg)'});

}

$('#avatar_img_inp').bind({
    change: function() {
      var degr = parseFloat($('#degr_avatar').val())+90;
      if(degr >= 360)
        degr = 0;
      $('#degr_avatar').val(degr);
      $('#div_container_avatar').html(null);
      displayFiles(this.files);
    }
  });

function displayFilesClear2() {
  $('#avatar_img_inp').val('');
  $('#div_container_avatar').html('');
  $('#file_lectura_avatar').val('');
  $$('#file_lectura_avatar').parents('div.item-inner').removeClass('not-empty-state');
}

function avatarscript(){
  //console.log('test img');
  var imgList = $('#div_container_avatar');
  var fileInput = $('#avatar_img_inp');
  // рендеринг изображения
  fileInput.bind({
      change: function() {
        var degr = parseFloat($('#degr_avatar').val())+90;
        if(degr >= 360)
          degr = 0;
        $('#degr_avatar').val(degr);
        $('#div_container_avatar').html(null);
        displayFiles(this.files);
      }
    });
  function displayFiles(files) {
    if(!files.length){
        $('#file_lectura_avatar').val('');
        $$('#file_lectura_avatar').parents('div.item-inner').removeClass('not-empty-state');
    }
      $.each(files, function(i, file) {
        if (!file.type.match(/image.*/)) {
          // Отсеиваем не картинки
          return true;
        }
        $('#degr_avatar').val('0');
        // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
        // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
        var li = $('<li/>').appendTo(imgList);
        $('<div/>').text(file.name).appendTo(li);
        $('#file_lectura_avatar').val(file.name);
        if(file.name){
          $$('#file_lectura_avatar').parents('div.item-inner').addClass('not-empty-state');  }
        //var img = $('<img/>'+'\r').appendTo(li);
        $('<a href="#div_container_avatar" onclick="refreshAvatar()"><i class="fa fa-refresh" aria-hidden="true"></i></a>').appendTo(li);
        var img = $('<img width="250px" height="250px" style="border: 1px dashed black; margin: 5px; vertical-align:middle"/>'+'\r').appendTo(li);
        $('<a href="#div_container_avatar" onclick="displayFilesClear2()"/>').text('X').appendTo(li);
        //if ($('#container li').length>=4)
        li.get(0).file = file;

        // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
        // инфу обо всех файлах
        var reader = new FileReader();
        reader.onload = (function(aImg) {
          return function(e) {
            aImg.attr('src', e.target.result);
            aImg.attr('height', 150);
            aImg.attr('width', 150);
            /* ... обновляем инфу о выбранных файлах ... */
          };
        })(img);

        reader.readAsDataURL(file);
      });
      }
}

function SaveAvatar(type){
  if(type == 2){
    var vars= new FormData($('#companyavatarform')[0]);
  }else{
    var vars= new FormData($('#avatarform')[0]);
  }
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/uavatar/';
    console.log(vars);
  if((type == 2 && $('#company_avatar_img_inp').val() != '') ||(type != 2 && $('#avatar_img_inp').val() != '')){
    myApp.showIndicator();
    $$.ajax({
     type: 'POST',
     url: tasks_url,
     data: vars,
     success: function(data)
     {
       console.log(data);
       data = JSON.parse(data);
       myApp.hideIndicator();
       if(!data.error){
         if(type == 2){
           var img = $('#companyavatarform img').clone().addClass('t_c profile-user-img img-responsive img-circle').attr('style','transform: rotate('+$('#degr_company_avatar').val()+'deg);').removeAttr('width').removeAttr('height');
           $('#company-info-name').html(img);
           img = $('#companyavatarform img').clone().addClass('t_c profile-user-img img-responsive img-circle').attr('style','transform: rotate('+$('#degr_company_avatar').val()+'deg);').attr('width', '90').attr('height', '90');
           $('#avatar_menu_div').html(img);

         }else{
           var img = $('#avatarform img').clone().addClass('t_c profile-user-img img-responsive img-circle').attr('style','transform: rotate('+$('#degr_avatar').val()+'deg); margin-left: 15px;');
           $('#worker-info-name').html(img);
           img = $('#avatarform img').clone().addClass('t_c profile-user-img img-responsive img-circle').attr('style','transform: rotate('+$('#degr_avatar').val()+'deg);').attr('width', '90').attr('height', '90');
           $('#avatar_menu_div').html(img);

         }
         myApp.addNotification({
             message: '<p style="color:green;">'+data.message+'</p>'
         });
       }else{
         myApp.addNotification({
             message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
         });
       }
     },
     error: function(e)
     {
       myApp.hideIndicator();
        console.log(e);
        myApp.addNotification({
            message: '<p style="color:red;"><b>'+('Error')+'<b></p>'+gettext('Please select another image')
        });
        $('#imagesform button#btn_img_save').attr('disabled', false);
     }
 });
  }else{
    $('#imagesform button#btn_img_save').attr('disabled', false);
    if(type == 2){
      myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please select images before saving')
      });
    }else{
      myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please save images before saving')
      });
    }
  }
}

function MenuOpen(){
  if($('#menu_settings').hasClass('hiddend')){
    $('#menu_settings').removeClass('hiddend')
  }else{
    $('#menu_settings').addClass('hiddend')
  }
}




































function BuldCompanyInfoPage(data) {
  $$('#company_info_page').html(gettext('Company info'));
  var img_str = '<img class="t_c profile-user-img img-responsive img-circle" ';
  img_str += 'src="'+data.user.user_url+'" alt="User profile picture" style="transform: rotate('+data.user.user_degr+'deg);">';
  $('#company-info-name').html(img_str);
  var list_str ='<div class="row"><div class="col-30">'+gettext('Plan')+'</div><div class="col-70 t_r"> '+data.user_plan.plan.name+'</div></div>'
  list_str += '<h3 class="t_c">'+gettext('Your Plan')+'</h3><hr>'
  list_str += '<div class="row"><div class="t_l"><i class="fa fa-calendar-minus-o" aria-hidden="true"></i>'+gettext('Expires')+':</div><div class="t_r">'+data.user_plan.end_date+'</div></div>';
  list_str += '<hr><h3 class="t_l"><i class="fa fa-list" aria-hidden="true"></i> '+gettext('Options')+'</h3>'
  if(data.user_plan.plan.options){
    for (var i = 0; i < data.user_plan.plan.options.length; i++) {
      list_str += '<div class="row opt-list">'+gettext(data.user_plan.plan.options[i].code_name)+'<div class="t_r">'+data.user_plan.plan.options[i].amount+'</div></div>';
    }
  }
  list_str += '<hr><h3><i class="fa fa-usd" aria-hidden="true"></i> '+gettext('Price')+'</h3>';
  list_str += '<div class="row"> $  '+data.user_plan.plan.price+'</div><hr>';
  list_str += '<a href="#" onclick="Update_plan()" id="company_info_change_plan_btn" class="button button-fill bg-orange">'+gettext('Renew/Upgrade Plan')+'</a>'
  $('#company-info-list').html(list_str);
  if(data.me){
    console.log('me');
    $('#worker_info_change_group_btn').attr('disabled', 'disabled');
    avatarscript();
    $('#avatarform').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
    $('#avatarform').append('<input type=\'hidden\' name=\'uid\' value=\''+data.worker_id+'\'>');
    $('#card_avatar_user').removeClass('hidden')
  }else{
    $('#card_avatar_user').remove()
  }

  myApp.user_edit_tax = data.edit_tax;
  myApp.user_delete_tax = data.delete_tax;

  myApp.user_position = data.user.user_profile;
  myApp.user_id = data.user.user_id;
  myApp.worker_id = data.user.user_id;
  var str = ''
  var selid = 0;
  var seltext = '';
  for (var i = 0; i < data.inventory.length; i++) {
    var sel = '';
    if(i==0){
      sel = 'selected';
      selid = data.inventory[i].id;
      seltext = data.inventory[i].text;
      }
    str += '<option value="'+data.inventory[i].id+'" '+sel+'>'+data.inventory[i].text+'</option>';
  }
  $('#company_info_eq').html(str);
  $('#company_info_eq').val(selid);
  $('#company_info_eq_after').html(seltext);//*/

  $('#company_info_basic_info_title').html(gettext('Edit information'));
  $('#company_info_first_name_title').html(gettext('First name'));
  $('#company_info_last_name_title').html(gettext('Last name'));
  $('#company_info_phone_title').html(gettext('Phone'));
  $('#company_info_company_name_title').html(gettext('Company '));
  $('#company_info_email_title').html(gettext('E-mail'));
  $('#company_info_note_inv_title').html(gettext('Description'));
  $('#company_info_address_title').html(gettext('Address'));
  $('#company_info_city_title').html(gettext('City'));
  $('#company_info_zip_code_title').html(gettext('ZIP'));
  $('#company_info_address2_title').html(gettext('Address')+' 2');
  $('#company_info_state_title').html(gettext('State'));
  $('#company_info_service_agreement_title').html(gettext('Service Agreement'));
  $('#btn_company_info_save').html(gettext('Update'));
  $('#company_info_tax_title').html(gettext('Tax'));
  $('#company_info_add_tax_href_title').html('<i class="btn fa fa-gear" style="margin-right:5px;"></i> '+gettext('Add Tax'));
  $('#company_info_add_eq_amount_title').html(gettext('Quantity'))
  $('#company_info_add_eq_btn').html(gettext('add'))
  $('#company_info_change_logo').html(gettext('Company logo'))
  $('#company_logo_upload_lable').html(gettext('Attach image'))
  $('#btn_img_save_logo').html(gettext('Update'))
  $('#used_company_logo_title').html(gettext('Used logo'))
  $('#company_info_change_avatar').html(gettext('Avatar'))
  $('#company_avatar_upload_lable').html(gettext('Attach image'))
  $('#btn_img_save_company_avatart').html(gettext('Update'))
  $('#company_info_personal_area').html(gettext('Personal area'))
  $('#company_info_change_email_btn').html(gettext('Change email'))
  $('#company_info_change_pass_btn').html(gettext('Change password'))
  $('#company-info-form input[name=first_name]').val(data.company.first_name);
  $('#company-info-form input[name=last_name]').val(data.company.last_name);
  $('#company-info-form input[name=phone]').val(data.company.phone);
  var is_storage = 0;
  if(data.user.is_storage){ is_storage = 1;}
  $('#company_info_inv_stor_use').val(is_storage);
  $('#company-info-form input[name=company_name]').val(data.company.company_name);
  $('#company-info-form input[name=email]').val(data.company.worked_email);
  $('#company-info-form textarea[name=contact]').val(data.company.contact);
  $('#company-info-form input[name=address]').val(data.company.address);
  $('#company-info-form input[name=city]').val(data.company.city);
  $('#company-info-form input[name=zip_code]').val(data.company.zip_code);
  $('#company-info-form input[name=address2]').val(data.company.address2);
  $('#company-info-form input[name=state]').val(data.company.state);
  $('#company-info-form textarea[name=offer]').val(data.company.offer);
  autosize(document.querySelectorAll('textarea'));
  $('#company-info-form').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  jQuery.validator.addMethod("usaPostal", function(postal, element) {
      if(!postal.match(/^(\d{4}|\d{5})$/)){
        $('#company_info_zip_code_title').html('ZIP <div class="text-red">The value is not valid USA postal code.</div>');
      }else{
        $('#company_info_zip_code_title').html('ZIP');
      }
      return this.optional(element) ||
      postal.match(/^(\d{4}|\d{5})$/);
  }, "The value is not valid USA postal code.");
  $('form#company-info-form').validate({
      rules: {
        zip_code:{
          usaPostal: true,
        },
        email:{
          required: true,
        },
      },
      submitHandler: function(form){
             $$.ajax({
               type: 'POST',
               url: '/api/update_company_info',
               data: $(form).serialize(),
               success: function(data) {
                 console.log(data);
                 if (!data.error) {
                   myApp.addNotification({
                       message: gettext('Changes saved'),
                   });
                 }
                 else {
                   myApp.addNotification({
                       title: gettext('Error'),
                       message: data.message,
                   });
                 }
               },
               error: function(data) {
                 myApp.addNotification({
                     title: gettext('Error'),
                     message: gettext('Somethings went wrong:(.')
                 });
                 console.log(data.responseText);
               }
             });
        }
  });
  $('#company_add_inv_title').html('<i class="fa fa-plus-square"></i> '+gettext('Add Inventory'));
  $('#company_info_eq_stor_title').html(gettext('Add amount from Storage'));
  $('#company_info_eq_title').html(gettext('Inventory:'));
  $('#company_add_eq_amount_title').html(gettext('Quantity'));
  $('#company_add_eq_btn').html(gettext('add'));
  $('#company_info_change_group_title').html(gettext('Change group'));
  $('#company_info_choose_group_title').html(gettext('Choose group'));
  $('#company_info_change_group_btn').html(gettext('Change group'));
  $('#company_info_change_password_btn').html(gettext('Change password'));
  $('#company_info_inventory_title').html(gettext('Inventory'));
  /*if(!data.change_employee){
    $('#worker-info-form input[name=first_name]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=last_name]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=phone]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=another_phone]').attr('readonly', 'readonly');
    $('#worker-info-form input[name=email]').attr('readonly', 'readonly');
    $('#worker_info_change_email').attr('disabled', 'disabled');
    $('#worker_info_save_btn').attr('disabled', 'disabled');
    $('#worker_info_change_group_btn').attr('disabled', 'disabled')
    $('#worker_info_change_password_btn').attr('disabled', 'disabled')
  }*/
  if(!data.add_equipments){
      $('#company_info_add_inv')[0].remove();
  }
  myApp.worker_info_change_equipments = data.change_equipments;
  /*var selid = -1;
  var seltext = '';
  var str = '';
  for (var i=0; i< data.val_grp.length; i++){
    var sel = '';
    if(i==0){
      sel = 'selected';
      selid = data.val_grp[i].id;
      seltext = gettext(data.val_grp[i].text);
      }
    str += '<option id="'+data.val_grp[i].text+'" value="'+data.val_grp[i].id+'" '+sel+'>'+gettext(data.val_grp[i].text)+'</option>';
  }*/
  /*$('#worker_info_choose_group').html(str);
  $('#worker_info_choose_group').val(selid);
  $('#worker_info_choose_group_after').html(seltext);*/
  var $table = $('table#company_tax_table');
  $table.DataTable().destroy();
  table = $('#company_tax_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: domen + '/api/taxes.json?for=table',
            type: "POST",
            data: {'token': user_token},
            complete: function(data) {
              myApp.hideIndicator();
            },
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": columns_tax,
    //responsive: true
  } );
  //inventory
  var $table = $('table#company_info_inventory_table');
  $table.DataTable().destroy();
  table = $('#company_info_inventory_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: domen + '/api/item.json',
            type: "POST",
            data: {'token': user_token, 'uid': myApp.user_id, 'for': 'list'},
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": columns_inventory_company,
    //responsive: true
  } );
  var imgstr = '<img src="'+data.company.logo+'" width="180" height="180">'
  $('#used_company_logo').html(imgstr);
  $('#companylogoform').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#companyavatarform').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#companyavatarform').append('<input type=\'hidden\' name=\'uid\' value=\''+data.user.user_id+'\'>');
  var imgList = $('#div_container_logo');
  var fileInput = $('#company_logo_img_inp');
  var fileInput2 = $('#company_avatar_img_inp');
  // рендеринг изображения
  fileInput.bind({
      change: function() {
        $('#div_container3').html(null);
        displayFiles2(this.files, '3');
      }
  });
  fileInput2.bind({
      change: function() {
        $('#div_container4').html(null);
        $('#degr_company_avatar').val(0);
        displayFiles2(this.files, '4');
      }
  });

  $('#company_info_conf_company_mail').val(data.user.user_email)
  //console.log(data.user.user_email);

  //search workers task
  //OpenWorkerTasksDateRanges(data, '', '', '', [data.worker_id], '');
  $('#worker-search-task').validate({
      submitHandler: function(form){
        //console.log('test');
          var startTime = $('#worker_serch_task_start_date').val();
          var endTime = $('#worker_serch_task_end_time').val();
          var closeTime = $('#worker_serch_task_close_time').val();
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
          var recipients = $('#worker_serch_task_recipients').val();
          recipients.push(myApp.worker_id);
          var status = $('#worker_serch_task_status_ids').val();
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
          if($('#worker_serch_task_ignore_start:checked').length){
            datatable['ignore-start'] = 'on'; }
          if($('#worker_serch_task_ignore_end:checked').length){
            datatable['ignore-end'] = 'on'; }
          if($('#worker_serch_task_ignore_close:checked').length){
            datatable['ignore-close'] = 'on'; }
          if($('#worker_serch_task_name').val())
          datatable['name'] = $('#worker_serch_task_name').val();
          console.log(datatable);
        /**/  $$.post(domen + '/api/search_tasks.json',  datatable, function(data){
            console.log('data test');
            console.log(data);
          });//*/
          var $table = $('table#worker_tasks');
          $table.DataTable().destroy();
          table = $('#worker_tasks').DataTable( {
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
                    complete: function(data) {
                      console.log(data);
                    },
            },
            "columns": columns_tasks,
            //responsive: true
          } );
        return false;
      }
  });
}

var columns_tax = [{
  'render': function (data, type, row){
    console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title shot_text">'+row.name+'</div>';
      r_str +='<div class="item-after">'+row.value+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Tax Rate')+'(%)</div><div class="col-40">'+row.value+'</div></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="EditTax('+row.id+');" class="button button-raised button-fill"><i class="fa fa-pencil" aria-hidden="true"></i> '+gettext('Edit')+'</a></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="DeleteTax('+row.id+');" class="button button-raised button-fill bg-red"><i class="fa fa-trash" aria-hidden="true"></i> '+gettext('Delete')+'</a></div>';
      r_str +='</div></div></li>';
    return r_str;
  }
}];


function EditTax(id){
  myApp.taxes_id = id;
  var row = $('table#company_tax_table tr[id='+id+']');
  var table = $('#company_tax_table').DataTable();
  var row_info = table.row( row ).data();
  var name = row_info.name;
  var tax = row_info.value;
    var modal = myApp.modal({
      title:  gettext('Edit Tax'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner not-empty-state">'+
        '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Tax Name')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="name" type="text" value="'+name+'">'+
        '</div></div></div></li>'+
        '<li><div class="item-content"><div class="item-inner not-empty-state">'+
          '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Value')+' (%)</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="value" type="text" value="'+tax+'">'+
          '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('Close'),
        },
        {
          text: gettext('Save'),
          bold: true,
          onClick: function() {
            var name = $(modal).find('input[name=name]').val();
            var value = parseFloat($(modal).find('input[name=value]').val());
            if(!value){
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong value')
             });
            }
            if(name.length < 2){
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong name')
             });
            }
            if(name.length > 1 && value){
              datatable = {
                'token': user_token,
                'iid': myApp.taxes_id,
                'name': name,
                'value': value,
              }
              $$.ajax({
                type: 'POST',
                url: '/api/update_tax',
                data: datatable,
                success: function(data) {
                  //console.log(data);
                  if (!data.error) {
                    $('#company_tax_table').DataTable().ajax.reload();
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }
          }
        },
      ]
    });
}

function DeleteTax(id){
  myApp.tax_id = id;
  myApp.confirm(gettext('Are you sure?'), gettext('Delete tax'), function () {
      $.post('/api/delete_tax', {
          'token': user_token,
          'iid': myApp.tax_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
              $('#company_tax_table').DataTable().ajax.reload();
          });
  });
}


function NewTax(){
  var modal = myApp.modal({
      title:  gettext('Add Tax'),
      text: '<div class="list-block inputs-list"><ul><li>'+
        '<div class="item-content"><div class="item-inner not-empty-state">'+
        '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Tax Name')+'</div>'+
        '<div class="item-input item-input-field">'+
        '<input name="name" type="text">'+
        '</div></div></div></li>'+
        '<li><div class="item-content"><div class="item-inner not-empty-state">'+
          '<div class="item-title floating-label" id="add_storage_amount_title">'+gettext('Taxe Rate')+', %</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="value" type="text">'+
          '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('Close'),
        },
        {
          text: gettext('Save'),
          bold: true,
          onClick: function() {
            var name = $(modal).find('input[name=name]').val();
            var value = parseFloat($(modal).find('input[name=value]').val());
            if(!value){
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong value')
             });
            }
            if(name.length < 2){
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong name')
             });
            }
            if(name.length > 1 && value){
              datatable = {
                'token': user_token,
                'name': name,
                'value': value,
              }
              $$.ajax({
                type: 'POST',
                url: '/api/create_tax',
                data: datatable,
                success: function(data) {
                  //console.log(data);
                  if (!data.error) {
                    $('#company_tax_table').DataTable().ajax.reload();
                  }
                  else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }
          }
        },
      ]
    });
}



var columns_inventory_company = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title">'+row.item_name+'</div>';
      r_str +='<div class="item-after">'+row.amount+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('In storage')+'</div>'+row.in_storage+'</div>';
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount');
      if(myApp.worker_info_change_equipments){
        r_str += '<a href="#return_to_stor" onclick="ReturnAmount('+row.id+', 2)" data-toggle="modal" class="padingleft"><i class="fa fa-minus-circle"></i></a>'
        r_str +=  '</div><a href="#return_to_stor" onclick="AddAmount('+row.id+', 2)" data-toggle="modal" class=""><i class="fa fa-plus-circle"></i></a>';
      }else{ r_str +=  '</div>'; }
      r_str += row.amount+'</div>';
      if(myApp.worker_info_change_equipments){
        r_str += '<div class="row col-100"><div class="l_tc" style="line-height:33px;">'+gettext('Return all amount equip')+'</div>';
        r_str += '<a href="#return_to_stor" onclick="RetarnInventory('+row.id+', 2)" data-toggle="modal" class="button button-raised button-fill btn-round bg-orange"><i class="fa fa-reply" aria-hidden="true" style="font-size: 20px; padding-top: 7px;"></i></a></div>';
        r_str += '<div class="row col-100"><div class="l_tc" style="line-height:33px;">'+gettext('Cancel employee equipment')+'</div>';
        r_str += '<a href="#return_to_stor" onclick="CanselInventory('+row.id+', 2)" data-toggle="modal" class="button button-raised button-fill btn-round bg-red"><i class="fa fa-window-minimize" aria-hidden="true" style="font-size: 16px;"></i></a>'+'</div>'
      }
      r_str += '</div><div class="col-5"></div></div>'

      r_str +='</div></div></li>';
    return r_str;
  }
}];



function SaveLogo(){
  var vars= new FormData($('#companylogoform')[0]);
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/company_logo';
    console.log(vars);
  if($('#company_logo_img_inp').val() != ''){
    myApp.showIndicator();
    $$.ajax({
     type: 'POST',
     url: tasks_url,
     data: vars,
     success: function(data)
     {
       console.log(data);
       data = JSON.parse(data);
       myApp.hideIndicator();
       if(!data.error){
         var img = $('#companylogoform img').clone().attr('width', "180").attr('height', "180").attr('style','transform: rotate('+$('#degr_logo').val()+'deg); margin-left: 15px;');
         $('#used_company_logo').html(img);
         myApp.addNotification({
             message: '<p style="color:green;">'+data.message+'</p>'
         });
       }else{
         myApp.addNotification({
             message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
         });
       }
     },
     error: function(e)
     {
       myApp.hideIndicator();
        console.log(e);
        myApp.addNotification({
            message: '<p style="color:red;"><b>'+('Error')+'<b></p>'+gettext('Please select another image')
        });
     }
 });
  }else{
    myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please select images before saving')
    });
  }
}



function displayFilesClear3() {
  $('#company_logo_img_inp').val('');
  $('#div_container3').html('');
  $('#file_lectura_logo').val('');
  $$('#file_lectura_logo').parents('div.item-inner').removeClass('not-empty-state');

}
function displayFilesClear4() {
$('#company_avatar_img_inp').val('');
$('#div_container4').html('');
}
function refreshAvatar4(){
var degr = parseFloat($('#degr_company_avatar').val())+90;
if(degr >= 360)
  degr = 0;
$('#degr_company_avatar').val(degr);
$('#div_container4 img').css({transform: 'rotate(' + degr + 'deg)'});
}
function displayFiles2(files, v, container) {
  if(!files.length){
    if(v == '3'){
      $('#file_lectura_logo').val('');
      $$('#file_lectura_logo').parents('div.item-inner').removeClass('not-empty-state');
    }else{
      $('#file_lectura_company_avatar').val('');
      $$('#file_lectura_company_avatar').parents('div.item-inner').removeClass('not-empty-state');
    }
  }
  $.each(files, function(i, file) {
    if (!file.type.match(/image.*/)) {
      // Отсеиваем не картинки
      return true;
    }
    // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
    // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
    var li = $('<li/>').appendTo('#div_container'+v);
    $('<div/>').text(file.name).appendTo(li);
    if(v == '3'){
      $('#file_lectura_logo').val(file.name);
      if(file.name){
        $$('#file_lectura_logo').parents('div.item-inner').addClass('not-empty-state');  }
    }else{
      $('#file_lectura_company_avatar').val(file.name);
      if(file.name){
        $$('#file_lectura_company_avatar').parents('div.item-inner').addClass('not-empty-state');  }
    }
    if(v=='4'){
      $('<a href="#images" onclick="refreshAvatar'+v+'()"><i class="fa fa-refresh" aria-hidden="true"></i></a>').appendTo(li);
    }
    var img = $('<img width="250px" height="250px" style="border: 1px dashed black; margin: 5px;"/>'+'\r').appendTo(li);
    $('<a href="#images" onclick="displayFilesClear'+v+'()"/>').text('X').appendTo(li);
    //if ($('#container li').length>=4)
    li.get(0).file = file;

    // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
    // инфу обо всех файлах
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.attr('src', e.target.result);
        aImg.attr('width', 250);
        /* ... обновляем инфу о выбранных файлах ... */
      };
    })(img);

    reader.readAsDataURL(file);
  });
};


function ChangeCompanyEmail(){
    var modal = myApp.modal({
      title:  gettext('Change email'),
      text: '<div class="list-block inputs-list"><ul><li>'+
          '<div class="item-content"><div class="item-inner">'+
          '<div class="item-title floating-label">'+gettext('New Email')+'</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="email" type="email" maxlength="30">'+
        '</div></div></div></li><li>'+
          '<div class="item-content"><div class="item-inner">'+
          '<div class="item-title floating-label">'+gettext('Confirm password')+'</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="password" type="password" minlength="6">'+
          '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('Close'),
        },
        {
          text: gettext('Change email'),
          bold: true,
          onClick: function() {
            var email = $(modal).find('input[name=email]').val();
            var password = $(modal).find('input[name=password]').val();
            if(isEmail(email) && email.length < 31){
              datatable = {
                'token': user_token,
                'email': email,
                'pass': password,
              }
              myApp.showIndicator();
              $$.ajax({
                type: 'POST',
                url: '/api/company_em_change',
                data: datatable,
                success: function(data) {
                  myApp.hideIndicator();
                  console.log(data);
                  data=JSON.parse(data);
                  if (!data.error) {
                    myApp.addNotification({
                        message: data.message,
                    });
                  } else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.hideIndicator();
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong email')
              });
            }
          }
        },
      ]
    });
}


function ChangeCompanyPassword(){
    var modal = myApp.modal({
      title:  gettext('Change password'),
      text: '<div class="list-block inputs-list"><ul><li>'+
          '<div class="item-content"><div class="item-inner">'+
          '<div class="item-title floating-label">'+gettext('Old password')+'</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="old_password" type="password">'+
        '</div></div></div></li><li>'+
          '<div class="item-content"><div class="item-inner">'+
          '<div class="item-title floating-label">'+gettext('Password')+'</div>'+
          '<div class="item-input item-input-field">'+
          '<input name="id_password" type="password" minlength="6">'+
          '</div></div></div></li><li>'+
            '<div class="item-content"><div class="item-inner">'+
            '<div class="item-title floating-label">'+gettext('Repeat password')+'</div>'+
            '<div class="item-input item-input-field">'+
            '<input name="id_password2" type="password" minlength="6">'+
            '</div></div></div></li>'+
        '</ul></div>',
      buttons: [
        {
          text: gettext('Close'),
        },
        {
          text: gettext('Change password'),
          bold: true,
          onClick: function() {
            var od_password = $(modal).find('input[name=old_password]').val();
            var password = $(modal).find('input[name=id_password]').val();
            var password2 = $(modal).find('input[name=id_password2]').val();

            if(password.length > 5){
              datatable = {
                'token': user_token,
                'old_password': od_password,
                'id_password': password,
                'id_password2': password2,
              }
              myApp.showIndicator();
              $$.ajax({
                type: 'POST',
                url: '/api/change_company_pass',
                data: datatable,
                success: function(data) {
                  myApp.hideIndicator();
                  console.log(data);
                  data=JSON.parse(data);
                  if (!data.error) {
                    myApp.addNotification({
                        message: data.message,
                    });
                  } else {
                    myApp.addNotification({
                        title: gettext('Error'),
                        message: data.message,
                    });
                  }
                },
                error: function(data) {
                  myApp.hideIndicator();
                  myApp.addNotification({
                      title: gettext('Error'),
                      message: gettext('Somethings went wrong:(.')
                  });
                  console.log(data.responseText);
                }
              });
            }else{
              myApp.addNotification({
                 message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Password must have more 5 symbol.')
              });
            }
          }
        },
      ]
    });
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function LogOut(){
  myApp.confirm(gettext('Are you sure?'), gettext('Exit'), function () {
      $$.get('/api/logout/', function(data){});
      localStorage.removeItem("token");
      window.location = pages_url.split("static")[0]+"mobile";
  });
}

function Update_plan(){
  myApp.mainView.loadPage(pages_url+"/pages/payment_plan.html");
}

function ItemsPage(tasks_url){
  var $table = $('table#works_table');
  $table.DataTable().destroy();
  table = $('#works_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 5,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token, 'for': 'table', 'api': 'table'},
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": columns_items,
    //responsive: true
    });
    $('#materials_history_btn').html('<i class="fa fa-book"></i> '+gettext('Materials history'));
}

var columns_items = [{
  'render': function (data, type, row){
    console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title shot_text" style="width:250px">'+row.name+'</div>';
      //r_str +='<div class="item-after">'+row.amount+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Rate $')+'</div><div class="col-55">'+parseFloat(row.rate).toFixed(2)+'</div></div>';
      r_str += '<div class="row"><div class="l_tc col-45">'+gettext('Description')+':</div><div class="col-55"></div></div>';
      r_str += '<div class="row">'+row.description+'</div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="EditItemsWorks('+row.id+');" class="button button-raised button-fill"><i class="fa fa-pencil" aria-hidden="true"></i> '+gettext('Edit')+'</a></div>';
      r_str += '<div class="buttons-row col-100" style="padding-top:20px"><a href="#" onclick="DeleteItemsWorks('+row.id+');" class="button button-raised button-fill bg-red"><i class="fa fa-trash" aria-hidden="true"></i> '+gettext('Delete')+'</a></div>';
      r_str +='</div></div></li>';
    return r_str;
  }
}];


function EditItemsWorks(id){
  var row = $('table#works_table tr[id='+id+']');
  var table = $('#works_table').DataTable();
  var row_info = table.row( row ).data();
  myApp.Item_id = row_info.id;
  myApp.Item_name = row_info.name;
  myApp.Item_rate = row_info.rate;
  myApp.Item_description = row_info.description;
  myApp.mainView.loadPage(pages_url+"/pages/items_edit.html");
}

function DeleteItemsWorks(id){
  myApp.Item_id = id;
  myApp.confirm(gettext('Are you sure?'), gettext('Delete item'), function () {
      $.post('/api/item/delete', {
          'token': user_token,
          'iid': myApp.Item_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
              $('#works_table').DataTable().ajax.reload();
          });
  });
}

function NewItemWork(){
  myApp.mainView.loadPage(pages_url+"/pages/items_new.html");
}

function DashboardData(datajs){
  $('#dashboard_payments_chart_title').html(gettext('Payments'));
  $('#dashboard_invoices_bux_chart_title').html(gettext('Invoices')+' $');
  $('#dashboard_invoices_bux_chart_title_after').html(datajs.data.month);
  $('#dashboard_invoices_chart_title').html(gettext('Invoices'));
  $('#dashboard_invoices_chart_after').html(datajs.data.month);

  $('#dashboard_new_customer_title').html(gettext('New customers'))
  $('#dashboard_new_customer').html(datajs.data.top_four.new_clients)
  $('#dashboard_new_customer_end').addClass(datajs.data.top_four.type_clyent)
  if(datajs.data.top_four.percent_clients_hide){
    $('#dashboard_new_customer_end').html('');
  }else{
    $('#dashboard_new_customer_end').html('<i class="fa fa-sort-asc" aria-hidden="true"></i> <span>'+parseFloat(datajs.data.top_four.percent_clients).toFixed(2)+'% '+gettext('from last 30 days'))
  }

  $('#dashboard_new_invoices_title').html(gettext('New invoices')+' $')
  $('#dashboard_new_invoices').html('<i class="fa fa-usd" aria-hidden="true"></i> '+datajs.data.top_four.new_invoices)
  $('#dashboard_new_invoices_end').addClass(datajs.data.top_four.type_invoice)
  if(datajs.data.top_four.percent_invoice_hide){
    $('#dashboard_new_invoices_end').html('');
  }else{
    $('#dashboard_new_invoices_end').html('<i class="fa fa-sort-asc" aria-hidden="true"></i> <span>'+parseFloat(datajs.data.top_four.percent_invoice).toFixed(2)+'% '+gettext('from last 30 days'))
  }

  $('#dashboard_closed_tasks_title').html(gettext('Closed tasks'))
  $('#dashboard_closed_tasks').html(datajs.data.top_four.close_tasks)
  $('#dashboard_closed_tasks_end').addClass(datajs.data.top_four.type_close_tasks)
  if(datajs.data.top_four.percent_close_tasks_hide){
    $('#dashboard_closed_tasks_end').html('');
  }else{
    $('#dashboard_closed_tasks_end').html('<i class="fa fa-sort-asc" aria-hidden="true"></i> <span>'+parseFloat(datajs.data.top_four.percent_close_tasks).toFixed(2)+'% '+gettext('from last 30 days'))
  }

  $('#dashboard_payments_t4_title').html(gettext('Payments'))
  $('#dashboard_payments_t4').html(datajs.data.top_four.total_payments)
  $('#dashboard_payments_t4_end').addClass(datajs.data.top_four.type_payments)
  if(datajs.data.top_four.percent_payments_hide){
    $('#dashboard_payments_t4_end').html('');
  }else{
    $('#dashboard_payments_t4_end').html('<i class="fa fa-sort-asc" aria-hidden="true"></i> <span>'+parseFloat(datajs.data.top_four.percent_payments).toFixed(2)+'% '+gettext('from last 30 days'))
  }

  $('#payments_dashboard_table_head').html(gettext('Last Payments'))
  $('#invoices_dashboard_table_head').html(gettext('Last invoices'))

  $.post('/api/chart/ch',{'token': user_token}, function(data){
    //console.log(data);
    // AREA CHART
    var area = new Morris.Area({
      element: 'revenue-chart',
      resize: true,
      data: eval(data),
      xkey: 'period',
      ykeys: ['sum'],
      labels: ['Payments'],
      lineColors: ['#fff'],
      hideHover: 'auto'
    });
  });

  //BAR CHART
$.post('/api/chart/ch2/',{'token': user_token}, function(data){
  //console.log(eval(data));
   var bar = new Morris.Bar({
     element: 'payments-bar',
     resize: true,
     data: eval(data),
     barColors: ['#fff'],
     xkey: 'period',
     ykeys: ['sum'],
     labels: [gettext('Invoices')+' $'],
     hideHover: 'auto'
   });
 });

  //BAR CHART
$.post('/api/chart/ch3/',{'token': user_token}, function(data){
   var bar = new Morris.Bar({
     element: 'invoices-bar',
     resize: true,
     data: eval(data),
     barColors: ['#fff'],
     xkey: 'period',
     ykeys: ['sum'],
     labels: [gettext('Invoices')],
     hideHover: 'auto'
   });
 });

 var $table = $('table#payments_dashboard_table');
 $table.DataTable().destroy();
 table = $('#payments_dashboard_table').DataTable( {
   paging: false,
   searching: false,
   lengthChange: false,
   info: false,
   destroy: true,
   ordering: false,
   iDisplayLength: 5,
   "ajax": {
           url: "/api/payments.json?limit=5",
           type: "POST",
           data: {'token': user_token},
       },
   "columns": [{
     'render': function (data, type, row){
       //console.log(row);
       var r_str = '';
         r_str +='<li class="swipeout">';
         r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
         r_str += '<div class="item-inner"><div class="item-title-row">';
         r_str += '<div class="item-title">'+gettext('Invoice #')+row.invoice_number+'</div>';
         r_str += '<div class="item-after">'+row.date+'</div>';
         r_str += '</div><div class="item-subtitle">';
         r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+' $</div>'+row.payment+'</div>';
         r_str += '</div><div class="item-text n_tc">';
         r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Customer')+'</div>'+row.client+'</div>';
         if(row.refund){
           r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('refunded')+"</span></div>";
         }else{
           r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('paid')+"</span></div>";
         }
         r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Method')+'</div>'+row.payment_method+'</div>';
         r_str += '<div class="row col-100" id="customers_inv_title"><div class="l_tc">'+gettext('Accepted')+'</div>'+row.accepted_by+'</div>';
         r_str += '</div></div></a></div>';
         r_str += '<div class="swipeout-actions-left">';
        if(row.is_active){
           r_str += '<a href="#" onclick="PopupInvPay('+row.iid+', 3); AddPayments(3);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
         }else{
           r_str += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
         }
         r_str += '</div><div class="swipeout-actions-right">';
         r_str += '<a href="#" onclick="InvoceIdload('+row.invoice_number+')" class="bg-orange">Invoice</a>';
         r_str += '</div></li>';
       return r_str;
     }
   }],
   //responsive: true
   } );

   var $table = $('table#invoices_dashboard_table');
   $table.DataTable().destroy();
   table = $('#invoices_dashboard_table').DataTable( {
     paging: false,
     searching: false,
     lengthChange: false,
     info: false,
     destroy: true,
     ordering: false,
     iDisplayLength: 5,
     "ajax": {
             url: domen + '/api/invoices.json',
             type: "POST",
             data:{'token': user_token, 'for': 'list', 'limit': 5},
             complete: function() {
                 AddPayments(3);
             },
     },
     "columns": [{
       'render': function (data, type, row){
         //console.log(row);
         var r_str = '';
           r_str +='<li class="swipeout">';
           r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
           r_str += '<div class="item-inner"><div class="item-title-row">';
           r_str += '<div class="item-title">'+gettext('Invoice #')+row.invoice_number+'</div>';
           r_str += '<div class="item-after">'+row.date_issued+'</div>';
           r_str += '</div><div class="item-subtitle">';
           r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Customer')+'</div>'+row.client+'</div>';
           r_str += '</div><div class="item-text n_tc">';

           var str = "";
           var strDate = row.date_issued.toString().split('-');
           var dateX = new Date();
           dateX.setFullYear(parseInt(strDate[0]), parseInt(strDate[1])-1, parseInt(strDate[2]));
           dateX.setDate(dateX.getDate() + parseInt(row.pay_terms));
           var today = new Date();
           switch (row.status.toUpperCase()) {
               case 'PAID': str ="<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
                   break;
               case 'PARTIAL': if (today >= dateX) {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-blue' style='text-transform: uppercase'>"+gettext(row.status);
                   str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
               }
               else {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-blue' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>&nbsp;";
               }
                   break;
               case 'DRAFT': if (today >= dateX) {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status);
                   str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
               }
               else {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
               }
                   break;
               case 'UNPAID': if (today >= dateX) {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status);
                   str += "&nbsp;<i class='text-red fa fa-clock-o' aria-hidden='true'></i></span></div>";
               }
               else {
                   str = "<div class='row col-100'><div class='l_tc'>"+gettext('Status') +"</div><span class='badge bg-orange' style='text-transform: uppercase'>"+gettext(row.status)+"</span></div>";
               }
           }
           r_str += str;
           var debt = parseFloat(row.total) - parseFloat(row.payed);
           r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Balance')+'</div>'+(-debt.toFixed(2))+'</div>';
           r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+'</div>'+parseFloat(row.total).toFixed(2)+'</div>';
           if(row.is_active){
             r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('active')+"</span></div>";
           }else{
             r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('inactive')+"</span></div>";
           }
           r_str += '<div class="row col-100" ><div class="l_tc">'+gettext('User')+'</div>'+row.manager+'</div>';
           r_str += '</div></div></a></div>';
           r_str += '<div class="swipeout-actions-left">';
           if(row.is_active){
             r_str += '<a href="#" onclick="PopupInvPay('+row.id+', 3); AddPayments(3);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
           }else{
             r_str += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
           }
           r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Clone\', 1,\'\',\'\', 3)" class="bg-pink">'+gettext('Clone')+'</a>'
           r_str += '</div>'
           r_str += '<div class="swipeout-actions-right">'
           if(row.status == 'Unpaid' && row.is_active){
             r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Edit\', 1,\'\',\'\', 3)" class="bg-orange">'+gettext('Edit')+'</a>'
           }else{
             r_str += '<a href="#" class="">'+gettext('Edit')+'</a>'
           }
           r_str += '<a href="#" onclick="Pdfload('+row.id+', \'invoice\')" class="bg-blue">'+gettext('Pdf')+'</a>'
           r_str += '</div></li>';
         return r_str;
       }
     }],
     //responsive: true
     });
}


function ChangePermissionsWorker(){
  var perms = $('#worker_info_choose_permissions').val().toString()
  $.post('/api/staff/set_perm', { 'token': user_token, 'uid': myApp.worker_id, 'astr':perms})
  .error(function(data){ console.log(data.responseText)})
  .success(function(data){
      if(!data.error){
        myApp.addNotification({
            title: gettext('Success'),
            message: gettext('Permission changed'),
        });
        if(data.me){
          myApp.mainView.reloadPage(pages_url+"/index2.html");[]
        }
        //myApp.mainView.reloadPage(pages_url+"/index2.html");
        //myApp.mainView.back();
      }else {
        myApp.addNotification({
            title: gettext('Error'),
            message: data.message,
        });
      }
  });
}

function chat_start(data){
  // Conversation flag
    var conversationStarted = false;
    // Init Messages
    myMessages = myApp.messages('.messages', {
      autoLayout:true
    });
    // Init Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');
    // Handle message
    $$('.messagebar .link').on('click', function () {
      // Message text
      var messageText = myMessagebar.value().trim();
      // Exit if empy message
      if (messageText.length === 0) return;
      // Empty messagebar
      myMessagebar.clear();
      // Random message type
      var messageType = (['sent', 'received'])[Math.round(Math.random())];
      // Avatar and name for received message
      var avatar, name;
      if(messageType === 'received') {
        avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
        name = 'Kate';
      }
      // Add message
      var users = $('#chat_contacts').val();
      if(users){
        users = users.toString();
      }
      $.ajax({
          type: 'POST',
          url: '/api/chat/new_message',
          data: {'token': user_token, 'chat_message': messageText, 'select_user': users},
          success: function (data) {
            console.log(data);
              if(!data.error) {
              }else{
                  if(!data.no_message)
                    new PNotify({
                          title: '{{_("Error")}}',
                          text: data.message,
                          type: 'error'
                      })
                    //console.log(data.message);
              }
          },
          error: function (data) {
              console.log(data.responseText);
          }
      });

      // Update conversation flag
      conversationStarted = true;
    });
    myApp.ChatMeId = data.me.id;
    myApp.ChatMeName = data.me.name;
    myApp.ChatMeUrl = data.me.url;
    myApp.ChatAllUsers = data.all_user_count;
    myApp.ChatHistoryTime = data.time;
    for (var i = 0; i < data.chat.length; i++) {
      Add_Chat_Message(data.chat[i], myMessages);
    }

    if(!chat){
      chat = true;
      var loc = window.location, new_uri;
      if (loc.protocol === "https:") {
          new_uri = "wss://"+loc.host+"/wss";
      } else {
          new_uri = "ws://"+loc.host+"/ws";
      }
      var ws4redis = WS4Redis({
        uri: new_uri+'/foobar?subscribe-user',
        receive_message: receiveMessage,
        heartbeat_msg: data.heartbeat,
      });
    }
    var str=''
    if(data.director){
      str += '<optgroup label="'+gettext('Director')+'">';
      str += '<option value="'+data.director.id+'">'+data.director.name+'</option></optgroup>'
    }
    if(data.topmanagers){
      str += '<optgroup label="'+gettext('Top managers')+'">';
      for (var i = 0; i < data.topmanagers.length; i++) {
        str += '<option value="'+data.topmanagers[i].id+'">'+data.topmanagers[i].name+'</option>'
      }
      str += '</optgroup>';
    }
    if(data.managers){
      str += '<optgroup label="'+gettext('Managers')+'">';
      for (var i = 0; i < data.managers.length; i++) {
        str += '<option value="'+data.managers[i].id+'">'+data.managers[i].name+'</option>'
      }
      str += '</optgroup>';
    }
    if(data.employees){
      str += '<optgroup label="Employees">';
      for (var i = 0; i < data.employees.length; i++) {
        str += '<option value="'+data.employees[i].id+'">'+data.employees[i].name+'</option>'
      }
      str += '</optgroup>';
    }
    $('#chat_contacts').html(str);
    // receive a message though the Websocket from the server
    var str = '<option value="0">'+gettext('Last 10 message')+'</option>';
    str += '<option value="1">'+gettext('Today')+'</option>'
    str += '<option value="2">'+gettext('Last 7 Days')+'</option>';
    str += '<option value="3">'+gettext('Last 30 Days')+'</option>';
    str += '<option value="4">'+gettext('All')+'</option>';
    $('#history_time').html(str);

    $("#chat_contacts").change(function() {
      var contacts = $("#chat_contacts").val();
      if(contacts && contacts.length != myApp.ChatAllUsers){
        contacts = contacts.length;
        $('#chosen_contacts').html(contacts);
      }else{
        $('#chosen_contacts').html(gettext('all'));
      }
    });
    $('#chat_hide_system_messages').html(gettext('hide system messages'))
    $('#chat_load_history_btn').html('<i class="fa fa-clock-o hiddend" id="chat_load_history"></i> '+gettext('load history'))
    $('#caht_contacts_title').html(gettext('Contacts')+':');
    $('#chosen_contacts').html(gettext('all'));
    $('#send_message_link').html(gettext('Send'));
}

function receiveMessage(msg) {
  console.log(msg);
  if(msg != '--heartbeat--' && msg[1] != "'" && typeof(msg)=='string'){
    data = JSON.parse(msg);
    console.log(data);
    if(typeof(Add_Chat_Message)=='function'){
      var myMessages = myApp.messages('.messages', {
        autoLayout:true
      });
      Add_Chat_Message(data, myMessages)
    }
  }
}


function Add_Chat_Message(data, myMessages){
  console.log('Add_Chat_Message');
  var type = 'received'
  if(data.author_id == myApp.ChatMeId && !data.is_system){
    type = 'sent'
  }
  var url = data.author_url;
  var name = data.author_name;
  if(data.is_system){
    type = 'system';
    url = '/static/dist/img/user2-160x160.jpg';
    name = gettext('System');
  }
  name = '<b>'+name+'</b>';
  var date = moment(data.created_date, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm");
  if(myApp.ChatAllUsers != data.recipients.length){
    console.log('me.C='+myApp.ChatAllUsers+' data.r='+data.recipients.length);
    date += '<br><b>to</b> '
    for (var i = 0; i < data.recipients.length; i++) {
      date += ', '+data.recipients[i];
    }
  }
  myMessages.addMessage({
    // Message text
    text: data.message.replace(/<a\b[^>]*>/i,"<b>").replace(/<\/a>/i,"</b>"),
    // Random message type
    type: type,
    // Avatar and name:
    avatar: url,
    name: name,
    // Day
    /*day: !conversationStarted ? 'Today' : false,
    time: !conversationStarted ? moment(created_date, 'YYYY-MM-DD HH:mm').format("HH:mm") : false,*/
    date: date,
  })
}

function ContactList(){
  if($('#chat_contacts_list').hasClass('hiddend')){
    $('#chat_contacts_list').removeClass('hiddend');
  }else{
    $('#chat_contacts_list').addClass('hiddend');
  }

}

function ChatLoadHistory(){
  $('#btn_history').attr('disabled', true);
  $('#chat_load_history').removeClass('hiddend');
  $.ajax({
      type: 'POST',
      url: '/api/chat/load_history',
      data: 'token='+user_token+'&last_message='+myApp.ChatHistoryTime+'&history_time='+$('#history_time').val(),
      success: function (data) {
        $('#btn_history').attr('disabled', false);
        $('#chat_load_history').addClass('hiddend');
        console.log(data);
        data = eval(data);
        if(!data.error) {
          data = data.data;
          var str = '';
          if(data.length > 0){
            str += '<div class="messages-date">'+moment(data[0].created_date, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm")+'</div>';
          }
          for (var i = 0; i < data.length; i++) {
            if(i == 0){
              myApp.ChatHistoryTime = data[0].created_date;
            }
            var type = 'received'
            if(data[i].author_id == myApp.ChatMeId){
              type = 'sent';
            }
            var name = data[i].author_name;
            var url = data[i].author_url;
            if(data[i].is_system){
              type = 'system';
              if($('#last_message').val() == '1'){
                type = 'system-hide';
              }
              name = gettext('System');
              url = '/static/dist/img/user2-160x160.jpg';
            }
            str += '<div class="message message-'+type+' message-with-avatar message-appear-from-bottom message-first">';
            str += '<div class="message-name"><b>'+name+'</b></div>';
            str += '<div class="message-text">'+data[i].message.replace(/<a\b[^>]*>/i,"<b>").replace(/<\/a>/i,"</b>");
            str += '<div class="message-date">'+data[i].created_date;
            if(data[i].recipients.length != myApp.ChatAllUsers){
              str += '<br><b>to</b> ';
              for (var j = 0; j < data[i].recipients.length; j++) {
                str += ', '+data[i].recipients[j];
              }
            }
            str += '</div></div>';
            str += '<div class="message-avatar" style="background-image:url('+url+')"></div></div>';
          }
          str += '<div style="border-bottom: 1px dashed;"></div><br>'
          var htmlhistory = $('#load_hisory_message').html();
          $('#load_hisory_message').html(str+htmlhistory)
            //addChatLine(data.data, data.all_count, 'history');
            if (data.new_date)
              $('#last_message').val(data.new_date);
        }else{
            if(!data.no_message)
              myApp.addNotification({
                  title: gettext('Error'),
                  message: data.message,
              });
            //console.log(data.message);
        }
      },
      error: function (data) {
          console.log(data.responseText);
          $('#btn_history').attr('disabled', false);
          $('#chat_load_history').addClass('hiddend');
      }
  });
}


function hideSystemChatMessages(btn){
  if ($('.message-system-hide').length > 0){
    btn.innerHTML=gettext('hide system messages');
    $('.message-system-hide').removeClass('message-system-hide').addClass('message-system');
    $('#last_message').val('0')
  }else{
    btn.innerHTML=gettext('show system messages');
    $('.message-system').removeClass('message-system').addClass('message-system-hide');
    $('#last_message').val('1')
  }
}



function pageOrders(data){
  var form = $$('form#search-payments');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#payments_page_title').html(gettext('Payments'));
  $('#search_payments').html('<i class="fa fa-search"></i> '+gettext('Search payments'));
  $('#serch_paiments_invoice_num_title').html(gettext('Invoice #'));
  $('#serch_paiments_invoice_num').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#serch_payments_accepted_title').html(gettext('Accepted By'));
  $('#serch_payments_accepted').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#serch_payments_customers_title').html(gettext('Customers'));
  $('#serch_payments_customers').parent().filter('a').attr('data-searchbar-placeholder', gettext('Search'));
  $('#search-payments a.item-link.smart-select[data-picker-close-text]').attr('data-picker-close-text', gettext('Close'));
  $('#serch_payments_payment_method_title').html(gettext('Payment Method'));
  $('#serch_payment_price_title').html('<i class="fa fa-usd" aria-hidden="true"></i> '+gettext('Amount'));
  $('#serch_payments_p_price_title').html(gettext('Amount is'));
  $('#serch_payments_active_refound_title').html(gettext('Status'));
  $('#serch_payments_ignore_date_text').html(gettext('Date ignore'));
  $('#serch_payments_date_range_title').html(gettext('Date'));
  $('#btn_search_payments').html(gettext('Search'));
  $('#btn_close_search_payments').html(gettext('Close'));

  $$('#search-payments').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

  var calendarRange = myApp.calendar({
    input: '#serch_payments_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(new Date()),
      Date.parse(new Date()),
    ],
    rangePicker: true
  });
  //invoices num
  var invoice_num_str = '';
  for (var i = 0; i < data.invoices.length; i++) {
    invoice_num_str += '<option value="'+data.invoices[i].inv_num+'">'+data.invoices[i].inv_num+'</option>';
  }
  $('#serch_paiments_invoice_num').html(invoice_num_str);
  //users
  TaskRA(data, '#serch_payments_accepted');
  //clients
  var clients_str = '';
  for (var i = 0; i < data.customers.length; i++) {
    clients_str += '<option value="'+data.customers[i].id+'">'+data.customers[i].name+'</option>';
  }
  $('#serch_payments_customers').html(clients_str);
  //payment method
  var payment_method_str = '';
  for (var i = 0; i < data.payment_methods.length; i++) {
    payment_method_str += '<option value="'+data.payment_methods[i].name+'">'+data.payment_methods[i].name+'</option>';
  }
  $('#serch_payments_payment_method').html(payment_method_str);
  //amoind is
  var p_price_str = '<option value="lte" selected>'+gettext('Less')+'</option>';
  p_price_str += '<option value="equal">'+gettext('Equal')+'</option>';
  p_price_str += '<option value="gte">'+gettext('More')+'</option>';
  $('#serch_payments_p_price').html(p_price_str);
  $('#serch_payments_p_price_after').html(gettext('Less'));
  $('#serch_payments_p_price').val('lte');
  //paid status
  var paid_ref_str = '<option value="">'+gettext('Paid+Refunded')+'</option>';
  paid_ref_str += '<option value="refund">'+gettext('Refunded')+'</option>';
  paid_ref_str += '<option value="payed">'+gettext('Paid')+'</option>';
  $('#serch_payments_active_refound').html(paid_ref_str);

  $('form#search-orders').validate({
      submitHandler: function(form){
        //console.log('test');
          var date_range = $('#serch_payments_date_range').val();
          //console.log(startTime);
          if(!date_range){
            myApp.addNotification({
                title: gettext('Error'),
                message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter date.')
            });
            return false;
          }else if(date_range.length < 20){
            date_range = date_range+' - '+date_range
          }
          if(!user_token){
            myApp.loginScreen();
            return false;
          }


            var $table = $('table#payments');
            $table.DataTable().destroy();
            table = $('#payments').DataTable( {
              //paging: false,
              //searching: false,
              lengthChange: false,
              //info: false,
              destroy: true,
              ordering: false,
              iDisplayLength: 3,
              "ajax": {
                      url: "/api/payments.json?search=true&"+$(form).serialize(),
                      type: "POST",
                      data: {'token': user_token},
                      complete: function(data) {
                        //console.log(data);
                        myApp.addNotification({
                            message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' payments')+'</b></p>'
                        });
                        $('div[name=hidden_search_task]').addClass('hiddend');
                 },
                  },
              "columns": columns,
              //responsive: true
              } );
        }
  });

  var columns = [{
    'render': function (data, type, row){
      var r_str = '';
        r_str +='<li class="swipeout">';
        r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
        r_str += '<div class="item-inner"><div class="item-title-row">';
        r_str += '<div class="item-title">'+gettext('Invoice #')+row.invoice_number+'</div>';
        r_str += '<div class="item-after">'+row.date+'</div>';
        r_str += '</div><div class="item-subtitle">';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+' $</div>'+row.payment+'</div>';
        r_str += '</div><div class="item-text n_tc">';
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Customer')+'</div>'+row.client+'</div>';
        if(row.refund){
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('refunded')+"</span></div>";
        }else{
          r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Status')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('paid')+"</span></div>";
        }
        r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Method')+'</div>'+row.payment_method+'</div>';
        r_str += '<div class="row col-100" id="customers_inv_title"><div class="l_tc">'+gettext('Accepted')+'</div>'+row.accepted_by+'</div>';
        r_str += '</div></div></a></div>';
        r_str += '<div class="swipeout-actions-left">';
       if(row.is_active){
          r_str += '<a href="#" onclick="PopupInvPay('+row.iid+', 0); AddPayments(0);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }else{
          r_str += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
        }
        r_str += '</div><div class="swipeout-actions-right">';
        r_str += '<a href="#" onclick="InvoceIdload('+row.invoice_number+')" class="bg-orange">Invoice</a>';
        r_str += '</div></li>';
      return r_str;
    }
  }];

  function footerCallbackPayments( row, data, start, end, display ) {
      var total = 0.0;

      $.each(display, function () {
        if((!data[this].refund)){
          total += parseFloat(data[this].payment);
        }
      });
      var totalPage = parseFloat(myApp.totalPage)
      //total on this page

      var footStr = "$ " + total.toFixed(2);
      if(totalPage.toFixed(2) != total.toFixed(2))
        footStr = "$ " + total.toFixed(2) + " ($ " + totalPage.toFixed(2) + gettext(' total')+")";
      /* Modify the footer row to match what we want */
      $(row).find('span:eq(0)').html(gettext('Total: ')+footStr);
  }

  var table = $('#orders').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 3,
    "ajax": {
            "url": "/api/order/order.json",
            "type": "POST",
            "data": {'token':user_token},
        },
    "columns": columns,
    "footerCallback": function ( row, data, start, end, display ) {
        footerCallbackPayments( row, data, start, end, display );
    },
    //responsive: true
    } );
}

function DeleteTask(id){
  myApp.task_delete_id = id
  myApp.confirm(gettext('Are you sure?'), gettext('Delete task'), function () {
      $.post('/api/task/delete/', {
          'token': user_token,
          'id': myApp.task_delete_id,
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(data){
            if(!data.error){
              $('#tasks_table').DataTable().ajax.reload();
              myApp.addNotification({
                  title: gettext('Success'),
                  message: gettext('Task deleted'),
              });
            }else {
              myApp.addNotification({
                  title: gettext('Error'),
                  message: data.message,
              });
            }

          });
  });
}
