
/**
 * Created by Dev on 12.04.2016.
 */
function initJobItemsForEstimate(){
    $('#job-item-id').select2({
        ajax: {
            url: '/company/items.json?for=select',
            processResults: function(data) {
                return {
                    results: data
                }
            }
        }
    }).val(null).trigger('change');
}

function initConsumablesItemsForEstimate(){
    $('#item-id').select2({
        ajax: {
            url: '/storage/storage.json?for=select',
            processResults: function(data) {
                return {
                    results: data
                }
            }
        }
    }).val(null).trigger('change');
}

function prepareTabMyClients() {
    $('button[name=action]').attr('type', 'button').html(''+gettext("Select"));
    $('button[name=action]').attr('onclick', 'selectClientForEstOrInv(false, null)');
}

function prepareTabNewClient() {
    $('button[name=action]').attr('type', 'submit').html(''+gettext("Save"));
    $('button[name=action]').attr('onclick', '');
}

function deleteJobItem(obj) {
    var $row = $(obj).parents('tr');
    $row.next().next().remove();
    $row.next().remove();
    $row.remove();
    CalculateTotal();
    CalculateDiscount();
}

function deleteConsumablesItem(obj) {
    var $row = $(obj).parents('tr');
    $row.next().remove();
    $row.remove();
    CalculateTotal();
    CalculateDiscount();
}

function AddNewJobItem() {
    var $row = $('#job-info-template').clone().appendTo('#job_items tbody').show();
    $row.attr('id', 0);
    $row.find('input[name=job_rate]').removeAttr('disabled');
    var tax_val = $('#job-info-template input[name=job_tax]').val();
    $row.find('input[name=job_tax]').val(tax_val);
    var $row_desc = $('#job-description-template').clone().appendTo('#job_items tbody').show();
    $row_desc.attr('id', 'for_0');
    $('<tr><td colspan="5"><hr></td></tr>').appendTo('#job_items tbody');
    $('#add-job-item button[name=close]').click();
    CalculateTotal();
    CalculateDiscount();
}

function AddNewConsumablesItem() {
    var $row = $('#consumable-info-template').clone().appendTo('#consumables_items tbody').show();
    $row.attr('id', 0);
    var tax_val = $('#consumable-info-template input[name=item_tax]').val();
    $row.find('input[name=item_tax]').val(tax_val);
    $('<tr><td colspan="4"><hr></td></tr>').appendTo('#consumables_items tbody');
    $('#add-consumables-item button[name=close]').click();
    CalculateTotal();
    CalculateDiscount();
}

function ChooseJobItem() {
    var item_id = $('#job-item-id').val();
    var url = '/company/items.json?id=' + item_id;
    if (item_id){
        ajaxSetup();
        $.get(url).done(function(data){
            if (!data.error) {
                var tax_val = $('#job-info-template input[name=job_tax]').val();
                var $job_info = $('#job-info-template').clone().appendTo('#job_items tbody');
                var $job_description = $('#job-description-template').clone().appendTo('#job_items tbody');
                $job_info.find('input[name=job_name]').val(data.item.name);
                $job_info.find('input[name=job_rate]').val(data.item.rate);
                $job_info.find('input[name=job_count]').val("1");
                $job_info.find('input[name=job_tax]').val(tax_val);
                var total = parseFloat(data.item.rate) * 1 + ((parseFloat(data.item.rate) * 1)/100)*0;
                $job_info.find('input[name=job_total]').val(total.toFixed(2).toString());
                $job_info.attr('id', data.item.id);
                $job_description.find('textarea[name=job_description]').val(data.item.description);
                $job_description.attr('id', 'for_' + data.item.id);
                $job_info.show();
                $job_description.show();
                $('<tr><td colspan="5"><hr></td></tr>').appendTo('#job_items tbody');
                $('#add-job-item button[name=close]').click();
                CalculateTotal();
                CalculateDiscount();
            }
        });
    }
}

function ChooseConsumablesItem() {
    var item_id = $('#item-id').val();
    var url = '/storage/storage.json?id=' + item_id;
    if (item_id){
        ajaxSetup();
        $.get(url).done(function(data){
            if (!data.error) {
                var tax_val = $('#consumable-info-template input[name=item_tax]').val();
                var $job_info = $('#consumable-info-template').clone().appendTo('#consumables_items tbody');
                $job_info.find('input[name=item_name]').val(data.item.item_name);
                $job_info.find('input[name=item_name]').attr('disabled', true);
                $job_info.find('input[name=item_price]').val(data.item.sell_price);
                $job_info.find('input[name=item_count]').val("1");
                $job_info.find('input[name=item_tax]').val(tax_val);
                var total = parseFloat(data.item.sell_price) * 1;
                $job_info.find('input[name=item_total]').val(total.toFixed(2).toString());
                $job_info.find('span[name=used]').html(gettext("storage"));
                $job_info.find('span[name=used]').attr('isstorage', 1);
                $job_info.attr('id', data.item.id);
                $job_info.attr('inv_id', data.item.id);
                $job_info.show();
                $('<tr><td colspan="5"><hr></td></tr>').appendTo('#consumables_items tbody');
                $('#add-consumables-item button[name=close]').click();
                CalculateTotal();
                CalculateDiscount();
            }
        });
    }
}


function InvChooseConsumablesItem() {
    var item_id = $('#inv_id').val();
    var url = '/storage/storage.json?id='+item_id+'&for=inventory';
    if (item_id){
        ajaxSetup();
        $.get(url).done(function(data){
            if (!data.error) {
              console.log(data);
                var $job_info = $('#consumable-info-template').clone().appendTo('#consumables_items tbody');
                var tax_val = $('#consumable-info-template input[name=item_tax]').val();
                $job_info.find('input[name=item_name]').val(data.item.item_name);
                $job_info.find('input[name=item_name]').attr('disabled', true);
                $job_info.find('input[name=item_price]').val(data.item.sell_price);
                $job_info.find('input[name=item_count]').val("1");
                $job_info.find('input[name=item_tax]').val(tax_val);
                var total = parseFloat(data.item.sell_price) * 1;
                $job_info.find('input[name=item_total]').val(total.toFixed(2).toString());
                $job_info.find('span[name=used]').html(gettext("inventory"));
                $job_info.find('span[name=used]').attr('isstorage', 2);
                $job_info.attr('id', data.item.id);
                $job_info.attr('inv_id', data.item.id);
                $job_info.attr('user_id', data.item.user_id);
                $job_info.show();
                $('<tr><td colspan="6"><hr></td></tr>').appendTo('#consumables_items tbody');
                $('#add-consumables-item button[name=close]').click();
                CalculateTotal();
                CalculateDiscount();
            }
            else{
              console.log(data.message);
            }
        });
    }
}

function AddDiscount() {
    CalculateTotal();
    var discount = CalculateDiscount();

    if (discount.percent){
        $('#estimate-total').html('$' + discount.total.toFixed(2).toString());
        $('span#dis-value').html(discount.discount_val + '%');
        $('span#dis-type').html(null);

    }
    else{
        $('#estimate-total').html('$'+discount.total.toFixed(2).toString());
        $('span#dis-value').html(discount.discount_val);
        $('span#dis-type').html('$');
    }
    $('#discount-window button[name=close]').click();
}

