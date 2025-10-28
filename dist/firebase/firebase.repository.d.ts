import { app } from 'firebase-admin';
import { Messaging } from 'firebase-admin/lib/messaging/messaging';
import { Message, MulticastMessage } from 'firebase-admin/lib/messaging/messaging-api';
export declare class FirebaseRepository {
    private firebaseApp;
    messaging: Messaging;
    constructor(firebaseApp: app.App);
    sendMessage(notification: Message): void;
    sendMessageToMultipleDevices(notification: MulticastMessage): void;
}
