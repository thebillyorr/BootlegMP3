let songDatabase = {
    "Case Closed": {
        "Album": "Lycoris Recoil",
        "URL": "https://drive.google.com/file/d/1Sa8SVn7Zch5eGY4RhxkhY_woJvtegiss/view?usp=share_link"
    },
    "Lycoris for Individuals": {
        "Album": "Lycoris Recoil",
        "URL": "https://drive.google.com/file/d/11aKoiwpJhId7ApzBBCSrhj9mCp8tjfhk/view?usp=share_link"
    },
    "Lycoris Recoil Theme": {
        "Album": "Lycoris Recoil",
        "URL": "https://drive.google.com/file/d/1SpryZgoHmq_3DT12HgO3mRxm4UvLDBD5/view?usp=share_link"
    },
    "Momentary Rest": {
        "Album": "Lycoris Recoil",
        "URL": "https://drive.google.com/file/d/1QenDRXyv6UCNSAvFJlozrJF9iHYKcfGz/view?usp=share_link"
    },
    "始まりの瞬間": {
        "Album": "Love Live! Superstar!!",
        "URL": "https://drive.google.com/file/d/13GRT7kmFGmK3ef2pzzcs3JCP_E7INCd-/view?usp=share_link"
    },
    "想いをカタチに": {
        "Album": "Love Live! Superstar!!",
        "URL": "https://drive.google.com/file/d/1HPtMgc0DahpuZMtjtUHZP-KoxV165lGF/view?usp=share_link"
    },
}

let currentSong = new Audio();
let shuffle = false;

(function init() {
    initNextButton();
    initPauseButton();
    initShuffleButton();
    initAlbumList();

    currentSong.addEventListener("ended", function() {
        next();
    });
    
})();

////////////////////////// INIT ///////////////////////////

/**
 * @since Feb 22, 2023
 * @summary INIT Next Button
 */
function initNextButton() {
    let nextButton = document.createElement("img");
    nextButton.src="https://img.icons8.com/external-neu-royyan-wijaya/128/null/external-continue-neu-music-neu-royyan-wijaya.png";
    nextButton.style="width:30px;height:30px;"
    nextButton.style.cursor = "pointer";
    nextButton.onclick = function() {
        next();
    }
    document.getElementById("controlPanel").appendChild(nextButton);
}

/**
 * @since Feb 22, 2023
 * @summary INIT Pause Button
 */
function initPauseButton() {
    let pauseButton = document.createElement("img");
    pauseButton.src="https://img.icons8.com/external-neu-royyan-wijaya/128/null/external-music-neu-music-neu-royyan-wijaya-3.png";
    pauseButton.style="width:30px;height:30px;"
    pauseButton.style.cursor = "pointer";
    pauseButton.onclick = function() {
        if (currentSong.paused) {
            console.log("Playing")
            currentSong.play();
            pauseButton.src="https://img.icons8.com/external-neu-royyan-wijaya/128/null/external-music-neu-music-neu-royyan-wijaya-3.png";
        } else {
            console.log("Pausing")
            currentSong.pause();
            pauseButton.src="https://img.icons8.com/external-neu-royyan-wijaya/128/null/external-media-neu-music-neu-royyan-wijaya.png";
        }
    }
    document.getElementById("controlPanel").appendChild(pauseButton);
}

/**
 * @since Feb 22, 2023
 * @summary INIT Shuffle Button
 */
function initShuffleButton() {
    let shuffleButton = document.createElement("img");
    shuffleButton.src="https://img.icons8.com/material-outlined/96/null/shuffle.png";
    shuffleButton.style="width:30px;height:30px;"
    shuffleButton.style.cursor = "pointer";
    shuffleButton.onclick = function() {
        if (shuffle) {
            shuffle = false;
            shuffleButton.src="https://img.icons8.com/material-outlined/96/null/shuffle.png";
        } else {
            shuffle = true;
            shuffleButton.src="./shuffle.png";
        }
    }
    document.getElementById("controlPanel").appendChild(shuffleButton);
}

/**
 * @since Feb 22, 2023
 * @summary INIT Album List
 * @description In detail: This function first creates a list of all the albums in the songDatabase. It then parses through each album
 * and generates a div called albumWrapper. Within this albumWrapper, there is a span called albumTitle and a ul called albumDiv. The ul 
 * contains all the different sings within the album. When the user clicks on the span, the albumDiv will be hidden or shown.
 */
