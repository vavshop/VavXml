//var domen = 'http://127.0.0.1:8000';
//var pages_url = 'http://127.0.0.1:8000/static/mobile'
var domen = '';
var pages_url = '/static/mobile';
localStorage.setItem('domen', domen);
localStorage.setItem('pages_url', pages_url);

// Initialize your app
var myApp = new Framework7({
  modalTitle: 'YarnTeam',
  material: true
});
var chat = false;
var tawkchat = false;
// Export selectors engine
var $$ = Dom7;

$$('#login-form').on('submitted', function(e){
  var response = JSON.parse(e.detail.data)
  if (!response.error){
    localStorage.setItem('token', response.token);
    user_token = response.token;
    var tasks_url = domen + '/api/tasks.json';
    $$.post(tasks_url, {'token': response.token, 'end': moment().format('YYYY-MM-DD')}, function(data){
      var taskdata = JSON.parse(data)
      if(!taskdata.error){
        if(!taskdata.add_task)
          $('a[name=float_button_new_task]').remove();
        if(!taskdata.add_payments)
          $('#main_payments').remove();
        if(!taskdata.add_workers)
          $('#main_users').remove();
        if(!taskdata.add_storage)
          $('#main_storage').remove();
        if(!taskdata.add_items)
          $('#main_item').remove();
        $('#avatar_menu').attr('src', taskdata.user_url).attr('style','transform: rotate('+taskdata.user_degr+'deg);')
        myApp.company_id = taskdata.user_company_id;
        myApp.UserEmail = taskdata.user_email;
        myApp.UserName = taskdata.name;
        myApp.UserPosition = taskdata.position;

        myApp.hideIndicator();
        $$('#name_info').html(taskdata.name);
        $$('#position_info').html(gettext(taskdata.position));
        if(taskdata.position == 'Director'){
          $('#menu_user_settings').attr('onclick', 'myApp.mainView.reloadPage("'+pages_url+'/pages/company_info.html");')
          BuildTasksList(taskdata);
        }else{
            $('#menu_user_settings').attr('onclick', 'Usersload('+taskdata.user_id+')')
            BuildTasksList(taskdata);
            $('#menu_dashboard').remove();
        }
        OpenTasks(taskdata);
      }else{
        myApp.addNotification({
           message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+formData.message
       });
      }
    });
    myApp.closeModal();
  }
  else
    myApp.alert(response.message);
});


// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar
    dynamicNavbar: true
});

myApp.onPageInit('index', function (page) {
  RemotTawk()
  if(!user_token)
    myApp.loginScreen();
  if($('div[name=hidden_search_task]').length > 1){
    $('div[name=hidden_search_task]')[0].remove();
  }
  if($('table[name=tasks_table]').length > 1){
    $('table[name=tasks_table]')[0].remove();
  }

  if(!myApp.searchTask){
    var tasks_url = domen + '/api/tasks.json';
    myApp.showIndicator();
    $$.post(tasks_url, {'token': user_token, 'end': moment().format('YYYY-MM-DD')}, function(data){
      taskdata = JSON.parse(data)
      myApp.UserEmail = taskdata.user_email;
      if(!taskdata.add_task)
        $('a[name=float_button_new_task]').remove();
      myApp.user_edit_task = taskdata.edit_task;
      myApp.user_delete_task = taskdata.delete_task;
      if(!taskdata.add_payments)
        $('#main_payments').remove();
      if(!taskdata.add_workers)
        $('#main_users').remove();
      if(!taskdata.add_storage)
        $('#main_storage').remove();
      if(!taskdata.add_items)
        $('#main_item').remove();
      $('#avatar_menu').attr('src', taskdata.user_url).attr('style','transform: rotate('+taskdata.user_degr+'deg);')
      myApp.company_id = taskdata.user_company_id;
      myApp.hideIndicator();
      $('#name_info').html(taskdata.name);
      $$('#position_info').html(gettext(taskdata.position));
      if(taskdata.position == 'Director'){
        $('#menu_user_settings').attr('onclick', 'myApp.mainView.reloadPage("'+pages_url+'/pages/company_info.html");')
        BuildTasksList(taskdata);
      }else{
          $('#menu_user_settings').attr('onclick', 'Usersload('+taskdata.user_id+')')
          BuildTasksList(taskdata);
          $('#menu_dashboard').remove();
      }
      OpenTasks(taskdata);
    });
  }else{
    /*if($('.page[data-page=index]').length > 1)
      $('.page[data-page=index]')[0].remove();
    mainView.router.refreshPage()*/
    loadSavedSearchTasks();
  }
});

myApp.onPageInit('edit-client', function(page){
  FillClientForm();
  RemotTawk()
  var cameFromURL = domen + '/api/came_from.json?token=' + user_token;

  var autocompleteDropdownAjax = myApp.autocomplete({
    input: '#coming-from-ajax',
    openIn: 'dropdown',
    preloader: true, //enable preloader
    valueProperty: 'id', //object's "value" property name
    textProperty: 'text', //object's "text" property name
    limit: 20, //limit to 20 results
    dropdownPlaceholderText: 'Try enter text',
    expandInput: true, // expand input
    source: function (autocomplete, query, render) {
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        // Show Preloader
        autocomplete.showPreloader();
        // Do Ajax request to Autocomplete data
        $$.ajax({
            url: cameFromURL,
            method: 'POST',
            dataType: 'json',
            //send "query" to server. Useful in case you generate response dynamically
            data: {
                query: query
            },
            success: function (data) {
              for (var i = 0; i < data.query.length; i++) {
                  results.push(data.query[i]);
              }
              // Hide Preoloader
              autocomplete.hidePreloader();
              // Render items by passing array with result items
              render(results);
            }
        });
    }
  });

  $$('#edit-client').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if (!response.error){
      myApp.mainView.loadPage(pages_url+'/pages/clients.html');
    }
    else {
      if (response.relogin)
        myApp.loginScreen();
      else {
        myApp.alert(response.message);
      }
    }
  });

  $$('#edit-client').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

});

