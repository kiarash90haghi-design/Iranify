import {
    audio,
    playerCover,
    playerTitle,
    playerArtist,
    playMain,
    nextBtn,
    prevBtn,
    progressBar,
    progressFill,
    currentTime,
    durationTime
} from "./elements.js";


const playIcon = playMain.querySelector("i");



export function loadSong(song){

    playerCover.src = song.artworkUrl100;

    playerTitle.textContent = song.trackName;
    playerArtist.textContent = song.artistName;

    audio.src = song.previewUrl;


    // reset progress
    progressFill.style.width = "0%";
    currentTime.textContent = "0:00";

}



export function playSong(){
    audio.play();

    playIcon.classList.remove("fa-play");
    playIcon.classList.add("fa-pause");

}


export function pauseSong(){
    audio.pause();

    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");

}


playMain.addEventListener("click",()=>{

    if(audio.paused){

        playSong();

    }
    
    else{

        pauseSong();

    }

});



audio.addEventListener("ended",()=>{

    document.dispatchEvent(new Event("songEnded"))

});

function formatTime(seconds){
    const minutes = Math.floor(seconds / 60);
    const secs  = Math.floor(seconds % 60);

    return `${minutes}: ${secs.toString().padStart(2, "0")}`
}

audio.addEventListener("loadedmetadata", () => {
        
    durationTime.textContent = formatTime(audio.duration);

});

audio.addEventListener("timeupdate", () => {
    if(!audio.duration) return;

    const progressPercent = 
        (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = `${progressPercent}%`;
    currentTime.textContent = formatTime(audio.currentTime);

});

progressBar.addEventListener("click", (event) => {

    const width = progressBar.clientWidth;

    const clickX = event.offsetX;

    const duration = audio.duration;


    audio.currentTime = (clickX / width) * duration;

});