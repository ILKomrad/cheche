import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingGeneratorComponent } from './meeting-generator.component';

describe('MeetingGeneratorComponent', () => {
  let component: MeetingGeneratorComponent;
  let fixture: ComponentFixture<MeetingGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
