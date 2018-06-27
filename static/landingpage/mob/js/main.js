angular.module('nc.ripple', [])
	.directive("ncRipple", function() {
	return {
		restrict: 'A',
		scope: {
			rOpacity: '@',
			rSize: '@',
			rDuration: '@',
			rColor: '@'
		},
		link: function(scope, element, attrs) {

			var COLOR_REGEXP = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$";
			var cutHex = function(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}
			var hexToR = function(h) {return parseInt((cutHex(h)).substring(0,2),16)}
			var hexToG = function(h) {return parseInt((cutHex(h)).substring(2,4),16)}
			var hexToB = function(h) {return parseInt((cutHex(h)).substring(4,6),16)}

			/* Initailizing */
			element.css('overflow', 'hidden');
			element.css('transform', 'translateZ(0)');

			if(scope.rOpacity && scope.rOpacity >= 0 && scope.rOpacity <=1)
				;
			else
				scope.rOpacity = '.5';

			if(!scope.rSize)
				scope.rSize = 200;
			if(!scope.rDuration)
				scope.rDuration=1.5;

			scope.rDurationS = scope.rDuration +'s';
			/* End of initializing */
			var r=220,g=220,b=220;

			var validates = new RegExp(COLOR_REGEXP);
			if (scope.rColor && validates.test(scope.rColor)){

				r=hexToR(scope.rColor);
				g=hexToG(scope.rColor);
				b=hexToB(scope.rColor);
			}


			var x, y=0, size={},
				offsets,
				func = function(e) {

					var ripple = this.querySelector('b.drop');

					if (ripple == null) {
						// Create ripple
						ripple = document.createElement('b');
						ripple.className += 'drop';

						// Prepend ripple to element
						this.insertBefore(ripple, this.firstChild);

						ripple.style.background = 'rgba(' + r + ',' + g +',' + b + ',' + scope.rOpacity + ')'
						ripple.style.height=scope.rSize+'px';
						ripple.style.width=scope.rSize+'px';
						size.x = ripple.offsetWidth;
						size.y = ripple.offsetHeight;
					}

					var eventType = e.type;

					// Remove animation effect
					ripple.style.animationDuration=null;
					ripple.style.oAnimationDuration=null;
					ripple.style.webkitAnimationDuration=null;
					ripple.style.mozAnimationDuration=null;
					ripple.style.msAnimationDuration=null;
					ripple.className = ripple.className.replace(/ ?(animate)/g, '');

					// get click coordinates by event type

					x = e.pageX;
					y = e.pageY;

					// set new ripple position by click or touch position
					function getPos(element) {
						var de = document.documentElement;
						var box = element.getBoundingClientRect();
						var top = box.top + window.pageYOffset - de.clientTop;
						var left = box.left + window.pageXOffset - de.clientLeft;
						return {
							top: top,
							left: left
						};
					}
					offsets = getPos(element[0]);

					innerPos = {};
					innerPos.x = e.pageX;
					innerPos.y = e.pageY;

					ripple.style.left = (innerPos.x - offsets.left - size.x / 2) + 'px';
					ripple.style.top = (innerPos.y - offsets.top - size.y / 2) + 'px';

					// Add animation effect
					ripple.style.animationDuration=scope.rDurationS;
					ripple.style.oAnimationDuration=scope.rDurationS;
					ripple.style.webkitAnimationDuration=scope.rDurationS;
					ripple.style.mozAnimationDuration=scope.rDurationS;
					ripple.style.msAnimationDuration=scope.rDurationS;
					ripple.className += ' animate';
				}
			element.on("mouseup", func);
		}
	}
});

var app = angular.module('demoapp', ['nc.ripple', 'ngMaterial'])

app.controller('demoCtrl', function($scope){
})

$(function(){
	$(".s3-slides").slick({
		dots: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000,
	});

	$(".header-menu-btn").on("click", function(){
		var btn = $(this);
		if(!btn.hasClass("menu-opened")){
			btn.addClass("menu-opened");
			$(".s1-main").hide();
			$(".s1-menu").fadeIn();
		} else {
			btn.removeClass("menu-opened");
			$(".s1-menu").hide();
			$(".s1-main").fadeIn();
		}
	});

	$(".s5-bottom-btn").on("click", function(e){
		e.preventDefault();
		var btn = $(this);
		if(!$(".s5").hasClass("text-opened")){
			$(".s5").addClass("text-opened");
			$(".s5-text-hidden").slideDown();
		} else {
			$(".s5").removeClass("text-opened");
			$(".s5-text-hidden").slideUp();
		}
	});

	$(".s6-price-info-btn").on("click", function(e){
		e.preventDefault();
		var btn = $(this),
			block = btn.parents(".s6-price"),
			ul = block.find("ul");
		if(!block.hasClass("active")){
			block.addClass("active");
			ul.slideDown();
		} else {
			block.removeClass("active");
			ul.slideUp();
		}
	});

});

