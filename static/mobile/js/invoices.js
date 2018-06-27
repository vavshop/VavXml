//old function
function BuildInvoicesList(invoice) {
  invoice=invoice.data;
  //console.log(invoice);
  var list_innerHTML = '';
  for (var i = 0; i < invoice.length; i++) {
    list_innerHTML += "<li class='swipeout'>";
    list_innerHTML += '<div class="swipeout-content item-content">';
    //onclick='Task("+invoice[i].invoice_number+")'
    list_innerHTML += '<div class="item-inner">'
    list_innerHTML += '<div class="item-title"> #' + invoice[i].invoice_number+' ' +invoice[i].client +'</div>'
    list_innerHTML += '<div class="item-after">' + moment.utc(invoice[i].date_issued).format('YYYY-MM-DD') + '</div>'
    list_innerHTML += '</div></div>'
    list_innerHTML += '<div class="swipeout-actions-left">'
    if(invoice[i].is_active){
      list_innerHTML += '<a href="#" onclick="PopupInvPay('+invoice[i].id+', 1);" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#5cb85c; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
    }else{
      list_innerHTML += '<a href="#" class="bg-white"><i class="fa fa-usd" style="border-radius: 100%; background-color:#c7c7cc; text-align: center; vertical-align: middle; padding: 10px 12px 10px 12px;"></i></a>'
    }
    list_innerHTML += '<a href="#" onclick="Invoceload('+invoice[i].id+', \'Clone\', 1)" class="bg-pink">'+gettext('Clone')+'</a>'
    list_innerHTML += '</div>'
    list_innerHTML += '<div class="swipeout-actions-right">'
    if(invoice[i].status == 'Unpaid' && invoice[i].is_active){
      list_innerHTML += '<a href="#" onclick="Invoceload('+invoice[i].id+', \'Edit\', 1)" class="bg-orange">'+gettext('Edit')+'</a>'
    }else{
      list_innerHTML += '<a href="#" class="">'+gettext('Edit')+'</a>'
    }
    list_innerHTML += '<a href="#" onclick="Pdfload('+invoice[i].id+', \'invoice\')" class="bg-blue">'+gettext('Pdf')+'</a>'
    list_innerHTML += '</div>'
    list_innerHTML += '</li>'
  }
  return list_innerHTML;
}

function Invoceload(id, type, is_invoice, client_id, client_name, typeinv){
  myApp.invoice_id = id;
  myApp.invoice_type = type;
  myApp.is_invoice = is_invoice;
  myApp.client_id = client_id;
  myApp.client_name = client_name;
  myApp.invoice_type_back = typeinv;
  myApp.mainView.loadPage(pages_url+"/pages/invoce_edit.html");
}

function BuildEstimatesList(estimate) {
  estimate=estimate.data;
  //console.log(estimate);
  var list_innerHTML = '';
  //translate
  $('#estimates_page_title').html(gettext('Estimates'));
  for (var i = 0; i < estimate.length; i++) {
    list_innerHTML += "<li class='swipeout'>";
    list_innerHTML += '<div class="swipeout-content item-content">';
    //onclick='Task("+invoice[i].invoice_number+")'
    list_innerHTML += '<div class="item-inner">'
    list_innerHTML += '<div class="item-title"> #' + estimate[i].estimate_number+' ' +estimate[i].client +'</div>'
    list_innerHTML += '<div class="item-after">' + moment.utc(estimate[i].date_issued).format('YYYY-MM-DD') + '</div>'
    list_innerHTML += '</div></div>'
    list_innerHTML += '<div class="swipeout-actions-left">'
    list_innerHTML += '<a href="#" onclick="Invoceload('+estimate[i].id+', \'Generate\', 0)" class="bg-orange">'+gettext('Generate invoice')+'</a>'
    list_innerHTML += '<a href="#" onclick="Invoceload('+estimate[i].id+', \'Clone\', 0)" class="bg-pink">'+gettext('Clone')+'</a>'
    list_innerHTML += '</div>'
    list_innerHTML += '<div class="swipeout-actions-right">'
    if(estimate[i].is_active){
      list_innerHTML += '<a href="#" onclick="Invoceload('+estimate[i].id+', \'Edit\', 0)" class="bg-orange">'+gettext('Edit')+'</a>'
    }else{
      list_innerHTML += '<a href="#" class="">'+gettext('Edit')+'</a>'
    }
    list_innerHTML += '<a href="#" onclick="Pdfload('+estimate[i].id+', \'estimate\')" class="bg-blue">'+gettext('Pdf')+'</a>'
    list_innerHTML += '</div>'
    list_innerHTML += '</li>'
  }
  return list_innerHTML;
}

function invItemOpen2(obj){
  $(obj).parents('.job_element').children('div.item_div').toggleClass('hiddend');
  //autosize(document.querySelectorAll('textarea'));
}

function JobTableAdd(item_id, item_name, item_rate, item_quantity, item_taxes, item_total, item_description, type, el_disable){
  list_innerHTML = '<div class="job_element" job_id="'+item_id+'"><hr style="margin-bottom: 10px;">'

  list_innerHTML += '<div class="item_div_heder hiddend" onclick="invItemOpen(this)">';
  list_innerHTML +='<li class="accordion-item">';
  list_innerHTML +='<div class="content-block">';
  list_innerHTML += '<div class="row col-100"><b><div name="heder_job_name">'+item_name+'</div></b><div name="heder_job_total" class="l_tc">$'+item_total+'</div></div>';
  list_innerHTML += '<div class="row col-100"><div name="heder_job_description" class="l_tc shot_text_description">'+item_description+'</div></div>';
  list_innerHTML += '</div></li></div>'

  list_innerHTML += '<div class="item_div">';
  list_innerHTML += '<li><div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Name')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="job_name" id="job_name" oninput="ChangeJobName(this)" value="'+item_name+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Rate')+' ($)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="job_rate" id="job_rate" oninput="ChangeJobElement(this, \'job\')" value="'+item_rate+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Quantity')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="job_count" id="job_count" oninput="ChangeJobElement(this, \'job\')" value="'+item_quantity+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Tax')+' (%)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="job_tax" id="job_tax" oninput="ChangeJobElement(this, \'job\')" value="'+item_taxes+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Total')+' ($)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="job_total" id="job_total" value="'+item_total+'" disabled>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  empty=''
  if(item_description)
    empty=' not-empty-state'
  list_innerHTML += '<div class="item-content"><div class="item-inner'+empty+'">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Description')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<textarea class="resizable" oninput="ChangeJobName(this)" name="job_description" id="job_description" '+el_disable+'>'+item_description+'</textarea>'
  list_innerHTML += '</div></div></div></li>'
  if(type != 'Info'){
    list_innerHTML += '<li>'
    list_innerHTML += '<div class="item-content"><div class="item-inner">'
    list_innerHTML += '<div class="item t_r">'
    list_innerHTML += '<a href="#" onclick="DelJob(this)" id="del_item"><i class="fa fa-trash-o"></i></a>'
    list_innerHTML += '</div></div></div></li>'
  }
  list_innerHTML += '</div></div>'
  return list_innerHTML;
}

function ChangeJobName(obj){
 var job = $(obj).parents('.job_element');
 var name = job.find('input[name="job_name"]').val()
 job.find('div[name="heder_job_name"]').html(name)
 var descr = job.find('textarea[name="job_description"]').val()
 job.find('div[name="heder_job_description"]').html(descr);
}

function ItemTableAdd(is_storage, id, inventory_id, user_id, item_name, item_sell_price, item_quantity, item_tax, item_total, type, el_disable){
  var list_innerHTML = '<div class="item_element" '
  var disable = '';
  if(el_disable)
    disable = 'disabled';
  if(is_storage == 0){
    list_innerHTML += 'id="'+id+'" is_storage="0">'
  }else{
    disable = 'disabled';
    list_innerHTML += 'id="'+id+'" is_storage="'+is_storage+'" inv_id="'+inventory_id+'" user_id="'+user_id+'">'
  }
  list_innerHTML += '<hr style="margin-bottom: 10px;">'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Name')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="item_name" id="item_name" value="'+item_name+'" '+disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Price')+' ($)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="item_price" id="item_price" oninput="ChangeJobElement(this, \'item\')" value="'+item_sell_price+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Quantity')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="item_count" id="item_count" oninput="ChangeJobElement(this, \'item\')" value="'+item_quantity+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Tax')+' (%)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '<input type="text" name="item_tax" id="item_tax" oninput="ChangeJobElement(this, \'item\')" value="'+item_tax+'" '+el_disable+'>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Total')+' ($)</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  list_innerHTML += '  <input type="text" name="item_total" id="item_total" value="'+item_total+'" disabled>'
  list_innerHTML += '</div></div></div></li>'
  list_innerHTML += '<li>'
  list_innerHTML += '<div class="item-content"><div class="item-inner not-empty-state">'
  list_innerHTML += '<div class="item-title floating-label">'+gettext('Used')+'</div>'
  list_innerHTML += '<div class="item-input item-input-field">'
  if(is_storage == 1)
   list_innerHTML += '<input type="text" value="'+gettext('storage')+'" disabled>'
   if(is_storage == 2)
    list_innerHTML += '<input type="text" value="'+gettext('inventory')+'" disabled>'
  list_innerHTML += '</div></div></div></li>'
  if(type != 'Info'){
    list_innerHTML += '<li>'
    list_innerHTML += '<div class="item-content"><div class="item-inner">'
    list_innerHTML += '<div class="item t_r">'
    list_innerHTML += '<a href="#" id="del_item" onclick="DelItem(this)"><i class="fa fa-trash-o"></i></a>'
    list_innerHTML += '</div></div></div></li>'
  }
  list_innerHTML += '</div>'
  return list_innerHTML;
}