myApp.onPageInit('new-client', function (page) {
  RemotTawk()
  var form = $$('form#new-client');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $$('#new-client').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if ((response.error) && (!response.relogin)) {
      myApp.alert(response.message, function() {
        myApp.mainView.loadPage(pages_url+'/pages/clients.html');
      });
    }
    if (response.relogin) {
      myApp.loginScreen();
    }
    if (!response.error) {
      myApp.mainView.loadPage(pages_url+'/pages/clients.html');
    }
  });
  $('#new_customer_page_title').html(gettext('New customer'));
  $('#new_customer_basic_info_title').html(gettext('Basic info'));
  $('#new_customer_company_name_title').html(gettext('Company name'));
  $('#new_customer_first_name_title').html(gettext('First name'));
  $('#new_customer_last_name_title').html(gettext('Last name'));
  $('#new_customer_phone_title').html(gettext('Phone'));
  $('#new_customer_phone_2_title').html(gettext('Phone')+' 2');
  $('#new_customer_email_title').html(gettext('E-mail'));
  $('#new_customer_came_frome_title').html(gettext('Came frome'));
  $('#new_customer_choose_group_title').html(gettext('Choose groups'));
  $('#new_customer_address_title').html(gettext('Address'));
  $('#new_customer_address_2_title').html(gettext('Address')+' 2');
  $('#new_customer_city_title').html(gettext('City'));
  $('#new_customer_state_title').html(gettext('State'));
  $('#new_customer_ZIP_title').html(gettext('ZIP'));
  $('#new_customer_note_title').html(gettext('Note'));
  $('#new_customer_submite_value').html(gettext('Save'));

  $$('#new-client').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

  var cameFromURL = domen + '/api/came_from.json';

  var autocompleteDropdownAjax = myApp.autocomplete({
    input: '#coming-from-ajax',
    openIn: 'dropdown',
    preloader: true, //enable preloader
    valueProperty: 'id', //object's "value" property name
    textProperty: 'text', //object's "text" property name
    limit: 20, //limit to 20 results
    dropdownPlaceholderText: gettext('Try enter text'),
    expandInput: true, // expand input
    source: function (autocomplete, query, render) {
        var results = [];
        if (query.length === 0) {
            render(results);
            return;
        }
        // Show Preloader
        autocomplete.showPreloader();
        // Do Ajax request to Autocomplete data
        $$.ajax({
            url: cameFromURL,
            method: 'POST',
            dataType: 'json',
            //send "query" to server. Useful in case you generate response dynamically
            data: {
                query: query,
                token: user_token
            },
            success: function (data) {
              for (var i = 0; i < data.query.length; i++) {
                  results.push(data.query[i]);
              }
              // Hide Preoloader
              autocomplete.hidePreloader();
              // Render items by passing array with result items
              render(results);
            }
        });
    }
  });

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
});

myApp.onPageInit('client-info', function (page) {
  GetClientInfo();
  RemotTawk()
});

myApp.onPageBeforeAnimation('task', function (page) {
  //console.log("test");
  Task(myApp.task_id);
  $('#task_page_title').html(gettext('Task'));
});

myApp.onPageInit('invoices', function (page) {
  RemotTawk()
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
      var tasks_url = domen + '/api/invoices.json';
      $$('#title_name').html(gettext('Invoices'));
      if($('ul.invoices').length > 1){
        $('ul.invoices')[0].remove();
        $('div[name=hidden_search_task]')[0].remove();
      }
    if(!myApp.searchInvoices){
    InvocesPage(tasks_url);
    myApp.showIndicator();
    $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
      //console.log('test1');
        data = JSON.parse(data)
        myApp.invoicesTotalPage = data.totalPage;
        myApp.invoicesTotalDebtPage = data.totalDebtPage;
        myApp.invoicesBalancePage = data.balancePage;
        myApp.addPaymentsType = 1;
        AddPayments(1);
        searhInvoices(data);
        myApp.hideIndicator();
      });
    }else{
      //console.log('loadSavedSearchInvoices');
      loadSavedSearchInvoices();
    }
});

myApp.onPageInit('invoice', function (page) {
  RemotTawk()
  //console.log("test1");
  Invoce(myApp.invoice_id, myApp.invoice_type, myApp.is_invoice, myApp.client_id, myApp.client_name);
});



myApp.onPageInit('clients', function(page) {
  RemotTawk()
  if (!user_token)
    myApp.loginScreen();
  else
    BuildClientsList();
});

myApp.onPageInit('estimates', function (page) {
    RemotTawk()
    console.log('estimates');
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/estimates.json';
    if($('ul.estimates').length > 1){
      $('ul.estimates')[0].remove();
      $('div[name=hidden_search_task]')[0].remove();
    }
    if(!myApp.searchEstimates){
      myApp.showIndicator();
      EstimatesPage(tasks_url);
      $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
        data = JSON.parse(data)
        //console.log(data);
        searhEstimates(data);
        myApp.hideIndicator();
      });
    }else{
      console.log('loadSavedSearchEstimates');
      loadSavedSearchEstimates();
    }
});

myApp.onPageInit('invoice_pdf', function (page) {
  RemotTawk()
    var user_token = localStorage.getItem('token')
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/estimate_preview/';
    $$.post(tasks_url, {'token': user_token, 'id': myApp.invoice_id, 'type': myApp.is_invoice}, function(data){
      var data = JSON.parse(data);
      //console.log(data);
      var iframe = '<iframe src="'
        +'https://docs.google.com/viewer?url='+data.pdf_path
        +'&amp;embedded=true&amp;a=bi&amp;pagenumber=1&amp;w=800&amp;h=1100"'
        +' width="100%" height="470" style="border: none;"></iframe>'
        +'<input type="hidden" name="doc_type" value="'+myApp.is_invoice+'" />'
        +'<input type="hidden" name="doc_path" value="'+data.pdf_path+'">'
      $('#iframePdf').html(iframe);
      $('#pdf_title').html((gettext(myApp.is_invoice)+' pdf').toUpperCase());
      $('#send_to_email').val(data.email);
      $('#send_to_email_value').html(gettext('Send to email'));
      });
});

