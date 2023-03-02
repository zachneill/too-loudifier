import {Component, Renderer2, ElementRef, OnInit, ViewChild} from '@angular/core';
import {YouTubePlayerModule} from '@angular/youtube-player';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('main', {static: true}) main!: ElementRef
  tag: any;
  apiLoaded: boolean = false;

  constructor(private el: ElementRef) {
    this.tag = document.createElement('script')
  }
  ngOnInit() {
    if (!this.apiLoaded) {
      // This code loads the IFrame Player API code asynchronously, according to the instructions at
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      this.apiLoaded = true;
    }
  }
}
