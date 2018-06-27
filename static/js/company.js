/**
 * Created by manager on 15.01.16.
 */

function initSelect(type){
    if (type == 'groups')
        $("#add-company-form #groups_list").select2({
            ajax: {
                url: '/company/groups.json?for=select',
                processResults: function (data){
                    return {
                        results: data
                    }
                }
            }
        }).val(null).trigger('change');
        $("#new-client-form #groups_list").select2({
            ajax: {
                url: '/company/groups.json?for=select',
                processResults: function (data){
                    return {
                        results: data
                    }
                }
            }
        }).val(null).trigger('change');
        $("#add-client-form #groups_list").select2({
            ajax: {
                url: '/company/groups.json?for=select',
                processResults: function (data){
                    return {
                        results: data
                    }
                }
            }
        }).val(null).trigger('change');
}

function convertToClientGroup(id){
    ajaxSetup();
    $.post('/company/convert_to_group/', {id: id})
        .error(function(data){
            console.log(data.responseText);
        })
        .success(function(data){
            if (data.error)
                alert(data.message);
            else
                location = data.link;
        });
}

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


function CheckSelectedTaxes(list_str){
    var lst = list_str.split(',');
    //console.log(lst.length);
    var count = lst.length-1;
    for (var i = 0; i < count; i++){
        var id = lst[i];
        console.log(i);
        try {
            $('#taxes #' + id)[0].checked = true;
        }
        catch (e){
            //console.log(e);
        };
    }
}

function Get_Taxes_List(select_checkbox, list_str){
    $.ajax('/company/taxes/').success(function(data){
        var inner_html = "";
        for (var i = 0; i < data.length; i++){
            inner_html += "<div class='checkbox'><label><input type='checkbox' name='tax' id='"+ data[i].id +"'>" +
                data[i].name + " ("+ data[i].value + "%)" + "</label></div>";
        }
        inner_html+="<div class='form-group'><a href='#modal-add-tax' data-toggle='modal' type='button' class='btn btn-success btn-xs'>Add new tax</a></div>";
        $('div#taxes')[0].innerHTML = inner_html;
        //console.log(inner_html);
        if (select_checkbox){
            CheckSelectedTaxes(list_str);
        }
    });
}

function AddNewTax(select_checkboxes, list_str){
    var name = $('form.form-horizontal input[name=name]')[0].value;
    var value =$('form.form-horizontal input[name=value]')[0].value;
    var company_id = $('form.form-horizontal input[name=company_id]')[0].value;
    console.log(name, value, company_id);
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/company/create_tax/', {name: name, value: value, company_id: company_id})
        .error(function(data){
            console.log(data.responseText);
        })
        .success(function(data){
            console.log(data);
            Get_Taxes_List(select_checkboxes, list_str);
            $('form.form-horizontal input[name=name]')[0].value = '';
            $('form.form-horizontal input[name=value]')[0].value = '';
            $('button.close')[0].click();
        });
    //console.log(name);
}

function CreateNewItem(){
    var cbx_list = $('#taxes input:checked');
    var item_taxes = "";
    for (var i = 0; i < cbx_list.length; i++){
        item_taxes += cbx_list[i].getAttribute('id') +',';
    }
    if (item_taxes.length > 0) {
        item_taxes += cbx_list.length + 1
    }
    else {
        item_taxes = '0'
    }
    var inp = "<input type='hidden' name='taxes' value='" + item_taxes + "'>";
    $('#taxes').html(inp);
    console.log(item_taxes);
    return true;
}


function ConfirmDeleteClient(obj, profile){
    if (!profile) {
        var id = $(obj).parents('tr').attr('id');
        var row = $(obj).parents('tr')[0];
        $('#confirm-delete-window button[name=delete]')[0].setAttribute('onclick', 'deleteClient(' + id + ',' + profile +  ')');
        var str = gettext("You try delete")+" <b>" + row.cells[0].innerHTML + "</b>. "+gettext("Are you sure?");
        $('#confirm-delete-window div.box-body')[0].innerHTML = str;
    }
    else {
        var id = obj;
        if ($('input[name=type]').val() == 'company') {
            var company_name = $('h3#client_company_name').html();
            $('#confirm-delete-window button[name=delete]')[0].setAttribute('onclick', 'deleteClient(' + id + ',' + profile +  ')');
            var str = gettext("You try delete")+" <b>" + company_name + "</b>. "+gettext("Are you sure?");
            $('#confirm-delete-window div.box-body')[0].innerHTML = str;
        }
        if ($('input[name=type]').val() == 'client') {
            var client_name = $('h3#client_name').html();
            $('#confirm-delete-window button[name=delete]')[0].setAttribute('onclick', 'deleteClient(' + id + ',' + profile + ')');
            var str = gettext("You try delete")+" <b>" + client_name + "</b>. "+gettext("Are you sure?");
            $('#confirm-delete-window div.box-body')[0].innerHTML = str;
        }
    }
}

