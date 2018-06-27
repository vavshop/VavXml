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
                html+="<span style='font-size: 20px; color: red;'><a href='#Refund' onclick='Refund(this)'>"+gettext("REFUND")+"</a></span>";
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
                html+="<span style='font-size: 20px; color: red;'><a href='#Refund' onclick='Refund(this)'>"+gettext("REFUNDED")+"</a></span>";
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
        var table = $('#estimates_order').DataTable();
    else
        var table = $('#invoices_order').DataTable();
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
            html+="<span style='font-size: 20px; color: red;'><a href='#Refund' onclick='Refund(this)'>"+gettext("REFUND")+"</a></span>";
            html+="</div>";
            html+="</div>";
            $('#body_payments').append(html);
            if(type == 1){
              $('#payments_table').DataTable().ajax.reload();
            }else if(type == 3){
              var totalPage_pay = parseFloat($('#totalPage_pay').val());
              $('#totalPage_pay').val(totalPage_pay+parseFloat(data.payment_amount));
              $('#invoices_order').DataTable().ajax.reload();
              $('#payments_order').DataTable().ajax.reload();
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
        $('#invoices_order').DataTable().ajax.reload();
        $('#payments_order').DataTable().ajax.reload();
        var totalPage_pay = parseFloat($('#totalPage_pay').val());
        $('#totalPage_pay').val(totalPage_pay-parseFloat(data.value));
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



function changeStatusOrder(id){
  var st_id = $('#order_status_select').val()
  if(st_id){
    $.get('/company/order/change_order/', { 'o_id': id, 'st_id': st_id})
        .success(function (data) {
            //var data = JSON.parse(data);
            console.log(data);
            if (!data.error)
            {
              var spanstyle = 'label bg-aqua pull-right';
              if(data.status == 'accepted'){
                 spanstyle = 'label bg-yellow pull-right';
              }else if(data.status == 'fulfilled'){
                 spanstyle = 'label bg-green pull-right';
              }else if(data.status == 'cancel'){
                 spanstyle = 'label bg-gray-active pull-right';
              }
              $('#status_order').html(gettext(data.status)).attr('class', spanstyle);
              new PNotify({
                title: gettext('Success'),
                text: gettext('Status change to ')+data.status,
                type: 'success'
              })
              $('#tasks_order').DataTable().ajax.reload();
            }else{
              new PNotify({
                    title: gettext('Error'),
                    text: data.message,
                    type: 'error'
                })
            }
          })
          .error(function (data) {
              console.log(data.responseText);
          });
  }else{
    new PNotify({
      title: gettext('Error'),
      text: gettext('Please select status.'),
      type: 'error'
    })
  }
}
