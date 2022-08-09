//Selecting all required tags or elements

const wrapper = document.querySelector(".wrapper")
const topPart = document.querySelector(".toppart")
musicImg = wrapper.querySelector(".img-area img")
musicName = wrapper.querySelector(".song-details .name")
musicArtist = wrapper.querySelector(".song-details .artist")
musicAudio = wrapper.querySelector("#main-audio")
playPauseBtn = wrapper.querySelector(".play-pause")
prevBtn = wrapper.querySelector("#prev")
nextBtn = wrapper.querySelector("#next")
progressArea = wrapper.querySelector(".progress-area")
progressBar = wrapper.querySelector("#progress-bar")
musicList = document.querySelector(".music-list")
cSongL = wrapper.querySelector(".csongl")
playingSingle = document.querySelector(".playingsingle")
backFromSingle = document.querySelector("#back-from-single")
showMoreBtn = wrapper.querySelector("#more-music")
hideMusicBtn = musicList.querySelector("#close")
recent_volume = wrapper.querySelector("#volume")
volume_show = wrapper.querySelector("#volume_show")


//Play random music on refresh
let musicIndex = Math.floor((Math.random()*allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling load music function once window loads
    playingNow()
    collectlist()
})

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb-1].name;
    musicArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `img/${allMusic[indexNumb-1].img}.jpg`;
    musicAudio.src = `music/${allMusic[indexNumb-1].src}.mp3`;

    timer = setInterval(range_slider,1000)
}

//play music function
function playMusic(){
    wrapper.classList.add("paused")
    musicImg.classList.add("rotate")
    playPauseBtn.querySelector("i").innerText = "pause"
    musicAudio.play()
}

//pause music function
function pauseMusic(){
    wrapper.classList.remove("paused")
    musicImg.classList.remove("rotate")
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    musicAudio.pause()
}

//play or music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused")
    //if isMusicPaused is true then call playMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic()
})

//function for the next button click event
function nextMusic(){
    musicIndex++
    musicIndex > allMusic.length ? musicIndex = 1 :musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic()
    playingNow()
}

//next music btn event
nextBtn.addEventListener("click", () => {
    nextMusic()
})

//function for the previous button click event
function prevMusic(){
    musicIndex--
    musicIndex < 1 ? musicIndex = allMusic.length :musicIndex = musicIndex
    loadMusic(musicIndex);
    playMusic()
    playingNow()
}

//previous music btn event
prevBtn.addEventListener("click", () => {
    prevMusic()
})

//update progress bar width according to music's current time
musicAudio.addEventListener("timeupdate", (e)=>{
    const currentTime = e.target.currentTime //getting current time of song
    // const duration = e.target.duration //getting the duration of song
    // let progressWidth = (currentTime / duration)*100
    // progressBar.style.width = `${progressWidth}%`

    //getting the current time and duration using loadeddata
    let musicCurrentTime = wrapper.querySelector(".current")
    let musicDuration = wrapper.querySelector(".duration")
    musicAudio.addEventListener("loadeddata", ()=>{
        

        //update song total duation
        let audioDuration = musicAudio.duration
        let totalMin = Math.floor(audioDuration/60)
        let totalSec = Math.floor(audioDuration%60)
        if (totalSec < 10){//adding 0 if sec is less than 10
            totalSec = `0${totalSec}`
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`

        
    })
    //update playing song current time
    let currentMin = Math.floor(currentTime/60)
    let currentSec = Math.floor(currentTime%60)
    if (currentSec < 10){//adding 0 if sec is less than 10
        currentSec = `0${currentSec}`
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`

})

// progressValue = progressBar.getAttribute("value")
//updating the playing song current time according to the progress bar width
function change_duration(){
    
    let progressWidthval = (progressBar.value/100)*musicAudio.duration//getting the width of progress bar
    // let clickedOffSetX = e.offsetX  //getting offset x value
    // let songDuration = musicAudio.duration //getting song total duration
    // console.log(progressBar.value)
    musicAudio.currentTime = progressWidthval//(clickedOffSetX / progressWidthval)*songDuration
    // playMusic()
}

function range_slider() {
    let position = 0

    //update slider postion
    if(!isNaN(musicAudio.duration)){
        position = musicAudio.currentTime*(100/musicAudio.duration)
        progressBar.value = position
    }
}

// volumeIcon = topPart.querySelector(".volume_icon")
function mute_sound() {
    volume.classList.add("muted")
    musicAudio.volume = 0
    volume.value = 0
    volume_show.innerHTML = 0
}

function increase_sound() {
    volume.classList.remove("muted")
    musicAudio.volume = 1
    volume.value = 100
    volume_show.innerHTML = 100
}

function check_mute(){
    const isMuted = volume.classList.contains("muted")
    isMuted ? increase_sound() : mute_sound()
}
                        
function volume_change(){
    volume_show.innerHTML = recent_volume.value
    musicAudio.volume = recent_volume.value / 100
}

//working on repeat and shuffle according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist")
repeatBtn.addEventListener("click", ()=>{
    //first we get the innerText of the icon and change it accordingly
    let getText  = repeatBtn.innerText //getting innertext of icon
    //doing different changes on different icon click using switch
    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one"
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle"
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat"
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    
    }
})

//what to do after the song ends
musicAudio.addEventListener("ended", ()=>{
    let getText  = repeatBtn.innerText //getting innertext of icon
    switch (getText) {
        case "repeat":
            nextMusic()
            break;
        case "repeat_one":
            musicAudio.currentTime = 0
            loadMusic(musicIndex)
            playMusic()
            break;
        case "shuffle":
            //generating random index between max range of array length
            let randIndex = Math.floor((Math.random()*allMusic.length) + 1)
            do{
                randIndex = Math.floor((Math.random()*allMusic.length) + 1)

            }while(musicIndex == randIndex)//this loop will run until the next random number is not the same with the current music index
            musicIndex = randIndex //passing randomIndex to music index so that the random song will play
            loadMusic(musicIndex)
            playMusic()
            playingNow()
            break;
    
    }
})


cSongL.addEventListener("click", ()=>{
    playingSingle.classList.toggle("show")
})

backFromSingle.addEventListener("click", ()=>{
    cSongL.click()
})

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show")
})

hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click()
})

const ulTag = musicList.querySelector("ul")

//creating li according to the array length
for(let i = 0; i<allMusic.length;i++){
    //passing the song name, artist from array to li
    let liTag = `<li li-index="${i+1}" class="">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${i}" src="music/${allMusic[i].src}.mp3"></audio>
                <span class="duration" id="${i}"  class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    // let liAudioDuration = ulTag.querySelector(`#${i}`);
    // let liAudioTag = ulTag.querySelector(`.${i}`);

    // liAudioTag.addEventListener("loadeddata", ()=>{
    //     let audioDuration = liAudioTag.duration;
    //     let totalMin = Math.floor(audioDuration/60);
    //     let totalSec = Math.floor(audioDuration%60);
    //     if (totalSec < 10){//adding 0 if sec is less than 10
    //         totalSec = `0${totalSec}`;
    //     }
    //     liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        // liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`)
    // });
}

//playing a particular song on click

const allLiTags = ulTag.querySelectorAll("li")
function playingNow(){
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".duration")
        //removing playing class from all other li except the one which is playing
        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing")
            // let adDuration = audioTag.getAttribute("t-attribute")
            // audioTag.innerText = adDuration
            audioTag.innerText = "3:40"
        }
        //if there is an li tag which li-index is equal to musicindex then we will style it
        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing")
            audioTag.innerText = "...Playing"
            //add the image to playingsingle
            playingSingle.style.backgroundImage = `url(img/${allMusic[j].img}.jpg)`;
            // playingSingle.style.backgroundRepeat = none;
            // playingSingle.style.backgroundSize = cover;
        }
    
        //adding onclick attribute in all li tags 
        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
}

//play song on li click
function clicked(element){
    //getting li index of particular clicked li tag
    let getLiIndex = element.getAttribute("li-index")
    musicIndex = getLiIndex  //passing it to musicIndex
    loadMusic(musicIndex)
    playMusic()
    playingNow()
}

let nowdisplay = 1 //declaring nowdisplay to be 1 by default
collection = topPart.querySelectorAll(".collection")
collectiondiv = topPart.querySelectorAll(".collectiondiv")

//creating a function to show respective div
function collectdiv() {
    for (let c = 0; c < collectiondiv.length; c++){
        collectiondiv[c].setAttribute("collectiondiv-index", `${c}`)
        if(collectiondiv[c].classList.contains("show")){
            collectiondiv[c].classList.remove("show")
        }
    
        if(collectiondiv[c].getAttribute("collectiondiv-index") === nowdisplay){
            collectiondiv[c].classList.add("show")
        }
    }
}

//getting each collection div and adding an index for reference and an event listener to show respective div

for (let c = 0; c < collection.length; c++) {
    collection[c].setAttribute("collection-index", `${c}`)
    collection[c].addEventListener("click", ()=>{
        //getting collection index of particular clicked collection
        let getCollectionIndex = collection[c].getAttribute("collection-index")
        nowdisplay = getCollectionIndex  //passing it to nowdisplay
        collectdiv()
        // console.log(getCollectionIndex)
    })
}

// collectionIndex()

//creating new collections
let newCollection = "favs";
aside = topPart.querySelector("aside")
collections = topPart.querySelector(".collections")
createButton = topPart.querySelector("#createbutton")
createButton.addEventListener("click", ()=>{
    collects.push({"name":`${newCollection}`},{"id":`${newCollection}`})
    collectlist()
    // collectionIndex()
})

//displaying collections list 
function collectlist() {
    for (let i = 0; i < collects.length; i++) {
    
        let news = `<div class="collection" collection-index = "${i}" id="${collects[i].id}">
                        <h2>${collects[i].name}</h2>
                    </div>`;
        aside.insertAdjacentHTML("beforeend", news)

    }
}

//displaying collections connected to that list