import {Component, OnInit, ViewChild} from '@angular/core';
import {YouTubePlayer} from "@angular/youtube-player";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('player', {static: true}) player!: YouTubePlayer
  tag: any;
  apiLoaded: boolean = false;
  firstScriptTag: any
  volume: number | null = null;

  // player: any
  constructor() {
  }

  ngOnInit(): void {
    if (!this.apiLoaded) {
      this.tag = document.createElement('script')
      this.tag.src = "https://www.youtube.com/iframe_api";
      this.firstScriptTag = document.getElementsByTagName('script')[0]
      this.firstScriptTag.parentNode.insertBefore(this.tag, this.firstScriptTag);
      this.apiLoaded = true;

    }
  }

  onReady() {
    console.log(this.player.getDuration())
    this.player.playVideo()
    this.player.setVolume(20)

  }


  async getVolume() {
    const peerConnection = new RTCPeerConnection();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const track = stream.getAudioTracks()[0];
    peerConnection.addTrack(track, stream);

    const stats = await peerConnection.getStats(track);
    console.log(stats)
    stats.forEach((value) =>{
      console.log(value)
      if (value.type === 'media-source' && value.trackIdentifier === track.id){
        console.log(value.audioLevel)
        console.log(value)
        this.volume = value.audioLevel;
      }
    })
    peerConnection.close();
  }
}
