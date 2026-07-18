import { fetchSongs } from "./api.js";

import {
    albumContainer,
    searchInput,
    nextBtn,
    prevBtn
} from "./elements.js";

import {
    loadSong,
    playSong
} from "./player.js";

let currentSongs = [];
let currentSongIndex = 0;



async function init(){

    const songs = await fetchSongs("eminem");

    currentSongs = songs;

    renderAlbums(songs);

}

init();

async function searchSongs(term){

    const songs = await fetchSongs(term);
    
    currentSongs = songs;
    
    albumContainer.innerHTML = "";

    renderAlbums(songs)
}


function renderAlbums(songs){

    songs.forEach((song,index)=>{


        const albumCard = document.createElement("div");

        albumCard.classList.add("album-card");


            albumCard.innerHTML = `

            <div class="album-image">

                <img src="${song.artworkUrl100}">

            </div>


            <div class="album-info">

                <div class="album-header">

                    <h3>${song.trackName}</h3>


                    <button class="play-btn">

                        <i class="fa-solid fa-play"></i>

                    </button>


                </div>


                <p>${song.artistName}</p>


            </div>

        `;


        const playBtn = albumCard.querySelector(".play-btn");


        playBtn.addEventListener("click", () => {

            currentSongIndex = index;

            loadSong(song);

            playSong();

        });


        albumContainer.appendChild(albumCard);


    });

}

searchInput.addEventListener("keydown", (event) => {
    
    if (event.key !== "Enter") return;
    const term = searchInput.value.trim();

    if (!term) return;
    searchSongs(term);
    
    searchInput.value = "";
});

document.addEventListener("songEnded", nextSong);

function nextSong() {

    if (currentSongIndex < currentSongs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;
    }

    loadSong(currentSongs[currentSongIndex]);
    playSong();

}

function prevSong() {

    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = currentSongs.length - 1;
    }

    loadSong(currentSongs[currentSongIndex]);
    playSong();

}

nextBtn.addEventListener("click", nextSong);

prevBtn.addEventListener("click", prevSong);