/**
* BOOTLEG MP3
* @since Last Updated: July 3, 2022
*
* @todo
* - Play a song
* - End song at the right time
* - Import audio from internet
* - Dynamically generate song list
* - Play multiple different songs
* - Create global pause button
* - Create status bar (July 3, 2022)
* - Added the shuffle button (July 3, 2022)
* - Automatically play next song (July 3, 2022)
* - Create dropdown menu (July 4, 2022)
* - Dynamic dropdowns list (July 4, 2022)
*/

////////  GLOBAL VARIABLES    ////////
let currentSongAudio = new Audio();
let currentSongEndTime;

const songList = document.querySelector('.collection');

const pauseButton = document.querySelector("#pause").addEventListener('click', pause);

const shuffleButton = document.querySelector("#shuffle").addEventListener('click', playFromShuffle);

const albumList = document.querySelector(".albumList");



/**
 * @summary This method loads with the DOM. It dynamically generates the array
 * 			of songs by looping over the internal songDatabase and appending them
 * 			to a <ul> in the html code. It also assigns each <li> an id which is 
 * 			used to associate each <li> with the appropriate song in the songDatabse:
 * 			songDatabase[<li>.id]
 * 
 * @listens DOM 
 */
document.addEventListener('DOMContentLoaded', () => {


	//Manually create the very first Div. 
	let currentAlbum = songDatabase[0].album;
	//DIV SHIT
	const div = document.createElement('div');
	//SPAN SHIT
	const span = document.createElement('span');
	span.className = "dropdown";
	span.textContent = songDatabase[0].album;
	span.setAttribute("onclick", "dropdown(this)");
	//UL SHIT
	const ul = document.createElement('ul');
	ul.className = "collection";
	ul.id = currentAlbum;
	ul.style.border = "none";

	//Append UL and SPAN to DIV. And then the DIV to the albumList
	div.appendChild(span);
	div.appendChild(ul);
	albumList.appendChild(div);

	let i = 0; //Index to assign ID's which are used to play songs
	songDatabase.forEach((song, index) => {
		if(index != 0) {
			console.log(songDatabase[index--].album); //FOR SOME REASON, THIS CONSOLE.LOG NEEDS TO BE HERE
			if(song.album != songDatabase[index--].album){ //New Album needs to be created
				console.log("new album");
				currentAlbum = song.album; //Assign album variable which is used to switch UL's when creating songLists
				//DIV SHIT
				const div = document.createElement('div');
				//SPAN SHIT
				const span = document.createElement('span');
				span.className = "dropdown";
				span.textContent = song.album;
				span.setAttribute("onclick", "dropdown(this)");
				//UL SHIT
				const ul = document.createElement('ul');
				ul.className = "collection";
				ul.id = currentAlbum;
				ul.style.border = "none";

				//Append UL and SPAN to DIV. And then the DIV to the albumList
				div.appendChild(span);
				div.appendChild(ul);
				albumList.appendChild(div);
			}
		}	


		const li = document.createElement(`li`);

		li.id = i;
		li.innerHTML = '<h5><b>' + song.album + '</b></h5><h6><i>' + song.title + '</i></h6>';
		
		const link = document.createElement(`a`);
    	link.className = `play`;
    	link.textContent = 'Play'
    	link.style.cursor = "pointer";
    	link.addEventListener('click', playFromSelection);
       	li.appendChild(link);
    	li.appendChild(document.createElement('br'));

    	console.log(currentAlbum);
		document.querySelector(`#${CSS.escape(currentAlbum)}`).appendChild(li);
		console.log("song created");

		i++;
	})
});

/**
 * @summary This method loads adds an event listener to each songs
 * 			play button. It assigns all the properties from the song
 * 			in the songDatabse to the global currentAudio object. 
 * 
 * @listens Each song's play button
 */
async function play(id, shuffle = 0) {
			
	let activeSong = songDatabase[id];
    let musicObject = new Audio();
    musicObject.src = activeSong.url;
    musicObject.currentTime = activeSong.startTime;

    musicObject.oncanplay = async () => {
        currentSongAudio.pause();
		musicObject.play();
		currentSongAudio = musicObject;
		currentSongEndTime = activeSong.endTime;
		currentSongID = parseInt(id);

		//Change Title
		document.querySelector("#title").innerHTML = "<b>" + activeSong.album + ": </b>" + activeSong.title;

		//Wait for the song to end, then pause. Asynchronous
 		if(await songEnd()) {
 			//Pause Audio
 			musicObject.pause();

 			//Change Title
			document.querySelector("#title").innerHTML = "<b></b>";

			//Decide the next song to play
			if(shuffle) {
 			 	playFromShuffle();
			}
 			else if (currentSongID+1 < songDatabase.length){
 				play(currentSongID+1);
 			}
 		}

 	}
}