function AddNewClient(data, is_company) {
    var table = $('#clients').DataTable();
    if (!is_company) {
        var addr = $('#add-client-form input[name=address]').val().split(',')[0];
        var client = {
            'id': data.id,
            'first_name': $('#add-client-form input[name=first_name]').val(),
            'last_name': $('#add-client-form input[name=last_name]').val(),
            'email': $('#add-client-form input[name=email]').val(),
            'mobile_phone': $('#add-client-form input[name=phone]').val(),
            'another_phone': $('#add-client-form input[name=another_phone]').val(),
            'city': $('#add-client-form input[name=city]').val(),
            'state': $('#add-client-form input[name=state]').val(),
            'zip_code': $('#add-client-form input[name=zip_code]').val(),
            'address': addr,
            'address2': $('#add-client-form input[name=address2]').val(),
            'is_company': is_company,
            'company_name': ''
        };
    }
    if (is_company) {
        var addr = $('#add-company-form input[name=address]').val().split(',')[0];
        var client = {
            'id': data.id,
            'first_name': $('#add-company-form input[name=first_name]').val(),
            'last_name': $('#add-company-form input[name=last_name]').val(),
            'email': $('#add-company-form input[name=email]').val(),
            'mobile_phone': $('#add-company-form input[name=phone]').val(),
            'another_phone': $('#add-company-form input[name=another_phone]').val(),
            'city': $('#add-company-form input[name=city]').val(),
            'state': $('#add-company-form input[name=state]').val(),
            'zip_code': $('#add-company-form input[name=zip_code]').val(),
            'address': addr,
            'address2': $('#add-company-form input[name=address2]').val(),
            'is_company': is_company,
            'company_name': $('#add-company-form input[name=company_name]').val()
        };
    }

    table.row.add(client).draw();
}

function Group(data){
    var table = $('#groups').DataTable();
    var date = new Date();
    if ($('#add-group-form #mult_sel').val())
        var count = $('#add-group-form #mult_sel').val().length;
    else
        count = 0;
    var group = {
        'group_id': data.id,
        'group_name':$('#add-group-form input[name=group_name]').val(),
        'count_clients': count,
        'modified': date.toUTCString()
    };
    table.row.add(group).draw();
}

/*
    var row = document.createElement('tr');
    row.setAttribute('id', data[0]);
    var comma = ($('#add-client-form input[name=another_phone]').val() == '') ? '' : ', ';
    row.innerHTML = "<td>" + $('#add-client-form input[name=first_name]').val() + " " + $('#add-client-form input[name=last_name]')[0].value + "</td>";
    row.innerHTML += "<td>" + $('#add-client-form input[name=email]').val() + "</td>";
    row.innerHTML += "<td>" + $('#add-client-form input[name=phone]').val() + comma + $('#add-client-form input[name=another_phone]')[0].value + "</td>";
    row.innerHTML += "<td>" + $('#add-client-form input[name=city]').val() + "</td>";
    row.innerHTML += "<td>" + $('#add-client-form input[name=zip_code]').val() + "</td>";
    var innHTML = "";
    if ($.inArray('company.change_client', data) != -1)
        innHTML += "<span data-toggle='tooltip' title='Edit information about the " + $('#add-client-form input[name=first_name]')[0].value +
            + " " + $('#add-client-form input[name=last_name]')[0].value +"'><a href='#edit-client-window' data-toggle='modal' class='btn btn-info fa fa-pencil' onclick='GetClientInfo(this);'></a></span>&nbsp;";
    var delConfirm = "confirmDeleteClient(this, 'client')";
    if ($.inArray('company.delete_client', data) != -1)
        innHTML += "<span data-toggle='tooltip' title='Delete client'><button type='button' data-toggle='modal' data-target='#confirm-delete-window' class='btn btn-danger fa fa-trash-o' onclick='ConfirmDeleteClient(this)'></button></span>";
    var td = document.createElement('td');
    td.setAttribute('iid', data[0]);
    td.innerHTML = innHTML;
    row.appendChild(td);
    var tbody = $('table#clients tbody')[0];
    tbody.appendChild(row);
    */

