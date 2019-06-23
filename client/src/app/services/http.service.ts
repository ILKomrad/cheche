import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

declare const io: any;

@Injectable({
    providedIn: 'root',
})
export class HttpService {
    instance;
    prevSend;

    constructor() {
        this.instance = io('http://localhost:3001'); 
    }

    sendMessage(eventName: string, msg: any = null) {
        console.log( 'send', eventName, msg );
        this.instance.emit(eventName, JSON.stringify(msg));
    }

    listenPromise(eventName) {
        return new Promise(res => {
            const clbck = (event) => {
                this.instance.removeListener(eventName, clbck);
                const data = JSON.parse(event);
                console.log( 'listenPromise', eventName, data );
                res(data);
            }
            this.instance.on(eventName, clbck);
        });
    }

    listen(eventName) {
        return new Observable(obs => {
            this.instance.on(eventName, (event) => {
                const data = JSON.parse(event);
                console.log( 'listen', eventName, data );
                obs.next(data);
            });
        });
    }
}