import { fetchSongs } from "./api.js";

import {
    albumContainer,
    searchInput,
    nextBtn,
    prevBtn,
    shuffleBtn,
    repeatBtn,
    favoritesLink,
    homeLink,
    songMenu,
    playlistOptions,
    sectionTitle
} from "./elements.js";

import {
    loadSong,
    playSong,
    replaySong
} from "./player.js";

import {
    getPlaylists, 
    addSongToPlaylist,
} from "./playlist.js";

let currentSongs = [];
let currentSongIndex = 0;
let homeSongs = [];

let selectedSong = null;


// is sufell?
let isShuffle = false;

// is repeat?
let isRepeat = false;

// is favorite?
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// for remove song's

let currentPlaylist = null;


function setActivePage(page){

    homeLink.classList.remove("active");
    favoritesLink.classList.remove("active");

    page.classList.add("active");
}

async function init(){

    homeLink.classList.add("active");

    favoritesLink.classList.remove("active");

    const songs = await fetchSongs("eminem");

    currentSongs = songs;

    homeSongs = songs;

    renderAlbums(songs);

    setActivePage(homeLink);

}

init();

async function searchSongs(term){

    const songs = await fetchSongs(term);
    
    currentSongs = songs;

    homeSongs = songs;
    
    albumContainer.innerHTML = "";

    renderAlbums(songs);

}


function renderAlbums(songs){

    songs.forEach((song,index)=>{


        const albumCard = document.createElement("div");

        albumCard.classList.add("album-card");


            albumCard.innerHTML = `

            <div class="album-image">

                <button class="favorite-btn">
                    <i class="fa-regular fa-heart"></i>
                </button>

                <button class="more-btn">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>

                ${currentPlaylist ? `
                
                <button class="remove-song-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
                ` : ""}

                <img src="${song.artworkUrl100}">

            </div>


            <div class="album-info">

                <div class="album-header">

                    <h3>${song.trackName}</h3>

                    <div class="album-actions">



                        <button class="play-btn">
                            <i class="fa-solid fa-play"></i>
                        </button>

                    </div>

                </div>


                <p>${song.artistName}</p>


            </div>

        `;


        const playBtn = albumCard.querySelector(".play-btn");
        const favoriteBtn = albumCard.querySelector(".favorite-btn");

        const moreBtn = albumCard.querySelector(".more-btn");

        const removeBtn = albumCard.querySelector(".remove-song-btn");

        if(removeBtn){

        removeBtn.addEventListener("click",(event)=>{

            event.stopPropagation();

            removeSongFromPlaylist(song);

        });

}

moreBtn.addEventListener("click", (event) => {

    event.stopPropagation();

    selectedSong = song;

    songMenu.classList.add("show");

    songMenu.style.left = `${event.clientX}px`;
    songMenu.style.top = `${event.clientY}px`;

    renderPlaylistOptions();

});

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

function renderPlaylistOptions() {

    playlistOptions.innerHTML = "";

    const playlists = getPlaylists();


    if(playlists.length === 0){

        const li = document.createElement("li");

        li.textContent = "No Playlist";

        playlistOptions.appendChild(li);

        return;

    }


    playlists.forEach((playlist) => {


        const li = document.createElement("li");

        li.textContent = playlist.name;


        li.addEventListener("click", () => {


            addSongToPlaylist(
                playlist.id,
                selectedSong
            );


            songMenu.classList.remove("show");


        });


        playlistOptions.appendChild(li);


    });

}

document.addEventListener("click", (event) => {

    if(!event.target.closest(".more-btn") &&
       !event.target.closest(".song-menu")){

        songMenu.classList.remove("show");

    }

});

function renderFavorites(){

    currentPlaylist = null;

    albumContainer.innerHTML = "";

    currentSongs = favorites;

    if(favorites.length === 0){

        albumContainer.innerHTML = `
            <h2>No Favorites Yet ❤️</h2>
        `;

        return;
    }

    renderAlbums(favorites);

}

function renderPlaylistSongs(playlist){

    albumContainer.innerHTML = "";
    sectionTitle.innerText = playlist.name;

    if(playlist.songs.length === 0){

        albumContainer.innerHTML = `
            <h2>
                This playlist is empty 🎵
            </h2>
        `;

        return;
    }
    
    currentSongs = playlist.songs;

    renderAlbums(playlist.songs);

}

function renderHome(){

    albumContainer.innerHTML = "";

    currentPlaylist = null;

    sectionTitle.innerText = "Popular Albums";

    renderAlbums(homeSongs);

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

// home page 

homeLink.addEventListener("click", (event) => {
    event.preventDefault();

    setActivePage(homeLink);

    renderHome();
});

// favorite link

favoritesLink.addEventListener("click", (event) => {
    event.preventDefault();

    setActivePage(favoritesLink);

    renderFavorites();
});

// play list 

document.addEventListener(
    "playlistSelected",
    (event)=>{

        const playlist = event.detail;

        currentPlaylist = playlist;

        renderPlaylistSongs(playlist);

    }
);
function removeSongFromPlaylist(song){
    if(!currentPlaylist) return;

    currentPlaylist.songs = currentPlaylist.songs.filter(
        s => s.trackId !== song.trackId
    );

    const playlists = getPlaylists();

    const index = playlists.findIndex(
        p => p.id === currentPlaylist.id
    );

    if(index !== -1){

        playlists[index] = currentPlaylist;
    }

    localStorage.setItem(
        "playlists",
        JSON.stringify(playlists)
    );

    renderPlaylistSongs(currentPlaylist);

}