import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-meeting-list',
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {
  @Input() meetings;
  @Input() userId;
  @Output() selectGame = new EventEmitter<any>();
  botLevels = [
    {key: 'primitive', val: 'primitive'},
    {key: 'beginner', val: 'beginner'},
  ];
  botLevel = this.botLevels[0].val;

  constructor() {}

  ngOnInit() {
  }

  select(id) {
    this.selectGame.emit({id, botLevel: this.botLevel});
  }

  selectBotLevel(level) {
    this.botLevel = level;
  }
}
