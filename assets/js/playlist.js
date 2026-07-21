import {
    createPlaylistBtn,
    playlistModal,
    cancelPlaylistBtn,
    savePlaylistBtn,
    playlistNameInput,
    playlistList
} from "./elements.js";

let playlists =
    JSON.parse(localStorage.getItem("playlists")) || [];

createPlaylistBtn.addEventListener("click", () => {

    playlistModal.classList.add("show");

});

cancelPlaylistBtn.addEventListener("click", () => {

    playlistModal.classList.remove("show");

});

playlistModal.addEventListener("click", (event) => {

    if(event.target === playlistModal){

        playlistModal.classList.remove("show");

    }

});

function renderPlaylists() {

    playlistList.innerHTML = "";

    playlists.forEach((playlist) => {

        const li = document.createElement("li");

        li.classList.add("playlist-item");

        li.dataset.id = playlist.id;

        li.innerHTML = `
            <i class="fa-solid fa-music"></i>

            <span>${playlist.name}</span>

            <button class="delete-playlist-btn">
                <i class="fa-solid fa-trash" id="trash-btn"></i>
            </button>
        `;

        li.addEventListener("click", () => {

            openPlaylist(playlist);

        });

        playlistList.appendChild(li);

        const deleteBtn = li.querySelector(".delete-playlist-btn");


        deleteBtn.addEventListener("click", (event)=>{

            event.stopPropagation();


            deletePlaylist(playlist.id);

        });

    });

}


function createPlaylist() {

    const name = playlistNameInput.value.trim();

    if (!name) return;

    playlists.push({

        id: Date.now(),

        name: name,

        songs: []

    });

    localStorage.setItem(
        "playlists",
        JSON.stringify(playlists)
    );

    renderPlaylists();

    playlistNameInput.value = "";

    playlistModal.classList.remove("show");

}

savePlaylistBtn.addEventListener("click", createPlaylist);

playlistNameInput.addEventListener("keydown", (event) => {

    if(event.key === "Enter"){

        createPlaylist();

    }

});

renderPlaylists();

function openPlaylist(playlist){

    document.dispatchEvent(
        new CustomEvent("playlistSelected", {
            detail: playlist
        })
    );

}

export function getPlaylists() {
    return playlists;
}

export function addSongToPlaylist(playlistId, song) {

    const playlist = playlists.find(p => p.id === playlistId);

    if (!playlist) return;

    const alreadyExists = playlist.songs.some(
        s => s.trackId === song.trackId
    );

    if (alreadyExists) return;

    playlist.songs.push(song);

    localStorage.setItem(
        "playlists",
        JSON.stringify(playlists)
    );

}

// delete playlist

function deletePlaylist(id){

    playlists = playlists.filter(
        playlist => playlist.id !== id
    );


    localStorage.setItem(
        "playlists",
        JSON.stringify(playlists)
    );


    renderPlaylists();

}