import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  context: AudioContext = new AudioContext
  gainNode: GainNode = this.context.createGain()

  ngOnInit() {
    this.gainNode.connect(this.context.destination)
  }

  changeVolume(newVolume: number): void {
    this.gainNode.gain.setValueAtTime(newVolume, this.context.currentTime);
  }

}