function Invoce(id, type, is_invoice, client_id, client_name) {
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/edit_invoice/';
    if(is_invoice == 0)
    tasks_url = domen + '/api/edit_estimate/';
  myApp.showIndicator();
  $$.post(tasks_url, {'token': user_token, 'for': 'invoce', 'id': id, 'type': type}, function(data){
    $$(document).on('change', '#img_inp', function()
    {
      //focus
      $$('#file_lectura').focus();
      //show value file
      var url=this.value.split("\\")
      url = this.value.split("\\")[url.length-1]
      $$('#file_lectura').val(url);
    });
    //console.log('type='+type);
    //console.log('is_invoice='+is_invoice);
    var edit_estimate = 1;
    if(type == 'New' || type == 'Generate' || type == 'Clone')
      edit_estimate = 0;
    $('#edit_estimate').val(edit_estimate);
    //console.log(data);
    var formData = JSON.parse(data);
    //console.log('formData');
    //console.log(formData);
    $('#add-new-client input[name=token]').val(user_token);
    ClienGroupSearch();
    var titlefirst = gettext('New')+' ';
    if(type == 'Edit'){
       titlefirst = gettext('Edit ');
    }else if(type == 'Info'){
      titlefirst = gettext('Info')+' ';
    }else if(type == 'Clone'){
      titlefirst = gettext('Clone')+' ';
    }else if(type == 'Generate'){
      titlefirst = gettext('Generate ');
    }
    $('#date_issued_title').html(gettext('Date Issued'));
    $('#po_number_title').html(gettext('PO Number'));
    $('#payment_terms_title').html(gettext('Payment terms (days)'));
    $('#customers_inv_title').html(gettext('Customers'));
    $('#subtotal_title').html(gettext('Subtotal'));
    $('#discount_inv_title').html(gettext('Discount'));
    $('#tax_total_inv_title').html(gettext('Tax'));
    $('#total_inv_title').html(gettext('Total'));
    $('#note_inv_title').html(gettext('note'));
    $('#images_inv_header').html(gettext('Images'));
    $('#image_upload_lable').html(gettext('Image upload'));
    $('#btn_img_save').html(gettext('Save images'));
    $('#company_signature_title').html(gettext('Company Signature'));
    $('#sigPad a.clearButton').html(gettext('Clear'));
    $('#sigPad2 a.clearButton').html(gettext('Clear'));
    $('#client_signature_title').html(gettext('Customer Signature'));
    $('#submit_bt_invoice').html(gettext('Save changes'))
    if(is_invoice == 0 && type != 'Generate'){
      $('#title_invoice').html(titlefirst+gettext('estimate'));
      $('#invoice_num_title').html(gettext('Estimate')+' №');
      $('#payment_terms').parents('li').remove();
      $('#submit_bt_invoice').attr('onclick', 'SaveInvoice(0)');
      $('#imagesform input[name=is_estimate]').val(1);
    }else{
      $('#title_invoice').html(titlefirst+gettext('invoice'));
    }
    if(!formData.error){
      //console.log(formData.error);
      //console.log(data);
      if(formData.data.is_storage){
        $('#is_storage').html(gettext('Use storage'))
        $('#is_storage').attr('type', 1)
      }else{
        $('#is_storage').html(gettext('Use inventory'))
        $('#is_storage').attr('type', 2)
      }
      var sub_total = 0,
      tax_total=0;
      $('#img_token').val(localStorage.getItem('token'));
      imgscript();
      if((type != 'Clone')&&(type != 'New')&&(type != 'Generate')){
        $$('#estimate_id').val(formData.data.document.invoice_number);
        $('#img_doc_num').val(formData.data.document.invoice_number)
      }else{
        $$('#estimate_id').val(formData.data.invoice_number);
        $('#img_doc_num').val(formData.data.invoice_number);
      }
      if(type != 'New'){
        $$('#date_issued').val(formData.data.document.date_issued);
        $$('#po_number').val(formData.data.document.po_number);
        if(formData.data.document.po_number)
          $$('#po_number').parents('div.item-inner').addClass('not-empty-state');
        $$('#payment_terms').val(formData.data.document.pay_terms);
        if(formData.data.document.pay_terms)
          $$('#payment_terms').parents('div.item-inner').addClass('not-empty-state');
        $$('#client_id').val(formData.data.client_id);
        $$('#client_name').html(formData.data.client_name);
      }else{
        $$('#date_issued').val(formData.data.date_issued);
        $$('#po_number').val('');
        $$('#payment_terms').val('');
        if(client_id){
          $$('#client_id').val(client_id);
          $$('#client_name').html(client_name);
        }else{
          $$('#client_id').val('');
          $$('#client_name').html(gettext('choose customer'));
        }
      }
      if(type=='Clone' || type=='Generate'){
        $('#images_inv_header').parents('.card').addClass('hiddend');
      }
      var el_disable = '';
      if(type == 'Info'){
        el_disable = 'disabled';
        $$('#date_issued').attr('disabled', 'disabled');
        $$('#po_number').attr('disabled', 'disabled');
        $$('#payment_terms').attr('disabled', 'disabled');
        $$('#client_name').attr('disabled', 'disabled');
      }
      if((formData.data.jobs) || type != 'Info'){
        var empty = ''
        var list_innerHTML = '<li class="card">'
        list_innerHTML += '<div class="card-header invheder">'+gettext('Items')+'</div>'
        list_innerHTML += '<div class="card-content">'
        list_innerHTML += '<div class="card-content-inner">'
        list_innerHTML += '<ul id="job_list" style="padding-left:0px;">'
        if(formData.data.jobs)
          for (var i = 0; i < formData.data.jobs.length; i++) {
            sub_total += formData.data.jobs[i].item_total;
            tax_total += formData.data.jobs[i].item_total * formData.data.jobs[i].item_taxes / 100;
            /*if (i > 0)
              list_innerHTML += '<hr style="margin-bottom: 10px;">'*/
            list_innerHTML += JobTableAdd(formData.data.jobs[i].id, formData.data.jobs[i].item_name, formData.data.jobs[i].item_rate, formData.data.jobs[i].item_quantity,
              formData.data.jobs[i].item_taxes, formData.data.jobs[i].item_total, formData.data.jobs[i].item_description, type, el_disable);

          }
        list_innerHTML += '</ul>'
        list_innerHTML += '</div></div></div>'
        if(type != 'Info'){
          list_innerHTML += '<div class="card-footer">'
          list_innerHTML += '<a href="#" id="add_job" onclick="PopupInvJob();" class="button button-round button-fill color-orange">+ '+gettext('Item')+'</a>'
          list_innerHTML += '</div>'
        }
        list_innerHTML += ''
        list_innerHTML += '</li>'
        $$('#jobBlock').html(list_innerHTML);
      }
      if((type != 'Info')||(formData.data.items)){
        var list_innerHTML = '<li class="card">'
        list_innerHTML += '<div class="card-header invheder">'+gettext('Materials')+'</div>'
        list_innerHTML += '<div class="card-content">'
        list_innerHTML += '<div class="card-content-inner">'
        list_innerHTML += '<ul id="item_list" style="padding-left:0px;">'
        if(formData.data.items){
          for (var i = 0; i < formData.data.items.length; i++) {
            sub_total += formData.data.items[i].item_total;
            list_innerHTML += ItemTableAdd(formData.data.items[i].is_storage, formData.data.items[i].id, formData.data.items[i].inventory_id,
              formData.data.items[i].user_id, formData.data.items[i].item_name, formData.data.items[i].item_sell_price, formData.data.items[i].item_quantity,
              formData.data.items[i].item_taxes, formData.data.items[i].item_total, type, el_disable);
          }
        }
        list_innerHTML += '</ul>'
        list_innerHTML += '</div>'
        if(type != 'Info'){
          list_innerHTML += '<div class="card-footer">'
          list_innerHTML += '<a href="#" id="add_item" onclick="PopupInvItem();" class="button button-round button-fill color-orange">+ '+gettext('Materials')+'</a>'
          list_innerHTML += '</div>'
        }
        list_innerHTML += '</div>'
        list_innerHTML += '</li>'
        $$('#consumablesBlock').html(list_innerHTML);
      }
      $$('#sub-total').html('$'+sub_total.toFixed(2));
      $$('#tax-total').html('$'+tax_total.toFixed(2));
      var discount = 0;
      var discount_val = 0;
      var discount_type ='$';
      var discount_num = 0;
      if(type != 'New'){
        discount_val = formData.data.document.discount_value;
        if(!$.isNumeric(discount_val))
          discount_val = 0;
        if (!formData.data.document.discount_type){
          discount = discount_val;
          discount_type = '$';
        }else{
          discount_type = '%';
          discount_num = 1;
          discount = sub_total *  discount_val / 100;
        }
      }
      if(type != 'Info'){
        $$('#discount').html('<a href="" onclick="PopupDiscount()">'+discount_val.toFixed(2)+discount_type+'</a>')
        .attr('val', discount_val.toFixed(2))
        .attr('type', discount_num);
      }else{
        $$('#discount').html(discount_val.toFixed(2)+discount_type)
        .attr('val', discount_val.toFixed(2))
        .attr('type', discount_num);
      }
      var toal=sub_total + tax_total - discount
      $$('#total').html('$'+parseFloat(toal).toFixed(2));
      $$('#note').val(formData.data.document.note);
      $('#list_deletet_images_title').html(gettext('Will be deleted after saving'));
      $('#upload_images_list_title').html(gettext('Loaded images'));

      var list_innerHTML = '<div class="content-block inset" style="width:100%" id="photo_list">'
      if((formData.data.images)&&(type != 'Clone')&&(type != 'Generate')){
        console.log(formData.data);
        for (var i = 0; i < formData.data.images.length; i++) {
          list_innerHTML += '<div class="row" imageid="'+domen+formData.data.images[i].id+'"><div class="col-90" style="padding-top: 7px;">'
          list_innerHTML += '<img src="'+domen+formData.data.images[i].filepath+'" class="" width="200px">'
          list_innerHTML += '</div><div class="col-10 t_b">'
          list_innerHTML += '<a href="#deleted_images" class="color-orange" onclick="ModalDeleteImage('+domen+formData.data.images[i].id+')">X</a>'
          list_innerHTML += '</div></div>'
        }
      }else{
        $('#loaded_images').addClass('hiddend')
      }
      list_innerHTML += '</div>'
      $$('#upload_images_list').html(list_innerHTML);

      if(type == 'Info'){
        $$('#note').attr('disabled', 'disabled');
        $$('#submit').remove();
        $$('#submit_bt_invoice').remove();
        if(formData.data.images){
          $$('#imagesform').remove();
        }else{
          $$('#imagesform').parents('.card').remove();
        }
      }
      autosize(document.querySelectorAll('textarea'));

    if(type != 'Info'){
      /*
      var client_sig = formData.data.document.signature_client;
      var employee_sig = formData.data.document.signature_company;
      client_sig = client_sig.replace(/&quot;/gi, '"');
      employee_sig = employee_sig.replace(/&quot;/gi, '"');
      $('#sigPad').signaturePad({drawOnly:true}).regenerate(employee_sig);
      $('#sigPad2').signaturePad({drawOnly:true}).regenerate(client_sig);*/
      $('#sigPad').signaturePad({drawOnly:true});
      $('#sigPad2').signaturePad({drawOnly:true});
      $$('#company_signature').remove();
      $$('#client_signature').remove();
    }else{
      if(formData.data.employee_sign){
        $('#company_signature').attr('src', domen+formData.data.employee_sign);
        $('#company_signature').parents('.card').find('.clearButton').remove();
      }else{
        $('#company_signature').parents('.card').remove();
      }
      if(formData.data.client_sign){
        $('#client_signature').attr('src', domen+formData.data.client_sign);
        $('#client_signature').parents('.card').find('.clearButton').remove();
      }else{
        $('#client_signature').parents('.card').remove();
      }
    }

    $$('#date_issud').val(formData.data.document.date_issued);

    //myApp.formFromJSON('#invoce-form', formData.data);
    myApp.hideIndicator();
  }else{
    myApp.hideIndicator();
    //console.log(formData.message);
     myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+formData.message
    });
    if(is_invoice == 1){
      //myApp.mainView.back()
      myApp.mainView.loadPage(pages_url+'/pages/invoices.html');
    }else{
      //myApp.mainView.back()
      myApp.mainView.loadPage(pages_url+'/pages/estimates.html');
  }
    $('#title_invoice').html(gettext('Error'));
    var html='<a href="#" class="back link button button-fill button-round">'+gettext('Back')+'</a>'
    $('#content_invoice').attr('style', 'padding-top: 23px;').html(html);
    if(is_invoice == 1){
      setTimeout(function(){ myApp.mainView.reloadPage(pages_url+"/pages/invoices.html"); }, 1000);
    }else{
      setTimeout(function(){ myApp.mainView.reloadPage(pages_url+"/pages/estimates.html"); }, 1000);
    }
  }

    });
}

function PopupDiscount(){
  var val = $$('#discount').attr('val');
  var type = $$('#discount').attr('type');
  $('#discount_val').val(val);
  if(type==1){
    $('#discount_type_1').removeClass('button-fill').removeClass('color-orange').addClass('button-raised')
    $('#discount_type_2').removeClass('button-raised').addClass('color-orange').addClass('button-fill')
    $('#discount_type').prop( "checked", true );
  }else{
    $('#discount_type_2').removeClass('button-fill').removeClass('color-orange').addClass('button-raised')
    $('#discount_type_1').removeClass('button-raised').addClass('color-orange').addClass('button-fill')
    $('#discount_type').prop( "checked", false );
  }
  myApp.popup('.popup-discount');
}

function ChangeDiscount(type){
  if(type==1){
    $('#discount_type_1').removeClass('button-fill').removeClass('color-orange').addClass('button-raised')
    $('#discount_type_2').removeClass('button-raised').addClass('color-orange').addClass('button-fill')
    $('#discount_type').prop( "checked", true );
  }else{
    $('#discount_type_2').removeClass('button-fill').removeClass('color-orange').addClass('button-raised')
    $('#discount_type_1').removeClass('button-raised').addClass('color-orange').addClass('button-fill')
    $('#discount_type').prop( "checked", false );
  }
}

function AddDiscount(){
  var type = $('#discount_type').prop("checked");
  var val = parseFloat($('#discount_val').val());
  if(!$.isNumeric(val))
    val = 0;
  if(type){
    if(val > 100)
      val = 100;
    $$('#discount').html('<a href="" onclick="PopupDiscount()">'+val.toFixed(2)+'%</a>')
    .attr('val', val.toFixed(2))
    .attr('type', 1);
  }else{
    $$('#discount').html('<a href="" onclick="PopupDiscount()">'+val.toFixed(2)+'$</a>')
    .attr('val', val.toFixed(2))
    .attr('type', 0);
  }
  myApp.closeModal('.popup-discount');
  ChangeJobElement();
}

function PopupInvJob(){
  $('#job_title').html(gettext('Choose item'));
  $('#job_select_title').html(gettext('Items'));
  $('#job_select_after').html('');
  $('#job_select').val('');
  var tasks_url = domen + '/api/item.json/';
  $$.post(tasks_url, {'token': user_token, 'for': 'select'}, function(data){
    var formData = JSON.parse(data);
    //console.log(formData);
    $('#job_select').empty()
    for (var i = 0; i < formData.length; i++) {
      $('#job_select')
        .append('<option value="'+formData[i].id+'">'+formData[i].text+'</option>')
    }
  });
  $('#btn_add_job').html(gettext('add item')).attr('onclick', 'AddJob()');
  $('#btn_new_job').html(gettext('new item')).attr('onclick', 'NewJob()');
  myApp.popup('.popup-add-job');
}

function PopupInvItem(){
  $('#job_title').html(gettext('Choose material'));
  $('#job_select_title').html(gettext('Materials'));
  $('#job_select_after').html('');
  $('#job_select').val('');
  var tasks_url = domen + '/api/item.json';
  $$.post(tasks_url, {'token': user_token, 'for': 'select_inv'}, function(data){
    var formData = JSON.parse(data);
    console.log(formData);
    $('#job_select').empty()
    for (var i = 0; i < formData.length; i++) {
      $('#job_select')
        .append('<option value="'+formData[i].id+'">'+formData[i].text+'</option>')
    }
  });
  $('#btn_add_job').html(gettext('add material')).attr('onclick', 'AddItem()');
  $('#btn_new_job').html(gettext('new material')).attr('onclick', 'NewItem()');
  myApp.popup('.popup-add-job');
}