var user_token = localStorage.getItem('token')
if(!user_token){
    if(LANGUAGE_CODE == 'ru')
      ChangeLangvich('en-us','/mobile/');
    myApp.loginScreen();
}else{
  var tasks_url = domen + '/api/tasks.json';
  $$.post(tasks_url, {'token': user_token, 'end': moment().format('YYYY-MM-DD')}, function(data){
      var taskdata = JSON.parse(data);
      console.log(taskdata);
      myApp.UserEmail = taskdata.user_email;
      if(!taskdata.add_task)
        $('a[name=float_button_new_task]').remove();
      myApp.user_edit_task = taskdata.edit_task;
      myApp.user_delete_task = taskdata.delete_task;
      if(!taskdata.add_payments)
        $('#main_payments').remove();
      if(!taskdata.add_workers)
        $('#main_users').remove();
      if(!taskdata.add_storage)
        $('#main_storage').remove();
      if(!taskdata.add_items)
        $('#main_item').remove();
      $('#avatar_menu').attr('src', taskdata.user_url).attr('style','transform: rotate('+taskdata.user_degr+'deg);')
      $('#name_info').html(taskdata.name);
      $$('#position_info').html(gettext(taskdata.position));
      if(taskdata.position == 'Director'){
        $('#menu_user_settings').attr('onclick', 'myApp.mainView.reloadPage("'+pages_url+'/pages/company_info.html");')
        myApp.mainView.reloadPage(pages_url+"/pages/dashboard.html");
      }else{
          $('#menu_user_settings').attr('onclick', 'Usersload('+taskdata.user_id+')')
          BuildTasksList(taskdata);
          $('#menu_dashboard').remove();
      }
      myApp.company_id = taskdata.user_company_id;
      OpenTasks(taskdata);
    });
  }

  $('#pay_method').change(function(){
      if ($('#pay_method option:selected').val()=='2'){
          $('#chek_li').show();
          $('#chek_li input').val('')
      }
      else {
          $('#chek_li').hide();
      }
  })

function ChangeLangvich(len,url){
  url = url.replace("//", "/");
  //console.log(len);
  var crf = $$('input[name="csrfmiddlewaretoken"]').val();
  $.post('/i18n/setlang/', { language: len, next:url, csrfmiddlewaretoken: crf})
  .error(function(data){
    console.log(data.responseText);
  })
  .success(function(){
    console.log('success change langvich');
      window.location.href = url;
  });
}

myApp.onPageInit('new-task', function (page) {
  RemotTawk()
  var form = $$('form#new-task');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#new_task_page_title').html(gettext('New task'));
  $('#new_task_name_title').html(gettext('Task name'));
  $('#new_task_recipients_title').html(gettext('Assigned to'));
  $('#new_task_auditors_title').html(gettext('Auditors'));
  $('#new_task_customers_title').html(gettext('Customers'));
  $('#new_task_all-day-text').html(gettext('All Day'));
  $('#new_task_reservationtime_title').html(gettext('Date period:'));
  $('#new_tak_time_period_title').html(gettext('Time period:'));
  $('#new_task_start_time_title').html(gettext('Start time:'));
  $('#new_task_end_time_title').html(gettext('End time:'));
  $('#new_task_description_title').html(gettext('Description'));
  $('#new_task_event_color_title').html(gettext('Choose event color:'));
  $('#new_task_event_color option')[0].text=gettext('aqua');
  $('#new_task_event_color option')[1].text=gettext('blue');
  $('#new_task_event_color option')[2].text=gettext('light blue');
  $('#new_task_event_color option')[3].text=gettext('teal');
  $('#new_task_event_color option')[4].text=gettext('yellow');
  $('#new_task_event_color option')[5].text=gettext('orange');
  $('#new_task_event_color option')[6].text=gettext('green');
  $('#new_task_event_color option')[7].text=gettext('lime');
  $('#new_task_event_color option')[8].text=gettext('red');
  $('#new_task_event_color option')[9].text=gettext('purple');
  $('#new_task_event_color option')[10].text=gettext('fuchsia');
  $('#new_task_event_color option')[11].text=gettext('muted');
  $('#new_task_event_color option')[12].text=gettext('navy');
  $('#new_task_submite_value').html(gettext('Save'));

  $$('#new-task').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
  if(myApp.task_id == -1){
    var user_token = localStorage.getItem('token')
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/task_view_json/';
    $$.post(tasks_url, {'token': user_token}, function(data){
      var data = JSON.parse(data);
      //console.log(data);
      TaskRA(data, '#new_task_recipients')
      TaskRA(data, '#new_task_auditors')
      var client_str = '';
      if(data.clients){
        client_str += '<optgroup label="'+gettext('Clients')+'">';
        for (var i = 0; i < data.clients.length; i++) {
          client_str += '<option value="'+data.clients[i].id+'">'+data.clients[i].name+'</option>';
        }
        client_str += '</optgroup>';
      }
      if(data.customer_companys){
        client_str += '<optgroup label="'+gettext('Companys')+'">';
        for (var i = 0; i < data.customer_companys.length; i++) {
          client_str += '<option value="'+data.customer_companys[i].id+'">'+data.customer_companys[i].name+'</option>';
        }
        client_str += '</optgroup>';
      }
      $('#new_task_customers').html(client_str);
  });
  }
  var calendarRange = myApp.calendar({
    input: '#reservationtime',
    dateFormat: 'mm/dd/yyyy',
    value: [new Date()],
    rangePicker: true
  });
  newtaskform();
});

myApp.onPageInit('edit-task', function (page) {
  RemotTawk()
  //console.log("onPageInit('edit-task'");
  Taskedit(myApp.taskload_id);
});