function CalculateDiscount() {
    var percent = $('#discount-type').is(':checked');

    if (!$.isNumeric($('[name=discount-value]').val()))
        var val = 0;
    else
        var val = parseFloat($('input[name=discount-value]').val());

    if (percent){
        var sub_total = parseFloat($('#sub-total').html().substr(1));
        var discount = (sub_total/100) * val;
        var total = parseFloat($('#estimate-total').html().substr(1));
        if(total == 'NaN')
          total = 0;
        total -= discount;
        console.log('total='+total+' | discount='+discount);
        $('#estimate-total').html('$'+total.toFixed(2).toString());
        return {
          total: total,
          percent: percent,
          discount_val: val
        };
    }
    else{
        var discount = val;
        var total = parseFloat($('#estimate-total').html().substr(1));
        total -= discount;
        $('#estimate-total').html('$'+total.toFixed(2).toString());
        return {
          total: total,
          percent: percent,
          discount_val: val
        };
    }
}

function CalculateJobItem(obj) {
    if ($(obj).attr('name') == 'job_tax'){
        var tax_val = $(obj).val();
        $('[name=job_tax]').val(tax_val);
    }
    var $row = $(obj).parents('tr');
    try {
        if(!$.isNumeric($row.find('input[name=job_rate]').val())){
          $row.find('input[name=job_rate]').val('0');
        }
        if(!$.isNumeric($row.find('input[name=job_count]').val())){
          $row.find('input[name=job_count]').val('');
        }
        var rate = parseFloat($row.find('input[name=job_rate]').val());
        var count = parseFloat($row.find('input[name=job_count]').val());
        var total = rate*count;
        $row.find('input[name=job_total]').val(total.toFixed(2).toString());
        CalculateTotal();
        CalculateDiscount();
    }
    catch (e) {
        //alert(e.message)
        console.log(e.message);
        new PNotify({
            title: 'Error',
            text: e.message,
            type: 'error'
            })
    }
}

function CalculateConsumablesItem(obj) {
    var $row = $(obj).parents('tr');
    if ($(obj).attr('name') == 'item_tax'){
        var tax_val = $(obj).val();
        $('[name=item_tax]').val(tax_val);
    }
    try {
        if(!$.isNumeric($row.find('input[name=item_price]').val())){
          $row.find('input[name=item_price]').val('0');
        }
        if(!$.isNumeric($row.find('input[name=item_count]').val())){
          $row.find('input[name=item_count]').val('');
        }
        var price = parseFloat($row.find('input[name=item_price]').val());
        var count = parseFloat($row.find('input[name=item_count]').val());
        var total = price * count;
        $row.find('input[name=item_total]').val(total.toFixed(2).toString());
        CalculateTotal();
        CalculateDiscount();
    }
    catch (e) {
        //alert(e.message)
        console.log(e.message);
        new PNotify({
            title: 'Error',
            text: e.message,
            type: 'error'
            })
    }
}

function CalculateTotal() {
    var $job_totals = $('input[name=job_total]');
    var total = 0.0;
    var total_tax = 0.0;
    $.each($job_totals, function () {
        total = parseFloat(total) + parseFloat($(this).val());
    });
    var $job_taxes = $('input[name=job_tax]');
    $.each($job_taxes, function () {
        var tax =((parseFloat($(this).parents('tr').find('input[name=job_rate]').val()) * parseFloat($(this).parents('tr').find('input[name=job_count]').val()))/100) * parseFloat($(this).val());
        if(!tax){
          tax = 0
          if(!$.isNumeric($(this).val()))
           $(this).val('0')
        }
        total_tax += tax;
        console.log(total_tax);
    });

    var $item_taxes = $('input[name=item_tax]');
    $.each($item_taxes, function () {
        var tax =((parseFloat($(this).parents('tr').find('input[name=item_price]').val()) * parseFloat($(this).parents('tr').find('input[name=item_count]').val()))/100) * parseFloat($(this).val());
        if(!tax){
          tax = 0
          if(!$.isNumeric($(this).val()))
           $(this).val('0')
         }
        total_tax += tax;
        console.log(total_tax);
    });

    $('#tax-total').html('$' + total_tax.toFixed(2));
    console.log(total_tax);

    var consumables_total = 0.0;
    var $items_total = $('input[name=item_total]');
    $.each($items_total, function () {
        consumables_total += parseFloat($(this).val());
    });
    total += consumables_total;
    var t_html = '$' + parseFloat(total).toFixed(2).toString();
    $('#sub-total').html(t_html);

    var finall_total = 0.0;
    var sub_total = parseFloat($('#sub-total').html().substr(1));
    var tax_total = parseFloat($('#tax-total').html().substr(1));
    finall_total = sub_total + tax_total;
    $('#estimate-total').html('$'+finall_total.toFixed(2));
}

function SelectTaxForItem() {
    var obj = input_object;
    var id = $('#tax-id').val();
    if (id)
        $.get('/company/taxes.json?id='+id).done(function (data) {
           if (!data.error){
             var inputSelector = $(obj).attr('name');
               $('input[name=' + inputSelector + ']').val(data.tax.value);
               $('input[name=' + inputSelector + ']').keyup();
               //$(obj).val(data.tax.value);
               $('#window-select-tax button[name=close]').click();
               $(obj).keyup();
               $(obj).focus().select();
           }
           else {
               //alert(data.message);
               console.log(data.message);
               new PNotify({
                   title: 'Error',
                   text: data.message,
                   type: 'error'
                   })
           }
        });
    else {
       $(obj).val(0);
       $('#window-select-tax button[name=close]').click();
       $(obj).keyup();
       $(obj).focus().select();
    }
}

function SelectInInput(obj){
    $(obj).select();
}

function SetFocusInput() {
    var obj = input_object;
    $(obj).focus().select();
}

function ShowSelectTaxWindow(obj) {
    $('#tax-id').select2({
        ajax: {
            url: '/company/taxes.json?for=select',
            processResults: function(data) {
                return {
                    results: data
                }
            }
        }
    }).val(null).trigger('change');
    $('#show-select-tax').click();
    input_object = obj;
    $('button[name=select-tax]').attr('onclick',"SelectTaxForItem()");
}

