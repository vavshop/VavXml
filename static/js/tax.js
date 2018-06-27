/**
 * Created by tito on 19.02.16.
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


function AddNewTaxItem(data){
    var tax_id = data;
    var table = $('#tax_items').DataTable();
    var tax = {
        'id': tax_id,
        'name': $('#new-tax-form input[name=name]').val(),
        'value': $('#new-tax-form input[name=value]').val()
    };
    table.row.add(tax).draw();
/*
    var row = document.createElement('tr');
    row.setAttribute('id', tax_id);
    var td1 = document.createElement('td');
    td1.innerHTML = "<td>" + $('#new-tax-form input[name=name]')[0].value + "</td>";
    row.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = "<td>"+ parseFloat($('#new-tax-form input[name=value]')[0].value).toFixed(1) +" %"+ "</td>";
    row.appendChild(td2);
    var td3 = document.createElement('td');
    td3.setAttribute('iid', tax_id);
    var inHTML = "<span data-toggle='tooltip' title='Edit "+ $('#new-tax-form input[name=name]')[0].value + "'><a href='#edit-tax' data-toggle='modal' class='btn btn-info fa fa-pencil' onclick='GetTaxInfo(this)'></a>&nbsp;</span>&nbsp;";
    var click = "confirmDelete(this,'tax');";
    inHTML += "<span data-toggle='tooltip' title='Delete " + $('#new-tax-form input[name=name]')[0].value + "'><a href='#modalDelete' data-toggle='modal' type='button' class='btn btn-danger fa fa-trash-o' onclick=" + click +"></a></span>";
    td3.innerHTML = inHTML;
    row.appendChild(td3);
    $('#tax_items tbody')[0].appendChild(row);
*/
}

function GetTaxInfo(obj){
    var iid=$(obj).parents('tr')[0].getAttribute('id');
    ajaxSetup();
    $.post('/company/edit_tax/', { iid: iid})
        .success(function(data){
            var tax = JSON.parse(data);
            $('#edit-tax-form input[name=name]')[0].value = tax.name;
            $('#edit-tax-form input[name=value]')[0].value = tax.value;
            $('#edit-tax-form input[name=iid]')[0].value = iid;
        })
        .error(function(data){
            console.log(data.responseText);
        });

}

function UpdateTaxInfo(){
    var iid = $("#edit-tax-form input[name=iid]")[0].value;
    var name = $("#edit-tax-form input[name=name]")[0].value;
    var value = $("#edit-tax-form input[name=value]")[0].value;
    var row = $("table#tax_items tr[id='" + iid + "']")[0];
    row.cells[0].innerHTML = name;
    row.cells[1].innerHTML = parseFloat(value).toFixed(1)+" %";
}


function confirmDelete(obj, tax) {
    var taxname = $(obj).parents('tr')[0].cells[0].innerHTML;
    console.log(taxname);
    var iid = $(obj).parents('tr').attr('id');
    console.log(iid);
    $('div#del button#delete')[0].setAttribute("onclick","delete_tax(" + iid + ", '" + tax +"')");
}


function delete_tax(iid, tax){
    var row = $('table#tax_items tr[id='+iid+']');
    console.log(row);
    var url = '/company/delete_tax/';
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
        class: tax
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            //row.parentElement.removeChild(row);
            var table = $('#tax_items').DataTable();
            table.row(row).remove().draw();
            $('div#del  button#close')[0].click();
        });
}