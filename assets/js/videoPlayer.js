(()=>{"use strict";var e=document.querySelector("video"),t=document.getElementById("play"),n=document.getElementById("mute"),u=document.getElementById("currentTime"),d=document.getElementById("totalTime"),i=document.getElementById("volume"),l=document.getElementById("timeline"),o=document.getElementById("fullScreen"),r=document.getElementById("videoContainer"),m=document.getElementById("videoControls"),a=null,c=null,s=.5;e.volume=s;var v=function(e){return new Date(1e3*e).toISOString().substr(14,5)},E=function(){m.classList.remove("showing")};t.addEventListener("click",(function(n){e.paused?e.play():e.pause(),t.innerText=e.paused?"Play":"Pause"})),n.addEventListener("click",(function(t){e.muted?e.muted=!1:e.muted=!0,n.innerText=e.muted?"Unmute":"Mute",i.value=e.muted?0:s})),i.addEventListener("input",(function(t){var u=t.target.value;e.muted&&(e.muted=!1,n.innerText="Mute"),s=u,e.volume=u})),e.addEventListener("loadedmetadata",(function(){d.innerText=v(Math.floor(e.duration)),l.max=Math.floor(e.duration)})),e.addEventListener("timeupdate",(function(){u.innerText=v(Math.floor(e.currentTime)),l.value=Math.floor(e.currentTime)})),l.addEventListener("input",(function(t){var n=t.target.value;e.currentTime=n})),o.addEventListener("click",(function(){document.fullscreenElement?(document.exitFullScreen(),o.innerText="Enter Full Screen"):(r.requestFullscreen(),o.innerText="Exit Full Screen")})),e.addEventListener("mousemove",(function(){a&&(clearTimeout(a),a=null),c&&(clearTimeout(c),c=null),m.classList.add("showing"),c=setTimeout(E,3e3)})),e.addEventListener("mouseleave",(function(){a=setTimeout(E,3e3)}))})();