function selectClientForEstOrInv(newClient, cid){
    if (!newClient)
        var id = $('#client_id').val();
    else
        var id = cid;
    if (id) {
        ajaxSetup();
        $.post('/company/get_client_info/', {cid: id})
            .success(function (data) {
                var client = JSON.parse(data);
                console.log(data);
                if (client.is_company)
                    var client_name = client.company_name;
                else
                    var client_name = client.first_name + " " + client.last_name;
                var inHTML = '';
                if ((!client.address2) || (client.address2 == 'null') || (client.address2 == 'None'))
                    if ((!client.address) || (client.address == 'null') || (client.address == 'None'))
                        inHTML += '';
                    else
                        inHTML += client.address + " <br>";
                else
                    inHTML += client.address + "<br>" + client.address2 + "<br>";

                if ((!client.city) || (client.city == 'null') || (client.city == 'None'))
                    if ((!client.state) || (client.state == 'None') || (client.state == 'null'))
                        if ((!client.zip_code) || (client.zip_code == 'None') || (client.zip_code == 'null'))
                            inHTML += "";
                        else{
                            inHTML += client.zip_code + "<br>";
                        }
                    else{
                        if ((!client.zip_code) || (client.zip_code == 'None') || (client.zip_code == 'null'))
                            inHTML += client.state + "<br>";
                        else
                            inHTML += client.state + ', ' + client.zip_code + "<br>";
                    }
                else{
                    if ((!client.state) || (client.state == 'None') || (client.state == 'null'))
                        if ((!client.zip_code) || (client.zip_code == 'None') || (client.zip_code == 'null'))
                            inHTML += client.city + "<br>";
                        else
                            inHTML += client.city + '<br>' + client.zip_code + "<br>";
                    else {
                        if ((!client.zip_code) || (client.zip_code == 'None') || (client.zip_code == 'null'))
                            inHTML += client.city + '<br>' + client.state + "<br>";
                        else
                            inHTML += client.city + "<br>" + client.state + "<br>" + client.zip_code + "<br>"
                    }
                }

                if ((!client.another_phone) || (client.another_phone == 'null') || ((client.another_phone == 'None')))
                    inHTML += client.mobile_phone + "<br>";
                else
                    inHTML += client.mobile_phone + "<br>" + client.another_phone + " <br>";
                if ((!client.email) || (client.email == 'null') || ((client.email == 'None')))
                    inHTML += "";
                else
                    inHTML += client.email;
                $('input[name=client-id]').val(client.id);
                $('#p-client-info').html(inHTML);
                $('h3#client_name').html(client_name);
                $('#addNewClient button[name=close]').click();
                $('div#add-client').hide();
                $('div#client-info').show();
            })
            .error(function (data) {
                console.log(data.responseText);
            });
    }
}

function ChangeEstimateAStatus(obj, estimate) {
    if (estimate)
        var postUrl = '/company/change_estimate_status/';
    else
        var postUrl = '/company/change_invoice_status/';
    $(obj).attr('disabled', true);
    var $tr = $(obj).parents('tr');
    var eid = $tr.attr('id');
    var $span_status = $tr.find('span[name=is-active]');
    var status = $span_status.attr('status');
    if (estimate)
        var table = $('#estimates').DataTable();
    else
        var table = $('#invoices').DataTable();
    ajaxSetup();
    if (status == 'ACTIVE'){
        $.ajax({
            type: 'POST',
            url: postUrl,
            data: {
                'eid': eid,
                'is_active': 1
            }
        })
            .success(function (data) {
                if (!data.error) {
                    $span_status.html(gettext('INACTIVE'));
                    $span_status.attr('status', 'INACTIVE');
                    $span_status.removeClass('label-success').addClass('label-danger');
                    $(obj).removeClass("btn-success fa-toggle-on").addClass('btn-danger fa-toggle-off');
                    $(obj).attr('disabled', false);
                    table.ajax.reload();
                }
                else {
                    //alert(data.message);
                    console.log(data);
                    console.log(data.message);
                    new PNotify({
                        title: 'Error',
                        text: data.message,
                        type: 'error'
                        })
                }
        })
            .error(function (data) {
                console.log(data.responseText);
        });
    }
    else{
        $.ajax({
            type: 'POST',
            url: postUrl,
            data: {
                'eid': eid,
                'is_active': 1
            }
        })
            .success(function (data) {
                if (!data.error) {
                    $span_status.html(gettext('ACTIVE'));
                    $span_status.attr('status', 'ACTIVE');
                    $span_status.removeClass('label-danger').addClass('label-success');
                    $(obj).removeClass("btn-danger fa-toggle-off").addClass('btn-success fa-toggle-on');
                    $(obj).attr('disabled', false);
                    table.ajax.reload();
                }
                else {
                    //alert(data.message);
                    console.log(data.message);
                    new PNotify({
                        title: 'Error',
                        text: data.message,
                        type: 'error'
                        })
                }
        })
            .error(function (data) {
                console.log(data.responseText);
        });
    }
}

function SaveInvoice(){
  var edate = $('input[name=estimate-date]').val(); // Дата створення
  var cid = $('input[name=client-id]').val(); // ІД клієнта
  if (edate == ""){
      error = true;
      $('input[name=estimate-date]').parent('div').addClass('has-error');
      return;
  }

  if (cid == "") {
      error = true;
      $('p#error_message').html(gettext("Please choose client."));
      $('#show-error-window').click();
      return;
  }
  var $jobs = $('table#job_items tr');
  $.each($jobs, function(idx){
      if ($(this).attr('id') != 'job-info-template' && $(this).attr('id') != 'job-description-template') {
          if ($(this).find('input[name=job_name]').val() == ''){
              error = true;
              $('p#error_message').html(gettext('Job name can\'t be empty.'));
              $('#show-error-window').click();
              throw gettext("Error")+'. '+gettext('Job name can\'t be empty.');
          }
          if ($(this).find('textarea').length == 1 || !$(this).attr('id')){
            return true;
          }
          var $tr = $(this);
          var j_count = parseFloat($tr.find('input[name=job_count]').val());
          if ((j_count == NaN) || (j_count <= 0)){
              error = true;
              $('p#error_message').html(gettext("Job quantity must be more then 0."));
              $('#show-error-window').click();
              throw gettext("Error")+'. '+gettext("Job quantity must be more then 0.");
          }
          var j_rate = $tr.find('input[name=job_rate]').val();
          if ((j_rate == NaN)){
              error = true;
              $('p#error_message').html(gettext('Job rate can\'t be empty.'));
              $('#show-error-window').click();
              throw gettext("Error")+'. '+gettext('Job rate can\'t be empty.');
          }
      }
  });
  var $items = $('input[name=item_name]');
  $.each($items, function () {
     if ($(this).parents('tr').attr('id') != 'consumable-info-template') {
         var $row = $(this).parents('tr');
         var c_count = parseFloat($row.find('input[name=item_count]').val());
         if ((c_count == NaN) || (c_count <= 0)){
          error = true;
          $('p#error_message').html(gettext('Materials count can\'t be empty or 0.'));
          $('#show-error-window').click();
          throw gettext('Materials count can\'t be empty or 0.')+' ID ' + $(this).parents('tr').attr('id');
         }
         var item_name = $(this).val();
         if (item_name == ''){
              error = true;
              $('p#error_message').html('Materials name can\'t be empty.');
              $('#show-error-window').click();
              throw 'Materials name can\'t be empty.';
         }
         var item_price = parseFloat($row.find('input[name=item_price]').val());
         if (item_price == NaN){
              error = true;
              $('p#error_message').html(gettext('Materials price can\'t be empty or 0.'));
              $('#show-error-window').click();
              throw gettext('Materials price can\'t be empty or 0.');
         }
     }
  });
  if($('#consumables_items tr').length > 1){
    $('#use_storage_modal').modal()
  }else{
    SaveEstimate(false);
  }
}

