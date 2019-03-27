import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
    template: `
        <div>dsdsd</div>
    `
})
export class GameComponent {
    constructor(
        private dataService: DataService
    ) {}

    ngOnInit() {
        this.dataService.getData()
        .subscribe(data => {
            console.log( data )
        })
    }
}