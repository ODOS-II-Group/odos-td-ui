import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CRRS_API_URL } from '../app.constants';
import { LocalStorageService, SessionStorageService} from 'ngx-webstorage';


@Injectable()
export class ReservationService {

  constructor(
      private http: HttpClient,
      private $localStorage: LocalStorageService,
      private $sessionStorage: SessionStorageService
    ) { }

    postReservationData(data: {}){
    return this.http.post( CRRS_API_URL + 'api/conference-room-schedule', data,
        {
            headers: new HttpHeaders(
                { 'Authorization': 'Bearer ' + this.getToken(),
                           'Content-Type': 'application/json' })
        });
  };

    getToken() {
        return this.$localStorage.retrieve('authenticationToken') || this.$sessionStorage.retrieve('authenticationToken');
    }

}
