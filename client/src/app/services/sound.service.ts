import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    sounds = [];
    path = '../assets/sound/';
    state = localStorage.getItem('soundState_checkers') ? localStorage.getItem('soundState_checkers') : 'on';
    state$ = new BehaviorSubject<any>(this.state);

    getState() {
        return this.state$;
    }

    soundToggle() {
        if (this.state === 'on') {
            this.state = 'off';

            this.sounds.forEach(sound => {
                this.setVolume(0, sound);
            });
        } else {
            this.state = 'on';

            this.sounds.forEach(sound => {
                this.setVolume(null, sound);
            });
        }
        localStorage.setItem('soundState_checkers', this.state);
        this.state$.next(this.state);
    }

    loadSound(name, soundName) {
        this[name] = new Audio();
        this[name].src = this.path + soundName;
        this[name].load();
        this[name]['initialVolume'] = 1;
       
        if (this.state === 'off') {
            this.setVolume(0, name);
        }

        this.sounds.push(name);
    }

    startLoad() {
        this.loadSound('step', 'step.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('remove', 'remove.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('win', 'win.mp3');
        this.loadSound('loose', 'loose.mp3');
        this.loadSound('lamp', 'lamp.wav');
    }

    reproduceSound(name) {
        if (this[name]) {
            this.stopSound(name);
            this[name].play();
        }
    }

    stopSound(name) {
        if (this[name]) {
            this[name].pause();
            this[name].currentTime = 0;
        }
    }

    setVolume(vol, soundName) {
        if (this[soundName]) {
            if (vol !== null) {
                this[soundName].volume = vol;
            } else {
                this[soundName].volume = this[soundName].initialVolume;
            }
        }
    }
}