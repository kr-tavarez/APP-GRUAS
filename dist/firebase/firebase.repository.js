"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseRepository = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = require("firebase-admin");
let FirebaseRepository = class FirebaseRepository {
    constructor(firebaseApp) {
        this.firebaseApp = firebaseApp;
        this.messaging = firebaseApp.messaging();
    }
    sendMessage(notification) {
        this.messaging.send(notification).then((response) => {
            console.log('NOTIFICACION ENVIADA');
        }).catch(e => {
            console.log('ERROR ENVIANDO NOTIFICACION: ', e);
        });
    }
    sendMessageToMultipleDevices(notification) {
        this.messaging.sendEachForMulticast(notification).then((response) => {
            console.log('NOTIFICACION ENVIADA');
        }).catch(e => {
            console.log('ERROR ENVIANDO NOTIFICACION: ', e);
        });
    }
};
FirebaseRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('FIREBASE_APP')),
    __metadata("design:paramtypes", [Object])
], FirebaseRepository);
exports.FirebaseRepository = FirebaseRepository;
//# sourceMappingURL=firebase.repository.js.map