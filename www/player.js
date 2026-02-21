/**
 * player.js - Music Controls Plugin Handler for Suika Player
 * Menangani integrasi dengan cordova-plugin-music-controls2
 */

// ========== MUSIC CONTROLS PLUGIN ==========
(function() {
    'use strict';

    // Reference ke audio element dari window (di-set oleh index.html)
    const audio = window.audio || null;
    
    /**
     * Inisialisasi Music Controls
     * Dipanggil saat Cordova ready
     */
    window.initMusicControls = function() {
        // Cek apakah plugin tersedia
        if (typeof MusicControls === 'undefined') {
            console.log('⚠️ MusicControls plugin not available');
            return false;
        }
        
        console.log('🎵 Initializing MusicControls...');
        
        // Subscribe ke event dari notifikasi
        MusicControls.subscribe(function(action) {
            try {
                const msg = JSON.parse(action).message;
                console.log('📱 MusicControls action:', msg);
                
                switch(msg) {
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
                        console.log('Unknown action:', msg);
                }
            } catch(e) {
                console.error('❌ Error parsing MusicControls action:', e);
            }
        });

        // Mulai listen
        MusicControls.listen();
        
        console.log('✅ MusicControls initialized');
        return true;
    };

    /**
     * Update tampilan notifikasi
     * @param {boolean} isPlaying - Status play/pause
     * @param {Object} song - Data lagu (title, artist, album, img, duration)
     */
    window.updateMusicControls = function(isPlaying, song) {
        if (typeof MusicControls === 'undefined') {
            console.log('⚠️ MusicControls not available, skipping update');
            return false;
        }
        
        if (!song) {
            console.log('⚠️ No song data provided');
            return false;
        }
        
        try {
            // Hitung elapsed time dari audio element
            const elapsed = window.audio ? Math.floor(window.audio.currentTime || 0) : 0;
            
            // Parse duration dari string "3:14" ke detik (opsional)
            let durationInSeconds = 0;
            if (song.duration) {
                const parts = song.duration.split(':');
                if (parts.length === 2) {
                    durationInSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
                }
            }
            
            // Buat notifikasi
            MusicControls.create({
                // Informasi lagu
                track       : song.title || 'Unknown Track',
                artist      : song.artist || 'Unknown Artist',
                album       : song.album || 'Unknown Album',
                cover       : song.img || '', // URL gambar
                
                // Status
                isPlaying   : isPlaying,
                duration    : durationInSeconds,
                elapsed     : elapsed,
                
                // Tampilan tombol
                dismissable : false,      // Tidak bisa di-dismiss (kecuali pause)
                hasPrev     : true,       // Tombol previous
                hasNext     : true,       // Tombol next
                hasClose    : true,       // Tombol close
                hasPlayPause: true,       // Tombol play/pause
                
                // Teks di notifikasi (Android)
                ticker      : `Now playing: ${song.title}`,
                
                // Icon kustom (optional - default udah ada)
                playIcon    : 'media_play',
                pauseIcon   : 'media_pause',
                prevIcon    : 'media_prev',
                nextIcon    : 'media_next',
                closeIcon   : 'media_close',
                
                // Untuk notifikasi
                notificationIcon: 'notification'
            });
            
            console.log('✅ MusicControls updated:', song.title);
            return true;
            
        } catch(e) {
            console.error('❌ Error updating MusicControls:', e);
            return false;
        }
    };

    /**
     * Hancurkan notifikasi (saat app ditutup)
     */
    window.destroyMusicControls = function() {
        if (typeof MusicControls !== 'undefined') {
            MusicControls.destroy();
            console.log('🔚 MusicControls destroyed');
        }
    };

    /**
     * Update status play/pause saja (tanpa ganti lagu)
     * @param {boolean} isPlaying 
     */
    window.updatePlaybackStatus = function(isPlaying) {
        if (typeof MusicControls === 'undefined') return;
        
        try {
            MusicControls.updateIsPlaying(isPlaying);
            console.log('🔄 Playback status updated:', isPlaying ? 'playing' : 'paused');
        } catch(e) {
            console.error('Error updating playback status:', e);
        }
    };

    /**
     * Update elapsed time (bisa dipanggil dari timer)
     * @param {number} elapsed - Waktu dalam detik
     */
    window.updateElapsedTime = function(elapsed) {
        if (typeof MusicControls === 'undefined') return;
        
        try {
            MusicControls.updateElapsed({
                elapsed: Math.floor(elapsed || 0)
            });
        } catch(e) {
            // Silent fail - gak terlalu penting
        }
    };

    // Auto-init saat Cordova ready (fallback)
    document.addEventListener('deviceready', function() {
        console.log('📱 Cordova is ready (from player.js)');
        // Init akan dipanggil juga dari index.html
    }, false);

    console.log('🎵 player.js loaded');
})();
