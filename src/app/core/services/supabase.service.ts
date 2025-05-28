import { Injectable } from '@angular/core';
import { supabase } from '../supabase.config';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  async uploadAvatar(base64Data: string, uid: string): Promise<string | null> {
    return this.uploadImageToSupabase(base64Data, uid, 'avatars');
  }

  async uploadImage(base64Data: string, date: string): Promise<string | null> {
    return this.uploadImageToSupabase(base64Data, date, 'images');
  }


  async uploadImageToSupabase(base64Data: string, name: string, folder: string) {
    const contentType = 'image/png'; 
    const fileName = `IMG-${name}.png`; 

    // Converti a Blob
    const base64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const blob = new Blob([new Uint8Array(byteArrays)], { type: contentType });

    // Sube a Supabase
    const { data, error } = await supabase.storage
      .from('images') 
      .upload(`${folder}/${fileName}`, blob, {
        contentType,
        upsert: true
      });
      

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    // Obtener URL pública
    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(data.path);
    const url = `${publicUrl.publicUrl}?t=${Date.now()}`;
    return url
  }

  async uploadAudio(blob: Blob, date: string): Promise<string | null> {

    const fileName = `AUDIO-${date}.webm`;

    const { data, error } = await supabase.storage
      .from('audios')
      .upload(`audios/${fileName}`, blob, {
        contentType: 'audio/webm',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    // Obtener URL pública
    const { data: publicUrl } = supabase.storage.from('audios').getPublicUrl(data.path);
    const url = `${publicUrl.publicUrl}?t=${Date.now()}`;
    return url;
  }

  async uploadVideo(blob: Blob, date: string): Promise<string | null> {

    const fileName = `VIDEO-${date}.webm`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(`videos/${fileName}`, blob, {
        contentType: 'video/webm',
        upsert: true
      });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    // Obtener URL pública
    const { data: publicUrl } = supabase.storage.from('videos').getPublicUrl(data.path);
    const url = `${publicUrl.publicUrl}?t=${Date.now()}`;
    return url;
  }

  async uploadFile(blob: Blob, name: string): Promise<string | null> {
    const fileName = name || `FILE-${Date.now()}.bin`; 

    const { data, error } = await supabase.storage
      .from('files')
      .upload(`files/${fileName}`, blob, {
        contentType: blob.type,
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error.message);
      return null;
    }

    // Obtener URL pública
    const { data: publicUrl } = supabase.storage.from('files').getPublicUrl(data.path);
    const url = `${publicUrl.publicUrl}?t=${Date.now()}`;
    return url;
  }

}

