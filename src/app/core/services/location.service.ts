import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation'; 

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() {
    this.checkPermission();
   }

  async checkPermission() {
    const status = await Geolocation.checkPermissions();
    if (status.location === 'granted') {
      return true;
    } else if (status.location === 'denied') {
      return false;
    } else {
      const newStatus = await Geolocation.requestPermissions();
      return newStatus.location === 'granted';
    }
  }

  async getLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates.coords;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null;
    }
  }

  async getCurrentLocation() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates.coords;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
      return null;
    }
  }

}