function SaveEstimate(estimate){
    if (estimate) {
        var postUrl = '/company/update_estimate/';
        var redirectUrl = '/company/estimates/';
    }
    else {
        var postUrl = '/company/update_invoice/';
        var redirectUrl = '/dashboard/';
    }
    var error = false;
    $('#use_stor_form button[name=close]')[0].click();
    var enumber = $('input[name=estimate-id]').val(); // Номер естімейту
    var edate = $('input[name=estimate-date]').val(); // Дата створення
    var epo = $('input[name=po-number]').val(); // ПО номер
    var cid = $('input[name=client-id]').val(); // ІД клієнта
    var oid = $('#o_id').val();
    if (edate == ""){
        error = true;
        $('input[name=estimate-date]').parent('div').addClass('has-error');
        return;
    }

    if (cid == "") {
        error = true;
        $('p#error_message').html(gettext("Please choose client."));
        $('#show-error-window').click();
        return;
    }

    var job_ids = []; // масив ІД типів робіт
    var job_names =[]; // масив назв робіт
    var job_rates = []; // масив цін за одиницю роботи
    var job_descriptions = []; // масив описів до робіт
    var job_counts = []; // масив обєму виконанних робіт
    var job_totals = []; //масив сумарних вартостей по кожній роботі
    var job_tax = 0;
    var item_tax = 0;
    var $jobs = $('table#job_items tr');
    $.each($jobs, function(idx){
        if ($(this).attr('id') != 'job-info-template' && $(this).attr('id') != 'job-description-template') {
            var test = 0;
            if ($(this).find('input[name=job_name]').val() == ''){
                error = true;
                $('p#error_message').html(gettext('Job name can\'t be empty.'));
                $('#show-error-window').click();
                throw gettext("Error")+'. '+gettext('Job name can\'t be empty.');
            }
            else {
              if($(this).find('input[name=job_name]').length == 1){
                if( job_names.indexOf($(this).find('input[name=job_name]').val()) == -1 )
                  test = 1;
                job_names.push($(this).find('input[name=job_name]').val());
              }
            }
            if ($(this).find('textarea').length == 1 || !$(this).attr('id')){
              return true;
            }
            var $tr = $(this);
            if ($tr.attr('id') == 0){
              var name = $tr.find('input[name=job_name]').val();
              if( test == 1 ){
                //console.log($jobs);
                //console.log($jobs.eq(idx + 1));
                var nextRow = $jobs.eq(idx + 1);
                var description = $(nextRow).find('textarea[name=job_description]').val();
                var rate = parseFloat($tr.find('input[name=job_rate]').val());
                var data = {
                  'name': name,
                  'description': description,
                  'rate': rate
                }
                ajaxSetup();
                console.log('new_item');
                $.ajax({
                    type: 'POST',
                    url: '/company/new_item/',
                    data: data,
                    success: function(data){
                        if (!data.error) {
                            data = eval(data);
                        }
                        else {
                          console.log(data.message);
                        }
                    },
                    error: function(data){
                        console.log(data.responseText);
                    }
                });
              }
            }
            job_ids.push($tr.attr('id'));
            if(parseFloat($tr.find('input[name=job_tax]').val())){
              job_tax = parseFloat($tr.find('input[name=job_tax]').val());
            }else{
              job_tax = 0;
            }
            job_totals.push(parseFloat($tr.find('input[name=job_total]').val()));
            var j_count = parseFloat($tr.find('input[name=job_count]').val());
            if ((j_count != NaN) && (j_count > 0))
                job_counts.push($tr.find('input[name=job_count]').val());
            else {
                error = true;
                $('p#error_message').html(gettext('Job quantity must be more then 0.'));
                $('#show-error-window').click();
                console.log(this);
                throw gettext("Error")+'. '+gettext("Job quantity must be more then 0.");
            }
            var j_rate = $tr.find('input[name=job_rate]').val();
            if ((j_rate != NaN))
                job_rates.push($tr.find('input[name=job_rate]').val());
            else{
                error = true;
                $('p#error_message').html(gettext('Job rate can\'t be empty.'));
                $('#show-error-window').click();
                throw gettext("Error")+'. '+gettext('Job rate can\'t be empty.');
            }
            var $next_tr = $tr.next();
            job_descriptions.push($next_tr.find('textarea[name=job_description]').val());
        }
    });
    var consumables_ids = []; // масив ІД витратних матеріалів
    var consumables_inventory_ids = []; // масив ІД inventory or storage
    var consumables_user_ids = []; // масив user id
    var consumables_is_storage = []; // масив inventory or storage
    var consumables_names = []; // масив назв витраних матеріалів
    var consumables_sell_price = []; // масив цін витратних матеріалів
    var consumables_count = []; // масив кількості витрачених витратних матеріалів
    var consumables_total = []; //
    var $items = $('input[name=item_name]');
    $.each($items, function () {
       if ($(this).parents('tr').attr('id') != 'consumable-info-template') {
           var $row = $(this).parents('tr');
           if(parseFloat($row.find('input[name=item_tax]').val())){
             item_tax = parseFloat($row.find('input[name=item_tax]').val());
           }else{
             item_tax = 0;
           }
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
           var stor = $row.find('span[name=used]').attr('isstorage');
           stor = stor ? stor : 0;
           consumables_is_storage.push(stor);
           var c_count = parseFloat($row.find('input[name=item_count]').val());
           if ((c_count != NaN) && (c_count > 0))
               consumables_count.push(c_count);
           else {
            error = true;
            $('p#error_message').html(gettext('Materials count can\'t be empty or 0.'));
            $('#show-error-window').click();
            throw gettext('Materials count can\'t be empty or 0.')+' ID ' + $(this).parents('tr').attr('id');
           }
           var item_name = $(this).val();
           if (item_name != '')
            consumables_names.push(item_name);
           else {
                error = true;
                $('p#error_message').html(gettext('Materials name can\'t be empty.'));
                $('#show-error-window').click();
                throw gettext('Materials name can\'t be empty.');
           }
           var item_price = parseFloat($row.find('input[name=item_price]').val());
           consumables_total.push(parseFloat($row.find('input[name=item_total]').val()));
           if (item_price != NaN)
               consumables_sell_price.push(item_price);
           else {
                error = true;
                $('p#error_message').html(gettext('Materials price can\'t be empty or 0.'));
                $('#show-error-window').click();
                throw gettext('Materials price can\'t be empty or 0.');
           }
       }
    });
    var len = job_names.length;
    console.log('job_ids.length='+job_ids.length+' len='+len);
    if ((job_ids.length != len) && (job_counts.length != len) && (job_rates.length != len) && (job_descriptions.length != len)) {
        error = true;
        $('p#error_message').html(gettext('Please fill all fields in job items.'));
        $('#show-error-window').click();
        return;
    }
    var len = consumables_names.length;
    if ((consumables_ids.length != len) && (consumables_count.length != len) && (consumables_sell_price.length != len)) {
        error = true;
        $('p#error_message').html(gettext('Please contact with support.'));
        $('#show-error-window').click();
        return;
    }
    if ((job_names.length == 0) && (consumables_names.length == 0)){
        error = true;
        $('p#error_message').html(gettext('Please add to estimate job or materials'));
        $('#show-error-window').click();
        return;
    }
    var client_signature = $('input[name=client-signature]').val(); // підпис клієнта
    var employee_signature = $('input[name=company-signature]').val(); // підпис працівника
    var estimate_note = $('textarea#note').val(); // Примітка до естімейту
    var discount_percent = $('#discount-type').is(':checked'); // тип знижки true - %, false - $
    if ($('[name=discount-value]').val() == "")
        var discount_value = 0; // Значення знижки у % або у $
    else
        var discount_value = parseFloat($('input[name=discount-value]').val());
    var subtotal = parseFloat($('#sub-total').html().substr(1)); // Сума робіт і витратних матеріалів без врахування податку і знижок
    var total = parseFloat($('#estimate-total').html().substr(1)); // Сума з урахуванням податків і знижок
    var tax_total = parseFloat($('#tax-total').html().substr(1)); // Сума податків по всіх роботах
    var images_list = $('input[name=images_list]').val();
    var delete_images_list = $('input[name=delete_images_list]').val();
    var images_saved = $('form#images button#save').attr('disabled');
    var edit_estimate = $('input[name=edit_estimate]').val();
    if (!images_saved) {
        var fList = $('input#img_inp').prop('files');
        if (fList.length > 0) {
            error = true;
            if(estimate){
              //alert('Please save images before saving estimate.');
              new PNotify({
                  title: gettext("Error"),
                  text: gettext('Please save images before saving estimate.'),
                  type: 'error'
                  })
            }else{
              //alert('Please save images before saving invoice.');
              new PNotify({
                  title: gettext("Error"),
                  text: gettext('Please save images before saving invoice.'),
                  type: 'error'
                  })
            }
        }
        else
            error = false;
    }
    var use_storage = $('#use_storage').prop("checked");
    var paymentTerm = $('#payment-term').val();
    if(!$.isNumeric(paymentTerm))
      paymentTerm = '';
    var edit_invoice = $('input[name=edit_invoice]').val();
    if (!error) {
        ajaxSetup();
        $.ajax({
            type: 'POST',
            url: postUrl,
            data: {
                'num': enumber,
                'date': edate,
                'po': epo,
                'cid': cid,
                'payment_terms': paymentTerm,
                'job_ids[]': job_ids,
                'job_names[]': job_names,
                'job_rates[]': job_rates,
                'job_descriptions[]': job_descriptions,
                'job_counts[]': job_counts,
                'job_totals[]': job_totals,
                'job_tax': job_tax,
                'item_tax': item_tax,
                'consumables_ids[]': consumables_ids,
                'consumables_inventory_ids[]': consumables_inventory_ids,
                'consumables_user_ids[]': consumables_user_ids,
                'consumables_is_storage[]': consumables_is_storage,
                'consumables_names[]': consumables_names,
                'consumables_price[]': consumables_sell_price,
                'consumables_count[]': consumables_count,
                'consumables_totals[]': consumables_total,
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
                'edit_invoice': edit_invoice,
                'use_storage': use_storage
            }
        }).error(function (data) {
            console.log(data.responseText);
        })
            .success(function (data) {
                if (!data.error) {
                    if (data.notify) {
                        //alert(data.message);
                        console.log(data.message);
                        new PNotify({
                            title: gettext('Error'),
                            text: data.message,
                            type: 'error'
                            })
                    }
                    if (estimate) {
                      if(oid){
                        var csrf = $('input[name=csrfmiddlewaretoken]').val();
                        $.post('/company/order/save_task/', {'tid': data.id, 'o_id': oid, 'for': 'add_estimate', 'csrfmiddlewaretoken': csrf})
                            .success(function (data) {
                                //var data = JSON.parse(data);
                                console.log(data);
                                if (!data.error)
                                {
                                  location = '/company/order/edit/'+oid+'/';
                                }else{
                                  new PNotify({
                                        title: '{{_("Error")}}',
                                        text: data.message,
                                        type: 'error'
                                    })
                                }
                              })
                              .error(function (data) {
                                  console.log(data.responseText);
                              });
                      }else{
                        location = redirectUrl;
                      }
                    }else {
                      console.log(data);
                      if(oid){
                        var csrf = $('input[name=csrfmiddlewaretoken]').val();
                        $.post('/company/order/save_task/', {'tid': data.id, 'o_id': oid, 'for': 'add_invoice', 'csrfmiddlewaretoken': csrf})
                            .success(function (data) {
                                //var data = JSON.parse(data);
                                console.log(data);
                                if (!data.error)
                                {
                                  location = '/company/order/edit/'+oid+'/';
                                }else{
                                  new PNotify({
                                        title: '{{_("Error")}}',
                                        text: data.message,
                                        type: 'error'
                                    })
                                }
                              })
                              .error(function (data) {
                                  console.log(data.responseText);
                              });
                      }else{
                        location = redirectUrl;
                      }
                    }
                }else {
                    new PNotify({
                      title: gettext("Error"),
                      text: data.message,
                      type: 'error'
                    })
                }
            });
    }
}

