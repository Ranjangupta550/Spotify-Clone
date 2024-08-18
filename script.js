let currentSong = new Audio();
let list;
//time converter seconds to seconds minutes
function formatTime(seconds) {
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  // Pad single-digit seconds with a leading zero
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

async function getSong() {
  let songApi = await fetch("http://127.0.0.1:5500/songs/");
  let playPauseButtion = document.querySelector("#playPauseButtion");
  let response = await songApi.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let songs = div.getElementsByTagName("a");
  let listSongs = [];
  for (index = 0; index < songs.length; index++) {
    const s = songs[index];
    if (s.href.endsWith(".mp3")) {
      listSongs.push(s.href.split("/songs/")[1]);
    }
  }
  return listSongs;
}

function cleansongCh(song) {
  let cleanlist = decodeURIComponent(song);
  cleanlist = cleanlist.replace(/[^a-zA-Z0-9\s\-\.,]/g, "");
  return cleanlist;
}

const playTrack = (track) => {
  track = track.trim();

  currentSong.src = "/songs/" + encodeURIComponent(track);
  // console.log(`${currentSong.src}`);
  console.log((currentSong.src = "/songs/" + track));
  // console.log(track);

  currentSong.play();
  playPauseButton.src = "svg/pause.svg";
  document.querySelector(".playing-song-name").innerHTML = decodeURI(track);
  // document.querySelector(".playing-song-time").innerHTML="00:00/00:00";
};
async function song() {
   list = await getSong();
  let songUl = document.querySelector(".songUl").getElementsByTagName("ul")[0];

  for (const song of list) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
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

  Array.from(
    document.querySelector(".songUl").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playTrack(e.querySelector(".songInfo").firstElementChild.innerHTML);
    });
  });

  // Corrected play/pause button selection
  let playPauseButton = document.getElementById("playPauseButton");

  playPauseButton.addEventListener("click", () => {
    if (!currentSong.src || currentSong.src === window.location.href) {
      // If no song is currently loaded, load and play the first song
      playTrack(list[0]);
      playPauseButton.src = "svg/pause.svg";
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

  //seekbar event listner
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    // console.log(e.offsetX, e.target.getBoundingClientRect().width);
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //toggle hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
  });

  //toggle cross
  document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
  });
  prevPlayButton.addEventListener("click", () => {
        let index=list.indexOf(currentSong.src.split("/").slice(-1)[0]);
      
        if((index-1)>=0){
        playTrack(list[index-1]);

        }
        
  });
  playNextButton.addEventListener("click",()=>{
    let index=list.indexOf(currentSong.src.split("/").slice(-1)[0]);
    
    if((index+1) <list.length){
        playTrack(list[index+1])
        
    }
  })

  //volume
  document.querySelector("#volume").addEventListener("change", (e) => {
    console.log(currentSong.volume, e.target.value/100, e.target);
    currentSong.volume=e.target.value/100;
  });
}
song();