myApp.onPageInit('payments', function (page) {
  RemotTawk()
  if(!user_token)
    myApp.loginScreen();
  var tasks_url = domen + '/api/api_payments';
  myApp.showIndicator();
  $$.post(tasks_url, {'token': user_token}, function(data){
    data = JSON.parse(data)
    myApp.totalPage = data.totalPage;
    if($('.page-content.payments').length > 1){
      $('.page-content.payments')[0].remove(); }
    searhPayment(data);
    myApp.hideIndicator();
  });
});

  myApp.onPageInit('invoice_id', function (page) {
    RemotTawk()
      if(!user_token)
        myApp.loginScreen();
      var tasks_url = domen + '/api/invoices.json';
      myApp.showIndicator();
      $$('#title_name').html(gettext('Invoices'));
      $$.post(tasks_url, {'token': user_token, 'for': 'invoice', 'id': myApp.invoice_page_id}, function(data){
          var inHTML = BuildInvoicesList(JSON.parse(data));
          $$('#invoice_id_invoices').html(inHTML);
          AddPayments(1);
          myApp.hideIndicator();
        });
  });

  myApp.onPageInit('invoices_client', function (page) {
    RemotTawk()
      if(!user_token)
        myApp.loginScreen();
      var tasks_url = domen + '/api/invoices.json';
      $$('#title_name').html(gettext('Invoices'));
      InvocesClientPage(tasks_url);
  });

  myApp.onPageInit('estimates_client', function (page) {
    RemotTawk()
      if(!user_token)
        myApp.loginScreen();
      var tasks_url = domen + '/api/estimates.json';
      $$('#estimates_page_title').html(gettext('estimates'));
      EstimatesClientPage(tasks_url);
  });


  myApp.onPageInit('users', function (page) {
    RemotTawk()
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/workers.json';
    $$('#users_page_title').html(gettext('Users'));
    if($('table[name=users_table]').length > 1){
      $('table[name=users_table]')[0].remove();
    }
    WorkersListPage(tasks_url);
  });

  myApp.onPageInit('worker-info', function (page) {
    RemotTawk()
      if(!user_token)
        myApp.loginScreen();
      var tasks_url = domen + '/api/workers.json';
      myApp.showIndicator();
      //$$('#title_name').html(gettext('Invoices'));
      $$.post(tasks_url, {'token': user_token, 'for': 'worker_info', 'id': myApp.worker_id}, function(data){
          var data = JSON.parse(data);
          console.log(data);
          if(!data.error){
            myApp.hideIndicator();
            if(data.director_page){
              setTimeout(function() {
                myApp.mainView.reloadPage(pages_url+"/pages/company_info.html");
                //myApp.mainView.loadPage(pages_url+"/pages/company_info.html");
              },1000);
            }else{
              BuldWorkerInfoPage(data);
            }
          }else{
            console.log(data.message);
            myApp.hideIndicator();
            myApp.addNotification({
                title: gettext('Error'),
                message: data.message,
            });
            setTimeout(function() {
              myApp.mainView.back();
            },1000);
          }
        });
  });


    myApp.onPageInit('new-worker', function (page) {
      RemotTawk()
        if(!user_token)
          myApp.loginScreen();
        var tasks_url = domen + '/api/workers.json';
        myApp.showIndicator();
        $$('#title_name').html(gettext('Invoices'));
        $$.post(tasks_url, {'token': user_token, 'for': 'worker_new'}, function(data){
            var data = JSON.parse(data);
            console.log(data);
            var str = ''
            var selid = 0;
            var seltext = '';
            for (var i = 0; i < data.val_grp.length; i++) {
              var sel = '';
              if(i==0){
                sel = 'selected';
                selid = data.val_grp[i].id;
                seltext = gettext(data.val_grp[i].text);
                }
              str += '<option value="'+data.val_grp[i].id+'" '+sel+'>'+gettext(data.val_grp[i].text)+'</option>';
            }
            $('#worker_new_choose_group').html(str);
            $('#worker_new_choose_group').val(selid);
            $('#worker_new_choose_group_after').html(seltext);
            $('#new_worker_page_title').html(gettext('Add worker'));
            $('#worker_new_basic_info_title').html(gettext('Basic info'));
            $('#worker_new_first_name_title').html(gettext('First name'));
            $('#worker_new_last_name_title').html(gettext('Last name'));
            $('#worker_new_phone_title').html(gettext('Phone'));
            $('#worker_new_phone_2_title').html(gettext('Phone')+' 2');
            $('#worker_new_email_title').html(gettext('E-mail'));
            $('#worker_new_choose_group_title').html(gettext('Choose groups'));
            $('#worker_new_birthday_title').html(gettext('Date of birth'));
            $('#worker_new_password_title').html(gettext('Password'));
            $('#worker_new_submite_btn_value').html(gettext('Save'));
            var form = $$('form#new-worker');
            form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
            myApp.hideIndicator();
          });
          $$('#new-worker').on('submitted', function(e){
            var response = JSON.parse(e.detail.data);
            if ((response.error) && (!response.relogin)) {
              myApp.alert(response.message, function() {});
            }
            if (response.relogin) {
              myApp.loginScreen();
            }
            if (!response.error) {
              $('#users_table').DataTable().ajax.reload();
              myApp.mainView.back();
              myApp.addNotification({
                  title: gettext('Success'),
                  message: gettext('Worker created'),
              });
            }
          });
    });


    myApp.onPageInit('invoices_history', function (page) {
      RemotTawk()
      //console.log('invoices');
        if(!user_token)
          myApp.loginScreen();
          var tasks_url = domen + '/api/invoices_history.json';
          $$('#title_name').html(gettext('Invoices'));
          if($('ul.invoices_history').length > 1){
            $('ul.invoices_history')[0].remove();
            $('div[name=hidden_search_task]')[0].remove();
          }
          InvocesHistoryPage(tasks_url);
        if(!myApp.searchHistoryInvoices){
        }else{
          //console.log('loadSavedSearchInvoices');
          //loadSavedSearchInvoices();
        }
    });

myApp.onPageInit('invoice', function (page) {
  RemotTawk()
  //console.log("test1");
  Invoce(myApp.invoice_id, myApp.invoice_type, myApp.is_invoice, myApp.client_id, myApp.client_name);
});


