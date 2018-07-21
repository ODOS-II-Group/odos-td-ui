import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CRRS_API_URL } from '../app.constants';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { ConferenceRoomSchedule } from '../model/ConferenceRoomSchedule';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ReservationService {

    constructor(
        private http: HttpClient,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService
    ) { }

    postReservationData(data: {}) {
        return this.http.post(CRRS_API_URL + 'api/conference-room-schedule', data,
            {
                headers: new HttpHeaders(
                    {
                        'Authorization': 'Bearer ' + this.getToken(),
                        'Content-Type': 'application/json'
                    })
            });
    };

    getRoomReservationById(param: Number) : Observable<ConferenceRoomSchedule[]> {
        return this.http.get<ConferenceRoomSchedule[]>(CRRS_API_URL + 'api/conference-room-schedule-info/' + param, {
            headers: new HttpHeaders(
                {
                    'Authorization': 'Bearer ' + this.getToken(),
                    'Content-Type': 'application/json'
                })
        });
    };
    
  	getConferenceRoomById(id){
    	return this.http.get(CRRS_API_URL + 'api/conferenceroom/' + id);
  	}
  
    getToken() {
        return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }
    getResrvedSlotsByDate(date:string, conferenceRoomId:String) : Observable<ConferenceRoomSchedule[]> {
        return this.http.get<ConferenceRoomSchedule[]>(CRRS_API_URL + 'api/conference-room-schedule-info/' +date +"/"+ conferenceRoomId, {
            headers: new HttpHeaders(
                {
                    'Authorization': 'Bearer ' + this.getToken(),
                    'Content-Type': 'application/json'
                })
        });
    };
 
}
