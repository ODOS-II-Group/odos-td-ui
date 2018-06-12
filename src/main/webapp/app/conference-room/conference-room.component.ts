import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { JhiEventManager } from "ng-jhipster";
import {Router, ActivatedRoute, Params, Data, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';


import { Account, LoginModalService, Principal } from "../shared";
import { ConferenceRoomService } from './conference-room.service';
import {StateStorageService} from "../shared/auth/state-storage.service";
import * as moment from 'moment';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
  } from '@angular/forms';

@Component({
    selector: 'jhi-conference-room',
    templateUrl: './conference-room.component.html',
    styleUrls: [
        'conference-room.scss'
    ]

})
export class ConferenceRoomComponent implements OnInit {

    en: any;
    date10: Date;
    // date: Date;

    account: Account;
    modalRef: NgbModalRef;
    buildingInfo= {};
    selectedRoom: string;
    buildingName: string;
    
    public date = moment();
    public daysArr;
    public dateForm: FormGroup;

    public isReserved = null;

    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private route: ActivatedRoute,
        private conferenceRoomService: ConferenceRoomService,
        private router: Router,
        private fb: FormBuilder,
        private stateStorageService: StateStorageService
    ) {
        this.en = {
            firstDayOfWeek: 0,
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: 'Today',
            clear: 'Clear'
        }

        this.initDateRange();

    }

    public initDateRange() {
        return (this.dateForm = this.fb.group({
          dateFrom: [null, Validators.required],
          dateTo: [null, Validators.required]
        }));
      }

    ngOnInit() {

        this.daysArr = this.createCalendar(this.date);

        this.route.params.subscribe((params: Params) => this.getBuildigInfo(params['id']));
        this.route.snapshot.data['type'];

        this.principal.identity().then((account) => {
            this.account = account;
        });

        this.registerAuthenticationSuccess();
    }

    todayCheck(day){
        if(!day){
            return false;
        }
        return moment().format('L') === day.format('L');
    }
    public nextMonth(){
        this.date.add(1, 'M');
        this.daysArr = this.createCalendar(this.date);
    }

    public previousMonth(){
        this.date.subtract(1, 'M');
        this.daysArr = this.createCalendar(this.date);
    }
    
    public reserve() {
        if (!this.dateForm.valid) {
          return;
        }
        let dateFromMoment = this.dateForm.value.dateFrom;
        let dateToMoment = this.dateForm.value.dateTo;
        this.isReserved = `Reserved from ${dateFromMoment} to ${dateToMoment}`;
    }
    
    public isbeforeToday(day){
        return day < moment().startOf('day');
    }
    public isweekend(day){
        console.log("Number ",moment().format('dddd'));
        // return moment().format('Sun') ;
     }

    public isSelected(day) {
        if (!day || this.isbeforeToday(day)) {
          return false;
        }
        let dateFromMoment = moment(this.dateForm.value.dateFrom, 'MM/DD/YYYY');
        let dateToMoment = moment(this.dateForm.value.dateTo, 'MM/DD/YYYY');
        if (this.dateForm.valid) {
          return (
            dateFromMoment.isSameOrBefore(day) && dateToMoment.isSameOrAfter(day)
          );
        }
        if (this.dateForm.get('dateFrom').valid) {
          return dateFromMoment.isSame(day);
        }
    }
    
    public selectedDate(day) {
        let dayFormatted = day.format('MM/DD/YYYY');
        if (this.dateForm.valid) {
          this.dateForm.setValue({ dateFrom: null, dateTo: null });
          return;
        }

        if(!this.isbeforeToday(day)){
            if (!this.dateForm.get('dateFrom').value) {
              this.dateForm.get('dateFrom').patchValue(dayFormatted);
            } else {
              this.dateForm.get('dateTo').patchValue(dayFormatted);
            }
        }
    }

    createCalendar(month){
        let firstDay = moment(month).startOf('M');
        let days = Array.apply(null,{length:month.daysInMonth()})
        .map(Number.call,Number)
        .map(n => {
            return moment(firstDay).add(n, 'd');
          });

        for (let n = 0; n < firstDay.weekday(); n++){
            days.unshift(null);
        }
        console.log("List of Days ", days);
        return days;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> {

        const authorities = route.data['authorities'];
        // We need to call the checkLogin / and so the principal.identity() function, to ensure,
        // that the client has a principal too, if they already logged in by the server.
        // This could happen on a page refresh.
        return this.checkLogin(authorities, state.url);
    }

    checkLogin(authorities: string[], url: string): Promise<boolean> {
        const principal = this.principal;
        return Promise.resolve(principal.identity().then((account) => {

            if (!authorities || authorities.length === 0) {
                return true;
            }

            if (account) {
                return principal.hasAnyAuthority(authorities).then((response) => {
                    if (response) {
                        return true;
                    }
                    return false;
                });
            }

            this.stateStorageService.storeUrl(url);
            this.router.navigate(['accessdenied']).then(() => {
                // only show the login dialog, if the user hasn't logged in yet
                if (!account) {
                    this.loginModalService.open();
                }
            });
            return false;
        }));
    }
    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    getBuildigInfo(buildingNumber: Number){

        this.conferenceRoomService.getBuildingData(buildingNumber).subscribe(
            (response) => {
                this.buildingInfo = response;
                this.selectedRoom = this.buildingInfo['conferenceRooms'][0];
            },
            (error) => {
                console.log(error);
            }
        )
    }

}
