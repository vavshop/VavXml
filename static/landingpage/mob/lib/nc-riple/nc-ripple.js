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
})

$(function(){
  var winwidth=640;
	var _0x6d58=["\x23\x76\x69\x65\x77\x70\x6F\x72\x74","\x77\x69\x64\x74\x68","\x63\x6F\x6E\x74\x65\x6E\x74","\x69\x6E\x69\x74\x69\x61\x6C\x2D\x73\x63\x61\x6C\x65\x3D","\x2C\x20\x6D\x61\x78\x69\x6D\x75\x6D\x2D\x73\x63\x61\x6C\x65\x3D","\x2C\x20\x6D\x69\x6E\x69\x6D\x75\x6D\x2D\x73\x63\x61\x6C\x65\x3D","\x2C\x20\x75\x73\x65\x72\x2D\x73\x63\x61\x6C\x61\x62\x6C\x65\x3D\x6E\x6F\x2C\x20\x77\x69\x64\x74\x68\x3D","\x61\x74\x74\x72","\x2C\x20\x75\x73\x65\x72\x2D\x73\x63\x61\x6C\x61\x62\x6C\x65\x3D\x6E\x6F\x2C\x20\x77\x69\x64\x74\x68\x3D\x36\x34\x30","\x72\x65\x73\x69\x7A\x65","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72"];(function(){function _0xef67x1(){var _0xef67x2=$(_0x6d58[0]),_0xef67x3=screen[_0x6d58[1]],_0xef67x4=640,_0xef67x5=_0xef67x3/ _0xef67x4,_0xef67x6=1- _0xef67x5;if(_0xef67x3< _0xef67x4){_0xef67x2[_0x6d58[7]](_0x6d58[2],_0x6d58[3]+ _0xef67x5+ _0x6d58[4]+ _0xef67x5+ _0x6d58[5]+ _0xef67x5+ _0x6d58[6]+ _0xef67x4)}else {_0xef67x2[_0x6d58[7]](_0x6d58[2],_0x6d58[3]+ _0xef67x5+ _0x6d58[4]+ _0xef67x5+ _0x6d58[5]+ _0xef67x5+ _0x6d58[8])}}window[_0x6d58[10]](_0x6d58[9],function(){_0xef67x1()});_0xef67x1()}())
});
