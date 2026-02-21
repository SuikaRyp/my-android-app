var audio = null;

function playMusic(url, title, artist, cover){

  if(audio){
    audio.pause();
  }

  audio = new Audio(url);
  audio.play();

  MusicControls.create({
    track       : title,
    artist      : artist,
    cover       : cover,
    isPlaying   : true,
    dismissable : false,
    hasPrev : false,
    hasNext : false,
    hasClose : true,
    hasPlayPause : true
  });

  MusicControls.subscribe(function(action){
    const message = JSON.parse(action).message;

    switch(message){

      case 'music-controls-pause':
        audio.pause();
        MusicControls.updateIsPlaying(false);
      break;

      case 'music-controls-play':
        audio.play();
        MusicControls.updateIsPlaying(true);
      break;

      case 'music-controls-destroy':
        audio.pause();
      break;

    }
  });

  MusicControls.listen();
}
