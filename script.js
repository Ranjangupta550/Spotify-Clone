let currentSong = new Audio();
async function getSong() {
  let songApi = await fetch("http://127.0.0.1:5500/songs/");
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
  // for (let song of songs) {
  //     console.log(song.textContent); // Logs the name of each song
  // }
  return listSongs;
}
function cleansongCh(song) {
  let cleanlist = decodeURIComponent(song);
  cleanlist = cleanlist.replace(/[^a-zA-Z0-9\s\-\.,]/g, "");
  return cleanlist;
}
async function song() {
  let list = await getSong();
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
  const playTrack = (track) => {
    track = track.trim();

    currentSong.src = "/songs/" + encodeURIComponent(track);
    console.log(`${currentSong.src}`);
    console.log((currentSong.src = "/songs/" + track));
    console.log(track);
    currentSong.play();
    currentSong.play();
  };
  Array.from(
    document.querySelector(".songUl").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playTrack(e.querySelector(".songInfo").firstElementChild.innerHTML);
    });
  });
}
song();