myApp.onPageInit('storage', function (page) {
  RemotTawk()
      //console.log('invoices');
        if(!user_token)
          myApp.loginScreen();
        var tasks_url = domen + '/api/storage.json';
        $$('#title_storage_name').html(gettext('Storage'));
        $$('#materials_history_btn').html(gettext('Storage history'));
        if($('ul.materials').length > 1){
          $('ul.materials')[0].remove();
        }
        StoragePage(tasks_url);
        if(!myApp.searchInvoices){
        /*myApp.showIndicator();
        $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
          //console.log('test1');
            data = JSON.parse(data)
            console.log(data);
            //searhInvoices(data);
            myApp.hideIndicator();
          });*/
        }else{
          //console.log('loadSavedSearchInvoices');
          //loadSavedSearchInvoices();
        }
    });


    myApp.onPageInit('edit-storage', function (page) {
      //console.log('invoices');
        if(!user_token)
          myApp.loginScreen();
          var tasks_url = domen + '/api/storage.json';
          $$('#title_name').html(gettext('Invoices'));
          if($('ul.invoices_history').length > 1){
            $('ul.invoices_history')[0].remove();
            $('div[name=hidden_search_task]')[0].remove();
          }
    var form = $$('form#edit-storage');
    form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
    form.append('<input type=\'hidden\' name=\'item-id\' value=\''+myApp.Storege_item_id+'\'>');
    $('#edit-storage input[name=item-name]').val(myApp.Storege_item_name)
    $('#edit-storage input[name=amount]').val(myApp.Storege_item_amount)
    $('#edit-storage input[name=sell-price]').val(myApp.Storege_item_sell_price)
    $$('#edit-storage input[name=item-name]').parents('div.item-inner').addClass('not-empty-state');
    $$('#edit-storage input[name=amount]').parents('div.item-inner').addClass('not-empty-state');
    $$('#edit-storage input[name=sell-price]').parents('div.item-inner').addClass('not-empty-state');
    $('#edit_storage_page').html(gettext('Edit Material'))
    $('#basic_info_edit_storage').html(gettext('Edit storage material')+' <b>'+myApp.Storege_item_name+'</b>')
    $('#edit_storage_name_title').html(gettext('Item name'))
    $('#edit_storage_amount_title').html(gettext('Amount'))
    $('#edit_storage_phone_title').html(gettext('Sell price'))
    $('#edit_storage_note_title').html(gettext('Note'))
    $('#edit_storage_save_button_value').html(gettext('Save'))
    $('#edit-storage textarea').val('');
    $$('#edit-storage').on('submitted', function(e){
      var response = JSON.parse(e.detail.data);
      if (!response.error){
        $('#materials_table').DataTable().ajax.reload();
        myApp.mainView.back();
        myApp.addNotification({
            title: gettext('Success'),
            message: gettext('Changes saved'),
        });
      }
      else {
        if (response.relogin)
          myApp.loginScreen();
        else {
          myApp.alert(response.message);
        }
      }
    });

    $$('#edit-client').on('submitError', function(e){
      console.log(e.detail.xhr.response);
    });

  });



myApp.onPageInit('add-equip-storage', function (page) {
    //console.log('invoices');
      if(!user_token)
        myApp.loginScreen();
        var tasks_url = domen + '/api/storage.json';
        $$('#title_name').html(gettext('Invoices'));
        if($('ul.invoices_history').length > 1){
          $('ul.invoices_history')[0].remove();
          $('div[name=hidden_search_task]')[0].remove();
        }
  var form = $$('form#add-equip-storage');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  form.append('<input type=\'hidden\' name=\'storage_item_id\' value=\''+myApp.Storege_item_id+'\'>');
  $$.post( domen + '/api/user_list', {'token': user_token}, function(data){
    var data = JSON.parse(data);
    TaskRA(data, '#add_equip_user');
  });
  $('#add_equip_user_title').html(gettext('Choose user'))
  $('#add_equip_user_title').val('')
  $('#add_equip_storage_page').html(gettext('Add equip'))
  $('#basic_info_add_equip_storage').html(gettext('Add equip')+' <b>'+myApp.Storege_item_name+'</b>')
  $('#add_equip_storage_amount_title').html(gettext('Amount'))
  $('#add_equip_storage_save_button_value').html(gettext('Add Equipment'))
  $('#add-equip-storage input[name=amount]').val('');

  $$('#add-equip-storage').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if (!response.error){
      $('#materials_table').DataTable().ajax.reload();
      myApp.mainView.back();
      myApp.addNotification({
          title: gettext('Success'),
          message: gettext('Changes saved'),
      });
    }
    else {
      if (response.relogin)
        myApp.loginScreen();
      else {
        myApp.alert(response.message);
      }
    }
  });

  $$('#edit-client').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

});


myApp.onPageInit('new-storage', function (page) {
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/storage.json';
    $$('#new_storage_page').html(gettext('New Material'));
    if($('ul.invoices_history').length > 1){
      $('ul.invoices_history')[0].remove();
      $('div[name=hidden_search_task]')[0].remove();
    }
  var form = $$('form#new-storage');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#new-storage input[name=item-name]').val('')
  $('#new-storage input[name=amount]').val('')
  $('#new-storage input[name=sell-price]').val('')
  $('#new_storage_page').html(gettext('New Material'))
  $('#basic_info_new_storage').html(gettext('New storage material'))
  $('#new_storage_name_title').html(gettext('Item name'))
  $('#new_storage_amount_title').html(gettext('Quantity'))
  $('#new_storage_phone_title').html(gettext('Sell price'))
  $('#new_storage_save_button_value').html(gettext('Save'))
  $$('#new-storage').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if (!response.error){
      $('#materials_table').DataTable().ajax.reload();
      myApp.mainView.back();
      myApp.addNotification({
          title: gettext('Success'),
          message: gettext('Materail create'),
      });
    }
    else {
      if (response.relogin)
        myApp.loginScreen();
      else {
        myApp.alert(response.message);
      }
    }
  });

  $$('#edit-client').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

});


myApp.onPageInit('storage_history', function (page) {
  RemotTawk()
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
      var tasks_url = domen + '/api/storage_history.json';
      $$('#title_name').html(gettext('Invoices'));
      if($('ul.storae_history').length > 1){
        $('ul.storae_history')[0].remove();
        $('div[name=hidden_search_task]')[0].remove();
      }
      StorageHistoryPage(tasks_url);
    if(!myApp.searchHistoryInvoices){
    }else{
      //console.log('loadSavedSearchInvoices');
      //loadSavedSearchInvoices();
    }
});



myApp.onPageInit('storage_in_use', function (page) {
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
      var tasks_url = domen + '/api/storage/get_in_use';
      $$('#title_name').html(gettext('Invoices'));
      if($('ul.storae_history').length > 1){
        $('ul.storae_history')[0].remove();
        $('div[name=hidden_search_task]')[0].remove();
      }
      var $table = $('table#storage_in_use_table');
      $table.DataTable().destroy();
      table = $('#storage_in_use_table').DataTable( {
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
                data: {'token': user_token, 'item_id': myApp.Storege_item_id},
        },
        "columns": columns_in_use,
        //responsive: true
      } );

});


myApp.onPageInit('company-info', function (page) {
  RemotTawk()
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/company_info.json';
    myApp.showIndicator();
    $$('#title_name').html(gettext('Invoices'));
    $$.post(tasks_url, {'token': user_token, 'for': 'worker_info', 'id': myApp.worker_id}, function(data){
        var data = JSON.parse(data);
        console.log(data);
        myApp.hideIndicator();
        if(!data.error){
          //$$('#invoice_id_invoices').html(inHTML);
          BuldCompanyInfoPage(data);
        }else{
          console.log(data.message);
          myApp.addNotification({
              title: gettext('Error'),
              message: data.message,
          });
          setTimeout(function() {
            myApp.mainView.back();
          },1000);
        }/**/
      });
});


