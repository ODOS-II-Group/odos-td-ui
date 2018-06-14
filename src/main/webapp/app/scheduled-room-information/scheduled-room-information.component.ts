import { Component, OnInit, Inject } from '@angular/core';
import { Condition } from 'selenium-webdriver';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'jhi-scheduled-room-information',
  templateUrl: './scheduled-room-information.component.html',
  styleUrls: [
    'scheduled-room-information.scss'
  ]
})
export class ScheduledRoomInformationComponent implements OnInit {
 
  displayedColumns = ['roomScheduleStartTime', 'roomScheduleEndTime', 'conferenceTitle'];
  dataSource: any;


  constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.dataSource = data;
  }

  ngOnInit() {
  }

}
