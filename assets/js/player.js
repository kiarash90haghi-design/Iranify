import {
    audio,
    playerCover,
    playerTitle,
    playerArtist,
    playMain,
    nextBtn,
    prevBtn
} from "./elements.js";


const playIcon = playMain.querySelector("i");


let currentSongs = [];
let currentSongIndex = 0;



export function setSongs(songs){

    currentSongs = songs;

}



export function loadSong(song){

    playerCover.src = song.artworkUrl100;

    playerTitle.textContent = song.trackName;

    playerArtist.textContent = song.artistName;

    audio.src = song.previewUrl;

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

    }else{

        pauseSong();

    }

});



nextBtn.addEventListener("click",()=>{


    if(currentSongIndex < currentSongs.length - 1){

        currentSongIndex++;

    }else{

        currentSongIndex = 0;

    }


    loadSong(currentSongs[currentSongIndex]);

    playSong();


});




prevBtn.addEventListener("click",()=>{


    if(currentSongIndex > 0){

        currentSongIndex--;

    }else{

        currentSongIndex = currentSongs.length - 1;

    }


    loadSong(currentSongs[currentSongIndex]);

    playSong();


});



audio.addEventListener("ended",()=>{

    pauseSong();

});