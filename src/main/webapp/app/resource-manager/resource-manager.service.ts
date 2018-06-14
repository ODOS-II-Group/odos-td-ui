import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, SessionStorageService} from 'ngx-webstorage';

import { CRRS_API_URL } from '../app.constants';

@Injectable()
export class ResourceManagerService {

  constructor(
    private http: HttpClient,
    private $localStorage: LocalStorageService,
    private $sessionStorage: SessionStorageService) { }

  // Building API
  getAllBuildingData(){
    return this.http.get(CRRS_API_URL + 'api/buildings');
  }
  getBuildingById(id){
    return this.http.get(CRRS_API_URL + 'api/buildings/' + id);
  }
  updateBuilding(data: {}){
    return this.http.put( CRRS_API_URL + 'api/buildings', data,
        {
            headers: new HttpHeaders(
                { 'Authorization': 'Bearer ' + this.getToken(),
                           'Content-Type': 'application/json' })
        });
  };
  
  // Conference API
  getAllConferenceRoomData(){
    return this.http.get(CRRS_API_URL + 'api/conferenceroom');
  }
  getConferenceRoomById(id){
    return this.http.get(CRRS_API_URL + 'api/conferenceroom/' + id);
  }
  updateConferenceRoom(data: {}){
    return this.http.put( CRRS_API_URL + 'api/conferenceroom', data,
        {
            headers: new HttpHeaders(
                { 'Authorization': 'Bearer ' + this.getToken(),
                           'Content-Type': 'application/json' })
        });
  };
  
  // Equipment API
  getAllEquipmentData(){
    return this.http.get(CRRS_API_URL + 'api/equipment',  {
      headers: new HttpHeaders(
          { 'Authorization': 'Bearer ' + this.getToken(),
                     'Content-Type': 'application/json' })
    });
  }
  getEquipmentById(id){
    return this.http.get(CRRS_API_URL + 'api/equipment/' + id,  {
      headers: new HttpHeaders(
          { 'Authorization': 'Bearer ' + this.getToken(),
                     'Content-Type': 'application/json',
                      })
    });
  }  
  updateEquipment(data: {}){
    return this.http.put( CRRS_API_URL + 'api/equipment', data,
        {
            headers: new HttpHeaders(
                { 'Authorization': 'Bearer ' + this.getToken(),
                           'Content-Type': 'application/json' })
        });
  };
  createEquipment(data: {}){
    return this.http.post( CRRS_API_URL + 'api/equipment', data,
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
