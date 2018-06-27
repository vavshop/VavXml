/**
 * Created by Vitaliy Martynyak on 04.03.16.
 */


//Input data zipcoda
//Function return object address with city and state.
function GetAddressByZipCode(geocoder, zipcode, $city, $state, $zipcode){
    geocoder.geocode({'address': zipcode, 'componentRestrictions':{'country' :'US'}}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK){
            if (results[0]){
                $(results[0].address_components).each(function(){
                    //console.log(this.long_name);
                    if (this.types[0] == 'locality') {
                        $city.val(this.long_name);
                        $city.parent('div').addClass('has-success');
                        $zipcode.parent('div').addClass('has-success');
                    }

                    if (this.types[0] == 'administrative_area_level_1') {
                        $state.val(this.long_name);
                        $state.parent('div').addClass('has-success');
                        $zipcode.parent('div').addClass('has-success');
                    }
                });
            }
            else{
               $state.val(null);
               $city.val(null);
               $city.parent('div').removeClass('has-success');
               $state.parent('div').removeClass('has-success');
               $zipcode.parent('div').removeClass('has-success');
            }
        }
    });
}