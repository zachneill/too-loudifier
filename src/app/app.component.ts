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
  analyser: AnalyserNode | undefined
  dataArray: Uint8Array | undefined
  videoId: string = 'bc0KhhjJP98'
  started: boolean = false
  constant: number = .4

  constructor() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const audioContext = new AudioContext()
        const microphoneSource = audioContext.createMediaStreamSource(stream)
        this.analyser = audioContext.createAnalyser()
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
      let micVol = !this.paused ? this.getMicrophoneVolume(): 0
      this.player.setVolume(micVol)
    }, 35)
  }

  getMicrophoneVolume() {
    this.analyser?.getByteFrequencyData(<Uint8Array>this.dataArray)
    let micVol = this.dataArray?.reduce((prev, curr) => Math.max(prev, curr))
    return micVol === undefined || micVol <=15 ? 0 : (micVol - 15) * this.constant
  }

  start(url: string){
    this.videoId = url.split("v=")[1]
    let tag = document.createElement('script')
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    this.started = true
  }
  reload() {
    location.reload()
  }

  changeConstant(constant: number) {
    this.constant = Math.round(1000 * (this.constant + constant)) / 1000
  }
}
