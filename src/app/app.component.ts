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
  audioContext = new AudioContext();
  masterGainNode = this.audioContext.createGain();
  analyser: AnalyserNode | undefined
  dataArray: Uint8Array | undefined
  micVol: number = 0;

  constructor() {

  }

  ngOnInit(): void {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const microphoneSource = this.audioContext.createMediaStreamSource(stream);
        this.analyser = this.audioContext.createAnalyser();
        microphoneSource.connect(this.analyser);

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      })
      .catch((err) => {
        console.log("messed something up", err)
      });
    if (!this.apiLoaded) {
      this.tag = document.createElement('script')
      this.tag.src = "https://www.youtube.com/iframe_api";
      this.firstScriptTag = document.getElementsByTagName('script')[0]
      this.firstScriptTag.parentNode.insertBefore(this.tag, this.firstScriptTag);
      this.apiLoaded = true;
    }
  }

  onReady(event: YT.PlayerEvent): void {
    this.player.playVideo()
    this.player.setVolume(20)
  }

  async getVolume() {
    this.volume = this.player.getVolume()
  }

  setVolume() {

  }

  getMicrophoneVolume() {
    this.analyser?.getByteFrequencyData(<Uint8Array>this.dataArray);
    let micVol = this.dataArray?.reduce((prev, curr) => Math.max(prev, curr));
    this.micVol = micVol === undefined ? 0 : micVol * .4
    console.log(this.micVol)
  }

  blast(){
    setInterval(()=>{
      this.getMicrophoneVolume()
      this.player.setVolume(this.micVol+10)
    }, 50);

  }
}
