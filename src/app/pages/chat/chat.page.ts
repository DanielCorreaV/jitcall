import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/core/services/chat.service';
import { FirebaseService } from 'src/app/core/services/firebase.service';
import { UserService } from 'src/app/core/services/user.service';
import { Contact } from 'src/app/models/contact.model';
import { message } from 'src/app/models/message.model';
import { JitsiPlugin } from 'jitsi-plugin/src';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PickFilesService } from 'src/app/core/services/pickfiles.service';
import { SupabaseService } from 'src/app/core/services/supabase.service';
import { AudioService } from 'src/app/core/services/audio.service';
import { VideoService } from 'src/app/core/services/video.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: false
})
export class ChatPage implements OnInit, AfterViewChecked {

  chatID = "";
  contact: Contact = {
    name: "",
    surname: "",
    phone: "",
    image: ""
  };
  uid: string | null = null;
  messages: any[] = [];
  messageText: any = "";
  isselecting: boolean = false;

  preview: string = "";
  optionSelected: number = 0;

  @ViewChild('chatContent', { static: false }) chatContent!: ElementRef;

  // Flag para controlar el scroll automático
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private firebase: FirebaseService,
    private chatService: ChatService,
    private user: UserService,
    private notificationService: NotificationService,
    private pickFiles: PickFilesService,
    private supabase: SupabaseService,
    private audio: AudioService,
    private video: VideoService
  ) { }

  ngOnInit() {
    this.initData();
  }

  private async initData() {
    this.uid = await this.firebase.getCurrentUid();
    this.chatID = this.route.snapshot.paramMap.get('chatId') || '';

    // Suscripción a mensajes: cada vez que lleguen nuevos mensajes, marcar para hacer scroll
    this.chatService.getChatMessagesGrouped(this.chatID).subscribe((data) => {
      this.messages = data || [];
      this.shouldScroll = true; // Marcar que hay que hacer scroll después de renderizar
    });

    this.route.queryParams.subscribe(params => {
      const contactId = params['contactID'];
      this.user.getContactById(this.uid || "", contactId).subscribe((data) => {
        this.contact = data;
      });
    });
  }

  // AfterViewChecked se ejecuta después de que Angular verifica y actualiza la vista
  ngAfterViewChecked(): void {
    if (this.shouldScroll && this.chatContent?.nativeElement) {
      this.scrollToBottom();
      this.shouldScroll = false; // Scroll hecho, no volver a hacer hasta que cambien mensajes
    }
  }

  scrollToBottom(): void {
    try {
      const element = this.chatContent.nativeElement;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    } catch (err) {
      console.warn('No se pudo hacer scroll:', err);
    }
  }

  async sendMessage() {
    let type = "text";
    let content = this.messageText.trim();
    console.log("contenido: ", content);

    if(this.optionSelected == 1 || this.optionSelected == 2) {
      console.log("se seleccionó la opción 2");
      type = "image";
      content = await this.supabase.uploadImage(this.preview, Date.now().toString())|| this.preview;
      this.reset();
    }
    if(this.optionSelected == 3) {
      console.log("se seleccionó la opción 3");
      type = "audio";
      content = this.preview;
      this.reset();
    }
    if(this.optionSelected == 4) {
      console.log("se seleccionó la opción 4");
      type = "location";
      content = this.preview;
      this.reset();
    }
    if(this.optionSelected == 5) {
      console.log("se seleccionó la opción 5");
      type = "video";
      content = this.preview;
      this.reset();
    }

    if (this.uid) {
      const message: message = {
        content: content,
        from: this.uid,
        type: type,
        date: Date.now()
      };

      try {
        await this.chatService.sendMessage(this.chatID, message);
        this.messageText = "";
        // Después de enviar, marcar para hacer scroll
        this.shouldScroll = true;
      } catch (error) {
        console.error("Error al enviar el mensaje:", error);
      }
    }
  }

  reset(){
    this.preview = "";
      this.optionSelected = 0;
      this.isselecting = false;
  }

  async gotoCall() {
    if (this.uid) {
      const fcmToken = await this.user.getTokenByPhone(this.contact.phone);
      const userId = this.contact.id;
      const contactName = this.contact.name;
      const userFrom = this.uid;

      let room = (await JitsiPlugin.createRoom()).meetingId;

      if (fcmToken && room && userId) {
        this.notificationService
          .sendNotification(fcmToken, userId, room, contactName, userFrom)
          .subscribe({
            next: async (response) => {
              console.log('Notificación enviada con éxito:', response);
              try {
                await JitsiPlugin.joinCall({
                  meetingId: room,
                  userName: contactName
                });
                console.log('Unido a la sala:', room);
              } catch (error) {
                console.error('Error al unirse a la sala:', error);
              }
            },
            error: (err) => {
              console.error('Error al enviar la notificación:', err);
            },
          });
      } else {
        console.log("No hay token FCM o room");
      }
    }
  }

  async onFileSelected() {
    const result = await this.pickFiles.pickFiles();

    if (result) {
      if (this.user) {
        this.preview = result.base64Src;
      }

    }
  }

  async takePhoto() {
    const result = await this.pickFiles.takePhoto();

    if (result) {
        this.preview = result.base64Src;  
      }

  }

  async startRecording() {
    const permission = await this.audio.requestPermission();
    if (permission) {
      await this.audio.startRecording();      
    } else {
      console.error("Permiso de grabación denegado");
    }
  }

  async stopandUpload() {
    const link = await this.audio.stopAndUploadAudio();

    if (link) {
      this.preview = link;
      this.sendMessage();
    }
  }

  async cancelRecording() {
    await this.audio.stopRecording();
    this.isselecting = !this.isselecting;
    this.preview = "";
    this.optionSelected = 0;
  }

  async recordVideo() {
  try {
    await this.video.startRecording();
    console.log("se inicia la grabación:");
  } catch (err) {
    console.error('Error iniciando video:', err);
  }
}


async sendVideo() {
  const url = await this.video.stopAndUploadVideo();
  if (url) {
    this.preview = url;
    this.sendMessage();
  }
}

  async cancelVideo() {
  await this.video.stopRecording();
  this.isselecting = !this.isselecting;
  this.reset();
}


  selectOption(option: number) {
    this.optionSelected = option;

    if (option === 1) {
      this.takePhoto();
      this.isselecting = !this.isselecting;
    } 

    if( option === 2) {
      this.onFileSelected();
      this.isselecting = !this.isselecting;
    }

    if( option === 3) {
      this.isselecting = !this.isselecting;
      this.startRecording();
    }

    if (option === 4) {
      this.isselecting = !this.isselecting;
      //this.takePhoto();
    }

    if (option === 5) {
      this.isselecting = !this.isselecting;
      this.recordVideo();
    }
  }

}
