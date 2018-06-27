/*
// Определяем переменную map
var map;

// Функция initMap которая отрисует карту на странице
function initMap() {

    // В переменной map создаем объект карты GoogleMaps и вешаем эту переменную на <div id="map"></div>
    map = new google.maps.Map(document.getElementById('map'), {
        // При создании объекта карты необходимо указать его свойства
        // center - определяем точку на которой карта будет центрироваться
        center: {lat: 55.760186, lng: 37.618711},
        // zoom - определяет масштаб. 0 - видно всю платнеу. 18 - видно дома и улицы города.
        zoom: 18,

        // Добавляем свои стили для отображения карты
        styles: [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#46bcec"},{"visibility":"on"}]}]
    });

    // Создаем маркер на карте
    var marker = new google.maps.Marker({

        // Определяем позицию маркера
        position: {lat: 55.760186, lng: 37.618711},

        // Указываем на какой карте он должен появится. (На странице ведь может быть больше одной карты)
        map: map,

        // Пишем название маркера - появится если навести на него курсор и немного подождать
        title: 'Наш маркер: Большой театр',

        // Укажем свою иконку для маркера
        icon: 'http://rightblog.ru/wp-content/uploads/2016/07/theatre_icon.png'
    });

    // Создаем наполнение для информационного окна
    var contentString = '<div id="content">'+
          '<div id="siteNotice">'+
          '</div>'+
          '<h1 id="firstHeading" class="firstHeading">Большой театр</h1>'+
          '<div id="bodyContent">'+
          '<p>Госуда́рственный академи́ческий Большо́й теа́тр Росси́и, или просто Большой театр — один из крупнейших' +
          'в России и один из самых значительных в мире театров оперы и балета.</p>'+
          '<p><b>Веб-сайт:</b> <a href="http://www.bolshoi.ru/" target="_blank">bolshoi.ru</a>'+
          '</p>'+
          '</div>'+
          '</div>';

    // Создаем информационное окно
    var infowindow = new google.maps.InfoWindow({
       content: contentString,
       maxWidth: 400
    });

    // Создаем прослушивание, по клику на маркер - открыть инфо-окно infowindow
    marker.addListener('click', function() {
        infowindow.open(map, marker);
    });

} */

var map;
var locations = [
      ]

var two_in_one = false;


//new location
if($('#location2_x').val()){
  var location_x = parseFloat($('#location2_x').val());
  var location_y = parseFloat($('#location2_y').val());
  locations.push({lat: location_x, lng: location_y})
}else if($('#location_x').val()){
  var location_x = parseFloat($('#location_x').val());
  var location_y = parseFloat($('#location_y').val());
  locations.push({lat: location_x, lng: location_y})
}

var off_billing = false;
if($('#billing_address2_x').val()){
  var billing_address_x = parseFloat($('#billing_address2_x').val());
  var billing_address_y = parseFloat($('#billing_address2_y').val());
  locations.push({lat: billing_address_x, lng: billing_address_y})
}else if($('#billing_address_x').val()){
  var billing_address_x = parseFloat($('#billing_address_x').val());
  var billing_address_y = parseFloat($('#billing_address_y').val());
  locations.push({lat: billing_address_x, lng: billing_address_y})
}else{
  off_billing = true;
}

if($('#shipping_address2_x').val()){
  var shipping_address_x = parseFloat($('#shipping_address2_x').val());
  var shipping_address_y = parseFloat($('#shipping_address2_y').val());
  if(billing_address_x == shipping_address_x && billing_address_y == shipping_address_y){
    two_in_one = true;
  }else{
    locations.push({lat: shipping_address_x, lng: shipping_address_y})
  }
}else if($('#shipping_address_x').val()){
  var shipping_address_x = parseFloat($('#shipping_address_x').val());
  var shipping_address_y = parseFloat($('#shipping_address_y').val());
  if(billing_address_x == shipping_address_x && billing_address_y == shipping_address_y){
    two_in_one = true;
  }else{
    locations.push({lat: shipping_address_x, lng: shipping_address_y})
  }
}
 var labels = ['L','B','S'];

 if(off_billing){
   labels = ['L','S'];
 }
 if(two_in_one){
   labels = ['L','B&S'];
 }