function deleteClient(id, profile){
    ajaxSetup();
    var row = $('#clients tr[id=' + id + ']');
    $.post('/company/delete_client/', {iid: id})
        .error(function(data){
            console.log(data.responseText);
        })
        .success(function(){
            if (!profile) {
                $('#confirm-delete-window button[name=close]')[0].click();
                var table = $('#clients').DataTable();
                table.row(row).remove().draw();
            }
            else
                location = '/company/clients/';
            //row.parentElement.removeChild(row);
        });
}

function prepareDeleteDuplicate(obj, profile) {
    var id = $(obj).parents('tr').attr('id');
    var row = $(obj).parents('tr')[0];
    $('#confirm-delete-window button[name=delete]').attr('onclick','deleteClient('+id+','+profile+')');
    var str = gettext('You try delete')+" <b>" + row.cells[0].innerHTML + "</b>. "+gettext('Are you sure?');
    $('#confirm-delete-window div.box-body')[0].innerHTML = str;
}

//Функція загружає інофмацію про клієнта із сервера
function GetClientInfo(obj){
    if ($(obj).parents('tr').length > 0)
        var cid=$(obj).parents('tr')[0].getAttribute('id');
    if ($(obj).parents('li').length >0)
        var cid = $(obj).parents('li').attr('id');
    ajaxSetup();
    $.post('/company/get_client_info/', { cid: cid})
        .success(function(data){
            var client = JSON.parse(data);
            $('#edit-client-form input[name=first_name]')[0].value = client.first_name;
            $('#edit-client-form input[name=last_name]')[0].value = client.last_name;
            $('#edit-client-form input[name=phone]')[0].value = client.mobile_phone;
            if ($('#edit-client-form input[name=company_name]'))
                $('#edit-client-form input[name=company_name]').val(client.company_name);
            if (client.another_phone == 'None')
                $('#edit-client-form input[name=another_phone]')[0].value = '';
            else
                $('#edit-client-form input[name=another_phone]')[0].value = client.another_phone;
            $('#edit-client-form input[name=email]')[0].value = client.email;
            $('#edit-client-form input[name=city]')[0].value = client.city;
            $('#edit-client-form input[name=state]')[0].value = client.state;
            $('#edit-client-form input[name=cid]')[0].value = client.id;
            $('#edit-client-form input[name=zip_code]')[0].value = client.zip_code;
            $('#edit-client-form input[name=coming_from]').val(client.came_from);
            $('#edit-client-form input[name=address]')[0].value = client.address;
            $('#edit-client-form input[name=address2]')[0].value = client.address2;
            $('#edit-client-form textarea[name=note]')[0].value = client.note;

            var $select = $('#edit-client-form #group_ids').select2({
                ajax: {
                    url: '/company/groups.json?for=select',
                    dataType: 'json',
                    processResults: function (data) {
                        return {
                            results: data
                        }
                    }
                }});
            $select.val(client.gids).trigger("change");

        })
        .error(function(data){
            console.log(data.responseText);
        });
}

