function EditBlackList(obj){
    // row variables
    var id = $(obj).parents('tr').attr('id');
    var tr = $(obj).parents('tr');
    var table = $('#blacklist').DataTable();
    var row_info = table.row( tr ).data();

    $('form#edit-block-form')[0].reset();
    $('#edit-block-window input[name=block_id]').val(row_info.id);
    $('#edit-block-window input[name=code_name]').val(row_info.code_name);
    $('#edit-block-window input[name=value]').val(row_info.value);
    $('#edit-block-window input[name=type]').val(row_info.type);
}

function confirmDeleteItem(obj, item) {
    var id = $(obj).parents('tr').attr('id');
    var tr = $(obj).parents('tr');
    var table = $('#blacklist').DataTable();
    var row_info = table.row( tr ).data();
    $('#modalDelete #delete_title').html('Delete '+row_info.type);
    $('#modalDelete #delete_message').html('Are you sure you want to delete <b>'+row_info.value+'</b>?');
    $('#modalDelete #del button#delete')[0].setAttribute("onclick","delete_item("+ id +")");
}

function delete_item(iid){
    var url = '/protect/blacklist/delete/';
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(url, {
        iid: iid
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(data){
          data = eval(data)
          if (!data.error) {
            $('#blacklist').DataTable().ajax.reload();
            $('#modalDelete button[name=close]')[0].click();
          }else {
             new PNotify({
                 title: '{{_("Error")}}',
                 text: data.message,
                 type: 'error'
                 })
          }
        });
}

function ShowAdvancedSearch() {
    $('#dv-adv-search').toggle('slow');
}

function ExtendedSearch(obj) {
    var formData = $('form#advanced-search').serialize();
    var date = $('#date-range').val();
    var type_doc = $(obj).attr('id');
    if (type_doc == 'search-blacklist') {
        var requestStr = '/protect/blacklist.json?for=table_search&' + formData + '&date-range=' + date;
        console.log(requestStr);
        var $table = $('table#blacklist');
        $table.DataTable().destroy();
        $table.DataTable({
            "dom": 'Bflrtip',
            "buttons": buttons_blacklist,
            "ajax": requestStr,
            fnCreatedRow: function( nRow, aData, iDataIndex ) {
                $(nRow).attr('id',aData.id);
            },
            "columns": columns_blacklist,
            "order": [[ 2, 'desc' ], [ 1, "desc" ]],
        })
    }
}

function ResetEstimateSearch(){
    $('#advanced-search select').select2('val', '');
    $('input[name=ignore-date]').iCheck('check');
}



function ChangeCountryStatus(id, type) {
    var table = $('#country_list').DataTable();
    ajaxSetup();
    $.ajax({
        type: 'POST',
        url: '/protect/rules/country/change/',
        data: {
            'id': id,
            'type': type
        }
    })
        .success(function (data) {
          console.log(data);
            if (!data.error) {
              console.log('ok');
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
