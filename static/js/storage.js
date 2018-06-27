/**
 * Created by manager on 27.01.16.
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

function PrepareConfirmWindow(obj){
    var id = $(obj).parents('tr').attr('id');
    var row = $(obj).parents('tr')[0];
    $('#modal-delete-confirm p')[0].innerHTML = gettext('You try delete storage item')+" '" + row.cells[0].innerHTML + "'. "+gettext("Are you sure?");
    $('#modal-delete-confirm button')[1].setAttribute('onclick', 'DeleteStorageItem(' + id + ')');
}

function DeleteStorageItem(item_id){
    var row = $('#storage-items tr[id=' + item_id +']');
    var url = '/api/storage/delete_storage_item/';
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(url, { id: item_id   })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            //row.parentElement.removeChild(row);
            var table = $('#storage-items').DataTable();
            table.row(row).remove().draw();
            $('#modal-delete-confirm button')[0].click();
        });
}

function FillModal(obj){
    var row = obj.parentElement.parentElement;
    var storage_item_id = row.getAttribute('id');
    $('form.form-horizontal p#amount_info').html(row.cells[0].innerHTML);
    $('form.form-horizontal input[name=storage_item_id]')[0].value = storage_item_id;
    var inp = $('form.form-horizontal input[name=amount]')[0];
    inp.value = '';
    inp.setAttribute('placeholder', '0.0');
    if($('form#add-amount label.error'))
      $('form#add-amount label.error')[0].setAttribute('style', 'display:none');
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

function AddNewStorageItem(data){
    data = eval(data);
    var item_id = data.id;
    var table = $('#storage-items').DataTable();
    var storage_item = {
        'id': item_id,
        'item_name': $('#new-item-form input[name=item_name]').val(),
        'amount': $('#new-item-form input[name=amount]').val(),
        'sell_price': $('#new-item-form input[name=sell_price]').val(),
        'in_use': 0.0
    };
    table.row.add(storage_item).draw();
    /*
    var row = document.createElement('tr');
    row.setAttribute('id', item_id);
    row.innerHTML = "<td>" + $('#new-item-form input[name=item_name]')[0].value + "</td>";
    var td1 = document.createElement('td');
    td1.innerHTML = $('#new-item-form input[name=amount]')[0].value + " &nbsp;<a href='#modal-add-amount' data-toggle='modal' class='info fa fa-plus-circle' onclick='FillModal(this);'></a>";
    row.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = $('#new-item-form input[name=sell_price]')[0].value + " &nbsp;<a class='fa fa-pencil-square' onclick='SetInputChangePrice(this);'></a> ";
    row.appendChild(td2);
    var td3 = document.createElement('td');
    td3.innerHTML = "<a href='#modal-show-inuse' data-toggle='modal' class='btn btn-success btn-xs' onclick='ShowInUse(this);'>0.00</a>";
    row.appendChild(td3);
    var td4 = document.createElement('td');
    td4.setAttribute('id', item_id);
    var inHTML = "<span data-toggle='tooltip' title='Delete "+ $('#new-item-form input[name=item_name]')[0].value + "'><a href='#modal-delete-confirm' data-toggle='modal' class='btn btn-danger fa fa-trash-o' onclick='PrepareConfirmWindow(this);'></a></span>&nbsp;";
    inHTML += "<span data-toggle='tooltip' title='To complement employee " + $('#new-item-form input[name=item_name]')[0].value + "'><a class='btn btn-warning fa fa-wrench' data-toggle='modal' href='#modal-add-equip' onclick='ShowEquip(this);'></a></span>";
    td4.innerHTML = inHTML;
    row.appendChild(td4);
    $('#storage-items tbody')[0].appendChild(row);
    */
}
/*
function AddNewAmount(){
    var item_id = $('form.form-horizontal input[name=storage_item_id]')[0].value;
    var company_id = $('form.form-horizontal input[name=company_id]')[0].value;
    var amount = $('form.form-horizontal input[name=amount]')[0].value;
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.post('/storage/add_amount/', {
        item_id: item_id,
        company_id: company_id,
        amount: amount
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            var td = $('table#storage-items tr#'+item_id + ' td')[1];
            var cells_value = td.innerHTML.split(' ');
            var old_amount = $('form.form-horizontal input[name=amount]')[0];
            var amount = parseFloat(cells_value[0]) + parseFloat(old_amount.value);
            td.innerHTML = amount.toFixed(1) + "&nbsp;<a href='#modal-add-amount' data-toggle='modal' class='info fa fa-plus-circle' onclick='FillModal(this);'></a>";
            $('div#modal-add-amount button[name=close]')[0].click();
        });
}
*/
function SetInputChangePrice(obj){
    var td = obj.parentElement;
    var val = $(td).find('span#sell_price').text();
    //console.log(td);
    td.innerHTML = "<div class=\"row col-md-12 np\" style=\"width: 120px;\"><input type=\"text\" class=\"form-control-xs\" name=\"item_price\" value=\"" + val + "\" style='width: 70px;'> &nbsp;<a class=\"fa fa-check-circle\" onclick=\"ChangeItemPrice(this);\"></a></div>";
}

