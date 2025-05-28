import { Component, ElementRef, Input, ViewChild, AfterViewInit } from '@angular/core';
import { message } from 'src/app/models/message.model';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: false
})
export class MessageComponent implements AfterViewInit {

  @Input() message: message = {
    content: '',
    from: '',
    type: '',
    date: 0
  };

  @ViewChild('mapContainer', { static: false }) mapElement!: ElementRef;
  map!: google.maps.Map;

  ngAfterViewInit(): void {
    if (this.message.type === 'location') {
      this.loadGoogleMaps().then(() => {
        this.initMap(this.message.content[0], this.message.content[1]);
      }).catch(err => {
        console.error('No se pudo cargar Google Maps:', err);
      });
    }
  }

  initMap(lng: number, lat: number) {
    console.log("longitud: "+ lng);
    console.log("latitud: "+ lat);
    const position = { lat, lng }; // Puedes hacer que venga desde message

    const map = new google.maps.Map(this.mapElement.nativeElement, {
      center: position,
      zoom: 16,
      disableDefaultUI: false
    });
  
    new google.maps.Marker({
      position,
      map
    });
  }

  private loadGoogleMaps(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).google && (window as any).google.maps) {
        resolve(); // Ya está cargado
      } else {
        const script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyB7kgh5ETfvQEXzv5bagFpZXUcdZcC5VRc'; // ← reemplaza con tu API key
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      }
    });
  }
  
}
