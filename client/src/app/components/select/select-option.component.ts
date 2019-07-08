import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-select-option',
    template: ``,
    styles: [`
    
    `]
})
export class SelectOptionComponent {
    @Input() key;
    @Input() val;
}