function ChangeJobElement(obj, type){
  if(obj){
    if(type == 'job'){
      var job = $(obj).parents('.job_element');
      if($(obj).attr('name') != 'job_tax'){
        TotalInJob(job);
      }else{
        var tax = job.find('input[name="job_tax"]').val();
        if(!tax || !$.isNumeric(tax))
          tax = 0;
        for (var i = 0; i < $('.job_element').length; i++) {
          $('.job_element').eq(i).find('input[name="job_tax"]').val(tax);
          TotalInJob($('.job_element').eq(i), tax);
        }
      }
    }else{
      var item = $(obj).parents('.item_element');
      if($(obj).attr('name') != 'item_tax'){
        TotalInItem(item);
      }else{
        var tax = item.find('input[name="item_tax"]').val();
        if(!tax || !$.isNumeric(tax))
          tax = 0;
        for (var i = 0; i < $('.item_element').length; i++) {
          $('.item_element').eq(i).find('input[name="item_tax"]').val(tax);
          TotalInItem($('.item_element').eq(i), tax);
        }
      }
    }
  }
  var taxsum = 0;
  for (var i = 0; i < $('.job_element').length; i++) {
    taxsum += parseFloat($('.job_element').eq(i).find('input[name="job_total"]').val()) * parseFloat($('.job_element').eq(i).find('input[name="job_tax"]').val())/100;
  }
  for (var i = 0; i < $('.item_element').length; i++) {
    taxsum += parseFloat($('.item_element').eq(i).find('input[name="item_total"]').val()) * parseFloat($('.item_element').eq(i).find('input[name="item_tax"]').val())/100;
  }
  $('#tax-total').html('$'+parseFloat(taxsum).toFixed(2));
  var total = 0;
  var subtotal = 0;
  for (var i = 0; i < $('.job_element').length; i++) {
    subtotal += parseFloat($('.job_element').eq(i).find('input[name="job_total"]').val());
  }
  for (var i = 0; i < $('.item_element').length; i++) {
    subtotal += parseFloat($('.item_element').eq(i).find('input[name="item_total"]').val());
  }
  var discount = 0;
  if(type != 'New'){
    if ($('#discount').attr('type') == 0){
      discount = parseFloat($('#discount').attr('val'));
    }else{
      discount = subtotal * parseFloat($('#discount').attr('val')) / 100;
    }
  }
  $('#sub-total').html('$'+parseFloat(subtotal).toFixed(2));
  var toal=subtotal + taxsum - discount;
  $('#total').html('$'+parseFloat(toal).toFixed(2));
}


function TotalInJob(job, tax){
  var rate = job.find('input[name="job_rate"]').val();
  if(!rate || !$.isNumeric(rate))
    rate = 0;
  job.find('input[name="job_rate"]').val(rate);
  var count = job.find('input[name="job_count"]').val();
  if(!count || !$.isNumeric(count))
    count = 0;
  job.find('input[name="job_count"]').val(count);
  var total = rate * count;
  job.find('input[name="job_total"]').val(total);
  if(tax){
    if(!tax || !$.isNumeric(tax))
      tax = 0;
    job.find('input[name="job_tax"]').val(tax);
  }
  job.find('div[name="heder_job_total"]').html('$'+total)
}

function TotalInItem(item, tax){
  var price = item.find('input[name="item_price"]').val();
  if(!price || !$.isNumeric(price))
    price = 0;
  item.find('input[name="item_price"]').val(price);
  var count = item.find('input[name="item_count"]').val();
  if(!count || !$.isNumeric(count))
    count = 0;
  item.find('input[name="item_count"]').val(count);
  var total = price * count;
  item.find('input[name="item_total"]').val(total);
  if(tax){
    if(!tax || !$.isNumeric(tax))
      tax = 0;
    item.find('input[name="item_tax"]').val(tax);
  }
}


function AddJob(){
  $('#btn_add_job').attr('disabled', 'disabled');
  var select_id=$('#job_select').val();
  if(select_id){
    tasks_url = domen + '/api/item_json';
    $$.post(tasks_url, {'token': user_token, 'id': select_id, 'for': 'select'}, function(data){
      var formData = JSON.parse(data);
      //console.log(formData);
      $('#btn_add_job').attr('disabled', false);
      if(!formData.error){
        var rate = formData.item.rate;
        var tax = $('#job_tax').val();
        if(!tax)
          tax = 0;
        var list_innerHTML = JobTableAdd(formData.item.id, formData.item.name, rate, 1, tax, rate, formData.item.description, 'type');
        $$('#job_list').append(list_innerHTML);
        autosize(document.querySelectorAll('textarea'));
        myApp.closeModal('.popup-add-job');
        ChangeJobElement();
      }else{
        myApp.addNotification({
            title: gettext('Error'),
            message: formData.message
        });
      }
    });
  }
}

function NewJob(){
  var select_id=$('#job_select').val();
  if(select_id){
      var tax = $('#job_tax').val();
      if(!tax)
        tax = 0;

        /*var modal = myApp.modal({
          title:  gettext('New job'),
          text: '<div class="list-block inputs-list"><ul><li>'+
            '<div class="item-content"><div class="item-inner">'+
            '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Name')+'</div>'+
            '<div class="item-input item-input-field">'+
            '<input name="name" type="text" maxlength="30">'+
            '</div></div></div></li>'+
            '<li>'+
            '<div class="item-content"><div class="item-inner">'+
            '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Description')+'</div>'+
            '<div class="item-input item-input-field">'+
            '<input name="description" type="text" maxlength="30">'+
            '</div></div></div></li>'+
            '<li>'+
            '<div class="item-content"><div class="item-inner not-empty-state">'+
            '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Rate')+'($)</div>'+
            '<div class="item-input item-input-field">'+
            '<input name="rate" type="text" value="0" maxlength="30">'+
            '</div></div></div></li>'+
            '<li>'+
            '<div class="item-content"><div class="item-inner not-empty-state">'+
            '<div class="item-title floating-label" id="cansel_eq_amount_title">'+gettext('Quantity')+'($)</div>'+
            '<div class="item-input item-input-field">'+
            '<input name="quantity" type="text" value="1" maxlength="30">'+
            '</div></div></div></li>'+
            '</ul></div>',
          buttons: [
            {
              text: gettext('CLOSE'),
            },
            {
              text: gettext('Add job'),
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
                }else{
                  myApp.addNotification({
                     message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('wrong amount')
                 });
                }
              }
            },
          ]
        });*/

      var list_innerHTML = JobTableAdd(0, '', 0, 1, tax, 0, '', 'type');
      $$('#job_list').append(list_innerHTML);
      autosize(document.querySelectorAll('textarea'));
      myApp.closeModal('.popup-add-job');
      ChangeJobElement();
  }
}

function AddItem(){
  var select_id=$('#job_select').val();
  if(select_id){
    $('#btn_add_job').attr('disabled', 'disabled');
    tasks_url = domen + '/api/item_json';
    $$.post(tasks_url, {'token': user_token, 'id': select_id}, function(data){
      var formData = JSON.parse(data);
      //console.log(formData);
      $('#btn_add_job').attr('disabled', false);
      if(!formData.error){
        var is_storage = $('#is_storage').attr('type');
        var price = formData.item.sell_price;
        var tax = $('#item_tax').val();
        if(!tax)
          tax = 0;
        var list_innerHTML = ItemTableAdd(is_storage, 0, formData.item.inventory_id,
          formData.item.user_id, formData.item.item_name, price, 1, tax, price, 'type', '');
        $$('#item_list').append(list_innerHTML);
        autosize(document.querySelectorAll('textarea'));
        myApp.closeModal('.popup-add-job');
        ChangeJobElement();
      }else{
        myApp.addNotification({
            title: gettext('Error'),
            message: formData.message
        });
      }
    });
  }
}

function NewItem(){
  var select_id=$('#job_select').val();
  if(select_id){
      var tax = $('#item_tax').val();
      if(!tax)
        tax = 0;
      var list_innerHTML = ItemTableAdd(0, 0, '', '', '', 0, 1, tax, 0, 'type', '');
      $$('#item_list').append(list_innerHTML);
      autosize(document.querySelectorAll('textarea'));
      myApp.closeModal('.popup-add-job');
      ChangeJobElement();
  }
}



function DelJob(obj){
  myApp.confirm(gettext('Are you sure?'), gettext('Delete job'), function () {
    $(obj).parents('.job_element').remove();
    ChangeJobElement();
  });
}

function DelItem(obj){
  myApp.confirm(gettext('Are you sure?'), gettext('Delete item'), function () {
    $(obj).parents('.item_element').remove();
    ChangeJobElement();
  });
}

function SaveInvoice(type){
  var edate = $('#date_issued').val();
  var cid = $('#client_id').val();
  if (edate == ""){
      myApp.addNotification({
          title: gettext('Error'),
          message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter date.')
      });
      return;
  }

  if (cid == "") {
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please choose client.')
      });
      return;
  }
  var jobs_len = $('.job_element').length;
  var consumables_len = $('.item_element').length;
  if(jobs_len + consumables_len == 0){
    myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please add job.')
    });
    return;
  }
  for (var i = 0; i < jobs_len; i++) {
    if($('.job_element').eq(i).find('input[name="job_name"]').val() == ''){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Job name can\'t be empty.')
      });
      return;
    }
    var j_rate = parseFloat($('.job_element').eq(i).find('input[name="job_rate"]').val());
    if((j_rate == NaN) || (j_rate <= 0)){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Job rate must be more then 0.')
      });
      return;
    }
    var j_count = parseFloat($('.job_element').eq(i).find('input[name="job_count"]').val());
    if ((j_count == NaN) || (j_count < 0)){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Job quantity must be more then 0.')
      });
      return;
    }
    var j_tax = parseFloat($('.job_element').eq(i).find('input[name="job_tax"]').val());
    if ((j_tax < 0)){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Job tax must be >= 0.')
      });
      return;
    }
  }
  for (var i = 0; i < consumables_len; i++) {
    if($('.item_element').eq(i).find('input[name="item_name"]').val() == ''){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Item name can\'t be empty.')
      });
      return;
    }
    var i_price = parseFloat($('.item_element').eq(i).find('input[name="item_price"]').val());
    if((i_price == NaN) || (i_price < 0)){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Item price must be more then 0.')
      });
      return;
    }
    var i_count = parseFloat($('.item_element').eq(i).find('input[name="item_count"]').val());
    if ((i_count == NaN) || (i_count <= 0)){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Item quantity must be more then 0.')
      });
      return;
    }
  }
  var discount_type = $('#discount').attr('type')
  var discount_val = parseFloat($('#discount').attr('val'))
  if(discount_val < 0){
    myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Discount must be >= 0.')
    });
    return;
  }
  if(discount_type == 0){
    if( discount_val > parseFloat($('#total').val()) ){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Discount must be less then total.')
      });
      return;
    }
  }else{
    if(discount_val > 100){
      myApp.addNotification({
          message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Discount must be less then 100%.')
      });
      return;
    }
  }
  if($('.item_element[is_storage!=0]').length > 0){
    if(type == 0){
      $('#btn_save_inv_est').attr('onclick', 'SaveEstimate(true, "close")')
    }else{
      $('#btn_save_inv_est').attr('onclick', 'SaveEstimate(false, "close")')
    }
    myApp.popup('.popup-use-inventory');
  }else{
    if(type == 1){
      SaveEstimate(false);
    }else{
      SaveEstimate(true);
    }
  }
}

