/**
 * Created by manager on 19.07.16.
 */



function EditOption(obj) {


    var tr = obj.parentNode.parentNode;
    var table = $('#users').DataTable();



    var table = $('#options').DataTable();
    var row_info = table.row( tr ).data();


    $("#edit-option-window input[name=id]")[0].value=row_info.id;
    //$("#edit-option-window select[name=code_name]")[0].value=row_info.code_name;
    //$("#edit-option-window select[name=code_name]")[0].text=row_info.code_name;
    $("#edit-option-window input[name=code_name]")[0].value=row_info.code_name;
    $("#edit-option-window input[name=name]")[0].value=row_info.name;
    $("#edit-option-window input[name=amount]")[0].value=row_info.amount;
    $("#edit-option-window input[name=price]")[0].value=row_info.price;
    $("#edit-option-window input[name=duration]")[0].value=row_info.duration;
}

function NewOption(data) {
    $('#add-option-form')[0].reset();
}

function AddNewOption(d) {
    console.log(d.data[0]);
    var table = $('#options').DataTable();
    table.row.add(d.data[0]).draw();
}

function UpdateOption(d) {

            var table = $('#options').DataTable();
     var tr = $('#options tr[id=' + d.data[0].id + ']')[0];
    table.row(tr).remove().draw( false );

    table.row.add(d.data[0]).draw();
    $('#edit-option-window button[name=close]')[0].click();
}

function inputOption() {
    name = $('#add-option-form input[name=name]').val();
    amount = $('#add-option-form input[name=amount]').val();
    price = $('#add-option-form input[name=price]').val();
    duration = $('#add-option-form input[name=duration]').val();
    if(name =="")
        return false;
    if(Number.isInteger(parseInt(amount)))
        return false;
    if(isNaN(parseFloat(price)))
        return false;
    if(Number.isInteger(parseInt(duration)))
        return false;


}


function AddNewPacket(data) {
    $('#add-packet-form #error_massege').html('');

        var table = $('#packets').DataTable();
    table.row.add(data.plan).draw();
    for (var i = 0; i < data.plan.options.length; i++) {
        var option = document.createElement("option");
        option.value = 'o'+data.plan.options[i].id;
        option.text = data.plan.options[i].name;
        $('#id_options_edit')[0].appendChild(option);
    }
}

function NewPacket(data) {
        $('#add-packet-form #error_massege').html('');
    $('#add-packet-form')[0].reset();
    $add_option.val(null).trigger("change");
    $('#start_plan_div').addClass('hidden');
    $('#start_plan').prop('checked', false);
}



function EditPacket(obj) {

    var tr = obj.parentNode.parentNode;
    var table = $('#packets').DataTable();
    var row_info = table.row( tr ).data();

    var options = row_info.options;
    var options_list = [];
    for (var i = 0; i < options.length; i++) {
        options_list[i]='o'+options[i].id.toString();
    }
    $edit_option.val(options_list).trigger("change");
    $("#edit-packet-window input[name=id]")[0].value=row_info.id;
    $("#edit-packet-window input[name=name]")[0].value=row_info.name;
    $("#edit-packet-window select[name=type_plan]")[0].value=row_info.type;
    $("#edit-packet-window select[name=type_plan]")[0].text=row_info.type;
    if(row_info.type == 'test'){
      $('#start_plan_div_edit').removeClass('hidden');
      if(row_info.start_plan){
        $('#start_plan_edit').prop('checked', true);
      }else{
        $('#start_plan_edit').prop('checked', false);
      }
      if(row_info.def_plan){
        $('#start_plan_def').prop('checked', true);
      }else{
        $('#start_plan_def').prop('checked', false);
      }
    }else{
      $('#start_plan_div_edit').addClass('hidden');
      $('#start_plan_edit').prop('checked', false);
      $('#start_plan_def').prop('checked', false);

    }
    $("#edit-packet-window input[name=price]")[0].value=row_info.price;
    $("#edit-packet-window input[name=duration]")[0].value=row_info.duration;
    $('#edit-packet-form #error_massege').html('');
}



function UpdatePacket(data) {

        var table = $('#packets').DataTable();
     var tr = $('#packets tr[id=' + data.id + ']')[0];
    table.row(tr).remove().draw( false );

    table.row.add(data.plan).draw();
}

