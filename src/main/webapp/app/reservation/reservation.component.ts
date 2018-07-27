import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ReservationService } from './reservation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { BuildingInfo, RoomInfo, EquipmentInfo } from '../conference-room';

import { LOGIN_ALREADY_USED_TYPE, EMAIL_ALREADY_USED_TYPE } from '../shared/constants/error.constants';
import {start} from "repl";

@Component({
    selector: 'jhi-reservation',
    templateUrl: './reservation.component.html',
    styleUrls: [
        'reservation.scss'
    ]
})
export class ReservationComponent implements OnInit {
    reservationDetailForm: FormGroup;
    firstName: FormControl;
    lastName: FormControl;
    email: FormControl;
    conferenceTitle: FormControl;
    conferenceDescription: FormControl;


    success: boolean;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    reservedTimeSlots: any;

    reservationTimeForm: FormGroup;
    startDate: FormControl;
    startTimeHr: FormControl;
    startTimeMin: FormControl;
    endTimeHr: FormControl;
    endTimeMin: FormControl;
    endTime: FormControl;
    numberOfPeople: FormControl;

    isReservationDetailForm: boolean = true;
    isReservationTimeForm: boolean = false;
    isReservationCompleteForm: boolean = false;

    reservation_info = {
        'requestorId': '',
        'roomScheduleStartTimeHr': '',
        'roomScheduleStartTimeMin': '',
        'roomScheduleEndTimeHr': '',
        'roomScheduleEndTimeMin': '',
        'conferenceTitle': '',
        'conferenceRoomId': '' ,
        'firstName': '',
        'lastName': '',
        'conferenceDescription': '',
        'numberOfPeople':''
    };

	room_info = {
		'buildingName' : '',
        'roomName': '',
        'equipments': []
    };
   

