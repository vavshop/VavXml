/**
 * Created by manager on 14.01.16.
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


function confirmDeleteEmploye(obj, staff) {
    var username = $(obj).parents('tr')[0].cells[1].innerHTML;
    console.log(username);
    var uid = $(obj).parents('td')[0].getAttribute('uid');
    $('div#del button#delete')[0].setAttribute("onclick","delete_staff(" + uid + ", '" + staff +"')");
}


function delete_staff(uid, staff){
    var row = $('table#staff tr[id='+uid+']')[0];
    var url = '/staff/delete_employee/';
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(url, {
        uid: uid,
        class: staff
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            row.parentElement.removeChild(row);
            $('div#del  button#close')[0].click();
        });
}



function DeleteStaff(){
    uid = $('input[name=u_id]').val();
    var url = '/staff/delete/';
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post(url, {
        uid: uid
    })
        .error(function(data){ alert(data.responseText)})
        .success(function(){
            $('div#del  button#close')[0].click();
            location = '/staff/employees_list/';
        });
}

function change_user_group(obj){
    var p_tag = $('form.form-horizontal p.text-green')[0];
    if (p_tag)
        p_tag.innerHTML = '';
    var uid = $('form.form-horizontal input[name=uid]')[0].value;
    var g_tag = $('form.form-horizontal select[name=gid]')[0];
    var gid = g_tag.selectedOptions[0].value;
    var group_name = g_tag.selectedOptions[0].getAttribute('id');
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.post('/staff/change_user_group/', {
        uid: uid,
        gid: gid,
        group_name: group_name
    })
    .error(function(data){ console.log(data.responseText)})
    .success(function(data){
        var p = $('form.form-horizontal p.text-green')[0];
        if (!p) {
            p = document.createElement('p');
            p.setAttribute('class', 'text-green');
        }
        p.innerHTML = 'Saved.';
        var dv = obj.parentElement;
        dv.appendChild(p);
        //console.log(data.responseText);
    });
}

function clearForm(id_form){
    $("#"+id_form)[0].reset();
}

function AddNewEmployee(id, var_position, perms_list){
    var tbody = $('#staff tbody')[0];
    var firstname = $('#new-employee-form input[name=first_name]')[0].value;
    var lastname = $('#new-employee-form input[name=last_name')[0].value;
    var phone = $('#new-employee-form input[name=phone]')[0].value;
    var another_phone = $('#new-employee-form input[name=another_phone]')[0].value;
    var tr = document.createElement('tr');
    tr.setAttribute('id', id);
    var td0 = document.createElement('td');
    td0.innerHTML = id;
    tr.appendChild(td0);
    var td1 = document.createElement('td');
    td1.innerHTML ="<a href='/staff/user_profile/"+id+"/'>"+ firstname + " " + lastname+"</a>";
    tr.appendChild(td1);
    var td2 = document.createElement('td');
    td2.innerHTML = phone + ", " + another_phone;
    tr.appendChild(td2);
    var td3 = document.createElement('td');
    td3.setAttribute('uid', id);
    var confDel= "confirmDelete(this,'" + var_position + "')";
    var inHTML = "";
    /*if ($.inArray('staff.change_employee', perms_list) != -1)
        inHTML += "<span data-toggle='tooltip' title='Edit information about the employee'><a href='#edit-employee' data-toggle='modal' class='btn btn-info fa fa-pencil' onclick='GetEmployeeInfo(this);'></a></span>&nbsp; ";
    if ($.inArray('storage.add_equipments', perms_list) != -1)
        inHTML += "<span data-toggle='tooltip' title='Employee Inventory'><a href='#modal-show-inventory' data-toggle='modal' class='btn btn-default fa fa-suitcase' onclick='ShowUsersObj(this)'></a></span>&nbsp; ";
    if ($.inArray('staff.delete_employee', perms_list) != -1)
        inHTML += "<span data-toggle='tooltip' title='Delete " + var_position + "'><a href='#modalDelete' data-toggle='modal' class='btn btn-danger fa fa-trash-o' onclick="+confDel+"></a></span>&nbsp; ";
    if ($.inArray('staff.add_topmanager', perms_list) != -1)
        inHTML += "<span data-toggle='tooltip' title='Change " + var_position + " perms'><a href='/staff/user_perm/" + id + "/' class='btn btn-microsoft fa fa-android'></a></span>";*/
    td3.innerHTML = inHTML;
    tr.appendChild(td3);
    tbody.appendChild(tr);
}




//Функція загружає інофмацію про працівника із сервера
function GetEmployeeInfo(obj){
    var uid=$(obj).parents('tr')[0].getAttribute('id');
    ajaxSetup();
    $.post('/staff/get_employee_info/', { uid: uid})
        .success(function(data){
            var employee = JSON.parse(data);
            $('#edit-employee-form input[name=first_name]')[0].value = employee.first_name;
            $('#edit-employee-form input[name=last_name]')[0].value = employee.last_name;
            $('#edit-employee-form input[name=phone]')[0].value = employee.phone;
            $('#edit-employee-form input[name=another_phone]')[0].value = employee.another_phone;
            $('#edit-employee-form input[name=email]')[0].value = employee.email;
            $('#edit-employee-form input[name=uid]')[0].value = uid;
            var date_arr = employee.date_of_birth.split('.');
            var date = '';
            if (date_arr.length >0){
                date = date_arr[0];
                if (eval(date_arr[1]) < 10)
                    date += '-0' + date_arr[1];
                else
                    date += '-' + date_arr[1];
                date += '-' + date_arr[2];
            };
            $('#edit-employee-form input[name=date_of_birth]')[0].value = date;
        })
        .error(function(data){
            console.log(data.responseText);
        });

}

//Функція обновляє інформацію в табличці про працівника у таблиці з працівниками.
function UpdateEmployeeInfo(){
    var uid = $("#edit-employee-form input[name=uid]")[0].value;
    var first_name = $("#edit-employee-form input[name=first_name]")[0].value;
    var last_name = $("#edit-employee-form input[name=last_name]")[0].value;
    var phone = $("#edit-employee-form input[name=phone]")[0].value;
    var another_phone = $("#edit-employee-form input[name=another_phone]")[0].value;
    var row = $("table#staff tr[id='" + uid + "']")[0];
    row.cells[1].innerHTML = first_name + " " + last_name;
    row.cells[2].innerHTML = phone + ", " + another_phone;
}