function SaveEstimate(estimate, modal){
    if (estimate) {
        var postUrl = domen+'/api/update_estimate/';
        var redirectUrl = pages_url+'/pages/estimates.html';
    }
    else {
        var postUrl = domen+'/api/update_invoice/';
        var redirectUrl = pages_url+'/pages/invoices.html';
    }
    var error = false;
    if(modal)
      myApp.closeModal('.popup-use-inventory');
    var enumber = $('input[name=estimate_id]').val(); // Номер естімейту
    var edate = $('input[name=date_issued]').val(); // Дата створення
    var epo = $('input[name=po_number]').val(); // ПО номер
    if(!$.isNumeric(epo))
      epo = '';
    var cid = $('input[name=client_id]').val(); // ІД клієнта
    var job_ids = []; // масив ІД типів робіт
    var job_names =[]; // масив назв робіт
    var job_rates = []; // масив цін за одиницю роботи
    var job_descriptions = []; // масив описів до робіт
    var job_counts = []; // масив обєму виконанних робіт
    var job_totals = []; //масив сумарних вартостей по кожній роботі
    var job_tax = 0;

    var jobs_len = $('.job_element').length;
    var consumables_len = $('.item_element').length;
    for (var i = 0; i < jobs_len; i++) {
      var $tr = $('.job_element').eq(i);
      job_names.push($tr.find('input[name="job_name"]').val());
      job_ids.push($tr.attr('job_id'));
      job_tax = parseFloat($tr.find('input[name=job_tax]').val());
      job_totals.push(parseFloat($tr.find('input[name=job_total]').val()));
      job_counts.push($tr.find('input[name=job_count]').val());
      job_rates.push($tr.find('input[name=job_rate]').val());
      job_descriptions.push($tr.find('textarea[name=job_description]').val());
    }

    var consumables_ids = []; // масив ІД витратних матеріалів
    var consumables_inventory_ids = []; // масив ІД inventory or storage
    var consumables_user_ids = []; // масив user id
    var consumables_is_storage = []; // масив inventory or storage
    var consumables_names = []; // масив назв витраних матеріалів
    var consumables_sell_price = []; // масив цін витратних матеріалів
    var consumables_count = []; // масив кількості витрачених витратних матеріалів
    var consumables_total = []; //

    for (var i = 0; i < consumables_len; i++) {
      var $row = $('.item_element').eq(i);
      consumables_ids.push($row.attr('id'));
      if($row.attr('inv_id')){
        consumables_inventory_ids.push($row.attr('inv_id'));
      }else{
        consumables_inventory_ids.push(-1);
      }
      if($row.attr('user_id')){
        consumables_user_ids.push($row.attr('user_id'));
      }else{
        consumables_user_ids.push(-1);
      }
      var stor = $row.attr('is_storage');
      stor = stor ? stor : 0;
      consumables_is_storage.push(stor);
      var c_count = parseFloat($row.find('input[name=item_count]').val());
      consumables_count.push(c_count);
      consumables_names.push($row.find('input[name=item_name]').val());
      consumables_total.push(parseFloat($row.find('input[name=item_total]').val()));
      var item_price = parseFloat($row.find('input[name=item_price]').val());
      consumables_sell_price.push(item_price);
    }

    var len = job_names.length;
    if ((job_ids.length != len) && (job_counts.length != len) && (job_rates.length != len) && (job_descriptions.length != len)) {
        myApp.addNotification({
            message: '<p style="color:red;"><b>Error<b></p>Please fill all fields in job items'
        });
        return;
    }
    var len = consumables_names.length;
    if ((consumables_ids.length != len) && (consumables_count.length != len) && (consumables_sell_price.length != len)) {
        myApp.addNotification({
            message: '<p style="color:red;"><b>Error<b></p>Please fill all fields in consumables items.'
        });
        return;
    }
    if ((job_names.length == 0) && (consumables_names.length == 0)){
        myApp.addNotification({
            message: '<p style="color:red;"><b>Error<b></p>Please add to estimate job or consumables.'
        });
        return;
    }
    var client_signature = $('input[name=client-signature]').val(); // підпис клієнта
    var employee_signature = $('input[name=company-signature]').val(); // підпис працівника
    var estimate_note = $('textarea#note').val(); // Примітка до естімейту
    var discount_percent = $('#discount').attr('type'); // тип знижки true - %, false - $
    if(discount_percent == 1){
      discount_percent = true;
    }else{
      discount_percent = false;
    }
    if ( $('#discount').attr('val') == "")
        var discount_value = 0; // Значення знижки у % або у $
    else
        var discount_value = parseFloat( $('#discount').attr('val'));
    var subtotal = parseFloat($('#sub-total').html().substr(1)); // Сума робіт і витратних матеріалів без врахування податку і знижок
    var total = parseFloat($('#total').html().substr(1)); // Сума з урахуванням податків і знижок
    var tax_total = parseFloat($('#tax-total').html().substr(1)); // Сума податків по всіх роботах
    var images_list = $('input[name=images_list]').val();
    var delete_images_list = $('input[name=delete_images_list]').val();
    var images_saved = $('#imagesform button#btn_img_save').attr('disabled');
    var edit_estimate = $('input[name=edit_estimate]').val();
    if (!images_saved) {
        var fList = $('input#img_inp').prop('files');
        if (fList.length > 0) {
            error = true;
            if(estimate)
              alert(gettext('Please save images before saving estimate.'));
            else
              alert(gettext('Please save images before saving invoice.'));
        }
        else
            error = false;
    }
      if($('#is_storage').attr('type') == 2){
      var use_storage = false;
    }else{
      var use_storage = true;
    }
    var paymentTerm = 0;
    if(!estimate)
      paymentTerm = $('#payment_terms').val();
      if(!$.isNumeric(paymentTerm))
        paymentTerm = '';
    if (!error) {
        var tasks_url = postUrl;
        var user_token = localStorage.getItem('token');
        var data = {
          'token': user_token,
          'num': enumber,
          'date': edate,
          'po': epo,
          'cid': cid,
          'payment_terms': paymentTerm,
          'job_ids[]': job_ids.toString(),
          'job_names[]': job_names.toString(),
          'job_rates[]': job_rates.toString(),
          'job_descriptions[]': job_descriptions.toString(),
          'job_counts[]': job_counts.toString(),
          'job_totals[]': job_totals.toString(),
          'job_tax': job_tax,
          'consumables_ids[]': consumables_ids.toString(),
          'consumables_inventory_ids[]': consumables_inventory_ids.toString(),
          'consumables_user_ids[]': consumables_user_ids.toString(),
          'consumables_is_storage[]': consumables_is_storage.toString(),
          'consumables_names[]': consumables_names.toString(),
          'consumables_price[]': consumables_sell_price.toString(),
          'consumables_count[]': consumables_count.toString(),
          'consumables_totals[]': consumables_total.toString(),
          'client_signature': client_signature,
          'employee_signature': employee_signature,
          'note': estimate_note,
          'discount_percent': discount_percent,
          'discount_value': discount_value,
          'subtotal': subtotal,
          'tax': tax_total,
          'total': total,
          'images_list': images_list,
          'delete_images_list': delete_images_list,
          'edit_estimate': edit_estimate,
          'edit_invoice': edit_estimate,
          'use_storage': use_storage
        }
        //console.log('save data');
        //console.log(data);
        $$.post(tasks_url, data, function(data){
          var data = JSON.parse(data)
          //console.log(data.message);
                if (!data.error) {
                    if (data.notify) {
                        console.log(data.message);
                    }
                    if (estimate) {
                      $('#estimates_table').DataTable().ajax.reload();
                      myApp.mainView.back();
                      //myApp.mainView.reloadPage(redirectUrl);
                    }
                    else {
                      if(myApp.invoice_type_back == 3){
                        $('#invoices_dashboard_table').DataTable().ajax.reload();
                        myApp.mainView.back();
                      }else{
                        $('#invoices_table').DataTable().ajax.reload();
                        myApp.mainView.back();
                        //myApp.mainView.reloadPage(redirectUrl);
                      }
                    }
                }
                else {
                  myApp.addNotification({
                      message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>' + data.message
                  });
                }
            });
    }
}

function imgscript(){
  var imgList = $('#div_container');
  var fileInput = $('#img_inp');
  // рендеринг изображения
  fileInput.bind({
      change: function() {
        $('#div_container').html(null);
        displayFiles(this.files);
      }
    });
  function displayFiles(files) {
      $.each(files, function(i, file) {
        if (!file.type.match(/image.*/)) {
          // Отсеиваем не картинки
          return true;
        }
        // Создаем элемент li и помещаем в него название, миниатюру и progress bar,
        // а также создаем ему свойство file, куда помещаем объект File (при загрузке понадобится)
        var li = $('<li/>').appendTo(imgList);
        $('<div/>').text(file.name).appendTo(li);
        var img = $('<img/>'+'\r').appendTo(li);
        $('<a href="#div_container" onclick="displayFilesClear()"/>').text('X').appendTo(li);
        //if ($('#container li').length>=4)
        li.get(0).file = file;

        // Создаем объект FileReader и по завершении чтения файла, отображаем миниатюру и обновляем
        // инфу обо всех файлах
        var reader = new FileReader();
        reader.onload = (function(aImg) {
          return function(e) {
            aImg.attr('src', e.target.result);
            aImg.attr('width', 150);
            /* ... обновляем инфу о выбранных файлах ... */
          };
        })(img);

        reader.readAsDataURL(file);
      });
      }
}

function SaveImagesAvatar(){
  //e.preventDefault();
  $('#imagesform button#btn_img_save').attr('disabled', true);
  var vars= new FormData($('#imagesform')[0]);
  /*for (var value of vars.values()) {
   console.log(value);
  }
  console.log('vars');
  console.log(vars);*/
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/uavatar/';
  //console.log('$(#img_inp).val()='+$('#img_inp').val());
  if($('#img_inp').val() != ''){
    $$.ajax({
     type: 'POST',
     url: tasks_url,
     data: vars,
     success: function(data)
     {
       //console.log(data);
       data = JSON.parse(data);
       if(!data.error){
         $('input[name=images_list]').val(data.images);
         $('#upload_img_anim').hide();
         var ids = data.images;
         for (i = 0; i < ids.length; i++) {
           $('#div_container a').eq(i).attr('onclick', 'ModalDeleteImage('+ids[i]+', true)')
             .attr('imageid', ids[i]);
         }
         $('#img_inp').attr('disabled', true);
         $('#lable_img_inp').attr('disabled', true);
         myApp.addNotification({
             message: '<p style="color:green;">'+gettext('Download complete')
         });
       }else{
         myApp.addNotification({
             message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
         });
         $('#imagesform button#btn_img_save').attr('disabled', false);
       }
     },
     error: function(e)
     {
        console.log(e);
        myApp.addNotification({
            message: '<p style="color:red;"><b>'+('Error')+'<b></p>'+gettext('Please select another image')
        });
        $('#imagesform button#btn_img_save').attr('disabled', false);
     }
 });
  }else{
    $('#imagesform button#btn_img_save').attr('disabled', false);
    myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please save images before saving')
    });
  }
}

function SaveImages(){
  //e.preventDefault();
  $('#imagesform button#btn_img_save').attr('disabled', true);
  var vars= new FormData($('#imagesform')[0]);
  /*for (var value of vars.values()) {
   console.log(value);
  }
  console.log('vars');
  console.log(vars);*/
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/img_upload';
  //console.log('$(#img_inp).val()='+$('#img_inp').val());
  if($('#img_inp').val() != ''){
    $$.ajax({
     type: 'POST',
     url: tasks_url,
     data: vars,
     success: function(data)
     {
       //console.log(data);
       data = JSON.parse(data);
       if(!data.error){
         $('input[name=images_list]').val(data.images);
         $('#upload_img_anim').hide();
         var ids = data.images;
         for (i = 0; i < ids.length; i++) {
           $('#div_container a').eq(i).attr('onclick', 'ModalDeleteImage('+ids[i]+', true)')
             .attr('imageid', ids[i]);
         }
         $('#img_inp').attr('disabled', true);
         $('#lable_img_inp').attr('disabled', true);
         myApp.addNotification({
             message: '<p style="color:green;">'+gettext('Download complete')
         });
       }else{
         myApp.addNotification({
             message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
         });
         $('#imagesform button#btn_img_save').attr('disabled', false);
       }
     },
     error: function(e)
     {
        console.log(e);
        myApp.addNotification({
            message: '<p style="color:red;"><b>'+('Error')+'<b></p>'+gettext('Please select another image')
        });
        $('#imagesform button#btn_img_save').attr('disabled', false);
     }
 });
  }else{
    $('#imagesform button#btn_img_save').attr('disabled', false);
    myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please save images before saving')
    });
  }
}


function AddNewClient(){
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/new_client/';
  var vars= new FormData($('#add-new-client')[0]);

  var f_name = $('#add-new-client input[name=first_name]').val();
  var l_name = $('#add-new-client input[name=last_name]').val();
  var phone = $('#add-new-client input[name=phone]').val();
  if(f_name.length>0 && l_name.length>0 && phone.length>0 ){
    $$.post(tasks_url, vars, function(data){
      var fromData = JSON.parse(data);
      //console.log(fromData);
      if(!fromData.error){
        $('#client_id').val(fromData.id);
        $('#client_name').html(fromData.client_name);
        myApp.closeModal('.popup-choose-client');
      }else{
        console.log(fromData.message);
      }
    });
  }
}

function AddChoosedClient(){
  var id = $('#client_select').val();
  if(id){
    $('#client_id').val(id);
    $('#client_name').html($('#client_select :selected').text());
    myApp.closeModal('.popup-choose-client');
  }else{
    myApp.alert(gettext('Please select customer.'));
  }
}

function PoupClient(){
  //console.log('cl.id='+$('#client_id').val());
  myApp.popup('.popup-choose-client');
}

function ClienGroupSearch() {
  var autocompleteStandaloneAjax = myApp.autocomplete({
      openIn: 'popup', //open in page
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
      },
      onOpen: function(autocomplete){
        $('.autocomplete-popup a.close-popup')
          .removeClass('close-popup')
          .attr('onclick', 'myApp.closeModal(".autocomplete-popup");');
      }
  });

  var tasks_url = domen + '/api/clients.json/';
  $$.post(tasks_url, {'token': user_token, 'for': 'select'}, function(data){
    var formData = JSON.parse(data);
    //console.log('sel client');
    //console.log(formData);
    $('#client_select').empty();
    var str = '<optgroup label="'+gettext('Clients')+'">';
    for (var i = 0; i < formData.clients.length; i++) {
      str += '<option value="'+formData.clients[i].id+'">'+formData.clients[i].text+'</option>';
    }
    str += '</optgroup>';
    if(formData.c_companys){
      str += '<optgroup label="'+gettext('Companys')+'">';
      for (var i = 0; i < formData.c_companys.length; i++) {
        str += '<option value="'+formData.c_companys[i].id+'">'+formData.c_companys[i].text+'</option>';
      }
      str += '</optgroup>';
    }
    $('#client_select').append(str);
  });
  $('#btn_add_job').html('add job').attr('onclick', 'AddJob()');
  $('#btn_new_job').html('new job').attr('onclick', 'NewJob()');
}


function Pdfload(id, is_invoice){
  myApp.invoice_id = id;
  myApp.is_invoice = is_invoice;
  myApp.mainView.loadPage(pages_url+"/pages/invoice_pdf.html");
}


function SendtoEmail(type){
  $('#send_pdf_to_email_title').html(gettext('Send')+' '+type+' '+gettext('to email'));
  //$('#send_to_email').val('')
  myApp.popup('.popup-send-pdf');
}

function validateEmail($email) {
 var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
 return emailReg.test( $email );
}

function SendPdftoEmail(){
  var user_token = localStorage.getItem('token');
  var tasks_url = domen + '/api/doc_to_email/';
  var email = $('#send_to_email').val();
  if( !validateEmail(email)) {
    myApp.alert(gettext('Please enter a valid email address.'));
    return
  }
  myApp.showIndicator();
  var doc_type = $('#iframePdf input[name=doc_type]').val();
  var doc_path = $('#iframePdf input[name=doc_path]').val();
  $$.post(tasks_url, {'token': user_token, 'doc_type': doc_type, 'doc_path': doc_path, 'email': email}, function(data){
    var formData = JSON.parse(data);
    if(!formData.error){
      myApp.addNotification({
          message: '<p style="color:green;"><b>'+gettext('Successfully sent.')+'</b></p>'
      });
      myApp.closeModal('.popup-send-pdf');
    }else{
      //console.log(data);
      myApp.alert(fromData.message)
    }
    myApp.hideIndicator();
  });
}

