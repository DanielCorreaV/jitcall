import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-call',
  templateUrl: './call.component.html',
  styleUrls: ['./call.component.scss'],
  standalone: false
})
export class CallComponent implements OnInit {
  jitsiUrl: SafeResourceUrl | null = null;
  @Input() meetingId: string = '';

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    if (this.meetingId) {
      this.jitsiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://jitsi1.geeksec.de/${this.meetingId}`
      );
    }
  }
}