function ShowAdvancedSearch() {
    $('#dv-adv-search').toggle('slow');
}

function IdInv(obj){
    var id = $(obj).parents('tr').attr('id');
    $('#inv_hide_id').val(id)
}

function EditInv(){
    var id = $('#inv_hide_id').val();
    location = '/company/edit_invoice/' + id + '/';
}

function EditEstimate(obj, estimate) {
    var id = $(obj).parents('tr').attr('id');
    if (estimate)
        location = '/company/edit_estimate/' + id + '/';
    else
        location = '/company/edit_invoice/' + id + '/';

}

function ModalGenerateInvoice(obj, id) {
  $('#use_storage_modal').modal()
}


function GenerateInvoice(obj, id) {
    $('#generate_invoice').attr('disabled', true);
    ajaxSetup();
    $('#use_stor_form button[name=close]')[0].click();
    var use_storage = $('#use_storage').prop("checked");
    $.ajax({
        type: 'POST',
        url: '/company/generate_invoice/',
        data: {'id': id, 'use_storage': use_storage}
    }).done(function (data) {
        if (!data.error) {
            location = '/company/invoices/';
        }else{
          new PNotify({
              title: 'Error',
              text: data.message,
              type: 'error'
              })
        }
    }).fail(function (data) {
        console.log(data.responseText);
        $('#generate_invoice').attr('disabled', false);
    })
}

function ModalDuplicateInvoice() {
  $('#use_storage_duplicate_modal').modal()
}

function DuplicateInvoice(obj, id) {
    $(obj).attr('disabled', true);
    ajaxSetup();
    $.ajax({
        type: 'POST',
        url: '/company/duplicate_invoice/',
        data: {'id': id}
    }).done(function (data) {
        if (!data.error) {
            location = '/company/edit_invoice/' + data.id + '/';
        }
        else {
            new PNotify({
                  title: gettext('Error'),
                  text: data.message,
                  type: 'error'
              })
              $(obj).attr('disabled', false)
        }
    }).fail(function (data) {
        console.log(data.responseText);
        $(obj).attr('disabled', false);
    })
}


function DuplicateEstimate(obj, id) {
    $(obj).attr('disabled', true);
    ajaxSetup();
    $.ajax({
        type: 'POST',
        url: '/company/duplicate_estimate/',
        data: {'id': id}
    }).done(function (data) {
        if (!data.error) {
            location = '/company/edit_estimate/' + data.id + '/';
        }
        else {
            new PNotify({
                  title: gettext('Error'),
                  text: data.message,
                  type: 'error'
              })
            $(obj).attr('disabled', false)
        }
    }).fail(function (data) {
        console.log(data.responseText);
        $(obj).attr('disabled', false);
    })
}