function ChangeItemPrice(obj){
    var item_id = $(obj).parents('tr').attr('id');
    var price = parseFloat($(obj).parents('td').find('input[name=item_price]').val());
    console.log(price);
    if(price){
      var csrftoken = getCookie('csrftoken');
      $.ajaxSetup({
          beforeSend: function(xhr, settings) {
              if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                  xhr.setRequestHeader("X-CSRFToken", csrftoken);
              }
          }
      });

      $.post('/storage/change_price/', {
          item_id: item_id,
          price: price
      })
          .error(function(data){ console.log(data.responseText)})
          .success(function(){
              var $td = $(obj).parents('td');
              var iHTML = "<span id='sell_price'>" + parseFloat(price).toFixed(2).toString() + "</span>&nbsp;<a class='fa fa-pencil-square' onclick='SetInputChangePrice(this);'></a>";
              $td.html(iHTML);
              $('#storage-items').DataTable().ajax.reload();
              $('div#modal-add-amount button[name=close]')[0].click();
          });
      }else{
        console.log('wrong input data')
      }
}


function ShowEquip(obj){
    var row = obj.parentElement.parentElement.parentElement;
    var storage_item_id = row.getAttribute('id');
    $('form[name=equip-form] p#equip_info').html(row.cells[0].innerHTML);
    $('form[name=equip-form] input[name=storage_item_id]')[0].value = storage_item_id;
    $('form[name=equip-form] select[name=user_id]').select2().val(null).trigger('change');
    var inp = $('form[name=equip-form] input[name=amount]')[0];
    inp.value = '';
    inp.setAttribute('placeholder', '0.0');
    if ($('form#equip-form label.error').length > 0)
        $('form#equip-form label.error')[0].setAttribute('style', 'display:none');
}

/*
function AddNewEquip(){
    var item_id =parseInt($('form[name=equip-form] input[name=storage_item_id]')[0].value);
    var amount = $('form[name=equip-form] input[name=amount]')[0].value;
    var user_id = parseInt($('form[name=equip-form] select[name=user_id]')[0].selectedOptions[0].value);
    console.log(item_id);
    console.log(amount);
    console.log(user_id);
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.post('/storage/equip/', {
        item_id: item_id,
        user_id: user_id,
        amount: amount
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            console.log(data);
            var td = $('table#storage-items tr#'+item_id + ' td')[1];
            var cells_value = td.innerHTML.split(' ');
            var old_amount = $('form[name=equip-form] input[name=amount]')[0];
            var amount = parseFloat(cells_value[0]) - parseFloat(old_amount.value);
            td.innerHTML = amount.toFixed(1) + "&nbsp;<a href='#modal-add-amount' data-toggle='modal' class='info fa fa-plus-circle' onclick='FillModal(this);'></a>";
            var a = $('table#storage-items tr#'+item_id + ' td a')[2];
            a.innerHTML=(parseFloat(a.innerHTML) + parseFloat(old_amount.value)).toFixed(2);
            $('div#modal-add-equip button[name=close]')[0].click();
        });
}
*/


function ShowInUse(obj){
    var row = obj.parentElement.parentElement;
    var item_id = row.getAttribute('id');
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.post('/storage/get_inuse/', {
        item_id: item_id
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            //console.log(data);
            var t_body = $('div#modal-show-inuse tbody')[0];
            var i_html = "";
            for (var i = 0; i < data.length; i++){
                i_html += "<tr><td><a href='/staff/user_profile/" + data[i].uid + "/'>" + data[i].username + "</a></td><td><span class='badge bg-green'>" + data[i].amount + "</span></td></tr>";
            };
            t_body.innerHTML = i_html;
            $('div#modal-show-inuse p.text').html(row.cells[0].innerHTML);
        });
}



function ShowUsersObj(obj){
    var row = obj.parentElement.parentElement.parentElement;
    var u_id = row.getAttribute('id');
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    $.post('/storage/plus/', {
        u_id: u_id
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            console.log(data);
            var t_body = $('div#modal-show-inventory tbody')[0];
            var i_html = "";
            for (var i = 0; i < data.length; i++){
                i_html += "<tr><td>" + data[i].item_name + "</td><td><span class='badge bg-green'>" + data[i].amount + "</span></td></tr>";
            }
            t_body.innerHTML = i_html;
            $('div#modal-show-inventory p.text').html(row.cells[1].innerHTML);
        });
}