(function($) {

//**************
$("#supportForm input, #supportForm textarea").jqBootstrapValidation({
  preventSubmit: true,
  submitError: function($form, event, errors) {
    // additional error messages or events
  },
  submitSuccess: function($form, event) {
    event.preventDefault(); // prevent default submit behaviour
    console.log('/company/support_mail/');
    $.ajax({
        type: 'POST',
        url: '/company/support_mail/',
        data: $($form).serialize(),
        success: function(data){
            if (!data.error) {
              $('#supportForm')[0].reset();
							new PNotify({
                  title: 'Success',
                  text: 'Email sent! We will respond shortly.',
                  type: 'success'
              })
            }
            else {
              console.log(data.message);
                new PNotify({
                    title: 'Error',
                    text: data.message,
                    type: 'error'
                })
            }
        },
        error: function(data){
            console.log(data.responseText);
        }
    });
  },
  filter: function() {
    return $(this).is(":visible");
  },
});

$().ready(function(){
	init();
});


// GOOGLE MAP

google.maps.event.addDomListener(window, 'load', init);

function init() {
	// Basic options for a simple Google Map
	// For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
	var mapOptions = {
		// How zoomed in you want the map to start at (always required)
		zoom: 11, // The latitude and longitude to center the map (always required)
		center: new google.maps.LatLng(40.1488694, -74.999837), // Philadelphia           // How you would like to style the map.
		// This is where you would paste any style found on Snazzy Maps.
		styles: [{
			"featureType": "water",
			"elementType": "geometry",
			"stylers": [{
				"color": "#e9e9e9"
			}, {
				"lightness": 17
			}]
		}, {
			"featureType": "landscape",
			"elementType": "geometry",
			"stylers": [{
				"color": "#f5f5f5"
			}, {
				"lightness": 20
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": 17
			}]
		}, {
			"featureType": "road.highway",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": 29
			}, {
				"weight": 0.2
			}]
		}, {
			"featureType": "road.arterial",
			"elementType": "geometry",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": 18
			}]
		}, {
			"featureType": "road.local",
			"elementType": "geometry",
			"stylers": [{
				"color": "#ffffff"
			}, {
				"lightness": 16
			}]
		}, {
			"featureType": "poi",
			"elementType": "geometry",
			"stylers": [{
				"color": "#f5f5f5"
			}, {
				"lightness": 21
			}]
		}, {
			"featureType": "poi.park",
			"elementType": "geometry",
			"stylers": [{
				"color": "#dedede"
			}, {
				"lightness": 21
			}]
		}, {
			"elementType": "labels.text.stroke",
			"stylers": [{
				"visibility": "on"
			}, {
				"color": "#ffffff"
			}, {
				"lightness": 16
			}]
		}, {
			"elementType": "labels.text.fill",
			"stylers": [{
				"saturation": 36
			}, {
				"color": "#333333"
			}, {
				"lightness": 40
			}]
		}, {
			"elementType": "labels.icon",
			"stylers": [{
				"visibility": "off"
			}]
		}, {
			"featureType": "transit",
			"elementType": "geometry",
			"stylers": [{
				"color": "#f2f2f2"
			}, {
				"lightness": 19
			}]
		}, {
			"featureType": "administrative",
			"elementType": "geometry.fill",
			"stylers": [{
				"color": "#fefefe"
			}, {
				"lightness": 20
			}]
		}, {
			"featureType": "administrative",
			"elementType": "geometry.stroke",
			"stylers": [{
				"color": "#fefefe"
			}, {
				"lightness": 17
			}, {
				"weight": 1.2
			}]
		}]
	}; // Get the HTML DOM element that will contain your map
	// We are using a div with id="map" seen below in the <body>
	var mapElement = document.getElementById('map'); // Create the Google Map using our element and options defined above
	var map = new google.maps.Map(mapElement, mapOptions); // Let's also add a marker while we're at it
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(40.1488694, -74.999837),
		map: map,
		icon: '/static/landingpage/img/map-marker.png'
	});
}

})(jQuery);