myApp.onPageInit('payment-plan', function (page) {
  RemotTawk()
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/pay_plans/';
    myApp.showIndicator();
    $$('#title_name').html(gettext('Invoices'));
    $$.get(tasks_url, function(data){
        var data = JSON.parse(data);
        console.log(data);
        myApp.hideIndicator();
        if(!data.error){
          $('#new_payment_plan_page_title').html(gettext('Payment'))
          $('#pay_plan_select_title').html(gettext('Select Plan'))
          $('#pay_plan_submite_value').html(gettext('buy a package'))
          var str = ''
          var selid = 0;
          var seltext = '';
          for (var i = 0; i < data.plans.length; i++) {
            var sel = '';
            if(i==0){
              sel = 'selected';
              selid = data.plans[i].id;
              seltext = data.plans[i].text;
              }
            str += '<option value="'+data.plans[i].id+'" '+sel+'>'+data.plans[i].text+'</option>';
          }
          $('#pay_plan_select').html(str);
          $('#pay_plan_select').val(selid);
          $('#pay_plan_select_after').html(seltext);
          $('form#new-plan').append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
          $('form#new-plan').validate({
              submitHandler: function(form){
                     $$.ajax({
                       type: 'POST',
                       url: '/api/paypal/payment',
                       data: $(form).serialize(),
                       success: function(data) {
                         console.log(data);
                         var data = JSON.parse(data)
                         if (!data.error) {
                           console.log('url='+data.url);
                           window.location.href = data.url;
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
                       return false;
                }
          });
        }else{
          console.log(data.message);
          myApp.addNotification({
              title: gettext('Error'),
              message: data.message,
          });
          setTimeout(function() {
            myApp.mainView.back();
          },1000);
        }
      });
});


myApp.onPageInit('items', function (page) {
  RemotTawk()
      //console.log('invoices');
        if(!user_token)
          myApp.loginScreen();
        var tasks_url = domen + '/api/item.json';
        $$('#title_item_name').html(gettext('Items'));
        if($('ul.works').length > 1){
          $('ul.works')[0].remove();
        }
        ItemsPage(tasks_url);
    });


myApp.onPageInit('edit-item', function (page) {
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/item.json';
    $$('#edit_item_page').html(gettext('Edit Item'));
    var form = $$('form#edit-item');
    form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
    form.append('<input type=\'hidden\' name=\'iid\' value=\''+myApp.Item_id+'\'>');
    $('#edit-item input[name=name]').val(myApp.Item_name)
    $('#edit-item input[name=rate]').val(myApp.Item_rate)
    $('#edit-item textarea').val(myApp.Item_description)
    $$('#edit-item input[name=name]').parents('div.item-inner').addClass('not-empty-state');
    $$('#edit-item input[name=rate]').parents('div.item-inner').addClass('not-empty-state');
    $$('#edit_item_description_title').parents('div.item-inner').addClass('not-empty-state');
    $('#edit_item_name_title').html(gettext('Item name'))
    $('#edit_item_rate_title').html(gettext('Rate'))
    $('#edit_item_description_title').html(gettext('Description'))
    $('#edit_item_save_button_value').html(gettext('Save'))
    $$('#edit-item').on('submitted', function(e){
      var response = JSON.parse(e.detail.data);
      if (!response.error){
        $('#works_table').DataTable().ajax.reload();
        myApp.mainView.back();
        myApp.addNotification({
            title: gettext('Success'),
            message: gettext('Changes saved'),
        });
      }
      else {
        if (response.relogin)
          myApp.loginScreen();
        else {
          myApp.alert(response.message);
        }
      }
    });

    $$('#edit-client').on('submitError', function(e){
      console.log(e.detail.xhr.response);
    });

});


myApp.onPageInit('new-item', function (page) {
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/storage.json';
    $$('#new_item_page').html(gettext('New Item'));
  var form = $$('form#new-item');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#new-item input[name=name]').val('')
  $('#new-item input[name=rate]').val('')
  $('#new-item textarea').val('')
  $('#new_item_name_title').html(gettext('Item name'))
  $('#new_item_amount_title').html(gettext('Rate'))
  $('#new_item_description_title').html(gettext('Description'))
  $('#new_item_save_button_value').html(gettext('Save'))
  $$('#new-item').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if (!response.error){
      $('#works_table').DataTable().ajax.reload();
      myApp.mainView.back();
      myApp.addNotification({
          title: gettext('Success'),
          message: gettext('Item created'),
      });
    }
    else {
      if (response.relogin)
        myApp.loginScreen();
      else {
        myApp.alert(response.message);
      }
    }
  });
  $$('#new-item').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
});



myApp.onPageInit('dashboard', function (page) {
  RemotTawk()
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/dashboard';
    myApp.showIndicator();
    $$('#dashboard_title').html(gettext('Dashboard'));
    $$.post(tasks_url, {'token': user_token}, function(data){
        //console.log(data);
        var datajs = JSON.parse(data);
        myApp.hideIndicator();
        if(!datajs.error){
          DashboardData(datajs);
       }else{
         $('#dashboard_page_content').remove();
         setTimeout(function() {
           myApp.mainView.reloadPage(pages_url+"/index2.html");
         },1000);
       }

        if(!data.error){
          //$$('#invoice_id_invoices').html(inHTML);
          //BuldCompanyInfoPage(data);
        }else{
          console.log(data.message);
          myApp.addNotification({
              title: gettext('Error'),
              message: data.message,
          });
          setTimeout(function() {
            //myApp.mainView.back();
          },1000);
        }/**/
      });
});


myApp.onPageInit('chat', function (page) {
  RemotTawk()
    if(!user_token)
      myApp.loginScreen();
    var tasks_url = domen + '/api/chat/load';
    myApp.showIndicator();
    $$('#title_chat_name').html(gettext('Chat'));
    $$.post(tasks_url, {'token': user_token}, function(data){
        //console.log(data);
        var datajs = JSON.parse(data);
        myApp.hideIndicator();
        if(!datajs.error){
          //DashboardData(datajs);
          chat_start(datajs.data);
       }else{
          console.log(datajs.message);
          myApp.addNotification({
              title: gettext('Error'),
              message: datajs.message,
          });
      }/**/
    });
});


myApp.onPageInit('support', function (page) {
  $('#tawkchat-container').removeClass('hiddend');
  $('#tawkchat-container').attr('style', myApp.tawkchat_style)
  var form = $$('form#support-form');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#support-form input[name=email]').val(myApp.UserEmail);
  $('#support-form input[name=email]').parents('div.item-inner').addClass('not-empty-state');
  $('#support_subject_title').html(gettext('Message subject'))
  $('#support_message_title').html(gettext('Message'))
  $('#support_sand_button_value').html('<i class="fa fa-envelope-square" aria-hidden="true"></i> '+gettext('Send'))
  $('#title_support_name').html(gettext('Support'))
  $$('#support-form').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if ((response.error) && (!response.relogin)) {
      myApp.alert(response.message, function() {
        myApp.mainView.loadPage(pages_url+'/pages/clients.html');
      });
    }
    if (response.relogin) {
      myApp.loginScreen();
    }
    if (!response.error) {
      myApp.addNotification({
          title: gettext('Success'),
          message: response.message,
      });
      myApp.mainView.loadPage(pages_url+'/index2.html');
    }
  });
  if(!tawkchat){
    tawkchat = true;
    //<!--Start of Tawk.to Script-->
    var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
    Tawk_API.visitor = {
      name  : myApp.UserName+' ('+myApp.UserPosition+')',
      email : myApp.UserEmail
    };
    Tawk_API.onChatStarted = function(){
    //console.log(Tawk_API.visitor);
    };
    (function(){
    var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
    s1.async=true;
    s1.src='https://embed.tawk.to/58859cfba3964823727f42ef/default';
    s1.charset='UTF-8';
    s1.setAttribute('crossorigin','*');
    s0.parentNode.insertBefore(s1,s0);
    })();
    //<!--End of Tawk.to Script-->
  }
});

