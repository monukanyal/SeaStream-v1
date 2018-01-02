function test(){
  
var videoElement = document.getElementById("media-video");
        videoElement.currentTime = 0;   
  videoElement.play();
  
var backdropElement = document.getElementById("media-video");
var mediadivElement = document.getElementById("media-video");

  backdropElement.style.visibility = 'hidden'; 
        backdropElement.style.width = '0';
mediadivElement.style.visibility = 'visible';

         if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else {
        videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitCancelFullScreen();
      }
    }

}

var el = document.getElementsByClassName('mvplay');
for (var i=0;i<el.length; i++) {
    el[i].onclick = function(){test();};
}

var hideElement = document.getElementById("hideDiv");
hideElement.onclick = function(){

 if (!document.mozFullScreen && !document.webkitFullScreen) {
      if (videoElement.mozRequestFullScreen) {
        videoElement.mozRequestFullScreen();
      } else {
        videoElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else {
        document.webkitCancelFullScreen();
      }
    }


};



