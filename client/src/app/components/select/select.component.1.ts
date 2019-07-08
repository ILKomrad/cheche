import { Component, OnInit, ContentChildren, QueryList } from '@angular/core';
import { SelectOptionComponent } from 'src/app/components/select/select-option.component';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {
  @ContentChildren(SelectOptionComponent) options: QueryList<SelectOptionComponent>;
  title = '';
  optionsList = [];
  selectOpen = false;

  constructor() { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    if (this.options.first) { this.title = this.options.first.val; }
  }

  onSelect(key) {
    console.log( key )
  }

}