function initAlbumList() {
    let albumList = [];
    for (let song in songDatabase) {
        if (!albumList.includes(songDatabase[song].Album)) {
            albumList.push(songDatabase[song].Album);
        }
    }

    for (let album in albumList) {
        let albumWrapper = document.createElement("div");
    
        let albumTitle = document.createElement("span");
        albumTitle.innerHTML = albumList[album];
        albumTitle.style.cursor = "pointer";

        albumWrapper.appendChild(albumTitle);
    
        let albumDiv = document.createElement("ul");
        
        for (let song in songDatabase) {
            if (songDatabase[song].Album === albumList[album]) {
                let songDiv = document.createElement("li");
                songDiv.innerHTML = song;
                songDiv.style.cursor = "pointer"; //Give the buttons a cursor
                songDiv.style.display = "inline-block"; //Make the buttons inline and only as long as the text
                songDiv.style.listStyleType = "none"; //Remove the bullet points
                songDiv.style.padding = "5px";
                songDiv.style.borderRadius = "5px";
                songDiv.style.margin = "5px";
                songDiv.style.backgroundColor = "white";
                songDiv.style.color = "black";
                songDiv.style.cursor = "pointer";
                songDiv.style.transition = "all 0.2s ease-in-out";
                songDiv.onmouseover = function() {
                    songDiv.style.backgroundColor = "darkslategrey";
                    songDiv.style.color = "white";
                }
                songDiv.onmouseout = function() {
                    songDiv.style.backgroundColor = "white";
                    songDiv.style.color = "black";
                }

                songDiv.onclick = function() {
                    currentSong.src = URLParser(songDatabase[song].URL);
                    currentSong.play();
                    updateStatusBar();
                }
                albumDiv.appendChild(songDiv);
            }
        }
        albumTitle.onclick = function() {
            if (albumDiv.style.display === "none") {
                albumDiv.style.display = "block";
            } else {
                albumDiv.style.display = "none";
            }
        }
        albumWrapper.appendChild(albumDiv);
        document.getElementById("songList").appendChild(albumWrapper);
    }
}

//////////////////////// UTILITIES ////////////////////////

/**
 * @since Feb 22, 2023
 * @summary Take in a URL and remove the text "/view?usp=share_link" entirely and replace the text "file/d/" with "uc?id="
 * @input {string} url - The URL to be parsed
 * @returns {string} parsedURL - The parsed URL
 */
function URLParser(url) { 
    let parsedURL = url.replace("/view?usp=share_link", "");
    parsedURL = parsedURL.replace("file/d/", "uc?id=");
    return parsedURL;
}

/**
 * @since Feb 22, 2023
 * @summary Take in a URL and add the text "/view?usp=share_link" to the end of the URL and replace the text "uc?id=" with "file/d/"
 * @input {string} url - The URL to be de-parsed
 * @returns {string} parsedURL - The de-parsed URL
 */
function URLDeParser(url) {
    let parsedURL = url.replace("uc?id=", "file/d/");
    parsedURL = parsedURL + "/view?usp=share_link";
    return parsedURL;
}

/**
 * @since Feb 22, 2023
 * @summary Go through the songDatabase and return the song name given the URL. Assumes the URL is deparsed
 * @input {string} url - The deparsed URL 
 * @returns {string} The name of the song
 */
function getSongName(url) {
    for (let song in songDatabase) {
        if (songDatabase[song].URL === url) {
            return song;
        }
    }
}

/**
 * @since Feb 22, 2023
 * @summary Create a status bar at the top of the page that displays the name of the current song and the current time of the song.
 * @input Nothing
 * @returns {string} Nothing
 */
function updateStatusBar() {
    let songName = getSongName(URLDeParser(currentSong.src));
    document.getElementById("statusBar").innerHTML = "<b>" + songDatabase[songName].Album + "</b>" + " - " + songName;

};

/**
 * @since Feb 22, 2023
 * @summary Play the next song - shuffled or not shuffled
 * @description In detail: If shuffle is on, next song is random. Otherwise, next song in database. 
 * This is done by grabbing the keys for the songDatabase and calling getSongName on the currentSong.src
 * which retrieve the key of the current song given it's URL. 
 */
function next() {
    console.log("Next")
    let songListKeys = Object.keys(songDatabase);
    let currentSongIndex = songListKeys.indexOf(getSongName(URLDeParser(currentSong.src)));
    switch(shuffle) {
        case true:
            currentSongIndex = Math.floor(Math.random() * songListKeys.length);
        break;
        case false:
            if (currentSongIndex === songListKeys.length - 1) {
                currentSongIndex = 0;
            } else {
                currentSongIndex++;
            }
        break;
    }
    currentSong.src = URLParser(songDatabase[songListKeys[currentSongIndex]].URL);
    currentSong.play();
    updateStatusBar();
}
