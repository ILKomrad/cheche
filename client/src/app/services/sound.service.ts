import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    stepSound;
    path = '../assets/sound/';

    loadSound(name, soundName) {
        this[name] = new Audio();
        this[name].src = this.path + soundName;
        this[name].load();
    }

    startLoad() {
        this.loadSound('step', 'step.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('remove', 'remove.mp3');
        this.loadSound('queen', 'queen.mp3');
        this.loadSound('win', 'win.mp3');
        this.loadSound('loose', 'loose.mp3');
        this.loadSound('lamp', 'lamp.mp3');
    }

    reproduceSound(name) {
        if (this[name]) {
            // this.stopSound(name);
            // this[name].play();
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
            this[soundName].volume = vol;
        }
    }
}