/**
 * @summary This method plays the audio. Passing in the respective ID
 * 
 * @listens The A tags
 */
async function playFromSelection(e) {
	if(e.target.classList.contains(`play`)){
			play(e.target.parentElement.id);	
    }
}

/**
 * @summary This method plays the audio. Passing in a random index
 * 
 * @listens Shuffle button
 */
async function playFromShuffle() {
	play(Math.floor(Math.random() * (songDatabase.length)), 1);
}

/**
 * @summary This method checks every 1 second whether or not the currentAudio's 
 * 			time matches the expected stoppage time and ends the audio if so. 
 * 			Extremely ghetto, I know - but I couldn't get async/await to work
 * 			without somehow polling (This feature needed to be reworked after
 * 			the addition of a global pause button)
 * 
 * @listens Audio. It polls the audio
 * 
 */
async function songEnd(){
		while(currentSongAudio.currentTime < currentSongEndTime) {
 			await new Promise(resolve => setTimeout(resolve, 1000));
 		} return true;
}

/**
 * @summary This method either pauses OR plays the current audio
 * 
 * @listens Pause button
 */
function pause(){
	if(currentSongAudio.paused) 
		currentSongAudio.play();
	else currentSongAudio.pause();
};

/**
 * @summary This method either pauses OR plays the current audio
 * 
 * @listens Spans with onclick=dropdown(this)
 */
function dropdown(element) {
	let list = element.parentElement.children[1];

	list.style.display = list.style.display === 'none' ? '' : 'none';
}

// All Google Drive URL's need to be a direct link. The default link generates a "preview" which doesn't
// allow us to play audio

// If file is too big for the scan, inspect the page and grab the URL from the "Download Anyway" button

