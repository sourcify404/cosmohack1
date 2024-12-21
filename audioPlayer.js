// audioPlayer.js
let audio;
let playPauseBtn;
let muteBtn;
let progressBar;
let progress;
let currentTimeDisplay;
let durationDisplay;

function initAudioPlayer() {
    audio = new Audio('./music/theme.mp3');
    playPauseBtn = document.getElementById('playPauseBtn');
    muteBtn = document.getElementById('muteBtn');
    progressBar = document.getElementById('progressBar');
    progress = document.getElementById('progress');
    currentTimeDisplay = document.getElementById('currentTime');
    durationDisplay = document.getElementById('duration');

    playPauseBtn.addEventListener('click', togglePlay);
    muteBtn.addEventListener('click', toggleMute);
    progressBar.addEventListener('click', seek);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setDuration);

    // Restore audio state from localStorage
    const isPlaying = localStorage.getItem('isPlaying') === 'true';
    const currentTime = parseFloat(localStorage.getItem('currentTime') || '0');
    const isMuted = localStorage.getItem('isMuted') === 'true';

    audio.currentTime = currentTime;
    audio.muted = isMuted;
    updateMuteButton();

    if (isPlaying) {
        audio.play();
        updatePlayPauseButton();
    }
}

function togglePlay() {
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
    updatePlayPauseButton();
    localStorage.setItem('isPlaying', !audio.paused);
}

function updatePlayPauseButton() {
    playPauseBtn.innerHTML = audio.paused ? '<i class="fas fa-play"></i>' : '<i class="fas fa-pause"></i>';
}

function toggleMute() {
    audio.muted = !audio.muted;
    updateMuteButton();
    localStorage.setItem('isMuted', audio.muted);
}

function updateMuteButton() {
    muteBtn.innerHTML = audio.muted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
}

function seek(e) {
    const percent = e.offsetX / progressBar.offsetWidth;
    audio.currentTime = percent * audio.duration;
    localStorage.setItem('currentTime', audio.currentTime);
}

function updateProgress() {
    const percent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${percent}%`;
    currentTimeDisplay.textContent = formatTime(audio.currentTime);
    localStorage.setItem('currentTime', audio.currentTime);
}

function setDuration() {
    durationDisplay.textContent = formatTime(audio.duration);
}

function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Initialize the audio player when the DOM is loaded
document.addEventListener('DOMContentLoaded', initAudioPlayer);

// Update localStorage when the page is about to unload
window.addEventListener('beforeunload', () => {
    localStorage.setItem('currentTime', audio.currentTime);
    localStorage.setItem('isPlaying', !audio.paused);
    localStorage.setItem('isMuted', audio.muted);
});