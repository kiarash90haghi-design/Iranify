import { fetchSongs } from "./api.js";

import {
    albumContainer,
    searchInput
} from "./elements.js";

import {
    loadSong,
    playSong,
    setSongs
} from "./player.js";



async function init(){

    const songs = await fetchSongs("eminem");

    setSongs(songs);

    renderAlbums(songs);

}

init();

async function searchSongs(term){
    const songs = await fetchSongs(term);
    setSongs(songs);
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


        playBtn.addEventListener("click",()=>{

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