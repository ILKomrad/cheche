import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MeetingsService } from 'src/app/meetings/services/meetings.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-meeting-generator',
  templateUrl: './meeting-generator.component.html',
  styleUrls: ['./meeting-generator.component.scss']
})
export class MeetingGeneratorComponent implements OnInit {
  @Output() create = new EventEmitter<any>();
  types;
  meetingForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {
    this.types = [
      {alias: 'giveaway', label: 'поддавки'},
      {alias: 'classic', label: 'классика'}
    ];
  }

  ngOnInit() {
    const types = this.types.map(c => this.fb.control(false));

    this.meetingForm = this.fb.group({
      name: '',
      type: this.types[0].alias
    });
  }

  onSubmit() {
    const type = this.meetingForm.get('type').value;
    this.create.emit(type)
  }
}
