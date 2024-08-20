let currentSong = new Audio();
let list;
let currentFolder;

// Time converter: seconds to minutes:seconds
function formatTime(seconds) {
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}
async function displayAlbum() {
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let cardContainer = document.querySelector(".cardcontainer");

//   let anchor = div.getElementsByTagName("a");
//   Array.from(anchor).forEach(async e => {
//     console.log(anchor);
    
//     if (e.href.includes("/songs")) {
//       let folder = e.href.split("/").slice(-1)[0];
//       console.log(folder);

//       //get meta data
//       let b = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
//       let response = await b.json();
//       console.log(response);

//       cardContainer.innerHTML =
//         cardContainer.innerHTML +
//         ` 
//             <div data-folder="HoneySingh" class="card    rounded cursor">
//               <button class="svg-button">
//                 <svg
//                   class="play-icon"
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 384 512"
//                 >
//                   <path
//                     fill="#000000"
//                     d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
//                   />
//                 </svg>
//               </button>

//               <img
//                 class="rounded"
//                 src="https://i.scdn.co/image/ab67616d00001e021e63de6489803c2b39e7f8e5"
//                 alt=""
//               />
//               <div class="h3 f-size-14 f-weight-700">${response.title}</div>
//               <div class="p f-size-12">${response.discription}</div>
//             </div>`;
//     }
//   });
// }

async function getSong(folder) {
  currentFolder = folder;
  let songApi = await fetch(`http://127.0.0.1:5500/songs/${currentFolder}/`);
  let response = await songApi.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let songs = div.getElementsByTagName("a");
  list = []; // Update list directly
  for (let index = 0; index < songs.length; index++) {
    const s = songs[index];
    if (s.href.endsWith(".mp3")) {
      list.push(s.href.split(`/songs/${currentFolder}/`)[1]);
    }
  }
  return list;
}

function cleansongCh(song) {
  let cleanlist = decodeURIComponent(song);
  cleanlist = cleanlist.replace(/[^a-zA-Z0-9\s\-\.,]/g, "");
  return cleanlist;
}

const playTrack = (track) => {
  track = track.trim();
  currentSong.src = `/songs/${currentFolder}/` + encodeURIComponent(track);

  currentSong.play();
  document.querySelector("#playPauseButton").src = "svg/pause.svg";
  document.querySelector(".playing-song-name").innerHTML = decodeURI(track);
};

async function song() {
  // Load the default folder on page load
  list = await getSong("HoneySingh");
  let songUl = document.querySelector(".songUl ul");

  songUl.innerHTML = ""; // Clear the song list


  for (const song of list) {
    songUl.innerHTML += `<li>
        <img class="music svg-filter" src="svg/music.svg" alt="music" />
        <div class="songInfo">
          <div class="songName">${cleansongCh(song)}</div>
          <div class="songArtisr">song artist</div>
        </div>
        <div class="playNow flex">
          <span>Play Now</span>
          <img src="svg/songPlayButton.svg" alt="" class="playicon">
        </div>
      </li>`;
  }

  Array.from(document.querySelectorAll(".songUl li")).forEach((e) => {
    e.addEventListener("click", () => {
      playTrack(e.querySelector(".songInfo").firstElementChild.innerHTML);
    });
  });

  let playPauseButton = document.getElementById("playPauseButton");

  playPauseButton.addEventListener("click", () => {
    if (!currentSong.src || currentSong.src === window.location.href) {
      playTrack(list[0]); // Play the first song if none is loaded
    } else if (currentSong.paused) {
      currentSong.play();
      playPauseButton.src = "svg/pause.svg";
    } else {
      currentSong.pause();
      playPauseButton.src = "svg/songPlayButton.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".playing-song-time").innerHTML = `${formatTime(
      currentSong.currentTime
    )}/${formatTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
    if (currentSong.currentTime == currentSong.duration) {
      playPauseButton.src = "svg/songPlayButton.svg";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });

  document.querySelector("#prevPlayButton").addEventListener("click", () => {
    let index = list.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playTrack(list[index - 1]);
    }
  });

  document.querySelector("#playNextButton").addEventListener("click", () => {
    let index = list.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < list.length) {
      playTrack(list[index + 1]);
    }
  });

  document.querySelector("#volume").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });

  Array.from(document.querySelectorAll(".card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      list = await getSong(item.currentTarget.dataset.folder);

      // Update the song list UI with the new folder's songs
      songUl.innerHTML = ""; // Clear existing songs
      for (const song of list) {
        songUl.innerHTML += `<li>
            <img class="music svg-filter" src="svg/music.svg" alt="music" />
            <div class="songInfo">
              <div class="songName">${cleansongCh(song)}</div>
              <div class="songArtisr">song artist</div>
            </div>
            <div class="playNow flex">
              <span>Play Now</span>
              <img src="svg/songPlayButton.svg" alt="" class="playicon">
            </div>
          </li>`;
      }

      Array.from(document.querySelectorAll(".songUl li")).forEach((e) => {
        e.addEventListener("click", () => {
          playTrack(e.querySelector(".songInfo").firstElementChild.innerHTML);
        });
      });
    });
  });
}
}
song();