    date; string;
    registrationError: boolean = false;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private reservationService: ReservationService,
        private modalService: NgbModal
    ) { }
    numberOfpeopleSelect =['select',5,10,15,20,25,30,35,40,45,50];

    ngOnInit() {

        this.route.params.subscribe((params: Params) => {
            this.reservation_info.conferenceRoomId = params['roomName'];
            this.getConferenceRoomInfo();
        });

        this.reservationDetailForm = new FormGroup({
            firstName: new FormControl('', Validators.required),
            lastName: new FormControl('', Validators.required),
            email: new FormControl('', [Validators.email, Validators.required]),
            conferenceTitle: new FormControl('', Validators.required),
            conferenceDescription: new FormControl('', Validators.required)
        });

        this.reservationTimeForm = new FormGroup({
            startDate: new FormControl('', Validators.required),
            startTimeHr: new FormControl('', Validators.required),
            startTimeMin: new FormControl('', Validators.required),
            endTimeHr: new FormControl('', Validators.required),
            endTimeMin: new FormControl('', Validators.required),
            numberOfPeople: new FormControl('', Validators.required)
        });

        this.registrationError = false;

        this.isReservationCompleteForm = false;

    }
    isRoomAvailable(){
        console.log("date event ++ ", this.startDate);
        console.log("Number of people ", this.reservationTimeForm.controls.numberOfPeople.value);
          let requestBody={
            "conferenceRoomId": this.reservation_info.conferenceRoomId,
            "roomScheduleStartTime": this.reservationTimeForm.controls.startDate.value + " " + this.reservationTimeForm.controls.startTimeHr.value + ":" + this.reservationTimeForm.controls.startTimeMin.value
        }
        this.reservationService.checkRoomAvailablity(requestBody).subscribe(
            (response) => {
                this.reservedTimeSlots = response
            },
            (error) => {
                console.log(error);
            }
        )
    }
    getResrvedSlotsByDate(date: string, conferenceRoomId: string){
        this.reservationService.getResrvedSlotsByDate(date, conferenceRoomId).subscribe(
            (response) => {
                this.reservedTimeSlots = response
            },
            (error) => {
                console.log(error);
            }
        )
    }

    getConferenceRoomInfo(){
        this.reservationService.getConferenceRoomById(this.reservation_info.conferenceRoomId).subscribe(
            (response) => {
               const roomInfo = <RoomInfo>response;
               this.room_info.buildingName = roomInfo.buildingName;
               this.room_info.roomName = roomInfo.roomName;
               this.room_info.equipments = roomInfo.equipments;
            },
            (error) => {
                console.log(error);
            }
        )
    }

    saveReservationDetails() {
        this.reservation_info.requestorId = this.reservationDetailForm.get('email').value;
        this.reservation_info.conferenceTitle = this.reservationDetailForm.get('conferenceTitle').value;
        this.reservation_info.firstName = this.reservationDetailForm.get('firstName').value;
        this.reservation_info.lastName = this.reservationDetailForm.get('lastName').value;
        this.reservation_info.conferenceDescription = this.reservationDetailForm.get('conferenceDescription').value;
        this.isReservationDetailForm = false;
        this.isReservationTimeForm = true;
    }

    saveReservationTime(){
      const startHour = parseInt(this.reservationTimeForm.get('startTimeHr').value);
      const startMinute = parseInt(this.reservationTimeForm.get('startTimeMin').value);
      const endHour = parseInt(this.reservationTimeForm.get('endTimeHr').value);
      const endMinute = parseInt(this.reservationTimeForm.get('endTimeMin').value);
      const numberOfPeople = parseInt(this.reservationTimeForm.get('numberOfPeople').value);

      console.log("Number of people selected ", numberOfPeople);

      const diff = (endHour - startHour) * 60 + (endMinute - startMinute);

      if (diff > 180) {
            this.error = 'Reservation time cannot exceed 3 hours';
            console.log(this.error);
            this.isReservationCompleteForm = false;
            this.registrationError = true;
      } else if (!this.scheduleConflict(this.reservation_info.conferenceRoomId)){
            document.getElementById("modalOpener").click();
            this.error = 'Time Conflict with your current reservation';
            console.log(this.error);
            this.isReservationCompleteForm = false;
            this.registrationError = true;


      } else {
	      this.date = this.reservationTimeForm.get('startDate').value;

            this.reservation_info.roomScheduleStartTimeHr = this.date + " " + this.reservationTimeForm.get('startTimeHr').value;
            this.reservation_info.roomScheduleStartTimeMin = this.date + " " + this.reservationTimeForm.get('startTimeMin').value;
            this.reservation_info.roomScheduleEndTimeHr = this.date + " " +  this.reservationTimeForm.get('endTimeHr').value;
            this.reservation_info.roomScheduleEndTimeMin = this.date + " " +  this.reservationTimeForm.get('endTimeMin').value;
            this.reservationService.postReservationData(this.reservation_info)
	      .subscribe((response)=>{
	          this.isReservationCompleteForm = true;
	          this.isReservationTimeForm = false;
	          this.registrationError = false;
	          setTimeout((router: Router) => {
	              this.router.navigate(['']);
	          }, 25000);
	      }, (error)=> {
	                console.log(this.error);
	                this.processError(error);
	          this.isReservationCompleteForm = false;
	          this.registrationError = true;
	          /*setTimeout((router: Router) => {
	              this.router.navigate(['']);
	          }, 2000);*/
	      } );
      }
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

    // isRoomAvailable(room: number){
    //     if (room in this.reservedTimeSlots){
    //         return 'red';
    //         // return {'background-color': 'red'}
    //     }
    //     return 'blue';
    //     // return { 'background-color': '#3a6e96'}
    // }

    goBack() {
        window.history.back();
    }

    private scheduleConflict(conferenceRoomId) {
        console.log("reservation completed? ", this.isReservationCompleteForm);
        this.reservationService.getRoomReservationById(conferenceRoomId)
            .subscribe(
                (response) => {

                    const startTime = this.date + "T" + this.reservationTimeForm.get("startTime").value;
                    const endTime = this.date + "T" + this.reservationTimeForm.get("endTime").value;

                    return this.checkConflict(response, startTime, endTime);
                },
            (error) =>{
                    console.log(error);
            }
        )}


        private checkConflict(allSchedules, currentStartTime, currentEndTime){
            for (const sch of allSchedules){
                const reservationStartTime = sch["roomScheduleStartTime"];
                const reservationEndTime = sch["roomScheduleEndTime"];

                if ((reservationStartTime <= currentStartTime) && (reservationEndTime > currentStartTime)){
                    // this.isReservationCompleteForm = false;
                    return true;
                }
                if ((reservationStartTime < currentEndTime) && (reservationEndTime >= currentEndTime)){
                    // this.isReservationCompleteForm = false;
                    return true;
                }
            }
            // this.isReservationCompleteForm = true;
            return false
        }

    openVerticallyCentered(content) {
        this.modalService.open(content);
    }

}