let songDatabase = [
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 649,
    //"startTime": 770,
    "endTime": 780,
    "album": "Girlfriend, Girlfriend",
    "title": "Determination"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 909,
    //"startTime": 1028,
    "endTime": 1038,
    "album": "Girlfriend, Girlfriend",
    "title": "Accomplishment"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 1262,
    //"startTime": 1430,
    "endTime": 1440,
    "album": "Girlfriend, Girlfriend",
    "title": "Strong Will"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 1586,
    "endTime": 1737,
    "album": "Girlfriend, Girlfriend",
    "title": "Spring Air"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 2010,
    "endTime": 2145,
    "album": "Girlfriend, Girlfriend",
    "title": "The End Of Love"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 2149,
    "endTime": 2290,
    "album": "Girlfriend, Girlfriend",
    "title": "Lovely Girls"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 2293,
    "endTime": 2454,
    "album": "Girlfriend, Girlfriend",
    "title": "Fluttering Heart"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 3007,
    "endTime": 3160,
    "album": "Girlfriend, Girlfriend",
    "title": "Please Go Out With Me"
  },
  {
    "url": "https://drive.google.com/uc?id=1yeSPazlJmjG61f4XYu6CKK83L44-vQ07",
    "startTime": 3426,
    "endTime": 3559,
    "album": "Girlfriend, Girlfriend",
    "title": "Girlfriend, Girlfriend"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 0,
    "endTime": 118,
    "album": "The Aquatope On White Sand",
    "title": "Makutosoke, Nothing to worry about"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 121,
    "endTime": 260,
    "album": "The Aquatope On White Sand",
    "title": "A New Start"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 262,
    "endTime": 383,
    "album": "The Aquatope On White Sand",
    "title": "Acrylic Glass"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 389,
    "endTime": 493,
    "album": "The Aquatope On White Sand",
    "title": "Kukuru"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 496,
    "endTime": 640,
    "album": "The Aquatope On White Sand",
    "title": "Let Me Be Led"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 926,
    "endTime": 1050,
    "album": "The Aquatope On White Sand",
    "title": "Aquatope"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 1214,
    "endTime": 1350,
    "album": "The Aquatope On White Sand",
    "title": "Natsuyasumi Kancho"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 1820,
    "endTime": 1980,
    "album": "The Aquatope On White Sand",
    "title": "To Protect a Dream"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 1987,
    "endTime": 2172,
    "album": "The Aquatope On White Sand",
    "title": "A Fresh Start for the Two of Us"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 3591,
    "endTime": 3730,
    "album": "The Aquatope On White Sand",
    "title": "First Penguin"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 4515,
    "endTime": 4638,
    "album": "The Aquatope On White Sand",
    "title": "The End and Beginning of a Dream"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 4642,
    "endTime": 4778,
    "album": "The Aquatope On White Sand",
    "title": "Re_Start!"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 4782,
    "endTime": 4925,
    "album": "The Aquatope On White Sand",
    "title": "Matching Key Chain"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 4927,
    "endTime": 5035,
    "album": "The Aquatope On White Sand",
    "title": "Aqua Sphere"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 5148,
    "endTime": 5269,
    "album": "The Aquatope On White Sand",
    "title": "Touch Pool"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 5274,
    "endTime": 5445,
    "album": "The Aquatope On White Sand",
    "title": "Aquarium Tingara"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 5541,
    "endTime": 5708,
    "album": "The Aquatope On White Sand",
    "title": "I'm Not Crying"
  },
  {
    "url": "https://drive.google.com/uc?id=1rPNg28a85N4APm9MHKxLK3tHGBMl_GMm&confirm=t&uuid=5d804a54-5cd9-4f7e-a05f-a332d31969ca",
    "startTime": 8244,
    "endTime": 8392,
    "album": "The Aquatope On White Sand",
    "title": "Into the Future"
  },
  {
    "url": "https://drive.google.com/uc?id=1sJo1Z92wc4NA4OCuxF827LBi2AowIG6d",
    "startTime": 0,
    "endTime": 163,
    "album": "The Quintessential Quintuplets",
    "title": "変わらないみんな"
  },
  {
    "url": "https://drive.google.com/uc?id=11f90Dx6jgqCzyYmLKvq_d6t1RjtU6UfX",
    "startTime": 0,
    "endTime": 380,
    "album": "The Quintessential Quintuplets",
    "title": "五つ子ゲームファイナル"
  },
  {
    "url": "https://drive.google.com/uc?id=1wNNlRhKGeqBx3X66D6PnbBGQ7k7-IiBV",
    "startTime": 0,
    "endTime": 150,
    "album": "The Quintessential Quintuplets",
    "title": "未来へ向かって"
  },
  {
    "url": "https://drive.google.com/uc?id=1mJaVNoFzifCeRBKV-xBWDDpUytg3cKWy",
    "startTime": 0,
    "endTime": 175,
    "album": "The Quintessential Quintuplets",
    "title": "思い出の場所"
  },
  {
    "url": "https://drive.google.com/uc?id=1moyNxvXJ4TmNEsAmNwEzFEtr9AfSNqHm",
    "startTime": 0,
    "endTime": 85,
    "album": "The Quintessential Quintuplets",
    "title": "何度も、何度も"
  },
  {
    "url": "https://drive.google.com/uc?id=1OpacrAFKUHlwjNvL4RjI5Rc3DnmveIo9",
    "startTime": 0,
    "endTime": 238,
    "album": "The Quintessential Quintuplets",
    "title": "あなたを待っています"
  },
  {
    "url": "https://drive.google.com/uc?id=1yvhtJmJfqtUR2aBlzVBNx1o6C-VLClJB",
    "startTime": 0,
    "endTime": 153,
    "album": "The Quintessential Quintuplets",
    "title": "フータローを信じる"
  },
  {
    "url": "https://drive.google.com/uc?id=1fuyYvU987WGYBscHkQbkYGkydr9s-9cu",
    "startTime": 0,
    "endTime": 82,
    "album": "The Quintessential Quintuplets",
    "title": "夢を見ていた"
  },
  {
    "url": "https://drive.google.com/uc?id=1Y1VBEHTMLQN6Nf_u2nryL5ZNIpmXcjkf",
    "startTime": 0,
    "endTime": 147,
    "album": "The Quintessential Quintuplets",
    "title": "五等分"
  },
  {
    "url": "https://drive.google.com/uc?id=1Yd0Ay1-tK7SkHTfPUyy6cBeTYQD5w5cH",
    "startTime": 0,
    "endTime": 176,
    "album": "The Quintessential Quintuplets",
    "title": "やるからには徹底的に"
  },
]
