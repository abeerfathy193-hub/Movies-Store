import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-videoplayer',
  imports: [CommonModule],
  templateUrl: './videoplayer.html',
  styleUrl: './videoplayer.css'
})
export class Videoplayer implements OnChanges {
  @Input() videoUrl!: string | null;
  @Input() hasPurchased: boolean = false;

  safeVideoUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer){}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.videoUrl) {
      // youtube link
      if (this.videoUrl.includes('youtube.com/watch')) {
        const videoId = this.videoUrl.split('v=')[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
      } 
      // anything else
      else {
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
      }
    }
  }

  
}