function ModalDeleteImage(id, type){
  myApp.confirm(gettext('Are you sure?'), gettext('Delete image'), function () {
    if(type){
      $('#div_container a[imageid='+id+']').parents('li').find('img').addClass('sepia');
      var myDiv2Para = $('#div_container a[imageid='+id+']').parents('li').find('img').detach();
      myDiv2Para.appendTo('#list_deletet_images');
      $('#div_container a[imageid='+id+']').parents('li').remove();
      if($('#div_container img').length == 0){
        $('input[name=images_list]').val('');
        $('#div_container').html('');
        $('form#imagesform button#btn_img_save').attr('disabled', false);
        $('#img_inp').attr('disabled', false);
        $('#img_inp').val('');
        $('#lable_img_inp').attr('disabled', false);
      }else{
        var list_id = $('input[name=images_list]').val();
        list_id = list_id.split(',');
        var index = list_id.indexOf(id.toString());
        if(index != -1)
            list_id.splice( index, 1 );
        list_id = list_id.join();
        //console.log(list_id);
        $('input[name=images_list]').val(list_id)
      }
    }else{
      $('#photo_list div[imageid='+id+'] a[href="#deleted_images"]').attr('onclick', 'ModalCancelDeleteImage('+id+')');
      $('#photo_list div[imageid='+id+'] img').addClass('sepia');
      var myDiv2Para = $('#photo_list div[imageid='+id+']').detach();
      myDiv2Para.appendTo('#list_deletet_images');
    }
    if ($('#upload_images_list img').length == 0) {
      $('#loaded_images').addClass('hiddend');
    }
    $('#deleted_images').removeClass('hiddend');
    var list_id = $('#delete_images_list').val();
    if(list_id != ''){
      list_id = list_id.split(',');
      if(!list_id.includes(id))
        list_id.push(id)
      list_id = list_id.join();
    }else{
      list_id = id;
    }
    //console.log(list_id);
    $('#delete_images_list').val(list_id)
  });
}

function ModalCancelDeleteImage(id) {
  myApp.confirm(gettext('Are you sure?'), gettext('Cancel delete image'), function () {
    $('#list_deletet_images div[imageid='+id+'] a[href="#deleted_images"]').attr('onclick', 'ModalDeleteImage('+id+')');
    $('#list_deletet_images div[imageid='+id+'] img').removeClass('sepia');
    var myDiv2Para = $('#list_deletet_images div[imageid='+id+']').detach();
    myDiv2Para.appendTo('#photo_list');
    if ($('#list_deletet_images img').length == 0) {
      $('#deleted_images').addClass('hiddend');
    }
    $('#loaded_images').removeClass('hiddend');
    var list_id = $('#delete_images_list').val();
    list_id = list_id.split(',');
    var index = list_id.indexOf(id.toString());
    if(index != -1)
        list_id.splice( index, 1 );
    list_id = list_id.join();
    //console.log(list_id);
    $('#delete_images_list').val(list_id);
  });
}

function displayFilesClear() {
  $('#img_inp').val('');
  $('#div_container').html('');
  $('#file_lectura').val('');
}

function PopupInvPay(id, type){
  $('#job_title').html(gettext('Choose item'));
  $('#job_select_title').html(gettext('Items'));
  var tasks_url = domen + '/api/get_pay_data/';
  var user_token = localStorage.getItem('token');
  $('#show_pay_info').html('');
  $('#est_id').val(id);
  $$.post(tasks_url, {'token': user_token, 'id': id}, function(data){
    //console.log(data);
      data = JSON.parse(data);
      var res = parseFloat(data.total) - parseFloat(data.pay);
      //console.log(res);
      var dt = data.list_pay;
      var html = '';
      if(dt){
        for (var i=0; i < dt.length; i++){
          $('#inv_payed').html('$'+parseFloat(data.pay).toFixed(2));
          html+="<div class='card' name='payment'>";
          html+="<div class='card-content'>";
          html+='<div class="card-content-inner">';
          html+="<p id='pay_minus'>$"+parseFloat(data.list_pay[i].sum).toFixed(2)+"</p>";
          html+="<p class='color-gray' id='who_add_pay'>"+data.list_pay[i].who+"</p>";
          html+='<p class="color-gray">'+data.list_pay[i].date+'/'+gettext(data.list_pay[i].pay_met)+'</p></div>';
          if (data.list_pay[i].refund == 0){
            html+="</div><div class='card-footer no-border'><a href='#' onclick='Refund(this,"+type+")'>"+gettext("REFUND")+"</a></div>";
          }else {
            html+="</div><div class='card-footer no-border'><a href='#' class='color-gray'>"+gettext("REFUNDED")+"</a></div>";
          }
          html+="</div>";
        }
      }
      $('#to_pay').html('<b>'+gettext('Due')+'</b> '+'$'+'<span id="all_pay">'+parseFloat(res).toFixed(2)+'</span>');
      $('#inv_payed').html('$'+parseFloat(data.pay).toFixed(2));
      $('#inv_total').html('$'+parseFloat(data.total).toFixed(2));
      $('#body_payments').html(html);
      $('#formGroupInputLarge').val('');
      if ($('#formGroupInputLarge-error'))
        $('#formGroupInputLarge-error').remove();

      if ($('#all_pay').html()=='0.00'){
          $('#add_pay_knwev').hide()
      }else {
          $('#add_pay_knwev').show()
      }
      var pr_per_bar = 100 - parseFloat(parseFloat(data.pay)/parseFloat(data.total)*100).toFixed(2);
      $('#progress_bar span').attr('style', 'transform: translate3d(-'+pr_per_bar+'%, 0px, 0px)');
      //console.log(pr_per_bar);
  })
  var today = moment().format('YYYY-MM-DD');
  $("#new_pay_day").val(today);
  myApp.popup('.popup-add-pay');
}


function AddPayments(type){
  myApp.addPaymentsType = type;
  console.log('AddPayments_type='+type);
  var val_pay = $('#formGroupInputLarge').val();
  $('#pay_sel').change(function(){
       $('#pay_sel option:selected').each(function(){
   if ($('#formGroupInputLarge-error'))
     $('#formGroupInputLarge-error').remove();
   if ($('#pay_sel option:selected').val()=='2'){
     $('#formGroupInputLargeTitle').html('%');
     $('#formGroupInputLarge').val(100)
  }
  if ($('#pay_sel option:selected').val()=='1'){
    $('#formGroupInputLargeTitle').html('<i class="fa fa-usd"></i>');
    var val = 1;
    if(parseFloat($('#all_pay').html()).toFixed(2) == 0)
     val = 0;
    $('#formGroupInputLarge').val(val);
  }
  if ($('#pay_sel option:selected').val()=='3'){

      $('#formGroupInputLarge').val(parseFloat($('#all_pay').html()).toFixed(2))
  }
       })
  });
  $.validator.addMethod("valpayment", function(value, element) {
    var val_pay = parseFloat($('#formGroupInputLarge').val());
    var val_pay_sel = $('#pay_sel option:selected').val();
    var to_pay = parseFloat($('#all_pay').html());
    if ($('#formGroupInputLarge-error'))
      $('#formGroupInputLarge-error').remove();
    if( val_pay_sel == 1 || val_pay_sel == 3){
      if (val_pay > 0 && val_pay <= to_pay){
        return true;
      }else{ return false; }
    }else if(val_pay_sel == 2){
      if (val_pay > 0 && val_pay <= 100){
        return true;
      }else{ return false; }
    }else return false;
  }, " This field is required");

  $.removeData('#form-payment','validator');
  $('#form-payment').validate({
      rules: {
            formGroupInputLarge: { valpayment : true,
            number: true },
        },
      submitHandler: function (form) {
    var id = $('#est_id').val();
    var to_pay = $('#all_pay').html();
    var val_pay = $('#formGroupInputLarge').val();
    var val_pay_sel = $('#pay_sel option:selected').val();
    var date = $('#new_pay_day').val();
    var val_pay_method = $('#pay_method option:selected').val();
    var check_number = $('#check_number').val();
    var tasks_url = domen + '/api/payment/';
    var user_token = localStorage.getItem('token');
    var all_pay = $('#all_pay').html();
    var inv_total = $('#inv_total').html().substring(1);
    $$.post(tasks_url, {
      'token': user_token,
      'id': id,
      'val_pay': val_pay,
      'val_pay_sel': val_pay_sel,
      'date': date,
      'val_pay_method': val_pay_method,
      'to_pay': to_pay,
      'check_number': check_number}, function(data)
      {
          //console.log(data);
          console.log('type='+type+'myPtype='+myApp.addPaymentsType);
          if(myApp.addPaymentsType == 1){
            $('#invoices_table').DataTable().ajax.reload();
          }else if(myApp.addPaymentsType == 3){
            $('#payments_dashboard_table').DataTable().ajax.reload();
            $('#invoices_dashboard_table').DataTable().ajax.reload();
          }else{
            $('#payments').DataTable().ajax.reload();
          }
          myApp.addNotification({
              message: '<p style="color:green;"><b>'+gettext('Payment successful.')+'</b></p>'
          });
          myApp.closeModal('.popup-add-pay');
      })
      return false;
    }
  });

}

function Refund(obj, type){
    var id = $('#est_id').val();
    var val = $(obj).parents('div.card[name=payment]').find('#pay_minus').html().substring(1);
    //console.log(parseFloat(val));
    var tasks_url = domen + '/api/refund/';
    var user_token = localStorage.getItem('token');
    $$.post(tasks_url, {'token': user_token, 'id': id, 'val': parseFloat(val)}, function(data){
      data = JSON.parse(data);
      if(!data.error){
        //console.log('data.id='+data.id);
        var payed = parseFloat(data.value) + parseFloat($('#all_pay').html());
        var minus_val = parseFloat($('#inv_payed').html().substring(1)-val);
        $('#inv_payed').html('$'+ parseFloat(minus_val).toFixed(2));
        $('#all_pay').html(parseFloat(payed).toFixed(2));
        $(obj).parents('div.card[name=payment]').find($('#pay_minus').html("-$"+val));
        $(obj).parents('div.card[name=payment]').find($('#who_add_pay').html(data.who));
        $(obj).parents('div.card[name=payment]').find('a').attr('onclick','');
        $(obj).parents('div.card[name=payment]').find('a').addClass('color-gray').html(''+gettext("REFUNDED"));
        var pr_per_bar = 100-(parseFloat($('#inv_payed').html().substring(1)).toFixed(2)/parseFloat($('#inv_total').html().substring(1)).toFixed(2))*100;
        $('#progress_bar span').attr('style', 'transform: translate3d(-'+pr_per_bar+'%, 0px, 0px)');
        //console.log('type='+type+' payed='+parseFloat(payed).toFixed(2)+' inv_total='+parseFloat($('#inv_total').html().substring(1)).toFixed(2));
        if(type == 1 && parseFloat(payed).toFixed(2) == parseFloat($('#inv_total').html().substring(1)).toFixed(2)){
          $('#invoices_table').DataTable().ajax.reload();
        }else if(type == 3){
          $('#payments_dashboard_table').DataTable().ajax.reload();
          $('#invoices_dashboard_table').DataTable().ajax.reload();
        }else{
            $('#payments').DataTable().ajax.reload();
        }
      }else{
        myApp.addNotification({
           message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
        });
      }

    })
}

function InvoceIdload(id){
  myApp.invoice_page_id = id;
  myApp.mainView.loadPage(pages_url+"/pages/invoice_id.html");
}

var columns_invoices = [{
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

function InvocesPage(tasks_url){
  $$('#title_name').html(gettext('Invoices'));
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
            data:{'token': user_token, 'for': 'list'},
            complete: function() {
                AddPayments(1);
            },
    },
    "columns": columns_invoices,
    //responsive: true
    });
    $('#invoice_history_btn').html('<i class="fa fa-book"></i> '+gettext('Invoices history'));
}


