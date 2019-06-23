import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from 'src/app/components/alert/alert.component';

@NgModule({
    imports: [CommonModule],
    declarations: [AlertComponent],
    exports: [AlertComponent]
})
export class AlertModule {}