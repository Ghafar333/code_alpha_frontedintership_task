document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const volumeLevel = document.getElementById('volume-level');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const albumArt = document.querySelector('.album-art img');
    const playerContainer = document.querySelector('.player-container');
    
    // Song data
    const songs = [
        {
            title: "Aadat mashup",
            artist: "woh lamhe",
            duration: "7:05",
            cover: "./images/edward-koorey-ok_jwH447dc-unsplash.jpg",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "aja sanam",
            artist: "raj kapoor",
            duration: "5:44",
            cover: "./images/grant-sams-QLot1nGwusk-unsplash.jpg",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        {
            title: "Dunya",
            artist: "Kiran Kamath",
            duration: "7:05",
            cover: "./images/jeff-brown-xOj6_Ha1_R8-unsplash.jpg",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        },
        {
            title: "Aksar is dunya men",
            artist: "akhshy",
            duration: "5:44",
            cover: "./images/ken-smith-Msbaa3_TmBY-unsplash.jpg",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
        },
        {
            title: "alon walker",
            artist: "unknown",
            duration: "7:05",
            cover: "./images/paul-pastourmatzis-OZdKEwDXXJU-unsplash.jpg",
            src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
        }
    ];
    
    // Player state
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    
    // Initialize player
    function initPlayer() {
        loadSong(currentSongIndex);
        updatePlaylist();
    }
    
    // Load song
    function loadSong(index) {
        const song = songs[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        durationEl.textContent = song.duration;
        albumArt.src = song.cover;
        audioPlayer.src = song.src;
        
        // Add active class to current song in playlist
        playlistItems.forEach(item => item.classList.remove('active'));
        playlistItems[index].classList.add('active');
    }
    
    // Play song
    function playSong() {
        isPlaying = true;
        playerContainer.classList.add('playing');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        audioPlayer.play();
    }
    
    // Pause song
    function pauseSong() {
        isPlaying = false;
        playerContainer.classList.remove('playing');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        audioPlayer.pause();
    }
    
    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Next song
    function nextSong() {
        if (isShuffle) {
            playRandomSong();
        } else {
            currentSongIndex++;
            if (currentSongIndex > songs.length - 1) {
                if (isRepeat) {
                    currentSongIndex = 0;
                } else {
                    currentSongIndex = 0;
                    pauseSong();
                    return;
                }
            }
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }
    
    // Play random song
    function playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === currentSongIndex && songs.length > 1);
        
        currentSongIndex = newIndex;
        loadSong(currentSongIndex);
        playSong();
    }
    
    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (isNaN(duration)) return;
        
        // Update progress bar width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60);
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    }
    
    // Set progress bar
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        
        audioPlayer.currentTime = (clickX / width) * duration;
    }
    
    // Set volume
    function setVolume(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const volume = clickX / width;
        
        audioPlayer.volume = volume;
        volumeLevel.style.width = `${volume * 100}%`;
    }
    
    // Update playlist UI
    function updatePlaylist() {
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
        });
    }
    
    // Event Listeners
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });
    
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });
    
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    });
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', nextSong);
    
    progressBar.addEventListener('click', setProgress);
    volumeBar.addEventListener('click', setVolume);
    
    // Initialize the player
    initPlayer();
});