function ShowUserAddEquipment(obj){
    var item_id = $(obj).parents('tr')[0].getAttribute('id');
    $('input[name=item_id_id]').val(item_id);
}


function AddUserEquipment(obj){
    $('button[name=add]').attr('disabled', true);
    var stor_it_id = $('form#plus-amount input[name=item_id_id]').val();
    var amount = $('form#plus-amount input#amount').val();
    var u_id = $('form#plus-amount input[name=u_id]').val();
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/plus/', {
        stor_it_id: stor_it_id,
        amount : amount,
        u_id:u_id
    })
        .error(function(data){
            console.log(data.responseText);
            $('button[name=add]').attr('disabled', false);
        })
        .success(function(data){
            //var usr_inv = $('div#usr_inv span#am_id')[0];
            //var td_amount = $('td[name=amount]')[0];
            iid = $('form#plus-amount input[name=item_id_id]').val();
            var row = $('tr#'+iid).children('td[name=amount]')[0];
            var u_row = $('tr#'+iid).children('td').children('span[name=am_id]')[0];
            row.innerHTML = data[1].toFixed(1);
            u_row.innerHTML = data[0].toFixed(1);
            var name = $('#select_id option#'+iid).attr('name');
            var val =' ('+data[1].toFixed(1)+')';
            var m_html = name+val;
            $('#select_id option#'+iid).html(m_html);
            $('form#plus-amount').children().children().children().children().val('');
            $('button[name=plus_close]').click();
            $('button[name=add]').attr('disabled', false);
        });
}


function ShowUserDelEquipment(obj) {
    var item_id = $(obj).parents('tr')[0].getAttribute('id');
    $('input[name=item_id_id]').val(item_id);

}


function DelUserEquipment(obj){
    $('button#return').attr('disabled', true);
    var stor_it_id = $('form#minus-amount input[name=item_id_id]').val();
    var amount = $('form#minus-amount input#amount').val();
    var u_id = $('form#minus-amount input[name=u_id]').val();
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/minus/', {
        stor_it_id: stor_it_id,
        amount : amount,
        u_id:u_id
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            iid = $('input[name=item_id_id]').val();
            var row = $('tr#'+iid).children('td[name=amount]')[0];
            var u_row = $('tr#'+iid).children('td').children('span[name=am_id]')[0];
            row.innerHTML = data[1].toFixed(1);
            u_row.innerHTML = data[0].toFixed(1);
            var name = $('#select_id option#'+iid).attr('name');
            var val =' ('+data[1].toFixed(1)+')';
            var m_html = name+val;
            $('#select_id option#'+iid).html(m_html);
            $('form#minus-amount').children().children().children().children().val('');
            $('button#return').attr('disabled', false);
            $('button#cls').click();
        });
}


function RIS(obj){
    var item_id = $(obj).parents('tr')[0].getAttribute('id');
    $('input[name=return-to-store]').val(item_id);
}

function ReturnIntoStorage(){
    var item_id = $('input[name=return-to-store]').val();
    var uid = $('div#return_to_stor input[name=u_id]').val();
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/return_to_storage/', {
        stor_it_id: item_id,
        u_id:uid
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            iid = $('input[name=return-to-store]').val();
            var name = $('#select_id option#'+iid).attr('name');
            var val =' ('+data[0].toFixed(1)+')';
            var m_html = name+val;
            $('#select_id option#'+iid).html(m_html);
            $('tr#'+iid).remove();
            $('#return-close').click()

        });
}


function AUE(obj){
    var item_id = $(obj).parents('tr')[0].getAttribute('id');
    $('input[name=return-to-store]').val(item_id);
}

