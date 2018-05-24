import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { CRRS_API_URL } from '../app.constants';
import { BuildingInfo } from './conference-room.model';

@Injectable()
export class ConferenceRoomService {

    constructor(private http: HttpClient) { }

    getBuildingData(buildingId: Number) : Observable<BuildingInfo[]>{
        return this.http.get<BuildingInfo[]>( CRRS_API_URL + 'api/buildings/' + buildingId);
    }

}
