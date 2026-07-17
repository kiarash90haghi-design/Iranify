let currentSongs = [];
let currentSongsIndex = 0;

fetch("https://itunes.apple.com/search?term=eminem&entity=song&limit=20")
    .then(response => response.json())
    .then(data => {
        renderAlbums(data.results);
});

const albumContainer = document.querySelector(".album-container");

function renderAlbums(songs) {
    currentSongs = songs;
    songs.forEach((song, index) => {
        const albumCard = document.createElement("div");
        albumCard.classList.add("album-card"); 
        
        albumCard.innerHTML = `
            <div class="album-image">
                <img src="${song.artworkUrl100}" alt="${song.trackName}">
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
            audio.play();
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        })

        albumContainer.appendChild(albumCard);
    });
}

const audio = document.getElementById("audio");

const playerCover = document.querySelector(".player-left img");
const playerTitle = document.querySelector(".song-info h4");
const playerArtist = document.querySelector(".song-info p");

function loadSong(song) {
    console.log(song.previewUrl);
    playerCover.src = song.artworkUrl100;
    playerTitle.textContent = song.trackName;
    playerArtist.textContent = song.artistName;
    audio.src = song.previewUrl;
}

audio.addEventListener("pause", () => {
    console.log("Paused");
});

audio.addEventListener("play", () => {
    console.log("Playing");
});

audio.addEventListener("ended", () => {
    console.log("Ended");
});

audio.addEventListener("error", (e) => {
    console.log(e);
});

const playMain = document.getElementById("play-main");
const playIcon = playMain.querySelector("i");


playMain.addEventListener("click", () => {
    if (audio.paused) {
        audio.play();

        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");

    } else {
        audio.pause();

        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    }
});

audio.addEventListener("ended", () => {
    playIcon.classList.remove("fa-pause");
    playIcon.classList.add("fa-play");
});

const nextBtn = document.getElementById("next-btn")
const prevBtn = document.getElementById("prev-btn")

nextBtn.addEventListener("click", () => {
    if (currentSongIndex < currentSongs.length - 1) {
        currentSongIndex++;
    } else {
        currentSongIndex = 0;
    }

    loadSong(currentSongs[currentSongIndex]);
    audio.play();
});

prevBtn.addEventListener("click", () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
    } else {
        currentSongIndex = currentSongs.length - 1;
    }

    loadSong(currentSongs[currentSongIndex]);
    audio.play();
});

// console.log(song.artworkUrl100);