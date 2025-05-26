import { Injectable } from '@angular/core';
import { VoiceRecorder } from 'capacitor-voice-recorder';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  private recording = false;

  constructor(private supabase: SupabaseService) {
    VoiceRecorder.requestAudioRecordingPermission().then((permission) => {
      if (!permission.value) {
        console.error('Permiso de grabación de audio denegado');
      }
    });
   
  }

  async requestPermission(): Promise<boolean> {
    const permission = await VoiceRecorder.requestAudioRecordingPermission();
    return permission.value;
  }

  async startRecording(): Promise<void> {
    if (!this.recording) {
      await VoiceRecorder.startRecording();
      this.recording = true;
    }
  }

  async stopRecording(): Promise<void> {
    if (this.recording) {
      await VoiceRecorder.stopRecording();
      this.recording = false;
    }
  }

  async stopAndUploadAudio(): Promise<string | null> {
    if (!this.recording) return null;

    const result = await VoiceRecorder.stopRecording();
    this.recording = false;

    if (!result.value || !result.value.recordDataBase64) {
      console.error('No se pudo obtener audio');
      return null;
    }
    const audioBlob = this.base64ToBlob(result.value.recordDataBase64, 'audio/webm');
    console.log('Audio blob:', audioBlob);
    const link = await this.supabase.uploadAudio(audioBlob, Date.now().toString());
    if (!link) {
      console.error('Error al subir el audio');
      return null;
    }

    return link;
  }

  private base64ToBlob(base64: string, mime: string): Blob {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mime });
  }
}