function searhInvoices(data, search){
  var form = $$('form#search-invoices');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#page_title').html(gettext('Invoices'));
  $('#search_invoices').html('<i class="fa fa-search"></i> '+gettext('Search invoices'));
  $('#serch_invoices_user_title').html(gettext('User'));
  $('#serch_invoices_customers_title').html(gettext('Customers'));
  $('#serch_invoices_status_title').html(gettext('Status'));
  $('#serch_invoices_ignore_date_text').html(gettext('Date ignore'));
  $('#serch_invoices_date_range_title').html(gettext('Date'));
  $('#serch_invoices_item_title').html(gettext('Item'));
  $('#search-invoices a.item-link.smart-select[data-searchbar-placeholder]').attr('data-searchbar-placeholder', gettext('Search'));
  $('#search-invoices a.item-link.smart-select').attr('data-picker-close-text', gettext('Close'));
  $('#serch_invoices_payment_method_title').html(gettext('Payment Method'));
  $('#serch_invoices_price_title').html('<i class="fa fa-usd" aria-hidden="true"></i> '+gettext('Amount'));
  $('#serch_invoices_m_price_title').html(gettext('Amount is'));
  $('#serch_invoices_materials_title').html(gettext('Materials'));
  $('#btn_search_invoices').html(gettext('Search'));
  $('#btn_close_search_invoices').html(gettext('Clear'));

  $$('#search-payments').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });
  if(!search){
    var calendarRange = myApp.calendar({
      input: '#serch_invoices_date_range',
      dateFormat: 'yyyy/mm/dd',
      value: [
        Date.parse(new Date()),
        Date.parse(new Date()),
      ],
      rangePicker: true
    });
  }else{
    var date_range = myApp.searchInvoices_date;
    var calendarRange = myApp.calendar({
      input: '#serch_invoices_date_range',
      dateFormat: 'yyyy/mm/dd',
      value: [
        Date.parse(date_range.split(' - ')[0]),
        Date.parse(date_range.split(' - ')[1]),
      ],
      rangePicker: true
    });
    $('#serch_invoices_date_range').val(date_range);
  }
  //users
  if(search && myApp.searchInvoices_user){
    TaskRA(data, '#serch_invoices_user', myApp.searchInvoices_user.map(Number), '#serch_invoices_user_after');
  }else{
    TaskRA(data, '#serch_invoices_user');
  }
  //clients
  var clients_str = '';
  var select = '';
  if(data.customers){
    clients_str = '<optgroup label="'+gettext('Clients')+'">';
    for (var i = 0; i < data.customers.length; i++) {
      if(search && myApp.searchInvoices_clients){
        if (myApp.searchInvoices_clients.map(Number).indexOf(data.customers[i].id) >= 0){
          select = 'selected';
        }else{ select = ''; }
      }
      clients_str += '<option value="'+data.customers[i].id+'" '+select+'>'+data.customers[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  if(data.customer_companys){
    clients_str += '<optgroup label="'+gettext('Companys')+'">';
    for (var i = 0; i < data.customer_companys.length; i++) {
      if(search && myApp.searchInvoices_clients){
        if (myApp.searchInvoices_clients.map(Number).indexOf(data.customer_companys[i].id) >= 0){
          select = 'selected';
        }else{ select = ''; }
      }
      clients_str += '<option value="'+data.customer_companys[i].id+'" '+select+'>'+data.customer_companys[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  $('#serch_invoices_customers').html(clients_str);
  //status
  var invoice_status_str = '';
  for (var i = 0; i < data.status.length; i++) {
    if(search && myApp.searchInvoices_status){
      if (myApp.searchInvoices_status.map(Number).indexOf(data.status[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_status_str += '<option value="'+data.status[i].id+'" '+select+'>'+data.status[i].text+'</option>';
  }
  $('#serch_invoices_status').html(invoice_status_str);
  //item
  var invoice_item_str = '';
  for (var i = 0; i < data.inv_item.length; i++) {
    if(search && myApp.searchInvoices_items){
      if (myApp.searchInvoices_items.map(Number).indexOf(data.inv_item[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_item_str += '<option value="'+data.inv_item[i].id+'" '+select+'>'+data.inv_item[i].text+'</option>';
  }
  $('#serch_invoices_item').html(invoice_item_str);
  //amoind is
  var sel1 = '';
  var sel2 = '';
  var sel3 = '';
  if(search){
    if(myApp.searchInvoice_amount)
      $('#serchinvoices_price').parents('div.item-inner').addClass('not-empty-state');
    if(myApp.searchInvoices_amount_is == 'lte'){
      sel1 = 'selected';
    }else if(myApp.searchInvoices_amount_is == 'equal'){
      sel2 = 'selected';
    }else{
      sel3 = 'selected';
    }
  }else{
    sel1 = 'selected';
    sel2 = '';
    sel3 = '';
  }
  var p_price_str = '<option value="lte" '+sel1+'>'+gettext('Less')+'</option>';
  p_price_str += '<option value="equal" '+sel2+'>'+gettext('Equal')+'</option>';
  p_price_str += '<option value="gte" '+sel3+'>'+gettext('More')+'</option>';
  $('#serch_invoices_m_price').html(p_price_str);
  if(search){
    $('#serch_invoices_m_price').val(myApp.searchInvoices_amount_is);
  }else{
    $('#serch_invoices_m_price').val('lte');
    $('#serch_invoices_m_price_after').html(gettext('Less'));
  }
  //materials
  var invoice_materials_str = '';
  for (var i = 0; i < data.inv_material.length; i++) {
    if(search && myApp.searchInvoices_materials){
      if (myApp.searchInvoices_materials.map(Number).indexOf(data.inv_material[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_materials_str += '<option value="'+data.inv_material[i].id+'" '+select+'>'+data.inv_material[i].text+'</option>';
  }
  $('#serch_invoices_materials').html(invoice_materials_str);
  //payment method
  var payment_method_str = '';
  for (var i = 0; i < data.payment_methods.length; i++) {
    if(search && myApp.searchInvoices_payment_method){
      if (myApp.searchInvoices_payment_method.indexOf(data.payment_methods[i].name) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    payment_method_str += '<option value="'+data.payment_methods[i].name+'" '+select+'>'+data.payment_methods[i].name+'</option>';
  }
  $('#serch_invoices_payment_method').html(payment_method_str);

  $('form#search-invoices').validate({
      submitHandler: function(form){
        //console.log('test');
        var date_range = $('#serch_invoices_date_range').val();
        //console.log(startTime);
        if(!date_range){
          myApp.addNotification({
              title: gettext('Error'),
              message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter date.')
          });
          return false;
        }else if(date_range.length < 20){
          date_range = date_range+' - '+date_range
          $('#serch_invoices_date_range').val(date_range);
        }
        if(!user_token){
          myApp.loginScreen();
          return false;
        }
        //console.log($(form).serialize());
        myApp.search = true;
        if($('#serch_invoices_ignore_date:checked').length){
          myApp.searchInvoices_ignore_date = true;
        }else{
          myApp.searchInvoices_ignore_date = false;
        }
        myApp.searchInvoices_date = date_range;
        myApp.searchInvoices_user = $('#serch_invoices_user').val();
        myApp.searchInvoices_user_after = $('#serch_invoices_user_after').html();
        myApp.searchInvoices_clients = $('#serch_invoices_customers').val();
        myApp.searchInvoices_clients_after = $('#serch_invoices_customers_after').html();
        myApp.searchInvoices_status = $('#serch_invoices_status').val();
        myApp.searchInvoices_status_after = $('#serch_invoices_status_after').html();
        myApp.searchInvoices_items = $('#serch_invoices_item').val();
        myApp.searchInvoices_items_after = $('#serch_invoices_item_after').html();
        myApp.searchInvoice_amount = $('#serchinvoices_price').val();
        myApp.searchInvoices_amount_is = $('#serch_invoices_m_price').val();
        myApp.searchInvoices_amount_is_after = $('#serch_invoices_m_price_after').html();
        myApp.searchInvoices_materials = $('#serch_invoices_materials').val();
        myApp.searchInvoices_materials_after = $('#serch_invoices_materials_after').html();
        myApp.searchInvoices_payment_method = $('#serch_invoices_payment_method').val();
        myApp.searchInvoices_payment_method_after = $('#serch_invoices_payment_method_after').html();
        myApp.searchInvoices = true;
        var datatable = {
          'token': user_token,
          'date-range': date_range,
          'invoice-total': myApp.searchInvoice_amount,
          'p-price': myApp.searchInvoices_amount_is,
        }
        if(myApp.searchInvoices_ignore_date){
          datatable['ignore-date'] = 'on';}
        if(myApp.searchInvoices_user){
          datatable['manager-id'] = myApp.searchInvoices_user.toString();
        }
        if(myApp.searchInvoices_clients){
          datatable['client-id'] = myApp.searchInvoices_clients.toString();}
        if(myApp.searchInvoices_status){
          datatable['status-id'] = myApp.searchInvoices_status.toString();}
        if(myApp.searchInvoices_items){
          datatable['invoice-job'] = myApp.searchInvoices_items.toString();}
        if(myApp.searchInvoices_materials){
          datatable['invoice-consumables'] = myApp.searchInvoices_materials.toString();}
        if(myApp.searchInvoices_payment_method){
          datatable['payment-metod'] = myApp.searchInvoices_payment_method.toString();}

        var $table = $('table#invoices_table');
        $table.DataTable().destroy();
        //console.log(datatable);
        table = $('#invoices_table').DataTable( {
          //paging: false,
          //searching: false,
          lengthChange: false,
          //info: false,
          destroy: true,
          ordering: false,
          iDisplayLength: 3,
          "ajax": {
                  url: "/api/invoices.json?search=true",
                  type: "POST",
                  data: datatable,
                  complete: function(data) {
                    //console.log(data);
                    if(myApp.search){
                      myApp.addNotification({
                          message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' payments')+'</b></p>'
                      });
                      myApp.search = false;
                    }
                    $('div[name=hidden_search_task]').addClass('hiddend');
             },
              },
          "columns": columns_invoices,
          //responsive: true
        } );
      }
  });
}

var columns_estimats = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="swipeout">';
      r_str += '<div class="swipeout-content"><a href="#" class="item-link item-content" onclick="expandPayments(this)">';
      r_str += '<div class="item-inner"><div class="item-title-row">';
      r_str += '<div class="item-title">'+gettext('Estimate #')+row.estimate_number+'</div>';
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
      r_str += '<div class="row col-100"><div class="l_tc">'+gettext('Amount')+'</div>'+parseFloat(row.total).toFixed(2)+'</div>';
      if(row.is_active){
        r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-green' style='text-transform: uppercase'>"+gettext('active')+"</span></div>";
      }else{
        r_str += "<div class='row col-100'><div class='l_tc'>"+gettext('Active')+"</div><span class='badge bg-red' style='text-transform: uppercase'>"+gettext('inactive')+"</span></div>";
      }
      r_str += '<div class="row col-100" ><div class="l_tc">'+gettext('User')+'</div>'+row.manager+'</div>';
      r_str += '</div></div></a></div>';
      r_str += '<div class="swipeout-actions-left">';
      r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Generate\', 0)" class="bg-orange">'+gettext('Generate invoice')+'</a>'
      r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Clone\', 0)" class="bg-pink">'+gettext('Clone')+'</a>'
      r_str += '</div>'
      r_str += '<div class="swipeout-actions-right">'
      if(row.is_active){
        r_str += '<a href="#" onclick="Invoceload('+row.id+', \'Edit\', 0)" class="bg-orange">'+gettext('Edit')+'</a>'
      }else{
        r_str += '<a href="#" class="">'+gettext('Edit')+'</a>'
      }
      r_str += '<a href="#" onclick="Pdfload('+row.id+', \'estimate\')" class="bg-blue">'+gettext('Pdf')+'</a>'
      r_str += '</div></li>';
    return r_str;
  }
}];

function EstimatesPage(tasks_url){
  $$('#estimates_page_title').html(gettext('Estimates'));
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
            url: tasks_url,
            type: "POST",
            data:{'token': user_token, 'for': 'list'},
    },
    "columns": columns_estimats,
    //responsive: true
    });
}


function searhEstimates(data, search){
  var form = $$('form#search-estimates');
  form.append('<input type=\'hidden\' name=\'token\' value=\''+user_token+'\'>');
  $('#page_title').html(gettext('Invoices'));
  $('#search_estimates').html('<i class="fa fa-search"></i> '+gettext('Search estimates'));
  $('#serch_estimates_user_title').html(gettext('User'));
  $('#serch_estimates_customers_title').html(gettext('Customers'));
  $('#serch_estimates_status_title').html(gettext('Status'));
  $('#serch_estimates_ignore_date_text').html(gettext('Date ignore'));
  $('#serch_estimates_date_range_title').html(gettext('Date'));
  $('#serch_estimates_item_title').html(gettext('Item'));
  $('#search-estimates a.item-link.smart-select[data-searchbar-placeholder]').attr('data-searchbar-placeholder', gettext('Search'));
  $('#search-estimates a.item-link.smart-select').attr('data-picker-close-text', gettext('Close'));
  $('#serch_estimates_price_title').html('<i class="fa fa-usd" aria-hidden="true"></i> '+gettext('Amount'));
  $('#serch_estimates_m_price_title').html(gettext('Amount is'));
  $('#serch_estimates_materials_title').html(gettext('Materials'));
  $('#btn_search_estimates').html(gettext('Search'));
  $('#btn_close_search_estimates').html(gettext('Clear'));

  $$('#search-estimates').on('submitError', function(e){
    console.log(e.detail.xhr.response);
  });

  if(!search){
    var calendarRange = myApp.calendar({
      input: '#serch_estimates_date_range',
      dateFormat: 'yyyy/mm/dd',
      value: [
        Date.parse(new Date()),
        Date.parse(new Date()),
      ],
      rangePicker: true,
    });
  }else{
    var date_range = myApp.searchEstimates_date;
    var calendarRange = myApp.calendar({
      input: '#serch_estimates_date_range',
      dateFormat: 'yyyy/mm/dd',
      value: [
        Date.parse(date_range.split(' - ')[0]),
        Date.parse(date_range.split(' - ')[1]),
      ],
      rangePicker: true
    });
    $('#serch_estimates_date_range').val(date_range);
  }
  //users
  if(search && myApp.searchEstimates_user){
    TaskRA(data, '#serch_estimates_user', myApp.searchEstimates_user.map(Number), '#serch_estimates_user_after');
  }else{
    TaskRA(data, '#serch_estimates_user');
  }
  //clients
  var clients_str = '';
  var select = '';
  if(data.customers){
    clients_str = '<optgroup label="'+gettext('Clients')+'">';
    for (var i = 0; i < data.customers.length; i++) {
      if(search && myApp.searchEstimates_clients){
        if (myApp.searchEstimates_clients.map(Number).indexOf(data.customers[i].id) >= 0){
          select = 'selected';
        }else{ select = ''; }
      }
      clients_str += '<option value="'+data.customers[i].id+'" '+select+'>'+data.customers[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  if(data.customer_companys){
    clients_str += '<optgroup label="'+gettext('Companys')+'">';
    for (var i = 0; i < data.customer_companys.length; i++) {
      if(search && myApp.searchInvoices_clients){
        if (myApp.searchInvoices_clients.map(Number).indexOf(data.customer_companys[i].id) >= 0){
          select = 'selected';
        }else{ select = ''; }
      }
      clients_str += '<option value="'+data.customer_companys[i].id+'" '+select+'>'+data.customer_companys[i].name+'</option>';
    }
    clients_str += '</optgroup>';
  }
  $('#serch_estimates_customers').html(clients_str);
  //status
  var invoice_status_str = '';
  select = '';
  for (var i = 0; i < data.status.length; i++) {
    if(search && myApp.searchEstimates_status){
      if (myApp.searchEstimates_status.map(Number).indexOf(data.status[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_status_str += '<option value="'+data.status[i].id+'" '+select+'>'+data.status[i].text+'</option>';
  }
  $('#serch_estimates_status').html(invoice_status_str);
  //item
  var invoice_item_str = '';
  select = '';
  for (var i = 0; i < data.inv_item.length; i++) {
    if(search && myApp.searchEstimates_items){
      if (myApp.searchEstimates_items.map(Number).indexOf(data.inv_item[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_item_str += '<option value="'+data.inv_item[i].id+'" '+select+'>'+data.inv_item[i].text+'</option>';
  }
  $('#serch_estimates_item').html(invoice_item_str);
  //amoind is
  var sel1 = '';
  var sel2 = '';
  var sel3 = '';
  if(search){
    if(myApp.searchEstimate_amount)
      $('#serchinvoices_price').parents('div.item-inner').addClass('not-empty-state');
    if(myApp.searchEstimates_amount_is == 'lte'){
      sel1 = 'selected';
    }else if(myApp.searchEstimates_amount_is == 'equal'){
      sel2 = 'selected';
    }else{
      sel3 = 'selected';
    }
  }else{
    sel1 = 'selected';
    sel2 = '';
    sel3 = '';
  }
  var p_price_str = '<option value="lte" '+sel1+'>'+gettext('Less')+'</option>';
  p_price_str += '<option value="equal" '+sel2+'>'+gettext('Equal')+'</option>';
  p_price_str += '<option value="gte" '+sel3+'>'+gettext('More')+'</option>';
  $('#serch_estimates_m_price').html(p_price_str);
  if(search){
    $('#serch_invoices_m_price').val(myApp.searchEstimates_amount_is);
  }else{
    $('#serch_invoices_m_price').val('lte');
    $('#serch_invoices_m_price_after').html(gettext('Less'));
  }
  //materials
  var invoice_materials_str = '';
  select = '';
  for (var i = 0; i < data.inv_material.length; i++) {
    if(search && myApp.searchEstimates_materials){
      if (myApp.searchEstimates_materials.map(Number).indexOf(data.inv_material[i].id) >= 0){
        select = 'selected';
      }else{ select = ''; }
    }
    invoice_materials_str += '<option value="'+data.inv_material[i].id+'" '+select+'>'+data.inv_material[i].text+'</option>';
  }
  $('#serch_estimates_materials').html(invoice_materials_str);

  $('form#search-estimates').validate({
      submitHandler: function(form){
        //console.log('test');
        var date_range = $('#serch_estimates_date_range').val();
        //console.log(startTime);
        if(!date_range){
          myApp.addNotification({
              title: gettext('Error'),
              message:  '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+gettext('Please anter date.')
          });
          return false;
        }else if(date_range.length < 20){
          date_range = date_range+' - '+date_range
          $('#serch_estimates_date_range').val(date_range);
        }
        if(!user_token){
          myApp.loginScreen();
          return false;
        }
        myApp.search = true;
        if($('#serch_estimates_ignore_date:checked').length){
          myApp.searchEstimates_ignore_date = true;
        }else{
          myApp.searchEstimates_ignore_date = false;
        }
        myApp.searchEstimates_date = date_range;
        myApp.searchEstimates_user = $('#serch_estimates_user').val();
        myApp.searchEstimates_user_after = $('#serch_estimates_user_after').html();
        myApp.searchEstimates_clients = $('#serch_estimates_customers').val();
        myApp.searchEstimates_clients_after = $('#serch_estimates_customers_after').html();
        myApp.searchEstimates_status = $('#serch_estimates_status').val();
        myApp.searchEstimates_status_after = $('#serch_estimates_status_after').html();
        myApp.searchEstimates_items = $('#serch_estimates_item').val();
        myApp.searchEstimates_items_after = $('#serch_estimates_item_after').html();
        myApp.searchEstimate_amount = $('#serch_estimates_price').val();
        myApp.searchEstimates_amount_is = $('#serch_estimates_m_price').val();
        myApp.searchEstimates_amount_is_after = $('#serch_estimates_m_price_after').html();
        myApp.searchEstimates_materials = $('#serch_estimates_materials').val();
        myApp.searchEstimates_materials_after = $('#serch_estimates_materials_after').html();
        myApp.searchEstimates = true;
        var datatable = {
          'token': user_token,
          'date-range': date_range,
          'invoice-total': myApp.searchEstimate_amount,
          'p-price': myApp.searchEstimates_amount_is,
        }
        if(myApp.searchEstimates_ignore_date){
          datatable['ignore-date'] = 'on';}
        if(myApp.searchEstimates_user){
          datatable['manager-id'] = myApp.searchEstimates_user.toString();
        }
        if(myApp.searchEstimates_clients){
          datatable['client-id'] = myApp.searchEstimates_clients.toString();}
        if(myApp.searchEstimates_status){
          datatable['status-id'] = myApp.searchEstimates_status.toString();}
        if(myApp.searchEstimates_items){
          datatable['invoice-job'] = myApp.searchEstimates_items.toString();}
        if(myApp.searchEstimates_materials){
          datatable['invoice-consumables'] = myApp.searchEstimates_materials.toString();}
        //console.log(datatable);
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
                  url: "/api/estimates.json?search=true&",
                  type: "POST",
                  data: datatable,
                  complete: function(data) {
                    //console.log(data);
                    if(myApp.search){
                      myApp.addNotification({
                          message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' payments')+'</b></p>'
                      });
                      myApp.search = false;
                    }
                    $('div[name=hidden_search_task]').addClass('hiddend');
                  },
              },
          "columns": columns_estimats,
          //responsive: true
        } );
    }
  });
}


function loadSavedSearchInvoices(){
  $('#invoice_history_btn').html('<i class="fa fa-book"></i> '+gettext('Invoices history'));
  var ignore_date = '';
  if(myApp.searchInvoices_ignore_date)
    ignore_date = 'on';
  $('#serch_invoices_ignore_date').prop( "checked", myApp.searchInvoices_ignore_date);
  var date_range = myApp.searchInvoices_date;
  //zamorochutus
  $('#serch_invoices_date_range').val(date_range);
  var user = myApp.searchInvoices_user;
  $('#serch_invoices_user').val(user);
  $('#serch_invoices_user_after').html(myApp.searchInvoices_user_after);
  var clients = myApp.searchInvoices_clients;
  $('#serch_invoices_customers').val(clients);
  $('#serch_invoices_customers_after').html(myApp.searchInvoices_clients_after);
  var status = myApp.searchInvoices_status;
  $('#serch_invoices_status').val(status);
  $('#serch_invoices_status_after').html(myApp.searchInvoices_status_after);
  var calendarRange = myApp.calendar({
    input: '#serch_invoices_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(date_range.split(' - ')[0]),
      Date.parse(date_range.split(' - ')[1]),
    ],
    rangePicker: true
  });
  var items = myApp.searchInvoices_items;
  $('#serch_invoices_item').val(items);
  $('#serch_invoices_item_after').html(myApp.searchInvoices_items_after);

  var amount = myApp.searchInvoice_amount;
  $('#serchinvoices_price').val(amount);
  var amount_is = myApp.searchInvoices_amount_is;
  $('#serch_invoices_m_price').val(amount_is);
  $('#serch_invoices_m_price_after').html(myApp.searchInvoices_amount_is_after);
  var materials = myApp.searchInvoices_materials;
  $('#serch_invoices_materials').val(materials);
  $('#serch_invoices_materials_after').html(myApp.searchInvoices_materials_after);
  var payment_method = myApp.searchInvoices_payment_method;
  $('#serch_invoices_payment_method').val(payment_method);
  $('#serch_invoices_payment_method_after').html(myApp.searchInvoices_payment_method_after);
  var tasks_url = domen + '/api/invoices.json';



  myApp.showIndicator();
  var data = {
    'token': user_token,
    'date-range': date_range,
    'invoice-total': amount,
    'p-price': amount_is,
  }
  if(ignore_date){
    data['ignore-date'] = ignore_date;}
  if(user){
    data['manager-id'] = user.toString();
  }
  if(clients){
    data['client-id'] = clients.toString();}
  if(status){
    data['status-id'] = status.toString();}
  if(items){
    data['invoice-job'] = items.toString();}
  if(materials){
    data['invoice-consumables'] = materials.toString();}
  if(payment_method){
    data['payment-metod'] = payment_method.toString();}
  //console.log(data);

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
            url: "/api/invoices.json?search=true",
            type: "POST",
            data: data,
            complete: function(data) {
              //console.log(data);
              $('div[name=hidden_search_task]').addClass('hiddend');
       },
        },
    "columns": columns_invoices,
    //responsive: true
  } );
  var tasks_url = domen + '/api/invoices.json';
  $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
      //console.log('test1');
      data = JSON.parse(data)
      myApp.invoicesTotalPage = data.totalPage;
      myApp.invoicesTotalDebtPage = data.totalDebtPage;
      myApp.invoicesBalancePage = data.balancePage;
      AddPayments(1);
      searhInvoices(data, 'on');
      myApp.hideIndicator();
    });

}

function loadSavedSearchEstimates(){
  var ignore_date = '';
  if(myApp.searchEstimates_ignore_date)
    ignore_date = 'on';
  $('#serch_estimates_ignore_date').prop( "checked", myApp.searchEstimates_ignore_date);
  var date_range = myApp.searchEstimates_date;
  //zamorochutus
  $('#serch_estimates_date_range').val(date_range);
  var user = myApp.searchEstimates_user;
  $('#serch_estimates_user').val(user);
  $('#serch_estimates_user_after').html(myApp.searchEstimates_user_after);
  var clients = myApp.searchEstimates_clients;
  $('#serch_estimates_customers').val(clients);
  $('#serch_estimates_customers_after').html(myApp.searchEstimates_clients_after);
  var status = myApp.searchEstimates_status;
  $('#serch_estimates_status').val(status);
  $('#serch_estimates_status_after').html(myApp.searchEstimates_status_after);
  var calendarRange = myApp.calendar({
    input: '#serch_estimates_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(date_range.split(' - ')[0]),
      Date.parse(date_range.split(' - ')[1]),
    ],
    rangePicker: true
  });
  var items = myApp.searchEstimates_items;
  $('#serch_estimates_item').val(items);
  $('#serch_estimates_item_after').html(myApp.searchEstimates_items_after);

  var amount = myApp.searchEstimate_amount;
  $('#serch_estimates_price').val(amount);
  var amount_is = myApp.searchEstimates_amount_is;
  $('#serch_estimates_m_price').val(amount_is);
  $('#serch_estimates_m_price_after').html(myApp.searchEstimates_amount_is_after);
  var materials = myApp.searchEstimates_materials;
  $('#serch_estimates_materials').val(materials);
  $('#serch_estimates_materials_after').html(myApp.searchEstimates_materials_after);
  var payment_method = myApp.searchEstimates_payment_method;
  $('#serch_estimates_payment_method').val(payment_method);
  $('#serch_estimates_payment_method_after').html(myApp.searchEstimates_payment_method_after);
  var tasks_url = domen + '/api/estimates.json';



  myApp.showIndicator();
  var data = {
    'token': user_token,
    'date-range': date_range,
    'invoice-total': amount,
    'p-price': amount_is,
  }
  if(ignore_date){
    data['ignore-date'] = ignore_date;}
  if(user){
    data['manager-id'] = user.toString();
  }
  if(clients){
    data['client-id'] = clients.toString();}
  if(status){
    data['status-id'] = status.toString();}
  if(items){
    data['invoice-job'] = items.toString();}
  if(materials){
    data['invoice-consumables'] = materials.toString();}
  if(payment_method){
    data['payment-metod'] = payment_method.toString();}
  //console.log(data);

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
            url: "/api/estimates.json?search=true",
            type: "POST",
            data: data,
            complete: function(data) {
              //console.log(data);
              $('div[name=hidden_search_task]').addClass('hiddend');
       },
        },
    "columns": columns_estimats,
    //responsive: true
  } );
  var tasks_url = domen + '/api/estimates.json';
  $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
      //console.log('test1');
      data = JSON.parse(data)
      //console.log(data);
      searhEstimates(data, 'on');
      myApp.hideIndicator();
    });

}

function CleaInvoiceSearch(){
  $('form#search-invoices')[0].reset();
  $('#serch_invoices_user_after').html('');
  $('#serch_invoices_customers_after').html('');
  $('#serch_invoices_status_after').html('');
  var calendarRange = myApp.calendar({
    input: '#serch_invoices_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(new Date()),
      Date.parse(new Date()),
    ],
    rangePicker: true
  });
  $('#serch_invoices_item_after').html('');
  $('#serch_invoices_m_price_after').html(gettext('Less'));
  $('#serch_invoices_materials_after').html('');
  $('#serch_invoices_payment_method_after').html('');
  myApp.searchInvoices = '';
}

function CleaEstimeteSearch(){
  $('form#search-estimates')[0].reset();
  $('#serch_estimates_user_after').html('');
  $('#serch_estimates_customers_after').html('');
  $('#serch_estimates_status_after').html('');
  var calendarRange = myApp.calendar({
    input: '#serch_estimates_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(new Date()),
      Date.parse(new Date()),
    ],
    rangePicker: true
  });
  $('#serch_estimates_item_after').html('');
  $('#serch_estimates_m_price_after').html(gettext('Less'));
  $('#serch_estimates_materials_after').html('');
  myApp.searchEstimates = '';
}


function InvoiceHistory(){
  myApp.mainView.loadPage(pages_url+"/pages/invoce_history.html");
}

function InvocesHistoryPage(tasks_url){
  myApp.showIndicator();
  $$('#invoice_history_title_name').html(gettext('Invoices history'));
  $$('#invoice_history_search_invoices').html('<i class="fa fa-search"></i> '+gettext('Search history'));
  $$('#invoice_history_serch_invoices_user_title').html(gettext('Users'));
  $$('#invoice_history_serch_invoices_change_log').attr('placeholder', gettext('Changes Log'));
  $$('#invoice_history_serch_invoices_ignore_date_text').html(gettext('Date ignore'));
  $$('#invoice_history_serch_invoices_date_range_title').html(gettext('Date')+':');
  $$('#invoice_history_btn_search_invoices').html(gettext('Search'));
  $$('#btn_close_search_history_invoices').html(gettext('Clear'));
  var $table = $('table#invoice_history_invoices_table');
  $table.DataTable().destroy();
  table = $('#invoice_history_invoices_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 4,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token},
    },
    "columns": columns_history_invoices,
    //responsive: true
    });
    $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
      var formData = JSON.parse(data);
      console.log(formData);
      console.log(formData.director);
      TaskRA(formData, '#invoice_history_serch_invoices_user')
      var date1 = Date.parse(new Date());
      var date2 = Date.parse(new Date());
      var calendarRange = myApp.calendar({
        input: '#invoice_history_serch_invoices_date_range',
        dateFormat: 'yyyy/mm/dd',
        value: [
          date1,
          date2,
        ],
        rangePicker: true
      });
        myApp.hideIndicator();
      });
      $('form#search-invoice-history').validate({
          submitHandler: function(form){
            var date_range = $('#invoice_history_serch_invoices_date_range').val();
            //console.log(startTime);
            if(!date_range){
              date_range = Date.parse(new Date());
              date_range = date_range+' - '+date_range
              $('#invoice_history_serch_invoices_date_range').val(date_range);
            }else if(date_range.length < 20){
              date_range = date_range+' - '+date_range
              $('#invoice_history_serch_invoices_date_range').val(date_range);
            }
            if(!user_token){
              myApp.loginScreen();
              return false;
            }
            //console.log($(form).serialize());
            myApp.search = true;
            var date_ignore = '';
            if($('#invoice_history_serch_invoices_ignore_date:checked').length){
              date_ignore = 'on';
            }
            var users = $('#invoice_history_serch_invoices_user').val();
            var change_log = $('#invoice_history_serch_invoices_change_log').val();
            //myApp.searchInvoices = true;
            var datatable = {
              'token': user_token,
              'search': true,
              'date-range': date_range,
            }
            if(date_ignore){
              datatable['ignore-date'] = 'on';}
            if(users){
              datatable['employee'] = users.toString();
            }
            if(change_log){
              datatable['m-text'] = change_log;}


            myApp.showIndicator();
            var $table = $('table#invoice_history_invoices_table');
            $table.DataTable().destroy();
            //console.log(datatable);
            table = $('#invoice_history_invoices_table').DataTable( {
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
                      data: datatable,
                      complete: function(data) {
                        //console.log(data);
                        if(myApp.search){
                          myApp.addNotification({
                              message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' invoice history')+'</b></p>'
                          });
                          myApp.search = false;
                        }
                        $('div[name=hidden_search_task]').addClass('hiddend');
                        myApp.hideIndicator();
                 },
                  },
                "columns": columns_history_invoices,
              //responsive: true
            } );
          }
      });
}


