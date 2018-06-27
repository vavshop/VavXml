/**
 * Created by manager on 13.01.16.
 */
function validate_form(){
    var pass_1 = $('#id_password')[0];
    var pass_2 = $('#id_password2')[0];
    if (pass_1.value != pass_2.value){
        $(pass_2).parent().addClass('has-error');
        $('p[name=validation_error]')[0].innerHTML = gettext('Passwords mismatch.');
        return false;
    }
    else{
        if (pass_1.value.length > 3)
            return true;
        else{
            var inp_1 = $('#id_password')[0].parentElement.getAttribute('style').split(':')[1].trim();
            if (inp_1 != 'none') {
                $(pass_2).parent().addClass('has-error');
                $('p[name=validation_error]')[0].innerHTML = gettext('Password is to short.');
                return false;
            }
            else{
                return true
            }
        }
    }
}
function showResetPasswordBlock() {
    var inp_1 = $('#id_password');
    var inp_2 = $('#id_password2');
    var display = inp_1[0].parentElement.getAttribute('style').split(':')[1].trim();
    if (display == 'none'){
        inp_1[0].parentElement.setAttribute('style', 'display:normal');
        inp_2[0].parentElement.setAttribute('style', 'display:normal')
    }
    else
    {
        inp_1[0].parentElement.setAttribute('style', 'display:none');
        inp_2[0].parentElement.setAttribute('style', 'display:none')
    }

}

function validate_decimal(field){
    var reg_int = /[0-9]+$/;
    var point = /\.$/;
    return ((reg_int.test(field.value) || point.test(field.value)) || not (length(field.value.split('.')>1)))
}