function DeleteEstimate(id, estimate) {
    if (estimate){
        ajaxSetup();
        $.ajax({
            type: 'POST',
            url: '/company/delete_estimate/',
            data: {
                'id': id
            }
        }).done(function (data) {
            if(!data.error){
                //Дії будуть відповідно до розміщення кнопки.
            }
            else {
                new PNotify({
                      title: gettext('Error'),
                      text: data.message,
                      type: 'error'
                  });
            }
        }).fail(function (data) {
            //alert('Oops, have some error.');
            //console.log('Oops, have some error.');
            new PNotify({
                title: gettext('Error'),
                text: gettext('Oops, have some error.'),
                type: 'error'
                })
            console.log(data.responseText);
        });
    }
    else {
        ajaxSetup();
        $.ajax({
            type: 'POST',
            url: '/company/delete_invoice/',
            data: {
                'id': id
            }
        }).done(function (data) {
            if(!data.error){
                //Дії будуть відповідно до розміщення кнопки.
            }
            else {
                //alert(data.message);
                console.log(data.message);
                new PNotify({
                    title: gettext('Error'),
                    text: data.message,
                    type: 'error'
                    })
            }
        }).fail(function (data) {
            //alert('Oops, have some error.');
            //console.log('Oops, have some error.');
            new PNotify({
                title: gettext('Error'),
                text: gettext('Oops, have some error.'),
                type: 'error'
                })
            console.log(data.responseText);
        });
    }
}

function GetData(obj, iid){
    $('#show_pay_info').html('');
    if(obj){
      var id = $(obj).parents('tr').attr('id');
    }else{
      var id = iid;
    }
    $('#est_id').val(id);
    ajaxSetup();
    $.ajax({
        url:'/company/get_data/',
        data:{
            'id':id
        }
    }).done(function(data){
        var res = parseFloat(data.total) - parseFloat(data.pay);
        var dt = data.list_pay;
        var html = '';
        for (var i=0; i < dt.length; i++){
            if (data.list_pay[i].refund == 0){
                res =data.total - data.pay;
                $('#inv_payed').html('$'+parseFloat(data.pay).toFixed(2));
                html+="<div class='col-md-12' name='payment'>";
                html+="<span style='font-size: 20px; color: #4a4a4a;' id='pay_minus'>"+"$"+parseFloat(data.list_pay[i].sum).toFixed(2) +"</span><br>";
                html+="<div class='col-md-8' style='margin-top: 20px;'>";
                html+="<span style='font-size: 20px; color: #acacac;' id='who_add_pay'>"+data.list_pay[i].who+"</span><br>";
                html+="<span style='font-size: 16px; color: #acacac;'>"+ data.list_pay[i].date+ "/"+gettext(data.list_pay[i].pay_met)+ "</span>";
                html+="</div>";
                html+="<div class='col-md-4 np' style='margin-top: 25px;'>";
                html+="<span style='font-size: 20px; color: red;'><a href='#' onclick='Refund(this)'>"+gettext("REFUND")+"</a></span>";
                html+="</div>";
                html+="</div>";
            }else {
                res = data.total;
                $('#inv_payed').html('$'+(parseFloat(data.pay).toFixed(2)));
                html+="<div class='col-md-12'>";
                html+="<span style='font-size: 20px; color: #4a4a4a;' id='pay_minus'>"+"-"+"$"+parseFloat(data.list_pay[i].sum).toFixed(2) +"</span><br>";
                html+="<div class='col-md-8' style='margin-top: 20px;'>";
                html+="<span style='font-size: 20px; color: #acacac;' id='who_add_pay'>"+data.list_pay[i].who+"</span><br>";
                html+="<span style='font-size: 16px; color: #acacac;'>"+ data.list_pay[i].date+ "/"+gettext(data.list_pay[i].pay_met)+ "</span>";
                html+="</div>";
                html+="<div class='col-md-4 np' style='margin-top: 25px;'>";
                html+="<span style='font-size: 20px; color: red;'><a href='#' onclick='Refund(this)'>"+gettext("REFUNDED")+"</a></span>";
                html+="</div>";
                html+="</div>";

            }

        }
        res = data.total - data.pay;
        $('#to_pay').html('<b>'+gettext('Due')+'</b> '+'$'+'<span id="all_pay">'+parseFloat(res).toFixed(2))+'</span>';
        $('#inv_payed').html('$'+parseFloat(data.pay).toFixed(2));
        $('#inv_total').html('$'+parseFloat(data.total).toFixed(2));
        $('#body_payments').html(html);
        $('#formGroupInputLarge').val('');
        if ($('#formGroupInputLarge-error'))
          $('#formGroupInputLarge-error').remove();

        parseInt($('#inv_payed').html());
        if ($('#all_pay').html()=='0.00'){
            $('#add_pay_knwev').hide()
        }else {
            $('#add_pay_knwev').show()
        }
        var pr_per_bar = parseFloat(parseFloat(data.pay)/parseFloat(data.total)*100).toFixed(2);
        $('#progress_bar').attr('style', 'width:'+parseInt(pr_per_bar)+'%');
        console.log(pr_per_bar);
    })
}


function GetAssingUser(obj){
    var id = $(obj).parents('tr').attr('id');
    var tr = $(obj).parents('tr');
    var table = $('#invoices').DataTable();
    var row_info = table.row( tr ).data();

    $assigned_to.val(row_info.assigned_to_id).trigger("change");
    $("#form-assigned-user input[name=inv_id]")[0].value=id;
}