var columns_history_invoices = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="accordion-item"><a href="#" class="item-link item-content">';
      r_str +='<div class="item-inner"><div class="item-title">'+row.user+'</div>';
      r_str +='<div class="item-after">'+moment(row.date).format('YYYY-MM-DD HH:mm')+'</div>';
      r_str +='</div></a><div class="accordion-item-content">';
      r_str +='<div class="content-block">';
      r_str += '<div class="row col-100">'+gettext('Changes Log')+'</div>';
      r_str += '<div class="row col-100"><div class="shot_text" style="width:100%;">';
      r_str += row.message.replace(/<a\b[^>]*>/i,"").replace(/<\/a>/i,"");
      r_str += '</div></div>'
      r_str +='</div></div></li>';
    return r_str;
  }
}];


function CleaInvoiceHistorySearch(){
  $('form#search-invoice-history')[0].reset();
  $('#invoice_history_serch_invoices_user').val('');
  $('#invoice_history_serch_invoices_user_after').html('');
  var calendarRange = myApp.calendar({
    input: '#invoice_history_serch_invoices_date_range',
    dateFormat: 'yyyy/mm/dd',
    value: [
      Date.parse(new Date()),
      Date.parse(new Date()),
    ],
    rangePicker: true
  });
}



function StorageHistoryPage(tasks_url){
  myApp.showIndicator();
  $$('#storage_history_title_name').html(gettext('Storage history'));
  $$('#storage_history_search').html('<i class="fa fa-search"></i> '+gettext('Search history'));
  $$('#storage_history_serch_user_title').html(gettext('Users'));
  $$('#storage_history_serch_change_log').attr('placeholder', gettext('Changes Log'));
  $$('#storage_history_serch_ignore_date_text').html(gettext('Date ignore'));
  $$('#storage_history_serch_date_range_title').html(gettext('Date')+':');
  $$('#storage_history_btn_search').html(gettext('Search'));
  $$('#btn_close_search_history_storage').html(gettext('Clear'));
  var $table = $('table#storage_history_table');
  $table.DataTable().destroy();
  table = $('#storage_history_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 4,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token},
    },
    "columns": columns_history_invoices,
    //responsive: true
    });
    $$.post(tasks_url, {'token': user_token, 'for': 'data'}, function(data){
      var formData = JSON.parse(data);
      console.log(formData);
      console.log(formData.director);
      TaskRA(formData, '#storage_history_serch_user')
      var date1 = Date.parse(new Date());
      var date2 = Date.parse(new Date());
      var calendarRange = myApp.calendar({
        input: '#storage_history_serch_date_range',
        dateFormat: 'yyyy/mm/dd',
        value: [
          date1,
          date2,
        ],
        rangePicker: true
      });
        myApp.hideIndicator();
      });
      $('form#search-storage-history').validate({
          submitHandler: function(form){
            var date_range = $('#storage_history_serch_date_range').val();
            //console.log(startTime);
            if(!date_range){
              date_range = Date.parse(new Date());
              date_range = date_range+' - '+date_range
              $('#storage_history_serch_date_range').val(date_range);
            }else if(date_range.length < 20){
              date_range = date_range+' - '+date_range
              $('#storage_history_serch_date_range').val(date_range);
            }
            if(!user_token){
              myApp.loginScreen();
              return false;
            }
            //console.log($(form).serialize());
            myApp.search = true;
            var date_ignore = '';
            if($('#storage_history_serch_ignore_date:checked').length){
              date_ignore = 'on';
            }
            var users = $('#storage_history_serch_user').val();
            var change_log = $('#storage_history_serch_change_log').val();
            //myApp.searchInvoices = true;
            var datatable = {
              'token': user_token,
              'search': true,
              'date-range': date_range,
            }
            if(date_ignore){
              datatable['ignore-date'] = 'on';}
            if(users){
              datatable['employee'] = users.toString();
            }
            if(change_log){
              datatable['m-text'] = change_log;}

            console.log(datatable);
            myApp.showIndicator();
            var $table = $('table#storage_history_table');
            $table.DataTable().destroy();
            //console.log(datatable);
            table = $('#storage_history_table').DataTable( {
              //paging: false,
              //searching: false,
              lengthChange: false,
              //info: false,
              destroy: true,
              ordering: false,
              iDisplayLength: 4,
              "ajax": {
                      url: tasks_url,
                      type: "POST",
                      data: datatable,
                      complete: function(data) {
                        //console.log(data);
                        if(myApp.search){
                          myApp.addNotification({
                              message: '<p style="color:green;"><b>'+gettext('Firnd ')+data.responseJSON.data.length+gettext(' storage history')+'</b></p>'
                          });
                          myApp.search = false;
                        }
                        $('div[name=hidden_search_task]').addClass('hiddend');
                        myApp.hideIndicator();
                 },
                  },
                "columns": columns_history_invoices,
              //responsive: true
            } );
          }
      });
}


