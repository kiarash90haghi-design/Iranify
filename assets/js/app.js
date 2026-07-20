import { fetchSongs } from "./api.js";

import {
    albumContainer,
    searchInput,
    nextBtn,
    prevBtn,
    shuffleBtn,
    repeatBtn
} from "./elements.js";

import {
    loadSong,
    playSong,
    replaySong
} from "./player.js";

let currentSongs = [];
let currentSongIndex = 0;

// is sufell?
let isShuffle = false;

// is repeat?
let isRepeat = false;

// is favorite?
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


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

            ‍   <button class="favorite-btn">
                    <i class="fa-regular fa-heart"></i>
                </button>

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
        const favoriteBtn = albumCard.querySelector(".favorite-btn");

        const isFavorite = favorites.some(
            fav => fav.trackId === song.trackId
        );


        if(isFavorite){

            favoriteBtn.classList.add("active");

            const icon = favoriteBtn.querySelector("i");

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

        }

        favoriteBtn.addEventListener("click", () => {

            const index = favorites.findIndex(
                fav => fav.trackId === song.trackId
            );

            if(index === -1){

                favorites.push(song);

                favoriteBtn.classList.add("active");

                favoriteBtn.querySelector("i").classList.replace(
                    "fa-regular",
                    "fa-solid"
                );

            }else{

                favorites.splice(index,1);

                favoriteBtn.classList.remove("active");

                favoriteBtn.querySelector("i").classList.replace(
                    "fa-solid",
                    "fa-regular"
                );

            }

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );

        });


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

document.addEventListener("songEnded", () => {

    if (isRepeat) {
        replaySong();
    }
    
    else {
        nextSong();
    }
});

function nextSong() {

    if (isShuffle) {

        let randomIndex;

        do {
            randomIndex = Math.floor(Math.random() * currentSongs.length);
        } while (randomIndex === currentSongIndex);

        currentSongIndex = randomIndex;

    } else {

        if (currentSongIndex < currentSongs.length - 1) {
            currentSongIndex++;
        } else {
            currentSongIndex = 0;
        }

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

// shuffle


shuffleBtn.addEventListener("click", () => {

    isShuffle = !isShuffle;

    shuffleBtn.classList.toggle("active");

});

// repeat

repeatBtn.addEventListener("click", () => {
    
    isRepeat = !isRepeat;
    
    repeatBtn.classList.toggle("active");
    
    console.log("Repeat:", isRepeat);

});