import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CRRS_API_URL } from '../app.constants';
import { BuildingInfo } from './conference-room.model';

@Injectable()
export class ConferenceRoomService {

    
    constructor(private http: HttpClient) { }

    public DateSubject = new BehaviorSubject<any>("");
    cast = this.DateSubject.asObservable();

    getBuildingData(buildingId: Number) : Observable<BuildingInfo[]>{
        return this.http.get<BuildingInfo[]>( CRRS_API_URL + 'api/buildings/' + buildingId);
    }

    addDate(newDate){
        this.DateSubject.next(newDate);
    }

}
