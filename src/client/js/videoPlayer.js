const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("volume");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5
video.volume = volumeValue;

const handlePlayClick = (e) => {
    // if the video is playing, pause it
    // else play the video
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = (video.muted ? 0 : volumeValue);
}

const handleVolumeChange = (e) => {
	const { target : { value } } = e;
	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = "Mute";
	}
    volumeValue = value;
	video.volume = value;
}
const formatTime = (seconds) => new Date(seconds * 1000).toISOString().substr(14,5);
const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeline.max = Math.floor(video.duration);
}
const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeline.value = Math.floor(video.currentTime);
}

const handleTimelineChange = (e) => {
    const { target: { value } } = e;
	video.currentTime = value;
}

const handleFullscreen = () => {
    const fullscreen = document.fullscreenElement;
    if(fullscreen) {
        document.exitFullScreen();
        fullScreenBtn.innerText = "Enter Full Screen";
    }else {
        videoContainer.requestFullscreen();
        fullScreenBtn.innerText = "Exit Full Screen";
    }
}
const hideControls = () => { videoControls.classList.remove("showing"); }
const handleMouseMove = () => {
    if(controlsTimeout) {
        clearTimeout(controlsTimeout)
        controlsTimeout = null;
    }
    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
	videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout (hideControls, 3000);
}

const handleMouseleave = () => {
    controlsTimeout = setTimeout(hideControls, 3000)

}

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullscreen);
video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseleave);