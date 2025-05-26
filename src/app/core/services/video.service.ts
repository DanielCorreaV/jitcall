import { Injectable } from '@angular/core';
import { VideoRecorder, VideoRecorderCamera, VideoRecorderPreviewFrame } from '@capacitor-community/video-recorder';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(private supabase: SupabaseService) {
  }

   async initializeCamera() {
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
  }

  async startRecording(): Promise<void> {
    try{
      this.initializeCamera().then(() => {
        VideoRecorder.startRecording();
      });
    } catch (error) {
      console.error('Error al iniciar la grabación de video:', error);
    }
  }

  async stopRecording(): Promise<void> {
    await VideoRecorder.stopRecording();
    await VideoRecorder.destroy();
  }

  async stopAndUploadVideo(bucket = 'videos'): Promise<string | null> {
    const result = await VideoRecorder.stopRecording();

    if (!result?.videoUrl) {
      console.error('No se obtuvo el video');
      return null;
    }

    const response = await fetch(result.videoUrl);
    const blob = await response.blob();
    const fileName = `video-${Date.now()}.webm`;

    return this.supabase.uploadVideo(blob, Date.now().toString()) ;
  }
}
