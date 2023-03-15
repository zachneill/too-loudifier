import {Component, ViewChild} from '@angular/core';
import {YouTubePlayer} from "@angular/youtube-player";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('player', {static: true}) player!: YouTubePlayer

  paused: boolean = false
  apiLoaded: boolean = false
  firstScriptTag: any
  audioContext = new AudioContext()
  analyser: AnalyserNode | undefined
  dataArray: Uint8Array | undefined
  micVol: number = 0
  videoId: string = 'bc0KhhjJP98'
  started: boolean = false
  constant: number = .4
  pauseText: string = 'Pause'

  constructor() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const microphoneSource = this.audioContext.createMediaStreamSource(stream)
        this.analyser = this.audioContext.createAnalyser()
        microphoneSource.connect(this.analyser)
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)
      })
      .catch((err) => {
        console.log("Problem encountered with user media; with error: ", err)
      })
  }

  onReady(): void {
    this.player.playVideo()
    this.player.setVolume(0)
    setInterval(()=>{
      this.micVol = !this.paused ? this.getMicrophoneVolume(): 0
      this.player.setVolume(this.micVol)
    }, 35)
  }

  getMicrophoneVolume() {
    this.analyser?.getByteFrequencyData(<Uint8Array>this.dataArray)
    let micVol = this.dataArray?.reduce((prev, curr) => Math.max(prev, curr))
    return micVol === undefined || micVol <15 ? 0 : (micVol - 15) * this.constant
  }

  start(url: string){
    this.videoId = url.split("v=")[1]
    if (!this.apiLoaded) {
      let tag = document.createElement('script')
      tag.src = "https://www.youtube.com/iframe_api";
      this.firstScriptTag = document.getElementsByTagName('script')[0]
      this.firstScriptTag.parentNode.insertBefore(tag, this.firstScriptTag)
      this.apiLoaded = true
    }
    this.started = true
  }
  reload() {
    location.reload()
  }

  changeConstant(constant: number) {
    this.constant = Math.round(1000 * (this.constant + constant)) / 1000
  }

  pause() {
    this.paused = !this.paused
  }
}
