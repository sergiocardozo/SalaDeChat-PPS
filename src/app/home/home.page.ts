import { Component, inject } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { ChatService } from '../service/chat.service';
import { ToastController } from '@ionic/angular';
import * as moment from 'moment';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  authSrv = inject(AuthService);
  user: any = null;
  newMessage: string = '';
  messageListA: any = [];
  messageListB: any = [];
  pressedButton: boolean = false;
  chat: number = 0;
  soundSendMessage: any = new Audio('../../assets/sendMessage.mp3');

  constructor(
    private toastCtrl: ToastController,
    private router: Router,
    private chatService: ChatService
  ) {
    this.soundSendMessage.volume = 0.1;
  } // end of constructor

  ngOnInit(): void {
    this.authSrv.user$.subscribe((user: any) => {
      if (user) {
        this.user = user;
      }
      
    });
    this.chatService.getMessagesA().subscribe((messagesA) => {
      if (messagesA !== null) {
        this.messageListA = messagesA;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
    this.chatService.getMessagesB().subscribe((messagesB) => {
      if (messagesB !== null) {
        this.messageListB = messagesB;
        setTimeout(() => {
          this.scrollToTheLastElementByClassName();
        }, 100);
      }
    });
  } // end of ngOnInit

  async openToast(msg: string, status: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      color: status,
      duration: 3000,
      position: 'top'
    });
    toast.present()
  }

  showChat4A() {
    this.newMessage = '';
    this.showSpinner(1);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4A

  showChat4B() {
    this.newMessage = '';
    this.showSpinner(2);
    setTimeout(() => {
      this.scrollToTheLastElementByClassName();
    }, 2100);
  } // endo of showChat4B

  goToClassrooms() {
    this.newMessage = '';
    this.showSpinner(0);
  } // end of goToClassrooms

  sendMessageA() {
    if (this.newMessage.trim() == '') {
      this.openToast('No se pueden enviar mensajes vacios', 'danger');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.openToast(
        'Pasaste el límite de 21 caracteres',
        'danger'
      );
      return;
    }
    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageA(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
  } // end of sendMessageA

  sendMessageB() {
    if (this.newMessage.trim() == '') {
      this.openToast('Debes escribir un mensaje', 'warning');
      return;
    } else if (this.newMessage.trim().length > 21) {
      this.openToast(
        'El mensaje no puede tener más de 21 caracteres',
        'warning'
      );
      return;
    }

    const date = moment(new Date()).format('DD-MM-YYYY HH:mm:ss');
    const message = {
      user: this.user,
      text: this.newMessage,
      date: date,
    };
    this.chatService.createMessageB(message);
    this.newMessage = '';
    this.scrollToTheLastElementByClassName();
    this.soundSendMessage.play();
  } // end of sendMessageB

  showSpinner(chatOption: number) {
    this.pressedButton = true;
    setTimeout(() => {
      this.pressedButton = false;
      this.chat = chatOption;
    }, 2000);
  } // end of showSpinner

  scrollToTheLastElementByClassName() {
    const elements = document.getElementsByClassName('mensajes');
    const lastElement: any = elements[elements.length - 1];
    const toppos = lastElement.offsetTop;
    document.getElementById('contenedor-mensajes').scrollTop = toppos;
  } // end of scrollToTheLastElementByClassName
  logout() {
    this.authSrv.signOut().then((resp) => {
      this.router.navigate(['/login']);
      this.chat = 0;      
    })
  }

}