function AddUserEquip(){
    $('#add_equip_btn').attr('disabled', true);
    var item_id=$('#select_id option:selected').attr('id');
    var uid = $('#add_us_eqp input[name=u_id]').val();
    var $addAmount = $('#add_amount');
    var amount = $addAmount.val();
    if ((amount == '') || (amount == '0')){
        $addAmount.parent('div').removeClass('has-success').addClass('has-error');
        new PNotify({
            title: gettext('Error'),
            text: gettext('Amount can\'t be null.'),
            type: 'error'
        });
        $('#add_equip_btn').attr('disabled', false);
        return;
    }
    else {
        $addAmount.parent('div').removeClass('has-error').addClass('has-succes')
    }
    if($('#select_id').val().length == 0){
      $('#select_id').removeClass('has-success').addClass('has-error');
      new PNotify({
          title: gettext('Error'),
          text: gettex('You must choose equipment.'),
          type: 'error'
      });
      $('#add_equip_btn').attr('disabled', false);
      return;
    }
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/add_user_equip/', {
        stor_it_id: item_id,
        u_id:uid,
        amount:amount
    })
        .error(function(data){ console.log(data.responseText)})
        .success(function(data){
            var perm = data.perm;
            data = eval(data.data);
            if (data[0] != 0) {
                var $row = $('#usr_inv table tr#' + data[0]);
                if ($row.length > 0) {
                    $row.find('td[name=amount]').html(parseFloat(data[1]).toFixed(1));
                    var $spanAmount = $row.find('span[name=am_id]');
                    var newAmount = parseFloat($('#add_amount').val());
                    var oldAmount = parseFloat($spanAmount.html());
                    $spanAmount.html(parseFloat(oldAmount + newAmount).toFixed(1));
                    $('#add_equip_btn').attr('disabled', false);
                    $('#add_u_equip_cls').click();
                    return;
                }

                var name = $('#select_id option:selected').attr('name');
                var amount = $('#add_amount').val();
                var row = document.createElement('tr');
                row.setAttribute('id', data[0]);
                row.innerHTML = "<td>" + data[0] + "</td>";
                var td1 = document.createElement('td');
                td1.innerHTML = name;
                row.appendChild(td1);
                var td2 = document.createElement('td');
                td2.setAttribute('name', 'amount');
                td2.innerHTML = parseFloat(data[1]).toFixed(1);
                row.appendChild(td2);
                var td3 = document.createElement('td');
                td3.setAttribute('iid', data[2]);
                td3.innerHTML = "";
                if(perm){
                  td3.innerHTML +="<a href='#minus' data-toggle='modal' class='info fa fa-minus-circle' onclick='ShowUserDelEquipment(this)'></a>&ensp;";
                }
                td3.innerHTML +="<span name='am_id'>" + parseFloat(amount).toFixed(1) + "</span> &ensp;";
                if(perm){
                  td3.innerHTML +="<a href='#plus' data-toggle='modal' class='info fa fa-plus-circle' onclick='ShowUserAddEquipment(this);'></a>";
                }
                row.appendChild(td3);
                var td4 = document.createElement('td');
                if(perm){
                  td4.innerHTML = "<span data-toggle='tooltip' title='Return all emount equip'>" +
                      "<a href='#return_to_stor' data-toggle='modal' onclick='RIS(this)' class='btn btn-warning fa fa-reply'></a>" +
                      "</span>&nbsp;" +
                      '<span data-toggle="tooltip" title="Cancel employee equipment">' +
                      '<a href="#employee_cancel_equipment" data-toggle="modal" class="btn btn-danger fa fa-minus" onclick="CancelEquipmentAmount('+data[0]+');"></a>' +
                      '</span>';
                }else{
                  td4.innerHTML ="";
                }
                row.appendChild(td4);

                iid = $('#select_id option:selected').attr('id');
                var name_amount = $('#select_id option#' + iid).attr('name');
                var val = ' (' + parseFloat(data[1]).toFixed(1) + ')';
                var m_html = name_amount + val;
                $('#select_id option#' + iid).html(m_html);
                $('#usr_inv tbody').append(row);
                $('#add_equip_btn').attr('disabled', false);
                $('#add_u_equip_cls').click()
            }
            else{
                $('#add_equip_btn').attr('disabled', false);
                $('#add_u_equip_cls').click();
            }
        });
}

function PrepareEditWindow(obj){
    // row variables
    var $row = $(obj).parents('tr');
    var $tdItemName = $row.find('td:eq(0)');
    var $spanSellPrice = $row.find('span#sell_price');
    var $spanAmount = $row.find('span#tb-amount');

    var itemId = $row.attr('id');

    // form variables
    var $inpItemName = $('#edit-storage-form #item-name');
    var $inpAmount = $('#edit-storage-form #amount');
    var $inpSellPrice = $('#edit-storage-form #sell-price');

    $inpAmount.val($spanAmount.html());
    $inpItemName.val($tdItemName.html());
    $inpSellPrice.val($spanSellPrice.html());
    $('#edit-storage-form input[name=item-id]').val(itemId);
}

function Block(){
    $('#test_shmest').click();

    $('#close_wind').click()
}


function CancelEquipmentAmount(sid) {
  $('input[name=sid]').val(sid);
}

function ShowAdvancedSearch() {
    $('#dv-adv-search').toggle('slow');
}


function ExtendedSearch(obj) {
    var formData = $('form#advanced-search').serialize();
    var date = $('#date-range').val();
    var type_doc = $(obj).attr('id');
    if (type_doc == 'search-storage-history') {
        var requestStr = '/storage/storage_history.json?' + formData + '&date-range=' + date +'&search=on';
        var $table = $('table#storage-history');
        console.log(requestStr);
        $table.DataTable().destroy();
        $table.DataTable({
            "dom": 'Bflrtip',
            "buttons": [ buttons_storage_history ],
            "ajax": requestStr,
            fnCreatedRow: function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id',aData.id);
            },
            "columns": colomns_storage_history,
            "order": [[ 0, "desc" ]]
        })
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
