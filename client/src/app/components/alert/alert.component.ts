import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
  @Input() show;
  @Output() ok = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onOk() {
    this.ok.emit();
  }
}