function UpdateClientInfoInTable(profile){
    var cid = $('#edit-client-form input[name=cid]')[0].value;
    var row = $('#clients tr[id='+cid+']')[0];
    if (!profile) {
        row.cells[0].innerHTML = $('#edit-client-form input[name=first_name]')[0].value + " " + $('#edit-client-form input[name=last_name]')[0].value;
        row.cells[1].innerHTML = $('#edit-client-form input[name=email]')[0].value;
        row.cells[2].innerHTML = $('#edit-client-form input[name=phone]')[0].value + ", " + $('#edit-client-form input[name=another_phone]')[0].value;
        row.cells[3].innerHTML = $('#edit-client-form input[name=city]')[0].value;
        row.cells[4].innerHTML = $('#edit-client-form input[name=zip_code]')[0].value;
        $('#edit-client-window button[name=close]')[0].click();
    }
    else {
        var client_name = $('#edit-client-form input[name=first_name]').val() + " " + $('#edit-client-form input[name=last_name]').val();
        if ($('p#client_type').html() == 'Client')
            var company_name = '';
        else
            var company_name = $('#edit-client-form input[name=company_name]').val();
        var loc = $('#edit-client-form input[name=address]').val().split(',')[0];
        var address2 = $('#edit-client-form input[name=address2]').val();
        if (address2 != '')
            loc += ", " + address2;

        var city = $('#edit-client-form input[name=city]').val();
        var state = $('#edit-client-form input[name=state]').val();
        if ((city != "") || (state != ""))
            loc += "</br>";
        if ((state != ""))
            if ((city != ""))
                loc += city + ", " + state;
            else
                loc += state;
        else
            loc += city;

        var zip_code = $('#edit-client-form input[name=zip_code]').val();
        if (zip_code != "")
            loc += "</br>" + zip_code;
        if ($('p#client_type').html() == 'Client')
            var contacts = '';
        else
            var contacts = "<strong>contact person: </strong>" + $('#edit-client-form input[name=first_name]').val() + " " + $('#edit-client-form input[name=last_name]').val() + "</br>";
        contacts += "<strong>mobile: </strong>" + $('#edit-client-form input[name=phone]').val();
        if ($('#edit-client-form input[name=another_phone]').val() != '')
            contacts += "</br><strong>cell: </strong>" + $('#edit-client-form input[name=another_phone]').val();
        var email = $('#edit-client-form input[name=email]').val();
        if (email != "")
            contacts += "</br><strong>email: </strong>" + email;


        var came_from = $('#edit-client-form input[name=coming_from]').val();

        var $selectedOptions = $('#edit-client-form #group_ids option:selected');
        var p_client_groups_text = '';
        $selectedOptions.each(function(){
            p_client_groups_text += "<a href='/company/edit_group.json/" + $(this).val() + "/'><span class='label label-primary'>" + $(this).text() + "</span></a>\n";
        });
        if ($selectedOptions.length == 0)
            $('div#dv_client_groups').hide();
        if ($selectedOptions.length > 0)
            $('div#dv_client_groups').show();
        $('p#client_groups').html(p_client_groups_text);
        if (loc == ""){
            $('p#client_location').prev().hide();
            $('p#client_location').next().hide();
            $('p#client_location').hide();
        }
        else {
            $('p#client_location').html(loc);
            $('p#client_location').prev().show();
            $('p#client_location').show();
            $('p#client_location').next().show();
        }
        if (came_from == '')
            $('div#dv_client_came_from').hide();
        else {
            $('p#client_came_from').html(came_from);
            $('div#dv_client_came_from').show();
        }
        $('p#client_contacts').html(contacts);
        if ($('p#client_type').html() == 'Client') {
            $('h1#client_name').html(client_name);
            $('h3#client_name').html(client_name);
        }
        else {
            $('h1#client_company_name').html(company_name);
            $('h3#client_company_name').html(company_name);
        }
        $('a[href=#tab_invoices]').click();
    }

}


/*
function GetClients(){
    ajaxSetup();
    $.post('/company/clients/')
        .success(function(data){
            var clients = data;
            //console.log(data);
            var inHTML = '';
            for (var i = 0; i < clients.length; i++){
                var client = JSON.parse(clients[i]);
                inHTML += "<a href='#' class='list-group-item' onclick='selectClientForEstOrInv(" + client.id + ")'>" + client.first_name + " " + client.last_name + "</a>";
            }
            $('#MyClients div').html(inHTML);

        })
        .error(function(data){
            console.log(data.responseText);
        });
}
*/



function DeleteGroup(){
    var gid = $('#ggr_id').val();
    console.log(gid);
    $.ajax({
        url: '/company/delete.json',
        data: 'gid='+$('#ggr_id').val(),

        success: function(){
            $('#close').click();
            $(location).attr('href','/company/clients/?tab=groups')
        }
    })
}



function sv_ny_cl(){
    var gid = $('#ggr_id').val();
    var cl_id = $("#client_list").select2().val();
    console.log('ok');
    $.ajax({
        url:'/company/add_new_cl/',
        data: 'gid='+ gid+'&'+'cl_id='+ cl_id,

        success:function(data){
            console.log(data);
            for (var i=0; i<data.length; i++){
                var table = $('#clients_table').DataTable();
                var full_name = "<a href='/company/client_profile/"+data[i].id+"/'>"+data[i].first_name+" "+data[i].last_name;"</a>"
                var row_rv = [
                    full_name,
                    data[i].mobile_phone+' '+data[i].another_phone,
                    data[i].address+' '+data[i].address2,
                    data[i].city,
                    data[i].state,
                    data[i].zip_code
                ];
                table.row.add(row_rv).draw();
            }
        }
    })
}

function Change_place() {
    var val =  $('#check option:selected').val();
    var id = $('#id_c').val();
    console.log(val);
    $.ajax({
        url:'/auth/save_place/',
        data:{
            'val': val,
            'id': id
        }
    })
    .done(function(data){
        $('#choice_place').val(parseInt(data.val));
        var temp_val = $('#choice_place').val();
        if (temp_val == 0){
            $('#change_pl_sv').html(gettext('Used: Inventory'))
        }else {
            $('#change_pl_sv').html(gettext('Used: Storage'))
        }


    })
    .fail(function(data){
        console.log(data);
        console.log(data.responseText)
    })
}


function AddInf(){
    var val = $('#id').val();
    location("/auth/changeinfo/" + val  + "/")
}
