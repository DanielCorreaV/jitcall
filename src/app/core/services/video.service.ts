import { Injectable } from '@angular/core';
import { VideoRecorder, VideoRecorderCamera, VideoRecorderPreviewFrame } from '@capacitor-community/video-recorder';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private initialized = false;

  constructor(private supabase: SupabaseService) {}

  async initializeCamera() {
    if (this.initialized) return;

    const config: VideoRecorderPreviewFrame = {
      id: 'video-preview',
      stackPosition: 'back',
      width: 'fill',
      height: 'fill',
      x: 0,
      y: 0,
      borderRadius: 0
    };

    await VideoRecorder.initialize({
      camera: VideoRecorderCamera.BACK,
      previewFrames: [config]
    });

    this.initialized = true;
  }

  async startRecording(): Promise<void> {
    try {
      await this.initializeCamera();
      await VideoRecorder.startRecording();
    } catch (error) {
      console.error('Error al iniciar la grabación de video:', error);
    }
  }

  async stopRecording(): Promise<void> {
    try {
      await VideoRecorder.stopRecording();
      await VideoRecorder.destroy();
      this.initialized = false;
    } catch (error) {
      console.error('Error al detener la grabación de video:', error);
    }
  }

  async stopAndUploadVideo(bucket = 'videos'): Promise<string | null> {
    try {
      const result = await VideoRecorder.stopRecording();

      console.warn('Resultado de la grabación:', result.videoUrl);

      if (!result?.videoUrl) {
        console.error('No se obtuvo el video');
        return null;
      }

      const response = await fetch(result.videoUrl);
      const blob = await response.blob();

      await VideoRecorder.destroy();
      this.initialized = false;

      return this.supabase.uploadVideo(blob, `video-${Date.now()}`);
    } catch (error) {
      console.error('Error al detener y subir el video:', error);
      return null;
    }
  }
}