function GroupCustomers(){
  myApp.mainView.loadPage(pages_url+"/pages/group_customers.html");
}


function GroupCustomersPage(tasks_url){
  myApp.showIndicator();
  var $table = $('table#group_customers_table');
  $table.DataTable().destroy();
  table = $('#group_customers_table').DataTable( {
    //paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 4,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token, 'for': 'table'},
            complete: function() {
              myApp.hideIndicator();
            },
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.group_id);
    },
    "columns": groups_custopmers_colums,
    //responsive: true
    });
}

var groups_custopmers_colums = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str +='<li class="swipeout">';
      r_str +='<div class="swipeout-content item-content">';
      r_str += '<div class="row col-100" style="margin:0 10px;"><div class="l_tc"> '+row.group_name+'</div>';
      r_str += row.count_clients+' </div></div>'
      r_str += '<div class="swipeout-actions-left">';
      r_str += '<a href="#" onclick="group_customers_info('+row.group_id+')" class="bg-blue">'+gettext('Info')+'</a>'
      r_str += '</div>'
      r_str += '<div class="swipeout-actions-right">'
      r_str += '<a href="#" onclick="group_customers_edit('+row.group_id+')" class="bg-orange">'+gettext('Edit')+'</a>'
      r_str += '<a href="#" onclick="DelGroup('+row.group_id+')" class="bg-red">'+gettext('Delete')+'</a>'
      r_str += '</div></div></li>';
    return r_str;

  }
}];


function group_customers_info(id){
  var row = $('table#group_customers_table tr[id='+id+']');
  var table = $('#group_customers_table').DataTable();
  var row_info = table.row( row ).data();
  myApp.group_custumer_info_id = id;
  myApp.group_custumer_info_name = row_info.group_name;
  myApp.mainView.loadPage(pages_url+"/pages/group_customer_info.html");
}

function group_customers_edit(id){
  myApp.group_custumer_edit_id = id;
  myApp.mainView.loadPage(pages_url+"/pages/group_customer_edit.html");
}


function GroupCustomersInfoPage(tasks_url){
  myApp.showIndicator();
  var $table = $('table#group_customers_info_table');
  $table.DataTable().destroy();
  table = $('#group_customers_info_table').DataTable( {
    paging: false,
    //searching: false,
    lengthChange: false,
    //info: false,
    destroy: true,
    ordering: false,
    iDisplayLength: 4,
    "ajax": {
            url: tasks_url,
            type: "POST",
            data:{'token': user_token, 'for': 'clients', 'gr_id': myApp.group_custumer_info_id},
            complete: function() {
              myApp.hideIndicator();
            },
    },
    fnCreatedRow: function( nRow, aData, iDataIndex ) {
        $(nRow).attr('id',aData.id);
    },
    "columns": groups_custopmers_info_colums,
    //responsive: true
    });
}

var groups_custopmers_info_colums = [{
  'render': function (data, type, row){
    //console.log(row);
    var r_str = '';
      r_str += '<li class="swipeout">';
      r_str += '<div class="swipeout-content">';
      r_str += '<a onclick="myApp.clientId=\''+row.id+'\'; myApp.mainView.loadPage(\''+pages_url+'/pages/client_info.html\');" class="item-content item-link">';
      r_str += '<div class="item-inner"><div class="item-title">'+ row.text +'</div></div>';
      r_str += '</a>';
      r_str += '</div>';
      r_str += '<div class="swipeout-actions-left">';
      r_str += '<a onclick="myApp.clientId=\''+row.id+'\'; myApp.mainView.loadPage(\''+pages_url+'/pages/edit_client.html\');" class="action1">'+gettext('Edit ')+'</a>';
      r_str += '<a href="new_invoice.html" onclick="InvocesClientload('+row.id+', 1, \''+row.text.replace(/"/g, '').replace(/'/g, '')+'\')" class="action2 bg-lightblue">'+gettext('Invoices')+'</a>';
      r_str += '<a href="new_estimate.html" onclick="InvocesClientload('+row.id+', 0, \''+row.text.replace(/"/g, '').replace(/'/g, '')+'\')" class="action3 bg-orange">'+gettext('Estimates')+'</a>';
      r_str += '</div>';
      r_str += '<div class="swipeout-actions-right">';
      r_str += '<a href="new_invoice.html" onclick="Invoceload(\'\', \'New\', 1, '+row.id+', \''+row.text.replace(/"/g, '').replace(/'/g, '')+'\')" class="action1 bg-lightblue">'+gettext('Invoice')+'</a>';
      r_str += '<a href="new_estimate.html" onclick="Invoceload(\'\', \'New\', 0, '+row.id+', \''+row.text.replace(/"/g, '').replace(/'/g, '')+'\')" class="action2 bg-orange">'+gettext('Estimate')+'</a>';
      r_str += '</div>';
      r_str += '</li>';
    return r_str;

  }
}];

function DelGroup(id){
  myApp.confirm(gettext('Are you sure?'), gettext('Delete group'), function () {
    $.post('/api/customer/group/delete', {'token': user_token, 'gid': id})
    .error(function(data){
      console.log(data.responseText);
    })
    .success(function(data){
      $('#group_customers_table').DataTable().ajax.reload();
      console.log(data);
    });
  });
}


function AddChoosedClientToGroup(){
  var cid = $('#add_new_client_select').val();
  var data =  {'token': user_token, 'grid': myApp.group_custumer_info_id, 'cid': cid}
  console.log(data);
  $.post('/api/customer/group/add_customer', {'token': user_token, 'grid': myApp.group_custumer_info_id, 'cid': cid})
  .error(function(data){
    console.log(data.responseText);
  })
  .success(function(data){
    console.log(data);
    if(!data.error){
      $('#group_customers_info_table').DataTable().ajax.reload();
      myApp.mainView.back();
      myApp.addNotification({
         message: '<p style="color:green;"><b>'+gettext('success')+'<b></p>'+data.message
     });
   }else{
     myApp.addNotification({
        message: '<p style="color:red;"><b>'+gettext('Error')+'<b></p>'+data.message
    });
   }
    console.log(data);
  });
  myApp.closeModal('.popup-choose-client');
}
