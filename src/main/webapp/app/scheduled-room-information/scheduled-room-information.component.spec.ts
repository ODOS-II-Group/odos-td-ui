import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledRoomInformationComponent } from './scheduled-room-information.component';

describe('ScheduledRoomInformationComponent', () => {
  let component: ScheduledRoomInformationComponent;
  let fixture: ComponentFixture<ScheduledRoomInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledRoomInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledRoomInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
