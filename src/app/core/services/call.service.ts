import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CallService {
  constructor() {}

  startCall() {
    const meetingId = uuidv4(); // UUID
    console.log("id de la llamada: ", meetingId);
    return meetingId;
  }
}
