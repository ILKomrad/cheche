import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from 'src/app/components/select/select.component';
import { SelectOptionComponent } from 'src/app/components/select/select-option.component';

@NgModule({
    imports: [CommonModule],
    declarations: [SelectComponent, SelectOptionComponent],
    exports: [SelectComponent, SelectOptionComponent]
})
export class SelectModule {}