function initMap(type) {
  var mapdiv = document.getElementById('map');
  if(type == 2){
    mapdiv = document.getElementById('map2');
  }
  var location_x = 41.589656;
  var location_y = -93.648248;

  if($('#location_x')){
    location_x = parseFloat($('#location_x').val());
    location_y = parseFloat($('#location_y').val());
  }
  map = new google.maps.Map(mapdiv, {
    center: {lat: location_x, lng: location_y},
    zoom: 4,
  });
  var contentString = [];
  var contentString1 = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">Location</h4>'+
      '<div id="bodyContent">'+
      '</div>'+
      '</div>';
  contentString.push(contentString1)
  var contentString2 = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>';
  if(two_in_one){
    contentString2 += '<h4 id="firstHeading" class="firstHeading">Billing and Shipping address</h4>';
  }else{
    contentString2 +=  '<h4 id="firstHeading" class="firstHeading">Billing address</h4>';
  }
  contentString2 +='<div id="bodyContent">'+
    '</div>'+
    '</div>';
  contentString.push(contentString2)
  var contentString3 = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h4 id="firstHeading" class="firstHeading">Shipping address</h4>'+
      '<div id="bodyContent">'+
      '</div>'+
      '</div>';
  contentString.push(contentString3)



  var markers = locations.map(function(location, i) {
          var marker1 = new google.maps.Marker({
            position: location,
            label: labels[i % labels.length],
            map:map,
          });
          var infowindow = new google.maps.InfoWindow({
            content: contentString[i]
          });
          marker1.addListener('click', function() {
            infowindow.open(map, marker1);
          });
          return marker1;
    });


  // Add a marker clusterer to manage the markers.
  var markerCluster = new MarkerClusterer(map, markers,
      {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
  // add center
      var latlngbounds = new google.maps.LatLngBounds();
    for ( var i=0; i<locations.length; i++ ){
         latlngbounds.extend(locations[i]);
    }
    map.setCenter( latlngbounds.getCenter(), map.fitBounds(latlngbounds));
    //end center

  var input = (// @type {!HTMLInputElement}
      document.getElementById('pac-input'));
  if(type == 2){
    input = (document.getElementById('pac-input2'));
  }

  var types = document.getElementById('type-selector');
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  //map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);
  if(type == 2){
    $('#pac-input2').val('WDAF-TV Kansas City, KCMO, MO, United States')
  }

  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var marker = new google.maps.Marker({
    map: map,
    anchorPoint: new google.maps.Point(0, -29)
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    console.log(place.geometry.location.lat());
    console.log(place.geometry.location.lng());

    if (!place.geometry) {
      window.alert("Autocomplete's returned place contains no geometry");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(16);  // Why 17? Because it looks good.
    }
    marker.setIcon(({//* @type {google.maps.Icon}
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    var comment = address +"<br />"+ $('#task-description').val().replace(/\r\n|\r|\n/g,"<br />");
    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + comment);
    infowindow.open(map, marker);
  });


  // Создаем прослушивание, по клику на маркер - открыть инфо-окно infowindow
marker.addListener('click', function() {
     infowindow.open(map, marker);
});
if(!$('#billing_distance_ip') && 2 == 1){
  var location_x = parseFloat($('#location2_x').val());
  var location_y = parseFloat($('#location2_y').val());
  console.log('location_x='+location_x+', location_y='+location_y);
  console.log('billing_address_x='+billing_address_x+', billing_address_y='+billing_address_y);
  console.log('shipping_address_x='+shipping_address_x+', shipping_address_y='+shipping_address_y);
  if(billing_address_x){
    var billing_distance_ip = Math.ceil(google.maps.geometry.spherical.computeDistanceBetween(
       new google.maps.LatLng(location_x,location_y), new google.maps.LatLng(billing_address_x, billing_address_y)) / 1000)
  }
  if(shipping_address_x){
    var shipping_distance_ip = Math.ceil(google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(location_x,location_y), new google.maps.LatLng(shipping_address_x, shipping_address_y)) / 1000)
  }
  if(shipping_address_x && billing_address_y){
    var shipping_distance_billing = Math.ceil(google.maps.geometry.spherical.computeDistanceBetween(
      new google.maps.LatLng(shipping_address_x,shipping_address_y), new google.maps.LatLng(billing_address_x, billing_address_y)) / 1000)
  }
     console.log(billing_distance_ip);
     console.log(shipping_distance_ip);
     console.log(shipping_distance_billing);
 }
//len1 = Math.ceil(len1 / 1000);


}/**/