function AddPayments(type){
  var val_pay = $('#formGroupInputLarge').val();
  jQuery.validator.addMethod("valpayment", function(value, element) {
    var val_pay = parseFloat($('#formGroupInputLarge').val());
    var val_pay_sel = $('#pay_sel option:selected').val();
    var to_pay = parseFloat($('#all_pay').html());
      console.log('test2');
    if( val_pay_sel == 1){
      if (val_pay > 0 && val_pay <= to_pay){
        return true;
      }else{ return false; }
    }else if(val_pay_sel == 2){
      if (val_pay > 0 && val_pay <= 100){
        return true;
      }else{ return false; }
    }else return true;
  }, " This field is required");

  $('#form-payment').validate({
      rules: {
            formGroupInputLarge: { valpayment : true },
        },
      submitHandler: function (form) {
    var id = $('#est_id').val();
    var to_pay = $('#all_pay').html();
    var val_pay = $('#formGroupInputLarge').val();
    var val_pay_sel = $('#pay_sel option:selected').val();
    var date = $('#data_date').val();
    var val_pay_method = $('#pay_method option:selected').val();
    var check_number = $('#check_number').val();
    //console.log('test1');

    ajaxSetup();
    $.ajax({
        type: 'POST',
        url:'/company/payment/',
        data:{
            'id': id,
            'val_pay': val_pay,
            'val_pay_sel': val_pay_sel,
            'date': date,
            'val_pay_method': val_pay_method,
            'to_pay': to_pay,
            'check_number': check_number

        }
    })
        .done(function(data){
            //console.log(data);

            var val = parseFloat($('#inv_payed').html().substring(1)) + parseFloat(data.payment_amount);
            $('#inv_payed').html('$'+parseFloat(val).toFixed(2));
            var balance = parseFloat($('#inv_total').html().substring(1)) - val;
            $('#all_pay').html(parseFloat(balance).toFixed(2));
            var html = '';
            html+="<div class='col-md-12' name='payment'>";
            html+="<span style='font-size: 20px; color: #4a4a4a;' id='pay_minus'>"+"$"+parseFloat(data.payment_amount).toFixed(2) +"</span><br>";
            html+="<div class='col-md-8' style='margin-top: 20px;'>";
            html+="<span style='font-size: 20px; color: #acacac;' id='who_add_pay'>"+data.who+"</span><br>";
            html+="<span style='font-size: 16px; color: #acacac;'>"+ $('#date_val').val()+ "/"+$('#pay_method option:selected').html()+ "</span>";
            html+="</div>";
            html+="<div class='col-md-4 np' style='margin-top: 25px;'>";
            html+="<span style='font-size: 20px; color: red;'><a href='#' onclick='Refund(this)'>"+gettext("REFUND")+"</a></span>";
            html+="</div>";
            html+="</div>";
            $('#body_payments').append(html);
            if(type == 1){
              $('#payments_table').DataTable().ajax.reload();
            }else{
              $('#invoices').DataTable().ajax.reload();
            }
            if($('tr#id span')=='Partial'){
                $('tr#id span').attr('class', 'label label-primary')
            }
            if($('tr#id span')=='Paid'){
                $('tr#id span').attr('class', 'label label-success')
            }
            if ($('#all_pay').html()=='0.00'){
                $('#add_pay_knwev').hide()
            } else {
                $('#add_pay_knwev').show()
            }
            var pr_per_bar = (parseFloat($('#inv_payed').html().substring(1)).toFixed(2)/parseFloat($('#inv_total').html().substring(1)).toFixed(2))*100;
            $('#progress_bar').attr('style', 'width:'+parseInt(pr_per_bar)+'%');
            //alert('Payment has been added!')
            var html2 = '';
            html2+="<div class='col-md-12'>";
            html2+="<span style='font-size: 20px; color: #4a4a4a;' id='pay_minus'>"+"$"+parseFloat(data.payment_amount).toFixed(2) +"</span><br>";
            html2+="<div class='col-md-9' style='margin-top: 20px;'>";
            html2+="<span style='font-size: 20px; color: green;' id='who_add_pay'>"+data.who+"</span><br>";
            html2+="<span style='font-size: 16px; color: green;'>"+ $('#date_val').val()+ "/"+$('#pay_method option:selected').html()+ "</span>";
            html2+="</div>";
            html2+="<div class='col-md-3' style='margin-top: 25px;'>";
            html2+="</div>";
            html2+="</div>";
            $('#show_pay_info').append(html2)
            //console.log('TEST TEST TEST payd');
            new PNotify({
                  title: gettext('Success'),
                  text: gettext('Payment successful'),
                  type: 'success'
            });
            $('#form-payment button[name=close]').click();
        })

        .fail(function(data){
            //console.log(data);
            console.log(data.responseText)
        })
        return false;
    }
  });

}


function Refund(obj){
    var id = $('#est_id').val();
    var val = $(obj).parents('div.col-md-12[name=payment]').find('#pay_minus').html().substring(1);
    //console.log(parseFloat(val));
    ajaxSetup();
    $.ajax({
        type: 'POST',
            url:'/company/refund/',
            data:{
                'id': id,
                'val': parseFloat(val)

            }
    })
    .done(function(data){
      if(!data.error){
        //console.log('data.id='+data.id);
        var payed = parseFloat(data.value) + parseFloat($('#all_pay').html());
        var minus_val = parseFloat($('#inv_payed').html().substring(1)-val);
        $('#inv_payed').html('$'+ parseFloat(minus_val).toFixed(2));
        $('#all_pay').html(parseFloat(payed).toFixed(2));
        $(obj).parents('div.col-md-12[name=payment]').find($('#pay_minus').html("-$"+val));
        $(obj).parents('div.col-md-12[name=payment]').find($('#who_add_pay').html(data.who));
        $(obj).parents('div.col-md-12[name=payment]').find('a').attr('onclick','');
        $(obj).parents('div.col-md-12[name=payment]').find('a').html(''+gettext("REFUNDED"));
        $('#payments_table').find('tr[id='+data.id+']').find('td:eq(6)').html('<span class="label label-danger" style="text-transform: uppercase">'+gettext("REFUNDED")+'</span>');
        var pr_per_bar = (parseFloat($('#inv_payed').html().substring(1)).toFixed(2)/parseFloat($('#inv_total').html().substring(1)).toFixed(2))*100;
        $('#progress_bar').attr('style', 'width:'+parseInt(pr_per_bar)+'%');
        $('#invoices').DataTable().ajax.reload();
        new PNotify({
              title: gettext('Payment info'),
              text: gettext('Payment has been refunded!'),
              type: 'success'
        });
      }else{
        new PNotify({
              title: gettext('Error'),
              text: data.message,
              type: 'error'
        });
      }

    })
    .fail(function(data){
        //console.log(data);
        console.log(data.responseText)
    })
}



function ExtendedSearch(obj) {
    var formData = $('form#advanced-search').serialize();
    var date = $('#date-range').val();
    var type_doc = $(obj).attr('id');
    if (type_doc == 'search-invoice') {
        var requestStr = '/company/invoices_search.json?' + formData + '&date-range=' + date;
        var $table = $('table#invoices');
        $table.DataTable().destroy();
        $table.DataTable({
            "dom": 'Bflrtip',
            "buttons": [ buttons_invoice ],
            "ajax": requestStr,
            fnCreatedRow: function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id',aData.id);
            },
            "columns": columns_invoice,
            "order": [[ 4, 'asc' ], [ 0, "desc" ]],
            "footerCallback": function ( row, data, start, end, display ) {
                footerCallbackInvoice ( row, data, start, end, display );
            }
        })
    }
    else if (type_doc == 'search-payments'){
      var requestStr = '/company/payments.json?' + formData + '&date-range=' + date+'&search=on';
      console.log(requestStr);
      var $table = $('table#payments_table');
      $table.DataTable().destroy();
      $table.DataTable({
          "dom": 'Bflrtip',
          "buttons": [ buttons_payments ],
          "ajax": requestStr,
          fnCreatedRow: function( nRow, aData, iDataIndex ) {
              $(nRow).attr('id',aData.id);
          },
          "columns": columns_payments,
          "order": [[ 0, "desc" ]],
          "footerCallback": function ( row, data, start, end, display ) {
              footerCallbackPayments( row, data, start, end, display );
          }
      });
      $('#payments_table').DataTable().column( 0 ).visible( false );
    }
    else if (type_doc == 'search-invoice-history'){
      var requestStr = '/company/invoices_history.json?' + formData + '&date-range=' + date+'&search=on';
      //console.log(requestStr);
      var $table = $('table#invoice-history');
      $table.DataTable().destroy();
      $table.DataTable({
          "dom": 'Bflrtip',
          "buttons": [ buttons_invoice_hisory ],
          "ajax": requestStr,
          fnCreatedRow: function( nRow, aData, iDataIndex ) {
              $(nRow).attr('id',aData.id);
          },
          "columns": columns_invoice_history,
          "order": [[ 0, "desc" ]],
          "footerCallback": function ( row, data, start, end, display ) {
              var api = this.api();
              var total = 0.0;

              $.each(data, function () {
                  if (!this.refund)
                      total += parseFloat(this.payment);
              });

              var totalPerPage = 0.0;
              //total on this page
              for ( var i=start ; i<end ; i++ )
              {
                  if (!data[display[i]].refund)
                      totalPerPage += parseFloat(data[display[i]].payment);
              }
              var footStr = "$ " + totalPerPage.toFixed(2) + " ($ " + total.toFixed(2) + " total)";
              /* Modify the footer row to match what we want */
              $(row).find('span:eq(1)').html(footStr);
              //var nCells = row.getElementsByTagName('th');
              //nCells[1].innerHTML = '$ ' + totalPerPage + '($ ' + total + ')';
          }
      });





    }
    else {
        var requestStr = '/company/estimates_search.json?' + formData + '&date-range=' + date;
        var $table = $('table#estimates');
        $table.DataTable().destroy();
        $table.DataTable({
            "dom": 'Bflrtip',
            "buttons": [ buttons_estimate ],
            "sSwfPath": "/static/plugins/datatables/extensions/Buttons/Buttons-1.2.1/swf/flashExport.swf",
            "ajax": requestStr,
            fnCreatedRow: function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id',aData.id);
            },
            "columns": columns,
            "order": [[ 4, 'asc' ], [ 0, "desc" ]],
            "footerCallback": function ( row, data, start, end, display ) {
              footerCallbackEstimate( row, data, start, end, display )
            }
        });
    }

}

