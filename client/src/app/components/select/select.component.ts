import { Component, OnInit, ContentChildren, QueryList, Output, EventEmitter } from '@angular/core';
import { SelectOptionComponent } from 'src/app/components/select/select-option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @Output() onSelect = new EventEmitter<any>();
  @ContentChildren(SelectOptionComponent) options: QueryList<SelectOptionComponent>;
  selected;
  optionsList = [];
  selectClose = true;

  constructor() { }

  ngOnInit() {
  }

  toggleOptions() {
    this.selectClose = !this.selectClose;
  }

  ngAfterContentInit() {
    if (this.options.first) { this.selected = this.options.first; }
  }

  select(key) {
    this.options.forEach(o => {
      if (o.key === key) {
        this.selected = o;
      }
    });
    this.onSelect.emit(this.selected.key);
    this.toggleOptions();
  }

}
