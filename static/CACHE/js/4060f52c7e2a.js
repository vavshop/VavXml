;function validate_form(){var pass_1=$('#id_password')[0];var pass_2=$('#id_password2')[0];if(pass_1.value!=pass_2.value){$(pass_2).parent().addClass('has-error');$('p[name=validation_error]')[0].innerHTML=gettext('Passwords mismatch.');return false;}
else{if(pass_1.value.length>3)
return true;else{var inp_1=$('#id_password')[0].parentElement.getAttribute('style').split(':')[1].trim();if(inp_1!='none'){$(pass_2).parent().addClass('has-error');$('p[name=validation_error]')[0].innerHTML=gettext('Password is to short.');return false;}
else{return true}}}}
function showResetPasswordBlock(){var inp_1=$('#id_password');var inp_2=$('#id_password2');var display=inp_1[0].parentElement.getAttribute('style').split(':')[1].trim();if(display=='none'){inp_1[0].parentElement.setAttribute('style','display:normal');inp_2[0].parentElement.setAttribute('style','display:normal')}
else
{inp_1[0].parentElement.setAttribute('style','display:none');inp_2[0].parentElement.setAttribute('style','display:none')}}
function validate_decimal(field){var reg_int=/[0-9]+$/;var point=/\.$/;return((reg_int.test(field.value)||point.test(field.value))||not(length(field.value.split('.')>1)))};function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;}
function csrfSafeMethod(method){return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));}
function ajaxSetup(){var csrftoken=getCookie('csrftoken');$.ajaxSetup({beforeSend:function(xhr,settings){if(!csrfSafeMethod(settings.type)&&!this.crossDomain){xhr.setRequestHeader("X-CSRFToken",csrftoken);}}});}
function email_test(){var email=$('#id_email').val();var res=loadHTML('/auth/email_test/?email='+email);if(res){window.sendForm=true;$('#reg_form').submit();}}
function loadHTML(sUrl){var request=null;try{request=new XMLHttpRequest();}catch(e){}
request.open('GET',sUrl,false);request.send(null);var temp=request.responseText;return eval(temp);}
function disableButton()
{var btn=document.getElementById('sbn').disabled=true;}
function disableButton3()
{var btn=document.getElementById('disab_b').disabled=true;}
function EnableButton(){document.getElementById('sbn2').disabled=false;}
function disableButton2()
{document.getElementById('sbn2').disabled=true;}
function disableButton3()
{var btn=document.getElementById('sbn3').disabled=true;}
function moveRightPerm(){var ro=$('#right')[0].selectedOptions;var rs=$('#left')[0];while(ro.length>0){ro[0].setAttribute('name','assign');rs.appendChild(ro[0]);}}
function moveLeftPerm(){var lo=$('#left')[0].selectedOptions;var ls=$('#right')[0];while(lo.length>0){lo[0].setAttribute('name','remove');ls.appendChild(lo[0]);}}
function assignPerm(){var aPerm=$('select#left option');var aStr='';var uid=$('select#left')[0].getAttribute('name');for(var i=0;i<aPerm.length;i++){aStr+=aPerm[i].getAttribute('id')+',';}
var csrftoken=getCookie('csrftoken');$.ajaxSetup({beforeSend:function(xhr,settings){if(!csrfSafeMethod(settings.type)&&!this.crossDomain){xhr.setRequestHeader("X-CSRFToken",csrftoken);}}});$.post('/staff/set_perm/',{uid:uid,astr:aStr}).error(function(data){alert(data.responseText)}).success(function(){location='/dashboard/';});}
function ChangeLangvich(len,url){url=url.replace("//","/");ajaxSetup();$.post('/i18n/setlang/',{language:len,next:url}).error(function(data){console.log(data.responseText);}).success(function(){window.location.href=url;});}
function bin_load(){$.ajax({type:'POST',url:'/protect/bin_result/',data:$('#binform').serialize(),success:function(data){data=eval(data);console.log(data)
if(!data.error){console.log('to do something')
var str=''
str+='<tr><td width="200px"><strong>valid</strong></td><td>'+data.bin_valid+'</td></tr>'
str+='<tr><td><strong>card brand</strong></td><td>'+data.bin_card_brand+'</td></tr>'
str+='<tr><td><strong>card category</strong></td><td>'+data.bin_card_category+'</td></tr>'
str+='<tr><td><strong>card type</strong></td><td>'+data.bin_card_type+'</td></tr>'
str+='<tr><td><strong>country</strong></td><td>'+data.bin_country+'</td></tr>'
str+='<tr><td><strong>country code</strong></td><td>'+data.bin_country_code+'</td></tr>'
str+='<tr><td><strong>issuer</strong></td><td>'+data.bin_issuer+'</td></tr>'
str+='<tr><td><strong>issuer phone</strong></td><td>'+data.bin_issuer_phone+'</td></tr>'
str+='<tr><td><strong>issuer website</strong></td><td><a href="'+data.bin_issuer_website+'" target="_blank">'+data.bin_issuer_website+'</a></td></tr>'
$('#rbres').html(str)}else{console.log(data.message);$('#rbres').html('')
if(data.message){new PNotify({title:'Error',text:data.message,type:'error'})}}},error:function(data){console.log(data.responseText);$('#rbres').html('')}});};function getCookie(name){var cookieValue=null;if(document.cookie&&document.cookie!=''){var cookies=document.cookie.split(';');for(var i=0;i<cookies.length;i++){var cookie=jQuery.trim(cookies[i]);if(cookie.substring(0,name.length+1)==(name+'=')){cookieValue=decodeURIComponent(cookie.substring(name.length+1));break;}}}
return cookieValue;}
function csrfSafeMethod(method){return(/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));}
function AddNewTaxItem(data){var tax_id=data;var table=$('#tax_items').DataTable();var tax={'id':tax_id,'name':$('#new-tax-form input[name=name]').val(),'value':$('#new-tax-form input[name=value]').val()};table.row.add(tax).draw();}
function GetTaxInfo(obj){var iid=$(obj).parents('tr')[0].getAttribute('id');ajaxSetup();$.post('/company/edit_tax/',{iid:iid}).success(function(data){var tax=JSON.parse(data);$('#edit-tax-form input[name=name]')[0].value=tax.name;$('#edit-tax-form input[name=value]')[0].value=tax.value;$('#edit-tax-form input[name=iid]')[0].value=iid;}).error(function(data){console.log(data.responseText);});}
function UpdateTaxInfo(){var iid=$("#edit-tax-form input[name=iid]")[0].value;var name=$("#edit-tax-form input[name=name]")[0].value;var value=$("#edit-tax-form input[name=value]")[0].value;var row=$("table#tax_items tr[id='"+iid+"']")[0];row.cells[0].innerHTML=name;row.cells[1].innerHTML=parseFloat(value).toFixed(1)+" %";}
function confirmDelete(obj,tax){var taxname=$(obj).parents('tr')[0].cells[0].innerHTML;console.log(taxname);var iid=$(obj).parents('tr').attr('id');console.log(iid);$('div#del button#delete')[0].setAttribute("onclick","delete_tax("+iid+", '"+tax+"')");}
function delete_tax(iid,tax){var row=$('table#tax_items tr[id='+iid+']');console.log(row);var url='/company/delete_tax/';var csrftoken=getCookie('csrftoken');$.ajaxSetup({beforeSend:function(xhr,settings){if(!csrfSafeMethod(settings.type)&&!this.crossDomain){xhr.setRequestHeader("X-CSRFToken",csrftoken);}}});$.post(url,{iid:iid,class:tax}).error(function(data){alert(data.responseText)}).success(function(){var table=$('#tax_items').DataTable();table.row(row).remove().draw();$('div#del  button#close')[0].click();});}