function Disable_Plan(obj) {
    var tr = obj.parentNode.parentNode;
    var id=tr.getElementsByTagName("td")[1].innerHTML;
    $('#disable-packet-form')[0].reset();
    $("#modal-disable-packet select[name=change_plan] option").removeAttr('disabled');
    $("#modal-disable-packet input[name=id]")[0].value=id;
    $("#modal-disable-packet select[name=change_plan] option[value="+id+"]")[0].disabled=true;
    var opt = $("#modal-disable-packet select[name=change_plan] option:not([disabled])")[0];
    console.log('opt.value='+opt.value+' opt.text='+opt.text);
    $("#modal-disable-packet select[name=change_plan]")[0].value=opt.value;
    $("#modal-disable-packet select[name=change_plan]")[0].text=opt.text;

    $('#modal-disable-packet #error_massege').html('');
}

function DisablePacket(data) {
    var table = $('#packets').DataTable();
    var tr = $('#packets tr[id=' + data.id + ']')[0];
    table.row(tr).remove().draw( false );
}



function Disable_Option(obj) {
    var tr = obj.parentNode.parentNode;
    var id=tr.getElementsByTagName("td")[0].innerHTML;
    $("#modal-disable-option input[name=id]")[0].value=id;
    $('#modal-disable-option #error_massege').html('');
}

function DiasbleOption(data) {
    var table = $('#options').DataTable();
    var tr = $('#options tr[id=' + data.id + ']')[0];
    table.row(tr).remove().draw( false );
}


function EditUser(obj) {
    var tr = obj.parentNode.parentNode;
    var table = $('#users').DataTable();
    var row_info = table.row( tr ).data();
    console.log('row_info=');
    console.log(row_info);
    console.log('id='+row_info.plan_id);
    $("#edit-user-packet-window input[name=id]")[0].value=row_info.id;
    $("#edit-user-packet-window input[name=name]")[0].value=row_info.name;
    edit_packet.val(row_info.plan_id).trigger("change");
}

function UpdateUserPacket(d) {
//console.log(d)
        var table = $('#users').DataTable();
     var tr = $('#users tr[id=' + d.data[0].id + ']')[0];
    table.row(tr).remove().draw( false );

    table.row.add(d.data[0]).draw();
}

function HistorySearch(q, n, v) {
  var table = $('#users').DataTable();
  table
    .columns( 1 )
    .search( q ? '^'+q+'$' : '', true, false )
    .columns( 2 )
    .search( v ? '^'+v+'$' : '', true, false )
    .draw();
  if($('#clear_search').hasClass('hidden'))
    $('#clear_search').removeClass('hidden');
  if (n==1){
    $('#clear_search').addClass('hidden');
    table.ajax.reload();
  }
}

function ShowAdvancedSearchBilling() {
    $('#dv-adv-search').toggle('slow');
}

function ExtendedBillingUserPacketSearch(obj) {
  $(obj).attr('disabled', true);
  var $form = $('form#advanced-search');

  var startTime = $('#start-time span').html();
  var endTime = $('#end-time span').html();
  var closeTime = $('#close-time span').html();

  var formData = $form.serialize();
  var date = $('#date-range span').html();

  var requestStr = '/billing/settings/users_packets.json?for=search&' + formData + '&start-time=' + startTime + '&end-time=' + endTime;
  var $table = $('table#users');
  console.log(requestStr);
  $table.DataTable().destroy();
  $table.DataTable({
      "ajax": requestStr,
      fnCreatedRow: function( nRow, aData, iDataIndex ) {
          $(nRow).attr('id',aData.id);
      },
      "columns": columns_users_billing,
      "order": [[ 3, "asc" ]]
  });
  $(obj).attr('disabled', false);
}


function ResetBillingUserPacketeSearch(){
    $('#advanced-search').trigger("reset");
    $('#advanced-search select').select2('val', '');
}

function sendRegMail(id, btn){
  btn.setAttribute("disabled", true);
  ajaxSetup();
  $.post('/billing/send_reg_mail/', {cid: id})
      .success(function (data) {
        console.log(data);
        if(!data.error){
          new PNotify({
                title: 'Success',
                text: data.message,
                type: 'success'
            })
        btn.parentNode.removeChild(btn);
        }else{
          btn.setAttribute("disabled", false);
          new PNotify({
                title: 'Error',
                text: data.message,
                type: 'error'
            })
        }
      })
      .error(function (data) {
        btn.setAttribute("disabled", false);
          console.log(data.responseText);
      });
}
