// ========== MUSIC CONTROLS PLUGIN ==========
var audioElement = null;

function initMusicControls() {
    // Cek apakah plugin tersedia
    if (typeof MusicControls === 'undefined') {
        console.log('MusicControls plugin not available');
        return;
    }
    
    // Subscribe ke event dari notifikasi
    MusicControls.subscribe(function(action) {
        try {
            const message = JSON.parse(action).message;
            console.log('MusicControls action:', message);
            
            switch(message) {
                case 'music-controls-play':
                    if (window.togglePlayPause) window.togglePlayPause();
                    break;
                case 'music-controls-pause':
                    if (window.togglePlayPause) window.togglePlayPause();
                    break;
                case 'music-controls-next':
                    if (window.playNextSong) window.playNextSong();
                    break;
                case 'music-controls-previous':
                    if (window.playPrevSong) window.playPrevSong();
                    break;
                case 'music-controls-destroy':
                    if (window.audio) window.audio.pause();
                    break;
                case 'music-controls-toggle-play-pause':
                    if (window.togglePlayPause) window.togglePlayPause();
                    break;
                default:
                    console.log('Unknown action:', message);
            }
        } catch(e) {
            console.error('Error parsing MusicControls action:', e);
        }
    });

    // Mulai listen
    MusicControls.listen();
}

function updateMusicControls(isPlaying, song) {
    if (typeof MusicControls === 'undefined' || !song) return;
    
    try {
        MusicControls.create({
            track       : song.title || 'Unknown',
            artist      : song.artist || 'Unknown',
            album       : song.album || 'Unknown',
            cover       : song.img || '',
            isPlaying   : isPlaying,
            duration    : song.duration || 0,
            elapsed     : window.audio ? Math.floor(window.audio.currentTime) : 0,
            
            // Tampilan
            dismissable : false,
            hasPrev     : true,
            hasNext     : true,
            hasClose    : true,
            hasPlayPause: true,
            
            // Untuk lockscreen
            ticker      : 'Now playing: ' + song.title,
            playIcon    : 'media_play',
            pauseIcon   : 'media_pause',
            prevIcon    : 'media_prev',
            nextIcon    : 'media_next',
            closeIcon   : 'media_close',
            
            // Notifikasi style
            notificationIcon: 'notification'
        });
        
        console.log('MusicControls updated');
    } catch(e) {
        console.error('Error updating MusicControls:', e);
    }
}

function destroyMusicControls() {
    if (typeof MusicControls !== 'undefined') {
        MusicControls.destroy();
    }
}

// Export fungsi ke global
window.initMusicControls = initMusicControls;
window.updateMusicControls = updateMusicControls;
window.destroyMusicControls = destroyMusicControls;
