fetch("https://itunes.apple.com/search?term=eminem&entity=song&limit=20")
    .then(response => response.json())
    .then(data => {
        renderAlbums(data.results);
});

const albumContainer = document.querySelector(".album-container");

function renderAlbums(songs) {
    songs.forEach(song => {
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
            loadSong(song);
            audio.play();
        })

        albumContainer.appendChild(albumCard);

    });
}

const audio = document.getElementById("audio");

const playerCover = document.querySelector(".player-left img");
const playerTitle = document.querySelector(".song-info h4");
const playerArtist = document.querySelector(".song-infop");

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

// function renderAlbums(){ 
//     songs.forEach(song => {
//         const albumCard = document.createElement("div");
//         albumCard.classList.add("album-card");

//         albumCard.innerHTML = `
//                 <div class="album-image">
//                     <img src="${song.cover}" alt="${song.title}">
//                 </div>

//                 <div class="album-info">
//                     <div class="album-header">
//                         <h3>${song.title}</h3>

//                         <button class="play-btn" data-id="${song.id}">
//                             <i class="fa-solid fa-play"></i>
//                         </button>
//                     </div>

//                     <p>${song.artist}</p>
//                 </div>
//             `;

//             albumContainer.appendChild(albumCard);
//         })

//         const playBtn = albumCard.querySelector(".play-btn");

//         playBtn.addEventListener("click", () => {
//             loadSong(song);
//             audio.play();
//         });

//         albumContainer.appendChild(albumCard);
// }

// renderAlbums();


// const audio = document.getElementById("audio");

// const playerCover = document.querySelector(".player-left img");
// const playerTitle = document.querySelector(".song-info h4");
// const playerArtist = document.querySelector(".song-info p");

// function loadSong(song){
//     playerCover.src = song.cover;
//     playerTitle.textContent = song.title;
//     playerArtist.textContent = song.artist;
//     audio.src = song.audio;
// }