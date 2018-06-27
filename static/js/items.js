/**
 * Created by vadum on 01.03.16.
 */

function AddNewItem(data){
    var table = $('#items').DataTable();
    var item = {
        'id': data.id,
        'name': $('#new-item-form input[name=name]').val(),
        'rate': $('#new-item-form input[name=rate]').val(),
        'description': $('#new-item-form [name=description]').val()
    };
    table.row.add(item).draw();
/*
    var item_id = data.id;
    var row = document.createElement('tr');
    row.setAttribute('id', item_id);
    var td1 = document.createElement('td');
    td1.innerHTML = "<td>" + $('#new-item-form input[name=name]')[0].value + "</td>";
    row.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = "<td>"+ parseFloat($('#new-item-form input[name=rate]')[0].value).toFixed(1) + "</td>";
    row.appendChild(td2);
    var td3 = document.createElement('td');
    td3.innerHTML = "<td>" + $('#new-item-form textarea[name=description]')[0].value + "</td>";
    row.appendChild(td3);
    var td4 = document.createElement('td');
    td4.setAttribute('iid', item_id);
    //тут ще треба створити функції
    var inHTML = "<span data-toggle='tooltip' title='Edit "+ $('#new-item-form input[name=name]')[0].value + "'><a href='#edit-item' data-toggle='modal' class='btn btn-info fa fa-pencil' onclick='GetItemInfo(this)'></a>&nbsp;</span>&nbsp;";
    var click = "confirmDelete(this,'tax');";
    inHTML += "<span data-toggle='tooltip' title='Delete " + $('#new-item-form input[name=name]')[0].value + "'><a href='#modalDelete' data-toggle='modal' type='button' class='btn btn-danger fa fa-trash-o' onclick='confirmDeleteItem(this, \"item\")'></a></span>";
    td4.innerHTML = inHTML;
    row.appendChild(td4);
    $('#items tbody')[0].appendChild(row);
*/
}

function ClearAddNewItem(){
    $('#new-item-form input[name=name]')[0].value='';
    $('#new-item-form input[name=rate]')[0].value='';
    $('#new-item-form textarea[name=description]')[0].value='';
}

function GetItemInfo(obj){
    var iid=$(obj).parents('td')[0].getAttribute('iid');
    var tr=$(obj).parents('tr')[0].getElementsByTagName('td');

    $('#edit-item-form input[name=iid]')[0].value = iid;
    $('#edit-item-form input[name=name]')[0].value = tr[0].innerHTML;
    $('#edit-item-form input[name=rate]')[0].value = tr[1].innerHTML;
    $('#edit-item-form textarea[name=description]')[0].value = tr[2].innerHTML;
}

function confirmDeleteItem(obj, item) {
    var itemname = $(obj).parents('tr')[0].cells[0].innerHTML;
    //console.log(itemname);
    var iid = $(obj).parents('td')[0].getAttribute('iid');
    //console.log("delete item["+iid+"]");
    $('div#del button#delete')[0].setAttribute("onclick","delete_item(" + iid + ", '" + item +"')");
}

function delete_item(iid, item){
    var row = $('table#items tr[id='+iid+']');
    //console.log(row);
    var url = '/company/delete_item/';
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(url, {
        iid: iid,
        class: item
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            var table = $('#items').DataTable();
            table.row(row).remove().draw();
            //row.parentElement.removeChild(row);
            $('div#del  button#close')[0].click();
        });
}


function UpdateItemsInfo(){
    var iid = $("#edit-item-form input[name=iid]")[0].value;
    var name = $("#edit-item-form input[name=name]")[0].value;
    var Rate = $("#edit-item-form input[name=rate]")[0].value;
    var Description = $("#edit-item-form textarea[name=description]")[0].value;
    var row = $("table#items tr[id='" + iid + "']")[0];
    row.cells[0].innerHTML = name;
    row.cells[1].innerHTML = parseFloat(Rate).toFixed(1);
    row.cells[2].innerHTML = Description;
}
