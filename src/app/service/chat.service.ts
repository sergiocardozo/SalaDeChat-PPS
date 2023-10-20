import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private afs: AngularFirestore) { }

  getMessagesA() {
    const collection = this.afs.collection<any>('chats-a', (ref) =>
      ref.orderBy('date', 'asc').limit(25)
    );
    return collection.valueChanges();
  }

  getMessagesB() {
    const collection = this.afs.collection<any>('chats-b', (ref) =>
      ref.orderBy('date', 'asc').limit(25)
    );
    return collection.valueChanges();
  }

  createMessageA(message: any) {
    this.afs.collection<any>('chats-a').add(message);
  }

  createMessageB(message: any) {
    this.afs.collection<any>('chats-b').add(message);
  }
}