function ResetEstimateSearch(){
    $('#advanced-search select').select2('val', '');
    $('#advanced-search input:checkbox').iCheck('uncheck');
    $('#advanced-search input:radio').iCheck('uncheck');
    $('#advanced-search input[value=equal]').iCheck('check');
    $('input[name=ignore-date]').iCheck('check');
    $('#invoice-job').val(null);
    $('#invoice-total').val(null);
    $('#invoice-consumables').val(null);
    $('#estimate-job').val(null);
    $('#estimate-total').val(null);
    $('#estimate-consumables').val(null);
    $('#payment-price').val(null);
    $('#m-text').val(null);
}

function CloseDocument(estimate) {
    var closeDoc = confirm(gettext('If you click \'OK\' all entered data will lost. Do you want close?'));
    if (estimate) {
        if (closeDoc) {
            location = '/company/estimates/';
        }

    }
    else {
        if (closeDoc) {
            location = '/company/invoices/';
        }
    }
}

function DeleteEstimate(id){
    ajaxSetup();
    $.ajax({
        type: 'POST',
        url: '/company/delete_document/',
        data: {'id': id, 'type': 'estimate'}
    }).done(function(data){
        if (!data.error)
            location = '/company/estimates/';
        else
          new PNotify({
                title: gettext('Error'),
                text: data.message,
                type: 'error'
            });
    })
}

function EstimateOption(){
  var id =$("#optionPdf #est_id").val();
  var type = $("#optionPdf #type_id").val();
  var i_q =$("#optionPdf #i_q").is(":checked")
  var i_r =$("#optionPdf #i_r").is(":checked")
  var i_t =$("#optionPdf #i_t").is(":checked")
  var c_q =$("#optionPdf #c_q").is(":checked")
  var c_p =$("#optionPdf #c_p").is(":checked")
  var c_t =$("#optionPdf #c_t").is(":checked")
  ajaxSetup();
  $.ajax({
      type: 'POST',
      url: '/company/estimate_option_preview/',
      data: {
        'id': id,
        'type': type,
        'i_q' : i_q,
        'i_r' : i_r,
        'i_t' : i_t,
        'c_q' : c_q,
        'c_p' : c_p,
        'c_t' : c_t
      }
  }).done(function(data){
      if (!data.error){
        console.log(data);
        var iframe = document.getElementById('iframePdf');
        iframe.src = iframe.src;
        $('#print_inv_est').attr("href");
        $('#optionPdf button[name=close]')[0].click();
      }else{
          //alert(data.message);
          console.log(data.message);
          new PNotify({
              title: gettext('Error'),
              text: data.message,
              type: 'error'
              })
      }
  })
}

function createMessage(data, all_count){
  if(!data.is_system){
    var str = data.message,
    html = $.parseHTML( str ),
    message_str = '';
    $.each( html, function( i, el ) {
      if(el.nodeName=='#text'){
        message_str += el.data;
      }else{
       message_str += el.textContent;
      }
    });
  }else{
    var message_str = data.message;
  }
  var message = '';
  if(data.is_system){
    var sm = "system-message";
    if ($('.system-message-hide').length > 0)
      sm += "-hide";
    message += '<div class="'+sm+'">';
  }
  var n_pul = 'right';
  var d_pul = 'left';
  if(data.author_id != autor_id || data.is_system){
    message += '<div class="direct-chat-msg">';
    n_pul = d_pul;
    d_pul = 'right'
  }else{
    message += '<div class="direct-chat-msg right">';
  }
  message += '<div class="direct-chat-info clearfix">';
  if(!data.is_system){
    message += '<span class="direct-chat-name pull-'+n_pul+'">'+data.author_name+'</span>';
  }else{
    message += '<span class="direct-chat-name pull-'+n_pul+' system-message">'+gettext('System')+'</span>';
  }
  message += '<span class="direct-chat-timestamp pull-'+d_pul+'">'+data.created_date+'</span>';
  message += '</div>';
  if(!data.is_system){
    message += '<img class="direct-chat-img" src="'+data.author_url+'"  width="128px" height="128px" alt="message user image" style="transform: rotate('+data.author_degr+'deg);">';
  }else{
    message += '<img class="direct-chat-img" src="/static/dist/img/user2-160x160.jpg"  width="128px" height="128px" alt="message user image">';
  }
  message += '<div class="direct-chat-text">';
  message += message_str;
  message += '</div>';
  if(data.recipients.length > 0 && data.recipients.length != all_count && !data.is_system){
    message += '<div class="direct-chat-info clearfix">';
    message += '<span class="direct-chat-timestamp pull-left"><b>to:</b> '+data.recipients[0];
    for (var i=1; i < data.recipients.length; i++){
      message += ', '+data.recipients[i];
    }
    message += '</span></div>';
  }
  message += '</div>';
  if(data.is_system)
    message += '</div>';
  return message;
}

function addChatLine(data, all_count, history){
  //console.log(data);
  //console.log('new chtat message');
  //test exsist chat
  if($('#chat_list_messages').length){
    if(!history){
      var html = $('#load_chat_message').html();
      var message = createMessage(data, data.all_count);
      var scroll = $('#chat_list_messages');
      var scroll_bot = ''
      if((scroll.scrollTop()+scroll.innerHeight()) == scroll[0].scrollHeight)
        scroll_bot='on'
      $('#load_chat_message').html(html+message);
      var scroll = $('#chat_list_messages');
      if(scroll_bot){
        scroll.scrollTop(scroll.scrollTop() + scroll[0].scrollHeight -scroll.innerHeight());
      }
    }else{
      var html = $('#load_hisory_message').html();
      var message = '';
      for (var i=0; i < data.length; i++){
        message += createMessage(data[i], all_count);
      }
      message += '<hr>';
      $('#load_hisory_message').html(message+html);
    }
  }
}

function hideSystemChatMessages(btn){
  if ($('.system-message-hide').length > 0){
    btn.innerHTML=gettext('hide system messages');
    $('.system-message-hide').removeClass('system-message-hide').addClass('system-message');
  }else{
    btn.innerHTML=gettext('show system messages');
    $('.system-message').removeClass('system-message').addClass('system-message-hide');
  }
}


function EditOrder(obj) {
    var id = $(obj).parents('tr').attr('id');
    location = '/company/order/edit/' + id + '/';
}
