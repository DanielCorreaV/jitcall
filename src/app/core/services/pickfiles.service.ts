import { Injectable } from '@angular/core';
import { FilePicker, PickFilesResult } from '@capawesome/capacitor-file-picker';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
 
@Injectable({
  providedIn: 'root'
})
export class PickFilesService {

  constructor() { }

  async requestPermissions() {
  const result = await FilePicker.requestPermissions();
  const cameraResult = await Camera.requestPermissions({ permissions: ['photos'] });
  if (cameraResult) {
    console.log('Camera permissions granted');
  }
  
  if (result) {
    console.log('Permissions granted:'); 
  }
  };

  async pickImage(): Promise<{ base64Src: string, base64: string, path?: string } | null> {
  try {
    const result = await FilePicker.pickFiles({
      types: ['image/*'],
      limit: 1,
      readData: true
    });

    if (result.files.length === 0) {
      console.log('No files selected');
      return null;
    }

    const file = result.files[0];
    const mimeType = file.mimeType || 'image/*'; 

    return {
      base64Src: `data:${mimeType};base64,` + file.data,
      base64: file.data!,
      path: file.path
    };
  } catch (error: any) {
    if (error?.message === 'pickFiles canceled.') {
      console.log('Selección cancelada por el usuario.');
    } else {
      console.error('Error al seleccionar archivo:', error);
    }
    return null;
  }
}

async takePhoto(edit?:boolean): Promise<{ base64Src: string, base64: string, path?: string } | null> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: edit|| false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera
      });

      const base64 = image.base64String!;
      const mimeType = `image/${image.format || 'jpeg'}`;

      return {
        base64Src: `data:${mimeType};base64,${base64}`,
        base64: base64,
        path: image.path
      };
    } catch (error) {
      console.error('Error al tomar foto:', error);
      return null;
    }
  }

  async pickFile() {
  const result = await FilePicker.pickFiles({
    types: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
    limit: 1,
    readData: true,
  });

  if (result.files.length === 0) {
    console.log('No files selected');
    return null;
  }

  const file = result.files[0];
  const mimeType = file.mimeType || 'application/octet-stream';

  const byteCharacters = atob(file.data!);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });

  return {
    name: file.name,
    mimeType,
    blob,
    base64: file.data!,
    base64Src: `data:${mimeType};base64,${file.data!}`
  };
}


}