function RemotTawk(){
  if($('#tawkchat-container').length > 0){
    $('#tawkchat-container').addClass('hiddend');
    var style = $('#tawkchat-container').attr('style');
    $('#tawkchat-container').attr('style', '')
    if(style){
      myApp.tawkchat_style = style;
    }
  }
}



myApp.onPageInit('group-customers', function (page) {
  RemotTawk()
  //console.log('invoices');
    if(!user_token)
      myApp.loginScreen();
      var tasks_url = domen + '/api/customer/groups.json';
      $$('#group_customers_title').html(gettext('Groups'));
      if($('ul.group_customers').length > 1){
        $('ul.group_customers')[0].remove();
      }
      GroupCustomersPage(tasks_url);
});

myApp.onPageInit('group-customers-info', function (page) {
    if(!user_token)
      myApp.loginScreen();
      var tasks_url = domen + '/api/customer/groups.json';
      $$('#group_customers_info_title').html(gettext('Group info'));
      $$('#group_customers_info_name').html(myApp.group_custumer_info_name);
      if($('ul.group_customers_info').length > 1){
        $('ul.group_customers_info')[0].remove();
      }
      GroupCustomersInfoPage(tasks_url);
});



myApp.onPageInit('edit-group-customer', function (page) {
  RemotTawk()
  myApp.showIndicator();
  var form = $$('form#edit-client-group');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  form.append('<input type=\'hidden\' name=\'gr_id\' value=\''+myApp.group_custumer_edit_id+'\'>');
  $$('#edit-client-group').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if ((response.error) && (!response.relogin)) {
      myApp.alert(response.message, function() {
        myApp.mainView.loadPage(pages_url+'/pages/clients.html');
      });
    }
    if (response.relogin) {
      myApp.loginScreen();
    }
    if (!response.error) {
      $('#group_customers_table').DataTable().ajax.reload();
      myApp.mainView.back();
    }
  });

  $('#edit_group_customer_page').html(gettext('Edit group'));
  $('#basic_info_customer_group').html(gettext('Basic info'));
  $('#group_customer_group_name_title').html(gettext('Group name'));
  $('#group_customer_first_name_title').html(gettext('First name'));
  $('#group_customer_last_name_title').html(gettext('Last name'));
  $('#group_customer_phone_title').html(gettext('Phone'));
  $('#group_customer_phone_2_title').html(gettext('Phone')+' 2');
  $('#group_customer_email_title').html(gettext('E-mail'));
  $('#group_customer_came_grome_title').html(gettext('Came frome'));
  $('#group_customer_address_title').html(gettext('Address'));
  $('#group_customer_address_2_title').html(gettext('Address')+' 2');
  $('#group_customer_city_title').html(gettext('City'));
  $('#group_customer_state_title').html(gettext('State'));
  $('#group_customer_ZIP_title').html(gettext('ZIP'));
  $('#group_customer_description_title').html(gettext('Description'));
  $('#group_customer_save_button_value').html(gettext('Save'));
  $.post('/api/customer/groups.json/', {'token': user_token, 'for': 'edit', 'gr_id': myApp.group_custumer_edit_id})
  .error(function(data){
    console.log(data.responseText);
    myApp.hideIndicator();
  })
  .success(function(data){
    $('#edit-client-group input[name=group_name]').val(data.group_name)
    $$('#edit-client-group input[name=group_name]').parents('div.item-inner').addClass('not-empty-state');
    if(data.first_name){
      $('#edit-client-group input[name=first_name]').val(data.first_name)
      $$('#edit-client-group input[name=first_name]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.last_name){
      $('#edit-client-group input[name=last_name]').val(data.last_name)
      $$('#edit-client-group input[name=last_name]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.mobile_phone){
      $('#edit-client-group input[name=mobile_phone]').val(data.mobile_phone)
      $$('#edit-client-group input[name=mobile_phone]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.another_phone){
      $('#edit-client-group input[name=another_phone]').val(data.another_phone)
      $$('#edit-client-group input[name=another_phone]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.email){
      $('#edit-client-group input[name=email]').val(data.email)
      $$('#edit-client-group input[name=email]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.referral_id){
      $('#edit-client-group input[name=coming_from]').val(data.referral_id)
      $$('#edit-client-group input[name=coming_from]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.description){
      $('#edit-client-group textarea[name=description]').val(data.description)
      $$('#edit-client-group textarea[name=description]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.address){
      $('#edit-client-group input[name=address]').val(data.address)
      $$('#edit-client-group input[name=address]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.address2){
      $('#edit-client-group input[name=address2]').val(data.address2)
      $$('#edit-client-group input[name=address2]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.city){
      $('#edit-client-group input[name=city]').val(data.city)
      $$('#edit-client-group input[name=city]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.state){
      $('#edit-client-group input[name=state]').val(data.state)
      $$('#edit-client-group input[name=state]').parents('div.item-inner').addClass('not-empty-state');
    }
    if(data.zip_code){
      $('#edit-client-group input[name=zip_code]').val(data.zip_code)
      $$('#edit-client-group input[name=zip_code]').parents('div.item-inner').addClass('not-empty-state');
    }
    $$('#edit-client-group input[name=last_name]').parents('div.item-inner').addClass('not-empty-state');
    myApp.hideIndicator();
  });

  $$('#edit-client-group').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
});


myApp.onPageInit('new-group-customer', function (page) {
  myApp.showIndicator();
  var form = $$('form#new-client-group');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  form.append('<input type=\'hidden\' name=\'for\' value=\'new\'>');
  $$('#new-client-group').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if ((response.error) && (!response.relogin)) {
      myApp.alert(response.message, function() {
        myApp.mainView.loadPage(pages_url+'/pages/clients.html');
      });
    }
    if (response.relogin) {
      myApp.loginScreen();
    }
    if (!response.error) {
      $('#group_customers_table').DataTable().ajax.reload();
      myApp.mainView.back();
    }
  });

  $('#new_group_customer_page').html(gettext('New group'));
  $('#basic_info_customer_group').html(gettext('Basic info'));
  $('#group_customer_group_name_title').html(gettext('Group name'));
  $('#group_customer_first_name_title').html(gettext('First name'));
  $('#group_customer_last_name_title').html(gettext('Last name'));
  $('#group_customer_phone_title').html(gettext('Phone'));
  $('#group_customer_phone_2_title').html(gettext('Phone')+' 2');
  $('#group_customer_email_title').html(gettext('E-mail'));
  $('#group_customer_came_grome_title').html(gettext('Came frome'));
  $('#group_customer_address_title').html(gettext('Address'));
  $('#group_customer_address_2_title').html(gettext('Address')+' 2');
  $('#group_customer_city_title').html(gettext('City'));
  $('#group_customer_state_title').html(gettext('State'));
  $('#group_customer_ZIP_title').html(gettext('ZIP'));
  $('#group_customer_description_title').html(gettext('Description'));
  $('#new_group_customer_save_button_value').html(gettext('Save'));
  myApp.hideIndicator();
  $$('#edit-client-group').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
});

myApp.onPageInit('group-add-customer', function (page) {
  myApp.showIndicator();
  var form = $$('form#add-new-client-group');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  form.append('<input type=\'hidden\' name=\'group_ids\' value=\''+myApp.group_custumer_info_id+'\'>');
  $$('#add-new-client-group').on('submitted', function(e){
    var response = JSON.parse(e.detail.data);
    if ((response.error) && (!response.relogin)) {
      myApp.alert(response.message, function() {
        myApp.mainView.loadPage(pages_url+'/pages/clients.html');
      });
    }
    if (response.relogin) {
      myApp.loginScreen();
    }
    if (!response.error) {
      $('#group_customers_info_table').DataTable().ajax.reload();
      myApp.mainView.back();
      myApp.addNotification({
         message: '<p style="color:green;"><b>'+gettext('success')+'<b></p>'+gettext('Customer created')
     });
    }
  });



  var tasks_url = domen + '/api/clients.json/';
  $$.post(tasks_url, {'token': user_token, 'for': 'select', 'gid':myApp.group_custumer_info_id}, function(data){
    var formData = JSON.parse(data);
    $('#add_new_client_select').empty();
    var str = '';
    if(formData.clients){
      str = '<optgroup label="'+gettext('Companys')+'">';
      for (var i = 0; i < formData.clients.length; i++) {
        str += '<option value="'+formData.clients[i].id+'">'+formData.clients[i].text+'</option>';
      }
      str += '</optgroup>';
    }
    if(formData.c_companys){
      str += '<optgroup label="'+gettext('Companys')+'">';
      for (var i = 0; i < formData.c_companys.length; i++) {
        str += '<option value="'+formData.c_companys[i].id+'">'+formData.c_companys[i].text+'</option>';
      }
      str += '</optgroup>';
    }
    $('#add_new_client_select').append(str);
    myApp.hideIndicator();
  });

  $('#add_new_customer_group_page_title').html(gettext('Add customer'));
  $('#add_new_customer_group_tab1').html(gettext('New customer'));
  $('#add_new_customer_group_tab2').html(gettext('Choose customer'));
  $('#basic_info_add_new_customer_group').html(gettext('Basic info'));
  $('#add_new_group_customer_first_name_title').html(gettext('First name'));
  $('#add_new_group_customer_last_name_title').html(gettext('Last name'));
  $('#add_new_group_customer_phone_title').html(gettext('Phone'));
  $('#add_new_group_customer_phone_2_title').html(gettext('Phone')+' 2');
  $('#add_new_group_customer_email_title').html(gettext('E-mail'));
  $('#add_new_group_customer_came_grome_title').html(gettext('Came frome'));
  $('#add_new_group_customer_address_title').html(gettext('Address'));
  $('#add_new_group_customer_address_2_title').html(gettext('Address')+' 2');
  $('#add_new_group_customer_city_title').html(gettext('City'));
  $('#add_new_group_customer_state_title').html(gettext('State'));
  $('#add_new_group_customer_ZIP_title').html(gettext('ZIP'));
  $('#add_new_group_customer_description_title').html(gettext('Description'));
  $('#add_new_group_customer_save_button_value').html(gettext('Save'));
  $('#add_new_clien_select_title').html(gettext('Customers'));
  $('#btn_cancel_new_choose_client').html(gettext('Cancel'));
  $('#btn_add_new_choose_client').html(gettext('Save'));

  $$('#add-new-client-group').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
});


myApp.onPageInit('orders', function (page) {
  RemotTawk()
  if(!user_token)
    myApp.loginScreen();
  var tasks_url = domen + '/api/orders';
  myApp.showIndicator();
  $$.post(tasks_url, {'token': user_token}, function(data){
    data = JSON.parse(data)
    if($('.page-content.orders').length > 1){
      $('.page-content.orders')[0].remove(); }
    pageOrders(data);
    myApp.hideIndicator();
  });
});
