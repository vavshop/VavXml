// Docs at http://simpleweatherjs.com

$(document).ready(function() {
  /* Does your browser support geolocation? */
  if ("geolocation" in navigator) {
    //console.log('test navigator');
    $('.js-geolocation').show();
    /* Where in the world are you? */
    navigator.geolocation.getCurrentPosition(function (position) {
      loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    }, function(er) { console.error(er.message);});
  } else {
    $('.js-geolocation').hide();
  }
});


function loadWeather(location, woeid) {
  $.simpleWeather({
    location: location,
    woeid: woeid,
    unit: 'f',
    success: function(weather) {
      html = '<span>'+weather.temp+'&deg;'+weather.units.temp+'<img src='+weather.thumbnail+'></img></span>'+weather.city+', '+weather.region;
      if(weather.region == ' Ternopil Oblast')
        html = '<span>'+weather.alt.temp+'&deg;'+weather.alt.unit+'<img src='+weather.thumbnail+'></img></span>'+weather.city+', '+weather.region;
      $("#weather").html(html);

      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
}
