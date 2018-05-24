import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router}  from '@angular/router';
import { FormGroup, Validators, FormControl  } from '@angular/forms';
import { ReservationService } from './reservation.service';
import { HttpErrorResponse } from '@angular/common/http';

import { LOGIN_ALREADY_USED_TYPE, EMAIL_ALREADY_USED_TYPE } from '../shared/constants/error.constants';

  @Component({
    selector: 'jhi-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: [
        'reservation.scss'
    ]
  })
  export class ReservationComponent implements OnInit {
    reservationDetailForm:FormGroup;
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    conferenceTitle: FormControl;
    conferenceDescription: FormControl;

    roomName: string;
    success: boolean;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;

    reservationTimeForm:FormGroup;
    startDate: FormControl;
    startTime: FormControl;
    endTime: FormControl;

    isReservationDetailForm: boolean = true;
    isReservationTimeForm: boolean = false;
    isReservationCompleteForm: boolean = false;

    reservation_info = {
          'requestorId':'',
          'roomScheduleStartTime':'',
          'roomScheduleEndTime':'',
          'conferenceTitle':'',
          'conferenceRoomId': ''
    };

    date; string;
    registrationError : boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private reservationService: ReservationService,
    ) { }

    ngOnInit() {

      this.route.params.subscribe((params: Params) => {
        this.roomName = params['roomName'];
      });

      this.reservationDetailForm = new FormGroup({
          firstName: new FormControl('', Validators.required),
          lastName: new FormControl('', Validators.required),
          email: new FormControl('', [Validators.email, Validators.required]),
          conferenceTitle: new FormControl('', Validators.required),
          conferenceDescription: new FormControl('')
      });

      this.reservationTimeForm = new FormGroup({
          startDate: new FormControl('',Validators.required),
          startTime: new FormControl('', Validators.required),
          endTime: new FormControl('', Validators.required)
      });

      this.registrationError = false;
    }

    saveReservationDetails(){
      this.reservation_info.requestorId = this.reservationDetailForm.get('email').value;
      this.reservation_info.conferenceTitle = this.reservationDetailForm.get('conferenceTitle').value;
      this.reservation_info.conferenceRoomId = this.roomName;

      this.isReservationDetailForm = false;
      this.isReservationTimeForm = true;
    }

    saveReservationTime(){
        this.date = this.reservationTimeForm.get('startDate').value;

      this.reservation_info.roomScheduleStartTime = this.date + " " + this.reservationTimeForm.get('startTime').value;
      this.reservation_info.roomScheduleEndTime = this.date + " " +  this.reservationTimeForm.get('endTime').value;
      this.reservationService.postReservationData(this.reservation_info)
      .subscribe((response)=>{
          this.isReservationCompleteForm = true;
          this.isReservationTimeForm = false;
          this.registrationError = false;
          setTimeout((router: Router) => {
              this.router.navigate(['']);
          }, 5000);
      }, (error)=> {
                console.log(this.error);
                this.processError(error);
          this.isReservationCompleteForm = false;
          this.registrationError = true;
          setTimeout((router: Router) => {
              this.router.navigate(['']);
          }, 2000);
      } );
    }

    private processError(response: HttpErrorResponse) {
      this.success = null;
      if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
          this.errorUserExists = 'ERROR';
      } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
          this.errorEmailExists = 'ERROR';
      } else {
          this.error = 'ERROR';
      }
    }
    goBack() {
      window.history.back();
    }

}
