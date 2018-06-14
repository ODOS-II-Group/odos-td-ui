import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CRRS_API_URL } from '../app.constants';
import { Observable } from "rxjs/Observable";
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
@Injectable()
export class ReportService {

    constructor(
        private http: HttpClient,
        private $localStorage: LocalStorageService,
        private $sessionStorage: SessionStorageService
    ) {

    }
    
    getSearchResult(filterBy: string) {
        return this.http.get(CRRS_API_URL + 'api/' + filterBy);
    }
    getRoomReservationCount(param: Number) {
        return this.http.get(CRRS_API_URL + 'api/conference-room-schedule-today/' + param, {
            headers: new HttpHeaders(
                {
                    'Authorization': 'Bearer ' + this.getToken(),
                    'Content-Type': 'application/json'
                })
        });
    };
    getToken() {
        return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }

}
